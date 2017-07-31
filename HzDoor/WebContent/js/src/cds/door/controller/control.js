define(['jquery','vue','frm/hz.db',"frm/loginUser","frm/treeSelect","frm/model","frm/message","frm/treeUtil","frm/localData","frm/select"],function($,tpl,db,login,treeSelect,modelUtil,tip,util,localData){
	//
	var model=new tpl({
			el:'#form',
			data:{
				zTreeData:[],
				control:{
					'id':'',
					'pid':'',
					'name':'',
					'area':'',
					'dcd_ip_addrs':'',
					'dcd_port':'',
					'dcd_user_name':'',
					'dcd_user_password':'',
					'dcd_dept_id':'',
					'cusnumber':login.cusNumber,
					'user_id':login.userId,//更新创建人
					'tid':'',
					'dep':'',
					'otherid':'',
					'target':'1'
				}
			}
		});
	//门禁控制器
	var treeContainer, depTree,tId;
	//如果用户的数据权限不是本辖区的则部门号就是机构号
	var auth=login.dataAuth!=2?'2':'3';
	var request={
			sqlId:'query_door_control',
			orderId:'0',
			params:[auth,login.cusNumber]
		};
	login.dataAuth!=2&&(request.whereId=0,request.params.push(login.cusNumber));
	db.query({
		request:request,
		success:function(data){
			var setting={
					path:'../../../../libs/ztree/css/zTreeStyle/img/',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable: false},
					callback:{
						onClick:function(e,id,node){
							var fal = true;
							if(node.type!=1){
								if(node.children){
									for(var i=0;i<node.children.length;i++){
										if(node.children[i].type!=1){
											fal = false;
										}
									}
								}else{
									model.control['area']=node['name'];
									model.control['pid']=node.id.replace("1-","");
									tId=node.tId;
								};
								if(fal){
									model.control['area']=node['name'];
									model.control['pid']=node.id.replace("1-","");
									tId=node.tId;
								};
							}
						},
						onDblClick:function(id,e,node){
							if(node.type==1){
								modelUtil.modelData(model.control,node);
								model.control['tid']=node.tId;
								model.control['area']=node.getParentNode()['name'];
								var temp=depTree.getNodeByParam("id",node['dcd_dept_id']);
								model.control['dep']=temp&&temp['name'];
								model.control['pid']=node.pid.replace("1-","");
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

	//所属部门
	db.query({
		request:{
			sqlId:'select_org_dept',
			whereId:'0',
			params:[login.cusNumber]
		},
		success:function(data){
			if(!data.length)return;
			var setting={
					//key:"name",
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable: false},
					callback:{
						onClick:function(e,id,node){
							model.control['dep']=node.name;
							model.control['dcd_dept_id']=node.id;
						}
					}
			};
			data[0].open=true;
			depTree=treeSelect.init('dep', setting,data);
		}
	});
	
	$("#form").on("click",".buttons a",function(){
		if(this.textContent=='删除'){
			if(!model.control['id'].length){
				tip.alert("请选择要删除的控制器");
				return;
			}
			tip.confirm("确认删除该项及其控制的门禁？",function(){
				db.updateByParamKey({
					request:[{
						sqlId:'delete_door_door',
						params:[{id:model.control['id']}],
						whereId:'1'
					},{
						sqlId:'delete_control_control',
						params:[{id:model.control['id']}]
					}],
					success:function(data){
						localData.removeTrees(model.zTreeData,model.control);
						treeContainer.removeNode(treeContainer.getNodeByTId(model.control['tid']));
						modelUtil.clear(model.control,{'cusnumber':'','user_id':''});
						tip.alert("删除成功");
					},
					error:function(){
						tip.alert("删除失败");
					}
				});
			});
			
		}else if(this.textContent=='保存'){
			if(validate())return;
			if(model.control['id'].length){//修改
				db.updateByParamKey({
					request:{
						sqlId:'update_control_control',
						params:[model.control]
					},
					success:function(data){
						model.control['pid'] ='1-'+ model.control['pid'];
						localData.changeTrees(model.zTreeData,model.control);
						var temp=treeContainer.getNodeByTId(model.control["tid"]);
	 		 			modelUtil.modelData(temp,model.control);
			 			//移动
			 			if(tId&&tId!=model.control['tid']){ 
			 				treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
			 			}
			 			treeContainer.updateNode(temp);
			 			
			 			modelUtil.clear(model.control,{'cusnumber':'','user_id':''});
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
						sqlId:'insert_control_control',
						params:[model.control]
					},
					success:function(data){

						var  pnode=treeContainer.getNodeByTId(tId);
 		 				var  temp=model.control;
 		 				temp.icon="control.png";
 		 				temp.id=data.data[0]['seqList'][0];
 		 				temp.type=1;
 		 				var newNodes = treeContainer.addNodes(pnode,-1,temp);
						localData.addTrees(model.zTreeData,newNodes[0]);
 		 				modelUtil.clear(model.control,{'cusnumber':'','user_id':''});
 		 				tip.alert("新增成功");
 		 				tId=null;
					}
				});
			}
		}else{
			modelUtil.clear(model.control,{'cusnumber':'','user_id':''});
		}
	});
	
	function validate(){
		return !model.control['dcd_dept_id']&&!tip.alert("请选择部门")||
			   !model.control['pid'].length&&!tip.alert("请选择区域")||
			   !model.control['name'].length&&!tip.alert("请输入名称")||          
			   model.control['name'].length>26&&!tip.alert("名称过长")||       
			   (!/^[0-9]*$/.test(model.control['dcd_port']))&&!tip.alert("端口号为整数");
		
 	}
});