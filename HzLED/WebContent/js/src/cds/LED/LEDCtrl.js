/**
 * 
 */
define(function (require) {
	/*
	 * 依赖对象
	 */
	var hzEvent = require('frm/hz.event');
	var utils = require('frm/hz.utils');
	var user = require('frm/loginUser');
	var db = require('frm/hz.db');

	var linkLEDMap = {};

	/*
	 * 发送消息
	 */
	function sendMsg (id, text, success, error) {
		utils.ajax('LEDCtrl/sendMsg', {
			cusNumber: user.cusNumber,
			msgBody: JSON.stringify({
				ledId: id,
				fontColor: '',
				fontSize: '',
				content: text,
				remark: ''
			})
		}, success, error);
	}

	/*
	 * 取消显示
	 */
	function cancelShow (vm) {
		try {
			var recordId = vm.alarmRecord.recordId;
			var data = linkLEDMap[recordId];

			if (data) {
				for(var i = 0; i < data.length; i++) {
					// LED显示设备那边是更加显示文字来判断是否报警的，所以取消报警就随便输入文字了
					// 初步商定传入"时间" 在取消并显示时间
					sendMsg(data[i].lbd_id, '时间');
				}
				delete linkLEDMap[recordId];
			}
		} catch (e) {
			console.warn('取消LED设备显示错误：', e);
		}
	}

	try {
		// 订阅报警扩展处理
		hzEvent.subs('alarm.handle.extend', 'LEDCTRL', function (vm, text) {
			if (vm) {
				var deptId = vm.alarmRecord.deptId;

				if (deptId) {
					db.query({
						request: {
							sqlId: 'select_led_id_for_alarm_handle',
							whereId: 0,
							params: [user.cusNumber, deptId]
						},
						success: function (result) {
							if (result && result.length) {

								// 记录信息提供给后面的取消使用
								linkLEDMap[vm.alarmRecord.recordId] = result;

								for(var i = 0; i < result.length; i++) {
									sendMsg(result[i].lbd_id, vm.alarmRecord.alarmName + '报警');
								}
							} else {
								console.warn('部门编号['+deptId+']下没有获取到LED设备信息，无法发送LED消息，result=', result);
							}
						},
						error: function (code, desc) {
							console.warn('获取LED设备编号错误：' + code + desc);
						}
					});
				}
			}
		});

		hzEvent.subs('alarm.handle.dispose', 'LEDCTRL', cancelShow);
		hzEvent.subs('alarm.handle.cancel', 'LEDCTRL', cancelShow);

		console.log('初始化LEDCtrl成功');
	} catch (e) {
		console.error('初始化LEDCtrl异常：', e);
	}

	return {
		sendMsg: sendMsg
	};
});