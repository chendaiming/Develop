define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/message","frm/model","frm/loginUser","frm/select"],
		function($,tpl,db,table,dialog,tip,modelData,loginUser,select){
	var handFlowBody=$("#handFlowBody");
	var handFlowList=$("#handFlowList");
	var isAddFlag = true,isAddFlagByItem = true;	//是新增标识
	var validateFlag = true;// 流程验证true /流程项验证false
	//搜索
	handFlowBody.find("input:first").keyup(function(){
		var key=this.value;
		handFlowList.children("li").each(function(){
			if(key&&this.innerHTML.indexOf(key)<0){
				this.style.display="none";
			}else{
				this.style.display="block";
			}
		});
	});
	//创建模型
	var model=new tpl({
		el:'#handFlowBody',
		data:{
			list:[],
			handleFlow:{ 
				//流程
				'hfm_cus_number':loginUser.cusNumber,
				'hfm_flow_id':'',
				'hfm_flow_name':'',
				'hfm_type_indc':'',
				'hfm_show_seq':'',
				'hfm_crte_time':'',
				'hfm_crte_user_id':loginUser.userId,
				'hfm_updt_time':'',
				'hfm_updt_user_id':loginUser.userId,
				//流程项
				'hfd_cus_number':loginUser.cusNumber,
				'hfd_flow_id':'',
				'hfd_flow_item_id':'',
				'hfd_flow_item_name':'',
				'hfd_flow_order':'',
				'hfd_crte_user_id':loginUser.userId,
				'hfd_updt_user_id':loginUser.userId
			}
		},
		methods:{
			refresh:function(item,that){
				modelData.modelData(model.handleFlow,item);
				refreshTable();
			}
		}
	});
	//设置选中状态
	handFlowBody.on("click","li",function(){
		handFlowBody.find("li").removeClass("active");
		$(this).addClass("active");
	});
	
	//初始化表格
	var initTable = function(id){
		table.init("table",{
			request:{
				sqlId:'select_alarm_handle_flow_item',
				orderId:'0',
				whereId:'0',
				params:{
					'hfd_cus_number':loginUser.cusNumber,
					'hfd_crte_user_id':loginUser.userId,
					'hfd_flow_id':id
				}
			},
			search:{
				key:'hfd_flow_item_name',
				whereId:'1'
			},
			columns: [[  
						{
						    field: 'state',
						    checkbox: true
						},{
		                    title: '流程项名称',
		                    field: 'hfd_flow_item_name',
		                    align: 'center',
		                    valign: 'middle'
		                },{
		                    title: '排列序号',
		                    field: 'hfd_flow_order',
		                    width:'20',
		                    align: 'center',
		                    valign: 'middle'
		                }
		              ]],
	         onClickRow:function(row){
        		 var list=model.list;
        		 for(var i = 0, len = list.length; i < len; i++){
        			 if(row.handle_flow_item_id == list[i].handle_flow_item_id){
        				 model.handleFlow.hfd_flow_item_name = list[i].hfd_flow_item_name;
        				 break;
        			 }
        		 }
	        	 modelData.modelData(model.handleFlow,row);
	        	 isAddFlagByItem = false;	//标识修改
	        	 dialog.open({targetId:'updateHandleFlowItem',title:'编辑',h:"200",w:'500'});
	         }
		});
	}
	
	
	//处置流程增删改-弹窗
	$("#handleFlowGroupBtn").on("click","a",function(){
		if(this.textContent=="添加"){
			dialog.open({targetId:'updateHandleFlow',title:'新增',h:"250",w:'500'});
			model.handleFlow.hfm_flow_id = '';
			model.handleFlow.hfm_flow_name = '';
			model.handleFlow.hfm_type_indc = '';
			model.handleFlow.hfm_show_seq = '';
			isAddFlag = true;
			return;
		}
		
		var item=handFlowList.find("li.active");
		if(!item.length){
			tip.alert("请先选择处置流程");
			return;
		}
		if(this.textContent=="删除"){
			//验证修改框
			if(validateDialog())return;

			tip.confirm("是否删除已勾选的"+item.length+"个流程？",function(){
				db.updateByParamKey({
					request:[{
						sqlId:'delete_alarm_handle_flow',
						whereId:'0',
						params:{
							'hfm_cus_number':loginUser.cusNumber,
							'hfm_crte_user_id':loginUser.userId,
							'hfm_flow_id':model.handleFlow.hfm_flow_id
						}
					},{
						sqlId:'delete_alarm_handle_flow_item',
						whereId:'0',
						params:{
							'hfd_cus_number':loginUser.cusNumber,
							'hfd_crte_user_id':loginUser.userId,
							'hfd_flow_id':model.handleFlow.hfm_flow_id
						}
					}],
					success:function(){
						handleFlowQuery();
						refreshTable();
						tip.alert("删除成功");
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			});
			
		}else{//编辑
			isAddFlag = false;
			dialog.open({targetId:'updateHandleFlow',title:'编辑',h:"250",w:'500'});
		}
	});
	
	//流程项新增删除
	$("#handleFlowItemGroupBtn").on("click","a",function(){
		if(this.textContent=='添加'){
			isAddFlagByItem = true;
			if(String(model.handleFlow.hfm_flow_id) == ''){
				tip.alert("请先选择处理流程");
				return;
			}
			model.handleFlow.hfd_flow_item_id = '';
			model.handleFlow.hfd_flow_item_name = '';
			model.handleFlow.hfd_flow_order = '';
			isAddFlagByItem = true;		//标识添加
			dialog.open({targetId:'updateHandleFlowItem',title:'新增',h:"200",w:'500'});
		}else{//流程项删除
			var list=table.method("getSelections").map(function(row){
 	 			return {
 	 				'hfd_flow_item_id':row.hfd_flow_item_id,
 	 				'hfd_cus_number':loginUser.cusNumber,
 	 				'hfd_crte_user_id':loginUser.userId
 	 			}
 	 		});

			//验证修改框
			if(validateDialog()) return;

			if(!list.length){
				tip.alert("请先选择要删除的流程项");
				return;
			}
			//删除
			tip.confirm("是否删除已勾选的"+list.length+"个常量键值对？",function(index){
				db.updateByParamKey({ 
					request:{
						sqlId:'delete_alarm_handle_flow_item',
						whereId:'1',
						params:list
					},
					success:function(){
						tip.alert("删除成功");
						refreshTable();
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			});
		}
	});
	
	//处置流程 添加/修改
	$("#updateHandleFlow").on("click","#saveHandleFlow",function(){
		if(validate(true))return;
		var sql;
		if(isAddFlag){//新增
			sql="insert_alarm_handle_flow"
		}else{//修改
			sql="update_alarm_handle_flow"
		}
		tip.saving();
		db.updateByParamKey({
			request:{
				sqlId:sql,
				whereId:0,
				params:model.handleFlow
			},
			success:function(data){
				!data.success&&tip.alert(data.respMsg);
				handleFlowQuery();
				dialog.close();
				tip.alert("保存成功");
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	});
	
	//刷新表格
	function refreshTable(){
		table.method("refresh",{
			request:{
				whereId:0,
				orderId:0,
				params:{
					'hfd_cus_number':loginUser.cusNumber,
					'hfd_crte_user_id':loginUser.userId,
					'hfd_flow_id':model.handleFlow.hfm_flow_id
				}
			}
		});
	}
	
	//处置流程项 添加/修改
	$("#updateHandleFlowItem").on("click","#saveHandleFlowItem",function(){
		if(validate(false))return;
		var sql;
		if(isAddFlagByItem){//新增
			sql="insert_alarm_handle_flow_item"
		}else{//修改
			sql="update_alarm_handle_flow_item"
		}
		tip.saving();
		model.handleFlow.hfd_flow_id = model.handleFlow.hfm_flow_id;
		db.updateByParamKey({
			request:{
				sqlId:sql,
				whereId:0,
				params:model.handleFlow
			},
			success:function(data){
				dialog.close();
				refreshTable();
				tip.alert("保存成功");
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	});
	//查询处置流程
	function handleFlowQuery(){
		db.query({
			request:{
				sqlId:'select_alarm_handle_flow',
				whereId:0,
				orderId:0,
				params:[loginUser.cusNumber]
			},
			success:function(data){
				model.list=data;
				modelData.modelData(model.handleFlow,data[0]);
				initTable(data.length > 0 ? data[0].hfm_flow_id : '');
			}
		});
	}
	handleFlowQuery();

	//验证弹出框
	function validateDialog(){
		if($("#updateHandleFlow_con").length){
			if(!$("#updateHandleFlow_con").parent().is(':hidden')){
				tip.alert('请先关闭处置流程弹出框');
				return true;
			}
		}
		if($("#updateHandleFlowItem_con").length){
			if(!$("#updateHandleFlowItem_con").parent().is(':hidden')){
				tip.alert('请先关闭处置流程项弹出框');
				return true;
			}
		}
		return false;
	}
	
	function validate(validateFlag){
		if(validateFlag){
			return !model.handleFlow.hfm_flow_name.length && !tip.alert("请输入流程名称")||
			!String(model.handleFlow.hfm_type_indc) && !tip.alert("请选择流程类型")||
			!model.handleFlow.hfm_show_seq && !tip.alert("请输入排列序号")||
			(!/^[0-9]+$/.test(model.handleFlow.hfm_show_seq)) && !tip.alert("流程序号为整数");
		}
		return  !model.handleFlow.hfd_flow_item_name.length && !tip.alert("请输入流程项名称")||
				!model.handleFlow.hfd_flow_order && !tip.alert("请输入排列序号")||
				(!/^[0-9]+$/.test(model.handleFlow.hfd_flow_order)) && !tip.alert("排列序号为整数");
 	}
});