define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var select = require('frm/select');
	var ztree = require('ztree');
	var treeSelect = require('frm/treeSelect');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var localData = require('frm/localData');
	var ledBaseTree = null;
	var handle = null;
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#ledBaseManage',
		data:{
			searchTree:'',
			treeNode:null,
			ledBaseList:[],
			ledBase:{
				'id':'',
				'pid':'',
				'name':'',
				'icon':'talk.png',
				'type':'1',
				'lbd_cus_number':loginUser.cusNumber,
				'lbd_other_id':'',
				'lbd_brand':'',
				'lbd_ip':'',
				'lbd_chl':'',
				'lbd_port':'',
				'lbd_dept_id':'',
				'lbd_dept_name':'',
				'lbd_area_id':'',
				'lbd_area_name':'',
				'lbd_room_id':'',
				'lbd_dvc_addrs':'',
				'lbd_dvc_stts':'0',
				'lbd_use_stts':'2',
				'lbd_seq':0,
				'lbd_width':'',
				'lbd_height':'',
				'lbd_crte_user_id':loginUser.userId,
				'lbd_updt_user_id':loginUser.userId
			}
		},
		methods:{
			save:function(){
				save();
			},
			del:function(){
				del();
			},
			reset:function(){
				reset();
			}
		}
	});
	/**
	 * 初始化左侧区域led显示器信息
	 * @returns
	 */
	function initLedBaseTree(){
		var setting = {
			path:'../../../libs/ztree/css/zTreeStyle/img/',
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
				showRenameBtn:false
			},
			callback:{
				onDrop:function(event, treeId, treeNodes, targetNode, moveType, isCopy){
					var	nodes = ledBaseTree.getNodes();
					updateOrderId(nodes);
					return true;
				},
				onClick:function(event,treeId,treeNode){

					localData.subsetZTrees(treeNode,function(){
						handle = "add";
						model.treeNode = treeNode;
						model.ledBase.pid = treeNode.id;
						model.ledBase.lbd_area_id = treeNode.id.split("-")[1];
						model.ledBase.lbd_area_name = treeNode.name;
					},'0','type')
				},
				onDblClick:function(event,treeId,treeNode){
					if(treeNode.type == "1"){
						handle = "update";
						model.treeNode = treeNode;
						model.ledBase.id = treeNode.id;
						model.ledBase.pid = treeNode.pid;
						model.ledBase.name = treeNode.name;
						model.ledBase.lbd_other_id = treeNode.lbd_other_id;
						model.ledBase.lbd_brand = treeNode.lbd_brand;
						model.ledBase.lbd_ip = treeNode.lbd_ip;
						model.ledBase.lbd_chl = treeNode.lbd_chl;
						model.ledBase.lbd_port = treeNode.lbd_port;
						model.ledBase.lbd_dept_id = treeNode.lbd_dept_id;
						model.ledBase.lbd_dept_name = treeNode.lbd_dept_name;
						model.ledBase.lbd_area_id = treeNode.lbd_area_id;
						model.ledBase.lbd_area_name = treeNode.lbd_area_name;
						model.ledBase.lbd_room_id = treeNode.lbd_room_id;
						model.ledBase.lbd_dvc_addrs = treeNode.lbd_dvc_addrs;
						model.ledBase.lbd_dvc_stts = treeNode.lbd_dvc_stts;
						model.ledBase.lbd_use_stts = treeNode.lbd_use_stts;
						model.ledBase.lbd_width = treeNode.lbd_width;
						model.ledBase.lbd_height = treeNode.lbd_height;
						model.ledBase.lbd_seq = treeNode.lbd_seq;
					}
				}
			}
		}
		/**
		 * 查询区域led显示器信息
		 */
		db.query({
			request: {
				sqlId: 'select_tbk_led_base_dtls',
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				model.ledBaseList = data;
				ledBaseTree = $.fn.zTree.init($('#ledBaseTree'),setting,model.ledBaseList);
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		 * 搜索tree监听函数
		 */
		model.$watch('searchTree',function(){
			handle = null;
			treeUtil.searchTree('name',model.searchTree,'ledBaseTree',model.ledBaseList,setting);
		});
		/**
		 * 修改排序序号
		 */
		function updateOrderId(nodes){
			var request = [];
			for(var i=0;i<nodes.length;i++){
				request.push({
					sqlId:'update_tbk_led_base_orderId',
					params:{lbd_seq: i,lbd_cus_number: loginUser.cusNumber,lbd_id: nodes[i].id}
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
	 * 部门树
	 */
	db.query({
		request:{
			sqlId:'select_org_dept',
			whereId:'0',
			params:[loginUser.cusNumber]
		},
		async:true,
		success:function(data){
			var setting = {
					key:'name',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable: false},
					callback:{
						onClick:function(e,id,node){
							model.ledBase.lbd_dept_id = node.id;
							model.ledBase.lbd_dept_name = node.name;
						}
					}
			}
			var deptree = treeSelect.init("dep",setting,data);
			deptree.expandNode(deptree.getNodes()[0],true,false,true);
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}
	});
	initLedBaseTree();
	/**
	 * 新增或修改
	 */
	function save(){
		if(!handle){
			tip.alert("请选择一个节点");
			return;
		}
		if(!validate()){
			return;
		}
		if(handle == "add"){
			if(model.treeNode){
				var list = model.treeNode.children;
				if(list && list.length > 0){
					model.ledBase.lbd_seq = (list[list.length-1].lbd_seq+1);
				}
			}
			var request=[{
				sqlId:'insert_tbk_led_base_dtls',
				params:[model.ledBase]
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
	 				model.ledBase.id = data.data[0]['seqList'][0]+"";
	 				var temp = {};
	 				temp.id = model.ledBase.id;
	 				temp.pid = model.ledBase.pid;
	 				temp.name = model.ledBase.name;
	 				temp.icon = model.ledBase.icon;
	 				temp.type = model.ledBase.type;
	 				temp.lbd_other_id = model.ledBase.lbd_other_id;
	 				temp.lbd_brand = model.ledBase.lbd_brand;
	 				temp.lbd_ip = model.ledBase.lbd_ip;
	 				temp.lbd_chl = model.ledBase.lbd_chl;
	 				temp.lbd_port = model.ledBase.lbd_port;
	 				temp.lbd_dept_id = model.ledBase.lbd_dept_id;
	 				temp.lbd_dept_name = model.ledBase.lbd_dept_name;
	 				temp.lbd_area_id = model.ledBase.lbd_area_id;
	 				temp.lbd_area_name = model.ledBase.lbd_area_name;
	 				temp.lbd_room_id = model.ledBase.lbd_room_id;
	 				temp.lbd_dvc_addrs = model.ledBase.lbd_dvc_addrs;
	 				temp.lbd_dvc_stts = model.ledBase.lbd_dvc_stts;
	 				temp.lbd_use_stts = model.ledBase.lbd_use_stts;
					temp.lbd_width = model.ledBase.lbd_width;
					temp.lbd_height = model.ledBase.lbd_height;
					temp.lbd_seq = model.ledBase.lbd_seq;
	 				addNode(ledBaseTree,model.treeNode,model.ledBaseList,temp);
					tip.close();
					tip.alert("保存成功");
					reset();
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		}else{
			var request=[{
 				sqlId:'update_tbk_led_base_dtls',
 				params:{lbd_other_id:model.ledBase.lbd_other_id,
 						lbd_name:model.ledBase.name,
 						lbd_brand:model.ledBase.lbd_brand,
 						lbd_ip:model.ledBase.lbd_ip,
 						lbd_chl:model.ledBase.lbd_chl,
 						lbd_port:model.ledBase.lbd_port,
 						lbd_dept_id:model.ledBase.lbd_dept_id,
 						lbd_area_id:model.ledBase.lbd_area_id,
 						lbd_room_id:model.ledBase.lbd_room_id,
 						lbd_dvc_addrs:model.ledBase.lbd_dvc_addrs,
 						lbd_dvc_stts:model.ledBase.lbd_dvc_stts,
 						lbd_use_stts:model.ledBase.lbd_use_stts,
 						lbd_cus_number:model.ledBase.lbd_cus_number,
 						lbd_id:model.ledBase.id,
						lbd_width:model.ledBase.lbd_width,
						lbd_height:model.ledBase.lbd_height
				}
 			}];
			tip.saving();
 			db.updateByParamKey({
 				request:request,
 				success:function(data){
 					model.treeNode.name = model.ledBase.name;
 					model.treeNode.lbd_other_id = model.ledBase.lbd_other_id;
 					model.treeNode.lbd_brand = model.ledBase.lbd_brand;
 					model.treeNode.lbd_ip = model.ledBase.lbd_ip;
 					model.treeNode.lbd_chl = model.ledBase.lbd_chl;
 					model.treeNode.lbd_port = model.ledBase.lbd_port;
 					model.treeNode.lbd_dept_id = model.ledBase.lbd_dept_id;
 					model.treeNode.lbd_dept_name = model.ledBase.lbd_dept_name;
 					model.treeNode.lbd_room_id = model.ledBase.lbd_room_id;
 					model.treeNode.lbd_dvc_addrs = model.ledBase.lbd_dvc_addrs;
 					model.treeNode.lbd_use_stts = model.ledBase.lbd_use_stts;
 					model.treeNode.lbd_use_stts = model.ledBase.lbd_use_stts;
					model.treeNode.lbd_width = model.ledBase.lbd_width;
					model.treeNode.lbd_height = model.ledBase.lbd_height;
					updateNode(ledBaseTree,model.treeNode,model.ledBaseList);
 					tip.close();
 					tip.alert("保存成功");
					reset();
 				}
 			})
		}
	}
	/**
	 * 删除
	 */
	function del(){
		if(handle != "update"){
			tip.alert("请双击选择一个LED显示器");
			return;
		}
		tip.confirm("确定删除LED显示器[ " + model.ledBase.name + " ]吗？",function(){
			var request=[{
				sqlId:'delete_tbk_led_base_dtls',
				params:{lbd_cus_number:loginUser.cusNumber,lbd_id:model.ledBase.id}
			}];
			db.updateByParamKey({
				request:request,
				success:function(data){
					ledBaseTree.removeNode(model.treeNode);
					deleteNode(model.treeNode,model.ledBaseList);
					tip.alert("删除成功");
					reset();
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		});
	}
	/**
	 * 重置
	 */
	function reset(){
		model.ledBase.id = '';
		//model.ledBase.pid = '';
		model.ledBase.lbd_other_id = '';
		model.ledBase.name = '';
		model.ledBase.lbd_brand = '';
		model.ledBase.lbd_ip = '';
		model.ledBase.lbd_chl = '';
		model.ledBase.lbd_port = '';
		model.ledBase.lbd_dept_id = '';
		model.ledBase.lbd_dept_name = '';
		model.ledBase.lbd_area_id = '';
		model.ledBase.lbd_area_name = '';
		model.ledBase.lbd_room_id = '';
		model.ledBase.lbd_dvc_addrs = '';
		model.ledBase.lbd_dvc_stts = '';
		model.ledBase.lbd_use_stts = '';
		model.ledBase.lbd_seq = '';
		model.ledBase.lbd_width = '';
		model.ledBase.lbd_height = '';
	}
	/**
	 * 表单校验
	 */
	function validate(){
		var flag = true;
		if(!model.ledBase.lbd_other_id){
			tip.alert("请输入厂商唯一编号");
			flag = false;
		}else if(!model.ledBase.name){
			tip.alert("请输入LED显示器名称");
			flag = false;
		}else if(!model.ledBase.lbd_brand){
			tip.alert("请选择LED显示器品牌");
			flag = false;
		}else if(!model.ledBase.lbd_ip){
			tip.alert("请输入LED显示器IP");
			flag = false;
		}else if(!model.ledBase.lbd_chl){
			tip.alert("请输入LED显示器通道号");
			flag = false;
		}else if(!model.ledBase.lbd_port){
			tip.alert("请输入LED显示器端口");
			flag = false;
		}else if(!model.ledBase.lbd_dept_id){
			tip.alert("请选择所属部门");
			flag = false;
		}else if(!model.ledBase.lbd_area_id){
			tip.alert("请选择所属区域");
			flag = false;
		}else if(!model.ledBase.lbd_dvc_addrs){
			tip.alert("请输入安装位置");
			flag = false;
		}else if(model.ledBase.lbd_dvc_stts == "" && model.ledBase.lbd_dvc_stts != "0"){
			tip.alert("请选择设备状态");
			flag = false;
		}else if(!model.ledBase.lbd_use_stts){
			tip.alert("请选择使用状态");
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
				treeList.splice(i,1); break;
			}
		}
	}
});