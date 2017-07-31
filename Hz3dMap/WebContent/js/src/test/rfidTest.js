/**
 * 
 */
define(function(require){
	var mapHandle = require('hz/map/map.handle');
	var hzEvent = require('frm/hz.event');
	var list = [];

	var modelObj;

	/*
	 * 随机取一个范围的值
	 */
	function RandomNumBoth (Min,Max) {
	      var Range = Max - Min;
	      var Rand = Math.random();
	      var num = Min + Math.round(Rand * Range); //四舍五入
	      return num;
	}

	function loadPrisoner (position) {
		var range = 110,
			id = 0,
			x = 10, 
			z = 10;

		var xFlag = 1, 
			zFlag = 1;

		var groups = [[],[],[],[]], 
			gindex = 0, 
			group = null;

		while(list.length) {
			mapHandle.label.remove(list.shift());
		}

		function randdomXZ () {
			x = RandomNumBoth(30, range) * xFlag;
			z = RandomNumBoth(30, range) * zFlag;
		}

		function checkXZ (group) {
			if (group) {
				for(var i = 0; i < group.length; i++) {
					if (Math.abs(group[i].x - x) < 25 || Math.abs(group[i].z - z) < 25) {
						randdomXZ();
						checkXZ(group);
					}
				}
			}
		}

		for(var i = 0; i < 9; i++) {
			randdomXZ();
			checkXZ(groups[gindex]);

			groups[gindex++].push({'x':x, 'z':z});

			if (i % 2 == 0) {
				xFlag *= -1;
			} else {
				zFlag *= -1;
			}

			if (i > 0 && (i + 1) % 4 == 0) {
				range -= 10;
				gindex = 0;
			}

			id = (new Date()).getTime() + i;

			list.push(id);
			mapHandle.label.add({
				id: id,
				text: '',
				image: basePath + 'css/images/people-position-1.png',
				className: 'label-point',
				minDis: 10,
				maxDis: 100000,
				position: {
					'x': position.x + x,
					'y': position.y - 300,
					'z': position.z + z
				},
				//lineHeight: 300
			}, {
				click: function (event) {
					console.log(event);
					alert('你点击了我!');
					//mapHandle.
				}
			}, function (obj) {
				
			});
		}

		console.log(group);
	}


	var idFalg = 1;
	var notInit = true;
	
	var labelObjs = [];

	function addLabel (id) {
		mapHandle.label.add({
			id: id,
			text: '',
			image: basePath + 'css/images/people-position-1.png',
			className: 'label-point',
			minDis: 10,
			maxDis: 100000,
			position: {'x': 0, 'y': 0, 'z': 0}
			//lineHeight: 300
		}, null, function (obj) {
			labelObjs.push(obj);
		});
	}

	//addLabel('100000001');
	//addLabel('100000002');
	
	hzEvent.on('test.moving', function () {
		addLabel('100000001');
		addLabel('100000002');

		var moveObj1 = mapHandle.hzThree.createSphere(15, 0x00FFFF, {x:0,y:0,z:0});
		var moveObj2 = mapHandle.hzThree.createSphere(15, 0xFF0000, {x:0,y:0,z:0});
		var index = 0, idFalg = 1;
		var movingManager = mapHandle.hzThree.movingManager;

		if (notInit) {
			notInit = false;
			movingManager.on('moving_3d_update', function (data) {
				var data = data.data, labelObj;
				if (data.targetId == '2017031520261') {
					labelObj = labelObjs[0];
				} else {
					labelObj = labelObjs[1];
				}
				labelObj.position.x = data.pos3.x;
				labelObj.position.y = data.pos3.y;
				labelObj.position.z = data.pos3.z;
				labelObj.updatePos();
			});
		}

		var wayObj = mapHandle.Wayfinding.findWay(36);
		if (wayObj) {

			mapHandle.hzThree.PathFinding.findPathCallBack = function (meshName, points) {
				if (points) {
					var target = moveObj1.clone();
					mapHandle.hzThree.movingManager.createMoving({
				         targetId: '201703152026' + idFalg++,
				         target: index++ ? moveObj1 : moveObj2,
				         data: {'viewId': 36},
				         path: points,
				         showPath: false,
				         speed: 12,
				         lineColor:0x0000ff
					});
				}
			};

			wayObj.findPath(
				{'x':624.3328614783321, 'y':818.0979510694181, 'z':-663.4390477340718}, 
				{'x':-1744.0488531385374, 'y':780.128920161317, 'z':-367.80595653687953}
			);

			wayObj.findPath(
				{'x':-1744.0488531385374, 'y':780.128920161317, 'z':-367.80595653687953},
				{'x':624.3328614783321, 'y':818.0979510694181, 'z':-663.4390477340718}
			);
		}
	});



	hzEvent.subs('modelpoint.onclick', function (event, data) {
		var a = event;
		var b = data;
		// loadPrisoner(data.position);
	});

});