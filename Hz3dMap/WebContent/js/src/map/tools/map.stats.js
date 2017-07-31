/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');

	var Stats = function () {
		var _isAnimate = false;
		var fpsPanel = null;
		var memPanel = null;

		/*
		 * 显示
		 */
		function showPanel( id , visible) {

			if (self.performance && self.performance.memory ) {
				memPanel || (memPanel = new Stats.Panel( '内存', ' MB' ));
				memPanel.toggle(visible);
			}

			fpsPanel || (fpsPanel = new Stats.Panel( 'FPS', ''));
			fpsPanel.toggle(visible);

			_isAnimate = visible;
			_animate();
		}


		var beginTime = ( performance || Date ).now(), 
			prevTime = beginTime, 
			frames = 0, 
			memory,
			time;

		/*
		 * 更新状态值
		 */
		function update () {
			time = ( performance || Date ).now();
			frames ++;

			if (time > prevTime + 1000) {
				fpsPanel.update((frames * 1000) / (time - prevTime), 100);
				prevTime = time;
				frames = 0;

				if (memPanel) {
					memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );
				}
			}

			return time;
		}


		/*
		 * 动画处理
		 */
	    function _animate () {
	    	if (_isAnimate) {
	    		update();
		        requestAnimationFrame(_animate);
	    	}
	    }

		return {
			showPanel: showPanel,
			update: function () {
				beginTime = update();
			}
		};
	};


	Stats.Panel = function ( name, dw) {
		var round = Math.round,
			min = Infinity, 
			max = 0;
		var jqDom = null;
		var jqNum = null;

		hzEvent.load('map.headtitle', function (headTitle) {
			jqDom = headTitle.add({'id': name, 'html': name + '：<span style="color:#FFE200"></span>' + dw});
			jqNum = jqDom && jqDom.find('>span');
		});

		return {
			dom: jqDom,
			toggle: function (visible) {
				jqDom && jqDom.toggle(visible);
			},
			update: function ( value, maxValue ) {
				min = Math.min( min, value );
				max = Math.max( max, value );
				jqNum && jqNum.html(round( value ));
			}
		};
	};

	return Stats;
});