define(['frm/events/EventConsts', 'THREE'], function(EventConsts, THREE) {

    var clone_id = 0;
    var Door = function(object) {
        var hzThree = EventConsts.hzThree;
        var doorMap = EventConsts.doorCache;
        var evtDispatcher = EventConsts.evtDispatcher;
        var HzEvent = EventConsts.HzEvent;
        var Events = EventConsts.Events;
        THREE.Object3D.call(this);
        this.type = 'Door';
        var scope = this;
        var isMoving = false;
        var doorAnchor = object;
        var instacne;
        this.isOpen = false;
        this.instacne;
        this.isCreate = false;

        var allNameArray = doorAnchor.name.split('_');
        var indexS = doorAnchor.name.indexOf('da_');
        var doorName = doorAnchor.name.substr(indexS);
        //	console.log(doorName);
        var doorArray = doorName.split('_');
        var doorDir = doorArray[3];
        var doorType = doorArray[7];
        var doorCode = doorArray[1];
        var doorUid = allNameArray[1] + '_' + allNameArray[2] + '_' + doorCode;

        var operateSign = doorArray[4];
        //  console.log('doorCode:'+doorCode);
        //    console.log('doorUid:'+doorUid);

        var doorMapName = doorArray[2] + '_' + doorArray[3] + '_' + doorArray[7];
        var doorInstanceName = doorUid + '_' + doorMapName;
        //  console.log('doorMapName:'+doorMapName);

        var degree = 0;
        if (operateSign === 'a') { //a代表正 d代表负
            degree = parseFloat(doorArray[5] + '.' + doorArray[6]);
        } else {
            degree = -parseFloat(doorArray[5] + '.' + doorArray[6]);
        }
        //   console.log(degree);
        var rad = THREE.Math.degToRad(degree);
        //     console.log(rad);

        if (doorMap.hasOwnProperty(doorMapName) == false) {
            console.warn('没有找到相对应的门类型:' + doorMapName);
            return false;
        }
        doorAnchor.geometry.computeBoundingSphere();
        var doorAnchorPos = (doorAnchor.geometry.boundingSphere.center.clone());
        instacne = doorMap[doorMapName].clone();


        instacne.position.x = doorAnchorPos.x;
        instacne.position.y = doorAnchorPos.y;
        instacne.position.z = doorAnchorPos.z;
        instacne.rotation.y = rad;
        //       console.log('aaa:'+instacne.rotation.y);
        instacne.name = 'door_' + doorInstanceName + '_instance_' + clone_id;
        this.name = 'door_' + doorInstanceName; //+ '_' + clone_id++;


        instacne.geometry.computeBoundingBox();
        var box = instacne.geometry.boundingBox;
        var boxMin = box.min;
        var boxMax = box.max;
        var boxW = (boxMax.x - boxMin.x);


        this.instacne = instacne;
        doorAnchor.parent.add(instacne);
        instacne.ownDoor = this;

        this.isCreate = true;

        function _openDoor() {
            if (doorType === 'T001' || doorType === 'T002') //推拉门
            {
                if (doorDir === 'l') //左门
                {
                    //	instacne.rotation.y -= Math.PI / 2;
                    rotationDoorAnmation(instacne.rotation.y, (instacne.rotation.y - Math.PI / 2), true);

                } else if (doorDir == 'r') //右门
                {

                    rotationDoorAnmation(instacne.rotation.y, (instacne.rotation.y + Math.PI / 2), true);
                    //instacne.rotation.y += Math.PI / 2;
                }
            }
            if (doorType === 'T003' || doorType === 'T004') { //移门
                if (doorDir === 'l') {
                    moveDoorAnmation(boxW, true);
                } else if (doorDir == 'r') {
                    moveDoorAnmation(-boxW, true);

                }
            }

        }

        function _closeDoor() {
            if (doorType === 'T001' || doorType === 'T002') {
                if (doorDir === 'l') //左门
                {
                    //    instacne.rotation.y += Math.PI / 2;
                    rotationDoorAnmation(instacne.rotation.y, (instacne.rotation.y + Math.PI / 2), false);
                } else if (doorDir == 'r') //右门
                {
                    //instacne.rotation.y -= Math.PI / 2;
                    rotationDoorAnmation(instacne.rotation.y, (instacne.rotation.y - Math.PI / 2), false);
                }
            }
            if (doorType === 'T003' || doorType === 'T004') {
                if (doorDir === 'l') {
                    moveDoorAnmation(-boxW, false);

                } else if (doorDir == 'r') {
                    moveDoorAnmation(boxW, false);
                }
            }

        }

        function moveDoorAnmation(moveDis, bool) {
            if (isMoving === true) {
                console.warn('门正在移动中，禁止操作');
                return;
            }
            isMoving = true;
            var fromObj = { pos: 0 };
            var toObj = { pos: moveDis };
            var last = 0;
            new TWEEN.Tween(fromObj)
                .to(toObj, 500)
                .onUpdate(function() {
                    var dis = this.pos - last;
                    instacne.translateOnAxis(new THREE.Vector3(1, 0, 0), dis);
                    last = this.pos;
                })
                .onComplete(
                    function() {
                        isMoving = false;
                        scope.isOpen = bool;
                        var e = null
                        if (bool === true) {
                            if (doorType == 'T002' || doorType == 'T004') {
                                if (doorDir == 'l') {
                                    e = new Events(HzEvent.OPEN_DOOR_OVER);
                                    hzThree.emit(e);
                                }
                            } else {
                                e = new Events(HzEvent.OPEN_DOOR_OVER);
                                hzThree.emit(e);
                            }

                        } else {

                            if (doorType == 'T002' || doorType == 'T004') {
                                if (doorDir == 'l') {
                                    e = new Events(HzEvent.CLOSE_DOOR_OVER);
                                    hzThree.emit(e);
                                }
                            } else {
                                e = new Events(HzEvent.CLOSE_DOOR_OVER);
                                hzThree.emit(e);
                            }

                        }
                    }

                )
                .start();
        }

        function rotationDoorAnmation(rad0, rad1, bool) {
            if (isMoving === true) {
                console.warn('门正在移动中，禁止操作');
                return;
            }
            isMoving = true;
            var fromObj = { rad: rad0 };
            var toObj = { rad: rad1 };
            new TWEEN.Tween(fromObj)
                .to(toObj, 500)
                .onUpdate(function() {
                    instacne.rotation.y = this.rad;
                })
                .onComplete(
                    function() {
                        isMoving = false;
                        scope.isOpen = bool;
                        var e = null;
                        if (bool === true) {
                            if (doorType == 'T002' || doorType == 'T004') {
                                if (doorDir == 'l') {
                                    e = new Events(HzEvent.OPEN_DOOR_OVER);
                                    hzThree.emit(e);
                                }
                            } else {
                                e = new Events(HzEvent.OPEN_DOOR_OVER);
                                hzThree.emit(e);
                            }

                        } else {

                            if (doorType == 'T002' || doorType == 'T004') { //上开门只需要判断一个方向
                                if (doorDir == 'l') {
                                    e = new Events(HzEvent.CLOSE_DOOR_OVER);
                                    hzThree.emit(e);
                                }
                            } else {
                                e = new Events(HzEvent.CLOSE_DOOR_OVER);
                                hzThree.emit(e);
                            }

                        }
                    }

                )
                .start();
        }

        function callOpenDoor(e) {
            var tempName = e.data;
            var tempNameArray = tempName.split('_');

            var tempType = tempNameArray[6];
            var tempCode = tempNameArray[1] + '_' + tempNameArray[2] + '_' + tempNameArray[3];
            var tempDir = tempNameArray[5];



            if (doorType === tempType && tempCode == doorUid && tempDir !== doorDir) {
                _openDoor();
            }



        }

        function callCloseDoor(e) {
            var tempName = e.data;
            var tempNameArray = tempName.split('_');

            var tempType = tempNameArray[6];
            var tempCode = tempNameArray[1] + '_' + tempNameArray[2] + '_' + tempNameArray[3];
            var tempDir = tempNameArray[5];

            if (doorType === tempType && tempCode == doorUid && tempDir !== doorDir) {
                _closeDoor();
            }
        }

        evtDispatcher.addEventListener(HzEvent.OPEN_DOOR, callOpenDoor);
        evtDispatcher.addEventListener(HzEvent.CLOSE_DOOR, callCloseDoor);

        this.openDoor = function() {
            if (scope.isOpen === true) {
                return;
            }
            _openDoor();
            var evt = new Events(HzEvent.OPEN_DOOR, this.name);
            evtDispatcher.dispatchEvent(evt);


        };
        this.toInfo = function() {
            return doorAnchor.name; //doorMapName+'_'+doorArray[4]+'_'+doorArray[5]+'_'+doorArray[6];
        }
        this.closeDoor = function() {
            if (scope.isOpen === false) {
                return;
            }
            _closeDoor();
            var evt = new Events(HzEvent.CLOSE_DOOR, this.name);
            evtDispatcher.dispatchEvent(evt);

        }
        this.toggle = function() {

            if (scope.isOpen === false) {
                this.openDoor();
            } else {
                this.closeDoor();
            }
        }
    }

    Door.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {

        constructor: Door

    });
    return Door;
});