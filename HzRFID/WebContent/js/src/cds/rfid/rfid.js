define(["echarts","vue","frm/loginUser","frm/hz.db","frm/message","frm/treeSelect","frm/model","frm/hz.videoclient","hz/map/map.handle",'frm/localStorage',"frm/datepicker"],
function(chart,tpl,login,db,tip,tree,modelUtil,video,mapHandle,ls,time){
	
	var utils = require('frm/hz.utils'); // 加载辅助模块
	var hzEvent = require('frm/hz.event');
	var tables=document.getElementById("tableshow");
	var backTime = 6;	//6秒后设置为回放
	var imgurl = basePath + 'css/image/zfpic.png';
	var param= window.top.searchPeopleParams || {};
	var prisonerId = param.id || '';
	var prisonerName = param.name || '';
	var linkType = 15;				// 关联类型：15是RFID设备

	//所有罪犯信息
	var prisonerList = [];

	delete window.top.searchPeopleParams;

	function getToday () {
		var nowDate = new Date();
		var today = nowDate.getFullYear() + '-' + fillDouble(nowDate.getMonth() + 1) + '-' + fillDouble(nowDate.getDate());
		return today;
	}



	var model=new tpl({
		el:'#record',
		data:{
			total:0,
			records:[],
			plc:'',
			toTodayData:[],			//今日超出缓存的数据库中的数据
			date: getToday(),
			prisoner: {
				'id':'',//数据库中存放的罪犯编号
				'prisonerid':'',//罪犯编号
				'name':'',//罪犯姓名
				'pid':'',//所属监区(编号)
				'pname':'',//监区名称
				'pbd_accstn':'',//罪名
				'pbd_sntn_term':'',//判处刑期
				'pbd_entry_prisoner_date':'',//入监日期
				'pbd_prsnr_stts':'',//罪犯状态
				'pbd_type_indc': '',
				'img_url':imgurl
			}
		},
		watch:{
			date:function(){
				if(model.date == getToday()){
					getRfidCacheData(model.prisoner.id);	//查询缓存
				}else{
					model.records = [];
					queryInfoList(1);		//查询数据
				}
			}
		},
		methods:{
			query:function(){
				if(!model.prisoner.id || model.prisoner.id.length < 0){
					tip.alert("请先选择查询条件");
				}else{
					//查询罪犯信息
					getprisonerInfoByid(model.prisoner.id);
					//查询rfid消息
					getRfidCacheData(model.prisoner.id);
				}
				model.$nextTick(function () {
					autoScrollTop();
			      })
			},
			player:function(ids,time, data){
				playback([data]);
			},
			queryTrack:function(){	//动态轨迹
				$('#tipPanel').show();
				db.query({
					request: {
						sqlId: 'select_prisoner_rfid_by_date_for_flowtrack',
						whereId: 0,
						orderId: 0,
						params: {
							cusNumber: login.cusNumber,
							monitorFlag: 1,
							peopleType: 2,
							peopleId: model.prisoner.id,
							date: model.date
						},
						minRow: 0,
						maxRow: 20
					},
					success: function (result) {
						if (result && result.data && result.data.length) {
							rfidTrackMove(result.data);
						} else {
							tip.alert('未获取到有效的活动轨迹!');
						}
					}
				});
			},
			cancelTrack: stopTrack
		}
	});



	var scrollFlag = false;		//日期切换不查询
	document.getElementById("scroll").onscroll=function(e){
		//滚动条高度
		var scroll=this.clientHeight*this.clientHeight/this.scrollHeight;
		//滚动条距离顶部高度
		var top = (this.clientHeight*this.scrollTop)/this.scrollHeight;
		//距离底部的高度
		var bottom = this.clientHeight-(scroll+top);
		//当天数据翻页
		if(model.date == getToday()){
			if(parseInt(top) == 0 && scrollFlag){
				if(model.total && model.total == model.toTodayData.length){
					tip.alert("数据已全部加载");
					return;
				}
				if(model.toTodayData.length){
					queryInfoList(parseInt(model.toTodayData.length/5)+1,true);
				}else{
					queryInfoList(1,true);
				}
			}
			scrollFlag = true;
		}else{
			if(parseInt(bottom) == 0 && scrollFlag){
				if(model.total == this.childElementCount){
					tip.alert("数据已全部加载");
					return;
				}
				this.childElementCount>=10 && queryInfoList(parseInt(this.childElementCount/10)+1);
			}
			scrollFlag = true;
		}

	};
	
	//查询信息列表
	function queryInfoList(pageindex, isCache){
		if(!model.date){
			return;
		}
		if(!model.prisoner.id){
			tip.alert("罪犯信息[ID有误]");
			return;
		}
		db.query({
			request:{
				sqlId:'select_prisoner_rfid_record',
				whereId: isCache ? 1 : 0,
				orderId: isCache ? 1 : 0,
				pageIndex:pageindex,
				pageSize:10,
				params:{
					"monitorTime": isCache ? model.records[0].time : model.date,
					"peopleId":model.prisoner.id
				}
			},
			success:function(data){
				model.total = data.count;
				//当日缓存数据添加
				if(isCache){
					model.toTodayData.concat(data.data);
					var d = [];
					model.records = d.concat(data.data,model.records);
				}else{
					model.records = model.records.concat(data.data);
				}

				showChart();
			},
			error:function(code,msg){
				tip.alert(msg);
			}
		})
	}
	
	
	var option = {
		    title : {
		        text: '区统计',
		        left:'left',
		        textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        },
		        x:'center'
		    },
		    tooltip:{
		    	 confine:true,
		    	  trigger: 'item',
		    	  formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    series : 
		        {	
		    		name: '基站区域',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%']
		        }
		};
	var line={
        	lineStyle:{
        		color:'rgb(255, 255, 255)'
        	}
        };
	var options = {
			legend:{left:'0px'},
            title: {
                text: '时间段',
                textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        }
            },
            tooltip:{
		    	  confine:true,
		    	  formatter: "{a} <br/>{b} ({c})"
		    },
            xAxis: {
                data: (function(){
                	var data=[];
                	for(var i=0;i<24;i++){
                		data.push({value: (i<10?('0'+i):i)+':00',textStyle:{fontSize:4}});
                	}
                	return data;
                })(),
                axisLine:line
            },
            yAxis: {
            	axisLine:line
            },
            series: {
            	name:'发射次数',
                type: 'bar'
            }
        };

	
	
	function playback (dvcList) {
		var rfids = [];
		for(var i = 0; i < dvcList.length; i++) {
			rfids.push(dvcList[i].rfid);
		}
	
		db.query({
			request: {
				sqlId: 'select_rfid_link_dvcid_for_playback',
				whereId: 0,
				orderId: 0,
				params: [login.cusNumber, 15, rfids.join(',')]
			},
			success: function (result) {
				if (result && result.length) {
					var playbackList = [], 
						linkInfo = null;

					for(var i = 0; i < dvcList.length; i++) {
						for(var j = 0; j < result.length; j++) {
							linkInfo = result[j];

							if (linkInfo.dlm_dvc_id == dvcList[i].rfid && linkInfo.dld_dvc_type == 1) {
								playbackList = playbackList.concat( getPlaybackParam([linkInfo.dld_dvc_id], dvcList[i].time) );
							}
						}
					}

					if (playbackList) {
						video.setLayout(playbackList.length);
						video.playback(playbackList);
					}
				}
			}
		});
	}
	

	var isMoving = false;
	var movePools = [];
	var playPools = [];

	/*
	 * 实时移动
	 */
	function runtimeMove (list) {
		var moveList = [], lastData;
		if (list) {
			if (list.length > 1) {
				moveList.push({id: list[list.length - 2].rfid, type: '15'});
				moveList.push({id: list[list.length - 1].rfid, type: '15'});

				isMoving && stopTrack();
				setTimeout(trackMove, 200, moveList);
			} else {
//				player(lastData.cameraIds, lastData.time);
			}
			player(lastData.cameraIds);
		}
	}


	/*
	 * RFID轨迹移动
	 * @params list 
	 */
	function rfidTrackMove (list) {
		var curViewMenu = mapHandle.curViewMenu || {};
		var curWayObj = mapHandle.Wayfinding.findWay(curViewMenu.id);
		var Track = mapHandle.hzThree.Track;
		var labelObj = mapHandle.getLabelPoint(model.prisoner.id);

		var index = 0;
		var length = list.length - 1;
		var routePoints = [];
		var rfidInfoMap = {};

		if (!curWayObj) {
			tip.alert('当前视角无寻路网格，无法计算轨迹线路');
			$('#tipPanel').hide();
			return;
		}

		if (length < 1) {
			tip.alert('检测数据不足，无法计算轨迹线路!');
			$('#tipPanel').hide();
			return;
		}

		// 先停止移动
		stopTrack();

		/*
		 * 设置移动参数并开始移动
		 */
		function startMove (points) {
			$('#tipPanel').hide();
			if (labelObj && !isMoving) {
				labelObj.oldPos = labelObj.position.clone();
				isMoving = true;
				minWin();

				$('#btnCancelTrack').show();
				$('#btnQueryTrack').hide();

				// 订阅移动结束事件
				mapHandle.Wayfinding.onOver('rfid.runtime.over', function () {
					if (isMoving) {
						isMoving = false;

						mapHandle.Wayfinding.offOver('rfid.runtime.over');
						labelObj.position = labelObj.oldPos.clone();
						labelObj.updatePos();

						$('#btnCancelTrack').hide();
						$('#btnQueryTrack').show();

						restoreWin();
					}
				});
			}

			var rdata = null,
				point = null;

			mapHandle.Wayfinding.trackMove({
				viewType: 3,
				walkSpeed: 20,
				cameraDis: 800,
				cameraHeight: 2200,
				moveCall: function (pos) {
					if (labelObj) {
						labelObj.position.x = pos.x;
						labelObj.position.y = pos.y;
						labelObj.position.z = pos.z;
						labelObj.updatePos();

						// 根据点位打开视频回放
						for(var i = 0, len = list.length; i < len; i++) {
							rdata = list[i];
							point = rdata.point;

							if (Math.abs(pos.x - point.x) < 10 && Math.abs(pos.z - point.z) < 10) {
								playbackVideo(rdata);
								list.splice(i, 1);
								break;
							}
						}
					}
				}
			}, points);
		}


		/*
		 * 回放视频
		 */
		var preData = null;
		function playbackVideo (data) {
			console.log('rdata --> ', data);

			// 临近的两个回放视频相同不处理
			if (preData && preData.rfid_id == data.rfid_id) {
				return;
			}

			preData = data;
			playback([{
				'rfid': data.rfid_id,
				'time': data.monitor_time
			}]);
		}


		/*
		 * 查找所有的轨迹路径
		 */
		(function findAllPath () {
			if (curWayObj) {
				var ridA = list[index++];
				var ridB = list[index];
				var rpoA = getRfidPointObj(ridA.rfid_id);
				var rpoB = getRfidPointObj(ridB.rfid_id);

				if (rpoA && rpoB) {
					curWayObj.findPath(rpoA.position.clone(), rpoB.position.clone(), function (meshName, points) {

						// 拼接所有线路点位
						if (points) {
							ridA.point = (index > 1) ? points.shift() : points[0];	// 记录设备所在的点位
							ridB.point = points[points.length - 1];					// 记录设备所在的点位
							routePoints = routePoints.concat(points);
						}

						// 所有的点位已经计算完线路之后开始轨迹移动
						if (index >= length) {
							var pointA = routePoints[0],
								pointB = null,
								list = [pointA];

							// 过滤临近重复的坐标点
							for(var i = 1; i < routePoints.length; i++) {
								pointB = routePoints[i];

								if (pointA.x != pointB.x || pointA.y != pointB.y || pointA.z != pointB.z) {
									pointA = pointB;
									list.push(pointB);
								}
							}

							startMove(list);
						} else {
							findAllPath();
						}
					});
				} else {
					tip.alert('地图未添加<span style="color: #FFEE00">' + (rpoA ? (rpoB || ridB.rfid_name) : ridA.rfid_name) + '</span>的基站点位，无法查看活动轨迹!');
					$('#tipPanel').hide();
				}
			}
		})();
	}


	/*
	 * 获取RFID基站的模型点位对象
	 */
	function getRfidPointObj (id) {
		return mapHandle.getModelPointByLinkId(linkType, id);
	}


	/*
	 * 停止移动
	 */
	function stopTrack () {
		mapHandle.Wayfinding.stop();
	}


	/*
	 * 最小化窗口
	 */
	function minWin () {
		try {
			// 最小化对话框
			var p = window.frameElement.parentNode.parentNode;
			var minBtn = p.querySelector('.layui-layer-min');
			var maxMinBtn = p.querySelector('.layui-layer-maxmin');
			if (minBtn && !maxMinBtn) {
				minBtn.click();
			}
		} catch (e) {
			console.error('设置对话框状态错误', e);
		}
	}


	/*
	 * 设置对话框状态
	 */
	function restoreWin (selector) {
		try {
			// 最小化对话框
			var p = window.frameElement.parentNode.parentNode;
			var maxMinBtn = p.querySelector('.layui-layer-maxmin');
			if (maxMinBtn) {
				maxMinBtn.click();
			}
		} catch (e) {
			console.error('设置对话框状态错误', e);
		}
	}



	//初始化数据
	function resetData () {
		options.series.data=[0];
		chart.init(tables.nextElementSibling).setOption(options);
		option.series.data= [{name:'暂无数据',value:0}];
		chart.init(tables).setOption(option);
	}
	resetData();
	
	//用户树
	db.query({
		request:{
			sqlId:'select_prisoner_info_tree',
			whereId:'0',
			orderId:'0',
			params:{cusNumber:login.cusNumber,stts:1}
		},success:function(data){
			var setting={
					key:'name',
					diyClass:'conditionslid',
					expand:true,
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(e,id,node){
							if(node.type==1){	
								resetData();
								model.plc = node.name;
								model.prisoner.id = node.id;
								//查询罪犯信息
								getprisonerInfoByid(node.id);
								if(model.date == getToday()){
									getRfidCacheData(node.id);	//查询缓存
								}else{
									model.records = [];
									queryInfoList(1);		//查询数据
								}
							}else{
								tip.alert("请选择罪犯");
							}
						}
					}
			};
			tree.init("finda",setting,keepLeaf(data));
			initData();
		}
	});
	function keepLeaf(list){
		//获取子元素
		for(var i=0;i<list.length;i++){
			if(list[i]['type']==1){
				prisonerList.push(list.splice(i,1)[0]);
				i--;
			}
		}
		var pid=[];
		//获取父元素id
		for(var j=0;j<prisonerList.length;j++){
			if(pid.indexOf(prisonerList[j]['pid'])<0){
				pid.push(prisonerList[j]['pid'])
			}
		}
		var treeArray=[];
		//搜索父级元素
		var searchP=function(pid){
			for(var i=0;i<list.length;i++){
				if(list[i]['id']==pid){
					var temp=list.splice(i,1)[0];
					treeArray.push(temp);
					searchP(temp['pid']);
					i--;
				}
			}
		};
		//根据父id搜索
		for(var l=0;l<pid.length;l++){
			searchP(pid[l]);
		}
		return treeArray.concat(prisonerList);
	}
	
	
	//加载图片
	 function loadImg(url,callback){
		 var img = new Image();
		 img.src = url;
    	 img.onload = function(){
			 callback(url,true);
		 }
    	 img.onerror = function(){
    		 callback(url,false);
    	 }
	 }
	
	  /**
	   * 根据罪犯编号查询详细信息
	   */
	  function getprisonerInfoByid(id){
		  db.query({
				request:{
					sqlId:'select_prisoner_base_dtls_info',
					whereId:'0',
					params:[login.cusNumber,id]
				},
				success:function(data){
					var data = data[0];
					modelUtil.modelData(model.prisoner, data);
					$(".photo").addClass("prisoner-photo");
					model.prisoner.img_url = '../../../libs/layer/skin/default/loading-2.gif';
					loadImg(data.img_url,function(url,flag){
						if (flag) {
							model.prisoner.img_url = url;
						} else {
							model.prisoner.img_url = imgurl;
						}
						$(".photo").removeClass("prisoner-photo");
					})
				},
				error:function(errorCode, errorMsg){
					tip.alert(errorCode + ":" + errorMsg);
				}
			});
	  }

	  /**
	   * 根据罪犯编号查询缓存rfid消息
	   */
	function getRfidCacheData(id){
		model.records = [];
		queryInfoList(1);		//查询数据
/*
		  var path = 'rfidController/queryRedisData';
		  var args = {cusNumber:login.cusNumber,prisonerId:id};


		  utils.ajax(path, args, function(data){
			  model.records = [];
			  for(var i = 0; i < data.length; i++){
				  if(String(data[i].time).indexOf(getToday()) != -1){
					  model.records.push(data[i]);
				  }
			  }
			  if (model.records.length > 0) {
				  showChart();
				  model.records[model.records.length-1].videoPlayer = true;
				  var time = new Date(model.records[0].time);
				  time.setSeconds(time.getSeconds() + backTime);
				  var now = new Date();
				
				  if (now.getTime() > time.getTime()) {
					  model.records[model.records.length-1].videoPlayer = false;
				  }
				  model.$nextTick(function () {
					  autoScrollTop();
				  })
			  }
		  });
*/
	  }
	  

	  
	//视频播放
	function player(ids,datetime){
		if(!ids || ids.length <= 0){
			tip.alert('暂无关联摄像机');
			return;
		}
		video.setLayout(ids.length);

		if(!datetime){	//直播
			video.play(ids);	
		}else{	//回放
			var list = getPlaybackParam(ids, datetime);
			video.playback(list);
		}
	}

	function getPlaybackParam (ids, datetime) {
		var list = [];
		if (ids && ids.length) {
			var time = new Date(datetime);
			var startTime = new Date(time.setSeconds(time.getSeconds() - 3));
			var endTime = new Date(time.setSeconds(time.getSeconds() + 3));
			for(var i = 0; i < ids.length; i++){
				list.push({
					"cameraId":ids[i],
					"beginTime":convertDate(startTime),
					"endTime":convertDate(endTime)
				});
			}
		}
		return list;
	}
	
	//时间转换
	function convertDate(time){
		return time.getFullYear()+'-'+ fillDouble(time.getMonth()+1)+'-' + fillDouble(time.getDate()) +
		' '+ fillDouble(time.getHours()) +':'+fillDouble(time.getMinutes())+':'+fillDouble(time.getSeconds());
	}
	
	//转换
	function fillDouble(time){
		return time < 10 ? '0'+time : time;
	}
	  
    // 显示图表
	function showChart() {
		//显示饼图数据
		var pieData = [];
		var pieName = [];
		for(var i = 0; i < model.records.length; i++){
			var obj = model.records[i];
			if(pieName.indexOf(obj.areaname) == -1){
				var name = obj.areaname;
				pieName.push(name);
				var k = 0;
				for(var j = 0; j < model.records.length; j++){
					if(name == model.records[j].areaname){
						k++;
					}
				}
				pieData.push({name:name,value:k});
			}
		}
		option.series.data = pieData;
		chart.init(tables).setOption(option);
		
		//显示树状图数据
		var barData = [];
		for(var i = 0; i < 24; i++){
			var k = 0;
			for(var j = 0; j < model.records.length; j++){
				var obj = model.records[j];
				if(obj && obj.time){
					var hours = new Date(obj.time).getHours();
					if(i == hours){
						k++;
					}
				}
			}
			barData.push(k);
		}
		options.series.data=barData;
		chart.init(tables.nextElementSibling).setOption(options);
	}
	
	
	//滚动条自动下拉
	function autoScrollTop(){
		$('.cardlist').animate({
			scrollTop: $('.cardlist')[0].scrollHeight-5
		}, 1000);
	}

	//rfid订阅回调
	function rfidMsg(data){
		var map = JSON.parse(data.msg);
		var info = map.rfidInfo;
		var bean = map.beanData;
		var id = bean.peopleId;
		//匹配当前选择的罪犯
		if (id == model.prisoner.id) {
			model.records.push(info);
			model.records[model.records.length-1].videoPlayer = true;
			showBackPlayer(info);
			autoScrollTop();
			showChart();
			runtimeMove([info]);
		}
	}


	//初始化数据
	function initData(){
		var id = "";
		var name = "";
		if(prisonerId && prisonerName){
			id = prisonerId;
			name = prisonerName;
		}else if(prisonerList && prisonerList.length > 0){
			id = prisonerList[0].id;
			name = prisonerList[0].name;
		}
		if(id && name){
			model.plc = name;
			model.prisoner.id = id;
			//查询罪犯信息
			getprisonerInfoByid(id);
			//查询rfid消息
			getRfidCacheData(id);
		}
	}

	//显示回放按钮
	function showBackPlayer(obj) {
		setTimeout(function(){
			for(var i = 0; i < model.records.length; i++){
				model.records = JSON.parse(JSON.stringify(model.records));
				if(model.records[i].time == obj.time){
					model.records[i].videoPlayer = false;
					console.log(model.records);
					break;
				}
			}
		},6000);
	}

	//订阅后台推送消息
//    window.top.webmessage.off('RFID001','RFID');
    window.top.webmessage.on('RFID001', 'RFID', rfidMsg, true);
});