define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var modelUtil = require('frm/model');	
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var select = require('frm/select');
	var bootstrap = require('bootstrap');
	var validate = require('frm/validate');
	var video = require('frm/hz.videoclient');
	  
	var treeContainer;
        model=new tpl({
			el:'#form',
			data:{
				police:{},//警员信息
				records:[]//刷卡记录
			},
			methods:{
				openCamera:function(){		//打开最近一次刷卡记录关联的摄像机
					if(!model.records || model.records.length <= 0){
						tip.alert('暂无刷卡记录，打开摄像机失败'); 
						return;
					}
					var record = model.records[0];
					//获取门禁编号
					var doorId = record.scr_door_id;
					//doorId = 1;
					//获取摄像机id
					db.query({
						request:{
							sqlId:'query_link_device_by_device',
							whereId:'0',
							params:{
								cusNumber:login.cusNumber,
								id:doorId,	//主表设备id
								mainType:2,	//主表设备类型
								dtlsType:1	//从表设备类型
							}
						},
						success:function(data){
							if(!data || data.length <= 0){
								tip.alert("数据查询有误，打开摄像机失败");
								return;
							}
							//打开摄像机
							video.play(data[0].dld_dvc_id);
						},
						error:function(errorCode, errorMsg){
							tip.alert(errorCode + ":" + errorMsg);
						}
					});
				}
			}
	});
	//左侧警员信息树形结构
	db.query({
		request:{
			sqlId:'select_police_info_tree',
			whereId:'0',
			orderId:'0',
			params:[login.cusNumber,login.cusNumber]
		},
		success:function(data){
			//树形设置
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onDblClick:function(e,id,node){
							if(!node.type) return;
							if(node.type==1){
								//清空机构编号,用户名以外的信息
								 $('#achievement').hide();
								//根据用户编号异步异步加载用户信息
								getPoliceInfoByid(node.id);
								//根据警号查询警员进出记录
								getPoliceInoutByOtherid(node.policeid);
								//根据警员编号查询刷卡信息
								 getPoliceDoorcardByid(node.policeid,1);
								//加载成就
								getAchievement(node.id);
							}
						}
					}
			}
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}
	});
  /**
   * 根据警员编号查询详细信息
   */
  function getPoliceInfoByid(id){
	  model.police = [];
	  db.query({
			request:{
				sqlId:'select_police_base_dtls',
				whereId:'0',
				params:[login.cusNumber,id]
			},
			success:function(data){
				model.police = data[0];
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }

	/**
	 * 根据警员编号查询进出监记录
	 * @param id
     */
  function getPoliceInoutByOtherid(id){
		var inoutDiv = $('#inoutinfo');
		inoutDiv.empty();
		db.query({
			request:{
				sqlId:'select_police_inout_byid',
				whereId:'0',
				params:[login.cusNumber,id]
			},
			success:function(data){
				if(!data) return;
				var time,inoutFlag;
				for(var i=0;i<data.length;i++){
					 time = data[i].pir_bsns_time;
					inoutFlag = data[i].pir_inout_flag;
					var inouInfo;
					if(inoutFlag == '进'){
						inouInfo= $('<div><span class="label label-success">'+time+'('+inoutFlag+')'+
							'</span></div>');
					}else{
						inouInfo= $('<div><span class="label label-info">'+time+'('+inoutFlag+')'+
							'</span></div>');
					}

					inoutDiv.append(inouInfo);
				}
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }

	/**
	 * 根据警员编号加载门禁刷卡信息
	 * @param id
     */
   function getPoliceDoorcardByid(id,pageindex){
		var count;
		// 时间轴数据
		db.query({
			request : {
				sqlId : 'select_police_doorcard_byid',
				whereId : '0',
				params : [ login.cusNumber, id ]
			},
			success : function(data) {
				model.records = [];
				count = data.count;
				model.records = model.records.concat(data);
			},
			error : function(errorCode, errorMsg) {
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
   }

	/**
	 * 加载成就系统
	 * @param policeid
     */
	function getAchievement(id){
		var achievementDiv = $('#achievement');
		achievementDiv.empty();
		achievementDiv.hide();
		db.query({
			request:{
				sqlId:'select_police_achievement_byid',
				whereId:'0',
				params:[login.cusNumber,id]
			},
			success:function(data){
				if(!data[0]) return;
				var _achievement,achievement,img;
				     _achievement = data[0].epi_specialty;
				if(_achievement.indexOf(',')!=-1){
					achievement = _achievement.split(',');
					for(var i=0;i<achievement.length;i++){
						img = $('<img src="image/'+achievement[i]+'.jpg" title="'+achievement[i]+'">');
						achievementDiv.append(img);
					}
				}else{
					achievement = _achievement;
					img = $('<img src="image/'+achievement[i]+'.jpg" title="'+achievement[i]+'">');
					achievementDiv.append(img);
				}
				achievementDiv.show();
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
	}
//	$(function () {
////		//默认显示联系方式面板
////		$('#collapseContact').collapse('show');
////		//显示联系方式面板时触发,隐藏进出记录面板
////		$('#collapseContact').on('show.bs.collapse', function () {
////			$('#collapseInout').collapse('hide');
////		})
////		//默认隐藏进出记录面板
////		$('#collapseInout').collapse('hide');
////		//显示进出记录面板时触发,隐藏联系方式面板并加载进出监信息和
////		$('#collapseInout').on('show.bs.collapse', function () {
////			$('#collapseContact').collapse('hide');
////		})
//	});
});