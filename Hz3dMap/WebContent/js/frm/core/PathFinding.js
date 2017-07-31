define(function(require) {
    require('THREE');
    var Partor = require('Patrol');
    var Handler = require('frm/handler/Handler');
    /**
     * 添加寻路的参数
     */
    var PathFinding = function() {

        THREE.EventDispatcher.call(this);
        var scope = this;
        var PathFindingMap = {};
        var navMeshMap = {};
        var navGeoMap = {};
        this.pathMesh = null;
        this.playerNavMeshGroup = null;
        this.calculatedPath = null;
        this.zoneMeshGroup = {};

        this.zoneY = {};


        this.computeWoker = new Worker("js/frm/core/ComputeWorker.js");
        this.findPathCallBack = null; //在这里传递回调函数 返回的参数 第一个为区域名 第二个为找到的路径
        this.callId = 1;
        this.callbackPools = {};
        this.connectWorker = false; //子进程是否建立连接
        this.flushCmdArray = []; //缓存命令数组

        /**
         * 使用方法
         * hzThree.PathFinding.getPathZone('whjds_xydl_f02_001_T025').findPath(beginPos, endPos);
         * 寻找路径 找到了返回路径数组 没有找到返回null
         */
        this.findPath = function(zoneName) {
            //寻找路径 找到了返回路径数组 没有找到返回null
            function findPath(beginPos, endPos, callback) {
                var callId = scope.callId++;

                beginPos.y = scope.zoneY[zoneName];
                endPos.y = scope.zoneY[zoneName];

                scope.callbackPools[callId] = callback;
                scope.computeWoker.postMessage({
                    msgId: callId,
                    cmd: 'find_path',
                    begin: beginPos,
                    end: endPos,
                    zoneName: zoneName,
                    group: scope.zoneMeshGroup[zoneName]
                });
            }
            return {
                findPath: findPath
            };


        };
        /**
         * 使用方法 
         * true为显示
         * false 为不显示   
         * hzThree.PathFinding.getPathZone('whjds_xydl_f02_001_T025').showMesh(true);
         */
        this.showMesh = function(zoneName) {
            function showMesh(bool) {
                if (navMeshMap[zoneName] === undefined) {
                    console.warn('没有' + zoneName + '区域');
                } else {
                    navMeshMap[zoneName].visible = bool;
                }
            }
            return {
                showMesh: showMesh
            };
        };
        this.getPathZone = function(zoneName) {
            if (PathFindingMap[zoneName] === undefined) {
                console.warn('没有' + zoneName + '区域');
            } else {
                return PathFindingMap[zoneName];
            }
        };
        this.isInPoly = function(zoneName) {
            function isInPoly(endPos, handler) {
                var callId = scope.callId++;
                scope.callbackPools[callId] = handler;
                var data = {
                    cmd: 'is_in_poly',
                    pos: endPos,
                    zoneName: zoneName,
                    callId: callId
                };
                scope.computeWoker.postMessage(data);
            }
            return {
                isInPoly: isInPoly
            };
        };
        /**
         * 
         * @param {*网格区域名} zoneName 
         * @param {*加载到的json数据} data 
         */
        function loadJsonData(zoneName, data, mesh) {

            var geoMesh = new THREE.Geometry();
            geoMesh.fromBufferGeometry(mesh.geometry);
            geoMesh.computeBoundingSphere();

            var radius = geoMesh.boundingSphere.radius;
            var face = geoMesh.faces[0];
            var vertices = geoMesh.vertices;
            var firstNode = vertices[face.a]; //获取第一个点   

            navGeoMap[zoneName] = geoMesh;
            scope.zoneY[zoneName] = parseInt(geoMesh.boundingSphere.center.y);

            let meshData = JSON.parse(data);

            let sendData = {
                cmd: 'send_mesh_data',
                meshData: meshData,
                zoneName: zoneName,
                radius: radius,
                firstNode: firstNode
            };
            scope.flushCmdArray.push(sendData);
            flushCmd();

        }
        /**
         * 清空缓存命令
         */
        function flushCmd() {
            if (scope.connectWorker === true) { //只有建立连接了才能执行
                while (scope.flushCmdArray.length > 0) {
                    var cmdObj = scope.flushCmdArray.shift();
                    scope.computeWoker.postMessage(cmdObj);

                }
            }
        }

        function noNavMeshData(zoneName) {
            var obj = navMeshMap[zoneName];
            var geoMesh = new THREE.Geometry();
            geoMesh.fromBufferGeometry(obj.geometry);
            geoMesh.computeBoundingSphere();
            navGeoMap[zoneName] = geoMesh;

            scope.zoneY[zoneName] = parseInt(geoMesh.boundingSphere.center.y);


            var data = { cmd: 'nav_mesh', zoneName: zoneName, pathMesh: obj.toJSON() };
            scope.flushCmdArray.push(data);
            flushCmd();
        }
        /**
         * 创建搜寻区域 object为模型
         * zoneName为网格名
         */
        this.createZone = function(object, zoneName, path) {
            if (object.type == "Mesh") {
                //   console.time('makeNavMesh');
                scope.pathMesh = object;
                navMeshMap[zoneName] = object;




                var loader = new THREE.FileLoader();

                var handler = new Handler(loadJsonData, [zoneName]);
                loader.load(
                    // resource URL
                    path + zoneName + '.json',

                    // Function when resource is loaded
                    function(data) {
                        // output the text to the console
                        handler.executeWith([data, object]);

                    },

                    function(xhr) {
                        //  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        if ((xhr.loaded / xhr.total) === 1) {
                            console.log('寻路网格数据' + zoneName + '加载完成');
                        }

                    },

                    // Function called when download errors
                    function(xhr) {
                        console.warn('navmesh没有数据', zoneName, xhr);
                        noNavMeshData(zoneName);

                    }

                );

                scope.computeWoker.addEventListener('message', function(e) {
                    switch (e.data.cmd) {
                        case 'init_complete':
                            scope.connectWorker = true;
                            flushCmd();
                            break;
                        case 'nav_mesh_complete':
                            var zoneName = e.data.zoneName;
                            var group = e.data.group;

                            scope.zoneMeshGroup[zoneName] = group;
                            var obj = {};

                            obj.mesh = navMeshMap[zoneName]; //显示对象的mesh
                            obj.geo = navGeoMap[zoneName]; //显示对象的geometry
                            obj.findPath = function(begin, end, event) {
                                return scope.findPath(zoneName).findPath(begin, end, event);
                            };
                            obj.showMesh = function(bool) {
                                return scope.showMesh(zoneName).showMesh(bool);
                            };
                            obj.isInPoly = function(endpos, handler) {
                                return scope.isInPoly(zoneName).isInPoly(endpos, handler);
                            };
                            PathFindingMap[zoneName] = obj;
                            break;
                        case 'is_in_poly_complete':
                            var handler = scope.callbackPools[e.data.callId];
                            if (typeof handler == 'function') {
                                delete scope.callbackPools[e.data.callId];
                                var pos = e.data.pos;
                                if (e.data.data === true) {
                                    pos.y = PathFindingMap[e.data.zoneName].geo.boundingSphere.center.y;
                                } else {
                                    pos = null;
                                }
                                handler.apply(null, [pos]);
                            }
                            break;
                        case 'find_path_complete':
                            var callback = scope.callbackPools[e.data.msgId];
                            if (typeof callback == 'function') {
                                delete scope.callbackPools[e.data.msgId];
                                callback.apply(null, [e.data.zoneName, e.data.data]);
                            }

                            //                            if ((scope.findPathCallBack instanceof Function) === true) {
                            //                                scope.findPathCallBack.apply(null, [e.data.zoneName, e.data.data]);
                            //                            }
                            break;
                    }


                });



                //console.log('scope.playerNavMeshGroup', this.zoneMeshGroup[zoneName]);
            }
        };



    };

    Object.assign(PathFinding.prototype, THREE.EventDispatcher.prototype, {
        constructor: PathFinding
    });
    return PathFinding;
});