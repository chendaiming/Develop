/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');
	var hzThree = null;

	/*
	 * 寻路对象
	 */
	function Wayfinding (parent) {
		var self = this;
		this.parent = parent;
		this.defMoveModel = null;
		this.curMoveModel = null;

		hzThree = parent.hzThree;
		hzEvent.subs('hz.three.oninit', function () {
			self.defMoveModel = hzThree.createSphere(20, 0xFF0000, {x:0,y:0,z:0}); // 默认移动的模型
			self.defMoveModel.visible = false;

			// 监听移动结束事件
			hzThree.Track.on(hzThree.HzEvent.TRACK_OVER, function () {
				hzEvent.emit('map.wayfinding.over');
			});
		});
	}


	/*
	 * 获取寻路网格
	 * @params data = {
	 * 		viewId: '视角菜单编号'
	 * }
	 */
	Wayfinding.prototype.findWay = function (viewId) {
		var modelData, modelName, nameFlag, pathZone, meshName, meshObj;

		// 根据视角菜单编号获取楼层模型编号，再获取寻路网格名称
		var viewMenu = this.parent.mViewMenu[viewId];
		if (viewMenu) {
			modelData = this.parent.mModelGroup[viewMenu.model_group_id];

			if (modelData) {
				// 查找到模型名称
				if (!modelData.attributes.model_name) {
					this.parent.traverse(modelData.children, function (node) {
						modelName = node.attributes.model_name;
						if (modelName) {
							return true;
						}
					});
				}

				// 根据模型名称获取模型组名称
				this.parent.getFloorGroupObj(modelName, function (modelObj) {
					modelName = modelObj.name;
				});


				if (modelName) {
					// 解析模型命名规则，获取模型前缀标识
					var strs = modelName.split('_');
					if (strs.length > 3) {
						nameFlag = strs[0] + '_' + strs[1] + '_' + strs[2];
					} else {
						return warnLog('模型命名规则错误，模型名称[' + modelName + ']');
					}

					/*
					 * 根据命名规则获取网格对象从编号[001 - 100]依次尝试直到获取或结束
					 */
					for (var i = 1; i < 100; i++) {
						meshName = nameFlag + '_' + (i < 10 ? '00' : (i < 100 ? '0' : '')) + i + '_T025';
						meshObj = getPathZoneMesh(meshName); //hzThree.getObjectByName(meshName);
						if (meshObj) {
							return hzThree.PathFinding.getPathZone(meshName);
						}
					}
					warnLog('未获取到寻路网格对象[' + meshName + ']');
				} else {
					warnLog('未获取到视角关联的对象的组名称');
				}
			} else {
				warnLog('未获取到视角关联的对象[' + viewMenu.model_group_id + ']');
			}
		} else {
			warnLog('未获取到寻路点位所在视角[' + viewId + ']');
		}
	}


	/*
	 * 获取网格对象
	 */
	function getPathZoneMesh (meshName) {
		var list = hzThree.objectMap['T025'] || [];
		for(var i = 0; i < list.length; i++) {
			if (list[i].name == meshName) {
				return list[i];
			}
		}
	}


	/*
	 * 开始寻路
	 * @params params = {
	 * 		"data": [{"id":"点位编号", "type":"点位类型"}, ...],
	 * 		"model": "移动的模型对象",
	 * 		"defalutY": "模型对象离轨迹高度，默认20",
	 * 		"walkSpeed": "模型对象的移动速度",
	 * 		"viewType": "轨迹移动观察视角",
	 *		"cameraDis": "移动轨迹观察的视角距离",
	 *		"cameraHeight": "移动轨迹观察的视角高度"
	 * }
	 */
	Wayfinding.prototype.start = function (params) {
		var self = this;
		var points = this.parent.modelPointAll;
		var tempA, tempB, findPoints = [];
		var viewId;

		// 寻找到地图点位坐标
		for(var j = 0; j < params.data.length; j++) {
			tempB = params.data[j];

			for(var i = 0; i < points.length; i++) {
				tempA = points[i];

				if (tempA.type == tempB.type && tempA.linkId == tempB.id) {
					if (viewId) {
						if (viewId != tempA.original.mpi_view_id) {
							return warnLog('寻路处理终止，模型点位不在同一个视角下!');
						}
					} else {
						viewId = tempA.original.mpi_view_id;
					}

					findPoints.push(tempA); break;
				}
			}
		}

		/*
		 * 获取到寻路网格之后开始寻找路线
		 */
		var pathZone = this.findWay(viewId);
		if (pathZone) {
//			var pathZone = this.findWay(viewId); //hzThree.PathFinding.getPathZone(meshName);
			var beginPoint = findPoints[0], 
				endPoint,
				routePoints = [],
				retPoints,
				length = findPoints.length,
				index = 1;

			/*
			 * 轮循获取寻路点位
			 */
			function forFinding () {
				if (index < length) {
					endPoint = findPoints[index];
					pathZone.findPath(beginPoint.position, endPoint.position);
				} else {
					self.trackMove(params, routePoints);
				}
			}

			/*
			 * 寻路结束回调处理
			 */
			hzThree.PathFinding.findPathCallBack = function (meshName, points) {
				if (points && points.length > 1) {
					// 因为上一次的终点是下一次的起点，所以这里除了最开始一次，后面的都要去掉重复的点
					if (index++ > 1) { 
						points.shift(); 
					}

					routePoints = routePoints.concat(points);
					beginPoint = endPoint;
					endPoint = null;

					forFinding();
				} else {
					warnLog('寻路处理终止，在点[' + beginPoint.id + '] 和 点[' + endPoint.id + '] 之间未寻到有效路径!');
				}
			};

			// 开始查找路径点
			forFinding();
		}
	};


	/*
	 * 轨迹移动
	 */
	Wayfinding.prototype.trackMove = function (params, points) {
		var moveModel = this.curMoveModel = params.model || this.defMoveModel,
			Track = hzThree.Track;

		if (Track) {
			Track.viewType = params.viewType || 0;
			Track.walkSpeed = params.walkSpeed || 30;
			Track.defalutY = params.defalutY || 2;
			Track.cameraDis = params.cameraDis || 2000;
			Track.cameraHeight = params.cameraHeight || 2000;
			Track.moveCall = params.moveCall;

			Track.setTrackPath(points, {
				viewType: params.viewType || 0,
				model: moveModel
			});

//			moveModel.visible = true;
//			moveModel.setBorderShow(true);
		}
	}


	/*
	 * 停止寻路
	 */
	Wayfinding.prototype.stop = function () {
		if (this.curMoveModel) {
//			this.curMoveModel.visible = false;
//			this.curMoveModel.setBorderShow(false);
		}
		hzThree.Track.stopTrack();
	};


	/*
	 * 注册监听结束事件
	 */
	Wayfinding.prototype.onOver = function (name, callback) {
		this.offOver(name);
		hzEvent.subs('map.wayfinding.over', name, callback);
	}

	/*
	 * 注销监听结束事件
	 */
	Wayfinding.prototype.offOver = function (name) {
		hzEvent.unsubs('map.wayfinding.over', name);
	}


	/*
	 * 警告日志输出
	 */
	function warnLog (msg) {
		console.warn('map.wayfinding --> ' + msg);
	}

	return Wayfinding;
});