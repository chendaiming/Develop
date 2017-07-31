define(function(require) {
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var validate = require('frm/validate');

	var clickTimerId = null;
	var zTree;
	var setting = {
		view: {dblClickExpand: false},
		data: {
			simpleData: {
				enable: true,
				idKey: 'id',
				pIdKey: 'pid'
			}
		},
		callback: {
			// 单机选择父类
			onClick: function(event, treeId, treeNode) {
				clickTimerId && clearTimeout(clickTimerId);
				clickTimerId = setTimeout(function (data) {
					if (data.id != vm.params.id) {
						vm.$set('params.pname', data.name);
						vm.$set('params.pid', data.id);
					}
				}, 300, treeNode);
			},
			// 双击查看编辑
			onDblClick: function(event, treeId, treeNode) {
				clickTimerId && clearTimeout(clickTimerId);
				loadDetail(treeNode.id);
			}
		}
	};

	var vm = new vue({
		el: 'body',
		data: {
			treeData: [],
			searchVal: '',
			cusNumber:loginUser.cusNumber,
			params: initParams()
		},
		methods: {
			reset: reset,
			save: function () {
				if (this.params.id) {
					this.update();
				} else {
					this.insert();
				}
			},
			insert: function () {
				
				if(
						validate.isEmpty(this.params.pname) && !message.alert('请选择父级名称')	||
						validate.isEmpty(this.params.name) && !message.alert('请输入文件名称')	||
						validate.isEmpty(this.params.mfi_file_title) && !message.alert('请输入文件标题')	||
						this.params.mfi_file_title.length>40&& !message.alert('文件标题过长')	||
						this.params.name.length>40&& !message.alert('文件名称过长')	||
						validate.isEmpty(this.params.mfi_file_path) && !message.alert('请输入文件路径')	||
						validate.isEmpty(this.params.mfi_file_order) && !message.alert('请输入排序序号')||
						this.params.mfi_file_order.length>3&& !message.alert('排序序号过长')	||
					   !validate.isPositiveInteger(this.params.mfi_file_order) && !message.alert('请输入正确的序号!')
					){
						console.warn('添加模型文件信息验证未通过');
						return;
					}
				if(this.params.mfi_dept_id){
					this.params.mfi_dept_id = this.params.mfi_dept_id.toString();
				}
				
				db.updateByParamKey({
					request: {
						sqlId: 'insert_map_model_file',
						params: [this.params],
					},
					success: function (data) {
						message.alert('添加成功!');
//						loadTree();
						 var pnode = zTree.getNodesByParam('id',vm.params.pid);
						 areaTree.addNodes(pnode[0],vm.params);
					},
					error: function (code, msg) {
						message.alert(msg);
					}
				});
			},
			update: function () {
				
				if(
						validate.isEmpty(this.params.pname) && !message.alert('请选择父级名称')	||
						validate.isEmpty(this.params.name) && !message.alert('请输入文件名称')	||
						validate.isEmpty(this.params.mfi_file_title) && !message.alert('请输入文件标题')	||
						this.params.mfi_file_title.length>40&& !message.alert('文件标题过长')	||
						this.params.name.length>40&& !message.alert('文件名称过长')	||
						validate.isEmpty(this.params.mfi_file_path) && !message.alert('请输入文件路径')	||
						validate.isEmpty(this.params.mfi_file_order) && !message.alert('请输入排序序号')||
						this.params.mfi_file_order.length>3&& !message.alert('排序序号过长')	||
						!validate.isPositiveInteger(this.params.mfi_file_order) && !message.alert('请输入正确的序号!')
					){
						console.warn('添加模型文件信息验证未通过');
						return;
					}
				if(this.params.mfi_dept_id){
					this.params.mfi_dept_id = this.params.mfi_dept_id.toString();
				}
				
				db.updateByParamKey({
					request: {
						sqlId: 'update_map_model_file',
						whereId: 1,
						params: [this.params],
					},
					success: function (data) {
						message.alert('更新成功!');
//						loadTree();
						 var node = zTree.getNodesByParam('id',vm.params.id);
						 var pnode = zTree.getNodesByParam('id',vm.params.pid);
						 node = vm.params;
						 zTree.updateNode(node);	
					},
					error: function (code, msg) {
						message.alert(msg);
					}
				});
			},
			remove: function () {
				message.confirm('是否删除该条记录?', function () {
					db.update({
						request: {
							sqlId: 'delete_map_model_file',
							whereId: 1,
							params: [vm.params.id],
						},
						success: function (data) {
							message.alert('删除成功!');
							reset();
//							loadTree();
							zTree.removeNode(zTree.getNodesByParam('id',vm.params.id));
						},
						error: function (code, msg) {
							message.alert(msg);
						}
					});
				});
			}
		}
	});

	/*
	 * 搜索tree监听函数
	 */
	vm.$watch('searchVal', function() {
		treeUtil.searchTree('name', vm.searchVal, 'modelFileInfoTree', vm.treeData, setting);
	});

	/*
	 * 初始化数据
	 */
	function initParams () {
		return {
			cus_number: loginUser.cusNumber,
			pid:   '-1',
			pname: '',
			id:    '',
			name:  '',
			mfi_file_title: '',
			mfi_file_path : '',
			mfi_file_type : '1',
			mfi_file_flag:  '0',
			mfi_file_attr:  '',
			mfi_file_order: '',
			mfi_dept_id:'',
			mfi_load_flag: 1,
			create_uid: loginUser.userId,
			create_user: '',
			create_datetime: '',
			create_name:'',
			update_uid: loginUser.userId,
			update_user: '',
			update_name:'',
			update_datetime: ''
		};
	}
	/*
	 * 重置数据
	 */
	function reset () {
		vm.params = initParams();
	}
	/*
	 * 加载树
	 */
	function loadTree() {
		treeLoading(true, '正在加载数据...');
		db.query({
			request: {
				sqlId: 'select_map_model_file_list',
				whereId: 1,
				orderId: 1,
				params: [loginUser.cusNumber]
			},
			success: function(data) {
				treeLoading(data.length == 0, '暂无数据!');
				// 处理数据
				vm.treeData = data;
				zTree = $.fn.zTree.init($('#modelFileInfoTree'), setting, data);
				
			},
			error: function(code, msg) {
				message.alert(code + ':' + msg);
			}
		});
	}


	/*
	 * 加载效果处理
	 */
	function treeLoading (visible, msg) {
		$('div.no-tree').toggle(visible);
		$('div.dis-tab div').html(msg);
	}
	/**
	 * 查询会员信息
	 */
	function queryUserName(id){
		var userData;
		db.query({
			request:{
				sqlId:'query_user_info_by_id',
				whereId:0,
				params:[loginUser.cusNumber,id]
			},
			async:false,
			success:function(data){
				userData = data[0];
			},
			error:function(code,msg){
				message.alert(msg);
			}
		})
		return userData;
	}

	
	/*
	 * 加载详情
	 */
	function loadDetail (groupId) {
		db.query({
			request: {
				sqlId: 'select_map_file_detail',
				whereId: 1,
				params: [loginUser.cusNumber, groupId]
			},
			success: function(data) {
				for(var key in vm.params) {
					vm.params[key] = data[0][key];
				}
				if(vm.params.mfi_dept_id){
					vm.params.mfi_dept_id = vm.params.mfi_dept_id.split(',');
				}
				var createUser = queryUserName(vm.params.create_uid);
				var updateUser = queryUserName(vm.params.update_uid);
				vm.params.create_name = createUser.username;
				vm.params.update_name = updateUser.username;
			},
			error: function(code, msg) {
				message.alert(code + ':' + msg);
			}
		});
	}
	
	

	reset();
	loadTree();
});