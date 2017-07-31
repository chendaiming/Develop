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
//	var mapHandle = require('hz/map/map.handle');
	
	var zModelTree, zViewTree, hzThree = window.hzThree;
	var pickModelMap = {};			// 选择的模型对象集合
	var pickModelTarget = {};		// 选择的模型DOM对象
	var pickModelLen = 0;			// 选择的模型数量
	var pickStatus = false;			// 模型拾取状态
	var curSelectedModel = null;	// 当前选择的模型对象
	var mapToolsVM = null;			

	var $panel = $('div.map-func-panel.model-edit');
	var liTemp = $('#list-li-template').html();


	// 注册拖拽
	hzDrag.on($panel).on('mouseup', function () {
		localStorage.setItem('modelEdit.offset', $(this).offset());
	});

	function $$ (selector) {
		return $panel.find(selector);
	}

	/*
	 * 显示视角菜单添加面板
	 */
	function show () {
		var offset = localStorage.getItem('modelEdit.offset');
		if (offset) {
			$panel.css({'top': offset.top, 'left': offset.left});
		}

		$panel.fadeIn(350);
	}

	/*
	 * 关闭
	 */
	function hide () {
		$$('span.model-name.selected').click();
		$panel.fadeOut(350);
		mapToolsVM && (mapToolsVM.selectedIndex = null);
	}


	/*
	 * 拾取模型
	 */
	function pickModel (event) {
		var model = event.data;
		var ctrlKey = window.event.ctrlKey;
		var altKey = window.event.altKey;
		console.log(model);

		if (ctrlKey || altKey) {
			if (pickModelLen < 16) {
				var name = model.name;
				var liTarget, modelNameTarget, hideTarget;

				if (pickModelMap[name] == undefined) {
					pickModelMap[name] = model;
					pickModelTarget[name] = liTarget = $(liTemp).appendTo($$('div.map-model-list ul'));
					pickModelLen++;

					// 绑定模型选择
					modelNameTarget = liTarget.find('.model-name').html(name).attr('id', name);
					modelNameTarget.on('click', function (event) {
						var key = name;

						if ($(this).hasClass('selected')) {
							$(this).removeClass('selected').attr('title', '点击选择模型');
							hoverModel('');
							setModelName('');
						} else {
							$$('span.model-name.selected').removeClass('selected').attr('title', '点击选择模型');
							$(this).addClass('selected').attr('title', '点击取消选择');
							hoverModel(key);
							setModelName(key);
						}
					}).click();


					// 显示模型
					liTarget.find('a:eq(0)').on('click', function (event) {
						var key = name;
						visibleModel(key, true);
						$(this).attr('disabled','disabled').next().removeAttr('disabled');
					});


					// 隐藏模型
					hideTarget = liTarget.find('a:eq(1)').on('click', function (event) {
						var key = name;
						visibleModel(key, false);
						$(this).attr('disabled','disabled').prev().removeAttr('disabled');

						modelNameTarget = $$('#'+key);
						modelNameTarget.hasClass('selected') && modelNameTarget.click();
					});


					// 从编辑列表删除并显示模型
					liTarget.find('a:eq(2)').on('click', function (event) {
						var key = name;

						removeBorder(key);
						visibleModel(key, true);
						pickModelLen--;

						delete pickModelMap[key];
						delete pickModelTarget[key];

						if (pickModelLen == 0) {
							$$('.map-func-empty').show();
							$$('.map-func-split-y').hide();
						}

						$(this).parents('li').remove();
					});

					$$('.map-func-empty').hide();
					$$('.map-func-split-y').show();
					
					if (altKey) {
						hideTarget.click();
					}
				} else {
					if (altKey) {
						$$('#'+name).parent().find('a:eq(1)').click();
					} else {
						// 已经出现在列表的模型则选中
						modelNameTarget = $$('#'+name);
						modelNameTarget.hasClass('selected') || modelNameTarget.click();
					}
				}
			} else {
				message.alert('目前最多拾取16个模型!');
			}
		}
	}


	/*
	 * 模型选择效果
	 */
	function hoverModel (name) {
		if (curSelectedModel) {
			removeBorder(curSelectedModel);
			curSelectedModel = null;
		}

		selectModel(name, function (object) {
			curSelectedModel = object;
			hzThree.addBorder(object);
		});
	}


	/*
	 * 删除效果
	 */
	function removeBorder (arg0) {
		if (typeof arg0 === 'string') {
			selectModel(arg0, function (object) {
				arg0 = object;
			});
		}
		hzThree.removeBorder(arg0);
	}


	/*
	 * 显隐模型
	 */
	function visibleModel (name, visible) {

		selectModel(name, function (object) {
			object.isCtrBuilding = visible;
			object.visible = visible;
		});
	}


	/*
	 * 选择模型对象
	 */
	function selectModel (name, callback) {
		var model = pickModelMap[name];
		var parent = null;
		if (model) {
			parent = model.parent;

			// 如果是楼层的模型则取父级，并且父级要是组对象
			if (name.indexOf('_T005') > 0 && parent && parent.type == 'Group') {
				callback(parent);
			} else {
				callback(model);
			}
		}
	}


	/*
	 * 设置拾取状态
	 */
	function setPickModelStatus (vm) {
		if (pickStatus) {
			pickStatus = false;
			hzThree.off(hzThree.HzEvent.PICK_UP_MODEL, pickModel);
			hide();
		} else {
			pickStatus = true;
			hzThree.on(hzThree.HzEvent.PICK_UP_MODEL, pickModel);
			show();
		}
		mapToolsVM = vm;
	}



	// 注册事件
	$$('a.map-close').click(function () {
		pickStatus && setPickModelStatus();
	});

	$$('#model-edit-save').click(function () {
		showModelGroupAdd($$('span.model-name.selected').html());
	});

	$$('#model-edit-clear').click(function () {
		if (pickModelTarget) {
			for(var key in pickModelTarget) {
				pickModelTarget[key].find('a:eq(2)').click();
			}
		}
	});

	window.setPickModelStatus = setPickModelStatus;
});