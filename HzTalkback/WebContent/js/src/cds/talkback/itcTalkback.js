define(function(require){
	var $ = require("jquery"),
	    tpl = require('vue'),
	    ls  = require('frm/localStorage'),
	    utils = require('frm/hz.utils'),
	    db = require('frm/hz.db'),
	    tip = require('frm/message'),
	    videoClient = require('frm/hz.videoclient'),
	    hzMap = window.top.hz.mapHandle,
	    talkback = require('frm/hz.itcTalkback'),
	    hzEvent = require('frm/hz.event');

//	var talkbackConfig = window.top.hz.talkbackConfig;
	var talkbackConfig = require('cds/talkback/talkbackConfig');//对讲服务配置信息

	var hz_talk = false;
	
	var treeContainer;
	model=new tpl({
		el:'.talkback_mini',
		data:{
			caller:getCaller(),
			callee:{id:'',name:''},
			call_id:'',//当前会话id
			call_type:'',
			itcStatus:'',
			call_info:[],
			linkDeviceList:[]
		},
		methods:{
			talk:function(){
				setCallInfo();
				_talk();
				hz_talk = false;
			},
			call_close:function(){
				_call_close();
				hz_talk = false;
			},
			call:function(){
				setCallInfo();
				_call();
				hz_talk = false;
			},
			monitor:function(){
				setCallInfo();
				_monitor();
				hz_talk = false;
			},
			startTalk:function(){
				setCallInfo();
				viewInfo('正在呼叫,请等待应答...',2);
			
				var loginName = talkbackConfig.getConfig().tsd_login_name;
				if(loginName){
					hz_talk = true;
					videoClient.startTalk(model.callee.id);
					openLinkCamera('',model.callee,2);
					talkback.getCallMsg(loginName,setCallid);	
				}else{
					tip.alert('未配置对讲服务,无法进行呼叫!')
				}
			},
			stopTalk:function(){
				hz_talk = true;
				_call_close();
			},
			close:function(){
				$('#talkbackMini').hide();
				//同时挂断通话(如果正在通话中)
				_call_close();
			}
		}
	});
	
	/*
	 * 设定当前通话参数
	 */
	function setCallInfo(){
		model.call_info = [];
		model.callee.id = talkbackConfig.idMapping[ls.getItem('talkbackId')],
		model.callee.name = ls.getItem('talkbackName');
		model.call_type = ls.getItem('talkbackCallType');
	}
	/*
	 * 获取当前用户关联的对讲主机
	 */
	function getCaller(){
		var hostInfo = talkbackConfig.getRelationHost();
		if(hostInfo.sus_value){
			return {id:hostInfo.sus_value,name:hostInfo.tbd_name};
		}else{
			console.warn('该用户尚未关联对讲主机');
			return {id:'',name:''};
		}
	}

	/**
	 * 对讲
	 */
	function _talk(){
		if(!check()) return;
		viewInfo('正在呼叫,请等待应答...');
		talkback.talk(model.caller.id,model.callee.id,setCallid);
		openLinkCamera(model.caller,model.callee);
	}
	/**
	 * 监听
	 */
	function _monitor(){
		if(!check()) return;
		viewInfo('连接中,请等待...');
		
		talkback.monitor(model.caller.id,model.callee.id,setCallid);
		
		openLinkCamera(model.caller,model.callee);
	}
	/**
	 * 广播
	 */
	function _call(){
		if(!check()) return;
		
		viewInfo('连接中,请等待...');
		
		talkback.broadcast(model.caller.id,model.callee.id,setCallid);
		
		openLinkCamera(model.caller,model.callee);
	}
	/**
	 * 挂断
	 */
	function _call_close(){
		if(model.call_id == '') {
			return;
		}
		
		talkback.close(model.call_id,close_success);
	}
	
	/**
	 * 挂断成功回调
	 */
	function close_success(){
		console.log('成功挂断会话id为'+model.call_id+'的通话');
		if(hz_talk){
			viewInfo('已挂断',2);
		}else{
			viewInfo('已挂断');
		}
		model.call_id = '';
	}
	
	/**
	 * 传参检验
	 */
	function check(){
		if(model.caller.id == ''){
			tip.alert('请先关联操作的对讲主机');
			return false;
		}
		if(model.callee.id == ''){
			tip.alert('请选择被叫的对讲主机');
			return false;
		}
		return true;
	}	
	
	
	/*
	 * 设定当前会话ID
	 * @param callid 返回的会话ID
	 */
	function setCallid(callid){
		model.call_id = callid;
		if(hz_talk){
			viewInfo('已建立会话',2);
		}else{
			viewInfo('已建立会话');
		}
		
	}
	
	/**
	 * 信息显示
	 */
	function viewInfo(info,type){
		var callerName = model.caller.name;
		if(type && type == 2){
			callerName = '本机';
		}
		var msg = {
				msg : new Date().Format('hh:mm:ss') + '  ' + callerName
						+ '-->' + model.callee.name + '  ' + info
			};
		model.call_info.push(msg);
	}
	/*
	 * 打开关联摄像机
	 */
	function openLinkCamera(caller,callee,type){
		var linkDeviceList = new Array();
		
		if(!type){
			linkDeviceList = linkDeviceList.concat(talkbackConfig.getLinkDevice(caller));
		}
		linkDeviceList = linkDeviceList.concat(talkbackConfig.getLinkDevice(callee));
		
		videoClient.setLayout(linkDeviceList.length);
		videoClient.play(linkDeviceList);
	}
	/**
	 * 对讲开始结束事件处理
	 */
	function talkingCallback(json){

		//显示系统信息
		hzMap.console(json.msg.msg);
		
		if(json.msg.type == 'start'){
			//打开关联视频
			var callee = json.msg.callee;
			if(callee.id != model.caller.id ){
				console.log('被叫方不是关联的对讲主机,不联动视频');
				return;
			}
			var caller = json.msg.caller;
			openLinkCamera(caller,callee);
			
		}
	}
	//订阅对讲事件消息
	window.top.webmessage.off('TALKBACK002','itctalkbackMsg');
	window.top.webmessage.on('TALKBACK002','itctalkbackMsg',talkingCallback);	
	
	//事件注册
    hzEvent.on('hz.miniTalkback.talk',model.talk);//对讲
    hzEvent.on('hz.miniTalkback.call',model.call);//广播
    hzEvent.on('hz.miniTalkback.monitor',model.monitor);//监听
    hzEvent.on('hz.miniTalkback.startTalk',model.startTalk);//本地
	
});