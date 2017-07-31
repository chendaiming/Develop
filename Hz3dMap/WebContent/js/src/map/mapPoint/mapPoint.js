define(function(require){
	var vue = require('vue'),
		select = require('frm/select'),
		user = require('frm/loginUser'),
		db = require('frm/hz.db'),
		message = require('frm/message'),
		ls = require('frm/localStorage'),
		hzThree = require('frm/hz.three'),
		mapHandle = require('hz/map/map.handle');

	var hzEvent = require('frm/hz.event');

	var _pointId = '20161209';

	// 地图点位数据
	window._mapPointData = {
		curEditModelObj: null,
		curDoorModelObj: null
	};

	var pvm = window.addPointViewModel = new vue({
		el:'#addpoint',
		data:{
			isShowFine:false,
			isMore:false,
			goQueryPointIsExist:true,
			sqlId:{
				'1':'select_camera_ztree',
				'2':'select_door_ztree',
				'3':'select_talk_ztree',
				'6':'select_networkalarm_ztree',
				'15':'select_rfid_ztree_for_map_point',
				'16':'select_patrol_ztree_for_map_point',
				'17':'select_wireless_alarm_ztree_for_map_point',
				'98': 'select_prisoner_ztree_for_map_point',
				'97': 'select_fire_fighting_box_for_map_point',	// 消防
				'95':'select_telephone_for_map_point'//电话机
			},
			updateRoomSqlId:{
				'1':'update_camera_roomid',
				'2':'update_door_roomid',
				'3':'update_talk_roomid',
				'6':'update_network_roomid',
				'15':'update_rfid_roomid',
				'17': 'update_wireless_alarm_roomid'
			},
			linkDevice:{},
			showLink:true,
			point:{
				mpi_cus_number:user.cusNumber,
				mpi_point_id:'',
				mpi_view_id:'',
				mpi_link_id:'',//关联编号
				mpi_point_name:'',
				mpi_link_type:'1',
				mpi_point_flag:'0',
				mpi_show_type:'1',
				mpi_pos_x:'',
				mpi_pos_y:'',
				mpi_pos_z:'',
				mpi_rot_x:'',
				mpi_rot_y:'',
				mpi_rot_z:'',
				mpi_view_pos_x:'',
				mpi_view_pos_y:'',
				mpi_view_pos_z:'',
				mpi_view_rot_x:'',
				mpi_view_rot_y:'',
				mpi_view_rot_z:'',
				mpi_view_tar_x:'',
				mpi_view_tar_y:'',
				mpi_view_tar_z:'',
				x:2,
				y:2,
				z:2,
				rotY:10,
				mpi_create_uid:user.userId,
				mpi_update_uid:user.userId,
				mpi_rltn_model_name:'',
				mpi_model_type:'',
				roomName:''
			}
		},
		methods:{
			close:function(){
				if(!this.point.mpi_point_id){
					mapHandle.removeModelPointById(_pointId);					
				}
				mapHandle.setTransForm(false);
				$('#addPointPanel').hide()
			},
			showMore:function(){this.isMore = !this.isMore},
			save:function(){savePoint()},
//			addPos:function(tag,d){
//				this.point[tag] = parseFloat(this.point[tag]) + parseFloat(this.point[d]);
//				var pointId = !this.point.mpi_point_id ? _pointId : this.point.mpi_point_id;
//				setPointPosition(pointId,this.point.mpi_link_id,this.point.mpi_link_type,this.point.mpi_point_name);
//			},
//			reducePos:function(tag,d){
//				this.point[tag] = parseFloat(this.point[tag]) - parseFloat(this.point[d]);
//				var pointId = !this.point.mpi_point_id ? _pointId : this.point.mpi_point_id;
//				setPointPosition(pointId,this.point.mpi_link_id,this.point.mpi_link_type,this.point.mpi_point_name);
//			}
		},
		watch:{
			'linkDevice.devicetype':function(){
				mapHandle.removeModelPointById(_pointId);
				mapHandle.setTransForm(false);
				setPointPosition(_pointId, pvm.point.mpi_link_id, pvm.point.mpi_link_type, pvm.point.mpi_point_name);
			}
		}
	});


	function setPointPosition (id, linkId, type, name) {
		mapHandle.addModelPoint({
			id:id,
			linkId:linkId,
			type:type,
			name:name,
			modelType: pvm.linkDevice.devicetype,
			original: pvm.point,
			position: {x:pvm.point.mpi_pos_x, y:pvm.point.mpi_pos_y, z:pvm.point.mpi_pos_z},
			rotation: {y:pvm.point.mpi_rot_y, x:pvm.point.mpi_rot_x, z:pvm.point.mpi_rot_z}
		}, null, function (modelObj) {
			_mapPointData.curEditModelObj = modelObj;
			modelObj.showYArrow(true);
			mapHandle.setTransForm(true, modelObj, function () {
				var room = mapHandle.hzThree.getRoomBox(modelObj.position, 100);
				if(room && mapHandle.hasRoomFlag(room.name)){
					pvm.point.roomName = room.name;					
				}
			});

			var roomObj = mapHandle.hzThree.getRoomBox(modelObj.position, 100);
			if(roomObj && mapHandle.hasRoomFlag(roomObj.name)){
				pvm.point.roomName = roomObj.name;					
			}
		});
	}


	function savePoint(){
		if(!pvm.point.mpi_link_id){
			message.alert('请选择关联设备');
			return ;
		}
		if($.trim(pvm.point.mpi_point_name).length==0){
			message.alert('请填写点位名称');
			return ;
		}
		if(pvm.point.mpi_link_type=='2' && !pvm.point.mpi_rltn_model_name){
			message.alert('请在地图上ALT+鼠标左键拾取一个关联门禁模型');
			//return ;
		}
		if(!pvm.point.mpi_point_id){
			queryExist();
		}else{
			var editPointLinkId = ls.getItem('editPointLinkId');
			if(editPointLinkId && editPointLinkId!=pvm.point.mpi_link_id){
				queryExist();
			}else{
				goSave();				
			}
		}
	}
	
	function queryExist(){
		db.query({
			request:{
				sqlId:'select_view_point_byid',
				params:[user.cusNumber,pvm.point.mpi_link_id, pvm.point.mpi_link_type]
			},
			success:function(res){
				if(res.length>0){
					message.alert('此设备点位已被添加');
					pvm.point.mpi_link_id = '';
					pvm.point.mpi_point_name='';
					return ;
				}
				goSave();
			}
		})
	}
	
	function goSave(){
		var sqlId = !pvm.point.mpi_point_id ? 'insert_view_point' : 'update_view_point';
		
		pvm.point.mpi_view_id = $('#vid').val();
		var viewPointPosition = mapHandle.getViewPoint();
		pvm.point.mpi_view_pos_x = viewPointPosition.posX;
		pvm.point.mpi_view_pos_y = viewPointPosition.posY;
		pvm.point.mpi_view_pos_z = viewPointPosition.posZ;
		pvm.point.mpi_view_rot_x = viewPointPosition.rotX;
		pvm.point.mpi_view_rot_y = viewPointPosition.rotY;
		pvm.point.mpi_view_rot_z = viewPointPosition.rotZ;
		pvm.point.mpi_view_tar_x = viewPointPosition.tarX;
		pvm.point.mpi_view_tar_y = viewPointPosition.tarY;
		pvm.point.mpi_view_tar_z = viewPointPosition.tarZ;
		pvm.point.mpi_model_type = pvm.linkDevice.devicetype;

		var position = _mapPointData.curEditModelObj.position;
		var rotation = _mapPointData.curEditModelObj.rotation;


		pvm.point.mpi_pos_x = position.x;
		pvm.point.mpi_pos_y = position.y;
		pvm.point.mpi_pos_z = position.z;

		pvm.point.mpi_rot_x = rotation.x;
		pvm.point.mpi_rot_y = rotation.y;
		pvm.point.mpi_rot_z = rotation.z;

		db.updateByParamKey({
			request: [{
				sqlId:sqlId,
				params:pvm.point
			}],
			success: function (data) {
				if(sqlId == 'insert_view_point'){
					pvm.point.mpi_point_id = data.data[0].seqList[0];
				}
				if(pvm.point.roomName){
					var updateRoomIdSqlId = pvm.updateRoomSqlId[pvm.point.mpi_link_type];
					db.updateByParamKey({
						request:[{
							sqlId:updateRoomIdSqlId,
							params:{
								cusNum:user.cusNumber,
								roomName:pvm.point.roomName,
								linkId:pvm.point.mpi_link_id
							}
						}],
						success:function(res){
							console.log(res);
						}
					});					
				}
				saveSuccess();
			}
		});
	}
	
	function saveSuccess(){
		message.alert('保存成功');
		$('#addPointPanel').hide();
		
		mapHandle.removeModelPointById(_pointId);
		mapHandle.setTransForm(false);

		if (_mapPointData.curDoorModelObj) {
			_mapPointData.curDoorModelObj.instacne.setBorderShow(false);
			_mapPointData.curDoorModelObj = null;
		}

		setPointPosition(pvm.point.mpi_point_id,pvm.point.mpi_link_id,pvm.point.mpi_link_type,pvm.point.mpi_point_name);

		hzEvent.call('model.point.reload');
		reset();
	}

	function reset(){
		pvm.point = {
			mpi_cus_number:user.cusNumber,
			mpi_view_id:$('#vid').val(),
			mpi_view_name:$('#vname').val(),
			mpi_link_id:'',//关联编号
			mpi_point_id:'',
			mpi_link_name:'',
			mpi_point_name:'',
			mpi_link_type:pvm.point.mpi_link_type,
			mpi_point_flag:'0',
			mpi_show_type:'1',
			mpi_pos_x:'',
			mpi_pos_y:'',
			mpi_pos_z:'',
			x:2,
			y:2,
			z:2,
			rotY:10,
			mpi_rot_x:'',
			mpi_rot_y:'',
			mpi_rot_z:'',
			mpi_create_uid:user.userId,
			mpi_update_uid:user.userId,
			mpi_rltn_model_name:'',
			mpi_model_type:'',
			roomName:''
		}
	}
	function initEvent(){
		$('input').on('keyup',function(e){
			if(e.keyCode == 13){
				savePoint();
			}
		});
		hzThree.on(hzThree.MouseEvent.MOUSE_DOWN,function(event){
			hideRightMenu();
		});
		$('#pointRightMenu').on('mousewheel',function(){
			hideRightMenu();
		});
		hzThree.on(hzThree.MouseEvent.MOUSE_WHEEL, function (event) {
			hideRightMenu();
		});
		hzThree.on(hzThree.HzEvent.PICK_UP_POINT, function (event) {
			if (window.top.hasChosePointType) {
				window.top.isPointRightClick = false;

				if(window.event.ctrlKey){
					if(!$('#vid').val()){
						message.alert('请先选择一个视角');
						return ; 
					}

					pvm.point.mpi_link_id = '';
					pvm.point.mpi_point_name = '';
					pvm.point.mpi_point_id = '';
					pvm.point.mpi_pos_x = event.data.x;
					pvm.point.mpi_pos_y = event.data.y;
					pvm.point.mpi_pos_z = event.data.z;

					setPointPosition(_pointId, pvm.point.mpi_link_id, pvm.point.mpi_link_type, pvm.point.mpi_point_name);

					$('#addPointPanel').css({
						'left': window.event.clientX,
						'top': window.event.clientY + 20,
						'width':'500px',
						'min-height':'209px',
						'max-height':'311px'
					}).show();
				}			
			}
		});

		hzThree.on(hzThree.HzEvent.PICK_UP_MODEL,function(event){
			if (window.top.hasChosePointType) {

				if(window.event.altKey){
					if (event.data && event.data.type == 'Door') {
						event.data.instacne.setBorderShow(true);

						_mapPointData.curDoorModelObj = event.data;
						pvm.point.mpi_rltn_model_name = event.data.name;

						if(pvm.point.mpi_rltn_model_name){
							message.alert("已经拾取关联门禁");
						}				
					}
				}

				//添加点位的同时获取点击的模型是否为房间
				if(window.event.ctrlKey){
					var roomName = event.data.name;
					if (mapHandle.hasRoomFlag(roomName)){
						pvm.point.roomName = roomName;
					}else{
						pvm.point.roomName='';
					}
				}
			}
		});
	}

	function hideRightMenu () {
		window.isPointRightClick = false;
		$('#rightMenu').css({'display':'hidden','visibility':'hidden'})
			.find('li').css({
				'transform':'rotate(60deg) skew(30deg)',
				'-webkit-transform':'rotate(60deg) skew(30deg)',
				'-moz-transform':'rotate(60deg) skew(30deg)'
			}
		);
  	}

	try {
		initEvent();
	} catch (e) {
		console.error(e);
	}
});