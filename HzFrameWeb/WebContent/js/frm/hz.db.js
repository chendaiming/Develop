/*
 * 数据库通用操作对象
 */
define(function (require) {
	/*
	 * 依赖模块引入
	 */
	var utils = require('frm/hz.utils'); // 加载辅助模块

	/*
	 * 核心文件引用及模块对象定义
	 */
	var db = {};

	/*
	 * 私有属性
	 */
	var _emptyFn = function () {};	// 空函数
	var _basePath = '';				// 后端请求的URL根路径



	/*
	 * Ajax请求
	 * @param url		请求地址
	 * @param args		请求参数
	 * @param success	请求响应成功处理
	 * @param error		请求响应失败处理
	 * @param async		是否异步（默认true）
	 */
	function _ajax (url, args, success, error, async) {

		if (url.indexOf('http://') != 0 && url.indexOf('https://') != 0) {
			url = _basePath + url;
		}

		if (typeof async !== 'boolean') {
			async = true;
		}

		// 请求处理
		utils.ajax(url, args, success, error, async);
	}


	/*
	 * DB请求控制器
	 * @param options 参数对象：options = {
	 * 		"request": "请求参数对象",
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：data, result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：errorCode, errorMsg",
	 * 		"async": "是否异步（可选，默认异步），参数true|false"
	 * }
	 */
	function _request (method, options) {
		/*
		 * 处理缺省参数
		 */
		var success = options.success || _emptyFn;
		var error = options.error || _emptyFn;
		var async = options.async;

		// 请求地址及参数
		var url = 'dbCtrl/' + method;
		var args = {'args': JSON.stringify(options.request)};

		_ajax(url, args, 
			function (result) {
				if (result) {
					if (result.success) {
						success(result.data, result);
					} else {
						error(result.respCode, result.respMsg);
					}
				} else {
					error('', '请求失败，服务器处理错误~!');
				}
			},
			function () {
				error('', '请求失败，服务器响应超时~!');
			},
			async
		);
	}


	/*
	 * =========================================查询的控制器========================================
	 * 使用说明：
	 * 1. params参数：params数据是Array类型按"?"参数处理，是Map类型按"键值对"参数处理
	 * 2. 使用分页时返回数据格式：{"count":"", "data": [{}]}，其中count是查询的总数量，data是返回的数据
	 * 3. 未使用分页时返回数据格式：[{}]
	 * 
	 * @param options 参数对象：options = {
	 * 		"request":{
	 * 			"sql": "SQL语句（和sqlId属性必选其一，优先选择此属性，暂未开放）",
	 * 			"sqlId": "SQL语句编号（和sql属性必选）", 
	 * 			"whereId": "SQL条件编号（可选）", 
	 * 			"orderId": "SQL排序编号（可选）", 
	 * 			"params": "SQL参数集合（可选，params数据是Array类型按"?"参数处理，是Map类型按"键值对"参数处理）",
	 * 			"pageIndex": "当前第几页（可选，pageIndex和pageSize必须同时存在）",
	 * 			"pageSize": "每页显示多少行（可选，pageIndex和pageSize必须同时存在）",
	 * 			"minRow": "分页查询的最小行（可选，如果不传会根据pageIndex和pageSize自动计算）",
	 * 			"maxRow": "分页查询的最大行（可选，如果不传会根据pageIndex和pageSize自动计算）"
	 * 		},
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：data, result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：errorCode, errorMsg",
	 * 		"async": "是否异步（可选，默认异步），参数true|false"
	 * }
	 * 
	 * @return 返回的data数据格式：
	 * data = [{}, ...]
	 * data = {
	 * 		"count": "查询的总数量",
	 * 		"data": "查询的数据，格式：[{}]"
	 * }
	 */
	function _query (options) {
		// 默认走"?"参数形式的处理
		var request = options.request;
		var params = null;
		var method = 'query';

		// 批量查询去第一个条件来判断，并且批量查询不支持分页
		if (utils.notArray(request)) {
			setPagingParams(request);
			params = request.params;
		} else {
			params = request[0].params;
		}

		// 根据参数对象类型判断是走"?"参数形式的处理还是"键值对"参数形式的处理
		if (params && utils.notArray(params)) {
			method = 'queryByParamKey';
		}

		_request(method, options);
	}


	/*
	 * 分页查询的控制器
	 */
	function _page (options) {
		_query(options);
	}


	/*
	 * 更新（删除）控制器（request可以为单个对象，也可以为对象数组）
	 * @param options 参数对象：options = {
	 * 		"request":[{
	 * 			"seqParams": "生成序列号参数集合,格式：[在params集合中的索引, 表名, 表字段]"
	 * 			"sqlId": "SQL语句编号（和sql属性必选）", 
	 * 			"whereId": "SQL条件编号（可选）", 
	 * 			"orderId": "SQL排序编号（可选）", 
	 * 			"params": "SQL参数或集合，格式：[] 或  [[]]",
	 * 			"paramsType": "SQL参数类型，格式{"index":"type"}（和params一起使用，可选）",
	 * 		}],
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：data, result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：errorCode, errorMsg",
	 * 		"async": "是否异步（可选，默认异步），参数true|false"
	 * }
	 * 
	 * paramsType类型的格式说明：{"index":"type"}
	 * 		index：params中参数在集合中的索引值，
	 * 		type: params中参数的数据类型，当类型是CLOB、BLOB数据类型的需要指定，其它类型暂时不需要
	 * 
	 * @param result = {
	 * 		"respCode": "响应码",
	 * 		"respMsg": "响应描述",
	 * 		"data": [{
	 * 				"seqList":"序列号集合，格式：[]",
	 * 				"result": "操作结果，格式：[]"
	 * 		}],
	 * 		"success": "数据库操作结果，true/false"
	 * }
	 */
	function _update (options) {
		_request('update', _fmtUpdateOptions(options, function (params) {
			return params[0];
		}));
	}
	
	/**
	 * @param options 参数对象：options = {
	 * 		"request":{
	 * 			"serviceName": "缓存处理类的名称"
	 * 			"action": "为add、update、delete", 
	 * 			"params": "SQL参数或集合，格式：{}
	 * 		},
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：data, result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：errorCode, errorMsg",
	 * 		"async": "是否异步（可选，默认异步），参数true|false"
	 * }
	 */
	function _refreshCache (options) {
		_request('refreshCache',options);
	}


	/*
	 * 更新（删除）控制器（request可以为单个对象，也可以为对象数组）
	 * @param options 参数对象：options = {
	 * 		"request":[{
	 * 			"sqlId": "SQL语句编号（和sql属性必选）", 
	 * 			"whereId": "SQL条件编号（可选）", 
	 * 			"orderId": "SQL排序编号（可选）", 
	 * 			"params": "SQL参数或集合，格式：{} 或  [{}]",
	 * 		}],
	 * 		"success": "处理成功回调函数（可选），函数接受两个参数：data, result",
	 * 		"error": "处理失败回调函数（可选），函数接受两个参数：errorCode, errorMsg",
	 * 		"async": "是否异步（可选，默认异步），参数true|false"
	 * }
	 * 
	 * @param result = {
	 * 		"respCode": "响应码",
	 * 		"respMsg": "响应描述",
	 * 		"data": [{
	 * 				"seqList":"序列号集合，格式：[]",
	 * 				"result": "操作结果，格式：[]"
	 * 		}],
	 * 		"success": "数据库操作结果，true/false"
	 * }
	 */
	function _updateByParamKey (options) {
		_request('updateByParamKey', _fmtUpdateOptions(options, function (params) {
			return params;
		}));
	}


	/*
	 * 格式化查询请求的参数
	 */
	function setPagingParams (request) {
		var index = request.pageIndex;
		var size = request.pageSize;
		var minRow = null;
		var maxRow = null;

		// pageIndex和pageSize同时存在时，计算最小行和最大行
		// minRow或maxRow不存在时，将计算的值赋给minRow或maxRow
		if (utils.notNull(index) && utils.notNull(size)) {
			minRow = (index - 1) * size;
			maxRow = index * size;
			utils.isNull(request.minRow) && (request.minRow = minRow);
			utils.isNull(request.maxRow) && (request.maxRow = maxRow);
		}

		return request;
	}


	/*
	 * 格式化新增、更新、删除请求参数
	 */
	function _fmtUpdateOptions (options, getVal) {
		var request = options.request;
		var params = null;

		// 统一转换成数组
		if (utils.notArray(request)) {
			request = options.request = [request];
		}

		for(var i = 0; i < request.length; i++) {
			params = request[i].params;

			if (params && utils.notArray(getVal(params))) {
				request[i].params = [params];
			}
		}
		return options;
	}





	/*
	 * 获取序列号
	 * @param tableName		表名
	 * @param columnName 	字段名
	 * @param callback 		回调函数（如果传入回调则异步请求，不传则同步）
	 */
	function getSeq (tableName, columnName, callback) {
		var async = false;
		var seq = null;

		// 如果传了回调函数则默认异步
		if (typeof callback == 'function') {
			async = true;
		}

		_ajax('seqCtrl/getSeq', {'tableName': tableName, 'columnName': columnName}, 
			function (result) {
				seq = result.seq;
				async && callback(seq, result.msg);
			},
			function (s, e) {
				async && callback(null, e);
			},
		async);

		return seq;
	}




	/*
	 * 注入模块方法
	 */
	try {

		function setBasePath (url) {
			_basePath = url;
		}

		// 针对类似frame框架的模型化处理
		try {
			var hz = window.top.hz;
			if (hz) {
				db = hz.db;
				if (db) {
					return db;
				}
			} else {
				hz = window.top.hz = {};
			}
			db = hz.db = {};
		} catch (e) {
			console.error('hz.db：引用顶层父级db对象失败...');
		}

		// 获取/创建模块并注入方法
		db.setBasePath = setBasePath;	// 设置后台数据访问的根路径
		db.ajax = _ajax;		// Ajax请求
		db.page = _page;		// 分页查询
		db.query = _query;		// 通用查询
		db.update = _update;	// 通用增、删、改
		db.updateByParamKey = _updateByParamKey;
		db.refreshCache = _refreshCache;//刷新后台redis缓存
		db.getSeq = getSeq;

		return db;
	} catch (e) {
		console.error('初始化 --> 数据库通用操作模块失败，' + e);
	}
});