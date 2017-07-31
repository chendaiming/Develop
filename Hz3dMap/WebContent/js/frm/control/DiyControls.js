define(function (require) {

    require('THREE');
    var Building = require('frm/component/Building');


    var DiyControls = function (object, domElement, floor, EventConsts) {
        var evtDispatcher = EventConsts.evtDispatcher;
        var HzEvent = EventConsts.HzEvent;
        var Events = EventConsts.Events;
        var object2dNameMap = EventConsts.object2dNameMap;
        EventConsts.frustum = new THREE.Frustum();
        var scope = this;
        var aroundDis = 0;
        var aroundRad = 0;
        var isArounding = false;
        var clock = new THREE.Clock();
        var baseTime = 17; //60帧的最佳效果 1帧的毫秒数
        var pointIsBuilding = false;
        this.object = object;
        this.floor = floor;
        this.boundsW = 100; //边界的宽
        this.boundsH = 100; //边界的长
        this.pointBuildingName = undefined;
        this.domElement = (domElement !== undefined) ? domElement : document;
        if (domElement) this.domElement.setAttribute('tabindex', -1);
        var isKeyDown = false; //判断目前是否是键盘操作以方便跳帧算法

        // Set to false to disable this control
        this.enabled = true;

        // "target" sets the location of focus, where the object orbits around
        this.target = new THREE.Vector3();
        this.targetBuild = new THREE.Vector3(); //若果可是点穿过建筑物就用加入该店
        this.targetFloor = new THREE.Vector3(); //指向地板的坐标

        // How far you can dolly in and out ( PerspectiveCamera only )
        this.minDistance = 1;
        this.maxDistance = 50000;

        // How far you can zoom in and out ( OrthographicCamera only )
        this.minZoom = 0;
        this.maxZoom = Infinity;

        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        // 字面意思两级角度（应该是指上下角度或者是纬度）
        this.minPolarAngle = 0.09; // radians
        this.maxPolarAngle = (Math.PI / 2) - 0.1; // radians
        // How far you can orbit horizontally, upper and lower limits.
        // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
        // 字面意思方位角度（应该是指左右角度或者是经度度）
        this.minAzimuthAngle = -Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians

        this.rotateMouseSpeed = 2; //鼠标右键旋转控制速度 越大越快

        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.enableDamping = false; // 是否启用减幅
        this.dampingFactor = 0.25; // 减幅因子

        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        this.enableZoom = true;
        this.zoomSpeed = 1.0;

        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 2.1;
        this.rotateKeySpeed = 0.005;

        this.enabledMouse = true;
        // Set to false to disable panning
        this.enablePan = true;
        this.keyPanSpeed = 1.2; // pixels moved per arrow key push
        this.keyPanSpeedStep = 0.1; //每次修改的速度的递增值
        this.keyPanSpeedMax = 10; //最大移动速度
        this.keyPanSpeedMin = 0.1; //最小移动速度

        // Set to true to automatically rotate around the target
        // If auto-rotate is enabled, you must call controls.update() in your animation loop
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

        // Set to false to disable use of the keys
        this.enableKeys = true;

        // The four arrow keys
        this.keys = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            BOTTOM: 40,
            W: 87,
            S: 83,
            A: 65,
            D: 68,
            Q: 81,
            E: 69,
            R: 82,
            F: 70,
            X: 88,
            C: 67,
            SPACE: 32,
            ADD: 107,
            SUB: 109
        };

        // Mouse buttons
        this.mouseButtons = {
            ORBIT: THREE.MOUSE.RIGHT,
            ZOOM: THREE.MOUSE.MIDDLE,
            PAN: THREE.MOUSE.LEFT
        };

        // for reset
        this.target0 = this.target.clone();
        this.target0Build = this.targetBuild.clone();
        this.target0Floor = this.targetFloor.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;


        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.flyCompleteCallBackFun = undefined; // 飞行结束后的回调函数
        var isFlying = false; //是否正在飞行状态
        this.minY = -20;
        this.minFlyTime = 1000;
        this.maxFlyTime = 3000;

        //右键镜头旋转系数
        this.rotateDisSpeed = 0.0005;
        //上下移动的速度
        this.upDownSpeed = 2.5;

        //右键操作模式 0为绕一个点旋转观察 1为在固定当前摄像机位置进行操作
        this.rightMode = 0;
        //
        // public methods
        //
        this.curTween = null;

        var onTouchMoveData = null;
        var onTouchMoveFun = null;

        this.getPolarAngle = function () {

            return spherical.phi;

        };

        this.getAzimuthalAngle = function () {

            return spherical.theta;

        };
        /**
         * 获取视角大小
         */
        this.getZoomRadius = function () {
            return spherical.radius;
        };
        this.setZoomRadius = function (value) {
            scale = value;
            try {
                scope.update();
            } catch (e) {
                console.error(e);
            }

        };
        this.reset = function () {

            scope.target.copy(scope.target0);
            scope.targetBuild.copy(scope.target0Build);
            scope.targetFloor.copy(scope.target0Floor);
            scope.object.position.copy(scope.position0);
            scope.object.zoom = scope.zoom0;

            scope.object.updateProjectionMatrix();
            scope.dispatchEvent(changeEvent);

            try {
                scope.update();
            } catch (e) {
                console.error(e);
            }

            state = STATE.NONE;

        };

        // this method is exposed, but perhaps it would be better if we can make it private...
        var half_PI = (Math.PI / 2).getNum(2);

        this.update = function () {

            var offset = new THREE.Vector3();

            // so camera.up is the orbit axis
            var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
            var quatInverse = quat.clone().inverse();

            var lastPosition = new THREE.Vector3();
            var lastQuaternion = new THREE.Quaternion();

            return function update() {
                if (scope.enablePan === false) {              
                    scope.object.near = 30;
                    scope.object.updateProjectionMatrix();
                    return;
                }
                if (isArounding === true) {
                    around();
                    update2dImage();
                    return;
                }
                if (onTouchMoveData !== null && onTouchMoveFun !== null) {
                    onTouchMoveFun(onTouchMoveData);
                    onTouchMoveData = null;
                    onTouchMoveFun = null;
                }
                var scaleTime = 1;
                var delta = clock.getDelta().toFixed(3) * (1000);
                if (isKeyDown === true) {
                    scaleTime = Math.ceil(delta / baseTime);
                    scaleTime = THREE.Math.clamp(scaleTime, 1, 5);
                }



                var position = scope.object.position;


                if (state === STATE.DOLLY) {
                    offset.copy(position).sub(scope.targetFloor);
                } else {
                    offset.copy(position).sub(scope.target);
                }





                // rotate offset to "y-axis-is-up" space
                offset.applyQuaternion(quat);

                // angle from z-axis around y-axis
                spherical.setFromVector3(offset);

                if (scope.autoRotate && state === STATE.NONE) {

                    rotateLeft(getAutoRotationAngle());

                }

                spherical.theta += sphericalDelta.theta;
                spherical.phi += sphericalDelta.phi;

                // restrict theta to be between desired limits


                spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));


                // restrict phi to be between desired limits
                // if (pointIsBuilding === true) {
                //     scope.maxPolarAngle = maxPolarAngleBuild;
                // } else {
                //     scope.maxPolarAngle = maxPolarAngleFloor;
                // }
                spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));


                spherical.makeSafe();

                spherical.radius *= scale;

                //              console.log(spherical.radius);
                // console.log(scale);

                // restrict radius to be between desired limits

                spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));


                //    console.log('2222', spherical.radius);

                var panOffsetOld = panOffset.clone(); //保持住老数据

                panOffset.multiplyScalar(scaleTime); //根据时间延迟多少来计算偏移量


                // move target to panned location

                scope.target.add(panOffset);

                scope.target.x = THREE.Math.clamp(scope.target.x, -scope.boundsW, scope.boundsW);
                scope.target.z = THREE.Math.clamp(scope.target.z, -scope.boundsH, scope.boundsH);

                offset.setFromSpherical(spherical);

                // rotate offset back to "camera-up-vector-is-up" space
                offset.applyQuaternion(quatInverse);

                if (state === STATE.DOLLY) {
                    position.copy(scope.targetFloor).add(offset);
                } else {
                    position.copy(scope.target).add(offset);
                }





                if ((state === STATE.ROTATE || state === STATE.TOUCH_ROTATE) && scope.rightMode === 0) {
                    scope.object.lookAt(scope.target);

                }

                //动态调整近屏距离 防止抖动
                // TODO: 2017.06.08 update
                if (EventConsts.logDepthBuffer === false && Building.showInCount === 0) {
                    scope.object.near = THREE.Math.clamp(parseInt(scope.object.position.y / 10) + 0.05, 1, 20000); // parseInt(spherical.radius/30);
                    scope.object.updateProjectionMatrix();
                }


                if (upDownSpeed !== 0) {
                    scope.object.position.y += upDownSpeed * scaleTime;
                    if (scope.object.position.y <= scope.minY) {
                        scope.object.position.y = scope.minY;

                    }

                }

                if (scope.enableDamping === true) {

                    sphericalDelta.theta *= (1 - scope.dampingFactor);
                    sphericalDelta.phi *= (1 - scope.dampingFactor);

                } else {

                    sphericalDelta.set(0, 0, 0);

                }


                panOffset = panOffsetOld;
                if (is_Up_Bottom_moving === false && is_left_right_moving === false) {
                    panOffset.set(0, 0, 0);

                }


                scope.object.updateMatrix();
                scope.object.updateMatrixWorld();

                update2dImage();
                scale = 1;
                // update condition is:
                // min(camera displacement, camera rotation in radians)^2 > EPS
                // using small-angle approximation cos(x/2) = 1 - x^2 / 8

                if (zoomChanged ||
                    lastPosition.distanceToSquared(scope.object.position) > EPS ||
                    8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {

                    scope.dispatchEvent(changeEvent);

                    lastPosition.copy(scope.object.position);
                    lastQuaternion.copy(scope.object.quaternion);
                    zoomChanged = false;

                    //   return true;


                }

                if (rotateChanged) {

                    //角度限定

                    var roX = (scope.object.rotation.x).toFixed(2);
                    if (scope.rotationVector.y !== 0) {
                        rotateAroundWorldAxis(scope.object, new THREE.Vector3(0, 1, 0), scope.rotationVector.y * scaleTime);
                        scope.object.updateMatrix();
                        scope.object.updateMatrixWorld();
                    }


                    if (scope.rotationVector.x !== 0) {
                        if ((roX == -half_PI && scope.rotationVector.x < 0) || (roX == half_PI && scope.rotationVector.x > 0)) {
                            return;
                        }
                        scope.object.rotateOnAxis(new THREE.Vector3(1, 0, 0), scope.rotationVector.x * scaleTime);
                    }

                    scope.object.updateMatrix();
                    scope.object.updateMatrixWorld();
                    //  console.log('degree:'+THREE.Math.radToDeg(scope.object.rotation.x));




                    //这里是组合键的时候才会启用来改变目前的移动方向
                    if (is_W_KeyDown || is_UP_KeyDown) {
                        panOffset.set(0, 0, 0);
                        pan(0, scope.keyPanSpeed * scaleTime, true);
                    }
                    if (is_BOTTOM_KeyDown || is_S_KeyDown) {
                        panOffset.set(0, 0, 0);
                        pan(0, -scope.keyPanSpeed * scaleTime, true);
                    }

                    if (is_LEFT_KeyDown || is_A_KeyDown) {
                        panOffset.set(0, 0, 0);
                        pan(scope.keyPanSpeed * scaleTime, 0, true);
                    }
                    if (is_RIGHT_KeyDown || is_D_KeyDown) {
                        panOffset.set(0, 0, 0);
                        pan(-scope.keyPanSpeed * scaleTime, 0, true);

                    }
                    updateLookAtPos();
                    // var pos = getScreenTo3dPos();
                    // scope.target.x = parseFloat(pos.x);
                    // scope.target.z = parseFloat(pos.z);
                    // scope.object.updateMatrix();
                    // scope.object.updateMatrixWorld();
                    updateCompass();
                    update2dImage();
                    return true;

                }

                if (needUpdateLook === true) {

                    needUpdateLook = false;
                    updateLookAtPos();
                    update2dImage();

                }
                if (needRoteUpdate === true) {
                    needRoteUpdate = false;
                    update2dImage();
                }

                return false;

            };

        }();

        function update2dImage() {
            if (object2dNameMap.length === 0) return;
            EventConsts.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(scope.object.projectionMatrix, scope.object.matrixWorldInverse));
            for (var key in object2dNameMap) {
                var image2d = object2dNameMap[key];
                image2d.updatePos();

            }
        }

        function updateLookAtPos(val) {
            var pos = getScreenTo3dPos();
            scope.targetFloor.x = parseFloat(pos.x);
            scope.targetFloor.z = parseFloat(pos.z);
            scope.targetFloor.y = 0;
            var force = val || false;
            if (scope.rightMode == 1 && isFlying === false) return;
            if (juestOutFloot() === false || (scope.rightMode == 1 && isFlying === false)) return;
            if (pointIsBuilding === true && force === false) {

                return; //一旦点到建筑物 就不执行下边了
            }

            scope.target.x = parseFloat(pos.x);
            scope.target.z = parseFloat(pos.z);
            if (force === true) {
                scope.target.y = 0;
            }

            //		scope.target.y = parseFloat(pos.y);
            scope.object.updateMatrix();
            scope.object.updateMatrixWorld();
            updateCompass();


        }

        function updateCompass() {
            var z1 = (scope.target.z - scope.object.position.z);
            var x1 = (scope.target.x - scope.object.position.x);
            var deg = THREE.Math.radToDeg(Math.atan2(-z1, x1));
            evtDispatcher.dispatchEvent(new Events(HzEvent.UPDATE_CAMERA_ROTATE, deg));
        }

        function changeLookAt() {
            var mv = new THREE.Vector3(
                0,
                0,
                0.5);

            scope.raycaster.setFromCamera(mv, scope.object);
            var intersects = scope.raycaster.intersectObjects(Building.buildOutDataArray, true);
            if (intersects.length > 0) {
                var interset;
                for (var index = 0; index < intersects.length; index++) {
                    interset = intersects[index];
                    if (interset.object.name.indexOf('T016') > -1) { //找到了box盒子直接跳过
                        continue;
                    } else {
                        break;
                    }
                }
                pointIsBuilding = true;
                //                  console.log(interset);
                scope.pointBuildingName = interset.object.name.split('_')[1]; //获取到建筑物的名字
                scope.target.x = interset.point.x;
                scope.target.y = interset.point.y;
                scope.target.z = interset.point.z;
                scope.targetBuild.copy(scope.target);

            } else {
                pointIsBuilding = false;
                scope.pointBuildingName = undefined;
                scope.target.y = 0;


            }
            scope.object.updateMatrix();
            scope.object.updateMatrixWorld();


        }
        this.refreshLookAt = function () {
            updateLookAtPos();
        };
        //判断是否出边界
        this.raycaster = new THREE.Raycaster();

        function juestOutFloot() {
            var mv = new THREE.Vector3(
                0,
                0,
                0.5);

            scope.raycaster.setFromCamera(mv, scope.object);
            var intersects = scope.raycaster.intersectObject(scope.floor);
            // var intersects1 = scope.raycaster.intersectObjects(scope.object.ownScene.children, true);
            // if (intersects1.length > 0) //从视角距离处拿到数据进行设置
            // {
            //
            //     var disNear = parseInt(intersects1[0].distance /10 ) + 0.1;
            //     var near = Math.min(heightNear, disNear);
            //     scope.object.near = heightNear;
            //     scope.object.updateProjectionMatrix();
            // }


            if (intersects.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        //获取当前摄像机信息
        this.getCameraPos = function () {
            var object = scope.object;
            return {
                posX: object.position.x,
                posY: object.position.y,
                posZ: object.position.z,
                rotY: object.rotation.y,
                rotX: object.rotation.x,
                rotZ: object.rotation.z,
                tarX: scope.target.x,
                tarZ: scope.target.z,
                tarY: scope.target.y
            };
        };
        /**
         * 判断两个点是否一致
         * @param  {Boolean} disPos [description]
         * @return {Boolean}        [description]
         */
        this.isSamePosCamera = function (disPos) {

            var object = scope.object;
            if ((object.position.x).getNum(3) === (disPos.posX.getNum(3)) &&
                (object.position.y).getNum(3) === (disPos.posY.getNum(3)) &&
                (object.position.z).getNum(3) === (disPos.posZ.getNum(3)) &&
                (object.rotation.y).getNum(3) === (disPos.rotY.getNum(3)) &&
                (object.rotation.x).getNum(3) === (disPos.rotX.getNum(3)) &&
                (object.rotation.z).getNum(3) === (disPos.rotZ.getNum(3))
            ) {
                return true;
            }
            return false;
        };
        //获取挡墙摄像机信息转换成jsons数据
        this.getCameraPosJson = function () {
            var obj = scope.getCameraPos();
            return JSON.stringify(obj);
        };
        this.setCameraPos = function (val) {
            scope.object.x = val.posX;
            scope.object.y = val.posY;
            scope.object.z = val.posZ;
            scope.object.rotation.x = val.rotX;
            scope.object.rotation.y = val.rotY;
            scope.object.rotation.z = val.rotZ;
            if (val.tarX !== undefined) {
                scope.target.x = val.tarX;
            }
            if (val.tarY !== undefined) {
                scope.target.y = val.tarY;
            }
            if (val.tarZ !== undefined) {
                scope.target.z = val.tarZ;
            }
            updateLookAtPos();

        };
        /**
         * 相机飞跃到目标点 传入的json数据 需要飞行的时间 单位毫秒
         *
         *
         */
        this.flyTo = function (disPos) {
            if (scope.curTween !== null) {
                scope.curTween.stop();
                isFlying = false;
            }
            if (isFlying === false && scope.isSamePosCamera(disPos) === false) {
                if (scope.rightMode === 0) {
                    flyWay1To(disPos);
                } else {
                    flyWay2To(disPos);
                }
            } else if (isFlying === false && scope.isSamePosCamera(disPos) === true) {
                if (scope.flyCompleteCallBackFun !== undefined && scope.flyCompleteCallBackFun instanceof Function) {
                    scope.flyCompleteCallBackFun(); //执行外部设置的回调方法
                }
            }
        };
        /**
         * 飞到观测点 
         * 观测坐标 观测距离  飞行时间
         */
        this.flyToLookAt = function (pos, disRadius = 1000, disHeight = 1000, needTime = 2000) {
            if (isFlying === false) {
                flyWayLookAtTo(pos, disRadius, disHeight, needTime);
            }
        };
        /**
         * @param  {vector3d} pos 最终移动到的注释点
         * @param {Object}
         *              {
         *                  type:移动方式 0位三步走移动(只移动一个维度) 1位2步走移动
         *                  time1:500  //三个步骤分别所需要的事件
         *                  time2:500
         *                  time3 500
         * 
         *              }
         */
        this.cameraLookAt = function (pos, distance = 1000, objdata = {
            type: 0,
            time1: 500,
            time2: 500,
            time3: 800
        }) {
            if (isFlying === true) return;
            isFlying = true;
            if (objdata.type === 0) {


                let disPos = pos.clone();
                let cameraTarget = scope.target.clone();
                let cameraPos = scope.object.position.clone();
                cameraTarget.y = disPos.y; //将三点设置为同一个平面
                cameraPos.y = disPos.y;


                let targetArrow = cameraTarget.sub(cameraPos.clone());
                let posArrow = disPos.sub(cameraPos.clone());

                let disYRad = targetArrow.angleTo(posArrow);
                let crossY = new THREE.Vector3();
                crossY.crossVectors(targetArrow.clone(), posArrow.clone()); //通过叉乘来判断转动的方向
                if (crossY.y > 0) {
                    //disYRad = disYRad;
                } else if (crossY.y < 0) {
                    disYRad = -disYRad;
                } else {
                    disYRad = 0;
                }

                let startObj = {
                    y: 0
                };
                let endObj = {
                    y: disYRad
                };
                let lastY = 0;
                scope.curTween = new TWEEN.Tween(startObj)
                    .to(endObj, objdata.time1)
                    .onUpdate(function () {
                        rotateAroundWorldAxis(scope.object, new THREE.Vector3(0, 1, 0), (this.y - lastY));
                        lastY = this.y;
                        updateLookAtPos();
                        update2dImage();
                        changeLookAt();

                    })
                    .onComplete(
                        function () {
                            updateLookAtPos();
                            update2dImage();
                            changeLookAt();

                            xTween();

                        }


                    ).start();

            }

            let xTween = function () {
                let cameraTargetX = scope.target.clone();
                let startX = cameraTargetX.clone();

                scope.curTween = new TWEEN.Tween(startX)
                    .to(pos.clone(), objdata.time2)
                    .onUpdate(function () {
                        scope.target.x = parseFloat(parseFloat(this.x).toFixed(2));
                        scope.target.y = parseFloat(parseFloat(this.y).toFixed(2));
                        scope.target.z = parseFloat(parseFloat(this.z).toFixed(2));

                        scope.object.lookAt(scope.target);
                        scope.object.updateMatrix();
                        scope.object.updateMatrixWorld();
                        //         updateLookAtPos();
                        update2dImage();


                    })
                    .onComplete(
                        function () {

                            scope.object.lookAt(scope.target);
                            scope.object.updateMatrix();
                            scope.object.updateMatrixWorld();
                            //   updateLookAtPos();
                            changeLookAt();
                            update2dImage();

                            let dis = scope.object.position.distanceTo(scope.target);
                            if (dis !== distance) {
                                distanceTween();
                            } else {
                                isFlying = false;
                            }
                        }
                    ).start();
            };
            let distanceTween = function () {
                let ray = new THREE.Ray(scope.target, scope.object.position.clone().sub(scope.target.clone()).normalize());
                let pos = ray.at(distance);
                scope.curTween = new TWEEN.Tween(scope.object.position.clone())
                    .to(pos.clone(), objdata.time3)
                    .onUpdate(function () {
                        scope.object.position.x = parseFloat(parseFloat(this.x).toFixed(2));
                        scope.object.position.y = parseFloat(parseFloat(this.y).toFixed(2));
                        scope.object.position.z = parseFloat(parseFloat(this.z).toFixed(2));


                        //   updateLookAtPos();
                        update2dImage();


                    })
                    .onComplete(
                        function () {

                            changeLookAt();
                            updateLookAtPos();
                            isFlying = false;

                        }
                    ).start();

            };
            if (objdata.type === 1) {
                xTween();
            }
        };
        this.aroundPoint = function () {
            var start = new THREE.Vector2(scope.target.x, scope.target.z);
            var end = new THREE.Vector2(scope.object.position.x, scope.object.position.z);
            aroundDis = start.distanceTo(end);
            aroundRad = Math.atan2((scope.object.position.z - (scope.target.z)), (scope.object.position.x - scope.target.x));
            isArounding = true;
        };

        function around() {
            aroundRad -= 0.003;
            scope.object.position.x = Math.cos(aroundRad) * aroundDis + scope.target.x;
            scope.object.position.z = Math.sin(aroundRad) * aroundDis + scope.target.z;
            scope.object.lookAt(scope.target);
        }

        function flyWayLookAtTo(pos1, disRadius, disHeight, needTime) {
            isFlying = true;

            var x1 = Math.sin(0) * disRadius + pos1.x;
            var z1 = Math.cos(0) * disRadius + pos1.z;


            let pos = scope.object.position.clone();
            let radians = scope.object.rotation.clone();
            let target = scope.target.clone();

            let startPos = {
                posX: pos.x,
                posY: pos.y,
                posZ: pos.z,
                rotX: radians.x,
                rotY: radians.y,
                rotZ: radians.z,
                tarX: target.x,
                tarY: target.y,
                tarZ: target.z
            };
            let endPos = {
                posX: x1,
                posY: pos1.y + disHeight,
                posZ: z1,
                rotX: -Math.atan2(disHeight, disRadius),
                rotY: 0,
                rotZ: 0,
                tarX: pos1.x,
                tarY: pos1.Y,
                tarZ: pos1.z
            };


            pos = scope.object.position.clone();
            new TWEEN.Tween(startPos)
                .to(endPos, needTime)
                .onUpdate(function () {
                    scope.object.position.x = parseFloat(this.posX);
                    scope.object.position.y = parseFloat(this.posY);
                    scope.object.position.z = parseFloat(this.posZ);
                    scope.object.rotation.x = parseFloat(this.rotX);
                    scope.object.rotation.y = parseFloat(this.rotY);
                    scope.object.rotation.z = parseFloat(this.rotZ);

                    updateLookAtPos();
                    update2dImage();

                })
                .onComplete(
                    function () {
                        isFlying = false;
                        var a = new THREE.Vector3(x1, pos1.y + disHeight, z1);
                        scope.object.position.copy(a);
                        updateLookAtPos();
                        changeLookAt();

                    }


                ).start();

        }

        function flyWay1To(disPos) {
            isFlying = true;
            updateLookAtPos();
            var useTime = 3000;
            var startPos = scope.getCameraPos();

            var disVec = new THREE.Vector3(disPos.posX, disPos.posY, disPos.posZ);
            var startVec = new THREE.Vector3(startPos.posX, startPos.posY, startPos.posZ);
            var dis = startVec.distanceTo(disVec);
            //   var tempMidY = Math.min(disPos.posY, dis / 10);
            var midDis = {};
            //        var midDis = new THREE.Vector3((startPos.posX + disPos.posX) / 2, Math.max(disPos.posY, 10000), (startPos.posZ + disPos.posZ) / 2);
            midDis.tarX = (startPos.tarX + disPos.tarX) / 2;
            midDis.tarZ = (startPos.tarZ + disPos.tarZ) / 2;
            midDis.tarY = (startPos.tarY + disPos.tarY) / 2;
            midDis.posX = (startPos.posX + disPos.posX) / 2;
            var tempA = new THREE.Vector2(startPos.posX, startPos.posZ);
            var tempB = new THREE.Vector2(disPos.posX, disPos.posZ);
            var tempDis = tempA.distanceTo(tempB);
            var tempHeight = Math.max(disPos.posY, startPos.posY) + Math.tan(THREE.Math.degToRad(30)) * tempDis;
            //		console.log(tempHeight);
            midDis.posY = Math.min(10000, tempHeight); // Math.min(disPos.posY, dis);
            //		console.log(midDis.posY);
            midDis.posZ = (startPos.posZ + disPos.posZ) / 2;
            midDis.rotX = disPos.rotX;
            midDis.rotY = disPos.rotY;
            midDis.rotZ = disPos.rotZ;

            //  var dis = startVec.distanceTo(disVec);
            useTime = parseInt(dis / 10);
            useTime = Math.max(scope.minFlyTime, Math.min(useTime, scope.maxFlyTime));
            useTime = parseInt(useTime / 2);


            var midTofun = function () {
                scope.curTween = new TWEEN.Tween(midDis)
                    .to(disPos, useTime)
                    .easing(TWEEN.Easing.Quartic.Out)
                    .onUpdate(function () {
                        scope.object.position.x = (this.posX);
                        scope.object.position.y = (this.posY);
                        scope.object.position.z = (this.posZ);
                        scope.object.rotation.y = this.rotY;
                        scope.object.rotation.x = this.rotX;
                        scope.object.rotation.z = this.rotZ;
                        scope.target.x = this.tarX;
                        scope.target.z = this.tarZ;
                        scope.target.y = this.tarY;
                        scope.object.lookAt(scope.target);
                        scope.object.updateMatrix();
                        scope.object.updateMatrixWorld();
                        update2dImage();

                    })
                    .onComplete(
                        function () {
                            updateLookAtPos();
                            isFlying = false;
                            if (scope.flyCompleteCallBackFun !== undefined && scope.flyCompleteCallBackFun instanceof Function) {
                                scope.flyCompleteCallBackFun(); //执行外部设置的回调方法
                            }
                            setTimeout(function () {
                                scope.object.lookAt(new THREE.Vector3(disPos.tarX, disPos.tarY, disPos.tarZ));
                            }, 50);


                        }
                    )
                    .start();
            };

            scope.curTween = new TWEEN.Tween(startPos)
                .to(midDis, useTime)
                .easing(TWEEN.Easing.Quartic.In)
                .onUpdate(function () {
                    scope.object.position.x = (this.posX);
                    scope.object.position.y = (this.posY);
                    scope.object.position.z = (this.posZ);
                    scope.object.rotation.y = this.rotY;
                    scope.object.rotation.x = this.rotX;
                    scope.object.rotation.z = this.rotZ;
                    scope.target.x = this.tarX;
                    scope.target.z = this.tarZ;
                    scope.target.y = this.tarY;
                    scope.object.lookAt(scope.target);
                    scope.object.updateMatrix();
                    scope.object.updateMatrixWorld();
                    update2dImage();

                })
                .onComplete(
                    midTofun

                )
                .start();

        }

        function flyWay2To(disPos) {


            isFlying = true;
            updateLookAtPos();
            var useTime = 3000;
            var startPos = scope.getCameraPos();
            var disVec = new THREE.Vector3(disPos.posX, disPos.posY, disPos.posZ);
            var startVec = new THREE.Vector3(startPos.posX, startPos.posY, startPos.posZ);
            var dis = startVec.distanceTo(disVec);

            var midY = Math.min(10000, Math.max(startPos.posY, dis / 2));
            var midDis = {};
            //  var midDis = new THREE.Vector3((startPos.posX + disPos.posX) / 2, Math.max(disPos.y, midY), (startPos.posZ + disPos.posZ) / 2);
            midDis.posX = (startPos.posX + disPos.posX) / 2;
            midDis.posY = Math.max(disPos.posY, midY);
            midDis.posZ = (startPos.posZ + disPos.posZ) / 2;

            midDis.targetX = (startPos.tarX + disPos.tarX) / 2;
            midDis.targetZ = (startPos.tarZ + disPos.tarZ) / 2;
            midDis.rotX = disPos.rotX;
            midDis.rotY = disPos.rotY;
            midDis.rotZ = disPos.rotZ;
            useTime = parseInt(dis / 10);
            useTime = Math.max(scope.minFlyTime, Math.min(useTime, scope.maxFlyTime));
            useTime = parseInt(useTime / 2);

            startPos.rotX = checkAngle(startPos.rotX, midDis.rotX);
            startPos.rotY = checkAngle(startPos.rotY, midDis.rotY);
            startPos.rotZ = checkAngle(startPos.rotZ, midDis.rotZ);




            var midTofun = function () {
                new TWEEN.Tween(midDis)
                    .to(disPos, useTime)
                    .onUpdate(function () {
                        //console.log(this);
                        scope.object.position.x = (this.posX);
                        scope.object.position.y = (this.posY);
                        scope.object.position.z = (this.posZ);
                        //scope.object.rotation.x = this.pitch;
                        //scope.object.rotation.y = this.yaw;
                        //scope.object.rotation.z = this.roll;
                        scope.target.x = this.tarX;
                        scope.target.z = this.tarZ;
                        //     scope.object.lookAt(scope.target);
                        scope.object.updateMatrix();
                        scope.object.updateMatrixWorld();


                    })
                    .onComplete(
                        function () {
                            updateLookAtPos(); //飞行结束直接设定死角度
                            isFlying = false;
                            if (scope.flyCompleteCallBackFun !== undefined && scope.flyCompleteCallBackFun instanceof Function) {
                                scope.flyCompleteCallBackFun(); //执行外部设置的回调方法
                            }


                        }
                    )
                    .start();
            };

            new TWEEN.Tween(startPos)
                .to(midDis, useTime)
                .onUpdate(function () {
                    scope.object.position.x = (this.posX);
                    scope.object.position.y = (this.posY);
                    scope.object.position.z = (this.posZ);
                    scope.object.rotation.x = this.rotX;
                    scope.object.rotation.y = this.rotY;
                    scope.object.rotation.z = this.rotZ;
                    scope.target.x = this.tarX;
                    scope.target.z = this.tarZ;
                    //  scope.object.lookAt(scope.target);
                    scope.object.updateMatrix();
                    scope.object.updateMatrixWorld();


                })
                .onComplete(
                    midTofun
                )
                .start();




        }

        /**
         * 根据出发角度 和结束角度进行修改 防止镜头翻滚的情况
         * @param fromAngle
         * @param toAngle
         * @returns {*}
         */
        function checkAngle(fromAngle, toAngle) {
            var result = fromAngle;
            if (Math.abs(fromAngle - toAngle) > Math.PI) {
                if ((fromAngle - toAngle) > 0) {
                    result = fromAngle - Math.PI * 2;
                } else {
                    result = fromAngle + Math.PI * 2;
                }
            }
            return result;
        }


        this.removeEvents = function () {

            scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
            scope.domElement.removeEventListener('mousedown', onMouseDown, false);
            scope.domElement.removeEventListener('wheel', onMouseWheel, false);

            scope.domElement.removeEventListener('touchstart', onTouchStart, false);
            scope.domElement.removeEventListener('touchend', onTouchEnd, false);
            scope.domElement.removeEventListener('touchmove', scope.onTouchMove, false);

            document.removeEventListener('mousemove', onMouseMove, false);
            document.removeEventListener('mouseup', onMouseUp, false);

            window.removeEventListener('keydown', onKeyDown, false);
            window.removeEventListener('keyup', onKeyUp, false);

            //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

        };

        //
        // internals
        //



        var changeEvent = {
            type: 'change'
        };
        var startEvent = {
            type: 'start'
        };
        var endEvent = {
            type: 'end'
        };

        var STATE = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_DOLLY: 4,
            TOUCH_PAN: 5
        };

        var state = STATE.NONE;

        var EPS = 0.000001;

        // current position in spherical coordinates
        var spherical = new THREE.Spherical();
        var sphericalDelta = new THREE.Spherical();

        var scale = 1;
        var panOffset = new THREE.Vector3();
        var zoomChanged = false;
        var rotateChanged = false;

        var is_W_KeyDown = false;
        var is_A_KeyDown = false;
        var is_S_KeyDown = false;
        var is_D_KeyDown = false;
        var is_Q_KeyDown = false;
        var is_E_KeyDown = false;
        var is_R_KeyDown = false;
        var is_F_KeyDown = false;
        var is_UP_KeyDown = false;
        var is_LEFT_KeyDown = false;
        var is_RIGHT_KeyDown = false;
        var is_BOTTOM_KeyDown = false;
        var is_X_KeyDown = false;
        var is_C_KeyDown = false;

        var is_Up_Bottom_moving = false;
        var is_left_right_moving = false;


        var rotateStart = new THREE.Vector2();
        var rotateEnd = new THREE.Vector2();
        var rotateDelta = new THREE.Vector2();

        var panStart = new THREE.Vector2();
        var panEnd = new THREE.Vector2();
        var panDelta = new THREE.Vector2();

        var dollyStart = new THREE.Vector2();
        var dollyEnd = new THREE.Vector2();
        var dollyDelta = new THREE.Vector2();


        var upDownSpeed = 0;
        var needUpdateLook = false; //是否需要跟新lookPos
        var needRoteUpdate = false; //是否需要鼠标右键是否进行了旋转
        function getAutoRotationAngle() {

            return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

        }

        function getZoomScale() {

            return Math.pow(0.95, scope.zoomSpeed);

        }

        function rotateLeft(angle) {

            sphericalDelta.theta -= angle;
            updateLookAtPos();
            needRoteUpdate = true;
        }

        function rotateUp(angle) {
            if (spherical.phi >= 1.5 && angle < 0 && pointIsBuilding === false) {
                spherical.phi = 1.5;
                return;
            }
            if (scope.object.position.y < scope.minY && pointIsBuilding === true) {
                scope.object.position.y = scope.minY;
                return;
            }
            sphericalDelta.phi -= angle;
            updateLookAtPos();
            needRoteUpdate = true;
        }



        var rotWorldMatrix;
        // Rotate an object around an arbitrary axis in world space
        //物件绕世界轴转动
        function rotateAroundWorldAxis(object, axis, radians) {
            rotWorldMatrix = new THREE.Matrix4();
            rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

            // old code for Three.JS pre r54:
            //  rotWorldMatrix.multiply(object.matrix);
            // new code for Three.JS r55+:
            rotWorldMatrix.multiply(object.matrix); // pre-multiply

            object.matrix = rotWorldMatrix;

            // old code for Three.js pre r49:
            // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
            // old code for Three.js pre r59:
            // object.rotation.setEulerFromRotationMatrix(object.matrix);
            // code for r59+:
            object.rotation.setFromRotationMatrix(object.matrix);
        }
        var panLeft = function () {

            var v = new THREE.Vector3();

            return function panLeft(distance, objectMatrix) {

                v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
                v.multiplyScalar(-distance);

                panOffset.add(v);


            };

        }();

        var panUp = function () {

            var v = new THREE.Vector3();

            return function panUp(distance, objectMatrix) {

                v.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix


                v.multiplyScalar(distance);


                panOffset.add(v);


            };

        }();

        var panZ = function () {
            var v = new THREE.Vector3();

            return function panUp(distance, objectMatrix) {

                v.setFromMatrixColumn(objectMatrix, 2); // get Z column of objectMatrix
                //这里引擎可能有个bug 获取值得时候改变了y值得范围 所以强制的将y设置成0
                v.y = 0;

                v.multiplyScalar(-distance);


                panOffset.add(v);







            };
        }();
        // deltaX and deltaY are in pixels; right and down are positive
        var pan = function () {

            var offset = new THREE.Vector3();
            return function pan(deltaX, deltaY, ismove) {

                var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
                var isKeyMove = ismove || false;
                if (scope.object instanceof THREE.PerspectiveCamera) {

                    // perspective
                    var position = scope.object.position;
                    offset.copy(position).sub(scope.target);
                    var targetDistance = offset.length();

                    // half of the fov is center to top of screen
                    targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);
                    if (targetDistance < 10) //移动距离小于10的情况肯定是撞墙了
                    {
                        targetDistance = 50;
                    }
                    // we actually don't use screenWidth, since perspective camera is fixed to screen height
                    if (isKeyMove === true) {
                        panLeft(6 * deltaX, scope.object.matrix);
                    } else {
                        panLeft(4 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                    }


                    var phi = (spherical.phi.getNum(2)); //这里通过phi来判断一下仰视角 如果仰视角为垂直于平面 必须用原有算法来计算

                    if (phi <= 0.02 || phi == Math.PI.getNum(2)) {
                        if (isKeyMove === true) {
                            panUp(6 * deltaY, scope.object.matrix);
                        } else {
                            panUp(4 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
                        }

                    } else {
                        if (isKeyMove === true) {
                            panZ(6 * deltaY, scope.object.matrix);
                        } else {
                            //  console.log('bbbbb',targetDistance);
                            //  console.log('aaaaa',(4 * deltaY * targetDistance / element.clientHeight*(1/phi)));
                            panZ(4 * deltaY * targetDistance / element.clientHeight * (1 / phi), scope.object.matrix);

                        }

                    }

                    needUpdateLook = true;

                } else if (scope.object instanceof THREE.OrthographicCamera) {

                    // orthographic
                    panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                    panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);

                } else {

                    // camera neither orthographic nor perspective
                    console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                    scope.enablePan = false;

                }

            };

        }();

        function dollyIn(dollyScale) {

            if (scope.object instanceof THREE.PerspectiveCamera) {

                scale /= dollyScale;


            } else if (scope.object instanceof THREE.OrthographicCamera) {

                scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
                scope.object.updateProjectionMatrix();
                zoomChanged = true;

            } else {

                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
                scope.enableZoom = false;

            }

        }

        function dollyOut(dollyScale) {

            if (scope.object instanceof THREE.PerspectiveCamera) {

                scale *= dollyScale;


            } else if (scope.object instanceof THREE.OrthographicCamera) {

                scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
                scope.object.updateProjectionMatrix();
                zoomChanged = true;

            } else {

                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
                scope.enableZoom = false;

            }

        }

        //
        // event callbacks - update the object state
        //

        function handleMouseDownRotate(event) {

            //console.log( 'handleMouseDownRotate' );
            if (scope.rightMode === 0) {
                rotateStart.set(event.clientX, event.clientY);
            } else {
                rotateStart.set(event.clientX, event.clientY);
            }



        }

        function handleMouseDownDolly(event) {

            //console.log( 'handleMouseDownDolly' );

            dollyStart.set(event.clientX, event.clientY);

        }

        function handleMouseDownPan(event) {

            //console.log( 'handleMouseDownPan' );

            panStart.set(event.clientX, event.clientY);





        }

        function handleMouseMoveRotate(event) {

            //console.log( 'handleMouseMoveRotate' );
            if (scope.rightMode === 0) {

                rotateEnd.set(event.clientX, event.clientY);
                rotateDelta.subVectors(rotateEnd, rotateStart);

                var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

                // rotating across whole screen goes 360 degrees around
                rotateLeft(scope.rotateMouseSpeed * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

                // rotating up and down along whole screen attempts to go 360, but limited to 180
                rotateUp(scope.rotateMouseSpeed * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

                rotateStart.copy(rotateEnd);

                try {
                    scope.update();
                } catch (e) {
                    console.error(e);
                }

                var z1 = (scope.target.z - scope.object.position.z);
                var x1 = (scope.target.x - scope.object.position.x);
                var deg = THREE.Math.radToDeg(Math.atan2(-z1, x1));
                evtDispatcher.dispatchEvent(new Events(HzEvent.UPDATE_CAMERA_ROTATE, deg));


            } else {
                var tempY = event.clientY;
                var tempX = event.clientX;
                var diffX = tempX - rotateStart.x;
                var diffY = tempY - rotateStart.y;
                var rad = Math.atan2(-diffY, diffX);
                var degree = parseInt(THREE.Math.radToDeg(rad));

                rotateChanged = true;
                scope.rotationVector.y = 0;
                scope.rotationVector.x = 0;
                var dis = parseInt(Math.sqrt(diffX * diffX + diffY * diffY));
                scope.rotateKeySpeed = Math.min(0.005, dis * scope.rotateDisSpeed);

                var roX = parseFloat(scope.object.rotation.x).toFixed(2);
                if (roX == -half_PI) {
                    if (degree < 140 && degree > 70) {
                        scope.rotationVector.x = scope.rotateKeySpeed;
                    }
                    if ((degree >= 0 && degree <= 70) || (degree > -90 && degree < 0)) {
                        scope.rotationVector.y = -scope.rotateKeySpeed;
                    }
                    if ((degree >= 140 && degree <= 180) || (degree > -180 && degree < -90)) {
                        scope.rotationVector.y = scope.rotateKeySpeed;
                    }

                    try {
                        scope.update();
                    } catch (e) {
                        console.error(e);
                    }
                    return;
                }
                if (roX == half_PI) {
                    if (degree <= -50 && degree >= -120) {
                        scope.rotationVector.x = -scope.rotateKeySpeed;
                    }
                    if ((degree >= 0 && degree <= 90) || (degree > -50 && degree < 0)) {
                        scope.rotationVector.y = -scope.rotateKeySpeed;
                    }
                    if ((degree > 90 && degree <= 180) || (degree > -180 && degree < -120)) {
                        scope.rotationVector.y = scope.rotateKeySpeed;
                    }

                    try {
                        scope.update();
                    } catch (e) {
                        console.error(e);
                    }
                    return;
                }


                if ((degree >= -20 && degree <= 0) || (degree >= 0 && degree < 25)) //向右
                {
                    scope.rotationVector.y = -scope.rotateKeySpeed;
                } else if (degree >= 25 && degree < 65) //右上
                {
                    scope.rotationVector.y = -scope.rotateKeySpeed;
                    scope.rotationVector.x = scope.rotateKeySpeed;
                } else if (degree >= 65 && degree < 110) //向上
                {
                    scope.rotationVector.x = scope.rotateKeySpeed;
                } else if (degree >= 110 && degree < 160) //左上
                {
                    scope.rotationVector.y = scope.rotateKeySpeed;
                    scope.rotationVector.x = scope.rotateKeySpeed;
                } else if ((degree >= 160 && degree <= 180) || (degree >= -180 && degree < -160)) //正左
                {
                    scope.rotationVector.y = scope.rotateKeySpeed;
                } else if (degree >= -160 && degree < -115) //左下
                {
                    scope.rotationVector.y = scope.rotateKeySpeed;
                    scope.rotationVector.x = -scope.rotateKeySpeed;
                } else if (degree >= -115 && degree < -70) //正下
                {
                    scope.rotationVector.x = -scope.rotateKeySpeed;
                } else if (degree >= -70 && degree < -20) //右下
                {
                    scope.rotationVector.y = -scope.rotateKeySpeed;
                    scope.rotationVector.x = -scope.rotateKeySpeed;
                }

                try {
                    scope.update();
                } catch (e) {
                    console.error(e);
                }

            }




        }

        function handleMouseMoveDolly(event) {

            //console.log( 'handleMouseMoveDolly' );

            dollyEnd.set(event.clientX, event.clientY);

            dollyDelta.subVectors(dollyEnd, dollyStart);

            if (dollyDelta.y > 0) {

                dollyIn(getZoomScale());

            } else if (dollyDelta.y < 0) {

                dollyOut(getZoomScale());

            }

            dollyStart.copy(dollyEnd);

            try {
                scope.update();
            } catch (e) {
                console.error(e);
            }

        }

        function handleMouseMovePan(event) {

            //console.log( 'handleMouseMovePan' );

            panEnd.set(event.clientX, event.clientY);

            panDelta.subVectors(panEnd, panStart);

            pan(panDelta.x, panDelta.y);

            panStart.copy(panEnd);

            try {
                scope.update();
            } catch (e) {
                console.error(e);
            }

        }

        function handleMouseUp() {

            //console.log( 'handleMouseUp' );
            rotateChanged = false;
            scope.rotationVector.y = 0;
            scope.rotationVector.x = 0;
            isFlying = true;
            if (this.rightMode === 1) {
                updateLookAtPos();
            }
            isFlying = false;

        }

        function handleMouseWheel(event) {

            //console.log( 'handleMouseWheel' );
            state = STATE.DOLLY;
            if (event.deltaY < 0) {

                dollyOut(getZoomScale());

            } else if (event.deltaY > 0) {

                dollyIn(getZoomScale());

            }

            scope.update();
            state = STATE.NONE;
            changeLookAt();
            scope.dispatchEvent(new Events('zoom_change'));


        }


        function handleKeyDown(event) {

            //console.log( 'handleKeyDown' );

            switch (event.keyCode) {

                case scope.keys.UP:
                    is_UP_KeyDown = true;
                    break;
                case scope.keys.W:
                    is_W_KeyDown = true;
                    break;
                case scope.keys.BOTTOM:
                    is_BOTTOM_KeyDown = true;
                    break;
                case scope.keys.S:
                    is_S_KeyDown = true;
                    break;
                case scope.keys.LEFT:
                    is_LEFT_KeyDown = true;
                    break;
                case scope.keys.A:
                    is_A_KeyDown = true;
                    break;
                case scope.keys.RIGHT:
                    is_RIGHT_KeyDown = true;
                    break;
                case scope.keys.D:
                    is_D_KeyDown = true;
                    break;
                case scope.keys.Q:
                    is_Q_KeyDown = true;
                    scope.rotationVector.y = scope.rotateKeySpeed;
                    rotateChanged = true;

                    break;
                case scope.keys.E:
                    is_E_KeyDown = true;
                    scope.rotationVector.y = -scope.rotateKeySpeed;
                    rotateChanged = true;
                    break;
                case scope.keys.R:
                    is_R_KeyDown = true;
                    scope.rotationVector.x = scope.rotateKeySpeed;
                    rotateChanged = true;
                    break;
                case scope.keys.F:
                    is_F_KeyDown = true;
                    scope.rotationVector.x = -scope.rotateKeySpeed;
                    rotateChanged = true;
                    break;
                case scope.keys.X:
                    is_X_KeyDown = true;
                    upDownSpeed = scope.upDownSpeed;
                    updateLookAtPos(true);
                    break;
                case scope.keys.C:
                    is_C_KeyDown = true;
                    if (scope.object.position.y <= scope.minY) {
                        scope.object.position.y = scope.minY;
                        return;
                    }
                    upDownSpeed = -scope.upDownSpeed;
                    updateLookAtPos(true);
                    break;
                case scope.keys.SPACE:
                    //  var obj = {rotX:-0.6017605053174246,rotZ:0.014222864273255753,tarX:4847.899848753551,tarZ:-6501.384011899088,posX:4948.826014189851,posY:2757.8653055924538,rotY:0.02071404317482676,posZ:-2485.4113616524987};
                    //  scope.flyTo(obj);
                    break;

                case scope.keys.ADD: //加号
                case 187: //等号 为了笔记本
                    scope.keyPanSpeed += scope.keyPanSpeedStep;
                    if (scope.keyPanSpeed > scope.keyPanSpeedMax) {
                        scope.keyPanSpeed = scope.keyPanSpeedMax;
                    }
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    panOffset.set(0, 0, 0);
                    break;
                case scope.keys.SUB: //减号
                case 189: //-好为了笔记本
                    //console.log('sub');
                    scope.keyPanSpeed -= scope.keyPanSpeedStep;
                    if (scope.keyPanSpeed < scope.keyPanSpeedMin) {
                        scope.keyPanSpeed = scope.keyPanSpeedMin;
                    }
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    panOffset.set(0, 0, 0);
                    break;
            }
            moveCamera();


        }

        function moveCamera() {
            if (is_W_KeyDown || is_UP_KeyDown) {
                if (is_Up_Bottom_moving === false) {
                    is_Up_Bottom_moving = true;
                    pan(0, scope.keyPanSpeed, true);
                }
            }
            if (is_BOTTOM_KeyDown || is_S_KeyDown) {
                if (is_Up_Bottom_moving === false) {
                    is_Up_Bottom_moving = true;
                    pan(0, -scope.keyPanSpeed, true);
                }

            }

            if (is_LEFT_KeyDown || is_A_KeyDown) {
                if (is_left_right_moving === false) {
                    is_left_right_moving = true;
                    pan(scope.keyPanSpeed, 0, true);


                }
            }
            if (is_RIGHT_KeyDown || is_D_KeyDown) {
                if (is_left_right_moving === false) {
                    is_left_right_moving = true;
                    pan(-scope.keyPanSpeed, 0, true);
                }

            }



        }

        //屏幕坐标转换为x-z平面坐标
        function getScreenTo3dPos() {
            var vector = new THREE.Vector3();

            vector.set(
                0,
                0,
                0.5);

            vector.unproject(scope.object);

            var dir = vector.sub(scope.object.position).normalize();

            var distance = (-scope.object.position.y) / dir.y; //忽略那个轴的数据就设置那个轴数据

            var pos = scope.object.position.clone().add(dir.multiplyScalar(distance));


            return pos;
        }

        function handleTouchStartRotate(event) {

            //console.log( 'handleTouchStartRotate' );

            rotateStart.set(event.touches[1].pageX, event.touches[1].pageY);

        }

        function handleTouchStartDolly(event) {

            //console.log( 'handleTouchStartDolly' );

            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;

            var distance = Math.sqrt(dx * dx + dy * dy);

            dollyStart.set(0, distance);

        }

        function handleTouchStartPan(event) {

            //console.log( 'handleTouchStartPan' );

            panStart.set(event.touches[0].pageX, event.touches[0].pageY);

        }

        function handleTouchMoveRotate(event) {

            //console.log( 'handleTouchMoveRotate' );
            if (scope.rightMode === 0) {
                rotateEnd.set(event.touches[1].pageX, event.touches[1].pageY);
                rotateDelta.subVectors(rotateEnd, rotateStart);

                var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

                // rotating across whole screen goes 360 degrees around
                rotateLeft(scope.rotateMouseSpeed * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

                // rotating up and down along whole screen attempts to go 360, but limited to 180
                rotateUp(scope.rotateMouseSpeed * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

                rotateStart.copy(rotateEnd);

                var z1 = (scope.target.z - scope.object.position.z);
                var x1 = (scope.target.x - scope.object.position.x);
                var deg = THREE.Math.radToDeg(Math.atan2(-z1, x1));
                evtDispatcher.dispatchEvent(new Events(HzEvent.UPDATE_CAMERA_ROTATE, deg));

                // scope.update();
            } else {
                var tempY = event.touches[1].pageX;
                var tempX = event.touches[1].pageY;
                var diffX = tempX - rotateStart.x;
                var diffY = tempY - rotateStart.y;
                var rad = Math.atan2(-diffY, diffX);
                var degree = parseInt(THREE.Math.radToDeg(rad));

                rotateChanged = true;
                scope.rotationVector.y = 0;
                scope.rotationVector.x = 0;
                var dis = parseInt(Math.sqrt(diffX * diffX + diffY * diffY));
                scope.rotateKeySpeed = Math.min(0.005, dis * scope.rotateDisSpeed);

                var roX = parseFloat(scope.object.rotation.x).toFixed(2);
                if (roX == -half_PI) {
                    if (degree < 140 && degree > 70) {
                        scope.rotationVector.x = scope.rotateKeySpeed;
                    }
                    if ((degree >= 0 && degree <= 70) || (degree > -90 && degree < 0)) {
                        scope.rotationVector.y = -scope.rotateKeySpeed;
                    }
                    if ((degree >= 140 && degree <= 180) || (degree > -180 && degree < -90)) {
                        scope.rotationVector.y = scope.rotateKeySpeed;
                    }

                    try {
                        scope.update();
                    } catch (e) {
                        console.error(e);
                    }
                    return;
                }
                if (roX == half_PI) {
                    if (degree <= -50 && degree >= -120) {
                        scope.rotationVector.x = -scope.rotateKeySpeed;
                    }
                    if ((degree >= 0 && degree <= 90) || (degree > -50 && degree < 0)) {
                        scope.rotationVector.y = -scope.rotateKeySpeed;
                    }
                    if ((degree > 90 && degree <= 180) || (degree > -180 && degree < -120)) {
                        scope.rotationVector.y = scope.rotateKeySpeed;
                    }

                    try {
                        scope.update();
                    } catch (e) {
                        console.error(e);
                    }
                    return;
                }


                if ((degree >= -20 && degree <= 0) || (degree >= 0 && degree < 25)) //向右
                {
                    scope.rotationVector.y = -scope.rotateKeySpeed;
                } else if (degree >= 25 && degree < 65) //右上
                {
                    scope.rotationVector.y = -scope.rotateKeySpeed;
                    scope.rotationVector.x = scope.rotateKeySpeed;
                } else if (degree >= 65 && degree < 110) //向上
                {
                    scope.rotationVector.x = scope.rotateKeySpeed;
                } else if (degree >= 110 && degree < 160) //左上
                {
                    scope.rotationVector.y = scope.rotateKeySpeed;
                    scope.rotationVector.x = scope.rotateKeySpeed;
                } else if ((degree >= 160 && degree <= 180) || (degree >= -180 && degree < -160)) //正左
                {
                    scope.rotationVector.y = scope.rotateKeySpeed;
                } else if (degree >= -160 && degree < -115) //左下
                {
                    scope.rotationVector.y = scope.rotateKeySpeed;
                    scope.rotationVector.x = -scope.rotateKeySpeed;
                } else if (degree >= -115 && degree < -70) //正下
                {
                    scope.rotationVector.x = -scope.rotateKeySpeed;
                } else if (degree >= -70 && degree < -20) //右下
                {
                    scope.rotationVector.y = -scope.rotateKeySpeed;
                    scope.rotationVector.x = -scope.rotateKeySpeed;
                }

                //   scope.update();
            }


        }

        function handleTouchMoveDolly(event) {

            //console.log( 'handleTouchMoveDolly' );

            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;

            var distance = Math.sqrt(dx * dx + dy * dy);

            dollyEnd.set(0, distance);

            dollyDelta.subVectors(dollyEnd, dollyStart);

            if (dollyDelta.y > 0) {

                dollyOut(getZoomScale());

            } else if (dollyDelta.y < 0) {

                dollyIn(getZoomScale());

            }

            dollyStart.copy(dollyEnd);

            try {
                scope.update();
            } catch (e) {
                console.error(e);
            }

        }

        function handleTouchMovePan(event) {

            //console.log( 'handleTouchMovePan' );

            panEnd.set(event.touches[0].pageX, event.touches[0].pageY);

            panDelta.subVectors(panEnd, panStart);

            pan(panDelta.x, panDelta.y);

            panStart.copy(panEnd);

            //     scope.update();

        }

        function handleTouchEnd() {

            if (scope.enabled === false || scope.enabledMouse === false) return;

            handleMouseUp(event);

            changeLookAt(event);

            if (scope.object.position.y < scope.minY && pointIsBuilding === true) {
                scope.object.position.y = scope.minY;
            }

            updateLookAtPos();
            scope.dispatchEvent(endEvent);



            state = STATE.NONE;

        }

        //
        // event handlers - FSM: listen for events and reset state
        //

        function onMouseDown(event) {
            if (isArounding === true) {
                isArounding = false;
            }
            if (scope.enabled === false || scope.enabledMouse === false) return;
            if (is_left_right_moving === true || is_Up_Bottom_moving === true) return;
            if (isFlying === true && scope.curTween !== null) {
                scope.curTween.stop();
                isFlying = false;
                scope.curTween = null;
                update2dImage();
                changeLookAt();
                updateLookAtPos();
                return;
            }
            event.preventDefault();
            if (event.button === scope.mouseButtons.ORBIT) {

                if (scope.enableRotate === false) return;

                handleMouseDownRotate(event);

                state = STATE.ROTATE;


            } else if (event.button === scope.mouseButtons.ZOOM) {

                if (scope.enableZoom === false) return;

                handleMouseDownDolly(event);

                state = STATE.DOLLY;

            } else if (event.button === scope.mouseButtons.PAN) {

                if (scope.enablePan === false) return;

                handleMouseDownPan(event);

                state = STATE.PAN;

            }

            if (state !== STATE.NONE) {

                document.addEventListener('mousemove', onMouseMove, false);
                document.addEventListener('mouseup', onMouseUp, false);

                scope.dispatchEvent(startEvent);

            }

        }

        function onMouseMove(event) {

            if (scope.enabled === false || scope.enabledMouse === false) return;

            event.preventDefault();

            if (state === STATE.ROTATE) {

                if (scope.enableRotate === false) return;

                handleMouseMoveRotate(event);

            } else if (state === STATE.DOLLY) {

                if (scope.enableZoom === false) return;

                handleMouseMoveDolly(event);

            } else if (state === STATE.PAN) {

                if (scope.enablePan === false) return;

                handleMouseMovePan(event);

            }

        }

        function onMouseUp(event) {

            if (scope.enabled === false || scope.enabledMouse === false) return;

            handleMouseUp(event);

            document.removeEventListener('mousemove', onMouseMove, false);
            document.removeEventListener('mouseup', onMouseUp, false);

            changeLookAt(event);


            if (scope.object.position.y < scope.minY && pointIsBuilding === true) {
                scope.object.position.y = scope.minY;
            }

            updateLookAtPos();
            scope.dispatchEvent(endEvent);



            state = STATE.NONE;

        }

        function onMouseWheel(event) {
            if (isArounding === true) {
                isArounding = false;
            }
            if (scope.enabled === false || scope.enabledMouse === false || scope.enableZoom === false || (state !== STATE.NONE && state !== STATE.ROTATE)) return;

            event.preventDefault();
            event.stopPropagation();

            handleMouseWheel(event);
            var evt = new Events(HzEvent.MOUSE_WHEEL, event);
            evtDispatcher.dispatchEvent(evt); //发送到外部
            juestOutFloot();
            scope.dispatchEvent(startEvent); // not sure why these are here...
            scope.dispatchEvent(endEvent);

        }

        function onKeyDown(event) {
            if (isArounding === true) {
                isArounding = false;
            }
            if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return;
            isKeyDown = true;
            handleKeyDown(event);

        }

        function onKeyUp(event) {
            if (isArounding === true) {
                isArounding = false;
            }
            if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return;
            switch (event.keyCode) {

                case scope.keys.UP:
                    is_UP_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.W:
                    is_W_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.BOTTOM:
                    is_BOTTOM_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.S:
                    is_S_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.LEFT:
                    is_LEFT_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.A:
                    is_A_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.RIGHT:
                    is_RIGHT_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.D:
                    is_D_KeyDown = false;
                    panOffset.set(0, 0, 0); //一旦键盘抬起清空盘偏移量
                    is_Up_Bottom_moving = false;
                    is_left_right_moving = false;
                    break;
                case scope.keys.Q:
                    is_Q_KeyDown = false;
                    rotateChanged = false;
                    scope.rotationVector.y = 0;
                    break;
                case scope.keys.E:
                    is_E_KeyDown = false;
                    rotateChanged = false;
                    scope.rotationVector.y = 0;
                    break;
                case scope.keys.R:
                    is_R_KeyDown = false;
                    rotateChanged = false;
                    scope.rotationVector.x = 0;
                    break;
                case scope.keys.F:
                    is_F_KeyDown = false;
                    rotateChanged = false;
                    scope.rotationVector.x = 0;
                    break;
                case scope.keys.X:
                    is_X_KeyDown = false;
                    upDownSpeed = 0;
                    updateLookAtPos();
                    break;
                case scope.keys.C:
                    is_C_KeyDown = false;
                    upDownSpeed = 0;
                    updateLookAtPos();
                    break;
            }
            moveCamera();
            changeLookAt();
            isKeyDown = false;

        }

        function onTouchStart(event) {

            if (isArounding === true) {
                isArounding = false;
            }
            if (scope.enabled === false || scope.enabledMouse === false) return;
            if (is_left_right_moving === true || is_Up_Bottom_moving === true) return;
            if (isFlying === true && scope.curTween !== null) {
                scope.curTween.stop();
                isFlying = false;
                scope.curTween = null;
                return;
            }

            if (scope.enabled === false) return;
            //      console.log(event.touches.length);
            switch (event.touches.length) {

                // case 3: // one-fingered touch: rotate

                //     if (scope.enableRotate === false) return;

                //     handleTouchStartRotate(event);

                //     state = STATE.TOUCH_ROTATE;


                //     break;

                case 2: // two-fingered touch: dolly

                    // if (scope.enableZoom === false) return;

                    // handleTouchStartDolly(event);

                    // state = STATE.TOUCH_DOLLY;
                    if (scope.enableRotate === false) return;

                    handleTouchStartRotate(event);

                    state = STATE.TOUCH_ROTATE;

                    break;

                case 1: // three-fingered touch: pan

                    if (scope.enablePan === false) return;

                    handleTouchStartPan(event);

                    state = STATE.TOUCH_PAN;

                    break;

                default:

                    state = STATE.NONE;

            }

            if (state !== STATE.NONE) {

                scope.dispatchEvent(startEvent);

            }

        }

        this.onTouchMove = function (event) {

            if (scope.enabled === false || scope.enabledMouse === false) return;

            event.preventDefault();
            //    event.stopPropagation();
            //       console.log('touchMove', event.touches.length);
            switch (event.touches.length) {

                // case 3: // one-fingered touch: rotate

                //     // if (scope.enableRotate === false) return;
                //     // if (state !== STATE.TOUCH_ROTATE) return; // is this needed?...

                //     // handleTouchMoveRotate(event);

                //     break;

                case 2: // two-fingered touch: dolly

                    // if (scope.enableZoom === false) return;
                    // if (state !== STATE.TOUCH_DOLLY) return; // is this needed?...

                    // handleTouchMoveDolly(event);

                    if (scope.enableRotate === false) return;
                    if (state !== STATE.TOUCH_ROTATE) return; // is this needed?...

                    onTouchMoveData = event;
                    onTouchMoveFun = handleTouchMoveRotate;
                    //  handleTouchMoveRotate(event);

                    break;

                case 1: // three-fingered touch: pan

                    if (scope.enablePan === false) return;
                    if (state !== STATE.TOUCH_PAN) return; // is this needed?...

                    onTouchMoveData = event;
                    onTouchMoveFun = handleTouchMovePan;
                    // handleTouchMovePan(event);

                    break;

                default:

                    state = STATE.NONE;

            }

        };

        this.stopCameraMoving = function () {
            if (isFlying === true && scope.curTween !== null) {
                scope.curTween.stop();
                isFlying = false;
                scope.curTween = null;
                update2dImage();
                changeLookAt();
                updateLookAtPos();
            }
        };
        this.changeLookAt = function () {
            changeLookAt();
        };
        /**
         * 更新了2ddom的坐标
         */
        this.update2dImage = function () {
            update2dImage();
        };

        function onTouchEnd(event) {

            if (scope.enabled === false) return;

            handleTouchEnd(event);


            scope.dispatchEvent(endEvent);

            state = STATE.NONE;

        }

        function onContextMenu(event) {

            event.preventDefault();
            if (isArounding === true) {
                isArounding = false;
            }
        }

        function onRotate(e) {



            state = STATE.TOUCH_ROTATE;


            // rotating across whole screen goes 360 degrees around
            rotateLeft(e.velocityX * 0.1);

            // rotating up and down along whole screen attempts to go 360, but limited to 180
            rotateUp(e.velocityY * 0.1);

            try {
                scope.update();
            } catch (e) {
                console.error(e);
            }

        }


        // function onPinch(e) {
        //     state = STATE.TOUCH_DOLLY;
        //     console.log('bbbb');

        // }

        //
        this.initEvent = function () {
            scope.domElement.addEventListener('contextmenu', onContextMenu, false);

            scope.domElement.addEventListener('mousedown', onMouseDown, false);
            scope.domElement.addEventListener('wheel', onMouseWheel, false);

            scope.domElement.addEventListener('touchstart', onTouchStart, false);
            scope.domElement.addEventListener('touchend', onTouchEnd, false);
            scope.domElement.addEventListener("touchcancel", onTouchEnd, false);
            scope.domElement.addEventListener("touchleave", onTouchEnd, false);
            scope.domElement.addEventListener('touchmove', scope.onTouchMove, false);

            window.addEventListener('keydown', onKeyDown, false);
            window.addEventListener('keyup', onKeyUp, false);
        };
        scope.initEvent();





        // force an update at start

        try {
            scope.update();
        } catch (e) {
            console.error(e);
        }

    };


    DiyControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    DiyControls.prototype.constructor = DiyControls;

    Object.defineProperties(DiyControls.prototype, {



        center: {

            get: function () {

                console.warn('DiyControls: .center has been renamed to .target');
                return this.target;

            }

        },

        // backward compatibility

        noZoom: {

            get: function () {

                console.warn('DiyControls: .noZoom has been deprecated. Use .enableZoom instead.');
                return !this.enableZoom;

            },

            set: function (value) {

                console.warn('DiyControls: .noZoom has been deprecated. Use .enableZoom instead.');
                this.enableZoom = !value;

            }

        },

        noRotate: {

            get: function () {

                console.warn('DiyControls: .noRotate has been deprecated. Use .enableRotate instead.');
                return !this.enableRotate;

            },

            set: function (value) {

                console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
                this.enableRotate = !value;

            }

        },

        noPan: {

            get: function () {

                console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
                return !this.enablePan;

            },

            set: function (value) {

                console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
                this.enablePan = !value;

            }

        },

        noKeys: {

            get: function () {

                console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
                return !this.enableKeys;

            },

            set: function (value) {

                console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
                this.enableKeys = !value;

            }

        },

        staticMoving: {

            get: function () {

                console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
                return !this.enableDamping;

            },

            set: function (value) {

                console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
                this.enableDamping = !value;

            }

        },

        dynamicDampingFactor: {

            get: function () {

                console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
                return this.dampingFactor;

            },

            set: function (value) {

                console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
                this.dampingFactor = value;

            }

        }



    });

    return DiyControls;

});