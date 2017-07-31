define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var treeSelect = require('ztree');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	
	var categoryJobTree = null;
	var nodeType = null;
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#jobManage',
		data:{
			searchTree:'',
			treeNode:null,
			categoryJobList:[],
			job:{ 
				'jbd_cus_number':loginUser.cusNumber,
				'jbd_id':'',
				'jbd_name':'',
				'jbd_category_id':'',
				'category_name':'',
				'jbd_seq':0,
				'jbd_crte_user_id':loginUser.userId,
				'jbd_updt_user_id':loginUser.userId
			}
		}
	});
	/**
	 * 初始化左侧区域类别岗位信息
	 * @returns
	 */
	function initCategoryJobTree(){
		var setting = {
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			edit: {
				enable: true,
				drag: {
					isCopy: true,
					isMove: true,
					prev: function(treeId, nodes, targetNode){
						return !targetNode.isParent;
					},
					next: function(treeId, nodes, targetNode){
						return !targetNode.isParent;
					},
					inner: false
				},
				showRemoveBtn:false,
				showRenameBtn:false,
			},
			callback:{
				onDrop:function(event, treeId, treeNodes, targetNode, moveType, isCopy){
					var parent = targetNode.getParentNode();
					updateOrderId(parent.children);
					return true;
				},
				onClick:function(event,treeId,treeNode){
					if(treeNode && treeNode.type == "category"){
						clearForm();
						nodeType = treeNode.type;
						model.treeNode = treeNode;
						model.job.jbd_category_id = treeNode.id.split("_")[1];
						model.job.category_name = treeNode.name;
					}
				},
				onDblClick:function(event,treeId,treeNode){
					if(treeNode && treeNode.type == "job"){
						clearForm();
						nodeType = treeNode.type;
						model.treeNode = treeNode;
						var parentNode = treeNode.getParentNode();
						model.job.jbd_category_id = parentNode.id.split("_")[1];
						model.job.category_name = parentNode.name;
						model.job.jbd_id = treeNode.id.split("_")[1];
						model.job.jbd_name = treeNode.name;
					}
				}
			}
		}
		/**
		 * 查询类别岗位信息
		 */
		db.query({
			request: {
				sqlId: 'select_dty_category_job_tree',
				params: [loginUser.cusNumber,loginUser.cusNumber]
			},
			success: function (data) {
				model.categoryJobList = data;
				categoryJobTree = $.fn.zTree.init($('#categoryJobTree'),setting,model.categoryJobList);
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		 * 搜索tree监听函数
		 */
		model.$watch('searchTree',function(){
			 treeUtil.searchTree('name',model.searchTree,'categoryJobTree',model.categoryJobList,setting);
		});
		/**
		 * 修改排序序号
		 */
		function updateOrderId(nodes){
			var request = [];
			for(var i=0;i<nodes.length;i++){
				request.push({
					sqlId:'update_dty_job_base_orderId',
					params:{jbd_seq: i,jbd_cus_number: loginUser.cusNumber,jbd_id: nodes[i].id.split("_")[1]}
				});
			}
			db.updateByParamKey({
				request:request,
				success:function(data){
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		}
	}
	initCategoryJobTree();
	/**
	 * 保存
	 */
	$(".bottom").find(".save").click(function(){
		if(!nodeType){
			tip.alert("请选择一个节点");
			return;
		}
		if(!validate()){
			return;
		}
		if(nodeType == "category"){
			if(model.treeNode){
				var list = model.treeNode.children;
				if(list && list.length > 0){
					model.job.jbd_seq = (list[list.length-1].seq+1);
				}
			}
			var request=[{
				sqlId:'insert_dty_job_base_dtls',
				params: model.job
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					//initCategoryJobTree();
					//alert(JSON.stringify(data));
					var temp = {};
	 				temp.id = "j_" + data.data[0].seqList[0];
	 				temp.pid = "c_" + model.job.jbd_category_id;
	 				temp.name = model.job.jbd_name;
	 				temp.type = "job";
	 				temp.seq = model.job.jbd_seq;
	 				addNode(categoryJobTree,model.treeNode,model.categoryJobList,temp);
					tip.close();
					tip.alert("保存成功");
					model.job.jbd_id = '';
					model.job.jbd_name = '';
				}
			})
		}else{
			var request=[{
				sqlId:'update_dty_job_base_dtls',
				params: {jbd_name: model.job.jbd_name,jbd_updt_user_id: loginUser.userId, 
						 jbd_cus_number: loginUser.cusNumber,jbd_id: model.job.jbd_id}
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					//initCategoryJobTree();
					model.treeNode.name = model.job.jbd_name;
					updateNode(categoryJobTree,model.treeNode,model.categoryJobList);
					tip.close();
					tip.alert("保存成功");
				}
			})
		}
	})
	/**
	 * 删除
	 */
	$(".bottom").find(".del").click(function(){
		if(!nodeType){
			tip.alert("请选择一个节点");
			return;
		}
		if(nodeType == "category"){
			tip.alert("父节点不可删除");
			return;
		}
		tip.confirm("确定删除岗位[ " + model.job.jbd_name + " ]？",function(){
			var request=[{
				sqlId:'delete_dty_job_base_dtls',
				params:{jbd_cus_number:loginUser.cusNumber,jbd_id:model.job.jbd_id}
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					//initCategoryJobTree();
					categoryJobTree.removeNode(model.treeNode);
					deleteNode(model.treeNode,model.categoryJobList);
					tip.close();
					tip.alert("删除成功");
					clearForm();
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		});
	});
	/**
	 * 清空表单
	 */
	function clearForm(){
		nodeType = null;
		model.job.jbd_category_id = '';
		model.job.category_name = '';
		model.job.jbd_id = '';
		model.job.jbd_name = '';
	}
	/**
	 * 表单校验
	 */
	function validate(){
		var flag = true;
		if(!model.job['jbd_name']){
			tip.alert("请输入岗位名称");
			flag = false;
		}
		return flag;
 	}
	/**
	 * 添加节点
	 */
	function addNode(treeObj,treeNode,treeList,temp){
		treeObj.addNodes(treeNode,-1,temp);
		treeList.push(temp);
	}
	/**
	 * 修改节点
	 */
	function updateNode(treeObj,treeNode,treeList){
		deleteNode(treeNode,treeList);
		treeList.push(treeNode);
		treeObj.updateNode(treeNode);
	}
	/**
	 * 删除节点
	 */
	function deleteNode(treeNode,treeList){
		for(var i=0;i<treeList.length;i++){
			var id = treeList[i].id;
			if(id == treeNode.id){
				treeList.splice(i--,1);
			}
		}
	}
});