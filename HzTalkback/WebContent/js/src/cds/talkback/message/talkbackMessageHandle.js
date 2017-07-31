/**
 * 
 */
define(function (require) {
	/*
	 * 依赖引入
	 */
	var hzVideo = require('frm/hz.videoclient');
	var hzMap = require('hz/map/map.handle');
	var hzMsg = require('frm/message');

	/*
	 * 常量定义
	 */
	var DVCTYPE = {
		'CAMERA': 1	
	};


	/*
	 * 订阅受虐对讲呼叫的消息
	 */
	function subsMessage () {
		var webmessage = window.top.webmessage;
		
		if (webmessage) {
			webmessage.on('FIGHTTALK001', 'FIGHTTALK.LINK.HANDLE', function (message) {
				if (message) {
					var data = message.msg;
					if (data) {
						var baseInfo = data.baseInfo || {};
						var text = baseInfo.frd_call_talk_name + '正在请求受虐对讲呼叫,是否联动地图?';
						hzMsg.confirm(text, function () {
							linkDvcHandle(data.linkDvcs);
							viewPosition(data.pointView);
						}, null, '受虐对讲呼叫', ['联动', '取消']);
					}
				}
			});
		} else {
			setTimeout(subsMessage, 1000);	// 消息对象不存在则1秒后重新尝试
		}
	}

	/*
	 * 关联设备联动处理
	 */
	function linkDvcHandle (data) {
		try {
			if (data) {
				var array = [];

				for(var i = 0; i < data.length; i++) {
					if (data[i].dvc_type == DVCTYPE.CAMERA) {
						array.push(data[i].dvc_id);
					}
				}

				if (array.length) {
					hzVideo.setLayout(array.length);
					hzVideo.play(array);
				} else {
					hzMsg.alert('未关联视频联动设备!');
				}
			}
		} catch (e) {
			console.error('受虐对讲呼叫 --> 关联设备联动处理异常:', e);
			console.error('受虐对讲呼叫 --> 关联设备联动处理数据:', data);
		}
	}


	/*
	 * 视角定位
	 */
	function viewPosition (data) {
		if (data && data.length) {
			try {
				hzMap.location(data[0].mpi_view_id, {
					posX: data[0].mpi_view_pos_x, 
					posY: data[0].mpi_view_pos_y, 
					posZ: data[0].mpi_view_pos_z, 
					rotX: data[0].mpi_view_rot_x, 
					rotY: data[0].mpi_view_rot_y, 
					rotZ: data[0].mpi_view_rot_z, 
					tarX: data[0].mpi_view_tar_x, 
					tarY: data[0].mpi_view_tar_y, 
					tarZ: data[0].mpi_view_tar_z
				});
			} catch (e) {
				console.error('受虐对讲呼叫 --> 视角定位异常：', e);
			}
		} else {
			hzMsg.alert('地图联动定位失败，没有获取到关联视角!');
		}
	}

	subsMessage();
});