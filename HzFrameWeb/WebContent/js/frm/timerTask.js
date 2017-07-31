define(function(require){
	var db = require('frm/hz.db');
	var message = require('frm/message');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	
	var timerTask = {
			/**
			 * 添加定时任务
			 * @param timerTaskInfo
			 */
			addTimerTask:function(timerTaskInfo,callback){
				db.updateByParamKey({
					request:{
						sqlId:'insert_com_user_timer_task_info',
						params:timerTaskInfo
					},
					success:function(data){
						message.alert("添加定时任务成功");
						if(callback &&  typeof callback == 'function'){
							timerTaskInfo.utt_task_id = data.data[0]['seqList'][0];
							callback(timerTaskInfo);
						}
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
			},
			/**
			 * 更新定时任务
			 * @param timerTaskInfo
			 */
			updateTimerTask:function(timerTaskInfo,callback){
				db.updateByParamKey({
					request:{
						sqlId:'update_com_user_timer_task_info',
						params:timerTaskInfo
					},
					success:function(){
						message.alert("更新定时任务成功");
						if(callback &&  typeof callback == 'function'){
							callback(timerTaskInfo);
						}
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
			},
			deleteTimerTask:function(timerTaskid,callback){
				db.updateByParamKey({
					request:{
						sqlId:'delete_timer_task_info_byid',
						whereId:'0',
						params:{'id':timerTaskid}
					},
					success:function(){
						message.alert("删除定时任务成功");
						if(callback &&  typeof callback == 'function'){
							callback(timerTaskid);
						}
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
			},
			/**
			 * 查询定时任务信息
			 */
			queryTimerTask:function(){
				var taskInfo = null;
				db.query({
					request:{
						sqlId:'select_com_user_timer_task_info',
						whereId:'2',
						orderId:'0',
						params:{'utt_cus_number':loginUser.cusNumber,'utt_user_id':loginUser.userId}
					},
					async:false,
					success:function(data){
						taskInfo  = data;
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
				return taskInfo;
			},
			/**
			 * 创建定时任务
			 */
			createTimerTask:function(){
				var data = this.queryTimerTask();
				if(data != null){
					_createTimerTask(data);
				}else{
					console.log('该用户没有要执行的定时任务');
				}
			},
			createTaskByInfo:function(timerTaskInfo){
				var data = [timerTaskInfo];
				_createTimerTask(data);
			},
			timerTaskList:new Object(),//定时器列表
			clearTimerTask:function(taskid){
				clearTimeout(taskid);
			}
	};
	// 定时任务结构体
	var timerTaskBean = {};
	/**
	 * 根据查询到的数据,创建定时器
	 */
	function _createTimerTask(data){
		var nowDate = new Date(); //当前时间
		var taskType,execWeekDay,execTime;
		for(var i=0;i<data.length;i++){
			 execWeekDay = data[i].utt_exec_week; //执行周期
			 //是否是执行任务的日期
			 if(execWeekDay != '' && execWeekDay.indexOf(nowDate.getDay()) == -1){
				 console.log('不是执行任务的日期');
				 continue;
			 }
			 execTime = data[i].utt_exec_time; //执行时间
			 //执行任务的时间是否已过
			 if(execTime<nowDate.Format("hh:mm")){
				 console.log('执行任务的时间已过');
				 continue;
			 }else{
				 execTime = Date.parse(nowDate.Format("yyyy/MM/dd") + ' ' + execTime + ':00') - nowDate.getTime();
			 }
			 timerTaskBean = data[i];
			 
			 switch(data[i].utt_task_type){
				 case 4:case '4'://定时广播
				 createBroadcastTask(execTime);//
				 break;
			 }
		}
	}
	/*
	 * 定时广播
	 */
	function createBroadcastTask(execTime){
		message.notification(utils.getTimeDiff(execTime)+'后执行任务--'+timerTaskBean.utt_task_name);
		var task = setTimeout(function(){
				message.notification('开始执行定时广播任务--'+timerTaskBean.utt_task_name);
				timerTaskBean.utt_device_id = timerTaskBean.utt_device_id.replace(/,/g,';');
				var url = 'broadcast/play';
				var args = {
					'cusNumber':loginUser.cusNumber,
					'broadcastType':1,
					'videoPath':timerTaskBean.utt_play_file,
					'clientID':timerTaskBean.utt_device_id,
					'action':3,//1播放,2停止 3 定时播放
					'user':timerTaskBean.utt_user_id,
				};
				
				var reqs = function(json){
					if(json.success){
						console.log('定时广播--指令发送成功');
					}else{
						console.log('发送播放指令失败,请稍候重试');
					}
				};
				/*
				 * 请求响应失败处理
				 */
				function reqe () {
					console.log('请求失败，服务器响应超时~!');
				};
				
				// 请求处理
				utils.ajax(url, {'args': JSON.stringify(args)}, reqs, reqe,false);
		 },execTime);
		timerTask.timerTaskList[timerTaskBean.utt_task_id] = task;
	}	

	
	try {
		var hz = window.top.hz;
		if (hz) {
			if (hz.timerTask) {
				console.log('获取定时器管理对象...');
				return hz.timerTask;
			}
		} else {
			hz = window.top.hz = {};
		}
		console.log('初始化 --> 定时器管理模块...');
		
		return hz.timerTask = timerTask;
	} catch (e) {
		console.error('初始化 --> 定时器管理模块失败......',e);
	}
});