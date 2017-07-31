define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var treeSelect = require('ztree');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');

	var categoryTree = null;
	var deptTree = null;
	var isAdd = true;
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#categoryManage',
		data:{
			searchTree:'',
			categoryList:[],
			deptTreeList:[],
			deptList:[],
			treeNode:null,
			category:{ 
				'cbd_cus_number':loginUser.cusNumber,
				'cbd_id':'',
				'cbd_name':'',
				'cbd_seq':0,
				'cbd_crte_user_id':loginUser.userId,
				'cbd_updt_user_id':loginUser.userId
			},
			dept:{ 
				'cdr_cus_number':loginUser.cusNumber,
				'cdr_category_id':'',
				'cdr_dept_id':''
			}
		}
	});
	/**
	 * 初始化左侧区域类别岗位信息
	 * @returns
	 */
	function initCategoryTree(){
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
					var	nodes = categoryTree.getNodes();
					updateOrderId(nodes);
					return true;
				},
				onDblClick:function(event,treeId,treeNode){
					isAdd = false;
					model.category.cbd_name = '';
					loadDeptTree();
					if(treeNode){
						model.treeNode = treeNode;
						nodeType = treeNode.type;
						model.category.cbd_id = treeNode.id;
						model.category.cbd_name = treeNode.name;
						var deptList = model.deptList;
						for(var i=0;i<deptList.length;i++){
							var categoryId = deptList[i].cdr_category_id;
							var node = deptTree.getNodeByParam("id",deptList[i].cdr_dept_id);
							if(treeNode.id == categoryId){
							    node && deptTree.checkNode(node,true,true);
							}else{
								node && deptTree.removeNode(node);
							}
						}
					}
				}
			}
		}
		/**
		 * 查询类别岗位信息
		 */
		db.query({
			request: {
				sqlId: 'select_dty_category_base_tree',
				whereId: 0,
				orderId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				model.categoryList = data;
				categoryTree = $.fn.zTree.init($('#categoryTree'),setting,model.categoryList);
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		 * 搜索tree监听函数
		 */
		model.$watch('searchTree',function(){
			 treeUtil.searchTree('name',model.searchTree,'categoryTree',model.categoryList,setting);
		});
		/**
		 * 修改排序序号
		 */
		function updateOrderId(nodes){
			var request = [];
			for(var i=0;i<nodes.length;i++){
				request.push({
					sqlId:'update_dty_category_base_orderId',
					params:{cbd_seq: i,cbd_cus_number: loginUser.cusNumber,cbd_id: nodes[i].id}
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
	/**
	 * 查询部门树
	 */
	function initDeptTree(){
		db.query({
			request:{
				sqlId: 'select_dty_org_dept',
				whereId: 0,
				orderId: 0,
				params: [loginUser.cusNumber]
			},
			success:function(data){
				model.deptTreeList = data;
				loadDeptTree();
			}
		});
	}
	/**
	 * 加载部门树
	 */
	function loadDeptTree(){
		var set={
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			check:{enable:true,chkboxType:{ "Y": "p", "N": "s" }},
			callback:{
			}
		}
 		deptTree=$.fn.zTree.init($("#deptTree"),set,model.deptTreeList);
 		deptTree.expandAll(true);
	}
	/**
	 * 保存
	 */
	$(".bottom").find(".save").click(function(){
		if(!validate()){
			return;
		}
		if(isAdd){
			if(model.treeNode){
				var list = model.treeNode.children;
				if(list && list.length > 0){
					model.category.cbd_seq = (list[list.length-1].seq+1);
				}
			}
			var request=[{
				sqlId:'insert_dty_category_base_dtls',
				params:[model.category]
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					model.category.cbd_id = data.data[0]['seqList'][0];
					request = [];
					var checkedList = deptTree.getCheckedNodes(true).map(function(row){
						if(row.children){
							return null;
						}else{
							return {'cdr_cus_number':loginUser.cusNumber,'cdr_category_id':model.category.cbd_id,'cdr_dept_id':row.id};
						}
					});
					for(var i=0;i<checkedList.length;i++){
						var params = checkedList[i];
						if(params){
							request.push({
								sqlId:'insert_dty_category_dept_rltn',
								params: params
				 			});
						}
					}
					db.updateByParamKey({
						request:request,
						success:function(data){
							queryCategoryDept();
						},
						error:function(data,respMsg){
							tip.alert(respMsg);
						}
					});
					//initCategoryTree();
	 				var temp = {};
	 				temp.id = model.category.cbd_id;
	 				temp.name = model.category.cbd_name;
	 				temp.seq = model.category.cbd_seq;
	 				addNode(categoryTree,model.treeNode,model.categoryList,temp);
					tip.close();
					tip.alert("保存成功");
					$(".bottom").find(".reset").click();
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		}else{
			var request=[{
 				sqlId:'update_dty_category_base_dtls',
 				params:{cbd_name:model.category.cbd_name,
 						 cbd_seq:model.category.cbd_seq,
 						 cbd_updt_user_id:model.category.cbd_updt_user_id,
 						 cbd_cus_number:model.category.cbd_cus_number,
 						 cbd_id:model.category.cbd_id}
 			},{
				sqlId:'delete_dty_category_dept_rltn',
				params: {cdr_cus_number: loginUser.cusNumber, cdr_category_id: model.category.cbd_id}
			}];
			var checkedList = deptTree.getCheckedNodes(true).map(function(row){
				if(row.children){
					return null;
				}else{
					return {'cdr_cus_number':loginUser.cusNumber,'cdr_category_id':model.category.cbd_id,'cdr_dept_id':row.id};
				}
			});
			for(var i=0;i<checkedList.length;i++){
				var params = checkedList[i];
				if(params){
					request.push({
						sqlId:'insert_dty_category_dept_rltn',
						params: params
		 			});
				}
			}
			tip.saving();
 			db.updateByParamKey({
 				request:request,
 				success:function(data){
 					//initCategoryTree();
 					model.treeNode.name = model.category.cbd_name;
					updateNode(categoryTree,model.treeNode,model.categoryList);
 					queryCategoryDept();
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
		if(isAdd){
			tip.alert("请选择一个类别");
			return;
		}
		tip.confirm("确定删除类别[ " + model.category.cbd_name + " ]以及该类别下的岗位、班次、模板？",function(){
			var request=[{
				sqlId:'delete_dty_category_base_dtls',
				params:{cbd_cus_number:loginUser.cusNumber,cbd_id:model.category.cbd_id}
			},{
				sqlId:'delete_dty_category_dept_rltn',
				params:{cdr_cus_number:loginUser.cusNumber,cdr_category_id:model.category.cbd_id}
			},{
				sqlId:'delete_dty_category_job',
				params:{jbd_cus_number:loginUser.cusNumber,jbd_category_id:model.category.cbd_id}
			},{
				sqlId:'delete_dty_category_shift',
				params:{sbd_cus_number:loginUser.cusNumber,sbd_category_id:model.category.cbd_id}
			},{
				sqlId:'delete_dty_category_mode',
				params:{mbd_cus_number:loginUser.cusNumber,mbd_category_id:model.category.cbd_id}
			}];
			db.updateByParamKey({
				request:request,
				success:function(data){
					//initCategoryTree();
					categoryTree.removeNode(model.treeNode);
					deleteNode(model.treeNode,model.categoryList);
					queryCategoryDept();
					tip.alert("删除成功");
					$(".bottom").find(".reset").click();
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		});
	});
	/**
	 * 重置
	 */
	$(".bottom").find(".reset").click(function(){
		model.category.cbd_id = '';
		model.category.cbd_name = '';
		deptTree.checkAllNodes(false);
		initCategoryTree();
		isAdd = true;
	});
	/**
	 * 查询值班类别使用部门信息
	 */
	function queryCategoryDept(){
		db.query({
			request:{
				sqlId:'select_dty_category_dept_rltn',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			success:function(data){
				model.deptList = data;
			}
		});
	}
	initCategoryTree();
	initDeptTree();
	queryCategoryDept();
	/**
	 * 大屏表单校验
	 */
	function validate(){
		var flag = true;
		if(!model.category['cbd_name']){
			tip.alert("请输入类别名称");
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