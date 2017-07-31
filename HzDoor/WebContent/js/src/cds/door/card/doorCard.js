define(['jquery','vue','frm/hz.db','frm/table','frm/dialog','frm/message','frm/model','frm/select','frm/loginUser'],function($,tpl,db,table,dialog,tip,modelData,select,user){
	var constGroup=$("#constlist");
	var groups=$("#groupconst");
	var flag=false,type=false,first=true;
	let personKey = document.getElementById("personKey");

	let peopleType = null;
	//创建模型
	var model=new tpl({
		el:'#constlist',
		data:{
			list:[],
			person:{},//人员信息
			constgroup:{ 
				'dcd_cus_number':user.cusNumber,
				'dcd_door_card_id':'',
				'dcd_surface_id':'',
				'dcd_chip_id':'',
				'dcd_people_id':'',
				'person_name':'',
				'dcd_people_type':'',
				'dcd_use':'',
				'dcd_seq':'',
				'dcd_crte_user_id':user.userId
			}
		},
		watch: {
			'constgroup.dcd_people_type': function (val,oldVal){
					if (peopleType != this.constgroup.dcd_people_type) {
						peopleType = this.constgroup.dcd_people_type;
						this.constgroup.dcd_people_id = '';
						this.constgroup.person_name = '';
					}
			}
		},
		methods:{
			selectKey:function(item){
				var index=personKey.dataset.index;
				model.constgroup['dcd_people_id']=item.person_id;
				model.constgroup['person_name']=item.person_name;
				personKey.style.display='none';
			}
		}
	});

	//设置选中状态
	constGroup.on("click","li",function(){
		constGroup.find("li").removeClass("active");
		$(this).addClass("active");
	});
	
	//table表
	table.init("table",{
		request:{
			sqlId:'select_door_card_dtls_control',
			orderId:'0'
		},
		search:{
			key:'dcd_chip_id',
			whereId:'1'
		},
		columns: [[
					{
					    field: 'state',
					    checkbox: true
					},
	                  {
	                    title: '序号',
	                    field: 'dcd_surface_id',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '芯片编号',
	                    field: 'dcd_chip_id',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '人员姓名',
	                    field: 'person_name',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '人员类型',
	                    field: 'dcd_people_type_ch',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '是否启用',
	                    field: 'dcd_use_ch',
	                    align: 'center',
	                    valign: 'middle'
	                }
	              ]],
         onClickRow:function(row){
        	 modelData.modelData(model.constgroup,row);
			 model.$nextTick(function(){
				 model.constgroup.person_name = row.person_name;
				 this.constgroup.dcd_people_id = row.dcd_people_id;
			 })
			 model.constgroup['key']=model.constgroup['ccd_key']
        	 type=true;

			 dialog.open({targetId:'constd',title:'修改门禁卡信息',h:"400"});
		 },
		onLoadSuccess:function(data){
			console.log(data.rows);
		}
	});

	$("#person_id").focus(function(e){
		if(!model.constgroup['dcd_people_type']){
				tip.alert("请先选择人员类型")
				return;
		};
		var pos=e.target.getBoundingClientRect();
		personKey.style.left=pos.left;
		personKey.style.top=pos.top+e.target.clientHeight+2;
		personKey.style.width=e.target.clientWidth;
		personKey.style.display='block';
		
		if(model.constgroup['dcd_people_type'] == 1){//民警
			person_search('query_policeType_info',{'pbd_police_name':model.constgroup['person_name']},0)
		}else if(model.constgroup['dcd_people_type'] == 2){//犯人
			person_search('query_prisonerType_info',{'pbd_prsnr_name':model.constgroup['person_name']},0)
		}else{
			model.person = [];
			tip.alert("没有人员信息!");
			$(this).blur();
		}
	});
	//人员搜索
	function person_search(sqlId,params,orderId){
		db.query({
			request:{
				sqlId:sqlId,
				params:params,
				orderId:orderId
			},
			success:function(data){
				model.person = data;
				//console.log(JSON.stringify(data));
			}
		})
	}
	//门禁卡新增删除
	$("#oprbutton").on("click","a",function(){
		if(this.textContent=='添加'){
			type=false;
			modelData.clear(model.constgroup,{
				'dcd_cus_number':user.cusNumber,
				
				'dcd_crte_user_id':user.userId
			});
			dialog.open({targetId:'constd',title:'新增门禁卡',h:"380"});
			
		}else{//门禁卡删除
			
			var list=table.method("getSelections").map(function(row){
 	 			return {'dcd_door_card_id':row['dcd_door_card_id']};;
 	 		});
			if(!list.length){
				tip.alert("请先选择要删除的项目");
				return;
			}
			//删除
			tip.confirm("是否删除已勾选的"+list.length+"个常量键值对？",function(index){
				db.updateByParamKey({ 
					request:{
						sqlId:'delete_door_card_dtls',
						params:list
					},
					success:function(){
						tip.alert("删除成功");
						if(model.constgroup['dcd_door_card_id'].length){
							table.method("refresh",{request:{whereId:'0',params:{'dcd_door_card_id':model.constgroup['dcd_door_card_id']}}});
						}else{
							table.method("refresh");
						};
						dialog.close();

					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			});
		}
	});
	
	//添加修改
	$("#save").on("click",function(){
		NameIndex = true;
		if(validate(true))return;
		var sql;
		if(type){//修改
			sql="update_door_card_dtls";
		}else{//新增
			sql="insert_door_card_dtls";
		}
		tip.saving();
		db.updateByParamKey({
			request:{
				sqlId:sql,
				params:[model.constgroup]
			},
			success:function(data){
				!data.success&&tip.alert(data.respMsg);
				table.method("refresh");
				//console.log(model.constgroup)
				dialog.close();
				tip.alert("保存成功");
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	});
	
	function validate(){
		var fal = true;
		var falName = false;
		var friht = false;
		if(model.person.length > 0){
			model.person.forEach(function(item,i){
				if(model.constgroup.dcd_people_id == item.person_id && !model.constgroup.person_name == item.person_name){
					model.constgroup.dcd_people_id = '';
					fal = false;
				}
				if(model.constgroup.person_name == item.person_name){
					model.constgroup.dcd_people_id = item.person_id;
					falName = true;
				}
			});
		}else{
			if(model.constgroup.dcd_people_id&& !model.constgroup.person_name){
				fal = false;
			}
			if(model.constgroup.person_name){
				falName = true;
			}
		}

		return !model.constgroup['dcd_surface_id'].length&&!tip.alert("请输入卡面编号")||
				!model.constgroup['dcd_chip_id'].length&&!tip.alert("请输入芯片编号")||
				!model.constgroup['dcd_people_type']&&!tip.alert("请选择人员类型")||
				!model.constgroup['person_name'].length&&!tip.alert("请选择输入人员姓名")||
				!model.constgroup['dcd_people_id']&&!tip.alert("没有人员信息！")||
				!falName&&!tip.alert("人员不存在1")||
				fal&&tip.alert("人员不存在");
 	}
});