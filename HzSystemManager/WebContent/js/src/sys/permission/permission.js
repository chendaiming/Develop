define(["frm/loginUser","frm/hz.db","frm/message","ztree","vue","frm/message","frm/treeUtil","frm/select"],function(login,db,tip,ztree,tpl,tip,util){
	var areaTree,userTree;
	var container=$("#form").children("div:last");
	var tid;
	var count=[0,0,0,0];
	
	var model=new tpl({
		el:"#opr",
		data:{
			permission:{
				list:[],//数据集合
				user:'',//所选用户
				area:'',//所选区域
				cus:''//被选中用户的所属机构
			},
			type:'2',//数据类型默认为门禁
			select:''
		},
		watch:{//监听修改
			type:function(val,old){
				count[3]=0;
				
				var cus=(login.dataAuth==0||login.sysAdmin!=1)?login.deptId:login.cusNumber;
				
				console.log(model.permission.area);
				
				var request={sqlId:'query_permission_data',
							params:{'cus':model.permission.cus?model.permission.cus:cus,'area':model.permission.area,'user':login.userId},//[login.userId,temp],
							whereId:model.permission.area?'1':'0',
							orderId:(login.sysAdmin==1)?(parseInt(model.type)+'a'):model.type};
				
				queryData(request);
				var user=tid&&userTree.getNodeByTId(tid);
				request.sqlId='query_permission_area_user';
				request.params={'user':user&&user.id,'cus':cus,'area':model.permission.area};//user?[user.id,temp]:[temp];
				request.whereId=model.permission.area?'0':'1';
				user&&(request.orderId=model.type,queryData(request,user));
				
				container.addClass("item"+val).removeClass("item"+old);
			},
			select:function(val,old){
				
				var opr=val?'add':'remove';
				(typeof val!='string')&&container.children("div.item").each(function(){
					this.classList[opr]("select");
				});
			}
		}
	});
	
	//注册点击事件
	container.on("click","div.item",function(){
		this.classList.toggle("select");
		this.classList.length==2?count[3]++:count[3]--;
		(count[3]+count[model.type==2?0:1]==count[2])?(model.select='checked'):(model.select='');
 	});
	//授权事件
	$("#permi").click(function(){
		if(!model.permission.user.length){
			tip.alert("请选择要授权的用户");
			return;
		}
		var list=container.children("div.select");
		if(userTree.getNodeByTId(tid).list=='-1'&&list.length==0){
			tip.alert("请选择要授权的设备");
			return;
		}
		model.type!=2&&(list=container.children("div:not(.select)"));
		var p=[],h=[];
		for(var i=0,len=list.length;i<len;i++){
			h.push(list[i].dataset.rel);
			p.push({'cus':login.cusNumber,'user':model.permission.user,'id':list[i].dataset.rel,'current':1,'type':model.type});
		}
		tip.saving();
		//授权操作
		db.updateByParamKey({
			request:[{
				sqlId:'delete_permission_data',
				params:[{cus:login.cusNumber,user:model.permission.user,type:model.type}]
			},{
				sqlId:'insert_permission_data',
				params:p
			}],
			success:function(){
				tip.alert("授权成功");
				userTree.getNodeByTId(tid)['auth'+model.type]=h;
			}
		});
	});
	//树形结构设置 用户树
	var setting={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			view: {dblClickExpand: false},
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			callback:{
				onClick:function(tree,e,node){
					count[3]=0;
					if(node.id.indexOf("1-")==0){
						model.permission.area='';
						model.permission.user='';
						//根据机构查询区域
						queryArea(node);
						return;
					}
					var p=node.getParentNode();
					model.permission.cus=p.auth!=0?login.cusNumber:p.id.replace('1-','');
					//查询用户能够查看那些区域
					queryArea(p,function(){
						tid=node.tId;
						var id=model.permission.area?model.permission.area:login.deptId;
						var request={sqlId:'query_permission_area_user',
								params:{'cus':model.permission.cus,'area':id,'user':node.id},
								whereId:model.permission.area?'0':'1',
									orderId:model.type};
						//查询用户能够看的数据
						queryData(request,node);
						
						model.permission.user=node.id;
						
					});
				}
			}
	};
	//区域树
	var set={
			path:setting.path,
			view:setting.view,
			data:setting.data,
			callback:{
				onClick:function(tree,e,node){
					count[3]=0;
					var request={
							sqlId:'query_permission_data',
							params:{'cus':login.cusNumber,'user':login.userId,'area':node.id},
							whereId:'1',
							orderId:model.type==2&&login.sysAdmin?'2a':model.type};
					if(node.type==1){
						login.dataAuth==2&&(model.permission.cus=request.params.cus=node.cus);
						queryData(request);//区域
						model.permission.area=node.id;
					}else{
						model.permission.area='';
						request.whereId='0';
						model.permission.cus=request.params.cus=node.auth!=0?login.cusNumber:node.id.replace('1-','');
						queryData(request);//机构
					}
					
				}
			}
	};
	//如果用户的数据权限不是本辖区的则部门号就是机构号
	var auth=login.dataAuth!=0?login.cusNumber:login.deptId;
	
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
	//用户树
	db.query({
		request:{
			sqlId:'query_permission_user_treebyid',
			params:{'cus':auth,'user':login.userId}
		},
		success:function(data){
			data = keepLeaf(data);
			userTree=$.fn.zTree.init($("#user"), setting,data);
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"user",data,setting);
			});
			//区域树结构
			db.query({
				request:{
					sqlId:'query_permission_area_tree',
					params:{'cus':auth,'level':login.dataAuth==2?"3":"2"},
					whereId:"0"
				},
				success:function(data){
					var temp=userTree.getNodes()[0];
					areaTree=$.fn.zTree.init($("#area"), set,data);
					//查询当前用户能够查看哪些数据
					var request={sqlId:'query_permission_data',
							params:{'cus':(login.sysAdmin||login.dataAuth!=0)?login.cusNumber:login.deptId,'user':login.userId},
							whereId:'0',
							orderId:login.sysAdmin?'2a':model.type
								};
					queryData(request);
				}
			});
			$("#"+userTree.getNodes()[0].tId+"_a").click();//.click();
		}
	});
	//查询当前用户能够查看哪些数据
	function queryData(request,node){
		console.log(request);
		if(node&&node['auth'+model.type]){
			filter(node['auth'+model.type]);
			return;
		}
		db.query({
			request:request,
			success:function(data){
				var temp, l;
				!node?
				(model.permission.list=data,count[2]=data.length,model.permission.user&&(l=userTree.getNodeByTId(tid)['auth'+model.type]))
				:
				(l=data[0]['id']?data[0]['id'].split(','):[],node['auth'+model.type]=l);
				l&&model.$nextTick(function(){filter(l);});
			},
			error:function(){
				model.permission.list=[];
			}
		});
	}
	//勾选所选用户能够操作哪些设
	function filter(l){
		var flag=(model.type==2||typeof tid=='boolean');
		var fnc=flag?['add','remove']:['remove','add'];
		count[0]=count[1]=0;
		console.log(l);
		container.children("div.item").each(function(){
			if(l.indexOf(this.dataset.rel)>=0){ 
				this.classList[fnc[0]]("select");
				count[0]++;
			}else{
				this.classList[fnc[1]]("select");
				count[1]++;
			}
		});
		count[2]&&(flag?(count[0]==count[2]):(count[1]==count[2]))?model.select='checked':model.select='';
	}
	function queryArea(node,fnc){
		//根据机构查询区域
		db.query({
			request:{
				sqlId:'query_area_tree_byorg',
				params:{'cus':node.auth!=0?login.cusNumber:node.id.replace("1-","")}//[node.id.replace("1-","")]
			},
			success:function(data){
				var id=node.id.replace("1-","");
				var temp=userTree.getNodes()[0];
				areaTree=$.fn.zTree.init($("#area"), set,{id:id,name:node.name,icon:node.icon,type:'0',auth:node.auth});
				areaTree.addNodes(areaTree.getNodes()[0], data);
				//filter([]);
				fnc&&fnc();
				$("#"+areaTree.getNodes()[0].tId+"_a").click();//.click();
			}
		});
	}
	
});