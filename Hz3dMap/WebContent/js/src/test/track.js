/**
 * 
 */

define(function(require){
	var mapHandle = require('hz/map/map.handle');
	var list, modelObj;

	function getTrack () {
		return mapHandle.hzThree.Track;
	}

	// 监听结束事件
//	getTrack().on(mapHandle.hzThree.HzEvent.TRACK_OVER, function () {
//		console.log('TRACK_OVER...');
//	});


	window.t_openEdit = function () {
		getTrack().defalutY = 5;
		getTrack().cameraDis = 3000;
		getTrack().cameraHeight = 3000;
		getTrack().setIsEditRoute(true);

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
			obj.scale.x = 20;
			obj.scale.y = 20;
			obj.scale.z = 20; 
			obj.children[0].rotation.y = Math.PI * 0.5;
			modelObj = obj;
			console.log(obj);
		});
	}

	window.t_closeEdit = function () {
		getTrack().setIsEditRoute(false);
	}

	window.t_getRoute = function () {
		list = getTrack().getRouteList();
		console.log('t_getRoute=', list);
	}

	window.t_setTrackPath = function () {
		getTrack().setTrackParam({
			viewType: 1,
			model: modelObj
		});
		getTrack().setTrackPath(list, 0);
	}

	window.t_trackToggle = function () {
		getTrack().trackToggle();
	}

	window.t_stopTrack = function () {
		getTrack().stopTrack();
	}
	
	window.t_trackMove = function () {
		mapHandle.trackMove([{'aName': '起点A', 'bName': '终点B'}, {'aName': '起点C', 'bName': '终点D'}]);
	}
	window.t_trackMove1 = function () {
		mapHandle.trackMove([{'aDvcType': 15, 'aDvcId': 66, 'bDvcType': 15, 'bDvcId': 67}, {'aName': '起点C', 'bName': '终点D'}]);
	}
});