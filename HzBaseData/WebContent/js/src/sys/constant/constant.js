define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/message","frm/model","frm/pinyin"],function($,tpl,db,table,dialog,tip,modelData,sp){
	var constGroup=$("#constlist");
	var groups=$("#groupconst");
	var flag=false,type=false,first=true;
	//搜索
	constGroup.find("input:first").keyup(function(){
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
	var model=new tpl({
		el:'#constlist',
		data:{
			list:[],
			constgroup:{ 
				'ctd_type_id':'',
				'ctd_type_name':'',
				'ctd_type_seq':'',
				'ctd_crte_user_id':1,
				'ccd_key':'',
				'ccd_value':'',
				'ccd_seq':'',
				'ccd_crte_user_id':'',
				'key':''
					}
		},
		methods:{
			refresh:function(item,that){
				first=false;
				var _this=event.target
				modelData.modelData(model.constgroup,item);
				model.constgroup['ctd_type_code']=model.constgroup['ctd_type_id'];
				table.method("refresh",{request:{whereId:'0',params:{'ccd_type_id':item['ctd_type_id']}}});
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
			sqlId:'query_const_const',
			orderId:'0',
			whereId:'0',
			params:{
				'ccd_type_id':model.constgroup['ctd_type_id']
			}
		},
		search:{
			key:'ccd_value',
			whereId:'1'
		},
		columns: [[  
					{
					    field: 'state',
					    checkbox: true
					},
	                  {
	                    title: '常量键',
	                    field: 'ccd_key',
	                    align: 'center',
	                    valign: 'middle'
	                },{
	                    title: '常量值',
	                    field: 'ccd_value',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '排列顺序',
	                    width:'20',
	                    field: 'ccd_seq',
	                    align: 'center',
	                    valign: 'middle'
	                }
	              ]],
         onClickRow:function(row){
        	 if(first){
        		 var list=model.list;
        		 for(var i =0,len=list.length;i<len;i++){
        			 if(row['ccd_type_id']==list[i]['ctd_type_id']){
        				 model.constgroup['ctd_type_name']=list[i]['ctd_type_name'];
        				 break;
        			 }
        		 }
        	 }
        	 modelData.modelData(model.constgroup,row);
        	 
        	 model.constgroup['key']=model.constgroup['ccd_key']
        	 
        	 type=true;
        	 dialog.open({targetId:'constd',title:'编辑常量',h:"300",w:'500',modal:true,shadeClose:true});
         }
	});
	//常量组新增修改
	$("#constgroup").on("click","a",function(){
		if(validate())return;
		var request=[{
				sqlId:'update_const_group',
				params:[model.constgroup]
			}];
		
		if(flag){//修改
			request.unshift({sqlId:'update_const_group_const',params:[{'ctd_type_id':model.constgroup['ctd_type_id'],'ctd_type_code':model.constgroup['ctd_type_code']}]});
		}else{
			request[0]['sqlId']='insert_const_group';
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
	//常量组删除
	$("#groupbtn").on("click","a",function(){
		if(this.textContent=="添加"){
			flag=false;
			constGroup.find("li").removeClass("active");
			dialog.open({targetId:'constgroup',title:'新增',h:"300",w:'500'});
			model.constgroup['ctd_type_seq']=model.constgroup['ctd_type_id']=model.constgroup['ctd_type_name']='';
			return;
		}


		//验证弹出框
		if(validateDialog())return;
		
		var item=groups.find("li.active");
		if(!item.length){
			tip.alert("请先选择常量组");
			return;
		}

		
		if(this.textContent=="删除"){
			tip.confirm("是否删除已勾选的"+item.length+"个常量组？",function(){
				db.updateByParamKey({
					request:[{
						sqlId:'delete_const_const',
						whereId:'1',
						params:[model.constgroup]
					},{
						sqlId:'delete_const_group',
						params:[model.constgroup]
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
			dialog.open({targetId:'constgroup',title:'编辑',h:"300",w:'500'});
		}
	});
	
	//常量新增删除
	$("#oprbutton").on("click","a",function(){
		if(this.textContent=='添加'){
			if(!model.constgroup['ctd_type_name']){
				tip.alert("请先选择常量组");
				return;
			}
			type=false;
			model.constgroup['ccd_value']=model.constgroup['ccd_seq']=model.constgroup['ccd_key']='';
			dialog.open({targetId:'constd',title:'新增常量',h:"300",w:'500'});
		}else{//常量删除

			//验证弹出框
			if(validateDialog())return;
			
			var list=table.method("getSelections").map(function(row){
 	 			return {'ccd_type_id':row['ccd_type_id'],'ccd_key':row['ccd_key']};//[row['ccd_key']];
 	 		});
			if(!list.length){
				tip.alert("请先选择要删除的项目");
				return;
			}

			//删除
			tip.confirm("是否删除已勾选的"+list.length+"个常量键值对？",function(index){
				db.updateByParamKey({ 
					request:{
						sqlId:'delete_const_const',
						whereId:'0',
						params:list
					},
					success:function(){
						tip.alert("删除成功");
						if(model.constgroup['ctd_type_id'].length){
							table.method("refresh",{request:{whereId:'0',params:{'ccd_type_id':model.constgroup['ctd_type_id']}}});
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
	
	//常量添加修改
	$("#constd").on("click","a",function(){
		if(validate(true))return;
		var sql;
		if(type){//修改
			sql="update_const_const"
		}else{//新增
			sql="insert_const_const"
		}
		tip.saving();
		db.updateByParamKey({
			request:{
				sqlId:sql,
				params:[model.constgroup]
			},
			success:function(data){
				!data.success&&tip.alert(data.respMsg);
				table.method("refresh",{request:{whereId:'0',params:{'ccd_type_id':model.constgroup['ctd_type_id']}}});
//				dialog.close();
				$("#constd_con").parent().hide();
				tip.alert("保存成功");
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	});
	//分组查询
	function groupQuery(){
		db.query({
			request:{
				sqlId:'query_const_group'
			},
			success:function(data){
				model.list=data;
			}
		});
	}
	groupQuery();

	//验证弹出框
	function validateDialog(){
		if($("#constgroup_con").length){
			if(!$("#constgroup_con").parent().is(':hidden')){
				tip.alert('请先关闭常量弹出框');
				return true;
			}
		}
		if($("#constd_con").length){
			if(!$("#constd_con").parent().is(':hidden')){
				tip.alert('请先关闭常量项弹出框');
				return true;
			}
		}
		return false;
	}
	
	function validate(flag){
		if(flag){
			return !model.constgroup['ccd_key'].length && !tip.alert("请输入常量键")||
			model.constgroup['ccd_key'].length > 50&& !tip.alert("常量键字符过长")||
			!model.constgroup['ccd_value'].length && !tip.alert("请输入常量值")||
			model.constgroup['ccd_value'].length > 50 && !tip.alert("常量值字符过长")||
			(!/^[0-9]*$/.test(model.constgroup['ccd_seq']))&&!tip.alert("显示顺序为整数")||
			model.constgroup['ccd_seq'].length >50 && !tip.alert("排列顺序过长，请不要输入超过25个字符");
		}
		return  !model.constgroup['ctd_type_name'].length && !tip.alert("请输入常量名称")||
				model.constgroup['ctd_type_name'].length > 50 && !tip.alert("常量名称字符过长")||
				!model.constgroup['ctd_type_id'].length && !tip.alert("请输入常量编码")||
				model.constgroup['ctd_type_id'].length> 50 && !tip.alert("常量编码字符过长")||
				(!/^[0-9]*$/.test(model.constgroup['ctd_type_seq']))&&!tip.alert("显示顺序为整数")||
				model.constgroup['ctd_type_seq'].length >25 && !tip.alert("排列顺序过长，请不要输入超过25个字符");
 	}
});