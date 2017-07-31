/**
 * 
 */
define(function(require){
	var mapHandle = require('hz/map/map.handle');

	
	var infoPanel = null;
	var position = {x:0, y:0, z:0};
	window.ipt_begin = function () {
		mapHandle.hzThree.on(mapHandle.hzThree.HzEvent.PICK_UP_POINT, function (event) {
			position = event.data;
//			console.log(position);
		});
	}

	// 添加面板
	window.ipt_add = function () {
		var image = basePath + 'css/image/zfpic.png';
		if (infoPanel == null) {

			infoPanel = mapHandle.prisonerPanel.add({
				'id': '20161218',
				'code': '20161218',
				'name': '测试数据',
				'image': image,
				'position': position
			});

			infoPanel.on('click', function (event) {
				console.log('click: ', event);
			});
			infoPanel.on('right_click', function (event) {
				console.log('right_click: ', event);
			});
			infoPanel.on('mouse_over', function (event) {
				console.log('mouse_over: ', event);
			});
			infoPanel.on('mouse_out', function (event) {
				console.log('mouse_out: ', event);
			});
			
//			mapHandle.setTransForm(true, infoPanel);
		} else {
			infoPanel.position.x = position.x;
			infoPanel.position.y = position.y;
			infoPanel.position.z = position.z;
		}


//		console.log(infoPanel);
	}

	window.ipt_del = function () {
		if (infoPanel) {
			mapHandle.prisonerPanel.removeByObj(infoPanel);
			infoPanel = null;
		}
	}

	window.ipt_print = function () {
		if (infoPanel) {
			console.log('infoPanel.position --> ' + JSON.stringify(infoPanel.position));
		}
	}
});