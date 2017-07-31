define(['jquery' ,'vue','frm/hz.db','ztree','frm/message','frm/model',"frm/treeUtil","frm/loginUser"],function($,tpl,db,treeSelect,tip,modelData,util,login){
	//左侧树
	var treeContainer,prepareTree;
	//
	var htmlContainer=$("#form");
	var input,tId,count=0;
	var setting={
			view: {dblClickExpand: false},
			edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
			data: {
				simpleData: {
					enable: true,
					idKey: "fmd_id",
					pIdKey: "fmd_parent_id",
					rootPId: 0
				},
				key:{
					name:"fmd_name"
				}
			},
			callback:{
				onDblClick:function(e,tree,node){
					
					if(node&&node['fmd_name']=='系统菜单')return;
					
					modelData.modelData(model.menu,node);
					
					var temp=node.getParentNode();
					
					model.menu['pname']=temp?temp['fmd_name']:'';
					
					model.menu['fmd_parent_id']=temp?temp['fmd_id']:'0';
					model.menu['tid']=node.tId;
					if(node['fmd_icon']){
						input.css("background-image","url(data:image/png;base64,"+node['fmd_icon']+")").attr("placeholder","").removeClass("nobackground");
					}else{
						input.attr("placeholder","请选择图标").addClass("nobackground");
					}
			    },
			    onClick:function(e,tree,node){
			    	if(node['fmd_id']!=model.menu['fmd_id']){
			    		model.menu['pname']=node['fmd_name'];
				    	model.menu['fmd_parent_id']=node['fmd_id'];
				    	tId=node.tId;
			    	}
			    },
			    beforeDrop:function(treeId, node, tnode, moveType){//拖动排序
			    	if(moveType!='inner'){
			    		
			    		var temp;
			    		
			    		var seq=tnode['fmd_seq']?tnode['fmd_seq']:0;
			    		
			    		var next=(moveType=="next")?tnode.getNextNode():tnode.getPreNode();
			    		
			    		temp=((next&&next['fmd_seq']?next['fmd_seq']:(0))-seq)/97;
			    		
			    		db.updateByParamKey({
				    		request:{
				    			sqlId:'update_menu_seq',
				    			params:[{"fmd_seq":seq+temp,"fmd_id":node[0]['fmd_id']}]
				    		},
				    		error:function(){
				    			tip.alert("排序失败");
				    		}
				    	});
			    		return true;
			    	}
			    	return false;
			    },
			    beforeDragOpen:function(){
			    	return false;
			    }
			}
	};
	//数据模型定义
	var model = new tpl({
	    	el:'#form',
	    	data:{
	    		menu:{
	    		   fmd_id          :'',
	 			   fmd_parent_id   :'',
	 			   fmd_name        :'',
	 			   fmd_path        :'',
	 			   fmd_type        :'',
	 			   fmd_width       :'',
	 			   fmd_height      :'',
	 			   fmd_flag        :'',
	 			   fmd_open_type   :'',
	 			   fmd_icon        :'',
	 			   fmd_shortcut_key :'',
	 			   fmd_seq          :'',
	 			   fmd_use          :'',
	 			   fmd_crte_user_id :login.userId,
	 			   fmd_updt_user_id :login.userId,
	 			   pname:'',
	 			   tid:'',
	 			   fmd_sys_func:''
	    		},
	    		list:[]
	    	},
	 		methods:{
	 			select:function(item){
	 				input.css("background-image","url(data:image/png;base64,"+item+")").removeClass("nobackground").attr("placeholder","");
	 				model.menu['fmd_icon']=item;
	 			}
	 		}
	    });
	
	
	//初始化树
	db.query({
		request:{
			sqlId: 'query_menu_sql',
			orderId:'0'
		},
		success:function(treeData){
			count=treeData.length;
			
	 		treeData.push({"fmd_id":"-1","fmd_name":"系统菜单",icon:"../../../css/images/icons/menu.png",open:true,"fmd_parent_id":"-2"});
	 		
			treeContainer=$.fn.zTree.init($("#tree"), setting,treeData);
			
			htmlContainer.find("input:first").keyup(function(){
				util.searchTree("fmd_name",this.value,"tree",treeData,setting);
			});
		}
	});
	
 	//保存删除，新增
	htmlContainer.on("click",".buttons a",function(){
		if(this.textContent=="删除"){
			if(!model.menu['fmd_id']){
				tip.alert("请双击选择要删除的菜单");
				return;
			}
			var node=treeContainer.getNodeByTId(model.menu['tid']);
			var list=treeContainer.transformToArray(node).map(function(row){
				return {"fmd_id":row['fmd_id']};
			});
			tip.confirm(list.length>1?"确定删除该菜单及其子菜单？":"确定删除该菜单",function(){
				db.updateByParamKey({
					request: {
						sqlId:"delete_menu_sql",
						params:list
					},
					success:function(){
						treeContainer.removeNode(node,false);
						modelData.clear(model.menu,{'fmd_open_type':'0','fmd_use':'1','fmd_type':'1','fmd_sys_func':'0'});
					},
					error:function(a,b){
						tip.alert(b);
					}
				});
			});
		}
		if(this.textContent=="保存"){
			if(validate())return;
			tip.saving();
			if(model.menu['fmd_id']){//更新
				db.update({
					request: [{
						sqlId:"update_menu_sql",
						params:[model.menu['fmd_parent_id'],model.menu['fmd_name'],model.menu['fmd_path'],model.menu['fmd_type'],model.menu['fmd_width'],model.menu['fmd_height'],model.menu['fmd_flag'],model.menu['fmd_open_type'],
						        model.menu['fmd_icon'],model.menu['fmd_shortcut_key'],model.menu['fmd_use'],model.menu['fmd_crte_user_id'],model.menu['fmd_sys_func'],model.menu['fmd_id']],
						paramsType:{'8':'clob'}
					}],
					success:function(){
						
						var temp=treeContainer.getNodeByTId(model.menu['tid']);
						
						modelData.modelData(temp,model.menu);
						
						if(tId!=model.menu['tid']){
							treeContainer.moveNode(treeContainer.getNodeByTId(tId),temp,"inner");
						}
						
						treeContainer.updateNode(temp);
						
						modelData.clear(model.menu,{'fmd_open_type':'0','fmd_use':'1','fmd_type':'1','fmd_sys_func':'0'});
						
						tip.alert("保存成功");
					},
					error:function(a,b){
						tip.alert(b);
					}
				});
			}else{
				if(model.menu['fmd_parent_id']=='')model.menu['fmd_parent_id']='-1';
				db.update({//新增
					request: {
						sqlId: "insert_menu_sql",
						seqParams:[0,'SYS_FUNC_MENU_DTLS','fmd_id'],
						params: ['?',model.menu['fmd_parent_id'],model.menu['fmd_name'],model.menu['fmd_path'],model.menu['fmd_type'],model.menu['fmd_width'],model.menu['fmd_height'],model.menu['fmd_flag'],model.menu['fmd_open_type'],
						         model.menu['fmd_icon'], model.menu['fmd_shortcut_key'], count++, model.menu['fmd_use'], model.menu['fmd_updt_user_id'],model.menu['fmd_sys_func']],
						paramsType:{'9':'clob'}
					},
					success:function(data){
						
						model.menu['fmd_id']=data.data[0]['seqList'][0];
						
						var pnode=treeContainer.getNodeByTId(tId);
						
						treeContainer.addNodes(pnode?pnode:treeContainer.getNodes()[0],-1,model.menu);
						
						modelData.clear(model.menu,{'fmd_open_type':'0','fmd_use':'1','fmd_type':'1','fmd_sys_func':'0'});
						tip.close();
					},
					error:function(a,b){
						tip.alert(b);
					}
				});
			}
		}else if(this.textContent=="重置"){
			modelData.clear(model.menu,{'fmd_open_type':'0','fmd_use':'1','fmd_type':'1','fmd_sys_func':'0'});
			tId=null;
		}
		
		input.addClass("nobackground");
 	});

 	$.get(basePath + 'sys/icons', function(data){
 		model.list = JSON.parse(data);
	});

 	//图标库
 	input=$("#iconlib").click(function(){
 		var offset=$(this).offset();
 		$("#iconcontainer").css({left:offset.left,top:offset.top+this.clientHeight,width:$(this).width()}).slideDown();
 	}).children("input");
 	
 	$("#iconcontainer").mouseleave(function(){
 		this.style.display="none";
 	});
 	
 	function validate(){
 		var rep=/^[0-9]*$/
		return  !model.menu['fmd_name'].length&&!tip.alert("请输入菜单名称")   ||
				 model.menu['fmd_name'].length>26&&!tip.alert("名称过长，请输入26个以内字符")||
				!model.menu['fmd_flag'].length&&!tip.alert("请输入权限标识");
 	}
});
