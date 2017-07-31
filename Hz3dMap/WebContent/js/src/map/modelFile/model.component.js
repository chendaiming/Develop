/**
 * 地图模型
 */
define(function (require) {
	var user = require('frm/loginUser'),
		db = require('frm/hz.db');

	// 模型组件信息列表
	var MODEL_COMPONENT_LIST = [];



	try {
		console.log('初始化 --> 地图模型组件列表...');

		/*
		 * 存放信息
		 */
		function _push (id, name, path, obj, mtl, classFlag, typeFlag, defaultFlag) {
			MODEL_COMPONENT_LIST.push({
				'id':id, 
				'name':name, 
				'path': path, 
				'obj':obj, 
				'mtl': mtl,
				'class_flag': classFlag,
				'type_flag': typeFlag,
				'default_flag': defaultFlag || 0	// 默认标识：0 否，1 是
			});
		}

		// 初始化组件信息
//		_push(1001, '摄像机(枪机)', 'models/sxt/qjsxt_x5_003/', 'qjsxt_x5_003.obj', 'qjsxt_x5_003.mtl', 1, 0, 1);
//		_push(1002, '摄像机(球机)', 'models/mkjy/sxt/yxsxt/', 'mkjy_yxsxt.obj', 'mkjy_yxsxt.mtl', 1, 2, 0);
//		_push(1003, '门禁', 'models/mkjy/mj/', 'mkjy_mj_001.obj', 'mkjy_mj_001.mtl', 2, 0, 1);
//		_push(1004, '对讲', 'models/mkjy/mj/', 'mkjy_mj_001.obj', 'mkjy_mj_001.mtl', 3, 0, 1);
//		_push(1005, '网络报警器', 'models/bjq/', 'bjq_red_2.obj', 'bjq_red_2.mtl', 6, 0, 1);
//		_push(1006, '床(上下床)', 'models/bed/', 'bed_T01701.obj', 'bed_T01701.mtl', 99, 0, 1);

		db.query({
			request: {
				sqlId: 'select_model_component_list',
				whereId: 0,
				orderId: 0,
				params: [user.cusNumber]
			},
			success: function (array) {
				if (array) {
					MODEL_COMPONENT_LIST = [];

					var T = null;
					for(var i = 0; i < array.length; i++) {
						T = array[i];
						_push(T.id, T.name, T.path, T.file_name1, T.file_name2, T.class_flag, T.type_flag, T.type_def);
					}
					console.log('地图模型组件列表初始化完成...');
				}
			}
		});


		return {
			getComponents: function () {
				return MODEL_COMPONENT_LIST;
			}
		}
	} catch (e) {
		console.error('初始化地图模型组件列表失败：', e);
	}
});