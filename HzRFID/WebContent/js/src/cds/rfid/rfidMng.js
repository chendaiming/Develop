define(['jquery','vue','frm/hz.db',"frm/loginUser","frm/treeSelect","frm/model","frm/message","frm/treeUtil","frm/select"],function($,tpl,db,login,treeSelect,modelUtil,tip,util,select){
	//
	console.log(login);
	var model=new tpl({
			el:'#form',
			data:{
				station:{
					'pid':'',
					'tid':'',
					'id':'',
					'rbd_cus_number':login.cusNumber,
					'rbd_other_id':'',
					'name':'',
					'rbd_brand':'',
					'rbd_ip':'',
					'rbd_port':'',
					'rbd_dept_id':'',
					'rbd_dept':'',
					'rbd_area_id':'',
					'rbd_area':'',
					'rbd_room_id':'',
					'rbd_dvc_addrs':'',
					'rbd_stts':'',
					'rbd_seq':'',
					'rbd_crte_time':'',
					'rbd_crte_user_id':login.userId,
					'rbd_crte_us':'',
					'rbd_updt_time':'',
					'rbd_updt_user_id':login.userId,
					'rbd_updt_us':''
				}
			}
		});
	//基站信息
	var treeContainer, depTree,tId;
	//如果用户的数据权限不是本辖区的则部门号就是机构号
	var auth=login.dataAuth!=2?'2':'3';
	/*var request={
			sqlId:'query_station_info',
			orderId:'0',
			params:[auth,login.cusNumber]
		};*/
	
	treeLoad({
		sqlId:'query_station_info',
		orderId:'0',
		params:[auth,login.cusNumber]
	});
	
	function treeLoad(dataRequest){
		login.dataAuth!=2&&(dataRequest.whereId=0,dataRequest.params.push(login.cusNumber));
		db.query({
			request:dataRequest,
			success:function(data){
				var setting={
						path:'../../../libs/ztree/css/zTreeStyle/img/',
						data: {simpleData: {enable: true,pIdKey: "pid"}},
						check: {enable: false},
						callback:{
							onClick:function(e,id,node){
								if(node.type!=1){
									model.station['rbd_area']=node['name'];
									model.station['pid']=node.id.replace("1-","");
									tId=node.tId;
									model.station['rbd_stts']=0;
								}
							},
							onDblClick:function(id,e,node){
								if(node.type==1){ 
									modelUtil.modelData(model.station,node);
									model.station['name']=node.name;
									model.station['rbd_stts']=node.stts,
									model.station['tid']=node.tId;
									model.station['rbd_area']=node.getParentNode()['name'];
									var temp=depTree.getNodeByParam("id",node['rbd_dept_id']);
									model.station['rbd_dept']=temp&&temp['name'];
									model.station['pid']=node.pid.replace("1-","");
								}
								else{
									model.station['pid']=node.id.replace("1-","");
									model.station['rbd_stts']=0;
								}
							}
						}
				};
//				model.station['rbd_stts']=0;
				treeContainer=$.fn.zTree.init($("#tree"), setting,data);
				$("#input").keyup(function(){
					util.searchTree("name",this.value,"tree",data,setting);
				});
			}
		});
	}
	
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
							model.station['rbd_dept']=node.name;
							model.station['rbd_dept_id']=node.id;
						}
					}
			};
			data[0].open=true;
			depTree=treeSelect.init('dep', setting,data);
		}
	});
	$("#form").on("click",".buttons a",function(){
		if(this.textContent=='删除'){
			if(!model.station['id'].length){
				tip.alert("请选择要删除的基站");
				return;
			}
			var info="";
			if(model.station['name']){
				info="确认删除名称为"+model.station['name']+"的基站？"
			}else{
				info="确认删除该基站？"
			}
			tip.confirm(info,function(){
				db.updateByParamKey({
					request:[{
						sqlId:'delete_station_info',
						params:[{id:model.station['id']}]
					}],
					success:function(data){
		 				//treeContainer.removeNode(treeContainer.getNodeByTId(model.station['tid']));
		 				treeLoad({
		 					sqlId:'query_station_info',
		 					orderId:'0',
		 					params:[auth,login.cusNumber]
		 				});
		 				//treeContainer.refresh();
						modelUtil.clear(model.station,{'rbd_cus_number':'','rbd_crte_user_id':'','rbd_updt_user_id':''});
						tip.alert("删除成功");
					},
					error:function(){
						tip.alert("删除失败");
					}
				});
			});
			
		}else if(this.textContent=='保存'){
			if(validate())return;
			if(model.station['id']&&model.station['id'].length){//修改
				db.updateByParamKey({
					request:{
						sqlId:'update_station_info',
						params:[model.station]
					},
					success:function(data){
						var temp=treeContainer.getNodeByTId(model.station["tid"]);
	 		 			modelUtil.modelData(temp,model.station);
			 			//移动
			 			if(tId&&tId!=model.station['tid']){ 
			 				treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
			 			}
			 			treeContainer.updateNode(temp);
			 			
			 			modelUtil.clear(model.station,{'rbd_cus_number':'','rbd_crte_user_id':'','rbd_updt_user_id':''});
			 			tip.alert("更新成功");
			 			treeLoad({
		 					sqlId:'query_station_info',
		 					orderId:'0',
		 					params:[auth,login.cusNumber]
		 				});
			 			tId=null;
					}
				});
			}else{//新增
				db.updateByParamKey({
					request:{
						sqlId:'insert_station_info',
						params:[model.station]
					},
					success:function(data){
						var  pnode=treeContainer.getNodeByTId(tId);
 		 				var  temp=model.station;
 		 				temp.icon="control.png";
 		 				temp.id=data.data[0]['seqList'][0];
 		 				temp.type=1;
 		 				treeContainer.addNodes(pnode,-1,temp);
 		 				modelUtil.clear(model.station,{'rbd_cus_number':'','rbd_crte_user_id':'','rbd_updt_user_id':''});
 		 				tip.alert("新增成功");
 		 				treeLoad({
		 					sqlId:'query_station_info',
		 					orderId:'0',
		 					params:[auth,login.cusNumber]
		 				});
 		 				tId=null;
 		 				
 		 				
					}
				});
			}
		}else{
			modelUtil.clear(model.station,{'rbd_cus_number':'','rbd_crte_user_id':'','rbd_updt_user_id':''});
		}
	});
	
	function validate(){
		var reg=/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
		return  !model.station['name'].length&&!tip.alert("请输入基站名称")||
				!model.station['rbd_other_id'].length&&!tip.alert("请输入厂商唯一编号")||
				!String(model.station['rbd_brand']).length&&!tip.alert("请选择基站品牌")||
				!model.station['rbd_ip']&&!tip.alert("请输入IP地址")||
				reg.test(model.station['rbd_ip'])==false&&!tip.alert("IP地址格式不正确")||
			    !model.station['rbd_port'].length&&!tip.alert("请输入端口号")||
			    (!/^[0-9]*$/.test(model.station['rbd_port']))&&!tip.alert("端口号为整数")||
			    model.station['rbd_port']>65535&&!tip.alert("端口号不存在")||
			    !model.station['rbd_dept'].length&&!tip.alert("请选择所属部门")||
			    !model.station['rbd_area'].length&&!tip.alert("请选择所属区域")||
			    !String(model.station['rbd_stts']).length&&!tip.alert("请选择状态")||
			    model.station['name'].length>26&&!tip.alert("名称过长");
		
 	}
});