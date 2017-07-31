/**
 * 点名主模块
 */
define(function (require) {

	var mapHandle = require('hz/map/map.handle');
	var message = require('frm/message');
	var hzEvent = require('frm/hz.event');
	var hzDB = require('frm/hz.db');
	var user = require('frm/loginUser');

	var animateTimerId = null;		// 动画执行编号
	var animateModelObj = null;		// 动画处理的模型对象
	var animateTimes = 20;			// 动画执行次数上限

	var calledModelObjs = [];		// 已点名的模型对象集合
	var noCallModelObjs = [];		// 未点名的模型对象集合

	/*
	 * 获取模型对象
	 */
	function getModelObj (linkId) {
		return mapHandle.getModelPointByLinkId(mapHandle.LINK_TYPE.PRISONER, linkId);
	}


	/*
	 * 设置发光颜色
	 */
	function setColor (color) {
		mapHandle.hzThree.outLine.setVisibleEdgeColor(color);
	}


	/*
	 * 显示外发光边框
	 * @params data	  单个关联编号 或 集合
	 * @params color 发光颜色
	 * @params array 存储对象
	 */
	function _showBorder (data, color, array) {
		var modelObj = null;

		if ('object' != typeof data) {
			data = [data];
		}

		if (data.length) {
			setColor(color);

			for(var i = 0; i < data.length; i++) {
				modelObj = getModelObj(data[i]);
				if (modelObj) {
					modelObj.onBorder(false);
					modelObj.setBorderShow(true);
					array.push(modelObj);
				}
			}
		}
	}


	/*
	 * 清楚样式（效果）
	 */
	function clearStyle () {
		var modelObj = null;
		var array = calledModelObjs.concat(noCallModelObjs);

		calledModelObjs = [];
		noCallModelObjs = [];

		stopAnimate();
		setColor(0x00FFFF);

		for(var i = 0 ; i < array.length; i++) {
			modelObj = array[i];

			if (modelObj) {
				modelObj.onBorder(true);
				modelObj.setBorderShow(false);
			}
		}
	}


	/*
	 * 开始点名
	 */
	function callrollBegin () {
		clearStyle();
	}


	/*
	 * 点名中
	 */
	function callrolling (peopleId) {
		var modelObj = getModelObj(peopleId);

		stopAnimate();

		if (modelObj) {
			modelObj.onBorder(false);

			calledModelObjs.push(modelObj);
			callrollAnimate(modelObj, true, animateTimes);
		}
	}


	/*
	 * 点名动画效果
	 * @params modelObj	执行对象
	 * @params isBorder	是否显示边框
	 * @params times	执行次数
	 */
	function callrollAnimate (modelObj, isBorder, times) {
		if (modelObj && times-- >= 0) {
			animateModelObj = modelObj;
			animateModelObj.setBorderShow(isBorder);
			animateTimerId = setTimeout(callrollAnimate, 300, modelObj, !isBorder, times);
		}
	}


	/*
	 * 停止动画
	 */
	function stopAnimate () {
		if (animateTimerId) {
			animateTimerId = clearTimeout(animateTimerId);

			if (animateModelObj) {
				animateModelObj.setBorderShow(true);
			}
		}
	}


	/*
	 * 点名结束
	 */
	function callrollEnd () {
		
	}


	/*
	 * 已点名人员
	 * @params data 单个关联编号 或 集合
	 */
	function calledPeople (data) {
		clearStyle();
		_showBorder(data, 0x00FFFF, calledModelObjs);
	}

	/*
	 * 未点名人员
	 * @params data 单个关联编号 或 集合
	 */
	function noCallPeople (data) {
		clearStyle();
		_showBorder(data, 0xFF0000, noCallModelObjs);
	}


	/*
	 * 根据部门地图定位
	 * @params dprtId 部门编号
	 */
	function linkageByDprt (dprtId) {
		hzDB.query({
			request: {
				sqlId: 'select_area_by_dprt_for_location',
				whereId: 0,
				params: [user.cusNumber, dprtId]
			},
			success: function (result) {
				if (result && result.length) {

					if (result.length > 1) {
						hzEvent.call('callRollLinkage.loadData', result);
						linkageFrame.style.display = 'block';
					} else {
						linkageMap(result[0]);
					}
				} else {
					message.alert('未获取到部门关联区域，无法联动!');
				}
			},
			error: function (code, desc) {
				message.alert('获取部门关联区域异常，无法联动（异常内容：' + code + desc + '）');
			}
		})
	}

	/*
	 * 地图联动
	 */
	function linkageMap (data) {

		// 订阅点位加载完成事件
		hzEvent.subs('hz.modelpoint.onload', 'callRollMain', function () {
			hzEvent.unsubs('hz.modelpoint.onload', 'callRollMain');
			calledPeople( hzEvent.call('callRoll.getCalledList') );
		});

		// 视角定位
		var retCode = mapHandle.locationArea(data.area_id);
		if (retCode == mapHandle.ERRCODE.A001) {
			message.alert(data.area_name + '区域未关联或配置视角，无法联动!');
		} else {
			hzEvent.call('callRollMain.cancelLinkage');
		}
		hzEvent.call('callRoll.openDetail');
	}


	try {
		var topDoc = top.document, linkageFrame = null;

		linkageFrame = topDoc.createElement('iframe');
		linkageFrame.id = 'linkageFrame';
		linkageFrame.src = 'page/cds/callroll/callRollLinkage.html';
		linkageFrame.style.position = 'absolute';
		linkageFrame.style.top = '50%';
		linkageFrame.style.left = '50%';
		linkageFrame.style.width = '218px';
		linkageFrame.style.height = '272px';
		linkageFrame.style.marginTop = '-136px';
		linkageFrame.style.marginLeft = '-109px';
		linkageFrame.style.border = '1px solid #FFF';
		linkageFrame.style.borderRadius = '5px';
		linkageFrame.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.35)';
		linkageFrame.style.overflow = 'hidden';
		linkageFrame.style.zIndex = '9';
		linkageFrame.style.display = 'none';
		linkageFrame.setAttribute('frameborder', '0');
		linkageFrame.setAttribute('scrolling', 'no');
		topDoc.body.appendChild(linkageFrame);

		function cancelLinkage () {
			linkageFrame.style.display = 'none';
		}

		// 发布方法
		hzEvent.on('callRollMain.clearStyle', clearStyle);			// 清楚样式
		hzEvent.on('callRollMain.callrollBegin', callrollBegin);	// 点名开始
		hzEvent.on('callRollMain.callrolling', callrolling);		// 点名中
		hzEvent.on('callRollMain.callrollEnd', callrollEnd);		// 点名结束
		hzEvent.on('callRollMain.noCallPeople', noCallPeople);		// 未点名人员
		hzEvent.on('callRollMain.calledPeople', calledPeople);		// 已点名人员
		hzEvent.on('callRollMain.linkageByDprt', linkageByDprt);	// 根据部门联动地图
		hzEvent.on('callRollMain.linkageMap', linkageMap);			// 
		hzEvent.on('callRollMain.cancelLinkage', cancelLinkage);	// 取消联动

		// 引入模块
		require(['cds/callroll/callRoll']);
		console.log('初始化 --> 点名子模块');
	} catch (e) {
		console.error('初始化 --> 点名子模块异常：', e);
	}
});