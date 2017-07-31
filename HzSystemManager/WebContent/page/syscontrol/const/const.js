define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/tip"],function($,tpl,db,table,dialog,tip){
	
	var constGroup=$("#constlist");
	var groups=$("#groupconst");
	//搜索常量组
	constGroup.find("input:first").keyup(function(){
		var key=this.value;
		groups.children("li").each(function(){
			if(key&&this.innerHTML.indexOf(key)<0){
				this.style.display="none";
			}else{
				this.style.display="block";
			}
		});
	});
	//创建模型
	var model=new tpl({
		el:'#constlist',
		data:{
			list:[],
			constgroup:{'CCD_CODE':'','CCD_NAME':'','CCD_ID':'','CCD_KEY':'','CCD_VALUE':''}
		},
		methods:{
			refresh:function(item){
				model.constgroup['CCD_ID']=item['CCD_ID'];
				model.constgroup['CCD_CODE']=item['CCD_CODE'];
				model.constgroup['CCD_NAME']=item['CCD_NAME'];
				table.method("refresh",{request:{whereId:'1',params:[item['CCD_CODE']]}});
			}
		}
	});
	//选中常量组
	constGroup.on("click","li",function(){
		constGroup.find("li").removeClass("active");
		$(this).addClass("active");
	});
	//查询常量组
	db.query({
		request:{
			sqlId:'const_sql_query'
		},
		success:function(data){
			model.list=data;
			
			groups.find("li:first").click();
		}
	});
	//查询常量
	table.init("table",{
		request:{
			sqlId:'query_const_const',
			whereId:'1',
			params:''
		},
		columns: [[  
					{
					    field: 'state',
					    checkbox: true
					},
	                  {
	                    title: '常量键',
	                    field: 'CCD_KEY',
	                    align: 'center',
	                    valign: 'middle'
	                },{
	                    title: '常量值',
	                    field: 'CCD_VALUE',
	                    align: 'center',
	                    valign: 'middle'
	                }
	              ]],
          onClickRow:function(row){
        	 modelValue(model.constgroup,row);
        	 dialog.open({targetId:'constd',title:'编辑',h:"300px"});
          }
	});
	//常量组新增和删除
	constGroup.on("click","button",function(){
		if(this.textContent=="新增"){
			dialog.open({targetId:'constgroup',title:'新增常量组',h:"200px"});
			return;
		}
		if(this.textContent=="删除"){
			var item=constGroup.find("li.active");
			db.update({
				request:{
					sqlId:'delete_const_const',
					whereId:'1',
					params:[model.constgroup['CCD_ID']]
				}
			});
		}else{//编辑
			dialog.open({targetId:'constgroup',title:'编辑',h:"200px"});
		}
	});
	//常量组新增,修改
	$("#constgroup").on("click","button",function(){
		//修改
		if(model.constgroup['CCD_ID']){
			db.update({
				request:{
					sqlId:'update_const_const',
					params:[model.constgroup['CCD_CODE'],model.constgroup['CCD_NAME'],model.constgroup['CCD_ID']]
				},
				success:function(){
					db.query({
						request:{
							sqlId:'const_sql_query'
						},
						success:function(data){
							model.list=data;
						}
					});
					dialog.close();
				}
			});
		}else{//新增
			db.update({
				request:{
					sqlId:'insert_const_const',
					seqParams:[0,'SYS_CONSTANT_CODE_DTLS','CCD_ID'],
					params:["?",model.constgroup['CCD_CODE'],model.constgroup['CCD_NAME'],null,null,window.top.currentUser.id]
				},
				success:function(){
					db.query({
						request:{
							sqlId:'const_sql_query'
						},
						success:function(data){
							model.list=data;
						}
					});
					dialog.close();
				}
			});
			
		}
	})
	//常量新增删除
	$("#oprbutton").on("click","button",function(){
		if(this.textContent=='新增'){
			dialog.open({targetId:'constd',title:'新增常量',h:"300px"});
		}else{
			var list=table.method("getSelections").map(function(row){
 	 			return [row['CCD_KEY'],row['CCD_VALUE']];
 	 		});
			//删除
			db.update({
				request:{
					sqlId:'delete_const_const',
					whereId:'0',
					params:list
				},
				success:function(){
					groups.children("li.active").click();
				}
			});
		}
	});
	
	//常量添加
	$("#constd").on("click","button",function(){
		if(this.textContent="保存"){
			db.update({
				request:{
					sqlId:'insert_const_const',
					params:[model.constgroup['CCD_ID'],model.constgroup['CCD_CODE'],model.constgroup['CCD_NAME'],model.constgroup['CCD_KEY'],model.constgroup['CCD_VALUE'],1]
				},
				success:function(){
					dialog.close();
					groups.children("li.active").click();
				}
			});
		}
	})
	
	
	function modelValue(keyObject,valueObject){
		for(var i in keyObject){
			keyObject[i]=valueObject[i]?valueObject[i]:keyObject[i];
		}
		return keyObject;
	}
	
	function validate(){
		return !model.group['agd_name'].length&&!tip.alert("请输入机构分类名称")||
				(!/^[0-9]*$/.test(model.group['agd_seq']))&&!tip.alert("排列顺序为整数");
 	}
});