define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	var datepicker = require('frm/datepicker');
	
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#todayDtymManage',
		data:{
			deptList:[],
			scheduleList:[],
			peopleList:[],
			policeList:[],
			dtyDate:'',
			police:{
				'pbd_police_id':'',
				'name':'',
				'pbd_pstn_name':'',
				'pbd_drptmnt':'',
				'pbd_talk_num':''
			}
		},
		methods:{
			load:function(){
				loadTodayDtyInfo();
			}
		}
	});
	
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
	model.dtyDate = utils.formatterDate(new Date(),"yyyy-mm-dd");
	/**
	 * 根据值班日期加载各部门值班信息
	 */
	function loadTodayDtyInfo(){
		tip.saving("正在查询中...");
		model.deptList = [];
		var deptList = [];
		var orderList = [];
		var orderSet = new Set();
		var jobList = [];
		var jobSet = new Set();
		var scheduleList = model.scheduleList;
		var peopleList = model.peopleList;
		var flag = true;
		var num = 0;
		for(var i=0;i<scheduleList.length;i++){
			var startDate = scheduleList[i].scd_start_date;
			var endDate = scheduleList[i].scd_end_date;
			if(startDate <= model.dtyDate && endDate >= model.dtyDate){
				var deptId = scheduleList[i].scd_dept_id;
				if(flag){
					deptList.push({'id': deptId, 'name': scheduleList[i].odd_name});
				}else if(deptId != scheduleList[i-1].scd_dept_id){
					setOrderJob(deptList,num,orderSet,orderList,jobList,jobSet);
					deptList.push({'id': deptId, 'name': scheduleList[i].odd_name});
					orderList = [];
					orderSet = new Set();
					jobList = [];
					jobSet = new Set();
					num++;
				}
				flag = false;
				orderSet.add(scheduleList[i].scd_shift_id + "_" + scheduleList[i].scd_shift_name + "_" 
						   + scheduleList[i].sbd_stime_flag + "_" + scheduleList[i].scd_shift_start_time + "_" 
						   + scheduleList[i].sbd_etime_flag + "_" + scheduleList[i].scd_shift_end_time);
				jobSet.add(scheduleList[i].scd_job_id + "_" + scheduleList[i].scd_job_name);
			}
		}
		if(orderList && jobList)
			setOrderJob(deptList,num,orderSet,orderList,jobList,jobSet);
		var dateTime = utils.formatterDate(new Date(),"yyyy-mm-dd hh:mi:ss");
		for(var i=0;i<deptList.length;i++){
			var deptId = deptList[i].id;
			var jobList = deptList[i].jobList;
			var orderList = deptList[i].orderList;
			for(var i1=0;i1<jobList.length;i1++){
				var jobId = jobList[i1].id;
				var list1 = [];
				for(var i2=0;i2<orderList.length;i2++){
					var orderId = orderList[i2].id;
					var startTime = orderList[i2].startTime + ":00";
					var endTime = orderList[i2].endTime + ":00";
					var s_date = model.dtyDate;
					var e_date = model.dtyDate;
					if(orderList[i2].stimeFlag > 1){
						s_date = addDate(fmtStrDate(s_date));
					}
					if(orderList[i2].etimeFlag > 1){
						e_date = addDate(fmtStrDate(e_date));
					}
					startTime = s_date + " " +  startTime;
					endTime = e_date + " " +  endTime;
					var list2 = [];
					for(var j=0;j<peopleList.length;j++){
						if(model.dtyDate == peopleList[j].ped_date 
								&& deptId == peopleList[j].ped_dept_id
								&& jobId == peopleList[j].ped_job_id 
								&& orderId == peopleList[j].ped_shift_id){
							var nowDate = utils.formatterDate(new Date(),"yyyy-mm-dd");
							var className = "one";
							if(startTime <= dateTime && endTime >= dateTime){
								className = "two";
							}else if(endTime < dateTime){
								className = "three";
							}
							list2.push({'id': peopleList[j].ped_id, 'name': peopleList[j].ped_name, 'className': className});
						}
					}
					list1.push({'peopleList': list2});
				}
				deptList[i].jobList[i1].list = list1;
			}
		}
		//alert(JSON.stringify(deptList));
		model.deptList = deptList;
		/**
		 * 添加数组对象
		 */
		function setOrderJob(deptList,num,orderSet,orderList,jobList,jobSet){
			var width = parseInt(85/orderSet.size);
			orderSet.forEach(function (item) {
				item = item.toString().split("_");
				orderList.push({'id': item[0], 'name': item[1], 
								'stimeFlag': item[2], 'startTime': item[3], 
								'etimeFlag': item[4], 'endTime': item[5], 
								'width': width});
			});
			if(orderList.length > 0)
				deptList[num].orderList = orderList;
			jobSet.forEach(function (item) {
				item = item.toString().split("_");
				jobList.push({'id': item[0], 'name': item[1]});
			});
			if(jobList.length > 0)
				deptList[num].jobList = jobList;
		}
		vue.nextTick(function () {
			tip.close();
			mouseDtyPeople();
		})
	}
	loadTodayDtyInfo();
	/**
	 * 鼠标悬浮显示值班人员详情
	 */
	function mouseDtyPeople(){
		$(".name").unbind("mousemove");
		$(".name").unbind("mouseout");
		$(".name").bind({'mousemove': function(e){
			var x = e.pageX;
			var y = e.pageY;
			var width = $("#todayDtymManage").width();
			var height = $("#todayDtymManage").height();
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
})