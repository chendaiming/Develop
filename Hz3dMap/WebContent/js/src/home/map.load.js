/**
 * 加载三维地图
 */
define(function (require) {
	var hzMap = require('hz/map/map.handle'),
		hzEvent = require('frm/hz.event'),
		user = require('frm/loginUser'),
		tree = require('frm/hz.tree'),
		db = require('frm/hz.db'),
		message = require('frm/message'),
		mapFilter = require('hz/home/map.load.filter');
		mapTools = require('hz/map/mapTools');

	require('hz/map/extend/roomlabel.extend');

	var totleProgress = 0; // 总体进度
	var priorProgress = 0; // 上一次模型的进度

	var loadedNum = null;
	var loadingProgress = null;

	var loadArray, 
		length, 
		groundLength = 0, 
		index = 0, 
		filter = [], 
		buildingMap = {};

	var node = null;

	/*
	 * 加载默认视角
	 */
	function queryDefaultView () {
		db.query({
			request: {
				sqlId: 'select_view_menu_for_map_handle',
				whereId: 0,
				params: [user.cusNumber]
			},
			success: function (array) {
//				var view = array[0];
//				if (view) {
//					hzMap.location(view.id);
//					console.log('初始化三维地图默认视角...');
//				}

				var dView = (array && array[0]).id;	// 默认视角
				var fView = null;	// 第一个视角

				for(var view in hzMap.mViewMenu) {
					if (fView == null) {	// 获取第一个视角
						fView = view;
					}
					if (dView == view) {	// 如果有默认视角则第一个视角设置默认视角
						fView = dView; break;
					}
				}

				hzMap.location(fView);
				console.log('初始化三维地图默认视角...');	
			}
		});
	}


	/*
	 * 查询模型文件的根目录名称
	 */
	function queryBaseFileName () {
		db.query({
			request:{
				sqlId: 'select_map_model_file_tree_for_load',
				whereId: 0,
				orderId: 0,
				params: [user.cusNumber]
			},
			success: function (array) {
				if (array && array.length) {

					var userDept = user.deptId + '';	// 用户部门
					var authDept = [];					// 授权部门
					var authFlag = false;				// 授权标志
					var parent = null;					// 节点的父级对象
					var authModels = [];				// 授权加载的模型集合

					/*
					 * 设置模型的授权标识根据类型
					 */
					function authOutModel (list, flag, callback) {
						for(var i = 0; i < list.length; i++) {
							if (list[i].attributes.file_flag == flag) {
								list[i].attributes.loadAuth = true;
								callback(list[i]);
							}
						}
					}


					/*
					 * 授权外楼层模型
					 * @param node 楼层节点
					 */
					function handleOutModel (node) {

						// 获取同级节点集合
						var list = node.parent.children;

						// 设置楼层节点的下部分楼层
						for(var i = 0; i < list.length; i++) {
							if (list[i] != node) {
								authOutModel(list[i].children, 4, function (node) {
									authOutModel(node.children, 6, function (node) {
										authModels.push(node.name);// 记录外楼层的模型文件名称
									});
								});
							} else {
								return;
							}
						}
					}


					/*
					 * 树结构化数据
					 */
					tree.toTree(array, {
						'formatter': function (node) {
							authFlag = false;
							parent = node.parent;

							// 初始化父节点的授权相关属性
							if (parent) {
								pLoadFlag = parent.attributes.load_flag;
								pLoadAuth = parent.attributes.loadAuth;
							} else {
								// 只有跟节点没有父类，这里初始化跟节点的父属性
								pLoadFlag = 1;		// 允许加载模型因为如果不允许则下面的子类都不能加载
								pLoadAuth = false;	// 默认没有授权
							}

							// 如果父模型的加载标识为不加载，则其所有子类也不能加载
							if (pLoadFlag == 1) {

								// 只有当该节点的加载标识为允许加载时，才判断授权部门
								if (node.attributes.load_flag == 1) {

									// 非省局权限 或监狱权限的用户 按部门加载模型
									if (user.dataAuth != 1 && user.dataAuth != 2) {
										authDept = (node.attributes.dept_ids || '').split(',');	// 格式化加载授权部门

										// 父模型 或 该部门被授权加载时可以加载该模型
										if (pLoadAuth || authDept.indexOf(userDept) > -1) {
											authFlag = true;
										}
									} else {
										authFlag = true; 
									}

									// 授权该楼层以下的外层加载
									if (authFlag) {
										switch(node.attributes.file_flag) {
											case 5: case 6:
												authModels.push(node.name);		// 记录类型5、6的节点名称，因为5、6类型的节点名称就是模型的文件名
												handleOutModel(parent.parent); 
												break;
											case 3: case 4:
												handleOutModel(parent); break;
											case 2:
												handleOutModel(node); break;
										}
									}
								}
							} else {
								// 将子类型标识改成和父类型一样不能加载
								node.attributes.load_flag = pLoadFlag;
							}

							// 更新授权加载标识
							node.attributes.loadAuth = authFlag;
						},
						'success': function (nodes, maps) {
							getModelList(nodes[0].name, authModels);
						}
					});
				} else {
					message.alert('未导入模型文件信息，无法加载地图模型!');
					hzMap.visibleMap(false);
					$('#mapLoading').fadeOut(1000);
				}
			},
			error: function (code, desc) {
				$('#mapLoading').fadeOut(1000);
				message.alert('模型加载错误[' + code + ']：' + desc);
			}
		});
	}


	/*
	 * 获取模型列表
	 */
	function getModelList (fileName, authModels) {

		$.post(mapBasePath + 'map/getFile?name=' + fileName, function (data) {
			var temp, path, name, lname, dx = [], simple = [], doors = [], outs = [], ins = [], others = [];

			data = JSON.parse(data);
			authModels = authModels || [];

			for(var i = 0 ; i < data.length; i++) {
				temp = data[i];
				path = temp.path;
				name = temp.name;
				node = {name: name, path: mapBasePath + path, obj: name + '.obj', mtl: name + '.mtl'}

				// 统一转成小写之后再匹配
				lname = name.toLowerCase();

				if (lname.indexOf('door_') > -1) {
					doors.push(node);
				} else {
					if (mapFilter.filter(lname)) {
						if (lname.indexOf('_dx') > 0 || path.indexOf('ground_model') > 0) {
							dx.push(node);
						} else if (lname.indexOf('simple') > 0 || path.indexOf('/simple_model') > 0){
							simple.push(node);
						} else {

							// 建筑模型加载规则
							// 部门为空的不加载
							// 部门下的子部门要加载
							// 部门同级下的低楼层要加载
							if (path.indexOf('building_model') > 0) {
								if (authModels.indexOf(node.obj) > -1) {
									if (path.indexOf('/out/')) {
										outs.push(node);

										var strs = name.split('_');
										if (!buildingMap[strs[1]]) {
											buildingMap[strs[1]] = true;
										}
									} else if (path.indexOf('/in/')) {
										ins.push(node);
									}
								}
							} else {
								others.push(node);
							}
						}
					}
				}
			}

			groundLength = dx.length;
			loadArray = [].concat(others, dx, doors, simple, outs, ins);
			length = loadArray.length;

			if (dx.length || simple.length || outs.length || ins.length) {
				console.log('开始加载模型....' + length);
				$('#mapLoading').show();
				$('#loadSchedule').show();
				$('span.count-number').html(length);
				loadNext();
			} else {
//				message.alert('无法加载模型，可加载模型资源未 0');
				visibleMap();
				hzMap.visibleMap(false);
			}
		});
	}


	/*
	 * 加载下一个模型
	 */
	function loadNext () {
		if (index < length) {
			node = loadArray[index++];
			loadModel(node.path, node.mtl, node.obj);
		} else {
			console.log('模型加载完成!!!');
			$('#loadSchedule').delay(1500).fadeOut(500);
//			console.log(hzMap.hzThree.objectMap);

			for(var name in buildingMap) {
				hzMap.initBuilding(name);
			}

			// 初始化功能配置列表
			hzMap.hasLoaded = true;
			hzMap.loadBuildingLabels();

    		hzEvent.emit('map.model.onload', hzMap);

    		loadArray = null;
    		length = null;
    		buildingMap = null;
    		groundLength = null;
    		priorProgress = null;
    		totleProgress = null;
    		filter = null;
    		index = null;
		}
	}



//	var schedule = 0;

	/*
	 * 加载模型
	 */
	function loadModel (path, mtl, obj) {
//		console.log('加载模型[' + index + '/' + length + ']：' + obj);
		$('span.current-number').html(index);
		hzMap.hzThree.scene.loadObj(path, mtl, obj, {
			'onProgress': function (xhr) {
				if (xhr.lengthComputable) {
					$('span.current-schedule').html(Math.round(xhr.loaded / xhr.total * 100));
				}

				if (groundLength && xhr.lengthComputable) {
	                var percentComplete = Math.round(xhr.loaded / xhr.total * 100);
	                if (percentComplete >= 100) {
	                	priorProgress += percentComplete;
	                	totleProgress = priorProgress;
	                } else {
	                	totleProgress = priorProgress + percentComplete;
	                }

	                if (totleProgress >= 100 * groundLength) {
                		loadingProgress = null;
                		loadedNum = null;
                		visibleMap();
                	} else {
                		drawLoading(Math.round(totleProgress / groundLength));
                	}
	            }
			},
			'onLoad': function (object) {
				loadNext();
			},
			'onError': function () {
				console.log('模型[' + obj + ']加载失败!');
				loadNext();
			}
		});
	}


	/*
	 * 显示地图
	 */
	function visibleMap () {
		$('#mapLoading').fadeOut(1000);
		$('#hzMap').show();
		hzMap.mapConfig.init();
	}


	/*
	 * 绘制加载进度动画
	 */
    function drawLoading (loaded) {
    	if (!loadedNum)
    		loadedNum = document.getElementById('loadedNum');
    	if (!loadingProgress)
    		loadingProgress = document.getElementById('loadingProgress').getContext('2d');

    	loadedNum.innerHTML = loaded;
        loaded = loaded * 2 / 100 * Math.PI, 

        loadingProgress.clearRect (0, 0, 204, 204);
        loadingProgress.beginPath();
        loadingProgress.arc(102, 102, 98, 0, loaded, false);
        loadingProgress.lineWidth = 8;
        loadingProgress.strokeStyle = '#ff6000';
        loadingProgress.stroke();
    }


	try {
		/*
		 * 添加样式 和核心DOM元素
		 */
		$(window.top.document.head).append('<link rel="stylesheet" href="css/map/map.main.css" charset="utf-8">');
		$(window.top.document.body).prepend(
			'<div id="loadSchedule" style="display: none;">'+
				'正在加载地图资源(<span class="number current-number">0</span>/<span class="count-number">0</span>) ...<span class="number current-schedule">0</span>%<br>'+
				'<span class="desc">资源加载会导致系统卡顿，请尽量减少操作</span>'+
			'</div>' + 
			'<div id="mapLoading" style="display:none;">' +
				'<div class="splash" id="splash">' +
				    '<div class="splash-inner">' +
				        '<div class="loading-circle" id="loadingCircle">' +
				            '<p><span id="loadedNum">0</span>%</p>' +
				            '<canvas class="mask" id="loadingProgress" width="204" height="204"></canvas>' +
				            '<canvas class="bg" width="204" height="204"></canvas>' +
				        '</div>' +
				        '<h3>正在加载地形资源...</h3>' +
				    '</div>' +
				'</div>' +
			'</div>' +
			'<div id="hzMap" style="display:none;">' +
				'<div class="map-cross x"></div>' +
				'<div class="map-cross y"></div>' +
				'<div class="map-console"><div><ul class="contents"></ul></div></div>' +
		  	'</div>'
		);

		hzEvent.subs('map.handle.viewmenu.onload', function () {
			queryDefaultView();
		});

		/*
		 * 初始化地图
		 */
		hzMap.initMap('hzMap', {
			isDebug: true,
			floorW: 150000,
	        floorH: 150000,
	        boundsWidth: 150000,
	        boundsHeight: 150000,
			shadowFilter: function (mesh) {
				mesh.castShadow = mesh.name.indexOf('_dm_') < 0;
				mesh.receiveShadow = true;
			},
			pathFindingURL: pathFindingURL,
			onInit: function () {
				queryBaseFileName();
			}
		});
	} catch (e) {
		console.error(e);
	}
});