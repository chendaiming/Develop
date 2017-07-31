
define(function (require) {
	var workFlow = {};
	/*
	 * 依赖模块引入
	 */
	var $ = require('jquery');
	var utils = require('frm/hz.utils'); // 加载辅助模块
	
	//开始
	function _start(path,flowTypeKey,eventId,userId,userName,roleId){
		var url = path + 'flowCtrl/start';
		var args = {
				'flowTypeKey': flowTypeKey,
				'eventId' : eventId,
				'userId' : userId,
				'userName' : userName,
				'roleId' : roleId
		};
		return _result(url,args);
	}
	
	//下一步
	function _next(path,eventId,userId,userName,roleId){
		var url = path + 'flowCtrl/next';
		var args = {
				'eventId' : eventId,
				'userId' : userId,
				'userName' : userName,
				'roleId' : roleId
		};
		return _result(url,args);
	}
	
	//上一步
	function _back(path,eventId,userId,userName,roleId){
		var url = path + 'flowCtrl/back';
		var args = {
				'eventId' : eventId,
				'userId' : userId,
				'userName' : userName,
				'roleId' : roleId
		};
		return _result(url,args);
	}
	
	//跳转
	function _jump(path,flowId,eventId,userId,userName,roleId){
		var url = path + 'flowCtrl/jump';
		var args = {
				'flowId' : flowId,
				'eventId' : eventId,
				'userId' : userId,
				'userName' : userName,
				'roleId' : roleId
		};
		return _result(url,args);
	}
	
	
	//返回结果
	function _result(url,args){
		var f = null;
		utils.ajax(url,{"args" : JSON.stringify(args)},function(json){
//			console.log(JSON.stringify(json));
			f = json.result;
		},function(){
			
		},false);
		
		return f;
	}
	/*
	 * 发布方法
	 */
	try {
		
		// 针对类似frame框架的模型化处理
		try {
			var hz = window.top.hz;
			if (hz) {
				workFlow = hz.workFlow;
				if (workFlow) {
					return workFlow;
				}
			} else {
				hz = window.top.hz = {};
			}
			workFlow = hz.workFlow = {};
		} catch (e) {
			console.error('workFlow：引用顶层父级workFlow对象失败...');
		}

		workFlow.start = _start;
		workFlow.next = _next;
		workFlow.back = _back;
		workFlow.jump = _jump;
		return workFlow;
	} catch (e) {
		console.error('初始化 --> 工作流模块失败：' + e);
	}
});