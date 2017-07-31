define(['frm/events/EventConsts', 'frm/extra/THREE.MeshLine', 'frm/component/MoveObject3d', 'frm/component/DiyLine'], function (EventConsts, MeshLineContainer, MoveObject3d, DiyLine) {
    var MeshLine = MeshLineContainer.MeshLine;
    var MeshLineMaterial = MeshLineContainer.MeshLineMaterial;


    var HzEvent = EventConsts.HzEvent;
    // var Events = EventConsts.Events;
    var PowerGrid = function () {
        this.classType = 'PowerGrid';
        this.hzThree = EventConsts.hzThree;
        var scope = this;
        this.evt = EventConsts.evtDispatcher;
        this.lineWidth = {};
        this.lineColor = {};
        this.electronColor = {};
        this.pathDataMap = {};
        this.powerGridMap = {};
        this.electronInterval = 1000; //间隔事件
        this.electronWaitArray = []; //等待电子
        this.electronUseArray = []; //正在使用的电子
        this.intervalMap = {}; //定时器id保存期
        this.prefix = 'PowerGrid_';

        function electStop(e) {
            var elect = e.data;
            if (elect.classType == 'PowerGrid') {
                elect.userData = null;
                elect._mesh.visible = false;
                scope.electronUseArray.remove(elect);
                scope.electronWaitArray.add(elect);

            }
        }

        this.evt.addEventListener(HzEvent.MOVEOBJ3D_STOP, electStop);


        var electron = null;
        var curRadius = null;
        var setRadius = null;
        var setScale = 1;

        /**
         * 展示电子移动根据每条路径展示
         * @return {[type]} [description]
         */
        this.showElectron = function (pathName, path) {
            if (scope.hzThree.isPageShow === false) return;

            // 根据线的宽度设置球的半径（默认是线的两倍）
            setRadius = (scope.lineWidth[pathName] || 10) * 2;

            if (scope.electronWaitArray.length > 0) {
                electron = scope.electronWaitArray.shift();

                // 根据当前线的半径同比例设置球的半径
                curRadius = electron._mesh.geometry.parameters.radius;
                setScale = setRadius/curRadius;

                electron._mesh.scale.x = setScale;
                electron._mesh.scale.y = setScale;
                electron._mesh.scale.z = setScale;
                electron._mesh.material.needsUpdate = true;
                electron._mesh.material.color.set(scope.electronColor[pathName]);

            } else {
                var geometry = new THREE.SphereGeometry(setRadius, 32, 32);
                var material = new THREE.MeshBasicMaterial({
                    color: scope.electronColor[pathName]
                });
                var sphere = new THREE.Mesh(geometry, material);
                electron = new MoveObject3d();
                electron.setDiyMesh(sphere);
                electron.classType = 'PowerGrid';
            }
            electron.userData = pathName;
            scope.electronUseArray.push(electron);

            electron.setPathData(path);
        };

        this.showLine = function (pathName, pathData) {
            // var geometry = new THREE.Geometry();
            // for (var index = 0; index < pathData.length; index++) {
            //     var v = new THREE.Vector3(pathData[index].x, pathData[index].y, pathData[index].z);
            //     geometry.vertices.push(v);
            // }
            // var g = new MeshLine();
            // g.setGeometry(geometry);

            // var material = new MeshLineMaterial({
            //     useMap: false,
            //     color: new THREE.Color(scope.lineColor[pathName]),
            //     opacity: 1,
            //     resolution: scope.hzThree.resolution,
            //     sizeAttenuation: true,
            //     lineWidth: scope.lineWidth[pathName],
            //     side: THREE.DoubleSide,
            //     near: 10,
            //     far: 1000
            // });
            // var mesh = new THREE.Mesh(g.geometry, material);
            // scope.hzThree.sceneAdd(mesh);
            // scope.powerGridMap[pathName] = mesh;
            var arr = [];
            for (var index = 1; index < pathData.length; index++) {
                var startPos = new THREE.Vector3(pathData[index-1].x, pathData[index-1].y, pathData[index-1].z);
                var endPos = new THREE.Vector3(pathData[index].x, pathData[index].y, pathData[index].z);
                var line = new DiyLine(startPos,endPos,scope.lineWidth[pathName],new THREE.Color(scope.lineColor[pathName]));
                scope.hzThree.sceneAdd(line);
                arr.push(line);                
            }
            scope.powerGridMap[pathName] = arr;


        };
        this.showBall = function (pathName, pathData) {
            scope.intervalMap[pathName] = setInterval(scope.showElectron, scope.electronInterval, pathName, scope.pathDataMap[pathName]);
            scope.showElectron(pathName, pathData);

        };
    };
    Object.assign(PowerGrid.prototype, THREE.EventDispatcher.prototype, {
        setIsEditRoute: function (val) {
            this.hzThree._isEditRoute = val;
            this.hzThree.MapRoute.enable(this.hzThree._isEditRoute);
        },
        /**
         * 清除所有点
         * @return {[type]} [description]
         */
        clearRoute: function () {
            this.hzThree.MapRoute.clearAll();
        },
        setPowerGridParam: function (data) {
            function strToHexCharCode(str) {
                if (str === undefined) return false;
                if (typeof (str) == 'number') return str;
                if (str === "") return "";
                var value = str.substr(2);
                return parseInt(value, 16);
            }
            if (data.hasOwnProperty('pathName') === false) {
                console.error('请传入路线名称');
                return;
            }
            var pathName = this.prefix + data.pathName;
            if (data.hasOwnProperty('lineColor') === true && !isNaN(data.lineColor)) {

                this.lineColor[pathName] = strToHexCharCode(data.lineColor);
            } else {
                this.lineColor[pathName] = 0xFF0000;
            }
            if (data.hasOwnProperty('lineWidth') === true && !isNaN(data.lineWidth)) {
                this.lineWidth[pathName] = parseInt(data.lineWidth);
            } else {
                this.lineWidth[pathName] = 10;
            }
            if (data.hasOwnProperty('electronColor') === true && !isNaN(data.electronColor)) {
                this.electronColor[pathName] = strToHexCharCode(data.electronColor);
            } else {
                this.electronColor[pathName] = 0x00FF00;
            }

            if (this.powerGridMap[pathName] !== undefined) {
                this.hzThree.sceneRemove(this.powerGridMap[pathName]);
              //  this.powerGridMap[pathName].dispose();
                this.clearLine( this.powerGridMap[pathName]);
                this.showLine(pathName, this.pathDataMap[pathName]);
            }



            var temp_electronColor = this.electronColor.pathName;
            //可能只在运行中改变
            var allElectronArray = this.electronWaitArray.concat(this.electronUseArray);
            for (var index = 0; index < allElectronArray.length; index++) {
                var electron = allElectronArray[index];
                if (electron.userData == pathName) {
                    electron._mesh.material.needsUpdate = true;
                    electron._mesh.material.color.set(temp_electronColor);

                }

            }
        },
        setRoutePath: function (arr) {
            this.hzThree.MapRoute.setData(arr);
        },
        getRouteList: function () {
            return this.hzThree.MapRoute.getRouteList();
        },
        showPowerGrid: function (data) {
            if (data.hasOwnProperty('pathName') === true && data.hasOwnProperty('pathData') === true) {
                if (data.pathData.length === 0) {
                    console.warn('路径数组不能为空');
                    return;
                }
                var pathName = this.prefix + data.pathName;
                this.pathDataMap[pathName] = data.pathData; //设置键值关系
                var isShowElect = true;
                if (data.isShowElect !== undefined) {
                    isShowElect = data.isShowElect;
                }
                this.showLine(pathName, data.pathData);
                if (isShowElect === true) {
                    this.showBall(pathName, data.pathData);
                }

            }


        },
        clearAllPowerGrid: function () {
            for (var k in this.powerGridMap) {
                this.hzThree.sceneRemove(this.powerGridMap[k]);
                this.clearLine(this.powerGridMap[k]);
               // this.powerGridMap[k].dispose();
                delete this.powerGridMap[k];
                clearInterval(this.intervalMap[k]);
                var allElectronArray = this.electronUseArray.concat(this.electronWaitArray);
                for (var index = 0; index < allElectronArray.length; index++) {
                    var elect = allElectronArray[index];
                    elect.stop();
                    elect.userData = null;
                    this.electronUseArray.remove(elect);
                    this.electronWaitArray.remove(elect);
                    elect.dispose();
                    elect = undefined;

                }
            }



        },
        clearPowerGrid: function (pathName) {
            pathName = this.prefix + pathName;
            if (this.powerGridMap.hasOwnProperty(pathName) === true) {
                this.hzThree.sceneRemove(this.powerGridMap[pathName]);
               // this.powerGridMap[pathName].dispose();
                this.clearLine(this.powerGridMap[pathName]);
                delete this.powerGridMap[pathName];
                clearInterval(this.intervalMap[pathName]);
                for (var index = 0; index < this.electronUseArray.length; index++) {
                    var elect = this.electronUseArray[index];
                    if (elect.userData == pathName) {
                        elect.stop();
                        elect.userData = null;
                        this.electronUseArray.remove(elect);
                        this.electronWaitArray.add(elect);
                    }
                }

            }
        },

        clearLine:function(arr)
        {

            for(var index=0;index<arr.length;index++)
            {
                 var line = arr[index];
                 this.hzThree.sceneRemove(line);
                 line.dispose();
                 line = null;
            }
            arr = null;
        }

    });
    return PowerGrid;
});