define(['jquery','vue','frm/hz.db','ztree','frm/model','frm/message','frm/treeUtil'],function($,tpl,db,treeSelect,modelUtil,tip,util){
	//左侧树
	var treeContainer;
	var group=$("#groupform");
	var tId;
	//数据模型定义
	var model = new tpl({
	    	el:'#groupform',
	    	data:{
	    		group:{  
	    			'tid':'',
	    			'pname':'',
	    			'agd_id':'',
	    			'agd_seq':'',
	    			'agd_key':'',
	    			'agd_name':'',
	    			'agd_type':'1',//机构
	    			'agd_parent_id':'-1',
	    			'agd_crte_user_id':'',
	    			'agd_updt_user_id':''
	    		}
	    	}
	    });
	var set={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			view: {dblClickExpand: false},
			data: {
				simpleData: {enable: true,idKey: "agd_id",pIdKey: "agd_parent_id"},
				key:{name:"agd_name"}
			},
			callback: {
				onClick: function(event, treeId, node){
					if(node['agd_id']!=model.group['agd_id']){
						model.group['pname']=node['agd_name'];
						model.group['agd_parent_id']=node['agd_id'];
						tId=node.tId;
					}
				},
				onDblClick:function(e,id,node){
					
					if(node['agd_name']=='机构分类')return;
					
					var temp=node.getParentNode();
					
					modelUtil.modelData(model.group,node);
					
					model.group['tid']=node.tId;
					
					model.group['pname']=temp?temp['agd_name']:'';
					
					model.group['agd_parent_id']=temp?temp['agd_id']:'0';
				}
			}
	}
	//分组树
	db.query({
		request:{sqlId: 'query_group_sql',whereId:1},
		success:function(data){
			data.push({'agd_id':'-1','agd_name':"机构分类",icon:"diy/1_close.png",open:true});
			treeContainer=$.fn.zTree.init($("#tree"), set,data);
			//搜索树
			$("#input").keyup(function(){
				util.searchTree("agd_name",this.value,"tree",data,set);
			});
		}
	});
 	
 	//保存
	group.on("click",".buttons a",function(){
		
		if(this.textContent=="保存"){
			if(validate())return;
			tip.saving();
			if(model.group['agd_id']!=''){//更新
	 			db.updateByParamKey({
	 				request: {
	 	 				sqlId:'update_group_sql',
	 	 				params:[model.group]
	 				},
	 				success:function(){
	 					
	 		 			var temp=treeContainer.getNodeByTId(model.group["tid"]);
	 		 			
	 		 			modelUtil.modelData(temp,model.group);
			 			//移动
			 			if(tId!=model.group['tid']){ 
			 				treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
			 			}
			 			treeContainer.updateNode(temp);
			 			
			 			modelUtil.clear(model.group,{'agd_type':'','agd_parent_id':'-1'});
			 			tip.alert("更新成功");
	 				},
	 				error:function(a,b){
	 					tip.alert(b);
	 				}
	 			});
	 			//刷新树
	 		}else{//新增
	 			db.updateByParamKey({
	 	 			request: {
	 	 				sqlId: "insert_group_sql",
	 	 				params: [model.group]
	 				},
	 				success:function(data){
	 					var pnode=treeContainer.getNodeByTId(tId),pnode=pnode?pnode:treeContainer.getNodes()[0];
	 					var temp=model.group;
	 					temp.icon="orgs.png";
	 					temp['agd_id']=data.data[0]['seqList'][0];
						treeContainer.addNodes(pnode,-1,model.group);
						modelUtil.clear(model.group,{'agd_type':'','agd_parent_id':'-1'});
						tip.alert("新增成功");
	 				},
	 				error:function(a,b){
	 					tip.alert(b);
	 				}
	 	 		});
	 		}
			return;
		}
		
 		if(this.textContent=="删除"){
 			if(!model.group['tid']){
 				tip.alert("请双击要删除的机构组");
 				return;
 			}
 			var node=treeContainer.getNodeByTId(model.group['tid']);
			var list=treeContainer.transformToArray(node).map(function(row){
				return {"agd_id":row['agd_id']};
			});
 			tip.confirm(list.length>1?"确认删除该机构分组及其子节点？":"确认删除该机构组？",function(){
 				
 				db.updateByParamKey({
 	 				request:{
 	 					sqlId:"delete_group_sql",
 	 					params:list
 	 				},
 	 				success:function(){
 	 					treeContainer.removeNode(treeContainer.getNodeByTId(model.group["tid"]),false);
 	 					modelUtil.clear(model.group,{'agd_type':'','agd_parent_id':'-1'});
 	 					tip.alert("删除成功");
 	 				},
 	 				error:function(a,b){
 	 					tip.alert(b);
 	 				}
 	 			});
 			});
 			
 		}else{
 			modelUtil.clear(model.group,{'agd_type':'','agd_parent_id':'-1'});
 			tId='';
 		}
 		
 	});
	
	function validate(){
		return !model.group['agd_name'].length&&!tip.alert("请输入机构分类名称")||
				model.group['agd_name'].length>26&&!tip.alert("分类名过长，请输入26个以内字符")||
			   !model.group['agd_key'].length&&!tip.alert("请输入角机构分类标识");
 	}
});
