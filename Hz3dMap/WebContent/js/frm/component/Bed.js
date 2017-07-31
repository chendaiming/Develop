/**
 * 床铺类
 * @type {[type]}
 */
define(function(require) {
    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');
    // var clone_id = 0;
    var Bed = function() {
        THREE.Object3D.call(this);
        var bedMap = EventConsts.bedCache;
        var scope = this;
        this.type = 'Bed';
        this.downData = undefined;
        this.upData = undefined;
        this.bed = null;
        this.bedName = '';

        function makePanelSprite(data, callBack) {
            var canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            var context = canvas.getContext('2d');

            var img = new Image(); // 创建img元素
            //  img.width = 500;
            //    img.height = 500;
            img.onload = function() {

                context.fillStyle = "rgba(133,122,122,0.5)";
                context.fillRect(0, 0, canvas.width, canvas.height / 2);

                context.drawImage(img, 0, 0, img.width, img.height, 100, 100, img.width, img.height);
                context.font = "48px 宋体";
                context.fillStyle = "rgba(255,255,255,1)";
                var outName = '姓名:' + data.name;
                var outId = '编号:' + data.id;
                context.fillText(outName, img.width + 120, 170);
                context.fillText(outId, img.width + 120, 320);
                var texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;

                var spriteMaterial = new THREE.SpriteMaterial({
                    map: texture

                });
                var sprite = new THREE.Sprite(spriteMaterial);
                callBack.apply(null, [sprite]);
            }
            img.src = data.img; // 设置图片源地址
        };
        this.createOjbect = function() {
            if (bedMap.hasOwnProperty(scope.bedName) === false) {
                console.warn('没有找到床:' + scope.bedName + '的模型原型');
            }
            scope.bed = bedMap[scope.bedName].clone();
            scope.add(scope.bed);
            if (scope.upData !== undefined) {
                makePanelSprite(scope.upData, function(val) {
                    val.position.y = 200;
                    val.scale.set(100, 100, 100);
                    scope.add(val);

                });
            }
            if (scope.downData !== undefined) {
                makePanelSprite(scope.downData, function(val) {
                    val.position.y = 50;
                    val.scale.set(100, 100, 100);
                    scope.add(val);
                });
            }
        };
    }
    Bed.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        constructor: Bed,
        /**
         * {
         *  bedType:'bedName'
         *  up:{img:                     //上铺数据
         *       id:
         *       name:
         *
         *     },
         *  down:{                       //下铺数据
         *       img:
         *       id:
         *       name:
         *       }
         * }
         * @param {[type]} val [description]
         */
        setData: function(val) {
            if (val.bedName === undefined) {
                console.warn('没有传入床的类型');
                return;
            }
            this.bedName = val.bedName;
            if (val.down !== undefined) {
                this.downData = val.down;
            }
            if (val.up !== undefined) {
                this.upData = val.up;
            }

            this.createOjbect();
        }
    });
    return Bed;
});