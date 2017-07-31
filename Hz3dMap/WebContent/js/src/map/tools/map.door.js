/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');

	var openEventFlag = true;
	var closeEventFlag = true;


	/*
	 * 地图开关门
	 */
	function Door (parent) {
		this.parent = parent;
		this.hzThree = parent.hzThree;
	}


	/*
	 * 是否已打开
	 * @param mid 模型编号
	 * @return 门状态：true-已开、false-已关
	 */
	Door.prototype.hasOpen = function (mid) {

	};


	/*
	 * 开门
	 * @param mid 模型编号
	 */
	Door.prototype.open = function (mid) {
		this.hzThree.openDoor(mid);
	};


	/*
	 * 关门
	 * @param mid 模型编号
	 */
	Door.prototype.close = function (mid) {
		this.hzThree.closeDoor(mid);
	};


	/*
	 * 开门事件
	 * @param callback 	事件处理函数
	 * @param name		事件注册标识
	 */
	Door.prototype.onOpen = function (callback, name) {
		hzEvent.subs('map.handle.door.onopen', name, callback);

		if (openEventFlag) {
			openEventFlag = false;
			this.hzThree.on(this.hzThree.HzEvent.OPEN_DOOR_OVER, function (event) {
				hzEvent.emit('map.handle.door.onopen');
			});
		}
	};


	/*
	 * 关门事件
	 * @param callback 	事件处理函数
	 * @param name		事件注册标识
	 */
	Door.prototype.onClose = function (callback, name) {
		hzEvent.subs('map.handle.door.onclose', name, callback);

		if (closeEventFlag) {
			closeEventFlag = false;
			this.hzThree.on(this.hzThree.HzEvent.CLOSE_DOOR_OVER, function (event) {
				hzEvent.emit('map.handle.door.onclose');
			});
		}
	};


	return Door;
});