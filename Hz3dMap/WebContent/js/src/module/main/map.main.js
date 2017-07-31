/**
 * 三维地图模块主函数
 */
define(function (require) {
//	var loginUser = require('frm/loginUser');
	var mapHandle = require('hz/map/map.handle');
	var message = require('frm/message');
	var hzEvent = require('frm/hz.event');
	var hzDB = require('frm/hz.db');

	try {

		/*
		 * 地图模型视角定位
		 * @param cusNumber 机构号
		 * @param modelName 模型名称
		 */
		hzEvent.on('map.model.view.location', function (cusNumber, modelName, callback) {
			hzDB.query({
				'request': {
					'sqlId': 'query_model_bind_map_view',
					'params': [cusNumber, modelName]
				},
				'success': function (list) {
					if (list && list.length) {
						// 订阅视角飞行结束通知
						hzEvent.subs('hz.fly.over', 'model.position', function () {
							hzEvent.unsubs('hz.fly.over', 'model.position');
							callback && callback();
						});

						// 视角定位
						mapHandle.flyTo({
							'posX': list[0].mvb_pos_x,
							'posY': list[0].mvb_pos_y,
							'posZ': list[0].mvb_pos_z,
							'rotX': list[0].mvb_rot_x,
							'rotY': list[0].mvb_rot_y,
							'rotZ': list[0].mvb_rot_z,
							'tarX': list[0].mvb_tar_x,
							'tarY': list[0].mvb_tar_y,
							'tarZ': list[0].mvb_tar_z
						});
					} else {
						console.warn('模型[' + modelName + ']未绑定视角!');
						callback && callback();
					}
				},
				'error': function (code, msg) {
					console.warn('查询地图模型视角失败:' + code + msg);
					callback && callback();
				}
			});
		});


		// 加载页面插件
		//hzEvent.call('index.load.page', '#viewMenuAdd', 'page/map/viewMenu/viewMenuAdd.html');
		hzEvent.call('index.load.page', '#addPointPanel', 'page/map/mapPoint/mapPoint.html');
		hzEvent.call('index.load.page', '#roomDetail', 'page/map/roomDetail/roomDetail.html');

		require(['hz/map/mapPoint/pointRightMenu']);
		require(['hz/map/tools/map.headtitle']);
		require(['hz/map/diagram/diagram']);

		console.info('初始化 --> 三维地图子模块');
	} catch (e) {
		console.error('初始化 --> 三维地图子模块异常：', e);
	}
});