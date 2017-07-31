define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/message","frm/model","frm/loginUser","frm/select"],function($,tpl,db,table,dialog,tip,modelData,login,select){
	
	
	var flag=false,type=false,first=true;
	//创建模型
	var model=new tpl({
		el:'#compolist',
		data:{
			compogroup:{ 
				'mci_cus_number':login.cusNumber,
				'mci_id':'',
				'mci_name':'',
       			'mci_path':'',
       			'mci_file_name1':'',
       			'mci_file_name2':'',
       			'mci_class':'',
       			'mci_type':'',
       			'mci_type_def':'',
			    'mci_order':'',
			    'mci_create_uid':login.userId,
			    'mci_create_us':'',
			    'mci_create_datetime':'',
			    'mci_update_uid':login.userId,
			    'mci_update_us':'',
			    'mci_update_datetime':''
			},
			mci_type:''
		},
		watch:{
			'compogroup.mci_class':function(v){
				this.mci_type = 'mci_type_'+v;
				this.$nextTick(function(){
					this.$refs['mcitype'].load();
				})
			}
		}
	});
	
	//table表
	table.init("table",{
		request:{
			sqlId:'query_component_info',
			orderId:'0'
		},
		search:{
			key:'mci_name',
			whereId:'1'
		},
		columns: [[  
					{
					    field: 'state',
					    checkbox: true
					},
	                {
	                    title: '组件名称',
	                    field: "mci_name",
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '组件路径',
	                    field: "mci_path",
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '组件文件名1',
	                    field: 'mci_file_name1',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '组件文件名2',
	                    field: 'mci_file_name2',
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                },
	                {
	                    title: '组件类别',
	                    field: 'mci_class',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '组件类型',
	                    field: 'mci_type',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '组件默认类型',
	                    field: 'mci_type_def',
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                },
	                {
	                    title: '排序',
	                    field: "mci_order",
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                },
	                {
	                    title: '创建人',
	                    field: "mci_create_us",
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '创建时间',
	                    field: "create_datetime",
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '更新人',
	                    field: 'mci_update_us',
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                },
	                {
	                    title: '更新时间',
	                    field: "update_datetime",
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                }
	              ]],
         onClickRow:function(row){
        	 type=true;
        	 modelData.modelData(model.compogroup,row);
        	 model.compogroup['mci_class'] = row.class;
        	 model.compogroup['mci_type'] = row.type;
        	 model.compogroup['mci_update_uid'] = login.userId;
        	 model.compogroup['mci_create_datetime'] = row.create_datetime;
        	 $(".form-group:nth-child(7),.form-group:last-child").show();
        	 dialog.open({targetId:'compotd',title:'修改',h:"290"});
         }
	});
	$("input.input-sm").attr("placeholder","请输入组件名称");
	//监内施工新增删除
	$("#oprbutton").on("click","a",function(){
		if(this.textContent=='添加'){
			type=false;
			model.compogroup['mci_name']=model.compogroup['mci_path']=model.compogroup['mci_file_name1']=model.compogroup['mci_file_name2']=
				model.compogroup['mci_class']=model.compogroup['mci_type']=model.compogroup['mci_order']=model.compogroup['mci_create_us']='';
			model.compogroup['mci_type_def']=1;
//			db.query({
//				request:{
//					sqlId:'query_odd_name',
//					params:[login.cusNumber]
//				},
//				success:function(data){
//					data=JSON.parse(JSON.stringify(data));
//					model.compogroup['odd_name']=data[0].odd_name;
//				}
//			});
			$(".form-group:nth-child(7),.form-group:last-child").hide();
			dialog.open({targetId:'compotd',title:'添加',h:"290"});
		}else{//记录删除
			
			var list=table.method("getSelections").map(function(row){
 	 			return {'mci_cus_number':row['mci_cus_number'],'mci_id':row['mci_id']};
 	 		});
			if(!list.length){
				tip.alert("请先选择要删除的项目");
				return;
			}
			//删除
			tip.confirm("是否删除已勾选的"+list.length+"条记录？",function(index){
				db.updateByParamKey({ 
					request:{
						sqlId:'delete_component_info',
						whereId:'0',
						params:list
					},
					success:function(){
						tip.alert("删除成功");
						dialog.close();
						if(model.compogroup['mci_id'].length){
							table.method("refresh",{request:{whereId:'0',params:{'mci_id':model.compogroup['mci_id']}}});
						}else{
							table.method("refresh");
						}
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			});
		}
	});
	
	//组件信息添加修改
	$("#save").on("click",function(event){
		if(validate(true))return;
		var sql;
		if(type){//修改
			sql="update_component_info"
		}
		else{//新增
			sql="insert_component_info"
		}
		
		tip.saving();
		db.updateByParamKey({
			request:{
				sqlId:sql,
				params:[model.compogroup]
			},
			success:function(data){
				!data.success&&tip.alert(data.respMsg);
				table.method("refresh",{request:{params:{'mci_id':model.compogroup['mci_id']}}});
				dialog.close();
				tip.alert("保存成功");
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	});
	//取消按钮
	$("#quit").click(function(){
		dialog.close();
	});
	function validate(flag){
		if(flag){
			model.compogroup['mci_type'];
			var reg=/^[1-9]*[1-9][0-9]*$/;

			return !model.compogroup['mci_name'].length&&!tip.alert("请输入组件名称")||
				!model.compogroup['mci_path'].length&&!tip.alert("请输入组件路径")||
				!model.compogroup['mci_file_name1'].length&&!tip.alert("请输入组件文件名1")||
				!model.compogroup['mci_file_name2'].length&&!tip.alert("请输入组件文件名2")||
				!String(model.compogroup['mci_class']).length&&!tip.alert("请选择组件类别")||
				model.compogroup['mci_type'].length<=0&&!tip.alert("请选择组件类型");
		}
	}
});