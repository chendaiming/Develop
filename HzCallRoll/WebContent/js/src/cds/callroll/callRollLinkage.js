/**
 * 
 */
define(function (require) {
	var mapHandle = require('hz/map/map.handle');
	var message = top.hzMessage || require('frm/message');
	var hzEvent = require('frm/hz.event');
	var vue = require('vue');
	
	var vm = new vue({
		el: '.linkage',
		data: {
			linkAreas: []
		},
		methods: {
			cancelLinkage: function () {
				message.confirm('是否要取消地图联动?', function () {
					hzEvent.call('callRollMain.cancelLinkage');
				});
			},
			linkageMap: function (data) {
				try {
					hzEvent.call('callRollMain.linkageMap', data);
				} catch (e) {
					console.error('点名地图联动异常：', e);
				}
			}
		}
	});

	hzEvent.on('callRollLinkage.loadData', function (data) {
		vm.linkAreas = data;
	});
});