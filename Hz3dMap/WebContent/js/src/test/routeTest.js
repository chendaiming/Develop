/**
 * 
 */

define(function(require){
	var vue = require('vue');
	var mapHandle = require('hz/map/map.handle');

	var vm = new vue({
		el: '.hz-3dmap-test',
		
		methods: {
			rp_openEdit: function () {
				mapHandle.routePatrol.setEditStatus(true);
			},
			rp_closeEdit: function () {
				mapHandle.routePatrol.setEditStatus(false);
			},
			rp_clearEdit: function () {
				mapHandle.routePatrol.setEditStatus(true);
				mapHandle.routePatrol.setEditStatus(false);
			},

			rp_getRoutePath: function () {
				var list = mapHandle.routePatrol.getRoute();
				console.log('rp_getRoutePath', list);
			}
		}
	});
	
	
	window.rp_openEdit = function () {
		mapHandle.routePatrol.enableEdit();
		mapHandle.routePatrol.onSearch(function (array) {
			console.log(array);
		}, 'rp_openEdit');
	
		mapHandle.routePatrol.onAddPoint(function (event) {
			console.log('routeTest --> addPoint:', event);
		}, 'rp_openEdit');
		
		mapHandle.routePatrol.onMovePoint(function (event) {
			console.log('routeTest --> movePoint:', event);
		}, 'rp_openEdit');
		
		mapHandle.routePatrol.onRemovePoint(function (event) {
			console.log('routeTest --> removePoint:', event);
		}, 'rp_openEdit');

		mapHandle.routePatrol.onSelectPoint(function (event) {
			console.log('routeTest --> selectPoint:', event);
		}, 'rp_openEdit');
	};

	window.rp_closeEdit = function () {
		mapHandle.routePatrol.disableEdit();
	};

	window.rp_clearEdit = function () {
		mapHandle.routePatrol.setEditStatus(true);
		mapHandle.routePatrol.setEditStatus(false);
	};

	window.rp_getRoutePath = function () {
		routeList = mapHandle.routePatrol.getRoute();
		console.log('rp_getRoutePath', routeList);
	}
	
	window.rp_playPath = function () {
		routeList && mapHandle.routePatrol.startPatrol(routeList);
		mapHandle.routePatrol.onPatrolMove(function (data) {
			console.log(data);
		}, 'rp_playPath');
	}

	window.rp_pausePath = function () {
		mapHandle.routePatrol.pausePatrol();
	}

	window.rp_stopPath = function () {
		mapHandle.routePatrol.stopPatrol();
	}

});