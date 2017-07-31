/**
 * 轨迹跟踪
 */

define(['frm/events/EventConsts', 'THREE', 'frm/core/expand'], function (EventConsts, THREE, Expand) {


    var HzEvent = EventConsts.HzEvent;
    var Events = EventConsts.Events;
    var Pvo = function () {
        this.walkTime = 0; //运动时间
        this.startPos = null; //开启坐标
        this.endPos = null; //结束坐标
        this.rad = 0;
    };
    Pvo.prototype.constructor = Pvo;
    var TRACK_TYPE = {
        TOP: 0,
        LEFT: 1,
        RIGHT: 2,
        TOP_AFTER: 3
    };
    var Track = function (camera, scene) {
        this.hzThree = EventConsts.hzThree;
        var scope = this;
        this.camera = camera;
        this.scene = scene;
        this._mesh = null;
        this.walkSpeed = 60; //每秒移动速度
        this.pathData = [];
        this.pVoArray = []; //时间总数据
        this.stepNum = 0; //阶段数
        this.defalutY = 180; //默认高度
        this.positionTween = null;
        this.rotationTween = null;
        this.lastData = null;
        this.lastRotation = null; // new THREE.Vector3();
        this.lastPosition = null;
        this.curNode = null;
        this.line = null;
        this.trackType = TRACK_TYPE.TOP_AFTER; //默认头顶观察
        this.cameraDis = 2000; //观察距离
        this.cameraHeight = 1000; //摄像机高
        this.over = true;
        this.moveCall = null; // 移动回调




        this.trackUpdate = function () {

            switch (scope.trackType) {
                case TRACK_TYPE.TOP:
                    scope.camera.position.x = scope._mesh.position.x;
                    scope.camera.position.z = scope._mesh.position.z;
                    break;
                case TRACK_TYPE.LEFT:
                    var v = scope.deflectionRotation(scope._mesh.rotation.y - Math.PI / 2, scope._mesh.position.x, scope._mesh.position.z);
                    scope.camera.position.x = v.x;
                    scope.camera.position.z = v.y;
                    scope.camera.lookAt(scope._mesh.position);
                    break;
                case TRACK_TYPE.RIGHT:
                    var v1 = scope.deflectionRotation(scope._mesh.rotation.y + Math.PI / 2, scope._mesh.position.x, scope._mesh.position.z);
                    scope.camera.position.x = v1.x;
                    scope.camera.position.z = v1.y;
                    scope.camera.lookAt(scope._mesh.position);
                    break;
                case TRACK_TYPE.TOP_AFTER:
                    var v2 = scope.deflectionRotation(scope._mesh.rotation.y, scope._mesh.position.x, scope._mesh.position.z);
                    scope.camera.position.x = v2.x;
                    scope.camera.position.z = v2.y;
                    scope.camera.lookAt(scope._mesh.position);
                    break;
            }

            this.moveCall && this.moveCall(scope._mesh.position);
        };

        /**
         * 开始行走
         * @return {[type]} [description]
         */
        this.beginWalk = function () {
            if (scope.stepNum < scope.pVoArray.length) {
                if (scope.stepNum === 0) {
                    scope._mesh.rotation.y = scope.pVoArray[scope.stepNum].rad;
                    if (scope.trackType === TRACK_TYPE.TOP) {
                        scope.camera.rotateAroundWorldAxisY(scope.pVoArray[scope.stepNum].rad);
                        scope.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
                    }

                }
                if (scope.stepNum > 0) {
                    scope.lastData = scope.pVoArray[scope.stepNum - 1];
                }
                scope.curNode = scope.pVoArray[scope.stepNum];
                scope.startMove(scope.pVoArray[scope.stepNum]);
                scope.stepNum++;
                setTimeout(function () {
                    scope.hzThree.Controls.changeLookAt();
                }, 50);
                scope.hzThree.Controls.update2dImage();
            } else {
                var e = new Events(HzEvent.TRACK_OVER);
                scope.dispatchEvent(e);
                scope.over = true;
                scope.hzThree.setControlMouseEnable(true);
                scope.hzThree.setControlKeysEnable(true);
                scope.hzThree.Controls.enablePan = true;
                scope.hzThree.Controls.refreshLookAt();
                scope.hzThree.Controls.update2dImage();
                if (scope.line !== null) {
                    scope.scene.remove(scope.line);
                    scope.line.dispose();
                    scope.line = null;
                }
                if (scope._mesh !== null && scope.rotationTween === null) {
                    scope.scene.remove(scope._mesh);
                    scope._mesh.dispose();
                    scope._mesh = null;
                }
            }
        };
        this.startMove = function (data) {

            scope.positionTween = new TWEEN.Tween(data.startPos)
                .to(data.endPos, data.walkTime)
                .onUpdate(function () {
                    if (scope._mesh === null) return;
                    scope._mesh.position.x = this.x;
                    scope._mesh.position.z = this.z;
                    scope._mesh.position.y = this.y;
                    try {
                        scope.trackUpdate();
                    } catch (e) {
                        console.error(e);
                    }

                    scope.hzThree.Controls.update2dImage();
                })
                .onComplete(
                    scope.beginWalk
                )
                .start();


            if (scope.stepNum > 0) {
                data.rad = scope.checkAngle(scope.lastData.rad, data.rad);
                if (scope.rotationTween !== null) { //上次旋转还未结束就开启新的旋转
                    scope.rotationTween.stop();
                    scope.camera.updateMatrix();
                    scope.camera.updateMatrixWorld();

                }
                scope.rotationTween = new TWEEN.Tween(scope.lastData)
                    .to(data, 500)
                    .onUpdate(function () {
                        scope._mesh.rotation.y = this.rad;
                        scope.camera.rotation.x = 0;
                        scope.camera.rotation.y = 0;
                        scope.camera.rotation.z = 0;
                        scope.camera.updateMatrix();
                        scope.camera.updateMatrixWorld();

                        if (scope.trackType === TRACK_TYPE.TOP) {
                            scope.camera.rotateAroundWorldAxisY(this.rad);
                            scope.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
                        } else if (scope.trackType === TRACK_TYPE.LEFT) {
                            var v = scope.deflectionRotation(scope._mesh.rotation.y - Math.PI / 2, scope._mesh.position.x, scope._mesh.position.z);
                            scope.camera.position.x = v.x;
                            scope.camera.position.z = v.y;
                            scope.camera.lookAt(scope._mesh.position);
                        } else if (scope.trackType === TRACK_TYPE.RIGHT) {
                            var v1 = scope.deflectionRotation(scope._mesh.rotation.y + Math.PI / 2, scope._mesh.position.x, scope._mesh.position.z);
                            scope.camera.position.x = v1.x;
                            scope.camera.position.z = v1.y;
                            scope.camera.lookAt(scope._mesh.position);
                        } else if (scope.trackType === TRACK_TYPE.TOP_AFTER) {
                            var v2 = scope.deflectionRotation(scope._mesh.rotation.y, scope._mesh.position.x, scope._mesh.position.z);
                            scope.camera.position.x = v2.x;
                            scope.camera.position.z = v2.y;
                            scope.camera.lookAt(scope._mesh.position);
                        }


                    })
                    .onComplete(
                        function () {
                            scope.rotationTween = null;
                            if (scope._mesh !== null && scope.over === true) {
                                scope.scene.remove(scope._mesh);
                                scope._mesh.dispose();
                                scope._mesh = null;
                            }
                        }

                    )

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

            //  var posObj = {};
            var disLen = scope.lastPosition.distanceTo(scope.curNode.endPos);
            var useTime = Math.floor(disLen / this.walkSpeed) * 100;



            scope.positionTween = new TWEEN.Tween(scope.lastPosition)
                .to(scope.curNode.endPos, useTime)
                .onUpdate(function () {
                    scope._mesh.position.x = this.x;
                    scope._mesh.position.z = this.z;
                    scope._mesh.position.y = this.y;
                    try {
                        scope.trackUpdate();
                    } catch (e) {
                        console.error(e);
                    }
                    scope.hzThree.Controls.update2dImage();
                })
                .onComplete(
                    scope.beginWalk
                )
                .start();


            new TWEEN.Tween(scope._mesh.rotation)
                .to(ratObj, 500)
                .onUpdate(function () {
                    if (scope._mesh === null) return;
                    scope._mesh.rotation.x = this.x;
                    scope._mesh.rotation.y = this.y;
                    scope._mesh.rotation.z = this.z;



                    scope.camera.rotation.x = 0;
                    scope.camera.rotation.y = 0;
                    scope.camera.rotation.z = 0;
                    scope.camera.updateMatrix();
                    scope.camera.updateMatrixWorld();


                    if (scope.trackType === TRACK_TYPE.TOP) {
                        scope.camera.rotateAroundWorldAxisY(this.y);
                        scope.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
                    } else if (scope.trackType === TRACK_TYPE.LEFT) {
                        var v = scope.deflectionRotation(scope._mesh.rotation.y - Math.PI / 2, scope._mesh.position.x, scope._mesh.position.z);
                        scope.camera.position.x = v.x;
                        scope.camera.position.z = v.y;
                        scope.camera.lookAt(scope._mesh.position);
                    } else if (scope.trackType === TRACK_TYPE.RIGHT) {
                        var v1 = scope.deflectionRotation(scope._mesh.rotation.y + Math.PI / 2, scope._mesh.position.x, scope._mesh.position.z);
                        scope.camera.position.x = v1.x;
                        scope.camera.position.z = v1.y;
                        scope.camera.lookAt(scope._mesh.position);
                    } else if (scope.trackType === TRACK_TYPE.TOP_AFTER) {
                        var v2 = scope.deflectionRotation(scope._mesh.rotation.y, scope._mesh.position.x, scope._mesh.position.z);
                        scope.camera.position.x = v2.x;
                        scope.camera.position.z = v2.y;
                        scope.camera.lookAt(scope._mesh.position);
                    }

                })
                .onComplete(
                    function () {
                        scope.lastRotation = null;
                        if (scope.camera.position.equals(scope.pVoArray[scope.pVoArray.length - 1].endPos) === true) {
                            var e = new Events(HzEvent.TRACK_OVER);
                            scope.dispatchEvent(e);
                            scope.over = true;
                            scope.hzThree.setControlMouseEnable(true);
                            scope.hzThree.setControlKeysEnable(true);
                            scope.hzThree.Controls.enablePan = true;
                            scope.hzThree.Controls.refreshLookAt();
                            scope.hzThree.Controls.update2dImage();
                            if (scope.line !== null) {
                                scope.scene.remove(scope.line);
                                scope.line.dispose();
                                scope.line = null;
                            }
                            if (scope._mesh !== null && scope.rotationTween === null) {
                                scope.scene.remove(scope._mesh);
                                scope._mesh.dispose();
                                scope._mesh = null;
                            }
                        }
                    }

                )
                .start();
        };
        /**
         * 绘制路径
         * @return {[type]} [description]
         */
        this.drawPath = function () {
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                depthTest: true
            });
            var geometry = new THREE.Geometry();
            var vector3, point;
            for (var index = 0; index < scope.pathData.length; index++) {
                point = scope.pathData[index];
                vector3 = new THREE.Vector3(parseFloat(point.x), parseFloat(point.y), parseFloat(point.z));
                geometry.vertices.push(vector3);
            }

            scope.line = new THREE.Line(geometry, material);
            scope.scene.add(scope.line);
        };

        /**
         * 角度旋转
         * @param  {[type]} rad [description]
         * @param  {[type]} x   [description]
         * @param  {[type]} y   [description]
         * @return {[type]}     [description]
         */
        this.deflectionRotation = function (rad, x, y) {
            var x1 = Math.sin(rad) * scope.cameraDis + x;
            var y1 = Math.cos(rad) * scope.cameraDis + y;
            return new THREE.Vector2(x1, y1);
        };
    };
    Object.assign(Track.prototype, THREE.EventDispatcher.prototype, {
        /**
         * 设定自定义模型
         * @param {[type]} mesh [description]
         */
        setDiyMesh: function (mesh) {
            if (this._mesh !== null) {
                this.scene.remove(this._mesh);
                this._mesh.dispose();
                this._mesh = null;
            }
            this._mesh = mesh;
            this.scene.add(this._mesh);

        },

        /**
         * 重置摄像头
         * @type {[type]}
         */
        resetCamrer: function () {
            this.camera.rotation.x = 0;
            this.camera.rotation.y = 0;
            this.camera.rotation.z = 0;
            this.camera.position.y = this.cameraHeight;
            this.camera.updateMatrix();
            this.camera.updateMatrixWorld();
            this.hzThree.Controls.update2dImage();


            this._mesh.rotation.x = 0;
            this._mesh.rotation.y = 0;
            this._mesh.rotation.z = 0;
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
                var startPos = new THREE.Vector3(parseFloat(preObj.x), parseFloat(this.defalutY) + parseFloat(preObj.y), parseFloat(preObj.z));
                var endPos = new THREE.Vector3(parseFloat(endObj.x), parseFloat(this.defalutY) + parseFloat(endObj.y), parseFloat(endObj.z));
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
            this.resetCamrer();
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
            if (Object.prototype.toString.call(arr) === '[object Array]') {
                this.pathData = arr.slice();
            } else if (arr.constructor == String) {
                this.pathData = JSON.parse(arr);
            }
            this.analysisData();
            this.drawPath();
        },
        /**
         * 如果在运行的过程中 可以暂停动画
         * @return {[type]} [description]
         */
        pause: function () {
            if (this.positionTween !== null && this._mesh !== null) {
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
                if (this.positionTween != null) {
                    this.positionTween.stop();
                    this.positionTween = null;
                }
                this.resumedCameraRotation();
            }
        },
        setIsEditRoute: function (val) {
            this.hzThree._isEditRoute = val;
            this.hzThree.MapRoute.enable(this.hzThree._isEditRoute);

        },
        getRouteList: function () {
            return this.hzThree.MapRoute.getRouteList();
        },
        setTrackParam: function (val) {

            if (val.hasOwnProperty('viewType') === true && val.viewType !== undefined) {
                this.trackType = val.viewType;
            }
            if (val.hasOwnProperty('model') === true && val.model !== undefined) {
                this.setDiyMesh(val.model);
            }

        },
        setRoutePath: function (arr) {
            this.hzThree.MapRoute.setData(arr);

        },
        /**
         * 清除所有点
         * @return {[type]} [description]
         */
        clearRoute: function () {
            this.hzThree.MapRoute.clearAll();
        },

        setTrackPath: function (arr, data) {
            this.setTrackParam(data);
            this.setPathData(arr);
            this.hzThree.setControlMouseEnable(false);
            this.hzThree.setControlKeysEnable(false);
            this.hzThree.Controls.enablePan = false;
            this.hzThree.tweenRunning = true;
        },

        trackToggle: function () {
            if (this.hzThree.tweenRunning === true) {
                this.pause();
                this.hzThree.tweenRunning = false;
            } else {
                this.goPlay();
                this.hzThree.tweenRunning = true;
            }
        },

        stopTrack: function () {
            if (this.rotationTween !== null) {
                this.rotationTween.stop();
                this.rotationTween = null;
            }
            if (this.positionTween != null) {
                this.positionTween.stop();
                this.positionTween = null;
            }

            this.hzThree.setControlMouseEnable(true);
            this.hzThree.setControlKeysEnable(true);
            this.hzThree.Controls.enablePan = true;
            this.hzThree.Controls.refreshLookAt();
            this.hzThree.Controls.update2dImage();
            this.hzThree.tweenRunning = true;
            this.moveCall = null;

            if (this.line !== null) {
                this.scene.remove(this.line);
                this.line.dispose();
                this.line = null;
            }
            if (this._mesh !== null && this.rotationTween === null) {
                this.scene.remove(this._mesh);
                this._mesh.dispose();
                this._mesh = null;
            }
            var e = new Events(HzEvent.TRACK_OVER);
            this.dispatchEvent(e);
            this.over = true;
        }


    });
    return Track;

});