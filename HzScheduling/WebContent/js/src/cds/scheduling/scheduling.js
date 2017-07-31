define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var userSetting = require('userSetting');
	var select = require('frm/select');
	
	var container=$("#listcontainer");
	var treeContainer;
	var flag = false; //标识是否通话中
	var task = null; //获取状态的定时任务
	model=new tpl({
		el:'body',
		data:{
			sphone:'',//呼叫列表 多个号码以","隔开,注意:最后一个号码也必须跟",",否则最后一个号码呼叫不了
			msg:'',//短信内容
			sheetNum:'',//内线分机号 //801
			sheetList:getSheetList(),
			sendNum:'',//来电显示号码(主叫)
			ctrlSheetNum:'',
			info:{
				
			},
			police:[],
			blackList:[],
			blackInfo:{
				'sPhone':''
			},
			status:{
				code:'200',
				msg:'空闲'
			},
			userName:login.userName,
			userSettingInfo:{
				sus_cus_number:login.cusNumber,
				sus_record_id:'',
				sus_type:2,//调度机关联(坐席号)
				sus_value:'',
				sus_user_id:login.userId,
				userId:login.userId			
			},
		},
		methods:{
			ctrl:function(otype){
				if(!check(otype)) return;
				schedulingCtrl(otype);
			},
			call:function(){
				if(!check()) return;
				schedulingCtrl('call',	function(){
					task =  setInterval(getSheetStatus,1000);
				});
				dialog.open({targetId:'call_dialog',title:'呼叫',h:"185px",w:"300px",closeCallback:function(){
					//关闭窗口时,状态不为空闲中自动挂断
					if(model.status.code != '200') {
						schedulingCtrl('clearCall');
					}
					//停止正在执行的定时任务
					if(task !=null) {
						clearTimeout(task);
						task = null;
					}
				}});
			},
			call_qun:function(){
				if(!check()) return;
				schedulingCtrl('calloutQun',function(){
					task =  setInterval(getSheetStatus,1000);
				});
				dialog.open({targetId:'call_dialog',title:'电话会议',h:"185px",w:"300px",closeCallback:function(){
					//关闭窗口时,状态不为空闲中自动挂断
					if(model.status.code != '200') {
						schedulingCtrl('clearCall');
					}
					//停止正在执行的定时任务
					if(task !=null) {
						clearTimeout(task);
						task = null;
					}
				}});
			},			
			/**
			 * 获取黑名单信息
			 */
			blackListCtrl:function(){
				_blackListCtrl("",3);
				dialog.open({targetId:'blackList',title:'黑名单'});
			},
			addBlackList:function(){
				_blackListCtrl(model.blackInfo.sPhone,1);
			},
			deleteBlackList:function(phone){
				_blackListCtrl(phone,2);
			},
			showMsgDialog:function(){
				dialog.open({targetId:'msg_dialog',title:'发送短信',h:"235px"});
			},
			closeDialog:function(){
				dialog.close();
			},
			showSheetList:function(){
				dialog.open({targetId:'relation_dialog',title:'选择坐席',h:"210px",w:"500px",top:"30%"});
			},
			saveRelation:function(){
				if(this.userSettingInfo.sus_record_id){
					userSetting.updateSetting(this.userSettingInfo,function(data){
						console.log('更新调度机关联坐席号成功');
					});
				}else{
					userSetting.addSetting(this.userSettingInfo,function(data){
						console.log('添加调度机关联坐席号成功');
						model.userSettingInfo.sus_record_id = data.data[0]['seqList'][0];
					});
				}
				model.sheetNum = model.userSettingInfo.sus_value;
				dialog.close();
			},
			showCtrlDialog:function(){
				dialog.open({targetId:'lis_into_dialog',title:'通话控制',h:"210px",w:"500px",top:"30%"});
			}
		}
	});
	//警员通讯录树
	//左侧警员信息树形结构
	db.query({
		request:{
			sqlId:'select_police_info_tree_schedu',
			whereId:'0',
			orderId:'0',
			params:[login.cusNumber,login.cusNumber]
		},
		success:function(data){
			loadUserPhone(data);
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}
	});
	/**
	 * 加载通讯录
	 */
	function loadUserPhone(treeData){
		var url = "iccPhoneCtrl/userPhone";
		var args = {'groupId':'1','sPhone':''};
		//成功回调
		function success(data){
			if(!data.success){
				tip.alert('获取通讯录失败');
				initTree(treeData);
				return;
			}
			treeData.push({
				icon:'org.png',
				id:'1',
				name:"通讯录",
				pid:login.cusNumber,
				type:2	
			});
			//追加综合调度平台通讯录数据
			treeData = treeData.concat(data.data);
			initTree(treeData);
		}
		/*
		 * 请求响应失败处理
		 */
		function error () {
			tip.alert('请求失败，服务器响应超时~!');
		};
		utils.ajax(url,args,success,error,true);
	}
	
	function initTree(treeData){
		var setting={
				path:'../../../libs/ztree/css/zTreeStyle/img/',
				edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
				view: {dblClickExpand: false},
				data: {simpleData: {enable: true,pIdKey: "pid"}},
				callback:{
					onDblClick:function(e,id,node){
						if(!node.type) return;
						if(node.type == 2){
							var result = new Array();
							model.police = getChildNodes(node,result);
						}else if(node.type==1){
							model.police= list=treeContainer.transformToArray(node).filter(function(item){
								if(item.type==1)return true;
							});
						}
						model.selectList = '';
					}
				}
		}
		treeContainer=$.fn.zTree.init($("#tree"), setting,treeData);
		$("#input").keyup(function(){
			util.searchTree("name",this.value,"tree",treeData,setting);
		});
	}
	/**
	 * 后台通信
	 * @param otype 操作类型
	 * @param success 操作成功时的回调方法
	 */
	function schedulingCtrl (otype,success) {
		var args = {};
		switch(otype){
		case 'calloutQun':
		case 'call': //呼叫
			args = {
				'otype':otype,
				'sphone':model.sphone,
				'sheetNum':model.sheetNum,
				'sendNum':model.sendNum
			};
			break;
		case 'clearCall'://挂断
			args = {
				'otype':otype,
				'sheetNum':model.sheetNum
			};		
			break;
		case 'cleanUp':
			args = {
				'otype':'clearCall',
				'sheetNum':model.ctrlSheetNum
			};		
			break;
		case 'message'://短信
			args = {
				'otype':otype,
				'msg':model.msg,
				'sphone':model.sphone
			};		
			dialog.close();
			break;
		case 'sheetStatus'://坐席状态
			args = {
				'otype':otype,
				'sheetNum':model.sheetNum
			};				
			break;
		case 'lis':
		case 'into':	
			args = {
				'otype':otype,
				'curSheetNum':model.sheetNum,
				'ctrlSheetNum':model.ctrlSheetNum
			};
			break;
		}
		
		var reqs = function(msg){
			console.log(msg);
			tip.alert(msg);
		}
		
		if(success){
			reqs = success;
		}
		
		utils.ajax('iccPhoneCtrl/excute', {'args':JSON.stringify(args)},reqs,function(json){
			tip.alert('error:'+msg);
		});
	}
	/**
	 * 黑名单操作
	 * action 1添加 2删除 3查询
	 */
	function _blackListCtrl(sPhone,action){
		var url = "iccPhoneCtrl/blackList";
		var args = {'sPhone':sPhone,'nAction':action};
		//成功回调
		function success(json){
			if(!json.success){
				tip.alert(json.msg);
				return;
			}
			
			switch(action){
			case 1:
			case 2:
				tip.alert(json.msg);
				_blackListCtrl('', 3);
				break;
			case 3:
				model.blackList = json.data;
				break;
			}
		}
		/*
		 * 请求响应失败处理
		 */
		function error () {
			tip.alert('请求失败，服务器响应超时~!');
		};
		utils.ajax(url,args,success,error,true);
	}
	
	function check(otype){
		if(model.sheetNum ==''){
			tip.alert('没有选择坐席!');
			return false;
		}
		
		if(otype && (otype =='lis' || otype =='into' || otype == 'cleanUp')){
			if(model.ctrlSheetNum == ''){
				tip.alert('请选择要控制的坐席!');
				return false;
			}
			return true;
		}
		
		if(model.sphone == ''){
			tip.alert('所选人员没有联系方式数据或未选择人员!');
			return false;
		}
		return true;
	}
	/**
	 * 获取所有子节点
	 */
	function getChildNodes(treeNode,result){
	      if (treeNode.isParent) {
	        var childrenNodes = treeNode.children;
	        if (childrenNodes) {
	            for (var i = 0; i < childrenNodes.length; i++) {
	            	if(childrenNodes[i].type == 1) {
	            		result.push(childrenNodes[i]);
	            	}else if(childrenNodes[i].type == 0 && getChildNodes(childrenNodes[i]).length>0){
	            		getChildNodes(childrenNodes[i],result);
	            	}
	            }
	        }
	    }
	    return result;
	}
	//选中人物或取消选中
	container.on("click","div.item",function(){
		var tel = $(this).attr('data-tel');
		if($(this).hasClass("select")){
			if(tel.length>0){
				model.sphone = model.sphone.replace(tel+',','');
			}
		}else{
			model.sphone += tel.length>0 ?tel +',':'';
		}
		$(this).toggleClass("select");
	});
	
	
	/**
	 * 获取坐席列表
	 */
	function getSheetList(){
		var list = [];
		var url = "iccPhoneCtrl/allSheet";
		//成功回调
		function success(json){
			if(json.success){
				var data = json.data;
//				list = json.data;
				data.forEach(function(item,index){
					list.push({id:item.id,name:item.id});
//TODO				list.push({id:item.id,name:item.name}); 待实现下拉框动态赋值后使用
				});
//				model.sheetList = list;
			}else{
				tip.alert(json.msg);
			}
		}
		/*
		 * 请求响应失败处理
		 */
		function error () {
			tip.alert('请求失败，服务器响应超时~!');
		};
		utils.ajax(url,{},success,error,false);
		return list;
	}
	/**
	 * 获取坐席状态
	 */
	function getSheetStatus(){
			schedulingCtrl('sheetStatus',function(msg){
				var status = JSON.parse(msg);
				model.status.code = status.code;
				model.status.msg = status.value;
			});
	}
	
	/**
	 * 获取用户绑定的当前坐席
	 */
	function getCurrentSheet(){
		var param = {
				whereId:'2',
				data:{'cusNumber':login.cusNumber,'type':2,'userId':login.userId},
				success:function(data){
					console.log(data);
					if(data && data.length > 0){
						model.sheetNum = data[0].sus_value;
						
						model.userSettingInfo.sus_value = data[0].sus_value;
						model.userSettingInfo.sus_record_id = data[0].sus_record_id;
					}
				}
		}
		
		userSetting.querySetting(param);
	}
	getCurrentSheet();
});