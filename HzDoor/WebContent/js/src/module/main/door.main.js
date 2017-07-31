/**
 * 
 */
define(function(require){
	require('jquery');

	var user = require('frm/loginUser');
	var message = require('frm/message');
	var dialog = require('frm/dialog');
	var hzEvent = require('frm/hz.event');
	var hzDB = require('frm/hz.db');


	/*
	 * 模型控制对象
	 */
	function ModelCtrl (type, _sqlId, _action) {
		// 私有属性
		var sqlId = _sqlId;
		var modelCtrl = this;

		// 公共属性
		this.type = type;		// 门类型
		this.nameMap = {};		// 存储已加载的门模型名称（TODO:这里要不要考虑做下存储数量限制）

		this.update = function (id, status) {
			if (this.nameMap[id]) {
				this.action(id, status, this.nameMap[id]);
			} else {
				queryInfo(id, status);
			}
		};

		this.action = function (id, status, modelName) {
//			_action(id, status, modelName);
			// 模型视角定位
			hzEvent.call('map.model.view.location', user.cusNumber, modelName, function () {
				_action(id, status, modelName);
			});
		};

		/*
		 * 查询门关联的门模型名称
		 */
		function queryInfo (id, status) {
			hzDB.query({
				'request': {
					'sqlId': sqlId,
					'whereId': 0,
					'params': [modelCtrl.type, id]
				},
				'success': function (list) {
					if (list && list.length) {
						modelCtrl.action(id, status, modelCtrl.nameMap[id] = list[0].model_name);
					} else {
						message.alert('地图模型联动失败，设备未关联模型名称');
					}
				},
				'error': function (code, msg) {
					console.error('获取设备关联的模型名称异常：' + code + '-' + msg);
				}
			});
		}
	}


	/*
	 * 门禁模型控制对象
	 */
	function DoorModelCtrl (mapHandle) {
		// 1.query_device_bind_model_name 	此SQL是查询设备和模型绑定表 
		// 2.select_door_rltn_model_name	此SQL是查询模型点位表
		// 待设备和模型绑定功能开发完成之后统一从设备模型绑定表获取模型名称来控制模型

		var dvcType = '2';
		var actions = {
			'linkage': function (id, modelName) {
				// 设备联动摄像机
				hzEvent.call('device.linkage.cameras', {
					'type': dvcType,
					'linkId': id
				});
			},
			'2': function (id, modelName) {
				mapHandle.hzThree.openDoor(modelName);
				actions.linkage(id, modelName);
			},
			'3': function (id, modelName) {
				mapHandle.hzThree.closeDoor(modelName);
				actions.linkage(id, modelName);
			}
		};


		return new ModelCtrl(dvcType, 'query_device_bind_model_name', function (id, status, modelName) {
			// 模型视角定位
			actions[status](id, modelName);
		});
	}


	/*
	 * 阻车器模型控制
	 */
	function CarArresterModelCtrl (mapHandle) {
		var dvcType = '19';
		var actions = {
			'2': mapHandle.hzThree.openArrester,
			'3': mapHandle.hzThree.closeArrester	
		};
		return new ModelCtrl(dvcType, 'query_device_bind_model_name', function (id, status, modelName) {
			actions[status](modelName);
		});
	}


	try {
		$(window.document.head).append('<link rel="stylesheet" href="css/cds/door/door.main.css" charset="utf-8">');

		/*
		 * 加载三维地图对象
		 */
		hzEvent.load('map.handle', function (mapHandle) {
			var carArresterModelCtrl = CarArresterModelCtrl(mapHandle);
			var doorModelCtrl = DoorModelCtrl(mapHandle);
			var services = {};

			// 根据类型注册模型控制对象
			services[carArresterModelCtrl.type] = carArresterModelCtrl;
			services[doorModelCtrl.type] = doorModelCtrl;

			(function init () {
				var wm = window.top.webmessage;
				if (wm) {
					// 订阅设备状态的推送消息
					wm.on('DEV001', 'DOOR.MAIN.MAP.HANDLE', function (msg) {
						console.log('DOOR.MAIN.DEV001 -->', msg);

						if (data = (msg && msg.msg)) {

							// 根据类型获取模型控制对象并执行控制操作
							if (services[data.device_type]) {
								services[data.device_type].update(data.device_id, data.device_status);
							}
						}
					});
				} else {
					setTimeout(init, 100);
				}
			})();
		});

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

	    // 模块引入
		require('hz/cds/door/cardtps/cardtips');
		console.log('初始化 --> 门禁子模块');
	} catch (e) {
		console.log('初始化 --> 门禁子模块异常：', e);
	}
});