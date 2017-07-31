define(function(require){
	
	var $ = require('jquery');
	var vue = require('vue');
	var db = require('frm/hz.db');
	var table = require('frm/table');
	var dialog = require('frm/dialog');
	var tip = require('frm/message');
	var modelData = require('frm/model');
	var login = require('frm/loginUser');
	var timePicker = require('frm/datepicker');
	var hzEvent = require('frm/hz.event');
	
	var date = new Date();
	var currentDay = (function(){return date.getFullYear()+"-"+((date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<10?('0'+date.getDate()):date.getDate())})();

	var  model=new vue({
		el:"#container",
		data:{
			main:{//主表字段
				cus_number:login.cusNumber,
				id:'',
				clm_date:currentDay,
				clm_regular_leader:'',
				clm_deputy_leader:'',
				user_id:login.userId
			},
			subs:[],
			first:{
				cld_clm_id:'',
				cld_begin_time:'', 
				cld_end_time:'',
				cld_handle_situation:'',
				cld_handle_sender:'',
				cld_handle_receiver:'',
				cld_device_situation:'',
				cld_device_sender:'',
				cld_device_receiver:''
			},
			labelFlag:true,
			search:{
				clm_date_start:'',
				clm_date_end:'',
				cus_number:login.cusNumber
			},
			isPrinter:false
		},

		methods:{
			addTable:function(){
				var newTable = {
						cld_clm_id:'',
						cld_begin_time:'',
						cld_end_time:'',
						cld_handle_situation:'',
						cld_handle_sender:'',
						cld_handle_receiver:'',
						cld_device_situation:'',
						cld_device_sender:'',
						cld_device_receiver:''
					};
				model.subs.push(newTable);
			},
			delTable:function(index){
				model.subs.splice(index,1);
			},
			add:function(){
				resetItem();
				openTable();
			},
			close:function(){
				closeTable();
			},
			save:function(){
				if(model.main.id){
					//修改
					saveItemByEdit();
					table.method("refresh");
				}else{
					//新增
					saveItem();
					table.method("refresh");
				}
			},
			del:function(){
				delTableItem();
			},
			print:function(){
				if(model.main.id){
					dialog.open({
						id:'id1',
						type:1,
						title:'打印',
						w:100,
						h:100,
						url:'page/cds/dutyLog/printDutyLog.html?id=' + this.main.id
					});
				}else{
					tip.alert("请先保存");
				}
				
				
			},
			searchInfo:function(){
				table.method('refresh',{request:{
					sqlId:'query_ctrl_log_main',
					params:model.search,
					whereId:'0',
					orderId:'0'
					}
				})
			},
			resetSearch:function(){
				model.search.clm_date_start = '';
				model.search.clm_date_end = '';
				table.method('refresh',{request:{
					sqlId:'query_ctrl_log_main',
					params:{cus_number:login.cusNumber},
					orderId:"0",
					whereId:''
					}
				})
			}
		}
	});
	
	function closeSelf(){
		var parentDialog = window.frameElement.parentNode.parentNode;
			parentDialog.querySelector('a.layui-layer-close').click();
	}
	
	function resetItem(){
		model.subs = [];
		model.first={
			cld_clm_id:'',
			cld_begin_time:'',
			cld_end_time:'',
			cld_handle_situation:'',
			cld_handle_sender:'',
			cld_handle_receiver:'',
			cld_device_situation:'',
			cld_device_sender:'',
			cld_device_receiver:''
		};
		model.main.clm_regular_leader='';
		model.main.clm_deputy_leader='';
		model.main.id = '';
		model.main.clm_date=currentDay;
	}
	
	function saveItem(){
		
   	 	db.query({
			request:{
				sqlId:'query_ctrl_log_main',
				params:{
					clm_date:currentDay,
					cus_number:login.cusNumber
				},
				whereId:'1',
				orderId:'0'
			},success:function(data){
				if(data.length>0){
					tip.alert("今日已添加过值班日志");
					return false;
				}else{
					if(!validator())return;
					db.updateByParamKey({
						request:{
							sqlId:'insert_ctrl_log_main',
							params:model.main
						}, 
						success:function(data){
							var id = data.data[0].seqList[0];
							for(var i =0;i<model.subs.length;i++){
								model.subs[i].cld_clm_id = id;
							}
							var list = [];
							list = model.subs.concat();
							model.first.cld_clm_id = id;
							list.splice(0,0,model.first);
							db.updateByParamKey({
								request:{
									sqlId:'insert_ctrl_log_detail',
									params:list
								},success:function(data){
									tip.alert("保存成功");
									table.method('refresh');
									closeTable();
								},error:function(){
									tip.alert("保存失败，请稍后再试");
								}
							});
						}
					});
				}
				
			}
		});
		
		

	}
	
	function saveItemByEdit(){
		if(!validator())return;
		model.main.clm_id = model.main.id;
		db.updateByParamKey({
			request:{
				sqlId:'update_ctrl_log_main',
				params:model.main
			}, 
			success:function(data){
				db.updateByParamKey({
					request:{
						sqlId:'del_ctrl_log_detail',
						params:{cld_clm_id:model.main.id}
					},success:function(data){
						for(var i =0;i<model.subs.length;i++){
							model.subs[i].cld_clm_id = model.main.id;
						}
						var list = [];
						list = model.subs.concat(); 
						model.first.cld_clm_id = model.main.id;
						//model.subs.splice(0,0,model.first);
						list.splice(0,0,model.first)
						db.updateByParamKey({
							request:{
								sqlId:'insert_ctrl_log_detail',
								params:list
							},success:function(data){
								closeTable();
								tip.alert("保存成功");
								table.method('refresh');
								
							},error:function(){
								tip.alert("保存失败，请稍后再试");
							}
						});
					}
				});
			}
		});
	}
	
	function delTableItem(){
		var list = $("#table").bootstrapTable('getSelections');
		if(!list.length){
			tip.alert("请选择要删除的记录");
			return;
		}else{
			tip.confirm('确定要删除选择的记录吗？',function(){
				var arr = [];
				for(var i = 0;i<list.length;i++){
					arr.push({
						clm_id:list[i].clm_id,
						user_id:login.userId
					});
				}
				db.updateByParamKey({
					request:{
						sqlId:'del_ctrl_log_main',
						params:arr
					},success:function(data){
						tip.alert("删除成功"); 
						table.method('refresh');
					},error:function(){
						tip.alert("删除成功，请稍后再试");
					}
				});
			})
		}

	}
	
	
	
	//table表
	table.init("table",{
		request:{
			sqlId:'query_ctrl_log_main',
			params:{cus_number:login.cusNumber},
			orderId:"0"
		},
		columns: [[  
					{
					    field: 'state',
					    checkbox: true
					},
	                 {
	                    title: '日期',
	                    field: 'clm_date',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '正班领导',
	                    field: 'clm_regular_leader',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '副班领导',
	                    field: 'clm_deputy_leader',
	                    align: 'center',
	                    valign: 'middle'
	                }
	              ]],
         onClickRow:function(row){
        	model.main.id = row.clm_id;
			model.main.clm_date=row.clm_date;
			model.main.clm_regular_leader=row.clm_regular_leader;
			model.main.clm_deputy_leader=row.clm_deputy_leader;
			openTable();
			$(".printBtnSH").show(); 
        	db.query({
					request:{
						sqlId:'query_ctrl_log_detail',
						params:{
							cld_clm_id:row.clm_id
						},
						whereId:'0',
						orderId:'0'
					},success:function(data){
						if(data.length){
							model.first = data[0];
							data.splice(0,1);
							model.subs = data;
						}
						
						
					}
				});
         }
	});
	
	function closeTable(){
		 $("#constd").hide();
		 model.labelFlag = true;
		 $(".printBtnSH").hide();
	}
	
	function openTable(){
		$("#constd").show();
		 model.labelFlag = false;
		
	}
	
	function validator(){
		 if(model.main.clm_regular_leader.length > 20){tip.alert('正班领导过长，不应超过20字');return false}
		 if(model.main.clm_deputy_leader.length > 20){tip.alert('副班领导过长，不应超过20字');return false}
		 var list = model.subs.concat();
		 list.splice(0,0,model.first);
		 
     	 for(var i = 0;i<list.length;i++){
     		if(list[i].cld_begin_time.length>20){tip.alert('第'+(i+1)+'条记录,开始时间过长，请输入小于20字'); return false;}
     		if(list[i].cld_end_time.length>20){tip.alert('第'+(i+1)+'条记录,结束时间过长，请输入小于20字'); return false;}
     		
     		if(list[i].cld_begin_time && list[i].cld_end_time){
     			var a = list[i].cld_begin_time.split(":");
     			var b = list[i].cld_end_time.split(':'); 
     			var a1 =  parseInt(a[0])*60+parseInt(a[1]);
     			var b1 = parseInt(b[0])*60+parseInt(b[1]);
     			if(a1>b1){
     				tip.alert('第'+(i+1)+'条记录,结束时间不能小于开始时间');
     				return false;
     			}
     		}
     		
     		if(list[i].cld_handle_situation.length>700){tip.alert('第'+(i+1)+'条记录,处理情况过长，请输入小于700字'); return false;}
     		if(list[i].cld_handle_sender.length>20){tip.alert('第'+(i+1)+'条记录,处置情况交班警察过长，请输入小于20字'); return false;}
     		if(list[i].cld_handle_receiver.length>20){tip.alert('第'+(i+1)+'条记录,处置情况接班警察过长，请输入小于20字'); return false;}
     		if(list[i].cld_device_situation.length>20){tip.alert('第'+(i+1)+'条记录,设备情况过长，请输入小于20字'); return false;}
     		if(list[i].cld_device_sender.length>20){tip.alert('第'+(i+1)+'条记录,设备交班警察过长，请输入小于20字'); return false;}
     		if(list[i].cld_device_receiver.length>20){tip.alert('第'+(i+1)+'条记录,设备接班警察过长，请输入小于20字'); return false;}
     	 }
     	 return true;
	}

	

});