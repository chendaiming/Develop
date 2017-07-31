define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var treeSelect = require('ztree');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	var chart = require('echarts');
	var dialog = require('frm/dialog');
	var utils = require('frm/hz.utils'); 
	
	var scheduleTree = null;
	var selectedName = null;
	
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#dtyQueryManage',
		data:{
			orderList:[],
			jobList:[],
			dateList:[],
			modeList:[],
			modeData:[],
			scheduleList:[],
			peopleList:[],
			searchTree:'',
			policeList:[],
			police:{
				'pbd_police_id':'',
				'name':'',
				'pbd_pstn_name':'',
				'pbd_drptmnt':'',
				'pbd_talk_num':''
			}
		},
		methods:{
			exportExcel:function(){
				if(!selectedName){
					tip.alert("请选择排班");
					return;
				}
				var fileName = selectedName + loginUser.deptName + "值班信息";
				var request = {
					orderList: model.orderList,
					jobList: model.jobList,
					dateList: model.dateList,
					fileName: fileName
				};
				utils.ajax('dutyCtrl/exportExcel', {'args': JSON.stringify(request)}, function(pathName){
					request = {'pathName': encodeURI(encodeURI(pathName))};
					var action = "../../../dutyCtrl/downloadExcel?args=" + JSON.stringify(request);
					$("#dloadExcel").remove();
					var form = $("<form id='dloadExcel' method='post' action='" + action + "'></form>");
					$("html").append(form);
					$("#dloadExcel").submit();
				}, function(){
				});
			}
		}
	});
	
	/**
	 * 初始化左侧值班类别部门模板编排信息
	 * @returns
	 */
	function initScheduleTree(){
		var scheduleList = [];
		var setting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			edit: {
				enable: false,
				drag: {
					isCopy: true,
					isMove: true,
					prev: function(treeId, nodes, targetNode){
						return !targetNode.isParent;
					},
					next: function(treeId, nodes, targetNode){
						return !targetNode.isParent;
					},
					inner: false
				},
				showRemoveBtn:false,
				showRenameBtn:false,
			},
			callback:{
				onDrop:function(event, treeId, treeNodes, targetNode, moveType, isCopy){
					return true;
				},
				onClick:function(event,treeId,treeNode){
					var type = treeNode.type;
					model.orderList = [];
					model.jobList = [];
					model.dateList = [];
					model.modeData = [];
					if(type == "schedule"){
						selectedName = treeNode.name;
						var modeId = treeNode.id.split("_")[1];
						var deptId = treeNode.pid.split("_")[1];
						loadScheduleModePeople(modeId,deptId);
					}
				},
				onDblClick:function(event,treeId,treeNode){

				}
			}
		}
		/**
		 * 查询值班编排树信息
		 */
		db.query({
			request: {
				sqlId: 'select_dty_category_dept_tree2',
				params: [loginUser.cusNumber,loginUser.deptId]
			},
			success: function (data) {
				scheduleList = data;
				db.query({
					request: {
						sqlId: 'select_dty_schedule_tree',
						params: [loginUser.cusNumber,loginUser.deptId]
					},
					success: function (data) {
						for(var i=0;i<data.length;i++){
							scheduleList.push(data[i]);
						}
						scheduleTree = $.fn.zTree.init($('#scheduleTree'),setting,scheduleList);
						scheduleTree.expandNode(scheduleTree.getNodes()[0],true);
					}
				});
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		  * 搜索tree监听函数
		  */
		model.$watch('searchTree',function(){
			 treeUtil.searchTree('name',model.searchTree,'scheduleTree',scheduleList,setting);
		});
		/**
		 * 加载值班编排模板、值班人员
		 */
		function loadScheduleModePeople(modeId,deptId){
			model.orderList = [];
			model.jobList = [];
			model.dateList = [];
			model.modeData = [];
			var list = model.scheduleList;
			var orderStrList = [];
			var stratDate = null;
			var endDate = null;
			for(var i=0;i<list.length;i++){
				var deptId_2 = list[i].scd_dept_id;
				if(deptId == deptId_2 && list[i].scd_mode_idnty == modeId){
					model.modeData.push(list[i]);
					stratDate = list[i].scd_start_date;
					endDate = list[i].scd_end_date;
					var orderStr = list[i].scd_shift_id +""
								 + list[i].scd_shift_name +""
								 + list[i].scd_shift_start_time +""
								 + list[i].scd_shift_end_time;
					if(JSON.stringify(orderStrList).indexOf(orderStr) != -1){
						var orderList = model.orderList;
						for(var j=0;j<orderList.length;j++){
							if(list[i].scd_shift_id == orderList[j].id){
								orderList[j].col = orderList[j].col + 1;
							}
						}
					}else{
						orderStrList.push(orderStr);
						model.orderList.push({id: list[i].scd_shift_id,
											  name: list[i].scd_shift_name,
											  stimeFlag: list[i].sbd_stime_flag,
											  start_time: list[i].scd_shift_start_time,
											  etimeFlag: list[i].sbd_etime_flag,
											  end_time: list[i].scd_shift_end_time,
											  col: 1});
					}
					model.jobList.push({id: list[i].scd_job_id,
										name: list[i].scd_job_name,
										orderId: list[i].scd_shift_id,
										startTime: list[i].scd_shift_start_time,
										endTime: list[i].scd_shift_end_time});
				}
			}
			loadDateList(modeId,deptId,stratDate,endDate);
			$("#stratDate").val(stratDate);
			$("#endDate").val(endDate);
		}
	}
	initScheduleTree();
	/**
	 * 加载值班天数
	 */
	function loadDateList(modeId,deptId,stratDate,endDate){
		var diff = dateDiff(stratDate,endDate);
		var peopleList = model.peopleList;
		var jobList = model.jobList;
		var dateTime = utils.formatterDate(new Date(),"yyyy-mm-dd hh:mi:ss");
		for(var i=0;i<=diff;i++){
			var list1 = [];
			for(var j=0;j<jobList.length;j++){
				var flag = false;
				var list2 = [];
				var startTime = jobList[j].startTime + ":00";
				var endTime = jobList[j].endTime + ":00";
				var s_date = stratDate;
				var e_date = stratDate;
				if(jobList[j].stimeFlag > 1){
					s_date = addDate(fmtStrDate(s_date));
				}
				if(jobList[j].etimeFlag > 1){
					e_date = addDate(fmtStrDate(e_date));
				}
				startTime = s_date + " " +  startTime;
				endTime = e_date + " " +  endTime;
				for(var k=0;k<peopleList.length;k++){
					var date = peopleList[k].ped_date;
					var deptId_2 = peopleList[k].ped_dept_id;
					var orderId = peopleList[k].ped_shift_id;
					var jobId = peopleList[k].ped_job_id;
					var id = peopleList[k].ped_id;
					var name = peopleList[k].ped_name;
					if(date == stratDate && deptId == deptId_2 
							&& orderId == jobList[j].orderId && jobId == jobList[j].id){
						list2.push({id: id, name: name});
						flag = true;
					}
				}
				var flagNum = 1;
				if(flag){
					flagNum = 2;
				}
				if(endTime < dateTime){
					list1.push({flag: flagNum, className: "top",list: list2});
				}else if(startTime <= dateTime && endTime >= dateTime){
					list1.push({flag: flagNum, className: "mid",list: list2});
				}else{
					list1.push({flag: flagNum,list: list2});
				}
			}
			model.dateList.push({name: stratDate, week: getWeek(stratDate), className: "date", peopleList: list1});
			stratDate = addDate(fmtStrDate(stratDate));
		}
		queryDtyPeopleCount(modeId,deptId);
		loadScroll();
	}
	/**
	 * 加载滚动事件
	 */
	function loadScroll(){
		vue.nextTick(function () {
			resizeTable_head();
			resizeTable_body();
			mouseDtyPeople();
		})
		$("div.content").scroll(function(){
			var scrollTop = $(this).scrollTop();
			var scrollLeft = $(this).scrollLeft();
			$("div.right").css("top","-" + scrollTop);
			$("div.head").css("left","-" + scrollLeft);
		})
	}
	/**
	 * 同步表格头tr高度
	 */
	function resizeTable_head(){
		$("div.title table").find("tr").each(function(i){
			var h = $("div.head table").children().eq(0).children().eq(i).height();
			$(this).height(h);
		})
	}
	/**
	 * 同步表格内容tr高度
	 */
	function resizeTable_body(){
		$("div.right table").find("tr").each(function(i){
			var h = $("div.content table").children().eq(0).children().eq(i).height();
			$(this).height(h);
		})
	}
	/**
	 * 鼠标悬浮显示值班人员详情
	 */
	function mouseDtyPeople(){
		$(".name").unbind("mousemove");
		$(".name").unbind("mouseout");
		$(".name").bind({'mousemove': function(e){
			var x = e.pageX;
			var y = e.pageY;
			var width = $("#dtyQueryManage").width();
			var height = $("#dtyQueryManage").height();
			var panelW = $("#info_panel").width();
			var panelH = $("#info_panel").height();
			if((width-x) < panelW){
				$("#info_panel").css({left: (x-panelW)-12});
			}else{
				$("#info_panel").css({left: x+12});
			}
			if((height-y) < panelH){
				$("#info_panel").css({top: (y-panelH)});
			}else{
				$("#info_panel").css({top: y+12});
			}
			peopleInfo($(this));
			$("#info_panel").show();
		},'mouseout': function(){
			$("#info_panel").hide();
		}})
	}
	/**
	 * 值班人员详情
	 */
	function peopleInfo(row){
		var list = model.policeList;
		var peopleId = row.attr("value");
		var peopleName = row.attr("name");
		for(var i=0;i<list.length;i++){
			if(peopleId == list[i].pbd_user_id){
				model.police.pbd_police_id = list[i].pbd_police_id;
				model.police.name = peopleName;
				model.police.pbd_pstn_name = list[i].pbd_pstn_name;
				model.police.pbd_drptmnt = list[i].odd_name;
				model.police.pbd_talk_num = list[i].pbd_talk_num;
				if(list[i].pbd_img)
					$("#imageview img").attr("src",list[i].pbd_img);
				else
					$("#imageview img").attr("src","image/police.jpg");
			}
		}
	}
	/**
	 * 查询值班次数
	 */
	function queryDtyPeopleCount(modeId,deptId){
		db.query({
			request:{
				sqlId:'select_dty_people_moreCount',
				params:[loginUser.cusNumber,modeId,deptId]
			},
			success:function(data){
				var peopleNameList = [];
				var peopleCountList = [];
				for(var i=0;i<data.length;i++){
					peopleNameList.push(data[i].ped_name);
					peopleCountList.push({value:data[i].dtycount,name:data[i].ped_id});
				}
				loadTableBar(peopleNameList,peopleCountList);
			}
		});
	}
	/**
	 * 加载柱状图
	 */
	function loadTableBar(peopleNameList,peopleCountList){
	    var tableBar = chart.init(document.getElementById("tableBar"));
	    //设定柱状图属性
	    var option = {
		    title : {
		        text: '值班次数',
		        textStyle:{
		        	fontSize: 12,
		        	color: '#fff'	        	
		        },
		        x:'center'
		    },
		    legend: {
		    	show: false,
		        orient : 'vertical',
		        x : 'left',
		        data:['次数'],
		        textStyle:{
		        	color: 'auto'
		        }
		    },
		    dataZoom: {  
                show: true,  
                height: 22,
                realtime: true,  
                start: 0, 
                end: 100
		    },
		    color: ['#1f699e'],
		    tooltip : {
		        trigger: 'axis',
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            data : peopleNameList,
		            axisLine:{lineStyle:{color:'white'}}
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            axisLine:{lineStyle:{color:'white'}}
		        }
		    ],
		    series : [
		        {
		            name:'次数',
		            type:'bar',
		            textStyle:{color:'#fff'},
			        data: peopleCountList,
		            markPoint : {data : [{type : 'max', name: '最多'},{type : 'min', name: '最少'}]},
		            markLine : {data : [{type : 'average', name: '平均值'}]},
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
	    tableBar.setOption(option);
	    //注册点击事件
	    tableBar.on('click',function(param){
	    	var peopleId = param.data.name;
	    	$("#peopleId").val(peopleId);
	    	dialog.open({
				id:"dutyRecord",
				type:2,
				top:0,
				w:100,
				h:100,
				title:"值班记录",
				url:"page/cds/dutyQuery/dutyRecord.html"
			});
	    });
	}
	/**
	 * 查询值班编排模板信息
	 */
	function queryScheduleMode(){
		db.query({
			request:{
				sqlId:'select_dty_schedule_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.scheduleList = data;
			}
		});
	}
	/**
	 * 查询值班编排人员信息
	 */
	function querySchedulePeople(){
		db.query({
			request:{
				sqlId:'select_dty_people_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.peopleList = data;
			}
		});
	}
	/**
	 * 查询警员信息
	 */
	function queryPoliceInfo(){
		db.query({
			request:{
				sqlId:'select_dty_police_base_dtls',
				whereId: 0,
				params:[loginUser.cusNumber]
			},
			success:function(data){
				model.policeList = data;
			}
		});
	}
	queryScheduleMode();
	querySchedulePeople();
	queryPoliceInfo();
	/**
	 * 返回两个日期之间相差的天数
	 */
	function dateDiff(sDate1,sDate2){
	    var aDate,oDate1,oDate2,iDays  
	    aDate = sDate1.split("-")  
	    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	    aDate = sDate2.split("-")  
	    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);
	    return iDays;
	}
	/**
	 * 字符串类型转Date类型
	 */
	function fmtStrDate(str){
		str = str.replace(/-/g,"/");
		var date = new Date(str);
		return date;
	}
	/**
	 * 日期天数加1
	 */
	function addDate(date) {
		date = date.getTime() + 1 * 24 * 60 * 60 * 1000;
	    var result = new Date(date);
	    var month = (result.getMonth() + 1);
	    if(month < 10){
	    	month = "0" + month;
	    }
	    var day = result.getDate();
	    if(day < 10){
	    	day = "0" + day;
	    }
	    return result.getFullYear() + "-" + month + "-" + day;
	}
	/**
	 * 根据日期获取星期
	 */
	function getWeek(str){
		var week = null;
		var day = fmtStrDate(str).getDay();
		if (day == 0) {  
			week = "星期日";  
		}else if(day == 1) { 
			week = "星期一";
		}else if(day == 2) {  
			week = "星期二";
		}else if(day == 3) {  
			week = "星期三";
		}else if(day == 4) {  
			week = "星期四";
		}else if(day == 5) {
			week = "星期五";  
		}else if(day == 6) { 
			week = "星期六";
		}  
		return week;
	}
});