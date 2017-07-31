//继承原有threejs 类扩展其功能
define(['frm/events/EventConsts', 'THREE', 'frm/component/DiyLine'], function(EventConsts, THREE, DiyLine) {

    var expand = function() {
        //   var Events = EventConsts.Events;
        //  var HzEvent = EventConsts.HzEvent;
        // var MouseEvent = EventConsts.MouseEvent;
        var ModelEvent = EventConsts.ModelEvent;
        var objectNameMap = EventConsts.objectNameMap;
        var objectIdMap = EventConsts.objectIdMap;
        var ObjectSrcType = EventConsts.ObjectSrcType;
        // var camera = EventConsts.camera;
        let raycast = new THREE.Raycaster();


        var disposeMaterials = function(material) {
            if ((material instanceof THREE.MultiMaterial) === true) {
                for (var i = 0; i < material.materials.length; i++) {
                    disposeMaterials(material.materials[i]);
                }


            } else {
                //做材质处理
                material.dispose();
                if (material.map !== undefined && material.map !== null) {
                    material.map.dispose();
                }

                material = undefined;
            }
        };
        var disposeMesh = function(mesh) {

            mesh.geometry.dispose();
            disposeMaterials(mesh.material);
            mesh = undefined;
        };
        Number.prototype.getNum = function(n) {
            return (Math.floor(this * (Math.pow(10, n))) / Math.pow(10, n));
        };
        Array.prototype.remove = function(item) {
            var index = this.indexOf(item);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        /**
         * 添加对象 如果有重复的item 只会添加一次
         * @param {Object} item
         */
        Array.prototype.add = function(item) {
            var index = this.indexOf(item);
            if (index === -1) {
                this.push(item);
            }
        };
        //数组中删除相同的坐标值  必须是Vector3
        Array.prototype.uniqueVector3 = function() {
            var a = {},
                c = [],
                l = this.length;
            for (var i = 0; i < l; i++) {
                var b = this[i];
                var d = b.x + '_' + b.y + '_' + b.z;
                if (a[d] === undefined) {
                    c.push(b);
                    a[d] = 1;
                }
            }
            return c;
        };
        /**
         * 清空数组内的数据
         */
        Array.prototype.removeAll = function() {
            this.splice(0, this.length);
        };

        THREE.EventDispatcher.prototype.on = function(type, listener) {
            this.addEventListener(type, listener);
        };
        THREE.EventDispatcher.prototype.emit = function(event) {
            this.dispatchEvent(event);
        };

        THREE.EventDispatcher.prototype.off = function(type, listener) {
            this.removeEventListener(type, listener);
        };



        THREE.EventDispatcher.prototype.hasEvent = function(type) {

            if (type === undefined || type === null) return false;
            if (this._listeners === undefined) return false;

            var listeners = this._listeners;

            if (listeners[type] !== undefined && listeners[type].length > 0) {

                return true;

            }

            return false;
        };

        THREE.Object3D.prototype.hasEvent = function(type) {
            if (type === undefined || type === null) return false;
            if (this._listeners === undefined) return false;

            var listeners = this._listeners;

            if (listeners[type] !== undefined && listeners[type].length > 0) {

                return true;

            }

            return false;
        };
        THREE.Object3D.prototype.activeModelArray = [];
        THREE.Object3D.prototype.superAddEventListener = THREE.Object3D.prototype.addEventListener;
        THREE.Object3D.prototype.superRemoveEventListener = THREE.Object3D.prototype.removeEventListener;


        //真正以mesh注册事件
        var proxyAddEventListener = function(scope, type, listener) {
            if (scope.hasEvent(ModelEvent.MODEL_CLICK) === false &&
                scope.hasEvent(ModelEvent.MODEL_DOUBLE_CLICK) === false &&
                scope.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === false &&
                scope.hasEvent(ModelEvent.MODEL_ROLL_OVER) === false &&
                scope.hasEvent(ModelEvent.MODEL_ROLL_OUT) === false &&
                scope.isOnBorder === false

            ) {
                THREE.Object3D.prototype.activeModelArray.add(scope);
            }
            scope.superAddEventListener(type, listener);

        };
        //**
        THREE.Object3D.prototype.on = function(type, listener) {

            proxyAddEventListener(this, type, listener);


        };
        THREE.Object3D.prototype.isParentGroup = function() {
            if (this.parent !== undefined && this.parent !== null && this.parent.type == "Group") {
                return true;
            }
            return false;
        };

        var proxRemoveEventListener = function(scope, type, listener) {

            scope.superRemoveEventListener(type, listener); //先删除侦听事件


            if (scope.hasEvent(ModelEvent.MODEL_CLICK) === false &&
                scope.hasEvent(ModelEvent.MODEL_DOUBLE_CLICK) === false &&
                scope.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === false &&
                scope.hasEvent(ModelEvent.MODEL_ROLL_OVER) === false &&
                scope.hasEvent(ModelEvent.MODEL_ROLL_OUT) === false &&
                scope.isOnBorder === false
            ) {
                THREE.Object3D.prototype.activeModelArray.remove(scope);
            }
        };
        THREE.Object3D.prototype.off = function(type, listener) {

            proxRemoveEventListener(this, type, listener);
        };
        /**
         * 触发事件
         * @param {Object} event
         */
        THREE.Object3D.prototype.emit = function(event) {
            THREE.Object3D.prototype.dispatchEvent(event);
        };
        /**
         * 删除该事件上左右的侦听器  主要用于匿名函数的方法
         * @param {Object} type
         */
        THREE.Object3D.prototype.removeAllListener = function(type) {
            if (this._listeners === undefined) return;

            var listeners = this._listeners;
            var listenerArray = listeners[type];

            while (listenerArray.length > 0) {
                listenerArray.splice(0, 1);
            }
            if (this.hasEvent(ModelEvent.MODEL_CLICK) === false &&
                this.hasEvent(ModelEvent.MODEL_DOUBLE_CLICK) === false &&
                this.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === false &&
                this.hasEvent(ModelEvent.MODEL_ROLL_OVER) === false &&
                this.hasEvent(ModelEvent.MODEL_ROLL_OUT) === false &&
                this.isOnBorder === false
            ) {
                THREE.Object3D.prototype.activeModelArray.remove(this);
            }

        };
        /**
         * 删除该对象上的所有事件监听
         * @return {[type]} [description]
         */
        THREE.Object3D.prototype.removeAllEvents = function() {
            if (this._listeners === undefined) return;

            var listeners = this._listeners;

            for (var type in listeners) {
                var listenerArray = listeners[type];
                while (listenerArray.length > 0) {
                    listenerArray.splice(0, 1);
                }
                listenerArray = undefined;
            }
            this._listeners = undefined;



        };

        /**
         * Mesh 被删除后调用 释放资源
         */
        THREE.Object3D.prototype.dispose = function() {
            if (objectNameMap.hasOwnProperty(this.name) === true && this.name !== undefined && this.name !== null && this.name !== "") //删除缓存关联
            {
                delete objectNameMap[this.name];
                delete objectIdMap[this.id];

            }
            if (this.type == 'Group') {
                for (var i = 0; i < this.children.length; i++) {
                    disposeMesh(this.children[i]);
                }

            } else if (this.type == 'Mesh') {
                disposeMesh(this);
            } else if (this.type == 'Sprite') {
                disposeMaterials(this.material);
            }
            if (this.label !== null) {
                this.label.dispose();
                this.label = null;
            }

            THREE.Object3D.prototype.removeAllEvents(); //清除所有事件注册
            THREE.Object3D.prototype.activeModelArray.remove(this); //在循环中数组删除该对象


        };
        /**
         * 是否开启外边框
         * @param {Object} val  true为开启 false为不开启
         */
        THREE.Object3D.prototype.onBorder = function(val) {
            this.isOnBorder = val;
            if (this.isOnBorder === true) {
                THREE.Object3D.prototype.activeModelArray.add(this);
            } else {


                EventConsts.removeBorder(this);
                if (this.hasEvent(ModelEvent.MODEL_CLICK) === false &&
                    this.hasEvent(ModelEvent.MODEL_DOUBLE_CLICK) === false &&
                    this.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === false &&
                    this.hasEvent(ModelEvent.MODEL_ROLL_OVER) === false &&
                    this.hasEvent(ModelEvent.MODEL_ROLL_OUT) === false &&
                    this.isOnBorder === false
                ) {
                    THREE.Object3D.prototype.activeModelArray.remove(this);
                }


            }
        };
        /**
         * 设置是否显示高亮显示
         * @param {Object} val  true为显示
         */
        THREE.Object3D.prototype.setBorderShow = function(val) {
            this.isBorderShow = val;
            if (this.isBorderShow === true) {
                EventConsts.addBorder(this);
            } else {
                EventConsts.removeBorder(this);
            }

        };
        /**
         * 重新设定Group或者Mesh的名字
         * @param {Object} val
         */
        THREE.Object3D.prototype.setName = function(val) {
            if (val !== undefined && val !== null && val !== "") {
                if ((this instanceof THREE.Group) === true || (this instanceof THREE.Mesh) === true) //只有mesh Group需要缓存
                {
                    if (objectNameMap.hasOwnProperty(val) === true) {
                        console.warn('已经为其他对象设置了' + val + '的命名');
                        return;
                    }
                    objectNameMap[val] = this;
                }
            }
        };
        /**
         * 根据世界轴二旋转
         * @param  {[type]}  axis    [description]
         * @param  {[type]}  radians [description]
         * @return {Boolean}         [description]
         */
        THREE.Object3D.prototype.rotateAroundWorldAxis = function(axis, radians) {
            var rotWorldMatrix = new THREE.Matrix4();
            rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

            // old code for Three.JS pre r54:
            //  rotWorldMatrix.multiply(object.matrix);
            // new code for Three.JS r55+:
            rotWorldMatrix.multiply(this.matrix); // pre-multiply

            this.matrix = rotWorldMatrix;

            // old code for Three.js pre r49:
            // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
            // old code for Three.js pre r59:
            // object.rotation.setEulerFromRotationMatrix(object.matrix);
            // code for r59+:
            this.rotation.setFromRotationMatrix(this.matrix);

            this.updateMatrix();
            this.updateMatrixWorld();
        };
        /**
         * 根据世界y轴进行旋转
         * @param  {[type]}  radians [description]
         * @return {Boolean}         [description]
         */
        THREE.Object3D.prototype.rotateAroundWorldAxisY = function(radians) {
            var v = new THREE.Vector3(0, 1, 0);
            this.rotateAroundWorldAxis(v, radians);
        };
        /**
         * 得到该对象投影到屏幕的坐标
         * @return {[type]} [description]
         */
        THREE.Object3D.prototype.toScreenPosition = function() {
            var vector = new THREE.Vector3();


            // TODO: need to update this when resize window
            var widthHalf = 0.5 * EventConsts.renderer.context.canvas.width;
            var heightHalf = 0.5 * EventConsts.renderer.context.canvas.height;

            this.updateMatrixWorld();
            vector.setFromMatrixPosition(this.matrixWorld);
            vector.project(EventConsts.camera);

            vector.x = (vector.x * widthHalf) + widthHalf;
            vector.y = -(vector.y * heightHalf) + heightHalf;

            return {
                x: vector.x,
                y: vector.y
            };
        };
        THREE.Object3D.prototype.showYArrow = function(value = true, color = 0xFF0000, radius = 1, bottomRadius = 3, bottomColor = 0x00FFFF) {
            if (value === true) { //展示向下的箭头
                var scene = EventConsts.scene;
                raycast.set(this.position.clone(), new THREE.Vector3(0, -1, 0));
                var result = raycast.intersectObjects(scene.children, true);

                if (result.length > 0) {
                    var pos = result[0].point;
                    var line = new DiyLine(this.position.clone(), pos, radius, color);
                    if (this.parent !== undefined) {
                        this.parent.add(line);
                        this.yline = line;

                        var geometry = new THREE.SphereBufferGeometry(bottomRadius, 32, 32);
                        var material = new THREE.MeshBasicMaterial({ color: bottomColor });
                        var circle = new THREE.Mesh(geometry, material);
                        this.parent.add(circle);
                        circle.position.copy(pos);
                        this.ylineBottom = circle;
                        circle.raycast = function(raycaster, intersects) {
                            return false;
                        };

                    }
                } else {
                    console.warn('没有找到该对象对应的y值目标showYArrow');
                }
            } else {
                if (this.yline !== undefined) {
                    this.parent.remove(this.yline);
                    this.yline.dispose();
                    this.yline = undefined;
                    delete this.yline;
                }
                if (this.ylineBottom !== undefined) {
                    this.parent.remove(this.ylineBottom);
                    this.ylineBottom.dispose();
                    this.ylineBottom = undefined;
                    delete this.ylineBottom;
                }
            }

        };
        /**
         * 更新y坐标
         */
        THREE.Object3D.prototype.updateYArrow = function() {
            if (this.yline !== undefined) {
                var scene = EventConsts.scene;
                this.parent.remove(this.yline);

                var radius = this.yline.radius;
                var color = this.yline.color;
                this.yline.dispose();

                var pos0 = this.position.clone();                
                pos0.y -= 100;
                raycast.set(pos0, new THREE.Vector3(0, -1, 0));
                var result = raycast.intersectObjects(scene.children, true);
                if (result.length > 0) {
                    var pos = result[0].point;
                    this.yline = new DiyLine(this.position.clone(), pos, radius, color);
                    this.parent.add(this.yline);
                    if (this.ylineBottom !== undefined) {
                        this.ylineBottom.position.copy(pos);
                    }
                } else {
                    console.warn('没有找到该对象对应的y值目标updateYArrow');
                }
            }
        };

        // THREE.MTLLoader.MaterialCreator.prototype.createMaterial_ = function(materialName) {
        //     var scope = this;
        //     var mat = this.materialsInfo[materialName];
        //     var params = {
        //
        //         name: materialName,
        //         side: this.side
        //
        //     };
        //
        //     var resolveURL = function(baseUrl, url) {
        //
        //         if (typeof url !== 'string' || url === '')
        //             return '';
        //
        //         // Absolute URL
        //         if (/^https?:\/\//i.test(url)) {
        //             return url;
        //         }
        //
        //         return baseUrl + url;
        //     };
        //
        //     function setMapForType(mapType, value) {
        //
        //         if (params[mapType]) return; // Keep the first encountered texture
        //
        //         var texParams = scope.getTextureParams(value, params);
        //         var map = scope.loadTexture(resolveURL(scope.baseUrl, texParams.url));
        //
        //         map.repeat.copy(texParams.scale);
        //         map.offset.copy(texParams.offset);
        //
        //         map.wrapS = scope.wrap;
        //         map.wrapT = scope.wrap;
        //
        //         params[mapType] = map;
        //     }
        //
        //     for (var prop in mat) {
        //
        //         var value = mat[prop];
        //
        //         if (value === '') continue;
        //
        //         switch (prop.toLowerCase()) {
        //
        //             // Ns is material specular exponent
        //
        //             case 'kd':
        //
        //                 // Diffuse color (color under white light) using RGB values
        //
        //                 params.color = new THREE.Color().fromArray(value);
        //
        //                 break;
        //
        //             case 'ks':
        //
        //                 // Specular color (color when light is reflected from shiny surface) using RGB values
        //                 params.specular = new THREE.Color().fromArray(value);
        //
        //                 break;
        //
        //             case 'map_kd':
        //
        //                 // Diffuse texture map
        //
        //                 setMapForType("map", value);
        //
        //                 break;
        //
        //             case 'map_ks':
        //
        //                 // Specular map
        //
        //                 setMapForType("specularMap", value);
        //
        //                 break;
        //
        //             case 'map_bump':
        //             case 'bump':
        //
        //                 // Bump texture map
        //
        //                 setMapForType("normalMap", value);
        //
        //                 break;
        //
        //             case 'ns':
        //
        //                 // The specular exponent (defines the focus of the specular highlight)
        //                 // A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.
        //
        //                 params.shininess = parseFloat(value);
        //
        //                 break;
        //
        //             case 'd':
        //
        //                 if (value < 1) {
        //
        //                     params.opacity = value;
        //                     params.transparent = true;
        //
        //                 }
        //
        //                 break;
        //
        //             case 'Tr':
        //
        //                 if (value > 0) {
        //
        //                     params.opacity = 1 - value;
        //                     params.transparent = true;
        //
        //                 }
        //
        //                 break;
        //
        //             default:
        //                 break;
        //
        //         }
        //
        //     }
        //
        //     this.materials[materialName] = new THREE.MeshPhongMaterial(params);
        //     return this.materials[materialName];
        // };




        THREE.Object3D.prototype.isBorderShow = false;
        THREE.Object3D.prototype.isOnBorder = false;
        THREE.Object3D.prototype.bornType = ObjectSrcType.LOAD; //对象产生方式
        THREE.Object3D.prototype.objectType = ''; //对象类型
        THREE.Object3D.prototype.label = null;
        THREE.Object3D.prototype.proxParent = null;
        THREE.Object3D.prototype.isCtrBuilding = true; //是否受控于Building操作 默认是受控制的




        // Object.defineProperty(THREE.Object3D.prototype, 'parent', {
        //     get: function() {
        //         return this.proxParent;
        //     },
        //     set: function(val) {
        //
        //         this.proxParent = val;
        //     }
        // });

    };

    return expand();
});