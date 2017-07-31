/**
 * 根据传入的数据 进行3d物体的移动展示 此过程中不影响鼠标的其他操作
 */
define(function(require) {
    require('THREE');
    require('frm/core/expand');
    var MoveObject3d = require('frm/component/MoveObject3d');
    var EventConsts = require('frm/events/EventConsts');
    var HzEvent = EventConsts.HzEvent;
    var Events = EventConsts.Events;
    var MovingManager = function() {
        var scope = this;
        let movingArray = [];
        let movingMap = {};
        let lineMap = {};

        let scene = EventConsts.scene;
        this.evt = EventConsts.evtDispatcher;
        this.evt.addEventListener(HzEvent.MOVEOBJ3D_STOP, movingStop);
        this.evt.addEventListener(HzEvent.MOVEOBJ3D_UPDATE, movingUpdate);

        /**
         * 
         * @param {停止通知} e 
         */
        function movingStop(e) {
            let key = movingArray.indexOf(e.data);
            if (key > -1) {
                scope.dispatchEvent(new Events(MovingManager.event.MOVING_STOP, {
                    tid: e.data.targetId,
                    data: e.data.userData,
                    target: e.data._mesh
                }));
            }
        }

        /**
         * 刷新时进行触发
         * @param {} e 
         */
        function movingUpdate(e) {
            let key = movingArray.indexOf(e.data);
            if (key > -1) {
                scope.dispatchEvent(new Events(MovingManager.event.MOVING_3D_UPDATE, {
                    targetId: e.data.targetId,
                    tid: e.data.targetId,
                    data: e.data.userData,
                    pos3: e.data._mesh.position,
                    pos2: e.data._mesh.toScreenPosition()
                }));
            }
        }

        /**
         * 创建移动物体目标
         * {
         *   targetId:唯一标识
         *   target:显示对象
         *   data:自定义数据
         *   path:移动轨迹            
         *   showPath:true/false 默认为不显示
         *   speed:60 移动速度
         *   lineColor:0x0000ff;//线段颜色
         * }
         * 
         */
        this.createMoving = function(data) {
            let mesh = null;
            let pathData = null;
            let lineColor = 0x00000ff;
            if (data.target === undefined) {
                console.warn('确实显示对象');
                return;
            } else {
                mesh = data.target;
            }
            if (data.lineColor !== undefined) {
                lineColor = data.lineColor;
            }

            scope.deleteMoving(data.targetId); //创建之前先删除

            let movingObj = new MoveObject3d();
            movingObj.walkSpeed = data.speed || 60;
            movingObj.setDiyMesh(mesh, false);
            movingObj.targetId = data.targetId;
            movingObj.userData = data.data;
            movingObj.setPathData(pathData = data.path);

            movingArray.push(movingObj);
            movingMap[data.targetId] = movingObj;


            let showPath = data.showPath;
            //需要展示path
            if (showPath === true) {
                let material = new THREE.LineBasicMaterial({
                    color: lineColor,
                    depthTest: true
                });
                let geometry = new THREE.Geometry();
                let vector3, point;
                for (var index = 0; index < pathData.length; index++) {
                    point = pathData[index];
                    vector3 = new THREE.Vector3(parseFloat(point.x), parseFloat(point.y), parseFloat(point.z));
                    geometry.vertices.push(vector3);
                }

                let line = new THREE.Line(geometry, material);
                scene.add(line);
                lineMap[data.targetId] = line;
            }







        };
        /**
         * 删除移动对象
         */
        this.deleteMoving = function(targetId) {
            let target = movingMap[targetId];
            if (target) {
            	movingArray.remove(target);

                target.stop();
                target.dispose(false);
                target = null;

                delete movingMap[targetId];
            }

            let line = lineMap[targetId]; //删除可能拥有的line
            if (line) {
                scene.remove(line);
                line.dispose();
                line = null;
            }

        };
    };

    Object.assign(MovingManager.prototype, THREE.EventDispatcher.prototype, {});

    MovingManager.event = {
        MOVING_STOP: 'moving_stop', //MovingManager 创造的移动对象停止移动
        MOVING_3D_UPDATE: 'moving_3d_update' //MovingManager 创造的移动对象每帧事件
    };

    return MovingManager;
});