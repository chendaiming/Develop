/**
 * 
 */
define(function (require) {
	// 引入模块
	var hzThree = require('frm/hz.three'),
		user = require('frm/loginUser'),
		tree = require('frm/hz.tree'),
		db = require('frm/hz.db'),
		message = require('frm/message'),
		hzEvent = require('frm/hz.event'),
		pointEvent = require('frm/pointEvent'),
		utils = require('frm/hz.utils'); // 加载辅助模块

	var Door = require('hz/map/tools/map.door'),
		Label = require('hz/map/tools/map.label'),
		BoxSelect = require('hz/map/tools/map.boxselect'),
		RouteMove = require('hz/map/tools/map.routemove'),
		RoutePatrol = require('hz/map/tools/map.routepatrol'),
		InfoPanel = require('hz/map/tools/map.infopanel'),
		ModelComponent = require('hz/map/tools/map.modelComponent'),
		Wayfinding = require('hz/map/tools/map.wayfinding'),
		MapConfig = require('hz/map/tools/map.config'),
		MapStats = require('hz/map/tools/map.stats'),
		Building = require('frm/component/Building');

	var modelComponent = require('hz/map/modelFile/model.component');

	var skyBoxData = {path: mapBasePath + 'models/skybox/', negX:'nx.jpg', negY:'ny.jpg', negZ:'nz.jpg', posX:'px.jpg', posY:'py.jpg', posZ:'pz.jpg'};

	var emptyFunc = function () {};
	var eventType = hzThree.ModelEvent;
	var eventMap = {
		click: eventType.MODEL_CLICK,
		rclick: eventType.MODEL_RIGHT_CLICK,
		mouseover: eventType.MODEL_ROLL_OVER,
		mouseout: eventType.MODEL_ROLL_OUT,
		dblclick: eventType.MODEL_DOUBLE_CLICK
	};

	var FLAG = 0;	// 加载正常点位
	var MODEL_TYPE = {
		BUILDING: 1,
		FLOOR: 2,
		FLOOR_INNER: 3,
		FLOOR_OUTER: 4,
		FLOOR_INNER_MODEL: 5,
		FLOOR_OUTER_MODEL: 6
	};

	var BUILD_CLICK = {
		LOCATION: 1,	// 楼层定位
		CLOSEUP: 2		// 楼层分离还原
	};

	// 模型点位关联类型
	var LINK_TYPE = {
		CAMERA: 1,		// 摄像机
		DOOR: 2,		// 门禁
		TALKBACK: 3,	// 对讲
		PRISONER: 98	// 罪犯
	};

	var ERRCODE = {
		'A001': 'A001' // 区域未关联或配置视角
	};

	/*
	 * 地图操作对象
	 */
	function HzMap () {
		var hzMap = this;

		this.serialNo = (new Date()).getTime();
		this.hasInit = false;				// 地图是否已初始化
		this.hasLoaded = false;				// 模型是否已加载完成
		this.isFly = true;					// 是否飞行定位（在定位处理之后会自动还原为true）
		this.isCameraLookAt = true;			// 是否双击地图自动定位位置

		this.tModelGroup = [];		// 模型分组树
		this.mModelGroup = {};		// 模型分组Map对象
		this.mViewMenu = {};		// 视角菜单Map对象
		this.mAreaView = {};		// 区域对应视角的Map对象{'area_id': 'view_id'}
		this.curViewMenu = null;	// 当前视角菜单数据

		this.modelLabelObjs = [];	// 视角菜单的模型点位对象集合
		this.modelPointAll = [];	// 所有的模型点位集合
		this.modelComponents = [];	// 模型组件集合
		this.powerGridMap = {};		// 高压电网MAP
		this.powerGrids = [];		// 高压电网数组
		this.labelPoints = [];		// 点位标注集合

		this.labelPointObjMap = {};	// 点位标注对象的映射，格式{'id': obj}
		this.labelModelMap = {};	// 点位标注和模型名称的对应MAP，格式：{'modelName': [标注编号集合]}

		// 操作状态
		this.handleStatus = 0;		// 状态定义,：0楼层分层（默认）、1.模型添加编辑、2.模型拾取、3.框选
		this.NORMAL = 0;			// 正常状态（楼层分层）
		this.EDITMODEL = 1;			// 模型添加编辑
//		this.PICKUPMODEL = 2;		// 模型拾取
		this.BOXSELECT = 3;			// 模型框选
		this.ROUTEMOVE = 4;			// 移动路径编辑
		this.ROUTEPATROL = 5;		// 巡视路径编辑


		// 鼠标操作状态
		this.mouseHandle = 0;		// 鼠标操作状态：默认鼠标移动
		this.MOUSEMOVING = 0;		// 鼠标移动
		this.MOUSEDOWN = 1;			// 鼠标按下
		this.MOUSEDRAG = 2;			// 鼠标拖拽
		this.MOUSEDRAGEND = 3;		// 拖拽停止
		this.MOUSEDRAGUP = 4;		// 鼠标拖拽弹起
		this.MOUSEUP = 5;			// 鼠标弹起


		// 模型类型标识
		this.MODELPOINT = 'modelpoint';
		this.MODELCOMPONENT = 'component';

		
		this.LINK_TYPE = LINK_TYPE;		// 模型点位关联类型
		this.ERRCODE = ERRCODE;			// 错误码

		this._modelPointFlag = 'hz_model_point_';	// 添加模型时的模型名称标识
		this._componentFlag = 'hz_component_';		// 添加模型组件时的名称标识
		this._loadNo = null;						// 加载编号（用于验证加载的点位是否属于某个视角定位）
		this._buildingMap = {};						// 模型分离对象集
		this._unCtrlFloors = [];					// 不受远近距离影响的模型
		this._hiddenFloors = [];					// 隐藏的模型集合


		// 模型对象位置方位控制属性
		this._transform = false;					// 是否启用控制
		this._transformRotate = false;				// 是否旋转对象
		this._transformObj = null;					// 控制对象


		// 模块对象
		this.hzThree = hzThree;
		this.door = new Door(this);
		this.label = new Label(this);
		this.boxSelect = new BoxSelect(this);
		this.routeMove = new RouteMove(this);
		this.routePatrol = new RoutePatrol(this);
		this.infoPanel = new InfoPanel(this);
		this.Wayfinding = new Wayfinding(this);
		this.modelComponent = new ModelComponent(this);
		this.mapConfig = new MapConfig(this);
		this.mapStats = new MapStats();

		// hover效果的房间
		var hoverRoom = null;
		var rightClickTime = null;
		var HzEvent = this.hzThree.HzEvent;
		var MouseEvent = this.hzThree.MouseEvent;

		function mapMouseMove (event) {
			switch (hzMap.mouseHandle) {
				case hzMap.MOUSEDRAG: return;
				case hzMap.MOUSEMOVING: return;
			}

			if (hzMap.mouseHandle == hzMap.MOUSEDOWN) {
				hzMap.mouseHandle = hzMap.MOUSEDRAG;
			} else {
				hzMap.mouseHandle = hzMap.MOUSEMOVING;
			}
		}


		/*
		 * 取消房间的hover
		 */
		function cancelHoverRoom () {
			if (hoverRoom) {
				hzMap.hzThree.removeBorder(hoverRoom);
				hoverRoom = null;
			}
		}


		/*
		 * 房间的hover事件
		 */
		function hoverRoomEvent () {
			cancelHoverRoom();
			if (hzMap.handleStatus == hzMap.NORMAL) {
				if (window.top.event.ctrlKey) {
					var intersect = hzMap.hzThree.getIntersectObjectByType('T016');
					if (intersect) {
						hoverRoom = intersect.object;
						hzMap.hzThree.addBorder(hoverRoom, 0x0080C0);
					}
				}
			}
		}

		// 监听地图对象初始化事件
		hzEvent.subs('hz.three.oninit', function () {

			function mouseDown (event) {
				hzMap.mouseHandle = hzMap.MOUSEDOWN;
				hzMap.hzThree.on(MouseEvent.MOUSE_MOVE, mapMouseMove);
			}

			// 鼠标按下
			hzMap.hzThree.on(MouseEvent.MOUSE_DOWN, mouseDown);
			hzMap.hzThree.on(MouseEvent.RIGHT_MOUSE_DOWN, mouseDown);

			function mouseUp (event) {
				hzMap.hzThree.off(MouseEvent.MOUSE_MOVE, mapMouseMove);

				if (hzMap.mouseHandle == hzMap.MOUSEDRAG) {
					hzMap.mouseHandle = hzMap.MOUSEDRAGUP;
				} else {
					hzMap.mouseHandle = hzMap.MOUSEUP;
				}
			}
			// 鼠标弹起
			hzMap.hzThree.on(MouseEvent.MOUSE_UP, mouseUp);
			hzMap.hzThree.on(MouseEvent.RIGHT_MOUSE_UP, mouseUp);


			/*
			 * 双击定位
			 */
			hzMap.hzThree.on(MouseEvent.DOUBLE_CLICK, function (event) {
				if (hzMap.isCameraLookAt) {
					hzMap.hzThree.Controls.cameraLookAt(event.data, 800, {
						type: 1,
						time1: 800,
						time2: 900,
						time3: 900
					});
				}

				// 每次触发之后重置状态
				hzMap.isCameraLookAt = true;
			});


			// 双击旋转地图
			hzMap.hzThree.on(MouseEvent.RIGHT_CLICK, function (event) {
				var clickTime = (new Date()).getTime();

				if (rightClickTime && (clickTime - rightClickTime < 200)) {
					setTimeout(hzMap.hzThree.aroundPoint, 200);
				}

				rightClickTime = clickTime;
			});



			// 视角飞行定位结束事件,事件返回当前视角坐标
			hzMap.hzThree.on(HzEvent.FLY_OVER, function (event) {
				hzEvent.emit('hz.fly.over', hzMap.hzThree.getViewPoint());	// 楼层分离事件
			});

			// 注册模型拾取事件
			hzMap.hzThree.on(HzEvent.PICK_UP_MODEL, function (event) {

				hzEvent.emit('maphandle.pickup.model', event.data);

				if (hzMap.handleStatus == hzMap.NORMAL && !hzThree._isEditRoute) {
					var model = event.data;

					if (window.top.event.shiftKey) {
						var array = model.name.split('_'), floorView, buildView;

						if (array.length > 2) {
							if (hzMap._curSeparateBuilding) {	// 如果当前建筑处于分离则先合拢
								
								if (hzMap._curSeparateBuilding._isClick) {
									hzMap._curSeparateBuilding._isClick = false;
									return;
								}

								if (hzMap._curSeparateBuilding.isSeparate) {
									hzMap._curSeparateBuilding.closeUp();
								}
							}

							hzMap._curSeparateBuilding = hzMap._buildingMap[array[1]];

							if (hzMap._curSeparateBuilding) {
								// 清空上一次加载的模型点位
								hzMap.clearLocationData();

								// 设置模型的自动显隐状态和显示整栋楼层模型
								var floors = hzMap._curSeparateBuilding.getCellArray();
								var array = [];
								for(var i = 0; i < floors.length; i++) {
									array = floors[i];

									for(var j = 0; j < array.length; j++) {
										hzMap.setCtrlFloor(array[j], false);	// 关闭自动显隐
										hzMap.visibleFloor(array[j], true);		// 显示楼栋楼层
									}
								}

								hzMap.restoreHiddenFloors();
								hzMap._curSeparateBuilding.separate();

								// 如果有配置视角定位菜单则发布事件
								floorView = hzMap.findViewByModelName(model.name) || {};			// 根据模型编号查找楼层视角
								buildView = hzMap.mViewMenu[floorView.pid];							// 根据楼层视角编号查找楼栋
								buildView && hzEvent.emit('hz.building.floor.separate', buildView, floorView);	// 楼层分离事件
							}
						}
					} else {

						if (window.top.event.ctrlKey) {
							if (hzMap.hasRoomFlag(model) && hoverRoom) {
								hzEvent.emit('map.handle.onClickRoom', hoverRoom.name, hoverRoom);
							}
						} else {
							if (hzMap.isDragMap()) return;	// 拖拽时不合拢模型
							if (hzMap._curSeparateBuilding) {
								hzMap._curSeparateBuilding.closeUp();
							}
						}
					}
				}
			});

			hzEvent.subs('maphandle.pickup.model', 'mapHandle', function (model) {
				// console.log('maphandle.pickup.model --> ', model);
			});
			
			hzMap.hzThree.Track.on(HzEvent.TRACK_OVER, function () {
				hzEvent.emit('hz.track.move.over');
			});

			// 监听系统的键盘弹起事件
			window.top.addEventListener('keyup', function (event) {
				// 取消鼠标移动room box 的 hover事件
				hzMap.hzThree.off(MouseEvent.MOUSE_MOVE, hoverRoomEvent);

				// 隐藏房间模型
				hzMap._visibleRoomModel(false);

				// 取消以处于hover状态下的模型
				cancelHoverRoom();
			}, false);


			// 监听系统的键盘按下事件
			window.top.addEventListener('keydown', function (event) {

				if (hzMap.handleStatus == hzMap.NORMAL) {
					if (window.top.event.ctrlKey) {
						// 显示房间模型
						hzMap._visibleRoomModel(true);

						// 注册鼠标移动room box 的 hover事件
						hzMap.hzThree.on(MouseEvent.MOUSE_MOVE, hoverRoomEvent);
					}
				}

				if (hzMap.handleStatus == hzMap.EDITMODEL) {// 添加点位时切换操作模式
					if (window.top.event.shiftKey) {
						if (hzMap._transform) {
							if (hzMap._transformRotate) {
								hzMap._transformRotate = false;
								hzThree.rotateObject3d(hzMap._transformObj);
							} else {
								hzMap._transformRotate = true;
								hzThree.translateObject3d(hzMap._transformObj);
							}
						}
					}
					if (window.top.event.keyCode == 27) {
						hzMap._transformRotate = false;
						hzThree.detachObject3d();
					}
				}
			}, false);

			loadPowerGrid(hzMap);
			loadModelComponent(hzMap);	// 加载全图模型
			console.log('HzMap：初始化地图操作数据...');
		});
		console.log('HzMap：已创建地图操作对象...');
	}


	/*
	 * 初始化地图
	 * @param mapId 地图编号
	 * @param options
	 */
	HzMap.prototype.initMap = function (mapId, options) {
		var hzMap = this;
		this.mapId = mapId;

		hzThree.scene.init(mapId, {
			floorW: options.floorW || 50000,
	        floorH: options.floorH || 50000,
	        boundsWidth: options.boundsWidth || 50000,
	        boundsHeight: options.boundsHeight || 50000,
			axisHelper: options.axisHelper || false,
			isShadow: options.isShadow || false,
			isDebug: options.isDebug || false,
			skyBox: options.skyBoxData || skyBoxData,
			shadowFilter: function (mesh) {
				if (isFunc(options.shadowFilter)) {
					options.shadowFilter(mesh);
				}
			},
			pathFindingURL: options.pathFindingURL,
			onInit: function () {
				console.log('HzMap：初始化地图操作对象...');
				// 加载数据
				loadViewMenu(hzMap);
				loadModelGroup(hzMap);
				loadModelPointAll(hzMap);

				if (isFunc(options.onInit)) {
					options.onInit(hzThree);
				}

				hzMap.hasInit = true;
				hzEvent.emit('hz.three.oninit', hzMap);
			}
		});

		// 点击地图时，让地图获取焦点
		$('#' + mapId).on('click', function () {
			window.focus();
		});
	}


	/*
	 * 获取当前视角点位
	 * @param param 单个
	 */
	HzMap.prototype.initBuilding = function (arg0) {
		var hzMap = this, name, building;

		function onEvent (building) {

			// 楼层分离结束事件
			building.on(Building.event.SEPARATE_OVER, function (event) {

			});

			// 楼层合拢结束事件
			building.on(Building.event.CLOSEUP_OVER, function () {
				if (hzMap._curSeparateBuilding == building) {
					if (hzMap._curSeparateBuilding._buildClick == BUILD_CLICK.CLOSEUP) {
						hzMap.restoreUnCtrlFloors();
						hzMap.restoreHiddenFloors();
					}
				}
				hzMap._curSeparateBuilding = null;
			});

			// 建筑点击事件
			building.on(Building.event.BUILD_CLICK, function (event) {
				if (hzMap._curSeparateBuilding == building) {

					if (hzMap.isDragMap()) return;	// 拖拽时不合拢模型

					if (hzMap._curSeparateBuilding.isSeparate) {	// 楼处于分离状态，这时候点击应该进入某层
						hzMap._curSeparateBuilding._isClick = true;	// 标记下当前操作状态

						if (window.top.event.shiftKey) {
							var floorObj = hzMap.getFloorModelObj(event.data);
							if (floorObj) {
								var view = hzMap.findViewByModelName(floorObj.name);
								if (view) {
									hzMap.location(view.id);
									hzEvent.emit('hz.building.floor.click', view);	// 生成楼层点击事件
								}
							}
						} else {
							hzMap._curSeparateBuilding._buildClick = BUILD_CLICK.CLOSEUP;	// 楼层分离还原
							hzMap._curSeparateBuilding.closeUp();
						}
					}
				}
			});
		}

		if (isStr(arg0)) {
			arg0 = [arg0];
		}

		while(arg0.length) {
			name = arg0.shift();
			building = this._buildingMap[name] = new Building(name);
			onEvent(building);
		}

		this._visibleRoomModel(false);
	};


	/*
	 * 判断地图操作状态
	 */
	HzMap.prototype.hasHandleStatus = function (status) {
		return this.handleStatus == status;
	};


	/*
	 * 设置地图操作状态
	 */
	HzMap.prototype.setHandleStatus = function (status) {
		console.log('设置地图操作状态：' + status);
		this.handleStatus = status;
		if (status == this.NORMAL) {
			this.setTransForm(false);
		}
	};


	/*
	 * 设置地图操作状态
	 */
	HzMap.prototype.setHandleNormal = function () {
		this.setHandleStatus(this.NORMAL);
	};


	/*
	 * 设置控制的对象
	 */
	HzMap.prototype.setTransForm = function (enabled, model, mouseUpEvent) {
		var tfCtrl = hzThree.getTransformCtrlObj();
		var hzMap = this;

		if (enabled) {
			if (this.handleStatus != this.EDITMODEL)
				this.setHandleStatus(this.EDITMODEL);

			this._transform = true;
			this._transformObj = model;

			if (this._transformEvt)
				tfCtrl.removeEventListener('mouseUp', this._transformEvt);

			if (isFunc(mouseUpEvent)) {
				this._transformEvt = function () {
					mouseUpEvent(hzMap._transformObj);
				};
				tfCtrl.addEventListener('mouseUp', this._transformEvt, false);
			}

			if (model) {
				model.onBorder(false);
//				model.setBorderShow(true);
				hzThree.translateObject3d(model);
			}

		} else {
			if (this._transformObj) {
				this._transformObj.onBorder(true);
//				this._transformObj.setBorderShow(false);
			}

			this._transform = false;
			this._transformObj = null;

			if (this._transformEvt)
				tfCtrl.removeEventListener('mouseUp', this._transformEvt);

			this._transformEvt = null;
			hzThree.detachObject3d();
		}
	};


	/*
	 * 显示、隐藏房间BOX
	 */
	HzMap.prototype._visibleRoomModel = function (visible) {
		var list = this.hzThree.objectMap['T016'] || [];

		for(var i = 0; i < list.length; i++) {
			if (list[i].visible != visible) {
				list[i].visible = visible;
				hzEvent.emit('hz.room.model.visible', list[i].name, visible);
			}
		}
	}


	/*
	 * 获取当前视角点位
	 * @return {posX: '', posY: '', posZ: '', rotY: '', rotX: '', rotZ: '', tarX: '', tarZ: '', tarY: ''}
	 */
	HzMap.prototype.getViewPoint = function () {
		return hzThree.getViewPoint();
	};


	/*
	 * 获取模型名称
	 * @return 模型名称
	 */
	HzMap.prototype.getModelName = function (modelObj) {
		return hzThree.getNameByObject3d(modelObj) || modelObj.name;
	};


	/*
	 * 视角飞行定位
	 */
	HzMap.prototype.flyTo = function (params) {
		if (this.isFly) {
			params.posX = parseFloat(params.posX || 0);
			params.posY = parseFloat(params.posY || 0);
			params.posZ = parseFloat(params.posZ || 0);
			params.rotX = parseFloat(params.rotX || 0);
			params.rotY = parseFloat(params.rotY || 0);
			params.rotZ = parseFloat(params.rotZ || 0);
			params.tarX = parseFloat(params.tarX || 0);
			params.tarY = parseFloat(params.tarY || 0);
			params.tarZ = parseFloat(params.tarZ || 0);
			hzThree.flyToViewPoint(params);
		}
		this.isFly = true;
	};


	/*
	 * 视角飞行定位
	 * @param position	坐标:{x:0, y:0, z:0}
	 * @param radius 	距离
	 * @param height 	高度
	 * @param time		动画时间
	 */
	HzMap.prototype.flyToLookAt = function (position, radius, height, time) {
		hzThree.Controls.flyToLookAt(position, radius, height, time);
	}


	/*
	 * 视角定位：包括视角飞行、楼层显隐、模型点位加载
	 * @param viewId 视角编号
	 * @param view 	  自定义视角，格式：{posX: '', posY: '', posZ: '', rotY: '', rotX: '', rotZ: '', tarX: '', tarZ: '', tarY: ''}
	 */
	HzMap.prototype.location = function (viewId, view) {
		var viewMenu = this.mViewMenu[viewId],
			hzMap = this,
			loadNo;

		if (this._curSeparateBuilding) {	// 如果当前建筑处于分离则先合拢
			if (this._curSeparateBuilding.isSeparate) {
				this._curSeparateBuilding._buildClick = BUILD_CLICK.LOCATION;	// 楼层定位
				this._curSeparateBuilding.closeUp();
			}
		}

		if (viewMenu) {
			loadNo = this._loadNo = (new Date()).getTime();	// 此次操作的加载编号
			hzEvent.emit('hz.view.location.before', viewMenu, loadNo, this);

			// 获取定位视角
			view = view || {
				posX: viewMenu.pos_x,
				posY: viewMenu.pos_y,
				posZ: viewMenu.pos_z,
				rotX: viewMenu.rot_x,
				rotY: viewMenu.rot_y,
				rotZ: viewMenu.rot_z,
				tarX: viewMenu.tar_x,
				tarY: viewMenu.tar_y,
				tarZ: viewMenu.tar_z
			};

			this.curViewMenu = viewMenu;
			this.clearLocationData();						// 清空上一次加载的模型点位
			this.flyTo(view);								// 视角定位
			this.toggleBuilding(viewMenu.model_group_id);	// 模型显隐
			this.loadLocationData(loadNo, viewId);			// 加载该视角下的模型点位

			hzEvent.emit('hz.view.location.after', viewMenu, loadNo, this);
		} else {
			// 如果没有视角菜单，但是又传入了自定义视角，则只做飞行动作
			view && this.flyTo(view);
		}
	};


	/*
	 * 设备点位定位
	 * @param dvcType	设备类型，参考常量表的POINT_DEVICE_TYPE类型：1.摄像机、2.门禁
	 * @param dvcId		设备编号
	 */
	HzMap.prototype.locationDvc = function (dvcType, dvcId,callBack) {
		var hzMap = this;
		db.query({
			request: {
				sqlId: 'select_model_point_for_map_handle_by_auth',
				whereId: 2,
//				params: [user.cusNumber, dvcType, dvcId],
				params: {
					'cusNumber': user.cusNumber,
					'userId': user.userId,
					'linkType': dvcType,
					'linkId': dvcId
				}
			},
			success: function (data) {
				if (data && data.length) {
					data = data[0];
					hzMap.location(data.mpi_view_id, {
						posX: data.mpi_view_pos_x,
						posY: data.mpi_view_pos_y,
						posZ: data.mpi_view_pos_z,
						rotX: data.mpi_view_rot_x,
						rotY: data.mpi_view_rot_y,
						rotZ: data.mpi_view_rot_z,
						tarX: data.mpi_view_tar_x,
						tarY: data.mpi_view_tar_y,
						tarZ: data.mpi_view_tar_z
					});
					callBack && callBack();
				} else {
					message.alert('未添加设备点位，无法进行定位!');
				}
			}
		});
	}


	/*
	 * 加载电网轨迹
	 */
	HzMap.prototype.loadPowerGrid = function () {
		loadPowerGrid(this);
	};


	/*
	 * 根据区域编号定位视角
	 * @param areaId 区域编号
	 * @return 成功不返回，失败返回错误编码: 'A001':'区域未关联或配置视角'
	 */
	HzMap.prototype.locationArea = function (areaId) {
		var viewId = this.mAreaView[areaId];
		if (viewId) {
			this.location(viewId);
		} else {
			console.warn('区域编号[' + areaId + ']未关联视角，无法进行定位!');
			return ERRCODE.A001;
		}
	}


	/*
	 * 加载定位数据
	 */
	HzMap.prototype.loadLocationData = function (loadNo, viewId) {
		this._loadNo = loadNo;
		// 加载该视角下的模型点位
		loadModelPoint(this, loadNo, viewId);
		loadModelPointAll(this);
		loadModelComponentByViewId(this, loadNo, viewId);	// 加载视角模型
		hzEvent.emit('hz.location.data.onload', this, loadNo, viewId);
	}


	/*
	 * 清除定位数据
	 */
	HzMap.prototype.clearLocationData = function () {
		this.clearModelPoint();
		this.clearModelComponent();
		this.clearLabelPoints();
		hzEvent.emit('hz.location.data.onclear', this);
	}


	/*
	 * 建筑楼层显隐
	 * @param id 模型ID
	 */
	HzMap.prototype.toggleBuilding = function (id) {		
		var targetModel = parentModel = this.mModelGroup[id];
		var parentType, modelType, 
			hzMap = this;

		// 还原之前取消的自动显隐的模型
		this.restoreUnCtrlFloors();

		// 还原之前隐藏的模型
		this.restoreHiddenFloors();

		// 模型显隐
		if (targetModel) {
			parentType = modelType = targetModel.attributes.type;

			// 内外模型组获取楼层组（获取内外楼层）
			if (parentType == MODEL_TYPE.FLOOR_INNER_MODEL || parentType == MODEL_TYPE.FLOOR_OUTER_MODEL) {
				parentModel = this.mModelGroup[targetModel.pid];
				parentType = parentModel.attributes.type;
			}

			// 内外楼层获取楼层组
			if (parentType == MODEL_TYPE.FLOOR_INNER || parentType == MODEL_TYPE.FLOOR_OUTER) {
				parentModel = this.mModelGroup[targetModel.pid];
				parentType = parentModel.attributes.type;
			}

			// 楼层组获取楼栋组
			if (parentType == MODEL_TYPE.FLOOR) {
				parentModel = this.mModelGroup[parentModel.pid];
				parentType = parentModel.attributes.type;
			}

			// 楼栋组
			if (parentType == MODEL_TYPE.BUILDING) {
				var modelName, isEquals = false;	// 是否已经匹配到目标

				traverse(parentModel.children, function (childModel, i) {
					modelName = getModelName(childModel);
					hzMap.setCtrlFloor(modelName, false);

					switch (modelType) {
						case MODEL_TYPE.BUILDING:	// 建筑模型的处理：全部显示
							//hzThree.setVisibleByName(childModel.model_name, true); break;
							return true;
						case MODEL_TYPE.FLOOR:		// 楼层模型的处理：上层的隐藏、下层的显示
							if (childModel == targetModel && !isEquals) {	// 如果匹配到目标并且未设置标识
								isEquals = true;	// 设置标识
							}
							hzMap.visibleFloor(modelName, isEquals);
							break;
						case MODEL_TYPE.FLOOR_INNER:
						case MODEL_TYPE.FLOOR_OUTER:
							break;
					}
				});
			}
		}
	};


	/*
	 * 轨迹移动（2017.03.10 现在使用的是寻路网格来寻找移动轨迹并移动，此功能暂时废弃不使用）
	 * @param params [{
	 * 		aName: '起点名称（优先已名称查询）'
	 * 		aDvcType: '起点关联设备类型', 
	 * 		aDvcId: '起点关联设备编号（优先已名称查询）', 
	 * 		bName: '终点名称',		
	 * 		bDvcType: '终点关联设备类型', 
	 * 		bDvcId: '终点关联设备编号',
	 * 		exchange: '起点终点互换, 此标识将查出来的路线反方向移动'
	 * },...]
	 * @param options {
	 * 		defalutY: 20,
	 *		cameraDis: 3000,
	 *		cameraHeight: 4000,
	 *		viewType: 3,
	 *		walkSpeed: 60,
	 *		model: obj
	 * }
	 */
	HzMap.prototype.trackMove = function (params, options) {
		var hzMap = this,
			Track = this.hzThree.Track,
			trackIds = [],
			temp;

		options = options || {};

		// 先停止当前移动的轨迹（如果有）
		this.stopTrack();

		// 检查参数格式
		if (utils.notArray(params)) {
			if (utils.isObject(params)) {
				params = [params];
			} else {
				console.error('轨迹移动 --> 请求参数错误：[params]不是有效对象!')
				return;
			}
		}

		var length = params.length, 
			loadedNum = 0, 
			loadArray = [],
			status = true;	// 

		for(var i = 0; i < length; i++) {
			temp = params[i];
			temp.cusNumber = user.cusNumber;
			loadArray[i] = null;

			if (temp.aName) {
				queryMaster(i, 0, temp, 
					function (data, temp) {
						return data.aName == temp.a_name && data.bName == temp.b_name;
					},
					function (data, temp) {
						return data.aName == temp.b_name && data.bName == temp.a_name;
					}
				);
			} else {
				queryMaster(i, 1, temp, 
					function (data, temp) {
						return data.aDvcType == temp.a_dvc_type && data.aDvcId == temp.a_dvc_id && data.bDvcType == temp.b_dvc_type && data.bDvcId == temp.b_dvc_id;
					},
					function (data, temp) {
						return data.aDvcType == temp.b_dvc_type && data.aDvcId == temp.b_dvc_id && data.bDvcType == temp.a_dvc_type && data.bDvcId == temp.a_dvc_id;
					}
				);
			}
		}

		/*
		 * 查询轨迹移动主表数据
		 */
		function queryMaster (index, whereId, params, judgeA, judgeB) {
			// 查询轨迹主表信息
			db.query({
				request: {
					sqlId: 'select_robit_move_master_for_map_handle',
					whereId: whereId,
					params: params
				},
				success: function (result) {
					if (status) {
						if (result && result.length) {
							var temp, dataA, dataB;	

							for(var i = 0; i < result.length; i++) {
								temp = result[i];

								if (judgeA(params, temp)) {
									dataA = temp;	// 正方向对象
								}

								if (judgeB(params, temp)) {
									dataB = temp;	// 反方向对象
									dataB.exchange = true;
								}
							}

							queryPoints(index, dataA || dataB);

						} else {
							console.warn('未获取轨迹线路，请求参数<' + JSON.stringify(params) + '>');
							message.alert('未获取轨迹线路，已终止本次操作!');
							status = false;
						}
					}
				},
				error: function (code, msg) {
					console.warn('获取轨迹线路错误[' + code + '-' + msg + ']，请求参数<' + JSON.stringify(params) + '>');
					message.alert('获取轨迹线路错误[' + code + '-' + msg + ']，已终止本次操作!');
					status = false;
				}
			});
		}


		/*
		 * 查询轨迹移动线路点位
		 */
		function queryPoints (index, data) {
			loadArray[index] = data;			// 保存已加载的线路主表数据
			trackIds[index] = data.omg_id;		// 查询轨迹点位的轨迹编号

			if (++loadedNum == length && status) {
				db.query({
					request: {
						sqlId: 'select_robit_move_point_for_map_handle',
						whereId: 1,
						orderId: 0,
						params: [user.cusNumber, trackIds.join(',')]// 格式化查询条件，去掉最后一个逗号
					},
					success: function (result) {
						if (result && result.length) {

							var master, aPoint, bPoint, loadPoints = [];

							function pushPoint (master, points) {
								if (master.omg_id == points.omp_omg_id) {
									loadPoints.push({
										x: points.omp_pos_x,
										y: points.omp_pos_y,
										z: points.omp_pos_z
									});
								}
							}

							for(var i = 0; i < loadArray.length; i++) {
								master = loadArray[i];

								if (master.exchange) {
									for(var x = result.length - 1; x >= 0; x--) {
										pushPoint(master, result[x]);
									}
								} else {
									for(var x = 0; x < result.length; x++) {
										pushPoint(master, result[x]);
									}
								}
							}

							if (!options.model) {
								hzMap.addModel({
									'modelName': 'people_man',
									'path': basePath + 'models/people/',
									'objName': 'people_man.obj',
									'mtlName': 'people_man.mtl',
									'bornType': 'born_addModel',
									'objType': 'people_man',
									'position': {x: 0, y: 0, z: 0}
								}, function (obj) {
									obj.scale.x = 10;
									obj.scale.y = 10;
									obj.scale.z = 10; 
									startMove(obj, loadPoints);
								});
							} else {
								startMove(options.model, loadPoints);
							}
						} else {
							message.alert('未获取到获取轨迹线路点位!');
						}
					},
					error: function (code, msg) {
						message.alert('获取轨迹线路点位错误：' + code + '-' + msg);
					}
				});
			}
		}

		/*
		 * 设置移动参数并开始移动
		 */
		function startMove (model, points) {
			Track.walkSpeed = options.walkSpeed || 60;
			Track.defalutY = options.defalutY || 20;
			Track.cameraDis = options.cameraDis || 3000;
			Track.cameraHeight = options.cameraHeight || 4000;
			Track.setTrackPath(points, {
				viewType: options.viewType || 3, 
				model: model
			});
		}
	}


	/*
	 * 停止轨迹移动
	 */
	HzMap.prototype.stopTrack = function () {
		var Track = this.hzThree.Track;
		if (!Track.over) {
			Track.stopTrack();
			Track.clearRoute();
		}
	}


	/*
	 * 添加标注点位
	 * @params params = {
	 * 		"id": "点位编号",
	 * 		"image": "点位显示图片地址",
	 * 		"text": "点位显示的文本文字",
	 * 		"title": "提示文本",
	 * 		"position": {"x":0, "y": 0, "z": 0}, // 点位在三维地图的坐标
	 * 		"linHeight": "连接线高",
	 * 		"className": "文本文字样式",
	 * 		"minDis": "点位的最小距离可视",
	 * 		"maxDis": "点位的最大距离可视"
	 * }
	 */
	HzMap.prototype.addLabelPoint = function (params, bind, callback) {
		var hzMap = this;

		if (params.html || params.image || params.text) {
			this.hzThree.addLabel(params, hzThree.newHandler(function (params, bind, callback, obj) {
				hzMap.labelPointObjMap[params.id] = obj;

				if (bind) {
					for(var key in bind) {
						obj.on(key, bind[key]);
					}
				}

				if (typeof callback == 'function') {
					callback(obj, params);
				}
			}, [params, bind, callback]));
		} else {
			console.warn('HzMap.addLabelPoint --> 显示的图片或显示的文本必须选择一个!');
		}
	}


	/*
	 * 获取标注点位
	 * @params id 点位编号
	 */
	HzMap.prototype.getLabelPoint = function (id) {
		return this.labelPointObjMap[id];
	}


	/*
	 * 删除标注点位
	 * @params id 点位编号
	 */
	HzMap.prototype.removeLabelPoint = function (id) {
		this.hzThree.removeLabelById(id);
		delete this.labelPointObjMap[id];
	}


	/*
	 * 添加模型
	 * @param params 请求参数，格式：{
	 * 		id: "编号（必填）",
	 * 		linkId: "关联编号（必填）",
	 * 		type: "模型类别（必填），参数值：1.摄像机、2.门禁、3.对讲、4.广播、5.大屏、99.床",
	 * 		modelType: "模型类型（可选）参数值：type=1时0.枪机, 1.球型, 2.半球，其它暂时可默认0",
	 * 		axisHelper: "是否显示XYZ辅线（可选），参数值：true是，false否（推荐editHelper，原本是想用editHelper替换axisHelper）",
	 * 		editHelper: "是否使用编辑工具（可选），参数值：true是，false否",
	 * 		position: "组件坐标（必填），传值格式：{x: "（必填）", y: "（必填）", z: "（必填）"}",
	 * 		rotation: "组件角度（可选），传值格式：{x: "（必填）", y: "（必填）", z: "（必填）"}"
	 * }
	 *
	 * @param bind 模型事件，参数格式：{
	 * 		click: "",
	 * 		rclick: "",
	 * 		mouseover: ""
	 * 		mouseout: ""
	 * 		dblclick: ""
	 * }
	 * 
	 * @param callback 回调函数
	 * 
	 */
	HzMap.prototype.addModelPoint = function (params, bind, callback) {
		var hzMap = this;
		var modelParams = {
			id: this._modelPointFlag + params.id,
			modelClass: params.type,
			modelType: params.modelType,
			position: params.position,
			rotation: params.rotation
		};

		this._loadModel(this.MODELPOINT, modelParams, hzThree.newHandler(function (params, bind, callback, obj) {
			hzMap.modelLabelObjs.push(obj);
			hzMap._editHelper(params, obj);

			obj.hzParams = params;
			obj.onBorder(true);

			// 如果模型没有指定角度则朝向镜头方向
			if ((params.rotation && (isNaN(params.rotation.x) || isNaN(params.rotation.y) || isNaN(params.rotation.z))) || !params.rotation) {
				//obj.lookAt(hzMap.hzThree.getCameraObj().position);
			}

			function bindEvent (name, callback) {
				name = eventMap[name];
				obj.hasEvent(name) || obj.on(name, function (event) {
					callback(event, params);
				});
			}

			for(var name in bind) {
				bindEvent(name, bind[name] || emptyFunc);
			}

			callback(obj);

		}, [params, bind, callback || emptyFunc]));
	};


	/*
	 * 根据关联类型和关联编号获取模型点位对象
	 * @param linkType 关联类型
	 * @param linkId 关联编号
	 */
	HzMap.prototype.getModelPointByLinkId = function (linkType, linkId) {
		var array = this.modelLabelObjs;
		var params = null;

		for(var i = 0; i < array.length; i++) {
			params = array[i].hzParams;

			if (params.type == linkType && params.linkId == linkId) {
				return hzThree.getObjectByName(array[i].name);
			}
		}

		return null;
	}


	/*
	 * 删除模型点位
	 * @param id 点位编号
	 */
	HzMap.prototype.removeModelPointById = function (id) {
		var name = this._modelPointFlag + id;
		var array = this.modelLabelObjs;

		for(var i = 0, len = array.length; i < len; i++) {
			if (array[i].name == name) {
				hzThree.removeModelByName(name);
				array.splice(i, 1);
				break;
			}
		}
	}


	/*
	 * 删除模型点位
	 * @param id 点位编号
	 */
	HzMap.prototype.removeModelPointByLinkId = function (linkType, linkId) {
		var array = this.modelLabelObjs;
		var params = null;

		for(var i = 0, len = array.length; i < len; i++) {
			params = array[i].hzParams;

			if (params.type == linkType && params.linkId == linkId) {
				hzThree.removeModelByName(array[i].name);
				array.splice(i--, 1);
				break;
			}
		}
	}


	/*
	 * 清空模型点位
	 */
	HzMap.prototype.clearModelPoint = function () {
		var array = this.modelLabelObjs;

		while(array.length) {
			hzThree.removeModelByName(array.shift().name);
		}

		this.modelLabelObjs = [];
	};


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
	HzMap.prototype.addComponent = function (params, callback) {
		this.modelComponent.add(params, callback || emptyFunc);
	};


	/*
	 * 删除模型组件
	 * @param id 编号
	 */
	HzMap.prototype.removeComponentById = function (id) {
		var name = this._componentFlag + id;
		var array = this.modelComponents;

		for(var i = 0; i < array.length; i++) {
			if (array[i].name == name) {
				array.splice(i--, 1); break;
			}
		}

		hzThree.removeModelByName(name);
	};


	/*
	 * 清空模型组件
	 */
	HzMap.prototype.clearModelComponent = function () {
		var array = this.modelComponents;
		while (array.length) {
			hzThree.removeModelByName(array.shift().name);
		}
	};



	/*
	 * 编辑辅助
	 * @param params {axisHelper: boolean, editHelper: boolean} 两个字段二选一即可（推荐editHelper，原本是想用editHelper替换axisHelper）
	 */
	HzMap.prototype._editHelper = function (params, obj) {
		this.setTransForm(false);

		if (this.handleStatus == this.EDITMODEL) {
			if (params.editHelper || params.axisHelper) {
				this.setTransForm(true, obj);
			}
		}
	}


	/*
	 * 加载模型
	 * @param type	模型对象类型标识
	 * @param params = {
	 * 		id: "编号（必填）",
	 * 		modelClass: "模型类别（必填），参数值：1.摄像机、2.门禁、3.对讲、4.广播、5.大屏、99.床",
	 * 		modelType: "模型类型（可选）参数值：type=1时0.枪机, 1.球型, 2.半球，其它暂时可默认0",
	 * 		position: "组件坐标（必填），传值格式：{x: "（必填）", y: "（必填）", z: "（必填）"}",
	 * 		rotation: "组件角度（可选），传值格式：{x: "（必填）", y: "（必填）", z: "（必填）"}"
	 * }
	 * 
	 * @param handle 处理函数
	 */
	HzMap.prototype._loadModel = function (type, params, handle) {
		var models = modelComponent.getComponents(), defModel, findModel;
		var path = basePath, objName, mtlName;
		var hzMap = this;

		if (params.position) {
			try {
				for(var key in params.position) {
					params.position[key] = parseFloat(params.position[key]);
				}
			} catch (e) {
				console.error('添加模型失败：属性[position]对象参数错误!'); return;
			}
		} else {
			console.error('添加模型失败：[params]参数对象缺少属性[position]!'); return;
		}

		if (params.rotation) {
			try {
				for(var key in params.rotation) {
					params.rotation[key] = parseFloat(params.rotation[key]);
				}
			} catch (e) {
				console.error('添加模型失败：属性[rotation]对象参数错误!'); return;
			}
		}

		if (models) {
			// 查找匹配类型的模型
			for(var i = 0; i < models.length; i++) {
				if (models[i].class_flag == params.modelClass) {
					if (models[i].default_flag) {
						defModel = models[i];			// 选择一个默认模型（在没有匹配到指定模型时用）
					}
					if (models[i].type_flag == params.modelType) {
						findModel = models[i]; break;	// 查找匹配对应的模型后停止轮循
					}
				}
			}
		} else {
			console.error('添加模型失败：无法获取模型组件库，没有可用模型组件!');
			return;
		}


		// 模型选择（没有则使用默认模型）
		findModel = findModel || defModel;
		if (findModel) {
			path += findModel.path;
			objName = findModel.obj;
			mtlName = findModel.mtl;
		} else {
			console.error('添加模型失败：模型组件库未获取类型[' + params.modelClass + ']的模型组件!');
			return;
		}

		hzThree.addModel({
			'modelName': params.id,
			'path': path,
			'objName': objName,
			'mtlName': mtlName,
			'objType': type,
			'position': params.position,
			'rotation': params.rotation
		}, handle);
	};


	/*
	 * 加载模型
	 */
	HzMap.prototype.addModel = function (params, callback) {
		hzThree.addModel(params, hzThree.newHandler(function (obj) {
			callback && callback(obj);
		}, []));
	}


	/*
	 * 根据名称删除模型
	 * @param name 模型名称
	 */
	HzMap.prototype.removeModelByName = function (name) {
		if (this._transformObj && this._transformObj.name == name)
			this.setTransForm(false);
		hzThree.removeModelByName(name);
	}


	/*
	 * 删除模型
	 */
	HzMap.prototype.removeModel = function (obj) {
		if (this._transformObj == obj)
			this.setTransForm(false);
		hzThree.removeModel(obj);
	}


	/*
	 * 设置自动显示/隐藏模型
	 * @param model		模型对象或名称
	 * @param isCtr 	是否自动：true是、false否
	 */
	HzMap.prototype.setCtrlFloor = function (model, isCtr) {
		if (model) {
			if (isStr(model)) {
				this.getFloorGroupObj(model, function (modelObj) {
					modelObj.isCtrBuilding = isCtr;
				});
			} else {
				model.isCtrBuilding = isCtr;
			}

			if (!isCtr) {
				this._unCtrlFloors.push(model);
			}
		}
	};


	/*
	 * 还原模型自动显隐
	 */
	HzMap.prototype.restoreUnCtrlFloors = function () {
		// 还原之前取消的自动显隐的模型
		var list = this._unCtrlFloors;
		while(list.length) {
			this.setCtrlFloor(list.shift(), true);
		}
	}


	/*
	 * 显示、隐藏楼层组
	 * @param model		模型对象或名称
	 * @param visible 	显示true / 隐藏false
	 */
	HzMap.prototype.visibleFloor = function (model, visible) {
		if (model) {
			if (isStr(model)) {
				this.getFloorGroupObj(model, function (modelObj) {
					model = modelObj;
				});
			}

			// 模型显隐
			model.visible = visible;

			// 记录隐藏的模型
			if (!visible)
				this._hiddenFloors.push(model);

			// 联动标注点位
			this.linkageLabelPoint(model.name, visible);

			hzEvent.emit('hzmap.visible.floor', model.name, visible);
		}
	};


	/*
	 * 还原隐藏的楼层组
	 */
	HzMap.prototype.restoreHiddenFloors = function () {
		// 显示已隐藏的模型
		var array = this._hiddenFloors;
		while(array.length) {
			this.visibleFloor(array.shift(), true);
		}
	};


	/*
	 * 获取楼层组对象
	 * @param modelName	模型对象或名称
	 * @param callback 	回掉函数
	 */
	HzMap.prototype.getFloorGroupObj = function (model, callback) {
		var floorObj = this.getFloorModelObj(model);

		if (floorObj) {
			if (floorObj.type != 'Group') {
				callback(floorObj.parent);
			} else {
				callback(floorObj);
			}
		} else {
			console.warn('未找到楼层组 --> 参数：', model);
		}
	};


	/*
	 * 获取楼层组对象
	 * @param model	模型对象或名称
	 * @param callback 	回掉函数
	 */
	HzMap.prototype.getFloorModelObj = function (model, callback) {
		var children;

		if (isStr(model)) {
			model = hzThree.getObjectByName(model);
		}

		if (model) {
			if (this.hasFloorFlag(model)) return model;
			if (this.hasFloorFlag(model.parent)) return model.parent;

			// 处理门的模型对象
			if (model.type == 'Door') {
				children = model.instance.parent.children || [];
			} else {
				children = model.parent.children || [];
			}

			// 查找该对象同组下的所有对象
			for(var i = 0; i < children.length; i++) {
				model = children[i];
				if (this.hasFloorFlag(model)) return model;
				if (this.hasFloorFlag(model.parent)) return model.parent;
			}
		}
	};


	/*
	 * 根据模型编号获取视角菜单数据
	 */
	HzMap.prototype.findViewByModelName = function (modelName) {
		var modelNode, modelType, viewNode;

		// 获取墙体模型对象
		modelNode = this.getFloorModelObj(modelName) || {};
		modelName = modelNode.name;

		if (modelName) {
			for(var key in this.mModelGroup) {
				modelNode = this.mModelGroup[key];

				if (modelName == getModelName(modelNode)) {
					modelNode = this.mModelGroup[modelNode.pid];	// 获取
					modelNode = this.mModelGroup[modelNode.pid];

					for(var viewId in this.mViewMenu) {
						viewNode = this.mViewMenu[viewId];

						if (viewNode.model_group_id == modelNode.id) {
							return viewNode;
						}
					}
				}
			}
		}
		return null;
	};


	/*
	 * 是否有房间标识
	 * @param 
	 */
	HzMap.prototype.hasRoomFlag = function (model) {
		return validType(model, 'T016');
	};


	/*
	 * 是否有楼层标识
	 * @param 
	 */
	HzMap.prototype.hasFloorFlag = function (model) {
		return validType(model, 'T005');
	};


	/*
	 * 是否属于拖拽地图操作
	 */
	HzMap.prototype.isDragMap = function () {
		return this.mouseHandle == this.MOUSEDRAGUP;
	}


	/*
	 * 是否属于拖拽地图操作
	 */
	HzMap.prototype.notDragMap = function () {
		return !this.isDragMap();
	}


	// 迭代方法
	HzMap.prototype.traverse = traverse;


	/*
	 * 加载楼宇标注
	 */
	HzMap.prototype.loadBuildingLabels = function () {
		var hzMap = this, data;
		db.query({
			request: {
				sqlId: 'select_label_points_for_map_handle',
				whereId: 0,
				params: [user.cusNumber]
			},
			success: function (array) {
				if (array && array.length) {

					var modelName, labelIds;

					for(var i = 0; i < array.length; i ++) {
						data = array[i];
						modelName = data.lpi_bind_model;

						putLabelPoint(hzMap, data, {
							click: function (event) {
								var data = event.data.data;
								var viewMenu = hzMap.findViewByModelName(data.lpi_bind_model);

								if (viewMenu) {
									hzMap.location(viewMenu.id);
								}
							}
						});

						if (modelName) {
							if (hzMap.labelModelMap[modelName] == undefined) {
								hzMap.labelModelMap[modelName] = [];
							}
							hzMap.labelModelMap[modelName].push(data.lpi_point_id);
						}
					}
				}
			},
			error: function (code, desc) {
				console.error('加载模型组件失败：' + code + '-' + desc);
			}
		});
	}


	/*
	 * 清除标注点位
	 */
	HzMap.prototype.clearLabelPoints = function () {
		var list = this.labelPoints;
		var length = list.length,
			temp;

		while(length-- > 0) {
			temp = list.shift();

			// 除了建筑标注点位不删除其它都删除
			if (temp.lpi_point_type != 1) {
				this.removeLabelPoint(temp.lpi_point_id);
			} else {
				list.push(temp);
			}
		}
	}


	/*
	 * 模型联动标注（标注和绑定的模型同步显隐）
	 */
	HzMap.prototype.linkageLabelPoint = function (modelName, visible) {
		var labelId = this.labelModelMap[modelName],
			labelObj;

		if (labelId) {
			labelObj = this.hzThree.getLabelById(labelId);

			if (labelObj) {
				labelObj.setVisible(visible);
			}
		}
	}


	/*
	 * 控制台消息
	 * @param text 消息
	 */
	HzMap.prototype.console = function (text) {
		try {
			var now = new Date();
			var mm = now.getMinutes();
			var ss = now.getSeconds();
			var time = now.getHours() + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;

			var $ul = $('div.map-console ul.contents');
			var $div = $('div.map-console >div');

			if ($ul.find('li').length > 50) {
				$ul.find('li')[0].remove();
			}

			$ul.append('<li>[<span class="time">' + time + '</span>] ' + text + '</li>');
			$div.scrollTop($ul.height() - $div.height());
		} catch (e) {
			console.error(e);
		}
	}


	/*
	 * 显示/隐藏地图
	 * @param visible true显示/false隐藏
	 */
	HzMap.prototype.visibleMap = function (visible) {
		$('#' + this.mapId + ' >canvas').css('opacity', visible ? '' : 0);
		//hzThree.renderer.domElement.style.display = visible ? 'block' : 'none';
	}



	/*
	 * 验证模型类型
	 * @param model 模型或模型名称
	 * @param type 类型
	 */
	function validType (model, type) {
		if (typeof model == 'object')
			model = model.name;

		return model && model.indexOf(type) > 0;
	}




	/*
	 * 加载视角菜单
	 */
	function loadViewMenu (hzMap) {
		var whereId = 4;
		var params = [user.cusNumber, user.deptId, user.dataAuth, user.cusNumber];

//		if (user.dataAuth == 0) {
//			whereId = 4;
//			params = [user.cusNumber, user.deptId, user.dataAuth, user.cusNumber];
//		} else if (user.dataAuth == 1) {
//			whereId = 1;
//			params = [user.cusNumber];
//		} else {
//
//		}

		db.query({
			request: {
				sqlId: 'select_view_menu_for_map_handle',
				whereId: whereId,
				orderId: 1,
				params: params
			},
			success: function (array) {
				hzMap.mViewMenu = {};
				hzMap.mAreaView = {};

				var view = null;
				for(var i = 0, I = array.length; i < I; i++) {
					view = array[i];
					hzMap.mViewMenu[view.id] = view;

					if (view.area_id) {
						hzMap.mAreaView[view.area_id] = view.id;
					}
				}
				hzEvent.emit('map.handle.viewmenu.onload');
			}
		});
	}


	/*
	 * 加载模型文件组
	 */
	function loadModelGroup (hzMap) {
		db.query({
			request: {
				sqlId: 'select_model_group_for_map_handle',
				whereId: 0,
				orderId: 0,
				params: [user.cusNumber]
			},
			success: function (array) {
				tree.toTree(array, {
					formatter: function (node) {
						var type = node.attributes.type;
						var modelName = node.attributes.model_name;

						if (type == 5 || type == 6) {
							// 2017.02.28 update 模型的墙体规则已经改变，以前是模型文件名称 + '_T005', 现在已经在名称里面加上了类型
							if (modelName.indexOf('_T005') < 0) {
								modelName = modelName.replace('.obj', '_T005');
							} else {
								modelName = modelName.replace('.obj', '');
							}
						} else {
							modelName = null;
						}

						node.attributes.model_name = modelName;
					},
					success: function (nodes, maps) {
						hzMap.tModelGroup = nodes;
						hzMap.mModelGroup = maps;
					}
				});
			}
		});
	};


	/*
	 * 加载地图所有点位
	 * @param hzMap	HzMap对象
	 */
	function loadModelPointAll (hzMap) {
		// 加载所有点位
		db.query({
			request: {
				sqlId: 'select_model_point_for_map_handle_by_auth',
				whereId: 0,
				params: {
					'cusNumber': user.cusNumber,
					'userId': user.userId,
					'pointFlag': FLAG
				}
			},
			success: function (array) {
				hzMap.modelPointAll = [];
				traverse(array, function (data, i) {
					hzMap.modelPointAll.push(fmtModelParams(data));
				});
			}
		});
	}


	/*
	 * 加载地图点位
	 * @param hzMap		HzMap对象
	 * @param loadNo	加载标识
	 * @param viewId	视角编号
	 */
	function loadModelPoint (hzMap, loadNo, viewId) {
		// 加载指定视角点位
		db.query({
			request: {
				sqlId: 'select_model_point_for_map_handle_by_auth',
				whereId: 1,
				params: {
					'cusNumber': user.cusNumber,
					'userId': user.userId,
					'pointFlag': FLAG,
					'viewId': viewId
				}
			},
			success: function (array) {

				if (hzMap._loadNo == loadNo) {

					traverse(array, function (data, i) {
						hzMap.addModelPoint(fmtModelParams(data), pointEvent);
					});

					hzEvent.emit('hz.modelpoint.onload', hzMap, loadNo, viewId, array);
				}
			}
		});
	}


	/*
	 * 加载地图电网
	 * @param hzMap HzMap对象
	 */
	function loadPowerGrid (hzMap) {
		// 加载指定视角点位
		db.query({
			request: {
				sqlId: 'select_power_grid_for_map_handle',
				whereId: 0,
				params: [user.cusNumber]
			},
			success: function (powerGrids) {

				// 加载电网点位
				db.query({
					request: {
						sqlId: 'select_power_grid_points_for_map_handle',
						whereId: 0,
						orderId: 0,
						params: [user.cusNumber]
					},
					success: function (points) {
						var powerGrid = hzMap.hzThree.PowerGrid,
							pgid = null, 
							temp = null;

						// 清除上一次加载的电网信息
						for(var pgid in hzMap.powerGridMap) {
							powerGrid.clearPowerGrid(pgid);
						}

						// 清除数据
						hzMap.powerGridMap = {};
						hzMap.powerGrid = [];


						for(var i = 0; i < powerGrids.length; i++) {
							temp = powerGrids[i];
							temp.points = [];

							pgid = temp.power_grid_id;

							for(var x = 0; x < points.length; x++) {
								if (pgid == points[x].power_grid_id) {
									temp.points.push({
										x: parseFloat(points[x].pos_x),
										y: parseFloat(points[x].pos_y),
										z: parseFloat(points[x].pos_z)
									});
								}
							}

							if (temp.points.length > 1) {

								powerGrid.clearPowerGrid(pgid);

								powerGrid.setPowerGridParam({
									pathName: pgid,
									lineColor: temp.line_color,
									lineWidth: temp.line_width,
									electronColor: temp.electron_color
								});

								powerGrid.showPowerGrid({
									pathName: pgid,
									pathData: temp.points,
									isShowElect: temp.show_elect != 1
								});

								hzMap.powerGridMap[pgid] = temp;
								hzMap.powerGrids.push(temp);
							}
						}
					}
				});
			}
		});
	}


	/*
	 * 添加点位标注
	 */
	function putLabelPoint (hzMap, data, events) {
		var icon = data.lpi_show_icon;
		if (icon) {
			icon = basePath + icon;
		}

		hzMap.labelPoints.push(data);
		hzMap.addLabelPoint({
			'id': data.lpi_point_id,
			'html': data.html,
			'text': data.lpi_show_text,
			'type': data.lpi_point_type,
			'image': icon,
			'minDis': data.lpi_dis_min,
			'maxDis': data.lpi_dis_max,
			'lineHeight': data.lpi_line_height,
			'position': {
				'x': parseFloat(data.lpi_pos_x),
				'y': parseFloat(data.lpi_pos_y),
				'z': parseFloat(data.lpi_pos_z)
			},
			'className': data.className,
			'data': data
		}, events);
	}


	/*
	 * 加载全图模型组件
	 */
	function loadModelComponent (hzMap) {
		db.query({
			request: {
				sqlId: 'select_model_component_for_map_handle',
				whereId: 0,
				params: [user.cusNumber, 1]
			},
			success: function (array) {
				addComponent(hzMap, array);
			},
			error: function (code, desc) {
				console.error('加载模型组件失败：' + code + '-' + desc);
			}
		});
	}


	/*
	 * 根据视角编号加载模型组件
	 * @param hzMap
	 * @param loadNo
	 * @param viewId
	 */
	function loadModelComponentByViewId (hzMap, loadNo, viewId) {
		db.query({
			request: {
				sqlId: 'select_model_component_for_map_handle',
				whereId: 1,
				params: [user.cusNumber, 2, viewId]
			},
			success: function (array) {
				if (hzMap._loadNo == loadNo) {
					addComponent(hzMap, array, function (obj) {
						//obj.onBorder(true);
						hzMap.modelComponents.push(obj);
					});
				}
			},
			error: function (code, desc) {
				console.error('加载模型组件失败：' + code + '-' + desc);
			}
		});
	}


	/*
	 * 添加模型组件
	 */
	function addComponent (hzMap, array, callback) {
		if (array) {
			var T = null;
			for(var i = 0; i < array.length; i++) {
				T = array[i];

				hzMap.addComponent({
					'id': T.load_id,
					'modelClass': T.class_flag,
					'modelType': T.type_flag,
					'position': {'x': T.pos_x, 'y': T.pos_y, 'z': T.pos_z},
					'rotation': {'x': T.rot_x, 'y': T.rot_y, 'z': T.rot_z}
				}, callback);
			}
		}
	}


	/*
	 * 格式化模型点位数据
	 * @param data 点位数据
	 */
	function fmtModelParams (data) {
		return {
			id: data.mpi_point_id,
			name: data.mpi_point_name,
			type: data.mpi_link_type,
			linkId: data.mpi_link_id,
			modelType: data.mpi_model_type,
			original: data,
			position: {
				x: parseFloat(data.mpi_pos_x),
				y: parseFloat(data.mpi_pos_y),
				z: parseFloat(data.mpi_pos_z)
			},
			rotation: {
				x: parseFloat(data.mpi_rot_x),
				y: parseFloat(data.mpi_rot_y),
				z: parseFloat(data.mpi_rot_z)
			}
		};
	}


	/*
	 * 遍历数组
	 */
	function traverse (array, callback) {
		for(var i = array.length - 1; i >= 0; i--) {
			var children = array[i].children;
			var result = callback(array[i], i);
			if (result || (children && traverse(children, callback))) {
				return true;
			}
		}
	}


	/*
	 * 获取树的属性
	 */
	function getAttributes (node) {
		return node.attributes || {};
	}


	/*
	 * 获取模型名称
	 */
	function getModelName (node) {
		return getAttributes(node).model_name;
	}


	/*
	 * 是否属于函数
	 */
	function isFunc (val) {
		return typeof val == 'function';
	}

	/*
	 * 是否字符串
	 */
	function isStr (val) {
		return typeof val == 'string';
	}


	// 针对类似frame框架的模型化处理
	try {
		// 如果已经初始化则直接返回对象
		var hz = window.top.hz;
		if (hz) {
			if (hz.mapHandle) {
				console.log('map.handle：引用顶层父级mapHandle对象...');
				return hz.mapHandle;
			}
		} else {
			hz = window.top.hz = {};
		}

		hzEvent.init('map.handle', hz.mapHandle = new HzMap());
		console.log('初始化 --> 三维地图操作模块...');

		return hz.mapHandle;
	} catch (e) {
		console.log('初始化 --> 三维地图操作模块失败...', e);
	}
});