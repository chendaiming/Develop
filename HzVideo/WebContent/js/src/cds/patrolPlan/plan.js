define(['vue','frm/hz.db',"ztree","frm/treeUtil","frm/loginUser","frm/message","frm/hz.videoclient",'hz/map/map.handle',"frm/select","frm/datepicker"],function(tpl,db,tree,util,login,tip,video,hzMap){
	
	var detail=document.querySelector("#detailDiv"),container=detail.previousElementSibling;
	
	var temp,currentPlan;
	//
	var model=new tpl({
		el:'#container',
		data:{
			search:{
				camera:'',
				user:''
			},
			planList:[],
			
			fre:{	 "1":"每天",
		        	 "2":"每周"
			},
			freList:[
			         {id:'1',name:'每天'},
			       //  {id:'2',name:'每周'}
			]
		},
		methods:{
			hide:function(){
				detail.style.height="0%";
			},
			editPlan:function(e,item,index){
				model.search.camera='';
				model.search.user='';
				currentPlan=item;
				var pos=e.target.getBoundingClientRect();
				//
				
				if(e.target.tagName!='INPUT'&&pos.left+pos.width/2<e.x&&e.x<pos.left+pos.width/2+25&&e.y>pos.top&&e.y<pos.top+25){//显示摄像机，执行人
					setCheck(currentPlan.cameras,currentPlan.users);
					detail.style.height="45%";
				}else if(pos.left-39<e.x&&e.x<pos.left-19&&e.y>pos.top+pos.height*0.08&&e.y<pos.top+pos.height*0.08+20){//删除计划
					item.vpp_id?tip.confirm("<p style='color:#fff;'>确认删除该计划？</p>",function(){
						db.updateByParamKey({
							request:[{"sqlId":"delete_plan_user_link","params":{vpp_id:item.vpp_id,cus:login.cusNumber}},{"sqlId":"delete_plan_camera_link","params":{vpp_id:item.vpp_id,cus:login.cusNumber}},{"sqlId":"delete_vedio_plan","params":{vpp_id:item.vpp_id,cus:login.cusNumber}}],
							success:function(){
								var task=[{"vpp_id":item['vpp_id'],"vpp_name":item['vpp_name'],"vpp_excute_time":item['vpp_excute_time'],"vpp_frequenes":item['vpp_frequenes'],"opr":"remove"}];
								$.post(top.ctx+'vedioPlan/opr',"args="+JSON.stringify(task));
								model.planList.splice(index,1);
							}
						});
					}):model.planList.splice(index,1);
				}else{//隐藏摄像机，执行人
					detail.style.height="0%";
				}
			},
			editC:function(e,item,c,index,plan){//编辑摄像机
				var pos=e.target.getBoundingClientRect();
				if(pos.bottom-25<e.y&&e.y<pos.bottom-5 && pos.left+5<e.x&&e.x<pos.left+25){//定位
					hzMap.locationDvc(1,c.vcl_camera_id);
				}else if(pos.bottom-25<e.y&&e.y<pos.bottom-5 && pos.right-pos.width*0.02-20<e.x&&e.x<pos.right-pos.width*0.02){//播放视频
					video.play([c.vcl_camera_id]);
				}else if(pos.top-8<e.y&&e.y<pos.top+12 &&pos.right-12<e.x&&e.x<pos.right+8 ){//删除
					//tip.confirm("<p style='color:#fff;'>确认删除该摄像机？</p>",function(){
						item.splice(index,1);
						plan.change=true;
					//});
				}
			},
			editU:function(e,item,u,index,plan){//编辑执行人
				var pos=e.target.getBoundingClientRect();
				if(pos.top+3<e.y&&e.y<pos.top+21 && pos.right-pos.width*0.02>e.x&&e.x>pos.right-pos.width*0.02-18){//删除
					//tip.confirm("<p style='color:#fff;'>确认删除该执行人？</p>",function(){
						item.splice(index,1);
						plan.change=true;
					//});
				}
			},
			add:function(){
				this.planList.push({
					add:true,
					change:false,
					vpp_id:'',
					vpp_name:'',
					cameras:[],
					users:[]
				});
				model.$nextTick(function(){
					detail.previousElementSibling.scrollTop=detail.previousElementSibling.scrollHeight;
					
					var lastLi=container.querySelector("li:last-child");
					if(lastLi){
						var inputs=lastLi.querySelectorAll("input");
						[].forEach.call(inputs,function(inputItem){
							inputItem.onclick=function(){
								var temp=this.parentElement.parentElement.parentElement;
								if(temp.tagName!='LI'){
									temp=temp.parentElement;
								}
								//当前input 的位置
								[].forEach.call(container.children,function(item,index){
									if(item.isSameNode(temp)){
										model.planList[index].change=true;
									}
								});
							}
						});
					}
					
				});
				
			},
			save:function(){
				//计划名称
				var params=initPlanParam();
				if(!params.length){
					tip.alert("无可保存数据，请编辑后重试");
					return;
				}
				tip.saving();
				
				params.length&&db.updateByParamKey({
					request:params,
					success:function(data){
						var primaryId;
						if(params[0]['sqlId']=="insert_vedio_plan"){
							//获取新增的主键
							primaryId=data.data[0]['seqList'];
							setPrimaryKey(params[0]['params'],primaryId);
						}
						
						params=initLinkParam(primaryId);
						
						params.task&&$.post(top.ctx+'vedioPlan/opr',"args="+JSON.stringify(params.task),function(data){
							//保存用户关联表
							db.updateByParamKey({
								request:params.params,
								success:function(){
									tip.alert("<p style='color:#fff;'>保存成功</p>");
								}
							});
						});
					}
				});
			}
		}
	});
	//
	function initPlanParam(){
		var temp=container.querySelectorAll("input");
		var count=0;
		if(temp.length){
			temp.forEach(function(item){
				if(!item.value){
					item.classList.add("wait");
					count++;
				}else{
					item.classList.remove("wait");
				}
			});
			if(count>0){
				tip.alert("请补全数据");
				return [];
			}
		}else{
			tip.alert("请先添加计划");
			return []
		}
		var planAdd=[],planChange=[];
		
		for(var i=0,len=model.planList.length;i<len;i++){
			var temp=model.planList[i];
			if(temp.add){//新增
				planAdd.push({"cus":login.cusNumber,"vpp_id":temp['vpp_id'],"vpp_name":temp['vpp_name'],"vpp_excute_time":temp['vpp_excute_time'],"vpp_frequenes":temp['vpp_frequenes'],"vpp_creater":login.userId,"index":i});//计划主表
			}else if(temp.change){//修改
				planChange.push({"vpp_id":temp['vpp_id'],"vpp_cus_number":login.cusNumber,"vpp_name":temp['vpp_name'],"vpp_excute_time":temp['vpp_excute_time'],"vpp_frequenes":temp['vpp_frequenes'],"vpp_updater":login.userId});//计划主表
			}
		}
		var request=[];
		if(planAdd.length){
			request.push({"sqlId":"insert_vedio_plan","params":planAdd,"opr":"add"});
		}if(planChange.length){
			request.push({"sqlId":"update_vedio_plan",params:planChange,"opr":"edit"});
		}
		return request;
	}

	//获取修改和待入库的
	function initLinkParam(prId){	
		var camerasAdd=[];
		var usersAdd=[];
		var deleteIds=[];
		var task=[];
		for(var i=0,len=model.planList.length;i<len;i++){
			var temp=model.planList[i];
			if(temp.change||temp.add){
				deleteIds.push({"vpp_id":temp['vpp_id'],'cus':login.cusNumber});
				
				getParams(temp,temp['vpp_id'],camerasAdd,usersAdd);
				
				task.push({"vpp_id":temp['vpp_id'],"vpp_name":temp['vpp_name'],"vpp_excute_time":temp['vpp_excute_time'],"vpp_frequenes":temp['vpp_frequenes'],"cus":login.cusNumber+'',"opr":temp.add?"add":'update'});
			}
			temp.change=false;
			temp.add=false;
		}
		
		return {"params":[{"sqlId":"delete_plan_user_link","params":deleteIds},{"sqlId":"delete_plan_camera_link","params":deleteIds},{"sqlId":"insert_plan_camera_link","params":camerasAdd},{"sqlId":"insert_plan_user_link",params:usersAdd}],"task":task};
	}
	
	function getParams(plan,vpp_id,camerasAdd,usersAdd){
		
		var users=plan.users;
		
		for(var i=0,len=users.length;i<len;i++){
			var temp=users[i];
			//机构号，计划编号，计划关联的用户
			usersAdd.push({"vul_vpp_id":vpp_id,"cus":login.cusNumber,"vul_user_id":temp['vul_user_id']});
		}
		var cameras=plan.cameras;
		
		for(var i=0,len=cameras.length;i<len;i++){
			var temp=cameras[i];
			//机构号，计划编号，计划关联的摄像机
			console.log(temp);
			camerasAdd.push({"vcl_vpp_id":vpp_id,'cus':login.cusNumber,'vcl_camera_id':temp['vcl_camera_id']});
		}
	}
	//
	function  setPrimaryKey(list,keys){
		for(i=0,len=list.length;i<len;i++){
			model.planList[list[i]['index']]['vpp_id']=keys[i];
		}
	}
	var cameraTree,userTree;
	function init(){
		//初始化用户树
		var  request={};
		var depid=(login.dataAuth==0&&!login.sysAdmin)?login.deptId:login.cusNumber;
		login.cusNumber?(request.sqlId='query_user_org_byid',request.params=[depid,depid,depid,login.userId]):
		(login.dataAuth==2&&(request.params=[login.userId],request.whereId='0'));
		//树形设置
		var setting={
				path:'../../../libs/ztree/css/zTreeStyle/img/',
				edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
				view: {dblClickExpand: false},
				data: {simpleData: {enable: true,pIdKey: "pid"}},
				check:{enable:true},
				callback:{
					onCheck:function(e,id,node){
						currentPlan.change=true;
						if(node.checked){
							if(id=='camera'){
								if(node.id=='1-'+login.cusNumber){
									var list=cameraTree.transformToArray(node).filter(function(item){
										if(item.type==1)return true;
									});
									currentPlan.cameras=list.map(function(item){
										return {name:item.name,"vcl_camera_id":item.id,status:item.status};
									});
								}else{
									currentPlan.cameras.push({name:node.name,"vcl_camera_id":node.id,status:node.status});
								}
							}else{
								currentPlan.users.push({name:node.name,"vul_user_id":node.id});
							}
						}else{
							if(id=='camera'){
								if(node.id=='1-'+login.cusNumber){
									var list=cameraTree.transformToArray(node).filter(function(item){
										if(item.type==1)return true;
									});
									list.forEach(function(tempNode){
										currentPlan.cameras.forEach(function(item,index,arr){
											if(item.vcl_camera_id==tempNode.id){
												arr.splice(index,1);
											}
										});
									});
								}else{
									currentPlan.cameras.forEach(function(item,index,arr){
										if(item.vcl_camera_id==node.id){
											arr.splice(index,1);
										}
									});
								}
							}else{
								currentPlan.users.forEach(function(item,index,arr){
									if(item.vul_user_id==node.id){
										arr.splice(index,1);
									}
								});
							}
						}
					}
				}
		}
		var promise=new Promise(function(resolve,reject){
			//初始化摄像机
			 db.query({
				 request:{
					sqlId:'select_device_camera_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				 },
				 success:function(data){
					 data=keepLeaf(data,true);
					 data.push({id:'1-'+login.cusNumber,pid:'-2',name:'摄像机',icon:'qiang.png'});
					 cameraTree= $.fn.zTree.init($("#camera"), setting,data);
					//搜索树
					 model.$watch('search.camera',function(val,old){
						 util.searchTree("name",val,"camera",data,setting);
						 currentPlan&&setCheck(currentPlan.cameras,currentPlan.users);
					 });
					 resolve();
				 }
			 });
		});
		promise.then(function(arr){
			return new Promise(function(r,j){
				//初始化用户树
				db.query({
					request:{
						sqlId:'select_plc_by_orgidd',
						params:{'org':login.cusNumber,'level':(login.dataAuth!=2)?'2':'3'}//'level':(login.dataAuth!=2)?'2':'3'
					},success:function(data){
						 data=keepLeaf(data);
						 data.push({id:'1-'+login.cusNumber,pid:'-2',name:'执行人',icon:'user.png',nocheck:true});
						 userTree= $.fn.zTree.init($("#user"), setting,data);
						 
						 model.$watch('search.user',function(val,old){
							 util.searchTree("name",val,"user",data,setting);
							 currentPlan&&setCheck(currentPlan.cameras,currentPlan.users);
						 });
						 r();
					}
				});
			});
		}).then(function(){
			db.query({
				request:{
					sqlId:'select_vedio_plan',
					params:{cus:login.cusNumber},
					orderId:'0'
				},success:function(data){
					var cameras=[],users=[];
					for(var i=0,len=data.length;i<len;i++){
						data[i].cameras=getLinkName(data[i].cameras?data[i].cameras.split(","):[],"vcl_camera_id");
						data[i].users=getLinkName(data[i].users?data[i].users.split(","):[],"vul_user_id");
					}
					model.planList=data;
					
					model.$nextTick(function(){
						var arr=container.querySelectorAll("input");
						[].forEach.call(arr,function(inputItem,index){
							inputItem.onclick=function(){
								var temp=this.parentElement.parentElement.parentElement;
								if(temp.tagName!='LI'){
									temp=temp.parentElement;
								}
								//当前input 的位置
								[].forEach.call(container.children,function(item,index){
									if(item.isSameNode(temp)){
										model.planList[index].change=true;
									}
								});
							}
							
						});
					});
				}
			});
		});
	}
	//设置属性check
	function setCheck(camera,user){
		
		userTree.checkAllNodes(false);
		cameraTree.checkAllNodes(false);
		
		camera.forEach(function(row,index){
			var  temp=cameraTree.getNodeByParam("id",row.vcl_camera_id);
			temp&&cameraTree.checkNode(temp, true);
		});
		user.forEach(function(row,index){
			var  temp=userTree.getNodeByParam("id",row.vul_user_id);
			temp&&userTree.checkNode(temp, true);
		});
		if(camera.length==total){
			cameraTree.checkNode(cameraTree.getNodes()[0],true,true);
		}
	}
	
	
	function getLinkName(list,key){
		var temp=[],item,t;
		for(var i=0,len=list.length;i<len;i++){
			item=list[i].split("|");
			t={"name":item[1]};
			t[key]=item[0];
			temp.push(t);
		}
		return temp;
	}
	var total=0;
	//保留子节点
	function keepLeaf(list,flag){
		var leaf=[];
		//获取子元素
		for(var i=0;i<list.length;i++){
			if(list[i]['type']==1){
				flag&&total++;
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
	init();

});