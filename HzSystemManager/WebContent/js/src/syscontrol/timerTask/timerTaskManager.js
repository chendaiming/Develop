define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var loginUser =  require('frm/loginUser');
	var modelUtil = require('frm/model');	
	var tip = require('frm/message');
	var datepicker = require('frm/datepicker');
	var dialog = require('frm/dialog');
	var table = require('frm/table');
	var select = require('frm/select');
	var timerTask = require('frm/timerTask');
	
	model=new tpl({
		el:'body',
		data:{
			playTask:{              //定时任务
				'utt_cus_number':loginUser.cusNumber,
				'utt_task_id':'',
				'utt_task_name':'',
				'utt_user_id':loginUser.userId,
				'utt_task_type':4,//定时广播
				'utt_device_id':'',
				'utt_device_name':'',
				'utt_play_file':'',
				'utt_exec_week':'',
				'utt_exec_time':'',
				'utt_remind_time':'',
				'utt_task_status':1,
				'userId':loginUser.userId
			},
			audioListData:initAudioList(),
			editModel:false,
			selectedRow:{},
			weekCheck:[false,false,false,false,false,false,false],
			everyDay:true
		},
		methods:{	
			showCreate:function(type){
				var _title = '';
				switch(type){
				case 'create':
					this.editModel = false;
					modelUtil.clear(this.playTask,{'utt_cus_number':'','utt_task_type':'','utt_user_id':'','userId':'','utt_task_status':1});
					_title = '新建定时任务';
					break;
				case 'edit':
					this.editModel = true;
					_title = '编辑定时任务';
//					loadEditData(this.selectedRow);
					break;
				}
				dialog.open({targetId:'addTask_dialog',title:_title,h:"395",w:"480",top:"3%"});
			},
			showEdit:function(row){
				if(row.utt_task_id){
					loadEditData(row);
				}else{
					tip.alert('请选择要编辑的行');
				}
			},
			/**
			 * 保存定时任务
			 */
			addTask:function(){
				if(!task_input_check()) return;
				if(this.playTask.utt_device_id){
					this.playTask.utt_device_id = this.playTask.utt_device_id.toString();
				}
				if(this.editModel){
					timerTask.updateTimerTask(this.playTask,function(timerTaskInfo){
						//定时器已存在,删除定时器
						var taskid = timerTask.timerTaskList[timerTaskInfo.utt_task_id];
						
						if(taskid){
							timerTask.clearTimerTask(taskid);
							timerTask.timerTaskList[timerTaskInfo.utt_task_id] = null;
						}
						
						if(timerTaskInfo.utt_task_status == 1){//定时器为启用状态
								//新建定时器
								timerTask.createTaskByInfo(timerTaskInfo);
						}
						$('#table').bootstrapTable('refresh');
					});
					
				} else{
					timerTask.addTimerTask(this.playTask,function(timerTaskInfo){
						$('#table').bootstrapTable('refresh');
						if(timerTaskInfo.utt_task_status == 1){
							timerTask.createTaskByInfo(timerTaskInfo);
						}
					});
				}
				dialog.close();
			},
			deleteTask:function(){
				if(!this.selectedRow.utt_task_id) {
					tip.alet('请选择要删除的定时任务');
					return;
				}
				timerTask.deleteTimerTask(this.selectedRow.utt_task_id,function(id){
					$('#table').bootstrapTable('refresh');
					
					var taskid = timerTask.timerTaskList[id];
					
					if(taskid){
						timerTask.clearTimerTask(taskid);
						timerTask.timerTaskList[id] = null;
					}
				});
			},
			resetTask:function(){
				modelUtil.clear(this.playTask,{'utt_cus_number':'','utt_task_type':'','utt_user_id':'','userId':'','utt_task_status':1});
				dialog.close();
			}
		},
		watch:{
			everyDay:function(checked){
				if(checked){//勾选状态,周一到周日全部取消勾选
					this.weekCheck = [false,false,false,false,false,false,false];
				}else if(!checked && this.playTask.utt_exec_week == ''){
					//取消勾选状态且周一到周日都没有勾选,周一到周日全部勾选
					this.weekCheck = [true,true,true,true,true,true,true];
				}
			},
			weekCheck:function(val,oldVal){
				var neverCheckFlag = true;
				this.playTask.utt_exec_week = '';
				for(var i=0;i<val.length;i++){
					if(val[i] == true){
						this.playTask.utt_exec_week += '' + i; 
						neverCheckFlag = false;
					}
				}
				this.everyDay = neverCheckFlag;
			},
			'playTask.utt_task_type':function(val){
				switch(val){
				case 4:
					//加载广播设备和播放文件
					break;
				}
			}
		}
	});
	//=============================
	//========查询定时任务
	//=============================
	//初始化表格
	var initTable = function(){
		table.init("table",{
			request:{
				sqlId:'select_com_user_timer_task_info',
				orderId:'0',
				whereId:'0',
				params:{'utt_cus_number':loginUser.cusNumber,'utt_user_id':loginUser.userId}
			},
			search:{
				key:'search',
				whereId:'1'
			},
			searchOnEnterKey:true,
			searchAlign:'right',
			showColumns:true,
			clickToSelect:true,//单击行时自动check
			showRefresh:true,
			columns: [[  
						{
							field: 'state',
							 width:'1',
							 valign: 'middle',
							 radio : true
						},{
						    field: 'rn',
		                    align: 'center',
		                    width:'1',
		                    valign: 'middle'
						},{
		                    title: '任务名称',
		                    field: 'utt_task_name',
		                    width:'20',
		                    align: 'center',
		                    valign: 'middle'
		                },{
		                    title: '任务类型',
		                    field: 'task_type',
		                    width:'20',
		                    align: 'center',
		                    valign: 'middle'
		                },{
		                    title: '关联项',
		                    field: 'utt_device_name',
		                    width:'20',
		                    align: 'center',
		                    valign: 'middle'
		                },{
		                    title: '执行时间',
		                    field: 'utt_exec_time',
		                    width:'20',
		                    align: 'center',
		                    valign: 'middle'
		                },{
		                    title: '状态',
		                    field: 'task_status',
		                    width:'20',
		                    align: 'center',
		                    valign: 'middle'
		                }
		              ]],
	         onClickRow:function(row){
	        	 model.selectedRow = row;
	         },
	         onDblClickRow:function(row){
	        	 loadEditData(row);
	         },
	     	toolbar:".toolbar"
		});
	}
	initTable();
	/*
	 * 定时任务创建录入参数验证
	 */
	function task_input_check(){
		if($.trim(model.playTask.utt_task_name).length == 0){
			tip.alert('请填写任务名称!');
			return false;
		}
		
		if(model.playTask.utt_exec_time == '' || model.playTask.utt_exec_time.length == 0){
			tip.alert('请选择任务执行时间!');
			return false;
		}
		return true;
	}
	/**
	 * 编辑时加载选中行的数据
	 */
	function loadEditData(row){
	   	 modelUtil.clear(model.playTask,{'utt_cus_number':'','utt_user_id':'','userId':''});
		 modelUtil.modelData(model.playTask,row);
		 //双击显示编辑界面
		 if(row.utt_exec_week == ''){
			 model.everyDay = true;
		 }else{
			 model.everyDay = false;
			 setWeekDay(row.utt_exec_week);
		 }
		 model.taskType = row.utt_task_type;
		 model.showCreate('edit');
	}
	/**
	 * 重复项 复选框赋值
	 */
	function setWeekDay(exec_week){
		var _weekCheck = [false,false,false,false,false,false,false];
		for(var i=0;i<=6;i++){
			if(exec_week.indexOf(i) != -1){
				_weekCheck[i] = true;
			}
		}
		model.weekCheck = _weekCheck;
	}
	
	//初始化音频列表
	function initAudioList(){
		var audioListData = new Array();
		var url = "broadcast/fileList";
		var args = {"suffix":"mp3"};
		//成功回调
		function success(data){
			var _data = data.obj;
			if(!_data || _data.length == 0) return; 
			for(var i=0;i<_data.length;i++){
				var obj = {}
				obj.id = i;
				obj.name = _data[i];
				audioListData.push(obj);
			}
			console.log(audioListData);
		}
		utils.ajax(url,{"args":JSON.stringify(args)},success,null,false);
		return audioListData;
	}
});