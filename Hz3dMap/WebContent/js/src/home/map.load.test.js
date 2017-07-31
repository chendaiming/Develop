/**
 * 
 */
define(function (require) {
	var hzEvent = require('frm/hz.event');
	var mapHandle = require('hz/map/map.handle'),
		user = require('frm/loginUser'),
		db = require('frm/hz.db');
	
	var mapPrisoner = null;
	var labelObjs = [];
	var buildingPositions = {};
	var buildingLabels = [];
	var prisonerPositions = {};
	var prisonerCountLabels = [];
	var roomPositions = [];
	var roomView = [];
	try {

		hzEvent.subs('map.handle.onClickRoom', function (modelName, modelObj) {
			var viewPoint = roomView[modelName];
			if (viewPoint) {
				mapHandle.flyTo(viewPoint);
			}

			viewPoint = mapHandle.getViewPoint();
			console.log(modelName + ' --> ' + JSON.stringify(viewPoint));
		});

		hzEvent.subs('hz.room.model.visible', function (modelName, visible) {
			var roomId = modelName.replace('_T016', '');
			var roomName = roomId.split('_').pop() + '';
			var position = roomPositions[roomName];

			if (visible && position) {
				mapHandle.addLabelPoint({
					id: roomId,
					text: roomName,
					className: 'prisoner-count',
					minDis: 0,
					maxDis: 15000,
					position: position
				}, {
					'mouseup': function (event) {
						var viewPoint = roomView[modelName];
						if (viewPoint) {
							mapHandle.flyTo(viewPoint);
						}
					}
				});
			} else {
				mapHandle.hzThree.removeLabelById(roomId);
			}
		});

		// 显示建筑标注
		hzEvent.on('hz.building.label.show', function (list, bind) {
			var node;
			for(var i = 0; i < list.length; i++) {
				node = JSON.parse(JSON.stringify(list[i]));
				node.position = buildingPositions[node.id];
				node.id = 'building_label_' + node.id
				node.className = 'prisoner-count';
				node.image = '';
				node.minDis = 10;
				node.maxDis = 50000;
				buildingLabels.push(node.id);
				addLabel(node, bind);
			}
		});

		hzEvent.on('hz.building.label.hide', function () {
			if (mapHandle) {
				while(buildingLabels.length) {
					mapHandle.hzThree.removeLabelById(buildingLabels.shift());
				}
			}
		});

	} catch (e) {
		console.error(e);
	}

	function addLabel (node, bind) {
		if (mapHandle && mapHandle.handleStatus == mapHandle.NORMAL && node.position) {
			mapHandle.addLabelPoint({
				id: node.id,
				text: node.text,
				image: node.image || (basePath + 'css/images/location.png'),
				className: node.className || '',
				minDis: node.minDis || 0,
				maxDis: node.maxDis || 10000,
				position: node.position
			}, bind, function (labelObj) {
				//labelObjs.push(labelObj);
			});
		}
	}
});