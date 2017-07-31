/**
 * 
 */
define(function(require){
	var mapHandle = require('hz/map/map.handle'),
		MapPrisoner = require('hz/map/mapPoint/map.prisoner');

	var infoPanel = null;
	var position = {x:0, y:0, z:0};
	var mapPrisoner = new MapPrisoner();

	window.ipt_enabled = function () {
		mapPrisoner.enabledEdit(function (data) {
			position = data;
			ipt_add();
		});
	}

	window.ipt_disabled = function () {
		mapPrisoner.disabledEdit();
	}
	
	// 添加面板
	window.ipt_add = function () {
		var image = basePath + 'css/image/zfpic.png';
		if (infoPanel == null) {

			mapPrisoner.add({
				'id': '20161218',
				'code': '20161218',
				'name': '测试数据',
				'image': image,
				'position': position
			}, function (panelObj) {
				infoPanel = panelObj;
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
			});

		} else {
			infoPanel.position.x = position.x;
			infoPanel.position.y = position.y;
			infoPanel.position.z = position.z;
		}
	}

	window.ipt_del = function () {
		if (infoPanel) {
			mapPrisoner.removeByObj(infoPanel);
			infoPanel = null;
		}
	}

	window.ipt_print = function () {
		if (infoPanel) {
			console.log('infoPanel.position --> ' + JSON.stringify(infoPanel.position));
		}
	}
});