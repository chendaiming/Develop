define(function(require){
	var user = require('frm/loginUser');
	var vue = require('vue');
	var ztree = require('ztree');
	var message =require('frm/message');
	var select = require('frm/select');
	var db =require('frm/hz.db');
	var hzdate = require('frm/datepicker');
	var mapHandle= require('hz/map/map.handle');
	var track = mapHandle.hzThree.Track;
	
	var routeMove = mapHandle.routeMove;
	
	
	
	var vm =new vue({
		el:'body',
		data:{
			search:'',
			isWatch:false,
			watchTxt:'开启监控',
			line:{
				pli_cus_number:user.cusNumber,
				pli_id:'',
				pli_name:'',
				pli_float_time:5,
				pli_crte_user_id:user.userId,
				pli_updt_user_id:user.userId
			},
			routePoints:[],//绘制轨迹 路径点位集合
			lines:[],
			points:[],
			records:[],
			isView:false,
			isPruse:false
		},
		/*watch:{
			search:function(val,oldVal){
				console.log(val);
				console.log(this.lines);
				var _lines=this.lines;
				var newLines=[];
				for(var i = 0;i<_lines.length;i++){
					if(_lines[i].pli_name.indexOf(val)>=0){
						newLines.push(_lines[i]);
					}
				}
				console.log(newLines);
			}
		},*/
		methods:{
			select:function(item){
				if(item.selected =='true'){
					item.selected = 'false';
					reset();
					vm.routePoints=[];
					routeMove.stopMove();
					routeMove.clearRoute();
				}else{
					clearSelect();
					item.selected = 'true';
					this.line.pli_id = item.pli_id;
					this.line.pli_name = item.pli_name;
					this.line.pli_float_time = item.pli_float_time;
					routeMove.enabledEdit();
					loadLineRlans(item.pli_id);
				}
			},
			addPoint:function(){
				this.points.push({
					plr_cus_number:user.cusNumber,
					plr_line_id:'',
					plr_point_id:'',
					plr_plan_time:'',
					plr_seq:0
				});
			},
			save:function(){
				saveLine();
			},
			add:function(){reset();},
			delLine:function(){
				delLine();
			},
			reset:function(){
				clearSelect();
				reset();
			},
			watch:function(){
				if(this.isWatch){
					this.isWatch = false;
					this.watchTxt = '开启监控'					
				}else{
					this.isWatch = true;
					this.watchTxt = '取消监控';
					clearSelect();
					reset();
				}
			},
			preview:function(){
				startTrackPath();
			},
			pruseTrackPath:function(){
				this.isPruse=!this.isPruse;
				routeMove.pauseMove();
			},
			stopTrackPath:function(){
				this.isView=false;
				this.isPruse = false;
				routeMove.stopMove();
			}
		}
	});
	
	function delLine(){
		message.confirm('确定要删除该线路吗？',function(){
			db.update({
				request:[{
					sqlId:'delete_patrol_line',
					params:[user.cusNumber,vm.line.pli_id]
				}],
				success:function(){
					message.alert('删除成功');
					loadPatrolLines();
					reset();
					//vm.routePoints=[];
				}
			});
		});
	}
	
	function saveLine(){
		if(!vm.line.pli_name.trim()){
			message.alert('请填写线路名称');
			return;
		}
		if(vm.line.pli_name.trim().length>10){
			message.alert('路线名称过长');
			return;
		}
		if(!vm.line.pli_float_time){
			message.alert('请填写巡更可浮动时间');
			return;
		}
		if(vm.points.length==0){
			message.alert('请至少添加一条巡更点');
			return;
		}
		for(var i=0;i<vm.points.length;i++){
			if(!vm.points[i].plr_point_id){
				message.alert('请选择巡更点地点');
				return;
			}
			if(!vm.points[i].plr_plan_time){
				message.alert('请选择巡更时间');
				return;
			}
		}
		/*if(!vm.points.plr_point_id){
			message.alert('请选择巡更点地点');
			return;
		}*/
		
		var sqlId = !vm.line.pli_id ? 'insert_patrol_line' : 'update_patrol_line';
		db.updateByParamKey({
			request:[{
				sqlId:sqlId,
				params:vm.line
			}],
			success:function(data){
				var seqId = !vm.line.pli_id ? data.data[0].seqList[0] : vm.line.pli_id;
				var pos = [];
				for(var i=0;i<vm.points.length;i++){
					pos.push({
						plr_cus_number:user.cusNumber,
						plr_line_id:seqId,
						plr_point_id:vm.points[i].plr_point_id,
						plr_plan_time:vm.points[i].plr_plan_time,
						plr_seq:i
					});
				}
				var routeLists = routeMove.getRoute();
				if(routeLists.length>1){
					for(var i=0;i<routeLists.length;i++){
						vm.routePoints.push({
							rpd_cus_number:user.cusNumber,
							rpd_route_id:seqId,
							rpd_pos_x:routeLists[i].x,
							rpd_pos_y:routeLists[i].y,
							rpd_pos_z:routeLists[i].z,
							rpd_seq:i
						});
					}
					db.update({
						request:[{
							sqlId:'delete_route_point',
							params:[seqId]
						}],
						success:function(){
							db.updateByParamKey({
								request:[{
									sqlId:'insert_route_point',
									params:vm.routePoints
								}],
								success:function(){
									routeMove.disabledEdit();
								}
							});
						}
					});
				}
				db.update({
					request:[{
						sqlId:'delete_line_rltn',
						params:[seqId]
					}],
					success:function(){
						db.updateByParamKey({
							request:[{
								sqlId:'insert_line_rltn',
								params:pos
							}],
							success:function(){
								message.alert('保存成功');
								loadPatrolLines();
								reset();
							}
						});
					}
				});
			}
		});
	}
	
	function loadPatrolLines(){
		db.query({
			request:{
				sqlId:'select_patrol_line',
				whereId:0,
				params:[user.cusNumber]
			},
			success:function(data){
				vm.lines = data;
			}
		});
	}
	function loadLineRlans(lineId){
		db.query({
			async:false,
			request:{
				sqlId:'select_patrol_line_rltn',
				whereId:0,
				params:[user.cusNumber,lineId]
			},
			success:function(data){
				vm.points = data;
			}
		});
		db.query({
			async:false,
			request:{
				sqlId:'select_patrol_line_record',
				whereId:0,
				params:[user.cusNumber,lineId]
			},
			success:function(data){
				vm.records = data;
			}
		});
		db.query({
			request:{
				sqlId:'select_route_points',
				params:[user.cusNumber,lineId]
			},
			success:function(data){
				vm.routePoints = data;
			}
		});
	}
	
	loadPatrolLines();
	initStartTrack();
	
	function reset(){
		vm.line = {
			pli_cus_number:user.cusNumber,
			pli_id:'',
			pli_name:'',
			pli_float_time:5,
			pli_crte_user_id:user.userId,
			pli_updt_user_id:user.userId
		}
		vm.points=[];
		routeMove.clearRoute();
	}
	
	function clearSelect(){
		for(var i=0;i<vm.lines.length;i++){
			vm.lines[i].selected = false;
		}
	}
	//初始化绘制路径参数
  	function initStartTrack(){
  		track.defalutY = 5;
  		track.walkSpeed = 20;
	  	track.cameraDis = 800;
	  	track.cameraHeight = 2000;
	  	track.setIsEditRoute(true);
	  	console.log('开启轨迹绘制成功');
  	}
  	function startTrackPath(){
  		var pointList = [];
  		if(vm.routePoints.length > 1){
  			for(var i=0;i<vm.routePoints.length;i++){
  				pointList.push({
  					x:parseFloat(vm.routePoints[i].x),
  					y:parseFloat(vm.routePoints[i].y),
  					z:parseFloat(vm.routePoints[i].z)
  				});
  			}
  		}
  		
  		if(!$(".lineList").parent().hasClass("selected")){
  			message.alert('请先选择巡更路线');	  	
  			return;
  		}
  		
  		var list = routeMove.getRoute();
  		/*if(list.length > 1){
  			pointList = list;			
  		}*/
		if(pointList.length==0){
			message.alert('请先绘制轨迹');	  				
			return;
		}
		if(pointList.length==1){
			message.alert('点位不够无法形成轨迹路径');		
			return;
		}
		/*var test=$(".layui-layer-min", window.top.document);
		test.trigger('click');*/
		//routeMove.stopMove();
		routeMove.onMoveStop(function () {
			
	  		vm.isView=false;
			vm.isPruse = false;

			$('#centerX, #centerY').show();
		},mapHandle.hzThree.HzEvent.TRACK_OVER);

		_getModel(function (model) {
			$('#centerX, #centerY').hide();
			vm.isView = true;
	  		track.setTrackParam({
				viewType: 3,
				model: model 
			});
	  		track.setTrackPath(pointList,1);
		});
  	}
  	
  	
//  	routeMove.onMoveStop(function () {
//  		vm.isView=false;
//		vm.isPruse = false;
//
//		$('#centerX, #centerY').show();
//	},mapHandle.hzThree.HzEvent.TRACK_OVER);
//  	
	  routeMove.offMoveStop(mapHandle.hzThree.HzEvent.TRACK_OVER)

	/*
	 * 获取Track对象
	 */
	var _modelObj = null;
	function _getModel (callback) {
		var self = this;
		if (!_modelObj) {
			mapHandle.addModel({
				'modelName': 'people_man',
				'path': basePath + 'models/people/',
				'objName': 'people_man.obj',
				'mtlName': 'people_man.mtl',
				'bornType': 'born_addModel',
				'objType': 'people_man',
				'position': {
					x: 0,
					y: 0,
					z: 0
				}
			}, function (obj) {
				obj.scale.x = 5;
				obj.scale.y = 5;
				obj.scale.z = 5;
				//obj.children[0].rotation.y = Math.PI * 0.5;

				callback(_modelObj = obj);
			});
		} else {
			callback(_modelObj);
		}
	}
	window.top.webmessage.off('PATROL001','patrol'); //先取消订阅
	window.top.webmessage.on('PATROL001','patrol',callbacks);
	function callbacks(patrol){
		console.log(patrol);
		if(vm.isWatch && patrol.msg){
			vm.records.push(JSON.parse(patrol.msg));
		}
	}
});