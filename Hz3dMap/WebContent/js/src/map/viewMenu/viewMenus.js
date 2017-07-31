define(function(require){
	var loginUser = require('frm/loginUser');
	var hzEvent = require('frm/hz.event');
	var hzTree = require('frm/hz.tree');
	var hzDrag = require('frm/hz.drag');
	var db = require('frm/hz.db');
	var	vue = require('vue');

	var menuVue = null;

	var menuExpand = false;
	
	/*
	 * 初始化VUE对象，在VUE初始化完成myFuncMenus的DOM数据之后再显示
	 */
	function initVueDom (selector) {
		// 在VUE初始化完成myFuncMenus的DOM数据之后再显示
		vue.nextTick(function () {
			$(selector).show();

			$('div.view-menu').on({
				'click': function () {
					menuExpand = true;
					$(this).addClass('expand');
					$(this).find('.vm-wave').addClass('hover');
					$(this).find('.vm-body').one('transitionend', function () {
						menuExpand && $(this).addClass('expand');
					});
				},
				'mouseleave': function () {
					if (!menuExpand) {
						$(this).removeClass('hover');
					}
				},
				'mousedown': function () {
					window.event.stopPropagation();
				}
			});

			$('div.view-menu .vm-wave').one('transitionend', function () {
				$(this).removeClass('hover');
			});

			hzDrag.on('div.view-menu');
		});

		// 初始化DOM
		menuVue = new vue({
			el: selector,
			data: {
				rootMenus: [],		// 根菜单集合
				rootMenu: null,		// 当前选择的根菜单
				timeId: null
			},
			methods: {				
				clickMenu: function (data, visible) {
					window.event.stopPropagation();
					hzEvent.emit('hz.viewmenu.click', data);
				},
				loadMenus: loadMenus
			},
		});
	}


	/*
	 * 加载功能菜单
	 */
	function loadMenus () {
		var cusNumber = loginUser.cusNumber;
//    	var whereId = 0;
//    	var params = [];
    	var whereId = 4;
		var params = [cusNumber, loginUser.deptId, loginUser.dataAuth, cusNumber];
//		if (loginUser.dataAuth == 0) {
//			whereId = 3;
//			params = [cusNumber, cusNumber, loginUser.deptId];
//		} else if (loginUser.dataAuth == 1) {
//			whereId = 1;
//			params = [cusNumber];
//		} else {
//
//		}

    	db.query({
    		'request':{
    			sqlId: 'select_view_menu_for_map_handle',
    			whereId: whereId,
    			orderId: 1,
    			params:params
    		},
    		'success': function(list){
    			hzTree.toTree(list, {
					success: function (treeNodes, nodeMap) {
						menuVue.rootMenus = treeNodes;
						menuVue.rootMenu = treeNodes[0];
						menuVue.$nextTick(function () {
							$('div.vm-root >ul.vm-ul').on('mousewheel', function () {
								window.event.stopPropagation();
								wheelMenu($(this), 0);
							});

							$('div.vm-root ul.vm-ul.child').on('mousewheel', function () {
								window.event.stopPropagation();
								wheelMenu($(this), 1);
							});
						});
					}
				});
    		},
    		'error': function (code, msg) {
				console.error('加载用户菜单数据失败：', code, msg);
			}
    	});
	}


	function wheelMenu (jqDom, flag) {
		var height = jqDom.height();
		var offset = jqDom.offset();
		var top = jqDom.css('top').replace('px', '') * 1;
		var winH = window.innerHeight;

		if (offset.top + height > winH || top < 0) {
			var deltaY = window.event.deltaY;
			var moveY = jqDom.parent().outerHeight() * flag;

			height -= moveY;
			top -= deltaY;

			jqDom.css('top', (top < -height) ? -height : (top > 0 ? 0 : top));
		}
	}



	try {

		hzEvent.bind(window, 'mousedown', function () {
			menuExpand = false;
			$('div.view-menu').removeClass('expand hover');
			$('div.view-menu .vm-body').removeClass('expand');
		});
		console.log('初始化地图视角菜单模块成功...');

		/*
		 * 返回对象并暴露一个方法
		 */
		return {
			initMenu: function (selector) {
				$(selector).hide();
				$(selector).load('page/map/viewMenu/viewMenus.html', function (responseText, textStatus, XMLHttpRequest) {
					$(this).html(XMLHttpRequest.responseText);
					initVueDom(selector);
					loadMenus();
				});
			}
		}
	} catch (e) {
		console.error('初始化系统菜单模块异常：', e);
	}
});