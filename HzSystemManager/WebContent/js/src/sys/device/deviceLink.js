define(["vue","frm/message","frm/loginUser",'frm/hz.db',"frm/treeUtil","frm/model","frm/select"],function(tpl,tip,login,db,tree,modelData){
	//设备缓存
	var deviceList={};
	//树形缓存
	var deviceTree={};
	//数据缓存
	var treeData={};
	//已关联，未关联
	var linkedList={},linkingList={};
	
	var deviceTypeHtml=$("#deviceTypeList"),
		mapDevice=document.getElementById("mapDevice");
	//
	//act
	var typeAct={
			1:[],//摄像机关联的操作
			2:[]//门禁操作
	}
	var tempChild,tempParent;
	
	var deleteDevices=[];
	
	var dtype;
	var model=new tpl({
		el:"#container",
		data:{
			searchP:'',
			purpose:[],
			deviceLinkPurpose:[],
			deviceActions:[],
			deviceTypes:[],
			deviceType:[],
			deviceSelect:[],
			isExpand:false,
			searchTree:'',
			mark:'',
			checkedStatus:{
				link:'',
				linked:''
			}
		},
		watch:{
			searchP:function(val){
				
				tree.searchTree('name',val, 'devicetree'+dtype,treeData['ztree'+dtype], set);
			},
			searchTree:function(val){
				var flag=!this.checkedStatus.link&&!this.checkedStatus.linked;
				for(var type in this.zTreeShows) {
					this.zTreeShows[type]&&tree.searchTree('name',val, 'ztree'+type,flag?treeData['ztree'+type]:(this.checkedStatus.link?linkingList[type]:linkedList[type]), setting);
				}
			},
			'checkedStatus.link':function(val,old){
				if(typeof val=='number')return;
				model.mark='';
				this.deviceSelect=[];
				this.deviceType=[];
				if(val){//未关联
					this.checkedStatus['linked']=0;
					for(var type in this.zTreeShows) {
						var temp=this.zTreeShows[type]&&$.fn.zTree.init($('#ztree'+type),setting,linkingList[type]);
						temp&&temp.expandAll(true);
					}
				}else{
					for(var type in this.zTreeShows) {
						this.zTreeShows[type]&&$.fn.zTree.init($('#ztree'+type),setting,treeData['ztree'+type]);
					}
				}
			},
			'checkedStatus.linked':function(val){
				if(typeof val=='number')return;
				model.mark='';
				this.deviceSelect=[];
				this.deviceType=[];
				if(val){
					this.checkedStatus['link']=0;
					for(var type in linkedList){
						if(this.zTreeShows[type]){
							var temp=this.zTreeShows[type]&&$.fn.zTree.init($('#ztree'+type),setting,linkedList[type]);
							temp&&temp.expandAll(true);
						}
					}
				}else{
					for(var type in this.zTreeShows) {
						this.zTreeShows[type]&&$.fn.zTree.init($('#ztree'+type),setting,treeData['ztree'+type]);
					}
				}
			}
		},
		methods:{
			expand:function(){
				this.isExpand=!this.isExpand
			},
			remove:function(flag,tid,e){
				var pos=e.target.getBoundingClientRect();
				if(flag==1){
					if(e.x<pos.left+e.target.clientWidth+7&&e.x>pos.left+e.target.clientWidth-7&&e.y<pos.top+7&&e.y>pos.top-7){
						var tempTree=deviceList[tid.substr(0,tid.indexOf('_'))];
						var tempNode=tempTree.getNodeByTId(tid);
						if(tempNode.linkid){
							tip.confirm('确认删除所有关联设备？',function(){
								tempTree.checkNode(tempNode,false,true);
								tempTree.removeNode(tempNode);
								var tempTreePid = tempNode.pid.split('-');
								for(var type in linkedList[tempTreePid[0]]) {
									if(linkedList[tempTreePid[0]][type].pid==tempNode.pid){
										linkedList[tempTreePid[0]].splice(type,1);
										linkingList[tempTreePid[0]].splice(type,0,tempNode);
										break;
									}
								}
								model.deviceSelect.splice(model.deviceSelect.indexOf(tempNode),1);
								model.deviceSelect.length==0&&(model.deviceType=[]);
								remove(tempNode);
							});
						}else{
							tempTree.checkNode(tempNode,false,true);
							
							model.deviceSelect.splice(model.deviceSelect.indexOf(tempNode),1);
							
							model.deviceSelect.length==0&&(model.deviceType=[]);
						}
					}
				}else{
					
				}
			},
			addDevice:function(type,e){
				if(type==1){
					add();
				}
			},
			deviceType:function(e){
				
			},
			slideDown:function(item,e,parent,flag){//
				var pos=e.target.getBoundingClientRect();
				tempParent=parent;
				tempChild=item;
				if(flag){
					if(flag==2){
						//删除设备
						if(e.x<pos.left+e.target.clientWidth+7&&e.x>pos.left+e.target.clientWidth-7&&e.y<pos.top+7&&e.y>pos.top-7){
							
							var pos=parent.deviceLink.indexOf(item);
							
							pos>-1&&parent.deviceLink.splice(pos,1);
							
							if(parent.deviceLink.length==0){//设备类型
								
								pos=parent.parent.children.indexOf(parent);
								
								pos>-1&&parent.parent.children.splice(pos,1);
								
								if(parent.parent.children.length==0){
									
									pos=parent.parent.parent.children.indexOf(parent.parent);
									
									deleteDevices.push({linkid:parent.parent.linkid,type:parent.parent.parent.deviceType});
									
									pos>-1&&parent.parent.parent.children.splice(pos,1);
								}
								
								if(parent.parent.parent.children.length==0){
									
									model.deviceSelect.forEach(function(row){
										var tree=deviceList['ztree'+row.tId.substring(5,row.tId.indexOf('_'))];
										
										tree.checkNode(tree.getNodeByTId(row.tId), false, false);
									});
									//remove(tempNode);
									//saveDeviceLink();
									//model.deviceSelect=[];
									remove(deleteDevices);
								}
							}
							return;
						}
						
						if(!parent.id){tip.alert("请先选择设备类型");return;}
						
						dtype=parent.id;
						
						document.querySelector("#devicet"+parent.id).style.width="417px";
						
					}else if(flag==3){
						$("#devicepurpose").css({top:pos.top+e.target.clientHeight-3,left:pos.left,width:e.target.clientWidth}).slideDown();
					}else if(flag==1){
						model.deviceActions=typeAct[parent.id];
						
						if(!parent.id){tip.alert("请先选择设备类型");return;}
						
						$("#deviceAction").css({top:pos.top+e.target.clientHeight-3,left:pos.left,width:e.target.clientWidth}).slideDown();
					}
					
				}else{//设备类型
					deviceTypeHtml.css({top:pos.top+e.target.clientHeight-3,left:pos.left,width:e.target.clientWidth}).slideDown();
				}
			},
			select:function(type,e,flag){
				if(flag==1){//设备类型
					for(var i=0,len=tempParent.children.length;i<len;i++){
						if(type.name==tempParent.children[i].typeName){
							tempParent.children[i].deviceLink.push({name:'请选择设备',act:'请选择操作',tip:'1','tipd':'1'});
							return;
						}
					}
					if(!tempChild.id){	
						tempChild.typeName=type.name;
						tempChild.id=type.id;
					}else{
						tempParent.children.push({parent:tempParent,typeName:type.name,id:type.id,deviceLink:[{name:'请选择设备',act:'请选择操作',tip:'1','tipd':'1'}]});
					}
				}else if(flag==3){//用途
					
					var purpose=tempParent?tempParent.children:tempChild.parent.children;
					for(var i=0,len=purpose.length;i<len;i++){
						if(purpose[i]['name']==type.name){
							var deviceLink={
									act:'请选择操作',
									name:'请选择设备',
									tip:'1',
									tipd:'1'
								};
							var deviceType={
									parent:null,
									typeName:'请选中设备类型',
									tip:'1',
									deviceLink:[deviceLink]
								};
							deviceType.parent=purpose[i];
							purpose[i].children.push(deviceType);
							return;
						}
					}
					
					tempChild.id=type.id;
					
					tempChild.name=type.name;
					
				}else if(flag==2){
					tempChild.act=type.name;
					tempChild.actid=type.id.split('-').length>1?type.id.split('-')[1]:type.id;
				}
				tempChild.tip='';
			},
			save:function(){
				if(this.deviceSelect.length==0){
					tip.alert("请先选择设备");
					return;
				}
				var list=mapDevice.querySelectorAll("p[data-tip='1']");
				if(list&&list.length>0){
					tip.alert("数据不完整,请补全数据!");
					return;
				}
				if(model.mark.length>85){
					tip.alert("备注过长,请输入85个以内字符!");
					return;
				};
				saveDeviceLink();
			}
		}
	});
	
	/*model.deviceSelect=[{
		mark:'',
		linkid:'',
		name:node.name,
		tip:'1',
		children:[{
			id:'',
			name:'请选择用途',
			mainLinkid:'',
			tip:'1',
			children:[{
				typeName:'请选中设备类型',
				tip:'1',
				deviceLink:[{
					act:'请选择操作',
					name:'请选择设备',
					tip:'1'
				}]
			}]
		}]
	}];*/
	function add(){
		var deviceLink={
				act:'请选择操作',
				name:'请选择设备',
				tip:'1',
				tipd:'1'
			};
		var deviceType={
				parent:null,
				typeName:'请选中设备类型',
				tip:'1',
				deviceLink:[deviceLink]
			};
		var linkPurpose={
				id:'',
				name:'请选择用途',
				mainLinkid:'',
				tip:'1',
				children:[deviceType],
				parent:null
			};
		deviceType.parent=linkPurpose;
		
		linkPurpose.parent=model.deviceSelect[model.deviceSelect.length-1];
		
		model.deviceSelect[model.deviceSelect.length-1].children.push(linkPurpose);
		
	}
	//在扩谱图中搜索类型
	function search(id){
		for(var i=0,len=model.deviceType.length;i<len;i++){
			if(model.deviceType[i].id==id){
				return i;
			}
		}
		return -2;
	}
	//保存更新
	function saveDeviceLink(){
		var linkIDList=[];

		var mainDevice=[];
		
			
		var row=model.deviceSelect[0];
		
		row.children.forEach(function(pur){
			
			if(pur.linkid){
				
			   linkIDList.push(pur.linkid);//需要修改的从表
			   
			   mainDevice.push({'sqlId':"update_deviceLink_base",'whereId':'0',params:{'linkid':pur.linkid,'seq':pur.linkid,'mark':row.mark,'device':row.device,'cus':login.cusNumber,'type':row.deviceType,'name':row.name,'user':login.userId,'purposeid':pur.id}});
			}else{
			   mainDevice.push({'sqlId':"insert_deviceLink_base",params:{'mark':model.mark,'device':row.device,'cus':login.cusNumber,'type':row.deviceType,'name':row.name,'user':login.userId,'purposeid':pur.id}});
			}
		});
		deleteDevices.forEach(function(item){
			item.linkid&&mainDevice.unshift({'sqlId':'delete_deviceLink_base',params:{type:item.type,linkid:item.linkid,cus:login.cusNumber}});
		});
			
		db.updateByParamKey({
			request:mainDevice,
			success:function(data){
				
				var linkList=[],temp;
				
				data=data.data;
				
				data.forEach(function(row){
					row.seqList&&linkIDList.push(row.seqList[0]);
				});
				
				var purs=model.deviceSelect[0].children;
				
				temp=[];
				
				for(var i=0,len=linkIDList.length;i<len;i++){
					
					var types=purs[i].children;
					
					for(var z=0,zlen=types.length;z<zlen;z++){
						
						var devs=types[z].deviceLink;
						
						temp=temp.concat(devs.map(function(dev){
							
							return  {'type':types[z].id,'cus':login.cusNumber,'linkid':linkIDList[i],'linkdevice':dev.deviceid,'linkname':dev.name,'actid':dev.actid};
						
						}));
					}
				}
				
				linkList.push({
					'sqlId':'insert_deviceLink_attachment',
					'params':temp
				});
				linkList.unshift({
					'sqlId':'delete_deviceLink_attach',
					'whereId':'0',
					'params':{'device':model.deviceSelect[0]['device'],'cus':login.cusNumber}//model.deviceSelect.map(function(row){return {'linkid':linkId,'cus':login.cusNumber}})
				});
				db.updateByParamKey({
					request:linkList,
					success:function(){
						
						var tempNode;
						
						model.deviceSelect.forEach(function(row,i){
							
							var tree=deviceList['ztree'+row.tId.substring(5,row.tId.indexOf('_'))];
							
							var linkedNode=tree.getNodeByTId(row.tId);
							
							linkedNode&&tree.checkNode(linkedNode,false,true);
							
							if(linkedNode&&model.checkedStatus.link){
								tree.removeNode(linkedNode);
							};
							
							var tempTreePid = row.deviceType;
							
							for(var i=0,len=linkingList[tempTreePid[0]].length;i<len;i++){
								
								if(linkingList[tempTreePid[0]][i].id==row.id){
									
									linkingList[tempTreePid[0]].splice(i,1);
									
									linkedList[tempTreePid[0]].push({
										icon:linkedNode.icon,
										id:linkedNode.id,
										name:linkedNode.name,
										nocheck:linkedNode.nocheck,
										pid:linkedNode.pid,
										type:linkedNode.type
									});
									break;
								}
							}
						});

						model.deviceSelect=[];
						model.deviceType=[];
						tip.alert('保存成功');
						model.mark='';
					}
				});
			}
		});
	}
	//删除关联
	function remove(devDelete){
		
		var obj=model.deviceSelect[0];
		db.updateByParamKey({
			request:[{//删除从表
				sqlId:'delete_deviceLink_attach',
				params:{'device':obj['device'],'cus':login.cusNumber}
			},{//删除主表
				sqlId:'delete_deviceLink_base',
				params:{'linkid':devDelete[0]['linkid'],'cus':login.cusNumber,'type':obj.deviceType}
			}],
			success:function(){
				
				tip.alert('删除完成');
				
				model.deviceSelect=[];
				model.deviceType=[];
				model.mark='';
				
				var tree=deviceList['ztree'+obj.deviceType];
				
				var linkedNode=tree.getNodeByTId(obj.tId);
				
				if(linkedNode&&model.checkedStatus.linked){
					tree.removeNode(linkedNode);
				}
				
				var linked=linkedList[obj.deviceType];
				
				var linking=linkingList[obj.deviceType];
				
				for(var j=0,jlen=linked.length;j<jlen;j++){
					
					if(linked[j].id==obj.device){
						
						linked.splice(j,1);
						
						linking.push({
							icon:linkedNode.icon,
							id:linkedNode.id,
							name:linkedNode.name,
							nocheck:linkedNode.nocheck,
							pid:linkedNode.pid,
							type:linkedNode.type
						});
						break;
					}
				}
			}
		});
	}
	var setting={
			check:{enable:true},
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			callback:{
				onCheck:function(e,id,node){
					if(!node.checked){
						model.mark='';
						model.deviceSelect.splice(model.deviceSelect.indexOf(node),1);
						model.deviceSelect.length==0&&(model.deviceType=[]);
					}else{
						model.deviceSelect.forEach(function(row){
							var tree=deviceList['ztree'+row.tId.substring(5,row.tId.indexOf('_'))];
							tree.checkNode(tree.getNodeByTId(row.tId),false,true);
						});
						var deviceType=node.tId.substring(5,node.tId.indexOf('_'));
						
						//deviceList['ztree'+deviceType].checkAllNodes(false);
						
						
						db.query({
							request:{//查询主表
								sqlId:'select_device_purpose',
								whereId:"0",
								params:{'cus':login.cusNumber,'device':node.id,'type':deviceType}
							},success:function(data){
								
								if(data.length>0){
									model.deviceSelect=[{
											mark:data[0].mark,
											name:node.name,
											children:[],
											deviceType:deviceType,
											device:node.id,
											tId:node.tId
									}];
									
									var linkRequest=[];
									
									var temp;
									
									for(var i=0,len=data.length;i<len;i++){
										temp=data[i];
										
										model.deviceSelect[model.deviceSelect.length-1].children.push({
											id:temp.purposeid,
											name:temp.purpose,
											linkid:temp.linkid,
											children:[],
											parent:model.deviceSelect[model.deviceSelect.length-1]
										});
										
										linkRequest.push({
											sqlId:'select_devcelink_dvc',
											whereId:'0',
											params:{'cus':login.cusNumber,'linkid':temp.linkid}
										});
									}
									
									db.query({//查询从表
										request:linkRequest,
										success:function(linkdata){//
											
											for(var i=0,len=linkdata.length;i<len;i++){
												model.deviceSelect[model.deviceSelect.length-1].children[i]['children']=initMap(linkdata[i],model.deviceSelect[model.deviceSelect.length-1].children[i]);
											}
											
											if(linkdata.length==0){
												
												model.deviceSelect.children.push({
														typeName:'设备类型',
														tip:'1',
														deviceLink:[
														            {
														            	name:'请选择设备',
														            	act:'动作',
														            	tip:'1',
														            	'tipd':'1'
														           }]
												});
											}
										}
									});
								}else{
									var devices={
											act:'请选择操作',
											name:'请选择设备',
											tip:'1',
											tipd:'1'
										};
									
									var devType={
											typeName:'请选中设备类型',
											tip:'1',
											deviceLink:[devices]
										}
									var purpose={
										id:'',
										name:'请选择用途',
										linkid:'',
										tip:'1',
										children:[devType]
									};
									devType.parent=purpose;
									
									model.deviceSelect=[{
										mark:'',
										name:node.name,
										tip:'1',
										deviceType:deviceType,
										device:node.id,
										tId:node.tId,
										children:[purpose]
									}];
									purpose.parent=model.deviceSelect[0];
								}
							}
						});
					}
				}
			}
	};
	var set={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			callback:{
				onClick:function(e,id,node){
					if(node.type==1){
						if(validate(node.id))return;
						tempChild.name=node.name;
						tempChild.deviceid=node.id;
						tempChild.tipd='';
						$("#"+id).parent().css({'width':0});
					}else{
						tip.alert("请选择设备");
					}
					
				}
			}
	};
	function validate(id){
		var temp=tempParent.deviceLink;
		for(var i=0,len=temp.length;i<len;i++){
			if(id==temp[i].deviceid){
				tip.alert("设备已关联,请选择其他设备");
				return true;
			}
		}
		return false;
	}
	//初始化各种树
	function init(){
		//已关联设备
		db.query({
			request:{
				sqlId:'select_linked_device',
				params:{cus:login.cusNumber}
			},success:function(linkedData){
				var linkedData=linkedData;
				//设备类型查询
				db.query({
					request:{
						"sqlId":"select_constant_bycode",
						"whereId":0,
						"params":["DGT_DVC_TYPE"]
					},success:function(data){
						model.deviceTypes=data;
						var linked={};
						for(var i=0,len=linkedData.length;i<len;i++){
							!linked[linkedData[i]['type']]&&(linked[linkedData[i]['type']]=[]);
							linked[linkedData[i]['type']]=linkedData[i]['id'].split(',');
						}
						
						for(var key in deviceSql){
							queryDevice(key,linked[key]?linked[key]:[]);
						}
					}
				});
				//关联用途查询
				db.query({
					request:{
						"sqlId":"select_constant_bycode",
						"whereId":0,
						"params":["DLM_LINK_PURPOSE"]
					},success:function(data){
						model.deviceLinkPurpose=data;
					}
				});
				//每种类型拥有的操作
				db.query({
					request:{
						sqlId:"select_constant_bycode",
						whereId:'0',
						params:["TYPE_DEVICE_LINK_ACT"]//设备  类型-常量值  1-0    1摄像机类型，为0的操作
					},success:function(data){
						var temp;
						for(var i=0,len=data.length;i<len;i++){
							temp=data[i].id.split('-');
							if(!typeAct[temp[0]]){
								typeAct[temp[0]]=[];
							}
							typeAct[temp[0]].push(data[i]);
						}
					}
				});
			}
		});
	}
	//查询设备，初始化用
	function queryDevice(deviceType,linkedData){
		db.query({
			request:deviceSql[deviceType].params,
			success:function(data){
				
				data=keepLeaf(data);
				
				//deviceTree['devicet'+deviceType]=
				$.fn.zTree.init($('#devicetree'+deviceType),set,data);
				
				data=data.concat(deviceSql[deviceType].node);
				
				deviceList['ztree'+deviceType]=$.fn.zTree.init($('#ztree'+deviceType),setting,data);
				//缓存搜索用
				treeData['ztree'+deviceType]=data;
				
				linkedDevice(data,deviceType,linkedData);
			}
		});
		
	}
	//已关联
	function linkedDevice(data,type,linkedData){
		
		linkedList[type]=[];
		linkingList[type]=[];
		for(var i =0,len=data.length;i<len;i++){
			if(data[i].type==1){
				linkedData.indexOf(data[i].id)>-1?linkedList[type].push(data[i]):
					linkingList[type].push(data[i]);
				continue;
			}
			linkedList[type].push(data[i]);
			linkingList[type].push(data[i]);
		} 
		for(var type in linkedList){
			linkedList[type]=keepLeaf(linkedList[type]);
			linkingList[type]=keepLeaf(linkingList[type]);
		}
	}
	//查询设备
	var deviceSql={
			"1":{//摄像机类别1
				params:{
					sqlId:'select_device_camera_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'摄像机',icon:'qiang.png',nocheck:true}
			},
			"2":{//门禁类别为2
				params:{
					sqlId:'select_device_door_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'门禁',icon:'door.png',nocheck:true}
			},
			"3":{//对讲设备
				params:{
					sqlId:'select_device_videotalk_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'对讲设备',icon:'talk.png',nocheck:true}
			},	
			"4":{//广播
				params:{
					sqlId:'select_device_broadcast_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},	
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'广播',icon:'broad.png',nocheck:true}
			},
			"5":{//电视墙
				params:{
					sqlId:'select_device_screen_type',
					params:{'cus':login.cusNumber},
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'电视墙',icon:'screen.png',nocheck:true}
			},
			"6":{//网络报警select_device_alertor_type
				params:{
					sqlId:'select_device_alertor_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'网络报警',icon:'alarm.png',nocheck:true}
			},
			"7":{//高压电网select_device_network_type
				params:{
					sqlId:'select_device_network_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'高压电网',icon:'power.png',nocheck:true}
			},
			"15":{//RFID
				params:{
					sqlId:'select_device_rfid_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'RFID基站',icon:'trans.png',nocheck:true}
			},
			"16":{//巡更基站
				params:{
					sqlId:'select_device_patrol_type',
					params:{'cus':login.cusNumber},
					orderId:'0',
					whereId:'0'
				},
				node:{id:'1-'+login.cusNumber,pid:'-2',name:'巡更刷卡器',icon:'door.png',nocheck:true}
			}
	}
	//保留子节点
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
	function initMap(data,parent){
		var deviceType={
				'1':{
					'typeName':'摄像机',
					'id':'1',
					'deviceLink':[]
				},
				'2':{
					'id':'2',
					'typeName':'门禁',
					'deviceLink':[]
				},
				'3':{
					'id':'3',
					'typeName':'对讲设备',
					'deviceLink':[]
				},
				'4':{
					'id':'4',
					'typeName':'广播',
					'deviceLink':[]
				},
				'5':{
					'id':'5',
					'typeName':'大屏',
					'deviceLink':[]
				},
				'6':{
					'id':'6',
					'typeName':'网络报警',
					'deviceLink':[]
				},
				'7':{
					'id':'7',
					'typeName':'高压电网',
					'deviceLink':[]
				},
				'15':{
					'id':'15',
					'typeName':'RFID基站',
					'deviceLink':[]
				},
				'16':{
					'id':'16',
					'typeName':'巡更刷卡器',
					'deviceLink':[]
				}
		}
		var list=[];
	
		for(var i=0,len=data.length;i<len;i++){
			deviceType[data[i].type].deviceLink.push(data[i]);
			deviceType[data[i].type].parent=parent;
		}
		for(var key in deviceType){
			if(deviceType[key].deviceLink.length!=0){
				list.push(deviceType[key]);
			}
		}
		return list;
	}
	init();
	
	
	document.querySelector("#mapDevice").addEventListener("click",function(){
		
		var devs=document.querySelectorAll("div.hide_left");
		[].forEach.call(devs,function(item){
			item.style.width="0px";
		});
	});
});