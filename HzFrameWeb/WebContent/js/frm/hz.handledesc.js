/**
 * 操作说明显示的对象
 */
define(function(require) {
	// 外部JS引用
	var $ = require("jquery");
	var hzEvent = require('frm/hz.event');
	var hzDrag = require('frm/hz.drag');

	var liHTML = '<li><span class="desc-num"></span><span class="keynote"></span>：<span class="desc-txt"></span></li>';

	/*
	 * 操作说明对象(handle instructions)
	 */
	function HandleDesc () {
		$(window.top.document.head).append('<link rel="stylesheet" href="css/frm/hz.handledesc.css" charset="utf-8">');
		$(window.top.document.body).append(
				'<div class="hz-handle-desc" style="display:none;" oncontextmenu="return false;">'+
					'<a class="hhd-close" title="点击关闭"></a>'+
					'<div class="hhd-title">《 操作说明 》</div>'+
					'<div class="hhd-body"><ul></ul><div>'+
				'</div>'
		);

		var jqDesc = hzDrag.on('div.hz-handle-desc');
		$('a.hhd-close').on('click', function () {
			jqDesc.fadeOut(500);
		});

		hzEvent.load('hz.rightnav', function (rightNav) {
			var jqNav = rightNav.add('MAP.HANDLE.INSTRUCTION.NAV', '操作说明', 'map-instruction-icon');
			if (jqNav) {
				jqNav.on('mouseup', function () {
					jqDesc.fadeIn(500);
					event.stopPropagation();
				});
			}
		});
	}


	/*
	 * 添加菜单图标
	 */
	HandleDesc.prototype.add = function (id, title, text) {
		var jqLi = $(liHTML).appendTo('.hz-handle-desc ul').attr('desc-id', id);

		jqLi.find('>span.keynote').html(title);
		jqLi.find('>span.desc-txt').html(text);

		resetNum();
		offset();

		return jqLi;
	}


	/*
	 * 删除菜单图标
	 */
	HandleDesc.prototype.remove = function (id) {
		var jqLi = $('.hz-handle-desc ul >li[desc-id=' + id + ']').remove();

		resetNum();
		offset();

		return jqLi;
	}


	/*
	 * 重置数值
	 */
	function resetNum () {
		$('.hz-handle-desc ul >li').each(function (i) {
			$(this).find('>span.desc-num').html((i + 1) + '. ');
		});
	}


	function offset () {
		var jqDesc = $('.hz-handle-desc');
		jqDesc.css({
			'margin-left': -jqDesc.width() / 2,
			'margin-top': -jqDesc.height() / 2
		});
	}


	// 针对类似frame框架的模型化处理
	try {
		var hz = window.top.hz;
		var hd = null;

		if (hz) {
			if (hz.handleDesc) {
				console.log('引用顶层父级HandleDesc对象...');
				return hz.handleDesc;
			}
		} else {
			hz = window.top.hz = {};
		}

		hzEvent.init('hz.handledesc', hz.handleDesc = new HandleDesc());
		console.log('初始化HandleDesc对象...');
		return hz.handleDesc;
	} catch (e) {
		console.log('初始化HandleDesc对象失败...', e);
	}
});