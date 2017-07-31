/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');

	/*
	 * 路径移动（轨迹移动）
	 */
	function RouteMove (parent) {
		this.parent = parent;
		this.hzThree = parent.hzThree;
		
		this._hasInitEvents = false;
		this._modelObj = null;
	}


	/*
	 * 设置路径编辑状态
	 * @param status 状态：true开启编辑、false关闭编辑
	 * @param params 编辑参数，格式：{
	 * 		"viewType": "观察视角：0.物体正上方、1.物体左侧、2.物体右侧、3.物体后上方（默认）",
	 * 		"walkSpeed": "移动速度（默认20）",
	 * 		"defalutY": "模型离路径的高度（默认5）",
	 * 		"cameraDis": "摄像机观察距离（默认3000）",
	 * 		"cameraHeight": "摄像机观察高度（默认4000）",
	 * 		"model": "移动的物体模型对象"
	 * }
	 */
	RouteMove.prototype.setEditStatus = function (status, params) {
		var track = this.getTrack();
		var parent = this.parent;
		if (status) {
			this.setEditParams(params);
			track.setIsEditRoute(true);
			parent.setHandleStatus(parent.ROUTEMOVE);
		} else {
			track.setIsEditRoute(false);
			parent.setHandleNormal();
		}


		// 是否初始化监听事件
		if (!this._hasInitEvents) {
			this._hasInitEvents = true;

			// 监听移动结束事件
			track.on(parent.hzThree.HzEvent.TRACK_OVER, function () {
				hzEvent.emit('map.routemove.moveover');
			});
		}
	};


	/*
	 * 启动路径编辑
	 * @param params 编辑参数，格式：{
	 * 		"viewType": "观察视角：0.物体正上方、1.物体左侧、2.物体右侧、3.物体后上方（默认）",
	 * 		"walkSpeed": "移动速度（默认20）",
	 * 		"defalutY": "模型离路径的高度（默认5）",
	 * 		"cameraDis": "摄像机观察距离（默认3000）",
	 * 		"cameraHeight": "摄像机观察高度（默认4000）",
	 * 		"model": "移动的物体模型对象"
	 * }
	 */
	RouteMove.prototype.enabledEdit = function (params) {
		this.setEditStatus(true, params);
	};


	/*
	 * 关闭路径编辑
	 */
	RouteMove.prototype.disabledEdit = function () {
		this.setEditStatus(false);
	};


	/*
	 * 设置路径编辑参数
	 * @param params 编辑参数，格式：{
	 * 		"viewType": "观察视角：0.物体正上方、1.物体左侧、2.物体右侧、3.物体后上方（默认）",
	 * 		"walkSpeed": "移动速度（默认20）",
	 * 		"defalutY": "模型离路径的高度（默认5）",
	 * 		"cameraDis": "摄像机观察距离（默认3000）",
	 * 		"cameraHeight": "摄像机观察高度（默认4000）",
	 * 		"model": "移动的物体模型对象"
	 * }
	 */
	RouteMove.prototype.setEditParams = function (params) {
		var track = this.getTrack();

		this._getModel(function (model) {
			params = params || {};
			
			if (params.viewType != 0 && !params.viewType) {
				params.viewType = 3;
			}

			track.walkSpeed = params.walkSpeed || 20;
			track.defalutY = params.defalutY || 5;
			track.cameraDis = params.cameraDis || 3000;
			track.cameraHeight = params.cameraHeight || 4000;
			track.setTrackParam({
				viewType: params.viewType,		// 模型观察方位
				model: params.model || model	// 模型对象
			});
		});
	};


	/*
	 * 清除当前编辑的路径
	 */
	RouteMove.prototype.clearRoute = function () {
		this.getTrack().clearRoute();
	};


	/*
	 * 编辑路径
	 * @param route 路径数据，路径点集合[{x:0, y:0, z:0}, ...]
	 */
	RouteMove.prototype.editRoute = function (route) {
		this.getTrack().setRoutePath(route);
	};


	/*
	 * 获取当前编辑的路径
	 * @return [{x:0, y:0, z:0}, ...]
	 */
	RouteMove.prototype.getRoute = function () {
		return this.getTrack().getRouteList();
	};


	/*
	 * 开始移动
	 * @param route 路径数据，路径点集合[{x:0, y:0, z:0}, ...]
	 */
	RouteMove.prototype.startMove = function (route) {
		var track = this.getTrack();
		this._getModel(function (modelObj) {
			track.setTrackPath(route, {
				viewType: 3,		// 模型后方观察
				model: modelObj		// 模型对象
			});
		});
	};


	/*
	 * 暂停移动
	 */
	RouteMove.prototype.pauseMove = function () {
		this.getTrack().trackToggle();
	};


	/*
	 * 结束移动
	 */
	RouteMove.prototype.stopMove = function () {
		this.getTrack().stopTrack();
	};




	/*
	 * 巡视结束事件
	 * @param callback 	事件处理函数
	 * @param name		事件注册标识
	 */
	RouteMove.prototype.onMoveStop = function (callback, name) {
		hzEvent.subs('map.routemove.moveover', name, callback);
	};


	/*
	 * 巡视结束事件
	 * @param callback 	事件处理函数
	 * @param name		事件注册标识
	 */
	RouteMove.prototype.offMoveStop = function (key) {
		hzEvent.unsubs('map.routemove.moveover', key);
	};



	/*
	 * 获取Track对象
	 */
	RouteMove.prototype.getTrack = function () {
		return this.parent.hzThree.Track;
	}


	/*
	 * 获取Track对象
	 */
	RouteMove.prototype._getModel = function (callback) {
		var self = this;
		if (this._modelObj) {
			callback(this._modelObj);
		} else {
			this.parent.addModel({
				'modelName': 'people_man',
				'path': basePath + 'models/people/',
				'objName': 'people_man.obj',
				'mtlName': 'people_man.mtl',
				'bornType': 'born_addModel',
				'objType': 'people_man',
				'position': {
					x: 0,
					y: 0,
					z: 0
				}
			}, function (obj) {
				obj.scale.x = 10;
				obj.scale.y = 10;
				obj.scale.z = 10; 
				obj.children[0].rotation.y = Math.PI * 0.5;

				callback(self._modelObj = obj);
			});
		}
	}

	return RouteMove;
});