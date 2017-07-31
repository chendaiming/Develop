define(['jquery','vue','frm/hz.db',"frm/loginUser","frm/treeUtil","frm/model","frm/treeSelect","frm/message",'frm/localData',"frm/dialog","frm/select"],
	function($,tpl,db,login,util,modelUtil,treeSelect,tip,localData){
	var treeContainer,deptree,controltree;
	var tId;
	var model=new tpl({
			el:'#form',
			data:{
				door:{
					'id':'',
					'pid':'',
					'name':'',
					'area':'',
					'dep':'',
					'dbd_other_id':'',
					'dbd_ctrl_id':'',
					'dbd_ctrl_chl':'',
					'dbd_type':'',
					'dbd_brand':'',
					'dbd_dept_id':'',
					'dbd_dvc_addrs':'',
					'dbd_stts_indc':'',
					'dbd_dvc_stts':'',
					'tid':'',
					'dbd_ctrl_id':'',
					'control':'',
					'cusnumber':login.cusNumber,
					'user_id':login.userId//更新创建人
				}
			}
	});
	//如果用户的数据权限不是本辖区的则部门号就是机构号
	var auth=(login.dataAuth==0||login.dataAuth==1)?'2':'3';
	var request={
			sqlId:'query_door_tree',
			orderId:'0',
			params:[auth,login.cusNumber]
		};
	(login.dataAuth==0||login.dataAuth==1)&&(request.whereId=0,request.params.push(login.cusNumber));
	//左侧门禁树形结构
	db.query({
		request:request,
		success:function(data){
			//树形设置
			var setting={
					path:'../../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onDblClick:function(e,id,node){
							if(node.type==1){
								var dep=deptree.getNodeByParam("id",node['dbd_dept_id']);
								var area=treeContainer.getNodeByParam("id",node['pid']);
								var control=controltree.getNodeByParam("id",node['dbd_ctrl_id']);
								modelUtil.modelData(model.door,node);
								model.door['area']=area?area['name']:'';
								model.door['dep']=dep?dep['name']:'';
								model.door['tid']=node['tId'];
								model.door['control']=control?control['name']:"";
								
								model.door['dbd_ctrl_id']=control?control['id']:"";
								model.door['pid']=node['pid'].replace("1-","");
								
							}
						},
						onClick:function(e,evnt,node){
							localData.subsetZTrees(node,function(){
								model.door['area']=node['name'];
								model.door['pid']=node['id'].replace("1-","")
								tId=node.tId;
							}, 0, 'type');
						}
					}
			}
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		}	
	});
	//门禁所属机构树
	db.query({
		request:{
			sqlId:'select_org_dept',
			whereId:'0',
			orderId:'0',
			params:[login.cusNumber]
		},
		success:function(data){
			var set={
					//key:'name',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable: false},
					callback:{
						onClick:function(e,id,node){
							model.door['dep']=node.name;
							model.door['dbd_dept_id']=node.id;
						}
					}
			}
			deptree=treeSelect.init("dep",set,data);
			deptree.expandNode(deptree.getNodes()[0],true,false,true);
		}
	});
	//控制器选择
	request.sqlId="query_door_control";
	db.query({
		request:request,
		success:function(data){
			var setting={
					key:'name',
					path:'../../../../libs/ztree/css/zTreeStyle/img/',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable: false},
					callback:{
						onClick:function(e,id,node){
							if(node.type==1){
								model.door['control']=node.name;
								model.door['dbd_ctrl_id']=node.id;
							}else{
								tip.alert("请选择控制器");
							}
						}
					}
			}
			data=keepLeaf(data);
			controltree=treeSelect.init("control",setting,data);
			controltree.expandNode(controltree.getNodes()[0],true,false,true);
		}
	});
	//保存，删除，新增
	$("#form").on("click",".buttons a",function(){
		if(this.textContent=='删除'){
			if(!model.door['id'].length){
				tip.alert("请双击选择要删除门禁");
				return;
			}
			tip.confirm("确认删除该门禁？",function(){
				db.updateByParamKey({
					request:{
						sqlId:'delete_door_door',
						params:[{id:model.door['id']}],
						whereId:'0'
					},
					success:function(data){
						treeContainer.removeNode(treeContainer.getNodeByTId(model.door['tid']));
						modelUtil.clear(model.door,{'cusnumber':'','user_id':''});
						tip.alert("删除成功");
					}
				});
			});
		}else if(this.textContent=='保存'){
			if(validate())return;
			tip.saving();
			if(model.door['id'].length){//更新
				db.updateByParamKey({
					request:{
						sqlId:'update_door_door',
						params:[model.door]
					},
					success:function(){
						
						var temp=treeContainer.getNodeByTId(model.door["tid"]);
	 		 			modelUtil.modelData(temp,model.door);
	 		 			temp.pid='1-'+temp.pid;
			 			//移动
			 			if(tId&&tId!=model.door['tid']){ 
			 				treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
			 			}
			 			treeContainer.updateNode(temp);
			 			
			 			modelUtil.clear(model.door,{'cusnumber':'','user_id':''});
			 			model.door['dbd_type']=null;
			 			model.door['dbd_stts_indc']=null;
			 			model.door['dbd_brand']=null;
			 			tip.alert("更新成功");
			 			tId=null;
					},
					error:function(a,b){
						tip.alert(b);
					}
				});
			}else{//新增
				db.updateByParamKey({
					request:{
						sqlId:'insert_door_door',
						params:[model.door]
					},
					success:function(data){
						var  pnode=treeContainer.getNodeByTId(tId);
 		 				var  temp=model.door;
 		 				temp.icon="door.png";
 		 				temp.id=data.data[0]['seqList'][0];
 		 				temp.type=1;
 		 				treeContainer.addNodes(pnode,-1,temp);
 		 				modelUtil.clear(model.door,{'cusnumber':'','user_id':''});
 		 				tip.alert("新增成功");
 		 				model.door['dbd_type']=null;
			 			model.door['dbd_stts_indc']=null;
			 			model.door['dbd_brand']=null;
 		 				tId=null;
					}
				});
			}
		}else{
			modelUtil.clear(model.door,{'cusnumber':'','user_id':''});
		}
			
		
	});
	function keepLeaf(list){
		var leaf=[];
		//获取子元素
		for(var i=0;i<list.length;i++){
			if(list[i]['type']==1){
				leaf.push(list.splice(i,1)[0]);
				i--;
			}
		}
		var pid=[];
		//获取父元素id
		for(var j=0;j<leaf.length;j++){
			if(pid.indexOf(leaf[j]['pid'])<0){
				pid.push(leaf[j]['pid'])
			}
		}
		var treeArray=[];
		//搜索父级元素
		var searchP=function(pid){
			for(var i=0;i<list.length;i++){
				if(list[i]['id']==pid){
					var temp=list.splice(i,1)[0];
					treeArray.push(temp);
					searchP(temp['pid']);
					i--;
				}
			}
		};
		//根据父id搜索
		for(var l=0;l<pid.length;l++){
			searchP(pid[l]);
		}
		return treeArray.concat(leaf);
	}
	function validate(){
		return !model.door['pid']&&!tip.alert("请选择区域")||
			   !model.door['dbd_dept_id']&&!tip.alert("请选择部门")||
			   !model.door['dbd_ctrl_id'].length&&!tip.alert("请选择控制器")||  
			   !model.door['name'].length&&!tip.alert("请输入名称")|| 
			   model.door['name'].length>26&&!tip.alert("名称过长")|| 
			   !(model.door['dbd_type']+'').length&&!tip.alert("请选择门禁类型	")|| 
			   !(model.door['dbd_brand']+'').length&&!tip.alert("请选择门禁品牌")|| 
			   !(model.door['dbd_stts_indc']+'').length&&!tip.alert("请选择门禁状态")||
			   !(model.door['dbd_dvc_stts']+'').length&&!tip.alert("请选择门禁设备状态")||
			   !model.door['dbd_ctrl_chl'].length&&!tip.alert("请输入通道号");
		
 	}
});