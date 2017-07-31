define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var dialog = require('frm/dialog');
	var tip = require('frm/message');
	var select = require('frm/select');
	var treeSelect = require('ztree');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var datepicker = require('frm/datepicker');
	
	var categoryOrderTree = null;
	var nodeType = null;
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#orderManage',
		data:{
			searchTree:'',
			treeNode:null,
			categoryOrderList:[],
			order:{ 
				'sbd_cus_number':loginUser.cusNumber,
				'sbd_id':'',
				'sbd_name':'',
				'sbd_stime_flag':1,
				'sbd_start_time':'',
				'sbd_etime_flag':1,
				'sbd_end_time':'',
				'sbd_category_id':'',
				'category_name':'',
				'sbd_next_shift_id':'',
				'sbd_seq':0,
				'sbd_crte_user_id':loginUser.userId,
				'sbd_updt_user_id':loginUser.userId
			}
		}
	});
	/**
	 * 初始化左侧区域类别班次信息
	 * @returns
	 */
	function initCategoryOrderTree(){
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
						model.order.sbd_category_id = treeNode.id.split("_")[1];
						model.order.category_name = treeNode.name;
					}
				},
				onDblClick:function(event,treeId,treeNode){
					if(treeNode && treeNode.type == "order"){
						clearForm();
						nodeType = treeNode.type;
						model.treeNode = treeNode;
						var parentNode = treeNode.getParentNode();
						model.order.sbd_category_id = parentNode.id.split("_")[1];
						model.order.category_name = parentNode.name;
						model.order.sbd_id = treeNode.id.split("_")[1];
						model.order.sbd_name = treeNode.name;
						model.order.sbd_stime_flag = treeNode.stimeflag;
						model.order.sbd_start_time = treeNode.starttime;
						model.order.sbd_etime_flag = treeNode.etimeflag;
						model.order.sbd_end_time = treeNode.endtime;
						model.order.sbd_next_shift_id = treeNode.nextshiftid;
					}
				}
			}
		}
		/**
		 * 查询类别岗位信息
		 */
		db.query({
			request: {
				sqlId: 'select_dty_category_order_tree',
				params: [loginUser.cusNumber,loginUser.cusNumber]
			},
			success: function (data) {
				model.categoryOrderList = data;
				categoryOrderTree = $.fn.zTree.init($('#categoryOrderTree'),setting,model.categoryOrderList);
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		 * 搜索tree监听函数
		 */
		model.$watch('searchTree',function(){
			 treeUtil.searchTree('name',model.searchTree,'categoryOrderTree',model.categoryOrderList,setting);
		});
		/**
		 * 修改排序序号
		 */
		function updateOrderId(nodes){
			var request = [];
			for(var i=0;i<nodes.length;i++){
				request.push({
					sqlId:'update_dty_shift_base_orderId',
					params:{sbd_seq: i,sbd_cus_number: loginUser.cusNumber,sbd_id: nodes[i].id.split("_")[1]}
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
	initCategoryOrderTree();
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
					model.order.sbd_seq = (list[list.length-1].seq+1);
				}
			}
			var request=[{
				sqlId:'insert_dty_shift_base_dtls',
				params: model.order
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					//initCategoryOrderTree();
					var temp = {};
	 				temp.id = "o_" + data.data[0].seqList[0];
	 				temp.pid = "c_" + model.order.sbd_category_id;
	 				temp.name = model.order.sbd_name;
	 				temp.stimeflag = model.order.sbd_stime_flag;
	 				temp.starttime = model.order.sbd_start_time;
	 				temp.etimeflag = model.order.sbd_etime_flag;
	 				temp.endtime = model.order.sbd_end_time;
	 				temp.nextshiftid = model.order.sbd_next_shift_id;
	 				temp.seq = model.order.sbd_seq;
	 				temp.type = "order";
	 				addNode(categoryOrderTree,model.treeNode,model.categoryOrderList,temp);
					tip.close();
					tip.alert("保存成功");
					model.order.sbd_id = '';
					model.order.sbd_name = '';
					model.order.sbd_stime_flag = 1;
					model.order.sbd_start_time = '';
					model.order.sbd_etime_flag = 1;
					model.order.sbd_end_time = '';
					model.order.sbd_next_shift_id = '';
				}
			})
		}else{
			var request=[{
				sqlId:'update_dty_shift_base_dtls',
				params: {sbd_name: model.order.sbd_name, 
						 sbd_stime_flag: model.order.sbd_stime_flag,
						 sbd_start_time: model.order.sbd_start_time,
						 sbd_etime_flag: model.order.sbd_etime_flag,
						 sbd_end_time: model.order.sbd_end_time,
						 sbd_next_shift_id: model.order.sbd_next_shift_id,
					     sbd_updt_user_id: loginUser.userId,
					     sbd_cus_number: loginUser.cusNumber,
					     sbd_id: model.order.sbd_id}
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					//initCategoryOrderTree();
					model.treeNode.name = model.order.sbd_name;
					model.treeNode.stimeflag = model.order.sbd_stime_flag;
					model.treeNode.starttime = model.order.sbd_start_time;
					model.treeNode.etimeflag = model.order.sbd_etime_flag;
					model.treeNode.endtime = model.order.sbd_end_time;
					model.treeNode.nextshiftid = model.order.sbd_next_shift_id;
					updateNode(categoryOrderTree,model.treeNode,model.categoryOrderList);
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
		tip.confirm("确定删除班次[ " + model.order.sbd_name + " ]？",function(){
			var request=[{
				sqlId:'delete_dty_shift_base_dtls',
				params:{sbd_cus_number:loginUser.cusNumber,sbd_id:model.order.sbd_id}
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					//initCategoryOrderTree();
					categoryOrderTree.removeNode(model.treeNode);
					deleteNode(model.treeNode,model.categoryOrderList);
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
		model.order.sbd_category_id = '';
		model.order.category_name = '';
		model.order.sbd_id = '';
		model.order.sbd_name = '';
		model.order.sbd_stime_flag = 1;
		model.order.sbd_start_time = '';
		model.order.sbd_etime_flag = 1;
		model.order.sbd_end_time = '';
		model.order.sbd_next_shift_id = '';
	}
	/**
	 * 大屏表单校验
	 */
	function validate(){
		var flag = true;
		if(!model.order['sbd_name']){
			tip.alert("请输入班次名称");
			flag = false;
		}else if(!model.order['sbd_start_time']){
			tip.alert("请选择开始时间");
			flag = false;
		}else if(!model.order['sbd_end_time']){
			tip.alert("请选择结束时间");
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