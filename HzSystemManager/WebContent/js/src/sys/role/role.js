define(['jquery','vue','frm/hz.db',"ztree","frm/dialog","frm/message","frm/model","frm/treeUtil","frm/loginUser"],function($,tpl,db,treeSelect,dialog,tip,modelUtil,util,login){
	//表单容器
	var formContainer=$("#form");
	//树形容器
	var treeContainer,roleTree;
	
	var treeActive;
	var tId;

	//建立数据模型
	var model=new tpl({
		el:"#form",
		data:{
			role:{
				'id':'',
				'tid':'',
				'pid':'',
				'name':'',
				'use':'',
				'seq':'',
				'group':'',
				'rbd_id':'',
				'rbd_crte_user_id':'',
				'rbd_updt_user_id':'',
				'cusNumber': login.cusNumber || -1
			}
		}
	});
	//树形设置
	var setting={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
			view: {dblClickExpand: false},
			data: {
				simpleData: {enable: true,idKey: "id",pIdKey: "pid"},
			},
			callback:{
				//
				onDblClick:function(e,ztree,node){
					
					if(node.type==1){
						var p=node.getParentNode();
						modelUtil.modelData(model.role,node);
						model.role['group']=p?p['name']:"";
						model.role['pid']=p?p['id']:'';
						model.role['tid']=node.tId;
						db.query({
							request:{
								sqlId:'query_role_menu',
								params:{'rfr_role_id':model.role['id'].replace('1-','')}
							},
							success:function(data){
								roleTree.checkAllNodes(false);
								var temp;
		        			    for(var i=0,len=data.length;i<len;i++){
		        			    	temp=roleTree.getNodeByParam("id",data[i]['id']);
		        			    	temp&&roleTree.checkNode(temp,true,false);
		        			    }
							}
						});
					}
				},
				onClick:function(e,ztree,node){
					if(node.type!=1){
						model.role['group']=node.name;
						model.role['pid']=node.id;
						tId=node.tId;
					}
				}
			}
	}

	var superAdmin=login.dataAuth==3;
	//角色分类树
	db.query({
		request:{
			sqlId: 'query_role_group',
			params:{agkey:login.dataAuth==2?'role_01':'role_0104'},
		    whereId:superAdmin?'':'0',
		    orderId:'0'
		},
		success:function(data){
	 		treeContainer=$.fn.zTree.init($("#tree"), setting,data);
	 		//搜索树
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		}
	});
	//功能菜单树
	db.query({
		request:{
			sqlId:'query_menu_role',
			whereId:!superAdmin?('0'):''
		},
		success:function(data){
			
			data.push({'id':'-1','name':"菜单",icon:"../../../libs/ztree/css/zTreeStyle/img/diy/1_close.png",open:true,"nocheck":true});
			//左侧菜单
	 		var set={
	 				data: {simpleData: {enable: true,pIdKey: "pid"}},
	 				check:{enable:true,chkStyle: "checkbox",chkboxType: { "Y": "ps", "N": "s" }},
	 				callback:{
	 				}
	 			}
			roleTree=$.fn.zTree.init($("#roleopr"),set,data);
	 		roleTree.expandAll(true);
	 		
		}
	});
 	//保存修改
 	formContainer.on("click",".buttons a",function(){
 		if(this.textContent=='保存'){
 			if(validate())return;
 			tip.saving();
 			if(model.role['id']!=''){//修改
 				model.role['id']=model.role['id'].replace('1-','');
 	 			db.updateByParamKey({//首先更新角色
 	 	 			request:{
 	 	 				sqlId:'update_role_role',
 	 					params:[model.role]
 	 	 			},
 	 	 			success:function(data){
 	 	 				
 	 	 				var list=roleTree.getCheckedNodes(true).map(function(row){
 	 	 					return {'rfr_role_id':model.role['id'],'rfr_func_id':row.id};
	 	 					});
 	 	 				db.updateByParamKey({//更新角色关联的功能表
 	 	 					request:[{
 	 	 						sqlId:'delete_role_menu',
 	 	 						params:[{'id':model.role['id']}]
 	 	 					},{
 	 	 						sqlId:'insert_role_menu',
 	 	 						params:list
 	 	 					}],
 	 	 					success:function(){
 	 	 						var temp=treeContainer.getNodeByTId(model.role['tid']);
 	 	 						model.role['id']='1-'+model.role['id'];
 	 	 						modelUtil.modelData(temp,model.role);
 	 	 						
 	 	 						if(tId&&tId!=model.role['tid']){
 	 	 							treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
 	 	 						}
 	 	 						treeContainer.updateNode(temp);
 	 	 						modelUtil.clear(model.role,{'use':'1'});
 	 	 						roleTree.checkAllNodes(false);
 	 	 						tip.alert("保存成功");
 	 	 					},
 	 	 					error:function(a,b){
 	 	 						tip.alert(b);
 	 	 					}
 	 	 				});
 	 	 			}
 	 	 		});
 	 		}else{//新增
 	 			model.role.cusNumber = login.cusNumber || -1;
 	 			//先插入角色信息
 	 	 		db.updateByParamKey({
 	 	 			request:{
 	 	 				sqlId:'insert_role_role',
 	 					params:[model.role]
 	 	 			},
 	 	 			success:function(data){
 	 	 				var roleId=data.data[0]['seqList'][0];
 	 	 				//获取菜单id
 	 	 		 		var list=roleTree.getCheckedNodes(true).map(function(row){
 	 	 						return {'rfr_role_id':roleId,'rfr_func_id':row.id};
 	 	 					});
 	 	 		 		db.updateByParamKey({
 	 	 		 			request:{
 	 	 		 				sqlId:'insert_role_menu',
 	 	 		 				params:list
 	 	 		 			},
 	 	 		 			success:function(data){
 	 	 		 				
 	 	 		 				var  pnode=treeContainer.getNodeByTId(tId);
 	 	 		 				var  temp=model.role;
 	 	 		 				temp.icon="role.png";
 	 	 		 				temp.id=roleId;
 	 	 		 				temp.type=1;
 	 	 		 				treeContainer.addNodes(pnode,-1,temp);
 	 	 		 				modelUtil.clear(model.role,{'use':'1'});
 	 	 		 				
 	 	 		 				tip.alert("新增成功");
 	 	 		 			},
 	 	 		 			error:function(a,b){//失败后删除角色
 	 	 		 				tip.alert(b);
 	 	 		 				db.updateByParamKey({
 	 	 		 					request:{
 	 	 		 						sqlId:'delete_role_role',
 	 	 		 						params:[{'id':model.role['id'].replace('1-','')}]
 	 	 		 					}
 	 	 		 				});
 	 	 		 			}
 	 	 		 		});
 	 	 			},
 	 	 			error:function(){
 	 	 				tip.close();
 	 	 			}
 	 	 		});
 	 		}
 		}else if(this.textContent=="删除"){
 			if(!model.role['id'].length){
 				tip.alert("请选择要删除的角色");
 				return;
 			}
 			tip.confirm("确认删除该选项？",function(){
 				var temp={'id':model.role['id'].replace('1-','')};
 	 			db.updateByParamKey({
 	 				request:[{
 	 					sqlId:'delete_role_role',
 	 					params:[temp]
 	 				},{
 	 					sqlId:'delete_role_menu',
 	 					params:[temp]
 	 				}],
 	 				success:function(){
 	 					roleTree.checkAllNodes(false);
 	 					treeContainer.removeNode(treeContainer.getNodeByTId(model.role['tid']));
 	 					modelUtil.clear(model.role,{'use':'1'});
 	 					tip.alert("删除成功");
 	 				},
 	 				error:function(a,b){
 	 					tip.alert(b);
 	 				}
 	 			});
 			});
 		}else {
 			modelUtil.clear(model.role,{'use':'1'});
 			roleTree.checkAllNodes(false);
 		}
 		
 	});
 	
 	function validate(){
		return !model.role['group'].length&&!tip.alert("请先选择角色分类")||
			   !model.role['name'].length&&!tip.alert("请输入角色名称")||
			   model.role['name'].length>26&&!tip.alert("角色名过长，请输入26个以内字符");
 	}
});
