define(function(require){
	// 框架对象
	var hz = window.top.hz || (window.top.hz = {});

	/*
	 * 加载框架模块
	 */
	var	event = require('frm/hz.event'),
		utils = require('frm/hz.utils'),
		db = require('frm/hz.db');

	/*
	 * 加载第三方模块
	 */
	var $ = require('jquery'),
		fastClick = require('fastclick');


	$(function() {
		fastClick.attach(document.body);
	});

	/*
	 * 发布模块
	 */
	hz.event = event;				// 事件处理
	hz.utils = utils;				// 辅助工具
	hz.db = db;						// 通用数据操作
	hz.closeDialog = function(){    // 在当前dialog页面 关闭自己 直接调用该方法
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(index);
	};
	return hz;
});
