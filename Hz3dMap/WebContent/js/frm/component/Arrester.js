//阻车器类 用法与door相似
// 地表阻尼的锚点说明
// zuni_da_id001_001_a/d_090_000_T026  地刺     原点在旋转轴的点 默认为开启 关闭角度15度
//         唯一编号 对应的模型编号  角度逆时针/顺时针 地刺类型   
// zuni_da_id001_001_a/d_090_000_T027  柱子     原点在柱子底部 默认也是开启
// 原型 zuni_001_T026 

define(function (require) {
    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');

    var Arrester = function (obj) {
        var hzThree = EventConsts.hzThree;
        var arresterCache = EventConsts.arresterCache;
        var Events = EventConsts.Events;
        var HzEvent = EventConsts.HzEvent;
        THREE.Object3D.call(this);
        var scope = this;
        this.isOpen = true;
        var ancher = obj;
        var isMoving = false;
        obj.visible = false;
        this.type = "arrester";


        var allNameArray = ancher.name.split('_'); //分解锚点名
        var arresterId = allNameArray[2];
        var arresterClassId = allNameArray[3];
        var operateSign = allNameArray[4];
        var arresterType = allNameArray[7];
        var arresterClassName = 'zuni_' + arresterClassId + "_" + arresterType;
        var instanceName = 'zuni_' + arresterId + "_" + arresterType;

        var instance;
        var degree = 0;
        if (operateSign === 'a') { //a代表正 d代表负
            degree = parseFloat(allNameArray[5] + '.' + allNameArray[6]);
        } else {
            degree = -parseFloat(allNameArray[5] + '.' + allNameArray[6]);
        }
        var rad = THREE.Math.degToRad(degree);
        if (arresterCache.hasOwnProperty(arresterClassName) === false) {
            console.warn('没有找到相对应的阻装器:' + arresterClassName);
            return false;
        }
        instance = arresterCache[arresterClassName].clone();


        var box = new THREE.Box3().setFromObject( instance );    
        var boxMin = box.min;
        var boxMax = box.max;
        var boxH = (boxMax.y - boxMin.y);

        ancher.geometry.computeBoundingSphere();
        var pos = (ancher.geometry.boundingSphere.center.clone());

     
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = pos.z;
        this.rotation.y = rad;
        this.name = instanceName;
        this.add(instance);

 
        function rotationArrester(startRot, endRot) {
            startRot = THREE.Math.degToRad(startRot);
            endRot = THREE.Math.degToRad(endRot);
            if (isMoving === true) {
                console.warn('阻止器正在运动中，禁止操作');
                return;
            }
            isMoving = true;
            var fromObj = {
                rad: startRot
            };
            var toObj = {
                rad: endRot
            };
            new TWEEN.Tween(fromObj).to(toObj, 2000)
                .onUpdate(function () {
                    instance.rotation.x = this.rad;
                }).onComplete(function () {
                    isMoving = false;
                    var e;
                    if (instance.rotation.x <= 0) //代表关闭
                    {
                        scope.isOpen = true;
                        e = new Events(HzEvent.ARRESTER_CLOSE, this.name);
                        hzThree.emit(e);
                    } else {
                        scope.isOpen = false;
                        e = new Events(HzEvent.ARRESTER_OPEN, this.name);
                        hzThree.emit(e);
                    }
                }).start();
        }

        function moveArrester(startPos, endPos) {
            if (isMoving === true) {
                console.warn('阻止器正在运动中，禁止操作');
                return;
            }
            isMoving = true;
            var fromObj = {
                pos: startPos
            };
            var toObj = {
                pos: endPos
            };
            new TWEEN.Tween(fromObj).to(toObj, 2000)
                .onUpdate(function () {
                    instance.position.y = this.pos;
                }).onComplete(function () {
                    isMoving = false;
                    var e;
                    if (instance.position.y <= 0) //代表关闭
                    {
                        scope.isOpen = false;
                        e = new Events(HzEvent.ARRESTER_CLOSE, this.name);
                        hzThree.emit(e);
                    } else {
                        scope.isOpen = true;
                        e = new Events(HzEvent.ARRESTER_OPEN, this.name);
                        hzThree.emit(e);
                    }
                }).start();
        }


        this.open = function () {
            if(scope.isOpen===true)
            {
                 console.log("地刺"+this.name +"已经打开");
                 return;
            }
            if (arresterType === "T026") { //有地刺  翻转角度15度 绕x轴
                rotationArrester(30, 0);
            } else if (arresterType === "T027") { //柱子 直接升起模型高度
                moveArrester((instance.position.y),0);
            }
        };
        this.close = function () {
            if(scope.isOpen===false)
            {
                console.log("地刺"+this.name +"已经关闭");
                return;
            }
            if (arresterType === "T026") {
                rotationArrester(0, 30);
            } else if (arresterType === "T027") {
                moveArrester(0,-(instance.position.y+boxH));
            }
        };


    };
    Arrester.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {

        constructor: Arrester

    });
    return Arrester;
});