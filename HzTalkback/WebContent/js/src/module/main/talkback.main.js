/**
 * 
 */
define(function(require){
	require('jquery');

	var hzEvent = require('frm/hz.event');
	var dialog = require('frm/dialog');
	var videoClient = require('frm/hz.videoclient');
	var talkbackConfig = require('cds/talkback/talkbackConfig');
	var timerTask = require('frm/timerTask');

	try {
		// 初始化数据
		videoClient.setTalkConfigObj(talkbackConfig);
		timerTask.createTimerTask(); //加载定时任务

		// 加载页面插件
		hzEvent.call('index.load.page', '#talkbackMini', 'page/cds/talkback/talkback_mini.html');

		// 加载JS模块
		require(['cds/talkback/message/talkbackMessageHandle']);

		console.info('初始化 --> 对讲子模块');
	} catch (e) {
		console.error('初始化 --> 对讲子模块异常：', e);
	}
});