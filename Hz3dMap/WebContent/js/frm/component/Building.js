/**
 * 建筑物控制
 * @type {[type]}
 */
define(function (require) {
    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');
    var Events = EventConsts.Events;
    var objectNameMap = EventConsts.objectNameMap;
    var camera = null;
    var controls = null;
    var Building = function (buildName) {
        var scope = this;
        this.buildName = buildName;
        this.hzThree = EventConsts.hzThree;
        this.buildSphere = null; //找到的第一个中心店
        camera = EventConsts.camera;
        controls = this.hzThree.Controls;
        this.buildCellMap = {};
        var separateCellDataKey = {};
        this.isSeparate = false; // 分离状态：true已分离、false已合拢
        this.cellNum = 0; // 楼层数
        this.isMoving = false; // 是否处于动画中
        this.stepCell = 0; //


        this.meshArray = [];
        this.simpleBuild = undefined; //简化建筑

        function recordData(cellName, cell, faceforward, sphere, box) {

            if (scope.buildCellMap.hasOwnProperty(cellName) === true) {
                scope.buildCellMap[cellName].side.add(cell);
                if (faceforward === 0) { //内部
                    scope.buildCellMap[cellName].inside = {
                        object: cell,
                        sphere: sphere,
                        box: box
                    };
                } else {
                    scope.buildCellMap[cellName].outside = {
                        object: cell,
                        sphere: sphere,
                        box: box
                    };
                }
            } else {
                var obj = {};
                obj.side = [];
                scope.buildCellMap[cellName] = obj;
                scope.buildCellMap[cellName].side.add(cell);
                if (faceforward === 0) { //内部
                    scope.buildCellMap[cellName].inside = {
                        object: cell,
                        sphere: sphere,
                        box: box
                    };
                } else {
                    scope.buildCellMap[cellName].outside = {
                        object: cell,
                        sphere: sphere,
                        box: box
                    };
                }
            }
            scope.meshArray.add(cell);

        }


        function findBuilding() { //找到建筑物
            for (var key in objectNameMap) {
                if (key.indexOf('_T005') > -1) {
                    if (key.indexOf('_' + scope.buildName + '_') > -1) {
                        var keyNameArray = key.split('_');
                        var cellName = keyNameArray[2];
                        var inoutType = keyNameArray[3];
                        var box3 = new THREE.Box3();
                        if (inoutType == 'in' || inoutType == 'out') {
                            if (inoutType == 'in') {
                                box3.setFromObject(objectNameMap[key]);
                                var box = box3.clone();
                                var sphere = box.getBoundingSphere();

                                if (objectNameMap[key].type == "Group") {
                                    recordData(cellName, objectNameMap[key], 0, sphere, box);
                                } else {
                                    recordData(cellName, objectNameMap[key].parent, 0, sphere, box);
                                }


                            } else {
                                var outside = null;
                                if (objectNameMap[key].type == "Group") {
                                    outside = objectNameMap[key];
                                } else {
                                    outside = objectNameMap[key].parent;
                                }
                                box3.setFromObject(objectNameMap[key]);
                                var box1 = box3.clone();
                                var sphere1 = box1.getBoundingSphere();
                                if (scope.buildSphere === null) {
                                    scope.buildSphere = sphere1;
                                }
                                recordData(cellName, outside, 1, sphere1, box1);
                            }

                        } else {
                            console.warn('楼层命名不正确:' + key);
                            return;
                        }
                    }
                }
            }
            var simpleBuildArray = scope.hzThree.objectMap.S005; //低模楼     

            if (Array.isArray(simpleBuildArray) === false) {
                return;
            }
            for (var index = 0; index < simpleBuildArray.length; index++) {
                var simpleBuild = simpleBuildArray[index];
                var buildName = simpleBuild.name.split('_')[1];
                if (scope.buildName == buildName) {
                    scope.simpleBuild = simpleBuild;
                    scope.simpleBuild.visible = false;
                    break;
                }
            }


        }
        /**
         * 整合最后的数据
         * @return {[type]} [description]
         */
        function mergerData() {
            var buildData = {};
            var sideArray = [];
            buildData.buildName = scope.buildName;
            buildData.simpleBuild = scope.simpleBuild;

            for (var key in scope.buildCellMap) {
                var buildObj = scope.buildCellMap[key];
                var cellData = {};
                if (buildObj.inside !== undefined) {
                    var insideObj = {};
                    cellData.inside = insideObj;
                    cellData.inside.object = buildObj.inside.object;
                    cellData.inside.center = buildObj.inside.sphere.center.clone();
                    cellData.inside.distance = buildObj.inside.sphere.radius;
                    cellData.inside.isInSide = false;
                    cellData.inside.box = buildObj.inside.box;
                    cellData.inside.object.visible = false;
                    Building.buildOutDataArray.push(buildObj.inside.object);

                    //         THREE.Object3D.prototype.activeModelArray.push(buildObj.inside.object);
                    //想在将楼层改为group 如果添加进入检测数组的话 经过测试及其影响效率 所以将其注释
                }
                if (buildObj.outside !== undefined) {
                    var outsideObj = {};
                    cellData.outside = outsideObj;
                    cellData.outside.object = buildObj.outside.object;
                    cellData.outside.center = buildObj.outside.sphere.center.clone();
                    cellData.outside.distance = buildObj.outside.sphere.radius;
                    cellData.outside.box = buildObj.outside.box;
                    Building.buildOutDataArray.push(buildObj.outside.object);
                    //       THREE.Object3D.prototype.activeModelArray.push(buildObj.outside.object);


                }
                sideArray.push(cellData);
            }
            buildData.cellData = sideArray;
            buildData.visible = true; //初始化为显示
            Building.buildDataArray.push(buildData);
        }
        findBuilding();
        mergerData();
        controls.changeLookAt();
        /**
         * 获取楼层数组
         * @return {[type]} [description]
         */
        this.getCellArray = function () {
            var arr = [];
            for (var key in scope.buildCellMap) {
                arr.push(scope.buildCellMap[key].side);
            }
            return arr;
        };
        this.selectCell = function (obj) {
            for (var key in scope.buildCellMap) {
                var cellArray = scope.buildCellMap[key].side;
                for (var index = 0; index < cellArray.length; index++) {
                    var tempGroup = cellArray[index];

                    if (tempGroup.type == 'Group') {
                        for (var i = 0; i < tempGroup.children.length; i++) {
                            var tempMesh = tempGroup.children[i];
                            if (tempMesh === obj) {
                                return cellArray;
                            }
                        }
                    } else if (tempGroup.type == 'Mesh') {
                        if (tempGroup === obj) {

                            return cellArray;
                        }
                    }
                }
            }
            return false;
        };
        this.movingFun = function (cell, disObj, state) {
            var startObj = {
                y: cell.position.y,
                x: cell.position.x,
                z: cell.position.z
            };
            var endObj = disObj;
            //       console.log(endObj);
            new TWEEN.Tween(startObj)
                .to(endObj, 500)
                .onUpdate(function () {
                    cell.position.y = this.y;
                    cell.position.x = this.x;
                    cell.position.z = this.z;

                })
                .onComplete(
                    function () {
                        scope.stepCell++;
                        if (scope.stepCell === (scope.cellNum)) {
                            scope.isMoving = false;
                            var evt = null;
                            if (state === 0) { //0为开启
                                scope.isSeparate = true;
                                evt = new Events(Building.event.SEPARATE_OVER, scope.getCellArray());
                                scope.dispatchEvent(evt);
                            } else //1为关闭
                            {

                                scope.isSeparate = false;
                                evt = new Events(Building.event.CLOSEUP_OVER, scope.getCellArray());
                                scope.dispatchEvent(evt);
                            }
                        }

                    }
                )
                .start();
        };
        this.separateAngle = function (dislong) {
            var buildCenter = scope.buildSphere.center;
            var z1 = buildCenter.z - camera.position.z;
            var x1 = buildCenter.x - camera.position.x;
            var angle = Math.atan2(-z1, x1);
            var x2 = Math.cos(angle) * dislong;
            var z2 = Math.sin(angle) * dislong;
            return {
                x: x2,
                z: -z2
            };
        };
        /**
         * 楼层分离
         * @return {[type]} [description]
         */
        this.separate = function () {
            if (scope.isMoving === true || scope.isSeparate === true) return;

            scope.isMoving = true;
            var cell = 0;
            scope.stepCell = 0;
            scope.cellNum = 0;
            var minHeight = 0;
            for (var key1 in scope.buildCellMap) {
                var box = scope.buildCellMap[key1].outside.box;
                var diffHeight1 = box.max.y - box.min.y;
                if (minHeight === 0 || (minHeight > diffHeight1) && (diffHeight1 > 50)) {
                    minHeight = diffHeight1;
                }

            }
            for (var key in scope.buildCellMap) {
                if (key.indexOf('01') === -1) { //一楼不用管它
                    var cellArray = scope.buildCellMap[key].side;

                    // var box = scope.buildCellMap[key].outside.box;
                    var diffHeight = minHeight; // box.max.y - box.min.y;
                    var radius = diffHeight * 1; //设置移动参数
                    var tempValue = scope.separateAngle(radius);
                    for (var index = 0; index < cellArray.length; index++) {
                        var disY = cellArray[index].position.y + cell * diffHeight + diffHeight;
                        var disX = cellArray[index].position.x + cell * tempValue.x + tempValue.x;
                        var disZ = cellArray[index].position.z + cell * tempValue.z + tempValue.z;
                        var disObj = {
                            x: disX,
                            y: disY,
                            z: disZ
                        };
                        separateCellDataKey[key] = {
                            x: tempValue.x,
                            y: diffHeight,
                            z: tempValue.z
                        };
                        scope.movingFun(cellArray[index], disObj, 0);
                        scope.cellNum++;

                    }
                    cell++;

                }
            }
        };
        this.closeUp = function () {
            if (scope.isMoving === true || scope.isSeparate === false) return;
            var cell = 0;
            scope.isMoving = true;
            scope.stepCell = 0;
            scope.cellNum = 0;
            for (var key in scope.buildCellMap) {
                if (key.indexOf('01') === -1) { //一楼不用管它
                    var cellArray = scope.buildCellMap[key].side;
                    var cellData = separateCellDataKey[key];
                    for (var index = 0; index < cellArray.length; index++) {
                        var disY = cellArray[index].position.y - cell * cellData.y - cellData.y;
                        var disX = cellArray[index].position.x - cell * cellData.x - cellData.x;
                        var disZ = cellArray[index].position.z - cell * cellData.z - cellData.z;
                        var disObj = {
                            x: disX,
                            y: disY,
                            z: disZ
                        };
                        scope.movingFun(cellArray[index], disObj, 1);
                        scope.cellNum++;
                    }
                    cell++;

                }
            }
        };
        this.clickFun = function (e) {
            var a = scope.hzThree.findObject(scope.meshArray, e.data);
            if (a !== undefined) {
                var e1 = new Events(Building.event.BUILD_CLICK, a.object);
                scope.dispatchEvent(e1);
            }
        };
        this.scopeOn = scope.on;
        this.scopeOff = scope.off;
        this.on = function (type, listener) {
            scope.scopeOn(type, listener);
            if (type === Building.event.BUILD_CLICK) {
                // var fun = scope.hzThree.on;
                // fun('click', scope.clickFun);
                scope.hzThree.on('click', scope.clickFun);
            }

        };
        this.off = function (type, listener) {
            scope.scopeOff(type, listener);
            if (type === Building.event.BUILD_CLICK) {
                // var fun = scope.hzThree.off;
                // fun('click', scope.clickFun);
                scope.hzThree.off('click', scope.clickFun);
            }
        };
    };
    Building.event = {
        SEPARATE_OVER: 'separate_over', //展开结束
        CLOSEUP_OVER: 'closeup_over', //合拢结束
        BUILD_CLICK: 'build_click', //点击楼层
    };
    Building.OUT_SID_DIS = 20000; //距离判断
    Building.SHOW_HEIGHT = 15000; //高度判断
    Building.buildDataArray = []; //所有内场景
    Building.buildOutDataArray = []; //所有内外场景

    Building.showInCount = 0;
    /**
     * 通过静态方法的不断更新来判断内外场景的显示隐藏
     * @return {[type]} [description]
     *  楼名                低模楼              楼层信息    里面     楼层对象   中心      检测距离         外面
     *[{buildName:zhjs,simpleBuild:xxxxx,cellData:[{inside:{object:obj,center:xx,distance:xxx,isInSide:false,box:box},outside:{object:obj,center:xx,distance:xxx,isInside:false,box},visible:false}]
     *
     *
     */
    Building.update = function () {
        var buildLen = Building.buildDataArray.length;
        if (buildLen === 0) return;
        var pointBuildingName = controls.pointBuildingName;
        for (var index = 0; index < buildLen; index++) {
            var build = Building.buildDataArray[index];
            if (build.cellData.length === 0) {
                if (build.simpleBuild !== undefined) { //没有建筑物的高模但是有建模 所以就一直显示简模
                    build.visible = false;
                    build.simpleBuild.visible = true;
                }
                continue;
            }
            var firstCell = build.cellData[0];
            if (firstCell.outside === undefined) {
                continue;
            }
            if (camera.position.y > Building.SHOW_HEIGHT) { //特别判断 如果camera 高度大于1000属于鸟瞰图 需要显示所有建筑物
                if (build.simpleBuild === undefined) { //如果没有低模建筑
                    Building.showHideBuild(build.cellData, true);
                    build.visible = true;
                } else {
                    Building.showHideBuild(build.cellData, false);
                    build.visible = false;
                    build.simpleBuild.visible = true; //展示低模建筑

                }
                continue;
            }
            var outsideCenter = firstCell.outside.center;
            var dis = outsideCenter.distanceTo(camera.position); //计算两点距离  可能需要消耗性能
            if (dis > Building.OUT_SID_DIS && build.visible === true) { //具体大于判断距离并且当前显示状态 需要更改状态

                if (build.simpleBuild !== undefined) {
                    Building.showHideBuild(build.cellData, false);
                    build.visible = false;
                    build.simpleBuild.visible = true;



                }
            } else if (dis <= Building.OUT_SID_DIS && build.visible === false) { //具体小于判断距离并且当前隐藏状态 需要更改状态
                if (build.simpleBuild !== undefined) {
                    build.simpleBuild.visible = false;
                }
                Building.showHideBuild(build.cellData, true);
                build.visible = true;
            } else if (dis < Building.OUT_SID_DIS && build.visible === true) { //已经显示外层 并且状态为显示 这个时候需要判断内部是否需要显示
                var l = build.cellData.length;
                for (var key = 0; key < l; key++) {
                    if (build.cellData[key].inside === undefined || build.cellData[key].inside.object.isCtrBuilding === false) {
                        continue;
                    }
                    var incell = build.cellData[key].inside;
                    var inDis = incell.center.distanceTo(camera.position);

                    if (inDis <= incell.distance * 2.5 && build.buildName == pointBuildingName) {
                        incell.object.visible = true;
                    } else {

                        incell.object.visible = false;
                    }


                    if (incell.box.containsPoint(camera.position) === true) {
                        if (incell.isInSide === false) {
                            incell.isInSide = true;
                            Building.showInCount++;
                        }
                         if (EventConsts.logDepthBuffer===false&&camera.near > 1) {
                             camera.near = 1;
                             camera.updateProjectionMatrix();
                        }
                    } else {
                        if (incell.isInSide === true && Building.showInCount > 0) {
                            incell.isInSide = false;
                            Building.showInCount--;
                        }
                    }

                }
            }

        }
    };
    /**
     * 展示隐藏建筑物 隐藏时内部一块隐藏  显示时内部也不显示
     * @param  {[type]} cellDataArray [description]
     * @param  {[type]} visible       [description]
     * @return {[type]}               [description]
     */
    Building.showHideBuild = function (cellDataArray, visible) {
        var l = cellDataArray.length;
        for (var index = 0; index < l; index++) {
            var cell = cellDataArray[index];
            if (cell.inside !== undefined && cell.inside.object.isCtrBuilding === true) {
                cell.inside.object.visible = false;
            }
            if (cell.outside !== undefined && cell.outside.object.isCtrBuilding === true) {
                cell.outside.object.visible = visible;
            }

        }
    };

    Object.assign(Building.prototype, THREE.EventDispatcher.prototype, {


    });
    return Building;
});