define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/message","frm/model","frm/select","frm/loginUser"],
	function($,vue,db,table,dialog,message,modelData,select,user){
	var type=false;
	let personKey = document.getElementById("personKey");
	//创建模型
	var model=new vue({
		el:'#rfidPanel',
		data:{
			list:[],
			person:{},//人员信息
			rfidBind:{ 
				'rpb_bind_id':'',
				'rpb_cus_number':user.cusNumber,
				'rpb_label_type':'',
				'rpb_label_id':'',
				'rpb_people_type':'',
				'rpb_people_id':'',
				'rpb_people_name':''
			}
		},
		methods:{
			selectKey:function(item){
				var index=personKey.dataset.index;
				model.rfidBind.rpb_people_id=item.person_id;
				model.rfidBind.rpb_people_name=item.person_name+'-'+item.person_id;
				personKey.style.display='none';
			},
			selectType:function(){
				model.rfidBind.rpb_people_id='';
				model.rfidBind.rpb_people_name='';
			}
		}
	});

	//table表
	table.init("table",{
		request:{
			sqlId:'select_rfid_bind_data',
			whereId:'0',
			params:{
				rpb_cus_number:user.cusNumber
			}
		},
		search:{
			key:'rpb_label_id',
			whereId:'1'
		},
		columns: [[  
					{
					    field: 'state',
					    checkbox: true
					},
	                  {
	                    title: '标签类型',
	                    field: 'rpb_label_type_name', 
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '标签编号',
	                    field: 'rpb_label_id',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '人员类型',
	                    field: 'rpb_people_type_name',
	                    align: 'center',
	                    valign: 'middle'
	                },
					{
						title: '部门',
						field: 'dept_name',
						align: 'center',
						valign: 'middle'
					},
	                {
	                    title: '人员姓名',
	                    align: 'center',
	                    valign: 'middle',
						formatter:function(value,row,index){
							return row.rpb_people_name+'-'+row.number_id;
						}
	                }
	              ]],
         onClickRow:function(row){
			 type=true;
			 dialog.open({targetId:'operPanel',title:'修改绑定',h:"300",modal:true});
        	 modelData.modelData(model.rfidBind,row);
			 model.rfidBind.rpb_people_name = row.rpb_people_name+'-'+row.number_id;
         }
	});

	$("#person_id").keyup(function(e){
		!model.rfidBind.rpb_people_type && !message.alert("请先选择人员类型");
		var pos=e.target.getBoundingClientRect();
		personKey.style.left=pos.left;
		personKey.style.top=pos.top+e.target.clientHeight-4;
		personKey.style.width=e.target.clientWidth;
		personKey.style.display='block';
		if(model.rfidBind.rpb_people_type == 1){//民警
			person_search('query_policeType_info','0',{'pbd_police_name':model.rfidBind.rpb_people_name},0)
		}else if(model.rfidBind.rpb_people_type == 2){//犯人
			person_search('query_prisonerType_info','0',{'pbd_prsnr_name':model.rfidBind.rpb_people_name},0)
		}
	});
	//人员搜索
	function person_search(sqlId,whereId,params,orderId){
		db.query({
			request:{
				sqlId:sqlId,
				params:params,
				whereId:whereId,
				orderId:orderId
			},
			success:function(data){
				model.person = data;
			}
		})
	}

	//添加
	$("#addRfidBind").on('click',function(){
		type=false;
		modelData.clear(model.rfidBind,{'rpb_cus_number':user.cusNumber});
		dialog.open({targetId:'operPanel',title:'新增绑定',h:"300"});
	})
	
	//删除
	$("#delRfidBind").on('click',function(){
		var list=table.method("getSelections");
		if(!list.length){
			message.alert("请先选择要删除的项目");
			return;
		}
		//删除
		message.confirm("确认删除吗？",function(index){
			db.updateByParamKey({ 
				request:{
					sqlId:'delete_rfid_bind_data',
					whereId:0,
					params:list
				},
				success:function(){
					message.alert("删除成功");
					$("#operPanel_con").parent().hide();
					table.method("refresh");
					/*var listAble=table.method("getSelections");
					console.log(listAble);*/
					var dataList=table.method("getData");
					if(dataList.length==list.length){
						table.method("prevPage");
					}
				},
				error:function(data,respMsg){
					message.alert(respMsg);
				}
			});
		});
	})
	
	//添加修改
	$("#save").on("click",function(){
		if(validate())return;
		var sql;
		if(type){//修改
			sql="update_rfid_bind_data";
		}else{//新增
			sql="insert_rfid_bind_data";
		}
		message.saving();
		db.updateByParamKey({
			request:{
				sqlId:sql,
				params:model.rfidBind,
				whereId:0
			},
			success:function(data){
				!data.success&&message.alert(data.respMsg);
				table.method("refresh");
				dialog.close();
				message.alert("保存成功");
			},
			error:function(data,respMsg){
				message.alert(respMsg);
			}
		});
	});
	
	
	function validate(){
		return !model.rfidBind.rpb_label_type && !message.alert("请选择标签类型")||
		!model.rfidBind.rpb_label_id.length && !message.alert("请输入标签编号")||
		model.rfidBind.rpb_label_id.length>100 && !message.alert("输入标签编号不得超过100字")||
		!model.rfidBind.rpb_people_type && !message.alert("请选择人员类型") || 
		!model.rfidBind.rpb_people_id && !message.alert("请选择绑定人员");
 	}
});