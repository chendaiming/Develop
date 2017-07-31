define(function(require){
	var utils = require('frm/hz.utils'),
	    tip = require('frm/message');
	
//	var talkbackConfig = window.top.hz.talkbackConfig;//对讲服务配置信息
	var talkbackConfig = require('cds/talkback/talkbackConfig');//对讲服务配置信息
	var talkback_http_url = talkbackConfig.getConfig().tsd_http_url; //
	
	var tryNum = 0; //获取会话信息次数
	var Max_tryNum =  30; //最大重试次数
	
	/* 
	 * 是否需要获取会话信息的标识
 	 * false 不需要  true 需要
	 * 为true将会调用获取会话的方法
	 */
	var getCallMsgFlag = false;
	
	/*
	 * ITC对讲对讲操作对象
	 */
	function ITCTalkback(){
		var ITCTalkback = this;
		console.log('ITCTalkback:已创建ITC对讲操作对象')
	}
	
	/**
	 * 设定httpUrl
	 * @param httpUrl 
	 */
	ITCTalkback.prototype.setHttpUrl = function(httpUrl){
		talkback_http_url = httpUrl;
	}
	
	/**
	 * 对讲
	 * @param caller 主叫
	 * @param callee 被叫
	 * @param callback 回调
	 */
	ITCTalkback.prototype.talk = function(caller,callee,callback){
		getCallMsgFlag = true;
		var url = talkback_http_url+'talk.json?' +
		          'send_terminal='+caller +
		          '&recive_terminal='+callee;
		
		var params = {
			url: url,
			caller:caller,
			success:callback
		};
		
		itcCtrl(params);
	}
	
	
	/**
	 * 监听
	 * @param caller 主叫
	 * @param callee 被叫
	 *  @param callback 回调
	 */
	ITCTalkback.prototype.monitor = function(caller,callee,callback){
		getCallMsgFlag = true;
		var url = talkback_http_url + 'monitor.json?'+
					'send_terminal='+ caller + 
					'&recive_terminal=' + callee;
		
		var params = {
			url : url,
			caller : caller,
			success : callback
		};
			
		itcCtrl(params);
	}
	/**
	 * 广播
	 * @param caller 主叫
	 * @param callee 被叫  (多个设备时,以':'连接)
	 * @param 
	 */
	ITCTalkback.prototype.broadcast = function(caller,callee,callback){
		getCallMsgFlag = true;
		var url = talkback_http_url + 'call.json?'+
		          'send_terminal='+model.caller.id+
		          '&recive_terminal='+model.callee.id;

		var params = {
			url : url,
			caller : caller,
			success : callback
		};

		itcCtrl(params);
	}
	/**
	 * 挂断
	 * 
	 * @param callId
	 *            会话id
	 * @param callback
	 *            回调方法 挂断成功后执行
	 */
	ITCTalkback.prototype.close = function(callId,callback){
		getCallMsgFlag = false;
		if(callId == '') {
			return;
		}
		var url = talkback_http_url + 'call_close.json?id='+callId;
		
		var params = {
			url : url,
			success : callback
		};

		itcCtrl(params);
	}
	
	/**
	 * 获取会话信息
	 * @param caller 主叫
	 * @param callback 获取会话信息成功后回调将会话ID传回调用方
	 */
	ITCTalkback.prototype.getCallMsg = function(caller,callback){
		_getCallMsg(caller,callback);
	}
	
	function _getCallMsg(caller,callback){
		getCallMsgFlag = false;

		var url = talkback_http_url + 'call_status.json';

		var params = {
			url : url,
			success : function(resp) {
				var callid = '';
				var result = JSON.parse(resp);
				var calls = result.calls;

				if (calls && calls.length > 0) {
					for (var i = 0; i < calls.length; i++) {
						if (calls[i].caller == caller) {
							 callid = calls[i].call_id;
							// 回调返回会话ID
							callback(callid);
							tryNum = 0;//重置尝试次数
							break;// 立即退出循环
						}
					}
				}

				if (callid == '' && (tryNum < Max_tryNum)) {
					setTimeout(_getCallid(caller, callback), 1000);
					tryNum ++;
				}else if(tryNum >= Max_tryNum){
					//判定为连接超时,不再获取会话信息
					console.log('已达到最大重试次数,连接超时..');
					tryNum = 0;
				}
			}
		};

		itcCtrl(params);
	}
	
	/**
	 * 获取会话信息
	 * @param caller 主叫
	 * @param callback 获取会话信息成功后回调将会话ID传回调用方
	 */
	ITCTalkback.prototype.getCallMsg = function(caller,callback){
		_getCallMsg(caller,callback);
	}
	
	ITCTalkback.prototype.getCallid  = function(telephone,callback){
		getCallMsgFlag = false;

		var url = talkback_http_url + 'call_status.json';

		var params = {
			url : url,
			success : function(resp) {
				var callid = '';
				var result = JSON.parse(resp);
				var calls = result.calls;

				if (calls && calls.length > 0) {
					for (var i = 0; i < calls.length; i++) {
						if ((calls[i].caller  == telephone) || (calls[i].callees == telephone) ) {
							var callid = calls[i].call_id;
							// 回调返回会话ID
							callback(callid);
							break;// 立即退出循环
						}
					}
				}
			}
		};
		itcCtrl(params);
	}
	
	/**
	 * 封装传参的定时器方法
	 */
	function _getCallid(caller,callback){
		return function(){
			_getCallMsg(caller,callback);
		}
	}
	
	
	/**
	 * 发送Http请求
	 */
	function itcCtrl (params) {
		//发送请求至后台处理
		utils.ajax('itcTalkCtrl/httpGet', {'url':params.url}, function(json){
			if(params.success &&  typeof params.success =='function'){
				if(getCallMsgFlag){
					_getCallMsg(params.caller,params.success);
				}else{
					params.success(json);
				}
			}else{
				var result = JSON.parse(json);
				if(result.message.indexOf('ok')== -1){
					tip.alert('操作失败:'+result.message);
				}
			}
		}, function(json){
			tip.alert('error:'+JSON.stringify(resp));
		});
	}
	
	/*
	 * 注入模块方法
	 */
//	try {

		// 针对类似frame框架的模型化处理
		try {
			var hz = window.top.hz;
			if (hz) {
				if (hz.itcTalkback) {
					console.log('获取itc对讲模块对象...');
					return hz.itcTalkback;
				}
			} else {
				hz = window.top.hz = {};
			}
			console.log('初始化 --> ITC对讲操作模块...');
			
			return hz.itcTalkback = new ITCTalkback();
		} catch (e) {
			console.error('初始化 --> ITC对讲操作模块失败......',e);
		}
});