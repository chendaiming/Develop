/**
 * 
 */
define(function(require) {
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var localStorage = require('frm/localStorage');
	var hzDrag = require('frm/hz.drag');
	var vmCom = require('hz/map/viewMenu/viewMenuCom');
	var $panel = $('div.map-func-panel.view-menu-add');
	var mapHandle = require('hz/map/map.handle');
	var zModelTree, zViewTree, 
		mapToolsVM = null;

	function $$ (selector) {
		return $panel.find(selector);
	}

	/*
	 * 显示视角菜单添加面板
	 */
	function show () {

		var offset = localStorage.getItem('viewpanel.offset');
		if (offset) {
			$panel.css({'top': offset.top, 'left': offset.left});
		}

		mapHandle.hzThree.on(mapHandle.hzThree.MouseEvent.MOUSE_UP, setViewPoint);
		vmCom.setViewPoint(vm);
		loadModelTree();
		loadViewTree();

		$panel.fadeIn(350);
	}

	/*
	 * 设置视角坐标
	 */
	function setViewPoint() {
		vmCom.setViewPoint(vm);
	}


	/*
	 * 关闭
	 */
	function hide () {
		mapHandle.hzThree.off(mapHandle.hzThree.MouseEvent.MOUSE_UP, setViewPoint);
		$panel.fadeOut(350, function () {
			if (moreStatus) {
				$$('div.more-btn >a').click();
			}
		});
		mapToolsVM && (mapToolsVM.selectedIndex = null);
	}


	// 检查样式
	function hasClassName (target, classNames) {
		if (target) {
			for(var i = 0; i < classNames.length; i++) {
				if (target.className == classNames[i]) {
					return true;
				}
			}
			return hasClassName(target.parentNode, classNames);
		}
	}

	// 注册拖拽
	hzDrag.on($panel).on({
		'mousedown': function (event) {
			if (!hasClassName(event.target, ['combox_panel', 'tree-content'])) {
				var target1 = $$('.tree-content');
				var target2 = $$('.combox_panel');
	
				target1.is(':visible') && target1.fadeOut(300);
				target2.is(':visible') && target2.fadeOut(300);
			}
		},
		'mouseup': function () {
			localStorage.setItem('viewpanel.offset', $panel.offset());
		}
	});

	// 关闭视角菜单添加面板
	$$('a.map-close').click(reset);


	// 拖拽过滤
	$$('input.form-control, div.icon input').bind({
		'focus': function () {
			hzDrag.disabled();
			mapHandle.hzThree.setControlKeysEnable(false);
		},
		'blur': function () {
			hzDrag.enabled();
			mapHandle.hzThree.setControlKeysEnable(true);
		}
	});


	// 更多属性
//	$$('div.more-btn >a').click(function () {
//		if (moreStatus) {
//			moreStatus = false;
//			$(this).html('更多属性>>').attr('title', '点击展开更多输入内容!');
//			$panel.removeClass('more');
//			$$('div.col-xs-12.more').hide();
//		} else {
//			moreStatus = true;
//			$(this).html('<<隐藏属性').attr('title', '点击隐藏展开的输入内容!');
//			$panel.addClass('more');
//			$$('div.col-xs-12.more').show();
//		}
//	});


	var vm = new vue({
		el: 'div.map-func-panel.view-menu-add',
		data: {
			treeData: [],
			searchVal: '',
			params: vmCom.initParams()
		},
		methods: {
			reset: reset,
			insert: function () {
				vmCom.insert(this.params, function (id) {
					if (id) {
						message.alert('添加成功!');
						loadViewTree();
						vm.params = vmCom.initParams();
					} else {
						message.alert('添加失败!');
					}
				});
			},
			showModelTree: function (e) {
				$('#modelTreePanel').toggle();
			},
			showViewTree: function (e) {
				$('#viewTreePanel').toggle();
			}
		}
	});


	/*
	 * 重置数据
	 */
	function reset () {
		vm.params = vmCom.initParams();
//		hide();
	}

	/*
	 * 加载树
	 */
	function loadModelTree() {
		vmCom.loadModelTree(function(data) {
			// 处理数据
//			vm.treeData = data;
			zModelTree = $.fn.zTree.init($('#modelTree'), vmCom.initSetting({
				onClick: function(event, treeId, treeNode) {
					vm.params.model_group_name = treeNode.name;
					vm.params.model_group_id = treeNode.id;
					vm.params.order = treeNode.order;
					vm.params.type = vmCom.getViewType(treeNode.type);
					vm.params.name || (vm.params.name = treeNode.name);
					mapHandle.toggleBuilding(treeNode.id);
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
		vmCom.loadViewTree(function(data) {
			// 处理数据
			//vm.treeData = data;
			if (data && data.length) {
				zViewTree = $.fn.zTree.init($('#viewTree'), vmCom.initSetting({
					onClick: function(event, treeId, treeNode) {
						vm.$set('params.pname', treeNode.name);
						vm.$set('params.pid', treeNode.id);
						$('#viewTreePanel').hide();
					}
				}), data);
				zViewTree.expandNode(zViewTree.getNodes()[0], true);
			}
		});
	}


	loadModelTree();
	loadViewTree();

	window.saveViewPoint = function (vm) {
		mapToolsVM = vm;
		$panel.is(':visible') ? hide() : show();
	};
});