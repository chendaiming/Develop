/**
 * 
 */

define(function(require){
	var mapHandle = require('hz/map/map.handle');
	var list = null;

	function powerGrid () {
		return mapHandle.hzThree.PowerGrid;
	}
	
	window.pg_openEdit = function () {
		powerGrid().setIsEditRoute(true);
		powerGrid().setPowerGridParam({
			lineColor: 0x00FF00,
			lineWidth: 5,
			electronColor: 0x0000FF
		});
		
		mapHandle.locationDvc(2, 46);
	}

	window.pg_closeEdit = function () {
		powerGrid().setIsEditRoute(false);
		mapHandle.locationDvc(1, 7);
	}

	window.pg_getRoute = function () {
		list = powerGrid().getRouteList();
		//[{x:0, y:0, z:0}, ...]
		console.log('pg_getRoute=', list);
	}

	window.pg_showPowerGrid = function () {
		powerGrid().showPowerGrid({
			pathName: 'test_powergrid',
			pathData: list
		});
	}

	window.pg_removePowerGrid = function () {
		powerGrid().clearPowerGrid('test_powergrid');
	}
});