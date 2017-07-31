/**
 * 
 */
define(function(require){
	var mapHandle = require('hz/map/map.handle');
	var hzEvent = require('frm/hz.event');

	var beginPos, endPos, meshName, modelObj, pathPoints;


	function getTrack () {
		return mapHandle.hzThree.Track;
	}

	/*
	 * 点位拾取
	 */
	function _pickUpPoint (event) {

		if (mapHandle.notDragMap()) {
			if (!beginPos) {
				beginPos = event.data;
			} else {
				endPos = event.data;
			}

			if (beginPos && endPos) {

				meshName = $('#txtMeshName').val();
				pathPoints = mapHandle.hzThree.PathFinding.getPathZone(meshName).findPath(beginPos, endPos);
				beginPos = endPos;
				endPos = null;

				if (pathPoints) {
					getTrack().setTrackParam({
						viewType: 0,
						model: modelObj
					});
					getTrack().setTrackPath(pathPoints, 0);
				}
			}
		}
		
	};

	function startTrack () {
		getTrack().walkSpeed = 30;
		getTrack().defalutY = 5;
		getTrack().cameraDis = 2000;
		getTrack().cameraHeight = 2000;

		mapHandle.addModel({
			'modelName': 'people_man',
			'path': basePath + 'models/people/',
			'objName': 'people_man.obj',
			'mtlName': 'people_man.mtl',
			'bornType': 'born_addModel',
			'objType': 'people_man',
			'position': {
				x: 0,
				y: 0,
				z: 0
			}
		}, function (obj) {
			console.log('load.people_man-------------------------');
			obj.scale.x = 10;
			obj.scale.y = 10;
			obj.scale.z = 10; 
			obj.children[0].rotation.y = Math.PI * 0.5;
			modelObj = obj;
			console.log(obj);
		});
	}

	window.pf_showMesh = function () {
		var meshName = $('#txtMeshName').val();
		mapHandle.hzThree.PathFinding.getPathZone(meshName).showMesh(true);
	}

	window.pf_hideMesh = function () {
		var meshName = $('#txtMeshName').val();
		mapHandle.hzThree.PathFinding.getPathZone(meshName).showMesh(false);
	}


	window.pf_start = function () {
		startTrack();
		mapHandle.hzThree.on(mapHandle.hzThree.HzEvent.PICK_UP_POINT, _pickUpPoint);
	}
	
	window.pf_stop = function () {
		mapHandle.hzThree.off(mapHandle.hzThree.HzEvent.PICK_UP_POINT, _pickUpPoint);
	}


	window.pf_testMove = function () {
		var data = [];
		
		data.push({'id':'7', 'type': '15'});
		data.push({'id':'6', 'type': '15'});
		data.push({'id':'15', 'type': '15'});
//		data.push({'id':'', 'type': '15'});
		
		
		mapHandle.Wayfinding.start({
			data: data
		});
	}
});