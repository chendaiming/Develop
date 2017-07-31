/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');


	function ModelComponent (parent) {
		this.parent = parent;	// 父对象
		this.callback = null;	// 回调函数

		this._ctrlKey = false;
		this._enabled = false;	// 是否已启用
		this._transformObj = null;


		var self = this;
		var hzMap = this.parent;

		this.editEvent = function (event) {
			if (hzMap.handleStatus == hzMap.EDITMODEL && self._enabled) {
				if (window.event.ctrlKey) {
					self.callback(event.data);
				}
			} else {
				self.disabledEdit();
			}
		}

		this._keyDown = function (event) {
			if (hzMap.handleStatus == hzMap.EDITMODEL && self._enabled) {
				if (window.event.ctrlKey) {
					if (!self._ctrlKey) {
						self._ctrlKey = true;
						self._transformObj = hzMap._transformObj;
						hzMap.setTransForm(false);
					}
				}
			}
		}

		this._keyUp = function (event) {
			if (hzMap.handleStatus == hzMap.EDITMODEL && self._enabled) {
				if (self._ctrlKey && self._transformObj) {
					self._ctrlKey = false;
					hzMap.setTransForm(true, self._transformObj);
					self._transformObj = null;
				}
			}
		}
	}


	/*
	 * 开启模型组件编辑（ 开启编辑之后使用Ctrl+点击触发事件）
	 * @param callback 回调函数，接受一个参数对象：position = {"x":0, "y":0, "z":0}
	 */
	ModelComponent.prototype.enabledEdit = function (callback) {
		var hzMap = this.parent;
		if (hzMap.handleStatus != hzMap.EDITMODEL || !this._enabled) {
			this._enabled = true;
			this.callback = callback;
	
			hzMap.setHandleStatus(hzMap.EDITMODEL);
			hzMap.hzThree.on(hzMap.hzThree.HzEvent.PICK_UP_POINT, this.editEvent);
			window.addEventListener('keydown', this._keyDown, false);
			window.addEventListener('keyup', this._keyUp, false);
			console.log('已开启模型组件编辑...');
		} else {
			console.warn('已经开启过模型组件编辑，不能重复操作!');
		}
	}


	/*
	 * 关闭模型组件编辑
	 */
	ModelComponent.prototype.disabledEdit = function () {
		var hzMap = this.parent;
		if (hzMap.handleStatus == hzMap.EDITMODEL || this._enabled) {
			this._enabled = false;
			this.callback = null;
	
			hzMap.setHandleNormal();
			hzMap.hzThree.off(hzMap.hzThree.HzEvent.PICK_UP_POINT, this.editEvent);
			window.removeEventListener('keydown', this._keyDown);
			window.removeEventListener('keyup', this._keyUp);
			console.log('已关闭模型组件编辑...');
		} else {
			console.warn('未开启模型组件编辑，不能进行关闭操作!');
		}
	}


	/*
	 * 添加模型组件
	 * @param params = {
	 * 		id: "编号（必填）",
	 * 		modelClass: "模型类别（必填），参数值：1.摄像机、2.门禁、3.对讲、4.广播、5.大屏、99.床",
	 * 		modelType: "模型类型（可选）参数值：type=1时0.枪机, 1.球型, 2.半球，其它暂时可默认0",
	 * 		editHelper: "是否显示XYZ辅线（可选），参数值：true是，false否",
	 * 		position: "组件坐标（必填），传值格式：{x: "（必填）", y: "（必填）", z: "（必填）"}",
	 * 		rotation: "组件角度（可选），传值格式：{x: "（必填）", y: "（必填）", z: "（必填）"}"
	 * }
	 * 
	 * @param callback 回调函数
	 * 
	 */
	ModelComponent.prototype.add = function (params, callback) {
		var hzMap = this.parent;
		var self = this;

		params.id = hzMap._componentFlag + params.id;

		hzMap._loadModel(hzMap.MODELCOMPONENT, params, hzMap.hzThree.newHandler(function (params, callback, obj) {
			self._transformObj = obj;
			// 使用编辑工具前先开启编辑状态
			if (params.editHelper && !hzMap.hasHandleStatus(hzMap.EDITMODEL))
				hzMap.setHandleStatus(hzMap.EDITMODEL);

			if (hzMap.handleStatus == hzMap.EDITMODEL && self._enabled) {	// 在编辑状态下，未按下ctrl键
				if (!window.event.ctrlKey) {
					hzMap._editHelper(params, obj);
				}
			} else {	// 非编辑状态下
				hzMap._editHelper(params, obj);
			}

			callback(obj);

		}, [params, callback]));
	}

	return ModelComponent;
});