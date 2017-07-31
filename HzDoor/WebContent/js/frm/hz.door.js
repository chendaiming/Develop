/**
 *门禁控制接口
 */
define(function(require){
	var utils = require('frm/hz.utils'); 
	var loginUser=require('frm/loginUser');
	/*
	 * 私有属性
	 */
	var _emptyFn = function () {};	// 空函数
	/*
	 * 远程开门
	 * @param options 参数对象：options = {
	 * 		"request": "请求参数对象",{
	 *                              cusNumber:监狱号,
	 *                              userId:用户编号,
	 *                              doorId:[1,2]门编号数组
	 *                              }
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：result"
	 * }
	 */
	function _openDoor (options) {
		var url = 'doorCtrl/openDoor';
		_request(options,url);
	}
	/*
	 * 远程关门
	 * @param options 参数对象：options = {
	 * 		"request": "请求参数对象",{
	 *                              cusNumber:监狱号,
	 *                              userId:用户编号,
	 *                              doorId:[1,2]门编号数组
	 *                              }
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：result"
	 * }
	 */
	function _closeDoor (options) {
		var url = 'doorCtrl/closeDoor';
		_request(options,url);
	}
	/*
	 * 一键锁死
	 * @param options 参数对象：options = {
	 * 		"request": "请求参数对象",{
	 *                              cusNumber:监狱号,
	 *                              userId:用户编号,
	 *                              doorId:[1,2]门编号数组
	 *                              }
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：result"
	 * }
	 */
	function _lockDoor (options) {
		var url = 'doorCtrl/lockDoor';
		_request(options,url);
	}
	
	function _request(options,url){
		var success = options.success || _emptyFn;
		var error = options.error || _emptyFn;
		var args = {'args': JSON.stringify(options.request)};
		if (typeof async !== 'boolean') async = true;
		/*
		 * 请求响应成功处理
		 */
		function reqs (result) {
			if (result) {
				if (result.success) {
					success(result);
				} else {
					error(result);
				}
			} else {
				error('', '请求失败，服务器处理错误~!');
			}
		};
		/*
		 * 请求响应失败处理
		 */
		function reqe () {
			error('', '请求失败，服务器响应超时~!');
		};
		// 请求处理
		utils.ajax(url, args, reqs, reqe);
	}

	/*
	 * 注入模块方法
	 */
	try {
		var hz = window.top.hz;
		var door = null;
		if (hz) {
			door = hz.door;
		} else {
			hz = window.top.hz = {};
		}
		if (!door) {
			door = hz.door = {
				openDoor: _openDoor,
				closeDoor: _closeDoor,
				lockDoor: _lockDoor
			};
		}
		return door;
	} catch (e) {
		console.error('初始化 --> 门禁控制操作模块失败，' + e);
	}
	
});