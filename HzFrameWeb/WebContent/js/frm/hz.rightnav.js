/**
 * 
 */
define(function (require) {
	// 外部JS引用
	var $ = require("jquery");
	var hzEvent = require('frm/hz.event');

	var navHTML = '<li><a class=""></a><span class="msg-num">0</span></li>';


	/*
	 * 右侧固定图标菜单对象
	 */
	function RightNav () {
		$(window.top.document.head).append('<link rel="stylesheet" href="css/frm/hz.rightnav.css" charset="utf-8">');
		$(window.top.document.body).append('<div id="right-nav" style="display:none;" oncontextmenu="return false;"><ul class="right-nav-list"></ul></div>');

		this.idMap = {};
		this.navs = [];
	}


	/*
	 * 添加菜单图标
	 * @param id	菜单ID
	 * @param name	菜单名称
	 * @param icon	菜单图标样式
	 * @param index	菜单位置
	 */
	RightNav.prototype.add = function (id, name, icon, index) {
		var jqUl, jqLi, hasAdd = false;

		if (this.idMap[id] == undefined) {
			this.idMap[id] = true;

			jqLi = $(navHTML).attr('nav-id', id);
			jqUl = $('.right-nav-list');

			if (typeof index == 'number') {

				// 循环遍历之前插入的节点，找到第一个大于它的节点并在节点前插入
				for(var i = 0; i < this.navs.length; i++) {

					if (this.navs[i].index > index) {
						this.navs[i].jqLi.before(jqLi); 
						hasAdd = true;
						break;
					}
				}
			} else {
				index = 9999;
			}

			// 没有找到大于它的则在最后面添加
			hasAdd || jqUl.append(jqLi);

			jqLi.find('>a').addClass(icon).html(name);

			this.navs.push({'id': id, 'jqLi': jqLi, 'index': index});
		} else {
			console.error('RightNav.add: 菜单ID重复!');
		}
		return jqLi;
	}


	/*
	 * 删除菜单图标
	 */
	RightNav.prototype.remove = function (id, nav) {
		for(var i = 0, nav; i < this.navs.length; i++) {
			if (this.navs[i].id == id) {
				return this.navs.splice(i, 1)[0].jqLi.remove();
			}
		}
	}


	/*
	 * 设置菜单图标显示的数量
	 * @param id
	 * @param num
	 */
	RightNav.prototype.setNum = function (id, num) {
		var jqNum = $('li[nav-id="' + id + '"] >.msg-num');
		var curNum = jqNum.html() * 1;

		if (num == 1 || num == -1) {
			curNum += num;
		} else {
			curNum = num;
		}

		if (curNum > 0) {
			jqNum.html(curNum).show();
		} else {
			jqNum.html(0).hide();
		}
	}



	// 针对类似frame框架的模型化处理
	try {
		var hz = window.top.hz;

		if (hz) {
			if (hz.rightNav) {
				console.log('引用顶层父级RightNav对象...');
				return hz.rightNav;
			}
		} else {
			hz = window.top.hz = {};
		}

		// 创建并注册对象
		hzEvent.init('hz.rightnav', hz.rightNav = new RightNav());
		console.log('初始化RightNav对象...');

		return hz.rightNav;
	} catch (e) {
		console.log('初始化RightNav对象失败...', e);
	}
});