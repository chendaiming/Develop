define(['jquery','vue','frm/hz.db',"frm/loginUser","frm/treeSelect","frm/model","frm/message","frm/treeUtil","frm/localData","frm/select"],function($,tpl,db,login,treeSelect,modelUtil,tip,util,localData){
	//
	var model=new tpl({
			el:'#form',
			data:{
				telephone:{
					'id':'',
					'pid':'',
					'name':'',
					'sab_other_id':'',
					'sab_phone':'',
					'sab_dept_id':'',
					'sab_remark':'',
					'cus':login.cusNumber,
					'user':login.userId,//更新创建人
					'tid':'',
					'dep':''//机构名称
				}
			}
		});
	//电话机
	var treeContainer, depTree,tId;
	db.query({
		request:{
			sqlId:'select_telephone_tree_all',
			orderId:'0',
			params:{cus:login.cusNumber}
		},
		success:function(data){
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable: false},
					callback:{
						onClick:function(e,id,node){
							if(node.type==0){
								model.telephone.dep=node.name;
								model.telephone.pid=node.id;
								tId=node.tId;
							}
						},
						onDblClick:function(id,e,node){
							if(node.type==1){
								modelUtil.modelData(model.telephone,node);
								model.telephone['tid']=node.tId;
							}
						}
					}
			};
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			
			model.zTreeData = data;
			
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",model.zTreeData,setting);
			});

		}
	});

	$("#form").on("click",".buttons a",function(){
		
		if(this.textContent=='删除'){
			if(!model.telephone['id']){
				tip.alert("请选择要删除的控制器");
				return;
			}
			tip.confirm("确认删除该项及其控制的门禁？",function(){
				db.updateByParamKey({
					request:[{
						sqlId:'delete_telephone_by_id',
						params:[{id:model.telephone['id']}]
					}],
					success:function(data){
						localData.removeTrees(model.zTreeData,model.telephone);
						treeContainer.removeNode(treeContainer.getNodeByTId(model.telephone['tid']));
						modelUtil.clear(model.telephone,{'cus':'','user':''});
						tip.alert("删除成功");
					},
					error:function(){
						tip.alert("删除失败");
					}
				});
			});
			
		}else if(this.textContent=='保存'){
			if(validate())return;
			if(model.telephone['id']){//修改
				db.updateByParamKey({
					request:{
						sqlId:'update_telephone_by_id',
						params:[model.telephone]
					},
					success:function(data){
						model.telephone['pid'] ='1-'+ model.telephone['pid'];
						
						localData.changeTrees(model.zTreeData,model.telephone);
						
						var temp=treeContainer.getNodeByTId(model.telephone["tid"]);
						
	 		 			modelUtil.modelData(temp,model.telephone);
			 			//移动
			 			if(tId&&tId!=model.telephone['tid']){ 
			 				treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
			 			}
			 			treeContainer.updateNode(temp);
			 			
			 			modelUtil.clear(model.telephone,{'cus':'','user':''});
			 			tip.alert("更新成功");
			 			tId=null;
					},
					error:function(){
						tip.alert("更新失败");
					}
				});
			}else{//新增
				db.updateByParamKey({
					request:{
						sqlId:'insert_telephone_all',
						params:[model.telephone]
					},
					success:function(data){

						var  pnode=treeContainer.getNodeByTId(tId);
						
 		 				var  temp=model.telephone;
 		 				
 		 				temp.icon="telephone.png";
 		 				
 		 				temp.id=data.data[0]['seqList'][0];
 		 				
 		 				temp.type=1;
 		 				var newNodes = treeContainer.addNodes(pnode,-1,temp);
 		 				
						localData.addTrees(model.zTreeData,newNodes[0]);
						
 		 				modelUtil.clear(model.telephone,{'cus':'','user':''});
 		 				
 		 				tip.alert("新增成功");
 		 				
 		 				tId=null;
					}
				});
			}
		}else{
			modelUtil.clear(model.telephone,{'cus':'','user':''});
		}
	});
	
	function validate(){
		return !model.telephone['pid']&&!tip.alert("请选择部门")||
			   !model.telephone['name'].length&&!tip.alert("请输入名称")||          
			   model.telephone['name'].length>26&&!tip.alert("名称过长")|| 
			   !(model.telephone['sab_phone']+'').length&&!tip.alert("请输入电话号码")||
			   !/^[0-9]*$/.test(model.telephone['sab_phone'])&&!tip.alert("电话号码为数字");
		
 	}
});