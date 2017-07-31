define(function(require) {
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var piny = require('frm/pinyin');
	var dialog = require('frm/dialog');
	var videoClient = require('frm/hz.videoclient');
	var hzEvent = require('frm/hz.event');
	var hzUtils = require('frm/hz.utils');
	var localStorage = require('frm/localStorage');

	var videoVue = null;


	function initVideoVue(selector) {
		// 在VUE初始化完成myFuncMenus的DOM数据之后再显示
		vue.nextTick(function() {
			//$(selector).show();
			
			hzEvent.on('videoRecord.start', function () {
				videoVue.created();
			});
		});

		videoVue = new vue({
					el : selector,
					data : {
						winIndex : -1,
						startTime : new Date(),
						endTime : this.startTime,
						duration : '',
						title : '',
						filePath : '',
						fileName : '',
						imgName : '',
						formatType : '',
						place : '1',
						t:''
					},
					methods : {
						created : function() {
							$("#videoRecordSection").show();
							var _this = this;
							_this.startTime=new Date();
							$('#duration').html('00:00:00');
							_this.t = setInterval(function() {
										_this.endTime = new Date();
										var a = parseInt((_this.endTime.getTime() - _this.startTime.getTime()) / 1000, 10);
										var a1 = '00';
										var a2 = '00';
										var a3 = '00';
										var temp = 0;
										if (a >= 3600) {
											temp = parseInt(a / 3600, 10);
											a = parseInt(a % 3600, 10)
											a1 = (temp >= 10 ? temp : '0'+ temp);
										}
										if (a >= 60) {
											temp = parseInt(a / 60, 10);
											a = parseInt(a % 60, 10)
											a2 = (temp >= 10 ? temp : '0'+ temp);
										}
										a3 = a >= 10 ? a : '0' + a;
										_this.duration = a1 + ':' + a2 + ':'+ a3;
										$('#duration').html(_this.duration);
									}, 1000);

							videoClient.readCameraInfo(-1,function(data) {
												var imgSuffix = '.jpg';
												var cameraId = data.cameraId;
												_this.winIndex = data.index;
												_this.place = data.cameraName;
												_this.formatType = data.cameraBrand;
												_this.title = _this.place + '_'+ getNumStr();
												_this.filePath = 'D:\\video\\';
												_this.fileName = _this.filePath+ _this.title;
												_this.imgName = _this.filePath+ _this.title+ imgSuffix;
												$('#place').html(_this.place);
												videoClient.cutVideo(_this.winIndex,_this.imgName,function(data) {
															//console.log(data);
														})
												videoClient.recordVideoStart(
																_this.winIndex,
																_this.formatType,
																_this.fileName,
																function(data) {
																	//console.log(data);
																	_this.fileName = data.returnValue.fileName
																})
											});
						},
						stopVideo : function() {

							var _this = this;

							clearInterval(_this.t);

							videoClient.recordVideoStop(
											_this.winIndex,
											function(data) {
												console.log(data);
												// 展现进度条
												layer.msg('正在上传,请稍候...', {
													icon : 16,
													shade : 0.01
												});
												videoClient.uploadFile('serverIp','port','userName','password',_this.fileName,function(data) {
																	//console.log(data);
													hzEvent.one('get.video.record.params',function() {
																		return {
																			startTime : hzUtils.formatterDate(_this.startTime,'yyyy-mm-dd hh:mi:ss'),
																			endTime : hzUtils.formatterDate(_this.endTime,'yyyy-mm-dd hh:mi:ss'),
																			duration : _this.duration,
																			title : _this.title,
																			filePath : _this.filePath,
																			fileName : _this.fileName.replace(_this.filePath,''),
																			imgName : _this.imgName.replace(_this.filePath,''),
																			place : _this.place,
																			formatType : _this.formatType
																		}
																	})

																	setTimeout("window.top.$('#100002').parent().find('.layui-layer-close').trigger('click')",800)
																	dialog.top.open({
																				id : 10002,
																				type : 2,
																				title : '录像详情',
																				w : 55,
																				h : 70,
																				top : 90,
																				url : 'page/cds/video/videoPlayCut.html'
																			});
													$("#videoRecordSection").hide();
																})
											})
						}
					}

				});

	}
	;

	function getNumStr() {
		var videoRecordObject = localStorage.getItem('videoRecordObject');
		var today = hzUtils.formatterDate(new Date(), 'yyyymmdd');
		var numStr;
		if (videoRecordObject) {
			if (today == videoRecordObject.dateStr) {
				numStr = ((parseFloat(today + videoRecordObject.numStr) + 1) + '')
						.replace(today, '');
			} else {
				numStr = '00000001';
			}

		} else {
			numStr = '00000001';
		}

		videoRecordObject = {
			dateStr : today,
			numStr : numStr
		}
		localStorage.setItem('videoRecordObject', videoRecordObject);
		return today + '_' + numStr;
	}

	try {

		/*hzEvent.bind(window, 'mousedown', function () {
			videoVue;
		});*/

		console.log('初始化系统菜单模块成功...');

		/*
		 * 返回对象并暴露一个方法
		 */
		return {
			initMenu : function(selector) {
				$(selector).hide();
				$(selector).load('page/cds/video/videoRecord.html',
						function(responseText, textStatus, XMLHttpRequest) {
							$(this).html(XMLHttpRequest.responseText);
							initVideoVue(selector);
						});
			}
		}
	} catch (e) {
		console.error('初始化系统菜单模块异常：', e);
	}
})