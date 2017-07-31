importScripts('../../require.js');
var Partor = null;
var THREE = null;
require({
        baseUrl: '../../../libs/',
        paths: {
            'underscore': 'underscore-min',
            'THREE': 'three/three',
            'Patrol': 'patrol',
        }
    }, ['underscore', 'THREE', 'Patrol'],
    function(underscore, THREE1, Patrol) {
        Partor = Patrol;
        THREE = THREE1;
        var cmdObj = { cmd: 'init_complete' };
        self.postMessage(cmdObj); //初始化完成

    }
);

var handler = function(evt) {
    var zoneName = evt.data.zoneName;

    switch (evt.data.cmd) {
        case 'send_mesh_data': //从数据库中拿到数据进行设计
            var meshData = evt.data.meshData;
            var radius = evt.data.radius;
            var firstNode = evt.data.firstNode;
            Partor.setZoneData(zoneName, meshData, radius);

            self.postMessage({
                cmd: 'nav_mesh_complete',
                msgId: evt.data.msgId,
                zoneName: zoneName,
                group: Partor.getGroup(zoneName, firstNode)
            });
            break;
        case 'nav_mesh':
            //   var geoMeshJson = evt.data.geoMesh;
            var pathMeshJson = evt.data.pathMesh;
            var loader = new THREE.ObjectLoader();
            var pathMesh = loader.parse(pathMeshJson);
            var geoMesh = new THREE.Geometry();
            geoMesh.fromBufferGeometry(pathMesh.geometry);
            geoMesh.computeBoundingSphere();

            var radius = geoMesh.boundingSphere.radius;

            var face = geoMesh.faces[0];
            var vertices = geoMesh.vertices;
            var firstNode = vertices[face.a]; //获取第一个点    


            var zoneNodes = Partor.buildNodes(geoMesh, radius);
            Partor.setZoneData(zoneName, zoneNodes, radius);

            self.postMessage({
                cmd: 'nav_mesh_complete',
                msgId: evt.data.msgId,
                zoneName: zoneName,
                group: Partor.getGroup(zoneName, firstNode)
            }); //初始化完成
            break;
        case 'find_path':
            self.postMessage({
                cmd: 'find_path_complete',
                msgId: evt.data.msgId,
                zoneName: zoneName,
                data: Partor.findPath(evt.data.begin, evt.data.end, zoneName, evt.data.group)
            }); //初始化完成
            //  console.log(calculatedPath);
            break;
        case 'get_random_point':
            var zoneName2 = evt.data.zoneName;
            var startPos = evt.data.start;
            var radius1 = evt.data.radius;
            var num = evt.data.num;
            var result = Partor.getRandomPoint(zoneName2, 0, startPos, radius1);

            var resultData = { cmd: 'get_random_point_complete', zoneName: zoneName2, data: result };
            self.postMessage(resultData); //初始化完成
            break;
        case 'is_in_poly':
            var zoneName3 = evt.data.zoneName;
            var pos = evt.data.pos;
            var b = Partor.isInPoly(zoneName3, pos);
            var data = { cmd: 'is_in_poly_complete', zoneName: zoneName3, data: b, callId: evt.data.callId, pos: pos };
            self.postMessage(data); //初始化完成
            break;



    }
};
self.addEventListener('message', handler);