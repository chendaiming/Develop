define(function(require) {

//	var $ = require("jquery");
//	var db = require('frm/hz.db');
//	var ztree = require('ztree');
//	var vue = require('vue');
//	var select = require('frm/select');
//	var message = require('frm/message');
//	var treeUtil = require('frm/treeUtil');
//	var loginUser = require('frm/loginUser');
//	var clickTimerId = null;
//	var zTree;
//	var setting = {
//		view: {dblClickExpand: false},
//		data: {
//			simpleData: {
//				enable: true,
//				idKey: 'id',
//				pIdKey: 'pid'
//			}
//		},
//		callback: {
//			// 单机选择父类
//			onClick: function(event, treeId, treeNode) {
//				clickTimerId && clearTimeout(clickTimerId);
//				clickTimerId = setTimeout(function (data) {
//					if (data.id != vm.params.id) {
//						vm.$set('params.pname', data.name);
//						vm.$set('params.pid', data.id);
//					}
//				}, 300, treeNode);
//			},
//			// 双击查看编辑
//			onDblClick: function(event, treeId, treeNode) {
//				clickTimerId && clearTimeout(clickTimerId);
//				loadDetail(treeNode.cus_number, treeNode.id);
//			}
//		}
//	};
//
//	var vm = new vue({
//		el: 'body',
//		data: {
//			treeData: [],
//			searchVal: '',
//			params: initParams()
//		},
//		methods: {
//			reset: reset,
//			save: function () {
//				if (this.params.id) {
//					this.update();
//				} else {
//					this.insert();
//				}
//			},
//			insert: function () {
//				
//				try {
//					this._checkEmpty(this.params.name, '请输入分组名称!');
//					this._checkEmpty(this.params.type, '请输入分组类型!');
//					this._checkEmpty(this.params.order, '请输入排序序号!');
//				} catch (e) {
//					console.warn('添加模型分组数据验证未通过：', e);
//					return;
//				}
//
//				db.updateByParamKey({
//					request: {
//						sqlId: 'map_add_model_group',
//						params: [this.params],
//					},
//					success: function (data) {
//						message.alert('添加成功!');
//						console.log(data);
//						loadTree();
//					},
//					error: function (code, msg) {
//						message.alert(msg);
//					}
//				});
//			},
//			update: function () {
//				db.updateByParamKey({
//					request: {
//						sqlId: 'map_update_model_group',
//						whereId: 1,
//						params: [this.params],
//					},
//					success: function (data) {
//						message.alert('更新成功!');
//						console.log(data);
//						loadTree();
//					},
//					error: function (code, msg) {
//						message.alert(msg);
//					}
//				});
//			},
//			remove: function () {
//				message.confirm('是否删除该条记录?', function () {
//					db.update({
//						request: {
//							sqlId: 'delete_map_model_group',
//							whereId: 1,
//							params: [vm.params.id],
//						},
//						success: function (data) {
//							message.alert('删除成功!');
//							console.log(data);
//							reset();
//							loadTree();
//						},
//						error: function (code, msg) {
//							message.alert(msg);
//						}
//					});
//				});
//			},
//			_checkEmpty: function (val, msg) {
//				if (!val && val !== 0) {
//					message.alert(msg);
//					throw msg;
//				}
//			}
//		}
//	});
//
//	/*
//	 * 搜索tree监听函数
//	 */
//	vm.$watch('searchVal', function() {
//		treeUtil.searchTree('name', vm.searchVal, 'modelGroupTree', vm.treeData, setting);
//	});
//
//	/*
//	 * 初始化数据
//	 */
//	function initParams () {
//		return {
//			cus_number: loginUser.cusNumber,
//			cus_number_cn: loginUser.cusNumberName,
//			pid: '',
//			pname: '',
//			id: '',
//			name: '',
//			type: '',
//			order: '0',
//			model_name: '',
//			create_uid: loginUser.userId,
//			create_user: '',
//			create_datetime: '',
//			update_uid: loginUser.userId,
//			update_user: '',
//			update_datetime: ''
//		};
//	}
//
//	/*
//	 * 重置数据
//	 */
//	function reset () {
//		vm.params = initParams();
//	}
//
//
//	/*
//	 * 加载树
//	 */
//	function loadTree() {
//		treeLoading(true, '正在加载数据...');
//		db.query({
//			request: {
//				sqlId: 'select_map_model_group_list',
//				whereId: 1,
//				orderId: 1,
//				params: [loginUser.cusNumber]
//			},
//			success: function(data) {
//				treeLoading(data.length == 0, '暂无数据!');
//
//				// 处理数据
////				data = data || [];
////				data.push({isParent: true, id: loginUser.cusNumber, name: loginUser.cusNumberName, pid: 0});
//				vm.treeData = data;
//				zTree = $.fn.zTree.init($('#modelGroupTree'), setting, data);
////				zTree.expandNode(zTree.getNodes()[0], true);
//			},
//			error: function(code, msg) {
//				message.alert(code + ':' + msg);
//			}
//		});
//	}
//
//
//	/*
//	 * 加载效果处理
//	 */
//	function treeLoading (visible, msg) {
//		$('div.no-tree').toggle(visible);
//		$('div.dis-tab div').html(msg);
//	}
//
//
//	/*
//	 * 加载详情
//	 */
//	function loadDetail (curNumber, groupId) {
//		db.query({
//			request: {
//				sqlId: 'select_map_model_group_detail',
//				whereId: 1,
//				params: [curNumber, groupId]
//			},
//			success: function(data) {
//				for(var key in vm.params) {
//					vm.params[key] = data[0][key];
//				}
//
//			},
//			error: function(code, msg) {
//				message.alert(code + ':' + msg);
//			}
//		});
//	}
//
//
//	reset();
//	loadTree();
});