define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var modelUtil = require('frm/model');	
	var tip = require('frm/message');
	var select = require('frm/select');
	var bootstrap = require('bootstrap');
	var layer = require("layer");
	  
	var treeContainer;
        model=new tpl({
			el:'body',
			data:{
				service:{
					'tsd_cus_number':login.cusNumber,
					'tsd_id':'',
					'tsd_name':'',
					'tsd_type':'',
					'tsd_ip':'',
					'tsd_port':'',
					'tsd_login_name':'',
					'tsd_login_pwd':'',
					'tsd_http_url':'',
					'user_id':login.userId//更新创建人
				}
			},
			methods:{
				save:function(){
					if(!validate()) return;
					_saveService();
				},
				update:function(){
					if(!validate()) return;
					_updateService();
				},
				del:function(){
					_deleteService();
				},
				reset:function(){
					modelUtil.clear(model.service,{'tsd_cus_number':'','user_id':''});
				}
			},
			watch:{
				
			}
	});
	//左侧警员信息树形结构
	db.query({
		request:{
			sqlId:'select_tbk_talkback_service_tree',
			params:{cusNumber:login.cusNumber}
		},
		success:function(data){
			//树形设置
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onDblClick:function(e,id,node){
							if(!node.type) return;
							if(node.type==1){
								//根据编号加载服务信息
								getInfoByid(node.id);
							}
						}
					}
			}
			treeContainer=$.fn.zTree.init($("#tree"), setting,data);
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}
	});
	
	function validate(){
		if($.trim(model.service.tsd_name).length == 0){
			tip.alert('请填写对讲服务名称!');
			return false;
		}
		
		if($.trim(model.service.tsd_type).length == 0){
			tip.alert('请填写服务类型!');
			return false;
		}
	
		if(isNaN(model.service.tsd_type)){
			tip.alert('服务类型需为数字!');
			return false;
		}
		
		if($.trim(model.service.tsd_ip).length == 0){
			tip.alert('请填写服务IP!');
			return false;
		}
		
		if($.trim(model.service.tsd_login_name).length == 0){
			tip.alert('请填写用户名!');
			return false;
		}

		if($.trim(model.service.tsd_login_pwd).length == 0){
			tip.alert('请填写密码!');
			return false;
		}
		return true;
 	}
  /**
   * 根据服务编号查询服务信息
   */
  function getInfoByid(id){
	  modelUtil.clear(model.service,{'user_id':''});
	  db.query({
			request:{
				sqlId:'select_tbk_talkback_service_info',
				whereId:'1',
				params:{'cusNumber':login.cusNumber,'tsd_id':id}
			},
			success:function(data){
				if(data.length>0) modelUtil.modelData(model.service,data[0]);
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
		});
  }
  /**
   * 新增对讲服务信息
   */
  function _saveService(){
	  db.updateByParamKey({
			request:{
				sqlId:'insert_tbk_talkback_service_dtls_info',
				params:[model.service]
			},
			success:function(data){
				//根据用户所选部门找到父节点
				var  pnode=treeContainer.getNodeByParam("id",model.service.tsd_cus_number);
				var  temp=model.service;
				
				//新节点赋值
				temp.icon='';
				temp.id=data.data[0]['seqList'][0];
				temp.name = model.service.tsd_name;
				temp.pid = model.service.tsd_cus_number;
				temp.type = 1;
				
				//新增节点
				treeContainer.addNodes(pnode,-1,temp);
				modelUtil.clear(model.service,{'tsd_cus_number':'','user_id':''});
				tip.alert("新增成功");
			},
			error: function (errorCode, errorMsg) {
				tip.alert(errorCode + ":" + errorMsg);
			}
	  });
  }
  /*
   * 更新对讲服务信息
   */
  function _updateService(){
	  db.updateByParamKey({
			request:{
				sqlId:'update_tbk_talkback_service_dtls_info',
				params:[model.service]
			},
			success:function(){
				var  pnode=treeContainer.getNodeByParam("id",model.service.tsd_cus_number);
				var  temp= treeContainer.getNodeByParam("id",model.service.tsd_id);
	 			temp.icon="";
				temp.name = model.service.tsd_name;
				temp.pid = model.service.tsd_cus_number;
				temp.type = 1;
	 			//移动
	 			if(temp.pid !=pnode.id){ 
	 				treeContainer.moveNode(pnode,temp,"inner");
	 			}
	 			treeContainer.updateNode(temp);
	 			modelUtil.clear(model.service,{'tsd_cus_number':'','user_id':''});
	 			tip.alert("更新成功");
			},
			error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
	  });
  }
  
  /*
   * 删除对讲服务信息
   */
  function _deleteService(){
		tip.confirm("确认删除该对讲服务信息？",function(){
			db.updateByParamKey({
				request:{
					sqlId:'delete_tbk_talkback_service_byid',
					whereId:'0',
					params:{'cusNumber':login.cusNumber,'tsd_id':model.service.tsd_id}
				},
				success:function(data){
					treeContainer.removeNode(treeContainer.getNodeByParam("id",model.service.tsd_id));
					modelUtil.clear(model.service,{'tsd_cus_number':'','user_id':''});
					tip.alert("删除成功");
				}
			});
		});
  }
});


