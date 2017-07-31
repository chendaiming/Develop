	
define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var db = require('frm/hz.db');
	var user =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var modelUtil = require('frm/model');	
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var select = require('frm/select');
	var bootstrap = require('bootstrap');
	var datepicker = require('frm/datepicker');
	
	var treeContainer;
	var delCameraIds = [];
    model=new tpl({
		el:'#form',
		data:{
			behavior:[],
			deptId:user.deptId,
			userId:user.userId,
			nodeId:'',
			cusNumber:user.cusNumber
		},
		methods:{
			addPrisonerBehavior:function(){
				addPB();
			},
			reset:function(){
				this.behavior = [];
			},
			copyAndAddBehavior:function(){
				var me =this;
				this.behavior.push({
					start_time:'',
					end_time:'',
					area_id:'',
					area_name:'',
					remark:'',
					cusNumber:user.cusNumber,
					id:'',
					user_id:user.userId,
					prsnr_id:'',
					camera_ids:''
				});
			},
			delBehavior:function(b){
				var me =this;
				delCameraIds.push(b.id);
				me.behavior.$remove(b);
			}
		}
	});
	//左侧罪犯信息树形结构
	db.query({
		request:{
			sqlId:'select_prison_area_info_tree',
			whereId:'0',
			orderId:'0',
			params:[user.cusNumber]
		},
		success:function(data){
			//树形设置
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(e,id,node){
							if(!node.isParent){
								$('#addBtn').show();
								nodeId = node.id;
								getBehaviorbyid(node.id);
								treeContainer.checkNode(node,true,true);
							}
						}
					}
			}
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			treeContainer.expandAll(true); 
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}	
	});
	
	
  /**
   * 加载罪犯行为轨迹
   */
  function getBehaviorbyid(id){
	  db.query({
			request:{
				sqlId:'select_prisoner_behavior_ctrl_byid',
				whereId:'0',
				orderId:'0',
				params:[user.cusNumber,id]
			},
			success:function(data){
				model.behavior = [];
				if(data && data.length == 0) return;
				for(var i = 0; i < data.length; i++){
					data[i].camera_ids = '';
					//加载摄像机
					getCameraByid(data[i],data[i].id);
				}
				model.behavior = data;
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  
  /**
   * 加载关联摄像机
   */
  function getCameraByid(data,id){
	  db.query({
			request:{
				sqlId:'select_prisoner_rltn_camera_byid',
				whereId:'0',
				params:{
					cusNumber:user.cusNumber,
					pbr_ctrl_id:id
				}
			},
			async:false,
			success:function(d){
				var cameraIds = [];
				if(d && d.length > 0){
					for(var i = 0; i < d.length; i++){
						cameraIds.push(d[i].pbr_prsnr_id);
					}
				}
				data.camera_ids = cameraIds;
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  /**
   * 添加前的校验
   */
  function addPB(){
	//获取所有已勾选的罪犯
		var selectedNodes = treeContainer.getSelectedNodes();
		if(selectedNodes.length == 0) {
			tip.alert("请在左侧选择监区");
			return;
		}
		checkValue() && add(selectedNodes[0]);
  }
  /**
   * 添加到数据库
   */
  function add(node){
		var requstList = new Array();
		//先删除
		requstList.push({
			sqlId:'delete_prisoner_behavior_ctrl_byid',
			whereId:'0',
			params:{'cusNumber':user.cusNumber,'id':node.id}
		});
		
		for(var i = 0; i < model.behavior.length; i++){
			//添加行为管控信息
			requstList.push({
				sqlId:'insert_prisoner_behavior_ctrl',
				params:{
					start_time:model.behavior[i].start_time,
					end_time:model.behavior[i].end_time,
					area_id:model.behavior[i].area_id,
					area_name:model.behavior[i].area_name,
					remark:model.behavior[i].remark,
					cusNumber:user.cusNumber,
					id:'',
					user_id:user.userId,
					deptId:node.id
				}
			});
		}
		
		//新增行为轨迹
		db.updateByParamKey({
			request:requstList,
			success:function(data){
				//删除第一条执行删除的sql返回
				data.data.splice(0,1);
				addCamera(data);
				for(var i = 0; i < data.data.length; i++){
					var seq = data.data[i].seqList[0];
					model.behavior[i].id = seq;
				}
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  
  //添加摄像机
  function addCamera(data){
	  var relationReqList = new Array();
	  var delIds = [];
	  for(var i = 0; i < model.behavior.length; i++){
		 delIds.push(model.behavior[i].id);
	  }
	  //删除摄像机
	  deleteCamera(delIds);
	  //点击按钮删除的摄像机
	  if(delCameraIds && delCameraIds.length > 0){
		  deleteCamera(delCameraIds);
	  }
	  for(var i = 0; i < data.data.length; i++){
			var seq = data.data[i].seqList[0];
			//添加行为管控关联摄像机信息
			var list = model.behavior[i].camera_ids;
			for(var j = 0; j < list.length; j++){
				relationReqList.push({
					sqlId:'insert_prisoner_behavior_rltn',
					params:{
						pbr_cus_number:user.cusNumber,
						pbr_ctrl_id:seq,
						pbr_prsnr_id:list[j],
						pbr_remark:model.behavior[i].remark,
						pbr_crte_user_id:user.userId,
						pbr_updt_user_id:user.userId
					}
				})
			}
		}
		//新增行为轨迹关联摄像机
		db.updateByParamKey({
			request:relationReqList,
			success:function(data){
				tip.alert("添加成功");
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  
  //删除摄像机
  function deleteCamera(ids) {
	if (ids) {
		var list = new Array();
		for (var i = 0; i < ids.length; i++) {
			list.push({
				sqlId : 'delete_prisoner_behavior_rltn_byid',
				whereId : '0',
				params : {
					'cusNumber' : user.cusNumber,
					'pbr_ctrl_id' : ids[i]
				}
			});
		}
		db.updateByParamKey({
			request : list,
			async:false,
			success : function(data) {
				return true;
			},
			error : function(errorCode, errorMsg) {
				tip.alert(errorCode + ":" + errorMsg);
				return false;
			}
		});
	}
	return false;

}
  
	  /**
	   * 校验
	   */
	  function checkValue() {
		var valueArray = model.behavior;
		if (!valueArray || valueArray.length == 0) {
			tip.alert('请至少添加一条行为轨迹');
			return false;
		}

		for (var i = 0; i < valueArray.length; i++) {
			var start_time = valueArray[i].start_time;
			var end_time = valueArray[i].end_time;
			var area_id = valueArray[i].area_id;
			var camera_ids = valueArray[i].camera_ids;

			if (start_time && end_time) {
				if (end_time < start_time) {
					tip.alert('结束时间必须大于开始时间(第' + (i + 1) + '行)');
					return false;
				} else if (end_time == start_time) {
					tip.alert('开始时间和结束时间不应相同(第' + (i + 1) + '行)');
					return false;
				}
			}

			if (!start_time) {
				tip.alert('请填写开始时间(第' + (i + 1) + '行)');
				return false;
			}

			if (!end_time) {
				tip.alert('请填写结束时间(第' + (i + 1) + '行)');
				return false;
			}

			if (!area_id) {
				tip.alert('请选择地点(第' + (i + 1) + '行)');
				return false;
			}
			if (!camera_ids || camera_ids.length <= 0) {
				tip.alert('请选择摄像机(第' + (i + 1) + '行)');
				return false;
			}

			for (var j = 0; j < valueArray.length; j++) {
				if (j < valueArray.length - 1) {
					var stime = valueArray[j + 1].start_time;
					var etime = valueArray[j + 1].end_time;
					if (isOverlap(start_time, end_time, stime, etime)) {
						tip.alert('时间有冲突(第' + (i + 1) + '行)');
						return false;
					}
				}
			}
		}
		return true;
	}
  
  //检查时间段是否重叠
  function isOverlap(s1,e1,s2,e2){
	  var overlap = false;
	  if(getTime(s2) > getTime(s1) &&  getTime(s2) <  getTime(e1)){
		  overlap = true;
	  }else if(getTime(s2) < getTime(s1) &&  getTime(e2) >  getTime(s1)){
		  overlap = true;
	  }
	  return overlap;
  }
  
  //获取时间
  function getTime(time){
	  var date = new Date();
	  var datetime = date.getFullYear() + '-'+ (date.getMonth()+1) + '-' + date.getDate() + ' ' + time;
	  return new Date(datetime).getTime();
  }
  
});
