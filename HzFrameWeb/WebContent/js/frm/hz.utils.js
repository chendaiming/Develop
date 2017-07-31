/*
 * 辅助工具对象
 */
define(function (require) {
	/*
	 * 核心文件引用及模块对象定义
	 */
	var utils = {};

	/*
	 * 依赖模块引入
	 */
	var $ = require('jquery');



	/*
	 * 封装的ajax请求方法
	 * @param url 相对路径
	 * @param data 参数
	 * @param success 请求成功后的回调函数
	 * @param error 请求失败后的回调函数
	 * @param async 是否异步ture/false
	 */
	function _ajax (url, data, success, error, async) {
		// TODO: 统一检查根路径
		// TODO: 统一加载面板处理
		if (typeof async !== 'boolean') {
			async = true;
		}

		if (url.indexOf('http://') != 0 && url.indexOf('https://') != 0) {
			url = (basePath || ctx || '') + url;
		}

		$.ajax({
			'url': url,
			'data': data,
			'async': async,
			'timeout': 60 * 1000,
			'type': 'POST',
			'dataType': "json",
			'contentType': "application/x-www-form-urlencoded; charset=utf-8",
			'cache': false,
			'success': function (response) {
				success && success(response);
			},
			'error': function (request, status, e) {
				console.error('Ajax请求响应异常：request=' + JSON.stringify(request));
				console.error('Ajax请求响应异常：status=' + JSON.stringify(status));
				console.error('Ajax请求响应异常：e=' + JSON.stringify(e));
				error && error(status, e);
			}
		});
	}

	/*
	 * ajax同步请求
	 * @param url 请求地址
	 * @param data 请求参数
	 * @param success 请求成功后的回调函数
	 * @param error 请求失败后的回调函数
	 */
	function _sync (url, data, success, error) {
		_ajax(url, data, success, error, false);
	}

	/*
	 * 获取数据类型
	 */
	function _getType (val) {
		return Object.prototype.toString.call(val);
	}

	/*
	 * 判断是否为空
	 * @param obj
	 * @returns {Boolean}
	 */
	function _isNull (val) {
		return val === undefined || val === null || val === 'undefined';
	}

	/*
	 * 判断是否不为空
	 * @param obj
	 * @returns {Boolean}
	 */
	function _notNull (val) {
		return !_isNull(val);
	}

	/*
	 * 是否为数组
	 * @param val
	 * @returns {Boolean}
	 */
	function _isArray (val) {
		var result = (val instanceof Array) || (_getType(val) === '[object Array]');
		return result;
	}

	/*
	 * 是否不是数组
	 */
	function _notArray (obj) {
		return !_isArray(obj);
	}
	
	/*
	 * 是否为对象
	 * @param val
	 * @returns {Boolean}
	 */
	function _isObject (val) {
		var result = (val instanceof Object) || (_getType(val) === '[object Object]');
		return result;
	}

	/**
     * 时间转字符串
     * @param date
     * @param type
     * @returns {String}
	 */
	function _formatterDate(date,type) {
		if(_isNull(date)){
			date = new Date($.ajax({async: false}).getResponseHeader("Date"));
			//return null;
		}
		var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
		var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
				+ (date.getMonth() + 1);
		var hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
		var seconds = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
		var minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
		if(type == "yyyy-mm-dd"){
			return date.getFullYear() + '-' + month + '-' + day;
		}else if(type == "yyyymmdd"){
			return date.getFullYear()+''+ month +''+ day;
		}else if(type == "hh:mi:ss"){
			return hours + ":" + minutes + ":" + seconds;
		}else if(type == "hh:mi"){
			return hours + ":" + minutes;
		}else if(type == "yyyy-mm-dd hh:mi:ss"){
			return date.getFullYear() + '-' + month + '-' + day + " " + hours + ":" + minutes + ":" + seconds;
		}else if(type == "yyyy-mm-dd hh:mi"){
			return date.getFullYear() + '-' + month + '-' + day + " " + hours + ":" + minutes;
		}else if(type == "yyyymmddhhmiss"){
			return date.getFullYear() + month + day + hours + minutes + seconds+'';
		}else{
			return date.getFullYear() + '-' + month + '-' + day;
		}
	}
	/**
	 * 字符串转时间
	 */
	function _formatterStrDate(str){
		str = str.replace(/-/g,"/");
		var date = new Date(str);
		return date;
	}
	/**
	 * 日期天数加1
	 * @param date
	 * @param type
	 * @param dayNum
	 */
	function _addDate(date,type,dayNum) {
		if(typeof date == "string"){
			date = _formatterStrDate(date);
		}
		dayNum = _isNull(dayNum) ? 1 : dayNum;
		date = date.getTime() + dayNum * 24 * 60 * 60 * 1000;
	    var result = new Date(date);
	    return _formatterDate(result,type);
	}
	/**
	 * Array contains 方法
	 * 检查传入的值是否被一个Array包含
	 */
	Array.prototype.contains = function (obj){
		var i = this.length;
		while(i--){
			if(this[i] == obj){
				return true;
			}
		}
		return false;
	};
	// 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	// 例子： 
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	Date.prototype.Format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	/**
	 * 传入毫秒数 得到 XX时XX分XX秒
	 */
	function _getTimeDiff(time){
		var result = '';
		var hour = parseInt(time/(60*60*1000));//计算整数小时数
		if(hour>0) result += hour +'时';
		var min = parseInt((time - hour*60*60*1000)/(60*1000)); //计算剩余分钟数
		if(min>0)  result += min +'分';
		var afterMin = time - hour*60*60*1000 - min*60*1000
		var ss = parseInt((time - hour*60*60*1000 - min*60*1000)/1000);  //计算剩余秒数
		if(ss>0)  result += ss +'秒';
		return result;
	}
	/*
	 * 发布方法
	 */
	try {
		
		// 针对类似frame框架的模型化处理
		try {
			var hz = window.top.hz;
			if (hz) {
				utils = hz.utils;
				if (utils) {
					return utils;
				}
			} else {
				hz = window.top.hz = {};
			}
			utils = hz.utils = {};
		} catch (e) {
			console.error('hz.utils：引用顶层父级utils对象失败...');
		}

		utils.ajax = _ajax;
		utils.sync = _sync;
		utils.isNull = _isNull;
		utils.notNull = _notNull;
		utils.isArray = _isArray;
		utils.notArray = _notArray;
		utils.isObject=_isObject;
		utils.formatterDate = _formatterDate;
		utils.formatterStrDate = _formatterStrDate;
		utils.addDate = _addDate;
		utils.getTimeDiff = _getTimeDiff;
		return utils;
	} catch (e) {
		console.error('初始化 --> 辅助工具模块失败：' + e);
	}
});