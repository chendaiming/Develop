/**
 * 纯展示二维物体
 */
define(function(require) {

    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');
    var Object2D = function(div, data, scene) {
        var _this = this;
        this.clickCallBack = null;
        this.div = div;
        this.data = data;
        this.imgW = 0;
        this.imgH = 0;
        this.spanW = 0;
        this.spanH = 0;
        this.minDis = data.minDis || 10;
        this.maxDis = data.maxDis || 5000;
        this.enableVisible = true;
        this.showText = data.showText;
 
        var frustum = EventConsts.frustum;
        var camera = EventConsts.camera;
        var position = data.position;
        var posX = parseFloat(position.x);
        var posY = parseFloat(position.y);
        var posZ = parseFloat(position.z);
        var style, rect;

        if (data.html) {
        	var htmlObj = this.div.childNodes[0];
        	if (htmlObj) {
        		rect = htmlObj.getBoundingClientRect();

        		this.imgW = this.spanW = rect.width;
                this.imgH = this.spanH = rect.height;
        	}
        } else {
        	var span = this.div.getElementsByTagName('span');
        	if (span.length) {
                rect = span[0].getBoundingClientRect();
                style = span[0].style;

                if (data.showText != undefined) {
                	style.display = data.showText ? 'block' : 'none';
                } else {
                	style.display = 'block';
                }
            }

        	var img = this.div.getElementsByTagName('img');
            if (img.length > 0) { //有图
                this.imgW = img[0].width;
                this.imgH = img[0].height;

                if (rect) {
                    style.position = 'absolute';
                    style.top = '50%';
                    style.left = this.imgW + 'px';
                    style.wordBreak = 'keep-all';
                    style.marginTop = -rect.height / 2 + 'px';
                }
            } else { //无图
                this.spanW = rect.width;
                this.spanH = rect.height;
            }
        }
        

        var lineHeight = data.lineHeight || 0;

        if (lineHeight) {
            this.position = new THREE.Vector3(posX, posY + lineHeight, posZ);

            var vector3 = new THREE.Vector3(posX, posY, posZ);
            var geometry = new THREE.Geometry();
            geometry.vertices.push(vector3);
            geometry.vertices.push(this.position);

            var material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 10,
                depthTest: true
            });

            this.line = new THREE.Line(geometry, material);
            this.sphere = createSphere(vector3);
            scene.add(this.line);
            scene.add(this.sphere);
        } else {
            this.position = new THREE.Vector3(posX, posY, posZ);
        }


        this.worldPos2ScreenPos = function(pos) {
            var vector = new THREE.Vector3();
            vector.x = pos.x;
            vector.y = pos.y;
            vector.z = pos.z;

            // TODO: need to update this when resize window
            var widthHalf = 0.5 * EventConsts.renderer.context.canvas.width;
            var heightHalf = 0.5 * EventConsts.renderer.context.canvas.height;

            // this.updateMatrixWorld();
            // vector.setFromMatrixPosition(this.matrixWorld);
            vector.project(EventConsts.camera);

            vector.x = (vector.x * widthHalf) + widthHalf;
            vector.y = -(vector.y * heightHalf) + heightHalf;

            return {
                x: vector.x,
                y: vector.y
            };

        };
        this.updatePos = function() {

            var b = frustum.containsPoint(_this.position);
            var dis = camera.position.distanceTo(_this.position);
            var disBool = true;
            if (dis < _this.minDis || dis > _this.maxDis) {
                disBool = false;
            }
            if (b === true && disBool === true && _this.enableVisible === true) {
                var pos = _this.worldPos2ScreenPos(_this.position);
                _this.div.style.visibility = 'visible';
                if (_this.imgW > 0 && _this.imgH > 0) {
                    _this.div.style.left = (pos.x - _this.imgW / 2) + 'px';
                    _this.div.style.top = (pos.y - _this.imgH) + 'px';
                } else {
                    _this.div.style.left = (pos.x - _this.spanW / 2) + 'px';
                    _this.div.style.top = (pos.y - _this.spanH) + 'px';
                }
            } else {
                _this.div.style.visibility = 'hidden';
            }

        };


        /**
         * 是否正常像是 true 为可见 false为不可见
         */
        this.setVisible = function(b) {
            _this.enableVisible = b;
            if (b === true) {
                var pos = _this.worldPos2ScreenPos(_this.position);
                _this.div.style.visibility = 'visible';
                if (_this.imgW > 0 && _this.imgH > 0) {
                    _this.div.style.left = (pos.x - _this.imgW / 2) + 'px';
                    _this.div.style.top = (pos.y - _this.imgH) + 'px';
                } else {
                    _this.div.style.left = (pos.x - _this.spanW / 2) + 'px';
                    _this.div.style.top = (pos.y - _this.spanH) + 'px';
                }
            } else {
                _this.div.style.visibility = 'hidden';
            }
            _this.line && (_this.line.visible = b);
            _this.sphere && (_this.sphere.visible = b);
        };

        /*
         * 显示文本
         */
        this.showText = function (visible) {
        	var span = _this.div.getElementsByTagName('span');
        	if (span && span.length) {
        		span[0].style.display = visible ? 'block' : 'none';
        	}
        }


        function clickFun(e) {
            e.clickTarget = _this;
            e.data = _this.data;
            _this.clickCallBack(e);
        }

        /**
         * 注册事件
         */
        this.on = function(type, callBackFun) {
            if (type === 'click') {
                _this.clickCallBack = callBackFun;
                _this.div.addEventListener('click', clickFun, false);
                _this.div.addEventListener('touchstart', clickFun, false);
            } else {
                _this.div.addEventListener(type, callBackFun, false);
            }
        };

        this.off = function(type, callBackFun) {
            if (type === 'click') {
                this.dispose();
            } else {
                _this.div.removeEventListener(type, callBackFun);
            }
        };

        this.dispose = function() {
            _this.div.removeEventListener('click', clickFun);
            _this.div.removeEventListener('touchstart', clickFun);
            _this.clickCallBack = null;

            if (this.line) {
                scene.remove(this.line);
                this.line.dispose();
                this.line = null;
            }

            if (this.sphere) {
                scene.remove(this.sphere);
                this.sphere.dispose();
                this.sphere = null;
            }
        };
        _this.updatePos();
    };
    Object.assign(Object2D.prototype, THREE.EventDispatcher.prototype, {

    });


    function createSphere(position) {
        var geometry = new THREE.SphereGeometry(4, 16, 16);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        material.alphaTest = 0.1;
        material.opacity = 0.9;
        material.transparent = true;

        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = position.x;
        sphere.position.y = position.y;
        sphere.position.z = position.z;

        return sphere;
    }


    return Object2D;
});