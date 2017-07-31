define(['jquery','vue','frm/hz.db',"ztree","frm/dialog","frm/message","frm/model","frm/treeUtil","frm/loginUser",'frm/hz.FlowChart','frm/pinyin',"frm/select"],
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
				id:'',
				tid:'',
				pid:'',
				depname:'',
				name:'',
				plc_name:'',
				plc_id:'',
				ubi_people_type:'',
				checkedStatus:{
					bind:'',
					binded:'' 
				},
				ubd_cus_number:login.cusNumber
			},
			bindUser:[],
			userPie:true,
			isBind:'',
			police:[]
		},
		watch:{
			'user.plc_name':function(val,old){
				var that = this;
				console.log(val,old);
				if(that.user.ubi_people_type!=='1') return;//暂时只支持民警类型查询
				if(val != ''){
					if(this.userPie){
						that.bindUser = [];
						if(isType(val)){
							this.police.forEach(function(item){
								if(isContains(item.code,val)){
									that.bindUser.push(item);
								}
							});
							$('ul.bind_user').show();
						}else if(flowChart.isType(val,'string')){
							var vals = pinyin.convertFirstPinyin(val);
							this.police.forEach(function(item){
								var valName = pinyin.convertFirstPinyin(item.name);
								if(isContains(valName,vals)){
									that.bindUser.push(item);
								}

							})
							$('ul.bind_user').show();
						}
						if(that.bindUser.length <= 0){
							that.bindUser.push({name:'暂无用户信息！'})
						}
					}else{
						this.userPie = true;
					}
				}else{
					$('ul.bind_user').hide();
				}

			},
			'user.name':function(){
				if(this.user.name===''){
					model.user.ubi_people_type = '';
					model.user.plc_name = '';
					if(model.user.checkedStatus.bind){
						model.isBind = true;
					}else if(model.user.checkedStatus.binded){
						model.isBind = false;
					}
					return;
				}
				//获取绑定信息
				db.query({
					request:{
						sqlId:'query_user_bind_info_byuid',
						params:{ubi_uid:this.user.id}
					},
					success:function(data){
						if(data[0]){
							model.user.ubi_people_type = data[0]['ubi_people_type'];
							model.user.plc_name = data[0]['pbd_police_name'];
							model.isBind = false;
						}else{
							model.user.ubi_people_type = '';
							model.user.plc_name = '';
							model.isBind = true;
						}
					}
				});
			},
			'isBind':function(val){
				if(val==='') return;
				if(val){
					$('div.buttons a:eq(0)').show();
					$('div.buttons a:eq(1)').hide();
				}else{
					$('div.buttons a:eq(0)').hide();
					$('div.buttons a:eq(1)').show();
				}
				
			},
			'user.checkedStatus.bind':function(val,old){
				if(typeof val=='number') return;
				var _this = this;
				if(val){//未绑定
					_this.user.checkedStatus.binded = 0; 
					request.whereId='2';
					getTreeData(request,true);
					resetText();
					_this.isBind=true;
				}else{
					request.whereId='0';
					getTreeData(request,false);
					resetText();
					_this.isBind='';
					showButtons();
				}
			},
			'user.checkedStatus.binded':function(val){
				if(typeof val=='number') return;
				var _this = this;
				if(val){//已绑定
					
					_this.user.checkedStatus.bind = 0;
					request.whereId='1';
					getTreeData(request,true);
					resetText();
					_this.isBind=false;
				}else{
					request.whereId='0';
					getTreeData(request,false);
					resetText();
					_this.isBind='';
					showButtons();
				}
			},
			'user.ubi_people_type':function(val){
				if(this.user.plc_name!==''&&this.isBind){
					this.user.plc_name = '';
				}
			}
			
		},
		methods:{
			bindUserClick:function(R){
				this.userPie=false;
				this.user['plc_id'] = R.id;
				this.user['plc_name'] = R.name;
				this.bindUser=[];
				$('ul.bind_user').hide();
			}
		}
	});

	$(document).click(function(){
		$('ul.bind_user').hide();
	})
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
	
	function getTreeData(request,isExpand){
		db.query({
			request:request,
			success:function(data){
				treeContainer=$.fn.zTree.init($("#tree"), setting,data);
				//搜索树
				$("#input").keyup(function(){
					util.searchTree("name",this.value,"tree",data,setting);
				});
				treeContainer.expandAll(isExpand);
			}
		});
	}
	
	function resetText(){
		model.user.name = '';
		model.user.ubi_people_type = '';
		model.user.plc_name = '';
	}
	
	function showButtons(){
		$('div.buttons a:eq(0)').show();
		$('div.buttons a:eq(1)').show();
	}
	
	//获取警员
	db.query({
		request:{
			sqlId:'select_user_plc_bind'
		},
		success:function(data){
			console.log(data)
			model.police = data;
		}
	});
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
						model.user['plc_id']=node.plc_id;
						model.user['plc_name']=node.plc_name;
						model.user['pid']=temp?temp.id:'';
						model.user['id']=node.id.replace("1-","");
						pflag=-1;
						pw=node.pw;
					}
				}
			}
	}
	//左侧树型结构
	var depid=(login.dataAuth==0&&!login.sysAdmin)?login.deptId:login.cusNumber;
	
	var request={
			sqlId:'query_user_org_byidb_bind',
			whereId:'0'
	};
	
	login.cusNumber?(request.sqlId='query_user_org_byid_bind',request.params=[depid,depid,depid,login.userId]):
	(login.dataAuth==2&&(request.params=[login.userId]));
	
	getTreeData(request);
	
	//绑定、解绑
	formContainer.on("click",".buttons a",function(){
		if(this.textContent=='绑定'){
			if(validate()) return;
			db.updateByParamKey({
				request:{
					sqlId:'insert_user_bind_info',
					params:{
						'uid':model.user.id,
						'peopleType':model.user.ubi_people_type,
						'peopleId':model.user.plc_id,
						'crteUid':login.userId,
						'updtUid':login.userId
					}
				},
				success:function(){
					tip.alert("绑定成功！");
					model.user.name = '';
					
					//转换为已绑定的图标
					var treeObj = $.fn.zTree.getZTreeObj("tree");
					var node = treeObj.getNodeByTId(model.user.tid);
					if(model.user.checkedStatus.bind===true){
						treeObj.removeNode(node);
						model.isBind = true;
					}else{
						node.icon = "userBind.png";
						treeObj.updateNode(node);
						model.isBind = false;
					}
					
				}
			});
		}else if(this.textContent=='解绑'){
			if(validateBind()) return;
			db.updateByParamKey({
				request:{
					sqlId:'delete_user_bind_info_byuid',
					params:{'ubi_uid':model.user.id}
				},
				success:function(){
					tip.alert("解绑成功！");
					model.user.name = '';
					
					//转换为未绑定的图标
					var treeObj = $.fn.zTree.getZTreeObj("tree");
					var node = treeObj.getNodeByTId(model.user.tid);
					if(model.user.checkedStatus.binded===true){
						treeObj.removeNode(node);
						model.isBind = true;
					}else{
						node.icon = "user.png";
						treeObj.updateNode(node);
						model.isBind = false;
					}
				}
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
 	function validate(){
		return !model.user['name'].length&&!tip.alert("请选择登录用户")||
			   !model.user['ubi_people_type'].length&&!tip.alert("请选择人员类型")||
			   (!model.user['plc_name'].length||model.user['plc_name']=='暂无用户信息！')&&!tip.alert("请输入人员姓名")||
			   model.user['ubi_people_type']!=='1'&&!tip.alert("暂不支持民警之外的人员类型绑定操作")||
			   !model.user['plc_id']&&!tip.alert("请输入在职人员姓名");
 	}
 	
 	function validateBind(){//解绑验证
 		return !model.user['name'].length&&!tip.alert("请选择登录用户");
 	}
 	
 	
});
