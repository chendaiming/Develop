define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var select = require('frm/select');
	var tip = require('frm/message');
	var treeSelect = require('ztree');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	
	var categoryModeTree = null;
	var nodeType = null;
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#modeManage',
		data:{
			searchTree:'',
			orderList:[],
			jobList:[],
			modeList:[],
			categoryOrderList:[],
			categoryJobList:[],
			categoryModeList:[],
			treeNode:null,
			mode:{ 
				'mbd_cus_number':loginUser.cusNumber,
				'mbd_relation_id':'',
				'mbd_mode_idnty':'',
				'mbd_mode_name':'',
				'mbd_category_id':'',
				'category_name':'',
				'mbd_shift_id':'',
				'mbd_shift_name':'',
				'mbd_shift_start_time':'',
				'mbd_shift_end_time':'',
				'mbd_job_id':'',
				'mbd_job_name':'',
				'mbd_dept_id':'',
				'mbd_seq':0,
				'mbd_crte_user_id':loginUser.userId,
				'mbd_updt_user_id':loginUser.userId
			}
		},
		methods:{
			delOrder:function(order){
				var list = model.categoryOrderList;
				for(var i=0;i<list.length;i++){
					if(list[i].sbd_id == order.sbd_id){
						model.categoryOrderList.splice(i--,1);
					}
				}
			},
			delJob:function(order,job){
				$("#job_" + order.sbd_id + "_" + job.jbd_id).hide();
			}
		}
	});
	/**
	 * 初始化左侧区域类别模板信息
	 * @returns
	 */
	function initCategoryModeTree(){
		var categoryModeList = [];
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
						model.mode.mbd_category_id = '';
						model.mode.category_name = '';
						model.mode.mbd_mode_idnty = '';
						model.mode.mbd_mode_name = '';
						model.mode.mbd_dept_id = '';
						nodeType = treeNode.type;
						model.mode.mbd_category_id = treeNode.id.split("_")[1];
						model.mode.category_name = treeNode.name;
						model.treeNode = treeNode;
						loadNewMode();
					}
				},
				onDblClick:function(event,treeId,treeNode){
					if(treeNode && treeNode.type == "mode"){
						model.mode.mbd_category_id = '';
						model.mode.category_name = '';
						model.mode.mbd_mode_idnty = '';
						model.mode.mbd_mode_name = '';
						model.mode.mbd_dept_id = '';
						nodeType = treeNode.type;
						var parentNode = treeNode.getParentNode();
						model.mode.mbd_category_id = parentNode.id.split("_")[1];
						model.mode.category_name = parentNode.name;
						model.mode.mbd_mode_idnty = treeNode.id.split("_")[1];
						model.mode.mbd_mode_name = treeNode.name;
						model.mode.mbd_dept_id = treeNode.deptid;
						model.mode.mbd_seq = treeNode.seq;
						model.treeNode = parentNode;
						loadMode();
					}
				}
			}
		}
		/**
		 * 查询类别岗位信息
		 */
		db.query({
			request: {
				sqlId: 'select_dty_category_mode_tree',
				params: [loginUser.cusNumber,loginUser.cusNumber]
			},
			success: function (data) {
				categoryModeList = data;
				categoryModeTree = $.fn.zTree.init($('#categoryModeTree'),setting,categoryModeList);
				if(model.treeNode){
					var id = model.treeNode.id;
					var list = categoryModeTree.getNodes();
					for(var i=0;i<list.length;i++){
						var tid = list[i].id;
						if(tid == id){
							categoryModeTree.expandNode(list[i],true);
						}
					}
				}
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		 * 搜索tree监听函数
		 */
		model.$watch('searchTree',function(){
			 treeUtil.searchTree('name',model.searchTree,'categoryModeTree',categoryModeList,setting);
		});
		/**
		 * 修改排序序号
		 */
		function updateOrderId(nodes){
			var request = [];
			for(var i=0;i<nodes.length;i++){
				request.push({
					sqlId:'update_dty_mode_base_orderId',
					params:{mbd_seq: i,mbd_cus_number: loginUser.cusNumber,mbd_mode_idnty: nodes[i].id.split("_")[1]}
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
	 * 查询值班班次信息
	 */
	function queryOrder(){
		db.query({
			request:{
				sqlId:'select_dty_category_order_info',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.orderList = data;
			}
		});
	}
	/**
	 * 查询值班岗位信息
	 */
	function queryJob(){
		db.query({
			request:{
				sqlId:'select_dty_category_job_info',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.jobList = data;
			}
		});
	}
	/**
	 * 查询值班模板信息
	 */
	function queryMode(){
		db.query({
			request:{
				sqlId:'select_dty_mode_base_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.modeList = data;
			}
		});
	}
	queryOrder();
	queryJob();
	queryMode();
	initCategoryModeTree();
	/**
	 * 加载新建值班模板
	 */
	function loadNewMode(){
		model.categoryOrderList = [];
		model.categoryJobList = [];
		var list = model.orderList;
		for(var i=0;i<list.length;i++){
			if(list[i].sbd_category_id == model.mode.mbd_category_id){
				model.categoryOrderList.push(list[i]);
				var list2 = model.jobList;
				for(var j=0;j<list2.length;j++){
					if(list2[j].jbd_category_id == model.mode.mbd_category_id){
						model.categoryJobList.push({jbd_id: list2[j].jbd_id,
													jbd_name: list2[j].jbd_name,
													sbd_id: list[i].sbd_id});
					}
				}
			}
		}
	}
	/**
	 * 加载已保存值班模板
	 */
	function loadMode(){
		model.categoryModeList = [];
		model.categoryOrderList = [];
		model.categoryJobList = [];
		var list = model.modeList;
		var orderStrList = [];
		var jobStrList = [];
		for(var i=0;i<list.length;i++){
			if(list[i].mbd_mode_idnty == model.mode.mbd_mode_idnty){
				model.categoryModeList.push(list[i]);
				var orderStr = list[i].mbd_shift_id +""
							 + list[i].mbd_shift_name +""
							 + list[i].mbd_shift_start_time +""
							 + list[i].mbd_shift_end_time;
				if(JSON.stringify(orderStrList).indexOf(orderStr) == -1){
					orderStrList.push(orderStr);
					model.categoryOrderList.push({sbd_id: list[i].mbd_shift_id,
												  sbd_name: list[i].mbd_shift_name,
												  sbd_start_time: list[i].mbd_shift_start_time,
												  sbd_end_time: list[i].mbd_shift_end_time});
				}
				model.categoryJobList.push({jbd_id: list[i].mbd_job_id,
										    jbd_name: list[i].mbd_job_name,
										    sbd_id: list[i].mbd_shift_id});
			}
		}
	}
	/**
	 * 保存
	 */
	var num = 0;
	$(".bottom").find(".save").click(function(){
		if(!nodeType){
			tip.alert("请选择一个节点");
			return;
		}
		if(!validate()){
			return;
		}
		var request = [];
		if(nodeType == "mode"){
			request.push({
				sqlId:'delete_dty_mode_base_dtls',
				params:{mbd_cus_number:loginUser.cusNumber,mbd_mode_idnty:model.mode.mbd_mode_idnty}
			});
		}
		var orderJobList = [];
		$("#modeForm table").find("tr").each(function(){
			var orderId = null;
			var orderName = null;
			var orderStartTime = null;
			var orderEndTime = null;
			$(this).find("td").each(function(){
				var flag = $(this).attr("flag");
				if(flag == 1){
					orderId = $(this).find(".orderId").val();
					orderName = $(this).find(".orderName").val();
					orderStartTime = $(this).find(".orderStartTime").val();
					orderEndTime = $(this).find(".orderEndTime").val();
				}else if(flag == 2){
					$(this).find("div").each(function(){
						if($(this).is(":visible")){
							var jobId = $(this).find(".jobId").val();
							var jobName = $(this).find(".jobName").val();
							orderJobList.push({"orderId": orderId, "orderName": orderName,
										   "orderStartTime": orderStartTime, "orderEndTime": orderEndTime,
										   "jobId": jobId, "jobName": jobName});
						}
					})
				}
			})
		})
		if(model.treeNode){
			var list = model.treeNode.children;
			if(list && list.length > 0){
				model.mode.mbd_seq = (list[list.length-1].seq+1);
			}
		}
		var d = new Date();
		var vYear = d.getFullYear();
		var vMon = d.getMonth() + 1;
		var vDay = d.getDate();
		var h = d.getHours();
		var m = d.getMinutes();
		var se = d.getSeconds();
		var mbd_mode_idnty = loginUser.cusNumber +""+ model.mode.mbd_category_id +""
						  + vYear +""+ vMon +""+ vDay +""+ h +""+ m +""+ se +""+ num;
		num++;
		for(var i=0;i<orderJobList.length;i++){
			var mode = { 
				'mbd_cus_number':loginUser.cusNumber,
				'mbd_relation_id':'',
				'mbd_mode_idnty':mbd_mode_idnty,
				'mbd_mode_name':model.mode.mbd_mode_name,
				'mbd_category_id':model.mode.mbd_category_id,
				'category_name':model.mode.category_name,
				'mbd_shift_id':orderJobList[i].orderId,
				'mbd_shift_name':orderJobList[i].orderName,
				'mbd_shift_start_time':orderJobList[i].orderStartTime,
				'mbd_shift_end_time':orderJobList[i].orderEndTime,
				'mbd_job_id':orderJobList[i].jobId,
				'mbd_job_name':orderJobList[i].jobName,
				'mbd_dept_id':model.mode.mbd_dept_id,
				'mbd_seq':model.mode.mbd_seq,
				'mbd_crte_user_id':loginUser.userId,
				'mbd_updt_user_id':loginUser.userId
			}
			request.push({
				sqlId:'insert_dty_mode_base_dtls',
				params: mode
			});
			console.log(JSON.stringify(mode));
		}
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				initCategoryModeTree();
				queryMode();
				tip.close();
				tip.alert("保存成功");
				nodeType = null;
			}
		})
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
		tip.confirm("确定删除模板[ " + model.mode.mbd_mode_name + " ]？",function(){
			var request=[{
				sqlId:'delete_dty_mode_base_dtls',
				params:{mbd_cus_number:loginUser.cusNumber,mbd_mode_idnty:model.mode.mbd_mode_idnty}
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					initCategoryModeTree();
					tip.close();
					tip.alert("删除成功");
					nodeType = null;
					model.mode.mbd_mode_name = '';
					model.mode.mbd_dept_id = '';
					model.categoryOrderList = [];
					model.categoryJobList = [];
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
		$("#modeForm .job").show();
		loadNewMode();
	});
	/**
	 * 表单校验
	 */
	function validate(){
		var flag = true;
		var orderFlag = true;
		var jobFlag = true;
		$("#modeForm table").find("tr").each(function(){
			$(this).find("td").each(function(){
				var flag = $(this).attr("flag");
				if(flag == 1){
					orderName = $(this).find(".orderName").val();
					if(!$.trim(orderName)){
						orderFlag = false;
					}
				}else{
					$(this).find("div").each(function(){
						if($(this).is(":visible")){
							var jobName = $(this).find(".jobName").val();
							if(!$.trim(jobName)){
								jobFlag = false;
							}
						}
					})
				}
			})
		})
		if(!orderFlag){
			tip.alert("请填写班次名称");
			flag = false;
		}
		if(!jobFlag){
			tip.alert("请填写岗位名称");
			flag = false;
		}
		if(!model.mode['mbd_mode_name']){
			tip.alert("请输入模板名称");
			flag = false;
		}
		return flag;
 	}
});