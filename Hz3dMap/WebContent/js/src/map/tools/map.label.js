/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');


	/*
	 * 标注点位对象
	 */
	function Label (parent) {
		var self = this;

		this.parent = parent;
		this.execute = null;
		this.sphere = null;
		this.sphereCenter = null;
		this.status = false;

		// 拾取的模型对象和点位对象
		this._modelObj = null;
		this._pointObj = null;

		this._pickUpOver = 0; // 2 表示结束

		/*
		 * 模型拾取
		 */
		this._pickUpModel = function (event) {
			if (parent.notDragMap()) {
				parent.getFloorGroupObj(event.data, function (model) {
					self._modelObj = model;
					self._edit();
				});
				self._pickUpOver++;
			}
		};


		/*
		 * 点位拾取
		 */
		this._pickUpPoint = function (event) {
			if (parent.notDragMap()) {
				self._pickUpOver++;
				self._pointObj = event.data;
				self._edit();
			}
		};
	}


	/*
	 * 启用编辑
	 * @param execute 执行函数，接收2个参数pointObj, modelObj
	 */
	Label.prototype.enabled = function (execute) {
		var hzThree = this.parent.hzThree;
		var HzEvent = hzThree.HzEvent;

		this.disabled();
		this.execute = execute;
		this.sphere = null;
		this.status = true;

		hzThree.on(HzEvent.PICK_UP_MODEL, this._pickUpModel);	// 模型拾取
		hzThree.on(HzEvent.PICK_UP_POINT, this._pickUpPoint);	// 点位拾取
		console.log('启用标注编辑...');
	}


	/*
	 * 禁用编辑
	 */
	Label.prototype.disabled = function () {
		var hzThree = this.parent.hzThree;
		var HzEvent = hzThree.HzEvent;

		if (this.status) {
			hzThree.off(HzEvent.PICK_UP_MODEL, this._pickUpModel);	// 模型拾取
			hzThree.off(HzEvent.PICK_UP_POINT, this._pickUpPoint);	// 点位拾取

			this._removeSphere(this.sphere);
			this._removeSphere(this.sphereCenter);

			this.sphere = null;
			this.sphereCenter = null;
			this.execute = null;
			this.status = false;
			console.log('禁用标注编辑...');
		}
	}


	/*
	 * 添加点位
	 */
	Label.prototype.add = function (params, events, callback) {
		if (params) {
			params.className = params.className || '';
			params.minDis = params.minDis || 0;
			params.maxDis = params.maxDis || 50000;
			this.parent.addLabelPoint(params, events, callback);
		} else {
			console.error('添加点位失败：缺省参数对象[params]');
		}
	};


	/*
	 * 删除点位
	 */
	Label.prototype.remove = function (id) {
		this.parent.removeLabelPoint(id);
	};


	/*
	 * 执行编辑
	 */
	Label.prototype._edit = function () {
		if (this._pickUpOver == 2) {
			this._pickUpOver = 0;

			this.sphereCenter = this._showSphere(this.sphereCenter, 2, 0xFFFF00, this._pointObj);
			this.sphere = this._showSphere(this.sphere, 10, 0xFF0000, this._pointObj);

			try {
				this.execute(this._pointObj, this._modelObj);
			} catch (e) {
				console.error('执行标注编辑方法异常：', e);
			}

			this._modelObj = null;
			this._pointObj = null;
		}
	};


	/*
	 * 显示点击的位置
	 */
	Label.prototype._showSphere = function (sphere, radius, color, position) {
		if (sphere == null) {
			sphere = this.parent.hzThree.createSphere(radius, color, position);
		} else {
			sphere.position.x = position.x;
			sphere.position.y = position.y;
			sphere.position.z = position.z;
		}
		return sphere;
	}


	/*
	 * 删除圆
	 */
	Label.prototype._removeSphere = function (sphere) {
		if (sphere) {
			this.parent.hzThree.sceneRemove(sphere);
			sphere.dispose();
			sphere = null;
		}
	}


	return Label;
});