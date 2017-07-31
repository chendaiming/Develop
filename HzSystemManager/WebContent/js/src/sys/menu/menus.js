define(function(require){
	var loginUser = require('frm/loginUser');
	var message = require('frm/message');
	var hzEvent = require('frm/hz.event');
	var hzTree = require('frm/hz.tree');
	var db = require('frm/hz.db');
	var	vue = require('vue');

	var menuVue = null;

	/*
	 * 初始化VUE对象，在VUE初始化完成myFuncMenus的DOM数据之后再显示
	 */
	function initVueDom (selector) {
		// 在VUE初始化完成myFuncMenus的DOM数据之后再显示
		vue.nextTick(function () {
			$(selector).show();
			$('div.my-menus').on('mousedown', function () {
				event.stopPropagation();
			});
		});

		// 初始化DOM
		menuVue = new vue({
			el: selector,
			data: {
				showPanel: false,
				tileMenu: false,	// 平铺菜单
				historyMenus: [],	// 历史菜单（最近使用的菜单，最多10个左右）
				rootMenus: [],		// 根菜单集合
				rootMenu: null,		// 当前选择的根菜单
				timeId: null
			},
			methods: {				
				toggleMenuPanel: function () {
					this.showPanel = !this.showPanel;
				},

				toggleTile: function () {
					this.tileMenu = !this.tileMenu;
				},

				showTwoMenus: function (rootMenu) {
					this.rootMenu = rootMenu;
					this.$nextTick(function () {
						menuVue.expandMenu(rootMenu.children[0]);
						menuVue.openMenu(rootMenu, true);
					});
				},

				openTwoMenu: function (menu) {
					this.expandMenu(menu);
					this.openMenu(menu, true);
				},

				expandMenu: function (menu) {
					if (menu && !menuVue.tileMenu) {
						var prevDom = $('.menu-area.expand');
						var nextDom = $('#' + menu.id);

						// 显示/隐藏当前菜单
						if (nextDom.hasClass('expand')) {
							nextDom.removeClass('expand');
							nextDom.find('.three-menu').css('height', '0');
						} else {
							prevDom.removeClass('expand');
							prevDom.find('.three-menu').css('height', '0');	
							nextDom.addClass('expand');
							nextDom.find('div.three-menu').css('height', nextDom.find('ul.three-menu-ul').height());
						}
					}
				},

				openMenu: function (data, visible) {
					if (data && data.attributes.url) {
						// 重新登录之后会清空，没有做持久化处理（这可能需要记录在数据库或者记录到本地localStroge）
						// 超过12个历史菜单则删除最后一个
						if (menuVue.historyMenus.length > 12) {
							menuVue.historyMenus.pop();
						}

						// 最近使用的放在历史菜单的第一个
						if (menuVue.historyMenus.indexOf(data) < 0) {
							menuVue.historyMenus.unshift(data);
						}

						hzEvent.emit('hz.menu.open', data);
						menuVue.showPanel = visible;
					}
				},

				/*
				 * 退出系统
				 */
				logoutSys: function () {
					message.confirm('确定退出系统?', function (r) {
						if (r) {
							db.ajax('sys/logout', {'userName': loginUser.userName}, 
								function (result) {
									window.top.location.href= 'login.html'
								},
								function (status, error) {
									message.alert('登出系统异常：' + status);
									console.error(status, error);
								}
							);
						}
					});
				},

				loadMenus: loadMenus
			},
		});
	}


	/*
	 * 加载功能菜单
	 */
	function loadMenus (callback) {
		var cusNumber = loginUser.cusNumber;
		var userId = loginUser.userId;
		var whereId = null;
		var params = null;
		var icon = null;

		if (cusNumber) {
			params = [cusNumber, userId];
			whereId = '0';
		}

		db.query({
			'request': {
				sqlId: 'query_user_role_menus',
				whereId: whereId,
				orderId: '0',
				params: params
			},
			'success': function (list) {
				hzTree.toTree(list, {
					formatter: function (node) {
						if (icon = node.attributes.icon) {
							node.attributes.icon = 'data:image/png;base64,' + icon;
						}
					},
					success: function (treeNodes, nodeMap) {
						var menuData = addMenuData('-1', '-1001', '近期使用记录', './css/images/menus/history_0.png', 1);
						var childMenuData = addMenuData('-1001', '-100101', '近期使用的菜单', './css/images/menus/history_1.png', 2);

						// 添加最近使用菜单
						menuData.children.push(childMenuData);
						treeNodes.push(menuData);

						menuVue.historyMenus = childMenuData.children;
						menuVue.rootMenus = treeNodes;
						menuVue.rootMenu = treeNodes[0];
						callback && callback(treeNodes);
					}
				});
			},
			'error': function (code, msg) {
				console.error('加载用户菜单数据失败：', code, msg);
			}
		});
	}


	/*
	 * 添加菜单数据
	 */
	function addMenuData (pid, id, name, icon, level) {
		return {
			'pid': pid,
			'id': id,
			'name': name,
			'level': level,
			'isRoot': level < 2,
			'attributes': {
				'type': '0',
				'url': '',
				'icon': icon,
				'width': '',
				'height': '',
				'seq': '',
				'permission': ''
			},
			'children': [],
		};
	}





	try {

		hzEvent.bind(window, 'mousedown', function () {
			menuVue && (menuVue.showPanel = false);
		});

		console.log('初始化系统菜单模块成功...');

		/*
		 * 返回对象并暴露一个方法
		 */
		return {
			/*
			 * 初始化菜单
			 * @param selector 用于显示菜单模块的容器
			 * @param callback 初始化菜单之后的回调，接受一个参数menus
			 */
			'initMenu': function (selector, callback) {
				$(selector).hide();
				$(selector).load('page/sys/menu/menus.html', function (responseText, textStatus, XMLHttpRequest) {
					$(this).html(XMLHttpRequest.responseText);
					initVueDom(selector);
					loadMenus(callback);
				});
			},
			'getMenus': function () {
				return menuVue.rootMenus || [];
			}
		}
	} catch (e) {
		console.error('初始化系统菜单模块异常：', e);
	}


});