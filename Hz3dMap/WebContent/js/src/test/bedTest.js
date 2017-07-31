/**
 * 
 */
define(function(require){
	var mapHandle = require('hz/map/map.handle');
	var isEnabled = false;
	var curBedModel = null;


	function pickUpPoint (event) {
		position = event.data;
	}

	function pickUpModel (event) {
		if (event.data && event.data.name.indexOf('_T017') > 0) {
			curBedModel = event.data.parent;
			console.log(curBedModel.name);
			mapHandle.setTransForm(true, curBedModel);
		}
	}


	
	window.bt_enabledAddBed = function () {
		if (!isEnabled) {
			isEnabled = true;

			mapHandle.hzThree.on(mapHandle.hzThree.HzEvent.PICK_UP_POINT, pickUpPoint);
			mapHandle.hzThree.on(mapHandle.hzThree.HzEvent.PICK_UP_MODEL, pickUpModel);
		}
	};


	window.bt_disabledAddBed = function () {
		if (isEnabled) {
			isEnabled = false;
			mapHandle.hzThree.off(mapHandle.hzThree.HzEvent.PICK_UP_POINT, pickUpPoint);
			mapHandle.hzThree.off(mapHandle.hzThree.HzEvent.PICK_UP_MODEL, pickUpModel);
			mapHandle.setTransForm(false);
//			bt_removeBed();
		}
	};


	window.bt_updateBed = function () {
		if (isEnabled) {
			mapHandle.addModel({
				'modelName': (new Date()).getTime(),
				'path': basePath + 'models/bed/',
				'objName': 'bed_T01701.obj',
				'mtlName': 'bed_T01701.mtl',
				'bornType': 'born_addModel',
				'objType': 'bed_model',
				'position': position
			}, function (obj) {
				curBedModel = obj;
				mapHandle.setTransForm(true, obj);
			});
		}
	}


	window.bt_removeBed = function () {
		if (curBedModel) {
			mapHandle.removeModelByName(curBedModel.name);
			mapHandle.setTransForm(false);
			curBedModel = null;
		}
	}

	window.bt_printBed = function () {
		if (curBedModel) {
			console.log('bed.position = ' + JSON.stringify(curBedModel.position));
			console.log('bed.rotation = ' + JSON.stringify(curBedModel.rotation));
		}
	}
});