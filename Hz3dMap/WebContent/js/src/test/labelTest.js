/**
 * 
 */
define(function(require){
	var mapHandle = require('hz/map/map.handle');
	var hzEvent = require('frm/hz.event');
	var position, modelObj;
	
	function pickUpPoint (event) {
		position = event.data;
	}

	window.lt_enabled = function () {
		mapHandle.label.enabled(function (point, model) {
			position = point;
			modelObj = model;
			console.log('point --> ', point);
			console.log('model --> ', model);
		});
//		mapHandle.setHandleStatus(mapHandle.EDITMODEL);
//		mapHandle.hzThree.on(mapHandle.hzThree.HzEvent.PICK_UP_POINT, pickUpPoint);
	}

	window.lt_disabled = function () {
		mapHandle.label.disabled();
//		mapHandle.setHandleNormal();
//		mapHandle.hzThree.off(mapHandle.hzThree.HzEvent.PICK_UP_POINT, pickUpPoint);
		position = null;
	}

	window.lt_addLabel = function () {
		if (position) {
			console.log('position = ' + JSON.stringify(position));
			mapHandle.label.add({
				id: '20170112',
				text: '综合监舍',
				image: basePath + 'css/images/point.png',
				className: '',
				minDis: 10,
				maxDis: 100000,
				position: position
			}, {
				click: function (event) {
					console.log(event);
					alert('你点击了我!');
				}
			});
		}
	};

	window.lt_removeLabel = function () {
		mapHandle.label.remove('20170112');
	}

	window.lt_showLabel = function () {
		var array = [];

		array.push({id:20, text:'监舍A1楼'});
		array.push({id:42, text:'综合监舍'});

		hzEvent.call('hz.building.label.show', array, {
			'click': function (event) {
				console.log('lt_showLabel --> 你点击了我!');
			}
		});
	}

	window.lt_hideLabel = function () {
		hzEvent.call('hz.building.label.hide');
	}
});