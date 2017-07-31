define(function(require){	
	var $ = require('jquery');
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	
	var sign = '9';  //呼叫时加拨的标识
	
	var container=$("#listcontainer");
	var treeContainer;
	var flag = false; //标识是否通话中
	var task = null; //获取状态的定时任务
	
	 var vm =new tpl({
		el:'.scooper_scheduling',
		data:{
			callee:'',//呼叫列表 多个号码以","隔开,注意:最后一个号码也必须跟",",否则最后一个号码呼叫不了
			phoneTel:'',
			msgPhone:'',
			msg:'',//短信内容
			police:[]
		},
		methods:{
			ctrl:function(otype){
				if(!check()) return;
				schedulingCtrl(otype);
			},
			call:function(){
				if(!check()) return;
				//单呼,暂时只取第一个号码
				vm.phoneTel = vm.callee.split(',')[0];
				schedulingCtrl('call');
				//弹框显示呼叫状态
//				dialog.open({targetId:'call_dialog',title:'呼叫',h:"185px",w:"300px",closeCallback:function(){
					//关闭窗口时,状态不为空闲中自动挂断
//					if(vm.status.code != '200') {
//						schedulingCtrl('clearCall');
//					}
//					//停止正在执行的定时任务
//					if(task !=null) {
//						clearTimeout(task);
//						task = null;
//					}
//				}});
			},
			showMsgDialog:function(){
				getMsgPhone();
				dialog.open({targetId:'msg_dialog',title:'发送短信',h:"235px"});
			},
		}
	});
	
	function initTree(){
		db.query({
			request:{
				sqlId:'select_police_info_tree_schedu',
				whereId:'0',
				orderId:'0',
				params:[login.cusNumber,login.cusNumber]
			},
			success:function(data){
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
									vm.police = getChildNodes(node,result);
								}else if(node.type==1){
									vm.police= list=treeContainer.transformToArray(node).filter(function(item){
										if(item.type==1)return true;
									});
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
	}
	/**
	 * 后台通信
	 * @param otype 操作类型
	 * @param success 操作成功时的回调方法
	 */
	function schedulingCtrl (otype,success) {
		var args = {};
		switch(otype){
		case 'call': //呼叫
			args = {
				'otype':otype,
				'callee':vm.phoneTel,
			};
			break;
//		case 'clearCall'://挂断
//			args = {
//				'otype':otype,
//				'sheetNum':vm.sheetNum
//			};		
//			break;
		case 'message'://短信
			args = {
				'otype':otype,
				'content':vm.msg,
				'receive':vm.msgPhone,
				'time':'',
				'type':0
			};		
			dialog.close();
			break;
//		case 'sheetStatus'://坐席状态
//			args = {
//				'otype':otype,
//				'sheetNum':vm.sheetNum
//			};				
//			break;
//		case 'lis':
//		case 'into':	
//			arg = {
//				'otype':otype,
//				'curSheetNum':vm.sheetNum,
//				'callingSheetNum':vm.callingSheetNum
//			};
//			break;
		}
		
		var reqs = function(msg){
			tip.alert(msg);
		}
		
		if(success){
			reqs = success;
		}
		
		utils.ajax('schedule/excute', {'args':JSON.stringify(args)},reqs,function(json){
			tip.alert('error:'+msg);
		});
	}
	
	function check(){
		if(vm.sphone == ''){
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
				vm.callee = vm.callee.replace( sign + tel+',','');
			}
		}else{
			vm.callee += tel.length > 0 ? sign + tel + ',':'';
		}
		
		$(this).toggleClass("select");
	});
	
	/**
	 * 将选择的号码转换成发送短信需要传入的号码格式
	 */
	function getMsgPhone(){
		var phone = vm.callee.split(',');
		var phoneList = new Array();
		phone.forEach(function(item,index){
			if(item.indexOf(sign) == 0){
				//去掉加拨的标识
				var _phone  = item.substr(sign.length);
				//去掉首位的0
				if(_phone.indexOf('0') == 0){
					_phone = _phone.substr(1);
				}
				phoneList.push(_phone);
			}
		})
		vm.msgPhone = phoneList.join(';');
	}
	/**
	 * 获取坐席状态
	 */
//	function getSheetStatus(){
//			schedulingCtrl('sheetStatus',function(msg){
//				vm.status.code = msg;
//				switch(msg){
//				
//				}
//			});
//	}
	
	initTree();
});