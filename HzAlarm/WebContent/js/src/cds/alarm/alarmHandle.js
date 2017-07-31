/**
 * 报警联动
 */
define(function (require) {
	var wm = null;
	var hzMap = require('hz/map/map.handle'),
		hzVideo = require('frm/hz.videoclient'),
		hzDrag = require('frm/hz.drag'),
		message = require('frm/message'),
		ztree = require('ztree'),
		vue = require('vue'),
		moment = require('moment'),
		user = require('frm/loginUser'),
		db = require('frm/hz.db'),
		bootstrap = require("bootstrap"),
		utils = require('frm/hz.utils'),
		hzDoor = require('frm/hz.door'),
		dialog = require('frm/dialog'),
		hzEvent = require('frm/hz.event');

	var level_ch = ['', '一级报警', '二级报警', '三级报警'];
	var level_css = ['', 'one', 'two', 'three'];
	var ALARM_DVCTYPE = {
		POWER_NETWORK: 7,
		VIBRATING_FIBER: 9
	};

	var alarmRecordId = null;		// 当前报警记录编号
	var alarmBlinkTID = null;		// 报警闪烁的定时器编号
	var alarmText = '';
	var sendTimerId = null;			// 发送往上级的定时器编号
	var autoSendToHigherTime = 20;	// 自动上报时间

	var $panel = $('div.alarm-handle');

	function $$ (selector) {
		return $panel.find(selector);
	}


	var $top = $$('.ah-link-top');
	var $btm = $$('.ah-link-btm');
	var $door = $$('.ah-link-door');
	var $camera = $$('.ah-link-camera');


	/*
	 * 初始化订阅
	 */
	function initSubs () {
		(function initWM() {
			if (wm = window.webmessage) {
				wm.on('Alarm001','alarmHandle', function (data) { proccess(data); });
			} else {
				setTimeout(initWM, 100);
			}
		})();

		hzDrag.on('.ah-police-box');
		hzDrag.on('.ah-prisoner-box');
		hzDrag.on('.camera-alarm');

		$('.ah-close').on('click', function () {
			$(this).parent().fadeOut(500);
			blink.stop();
		});

		$('a.camera-close').on('click', function () {
			$('.camera-alarm').fadeOut(500);
		});
	}


	function proccess (data) {
		console.log('hzMap.serialNo:' + hzMap.serialNo);
		$panel.show();

		var msg = data.msg;
		var userDeptId = (user.deptId || '') + '';
		var handleAuth = msg.handleAuth;
		var isHandle = false;
		var deptOK = false;	// 部门匹配结果


		// 判断登录用户所在部门是否为可处理该消息的部门
		if (handleAuth && handleAuth.length) {
			for(var i = 0, len = handleAuth.length; i < len; i++) {
				var arr = (handleAuth[i].noticeDeptIds || '').split(',') || [];

				// 如果用户所在部门 属于配置的 接收部门 或 通知部门 ，都可以接收并处理报警
				if (userDeptId == handleAuth[i].handleDeptId || arr.indexOf(userDeptId) > -1){
					deptOK = true;
					console.log('用户报警消息处理权限验证通过');
				}
			}

		// 未配置处理部门则默认报警设备所在部门处理
		} else if (userDeptId == msg.alarmRecord.deptId) {
			deptOK = true;
		}

		// 判断是否为部门上报的报警消息
		if (msg.hasReport) { 

			// 不处理自己上报的消息
			if (deptOK) {
				console.log('不处理自己上报的报警消息');
			} else {

				// 判断用户处理上报消息的权限
				if (user.dataAuth == 1 || user.dataAuth == 2) { // 监狱权限用户（指挥中心）
					isHandle = true;
				} else {
					console.log('权限不足，无法处理上报的报警消息');
				}
			}
		} else {
			if (deptOK) {	// 属于本部门 或 不属于任何部门的 报警消息
				isHandle = true;
			} else {
				console.log('不处理非本部门报警消息');
			}
		}

		if (isHandle) {

			// 处理下一个报警之前取消上一个报警联动
			linkDo.cancelLinkage();

			// TODO: 多个报警过来的时候没有做排队处理导致报警闪烁效果报错，当报警联动之后再有报警过来（如果报警级别大于当前报警应该先取消联动再处理其他报警）
			var alarmLevel = msg.alarmRecord.level,
				alarmDvcTypeCn = msg.alarmRecord.alarmDeviceTypeName,
				alarmTypeCn = msg.alarmRecord.alarmTypeName,
				alarmLevelCn = level_ch[alarmLevel];
				alarmImg = msg.alarmRecord.alarmImg;

			vm.alarmData = data;
			vm.alarmRecord = msg.alarmRecord;
			vm.alarmRecord.alarmDeviceTypeCn = alarmDvcTypeCn || '';
			vm.alarmRecord.alarmTypeCn = alarmTypeCn || '';
			vm.alarmRecord.levelCn = alarmLevelCn;
			vm.recordId = vm.alarmRecord.recordId;

			$$('.ah-alert-box').removeClass('').addClass('ah-alert-box');
			$$('.ah-alert-box').fadeIn(500).addClass(level_css[alarmLevel]);
			$$('.ah-alert-text').html(alarmText = vm.alarmRecord.alarmName + '发生' + alarmLevelCn + '!');
			$$('.ah-handle-btns').show();

			if (alarmLevel == 1) {
				linkDo.handle(msg);
			} else {
				vm.hasLinkHandle = false;
			}

			// 显示智能分析图片
			if (alarmImg) {
				$$('.camera-img').attr('src', alarmImg);
				$$('.camera-alarm').fadeIn(500);
			}

			// 监区的没有处理则上报
			if (user.dataAuth == 0) {
				// 定时20秒之后没有处理发送给上级
				sendTimerId = setTimeout(autoSendToHigher, autoSendToHigherTime * 1000, data);
			}

			//延迟2S播放语音描述
			setTimeout(alarmTextSpeak, 2000, alarmText);

			hzEvent.emit('alarm.handle.extend', vm, alarmText);
		}
	}


	/*
	 * 自动上报
	 */
	function autoSendToHigher (data) {
		$$('.ah-alert-text').after('<span class="txt-tip">（' + autoSendToHigherTime + '秒未处置已自动上报）</span>');
		$$('.ah-handle-btns').hide();
		$$('.ah-info-box').fadeOut(200);

		linkDo.cancelLinkage();

		sendToHigher(data);
	}


	/*
	 * 消息发送到上级
	 */
	function sendToHigher (data, callback, error) {
		data.cusNumber = user.cusNumber;
		data.msg.hasReport = true;

		var alarmMsg = {
			alarmMsg: JSON.stringify(data)
		};

		utils.ajax('alarmHandleCtrl/alarmReport', alarmMsg, 
			function (data) {
				if (data && data.success) {
					console.log(autoSendToHigherTime + '秒未处理，消息已上报...');
				} else {
					console.log(autoSendToHigherTime + '秒未处理，消息上报失败...');
				}
				callback && callback(data);
			},
			function () {
				error && error(data);
				console.log(autoSendToHigherTime + '秒未处理，消息上报错误');
			}
		);
	}


	/*
	 * 取消上报
	 */
	function cancelSendToHigher () {
		if (sendTimerId) {
			sendTimerId = clearTimeout(sendTimerId);
		}
	}


	// 闪烁
	var blink = {
		TID: null,
		spheres: [],
		run: function (position) {
			var index, indexs = [0, 20, 40], shows = [], maxLen = 60, radius = 10, opacity = 0.6, sphere;
			var self = this;

			for(var i = 0; i < maxLen; i++) {
				sphere = hzMap.hzThree.createSphere(radius, 0xFF0000, position);
				sphere.material.opacity = opacity;
				sphere.visible = false;
				opacity -= 0.01;
				radius += 10;
				this.spheres.push(sphere);
			}

			for(var i = 0; i < indexs.length; i++) {
				shows[i] = blink.spheres[indexs[i]];
			}

			function running() {
				for(var i = 0; i < indexs.length; i++) {
					try {
						index = indexs[i];
						shows[i].visible = false;
						shows[i] = blink.spheres[index++];
						shows[i].visible = true;

						if (index < maxLen) {
							indexs[i] = index;
						} else {
							indexs[i] = 0;
						}
					} catch (e) {
						console.warn(e);
						self.stop();
						return;
					}
				}
				self.TID = setTimeout(running, 50);
			}

			running();
		},
		stop: function () {
			this.TID && clearTimeout(this.TID);
			this.remove();
		},
		remove: function () {
			var sphere = null;
			while(this.spheres.length) {
				sphere = this.spheres.shift();
				hzMap.hzThree.sceneRemove(sphere);
				sphere.dispose();
			}
		}
	};


	var setting = {
		data: {
			simpleData:{
				enable:true,
				pIdKey:'pid',
				idKey:'id'
			}
		},
		view: {
			selectedMulti: false
		},
		callback: {
			onClick: function (event, treeId, treeNode, chickFlag) {
				
			}
		}
	};


	/*
	 * 电网动画（临时写在这里，后面要考虑把电网的分离出来）
	 * TODO: 电网
	 */
	var powerNet = {
		pnObj: null,	// 三维地图内的电网对象
		timerId: null,	// 动画的定时器编号

		/*
		 * 电网动画
		 */
		animation: function (pnObj) {
			this.pnObj = pnObj;
			this.timerId = setInterval(function () {
				if (powerNet.pnObj) {
					powerNet.pnObj.visible = !powerNet.pnObj.visible;
				}
			}, 500);
		},

		/*
		 * 删除动画
		 */
		remove: function () {
			clearInterval(this.timerId);
			this.pnObj = null;
			this.timerId = null;
		}
	};


	/*
	 * 联动处理对象
	 */
	var linkDo = {
		handle: function (msg) {
			var record = msg.alarmRecord;
			var dvcType = record.alarmDeviceType;
			var dvcId = record.alarmID;

			vm.polices = msg.police;
			vm.prisoner = msg.prisonerArray;
			vm.hasLinkHandle = true;
			vm.linkTypes = [];

			// 初始化联动
			linkDo.camera(msg.camera);
			linkDo.door(msg.door);
			linkDo.talk(msg.talk);
			linkDo.broadcast(msg.broadcast);
			linkDo.screen(msg.screen);

			// 默认选择第一个
			if (vm.linkTypes.length) {
				setTimeout(vm.selectType, 500, 0, vm.linkTypes[0]);
			}

			// 高压电网报警处理
			if (dvcType == ALARM_DVCTYPE.POWER_NETWORK ||
				dvcType == ALARM_DVCTYPE.VIBRATING_FIBER) {
				db.query({
					request: {
						sqlId: 'select_power_grid_for_alarm_handle',
						whereId: 0,
						params: [user.cusNumber, dvcId]
					},
					success: function (result) {
						if (result && result.length) {
							var powerGrid = hzMap.hzThree.PowerGrid;
							var powerInfo = result[0];

							hzMap.location(powerInfo.pgg_view_id, {
								posX: powerInfo.pgg_pos_x,
								posY: powerInfo.pgg_pos_y,
								posZ: powerInfo.pgg_pos_z,
								rotX: powerInfo.pgg_rot_x,
								rotY: powerInfo.pgg_rot_y,
								rotZ: powerInfo.pgg_rot_z,
								tarX: powerInfo.pgg_tar_x,
								tarY: powerInfo.pgg_tar_y,
								tarZ: powerInfo.pgg_tar_z
							});

							db.query({
								request: {
									sqlId: 'select_power_grid_point_for_alarm_handle',
									whereId: 0,
									orderId: 0,
									params: [user.cusNumber, dvcId]
								},
								success: function (result) {
									if (result && result.length) {
										var points = [];
										for(var i = 0; i < result.length; i++) {
											points.push({
												x: parseFloat(result[i].x),
												y: parseFloat(result[i].y),
												z: parseFloat(result[i].z)
											});
										}

										powerGrid.clearPowerGrid(dvcId);
										powerGrid.setPowerGridParam({
											pathName: dvcId,
											lineColor: '0xFF0000',
											lineWidth: powerInfo.pgg_line_width,
											electronColor: '0xFFFF00'
										});

										powerNet.animation(powerGrid.showPowerGrid({
											pathName: dvcId,
											pathData: points,
											isShowElect: (powerInfo.pgg_show_elect != 1)
										}));
									}
								}
							});
						}
					}
				});
			} else {
				db.query({
					request: {
						sqlId: 'select_model_point_for_map_handle_by_auth',
						whereId: 2,
//						params: [user.cusNumber, dvcType, dvcId]
						params: {
							'cusNumber': user.cusNumber,
							'userId': user.userId,
							'linkType': dvcType,
							'linkId': dvcId
						}
					},
					success: function (result) {
						if (result && result.length) {
							var pos = {
								'x': parseFloat(result[0].mpi_pos_x), 
								'y': parseFloat(result[0].mpi_pos_y), 
								'z': parseFloat(result[0].mpi_pos_z)
							};

							hzMap.isFly = false;
							hzMap.location(result[0].mpi_view_id);
							hzMap.flyToLookAt(pos, 1000, pos.y + 1200, 1000);
							blink.run(pos);
						} else {
							// 视角定位
							if (msg.view) {
								hzMap.location(msg.view.vmi_id);
							} else {
								console.warn('msg.view = ' + JSON.stringify(msg.view));
								message.alert('未配置视角，无法定位!');
							}
						}
					},
					error: function (code, desc) {
						console.error('报警加载报警点位失败：' + desc);
					}
				});
			}

			$$('.ah-info-box').fadeIn(500);
		},


		/*
		 * 摄像机联动处理
		 */
		camera: function (data) {
			try {
				// 弹出视频
				var cameras = vm.cameras = this._pushTypes(data, 1, '摄像机');
				var array = [];

				for(var i = 0; i < cameras.length; i++) {
					array.push(cameras[i].cbd_id);
				}

				hzVideo.setLayout(array.length);
				hzVideo.play(array);
			} catch (e) {
				console.error('摄像机联动失败：', e);
			}
		},


		/*
		 * 门禁联动处理
		 */
		door: function (data) {
			try {
				var doors = vm.doors = this._pushTypes(data, 2, '门禁');
			} catch (e) {
				console.error('门禁联动处理失败：', e);
			}
		},

		/*
		 * 对讲联动处理
		 */
		talk: function (data) {
			try {
				var talk = vm.talks = this._pushTypes(data, 3, '对讲');
			} catch (e) {
				// TODO: handle exception
			}
		},

		/*
		 * 广播联动处理
		 */
		broadcast: function (data) {
			try {
				var broadcast = vm.broadcasts = this._pushTypes(data, 4, '广播');

				if(vm.broadcasts.length > 0){
					vm.broadcastids = '';
					for(var i=0;i<vm.broadcasts.length;i++){
						vm.broadcastids += (i == 0) ? vm.broadcasts[i].bbd_other_id
								: (';' + vm.broadcasts[i].bbd_other_id);
					}
				}

				//初始化音频列表
				utils.ajax('broadcast/fileList', {"args":'{"suffix":"mp3"}'}, function (data) {
					if (data && data.success) {
						vm.audios = [];
						for(var i = 0 ; i < data.obj.length; i++) {
							vm.audios.push(data.obj[i]);
						}
					} else {
						console.warn('初始化音频列表失败：' + JSON.stringify(data));
					}
				});
			} catch (e) {
				// TODO: handle exception
			}
		},

		/*
		 * 大屏（电视墙）联动处理
		 */
		screen: function (data) {
			try {
				var screens = vm.screens = this._pushTypes(data, 5, '大屏');
			} catch (e) {
				// TODO: handle exception
			}
		},

		/*
		 * 添加联动设备类型
		 */
		_pushTypes: function (array, id, name) {
			array = [].concat(array || []);
			array.length && vm.linkTypes.push({id: id, name: name});
			return array;
		},

		/*
		 * 取消联动效果
		 */
		cancelLinkage: function () {
			cancelSendToHigher();

			var dvcType = vm.alarmRecord.alarmDeviceType;
			if (dvcType == ALARM_DVCTYPE.POWER_NETWORK || 
				dvcType == ALARM_DVCTYPE.VIBRATING_FIBER) {
				powerNet.remove();
				hzMap.loadPowerGrid();
			} else {
				blink.stop();
			}
		}
	};




	var linkDom = {
		initLi: function ($dom) {
			$dom.find('.ah-ltl-ul >li >span').each(function (i) {
				$(this).on('click', function () {
					vm[$(this).parent().attr('vm-click')]($(this));
				}).on('mouseenter', function () {
					var $slt = $dom.find('.ah-ltl-hoving');
					var $prt = $(this).parent();

					$dom.find('li.hover').removeClass('hover');
					$prt.addClass('hover');
					$slt.show().animate({left: $prt.position().left + $prt.outerWidth() / 2 - $slt.width() / 2}, 350);

				});
			});
		}
	};


	var vm = new vue({
		el: '.alarm-handle',
		data: {
			params: [user.cusNumber],

			hasLinkHandle: false,
			alarmData: {},

			selectedCameraId: '',
			selectedLayout: '',
			selectedType: '',
			selected: '',

			selectedFlowId: '',		// 选择的报警处置流程编号
			selectedFlowName: '',	// 选择的报警处置流程名称

			selectedFileName: '', // 选择广播播放文件
			selectedSound: 5,
			selectedMode: 1,

			recordId: '',
			alarmRecord: {
				recordId: '',
				alarmAction: '',
				alarmAddrs: '',
				alarmDeviceType: '',
				alarmDeviceTypeCn: '',
				alarmID: '',
				alarmName: '',
				alarmTime: '',
				alarmType: '',
				alarmTypeCn: '',
				level: 1,
				levelCn: '',
				remark: ''
			},
			linkTypes: [],
			layouts: ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六'],

			polices:[],
			policeTop: 0,
			policeBtm: 1,

			prisoner: [],
			prisonerTop: 0,
			prisonerBtm: 1,

			cameras: [],
			doors: [],
			talks: [],
			broadcasts: [],
			broadcastids : '',//需要联动的广播编号
			audios: [],			// 广播音频列表
			isPlay:1,
			screens: [],

			doorStatusMap: {},

			flowSteps: [],
		},
		watch: {
			selectedFlowId: function () {
				db.query({
					request: {
						sqlId: 'select_handle_flow_dtls_for_map_handle',
						whereId: 0,
						orderId: 0,
						params: [user.cusNumber, this.selectedFlowId]
					},
					success: function (array) {
						vm.flowSteps = array;
					}
				});
			},

			selectedFileName: function () {
				
			}
		},
		methods: {
			// 联动
			linkHandle: function () {
				this.hasLinkHandle || linkDo.handle(vm.alarmData.msg);
			},

			checkStatus: function (callback) {
				db.query({
					request: {
						sqlId: 'select_alert_record_status_for_map_handle',
						whereId: 0,
						params: [user.cusNumber, vm.recordId]
					},
					success: function (array) {
						var data = array[0], msg;
						var status = data.oprtn_stts;
						if (status && status != 1) {
							switch (status) {
								case 2: msg = '用户[' + data.receive_user + ']在[' + moment(data.receive_time).format('HH:mm:ss') + ']已接警'; break;
								case 3: msg = '该报警正在处置中...'; break;
								case 4: msg = '该报警已处置完成!'; break;
								case 5: msg = '该报警已标记为误报!'; break;
								case 6: msg = '该报警已启用应急预案!'; break;
							}
							message.alert(msg);
						} else {
							callback(status, data);
						}
					}
				});
			},

			// 接警处置
			alarmHandle: function () {
				// TODO: 更新报警记录状态  -- 1.接警-更新报警记录状态
//				db.update({
//					request: {
//						sqlId: 'update_receive_info_for_map_handle',
//						whereId: 0,
//						params: [user.userId, user.nickname || user.realName, moment().format('YYYY-MM-DD HH:mm:ss'), 2, user.cusNumber, vm.recordId, 1]
//					},
//					success: function (data) {
//						if (data) {
//							var result = data.data[0].result[0];
//							if (result == 1) {						// 2. 更新成功-弹出流程面板
//								vm.linkHandle();
//								$$('.ah-handle-box').fadeIn(350);
//								$$('.ah-handle-step1').show();
//								$$('.ah-handle-step2').hide();
//							} else {								// 2. 更新失败-查询记录状态
//								vm.checkStatus(function (status, data) {});
//								$$('.ah-info-box').fadeOut(200);
//							}
//							$$('.ah-alert-box').fadeOut(200);
//						}
//					}
//				});

				// TODO: 更新报警记录状态  -- 1.接警-更新报警记录状态
				vm.updateRecord(2, function (result) {
					vm.linkHandle();
					$$('.ah-handle-box').fadeIn(350);
					$$('.ah-handle-step1').show();
					$$('.ah-handle-step2').hide();
				});

				linkDo.cancelLinkage();
				hzEvent.emit('alarm.handle.dispose', vm);
			},

			updateRecord: function (status, callback) {
				db.update({
					request: {
						sqlId: 'update_receive_info_for_map_handle',
						whereId: 0,
						params: [user.userId, user.nickname, moment().format('YYYY-MM-DD HH:mm:ss'), status, user.cusNumber, vm.recordId, 1]
					},
					success: function (data) {
						if (data) {
							var result = data.data[0].result[0];
							if (result == 1) {						// 2. 更新成功-弹出流程面板
								callback();
							} else {								// 2. 更新失败-查询记录状态
								vm.checkStatus(function (status, data) {});
								$$('.ah-info-box').fadeOut(200);
							}
							$$('.ah-alert-box').fadeOut(200);
						}
					}
				});
			},

			// 误报（取消报警）
			cancelHandle: function () {
				this.checkStatus(function (status, data) {
					message.confirm('是否确定该报警为<span class="ah-red-title">误报</span>?', function () {
						var recordId = vm.alarmRecord.recordId;

						// TODO: 更新报警记录状态  -- 更新状态为误报状态
						db.updateByParamKey({
							'request': {
								'sqlId': 'update_alert_record_for_map_handle_5',
								'params': {
									'cusNumber': user.cusNumber,
									'recordId': recordId,
									'userId': user.userId,
									'userName': user.nickname || user.realName,
									'time': moment().format('YYYY-MM-DD HH:mm:ss'),
									'desc': '此报警消息为误报',
									'result': '此报警消息为误报',
									'stts': '5'
								}
							},
							'success': function (data) {
								if (data.data[0].result == 1) {
									message.alert('报警消息处理成功!');
								} else {
									message.alert('报警消息处理失败，报警编号：' + recordId);
								}
							},
							'error': function (code, msg) {
								message.alert('报警消息处理失败：' + code + msg);
							}
						});

						$$('.ah-info-box').fadeOut(200);						
						$$('.ah-alert-box').fadeOut(200);
						$$('.ah-handle-box').fadeOut(200);

						linkDo.cancelLinkage();

						hzEvent.emit('alarm.handle.cancel', vm);
					});
				});
			},

			/*
			 * 手动上报
			 */
			sendToHigher: function () {
				$$('.ah-info-box').fadeOut(200);						
				$$('.ah-alert-box').fadeOut(200);
				$$('.ah-handle-box').fadeOut(200);

				linkDo.cancelLinkage();
				sendToHigher(vm.alarmData, function (data) {
					if (data && data.success) {
						message.alert('该报警消息上报成功!');
					} else {
						message.alert('该报警消息上报失败!');
					}
				}, function () {
					message.alert('该报警消息上报异常!');
				});
			},

			/*
			 * 
			 */
			nextStep: function () {
				if (this.selectedFlowId) {
					$$('.ah-handle-step1').hide();
					$$('.ah-handle-step2').show();
				} else {
					message.alert('请选择报警处置流程!');
				}
			},

			prevStep: function () {
				$$('.ah-handle-step1').show();
				$$('.ah-handle-step2').hide();
			},

			submit: function () {
				var handleFlowId = this.selectedFlowId;
				var recordId = this.alarmRecord.recordId;
				var cusNumber = user.cusNumber;
				var time = moment().format('YYYY-MM-DD HH:mm:ss');

				var localCase = $$('#ard_local_case').val();
				var oprtnDesc = $$('#ard_oprtn_desc').val();

				var params = {
					'recordId': recordId,
					'cusNumber': cusNumber,
					'flowId': handleFlowId
				};

				if (localCase.length == 0) {
					message.alert('请填写现场情况!'); return;
				}

				if (oprtnDesc.length == 0) {
					message.alert('请填写处置情况!'); return;
				}

				// TODO: 更新报警记录状态  -- 更新状态为处置完成
				db.updateByParamKey({
					'request': [{
						sqlId: 'update_alert_record_for_map_handle_4',
						params: {
							'cusNumber': user.cusNumber,
							'recordId': recordId,
							'userId': user.userId,
							'userName': user.nickname || user.realName,
							'time': moment().format('YYYY-MM-DD HH:mm:ss'),
							'oprtn_desc': oprtnDesc,
							'oprtn_result': '',
							'oprtn_stts': '4',
							'local_case': localCase
						}
					}, {
						sqlId: 'insert_alarm_handle_flow_master_h',
						whereId: 0,
						params: params
					}, {
						sqlId: 'insert_alarm_handle_flow_detail_h',
						whereId: 0,
						params: params
					}],
					'success': function (data) {
						if (data.data[0].result == 1) {
							message.alert('处理成功!');
							$$('.ah-handle-box').fadeOut(350);
							$$('.ah-info-box').fadeOut(350);
							$$('#ard_local_case').val('');
							$$('#ard_oprtn_desc').val('');
						} else {
							message.alert('处理失败!');
						}
					},
					'error': function (code, msg) {
						message.alert('报警消息处理失败：' + code + msg);
					}
				});
			},

			close: function () {
				message.confirm('还未提交现场情况和处置情况记录，是否确认关闭?', function () {
					$$('.ah-handle-box').fadeOut(350);
					$$('.ah-info-box').fadeOut(200);
					$$('.ah-alert-box').fadeOut(200);
					$$('.ah-handle-box').fadeOut(200);
					linkDo.cancelLinkage();
				});
			},

			policePage: function (type) {
				if (type > 0) {
					if (vm.policeBtm < vm.polices.length - 1) {
						vm.policeBtm += 2;
						vm.policeTop += 2;
					}
				} else {
					if (vm.policeTop > 1) {
						vm.policeTop -= 2;
						vm.policeBtm -= 2;
					}
				}
			},

			prisonerPage: function (type) {
				if (type > 0) {
					if (vm.prisonerBtm < vm.prisoner.length - 1) {
						vm.prisonerBtm += 2;
						vm.prisonerTop += 2;
					}
				} else {
					if (vm.prisonerTop > 1) {
						vm.prisonerTop -= 2;
						vm.prisonerBtm -= 2;
					}
				}
			},
			
			/*--------应急预案------*/
			startupPlan:function(){
				dialog.open({
					type : 2,
					title : '启动预案',
					h:40,
					w:40,
					top : 200,
					url : 'page/cds/emergency/planChoice.html?' + vm.recordId
				});
			},

			// 选择联动设备
			selectType: function (index, obj) {
				try {
					$('#ulLinkDvcType').find('>li.selected').removeClass('selected');
					$('#ulLinkDvcType').find('>li').eq(index).addClass('selected');
					this.selectedType = obj.id;

					var $sltLine = $top.find('.ah-ltl-selected');
					var $sltDom = $top.find('li.selected');
					var pos = $sltDom.position();

					var left = pos.left + $sltDom.outerWidth() / 2;
					var height = $sltLine.outerHeight();

					$sltLine.css('height', 0).show();
					$sltLine.animate({left: left - $sltLine.width() / 2, height: height}, 500);
				} catch (e) {
					console.error(e);
				}
			},

			selectCamera: function (domId, cameraId) {
				this.selectedCameraId = cameraId;
				$camera.find('>.selected').removeClass('selected');
				$camera.find('#' + domId).addClass('selected');
			},

			selectLayout: function (layout) {
				this.selectedLayout = layout;
				hzVideo.setLayout(layout);
				$$('.ah-ltl-layout').fadeOut(350);
			},

			playbackCamera: function ($obj) {
				if (this.selectedCameraId) {

					var fmt = 'YYYY-MM-DD HH:mm:ss'; 
					var bTime = moment(this.alarmRecord.alarmTime).subtract(5, 'm').format(fmt);
					var eTime = moment(this.alarmRecord.alarmTime).format(fmt);

					console.log('bTime = ' + bTime);
					console.log('eTime = ' + eTime);

					hzVideo.playback([{
						"cameraId": this.selectedCameraId, 
						"beginTime": bTime, 
						"endTime": eTime
					}]);
				} else {
					message.alert('请选择要回放的摄像机!');
				}
			},

			playCamera: function ($obj) {
				if (this.selectedCameraId) {
					hzVideo.play(this.selectedCameraId);
				} else {
					message.alert('请选择要播放的摄像机!');
				}
			},

			setLayout: function ($obj) {
				$$('.ah-ltl-layout').fadeIn(350);
			},

			selectDoor: function (domId) {
				$door.find('>.selected').removeClass('selected');
				$door.find('#' + domId).addClass('selected').find('.ah-db-btns').animate({rotate: 90}, {
					step: function (now, fx) {
						$(this).css('transform', 'rotate(' + (now - 90) + 'deg)');
					},
					complete: function () {
						$(this).css('rotate', 0);
						$(this).css('transform', 'rotate(0deg)');
					},
					duration: 300,
					queue: false
				});
			},

			openDoor: function (data) {
				vm._doorHandle('openDoor', [data.dbd_id], function (result) {
					console.info('openDoor.result=', result);
				}, function (result, msg) {
					console.warn('openDoor.result=', result, msg);
				});
			},

			openDoors: function ($obj) {
				message.confirm('是否确定<span class="ah-red-title">打开</span>所有的门禁?', function () {
					vm._doorsHandle('openDoor', function (result) {
						console.info('openDoors.result=', result);
					}, function (result, msg) {
						console.warn('openDoors.result=', result, msg);
					});
				});
			},

			closeDoor: function (data) {
				vm._doorHandle('closeDoor', [data.dbd_id], function (result) {
					console.info('closeDoor.result=', result);
				}, function (result, msg) {
					console.warn('closeDoor.result=', result, msg);
				});
			},

			closeDoors: function ($obj) {
				message.confirm('是否确定<span class="ah-red-title">关闭</span>所有的门禁?', function () {
					vm._doorsHandle('closeDoor', function (result) {
						console.info('closeDoors.result=', result);
					}, function (result, msg) {
						console.warn('closeDoors.result=', result, msg);
					});
				});
			},

			lockDoor: function (data) {
				vm._doorHandle('lockDoor', [data.dbd_id], function (result) {
					console.info('lockDoor.result=', result);
				}, function (result, msg) {
					console.warn('lockDoor.result=', result, msg);
				});
			},

			lockDoors: function ($obj) {
				message.confirm('是否确定<span class="ah-red-title">锁定</span>所有的门禁?', function () {
					vm._doorsHandle('lockDoor', function (result) {
						console.info('lockDoors.result=', result);
					}, function (result, msg) {
						console.warn('lockDoors.result=', result, msg);
					});
				});
			},

			_doorsHandle: function (action, success, error) {
				var doors = [];
				for(var i = 0; i < this.doors.length; i++) {
					doors.push(this.doors[i].dbd_id);
				}
				this._doorHandle(action, doors, success, error);
			},

			_doorHandle: function (action, doors, success, error) {
				hzDoor[action]({
					request: {
						cusNumber: user.cusNumber,
						userId: user.userId,
						doorId: doors
					},
					success: success,
					error: error
				});
			},

			selectFile: function (index, fileName) {
				// 选择的音频文件
				this.selectedFileName = fileName;
			},

			selectMode: function (mode) {
				// 选择的模式
				this.selectedMode = mode;
			},

			prevMusic: function () {
				// 播放上一个
				console.log('prevMusic...');
			},

			nextMusic: function () {
				// 播放下一个
				console.log('nextMusic...');
			},

			playMusic: function () {
				// 播放
				console.log('playMusic...');
				if (this.selectedMode == 3) {
					bcTools.say();
				} else {
					bcTools.play(vm.isPlay);
				}
			}
		}
	});


	/*
	 * 广播工具对象
	 */
	var bcTools = {
		status: 0,	// 状态：0 空闲、1播放、2停止

		/*
		 * 播放文件
		 * @param action 指令：1 播放、2 停止
		 */
		play: function (action) {
			var playAudio = vm.selectedFileName;

			// 开始播放时,必须选择要播放的mp3文件
			if (vm.isPlay == 1 && !playAudio) {
				message.alert('请选择要播放的音频文件!');
				return;
			}
			
			if(!vm.broadcastids || vm.broadcastids == ''){
				message.alert('未关联数字广播设备!');
				return;
//				vm.broadcastids = '2';
			}

			// 1. 选择终端设备号

			var url = 'broadcast/play';
			var args = {
				'cusNumber': user.cusNumber,
				'broadcastType': vm.selectedMode,
				'videoPath': playAudio,
				'clientID': vm.broadcastids,
				'action': action,		// 1播放、2停止
				'user': user.userId,
			};

			// 请求处理
			utils.ajax(url, {'args': JSON.stringify(args)}, 
				function (json) {
					if (json.success) {
						console.log('指令发送成功');
						vm.isPlay = (vm.isPlay == 1)?2:1;
					}else{
						message.alert('发送播放指令失败,请稍候重试');
					}
				}, 
				function () {
					message.alert('请求失败，服务器响应超时~!');
				}, 
			false);
		},
		say: function () {
			if(!vm.broadcastids || vm.broadcastids == ''){
				message.alert('未关联数字广播设备!');
				return;
//				vm.broadcastids = '2';
			}
			var args = {
					'cusNumber':user.cusNumber,
					'clientID':vm.broadcastids,
					'action':vm.isPlay,//1开始喊话,2停止喊话
			};
			
			var reqs = function(json){
				if(json.success){
					console.log('指令发送成功');
					vm.isPlay = (vm.isPlay == 1)?2:1;
				}else{
					message.alert('指令发送失败,请稍候重试');
				}
			};
			/*
			 * 请求响应失败处理
			 */
			function reqe () {
				message.alert('请求失败，服务器响应超时~!');
			};
			
			// 请求处理
			utils.ajax('broadcast/say', {'args': JSON.stringify(args)}, reqs, reqe,false);
		}
	};
	

	try {
		initSubs();

		$$('.ah-handle-textarea').on('keydown keyup', function () {
			event.stopPropagation();
		});

		$btm.find('.ah-lt-line').each(function () {
			linkDom.initLi($(this));
		});

		$$('.ah-layout-close').on('click', function () {
			$$('.ah-ltl-layout').fadeOut(350);
		});

		//初始化音量按钮
		$$(".sound-popover").popover({
			content: $$("#sound-div").html(),
			container: '.sound-popover',
			placement: 'top',
			html: 'true',
		}).on('shown.bs.popover', function () {
			$$("input.sound").val(vm.selectedSound);
			$$("input.sound").each(function () {
				$(this).on({
					'mouseup': function () {

					},
					'change': function () {
						var val = vm.selectedSound = this.value;
						$$("input.sound").attr({'value': val, 'title': val});
					}
				});
			});
		});

		/*
		 * 关闭信息窗口*/
		hzEvent.subs('set.plan.step.choice.close', function (param) {
			if(param){
				vm.updateRecord(6, function (result) {
					$$('.ah-info-box').fadeOut(200);						
					$$('.ah-alert-box').fadeOut(200);
					$$('.ah-handle-box').fadeOut(200);
				});
				linkDo.cancelLinkage();
			}
		});

		//初始化播放模式
		$$(".mode-popover").popover({
			content: $$("#mode-div").html(),
			container: '.mode-popover',
			placement: 'top',
			html: 'true',
		}).on('shown.bs.popover', function () {
			$$(".mode-list li").each(function () {
				$(this).on('click', function () {
					vm.selectMode($(this).attr('play-mode'));
				});
			});
		});
	} catch (e) {
		console.error(e);
	}

	/**
	 * 语音播报报警信息
	 */
	function alarmTextSpeak(alarmText){
		try {
			hzVideo.vcSend('SPEECH001',{speechStr:alarmText});
		} catch (e) {
			console.warn('语音播报功能异常：', e);
		}
		
	}
});