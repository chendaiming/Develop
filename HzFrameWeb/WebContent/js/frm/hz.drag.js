/**
 * 
 */
define(function(require) {
	var $ = $ || require("jquery");
	var ls = require('frm/localStorage');

	var dragParams = {
		drag: true,
		target: null,
		downL: null,
		downT: null,
		downX: null,
		downY: null
	};
	var thisWidth,thisHeight;
	
	/**
	 * 
	 * @param target 
	 * @param p 拖动的面板参数对象
	 * @returns
	 */
	function onDrag (target,p) {
		return $(target).on({
			'mouseenter': function () {
//				$(this).css('cursor', 'move');
			},
			'mousedown': function (event) {
				if(event.button == 0 && event.target.localName != 'input'){
					var position = $(this).position();
					dragParams.target = $(this);

					thisWidth = $(this).width();
					thisHeight = $(this).height();

					dragParams.downL = position.left;
					dragParams.downT = position.top;
					dragParams.downX = window.event.clientX;
					dragParams.downY = window.event.clientY;

					window.addEventListener('mousemove', dragPanel, false);
				}
			},
			'mouseup': function (event) {
				window.removeEventListener('mousemove', dragPanel, false);
				savePanelParams(p,event);
				$('body').removeClass('push-toleft');
				$('#configs').removeClass('menu-open');
			}
		});
	}

	function savePanelParams(p,event){
		if (p) {
			var moveX = dragParams.downL + window.event.clientX - dragParams.downX;
			var moveY = dragParams.downT + window.event.clientY - dragParams.downY;
			var panels = ls.getItem('ps') || [];
			var bodyHeight = $('body').height(), 
				bodyWidth = $('body').width();

			p.left = moveX + 'px';
			p.top = moveY + 'px';
/*
			if(moveX < 0){
				p.left = '10px';
			}
			if(moveX > (bodyWidth-thisWidth-15)){
				p.left = bodyWidth-thisWidth-15 +'px';
			}
			if(moveY < 0){
				p.top = '10px';
			}
			if(moveY > (bodyHeight-thisHeight-15)){
				p.top = bodyHeight-thisHeight-15 + 'px';
			}
			if(isExsitPanel(panels,p) == -1){
				panels.push(p);			
			}
			*/
			ls.setItem('ps',panels);
		}
	}

	function isExsitPanel(panels,p){
		for(var i=0;i<panels.length;i++){
			if(panels[i].id == p.id){
				panels[i].left = p.left;
				panels[i].top = p.top;
				return true;
			}
		}
		return -1;
	}


	/*
	 * 拖动面板
	 */
	function dragPanel (event) {
		var moveX = dragParams.downL + event.clientX - dragParams.downX;
		var moveY = dragParams.downT + event.clientY - dragParams.downY;
		var target = dragParams.target;

		var marginT = target.css('margin-top');
		var marginL = target.css('margin-left');

		var outW = target.outerWidth();
		var outH = target.outerHeight();
		var winH = $('body').height(), 
			winW = $('body').width(),
			cssMap = {};

		marginT = marginT ? marginT.replace('px', '') * 1 : 0;
		marginL = marginL ? marginL.replace('px', '') * 1 : 0;

		if (moveX > winW / 2) {
			moveX = winW - moveX - outW - (marginL < 0 ? marginL : 0);
			cssMap.right = moveX + 'px';
			cssMap.left = 'auto';
		} else {
			cssMap.right = 'auto';
			cssMap.left = moveX + 'px';
		}

		if (moveY > winH / 2) {
			moveY = winH - moveY - outH - (marginT < 0 ? marginT : 0);
			cssMap.bottom = moveY + 'px';
			cssMap.top = 'auto';
		} else {
			cssMap.bottom = 'auto';
			cssMap.top = moveY + 'px';
		}

		dragParams.cssMap = cssMap;
		dragParams.drag && target.css(cssMap);
	}

	function disabled () {
		dragParams.drag = false;
	}

	function enabled () {
		dragParams.drag = true;
	}

	return {
		on: onDrag,
		enabled: enabled,
		disabled: disabled
		
	};
});