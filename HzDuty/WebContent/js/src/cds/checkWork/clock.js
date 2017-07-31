define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#clock',
		data:{
			date: utils.formatterDate(new Date(),"yyyy-mm-dd"),
			time: utils.formatterDate(new Date(),"hh:mi:ss"),
			week: getWeek(utils.formatterDate(new Date(),"yyyy-mm-dd")),
			dutyPeoleInfo: '',
			clockInfo: {
				ckr_cus_number: loginUser.cusNumber,
				ckr_relation_id: '',
				ckr_date: '',
				ckr_dept_id: loginUser.deptId,
				ckr_dept_name: loginUser.deptName,
				ckr_shift_id: '',
				ckr_job_id: '',
				ckr_start_date: '',
				ckr_end_date: '',
				ckr_person_id: 1,
				ckr_person_name: '',
				ckr_until_date: '',
				ckr_until_status: 1,
				ckr_until_remark: '',
				ckr_back_date: '',
				ckr_back_status: 1,
				ckr_back_remark: ''
			}
		},
		methods:{
			untilClock:function(){
				//alert(JSON.stringify(model.clockInfo));
				model.clockInfo.ckr_until_date = model.date + " " + model.time;
				db.updateByParamKey({ 
					request:{
						sqlId: 'insert_ckw_clock_record',
						params: model.clockInfo
					},
					success:function(){
						tip.alert("上班打卡成功");
						queryClockInfo();
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			},
			backClock:function(){
				//alert(JSON.stringify(model.clockInfo));
				model.clockInfo.ckr_back_date = model.date + " " + model.time;
				db.updateByParamKey({ 
					request:{
						sqlId: 'update_ckw_clock_record',
						params: model.clockInfo
					},
					success:function(){
						tip.alert("下班打卡成功");
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			}
		}
	});
	setInterval(function(){
		model.date = utils.formatterDate(new Date(),"yyyy-mm-dd");
		model.time = utils.formatterDate(new Date(),"hh:mi:ss");
	},1000);
	/**
	 * 查询值班人员信息
	 */
	function queryDutyPoliceInfo(){
		db.query({
			request:{
				sqlId: 'select_checkWork_dutyPeople_info',
				whereId: 0,
				params: [loginUser.cusNumber,1]
			},
			async: false,
			success:function(data){
				model.dutyPeoleInfo = data[0];
			}
		});
	}
	/**
	 * 查询考勤打卡记录
	 */
	function queryClockInfo(){
		db.query({
			request:{
				sqlId: 'select_ckw_clock_record',
				whereId: 0,
				params: [loginUser.cusNumber,1]
			},
			success:function(data){
				var nowDate = model.date + " " + model.time;
				nowDate = fmtStrDate(nowDate);
				nowDate = nowDate.getTime() + 1 * 30 * 60 * 1000;
				nowDate = new Date(nowDate);
				nowDate = utils.formatterDate(nowDate,"yyyy-mm-dd hh:mi:ss");
				if(data && data.length > 0){
					data = data[0];
					model.clockInfo.ckr_relation_id = data.ckr_relation_id;
					model.clockInfo.ckr_date = data.ckr_date;
					model.clockInfo.ckr_until_date = data.ckr_until_date;
					model.clockInfo.ckr_until_status = data.ckr_until_status;
					if(data.ckr_back_date){
						model.clockInfo.ckr_back_date = data.ckr_back_date;
						model.clockInfo.ckr_back_status = data.ckr_back_status;
					}else{
						if(nowDate < data.ckr_end_date){
							model.clockInfo.ckr_back_status = 2;
						}
					}
				}else{
					model.clockInfo.ckr_relation_id = model.dutyPeoleInfo.ped_relation_id;
					model.clockInfo.ckr_date = model.dutyPeoleInfo.ped_date;
					model.clockInfo.ckr_shift_id = model.dutyPeoleInfo.sbd_id;
					model.clockInfo.ckr_job_id = model.dutyPeoleInfo.jbd_id;
					var date = model.dutyPeoleInfo.ped_date;
					var flag = model.dutyPeoleInfo.sbd_stime_flag;
					var time = model.dutyPeoleInfo.scd_shift_start_time;
					var startDateTime = flag == 1 ? date + " " + time + ":00" : utils.addDate(date + " " + time + ":00", "yyyy-mm-dd hh:mi:ss");
					model.clockInfo.ckr_start_date = startDateTime;
					date = model.dutyPeoleInfo.ped_date;
					flag = model.dutyPeoleInfo.sbd_etime_flag;
					time = model.dutyPeoleInfo.scd_shift_end_time;
					var endDateTime = flag == 1 ? date + " " + time + ":00" : utils.addDate(date + " " + time + ":00", "yyyy-mm-dd hh:mi:ss");
					model.clockInfo.ckr_end_date = endDateTime;
					model.clockInfo.ckr_person_name = model.dutyPeoleInfo.ped_name;
					if(nowDate > startDateTime){
						model.clockInfo.ckr_until_status = 2;
					}
				}
			}
		});
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
	try {
		queryDutyPoliceInfo();
		queryClockInfo();
	} catch (e) {

	}
})