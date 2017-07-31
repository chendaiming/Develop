define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var tip = require('frm/message');
	var hzEvent = require('frm/hz.event');
	var ls  = require('frm/localStorage');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	
	var flag = false; //标识是否通话中
	var task = null; //获取状态的定时任务
	
	var model=new tpl({
		el:'.scheduling_mini',
		data:{
			sphone:'',//呼叫列表 多个号码以","隔开,注意:最后一个号码也必须跟",",否则最后一个号码呼叫不了
			msg:'',//短信内容
			sheetNum:'801',//内线分机号
			sendNum:'',//来电显示号码(主叫)
			callingSheetNum:'',
			info:{
				
			},
			status:{
				code:'200',
				msg:'空闲'
			},
			telList:new Object()
		},
		methods:{
			call:function(){
				var telId = ls.getItem('schedulingId');
				model.sphone = model.telList[telId];
				if(!check()) return;
				schedulingCtrl('call',	function(){
					task =  setInterval(getSheetStatus,1000);
				});
			},		
			closeDialog:function(){
				$('#schedulingMini').hide();
				//同时挂断通话(如果正在通话中)
				if(model.status.code != '200') {
					schedulingCtrl('clearCall');
				}
				//停止正在执行的定时任务
				if(task !=null) {
					clearTimeout(task);
					task = null;
				}
			}
		}
	});
	
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
			arg = {
				'otype':otype,
				'curSheetNum':model.sheetNum,
				'callingSheetNum':model.callingSheetNum
			};
			break;
		}
		
		var reqs = function(msg){
			tip.alert(msg);
		}
		
		if(success){
			reqs = success;
		}
		
		utils.ajax('iccPhoneCtrl/excute', {'args':JSON.stringify(args)},reqs,function(json){
			tip.alert('error:'+msg);
		});
	}
	
	function check(){
		if(model.sphone == ''){
			tip.alert('所选人员没有联系方式数据或未选择人员!');
			return false;
		}
		return true;
	}

	/**
	 * 获取坐席状态
	 */
	function getSheetStatus(){
			schedulingCtrl('sheetStatus',function(msg){
				model.status.code = msg;
				switch(msg){
				case '200':
					model.status.msg = '空闲';
					if(flag){
						//通话变成空闲状态,清除定时器
						if(task != null){
							clearTimeout(task);
							task = null;
						} 
						flag  = false; 
					}
					break;
				case '201':
					model.status.msg = '已摘机';
					break;
				case '202':
					model.status.msg = '按键';
					break;
				case '203':
					model.status.msg = '拨号';
					break;
				case '204':
					model.status.msg = '通话中';
					flag = true;
					break;
				case '205':
					model.status.msg = '振铃中';
					break;
				case '999':
					model.status.msg = '异常';
					break;					
				}
			});
	}
	
	
	function loadPhoneList(){
		console.log('初始化-->通讯调度电话本数据...');
		db.query({
			request:{
				sqlId:'select_telephone_map_all',
				whereId:'0',
				params:[login.cusNumber]
			},
			async:false,
			success:function(data){
				for(var i=0;i<data.length;i++){
					model.telList[data[i].sab_id] = data[i].sab_phone;
				}
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
	}
	
	loadPhoneList();
	
	hzEvent.on('hz.hf.call',model.call);//对讲
	
	
	
});