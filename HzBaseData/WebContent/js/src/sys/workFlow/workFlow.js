define(function(require){
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var table = require('frm/table');
	var dialog = require('frm/dialog');
	var tip = require('frm/message');
	var modelData = require('frm/model');
	var sp = require('frm/pinyin');
	var user = require('frm/loginUser');
	
	var flowList=$("#flowList");
	var groups=$("#flowGroup");
	var flag=false,type=false,first=true;
	
	//搜索
	flowList.find("input:first").keyup(function(){
		var key=!this.value?'':this.value.trim();
		var flag=/.*[\u4e00-\u9fa5]+.*$/g.test(key);
		key&&groups.children("li").each(function(){
			if(flag){
				if(this.innerHTML.indexOf(key) < 0){
					this.style.display="none";
				}else{
					this.style.display="block";
				}
			}else{
				if(sp.convertFirstPinyin(this.innerHTML).indexOf(key)<0){
					this.style.display="none";
				}else{
					this.style.display="block";
				}
			}
		});
	});
	
	//创建模型
	var model=new vue({
		el:'#flowList',
		data:{
			list:[],
			flowgroup:{
				'fti_cus_number':user.cusNumber,
				'fti_id':'',
				'fti_name':'',
				'fti_key':'',
				'fti_seq':'',
				'fti_crte_user_id':user.userId,
				'fti_updt_user_id':user.userId,
				'wfi_cus_number':user.cusNumber,
				'wfi_id':'',
				'wfi_type_id':'',
				'wfi_name':'',
				'wfi_role_id':'',
				'wfi_pre_id':'',
				'wfi_back_id':'',
				'wfi_first':'',
				'wfi_last':'',
				'wfi_seq':'',
				'wfi_crte_user_id':user.userId,
				'wfi_updt_user_id':user.userId
				
			}
		},
		methods:{
			refresh:function(item,that){
				first=false;
				var _this=event.target
				modelData.modelData(model.flowgroup,item);
				model.flowgroup['fti_id']=model.flowgroup['wfi_type_id']=item['fti_id'];
				table.method("refresh",{request:{whereId:'0',params:{'wfi_cus_number':model.flowgroup['wfi_cus_number'],'wfi_type_id':item['fti_id']}}});
			}
		}
	});
	
	
	//table表流程详细表
	table.init("table",{
		request:{
			sqlId:'query_work_flow_info',
			orderId:'0',
			whereId:'0',
			params:{
				'wfi_cus_number':model.flowgroup['wfi_cus_number'],
				'wfi_type_id':model.flowgroup['wfi_type_id']
			}
		},
		search:{
			key:'wfi_name',
			whereId:'1'
		},
		columns: [[  
					{
					    field: 'state',
					    radio: true
					},
	                  {
	                    title: '流程编号',
	                    field: 'wfi_id',
	                    align: 'center',
	                    valign: 'middle'
	                },{
	                    title: '流程名称',
	                    field: 'wfi_name',
	                    align: 'center',
	                    valign: 'middle'
	                },{
	                    title: '执行角色',
	                    field: 'wfi_role_id',
	                    align: 'center',
	                    valign: 'middle'
	                }, {
	                    title: '上一步流程',
	                    field: 'wfi_pre_id',
	                    align: 'center',
	                    valign: 'middle'
	                }, {
	                    title: '下一步流程',
	                    field: 'wfi_back_id',
	                    align: 'center',
	                    valign: 'middle'
	                }, {
	                    title: '排列顺序',
	                    width:'20',
	                    field: 'wfi_seq',
	                    align: 'center',
	                    valign: 'middle'
	                }
	              ]],
         onClickRow:function(row){
//        	 if(first){
//        		 var list=model.list;
//        		 for(var i =0,len=list.length;i<len;i++){
//        			 if(row['wfi_id']==list[i]['wfi_id']){
//        				 model.flowgroup['wfi_name']=list[i]['wfi_name'];
//        				 break;
//        			 }
//        		 }
//        	 }
//        	 modelData.modelData(model.flowgroup,row);
//        	 
//  
//        	 
//        	 type=true;
//        	 dialog.open({targetId:'constd',title:'编辑常量',h:"300",modal:true,shadeClose:true});
         }
	});
	
	
	
	//设置选中状态
	flowList.on("click","li",function(){
		flowList.find("li").removeClass("active");
		$(this).addClass("active");
	});
	
	//流程分类维护按钮
	$("#groupbtn").on("click","a",function(){
		if(this.textContent=="添加"){
			flag=false;
			flowList.find("li").removeClass("active");
			dialog.open({targetId:'flowgroup',title:'新增',h:"300"});
			model.flowgroup['fti_name']=model.flowgroup['fti_key']=model.flowgroup['fti_seq']='';
			return;
		}
		
		var item=groups.find("li.active");
		if(!item.length){
			tip.alert("请先选中一条流程分类");
			return;
		}
		if($("#constgroup_con").length){ 
			if(!$("#constgroup_con").parent().is(':hidden')){
				tip.alert('请先关闭流程分类修改框');
				return;
			} 
		}
		
		if(this.textContent=="删除"){
			tip.confirm("是否删除已选中的流程分类？",function(){
				db.updateByParamKey({
					request:[{
						sqlId:'delete_work_flow_info',
						whereId:'0',
						params:[model.flowgroup]
					},{
						sqlId:'delete_flow_type_info',
						params:[model.flowgroup]
					}],
					success:function(){
						groupQuery();
						table.method("refresh",{request:{whereId:'0'}});
						tip.alert("删除成功");
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			});
			
		}else{//编辑
			flag=true;
			dialog.open({targetId:'flowgroup',title:'编辑',h:"300"});
		}
		
	});
	
	//流程分类保存
	$("#flowgroup").on("click","a",function(){
		if(validate(true))return;
		var request=[];
		if(flag){
			request=[{
				sqlId:'update_flow_type_info',
				params:[model.flowgroup]
			}];
		}else{
			request=[{
				sqlId:'insert_flow_type_info',
				params:[model.flowgroup]
			}];
		}
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				groupQuery();
				dialog.close();
				$("#constgroup_con").parent().hide();
				tip.alert("保存成功");
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	});
	
	//流程步骤维护按钮
	$("#oprbutton").on("click","a",function(){
		if(this.textContent=='添加'){
			if(!model.flowgroup['fti_name']){
				tip.alert("请先选择流程分类");
				return;
			}
			model.flowgroup['wfi_name']=model.flowgroup['wfi_role_id']='';
			model.flowgroup['wfi_seq']= getFlowIndex() + 1;
			dialog.open({targetId:'flows',title:'新增流程步骤',h:"300"});
		}else{
			var list=table.method("getSelections").map(function(row){
 	 			return {'wfi_cus_number':row['wfi_cus_number'],'wfi_type_id':row['wfi_type_id'],'wfi_id':row['wfi_id'],'wfi_pre_id':row['wfi_pre_id']};
 	 		});
			if(!list.length){
				tip.alert("请先选择要删除的项目");
				return;
			}
			if($("#flows_con").length){
				if(!$("#flows_con").parent().is(':hidden')){
					tip.alert('请先关闭常量修改框');
					return;
				}
			}
			model.flowgroup['wfi_id'] = list[0].wfi_pre_id;
			//删除
			tip.confirm("是否删除已勾选的流程？",function(index){
				
				db.updateByParamKey({
					request:[{
						sqlId:'delete_work_flow_info',
						whereId:'1',
						params:list
					},{
						sqlId:'update_work_flow_after_del',
						params:[model.flowgroup]
					}],
					success:function(){
						tip.alert("删除成功");
						if(model.flowgroup['fti_id'].length){
							table.method("refresh",{request:{whereId:'0',params:{'wfi_cus_number':model.flowgroup['fti_cus_number'],'wfi_type_id':model.flowgroup['fti_id']}}});
						}else{
							table.method("refresh");
						}
						var dataList=table.method("getData");
						if(dataList.length==list.length){
							table.method("prevPage");
						}
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});

			});
		}
	});
	
	//流程保存
	$("#flows").on("click","a",function(){
		if (validate(false))return;
		if(model.flowgroup['wfi_seq'] == 1){//添加第一个流程
			type = false;
			model.flowgroup['wfi_first'] = 1;
			model.flowgroup['wfi_last'] = 1;
			
		}else{
			type = true;
			var seq = model.flowgroup['wfi_seq'] - 1;
			model.flowgroup['wfi_first'] = 2;
			model.flowgroup['wfi_last'] = 1;
			model.flowgroup['wfi_pre_id'] = getFlowId(seq);
		}
		tip.saving();
		db.updateByParamKey({
			request:{
				sqlId:'insert_work_flow_first',
				params:[model.flowgroup]
			},
			success:function(data){
				!data.success&&tip.alert(data.respMsg);
				if(type){
					model.flowgroup['wfi_back_id'] = getFlowId(model.flowgroup['wfi_seq']);
					model.flowgroup['wfi_last'] = 2;
					model.flowgroup['wfi_id'] = getFlowId(model.flowgroup['wfi_seq'] - 1);
					updateBackFlow();
				}
				table.method("refresh",{request:{whereId:'0',params:{'wfi_cus_number':model.flowgroup['fti_cus_number'],'wfi_type_id':model.flowgroup['fti_id']}}});
				$("#flows_con").parent().hide();
				tip.alert("保存成功");
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
		
	});
	
	//更新上一条流程
	function updateBackFlow(){
		db.updateByParamKey({
			request:{
				sqlId:'update_work_flow_first',
				params:[model.flowgroup]
			},
			success:function(data){
				!data.success&&tip.alert(data.respMsg);
				table.method("refresh",{request:{whereId:'0',params:{'wfi_cus_number':model.flowgroup['fti_cus_number'],'wfi_type_id':model.flowgroup['fti_id']}}});
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	}
	
	//根据顺序获得流程编号
	function getFlowId(index){
		var flowid = '';
		db.query({
			request:{
				sqlId:'query_work_flow_info',
				whereId:'2',
				params:{
					'wfi_cus_number':model.flowgroup['fti_cus_number'],
					'wfi_type_id':model.flowgroup['fti_id'],
					'wfi_seq':index
				}
			},async:false,
			success:function(data){
				if(data.length > 0){
					flowid = data[0].wfi_id;
				}
			}, error:function(e){
				console.log("error----"+e);
			}
		});
		return flowid;
	}
	
	//流程顺序
	function getFlowIndex(){
		var res = 0;
		db.query({
			request:{
				sqlId:'query_work_flow_info',
				orderId:'0',
				whereId:'0',
				params:{
					'wfi_cus_number':model.flowgroup['fti_cus_number'],
					'wfi_type_id':model.flowgroup['fti_id']
				}
			},async:false,
			success:function(data){
				if(data.length > 0){
					res = data.length;
				}
			}, error:function(e){
				console.log("error----"+e);
			}
		});
		return res;
	}
	
	//流程分类标识验证
	function checkFlowTypeKey(){
		var f = false;
		db.query({
			request:{
				sqlId:'query_flow_type_info',
				whereId:'2',
				params:{
					'fti_cus_number':model.flowgroup['fti_cus_number'],
					'fti_key':model.flowgroup['fti_key']
				}
			},async:false,
			success:function(data){
				if(data.length > 0){
					f = true;
				}
			}, error:function(e){
				console.log("error----"+e);
			}
		});
		return f;
	}
	
	//分组查询
	function groupQuery(){
		db.query({
			request:{
				sqlId:'query_flow_type_info',
				whereId:'0',
				orderId:'0',
				params:{'fti_cus_number':model.flowgroup['fti_cus_number']}
			},async:false,
			success:function(data){
				model.list=data;
			}, error:function(e){
				console.log("error----"+e);
			}
		});
	}
	
	/**
	 * 表单验证
	 */
	function validate(flag){
		var f = false;
		if(flag){
			if(!model.flowgroup['fti_name'].length){
				tip.alert("请输入流程分类名称");
				f = true;
			}else if(!model.flowgroup['fti_key'].length){
				tip.alert("请输入流程分类标识");
				f = true;
			}else if(checkFlowTypeKey()){
				tip.alert("流程分类标识重复");
				f = true;
			}else if(!model.flowgroup['fti_seq'].length){
				tip.alert("请输入流程分类顺序");
				f = true;
			}
		}else{
			if(!model.flowgroup['wfi_name'].length){
				tip.alert("请输入流程名称");
				f = true;
			}else if(!model.flowgroup['wfi_role_id'].length){
				tip.alert("请输入执行角色");
				f = true;
			}
		}
		return f;
 	}
	
	
	try {
		groupQuery();
		console.log(JSON.stringify(user));
		
	} catch (e) {
		console.log("初始化数据失败!");
	}
	
});