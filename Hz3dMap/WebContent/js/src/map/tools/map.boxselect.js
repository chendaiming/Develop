/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');

	var ctrlStatus = false;
	var eventFlag = true; // 事件标识，表示第一次初始化
	var typeFlag = null;



	/*
	 * 地图框选
	 */
	function BoxSelect (parent) {
		this.parent = parent;
		this.hzThree = parent.hzThree;
		this.status = false;	// 状态
		this.ctrlKey = false;	
		this.params = null;
		this.selectedObjs = [];
		this.selectedTime = null;

		var self = this;

		/*
		 * 通过ctrl按键来激活框选
		 */
		this.selectListener = function (event) {
			if (event.ctrlKey) {
				if (!self.ctrlKey) {
					self.ctrlKey = true;
					self.enabledBoxSelect();
				}
			} else {
				self.ctrlKey = false;
				self.disabledBoxSelect();
			}
		}


		/*
		 * 鼠标弹起
		 */
		this.mouseup = function () {
			// 释放被框选的点位（当框选时间和鼠标弹起时间间隔小于100 时，则判断它们属于同一操作，大于这个时间之后表示需要释放）
			if (parent.notDragMap()) {
				if (self.selectedTime && (getTime() - self.selectedTime > 100)) {
					self.selectedTime = null;
					self.cancelSelected();
				}
			}
		}

		
	}


	/*
	 * 激活事件
	 */
	BoxSelect.prototype._enabledEvents = function () {
		hzEvent.bind(window.top, 'keydown', this.selectListener);
		hzEvent.bind(window.top, 'keyup', this.selectListener);
		hzEvent.bind(window.top, 'mouseup', this.mouseup);
	}


	/*
	 * 禁止事件
	 */
	BoxSelect.prototype._disabledEvents = function () {
		hzEvent.unbind(window.top, 'keydown', this.selectListener);
		hzEvent.unbind(window.top, 'keyup', this.selectListener);
		hzEvent.unbind(window.top, 'mouseup', this.mouseup);
	}


	/*
	 * 获取BoxSelect对象
	 */
	BoxSelect.prototype.getBoxSelect = function () {
		return this.parent.hzThree.BoxSelect;
	};


	/*
	 * 获取BoxSelect对象
	 */
	BoxSelect.prototype.enabledBoxSelect = function () {
		if (this.status) {
			this.getBoxSelect().setIsBoxSelect(true);
			this.getBoxSelect().setCheckType(this.parent.MODELPOINT);
			console.log('进入地图框选状态...');
		}
	};


	/*
	 * 获取BoxSelect对象
	 */
	BoxSelect.prototype.disabledBoxSelect = function () {
		if (this.status) {
			this.getBoxSelect().setIsBoxSelect(false);
			console.log('退出地图框选状态...');
		}
	};



	/*
	 * 设置框选状态
	 * @param status 状态：true开启编辑、false关闭编辑
	 * @param params 选取参数对象：{
	 * 		"selectMode": "框选的模式：1.矩形框选（默认）",
	 * 		"objectTypes"："框选的模型类型集合：[], 类型：1.点位（默认）"
	 * 		"dvcTypes": "设备类型：[]"
	 * }
	 */
	BoxSelect.prototype.setSelectStatus = function (status, params) {
		// 事件监听，通过ctrl来激活框选
		if (status) {
			if (!this.status) {
				this.status = true;
				console.log('地图框选功能已开启...');

				this.params = params || {};

				var dvcTypes = this.params.dvcTypes;
				if (dvcTypes) {
					if (typeof dvcTypes != 'object') {
						this.params.dvcTypes = [dvcTypes];
					}
				}

				this.parent.setHandleStatus(this.parent.BOXSELECT);
				this._enabledEvents();

				if (this.ctrlKey) {
					this.enabledBoxSelect();
				}
			}
		} else {
			if (this.status) {
				this.parent.setHandleNormal();
				this.disabledBoxSelect();
				this.cancelSelected();
				this.status = false;
				this._disabledEvents();
				console.log('地图框选功能已关闭...');
			}
		}
	};


	/*
	 * 设置框选参数
	 * @param params 选取参数对象：{
	 * 		"selectMode": "框选的模式：1.矩形框选（默认）",
	 * 		"objectTypes"："框选的模型类型集合：[], 类型：1.点位（默认）"
	 * }
	 */
	BoxSelect.prototype.setSelectParams = function (params) {
		this.getBoxSelect().setSelectParams(params);
	};


	/*
	 * 框选事件
	 * @param callback 	事件处理函数
	 * @param name		事件注册标识
	 */
	BoxSelect.prototype.onSelect = function (callback, name) {
		var self = this;
		var parent = this.parent;

		this.offSelect(name || callback);
		hzEvent.subs('map.handle.boxselect.onselect', name, callback);

		if (eventFlag) {
			eventFlag = false;
			this.hzThree.BoxSelect.on('pick_up_box_select', function (event) {
				if (self.status) {
					var array = [], model, data, filter = self.params.dvcTypes;

					self.cancelSelected();

					if (event.data) {
						for(var i = 0; i < event.data.length; i++) {
							model = event.data[i];
							data = model.hzParams;

							if (data) {
								if (filter && filter.length) {
									for(var j = 0; j < filter.length; j++) {
										if (data.type == filter[j]) {
											model.onBorder(false);
											model.setBorderShow(true);
											self.selectedObjs.push(model);
											array.push(data);
											break;
										}
									}
								} else {
									array.push(data);
								}
							}
						}
					}

					self.selectedTime = getTime();
					hzEvent.emit('map.handle.boxselect.onselect', array);
				}
			});
		}
	};


	/*
	 * 取消选中
	 */
	BoxSelect.prototype.cancelSelected = function (model) {
		while(this.selectedObjs.length) {
			model = this.selectedObjs.shift();
			model.onBorder(true);
			model.setBorderShow(false);
		}
	}


	/*
	 * 框选事件
	 * @param callback 	事件处理函数 | 事件注册标识
	 */
	BoxSelect.prototype.offSelect = function (arg0) {
		hzEvent.unsubs('map.handle.boxselect.onselect', arg0);
	}



	/*
	 * 获取时间
	 */
	function getTime () {
		return (new Date()).getTime();
	} 




	return BoxSelect;
});