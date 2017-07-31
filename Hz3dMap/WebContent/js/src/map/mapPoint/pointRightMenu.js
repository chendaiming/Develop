/**
 * Created by chendm on 2017/4/1 14:13
 */
define(function(require){
	var vue = require('vue'),
		hzEvent = require('frm/hz.event'),
		hzDB = require('frm/hz.db'),
		message = require('frm/message'),
		mapHandle = require('hz/map/map.handle'),
		ls = require('frm/localStorage'),
		hzVC = require('frm/hz.videoclient'),
		dialog = require('frm/dialog'),
		user = require('frm/loginUser'),
		hzDoor = require('frm/hz.door');

	var DEVICE_TYPE = {
		'CAMERA': 1
	};

	var filterTypes = [96,97,98,99];	// 双击时过滤部分模型处理
	var hasVisible = false;				// 面板是否已显示
	var rltnDvcInfo = []; 				// 查询的点位关联设备的信息

	function initCode () {

		var vm = new vue({
			el:'#rightMenu',
			data:{
				rightMenus:[],		
				menus:{
				   '1':[
				       {text:'回放',icon:'css/image/replay.png',method:'replayVideo'},
					   {text:'打开',icon:'css/image/openvideo.png',method:'openVideo'},
					   {text:'录像',icon:'css/image/luxiang.png'},
					   {text:'删除',icon:'css/image/delete.png',method:'del'},
					   {text:'编辑',icon:'css/image/edit.png',method:'edit'},
					   {text:'截图',icon:'css/image/jietu.png'}
				   ],
				   '2':[
						{text:'开门',icon:'css/image/opendoor.png',method:'openDoor'},
						{text:'关门',icon:'css/image/closedoor.png',method:'closeDoor'},
						{text:'查看',icon:'css/image/viewdoor.png'},
						{text:'删除',icon:'css/image/delete.png',method:'del'},
						{text:'编辑',icon:'css/image/edit.png',method:'edit'},
						{text:'刷卡',icon:'css/image/doorrecord.png',method:'openDoorRecord'}  
				   ],
				   '3':[
						{text:'对讲',icon:'css/image/talk_start.png',method:'talk'},
						{text:'监听',icon:'css/images/listen.png',method:'monitor'},
						{text:'广播',icon:'css/images/talk.png',method:'talk_broadcast'},
						{text:'直呼',icon:'css/image/talk_start.png',method:'talk_hz'}, 
						{text:'删除',icon:'css/image/delete.png',method:'del'},
						{text:'编辑',icon:'css/image/edit.png',method:'edit'}
				   ],
				   '6':[
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'删除',icon:'css/image/delete.png',method:'del'},
						{text:'编辑',icon:'css/image/edit.png',method:'edit'},
						{text:'',icon:''} 
				   ],
				   '15':[
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'删除',icon:'css/image/delete.png',method:'del'},
						{text:'编辑',icon:'css/image/edit.png',method:'edit'},
						{text:'',icon:''} 
				   ],
				   '16':[
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'删除',icon:'css/image/delete.png',method:'del'},
						{text:'编辑',icon:'css/image/edit.png',method:'edit'},
						{text:'',icon:''} 
				   ],
				   '98':[
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'删除',icon:'css/image/delete.png',method:'del'},
						{text:'编辑',icon:'css/image/edit.png',method:'edit'},
						{text:'',icon:''} 
				   ],
				   '97':[
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'删除',icon:'css/image/delete.png', method:'del'},
						{text:'编辑',icon:'css/image/edit.png', method:'edit'},
						{text:'详情',icon:'css/image/viewdoor.png', method: 'ffeDetail'} 
				   ],
				   '95':[
				        {text:'呼叫',icon:'css/image/talk_start.png',method:'schedu_call'},
						{text:'短信',icon:''},
						{text:'',icon:''},
						{text:'',icon:''},
						{text:'删除',icon:'css/image/delete.png', method:'del'},
						{text:'编辑',icon:'css/image/edit.png', method:'edit'},
						//{text:'详情',icon:'css/image/viewdoor.png', method: 'ffeDetail'} 
				   ]
				}
			},
			methods:{
				clickMenu:function(method){
					hideRightMenu();
					clickMenuFn(method);
				}
			}
		});

		function clickMenuFn(method){
			switch (method) {
				case 'openVideo': camera.openVideo(); break;
				case 'replayVideo': camera.replayVideo(); break;
				case 'openDoor': door.openDoor(); break;
				case 'closeDoor': door.closeDoor(); break;
				case 'openDoorRecord': door.openDoorRecord(); break;
				case 'del': delPoint(); break;
				case 'edit': setEditInfo(); break;
				case 'talk': talkback.talk(); break; //对讲
				case 'monitor': talkback.monitor(); break; //监听
				case 'talk_broadcast': talkback.talk_broadcast(); break; // 广播
				case 'talk_hz': talkback.talk_hz(); break;	//直呼
				case 'ffeDetail': ffeDetail(); break;
				case 'schedu_call':schedu_call();break;//通讯调度-地图呼叫
			}
		}
		
		//通讯调度-地图呼叫
		function schedu_call(){
			$('#schedulingMini').css({
				'left': window.event.clientX,
				'top': window.event.clientY + 20,
			}).show();
			//传入点位ID
			ls.setItem('schedulingId',data.linkId);
			hzEvent.call('hz.hf.call');
		}

		function ffeDetail () {
			hzEvent.emit('pointRightMenu.ffeDetail', data, rltnDvcInfo);
		}

		var camera = {
			openVideo:function(){
				hzVC.play(data.linkId);
			},
			replayVideo:function(){
				if(!data.linkId){
					return;
				}
				window.replayCamera = {
					id:data.linkId,
					type:data.type,
					name:data.name
				};
				dialog.open({
					id:'234',
					type:2,
					title:'录像回放',
					url:'page/cds/video/replay.html'
				});
			}
		}
		
		var door = {
			getRequestParam:function(){
				return {
					cusNumber:user.cusNumber,
					userId:user.userId,
					doorId:[data.linkId]						
				}
			},
			openDoor:function(){
				if(user.doorAvoid == 1){//免密
					hzDoor.openDoor({
						request:this.getRequestParam(),
						success:function(res){
							getCameraIdAndPlay(data.linkId);
							mapHandle.door.open(data.original.mpi_rltn_model_name);
							message.alert('发送开门指令成功');
						}
					});
				}else{
					layer.prompt({title:'请输入门禁口令',formType: 1,value:'',maxlength:6}, function(pass, index){
						if(pass == user.doorpwd){
							hzDoor.openDoor({
								request: door.getRequestParam(),
								success: function (res) {
									getCameraIdAndPlay(data.linkId);
									mapHandle.door.open(data.original.mpi_rltn_model_name);
									message.alert('发送开门指令成功');
								}
							});
							layer.close(index);
						} else{
							layer.msg('密码错误');
						}
					});						
				}
			},				
			closeDoor:function(){
				hzDoor.closeDoor({
					request:this.getRequestParam(),
					success:function(res){
						mapHandle.door.close(data.original.mpi_rltn_model_name);
						message.alert('发送关门指令成功');
					}
				});
			},
			openDoorRecord:function(){
				ls.setItem('doorId',data.linkId);
				dialog.open({
					id:'239',
					type:2,
					title:'门禁刷卡记录',
					url:'page/cds/door/record/record.html',
					params:{doorId:data.linkId}
				});
			}
		}
	
		/**
		 * 对讲模块
		 */
		var talkback = {
				talk:function(){
					showTalkbackMini('对讲');
					hzEvent.call('hz.miniTalkback.talk');
				},				
				monitor:function(){
					showTalkbackMini('监听');
					hzEvent.call('hz.miniTalkback.monitor');
				},
				talk_broadcast:function(){
					showTalkbackMini('广播');
					hzEvent.call('hz.miniTalkback.call');
				},
				talk_hz:function(){
					showTalkbackMini('直呼');
					hzEvent.call('hz.miniTalkback.startTalk');
				}
			}
		/**
		 * 显示迷你对讲面板
		 */
		function showTalkbackMini(strCallType){
			ls.setItem('talkbackId',data.linkId);
			ls.setItem('talkbackName',data.name);
			ls.setItem('talkbackCallType',strCallType);
			$('#talkbackMini').css({
				'left': window.event.clientX,
				'top': window.event.clientY + 20,
			}).show();
		}

		var pEvent, data, ev, queryTID;// 查询编号
	  	hzEvent.on('pointRight',function(d){
	  		visiblePanel(false);
	  		pEvent = d.event;
	  		data = d.data;
	  		ev = pEvent.data.screenPos;

	  		var viewPoint = {
				posX:data.original.mpi_view_pos_x,
				posY:data.original.mpi_view_pos_y,
				posZ:data.original.mpi_view_pos_z,
				rotX:data.original.mpi_view_rot_x,
				rotY:data.original.mpi_view_rot_y,
				rotZ:data.original.mpi_view_rot_z,
				tarX:data.original.mpi_view_tar_x,
				tarY:data.original.mpi_view_tar_y,
				tarZ:data.original.mpi_view_tar_z
			};
	
	  		//hzEvent.subs('hz.fly.over', 'pointRightMenu', function (viewPoint) {
	  			//hzEvent.unsubs('hz.fly.over', 'pointRightMenu');
	  			ev = pEvent.data.object.toScreenPosition();
	  			vm.rightMenus = vm.menus[data.type+''];
		    	vm.$nextTick(function(){
		    		showRightMenu(ev);
		    	});
	  		//});
			//mapHandle.flyTo(viewPoint);
	    });
	
	  	hzEvent.on('pointMouseover',function(d){
	  		if (mapHandle.mouseHandle != mapHandle.MOUSEDRAG){ // 拖拽状态下不查询详情
	  			var deviceId = d.data.linkId;
		  		var type = d.data.type;
		  		queryInfo(deviceId, type, d.event.data.screenPos, queryTID = (new Date()).getTime());
	  		}
	  	});

	  	hzEvent.on('pointDblclick',function (d) {
	  		mapHandle.isCameraLookAt = false;	// 双击时锁定不触发双击定位地图事件
	  		visiblePanel(false);

	  		var type = d.data.type * 1;
	  		// 过滤部分类型的模型点位
	  		if (filterTypes.indexOf(type) < 0) {

		  		// 处理逻辑：1.摄像机直接打开实时监控；2.其它设备则打开关联的摄像机视频监控
	  			switch(type) {
		  			case DEVICE_TYPE.CAMERA: hzVC.play(d.data.linkId); break;
		  			default: openLinkCameras(d.data); break;
		  		}
	  		}
	  	});

	  	hzEvent.on('pointMouseout',function(d){
	  		queryTID = null;
	  		visiblePanel(false);
	  	});

	  	// 绑定鼠标移动事件
	  	hzEvent.bind(window, 'mousemove', function () {
	  		movePanel();
	  	});


	  	/*
	  	 * 显示面板
	  	 * @param visible ture显示 / false不显示
	  	 */
	  	function visiblePanel(visible) {
	  		$('#pointInfoPanel').toggle(hasVisible = visible);
	  	}

	  	/*
	  	 * 打开关联的摄像机视频监控
	  	 */
	  	function openLinkCameras (data) {
	  		hzDB.query({
	  			request: {
	  				sqlId: 'select_link_cameras_by_dvc',
	  				whereId: '0',
	  				orderId: '0',
	  				params: [user.cusNumber, data.type, data.linkId]
	  			},
	  			success: function (list) {
	  				if (list && list.length) {
	  					var cameras = [];
	  					for(var i = 0, len = list.length; i < len; i++) {
	  						cameras.push(list[i].dvc_id);
	  					}
	  					hzVC.play(cameras);
	  				} else {
	  					message.alert('该设备未关联视频监控');
	  				}
	  			},
	  			error: function (code, msg) {
	  				console.error('获取关联视频监控设备错误：[' + code + '][' + msg + ']');
	  				message.alert('获取关联视频监控设备错误!');
	  			}
	  		});
	  	}


		/*
		 * 联动摄像机
		 */
		hzEvent.on('device.linkage.cameras', function (data) {
			openLinkCameras(data);
		});


		var rightMenu= $('#rightMenu');
	  	function showRightMenu(ev){
	  		if(rightMenu.css('visibility') == 'hidden'){
				rightMenu.css({
					display:'block',
					visibility:'visible',
					left:ev.x,
					top:ev.y-130
				});
				var li = rightMenu.find('li');
				for(var f=0;f<li.length;f++){
					$(li[f]).css({
						'transform':'rotate('+(60+f*60)+'deg) skew(30deg)',
						'-webkit-transform':'rotate('+(60+f*60)+'deg) skew(30deg)',
						'-moz-transform':'rotate('+(60+f*60)+'deg) skew(30deg)'
					});
				}
			}else{
				hideRightMenu();
			}
	  	}
	  	function hideRightMenu(){
	  		rightMenu.css({'display':'hidden','visibility':'hidden'});
			window.isPointRightClick = false;
			rightMenu.find('li').css({
				'transform':'rotate(60deg) skew(30deg)',
				'-webkit-transform':'rotate(60deg) skew(30deg)',
				'-moz-transform':'rotate(60deg) skew(30deg)'
			});
	  	}
	  	
	  	function setEditInfo(){
			window.addPointViewModel.point.mpi_point_name = data.name;
			window.addPointViewModel.point.mpi_link_type = data.type;
			window.addPointViewModel.point.mpi_link_id = data.linkId;
			window.addPointViewModel.point.mpi_point_id = data.id;
			window.addPointViewModel.point.mpi_pos_x = data.original.mpi_pos_x;
			window.addPointViewModel.point.mpi_pos_y = data.original.mpi_pos_y;
			window.addPointViewModel.point.mpi_pos_z = data.original.mpi_pos_z;
			window.addPointViewModel.point.mpi_rot_y = data.original.mpi_rot_y;
			window.addPointViewModel.point.mpi_rltn_model_name = data.original.mpi_rltn_model_name;
	
			$('#addPointPanel').css({
				'left': ev.x,
				'top': ev.y + 20,
				'width':'500px',
				'min-height':'209px',
				'max-height':'311px'
			}).show();
			
			if(data.linkId){
				ls.setItem('editPointLinkId',data.linkId);			
			}
	
			window._mapPointData.curEditModelObj = pEvent.target;
			mapHandle.setTransForm(true, pEvent.target);			
		}

	  	function delPoint(){
			message.confirm('确定要删除该点位吗？',function(){
				hzDB.updateByParamKey({
					request:{
						sqlId:'delete_view_point',
						params:{id:data.id}
					},
					success:function(res){
						message.alert('删除点位成功');
						mapHandle.removeModelPointById(data.id);
						hzEvent.call('model.point.reload');
					}
				});			
			})
		}
	  	
	  	var sqlIds = {
			'1':'select_camera_tree',
	        '2':'select_door_byid',
	        '3':'select_talk_byid',
	        '6':'select_network_alrm_byid',
	        '15': 'select_rfid_base_for_map_detail',
	        '16': 'select_patrol_point_for_map_detail',
	        '98': 'select_prisoner_point_for_map_detail',
	        '97': 'select_ffe_detail_for_map_detail',
	        '95':'select_telephone_detail_for_map'//电话机详细信息
	    }
	
	  	/*
	  	 * 查询详情
	  	 * @param tid 执行编号
	  	 */
	  	function queryInfo (dvcId, type, ev, tid) {
	  		if(window.isPointRightClick) return;

	  		// 由于ajax请求闭包问题导致window.event对象改变，无法获取鼠标位置，所以这里在请求之前就获取鼠标位置
			var mouseX = window.event.offsetX;
			var mouseY = window.event.offsetY;

			hzDB.query({
				'request':{
					sqlId: sqlIds[type],
					whereId:1,
					params:[dvcId, user.cusNumber]
				},
				'success': function(res){
					if (window.isPointRightClick) return;
					if (queryTID != tid) return;

					if (res.length>0) {
						$('#pointInfoPanel').empty();
						if(type=='1'){
							showInfo('设备名称：'+res[0].name);
							showInfo('设备类型：摄像机');
							showInfo('安装位置：'+res[0].cbd_dvc_addrs);
							showInfo('设备状态：'+res[0].cbd_stts_indc_name);							
						}else if(type=='2'){
							showInfo('设备名称：'+res[0].dbd_name);
							showInfo('设备类型：门禁');
							showInfo('安装位置：'+res[0].dbd_dvc_addrs);
							showInfo('设备状态：'+res[0].dbd_stts_indc_name);
						}else if(type=='3'){
							showInfo('设备名称：'+res[0].tbd_name);
							showInfo('设备类型：对讲机');
							showInfo('安装位置：'+res[0].tbd_dvc_addrs);
							showInfo('设备状态：'+res[0].tbd_stts_indc_name);
						}else if(type=='6'){
							showInfo('设备名称：'+res[0].nbd_name);
							showInfo('设备类型：网络报警器');
							showInfo('安装位置：'+res[0].nbd_dvc_addrs);
							showInfo('设备状态：'+res[0].nbd_stts_indc_name);
						} else if(type=='15') {
							showInfo('设备名称：'+res[0].rbd_name);
							showInfo('设备类型：基站');
							showInfo('安装位置：'+res[0].rbd_dvc_addrs);
							showInfo('设备状态：'+res[0].stts_cn);
						} else if(type=='16') {
							showInfo('设备名称：'+res[0].ppi_name);
							showInfo('类型：巡更刷卡器');
							showInfo('安装位置：'+res[0].ppi_dvc_addrs);
							showInfo('设备状态：'+res[0].stts_cn);
						} else if(type=='98') {
							showInfo('罪犯名称：'+res[0].pbd_prsnr_name);
							showInfo('罪犯编号：' + res[0].pbd_other_id);
							showInfo('分管等级：'+res[0].pbd_sprt_mnge);
							showInfo('罪犯类型：'+res[0].type_cn);
						} else if(type=='97') {

							var ul = $('<ul style="float:left;"></ul>');
							ul.append('<li><span>设备编号：' + res[0].ffb_code + '</span></li>');
							ul.append('<li><span>设备类型：' + res[0].ffb_type + '</span></li>');
							ul.append('<li><span>安装位置：' + res[0].ffb_address + '</span></li>');
							ul.append('<li><span>资产条码：' + res[0].ffb_asset_code + '</span></li>');
							ul.append('<li><span style="float:left;">器材列表：</span><ul style="float:right;"></ul></li>');

							var cul = ul.find('>li >ul');

							for(var i = 0, len = res.length; i < len; i++) {
								cul.append('<li><span>' + res[i].ffdm_code + '</span></li>')
							}
							$('#pointInfoPanel').append(ul);
						} else if(type=='95'){
							showInfo('姓名：'+res[0].sab_name);
							showInfo('电话号码：'+res[0].sab_phone);
							showInfo('部门名称：'+res[0].sab_dept_name);
							showInfo('第三方编号：'+res[0].sab_other_id);
						}
						rltnDvcInfo = res;
						visiblePanel(true);
						movePanel(mouseX, mouseY);
					}
				}
			});
	  	}


	  	/*
	  	 * 移动面板
	  	 * @param mouseX 鼠标X位置（不传则自动获取window的鼠标位置）
	  	 * @param mouseY 鼠标Y位置（不传则自动获取window的鼠标位置）
	  	 */
	  	function movePanel (mouseX, mouseY) {
	  		if (hasVisible) {
	  			var width = $('#pointInfoPanel').outerWidth();
				var height = $('#pointInfoPanel').outerHeight();

				var top = null;
				var left = null;

				mouseX = mouseX || window.event.offsetX;
				mouseY = mouseY || window.event.offsetY;

				if (mouseY + height + 15 > window.innerHeight) {
					top = mouseY - height - 15;
				} else {
					top = mouseY + 10;
				}

				if (mouseX + width + 15 > window.innerWidth) {
					left = mouseX - width - 15;
				} else {
					left = mouseX + 10;
				}

				$('#pointInfoPanel').css({'left':left, 'top':top});
	  		}
	  	}

	  	function showInfo (val) {
	  		$('#pointInfoPanel').append('<div class="rm">' + val + '</div>');
	  	}

		function getCameraIdAndPlay(doorId){
			hzDB.query({
				request:{
					sqlId:'query_link_device_by_device',
					whereId:'0',
					params:{'cusNumber':user.cusNumber,'mainType':'2','dtlsType':'1','id':doorId}
				},
				success:function(data){
					if(!data || data.length <= 0){
						message.alert("数据查询有误，打开摄像机失败");
						return;
					}
					//打开摄像机
					hzVC.setLayout(1);
					hzVC.play(data[0].dld_dvc_id);
				}
			});
		}
	}

	try {
		$(document.head).append('<link rel="stylesheet" href="css/map/map.rightmenu.css" charset="utf-8">');
		$('#pointRightMenu').append(
			'<div class="rmenu" id="rightMenu" oncontextmenu="return false;">'+
				'<li  v-for="m in rightMenus" @click="clickMenu(m.method)">'+
					'<a>'+
						'<div class="info" v-if="m.text && m.icon">'+
							'<img v-bind:src="m.icon">'+
							'<div v-if="m.text" v-text="m.text"></div>'+
						'</div>'+
					'</a>'+
				'</li>'+
			'</div>');

		initCode();

	} catch (e) {
		console.error(e);
	}
});