define(['jquery',"vue",'frm/hz.db',"ztree","frm/table","frm/dialog","frm/message","frm/model","frm/treeUtil","frm/loginUser","frm/select",'frm/treeSelect'],
		function($,vue,db,treeSelect,table,dialog,tip,modelUtil,util,loginUser,select,treeSelect){
	
	var roleTree,errorMessage;
	var index;//弹出框
	
	/*实例vue对象*/
	var model = new vue({
		el:"#rollcall",
		data:{
			callRoll:{
				tcm_cus_number:loginUser.cusNumber,
				tcm_begin_time:'',
				tcm_max_time:'',
				tcm_dept_id:'',
				//tcm_area_id:'',
				tcm_dept_name:'',
				count:'',
				tcm_crte_user_id:loginUser.userId,
				tcm_updt_user_id:loginUser.userId
			},
			selectDept:{
				cbd_cus_number:loginUser.cusNumber,
				tcm_dept_id:"",
				tcm_dept_name:''
			},
			time:[],
			endTimeList:[],
			startTime:"00:00",
			timeLength:"0",
			addFlag:false,  //新增标识
			treeList:[],
			dataList:[],
			testValue:"",
			searchStartTime:"",
			searchTimeLength:"",
			searchEndTimeList:"",
			tableData:[]
		
		},
		computed:{
			endTime:function(){
				var endTime;
				var arr=[];
				arr = this.startTime.split(":");
				var endM=parseInt(arr[1])+(parseInt(this.timeLength)?parseInt(this.timeLength):0);
				if(endM<60){
					endTime=arr[0]+":"+this.preFixInteger(endM,2);
				}else{
					endTime=parseInt(arr[0])+parseInt(endM/60)+":"+this.preFixInteger(parseInt(endM%60),2);
				}
				return endTime;
			},
			searchEndTime:function(){
				var endTime;
				var arr=[];
				arr = this.searchStartTime.split(":");
				var endM=parseInt(arr[1])+(parseInt(this.searchTimeLength)?parseInt(this.searchTimeLength):0);
				if(endM<60){
					endTime=arr[0]+":"+this.preFixInteger(endM,2);
				}else{
					endTime=parseInt(arr[0])+parseInt(endM/60)+":"+this.preFixInteger(parseInt(endM%60),2);
				}
				return endTime;
			}
		},
		methods:{
			preFixInteger:function(num,length){
				 return (Array(length).join('0') + num).slice(-length);
			},
			clickAdd:function(){
				//点击弹出框内新增按钮
				this.startTime="00:00";
				this.timeLength="1";
				this.addFlag=true;
			},
			clickSub:function(){
				//点击弹出框内确定按钮
				var _this=this;
				if(!_this.startTime){
					tip.alert("开始时间不正确");
				}else{
				if(_this.timeLength<=0 || _this.timeLength>5){
					tip.alert("点名时长为1~5分钟");
				}else{
					this.addFlag=false;
					if(_this.time.length>0){
						for (var i = 0 ; i <_this.time.length;i++) {
							if(_this.parseData(_this.startTime)>=_this.parseData(_this.time[i].startTimeArr) && _this.parseData(_this.startTime)<=_this.parseData(_this.time[i].endTimeArr)){
								tip.alert("该时间段已存在，请重新选择");
								return;
							}else{
								_this.endTimeList.push(_this.endTime);
								_this.time.push({startTimeArr:_this.startTime,timeLengthArr:_this.timeLength,endTimeArr:_this.endTime});
								return;
							}
						}
					}else{
						_this.endTimeList.push(_this.endTime);
						_this.time.push({startTimeArr:_this.startTime,timeLengthArr:_this.timeLength,endTimeArr:_this.endTime});
					}
				}
			}
			},
			removeDom:function(index){
				this.time.splice(index,1);
				this.endTimeList.splice(index,1);
			},
			parseData:function(data){
				//解析"hh-mm"
				var a=[];
				a=data.split(":");
				var b;
				b=parseInt(a[0])*60+parseInt(a[1]);
				return b;
				
			},
			closeDialog:function(){
				//保存、取消的回调
				this.time=[];
				this.endTimeList=[];
				this.treeList=[];
				this.dataList=[];
				this.addFlag=false;
				this.startTime="00:00";
				this.timeLength="1";
				var childNodes =roleTree.getCheckedNodes(true);
				for (var i=0, l=childNodes.length; i < l; i++) {
					roleTree.checkNode(childNodes[i], false, true);
				}
				$('#operPanel_con').parent().hide();
				table.method("refresh");
				
			},
			resetDialog:function(){
				this.time=[];
				this.endTimeList=[];
				this.treeList=[];
				this.dataList=[];
				this.addFlag=false;
				this.startTime="00:00";
				this.timeLength="1";
				var childNodes =roleTree.getCheckedNodes(true);
				for (var i=0, l=childNodes.length; i < l; i++) {
					roleTree.checkNode(childNodes[i], false, true);
				}
			},
			searchTable:function(){
				//查询
				if(!this.searchStartTime && !this.searchTimeLength && !this.selectDept.tcm_dept_id){
					refreshTable('0',{tcm_cus_number:loginUser.cusNumber});
				}else {
					if(!this.searchTimeLength){
						refreshTable('1',{
		    						tcm_cus_number:loginUser.cusNumber,
		    						tcm_begin_time:model.searchStartTime,
		    						tcm_max_time:model.searchTimeLength,
		    						tcm_dept_id:this.selectDept.tcm_dept_id,
		    						tcm_end_time:model.searchStartTime
		    					})
					}else{
						this.searchEndTimeList=this.searchEndTime;
						refreshTable('1',{
		    						tcm_cus_number:loginUser.cusNumber,
		    						tcm_begin_time:model.searchStartTime,
		    						tcm_max_time:model.searchTimeLength,
		    						tcm_dept_id:this.selectDept.tcm_dept_id,
		    						tcm_end_time:model.searchEndTime
		    					});
					}
				}
			},
			resetSearchTable:function(){
				this.searchStartTime="";
				this.searchTimeLength="";
				this.selectDept.tcm_dept_id="";
				this.selectDept.tcm_dept_name="";
				table.method("refresh",{
					request:{
						sqlId:'select_timing_call_roll_list',
						whereId:'0',
						orderId:'0',
						params:{
							tcm_cus_number:loginUser.cusNumber
						}
					}
			 	})
			},
			saveItem:function(){
				this.treeList=[];
				//this.time=[];
				var _this=this;
				var _thisTime=this.time;
				var _thisTree = this.treeList;
				var childNodes =roleTree.getCheckedNodes(true); 
				
				if(this.time.length<=0){
					tip.alert("请选择点名时间");
					return ;
				} else {
					if(childNodes.length){
						for(var i =0;i<childNodes.length;i++){
							if(!childNodes[i].isParent){
								_thisTree.push(childNodes[i].id);
							}
						}
					}else{
						_thisTree.push('');
					}
					var saveList = [];
					for(var i=0;i<_thisTime.length;i++){
						for(var j=0;j<_thisTree.length;j++){
							saveList.push({
								tcm_cus_number:loginUser.cusNumber,
								tcm_begin_time:_thisTime[i].startTimeArr,
								tcm_max_time:_thisTime[i].timeLengthArr,
								tcm_dept_id:_thisTree[j],
								tcm_crte_user_id:loginUser.userId,
								tcm_updt_user_id:loginUser.userId,
								tcm_area_id:""
							});
						}
					}

					var tabData, saveData;
					for(var i = 0; i < _this.tableData.length; i++) {
						tabData = _this.tableData[i];
						console.log(tabData.tcm_begin_time);
						for(var j = 0; j < saveList.length; j++){
						//while(saveList.length){
							saveData = saveList.shift();
							if (parseDataType(saveData.tcm_begin_time) >= parseDataType(tabData.tcm_begin_time) 
									&& parseDataType(saveData.tcm_begin_time) <= getEndTime(tabData.tcm_begin_time,tabData.tcm_max_time)) {
								if (tabData.tcm_dept_id) {
									if(saveData.tcm_dept_id){
									if (tabData.tcm_dept_id != saveData.tcm_dept_id) {
										saveList.push(saveData);
									}
									}
								}
							} else {
								saveList.push(saveData);
							}
						}
					}
					//保存记录
					if(saveList.length){
						while(saveList.length) {
							saveRollCallData(saveList.shift());
						}
					}else{
						tip.alert("时间段已存在，请重新选择");
					}
				}
			}
		}
	});
	
	function parseDataType(data){
		//解析"hh-mm"
		var a=[];
		a=data.split(":");
		var b;
		b=parseInt(a[0])*60+parseInt(a[1]);
		return parseInt(b);
	}
	
	function getEndTime(startTime,timeLength){
		var time = parseDataType(startTime);
		var timeAll=time+timeLength;
		return parseInt(timeAll);
	}
	
	//人员名单
		table.init("peopleTable",{
			request:{
				sqlId:'select_timing_call_roll_prisoner',
				params:{
					tcm_cus_number:loginUser.cusNumber,
					tcm_dept_id:model.testValue
				}
			},
			columns: [[
		                  {
		                    title: '人员姓名',
		                    field: 'pbd_prsnr_name', 
		                    align: 'center',
		                    valign: 'middle'
		                },
		                {
		                    title: '人员编号',
		                    field: 'pbd_prsnr_id',
		                    align: 'center',
		                    valign: 'middle'
		                }
		              ]]
		})

		
	
	
	
	
	//table表
	table.init("table",{
		request:{
			sqlId:'select_timing_call_roll_list',
			whereId:'0',
			orderId:'0',
			params:{
				tcm_cus_number:loginUser.cusNumber
			}
		},
		
		columns: [[  
					{
					    field: 'state',
					    checkbox: true
					},
	                  {
	                    title: '点名时间',
	                    field: 'tcm_begin_time', 
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '时长（分钟）',
	                    field: 'tcm_max_time',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '所属部门',
	                    field: 'tcm_dept_name',
	                    align: 'center',
	                    valign: 'middle',
	                    formatter:function(data,type,row){
	                    	if(data){
	                    		return data;
	                    	}else {
	                    		return "所有部门"
	                    	}
	                    }
	                },
	                {
	                    title: '被点人员',
	                    field: 'count',
	                    align: 'center',
	                    valign: 'middle',
	                    formatter:function(data,type,row){
	                    	return "<button class='hbtn btn_primary btn_large'>查询</button>"
	                    }
	                }
	              ]],
              onClickCell:function(field, value, row){
      			if(field == 'count'){
      				tableColQuery(row);
      			}
      		},
      		onLoadSuccess:function(data){
      			model.tableData=data.rows;
      		}
	});
	
	//删除
	$("#del").on('click',function(){
		var list=table.method("getSelections");
		if(!list.length){
			tip.alert("请先选择要删除的项目");
			return;
		}
		//删除
		tip.confirm("确认删除吗？",function(index){
			db.updateByParamKey({ 
				request:{
					sqlId:'delete_timing_call_roll_data',
					whereId:0,
					params:list
				},
				success:function(){
					tip.alert("删除成功");
					table.method("refresh");
					reloadTimingData();
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		});
	})
	
	
	function tableColQuery(value){
		var testValue=value.tcm_dept_id;
		console.log(testValue);
		$("#peopleTable").bootstrapTable("refresh",{
			request:{
				sqlId:'select_timing_call_roll_prisoner',
				whereId:0,
				params:{
					tcm_cus_number:loginUser.cusNumber,
					tcm_dept_id:testValue
				}
			}
		});
		dialog.open({
			targetId:"openQuery",
			title:"人员名单查询",
		    w:'804px',
	    	h: 475,
	    	callback:function(){
	    		console.log($("#peopleTable"))
	    		
	    		//table.method("refresh");
	    	}
		});
		
	}
	
	$("#rollcall").on("click",".buttons a",function(){
		if(this.textContent=="新增"){
			dialog.open({targetId:'operPanel',title:'新增信息',w:"835px"});
		}else if(this.textContent=="查询"){
			dialog.open({targetId:'searchTable',title:'查询信息',w:'430px',h:'240px'})
		}
	});
	/*部门选择*/
	db.query({
		request:{
			sqlId:'select_pn_org_dept',
			whereId:'0',
			params:[loginUser.cusNumber]
			
		},
		success:function(data){
			//左侧菜单
	 		var set={
	 				data: {simpleData: {enable: true,pIdKey: "pid"}},
	 				check:{enable:true,chkStyle: "checkbox",chkboxType: { "Y": "ps", "N": "s" }},
	 				callback:{
	 					onCheck:zTreeOnCheck
	 				}
	 			}
			roleTree=$.fn.zTree.init($("#roleopr"),set,data);
	 		roleTree.expandAll(true);
	 		
		}
	});
	
	
	db.query({
		request:{
			sqlId:'select_org_dept',
			whereId:'0',
			params:[loginUser.cusNumber]
		},success:function(data){
			var set={
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(id,e,node){
							if(!node.isParent){
								model.selectDept.tcm_dept_name = node.name;
								model.selectDept.tcm_dept_id = node.id;
							}
						}
					}
			}
			treeSelect.init("callRollDep", set,data).expandAll(true);
		}
	})


	
	function zTreeOnCheck(event, treeId, treeNode) {
	    //model.treeList.push(treeNode.tId);
	};
	
	//保存定时点名配置
	function saveRollCallData(params){
		db.updateByParamKey({
			request:{
				sqlId:'insert_timing_call_roll_data',
				whereId:'0',
				params:params
				
			},
			success:function(data){
				model.closeDialog();
				reloadTimingData();
			},
			error:function(code,msg){
				errorMessage+=msg;
				errorMessage+='<br/>'
			}
		});
	}
	//表格刷新方法
	function refreshTable(whereId,param){
		table.method("refresh",{
		 	request:{
		 		sqlId:'select_timing_call_roll_list',
				whereId:whereId,
				orderId:'0',
				params:param
		 	}
	 	})
	}
	

	/*
	 * 刷新定时任务缓存数据
	 */
	function reloadTimingData () {
		db.refreshCache({
			request: {
				'serviceName': 'timingCallrollWorkCache',
				'action': 'update'
			},
			success: function (result) {
				console.log('刷新定时任务缓存数据 --> ', result);
			},
			error: function (code, desc) {
				console.error('刷新定时任务缓存数据 --> ' + code + '-' + desc);
			}
		});
	}
})