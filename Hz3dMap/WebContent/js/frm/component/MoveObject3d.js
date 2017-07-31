define(['frm/events/EventConsts', 'THREE'], function (EventConsts, THREE) {

    var HzEvent = EventConsts.HzEvent;
    var Events = EventConsts.Events;
    var Pvo = function () {
        this.walkTime = 0; //运动时间
        this.startPos = null; //开启坐标
        this.endPos = null; //结束坐标
        this.rad = 0;
    };
    Pvo.prototype.constructor = Pvo;

    var MoveObject3d = function () {
        var scope = this;
        this.classType = 'MoveObject3d';
        this._mesh = null;
        this.hzThree = EventConsts.hzThree;
        this.evt = EventConsts.evtDispatcher;
        this.walkSpeed = 600; //每秒移动速度
        this.scene = EventConsts.scene;
        this.camera = EventConsts.camera;
        this.pathData = [];
        this.pVoArray = []; //时间总数据
        this.stepNum = 0; //阶段数
        this.positionTween = null;
        this.rotationTween = null;
        this.lastData = null;
        this.lastRotation = null; // new THREE.Vector3();
        this.lastPosition = null;
        this.over = false;
        this.userData = null; //自定义数据

        /**
         * 开始行走
         * @return {[type]} [description]
         */
        this.beginWalk = function () {
            if (scope.stepNum < scope.pVoArray.length) {
                if (scope.stepNum === 0) {
                    scope._mesh.rotation.y = scope.pVoArray[scope.stepNum].rad;
                }
                if (scope.stepNum > 0) {
                    scope.lastData = scope.pVoArray[scope.stepNum - 1];
                }
                scope.curNode = scope.pVoArray[scope.stepNum];
                scope.startMove(scope.pVoArray[scope.stepNum]);
                scope.stepNum++;
            } else {
  
                var e = new Events(HzEvent.MOVEOBJ3D_STOP, scope);
                scope.evt.dispatchEvent(e);
                scope.over = true;


            }
        };
        this.nextStep = function () {
            if (scope.positionTween === null && scope.rotationTween === null) {
                scope.beginWalk();
            }

        };
        this.startMove = function (data) {
            scope.positionTween = new TWEEN.Tween(data.startPos)
                .to(data.endPos, data.walkTime)
                .onUpdate(function () {
                    if (scope._mesh) {
                        scope._mesh.position.x = this.x;
                        scope._mesh.position.z = this.z;
                        scope._mesh.position.y = this.y;
                    }
                    updateEvent();
                })
                .onComplete(
                    function () {
                        scope.positionTween = null;
                        updateEvent();
                        scope.nextStep();

                    }

                ).start();
             



            if (scope.stepNum > 0) {
                data.rad = scope.checkAngle(scope.lastData.rad, data.rad);
                scope.rotationTween = new TWEEN.Tween(scope.lastData)
                    .to(data, 100)
                    .onUpdate(function () {
                        if (scope._mesh) {
                            scope._mesh.rotation.y = this.rad;
                        }
                    })
                    .onComplete(function () {
                        scope.rotationTween = null;
                        scope.nextStep();
                    })
                    .start();
            }
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
            var ratObj = {};
            ratObj.y = scope.checkAngle(scope._mesh.rotation.y, scope.curNode.rad);
            ratObj.x = scope.checkAngle(scope._mesh.rotation.x, 0);
            ratObj.z = scope.checkAngle(scope._mesh.rotation.z, 0);


            var disLen = scope.lastPosition.distanceTo(scope.curNode.endPos);
            var useTime = Math.floor(disLen / this.walkSpeed) * 100;



            scope.positionTween = new TWEEN.Tween(scope.lastPosition)
                .to(scope.curNode.endPos, useTime)
                .onUpdate(function () {
                    if (scope._mesh) {
                        scope._mesh.position.x = this.x;
                        scope._mesh.position.z = this.z;
                        scope._mesh.position.y = this.y;
                    }
                    updateEvent();
                })
                .onComplete(
                    function () {
                        updateEvent();
                        scope.positionTween = null;
                        scope.nextStep();
                    }

                )
                .start();


            scope.rotationTween = new TWEEN.Tween(scope._mesh.rotation)
                .to(ratObj, 100)
                .onUpdate(function () {
                    if (scope._mesh) {
                        scope._mesh.rotation.x = this.x;
                        scope._mesh.rotation.y = this.y;
                        scope._mesh.rotation.z = this.z;
                    }
                })
                .onComplete(
                    function () {
                        scope.lastRotation = null;
                        scope.nextStep();
                        // if (scope.camera.position.equals(scope.pVoArray[scope.pVoArray.length - 1].endPos) === true) {
                        //     var e = new Events(HzEvent.MOVEOBJ3D_STOP);
                        //     scope.dispatchEvent(e);
                        //     scope.over = true;
                        //
                        // }
                    }

                )
                .start();
        };

        function updateEvent() {
            if (scope.evt) {
                scope.evt.dispatchEvent(new Events(HzEvent.MOVEOBJ3D_UPDATE, scope));
            }
        }
    };

    Object.assign(MoveObject3d.prototype, THREE.EventDispatcher.prototype, {

            setDiyMesh: function (mesh, needAddScene = true) {
                if (this._mesh !== null) {
                    this.stop();
                    this.scene.remove(this._mesh);
                    this._mesh.dispose();
                    this._mesh = null;
                }
                this._mesh = mesh;
                if (needAddScene === true) {
                    this.scene.add(this._mesh);
                }
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
                    var startPos = new THREE.Vector3(parseFloat(preObj.x), parseFloat(preObj.y), parseFloat(preObj.z));
                    var endPos = new THREE.Vector3(parseFloat(endObj.x), parseFloat(endObj.y), parseFloat(endObj.z));
                    var disLen = startPos.distanceTo(endPos);
                    var useTime = Math.floor(disLen / this.walkSpeed) * 100;
                    var rad = Math.atan2(((-endPos.z) - (-startPos.z)), (endPos.x - startPos.x)) - Math.PI / 2;
                    var pVo = new Pvo();
                    pVo.walkTime = useTime;
                    pVo.startPos = startPos;
                    pVo.endPos = endPos;
                    pVo.rad = rad;
                    this.pVoArray.push(pVo);
                    preObj = endObj;
                }
                this.stepNum = 0;
                this.beginWalk();
            },

            /**
             * 传入路径数据 并开启行走路径
             * @param {[type]} arr [description]
             */
            setPathData: function (arr) {
                this.pathData.removeAll();
                this.pVoArray.removeAll();
                this.over = false;
                if (this._mesh !== null && this._mesh.visible === false) {
                    this._mesh.visible = true;
                }
                if (Array.isArray(arr)) {
                    this.pathData = arr.slice();
                } else if (arr.constructor == String) {
                    this.pathData = JSON.parse(arr);
                }
                this.analysisData();
            },
            /**
             * 如果在运行的过程中 可以暂停动画
             * @return {[type]} [description]
             */
            pause: function () {
                if (this.positionTween !== null) {
                    //保存暂停后的镜头角度 为了恢复后保持角度

                    this.lastRotation = new THREE.Vector3();
                    this.lastRotation.x = this._mesh.rotation.x;
                    this.lastRotation.y = this._mesh.rotation.y;
                    this.lastRotation.z = this._mesh.rotation.z;

                    this.lastPosition = new THREE.Vector3();
                    this.lastPosition.x = this._mesh.position.x;
                    this.lastPosition.y = this._mesh.position.y;
                    this.lastPosition.z = this._mesh.position.z;
                }
            },
            /**
             * 继续运行动画
             * @return {[type]} [description]
             */
            goPlay: function () {
                if (this.positionTween !== null && this.lastRotation !== null) {
                    if (this.rotationTween !== null) {
                        this.rotationTween.stop();
                        this.rotationTween = null;
                    }
                    if (this.positionTween !== null) {
                        this.positionTween.stop();
                        this.positionTween = null;
                    }
                    this.resumedCameraRotation();
                }

            },
            stop: function () {
                if (this.rotationTween !== null) {
                    this.rotationTween.stop();
                    this.rotationTween = null;
                }
                if (this.positionTween !== null) {
                    this.positionTween.stop();
                    this.positionTween = null;
                }
                if (this._mesh !== null) {
                    this._mesh.visible = false;
                }
            },
            dispose: function (removeMeshBool) {
                this.stop();

                if (this._mesh !== null && removeMeshBool === true) {
                    this.scene.remove(this._mesh);
                    this._mesh.dispose();
                    this._mesh = null;
                }
                this._mesh = null;
                this.hzThree = undefined;
                this.evt = undefined;
                this.walkSpeed = undefined; //每秒移动速度
                this.scene = undefined;
                this.camera = undefined;
                this.pathData = [];
                this.pVoArray = []; //时间总数据
                this.stepNum = 0; //阶段数
                this.positionTween = null;
                this.rotationTween = null;
                this.lastData = null;
                this.lastRotation = null; // new THREE.Vector3();
                this.lastPosition = null;
                this.over = false;
                this.userData = null; //自定义数据       
            }
        }

    );
    return MoveObject3d;
});