/**
 * 
 */
define(function (require) {
	var mapHandle = require('hz/map/map.handle'),
		hzEvent = require('frm/hz.event'),
		user = require('frm/loginUser'),
		drag = require('frm/hz.drag'),
		dialog = require('frm/dialog'),
		db = require('frm/hz.db'),
		ls = require('frm/localStorage');

	var mapPrisoner = null;
	var labelObjs = [];
	var prisonerPositions = {};
	var prisonerCountLabels = [];

	var todayCountNodeHtml = '<div class="tc-node"><span class="tc-title"></span><span class="tc-num"></span><span class="tc-unit">人</span></div><div class="tc-split"></div>';
	var todayCountData = [];
	var jqNodeMap = {};
	var enabledTodayCount = true;

	var PPI_LINK_TYPE = {
			'PRISONER': 98
	};

	/*
	 * 添加标注
	 */
	function addLabel (node, bind) {
		if (mapHandle && node.position) {
			mapHandle.addLabelPoint({
				id: node.id,
				text: node.text,
				image: node.image || (basePath + 'css/images/location.png'),
				className: node.className || '',
				minDis: node.minDis || 0,
				maxDis: node.maxDis || 10000,
				position: node.position
			}, bind, function (labelObj) {
				//labelObjs.push(labelObj);
			});
		}
	}


	/*
	 * 统计人员
	 */
	function countPrisoner (viewId, loadNo) {
		var array = [];

		while(prisonerCountLabels.length) {
			mapHandle.hzThree.removeLabelById(prisonerCountLabels.shift());
		}


		var viewMenu = mapHandle.mViewMenu[viewId];
		if (viewMenu && viewMenu.area_id) {
			db.query({
				request: {
					sqlId: 'select_count_prisoner_by_area_rfid_for_map',
					params: [user.cusNumber, viewMenu.area_id]
				},
				success: function (result) {
					var temp;
					for(var i = 0; i < result.length; i++) {
						temp = result[i];
						array.push({id:temp.rfid_id, text: temp.count + '人'});
					}

					hzEvent.call('hz.building.prisoner.count', array);
				},
				error: function (code, msg) {
					console.error('查询统计区域当前罪犯异常：' + code + ':' + msg);
				}
			})
		}
	}


	/*
	 * 清除统计
	 */
	function clearPrisonerPanel () {
		mapPrisoner && mapPrisoner.clear();
	}


	/*
	 * 加载罪犯信息面板
	 * @param loadNo	加载编号
	 * @param viewId	视角菜单
	 */
	function loadPrisonerPanel (loadNo, viewId) {
		try {
			var self = this;

			requirejs(['hz/map/mapPoint/map.prisoner'], function (MapPrisoner) {
				var temp, panel;

				mapPrisoner = mapPrisoner || new MapPrisoner();
				mapPrisoner.clear();

				db.query({
					request: {
						sqlId: 'select_prisoner_panel_for_map_handle',
						whereId: 0,
						params: [user.cusNumber, viewId]
					},
					success: function (result) {
						if (mapHandle._loadNo == loadNo) {
							for(var i = 0; i < result.length; i++) {
								temp = result[i];
								mapPrisoner.add({
									'id': temp.point_id,
									'code': temp.prsnr_code,
									'name': temp.prsnr_name,
									'image': temp.photo_path || (basePath + 'css/image/zfpic.png'),
									'bedCode': temp.bed_code || '',
									'bedName': temp.bed_name || '',
									'position': {'x': temp.pos_x, 'y': temp.pos_y, 'z': temp.pos_z}
								}, function (infoPanel) {
									infoPanel.on('click', function (event) {
										var target = event.target || {};
										var data = target.data;
										hzEvent.emit('map.infopanel.click', data, target);
									});
								});
							}
						}
					}
				});
			});
		} catch (e) {
			console.warn(e);
		}
	}


	/*
	 * 初始化当日统计面板
	 */
	function initTodayCountPanel () {
		var mapConfig = mapHandle.mapConfig;
		if (mapConfig) {
			// 添加到配置面板
			mapConfig.add('PRISONER001', '显示当日统计', function (id, checked) {
				visibleTodayCount(checked);
			}, enabledTodayCount);

			if (mapConfig.getConfig('PRISONER001')){
				visibleTodayCount(true);
			}
		} else {
			setTimeout(initTodayCountPanel, 100);
		}
	}


	/*
	 * 显示隐藏统计
	 */
	function visibleTodayCount (v) {
		if (enabledTodayCount = v) {
			loadTodayCount();
		}

		for(var key in jqNodeMap) {
			jqNodeMap[key].toggle(v);
		}
	}


	/*
	 * 加载当日统计
	 */
	function loadTodayCount () {
		db.query({
			request: {
				sqlId: 'query_count_today_prisoner',
				params: {cusNumber: user.cusNumber}
			},
			success: function (list) {
				if (list && list.length){
					for(var i = 0; i < list.length; i++) {
						if (jqNodeMap[list[i].id]) {
							refreshHeadTitle(list[i]);
						} else {
							initHeadTitle(i, list[i]);
						}
					}
				}
			}
		});
	}

	/*
	 * 初始化顶部信息数据
	 */
	function initHeadTitle (i, data) {
		hzEvent.load('map.headtitle', function (headTitle) {
			var id = data.id;
			if (jqNodeMap[id]) {
				refreshHeadTitle(data);
			} else {
				var jqNode = headTitle.add({'id':id, 'html': data.title + '<span class="mht-num" data-id="' + id + '">' + data.count + '</span>人', 'index':i});
				if (jqNode) {
					todayCountData[id] = data;
					jqNodeMap[id] = jqNode;
					
					if(data.count > 0) {
						jqNode.find('span.mht-num').on('click', function () {
//						var data = todayCountData[$(this).attr('data-id')];
							sessionStorage.setItem("cdm-title-prisoner-flag", $(this).attr('data-id'));
							dialog.open({'id':'cdm-title-prisoner-list', 'type':2, 'title':'罪犯信息查询', 'url':'page/cds/prisoner/prisonerInfo.html'});
//						console.log(data);
						});
					}	
				}
			}
		});
	}

	/*
	 * 刷新顶部信息数据
	 */
	function refreshHeadTitle (data) {
		jqNodeMap[data.id].find('span.mht-num').html(data.count);
		todayCountData[data.id] = data;
	}

	try {
		// 添加RFID相关样式
		$(window.top.document.head).append('<link rel="stylesheet" href="css/cds/prisoner/prisoner.main.css" charset="utf-8">');

		/*
		 * 统计罪犯
		 */
		hzEvent.on('hz.building.prisoner.count', function (list, bind) {
			var node;
			for(var i = 0; i < list.length; i++) {
				node = JSON.parse(JSON.stringify(list[i]));
				node.position = prisonerPositions[node.id];
				node.id = 'prisoner_count_label_' + node.id
				node.className = 'prisoner-count';
				node.image = node.image || (basePath + 'css/images/peoples_red.png');
				node.minDis = 10;
				node.maxDis = 8000;
				prisonerCountLabels.push(node.id);
				addLabel(node, bind);
			}
		});

		hzEvent.subs('hz.location.data.onclear', function (mapHandle) {
			clearPrisonerPanel();
			countPrisoner();
		});


		hzEvent.subs('hz.location.data.onload', function (mapHandle, loadNo, viewId) {
			loadPrisonerPanel(loadNo, viewId);
			countPrisoner(viewId, loadNo);
		});


		/*
		 * 注册搜索人员定位事件（rfid.main.js 和 prisonerMain.js 都会注册，RFID优先）
		 */
		hzEvent.subs('search.people.location', 'people.location', function (params) {
			db.query({
				request: {
					sqlId: 'select_prisoner_panel_point_for_search_location',
					whereId: 0,
					params: [user.cusNumber, PPI_LINK_TYPE.PRISONER, params.id]
				},
				success: function (list) {
					if (list && list.length) {
						var data = list[0];
						var viewId = data.view_id;
						var position = {
							'x': parseFloat(data.pos_x),
							'y': parseFloat(data.pos_y),
							'z': parseFloat(data.pos_z)
						};

						if (mapHandle.curViewMenu.id != viewId) {
							mapHandle.isFly = false;
							mapHandle.location(viewId);
						}

						mapHandle.flyToLookAt(position, 180, 235, 1000);

					} else {
						mapHandle.console('地图未配置人员面板信息，编号:' + params.id);
					}
				},
				error: function (code, desc) {
					mapHandle.console('搜索人员定位异常：[' + code + desc +']');
				}
			});
		});

		initTodayCountPanel();

		// 模块引入
		require(['cds/prisoner/overAlarm/overAlarm']);
		require(['hz/map/mapPoint/map.prisoner']);
		require(['hz/cds/prisoner/person/personMsg'],function(personMsg){
    		personMsg.initPersonEvent();
    	});

		console.info('初始化 --> 罪犯子模块');
	} catch (e) {
		console.error('初始化 --> 罪犯子模块异常：', e);
	}
});