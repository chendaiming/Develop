/**
 * 
 */
define(function(require) {
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var hzDrag = require('frm/hz.drag');

	var vmCom = require('hz/map/viewMenu/viewMenuCom');
	var mapHandle = require('hz/map/map.handle');

	var zModelTree, zViewTree, clickTimerId, clickCallback, modelTreeData, openMap = {};	// 记录展开的节点

	var setting = vmCom.initSetting({
		// 单机选择父类
		onClick: function(event, treeId, treeNode) {
			clickTimerId && clearTimeout(clickTimerId);
			clickTimerId = setTimeout(function (node) {
				if (node.id != vm.params.id) {
					if (node.id != vm.params.pid) {
						vm.params.pname = node.name;
						vm.params.pid = node.id;
					} else {
						zViewTree.cancelSelectedNode(node);
						vm.params.pname = '';
						vm.params.pid = '';
					}
				}
			}, 300, treeNode);
		},

		// 双击查看编辑
		onDblClick: function(event, treeId, treeNode) {
			clickTimerId && clearTimeout(clickTimerId);
			loadViewDetail(treeNode.cus_number, treeNode.id);
		},

		onExpand: function (event, treeId, treeNode) {
			openMap[treeNode.id] = true;
		},

		onCollapse: function (event, treeId, treeNode) {
			delete openMap[treeNode.id];
		}
	});

	mapHandle.hzThree.on(mapHandle.hzThree.MouseEvent.MOUSE_UP, function (event) {
		if (vm.params.id) {
			var vp = mapHandle.getViewPoint();

			vm.params.pos_x = vp.posX;
			vm.params.pos_y = vp.posY;
			vm.params.pos_z = vp.posZ;

			vm.params.rot_x = vp.rotX;
			vm.params.rot_y = vp.rotY;
			vm.params.rot_z = vp.rotZ;

			vm.params.tar_x = vp.tarX;
			vm.params.tar_y = vp.tarY;
			vm.params.tar_z = vp.tarZ;
		}
	});
	
	var vm = new vue({
		el: 'body',
		data: {
			modelTree: [],
			treeData: [],
			searchVal: '',
			params: vmCom.initParams()
		},
		methods: {
			cancelParent: function (event) {
				if (event.keyCode == 46 || event.keyCode == 8) {
					vm.params.pname = '';
					vm.params.pid = '';
				}
			},

			reset: reset,
			save: function () {
				if (this.params.id) {
					this.update();
				} else {
					this.insert();
				}
			},
			insert: function () {
				vmCom.insert(this.params, function (id) {
					if (id) {
						vm.params.id = id;
						message.alert('添加成功!');
						loadViewTree();
					} else {
						message.alert('添加失败!');
					}
				});
			},
			update: function () {
				vmCom.checkDefault(vm.params, function (result) {
					if (result) {
						vm._update(vmCom.getRequest());
					} else {
						message.confirm('是否确定保存本次更改?', function () {
							vm._update([]);
						});
						
					}
				});
			},

			_update: function (request) {
				request.push({
					sqlId: 'update_map_view_menu',
					whereId: 1,
					params: [vm.params],
				});

				db.updateByParamKey({
					request: request,
					success: function (data) {
						var result;

						if (request.length == 1) {
							result = data.data[0].result;
						} else {
							result = data.data[1].result;
						}

						if (result > 0) {
							message.alert('更新成功!');
							loadViewTree();
						} else {
							message.alert('更新失败!');
							console.log('返回数据结构：', result);
						}
					},
					error: function (code, msg) {
						message.alert(msg);
					}
				});				
			},

			remove: function () {
				if (this.params.id) {

					var msg = '是否需要删除视角<<span class="">' + this.params.name + '</span>>';
					for(var i = 0; i < vm.treeData.length; i++) {
						if (vm.treeData[i].pid == this.params.id) {
							msg += '及其下面的所有子类?';
							break;
						}
					}

					message.confirm(msg, function () {
						db.update({
							request: {
								sqlId: 'delete_map_view_menu',
								whereId: 1,
								params: [vm.params.cus_number, vm.params.id],
							},
							success: function (data) {
								if (data.data[0].result[0] > 0) {
									message.alert('删除成功!');
									loadViewTree();
								} else {
									message.alert('删除失败!');
									console.log('返回数据结构：', result);
								}
							},
							error: function (code, msg) {
								message.alert(msg);
							}
						});
					});
				} else {
					message.alert('请选择要删除的视角!');
				}
			},
			showModelTree: function (e) {
				$('#modelTreePanel').toggle();
			},
		}
	});

	/*
	 * 搜索tree监听函数
	 */
	vm.$watch('searchVal', function() {
		treeUtil.searchTree('name', vm.searchVal, 'viewTree', vm.treeData, setting);
	});


	/*
	 * 查询详情
	 */
	function loadViewDetail (cusNumber, id) {
		db.query({
			request: {
				sqlId: 'select_map_view_menu_detail',
				whereId: 1,
				params: [cusNumber, id]
			},
			success: function (data) {
				var params = vm.params;
				for(var key in params) {
					params[key] = data[0][key];
				}

				var modelData = findData(vm.modelTree, params.model_group_id);
				if (modelData) {
					params.model_group_name = modelData.name;
				}
			},
			error: function(code, msg) {
				message.alert(code + ':' + msg);
			}
		});
	}

	/*
	 * 查找数据
	 */
	function findData (list, id) {
		for(var i = 0; i < list.length; i++) {
			if (list[i].id == id) {
				return list[i];
			}
		}
	}


	/*
	 * 重置数据
	 */
	function reset () {
		vm.params = vmCom.initParams();
	}

	/*
	 * 加载树
	 */
	function loadModelTree() {
		vmCom.loadModelTree(function(data) {
			// 处理数据
			vm.modelTree = data;
			zModelTree = $.fn.zTree.init($('#modelTree'), vmCom.initSetting({
				// 单机选择父类
				onClick: function(event, treeId, treeNode) {
					vm.params.model_group_name = treeNode.name;
					vm.params.model_group_id = treeNode.id;
					vm.params.order = treeNode.order;
					vm.params.type = vmCom.getViewType(treeNode.type);
					vm.params.name || (vm.params.name = treeNode.name);
					$('#modelTreePanel').hide();
				}
			}), data);
			zModelTree.expandNode(zModelTree.getNodes()[0], true);
		});
	}

	/*
	 * 加载树
	 */
	function loadViewTree() {
		treeLoading(true, '正在加载数据...');
		vmCom.loadViewTree(function(data) {
			treeLoading(data.length == 0, '暂无数据!');

			for(var i = 0; i < data.length; i++) {
				if (openMap[data[i].id]) {
					data[i].open = true;
				}
			}

			// 处理数据
			vm.treeData = data;
			zViewTree = $.fn.zTree.init($('#viewTree'), setting, data);
		});
	}

	/*
	 * 加载效果处理
	 */
	function treeLoading (visible, msg) {
		$('div.no-tree').toggle(visible);
		$('div.dis-tab div').html(msg);
	}

	loadModelTree();
	loadViewTree();
});