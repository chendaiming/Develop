define(['jquery','vue','frm/hz.db',"frm/message","frm/model","frm/loginUser","hz/map/map.handle","frm/hz.videoclient", 'frm/hz.event'],function($,tpl,db,tip,modelData,login,hzMap,video, hzEvent){
	//窗口设置
	var pl=window.frameElement.parentNode.parentNode;//包含iframe的div
	
	setTimeout(function(){pl.classList.add("flip")},400);

	var cameraList=[],patrlTimer,accept=false,timed = 3;//巡视过程中的摄像机

	//地图api
	var map = hzMap.routePatrol;
	var backflag = true; //返回标志
	var layout = 1;// 布局
	var helpLine = window.top.PATROL3D_HELP_LINE;// 三维巡视时的点位辅助线
	var MAXSPEED = 500;	// 设置最大速度
	var MINSPEED = 1;	// 设置最小速度
	var STOPTIME = 3;	// 默认暂停时间

	//创建数据模型
	var model=new tpl({
		el:"#modelcontainer",
		data:{
			patrol:[],//预案列表
			camera:[],//摄像机列表
			name:'',//线路名称
			route:[],//线路坐标
			routeid:'',//线路id
			type:'',//设备类型
			linkdevice:[],//线路关联的设备
			view:{
				height:'',
				speed:'',
				radius:'',
				stoptime: timed,
				disabled:false
			},

			hasUpdateSpeed: false,	// 是否正在调整速度
			updateSpeedTID: null	// 自动调整速度的定时器ID
		},
		methods: {
			stop:function(e){//暂停
				clearTimeout(patrlTimer);
				if(!e.target.classList.contains("play")){//暂停
					accept = false;
					editTime = true;
					map.pausePatrol();
					e.target.classList.add("play");
				}else {//继续
					clearTimeout(timeShow);
					map.setParam('walkSpeed', model.view.speed);
					map.startPatrol();
					accept = true;
					this.view.disabled = false;
					this.view.stoptime = timed;
					e.target.classList.remove("play");
				}
			},
			over:function(e){//结束
				accept=true;
				clearTimeout(patrlTimer);
				clearTimeout(timeShow);
				model.view.disabled=false;
				model.view.stoptime=timed;
				
				map.stopPatrol();
				e.target.previousElementSibling.classList.remove("play");
			},

			/*
			 * 按下调整速度
			 */
			updateSpeed: function (flag) {
				if(this.view.disabled) return;

				// 调整速度时锁定状态
				this.hasUpdateSpeed = true;

				// 按下时先调整一次速度
				this.changeSpeed(flag);

				// 长按0.5秒后连续调整速度值（默认速度时1秒20次）
				this.updateSpeedTID = setTimeout(function () {
					model.updateSpeedTID = setInterval(function (flag){
						model.changeSpeed(flag);
					}, 50, flag);
				}, 500);

				map.pausePatrol();
			},

			/*
			 * 弹起恢复巡视
			 */
			restorePatrol: function (flag) {
				// 清除长按定时任务
				clearTimeout(this.updateSpeedTID);
				clearInterval(this.updateSpeedTID);

				if (this.view.disabled) return;

				// 释放锁定状态
				this.hasUpdateSpeed = false;

				// 设置速度并开始巡视
				map.setParam('walkSpeed', model.view.speed);

				// 如果调整速度时是巡视状态，则调整完之后继续
				if (accept) {
					map.startPatrol();				
				}
			},

			/*
			 * 改变巡视速度
			 */
			changeSpeed: function (flag) {
				// 转换int之后再进行加减
				this.view.speed *= 1;
				this.view.speed += flag;
				if (this.view.speed > MAXSPEED) {
					this.view.speed = MAXSPEED;
				} else if (this.view.speed < MINSPEED) {
					this.view.speed = MINSPEED;
				}
			}
		}
	});

	for(var list=document.getElementById("mainopr").children, i=0;i<4;i++){
		
		if(list.length){
			if(list[0].classList&&list[0].classList.contains("speedcontrol")){
				var temp=list[0].querySelectorAll("input");
				//速度
				temp[0].oninput = function(e){
					if(isNaN(this.value)){
						model.view.speed = this.value = MINSPEED;
					} else {
						if (this.value > MAXSPEED) {
							this.value = MAXSPEED;
						} else if (this.value < MINSPEED) {
							this.value = MINSPEED;
						}
						model.view.speed = Math.abs(this.value);
					}
				}
				//暂停时间
				temp[1].oninput = function(e){
					this.value = isNaN(this.value)? STOPTIME : Math.abs(this.value);
					if (editTime) {
						timed = this.value;
					}
				}
			}
			//每次追加一个
			pl.appendChild(list[0]);
		}
		
	}

	//初始化列表线路
	db.query({
		request:{
			sqlId:'select_patrol_list',
			params:{"cus":login.cusNumber,'user':login.userId},//省局用户要查出下面的所有机构号
		},success:function(data){
			//console.log(data);
			model.patrol=data;
			video.setLayout(1);
		}
	});

	//巡视的时候搜索
	map.onPatrolMove(function(data){
		if (model.hasUpdateSpeed) return;
		if (!accept) return; //接收事件)
		var list = getCameras(data.pos, data.dis);//
		if (list.length) {//如果设备存在则暂停巡视 启用客户端
			//p.children[4].textContent='跳过';
			model.view.disabled = true;
			editTime = false;

			clearTimeout(patrlTimer);
			clearTimeout(timeShow);

			map.pausePatrol();

			if (layout != list.length) {
				video.setLayout(layout = list.length);
			}

			video.play(list);
			setCarmer(list);

			patrlTimer = setTimeout(function(){
				startPatrol();
			}, model.view.stoptime * 1000);//暂停
		}
	},"move_play_video_ck");

	//巡视结束
	map.onPatrolStop(function(){
		accept && patrolOver();
	},'move_play_over_stop');

	//设置摄像机状态
	var camerasShow=pl.children[6];
	
	function setCarmer(list){
		var temp;
		var child=camerasShow.children;
		for(var i=0,len=child.length;i<len;i++){
			child[i].style.animation='';
		}
		for(var i=0,len=list.length;i<len;i++){
			temp=camerasShow.querySelector("li[data-rel='"+list[i]+"']");
			temp&&(temp.style.animation='videoplay 1s infinite',(temp.offsetLeft+temp.clientWidth>pl.clientWidth)&&(camerasShow.style.left=pl.clientWidth/2-temp.offsetLeft+"px"));
		}
		if (list.length) {
			//清除定时器
			model.view.stoptime = timed;
			settime();
		}
	}

	//倒计时
	var timeShow,editTime=false;
	function settime(){
		editTime = false;
		model.view.disabled = true;

		if (model.view.stoptime <= 1) {
			model.view.stoptime = timed;
			model.view.disabled = false;
			editTime = true;
			pl.children[4].classList.remove("play");
		} else {
			model.view.stoptime--;
			timeShow = setTimeout(settime, 1000);
			pl.children[4].classList.add("play");
		}
	}

	//获取行进线路中的摄像机
	function  getCamera(pos,f){
		var temp=[];
		for(var i=0;i<cameraList.length;i++){
			if((Math.abs(cameraList[i].x-pos.x)<f)&&(Math.abs(cameraList[i].y+180-pos.y)<f)&&(Math.abs(cameraList[i].z-pos.z)<f)){
				temp.push(cameraList.splice(i,1)[0]['device']);//摄像机id
				i--;
			}
		}
		return temp;
	}
	//获取行进线路中的摄像机 ----改版 f上下
	function getCameras(pos,f){
		var temp=[];
		
		var x,y,z,camera;
		for(var i=0; i<cameraList.length; i++){
			camera=cameraList[i];
			
			x=camera.x-pos.x;
			y=camera.y-pos.y;
			z=camera.z-pos.z;
			
			if(( x*x+y*y + z*z)<=f){
				temp.push(cameraList.splice(i,1)[0]['device']);//摄像机id
				i--;
			}
		}
		return temp;
	}

	/*---按钮操作---*/
	var edit=$("#editmap");
	//正面操作按钮
	var cutentLi,dbclick=false,timer;//当前选中的线路
	
	var container;
	
	//单击事件翻转双击巡视
	var container=$("#modelcontainer").on("click","li",function(){
		cutentLi=this;
		model.routeid=this.dataset.route;
		model.view.speed=this.dataset.speed;
		model.view.height=this.dataset.height;
		model.view.radius=this.dataset.radius;
		
		model.view.stoptime = timed;
		if(dbclick){
			clearTimeout(timer);
			dbclick=false;
			db.query({
				request:{//查询摄像机
					sqlId:'select_device_query',
					params:{'routid':model.routeid}
				},success:function(camera){
					
					var carmers='';
					
					for(var i=0,len=camera.length;i<len;i++){
						carmers+='<li data-rel='+camera[i].device+'>'+camera[i].name+'</li>';
					}
					camerasShow.innerHTML=carmers.length?carmers:'暂未关联设备';
					db.query({//查询点位
						request:{
							sqlId:'select_pos_query',
							params:{'routid':model.routeid}
						},success:function(data){
							model.route=data;//线路的坐标点
							if(data.length==0){
								tip.alert("<p style='color:#282828;'>巡视线路未标注</p>");
								return;
							}
							pl.style.animationName='slidup';
							model.linkdevice=camera; //当前线路已经关联的设备
							cameraList=camera.slice(0,camera.length);
							map.setEditStatus(false);
							startPatrol(data,{"walkSpeed":parseInt(model.view.speed), "defalutY":parseInt(model.view.height)});
						}
					});
				}
			});
		}else{
			timer=setTimeout(function(){
				dbclick=false
				db.query({
					request:{//查询摄像机
						sqlId:'select_device_query',
						params:{'routid':model.routeid}
					},success:function(camera){
						db.query({//查询点位
							request:{
								sqlId:'select_pos_query',
								params:{'routid':model.routeid}
							},success:function(data){
								var carmers='';
								for(var i=0,len=camera.length;i<len;i++){
									carmers+='<li data-rel='+camera[i].device+'>'+camera[i].name+'</li>';
								}
								camerasShow.innerHTML=carmers.length?carmers:'暂未关联设备';
								cameraList=model.linkdevice=camera; //当前线路已经关联的设备
								model.route=data;//线路的坐标点
								model.name=name;//线路名称
								model.view.speed = 100;
								model.view.stoptime = timed;
							}
						});
					}
				});
			},240);
			dbclick=true;
		}
		container.find("li.select").removeClass("select");
		cutentLi.classList.toggle("select");
	});


	//开始巡视
	$("#modelcontainer").on("click","#oprs",function(){
		model.view.speed=100;
		model.view.stoptime = timed;
		if(!container.find("li.select").length>0){
			tip.alert("<p style='color:#282828;'>请选择线路</p>");
			return;
		}
		if(model.route.length==0){
			tip.alert("<p style='color:#282828;'>巡视线路未标注</p>");
			return;
		}

		cameraList = model.linkdevice.slice(0,model.linkdevice.length);
		setCarmer([]);
		map.setEditStatus(false);

		startPatrol(model.route, {
			'walkSpeed': parseInt(model.view.speed), 
			'defalutY': parseInt(model.view.height)
		});
		pl.style.animationName='slidup';


		// 判断显示三维巡视时点位的辅助线
		if (helpLine !== false) {
			queryLinePoints(model.routeid);
		}

		// 显示三维巡视的点位
		queryModelPoint(model.routeid);
	});


	/*
	 * 
	 */
	function startPatrol(points, params) {
		accept=true;
		map.startPatrol(points, params);
		hzEvent.emit('3d.patrol.startPatrol');
	}
	//巡视结束
	function patrolOver(){
		camerasShow.style.display='none';
		var left=pl.offsetLeft+pl.clientWidth/2;
		pl.style.animationName='sliddown';
		pl.classList.remove("mapopr","transa");
		pl.style.left=left-pl.children[0].clientWidth/2+"px";
		(pl.style.transform=='rotateY(0deg)'||pl.style.transform=='')&&(map.setEditStatus(false),map.clearRoute(),pl.children[2].style.display='');//关闭最大化最小化
		hzEvent.emit('3d.patrol.patrolOver');
	}
	//旋转终止
	pl.addEventListener("animationend",function(e){
		if(e.animationName=='slidup'){
			camerasShow.style.display='';
			pl.classList.add("mapopr");
			accept=true;//接收事件
			pl.style.left=(top.innerWidth-pl.clientWidth)/2+"px";
		}else{
			accept=false;
			camerasShow.style.left='0px';
		}
	});
	var t=document.querySelector("#selfSearch");
	//添加自定义弹窗
	pl.appendChild(t);




	/*
	 * 根据线路ID查询三维巡视路线配置的模型点位数据
	 * @param routeId 三维巡视路线编号
	 */
	function queryModelPoint (routeId) {
		// 加载指定视角点位
		hzMap.loadModelPoints({
			sqlId: 'select_model_point_for_map_handle_by_auth',
			whereId: 3,
			params: {
				'cusNumber': login.cusNumber,
				'userId': login.userId,
				'routeId': routeId
			}
		}, function (array) {
			// TODO: 成功处理
		}, function (code, desc) {
			// TODO: 失败处理			
		})
	}

	function queryLinePoints (routeId) {
		db.query({
			'request': {
				sqlId: 'query_route_linkdvc_points',
				whereId: '0',
				params: [login.cusNumber, routeId]
			},
			'success': function (array) {
				if (array) {
					var list = [];
					var data = null;

					// 格式化数据：[{"id":"", "color": 0x00FFFF, points:[{"x":0,"y":0,"z":0}, ...]}, ...]
					for(var i = 0, len = array.length; i < len; i++) {
						data = array[i];
						list.push({
							'id': data.id,
							'color': 0x00FFFF,
							'points': [
								{'x': data.x1, 'y': data.y1, 'z': data.z1},
								{'x': data.x2, 'y': data.y2, 'z': data.z2}
							]
						});
					}

					// 显示辅助线
					if (list.length){
						map.hzThree.Patrol3D.setHelpLine(list);
					}
				}
			},
			'error': function (code, desc) {
				console.error('获取三维巡视线路点位辅助线坐标异常：' + code + desc);
			}
		})
	}
}); 