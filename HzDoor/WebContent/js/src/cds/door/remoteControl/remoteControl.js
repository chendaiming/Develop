define(['jquery','vue','frm/hz.db',"frm/loginUser","frm/hz.door","frm/treeUtil","frm/dialog","frm/message","hz/map/map.handle","frm/hz.videoclient","ztree","layer"],function($,vue,db,login,door,treeUtil,dialog,tip,map,video){
	
	var container=$("#listcontainer");
	var treeContainer,personTree;
	
	var doorIds=[];
	var model=new vue({
		el:'#form',
		data:{
			remote:{
				doors:[],
				currentarea:'',
				search:'',
				pwd:'',
				avoid:'',
				password:[],
				personDoors:[]
			},
			search:'' 
		},
		methods:{
			opr:function(a,flag){
				doorIds=getSelect();
				if(!flag&&doorIds.length==1){
					map.locationDvc(2,doorIds[0]);//carmeraid为门禁id
					(a=='open'||a=='close')&&callVideo();
				}
				if(!flag&&model.remote['avoid']==1){//免密
					fnc[a]();
					return;
				}
				
				fnc['password'](a);
			},
			passwordhide:function(e){
				var p=document.getElementById("password");
				if(p.parentNode.id=="form"||e.target.id=="password")return;
				p.parentNode.parentNode.style.display="none";
			},
			save:function(){
				var list=personTree.getCheckedNodes(true),doors=[];
				for(var i=0,len=list.length;i<len;i++){
					if(list[i].type==1){
						doors.push({'cus':login.cusNumber,'user':login.userId,id:list[i].id});
					}
				}
				model.personDoors=doors;
				if(model.remote['pwd'].length!=6){
					tip.alert("密码为6位数字");
					return;
				}
				db.updateByParamKey({
					request:[{
						sqlId:'delete_tip_doors',//先删除后插入
						params:[{cus:login.cusNumber,user:login.userId}],
						whereId:'0'
					},{
						sqlId:'insert_tip_doors',//插入
						params:doors
					},{
						sqlId:'update_person_set',
						params:[{cus:login.cusNumber,user:login.userId,pwd:model.remote['pwd'],avoid:model.remote['avoid']}],
						whereId:'0'
					}],
					success:function(){
						tip.alert("修改成功");
						login.doorpwd=model.remote['pwd'];
						login.doorAvoid=model.remote['avoid'];
						dialog.close();
					}
				});
			}
		}
	});
	//方法集合
	var fnc={
			personset:function(){
				if(model.remote.personDoors.length){
					for(var i=0,len=model.personDoors.length;i<len;i++){
						personTree.checkNode(personTree.getNodeByParam("id",model.personDoors[i]['id']),true,true);
					}
					dialog.open({
						title:'门禁提示',
						targetId:'person',
						w:'600',h:'500'
					});
					return;
				}
				//门禁关联树
				login.userId&&db.query({
					request:{
						sqlId:'query_link_query',
						params:[login.userId,login.cusNumber],
						whereId:'0'
					},
					success:function(data){
						model.remote.personDoors=data;
						for(var i=0,len=data.length;i<len;i++){
							personTree.checkNode(personTree.getNodeByParam("id",data[i]['id']),true,true);
						}
						dialog.open({
							title:'门禁提示',
							targetId:'person',
							w:'600',h:'500'
						});
					}
				});
			},
			saveperson:function(){
				
			},
			lock:function (){
				var request={
						cusNumber:login.cusNumber,
						userId:login.id,
						doorId:doorIds
				};
				door.lockDoor({
					request:request,
					success:function(result){
						tip.alert("发送一键锁闭指令成功");
					}
				});
				
				db.ajax("sys/log",{oprLog:JSON.stringify({
					cusNumber:login.cusNumber, 		// 机构号
					type:'2',			// 操作类型
					userId:login.userId,		// 操作用户ID
					userName:login.userName, 		// 操作用户姓名
					operatedDesc:'锁定->'+getSelect(true).join(','), 	// 操作内容
				})});
			},
			open:function (){
				var request={
						cusNumber:login.cusNumber,
						userId:login.id,
						doorId:doorIds,
						oprLog:{
							cusNumber:login.cusNumber, 		// 机构号
							type:'2',			// 操作类型
							userId:login.userId,		// 操作用户ID
							userName:login.userName, 		// 操作用户姓名
						}
				};
				
				door.openDoor({
					request:request,
					success:function(result){
						
						doorIds.length==1?db.query({
							request:{
								sqlId:'select_model_door_name',
								params:{cus:login.cusNumber,device:doorIds[0]},
								whereId:'0'
							},success:function(data){
								if(data.length){
									map.door.open(data[0]['mpi_rltn_model_name']);//开门
								}
							}
						}):tip.alert("发送开门指令成功");
					}
				});
				db.ajax("sys/log",{oprLog:JSON.stringify({
					cusNumber:login.cusNumber, 		// 机构号
					type:'2',			// 操作类型
					userId:login.userId,		// 操作用户ID
					userName:login.userName, 		// 操作用户姓名
					operatedDesc:'开门->'+getSelect(true).join(','), 	// 操作内容
				})});
			},
			close:function (){
				var request={
						cusNumber:login.cusNumber,
						userId:login.id,
						doorId:doorIds,
						oprLog:{
							cusNumber:login.cusNumber, 		// 机构号
							type:'2',			// 操作类型
							userId:login.userId,		// 操作用户ID
							userName:login.userName, 		// 操作用户姓名
							
						}
				};
				door.closeDoor({
					request:request,
					success:function(result){
						doorIds.length==1?db.query({//查询模型
							request:{
								sqlId:'select_model_door_name',
								params:{cus:login.cusNumber,device:doorIds},
								whereId:'0'
							},success:function(data){
								if(data.length){
									map.door.close(data[0]['mpi_rltn_model_name']);//关门
								}
							}
						}):tip.alert("发送关门指令成功");
					}
				});
				
				db.ajax("sys/log",{oprLog:JSON.stringify({
					cusNumber:login.cusNumber, 		// 机构号
					type:'2',			// 操作类型
					userId:login.userId,		// 操作用户ID
					userName:login.userName, 		// 操作用户姓名
					operatedDesc:'关门->'+getSelect(true).join(','), 	// 操作内容
				})});
			},
			password:function(fnc){
				var p=document.getElementById("password");
				p.dataset.fnc=fnc;
				if(p.parentNode&&p.parentNode.parentNode.style.display=="none"){
					p.parentNode.parentNode.style.display="block";
					p.firstElementChild.focus();
					for(var i=0,len=p.children.length;i<len;i++){
						p.children[i].value=null;
					}
					return;
				}
				layer.open({type: 1,title: false ,area:['300px','80px'],id: 'LAY_layuipro',shade:false,
					  moveType: 1 ,//拖拽模式，0或者1
					  success:function(layero,index){
						  p.style.display='block';
						  layero.find("div.layui-layer-content").next().remove().end()[0].appendChild(p);
						  p.firstElementChild.focus();
					  }
				});
			}
	}
	//如果用户的数据权限不是本辖区的则部门号就是机构号
	var auth=(login.dataAuth!=2)?'2':'3';
	var request={
			sqlId:'query_remote_control_tree',
			orderId:auth==2?'0':'1',
			params:{
				'org':(login.dataAuth!=0)?login.cusNumber:login.deptId,
				'user':!login.sysAdmin&&login.userId,
				'level':auth,
				'cus':login.cusNumber
			},//[(login.dataAuth!=0)?login.cusNumber:login.deptId,auth,login.cusNumber,login.userId]
			whereId:!login.sysAdmin&&'0'
		};
	//(login.dataAuth==0||login.dataAuth==1)&&(request.whereId=0,request.params.push(login.cusNumber));
	//login.dataAuth==3&&( request={sqlId:'query_remote_control_tree_super',params:[login.dataAuth]});
	//初始化左侧门禁树
	db.query({
		request:request,
		success:function(data){
			var setting={
					path:'../../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(e,id,node){
							if(!node.type){
								model.remote['currentarea']=node.name;
							}else{
								var p=node.getParentNode();
								model.remote['currentarea']=p&&p.name;
								addNavDom('tree',node);
							}
							model.remote['doors']= list=treeContainer.transformToArray(node).filter(function(item){
								if(item.type==1)return true;
							});
						}
					}
			};
			data=keepLeaf(data);
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			data.length>0&&$("#"+treeContainer.getNodes()[0].tId+"_a").click();
			var set={
					path:setting.path,
					edit:setting.edit,
					check:{enable:true},
					data: {simpleData: {enable: true,pIdKey: "pid"}}
			};
			personTree=$.fn.zTree.init($("#pztree"),set,data);
			personTree.expandAll(true);
			//树搜索
			$("#input")[0].oninput=function(){
				treeUtil.searchTree("name",this.value,"tree",data,setting);
			};
			//tab搜索
			/*$("#tab")[0].oninput=function(){
				if(!this.value){
					model.remote.doors=list;
					return;
				}
				var temp=[],l=model.remote.doors;
				for(var i=0,len=l.length;i<len;i++){
					if(l[i]['name'].indexOf(this.value)>=0){
						temp.push(l[i]);
					}
				}
				model.remote.doors=temp;
			};*/
		}
	});

	//用户门禁密码，是否免密
	db.query({
		request:{
			sqlId:'query_person_query',
			params:[login.userId,login.cusNumber],
			whereId:'0'
		},
		success:function(data){
			if(data.length==0){
				model.remote['pwd']='000000';
				model.remote['avoid']='0';
				db.updateByParamKey({
					request:{sqlId:'insert_person_set',params:[{cus:login.cusNumber,user:login.userId,pwd:'000000',avoid:'0'}]}
				});
				return;
			}
			model.remote['pwd']=data[0]['pwd'];
			model.remote['avoid']=data[0]['avoid'];
		}
	});
	//调用远程接口
	function remoteCmd(){
		if(remote.doors.length==0){
			tip.alert("请选择要操作的门禁");
			return;
		}
	}
	container.on("click","div.item",function(){
		$(this).toggleClass("select");
	});
	//密码输入框事件
	(function(){
		var p=document.getElementById("password");
		for(var i=0,list=p.children,len=list.length;i<len;i++){
			list[i].oninput=function(e){
				if(this.value=='')return;
				if(this.nextElementSibling){
					this.nextElementSibling.focus();
				}else{
					if(model.remote.password.join('')!=model.remote['pwd']){
						tip.alert("密码不正确");
						for(var i=0,len=p.children.length;i<len;i++){
							p.children[i].value=null;
						}
						p.firstElementChild.focus();
						return;
					}
					p.parentNode.parentNode.style.display="none";
					fnc[p.dataset.fnc]&&fnc[p.dataset.fnc]();
				}
			}
			list[i].onkeydown=function(e){ 
				e.keyCode==8&&this.previousElementSibling&&this.previousElementSibling.focus();
			}
			list[i].onfocus=function(){
				this.value='';
			}
		}
	})();
	
	function callVideo(){
		db.query({
			request:{
				sqlId:'query_link_device_by_device',
				whereId:'0',
				params:{'cusNumber':login.cusNumber,'mainType':'2','dtlsType':'1','id':doorIds[0]}
			},
			success:function(data){
				if(data.length==0){
					return;
				}
				var list=[];
				data.forEach(function(row){
					list.push(row['dld_dvc_id']);
				});
				console.log(list);
				if(list.length > 0){
					video.setLayout(list.length);
					video.play(list);
				}
			}
		});
	}
	//获取选中的门禁
	function getSelect(flag){
		var list=container.find("div.select"),temp=[];
		
		if(flag){
			temp=[].map.call(list,function(item){
				var temp=item.textContent.trim();
				return temp.substr(0,temp.lastIndexOf("（")).trim();
			});
		}else{
			for(var i=0,len=list.length;i<len;i++){
				list[i].dataset.id&&temp.push(list[i].dataset.id);
			}
		}
		if(!temp.length){
			tip.alert("请选择要操作的门");
			return ;
		}
		return temp;
	}
	//定位按钮
	function addNavDom(treeId,treeNode){
		var tid = treeNode.tId;
		var dom = $('#'+tid+'_a');
		var cameraId = treeNode.id;
		var btnSpan  = dom.find('#nav_'+cameraId);
		$('.c_nav').hide();
		if(dom.find('#nav_'+cameraId).length==0){
			btnSpan = $('<img id="nav_'+cameraId+'" src="../../video/image/location.png" alt="定位" class="c_nav" />');			
			dom.append(btnSpan);
		}else{
			btnSpan.show();
		}
		$('#nav_'+cameraId).off('click').on('click',function(){
			map.locationDvc(2,cameraId);//carmeraid为门禁id
		});
	}
	
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
});