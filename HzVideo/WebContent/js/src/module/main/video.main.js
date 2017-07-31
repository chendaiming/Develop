/**
 * 
 */
define(function(require){
	require('jquery');

	var hzEvent = require('frm/hz.event');
	//视频巡视
	require('cds/patrolPlan/notice');

	try {
		// 初始化数据
		require(['cds/video/videoRecord'],function(video){
			video.initMenu('#videoRecordSection');
		});

		console.info('初始化 --> 视频监控子模块');
	} catch (e) {
		console.error('初始化 --> 视频监控子模块异常：', e);
	}
});