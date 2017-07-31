/**
 * 
 */
define(function(require){
	var mapHandle = require('hz/map/map.handle');

	var id = '1001';
	var position = null;
	var modelObj = null;
	
	function pickUpPoint (data) {
		position = data;
		mc_add();
	}
	
	window.mc_enabled = function () {
//		mapHandle.setHandleStatus(mapHandle.EDITMODEL);
//		mapHandle.hzThree.on(mapHandle.hzThree.HzEvent.PICK_UP_POINT, pickUpPoint);
		mapHandle.modelComponent.enabledEdit(pickUpPoint)
	}

	window.mc_disabled = function () {
//		mapHandle.setHandleNormal();
//		mapHandle.hzThree.off(mapHandle.hzThree.HzEvent.PICK_UP_POINT, pickUpPoint);
		mapHandle.modelComponent.disabledEdit();
	}

	window.mc_add = function () {
		mc_remove();
		mapHandle.addComponent({
			'id': id,
			'modelClass': 99,
			'modelType': 0,
			'editHelper': true,
			'position': position
		}, function (obj) {
			modelObj = obj;
		});
	}

	window.mc_remove = function () {
		if (modelObj) {
			mapHandle.removeModelByName(modelObj.name);
			modelObj = null;
		}
	}
});