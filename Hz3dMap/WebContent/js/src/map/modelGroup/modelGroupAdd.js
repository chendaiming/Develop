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
	var localStorage = require('frm/localStorage');
	var hzDrag = require('frm/hz.drag');
	var mgCom = require('hz/map/modelGroup/modelGroupCom');
	var $panel = $('div.map-func-panel.model-group-add');

	var zModelGroupTree = null;

	// 注册拖拽
	hzDrag.on($panel).on('mouseup', function () {
		localStorage.setItem('modelGroupAdd.offset', $panel.offset());
	});

	/*
	 * vue对象
	 */
	var vm = new vue({
		el: 'div.map-func-panel.model-group-add',
		data: {
			params: mgCom.initParams()
		},
		methods: {
			reset: function () {
				this.params = mgCom.initParams();
			},
			save: function () {
				mgCom.insert(this.params, function (data) {
					message.alert('添加成功!');
					loadTree();
				});
			},
			showParent: function (e) {
				$('#modelGroupPanel').toggle();
			}
		}
	});

	/*
	 * 显示面板
	 */
	function show (modelName) {
		var offset = localStorage.getItem('modelGroupAdd.offset');
		if (offset) {
			$panel.css({'top': offset.top, 'left': offset.left});
		}

		loadTree();
		setModelName(modelName);
		$panel.fadeIn(350);
	}

	/*
	 * 隐藏面板
	 */
	function hide () {
		$panel.fadeOut(350);
	}

	/*
	 * 设置模型名称
	 */
	function setModelName (modelName) {
		vm.params.model_name = modelName || '';
	}

	/*
	 * 加载树
	 */
	function loadTree () {
		mgCom.loadTree(function (data) {
			zModelGroupTree = $.fn.zTree.init($('#modelGroupTree'), mgCom.initSetting({
				onClick: function (event, treeId, treeNode) {
					vm.params.pid = treeNode.id;
					vm.params.pname = treeNode.name;
					$('#modelGroupPanel').hide();
				}
			}), data);
			zModelGroupTree.expandNode(zModelGroupTree.getNodes()[0], true);
		});
	}

	// 关闭
	$panel.find('a.map-close').click(hide);

	// 拖拽过滤
	$('div.model-group-add input.form-control, div.model-group-add div.icon input').bind({
		'focus': function () {
			hzDrag.disabled();
			hzThree.setControlKeysEnable(false);
		},
		'blur': function () {
			hzDrag.enabled();
			hzThree.setControlKeysEnable(true);
		}
	});

	window.showModelGroupAdd = show;
	window.setModelName = setModelName;
});