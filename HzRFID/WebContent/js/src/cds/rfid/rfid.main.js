/**
 * RFID人员定位
 * 三维地图接口：
 * 	1.寻路网格：寻找两点之间的可以移动的路径点
 * 	2.轨迹移动：通过寻路网格匹配的路径点坐标计算出移动轨迹并在轨迹上移动
 * 	3.二维点位：移动点在轨迹线路上移动时的展现方式
 */
define(function (require) {
	var mapHandle = require('hz/map/map.handle');
	var message = require('frm/message');
	var hzEvent = require('frm/hz.event');
	var login = require('frm/loginUser');
	var db = require('frm/hz.db');
	var dialog = require('frm/dialog');

	var detailHtml = '<div class="label-detail" oncontextmenu="return false;"><ul></ul></div>';
	var countLabelHtml = '<div class="label-html" title="{1}"><div class="count-name">{2}</div><span class="count-now">当前区域<span class="number">{3}</span>人</span></div>';
	var countLabelTimerId = null;		// 统计标注定时取消效果的定时器编号

	var plusHtml = '<span class="label-num plus">+1</span>';
	var minusHtml = '<span class="label-num minus">-1</span>';

	var hasLoadingLabels = false;	// 是否正在加载人员分布点位

	var cameraType = 1;				// 设备类型：摄像机
	var linkType = 15;				// 关联类型：15是RFID设备
	var movingManager = null;		// 移动管理对象
	var movingClass = 'moving';		// 移动对象的样式
	var movingWaitPools = {};		// 移动等待处理池
	var moveObj = null;				// 移动对象
	var movingObjs = {};			// 当前正在移动的对象
	var movingNumber = 0;			// 当前移动对象的数量
	var maxMovingNumber = 10;		// 最大允许同时出现的移动对象

	var curWayObj = null;			// 当前的网格
	var curViewMenu = {};			// 当前视角
	var rfidList = [];				// 当前视角下的RFID点位数据
	var randomDistMap = {};			// RFID编号 与 随机分布对象映射关系数据
	var labelObjMap = {};			// 添加的标注点位的对象
	var labelDataMap = {};			// 查询的标注点位的原信息{"id": "点位编号", "rid": "RFID编号", "text": "点位名称", "title": "标题", "image": "显示的图标", "position": "显示的位置"}
	var labelDetailMap = {};		// RFID人员标注的详情信息映射关系数据
	var labelBasicData = {};		// RFID人员标注的基础数据（查询的原始数据）
	var locationPeopleId;			// 定位的人员编号

	var rfidRoomMap = {};			// RFID对应房间
	var roomRfidMap = {};			// 房间对应显示的RFID
	var countLabelObjMap = {};		// 统计标注对象
	var timerIdMap = {};			// 在未启用动态流动时，人员流动需要显示一下名字已起到提醒作用（表示该人员移动了得效果），1秒之后关闭效果，这里存放的是关闭的定时器任务ID

	var enabledScatter = true;			// 启用RFID人员分布功能
	var enabledShowName = false;		// 显示RFID人员名称
	var enabledDynamicFlow = true;		// 启用RFID人员动态流动跟踪
	var enabledScatterCount = false;	// 启用RFID人员分布统计
	var enabledPeopleCount = true;		// 启用RFID人员总数统计
	var jqRfidCount = null;				// RFID人员统计总数的jquery对象（显示在地图顶部信息栏的）

	var POLICE_ICON = basePath + 'css/images/pos_plc_1.png';
	var PRISONER_ICON = basePath + 'css/images/pos_psr_1.png';
	var PRISONER_ICONS = {
		'0': PRISONER_ICON,
		'1': basePath + 'css/images/pos_psr_3.png'
	}

	var MPI_LINK_TYPE = {
		'RFID': 15	
	};

	var RMR_PEOPLE_TYPE = {
		'PRISONER': 2	
	};


	/*
	 * 初始化对象属性
	 */
	function initProperty (object) {
		object.range = 100;
		object.number = 0;
	
		object.hasCheckWay = false;
		object.flagIndex = 0;
		object.flagArray = [[1,1],[1,-1],[-1,-1],[-1,1]];
		object.flagX = 1;
		object.flagZ = 1;

		object.groupArray = [[],[],[],[]];
		object.groupIndex = 0;
		object.group = null;
		object.childrenData = [];
	}




	/*
	 * 随机分布对象
	 * @param rfid = {
	 * 		"id": "",
	 * 		"position": ""
	 * }
	 */
	function RandomDist (rfid) {
		this.rfid = rfid;

		initProperty(this);

		if (!moveObj) {
			moveObj = mapHandle.hzThree.createSphere(2, 0x00FFFF, {x:0,y:0,z:0});
			moveObj.visible = false;
		}
	}


	/*
	 * 更新坐标方位标识
	 */
	RandomDist.prototype.updateFlag = function () {
		// 更新相关的数据
		this.flagIndex++;

		if (this.flagIndex >= this.flagArray.length) {
			this.flagIndex = 0;
		}

		this.flagX = this.flagArray[this.flagIndex][0];
		this.flagZ = this.flagArray[this.flagIndex][1];
	};


	/*
	 * 检查坐标方位的寻路网格是否存在
	 */
	RandomDist.prototype.checkWay = function (labelData, callback) {
		var rfidPos = this.rfid.position;
		var thiz = this,
			flagArray = [], 
			array;

		(function execute() {
			if (curWayObj) {
				array = thiz.flagArray.shift();

				curWayObj.isInPoly({
					'x': rfidPos.x + 10 * array[0], 
					'z': rfidPos.z + 10 * array[1],
					'y': rfidPos.y
				}, function (position) {
					position && flagArray.push(array);

					if (thiz.flagArray.length == 0) {
						thiz.hasCheckWay = true;
						thiz.flagArray = flagArray;
						thiz.updateFlag();
						thiz.pushToMap(labelData, callback);
					} else {
						execute();
					}
				});
			}
		})();
	};


	/*
	 * 添加一个随机点
	 * @param labelData = {
	 * 		"id": "人员编号",
	 * 		"rid": "RFID编号",
	 * 		"text": "人员名称",
	 * 		"title": "显示TITLE",
	 * 		"image": "显示的图标",
	 * 		"position": {
	 * 			"x": 0,
	 * 			"y": 0,
	 *			"z": 0
	 * 		}
	 * }
	 * 如果传了position属性直接使用传入的坐标，则不再会随机生成坐标点位
	 * 
	 * @param callback 回调函数
	 */
	RandomDist.prototype.pushToMap = function (labelData, callback) {
		if (!enabledScatter) return;

		if (this.hasCheckWay) {
			var group = this.groupArray[this.groupIndex++];
			var pos = this.rfid.position;
			var rid = this.rfid.id;
			var thiz = this;

			var maxTimes = 50, space = 20, x = 0, z = 0;
			var randomPos, childPos;

			if (this.groupIndex > 3) {
				this.groupIndex = 0;
			}

			/*
			 * 生成随机数
			 */
			function random (times, handle) {
				if (!enabledScatter) return;

				// 如果传了position属性直接使用传入的坐标，则不再会随机生成坐标点位
				if (labelData.position) {
					childPos = labelData.position;	// TODO: 这里要不要取父数据的Y坐标
					randomPos = {'x':0, 'z':0};

					if (curWayObj) {
						curWayObj.isInPoly(childPos, function (position) {
							if (position) {
								handle(randomPos, position);
							} else {
								handle(randomPos, childPos);
							}
						});
					} else {
						handle(randomPos, childPos);
					}
					console.log('自带地图坐标，不再随机分配坐标');
					return;
				}

				if (times-- > 0) {
					x = RandomNumBoth(10, thiz.range) * thiz.flagX;
					z = RandomNumBoth(10, thiz.range) * thiz.flagZ;

					var success = true;
					for(var i = 0, I = group.length; i < I; i++) {
						if (Math.abs(group[i].x - x) < space || Math.abs(group[i].z - z) < space) {
							success = false; break;
						}
					}

					if (success) {
						childPos = {'x': pos.x + x, 'y': pos.y, 'z': pos.z + z};
						randomPos = {'x':x, 'z':z};

						// 判断点是否在寻路网格上
						if (curWayObj) {
							curWayObj.isInPoly(childPos, function (position) {
								if (position) {
									handle(randomPos, position);
								} else {
									random(times, handle);
								}
							});
						} else {
							handle(randomPos, childPos);
						}
					} else {
						random(times, handle);
					}
				} else {
					// 在某个间距之内没有随机到坐标则缩小间距再随机生成
					if (space >= 0) {
						space -= 1;
						random(maxTimes, handle);
					} else {
						callback();
					}
				}
			}

			// 开始产生随机坐标
			random(maxTimes, function (randomPos, childPos) {
				if (!enabledScatter) return;

				labelData.position = childPos;
				group.push(randomPos);

				// 获取上一次的信息
				var lastInfo = labelDataMap[labelData.id] || {};
				if (lastInfo) {
					var lastRoomId = rfidRoomMap[lastInfo.rid] || lastInfo.rid;
					var nowRoomId = rfidRoomMap[labelData.rid] || labelData.rid;

					if (randomDistMap[lastInfo.rid]) {
						randomDistMap[lastInfo.rid].removeChild(labelData.id);
						if (lastRoomId != nowRoomId) {
							updateCountLabel(lastInfo);
						}
					} else {
						lastInfo = null;
					}
				}

				if (labelData.position) {
					// 记录添加的数据并添加一个标注点
					thiz.removeChild(labelData.id);
					thiz.addChild(labelData);

					labelDataMap[labelData.id] = labelData;

					var labelObj = labelObjMap[labelData.id];
					if (labelObj) {
						createMoving(labelObj, moveObj.clone(), labelObj.position, labelData.position);
					} else {
						addLabelPoint(labelData, lastInfo);
					}
				}

				thiz.updateFlag();// 更新坐标方位的标识
				callback();
			});

		} else {

			this.checkWay(labelData, callback);

		}
	}


	/*
	 * 添加子类
	 * @param child 子类的编号
	 */
	RandomDist.prototype.addChild = function (child) {
		this.childrenData.push(child);
	}


	/*
	 * 删除所有子类
	 */
	RandomDist.prototype.clearChildren = function () {
		var cid = null;
		while(this.childrenData.length) {
			removeLabelPoint(this.childrenData.shift().id);
		}

		initProperty(this);
	};


	/*
	 * 删除子类
	 * @param cid 子类的编号
	 */
	RandomDist.prototype.removeChild = function (cid) {
		for(var i = 0; i < this.childrenData.length; i++) {
			if (this.childrenData[i].id == cid) {
				return this.childrenData.splice(i, 1);
			}
		}
	};


	/*
	 * 添加标注点位
	 * @params params = {
	 * 		"id": "点位编号",
	 * 		"rid": "RFID编号",
	 * 		"text": "点位名称",
	 * 		"title": "标题",
	 * 		"image": "显示的图标",
	 * 		"position": "显示的位置"
	 * }
	 * @params pos	点位坐标
	 */
	function addLabelPoint (params, lastInfo) {
		if (!enabledScatter) return;
		mapHandle.label.add({
			id: params.id,
			text: params.text || '',
			showText: enabledShowName,
			title: params.title,
			image: params.image,
			className: 'label-rfid',
			minDis: 10,
			maxDis: 50000,
			position: params.position
		}, {
			'click': function (event) {
				var labelData = labelDataMap[event.data.id];
				if (labelData) {
					queryAndLinkageDvc(labelData.rid);
				}
			},
			'dblclick': function (event) {
//				var labelData = labelDataMap[event.data.id];
//				if (labelData) {
//					hzEvent.emit('map.infopanel.click', {'code': labelData.id});	// 打开人员详情
//				}
			},
			'mouseenter': function () {
				window.event.stopPropagation();
				var offset = $(this).offset();
				var width = $(this).width();
				var height = $(this).height();

				// 显示hover效果并显示详情
				showMovingCss(labelObjMap[this.id]);
				showPeopleDetail(labelDetailMap[this.id], {
					top: offset.top + height + 2,
					left: offset.left + width / 2 + 2
				});
			},
			'mouseleave': function () {
				movingObjs[this.id] || hideMovingCss(labelObjMap[this.id]); // 移动的对象不隐藏姓名
				hidePeopleDetail();
			}
		}, function (obj) {
			/*
			 * 因为异步的问题会导致如果切换视角过快，上一个视角的数据不会被及时清除掉，所以这里需要判断下
			 * 模型加载完成之后还是否在上一次的数据中，不在则删除该模型
			 */
			var id = params.id;
			if (labelDataMap[id]) {
				labelObjMap[id] = obj;

				// 突出显示定位人员信息
				if (hasNeedLocation(id)) {
					peopleLocation(id);
				}

				if (lastInfo) {
					createMoving(obj, moveObj.clone(), lastInfo.position, obj.position);
				} else {
					updateCountLabel(labelDataMap[id]);
				}
				
			} else {
				removeLabelPoint(id);
			}
		});
	};


	/*
	 * 删除标注点位对象
	 * @param id 标注编号
	 */
	function removeLabelPoint (id) {
		if (movingObjs[id]) {
			movingNumber--;
		}

		delete labelBasicData[id];
		delete labelDetailMap[id];
		delete labelDataMap[id];
		delete labelObjMap[id];
		delete movingObjs[id];
		delete movingWaitPools[id];

		mapHandle.label.remove(id);
		movingManager.deleteMoving(id);

		$('#'+id).remove();
	}


	/*
	 * 图片HOVER 效果
	 * @param obj dom对象
	 * @param hover 是否hover
	 */
	function imgHover (obj, hover) {
		if (!$(obj).hasClass(movingClass)) {
			var $img = $(obj).find('img');
			if ($img.length > 0) {
				$img.css('background', hover ? ('url(' + $img.attr('src').replace('.png', '_h.png') + ') center center no-repeat') : '');
			}
		}
	}


	/*
	 * 随机取一个范围的值
	 */
	function RandomNumBoth (min, max) {
	      return min + Math.round(Math.random() * (max - min)); //四舍五入
	}



	/*
	 * 创建移动
	 * @param labelObj		子类对象
	 * @param moveObj	移动的对象
	 * @param beginPos	开始坐标
	 * @param endPos	结束坐标
	 */
	function createMoving (labelObj, moveObj, beginPos, endPos) {
		if (enabledDynamicFlow) {
			_createMovingA(labelObj, moveObj, beginPos, endPos);
		} else {
			_createMovingB(labelObj, endPos);
		}
	}


	/*
	 * 创建移动
	 * @param labelObj		子类对象
	 * @param moveObj	移动的对象
	 * @param beginPos	开始坐标
	 * @param endPos	结束坐标
	 */
	function _createMovingA (labelObj, moveObj, beginPos, endPos) {
		if (curWayObj) {

			/*
			 * 寻找有效的移动轨迹路线
			 */
			curWayObj.findPath(beginPos, endPos, function (meshName, points) {
				labelObj.endPos = endPos;

				/*
				 * 1. 启开了动态流动
				 * 2. 找到可用流动路径
				 * 3. 移动对象小于最大移动数量
				 */
				if (enabledDynamicFlow && points && movingNumber <= maxMovingNumber) {
					var id = labelObj.div.id;

					// 取消定时隐藏姓名并重新显示名称
					clearStopTimer(id);
					showMovingCss(labelObj);

					// 创建移动任务
					movingManager.createMoving({
				         targetId: id,
				         target: moveObj,
				         data: labelObj,
				         path: points,
				         showPath: false,
				         speed: 20,
				         lineColor:0x0000ff
					});

				} else {	// 再未启用实时流动效果时，让名字显示一秒后关闭，以便提醒用户该人员流动了

					_createMovingB(labelObj, endPos);

				}
			});
		} else {
			_createMovingB(labelObj, endPos);
			printLog('该区域未配置寻路路径，无法自动寻路!');
		}
	}


	/*
	 * 创建移动（直接移动，没有移动过程）
	 * @param labelObj	三维地图标注对象
	 * @param endPos	结束坐标
	 */
	function _createMovingB (labelObj, endPos) {
		clearStopTimer(labelObj.div.id);
		updatePointPos(labelObj, endPos);
		showMovingCss(labelObj);
		stopMoving(labelObj, labelObj.div.id);
	}


	/*
	 * 显示移动样式
	 */
	function showMovingCss (labelObj) {
		if (labelObj) {
			labelObj.showText(true);
			imgHover(labelObj.div, true);
			$(labelObj.div).removeClass(movingClass).addClass(movingClass);			
		}
	}


	/*
	 * 隐藏移动样式
	 */
	function hideMovingCss (labelObj) {
		if (labelObj) {
			$(labelObj.div).removeClass(movingClass);
			imgHover(labelObj.div, false);
			labelObj.showText(enabledShowName);
		}
	}


	/*
	 * 禁用轨迹移动
	 */
	function disabledDynamicFlow (labelObj) {
		for(var id in labelObjMap) {
			labelObj = labelObjMap[id];
			movingManager.deleteMoving(id);

			updatePointPos(labelObj, labelObj.endPos);
			updateCountLabel(labelDataMap[id]);
			stopMoving(labelObj, id);
		}
	}


	/*
	 * 停止移动
	 */
	function stopMoving (labelObj, id) {
		// 停止移动1秒后再隐藏效果（隐藏名字）
		timerIdMap[id] = setTimeout(function (labelObj, id) {
			hideMovingCss(labelObj);
			delete timerIdMap[id];
		}, 1000, labelObj, id);

		if (movingObjs[id]) {
			movingNumber--;
		}

		delete movingWaitPools[id];
		delete movingObjs[id];
	}


	/*
	 * 清除停止时创建的定时器
	 * @param id 标注编号
	 */
	function clearStopTimer (id) {
		if (timerIdMap[id]) {
			clearTimeout(timerIdMap[id]);
			delete timerIdMap[id];
		}
	}


	/*
	 * 更新点位坐标
	 */
	function updatePointPos (labelObj, pos3) {
		if (labelObj && pos3) {
			labelObj.position.x = pos3.x;
			labelObj.position.y = pos3.y;
			labelObj.position.z = pos3.z;
			labelObj.updatePos();
		}
	}


	/*
	 * 查询并联动设备
	 * @param rid RFID编号
	 */
	function queryAndLinkageDvc (rid) {
		// 查询相关的联动监控设备
		db.query({
			request: {
				sqlId: 'select_linkage_camera_by_rfid',
				params: {
					'cusNumber': login.cusNumber,
					'cameraType': cameraType,
					'rfidType': linkType,
					'rfidId': rid
				}
			},
			success: function (list) {

				// 武汉戒毒所测试代码 BEGIN
				// RFID点击小人的功能需要将活动室的视频，过道上的视频也要关联上
//				list = list || [];
//				list.push({'dvc_id': '1175', 'dvc_name':'二楼二大队二病区走道西-181#'});
//				list.push({'dvc_id': '1324', 'dvc_name':'二楼二大队二病区走道东-158#'});
//				list.push({'dvc_id': '1149', 'dvc_name':'二楼二大队二病区走道-153#'});
				// 武汉戒毒所测试代码 END

				if (list && list.length) {
					var vc = window.top.hz.videoclient;
					if (vc && vc.isInit) {
						var cameras = [];
						for(var i = 0; i < list.length; i++) {
							cameras.push(list[0].dvc_id);
						}
						vc.play(cameras);
					} else {
						message.alert('视频客户端未打开或初始化，无法查看监控视频!');
					}
				} else {
					printLog('未获取到关联的监控设备信息，无法打开监控!');
				}
			},
			error: function (code, msg) {
				printLog('获取当前房间相关设备信息异常：' + code + msg);
			}
		});
	}


	/*
	 * 查询当前监控的人员分布
	 * @params rfidArray = [{
	 * 		"id": "",		// RFID设备的编号
	 * 		"position": {	// RFID设备在地图上的点位坐标
	 * 			x:0,
	 * 			y:0,
	 * 			z:0
	 * 		}]
	 * }
	 */
	function queryPeopleScatter (rfidArray, loadNo) {
		var whereId, params = [login.cusNumber, '', '', linkType, curViewMenu.id];

		clearPeopleScatter();

		if (!curViewMenu.id) return;	// 无视角菜单不处理
		if (rfidArray.length < 1) return; // 无RFID设备不处理

		if (rfidArray.length == 1) {
			params.push(rfidArray[0].id);
			whereId = 0;
		}

		db.query({
			request: {
				sqlId: 'select_people_scatter_by_rfid',
				whereId: whereId,
				params: params
			},
			success: function (list) {
				if (!enabledScatter) return;
				if (loadNo && mapHandle._loadNo != loadNo) return;

				if (list && list.length) {
					var pushList = [];
					var index = 0;
					var temp = null;

					for(var i = 0; i < list.length; i++) {
						for(var x = 0; x < rfidArray.length; x++) {
							if (rfidArray[x].id == list[i].rfid_id) {
								temp = [rfidArray[x], list[i]];

								// 如果有要定位的人员，则将定位人员的数据放在第一个加载（其目的是为了能最快的去定位该人员）
								if (hasNeedLocation(list[i].people_id)) {
									pushList.unshift(temp);
								} else {
									pushList.push(temp);
								}
							}
						}
					}

					// 如果有数据则放在第一个（其目的是为了能最快的去定位该人员）
					hasLoadingLabels = true;
					queryPeopleCount();	// 显示人员分布的时候统计一次

					(function forList () {
						if (!enabledScatter) return;
						if (loadNo && mapHandle._loadNo != loadNo) return;

						if (index < pushList.length) {
							temp = pushList[index++];
							buildLabelInfo(temp[0], temp[1], forList);
						} else {
							console.log('RFID人员分布数据加载完成...');
							hasLoadingLabels = false;
						}
					})();
				} else {
					printLog(curViewMenu.name + '视角下没有RFID人员分布数据!');
				}
			},
			error: function (code, msg) {
				printLog('查询当前监控的人员分布异常：' + code + '-' + msg);
			}
		});
	}



	/*
	 * 是否需要人员定位
	 */
	function hasNeedLocation (id) {
		return locationPeopleId && locationPeopleId == id;
	}


	/*
	 * 人员定位（人员搜索定位，定位完成后删除搜索人员编号）
	 */
	function peopleLocation (id) {
		var data = labelDataMap[id];
		if (data) {
			dialog.top.open({
				id:'316', 
				title:'动态跟踪', 
				type:2, 
				url:'page/cds/rfid/rfid.html'
			});

			mapHandle.flyToLookAt(data.position, 650, 750, 1000);

			showMovingCss(labelObjMap[id]);
//			queryAndLinkageDvc(data.rid);
			locationPeopleId = null;
		}
	}


	/*
	 * 清除RFID人员分布点位
	 */
	function clearPeopleScatter () {
		for(var key in randomDistMap) {
			randomDistMap[key].clearChildren();
		}
	}


	/*
	 * 根据人员编号删除分布点位
	 * @param id 人员编号
	 */
	function removeScatterPointById (id) {
		for(var key in randomDistMap) {
			if (randomDistMap[key].removeChild(id)) {
				removeLabelPoint(id);
				break;
			}
		}
	}


	/*
	 * 查询当前监控人员信息
	 * @param rfidId	RFID设备编号
	 * @param peopleId	RFID标签绑定的人员名称
	 * @param callback
	 */
	function queryMonitorPeople (rfidId, peopleId, callback) {
		db.ajax("rfidController/queryMonitorPeople", {
			'cusNumber' : login.cusNumber,
			'rfidId' : rfidId,
			'peopleId' : peopleId
		}, callback, function(code, msg) {
			printLog('查询当前监控人员信息异常：' + code + msg);
		});
	}


	/*
	 * 查询人员分布统计
	 * @param type 人员类型
	 */
	function queryScatterCount (type) {
		if (!curViewMenu.id) return;

		clearCountLabel();

		db.query({
			request: {
				sqlId: 'select_count_people_by_rfid',
				params: [login.cusNumber, type, type, linkType, curViewMenu.id]
			},
			success: function (list) {
				if (list && list.length) {
					if (!enabledScatterCount) return;

					var fmtMap = {};
					var fmtList = [];

					/*
					 * 整理并格式化数据，相同房间的RFID归并为一个统计显示
					 */
					for(var i = 0; i < list.length; i++) {
						var rfidId = list[i].rfid_id;
						var roomId = list[i].room_id;

						if (roomId) {
							if (roomRfidMap[roomId]) {
								fmtMap[roomRfidMap[roomId]].count += list[i].count;
							} else {
								roomRfidMap[roomId] = rfidId;
								fmtMap[rfidId] = list[i];
								fmtList.push(list[i]);
							}
							rfidRoomMap[rfidId] = roomId;
						} else {
							fmtMap[rfidId] = list[i];
							fmtList.push(list[i]);
						}
					}


					/*
					 * 按顺序循环添加统计面板
					 */
					var len = fmtList.length,	// 要添加的面板的数量
						index = 0,			// 当前索引
						temp = null,		// 临时对象
						name = null,		// 面板显示标题名称
						splits = [];		// 用于存放分割字符的数组

					(function next () {
						if (!enabledScatterCount) return;
						if (index >= len) return;
						temp = fmtList[index++];

						if (temp.pos_x && temp.pos_y && temp.pos_z) {
							name = temp.rfid_name;
							splits = [];

							if (temp.room_id) {
								splits = temp.room_id.split('_');
								name = splits[splits.length - 2] + '室';
							}

							fmtAddCountLabel({
								'id': temp.rfid_id,
								'text': name,
								'count': temp.count,
								'position': {
									'x': temp.pos_x,
									'y': temp.pos_y,
									'z': temp.pos_z
								}
							}, next);
						}
					})();

				} else {
					printLog(curViewMenu.name + '视角下没有RFID人员统计数据!');
				}
			},
			error: function (code, msg) {
				printLog('查询人员统计信息异常：' + code + msg);
			}
		});
	}


	/*
	 * 清楚统计标注点位
	 */
	function clearCountLabel () {
		for(var key in countLabelObjMap) {
			mapHandle.label.remove(key);
		}
		rfidRoomMap = {};	// RFID对应房间
		roomRfidMap = {};	// 房间对应显示的RFID
		countLabelObjMap = {};
	}


	/*
	 * 查询RFID人员统计总数量
	 * @param visible 显示
	 */
	function queryPeopleCount () {
		if (enabledPeopleCount) {
			_queryPeopleCount();
		}

		if (jqRfidCount) {
			jqRfidCount.toggle(enabledPeopleCount);
		}
	}


	/*
	 * 查询RFID人员统计总数量
	 * @param visible 显示
	 */
	function _queryPeopleCount () {
		var cusNumber = login.cusNumber;

		db.query({
			request: {
				sqlId: 'select_rfid_count_people_by_areaid',
				whereId: 0,
				params: [cusNumber, cusNumber, curViewMenu.area_id]
			},
			success: function (list) {
				var count = list && list.length && list[0].count_people || 0;
				if (jqRfidCount) {
					updateHeadTitle(curViewMenu, count);
				} else {
					if (curViewMenu.name) {
						initHeadTitle(curViewMenu, count);
					}
				}
			}
		});
	}

	function initHeadTitle (vm, count) {
		hzEvent.load('map.headtitle', function (headTitle) {
			if (jqRfidCount) {
				updateHeadTitle(vm, count);
			} else {
				jqRfidCount = headTitle.add({id: 'RFID_COUNT', index: 0, html: '<span class="mht-name">' + vm.name + '</span>：<span class="mht-num" area-id="' + vm.area_id + '">' + count + '</span>人'});
				jqRfidCount.find('>span.mht-num').on('click', function () {
					var areaId = $(this).attr('area-id');
				});
			}
		});
	}

	function updateHeadTitle (vm, count) {
		jqRfidCount.find('>span.mht-name').html(vm.name);
		jqRfidCount.find('>span.mht-num').attr('area-id', vm.area_id).html(count);
	}


	/*
	 * 获取RFID设备人员分布数量
	 */
	function getRfidDistCount (rid) {
		var rd = randomDistMap[rid];
		return rd ? rd.childrenData.length : 0;
	}


	/*
	 * 更新统计数据
	 * @param data = {"rid": "RFID编号", "rname": "RFID名称"}
	 */
	function updateCountLabel (data, rid) {
		if (enabledScatterCount && !hasLoadingLabels) {
			_updateCountLabel(data, rid);
		}
	}


	/*
	 * 更新统计数据（私有方法，请不要在其他地方调用）
	 * @param data = {"rid": "RFID编号", "rname": "RFID名称"}
	 */
	function _updateCountLabel (data, rid) {
		// 找到RFID绑定的房间号再找到这个房间用户显示统计的RFID编号
		var roomId = rfidRoomMap[data.rid];
		var count = 0;

		if (roomId) {
			rid = roomRfidMap[roomId];
			for (var key in rfidRoomMap) {
				if (roomId == rfidRoomMap[key]) {
					count += getRfidDistCount(key);
				}
			}
		} else {
			rid = data.rid;
			count = getRfidDistCount(rid);
		}

		// 通过RFID编号找到统计的对象
		var countObj = countLabelObjMap[rid];
		if (countObj) {
			// countObj.setVisible(count ? true : false);	// 统计数据为零时不再隐藏统计面板 2017.05.16 xie.yh delete

			var $num = $(countObj.div).find('span.count-now >span.number');
			if ($num.length) {
				var num = $num.html() * 1;

				if (count != num) {
					// 显示 +1 / -1 的效果
					(count > num ? $(plusHtml) : $(minusHtml))
						.appendTo($(countObj.div).removeClass('update').addClass('update'))
							.animate({top:3, opacity: 0.3}, 1000, function () {
								$(this).parent().removeClass('update');
								$(this).remove();
							});

					$num.html(count);
				}
			}
		} else {
			/*
			 * 2017.05.16 xie.yh delete
			 * 在显示统计面板的时候，因为这里在更新RFID统计面板数值时，没有会新增一个，
			 * 导致queryScatterCount 里面的 roomRfidMap的数据出现预期以外的数据，
			 * 进而导致数据处理异常而显示统计面板错误，所以这里暂时去掉了此功能

			// 如果是没有统计面板的情况下，新增一个
			if (count > 0) {
				var rfidModel = getRfidPointObj(rid);
				if (rfidModel) {

					try {
						// 获取房间BOX
						var roomBoxObj = mapHandle.hzThree.getRoomBox(rfidModel.position, 1);
						if (roomBoxObj) {
							roomId = roomBoxObj.name;
							rfidRoomMap[rid] = roomId;		// 记录RFID和房间的映射关系

							// 如果房间BOX已经有了统计面板，则重新调用更新
							if (roomRfidMap[roomId]) {
								// 为了防止在统计面板还没有添加的情况下，频繁的递归调用导致内存消耗太大，这里用了延时调用处理
								setTimeout(updateCountLabel, 200, data);
								return;
							} else {
								roomRfidMap[roomId] = rid;	// 记录房间和RFID的映射关系
							}
						}
					} catch (e) {
						console.error(e);
					}

					// 新增一个统计面板
					fmtAddCountLabel({
						id: data.rid,
						text: data.rname,
						count: count,
						position: rfidModel.position.clone()
					});

				}
			} */
		}
	}


	/*
	 * 格式化并添加统计标注
	 * @param data = {"id":"标注编号", "text": "显示文本", "count":"统计数量", "position":{x:0, y:0, z:0}}
	 */
	function fmtAddCountLabel (data, callback) {
		var html = countLabelHtml.replace('{1}', '区域：' + data.text + '\n提示：点击人数可以查看详情')

		html = html.replace('{2}', data.text)
		html = html.replace('{3}', data.count);

		addCountLabel({
			'id': data.id,
			'html': html,
			'position': data.position
		}, callback);
	}


	/*
	 * 添加统计标注
	 * @param params = {"id":"标注编号", "html": "显示HMTL内容", "position":{x:0, y:0, z:0}}
	 */
	function addCountLabel (params, callback) {
		if (!enabledScatterCount) return;

		mapHandle.label.add({
			id: params.id,
			html: params.html,
			minDis: 10,
			maxDis: 100000,
			lineHeight: 80,
			className: 'label-count',
			position: params.position
		}, {
			'click': function (event) {
				// printLog('暂时无法查看人员详情!');
			},
			'mouseenter': function (event) {
				countLabelTimerId && clearTimeout(countLabelTimerId);
				countLabelTimerId = null;

				$('div.label-html').addClass('opacity');
				$(this).find('div.label-html').removeClass('opacity');
			},
			'mouseleave': function (event) {
				countLabelTimerId = setTimeout(function () {
					$('div.label-html').removeClass('opacity');
				}, 1000);
			}
		}, function (obj) {
			countLabelObjMap[params.id] = obj;

			if (enabledScatterCount) {
				$(obj.div).find('span.count-now').on({
					'click': function () {
						sessionStorage.setItem("cdm-rfid-id",params.id);
						dialog.top.open({
							id:'cdm-rfid-prisoner',
							type:2,
							title:'学员信息查询',
							url:'page/cds/prisoner/prisonerInfo.html'
						});
						//printLog('暂时无法查看人员统计详情!');
					}
				});

				callback && callback();

			} else {
				clearCountLabel();
			}
		});
	}


	/*
	 * 创建地图点位标注信息
	 * @param rInfo	基站设备信息，rfidInfo = {"id":"", "position":{x:0,y:0,z:0}}
	 * @param pInfo	监控的人员信息，peopleInfo = {}
	 */
	function buildLabelInfo (rInfo, pInfo, callback) {
		enabledScatter && _buildLabelInfo(rInfo, pInfo, callback);
	}


	/*
	 * 创建地图点位标注信息（私有方法，请不要在其他地方调用）
	 * @param rInfo	基站设备信息，rfidInfo = {"id":"", "position":{x:0,y:0,z:0}}
	 * @param pInfo	监控的人员信息，peopleInfo = {}
	 */
	function _buildLabelInfo (rInfo, pInfo, callback) {
		if (!enabledScatter) return;

		var cid = pInfo.people_id;
		var rid = rInfo.id;
		var list = [];
		var title = null,
			icon = null;

		var lastDetail = labelDetailMap[cid];

		if (pInfo.people_type == 1) {
			icon = POLICE_ICON;
			list.push('民警姓名：' + pInfo.people_name);
		} else {
			icon = PRISONER_ICONS[pInfo.type_indc] || PRISONER_ICON;
			list.push('学员姓名：' + pInfo.people_name);
			list.push('学员编号：' + pInfo.prnsr_code);
			list.push('学员类型：' + pInfo.type_indc_cn);
			list.push('分管等级：' + pInfo.sprt_mnge_cn);
		}

		list.push('所属部门：' + pInfo.dept_name);
		list.push('监控时间：' + pInfo.monitor_time);
		list.push('监控位置：' + pInfo.rfid_name);

		// 上一次位置
		if (lastDetail) {
			list.push(lastDetail[lastDetail.length - 2].replace('监控位置', '上次位置'));
		} else {
			list.push('上次位置：' + pInfo.before_rfid_name);
		}

		if (randomDistMap[rid] == undefined) {
			randomDistMap[rid] = new RandomDist(rInfo);
		}

		labelDetailMap[cid] = list;
		labelBasicData[cid] = pInfo;

		// 点位自带坐标数据
		var position = pInfo.pos_xyz;
		if (position && typeof position == 'string') {
			position = JSON.parse(position);
		}

		// TODO: 模拟测试数据-BEGIN
//		if (rid == '7' || rid == '30')
//			position = {'x':599.6831864673248 , 'y':852.105662107335, 'z': -714.5565671258346};


		randomDistMap[rid].pushToMap({
			'id': cid,
			'text': pInfo.people_name,
			'title': title,
			'image': icon,
			'rid': pInfo.rfid_id,
			'rname': pInfo.rfid_name,
			'position': position
		}, callback);
	}



	/*
	 * 注册监听消息
	 */
	function onWebMessage () {
		var wm = window.top.webmessage;
		if (wm) {
			wm.on('RFID001', 'rfid.main', function (data) {
				if (!enabledScatter) return;
				if (hasLoadingLabels) return;

				msgHandle(JSON.parse(data.msg));
			});

			function msgHandle (msg) {
				try {
					var monitorInfo = msg.rfidInfo || {};
					var peopleId = monitorInfo.peopleId;
					var peopleLabel = labelObjMap[peopleId];

					// 正在移动的对象将数据存放到移动池
					if (peopleLabel && movingObjs[peopleId]) {
						if (!movingWaitPools[peopleId]) {
							movingWaitPools[peopleId] = [];
						}
						movingWaitPools[peopleId].push(monitorInfo);
					} else {
						peopleLabel || queryPeopleCount();	// 收到RFID消息，发现没有人员分布点位则去更新统计数据（因为有可能是新监测到的）
						startMoving(monitorInfo);						
					}
				} catch (e) {
					console.error('接收到RFID人员监测消息，处理异常：', e);
					printLog('接收到RFID人员监测消息，处理异常' + e.message);
				}
			}
		} else {
			setTimeout(onWebMessage, 100);
		}
	}


	/*
	 * 开始启动移动
	 * @param data 移动相关数据
	 */
	function startMoving (data) {
		try {
			var peopleId = data.peopleId;
			var rfidId = data.rfid;
			var rfidModel = getRfidPointObj(rfidId);

			if (rfidModel) {
				var rfidData = {'id': rfidId, 'position': {'x': rfidModel.position.x, 'y': rfidModel.position.y, 'z': rfidModel.position.z}};
				var basicData = labelBasicData[peopleId];
				var peopleLabel = labelObjMap[peopleId];

				if (peopleLabel && basicData) {
					basicData.monitor_time = data.time;
					basicData.rfid_id = data.rfid;
					basicData.rfid_name = data.rfidname;

					buildLabelInfo(rfidData, basicData, function () {});

				} else {

					queryMonitorPeople(rfidId, peopleId, function (list) {
						if (list && list.length) {
							var rfid_id = list[0].rfid_id;

							if (rfidId == rfid_id) {
								buildLabelInfo(rfidData, list[0], function () {});
							} else {
								console.warn('查询结果的RFID设备编号和查询的RFID设备编号不一致[', rfidId, rfid_id, ']');
							}
						} else {
							console.warn('没有查询到RFID监测的相关人员信息：', data);
							printLog('没有查询到RFID监测的相关人员信息');
						}
					});
				}
			} else {
				removeScatterPointById(peopleId);
				queryPeopleCount();	// 如果收到的RFID消息没有找到RFID基站点位则更新统计数据（因为有可能该基站不在现在的区域）
			}
		} catch (e) {
			console.error('启动RFID人员定位移动失败：', e);
			message.alert('启动RFID人员定位移动失败：' + e.message);
		}
	}


	/*
	 * 获取RFID基站的模型点位对象
	 */
	function getRfidPointObj (id) {
		return mapHandle.getModelPointByLinkId(linkType, id);
	}


	/*
	 * 初始化地图配置节点
	 */
	function initMapConfig () {
		var mapConfig = mapHandle.mapConfig;
		if (mapConfig) {
			mapConfig.add('RFID001', '显示RFID人员分布', function (id, checked) {
				if (enabledScatter = checked) {
					queryPeopleScatter(rfidList);
				} else {
					clearPeopleScatter();
				}
			}, enabledScatter);

			mapConfig.add('RFID002', '显示RFID人员姓名', function (id, checked) {
				enabledShowName = checked;
				for(var key in labelObjMap) {
					labelObjMap[key].showText(checked);
				}
			}, enabledShowName);


			mapConfig.add('RFID003', '显示RFID动态轨迹', function (id, checked) {
				enabledDynamicFlow = checked;
				enabledDynamicFlow || disabledDynamicFlow();
			}, enabledDynamicFlow);


			mapConfig.add('RFID004', '显示RFID分布统计', function (id, checked) {
				if (enabledScatterCount = checked) {
					queryScatterCount();
				} else {
					clearCountLabel();
				}
			}, enabledScatterCount);


			mapConfig.add('RFID005', '显示RFID总数统计', function (id, checked) {
				enabledPeopleCount = checked;
				queryPeopleCount();
			}, enabledPeopleCount);


			/*
			 * 监听开始三维巡视和结束时
			 */
			(function () {
				var _enabledScatter = enabledScatter;
				var _enabledCount = enabledScatterCount;

				// 开始巡视时隐藏RFID人员分布和统计
				hzEvent.subs('3d.patrol.startPatrol', 'rfid.main', function () {
					_enabledScatter = enabledScatter;
					_enabledCount = enabledScatterCount;
					mapConfig.checked('RFID001', false, true);
					mapConfig.checked('RFID004', false, true);
				});

				// 结束后还原状态
				hzEvent.subs('3d.patrol.patrolOver', 'rfid.main', function () {
					mapConfig.checked('RFID001', _enabledScatter, true);
					mapConfig.checked('RFID004', _enabledCount, true);
				});
			})();
		}
	}


	/*
	 * 初始化移动事件
	 */
	function initMovingEvent () {
		var hasCtrlKey = false;

		movingManager = mapHandle.hzThree.movingManager;

		if (movingManager) {

			/*
			 * 移动更新坐标
			 */
			movingManager.on('moving_3d_update', function (data) {
				if (enabledDynamicFlow) {
					movingUpdate(data.data.tid, data.data.data, data.data.pos3);
				}
			});

			function movingUpdate (tagId, labelObj, pos3) {
				try {
					if (movingObjs[tagId] == undefined) {
						movingObjs[tagId] = true;
						movingNumber++;
					}
					updatePointPos(labelObj, pos3);
				} catch (e) {
					console.error('RFID移动定位时异常：', e);
				}
			}


			/*
			 * 移动停止
			 */
			movingManager.on('moving_stop', function (data) {
				movingStop(data.data.tid, data.data.data);
			});

			function movingStop (tagId, labelObj, pools) {
				try {
					pools = movingWaitPools[tagId] || [];

					updateCountLabel(labelDataMap[tagId]);

					// 如果移动池有数据则继续移动
					if (pools.length > 0) {
						startMoving(pools.shift());
					} else {
						stopMoving(labelObj, tagId);
					}
				} catch (e) {
					console.error('RFID移动定位停止时异常：', e);
				}
			}


			/*
			 * 显示标注
			 */
			function visibleLabel (visible) {
				for(var key in labelObjMap) {
					labelObjMap[key].setVisible(visible);
				}
				for(var key in countLabelObjMap) {
					countLabelObjMap[key].setVisible(visible);
				}
			}

			/*
			 * 检测键盘的CTRL按键，按下之后隐藏人员分布标注和统计标注
			 */
			window.top.addEventListener('keydown', function (event) {
				if (event.ctrlKey) {
					if (!hasCtrlKey) {
						hasCtrlKey = true;
						visibleLabel(false);
					}
				}
			});

			/*
			 * 检测键盘的CTRL按键，按下之后显示人员分布标注和统计标注
			 */
			window.top.addEventListener('keyup', function (event) {
				if (hasCtrlKey) {
					hasCtrlKey = false;
					visibleLabel(true);
				}
			});

			$('#'+mapHandle.mapId).append(detailHtml);
		} else {
			setTimeout(initMovingEvent, 100);
		}
	}


	/*
	 * 显示RFID人员详情
	 */
	function showPeopleDetail (list, pos) {
		var $ul = $('div.label-detail >ul');
		if ($ul.length) {
			$ul.empty();

			for(var i = 0; i < list.length; i++) {
				$ul.append('<li>' + list[i] + '</li>');
			}

			$ul.parent().css({top:pos.top, left:pos.left}).show();
		}
	}

	/*
	 * 隐藏RFID人员详情
	 */
	function hidePeopleDetail () {
		$('div.label-detail').hide();
	}


	/*
	 * 打印日志消息
	 */
	function printLog (text) {
		// message.alert(text);
		mapHandle.console(text);
	}


	try {
		// 添加RFID相关样式
		$(window.top.document.head).append('<link rel="stylesheet" href="css/cds/rfid/rfid.main.css" charset="utf-8">');


		/*
		 * 监听地图加载模型点位的事件
		 */
		hzEvent.subs('hz.modelpoint.onload', function (hzMap, loadNo, viewId, data) {
			if (hzMap._loadNo == loadNo && curViewMenu.id != mapHandle.curViewMenu.id) {
				curWayObj = mapHandle.Wayfinding.findWay(viewId);
				curViewMenu = mapHandle.curViewMenu;
				rfidList = [];

				for(var i = 0; i < data.length; i++) {
					var info = data[i];

					if (info.mpi_link_type == linkType) {
						rfidList.push({
							'id': info.mpi_link_id,
							'position': {
								'x': parseFloat(info.mpi_pos_x),
								'y': parseFloat(info.mpi_pos_y),
								'z': parseFloat(info.mpi_pos_z)
							}
						});
					}
				}

				if (enabledScatter) {
					queryPeopleScatter(rfidList, loadNo);
				}

				if (enabledScatterCount) {
					queryScatterCount();
				}

				queryPeopleCount();
			}
		});


		/*
		 * 监听楼层分离事件
		 */
		hzEvent.subs('hz.building.floor.separate', 'rfid.main', function (buildView, floorView) {
			for(var key in labelObjMap) {
				labelObjMap[key].setVisible(false);
			}
			for(var key in countLabelObjMap) {
				countLabelObjMap[key].setVisible(false);
			}
		});


		/*
		 * 监听建筑模型隐藏事件
		 */
		hzEvent.subs('hzmap.visible.floor', 'rfid.main', function (modelName, visible) {
			for(var key in labelObjMap) {
				labelObjMap[key].setVisible(visible);
			}
			for(var key in countLabelObjMap) {
				countLabelObjMap[key].setVisible(visible);
			}
		});


		/*
		 * 注册搜索人员定位事件（rfid.main.js 和 prisonerMain.js 都会注册，但是优先rfid，为了防止被prisonerMain.js先注册，这里进行强制注册）
		 * @param params = {id:"", name:""}
		 */
		hzEvent.subs('search.people.location', 'people.location', function (params) {
			db.query({
				request: {
					sqlId: 'select_rfid_bind_people_for_search_location',
					params: {
						'cusNumber': login.cusNumber,
						'peopleType': RMR_PEOPLE_TYPE.PRISONER,
						'peopleId': params.id,
						'linkType': MPI_LINK_TYPE.RFID
					}
				},
				success: function (list) {
					if (list && list.length) {
						var data = list[0];
						var viewId = data.view_id;

						if (mapHandle.curViewMenu.id != viewId) {
							mapHandle.isFly = false;
							mapHandle.location(viewId);
						}

						peopleLocation(locationPeopleId = params.id);

					} else {

						// 未获取定位数据则弹出基本信息
						window.top.searchPeopleId = params.id;
						dialog.top.open({
							id:'prisonerInfo', 
							title:'基本信息', 
							type:2, 
							url:'page/cds/prisoner/prisonerInfo.html'
						});

						mapHandle.console('未获取<span style="color:#00ff00;">' + params.name + '</span>在地图上的RFID数据，无法定位!');
					}
				},
				error: function (code, desc) {
					mapHandle.console('搜索人员' + params.name + '的定位异常：[' + code + desc +']');
				}
			});
		}, true);

		// 消息注册
		onWebMessage();

		// 地图配置菜单
		initMapConfig();
		initMovingEvent();
	} catch (e) {
		console.error(e);
	}

});