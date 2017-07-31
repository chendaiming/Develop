/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');
	var hzUtils = require('frm/hz.utils');


	var defSearchLinkTypes = [1];	// 默认搜索关联类型

	/*
	 * 路径巡视（三维巡视）
	 */
	function RoutePatrol (parent) {
		this.parent = parent;
		this.hzThree = parent.hzThree;
		this.status = false;
		this.params = {};

		this._patrolStatus = 0; // 巡视状态：0.未巡视、1.开始巡视、2.暂停巡视

		// 各事件注册状态
		this._searchIsOn = false;
		this._patrolMoveIsOn = false;
		this._patrolOverIsOn = false;
		this._isInitEvents = false;
		this._searchArray = [];

		// 三维搜索结果
		this._searchResult = [];
	}


	/*
	 * 启动编辑
	 * @param 编辑参数
	 */
	RoutePatrol.prototype.enableEdit = function (params) {
		this.setEditStatus(true, params);
	}


	/*
	 * 更新参数
	 * @param 参数
	 */
	RoutePatrol.prototype.updateParams = function (params) {
		if (this.status) {
			this.setEditStatus(false);
		}
		this.setEditStatus(true, params);
	}


	/*
	 * 禁止编辑
	 */
	RoutePatrol.prototype.disableEdit = function () {
		this.setEditStatus(false);
	}


	/*
	 * 设置路径编辑状态
	 * @param status 状态：true开启编辑、false关闭编辑
	 * @param params 编辑参数
	 */
	RoutePatrol.prototype.setEditStatus = function (status, params) {
		var MapRoute = this.hzThree.MapRoute;
		var HzEvent = this.hzThree.HzEvent;
		var self = this;

		if (params) {
			this.setEditParams(params);
		}

		if (this.status != status) {
			this.status = status;
			if (status) {
				this.parent.setHandleStatus(this.parent.ROUTEPATROL);
			} else {
				this.parent.setHandleNormal();
			}
			this.hzThree.Patrol3D.setIsEditRoute(status, true);
		}

		if (!this._searchIsOn) {

			var linkTypes = this.params.searchLinkTypes || [];
			var parent = this.parent;

			this._searchIsOn = true;
			this.hzThree.Patrol3D.on(HzEvent.UPDATE_SEARCH_DATA, function (event) {
				
				var array = self._searchResult = event.data, 
					result = [], 
					filter = {}, 
					temp = null, 
					labels = null;

				// 过滤类型
				function filterType (data) {
					if (linkTypes.length) {
						for(var i = 0; i < linkTypes.length; i++) {
							if (linkTypes[i] == data.type) {		// 过滤于搜索类型不匹配的数据
								return true;
							}
						}
						return false;
					} else {
						return true;
					}
				}

				// 添加到结果
				function addResult (data, searchPos) {
					if (data) {
						if (filterType(data) && !filter[data.id]) {			// 过滤于搜索类型不匹配和重复的数据
							filter[data.id] = true;
							data = JSON.parse(JSON.stringify(data));
							data.searchPos = searchPos;
							result.push(data);
						}
					}
				}

				// 轮循集合
				for(var i = 0; i < array.length; i++) {
					temp = array[i];
					labels = temp.searchData || [];

					if (labels.length) {									// 优先获取自定义的搜索数据结果
						for(var j = 0; j < labels.length; j++) {
							addResult(labels[j], temp.pos);
						}
					} else {												// 地图上搜索的数据结果
						for(var j = 0; j < temp.data.length; j++) {
							addResult(temp.data[j].hzParams, temp.pos);
						}
					}
				}

				hzEvent.emit('map.routePatrol.onSearch', result);
			});
		}

		if (!this._isInitEvents) {
			this._isInitEvents = true;

			MapRoute.on(HzEvent.ADD_POINT_ROUTE_ONLINE, function (event) {
				hzEvent.emit('map.routepatrol.addPoint', event.data.position, event);
			});

			MapRoute.on(HzEvent.CHANGE_POINT_ROUTE, function (event) {
				hzEvent.emit('map.routepatrol.movePoint', event.data.position, event);
			});

			MapRoute.on(HzEvent.DELETE_POINT_ROUTE, function (event) {
				hzEvent.emit('map.routepatrol.removePoint', event.data.position, event);
			});

			MapRoute.on(HzEvent.SELECT_POINT_ROUTE, function (event) {
				hzEvent.emit('map.routepatrol.selectPoint', event.data.position, event);
			});
		}
	};


	/*
	 * 设置路径编辑参数（必须在开启编辑之前调用）
	 * @param params 编辑参数
	 */
	RoutePatrol.prototype.setEditParams = function (params) {
		var modelType = this.parent.MODELPOINT;
		var pointList = null;
		var typeList = null;
		var type = null;

		// 编辑参数
		if (params) {
			params.searchRadius = params.searchRadius || this.params.searchRadius || 200;		// 搜索半径
			params.showViewBall = params.showViewBall || this.params.showViewBall || false;		// 搜索半径球（不建议显示）
			params.searchType = params.searchType || this.params.searchType || modelType;		// 搜索模型类型：默认点位
			params.searchGap = parseInt(params.searchRadius / 2);							// 搜索距离间隔（半径的一半）
			params.walkSpeed = params.walkSpeed || this.params.walkSpeed || 60;				// 巡视的速度
			params.defalutY = params.defalutY || this.params.defalutY || 180;				// 巡视的高度
			params.searchLinkTypes = params.searchLinkTypes || this.params.searchLinkTypes || defSearchLinkTypes;	// 搜索的设备类型（针对searchType类型是点位时），默认1-摄像机
			params.searchData = []; //this.parent.modelPointAll;			// 搜索的点位集合

			// 矫正字段格式，统一为数组
			if (hzUtils.notArray(params.searchLinkTypes)) {
				params.searchLinkTypes = [params.searchLinkTypes];
			}

			// 在搜索之前筛选出符合类型的点位数据
			if (pointList = this.parent.modelPointAll) {
				typeList = params.searchLinkTypes;

				// 统一转成int类型
				for(var i = 0, len = typeList.length; i < len; i++) {
					typeList[i] *= 1;
				}

				// 开始筛选数据
				for(var i = 0, len = pointList.length; i < len; i++) {
					if (typeList.indexOf(pointList[i].type) > -1) {
						params.searchData.push(pointList[i]);
					}
				}
			}

			this.hzThree.Patrol3D.showLine(true);
			this.hzThree.Patrol3D.setPatrol3DParam(params);
			this.params = params;
		} else {
			console.warn('设置路径编辑参数错误：[params]参数对象为空!');
		}
	};


	/*
	 * 设置路径参数
	 * @param key 参数名
	 * @param val 参数值
	 */
	RoutePatrol.prototype.setParam = function (key, val) {
		if (['searchRadius','walkSpeed','defalutY',''].indexOf(key) > -1) {
			this.hzThree.Patrol3D[key] = parseInt(val);
		} else {
			console.log(key + '属性不在设置范围内');
		}
	}


	/*
	 * 清除当前编辑的路径
	 */
	RoutePatrol.prototype.clearRoute = function () {
		this.hzThree.Patrol3D.clearRoute();
	};


	/*
	 * 编辑路径
	 * @param route 路径数据，路径点集合[{x:0, y:0, z:0}, ...]
	 * @param params 编辑参数
	 */
	RoutePatrol.prototype.editRoute = function (route, params) {
		this.updateParams(params || {});
		this.hzThree.Patrol3D.setRoutePath(route);
	};


	/*
	 * 获取当前编辑的路径
	 * @return [{x:0, y:0, z:0}, ...]
	 */
	RoutePatrol.prototype.getRoute = function () {
		return this.hzThree.Patrol3D.getRouteList();
	};


	/*
	 * 开始/继续巡视路径
	 * @param route 路径数据，路径点集合[{x:0, y:0, z:0}, ...]
	 * @param params 巡视参数 {"walkSpeed":"巡视速度", "defalutY":"巡视高度"}
	 */
	RoutePatrol.prototype.startPatrol = function (route, params) {
		if (this._patrolStatus == 0) {
			var array = [];
			for(var i = 0; i < route.length; i++) {
				array.push({
					x: parseFloat(route[i].x),
					y: parseFloat(route[i].y),
					z: parseFloat(route[i].z)
				});
			}

			// 检查参数
			params = params || {};
			params.walkSpeed = params.walkSpeed || this.params.walkSpeed || 60;				// 巡视的速度
			params.defalutY = params.defalutY || this.params.defalutY || 180;				// 巡视的高度

			this.hzThree.Patrol3D.showLine(true);
			this.hzThree.Patrol3D.setPatrol3DPath(array, params);
		} else {
			if (this._patrolStatus == 2) {
//				this.hzThree.Patrol3D.patrol3dToggle();
				this.hzThree.Patrol3D.goPlay();
			}
		}
		this._patrolStatus = 1;


		if (!this._patrolMoveIsOn) {
			this._patrolMoveIsOn = true;
			this.hzThree.Patrol3D.on(this.hzThree.HzEvent.MOVE_PATROL3D, function (event) {
				hzEvent.emit('map.routePatrol.onpatrolmove', event.data);
			});
		}

		var self = this;
		if (!this._patrolOverIsOn) {
			this._patrolOverIsOn = true;
			this.hzThree.Patrol3D.on(this.hzThree.HzEvent.PATROL_3D_OVER, function (event) {
				self._patrolStatus = 0;
				hzEvent.emit('map.routePatrol.onpatrolover', event.data);
			});
		}
	};


	/*
	 * 暂停巡视路径
	 */
	RoutePatrol.prototype.pausePatrol = function () {
		if (this._patrolStatus == 1) {
			this._patrolStatus = 2;
			this.hzThree.Patrol3D.pause();
		}
	};


	/*
	 * 结束巡视路径
	 */
	RoutePatrol.prototype.stopPatrol = function () {
		this._patrolStatus = 0;
		this.hzThree.Patrol3D.stopPatrol3d();
	};


	/*
	 * 巡视移动事件-注册
	 * @param callback 	事件处理函数
	 * @param name		事件注册标识
	 */
	RoutePatrol.prototype.onPatrolMove = function (callback, name) {
		this.offPatrolMove(name || callback);
		hzEvent.subs('map.routePatrol.onpatrolmove', name, callback);
	};


	/*
	 * 巡视移动事件-注销
	 * @param arg0 	事件处理函数 | 事件注册标识
	 */
	RoutePatrol.prototype.offPatrolMove = function (arg0) {
		hzEvent.unsubs('map.routePatrol.onpatrolmove', arg0);
	};


	/*
	 * 巡视结束事件-注册
	 * @param callback 	事件处理函数
	 * @param name		事件注册标识
	 */
	RoutePatrol.prototype.onPatrolStop = function (callback, name) {
		this.offPatrolStop(name || callback);
		hzEvent.subs('map.routePatrol.onpatrolover', name, callback);
	};


	/*
	 * 巡视结束事件-注销
	 * @param arg0 	事件处理函数 | 事件注册标识
	 */
	RoutePatrol.prototype.offPatrolStop = function (arg0) {
		hzEvent.unsubs('map.routePatrol.onpatrolover', arg0);
	};


	/*
	 * 路径搜索事件-注册
	 * @param callback 	事件处理函数，函数接收一个数组,数组对象的格式{"":""}
	 * @param name		事件注册标识
	 */
	RoutePatrol.prototype.onSearch = function (callback, name) {
		this.offSearch(name || callback);
		hzEvent.subs('map.routePatrol.onSearch', name, callback);
	};


	/*
	 * 路径搜索事件-注销
	 * @param name	事件注册标识
	 */
	RoutePatrol.prototype.offSearch = function (arg0) {
		hzEvent.unsubs('map.routePatrol.onSearch', arg0);
	};


	/*
	 * 添加路径点事件-注册
	 * @param callback 	事件处理函数，函数接收一个数组,数组对象的格式{"":""}
	 * @param name		事件注册标识
	 */
	RoutePatrol.prototype.onAddPoint = function (callback, name) {
		this.offAddPoint(name || callback);
		hzEvent.subs('map.routepatrol.addPoint', name, callback);
	};


	/*
	 * 添加路径点事件-注销
	 * @param name	事件注册标识
	 */
	RoutePatrol.prototype.offAddPoint = function (arg0) {
		hzEvent.unsubs('map.routepatrol.addPoint', arg0);
	};


	/*
	 * 注册移动路径点事件
	 * @param callback 	事件处理函数，函数接收一个数组,数组对象的格式{"":""}
	 * @param name		事件注册标识
	 */
	RoutePatrol.prototype.onMovePoint = function (callback, name) {
		this.offMovePoint(name || callback);
		hzEvent.subs('map.routepatrol.movePoint', name, callback);
	};


	/*
	 * 注销移动路径点事件
	 * @param name	事件注册标识
	 */
	RoutePatrol.prototype.offMovePoint = function (arg0) {
		hzEvent.unsubs('map.routepatrol.movePoint', arg0);
	};


	/*
	 * 注册路径点移除事件
	 * @param callback 	事件处理函数，函数接收一个数组,数组对象的格式{"":""}
	 * @param name		事件注册标识
	 */
	RoutePatrol.prototype.onRemovePoint = function (callback, name) {
		this.offRemovePoint(name || callback);
		hzEvent.subs('map.routepatrol.removePoint', name, callback);
	};


	/*
	 * 注销路径点移除事件
	 * @param name	事件注册标识
	 */
	RoutePatrol.prototype.offRemovePoint = function (arg0) {
		hzEvent.unsubs('map.routepatrol.removePoint', arg0);
	};


	/*
	 * 注册路径点选择事件
	 * @param callback 	事件处理函数，函数接收一个数组,数组对象的格式{"":""}
	 * @param name		事件注册标识
	 */
	RoutePatrol.prototype.onSelectPoint = function (callback, name) {
		this.offSelectPoint(name || callback);
		hzEvent.subs('map.routepatrol.selectPoint', name, callback);
	};


	/*
	 * 注销路径点选择事件
	 * @param name	事件注册标识
	 */
	RoutePatrol.prototype.offSelectPoint = function (arg0) {
		hzEvent.unsubs('map.routepatrol.selectPoint', arg0);
	};


	/*
	 * 切换连接线的颜色
	 * @param id 模型点位的编号
	 * @param color 颜色，16进制格式，以0x开头的，例如红色：0xFF0000
	 */
	RoutePatrol.prototype.changeShowLine = function (id, color) {
		for(var i = 0; i < this._searchResult.length; i++) {
			var data = this._searchResult[i];

			for(var x = 0; x < data.searchData.length; x++) {
				if (data.searchData[x].id == id){
					// 克隆一份数据（修改原数据会改变这个点的默认连接线颜色，所有克隆一份）
					data = JSON.parse(JSON.stringify(data));
					data.searchData[x].color = color;

					this.hzThree.Patrol3D.changeShowLine(data);
				}
			}
		}
	}

	return RoutePatrol;
});