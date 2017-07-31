define(['jquery','vue','frm/hz.db',"ztree","frm/dialog","frm/message","frm/model","frm/treeUtil"],function($,tpl,db,treeSelect,dialog,tip,modelUtil,util){
	//表单容器
	var formContainer=$("#form");
	//树形容器
	var treeContainer;
	
	var treeActive;
	var tId;
	//建立数据模型
	var model=new tpl({
		el:"#form",
		data:{
			org:{
				'id':'',
				'tid':'',
				'pid':'',
				'pname':'',
				'name':'',
				'use':'',
				'auth':'',
				'seq':'',
				'remark':'',
				'group':'',
				'groupid':'',
				'odd_crte_user_id':'',
				'odd_updt_user_id':''
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
					if(node&&node.type==1){
						var group=treeContainer.getNodeByParam("id", "1-"+node['groupid'], null);
						
						var p=node.getParentNode();
						
						modelUtil.modelData(model.org,node);
						
						model.org['group']=group?group['name']:"";
						
						model.org['groupid']=group?group['id'].replace('1-',''):'';
						
						model.org['pname']=p&&(p.type==1?p['name']:"");
						model.org['pid']=p&&(p.type==1?p['id'].replace('1-',''):'');
						model.org['tid']=node.tId;
					}
				},
				onClick:function(e,tree,node){
					if(node.type==1){
						if(node.id==model.org['id'])return;
						var group=treeContainer.getNodeByParam("id", "1-"+node['groupid'], null);
						model.org['pname']=node.name;
						model.org['pid']=node.id;
						model.org['group']=group?group['name']:"";
						model.org['groupid']=group?group['id'].replace('1-',''):"";
					}else{
						//设置当前编辑的机构分组，如果设置的当前机构与上级机构分组不同则不操作
						var group=treeContainer.getNodeByTId(model.org['tid']);
						
						if(group&&group.getParentNode()&&(group.getParentNode().type==1)){
							return;
						}
						model.org['group']=node.name;
						model.org['groupid']=node.id.replace('1-','');
						model.org['pid']=model.org['pname']='';
					}
					tId=node.tId;
				}
			}
	}
	//角色分类树
	db.query({
		request:{
			sqlId: 'query_org_group'
		},
		success:function(data){
	 		treeContainer=$.fn.zTree.init($("#tree"), setting,data);
	 		//搜索树
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		}
	});

 	//保存修改
 	formContainer.on("click",".buttons a",function(){
 		
 		if(this.textContent=='保存'){
 			if(validate())return;
 			tip.saving();
 			if(model.org['id']!=''){//修改
 	 			db.updateByParamKey({
 	 	 			request:{
 	 	 				sqlId:'update_org_org',
 	 					params:[model.org]
 	 	 			},
 	 	 			success:function(data){
 	 	 				
 	 	 				var node=treeContainer.getNodeByTId(model.org['tid']);
 	 	 				
 	 	 				modelUtil.modelData(node,model.org);
 	 	 				
 	 	 				if(tId&&tId!=model.org['tid']){
 							treeContainer.moveNode(treeContainer.getNodeByTId(tId),node,"inner");
 						}
 						treeContainer.updateNode(node);
 						
 						modelUtil.clear(model.org,{'use':'1',auth:'0'});
 						
 						tip.alert("更新成功");
 	 	 			},
 	 	 			error:function(a,b){
 	 	 				tip.alert(b);
 	 	 			}
 	 	 		});
 	 		}else{//新增
 	 			//先插入角色信息
 	 	 		db.updateByParamKey({
 	 	 			request:{
 	 	 				sqlId:'insert_org_org',
 	 					params:[model.org]
 	 	 			},
 	 	 			success:function(data){
 	 	 				model.org.type=1;
 	 	 				var pnode=treeContainer.getNodeByTId(tId);
 	 	 				
 	 	 				var temp=model.org;
 	 	 				
 	 	 				temp.id=data.data[0]['seqList'][0];
 	 	 				
 	 	 				temp.icon='org.png';
 	 	 				
 	 	 				treeContainer.addNodes(pnode,-1,temp);
 	 	 				
 	 	 				tip.alert("新增成功");
 	 	 				
 	 	 				modelUtil.clear(model.org,{'use':'1',auth:'0'});
 	 	 			},
 	 	 			error:function(a,b){
 	 	 				tip.alert(b);
 	 	 			}
 	 	 		});
 	 		}
 		}else if(this.textContent=="删除"){
 			if(!model.org['id']){
 				tip.alert("请双击选择要删除的项");
 				return;
 			}
 			var node=treeContainer.getNodeByTId(model.org['tid']);
			var list=treeContainer.transformToArray(node).map(function(row){
				return {"id":row['id']};
			});
 			tip.confirm(list.length>1?"确认删除该机构及其下级机构？":"确认删除该机构？",function(){
 				
 				var temp={'id':model.org['id']};
 	 			db.updateByParamKey({
 	 				request:{
 	 					sqlId:'delete_org_org',
 	 					params:list
 	 				},
 	 				success:function(){
 	 					treeContainer.removeNode(treeContainer.getNodeByTId(model.org['tid']));
 	 					modelUtil.clear(model.org,{'use':'1',auth:'0'});
 	 					tip.alert("删除成功");
 	 				},
 	 				error:function(a,b){
 	 					tip.alert(b);
 	 				}
 	 			});
 			});
 			
 		}else {
 			modelUtil.clear(model.org,{'use':'1',auth:'0'});
 		}
 	});
 	function validate(){
 		return (!model.org['pid']&&!model.org['groupid'])&&!tip.alert("请选择机构分类或上级机构")||
		!model.org['name']&&!tip.alert("请输入机构名称")||
		model.org['name'].length>26&&!tip.alert("名称过长，请输入26个以内字符")||
		(!/^[0-9]*$/.test(model.org['seq']))&&!tip.alert("排列顺序为整数");
 	}
});
