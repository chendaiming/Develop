/**
 * 
 */
define(function(require){
	var hzEvent = require('frm/hz.event');
	var dialog = require('frm/dialog');

	require('jquery');

	try {
		// 模块数据
		var moduleData = {
			alarmLevelSqlIds: {}	// 报警等级配置的SQL，格式:{'设备类型': 'SQLID'}
		};

		// 加载页面插件
		hzEvent.call('index.load.page', '#alarmHandle', 'page/cds/alarm/alarmHandle.html');
		
		// 获取报警模块的数据
		hzEvent.on('alarm.main.data', function () {
			return moduleData;
		});

		hzEvent.init('alarm.main', moduleData);


		require(['cds/alarm/addAlarmPlan'],function(vp){
			vp.initMenu('#addAlarmPlanSection');
		});

		console.info('初始化 --> 报警处理模块');
	} catch (e) {
		console.error('初始化 --> 报警处理模块异常：', e);
	}
});