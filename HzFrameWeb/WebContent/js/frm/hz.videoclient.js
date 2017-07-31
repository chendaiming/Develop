/**
 * 视频客户端模块
 */
define(function (require) {
	var localStorage = require('frm/localStorage'),
		loginUser=require('frm/loginUser'),
    	frmwebmessage = require('frm/webmessage'),
    	tip=require('frm/message'),
		utils = require('frm/hz.utils'); // 加载辅助模块

	var webmessage;

	/** 对讲服务配置信息对象 **/
	var talkbackConfigObj;

	/**  获取到的对讲服务配置信息 **/
	var talkback_config;


	/*
	 * 设置客户端窗口样式
	 * @param options 参数options = {
	 * 		"formCount": "画面布局（可选）, 0~15之间的值",
	 * 		"x": "上边距（可选）",
	 * 		"y": "左边距（可选）",
	 * 		"width": "宽度（可选）",
	 * 		"height": "高度（可选）",
	 * 		"isTop": "是否置顶（可选）",
	 * 		"isShowTitle": "显示标题（可选）",
	 * 		"isShowBorder": "显示边框（可选）"
	 * }
	 */
	function _setStyle (options) {
		_sendMessage('VIDEO023',options);
	}


	/*
	 * 设置画面布局
	 * @param layout 下一个布局（必选）
	 */
	function _setLayout (layout) {
		//发送消息到客户端
		_sendMessage('VIDEO021', {
			formCount:layout
		});
	}


	/*
	 * 播放视频
	 * @param data		播放参数，三种格式：
	 * 		1.{"窗口索引0~15的值":"摄像机编号"}
	 * 		  {'0':123, '5':234}
	 * 		2.直接传摄像机编号（默认选中的窗口）
	 * 		3.存放摄像机编号的数组，打开顺序按数组顺序来打开
	 * 
	 * @param options 可选参数（暂时未定义）
	 */
	function _play (data, options) {
//		console.log(data);

		//组装查询摄像机信息的参数
		var paras=[];
		if(utils.isArray(data)){
		    for (var i = 0; i < data.length; i++) {
		    	var cameraObj={
		    		cameraId:data[i]	
		    	};
		    	paras[i]=cameraObj;
		    }
		}else if(utils.isObject(data)){
			var k=0
			for(key in data){
		    	var cameraObj={
			    		cameraId:data[key],
			    		index:key
			    	};
			    paras[k]=cameraObj;
			    k=k+1;
			}
		}else{
	    	var cameraObj={
		    		cameraId:data	
		    	};
	    	paras[0]=cameraObj;
		}

		//获取消息体
		var bodyJson;
		_queryCameraInfoForPlayVideo(paras,1,function(data){
			bodyJson=data;
		});
		
		//发送消息到客户端
		_sendMessage('VIDEO001',bodyJson);
		//演示时播放文件
		//_playFileTest(data, options);
	}

	/*
	 * 回放视频
	 * @param data 回放参数，两种格式：
	 * 		1. 键值对格式：{"窗口索引0~15的值": {"cameraId":"", "beginTime":"", "endTime":""}}
	 * 		2. 数组格式：[{"cameraId":"", "beginTime":"", "endTime":""}, ...]
	 * 
	 * @param options 可选参数（暂时未定义）
	 */
	function _playback (data, options) {
		console.log(data);
		//组装查询摄像机信息的参数
		var paras=[];
		if(utils.isArray(data)){
			paras=data;
		}else if(utils.isObject(data)){
			var k=0;
			for(key in data){
		    	var cameraObj={
			    		cameraId:data[key],
			    		index:key
			    	};
		    	data[key].index = key;
			    paras[k++] = data[key];
			}
		}

		//获取消息体
		var bodyJson;
		_queryCameraInfoForPlayVideo(paras,2,function(data){
			bodyJson=data;
		});
		
		//发送消息到客户端
		_sendMessage('VIDEO005',bodyJson);
	}


	/*
	 * 播放视频文件
	 * @param data 两种格式：
	 * 		 数组格式：[{"fileName":"播放文件", "type":"文件类型","index":"窗口索引（此字段可以为空，为空则在选中窗口中播放）"}, ...]
	 */
	function _playFile (data) {
		_sendMessage('VIDEO007',data);
	}
	/**
	 * 对讲Service初始化
	 */
	function _initTalk(){
		console.log('初始化 --> 对讲Service模块...');
		if(!talkback_config){
			tip.alert('未配置对讲服务信息,请前往 对讲-对讲服务页面进行配置');
			return;
		}
		var bodyJson = {
			'json':JSON.stringify({'BoxAddress':talkback_config.tsd_ip ,	
				   'SipAcc':talkback_config.tsd_login_name ,
				   'SipPwd':talkback_config.tsd_login_pwd }),
			'deviceType':talkback_config.tsd_type 
		};
		_sendMessage('TALK001',bodyJson);
	}
	/**
	 * 对讲-呼叫对讲主机
	 * @param reciver 被呼叫方
	 */
	function _startTalk(reciver){
		console.log('呼叫对讲主机-->'+reciver);
		var bodyJson = {
			'dstCode':reciver,	
			'deviceType':talkback_config.tsd_type 
		};
		_sendMessage('TALK002',bodyJson);
	}
	/**
	 * 对讲-呼叫挂断
	 * @param reciver 被呼叫方
	 */
	function _stopTalk(reciver){
		console.log('呼叫挂断');
		var bodyJson = {
			'dstCode':reciver,
			'deviceType':talkback_config.tsd_type 
		};
		_sendMessage('TALK003',bodyJson);
	}	
	/**
	 * 对讲Service注销
	 */
	function _uninitTalk(){
		console.log('注销 --> 对讲Service模块...');
		var bodyJson = {
			'deviceType':talkback_config.tsd_type 
		};
		_sendMessage('TALK004',bodyJson);
	}

	/**
	 * 根据ID切换对讲服务配置信息
	 */
	function _setTalkConfigByid(id){
		talkback_config = talkbackConfigObj.getConfigByid(id);
		if(talkback_config.tsd_type){
			_uninitTalk();
			_initTalk();
			return true;
		}
		return false;
	}
	/**
	 * 设定talkbackConfigObj对象
	 */
	function _setTalkConfigObj(config){
		talkbackConfigObj = config;
		talkback_config = talkbackConfigObj.getConfig();
		//初始化对讲服务
		_initTalk();
	}
	
	/**
	 * 视频截图
	 * @param index 视频窗口索引值
	 * @param fileName 截图名称
	 */
	function _videoCut(index,fileName){
		var bodyJson = {
				'index':index,
				'fileName':fileName
			};
		_sendMessage('VIDEO019',bodyJson);
	}
	
	
	/**
	 * 获取视频选中窗口索引值
	 */
	function _getVideoWindowIndex(){
		_sendMessage('VIDEO026');
	}
	
	/*
	 * 播放视频
	 * @param data		播放参数，三种格式：
	 * 		1.{"窗口索引0~15的值":"摄像机编号"}
	 * 		  {'0':123, '5':234}
	 * 		2.直接传摄像机编号（默认选中的窗口）
	 * 		3.存放摄像机编号的数组，打开顺序按数组顺序来打开
	 * 
	 * @param options 可选参数（暂时未定义）
	 */
	function _playFileTest(data, options){
		console.log(data);
		//组装查询摄像机信息的参数
		var paras=[];
		if(utils.isArray(data)){
		    for (var i = 0; i < data.length; i++) {
		    	var playObj={
		    			brand:8,
		    			fileName:_getPlayFileName(data[i])
		    	}
		    	paras[i]=playObj;
		    }
		}else if(utils.isObject(data)){
			var k=0
			for(key in data){
		    	var playObj={
		    			brand:8,
		    			fileName:_getPlayFileName(data[key])
		    	}
			    paras[k]=playObj;
			    k=k+1;
			}
		}else{
	    	var playObj={
	    			brand:8,
	    			fileName:_getPlayFileName(data)
	    	}
	    	paras[0]=playObj;
		}
		_playFile(paras);
	}
	
	function _getPlayFileName(cameraId){
		console.log("cameraId="+cameraId);
		var fileName={};
		fileName["8"]="D:\\video\\3261_305_8_20161117_083838.mp4";
		fileName["9"]="D:\\video\\3261_311_8_20161117_084021.mp4";
		fileName["10"]="D:\\video\\3261_360_8_20161117_075023.mp4";
		fileName["11"]="D:\\video\\3261_363_8_20161117_075228.mp4";
		
		fileName["12"]="D:\\video\\3261_699_8_20161117_080926.mp4";
		fileName["15"]="D:\\video\\3261_710_8_20161117_080803.mp4";
		fileName["16"]="D:\\video\\3261_711_8_20161117_081038.mp4";
		fileName["17"]="D:\\video\\3261_4513_8_20161117_074631";
		fileName["18"]="D:\\video\\3261_4519_8_20161117_074859";
		//fileName.
		return fileName[cameraId];
	}


	/*
	 * 根据窗口索引关闭
	 * @param data 关闭参数，三种格式：
	 * 		1. 窗口索引
	 * 		2. 窗口索引集合
	 * 		3. null或undefined则关闭所有
	 */
	function _close (data) {

	}


	/*
	 * 根据摄像机编号关闭
	 * @param data 关闭参数，三种格式：
	 * 		1. 摄像机编号
	 * 		2. 摄像机编号集合
	 * 		3. null或undefined则关闭所有
	 */
	function _closeById (data) {

	}
	
	/*
	 * 新增接口
	 * 开启/关闭语音识别
	 * @param action 备注：1.开启、2.关闭
	 * 类型 string
	 * add by jason
	 */
	function _switchSpeechRec(action){
		
		/*设置消息body内容*/
		var bodyJson={
				'action':action				
		}
		/*发送请求*/
		_sendMessage("VIDEO029",bodyJson)
	}
	
	

	/**
	 * 发送视频客户端消息
	 * msgType 文档中定义的消息类型
	 * msgBody 发送的消息体对象
	 */
    function _sendMessage (msgType, msgBody) {
		var msgHeader = _getMsgHeader(msgType);
		var msg = {
			'header': JSON.stringify(msgHeader),
			'body': JSON.stringify(msgBody)
		};
		webmessage.send(msg);
		return msg;
    }


	/**
	 * 获取发送视频客户端的消息头
	 * msgType 文档中定义的消息类型
	 */
	function _getMsgHeader (msgType) {
		return {
			'msgId': _getMsgSeq(),
			'msgType': msgType,
			'sendTime': utils.formatterDate(new Date(),'yyyy-mm-dd hh:mi:ss')
		};
	}




	/**
	 *获取发送视频客户端的消息编号
	 */
	function _getMsgSeq(){
		var videoMsgIdObject=localStorage.getItem('videoMsgIdObject');
		var today=utils.formatterDate(new Date(),'yyyymmdd');
		var msgId;
		var dateStr;
		if(videoMsgIdObject){
			dateStr=videoMsgIdObject.dateStr;
			if(today==dateStr){
				msgId=videoMsgIdObject.msgId;
				videoMsgIdObject.msgId=parseFloat(msgId)+1;
				
			}else{
				msgId=today+'00000001';
				videoMsgIdObject.dateStr=today;
				videoMsgIdObject.msgId=msgId;
			}
			
		}else{
			msgId=today+'00000001';
			videoMsgIdObject={
				dateStr:today,	
				msgId:msgId
			}
		}
		localStorage.setItem('videoMsgIdObject',videoMsgIdObject);
		return msgId;
	}
 
	function _queryCameraInfoForPlayVideo(cameraArray,type,successFn){
		var url = 'cameraCtr/queryCameraInfoForPlayVideo';
		var paras={
				cusNumber:loginUser.cusNumber,
				cameraArray:cameraArray,
				type:type
		};
		var args = {'args': JSON.stringify(paras)};
		/*
		 * 请求响应成功处理
		 */
		function reqs (result) {
			if (result) {
				if (result.success) {
					successFn(result.data);
				} else {
					console.log('respCode='+result.respCode+' respMsg='+result.respMsg);
				}
			} else {
				console.log('请求失败，服务器处理错误~!');
			}
		};
		/*
		 * 请求响应失败处理
		 */
		function reqe () {
			console.log('请求失败，服务器响应超时~!');
		};
		// 请求处理
		utils.ajax(url, args, reqs, reqe,false);
	}

	function messageBack(){
//		webmessage.on('VIDEO001','videoClient',function(data){
//			console.log('VIDEO001 --> ' + JSON.stringify(data));
//		});
//		webmessage.on('VIDEO004','videoClient',function(data){
//			tip.alert(data);
//		});
//		webmessage.on('VIDEO006','videoClient',function(data){
//			tip.alert(data);
//		});
//		webmessage.on('VIDEO008','videoClient',function(data){
//			tip.alert(data);
//		});
//		webmessage.on('VIDEO010','videoClient',function(data){
//			tip.alert(data);
//		});
//		webmessage.on('VIDEO007','videoClient',function(data){
//			tip.alert(data);
//		});
//		webmessage.on('VIDEO030','videoClient',function(data){
//			tip.alert(data);
//		})
	}





	// ************************ BEGIN * 2017.05.16 add ***************************

	var msgHandlePools = {};	// 消息回调处理池，格式：{'消息类型': {'消息ID': '处理函数'}}


	/*
	 * 消息处理回调
	 */
	function msgCallback () {
		try {
			webmessage.websocket.on('onmessage', 'hz.videoclient', function (event) {
				try {
					// 解析消息
	                var msg = toJSON(event.data);
	                	msg.header = toJSON(msg.header);
	                	msg.body = toJSON(msg.body);

					var msgType = msg.header.msgType;
					var msgId = msg.header.msgId;

					// 根据消息类型和消息ID获取处理函数
					var pools = msgHandlePools[msgType] || {};
					var callback = pools[msgId];

					// 调用处理函数后删除该函数（每个请求对应的回调函数只处理一次）
					if (typeof callback == 'function') {
						delete pools[msgId];
						callback(msg);
					}
				} catch (e) {
					console.error('处理视频客户端响应消息异常：', e);
				}
			});

			webmessage.websocket.on('onconnecting', 'hz.videoclient', function (event) {
				console.log('视频客户端已断开，重连中...');
			});
		} catch (e) {
			console.error('初始化消息处理回调异常：', e);
		}
	}


	/*
	 * 转换为JSON对象
	 */
	function toJSON (data) {
		if (data && typeof data != 'object') {
			data = JSON.parse(data);
		}
		return data;
	}


	/*
	 * 消息请求
	 * @param reqType		请求报文的消息类型
	 * @param reqBody		请求报文的消息体
	 * @param respType		响应报文的消息类型
	 * @param respHandle	响应报文的处理函数
	 */
	function msgRequest (reqType, reqBody, respType, respHandle) {
		try {
			var msgHeader = _getMsgHeader(reqType);
			var msg = {
				'header': JSON.stringify(msgHeader),
				'body': JSON.stringify(reqBody)
			};

			if (msgHandlePools[respType] == undefined) {
				msgHandlePools[respType] = {};
			}

			// 通过消息类型和消息ID来存放回调处理函数
			msgHandlePools[respType][msgHeader.msgId] = respHandle;

			// 通过websocket向视频客户端发送请求
			webmessage.send(msg);

		} catch (e) {
			console.error('请求视频客户端异常：', e);
		}
	}


	/*
	 * 根据窗口索引获取摄像机信息
	 * @param winIndex	播放视频文件的窗口索引，如果为null或者-1则获取当前视频客户端选中窗口的摄像机信息
	 * @return {"index":"窗口索引", "cameraId":"摄像机编号", ...} 其它属性暂未定义
	 */
	function readCameraInfo (winIndex, callback) {
		callback({
			'index': '',
			'cameraId': '',
			'cameraName': '',
			'cameraBrand': ''
		});
	}


	/*
	 * 播放实时视频
	 * @param reqBody 	播放实时视频的请求体
	 * @param callback	请求处理结束后的回调函数
	 */
	function playVideo (reqBody, callback) {
		msgRequest('VIDEO001', reqBody, 'VIDEO002', callback);
	}


	/*
	 * 关闭实时视频
	 * @param key 类型：对应文档的type（暂不支持type=0）
	 * @param val 值：根据类型定义（0-摄像机编号、1-窗口索引、2-关闭所有）
	 * @param callback	请求处理结束后的回调函数
	 */
	function closeVideo (key, val, callback) {
		msgRequest('VIDEO003', {'type': key, 'id': val}, 'VIDEO004', callback);
	}


	/*
	 * 回放视频
	 * @param reqBody 	回放视频的请求体
	 * @param callback	请求处理结束后的回调函数
	 */
	function playbackVideo (reqBody, callback) {
		msgRequest('VIDEO005', reqBody, 'VIDEO006', callback);
	}


	/*
	 * 播放视频文件
	 * @param winIndex	播放视频文件的窗口索引
	 * @param brand		播放的视频文件的品牌类型（录制时是由哪家摄像机品牌商提供的录制格式）：1.大华、8.海康
	 * @param fileName	播放视频文件的本地路径
	 * @param callback	请求处理结束后的回调函数
	 */
	function playVideoFile (winIndex, brand, fileName, callback) {
		msgRequest('VIDEO007', {'index': winIndex, 'brand': brand, 'fileName': fileName}, 'VIDEO008', callback);
	}


	/*
	 * 开始录制视频
	 * @param winIndex	录制的视频的窗口索引（索引从0开始）
	 * @param brand		设备品牌
	 * @param fileName	录像文件在本地的保存的路径及名称，例如：D:\\Program Files\\测试.mp4
	 * @param callback	请求处理结束后的回调函数
	 */
	function recordVideoStart (winIndex, brand, fileName, callback) {
		msgRequest('VIDEO015', {'index': winIndex, 'brand': brand, 'fileName': fileName}, 'VIDEO016', callback);
	}


	/*
	 * 停止录制视频
	 * @param winIndex	录制的视频的窗口索引（索引从0开始）
	 * @param callback	请求处理结束后的回调函数
	 */
	function recordVideoStop (winIndex, callback) {
		msgRequest('VIDEO017', {'index': winIndex}, 'VIDEO018', callback);
	}


	/*
	 * 视频截图
	 * @param winIndex	截图的视频的窗口索引（索引从0开始）
	 * @param fileName	截图文件在本地的保存的路径及名称，例如：D:\\Program Files\\测试.jpg
	 * @param callback	请求处理结束后的回调函数
	 */
	function cutVideo (winIndex, fileName, callback) {
		msgRequest('VIDEO019', {'index': winIndex, 'fileName': fileName}, 'VIDEO020', callback);
	}


	/*
	 * 上传文件
	 * @param serverIp	FTP服务器地址
	 * @param port		FTP服务器端口
	 * @param userName	FTP服务器用户名
	 * @param password	FTP服务器密码
	 * @param file		上传文件的本地路径
	 * @param callback	请求处理结束后的回调函数
	 */
	function uploadFile (serverIp, port, userName, password, file, callback) {
		msgRequest('VIDEO031', {
			'ftpServerIP': serverIp, 
			'ftpServerPort': port, 
			'ftpUserID': userName, 
			'ftpPassword': password, 
			'fileName': file
		}, 'VIDEO032', callback);
	}


	/*
	 * 下载文件
	 * @param serverIp	FTP服务器地址
	 * @param port		FTP服务器端口
	 * @param userName	FTP服务器用户名
	 * @param password	FTP服务器密码
	 * @param savePath	文件下载到本地的保存路径
	 * @param fileName	下载的文件名称
	 * @param callback	请求处理结束后的回调函数
	 */
	function downloadFile (serverIp, port, userName, password, savePath, fileName, callback) {
		msgRequest('VIDEO033', {
			'ftpServerIP': serverIp, 
			'ftpServerPort': port, 
			'ftpUserID': userName, 
			'ftpPassword': password, 
			'ftpFileName': fileName,
			'localFilePath': savePath
		}, 'VIDEO034', callback);
	}




	// ************************ END * 2017.05.16 add  ***************************







	/*
	 * 注入模块方法
	 */
	try {
		var hz = window.top.hz;

		if (hz) {
			if (hz.videoclient) {
				console.log('获取视频客户端操作对象...');
				return hz.videoclient;
			}
		} else {
			hz = window.top.hz = {};
		}

		webmessage = new frmwebmessage();
		webmessage.init(videoWebsocketUrl, function(){
			hz.videoclient.isInit = true;

			if (talkback_config) {
				_uninitTalk();
				_initTalk();
			}

			messageBack();
			msgCallback();
			console.log('视频客户端连接成功');
		});
		console.log('初始化 --> 视频客户端操作模块...');

        return hz.videoclient = {
    			setStyle: _setStyle,
    			setLayout: _setLayout,

    			play: _play,			// 播放实时视频
    			playback: _playback,	// 回放视频录像
    			playFile: _playFile,	// 播放录像文件

    			close: _close,
    			closeById: _closeById,

    			//对讲部分
    			initTalk:_initTalk,
    			startTalk:_startTalk,
    			stopTalk:_stopTalk,
    			uninitTalk:_uninitTalk,
    			setTalkConfigByid:_setTalkConfigByid,
    			setTalkConfigObj:_setTalkConfigObj,

    			videoCut:_videoCut,					// 视频截图
    			getVideoWindowIndex:_getVideoWindowIndex,
    			getMsgHeader:_getMsgHeader,

    			switchSpeechRec:_switchSpeechRec,	// 语音识别

    			webmessage:webmessage,
    			vcSend: _sendMessage,
    			wsSend: webmessage.send,

    			'readCameraInfo': readCameraInfo,		// 获取指定窗口索引的摄像机信息
    			'playVideoFile': playVideoFile,			// 播放视频文件
    			'recordVideoStart': recordVideoStart,	// 开始录像
    			'recordVideoStop': recordVideoStop,		// 结束录像
    			'cutVideo': cutVideo,					// 视频截图
    			'uploadFile': uploadFile,				// 上传文件
    			'downloadFile': downloadFile			// 下载文件
    		};
	} catch (e) {
		console.error('初始化 --> 视频客户端操作模块失败，' + e);
	}
});