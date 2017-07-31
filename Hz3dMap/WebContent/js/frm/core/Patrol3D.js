/**
 * 3d巡视类
 */

define(['frm/events/EventConsts', 'THREE', 'frm/core/expand', 'frm/component/Uav'], function (EventConsts, THREE, Expand, Uav) {

    var HzEvent = EventConsts.HzEvent;
    var Events = EventConsts.Events;
    var Pvo = function () {
        this.walkTime = 0; //运动时间
        this.startPos = null; //开启坐标
        this.endPos = null; //结束坐标
        this.rad = 0;
        this.dis = 0;
    };
    Pvo.prototype.constructor = Pvo;

    var Patrol3D = function (camera, scene) {
        THREE.Object3D.call(this);
        this.objectNameMap = EventConsts.objectNameMap;
        this.hzThree = EventConsts.hzThree;
        var scope = this;
        this.camera = camera; //当前摄像机
        this.scene = scene;
        this.walkSpeed = 30; //每秒移动速度
        this.pathData = [];
        this.pVoArray = []; //时间总数据
        this.stepNum = 0; //阶段数
        this.defalutY = 170; //默认高度
        this.positionTween = null;
        this.rotationTween = null;
        this.lastData = null;
        this.lastRotation = null; // new THREE.Vector3();
        this.lastPosition = null;
        this.lastModelRotation = null;
        this.lastModelPosition = null;
        this.lastCameraRotation = null;
        this.lastTarget = null;
        this.curNode = null;
        this.line = null;
        this.searchRadius = 300; //搜索半径
        this.searchGap = 200; //搜索距离间距
        this.searchType = []; //这里为寻找的类型 为数组可能寻找的不止一种类型的东西
        this.searchResult = [];
        this.nodeList = undefined; //从maproute中拿到的节点数组
        this.needCheckListOrigin = [];
        this.needCheckList = []; //需要被查找物体的数组
        this.needSearchDataOrigin = []; //传入搜索的点数据 {id: '', name: '', position: {x: 0, y: 0, z: 0}}
        this.needSearchData = []; //传入搜索的点数据 {id: '', name: '', position: {x: 0, y: 0, z: 0}}
        this.diyAddPoint = []; //手动添加的点 这里在搜索排序的时候需要单独设置
        this.diyAddPointOrigin = [];
        this.sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), this.searchRadius); //搜索使用的半径
        this.line3List = []; // 实际线段数组
        this.searchPointList = []; //查找路径点数组
        this.ballList = [];
        this.showViewBall = false; //是否展示视野球

        this.lastNode = null;

        this.walker = null; //行走的人物模型
        this.walkerDistance = 500; //离行走人物的距离
        this.modelOffsetRotY = 180; //默认180度因为现在的模型都是正面
        this.modelPlaySpeed = 1;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.cameraLock = false;
        this.deflectionRotation = function (rad, x, y) {
            var x1 = Math.sin(rad) * scope.walkerDistance + x;
            var y1 = Math.cos(rad) * scope.walkerDistance + y;
            return new THREE.Vector2(x1, y1);
        };
        this.lastPos = null;
        this.isRotationing = false;
        this.isShowLine = false;
        this.showLineArray = [];
        this.showlineMap = {};
        this.helpLine = [];
        this.status = 0;	// 状态：0未运行、1运行中、2暂停

        /**
         * 开始行走
         * @return {[type]} [description]
         */
        this.beginWalk = function () {
            if (scope.stepNum < scope.pVoArray.length) {
                if (scope.stepNum === 0) {
                    if (scope.walker !== null) {
                        scope.walker.rotation.y = scope.pVoArray[scope.stepNum].rad;
                    } else {
                        scope.camera.rotation.y = scope.pVoArray[scope.stepNum].rad;
                    }

                }
                if (scope.stepNum > 0) {
                    scope.lastData = scope.pVoArray[scope.stepNum - 1];
                }
                scope.curNode = scope.pVoArray[scope.stepNum];
                scope.startMove(scope.pVoArray[scope.stepNum]);

            } else {

                scope.hzThree.setControlMouseEnable(true);
                scope.hzThree.setControlKeysEnable(true);
                scope.hzThree.Controls.enablePan = true;
                scope.hzThree.Controls.refreshLookAt();
                scope.hzThree.Controls.changeLookAt();
                scope.hzThree.Controls.rightMode = 0;
                if (scope.line !== null) {
                    scope.scene.remove(scope.line);
                    scope.line.dispose();
                    scope.line = null;
                }
                if (scope.helpLine.length > 0) {
                    for (var index = 0; index < scope.helpLine.length; index++) {
                        var line = scope.helpLine[index];
                        scope.scene.remove(line);
                        line.dispose();
                        line = null;
                    }
                    scope.helpLine = [];
                }
                if (scope.walker !== null) {
                    scope.scene.remove(scope.walker);
                    scope.walker = null;
                    scope.mixer = null;
                }
                scope.hzThree.isPatrol3ding = false;
                var e = new Events(HzEvent.PATROL_3D_OVER);
                scope.dispatchEvent(e);

            }
        };
        this.nextStep = function () {
            if (scope.positionTween === null && scope.rotationTween === null) {
                scope.beginWalk();
            }
        };
        this.startMove = function (data) {
        	scope._stop();
            var walkTime = Math.floor(data.dis / this.walkSpeed) * 100;
            var tempPos = data.startPos.clone();
            tempPos.y -= scope.defalutY;
            scope.lastPos = tempPos;

            scope.camera.position.x = data.startPos.x;
            scope.camera.position.y = data.startPos.y;
            scope.camera.position.z = data.startPos.z;
            scope.positionTween = new TWEEN.Tween(data.startPos)
                .to(data.endPos, walkTime)
                .onUpdate(function () {
                    if (scope.walker === null) {
                        scope.camera.position.x = this.x;
                        scope.camera.position.z = this.z;
                        scope.camera.position.y = this.y;


                    } else {
                        scope.walker.position.x = this.x;
                        scope.walker.position.z = this.z;
                        scope.walker.position.y = this.y - scope.defalutY;

                        var v = scope.deflectionRotation(scope.walker.rotation.y, this.x, this.z);

                        scope.camera.position.x = v.x;
                        scope.camera.position.z = v.y;
                        scope.camera.position.y = this.y;
                        scope.camera.lookAt(scope.walker.position);
                        scope.hzThree.Controls.target = scope.walker.position.clone();
                    }

                    //  console.log('位移改变');
                    scope.hzThree.Controls.refreshLookAt();
                    scope.hzThree.Controls.update2dImage();
                    var pos = new THREE.Vector3(this.x, this.y - scope.defalutY, this.z);
                    var dis = pos.clone().distanceToSquared(scope.lastPos);
                    var e = new Events(HzEvent.MOVE_PATROL3D, {
                        pos: pos,
                        dis: dis,

                    });
                    scope.dispatchEvent(e);
                    scope.lastPos = pos.clone();

                })
                .onComplete(
                    function () {
                        scope.positionTween = null;
                        scope.nextStep();
                    }

                ).start();


            if (scope.stepNum > 0) {
                scope.isRotationing = true;
                data.rad = scope.checkAngle(scope.lastData.rad, data.rad);
                scope.rotationTween = new TWEEN.Tween(scope.lastData)
                    .to(data, data.walkTime / 10)
                    .onUpdate(function () {
                        if (scope.walker !== null) {
                            scope.walker.rotation.y = this.rad;
                        } else {
                            scope.camera.rotation.y = this.rad;

                        }

                    })
                    .onComplete(
                        function () {
                            scope.camera.rotation.y = data.rad;
                            scope.rotationTween = null;
                            scope.isRotationing = false;
                            scope.nextStep();

                        }

                    )
                    .start();


            }
            scope.stepNum++;
            scope.status = 1;
        };
        this.checkAngle = function (fromAngle, toAngle) {

            var result = toAngle;
            if (Math.abs(fromAngle - toAngle) > Math.PI) {

                if ((toAngle - fromAngle) > 0) {
                    result = toAngle - Math.PI * 2;
                } else {
                    result = toAngle + Math.PI * 2;
                }
            }
            return result;
        };
        this.resumedCameraRotation = function () {
        	if (scope.status != 2) return;

        	scope._stop();

            var disLen = scope.lastPosition.distanceTo(scope.curNode.endPos);
            var useTime = Math.floor(disLen / this.walkSpeed) * 100;
            scope.cameraLock = true;
            var tempPos = scope.lastPosition.clone();
            tempPos.y -= scope.defalutY;
            scope.lastPos = tempPos;
            scope.positionTween = new TWEEN.Tween(scope.lastPosition)
                .to(scope.curNode.endPos, useTime)
                .onUpdate(function () {
                    if (scope.walker === null) {
                        scope.camera.position.x = this.x;
                        scope.camera.position.z = this.z;
                        scope.camera.position.y = this.y;
                    } else {
                        scope.walker.position.x = this.x;
                        scope.walker.position.z = this.z;
                        scope.walker.position.y = this.y - scope.defalutY;

                        var v = scope.deflectionRotation(scope.walker.rotation.y, this.x, this.z);
                        if (scope.cameraLock === false) {
                            scope.camera.position.x = v.x;
                            scope.camera.position.z = v.y;
                            scope.camera.position.y = this.y;
                            scope.camera.lookAt(scope.walker.position);
                        }

                    }
                    scope.hzThree.Controls.refreshLookAt();
                    scope.hzThree.Controls.update2dImage();
                    var pos = new THREE.Vector3(this.x, this.y - scope.defalutY, this.z);
                    var dis = pos.clone().distanceToSquared(scope.lastPos);
                    var e = new Events(HzEvent.MOVE_PATROL3D, {
                        pos: pos,
                        dis: dis

                    });
                    scope.dispatchEvent(e);
                    scope.lastPos = pos.clone();
                })
                .onComplete(
                    function () {
                        scope.positionTween = null;
                        scope.nextStep();
                    }
                );

            if (scope.camera.rotation.equals(scope.lastCameraRotation) === true && scope.walker !== null) {
                scope.cameraLock = false;
                scope.positionTween.start();
                return;
            }
            scope.isRotationing = true;



            scope.rotationTween = new TWEEN.Tween(
                    scope.camera.rotation.toVector3()
                )
                .to(
                    scope.lastCameraRotation.toVector3(), 100)
                .onUpdate(function () { //这里主要是正常直线行走时的暂停 移动镜头后的判断     

                    scope.camera.rotation.x = this.x;
                    scope.camera.rotation.y = this.y;
                    scope.camera.rotation.z = this.z;
                })
                .onComplete(
                    function () {
                        scope.rotationTween = null;
                        var rot = scope.lastCameraRotation.toVector3();
                        scope.camera.rotation.x = rot.x;
                        scope.camera.rotation.y = rot.y;
                        scope.camera.rotation.z = rot.z;
                        scope.cameraLock = false;
                        scope.lastRotation = null;
                        scope.isRotationing = false;

                        if (scope.camera.position.equals(scope.pVoArray[scope.pVoArray.length - 1].endPos) === true) {

                            scope.hzThree.setControlMouseEnable(true);
                            scope.hzThree.setControlKeysEnable(true);
                            scope.hzThree.Controls.enablePan = true;
                            scope.hzThree.Controls.refreshLookAt();
                            scope.hzThree.Controls.update2dImage();
                            scope.hzThree.Controls.changeLookAt();
                            scope.hzThree.Controls.rightMode = 0;
                            if (scope.line !== null) {
                                scope.scene.remove(scope.line);
                                scope.line.dispose();
                                scope.line = null;
                            }
                            if (scope.helpLine.length > 0) {
                                for (var index = 0; index < scope.helpLine.length; index++) {
                                    var line = scope.helpLine[index];
                                    scope.scene.remove(line);
                                    line.dispose();
                                    line = null;
                                }
                                scope.helpLine = [];
                            }
                            if (scope.walker !== null) {
                                scope.scene.remove(scope.walker);
                                scope.walker = null;
                                scope.mixer = null;
                            }
                            scope.hzThree.isPatrol3ding = false;
                            var e = new Events(HzEvent.PATROL_3D_OVER);
                            scope.dispatchEvent(e);
                        } else {
                            if (scope.positionTween !== null) {
                                scope.positionTween.start();
                            }

                        }
                    }

                ).start();
            scope.status = 1;
        };
        /**
         * 绘制路径
         * @return {[type]} [description]
         */
        this.drawPath = function () {
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                linewidth: 100,
                depthTest: true
            });
            var geometry = new THREE.Geometry();
            for (var index = 0; index < scope.pathData.length; index++) {

                var v = new THREE.Vector3(scope.pathData[index].x, scope.pathData[index].y, scope.pathData[index].z);
                geometry.vertices.push(v);

            }


            scope.line = new THREE.Line(geometry, material);
            scope.scene.add(scope.line);
        };
        /**
         * 根据点检查每个需要检查的对象
         * @return {[type]} [description]
         */
        function checkForPoint(pos, line) {

            if ((pos instanceof THREE.Vector3) === false) { //自定义特殊的点不做任何比较直接加入结果队列
                var data3 = {
                    pos: pos.position.clone(),
                    data: [],
                    searchData: [],
                    mesh: pos
                };
                scope.searchResult.push(data3);
        
                return;

            }
            scope.sphere.set(pos.clone(), scope.searchRadius); //重新设置圆的半径
     //       var findArray = [];
            var searchDataArray = [];
            // for (var index = 0; index < scope.needCheckList.length; index++) {
            //     var cube = scope.needCheckList[index];
            //     var dis = cube.position.distanceTo(scope.sphere.center);
            //     if (dis <= scope.sphere.radius) { //找到一个点
            //         scope.needCheckList.remove(cube); //从待选列表中删除
            //         findArray.add(cube); //加入到搜索结果列表中
            //     }
            // }
            for (var i = 0; i < scope.needSearchData.length; i++) {
                var cube1 = scope.needSearchData[i];
                var cubeVector = new THREE.Vector3(parseFloat(cube1.position.x), parseFloat(cube1.position.y), parseFloat(cube1.position.z));
                cube1.position = cubeVector;
                var dis1 = cubeVector.distanceTo(scope.sphere.center);
                if (dis1 <= scope.sphere.radius) { //找到一个点  符合半径条件的                    

                    searchDataArray.add(cube1); //加入到搜索结果列表中
                }
            }

            // for (var a = 0; a < findArray.length; a++) {
            //     var cube2 = findArray[a];
            //     var cubePos = cube2.position;
            //     var pos1 = line.closestPointToPoint(cubePos, true);
            //     var data1 = {
            //         pos: pos1,
            //         data: [cube2],
            //         searchData: []
            //     };
            //     scope.searchResult.push(data1);
            // }
            for (var b = 0; b < searchDataArray.length; b++) {
                var cubePos1 = searchDataArray[b];
                var t = line.closestPointToPointParameter(cubePos1.position, false);
                if (t >= 0 && t <= 1) {
                    var pos2 = line.closestPointToPoint(cubePos1.position, false);
                    var data2 = {
                        pos: pos2,
                        data: [],
                        searchData: [cubePos1]
                    };
                    scope.needSearchData.remove(cubePos1); //从待选列表中删除
                    scope.searchResult.push(data2);

                }

            }


            // if (findArray.length > 0 || searchDataArray.length > 0) {
            //     var data = {
            //         pos: pos,
            //         data: findArray,
            //         searchData: searchDataArray
            //     };
            //     scope.searchResult.push(data);
            // }



        }
        /**
         * 分析所有线并分析线段间距
         * @return {[type]} [description]
         */
        this.analyseAllLine = function () {


            scope.searchPointList.removeAll(); //删除所有已经查到的点进行
            scope.searchResult.removeAll();
            scope.diyAddPoint.removeAll();
            scope.diyAddPoint = scope.diyAddPointOrigin.slice();       
            for (var index = 0; index < scope.line3List.length; index++) {

                var tempLine = scope.line3List[index];
                var linePointsObj = {};
                linePointsObj.line = tempLine;
                linePointsObj.points = [];

                for (var index1 = 0; index1 < scope.diyAddPoint.length; index1++) {

                    var node = scope.diyAddPoint[index1];
                    var nodepos = node.position.clone();
                    var t = tempLine.closestPointToPointParameter(nodepos, false); //找到线段第一个点 
                    if (t === 0) {
                        linePointsObj.points.push(node); //这是个特殊的点
                        scope.diyAddPoint.remove(node);                      
                        break;

                    }
                }
              
                var dis = tempLine.distance();
                var step = Math.floor(dis / scope.searchGap) - 1;
                if (step <= 0) { //两点距离太短不够搜索距离只加入两个端点查询
                    if (linePointsObj.points.length === 0) {
                        linePointsObj.points.push(tempLine.at(0));
                    }

                    linePointsObj.points.push(tempLine.at(1));
                    scope.searchPointList.push(linePointsObj);
                } else {
                    if (linePointsObj.points.length === 0) {
                        linePointsObj.points.push(tempLine.at(0));
                    }

                    for (var k = 1; k <= step; k++) {
                        linePointsObj.points.push(tempLine.at((1 / step) * k));
                    }
                    linePointsObj.points.push(tempLine.at(1));
                    scope.searchPointList.push(linePointsObj);

                }
            }

            //    scope.searchPointList = scope.searchPointList.uniqueVector3();

            if (scope.showViewBall === true) {
                for (var b = 0; b < scope.ballList.length; b++) {
                    var ball = scope.ballList[b];
                    scope.hzThree.sceneRemove(ball);
                }
                scope.ballList.removeAll();
                for (var n = 0; n < scope.searchPointList.length; n++) {
                    for (var f = 0; f < scope.searchPointList[n].points.length; f++) {
                        var p = scope.searchPointList[n].points[f];
                        var geometry = new THREE.SphereGeometry(scope.searchRadius, 32, 32);
                        var material = new THREE.MeshBasicMaterial({
                            color: 0xffff00
                        });
                        material.opacity = 0.5;
                        material.transparent = true;
                        var sphere = new THREE.Mesh(geometry, material);
                        scope.hzThree.sceneAdd(sphere);
                        sphere.position.x = p.x;
                        sphere.position.y = p.y;
                        sphere.position.z = p.z;
                        scope.ballList.push(sphere);
                    }

                }
            }




            scope.searchResult.removeAll(); //检查结果
            scope.needCheckList.removeAll(); //需要检查的数组

            scope.needCheckList = scope.needCheckListOrigin.slice();
            scope.needSearchData = scope.needSearchDataOrigin.slice();

            
            for (var i = 0; i < scope.searchPointList.length; i++) {                
                for (var i1 = 0, len = scope.searchPointList[i].points.length; i1 < len; i1++) {
                    checkForPoint(scope.searchPointList[i].points[i1], scope.searchPointList[i].line);
                }

            }

            for (var k1 = 0; k1 < scope.line3List.length; k1++) {
                for (var k2 = 0; k2 < scope.needSearchData.length; k2++) {



                    var line = scope.line3List[k1];
                    var cubePos1 = scope.needSearchData[k2];
                    var pos2 = line.closestPointToPoint(cubePos1.position, true);
                    if (pos2.distanceTo(cubePos1.position) <= scope.searchRadius) { //符合半径条件

                        var data2 = {
                            pos: pos2,
                            data: [],
                            searchData: [cubePos1]
                        };

                        scope.needSearchData.remove(cubePos1); //从待选列表中删除
                        scope.searchResult.push(data2);
                    }

                }

            }

            var e = new Events(HzEvent.UPDATE_SEARCH_DATA, scope.getSearchResult());
            scope.dispatchEvent(e);
            if (scope.isShowLine === true) {
                scope.clearHelperLine();
                scope.drawShowLine();
            }

        };
        //绘制线
        this.drawShowLine = function () {

            for (var index = 0; index < scope.searchResult.length; index++) {
                var data = scope.searchResult[index];
                var pos = data.pos;
                var findData = data.searchData;
                if (findData.length === 0) continue;
                var color = 0x000ff;

                if (findData[0].color !== undefined) {
                    color = findData[0].color;

                }

                var material = new THREE.LineBasicMaterial({
                    color: color,
                    linewidth: 100,
                    depthTest: true
                });
                for (var k = 0; k < findData.length; k++) {

                    var geometry = new THREE.Geometry();
                    var v = new THREE.Vector3(findData[k].position.x, findData[k].position.y, findData[k].position.z);
                    var v0 = new THREE.Vector3(pos.x, pos.y, pos.z);

                    geometry.vertices.push(v0);
                    geometry.vertices.push(v);

                    var line = new THREE.Line(geometry, material);
                    scope.scene.add(line);
                    scope.showLineArray.push(line);
                    scope.showlineMap[findData[k].id] = line;

                }
            }

        };
        //对辅助线进行标记修改
        this.changeShowLine = function (data) {
            var obj = data.searchData[0];
            var pos = data.pos;
            if (obj.color !== undefined && obj.color !== null) {
                var line = scope.showlineMap[obj.id];
                if (line === undefined || line === null) {
                    console.warn("没有找到辅助线:", obj.id);
                    return;
                }
                scope.showLineArray.remove(line);
                delete scope.showlineMap[obj.id];
                scope.scene.remove(line); //删除线段
                line.dispose(); //销毁
                line = null;


                var material = new THREE.LineBasicMaterial({
                    color: obj.color,
                    linewidth: 2,
                    depthTest: true
                });

                var geometry = new THREE.Geometry();
                var v = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
                var v0 = new THREE.Vector3(pos.x, pos.y, pos.z);

                geometry.vertices.push(v0);
                geometry.vertices.push(v);

                var newline = new THREE.Line(geometry, material);
                scope.scene.add(newline);
                scope.showLineArray.push(newline);
                scope.showlineMap[obj.id] = newline;

            }

        };
        //清除辅助线
        this.clearHelperLine = function () {
            for (var index = 0; index < scope.showLineArray.length; index++) {
                var line = scope.showLineArray[index];
                scope.scene.remove(line);
                line.dispose();
                line = null;
            }
            scope.showLineArray.removeAll();
            scope.showLineArray = [];
            scope.showlineMap = {};
        };
        this.addRouteHandler = function (e) {
            var addNode = e.data;
            scope.nodeList = scope.hzThree.MapRoute.getNodeList();
            if (scope.nodeList.length > 1) {
                var tempLine = new THREE.Line3(scope.lastNode.position, addNode.position); //两点之间创建一条线段判断
                scope.line3List.push(tempLine);

            }
            scope.lastNode = addNode;
            if (scope.nodeList.length > 1) {
                scope.analyseAllLine();
            }

        };
        this.addRouteOnLineHandler = function (e) {
            var addNode = e.data;

            scope.diyAddPointOrigin.push(addNode);


            scope.nodeList = scope.hzThree.MapRoute.getNodeList();
            scope.line3List.removeAll();

            for (var index = 0; index < scope.nodeList.length - 1; index++) {
                var tempLine = new THREE.Line3(scope.nodeList[index].position, scope.nodeList[index + 1].position); //两点之间创建一条线段判断
                scope.line3List.push(tempLine);

            }
            if (scope.nodeList.length > 1) {
                scope.analyseAllLine();
            }
        };
        this.deleteRouteHandler = function (e) {
            var addNode = e.data;
            scope.diyAddPointOrigin.remove(addNode); //删除自定义的点


            scope.nodeList = scope.hzThree.MapRoute.getNodeList();
            scope.line3List.removeAll();

            for (var index = 0; index < scope.nodeList.length - 1; index++) {
                var tempLine = new THREE.Line3(scope.nodeList[index].position, scope.nodeList[index + 1].position); //两点之间创建一条线段判断
                scope.line3List.push(tempLine);

            }
            if (scope.nodeList.length > 1) {
                scope.analyseAllLine();
            }

        };
        this.changeRouteHandler = function () {



            scope.nodeList = scope.hzThree.MapRoute.getNodeList();
            scope.line3List.removeAll();

            for (var index = 0; index < scope.nodeList.length - 1; index++) {
                var tempLine = new THREE.Line3(scope.nodeList[index].position, scope.nodeList[index + 1].position); //两点之间创建一条线段判断
                scope.line3List.push(tempLine);

            }
            if (scope.nodeList.length > 1) {
                scope.analyseAllLine();
            }
        };


    };
    Patrol3D.prototype = Object.assign(Object.create(THREE.EventDispatcher.prototype), {
        constructor: Patrol3D,
        proxy: this,
        /**
         * 重置摄像头
         * @type {[type]}
         */
        resetCamrer: function () {
            if (this.walker !== null) {
                this.walker.rotation.x = 0;
                this.walker.rotation.y = 0;
                this.walker.rotation.z = 0;
            }
            this.camera.rotation.x = 0;
            this.camera.rotation.y = 0;
            this.camera.rotation.z = 0;
        },
        /**
         * 进入分析阶段
         * @return {Boolean} [description]
         */
        analysisData: function () {
            if (this.pathData.length < 2) {
                console.warn('数据长度不够2个以上 无法形成路径');
                return;
            }
            var preObj = null;
            for (var index = 1; index < this.pathData.length; index++) {
                if (index === 1) {
                    preObj = this.pathData[index - 1];
                }
                var endObj = this.pathData[index];
                var startPos = new THREE.Vector3(parseFloat(preObj.x), this.defalutY + parseFloat(preObj.y), parseFloat(preObj.z));
                var endPos = new THREE.Vector3(parseFloat(endObj.x), this.defalutY + parseFloat(endObj.y), parseFloat(endObj.z));
                //                var startPos = new THREE.Vector3(parseFloat(preObj.x), parseFloat(preObj.y), parseFloat(preObj.z));
                //                var endPos = new THREE.Vector3(parseFloat(endObj.x), parseFloat(endObj.y), parseFloat(endObj.z));
                var disLen = startPos.distanceTo(endPos);
                var useTime = Math.floor(disLen / this.walkSpeed) * 100;
                var rad = Math.atan2(((-endPos.z) - (-startPos.z)), (endPos.x - startPos.x)) - Math.PI / 2;
                var pVo = new Pvo();
                pVo.walkTime = useTime;
                pVo.startPos = startPos;
                pVo.endPos = endPos;
                pVo.rad = rad;
                pVo.dis = disLen;
                this.pVoArray.push(pVo);
                preObj = endObj;
            }
            this.stepNum = 0;
            this.resetCamrer();
            this.beginWalk();

        },
        /**
         * 传入路径数据 并开启行走路径
         * @param {[type]} arr [description]
         */
        setPathData: function (arr) {
            this.hzThree.isPatrol3ding = true;
            this.pathData.removeAll();
            this.pVoArray.removeAll();
            if (arr instanceof Array) {
                this.pathData = arr;
            } else if (arr.constructor == String) {
                this.pathData = JSON.parse(arr);
            }
            this.analysisData();
            this.drawPath();
        },
        //设置新的展示中的辅助线
        setHelpLine: function (arr) {
            if (this.helpLine.length > 0) {
                for (var k = 0; k < this.helpLine.length; k++) {
                    var line = this.helpLine[k];
                    this.scene.remove(line);
                    line.dispose();
                    line = null;
                }
                this.helpLine = [];
            }
            for (var index = 0; index < arr.length; index++) {
                var obj = arr[index];
                var id = obj.id;
                var points = obj.points;
                var color = obj.color;
                var material = new THREE.LineBasicMaterial({
                    color: color,
                    linewidth: 2,
                    depthTest: true
                });

                var geometry = new THREE.Geometry();


                for (var k1 = 0; k1 < points.length; k1++) {
                    var v = new THREE.Vector3(parseFloat(points[k1].x), parseFloat(points[k1].y), parseFloat(points[k1].z));
                    geometry.vertices.push(v);
                }
                var newline = new THREE.Line(geometry, material);
                this.scene.add(newline);
                newline.lineId = id;
                this.helpLine.push(newline);

            }
        },
        /**
         * 如果在运行的过程中 可以暂停动画
         * @return {[type]} [description]
         */
        pause: function () {
        	if (this.status != 1) return;
            if (this.positionTween !== null) {
                //保存暂停后的镜头角度 为了恢复后保持角度
                if (this.walker === null) {
                    this.lastRotation = new THREE.Vector3();
                    this.lastRotation.x = this.camera.rotation.x;
                    this.lastRotation.y = this.camera.rotation.y;
                    this.lastRotation.z = this.camera.rotation.z;

                    this.lastPosition = new THREE.Vector3();
                    this.lastPosition.x = this.camera.position.x;
                    this.lastPosition.y = this.camera.position.y;
                    this.lastPosition.z = this.camera.position.z;


                    var mv = new THREE.Vector3(
                        0,
                        0,
                        0.5);
                    this.raycaster.setFromCamera(mv, this.camera);
                    var ray = this.raycaster.ray;
                    this.lastTarget = ray.at(100);



                    this.lastCameraRotation = new THREE.Euler();
                    if (this.isRotationing === false) {
                        this.lastCameraRotation.x = this.camera.rotation.x;
                        this.lastCameraRotation.y = this.camera.rotation.y;
                        this.lastCameraRotation.z = this.camera.rotation.z;
                    } else {
                        this.lastCameraRotation.x = 0;
                        this.lastCameraRotation.y = this.checkAngle(this.camera.rotation.y, this.curNode.rad);
                        this.lastCameraRotation.z = 0;
                    }

                } else {
                    this.lastRotation = new THREE.Vector3();
                    this.lastRotation.x = this.walker.rotation.x;
                    this.lastRotation.y = this.walker.rotation.y;
                    this.lastRotation.z = this.walker.rotation.z;

                    this.lastPosition = new THREE.Vector3();
                    this.lastPosition.x = this.walker.position.x;
                    this.lastPosition.y = this.walker.position.y + this.defalutY;
                    this.lastPosition.z = this.walker.position.z;

                    this.lastTarget = new THREE.Vector3();
                    this.lastTarget.x = this.walker.position.x;
                    this.lastTarget.y = this.walker.position.y;
                    this.lastTarget.z = this.walker.position.z;

                    this.lastCameraRotation = new THREE.Euler();
                    this.lastCameraRotation.x = this.camera.rotation.x;
                    this.lastCameraRotation.y = this.camera.rotation.y;
                    this.lastCameraRotation.z = this.camera.rotation.z;
                    // this.lastModelRotation = new THREE.Vector3();
                    // this.lastModelRotation.x = this.walker.rotation.x;
                    // this.lastModelRotation.y = this.walker.rotation.y;
                    // this.lastModelRotation.z = this.walker.rotation.z;

                    // this.lastModelPosition = new THREE.Vector3();
                    // this.lastModelPosition.x = this.walker.position.x;
                    // this.lastModelPosition.y = this.walker.position.y;
                    // this.lastModelPosition.z = this.walker.position.z;
                }


            }
            this.hzThree.Controls.target = this.lastTarget.clone(); //重新设置下注册点就好了
            this._stop();
            return true;
        },

        _stop: function () {
            if (this.rotationTween !== null) {
                this.rotationTween.stop();
                this.rotationTween = null;
            }
            if (this.positionTween !== null) {
                this.positionTween.stop();
                this.positionTween = null;
            }
            this.status = 2;
        },

        /**
         * 继续运行动画
         * @return {[type]} [description]
         */
        goPlay: function () {
            this.resumedCameraRotation();
        },


        //=======开放的接口
        setIsEditRoute: function (val, isShowLine) {
            //这里为寻找的类型 为数组可能寻找的不止一种类型的东西
            this.searchResult.removeAll();
            this.needCheckList.removeAll();
            this.needSearchData.removeAll();
            this.line3List.removeAll(); // 实际线段数组
            this.searchPointList.removeAll(); //查找路径点数组
            this.ballList.removeAll();
            this.hzThree._isEditRoute = val;
            this.hzThree.MapRoute.enable(this.hzThree._isEditRoute);

            if (val === true) {
                this.hzThree.MapRoute.addEventListener(HzEvent.ADD_POINT_ROUTE, this.addRouteHandler);
                this.hzThree.MapRoute.addEventListener(HzEvent.CHANGE_POINT_ROUTE, this.changeRouteHandler);
                this.hzThree.MapRoute.addEventListener(HzEvent.ADD_POINT_ROUTE_ONLINE, this.addRouteOnLineHandler);
                this.hzThree.MapRoute.addEventListener(HzEvent.DELETE_POINT_ROUTE, this.deleteRouteHandler);
            } else {
                this.hzThree.MapRoute.removeEventListener(HzEvent.ADD_POINT_ROUTE, this.addRouteHandler);
                this.hzThree.MapRoute.removeEventListener(HzEvent.CHANGE_POINT_ROUTE, this.changeRouteHandler);
                this.hzThree.MapRoute.removeEventListener(HzEvent.ADD_POINT_ROUTE_ONLINE, this.addRouteOnLineHandler);
                this.hzThree.MapRoute.removeEventListener(HzEvent.DELETE_POINT_ROUTE, this.deleteRouteHandler);
                this.searchType.removeAll();

            }
            this.showLine(isShowLine);

        },
        showLine: function (isShowLine) {
            this.isShowLine = isShowLine || false;
            if (this.isShowLine === true) {
                this.drawShowLine();
            } else {
                this.clearHelperLine();
            }

        },

        getRouteList: function () {
            return this.hzThree.MapRoute.getRouteList();
        },

        /**
         * 清除所有点
         * @return {[type]} [description]
         */
        clearRoute: function () {
            this.hzThree.MapRoute.clearAll();
            this.clearHelperLine();
            this.searchResult.removeAll();
            this.needCheckList.removeAll();
            this.needSearchData.removeAll();
            this.line3List.removeAll(); // 实际线段数组
            this.searchPointList.removeAll(); //查找路径点数组
            this.ballList.removeAll();
        },
        /**
         * {searchType:xxxx,searchRadius:100}
         * @param {[type]} value [description]
         */
        setPatrol3DParam: function (value) {
            this.needCheckListOrigin.removeAll(); //删除所有待选列表
            this.needSearchDataOrigin.removeAll();
            this.diyAddPointOrigin.removeAll();
            this.diyAddPoint.removeAll();
            this.needCheckList.removeAll();
            this.needSearchData.removeAll();

            if (value.hasOwnProperty('searchRadius') === true && isNaN(value.searchRadius) === false) {
                this.searchRadius = value.searchRadius;
            }
            if (value.hasOwnProperty('showViewBall') === true) {
                this.showViewBall = value.showViewBall;
            }
            if (value.hasOwnProperty('searchType') === true) {
                this.searchType.removeAll();
                if ((Array == value.searchType.constructor) === true) { //数组
                    this.searchType = this.searchType.concat(value);
                } else if ((typeof value.searchType) === 'string' && value.searchType.constructor == String) { //为单个字符串
                    this.searchType.add(value.searchType);
                }
            }
            if (value.hasOwnProperty('searchGap') === true && !isNaN(value.searchGap)) {
                this.searchGap = value.searchGap; //设置搜索间距
            }
            if (value.searchData !== undefined) { // 获取到点数据
                this.needSearchDataOrigin = value.searchData.slice();
            }

            //初始化循环查找所有待选
            // if (this.searchType.length > 0 && this.needSearchData.length === 0) {
            //     for (var key in this.objectNameMap) {
            //         var obj = this.objectNameMap[key];
            //         for (var index = 0; index < this.searchType.length; index++) {
            //             if (obj.hasOwnProperty('objectType') === true && obj.objectType === this.searchType[index]) { //判断类型名相同加入到待选列表
            //                 this.needCheckListOrigin.add(obj); //待选列表

            //             }
            //         }
            //     }
            // }


        },
        setRoutePath: function (arr) {
            this.setIsEditRoute(true, this.isShowLine); //
            this.hzThree.MapRoute.setData(arr);
            this.nodeList = this.hzThree.MapRoute.getNodeList();
            this.lastNode = this.nodeList[this.nodeList.length - 1];
            this.line3List.removeAll();

            for (var index = 0; index < this.nodeList.length - 1; index++) {
                var tempLine = new THREE.Line3(this.nodeList[index].position, this.nodeList[index + 1].position); //两点之间创建一条线段判断
                this.line3List.push(tempLine);

            }
            if (this.nodeList.length > 1) {
                this.analyseAllLine();
            }

        },
        /**
         * 设置一个类型检查
         * @param {[type]} value [description]
         */
        setSearchRadius: function (value) {
            this.searchRadius = this.searchRadius.concat(value);
        },
        getSearchResult: function () {
            return this.searchResult;
        },

        /**
         * [setPatrol3DPath description]
         * @param {[type]} path [description]
         * @param {[type]} data [description]
         *  data.walkSpeed 移动速度
         *  data.defalutY 默认高度
         *  data.modelDistance 模型离摄像机的距离
         *  data.model 模型 json个格式
         *  data.modelScale 模型比例 设置模型比例
         *  data.modelOffsetRotY 模型初始化的便宜y轴的角度 （注意传入的是角度不是弧度）
         *  data.modelPlaySpeed 动画播放结束的时间
         *  
         * 
         *  data.uav特殊情况单独做了个无人机 true
         * 
         */
        setPatrol3DPath: function (path, data) {
            this.hzThree.isPatrol3ding = true;
            this._stop();

            if (this.line !== null) {
                this.scene.remove(this.line);
                this.line.dispose();
                this.line = null;
            }

            if (this.walker !== null) {
                this.scene.remove(this.walker);
                this.walker = null;
                this.mixer = null;
            }
            if (data !== undefined) {
                if (data.hasOwnProperty('walkSpeed') === true) {
                    this.walkSpeed = data.walkSpeed * 1;
                }
                if (data.hasOwnProperty('defalutY') === true) {
                    this.defalutY = data.defalutY * 1;
                }
                if (data.hasOwnProperty("model") === true) {
                    this.walker = data.model;

                    if (data.hasOwnProperty("modelScale") === true) {
                        var s = data.modelScale;
                        this.walker.scale.set(s, s, s);
                    }


                }


                if (data.hasOwnProperty("modelDistance") === true) {
                    this.walkerDistance = parseFloat(data.modelDistance);
                }
                if (data.hasOwnProperty('modelPlaySpeed') === true) {
                    this.modelPlaySpeed = parseFloat(data.modelPlaySpeed);

                }
                if (this.walker !== null && data.uav === undefined) {
                    this.mixer = new THREE.AnimationMixer(this.walker.geometry);
                    this.mixer.clipAction(this.walker.geometry.animations[0], this.walker)
                        .setDuration(this.modelPlaySpeed) // one second
                        .startAt(0) // random phase (already running)
                        .play(); // let's go
                }
                if (this.walker !== null && data.uav === true) {
                    this.mixer = new Uav(this.walker);
                }
                if (data.hasOwnProperty('modelOffsetRotY') === true) {

                    this.modelOffsetRotY = parseFloat(data.modelOffsetRotY);

                }
                if (this.walker !== null && data.uav === undefined) {
                    var out = new THREE.Object3D();
                    this.walker.position.y = 0;
                    out.add(this.walker);
                    this.walker.rotation.y = THREE.Math.degToRad(parseFloat(this.modelOffsetRotY));
                    this.walker = out;
                    this.scene.add(this.walker);
                    this.walker.position.y = this.defalutY;
                } else if (this.walker !== null && data.uav === true) {
                    this.scene.add(this.walker);
                }

            }



            this.hzThree.setControlMouseEnable(false);
            this.hzThree.setControlKeysEnable(false);
            this.hzThree.Controls.enablePan = false;
            this.stepNum = 0;
            this.hzThree.tweenRunning = true;
            this.setPathData(path.slice());
        },
        patrol3dToggle: function () {
            if (this.hzThree.tweenRunning === true) {
                this.pause();
                this.hzThree.tweenRunning = false;
                this.hzThree.Controls.rightMode = 1;
                this.hzThree.setControlMouseEnable(true);


            } else {
                this.goPlay();
                this.hzThree.tweenRunning = true;
                this.hzThree.Controls.rightMode = 0;
                this.hzThree.setControlMouseEnable(false);
            }

        },
        stopPatrol3d: function () {

            this.searchResult.removeAll();
            this.needCheckListOrigin.removeAll();
            this.needCheckList.removeAll();
            this.needSearchDataOrigin.removeAll();
            this.diyAddPointOrigin.removeAll();
            this.diyAddPoint.removeAll();
            this.needSearchData.removeAll();
            this.line3List.removeAll(); // 实际线段数组

            this.searchPointList.removeAll(); //查找路径点数组
            this.ballList.removeAll();
            this.searchType.removeAll();
            this.stepNum = 0;
            this.hzThree.tweenRunning = true;
            this._stop();

            this.hzThree.setControlMouseEnable(true);
            this.hzThree.setControlKeysEnable(true);
            this.hzThree.Controls.enablePan = true;
            this.hzThree.Controls.refreshLookAt();
            this.hzThree.Controls.changeLookAt();
            this.hzThree.Controls.rightMode = 0;
            if (this.line !== null) {
                this.scene.remove(this.line);
                this.line.dispose();
                this.line = null;
            }
            if (this.walker !== null) {
                this.scene.remove(this.walker);
                this.walker = null;
                this.mixer = null;
            }
            if (this.helpLine.length > 0) {
                for (var index = 0; index < this.helpLine.length; index++) {
                    var line = this.helpLine[index];
                    this.scene.remove(line);
                    line.dispose();
                    line = null;
                }
                this.helpLine = [];
            }
            this.hzThree.isPatrol3ding = false;
            var e = new Events(HzEvent.PATROL_3D_OVER);
            this.dispatchEvent(e);
        },
        update: function () {
            if (this.mixer !== null && this.hzThree.tweenRunning === true) {
                this.mixer.update(this.clock.getDelta());
            }
        }


    });



    return Patrol3D;

});