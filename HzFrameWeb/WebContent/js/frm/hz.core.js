/*
 * 系统框架主函数，用于自动加载子模块功能的主函数和部分依赖函数
 */
define(function(require){
	var hzUtils = require('frm/hz.utils');
	var defPath = 'js/src/module/main';		// 各个子模块的主函数路径


	/*
	 * 初始化模块主函数
	 * @param basePath 项目的HTTP根地址
	 * @param path 子模块JS主函数的相对地址（可选，默认是绝对路径）
	 */
	function init (basePath, path) {
		console.info('开始初始化子模块主函数...');

		// 根地址自动补上斜杠
		if (basePath.substring(basePath.length-1) != '/') {
			basePath += '/';
		}

		// 处理参数
		var reqURL = (basePath || '../../') + 'moduleCtrl/loadModules';
		var jsPath = path || (basePath + defPath);

		// 地址后面自动补上斜杠
		if (jsPath.substring(jsPath.length-1) != '/') {
			jsPath += '/';
		}

		// 请求后台获取模块主函数文件列表
		hzUtils.ajax(reqURL, {'path': defPath},
			function (result) {
				if (result) {
					try {
						// 容错处理，解析JSON字符串
						if (typeof result == 'string') {
							result = JSON.parse(result);
						}
					} catch (e) {
						console.error('数据解析错误，原始数据=' + result); return;
					}

					// 开始加载模块JS
					for(var name in result) {
						try {
							// 如果是相对路径则不带后缀
							require([jsPath + (path ? name : result[name])]);
						} catch (e) {
							console.error('加载子模块主函数报错，参数=' + jsPath + name);
						}
					}
				}
			},
			function (status, error) {
				console.error('获取子模块主函数列表异常：', error);
			}
		);
	}


	try {
		console.info('初始化 --> 系统框架主函数模块');
		return {init: init};
	} catch (e) {
		console.error('初始化 --> 系统框架主函数模块异常：', e);
	}
});
