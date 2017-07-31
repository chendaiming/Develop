define(['jquery','vue','frm/hz.db',"ztree","frm/dialog","frm/message","frm/model","frm/treeUtil","frm/loginUser",'frm/hz.FlowChart','frm/pinyin'],
	function($,tpl,db,treeSelect,dialog,tip,modelUtil,util,login,flowChart,pinyin){
	//表单容器
	var formContainer=$("#form");
	//树形容器
	var treeContainer,oprs;
	var tId;
	var pflag=false,pw=false;
	//建立数据模型
	var model=new tpl({
		el:"#form",
		data:{
			user:{
				'id':'',
				'tid':'',
				'pid':'',
				'depname':'',
				'name':'',
				'ubd_pass':'',
				'ubd_expre_date':'',
				'ubd_use':'',
				'ubd_admin':'',
				'ubd_nick_name':'',
//				'plc_name':'',
//				'plc_name_id':'',
				'ubd_seq':'',
				'ubd_crte_user_id':'',
				'ubd_updt_user_id':login.userId,
				'ubd_cus_number':login.cusNumber
			},
//			bindUser:[],
			userPie:true,
//			police:[]
		},
		watch:{
			'user.ubd_pass':function(val,old){
				if(pw){
					pflag=true;
					return;
				}
				if(pflag=='-1'||val.length==0||old.length==0){
					pflag=false;
					return;
				}
				pflag=true;
			}
//			'user.plc_name':function(val,old){
//				var that = this;
//				console.log(val,old);
//				if(val != ''){
//					if(this.userPie){
//						that.bindUser = [];
//						if(isType(val)){
//							this.police.forEach(function(item){
//								if(isContains(item.code,val)){
//									that.bindUser.push(item);
//								}
//							});
//							$('ul.bind_user').show();
//						}else if(flowChart.isType(val,'string')){
//							var vals = pinyin.convertFirstPinyin(val);
//							this.police.forEach(function(item){
//								var valName = pinyin.convertFirstPinyin(item.name);
//								if(isContains(valName,vals)){
//									that.bindUser.push(item);
//								}
//
//							})
//							$('ul.bind_user').show();
//						}
//						if(that.bindUser.length <= 0){
//							that.bindUser.push({name:'暂无用户信息！'})
//						}
//					}else{
//						this.userPie = true;
//					}
//				}else{
//					$('ul.bind_user').hide();
//				}
//
//			}
		},
//		methods:{
//			bindUserClick:function(R){
//				this.userPie=false;
//				this.user['plc_id'] = R.id;
//				this.user['plc_name'] = R.name;
//				this.bindUser=[];
//				$('ul.bind_user').hide();
//			}
//		}
	});

//	$(document).click(function(){
//		$('ul.bind_user').hide();
//	})
		function isType(value){
			var Regx = /^[0-9]*$/;
			if (Regx.test(value)) {
				return true;
			}
			else {
				return false;
			}
		}
	function isContains(str, substr) {
		return str.indexOf(substr) >= 0;
	}
//获取警员
//		db.query({
//			request:{
//				sqlId:'select_user_plc_bind'
//			},
//			success:function(data){
//				console.log(data)
//				model.police = data;
//			}
//		});
	//树形设置
	var setting={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
			view: {dblClickExpand: false},
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			callback:{
				onClick:function(e,id,node){
					if(node.type==2){
						model.user['depname']=node.name;
						model.user['pid']=node.id;
						//model.user['ubd_cus_number']=node.cus;
						tId=node.tId;
					}
				},
				onDblClick:function(e,id,node){
					if(node&&node.type==1){
						model.userPie = false;
						var temp=node.getParentNode();
						model.user['depname']=temp?temp.name:'';
						modelUtil.modelData(model.user,node);
						model.user['tid']=node.tId;
//						model.user['plc_id']=node.plc_id;
//						model.user['plc_name']=node.plc_name;
						model.user['pid']=temp?temp.id:'';
						model.user['id']=node.id.replace("1-","");
						(superAdmin||login.sysAdmin==1)&&userRole(node);
						pflag=-1;
						pw=node.pw;
					}
				}
			}
	}
	//左侧树型结构
	var depid=(login.dataAuth==0&&!login.sysAdmin)?login.deptId:login.cusNumber;
	
	var request={sqlId:'query_user_org_byidb'};
	
	login.cusNumber?(request.sqlId='query_user_org_byid',request.params=[depid,depid,depid,login.userId]):
	(login.dataAuth==2&&(request.params=[login.userId],request.whereId='0'));
	
	db.query({
		request:request,
		success:function(data){
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			//搜索树
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		}
	});
	//角色
	var superAdmin=login.dataAuth==3;
	(superAdmin||login.sysAdmin==1)?db.query({
		request:{
			sqlId:'query_user_role',
			params:superAdmin?[]:[login.dataAuth==2?'role_01':'role_0104'],
		    whereId:superAdmin?'2':'1',
		    orderId:'0'
		},
		success:function(data){
			var set={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check:{enable:true,chkboxType:{ "Y": "p", "N": "s" }}
			}
			oprs=$.fn.zTree.init($("#userrole"), set,keepLeaf(data));
			oprs.expandAll(true);
		}
	}):$("#userrole").parent().html("<p style='color:red;'>无操作权限</p>");
	//保存，删除，重置
	formContainer.on("click",".buttons a",function(){
		if(!(superAdmin||login.sysAdmin==1)){
			tip.alert("您暂无操作权限，请联系管理员");
			return;
		}
		if(this.textContent=='保存'){
			if(validate())return;
			tip.saving();
			if(model.user['id'].length){//修改
				
				var  cus=getOrgId(treeContainer.getNodeByTId(tId?tId:model.user['tid']));
				
				model.user['ubd_cus_number']=cus?cus:login.cusNumber
				
				var roles=oprs.getCheckedNodes(true);
				
				for(var i=0,len=roles.length;i<len;i++){
					var t=getOrgId(roles[i]);
					if(t){
						model.user['ubd_admin']='1';
						break;
					}{
						model.user['ubd_admin']='0';
					}
				}
				var request=[{
					sqlId:'update_user_sql',
					params:[model.user]
				}];
				var param="userInfo="+JSON.stringify(request);
				pflag&&(param=param+"&name="+model.user['name']+"&password="+model.user['ubd_pass']);
				var url = null;
				if(top.BURL){
					url = top.BURL+'sys/update';
				}else{
					url = top.ctx+'sys/update';
				}
				$.post(url,param,function(){
					pflag=false;
					
					var list=roles.map(function(row){
	 						return {'urr_cus_number':model.user['ubd_cus_number'],'urr_user_id':model.user['id'],'urr_role_id':row.id.replace("1-",""),'plc_id':model.user['plc_id']};
	 					});
					db.updateByParamKey({
						request:[{
							sqlId:'delete_user_role',
							params:[{id:model.user['id']}]
						},{
							sqlId:'insert_user_role',
							params:list
						}],
						success:function(){
							var  temp=treeContainer.getNodeByTId(model.user["tid"]);
		 		 			temp.role=null;
		 		 			temp.pw=false;
		 		 			modelUtil.modelData(temp,model.user);
				 			//移动
				 			if(tId&&tId!=model.user['tid']){ 
				 				treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
				 			}
				 			treeContainer.updateNode(temp);
				 			
				 			modelUtil.clear(model.user,{'ubd_cus_number':'','ubd_use':'1'});
				 			oprs.checkAllNodes(false);
				 			tip.alert("更新成功");
				 			tId=null;
						}
					});
				});
			}else{//新增
				db.query({
					request:{
						sqlId:'query_user_name',
						params:[model.user['name']]
					},
					success:function(data){
						
						if(data[0]['num']>0){
							tip.alert("用户名已存在,请重新输入");
							return;
						}
						var  pnode=treeContainer.getNodeByTId(tId);
						var  cus=getOrgId(pnode);
						
						model.user['ubd_cus_number']=cus?cus:login.cusNumber;
						model.user.plc_id = model.user.plc_id || '';

						var roles=oprs.getCheckedNodes(true);
						for(var i=0,len=roles.length;i<len;i++){
							var t=getOrgId(roles[i]);
							if(t){
								model.user['ubd_admin']='1';
								break;
							} else {
								model.user['ubd_admin']='0';
							}
						}
						var request=[{
								sqlId:'insert_user_sql',
								params:[model.user]
							}];
						var url = null;
						if(top.BURL){
							url = top.BURL+'sys/update';
						}else{
							url = top.ctx+'sys/update';
						}
						$.post(url,"userInfo="+JSON.stringify(request)+"&name="+model.user['name']+"&password="+model.user['ubd_pass'],function(data){
							pflag=false;
							data=JSON.parse(data);
							var userid=data.data.data[0]['seqList'][0];
							
							var list=roles.map(function(row){
		 	 						return {'urr_cus_number':model.user['ubd_cus_number'],'urr_user_id':userid,'urr_role_id':row.id.replace("1-",""),'plc_id':model.user['plc_id']};
		 	 					});
							db.updateByParamKey({
								request:[{sqlId:'insert_user_role',params:list},
									{sqlId:'insert_person_set',params:[{cus:model.user['ubd_cus_number'],user:userid,pwd:'000000',avoid:'0'}]}],
								success:function(){
			 		 				var  temp=model.user;
			 		 				temp.icon="user.png";
			 		 				temp.id=userid;
			 		 				temp.type=1;
			 		 				temp.pw=true;
			 		 				treeContainer.addNodes(pnode,-1,temp);
			 		 				oprs.checkAllNodes(false);
			 		 				modelUtil.clear(model.user,{'ubd_cus_number':'','ubd_use':'1'});
			 		 				tip.alert("新增成功");
			 		 				tId=null;
								},
								error:function(a,b){
									tip.alert(b);
								}
							});
						});
					}
				});
			}
		}else if(this.textContent=='重置'){
			modelUtil.clear(model.user,{'ubd_cus_number':'','ubd_use':'1'});
			tId=null;
			oprs.checkAllNodes(false);
		}else{
			if(model.user['id']==''){
				tip.alert("请选择要删除的用户");
				return;
			}
			tip.confirm("确认删除该用户？",function(){
				db.updateByParamKey({
					request:[{
						sqlId:'delete_user_user',
						params:[{'id':model.user['id']}]
					},
					{
						sqlId:'delete_user_role',
						params:[{'id':model.user['id']}]
					}],
					success:function(){
						oprs.checkAllNodes(false);
						treeContainer.removeNode(treeContainer.getNodeByTId(model.user['tid']));
						modelUtil.clear(model.user,{'ubd_cus_number':''});
						tip.alert("删除成功");
					},
					error:function(a,b){
						tip.alert(b);
					}
				});
			});
		}
	});
	function userRole(node){
		if(!node.role){
			db.query({
				request:{
					sqlId:'query_user_role_role',
					params:{'id':model.user['id'].replace("1-","")}
				},
				success:function(data){
					node.role=data;
    			    roles(node.role);
				}
			});
		}else{
			roles(node.role);
		}
	}
	function roles(data){
		oprs.checkAllNodes(false);
		var temp;
		for(var i=0,len=data.length;i<len;i++){
			temp=oprs.getNodeByParam("id","1-"+data[i]['id']);
			temp&&oprs.checkNode(temp,true,true);
	    }
	}
	function getOrgId(node){
		var p=node.getParentNode();
		if(p&&(p.flag=='org_0104'||p.flag=='org_01'||p.flag=='role_99')){//监狱标识
			return node.id;
		}else{
			return p?getOrgId(p):null;
		}
	}
 	function validate(){
		return !model.user['pid'].length&&!tip.alert("请输入部门")||
			   !model.user['name'].length&&!tip.alert("请输入用户名")||
			   model.user['name'].length>26&&!tip.alert("用户名过长，请输入26个以内字符")||
			   model.user['ubd_nick_name'].length>26&&!tip.alert("昵称过长，请输入26个以内字符")||
			   !model.user['ubd_pass'].length&&!tip.alert("请输入登陆密码")||
			   !model.user['ubd_expre_date'].length&&!tip.alert("请输入到期日");
		
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
});
