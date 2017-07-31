/**
 * 房间标注的扩展对象
 */
define(function (require) {
	var mapHandle = require('hz/map/map.handle'),
		hzEvent = require('frm/hz.event'),
		user = require('frm/loginUser'),
		db = require('frm/hz.db');

	var basePath = basePath || '';
	var showRoomName = false;

	/*
	 * 房间标注对象
	 */
	function RoomLabelExtend () {
		var self = this;
		
		this.labelDataList = [];
		this.labelPointMap = {};

		// 监听定位加载数据
		hzEvent.subs('hz.location.data.onload', function (hzMap, loadNo, viewId) {
			self.loadLabels(loadNo, viewId);
		});

		// 监听定位清除数据
		hzEvent.subs('hz.location.data.onclear', function () {
			self.clearLabels();
		});

		// 检测键盘的CTRL按键，按下之后显示房间标注
		window.top.addEventListener('keydown', function (event) {
			if (event.ctrlKey && mapHandle.handleStatus == mapHandle.NORMAL) {	// 按下CTRL并地图处于正常状态时
				if (!showRoomName) {
					self.visibleLabel(showRoomName = true);
				}
			}
		});

		// 检测键盘的CTRL按键，按下之后显示房间标注
		window.top.addEventListener('keyup', function (event) {
			if (showRoomName) {
				self.visibleLabel(showRoomName = false);
			}
		});
	}


	/*
	 * 显示隐藏房间标注
	 * @param visible true显示/false隐藏
	 */
	RoomLabelExtend.prototype.visibleLabel = function (visible) {
		for(var key in this.labelPointMap) {
			this.labelPointMap[key].setVisible(visible);
		}
	}


	/*
	 * 加载房间的标注点位
	 */
	RoomLabelExtend.prototype.loadLabels = function (loadNo, viewId) {
		var thiz = this;
		db.query({
			request: {
				sqlId: 'select_label_points_for_map_handle',
				whereId: 1,
				params: [user.cusNumber, viewId, 2]
			},
			success: function (array) {
				if (loadNo == mapHandle._loadNo && array) {
					while(array.length) {
						thiz.addLabel(array.shift());
					}
				}
			},
			error: function (code, desc) {
				console.error('加载模型组件失败：' + code + '-' + desc);
			}
		});
	}


	/*
	 * 添加标注点位
	 */
	RoomLabelExtend.prototype.addLabel = function (data) {
		var thiz = this;
		var image = data.lpi_show_icon;

		mapHandle.addLabelPoint({
			'id': data.lpi_point_id,
			'html': data.html,
			'text': data.lpi_show_text,
			'type': data.lpi_point_type,
			'image': (image ? basePath : '') + image,
			'minDis': data.lpi_dis_min,
			'maxDis': data.lpi_dis_max,
			'lineHeight': data.lpi_line_height,
			'position': {
				'x': parseFloat(data.lpi_pos_x),
				'y': parseFloat(data.lpi_pos_y),
				'z': parseFloat(data.lpi_pos_z)
			},
			'className': 'label-room',
			'data': data
		}, {
			click: function (event, data, temp) {
				// 单点击标志时，阻止window对象的事件冒泡（防止点击地图模型操作）
				window.event.stopPropagation();

				temp = event.data.data;
				mapHandle.flyTo({
					'posX': temp.lpi_view_pos_x,
					'posY': temp.lpi_view_pos_y,
					'posZ': temp.lpi_view_pos_z,
					'rotX': temp.lpi_view_rot_x,
					'rotY': temp.lpi_view_rot_y,
					'rotZ': temp.lpi_view_rot_z,
					'tarX': temp.lpi_view_tar_x,
					'tarY': temp.lpi_view_tar_y,
					'tarZ': temp.lpi_view_tar_z
				});
			}
		}, function (obj, data) {
			obj.setVisible(false);
			thiz.labelDataList.push(data);
			thiz.labelPointMap[data.id] = obj;
		});
	}


	/*
	 * 清除标注点位
	 */
	RoomLabelExtend.prototype.clearLabels = function () {
		while(this.labelDataList.length) {
			mapHandle.removeLabelPoint(this.labelDataList.shift().id);
		}
		this.labelPointMap = {};
	}



	// 针对类似frame框架的模型化处理
	try {
		// 如果已经初始化则直接返回对象
		var hz = window.top.hz;
		if (hz) {
			if (hz.roomLabelExtend) {
				console.log('roomlabel.extend：引用顶层父级RoomLabelExtend对象...');
				return hz.roomLabelExtend;
			}
		} else {
			hz = window.top.hz = {};
		}

		console.log('初始化 --> 三维地图房间标注扩展模块...');
		return hz.roomLabelExtend = new RoomLabelExtend();
	} catch (e) {
		console.log('初始化 --> 三维地图房间标注扩展模块...', e);
	}
});