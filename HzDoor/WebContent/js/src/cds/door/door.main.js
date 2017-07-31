/**
 * 说明：此模块功能已移到了js/src/module/main/目录下，此模块已废弃不在使用
 */
define(function(require){
	require('jquery');

	var dialog = require('frm/dialog');
	var hzEvent = require('frm/hz.event');

	function initRightNav () {
		try {
			/*
			 * 初始化门禁框选菜单
			 */
		    hzEvent.load('hz.rightnav', function (rightNav) {
		    	var jqNav = rightNav.add('doorSelect', '门禁框选', 'doorSelect');
		    	if (jqNav) {
		    		jqNav.on("click",function(){
			    		dialog.open({
			    			id:'9999999032',
			    			title:'等待框选。。。',
			    			type:2,
			    			w:'50',
			    			h:'40',
			    			url:'page/cds/door/doorSelect/doorSelect.html',
			    			skin:'doorSelect'
			    		});
			    	});
		    	}
		    });
		} catch (e) {
			console.error(e);
		}
	}

	try {
		$(window.document.head).append('<link rel="stylesheet" href="css/cds/door/door.main.css" charset="utf-8">');
		initRightNav();
		console.log('初始化门禁模块...');
	} catch (e) {
		console.log('初始化门禁模块异常：', e);
	}
});