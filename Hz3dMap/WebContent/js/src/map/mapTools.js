/**
 * 地图工具
 */
define(function (require) {
	var videoClient = require('frm/hz.videoclient');
	var hzEvent = require('frm/hz.event');
	var mapHandle = require('hz/map/map.handle');
	var message = require('frm/message');
	var user = require('frm/loginUser');
	var db = require('frm/hz.db');
	var vue = require('vue');
	var hzDrag = require('frm/hz.drag');

	var hasOpenedSpeechRec = false;		// 是否已开启声控
	var hasKeyUp = true;				// 是否键盘按下
	var timingCloseId = null;			// 定时关闭声控的定时器编号


	/*
	 * 开启关闭声控
	 * @param 
	 */
	function toggleSpeechRec (flag) {
		if (hasOpenedSpeechRec = flag) {
			videoClient.switchSpeechRec(1);
			message.alert('声控功能开启');
			timingCloseSpeechRec();
		} else {
			videoClient.switchSpeechRec(2);
			message.alert('声控功能关闭');
		}
	}


	/*
	 * 定时关闭声控
	 */
	function timingCloseSpeechRec () {
		timingCloseId = setTimeout(toggleSpeechRec, 4000, false);
	}



	/*
	 * 根据文字定位视角
	 */
	function location(msg){
		if (msg) {
			// 过滤掉所有的非汉字字符
			msg = msg.replace(/[^\u4e00-\u9fa5]+/, '');

			//添加、更新操作
			db.query({
				request: {
					sqlId:'select_sound_control_menu_id',
					params: {
						cusNumber:user.cusNumber,
						message:msg
					}
				},
				success: function (data) {
					if (data && data.length){
						var viewId = data[0].vmi_id;
						mapHandle.location(viewId);
					}else{
						message.alert('视角菜单‘'+msg+'’不存在');
					}
				},
				error: function (code, msg) {
					message.alert(msg);
				}
			});
		}
	}


	
	try {
		$(window.top.document.head).append('<link rel="stylesheet" href="css/map/map.tools.css" charset="utf-8">')
		$(window.top.document.body).append(
			'<div id="mapToolsPanel" style="display:none;">'+
				'<a class="map-close"></a>'+
				'<div class="map-title">地图工具</div>'+
				'<div class="map-tools">'+
					'<ul class="ul-btns">'+
						'<li :class="selectedIndex == 0 ? \'selected\' : \'\'"><span @click="saveViewPoint()">保存视角</span></li>'+
						'<li :class="selectedIndex == 2 ? \'selected\' : \'\'"><span @click="boxSelectForOpen()">框选视频</span></li>'+
						'<li :class="selectedIndex == 3 ? \'selected\' : \'\'"><span @click="boxSelectForPlan()">框选预案</span></li>'+
						'<li :class="selectedIndex == 4 ? \'selected\' : \'\'"><span @click="boxSelectForAlarmPlan()">框选报警预案</span></li>'+
					'</ul>'+
				'</div>'+
			'</div>'
		);

		var jqMapTools = hzDrag.on('#mapToolsPanel');
		hzEvent.load('hz.rightnav', function (rightNav) {
			var jqNav = rightNav.add('MAP.TOOLS', '地图工具', 'map-tools-icon');
			if (jqNav) {
				jqNav.on('click', function () {
					jqMapTools.fadeIn(300);
				});

				jqMapTools.find('.map-close').on('click', function () {
					jqMapTools.fadeOut(300);
				});
			}
		});

		var vo = new vue({
			el: '#mapToolsPanel',
			data: {
				selectStatus: false,
				selectedIndex: null
			},
			methods: {
				setSelectStatus: function (status) {
					this.selectStatus = status;
					var type = [];
					if (this.selectedIndex = 4) {
						type.push(1, 2, 3, 4, 6);
					} else {
						type.push(1);
					}
					mapHandle.boxSelect.setSelectStatus(status, {
						dvcTypes:[1, 2, 3, 4, 6]
					});
				},

				cancelSelectIndex: function () {
					switch(this.selectedIndex) {
						case 0: saveViewPoint(this); break;
						case 1: setPickModelStatus(this); break;
//						case 2: this.setSelectStatus(false); break;
//						case 3: this.setSelectStatus(false); break;
					}
				},

				/*
				 * 保存视角
				 */
				saveViewPoint: function () {
					if (this.selectedIndex == 0) {
						this.selectedIndex = null;
					} else {
						this.cancelSelectIndex();
						this.setSelectStatus(false);
						this.selectedIndex = 0;
					}

					saveViewPoint(this);
				},

				/*
				 * 模型分组
				 */
				setPickModelStatus: function () {

					if (this.selectedIndex == 1) {
						this.selectedIndex = null;
					} else {
						this.cancelSelectIndex();
						this.setSelectStatus(false);
						this.selectedIndex = 1;
					}

					setPickModelStatus(this);
				},

				/*
				 * 框选打开视频
				 */
				boxSelectForOpen: function () {
					this.cancelSelectIndex();

					if (this.selectStatus) {
						if (this.selectedIndex == 2) {
							this.setSelectStatus(false);
							this.selectedIndex = null;
						} else {
							this.selectedIndex = 2;
						}
					} else {
						this.setSelectStatus(true);
						this.selectedIndex = 2;
					}

					mapHandle.boxSelect.offSelect('plan.select');
					mapHandle.boxSelect.offSelect('video.select');
					mapHandle.boxSelect.onSelect(function (array) {
						if (array.length > 0) {
							var len = array.length;
							if(array.length>16){
								len = 16;
							}
							videoClient.setLayout(len);
							var videos = [];
							for(var i=0;i<array.length;i++){
								videos.push(array[i].linkId);
							}
							videoClient.play(videos);
						}
					}, 'video.select');
				},

				/*
				 * 框选创建预案
				 */
				boxSelectForPlan: function () {
					this.cancelSelectIndex();

					if (this.selectStatus) {
						if (this.selectedIndex == 3) {
							this.setSelectStatus(false);
							this.selectedIndex = null;
						} else {
							this.selectedIndex = 3;
						}
					} else {
						this.setSelectStatus(true);
						this.selectedIndex = 3;
					}

					mapHandle.boxSelect.offSelect('plan.select');
					mapHandle.boxSelect.offSelect('video.select');
					mapHandle.boxSelect.onSelect(function (array) {
						
						var tempArray = [];
						$.each(array, function(idx,item){
							if (item.original.mpi_link_type == 1) {
								tempArray.push(item);
							}
						})
						if (tempArray.length > 0) {
							window.homeVm.boxSelectCameras = tempArray;
							
							$('#pointInfoPanel').hide();
							$('#addVideoPlanPanel').show();
						}
					}, 'plan.select');					
				},
				/*
				 * 框选创建报警预案
				 */
				boxSelectForAlarmPlan: function () {
					this.cancelSelectIndex();

					if (this.selectStatus) {
						if (this.selectedIndex == 4) {
							this.setSelectStatus(false);
							this.selectedIndex = null;
						} else {
							this.selectedIndex = 4;
						}
					} else {
						this.setSelectStatus(true);
						this.selectedIndex = 4;
					}

					mapHandle.boxSelect.offSelect('plan.select');
					mapHandle.boxSelect.offSelect('video.select');
					mapHandle.boxSelect.onSelect(function (array) {
						
						if (array.length > 0) {
							
							hzEvent.one('get.alarm.plan.params', function(){
								return {
									array : array
								}
							})
							hzEvent.call('add.alarm.plan.start');
						}
					}, 'plan.select');					
				},

				/**
				 * 视频截图
				 */
				snap:function(){
					videoClient.snap();
				},

				/*
				 * 视频录像
				 */
				record:function(){
					videoClient.record();
				}
			}
		});

		function $$ (val) {
			return jqMapTools.find(val);
		}
	} catch (e) {
		// TODO: handle exception
	}



	try {

		hzEvent.load('hz.handledesc', function (handleDesc) {
			handleDesc.add('MAPTOOLS.001', '快捷键F1', '按下F1可以开启声控，再次按下关闭（开启4秒后自动关闭）!');
		})

		// 初始化声控快捷键
		hzEvent.bind(window.top, 'keydown', function (e) {
			if (e.key == 'F1') {
				e.preventDefault();

				if (hasKeyUp) {
					hasKeyUp = false;
					timingCloseId && clearTimeout(timingCloseId);
					timingCloseId = null;
					toggleSpeechRec(!hasOpenedSpeechRec);
				}
			}
		});

		// 控制声控开关的标识
		hzEvent.bind(window.top, 'keyup', function (e) {
			if (e.key == 'F1') {
				e.preventDefault();
				hasKeyUp = true;
			}
		});

		//订阅后台推送消息
		videoClient.webmessage.on('VIDEO030', 'mapTools', function(data){
			try {
				console.log('语音声控识别内容 -->', data);
				location(JSON.parse(data.body).content);
			} catch (e) {
				console.error(e);
			}
		});
	} catch (e) {
		console.error(e);
	}
});