/**
 * 对three.js进行封装的类
 */
define(function (require) {

    var DiyControls = require('frm/control/DiyControls');
    var EventConsts = require('frm/events/EventConsts');
    var Handler = require('frm/handler/Handler');
    //     var Logo = require('frm/core/Logo');
    var BoxSelect = require('frm/core/BoxSelect');
    var MapRoute = require('frm/core/MapRoute');
    var Patrol3D = require('frm/core/Patrol3D');
    var Track = require('frm/core/Track');
    var Door = require('frm/component/Door');
    var Arrester = require('frm/component/Arrester');
    var Label3d = require('frm/component/Label3d');
    var TransformControls = require('frm/control/TransformControls');
    var PowerGrid = require('frm/core/PowerGrid');
    var Building = require('frm/component/Building');
    var InfoPanel = require('frm/component/InfoPanel');
    var MapZoom = require('frm/component/MapZoom');
    var Object2D = require('frm/core/Object2D');
    //var Compass = require('frm/component/Compass');
    var Water = require('frm/component/Water');
    var PathFinding = require('frm/core/PathFinding');
    require('frm/extra/Pass');
    var OutLine = require('frm/core/OutLine');
    var MovingManager = require('frm/core/MovingManager');
    var LightManger = require('frm/core/lightmanager');

    require('THREE');
    require('CopyShader');
    require('EffectComposer');
    require('MTLLoader');
    require('OBJLoader');
    require('TWEEN');
    require('Stats');
    require('frm/core/expand');


    //判断浏览器是否可以应用webgl
    var Detector = require('Detector');
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var hzThree = {};

    var evtDispatcher = new THREE.EventDispatcher();


    var Events = EventConsts.Events;
    var HzEvent = EventConsts.HzEvent;
    var MouseEvent = EventConsts.MouseEvent;
    var ModelEvent = EventConsts.ModelEvent;



    var emptyFn = function () {}; // 空函数
    var dblDelay = 100; // 双击延时间隔
    var touchDelay = 1000; //触摸判断点击还是右键

    // 配置对象
    var _options = {
        axisHelper: false,
        onInit: null,
        isDebug: false, //是否打开监视器查看性能
        isShadow: false, // 是否开启阴影
        shadowFilter: null,
        pathFindingURL: null,
        lightURL: null
    };





    // 三维基础三大对象：场景、摄像机、渲染器；
    var scene, camera, renderer, stats;
    //   var logoDiv; //logo层
    var boxSelectDiv; //矩形选取层
    //    var logo; //logo对象
    var boxSelect; //框选对象
    //  var txtCanvas; //字体canvas
    var mapRoute = null; //路径绘制对象
    var patrol3D = null; //3d巡视
    var track = null; //轨迹跟踪
    var skyMesh = null;
    var powerGrid = null; //电网系统
    var pathFinding = null; //寻路系统
    var navMesh = null; //寻路网格
    var movingManager = null; //对象的移动管理
    var outLine = null; //特效类
    var mouseDownData = new THREE.Vector2();
    var planeGround;

    hzThree.resolution = new THREE.Vector2();
    // 三维场景中的辅助元素
    var ambientLight, dirLight, raycaster, mouseVector2, controls;

    // 三维地图场景的容器
    var threeMap, width, height;

    //网格字典
    var objectIdMap = EventConsts.objectIdMap;
    var objectNameMap = EventConsts.objectNameMap;

    var object2dNameMap = EventConsts.object2dNameMap;
    //模型字典
    var modelMap = EventConsts.modelMap;
    var doorMap = EventConsts.doorCache; //门的映射
    var bedMap = EventConsts.bedCache; //床映射
    var arresterCache = EventConsts.arresterCache; //阻止器的映射
    var loadingMap = {}; //正在加载的字典

    //mesh映射
    var transformControls;
    var initEventFun = null;
    var mapZoom = null;
    //  var compass = null;

    var onTouchMoveData = null;
    // 当前选中的对象和对象数据
    var curIntersectObj, curPickupPoint;

    var curVector2 = null;
    var curIntersetModel = null; //当前的模型
    var lastIntersetModel = null;
    var curDownModel = null;
    var curIntersetGroup = null; //当前的group
    //  var lastIntersetGroup = null;
    var curDownGroup = null;
    var curBorderModel = null;

    var intersectInfo = null; //相交的信息

    var touchDownInterest = null;
    var touchDownParentInterset = null;

    var box = new THREE.Box3();
    var edgeSphereRadius = 0;
    hzThree._isEditRoute = false; //是否正在编辑地图
    hzThree._isBoxSelect = false; //是否正在框选状态

    hzThree.tweenRunning = true; //tween是否运行
    hzThree.isPageShow = true; //当前页面是否正在展示

    hzThree.objectMap = {}; //模型键值
    hzThree.isShiftDown = false;
    hzThree.isCtrlDown = false;
    hzThree.logDepthBuffer = false;
    hzThree.isPatrol3ding = false;
    
    var navMeshBuild = new Map();
    var lightManger = new LightManger();
    var animatie;
    var walkCamera; //专门为巡视专用的摄像机
    /* ******************************************************************************************************
     * ********************************************** 场景对象操作 *******************************************
     * ****************************************************************************************************** */
    function HzScene() {

        this.inited = false; // 是否初始化完成

    }


    /*
     * 初始化三维场景
     * @param id 加载三维场景的容器ID
     * @param options 属性设置对象
     */
    HzScene.prototype.init = function (id, options) {

        // 临时写法
        _options.onInit = options.onInit || emptyFn;
        _options.axisHelper = options.axisHelper || false;
        _options.floorW = options.floorW || 50000;
        _options.floorH = options.floorH || 50000;
        _options.boundsWidth = options.boundsWidth || 50000;
        _options.boundsHeight = options.boundsHeight || 50000;
        _options.skyBox = options.skyBox || null;
        _options.isShadow = options.isShadow || false;
        _options.shadowFilter = options.shadowFilter || emptyFn;
        _options.pathFindingURL = options.pathFindingURL;
        _options.lightURL = options.lightURL;

        threeMap = document.getElementById(id);
        width = threeMap.clientWidth || window.innerWidth;
        height = threeMap.clientHeight || window.innerHeight;


        hzThree.resolution.x = width;
        hzThree.resolution.y = height;
        // 初始化场景
        scene = new THREE.Scene();
        EventConsts.scene = scene;

        // scene.fog = new THREE.Fog(0xFF0000, 0.01, 100000);

        // 初始化透视投影相机对象
        camera = new THREE.PerspectiveCamera(65, width / height, 1, 5000000);
        camera.position.x = 4500;
        camera.position.y = 4500;
        camera.position.z = 4500;
        camera.lookAt(scene.position); // 摄像机镜头指向场景中心点


        walkCamera = camera.clone();

        scene.add(camera);
        scene.add(walkCamera);
        camera.ownScene = scene;
        EventConsts.camera = camera;

        // 设置坐标辅助线
        if (_options.axisHelper && scene.add(new THREE.AxisHelper(15000)));
        if (_options.lightURL === undefined) {
            lightManger.loadDefault();
        } else {
            lightManger.loadLightFile(_options.lightURL);
        }



        /* ****************** 辅助地面 BEGIN ***************** */
        var geometry = new THREE.PlaneGeometry(_options.floorW, _options.floorH);
        var material = new THREE.MeshBasicMaterial({
            color: 0x333333,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
            alphaTest: 0.1
        });

        planeGround = new THREE.Mesh(geometry, material);
        planeGround.name = 'dm_helper_plane';
        planeGround.position.y = -20;
        planeGround.rotation.x = Math.PI * 0.5;
        scene.add(planeGround);


        /* ****************** 辅助地面 BEGIN ***************** */


        /* ****************** 天空盒着色 BEGIN ***************** */
        function skyBoxShader() {

            var light = new THREE.DirectionalLight(0xaabbff, 0.3);
            light.position.x = 300;
            light.position.y = 250;
            light.position.z = -500;
            scene.add(light);

            // SKYDOME
            var vertexShader =
                'varying vec3 vWorldPosition;' +
                'void main() {' +
                'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );' +
                'vWorldPosition = worldPosition.xyz;' +
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );' +
                '}';

            var fragmentShader =
                'uniform vec3 topColor;' +
                'uniform vec3 bottomColor;' +
                'uniform float offset;' +
                'uniform float exponent;' +
                'varying vec3 vWorldPosition;' +

                'void main() {' +
                'float h = normalize( vWorldPosition + offset ).y;' +
                'gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );' +
                '}';

            var uniforms = {
                topColor: {
                    type: "c",
                    value: new THREE.Color(0x0077ff)
                },
                bottomColor: {
                    type: "c",
                    value: new THREE.Color(0xffffff)
                },
                offset: {
                    type: "f",
                    value: 400
                },
                exponent: {
                    type: "f",
                    value: 0.6
                }
            };
            uniforms.topColor.value.copy(light.color);

            var skyGeo = new THREE.SphereGeometry(1000000, 64, 64);
            var skyMat = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.BackSide
            });

            var sky = new THREE.Mesh(skyGeo, skyMat);
            scene.add(sky);
        }

        if (_options.skyBox != null) {
            hzThree.setSkyBox(_options.skyBox, skyBoxShader);
        } else {
            skyBoxShader();
        }
        /* ****************** 天空盒着色 END ***************** */


        // 创建一个渲染器对象
        renderer = new THREE.WebGLRenderer({
            antialias: true, //是否开启反锯齿
            precision: "highp", //着色精度选择
            alpha: true, //是否可以设置背景色透明
            premultipliedAlpha: false,
            stencil: false,
            preserveDrawingBuffer: true, // 是否保存绘图缓冲
            logarithmicDepthBuffer: false, // 解决共面问题(有水面的地图目前还不适应 会有代码动态更改次参数)
        });
        renderer.setClearColor(0xD2D2D2); // 清除颜色
        renderer.setSize(width, height); // 设置渲染器大小
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = false;

        threeMap.appendChild(renderer.domElement);
        hzThree.renderer = EventConsts.renderer = renderer;


        boxSelectDiv = document.createElement('canvas');
        boxSelectDiv.width = width;
        boxSelectDiv.height = height;
        boxSelectDiv.style.cssText = 'position:absolute;top:0px;left:0px;pointer-events:none;'; //消除鼠标事件
        threeMap.appendChild(boxSelectDiv);
        boxSelect = new BoxSelect(boxSelectDiv);


        /*
         * 显示隐藏系统运行状态
         */
        hzThree.showStats = function (visible, className) {
            if (!stats) {
                stats = new Stats();
                stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
                stats.dom.className = className;
                stats.dom.style.cssText = "position:fixed;cursor:pointer;opacity:0.9;top:0";
                threeMap.appendChild(stats.dom);
            }
            _options.isDebug = visible;
            stats.dom.style.display = visible ? 'block' : 'none';
        };


        // 辅助工具
        mouseVector2 = new THREE.Vector2(); // 二维点位对象（用来记录鼠标坐标转换后的笛卡尔xy坐标）
        raycaster = new THREE.Raycaster(); // 射线（用来处理鼠标所在坐标与之相交的对象）

        controls = new DiyControls(camera, renderer.domElement, planeGround, EventConsts); // 初始化控制器
        controls.flyCompleteCallBackFun = flyToOverFun;
        controls.boundsW = _options.boundsWidth / 2;
        controls.boundsH = _options.boundsHeight / 2;
        transformControls = new TransformControls(camera, renderer.domElement);

        //防止控制的冲突
        transformControls.addEventListener('mouseDown', function (e) {
            controls.enabled = false;
        });
        transformControls.addEventListener('mouseUp', function (e) {
            controls.enabled = true;
        });
        /**
         * 对yline进行判断
         */
        transformControls.addEventListener('objectChange', function (e) {
            if (e.target.object.yline !== undefined) {
                e.target.object.updateYArrow();

            }
        });
        //绘制路径

        mapRoute = MapRoute.create(scene, camera, controls, raycaster, planeGround, width, height, transformControls);
        patrol3D = new Patrol3D(walkCamera, scene);
        track = new Track(camera, scene);
        powerGrid = new PowerGrid();
        outLine = new OutLine();
        movingManager = new MovingManager();

        hzThree.Controls = controls;
        hzThree.MapRoute = mapRoute;
        hzThree.Patrol3D = patrol3D;
        hzThree.Track = track;
        hzThree.BoxSelect = boxSelect;
        hzThree.PowerGrid = powerGrid;
        hzThree.outLine = outLine;
        hzThree.movingManager = movingManager;

        mapZoom = new MapZoom(threeMap);
        //   compass = new Compass(threeMap);
        // 初始化事件并设置初始化状态
        initEventFun = _initEvents();

        // 设置状态
        this.inited = true;

        _animate();
        _options.onInit();
    };
    /**
     * 添加进库
     * @param {[type]} type [description]
     * @param {[type]} val  [description]
     */
    function addLib(val) {
        var modelArray = val.name.split('_');
        var modelType = modelArray[modelArray.length - 1];

        //这里对建模进行单独判断 建模有可能把建模分成多个mesh但这个楼是group
        if ((modelType.indexOf('T') == 0 || (modelType.indexOf('S') === 0 && val.type == 'Group'))) {
            if (hzThree.objectMap[modelType] === undefined) {
                hzThree.objectMap[modelType] = [];

            }
            hzThree.objectMap[modelType].add(val);
        }
        if (modelType.indexOf('T016') > -1) {
            if (hzThree.objectMap[modelType] === undefined) {
                hzThree.objectMap[modelType] = [];
            }
            hzThree.objectMap[modelType].add(val);
            val.material.opacity = 0;
            val.material.needsUpdate = true;
            val.visible = false;
        }
    }

    /**
     * TODO: 2017.06.08 add
     * 加载json模型数据 目前主要应用在动画中
     * id 模型的唯一表示
     * path 为json文件的绝对路径
     * options:
     *       onLoad   加载完成  返回加载好的object3d
     *       onProgress  加载进度
     *       onError     加载报错
     *    
     * 
     */
    hzThree.loadJsonObj = function (id, path, options) {

        var jsonPath = path;
        var onLoad = options.onLoad || emptyFn;
        var onProgress = options.onProgress || emptyFn;
        var onError = options.onError || emptyFn;
        if (objectNameMap[id] !== undefined) {
            onLoad.apply(null, [objectNameMap[id]]);
            return;
        }
        var loader = new THREE.JSONLoader();
        loader.load(jsonPath, function (geometry, materials) {
            var material = materials[0];
            material.side = THREE.DoubleSide;
            material.morphTargets = true;
            // if(material===undefined) //有可能没有材质
            // {
            //     material = new THREE.MeshBasicMaterial( {color:0xCCCCCC}  );
            //     material.morphTargets = true;
            // }
            var mesh = new THREE.Mesh(geometry, material);
            mesh.name = id;
            onLoad.apply(null, [mesh]);
            objectNameMap[id] = mesh; //存储进字典 以便以后继续使用
        }, onProgress, onError);
    };

    /*
     * 加载模型
     * @param options = {
     * 		loadPath: "模型地址",
     * 		mtlName: "mtl文件名",
     * 		objName: "obj文件名"
     * 		onLoad: "加载成功事件",
     * 		onProgress: "加载中事件",
     * 		onError: "加载失败事件"
     * }
     */
    HzScene.prototype.loadObj = function (path, mtlName, objName, options) {

        if (typeof options !== 'object') options = {};

        var mtlLoader, objLoader;
        var onLoad = options.onLoad || emptyFn;
        var onProgress = options.onProgress || emptyFn;
        var onError = options.onError || emptyFn;

        var objPath = path + objName; //通过objName来保存objcect字典


        var fileName = objName.slice(0, -4); //文件名作为group的名字


        /**
         * 设置materila
         * @param {Object} material
         */
        function fmtMaterial(material) {
            if (material) {
                var name = material.name;
                //   material.wireframe = true;

                if (name.indexOf('_bl_') > -1) {
                    //console.log('过滤透明玻璃材质:' + name);
                    // material.visible = false;
                }

                if (name.indexOf('_al') > -1 || material.opacity < 1) {
                    material.transparent = true;
                    material.alphaTest = 0.1;
                    material.side = THREE.DoubleSide;
                    //   material.castShadow = true;

                    if (name.indexOf('_shu_') > -1) {
                        material.alphaTest = 0.5;
                    }
                }
            }
        }



        /**
         * 获取到mesh
         * @param {Object} child
         */
        function getMesh(child) {



            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    var materials = child.material.materials;
                    if (materials) {
                        for (var i = 0; i < materials.length; i++) {
                            fmtMaterial(materials[i]);

                        }
                        if (materials.length > 0) {
                            console.log(child.name + ':' + materials.length);
                        }
                    } else {
                        fmtMaterial(child.material);
                    }

                }
                objectIdMap[child.id] = child;
                if (child.name) {
                    objectNameMap[child.name] = child;
                    addLib(child);

                }
                // 找出门原型
                if (child.name.indexOf('door_') > -1) //如果是门的话进行原型缓存处理
                {
                    var indexS = child.name.indexOf('door_');
                    var doorName = child.name.substr(indexS);
                    var doorArray = doorName.split('_');
                    var doorMapName = doorArray[1] + '_' + doorArray[2] + '_' + doorArray[3];
                    if (doorMap.hasOwnProperty(doorMapName) === false) {
                        doorMap[doorMapName] = child;
                        child.parent.isDoorModel = true;

                    }
                }
                //找出床原型
                if (child.name.indexOf('T017') > -1) {
                    //床去第一个
                    var bedName = child.name.split('_')[1].substr(4);
                    if (bedMap.hasOwnProperty(bedName) === false) {
                        bedMap[bedName] = child;
                    }
                }
                //找到阻尼原型 这里阻尼是个组对象
                if ((child.parent.name.indexOf("T026") > -1 || child.parent.name.indexOf('T027') > -1) && (child.parent.name.indexOf('_da') == -1)) { //阻止器原型

                    if (arresterCache.hasOwnProperty(child.parent.name) === false) {


                        arresterCache[child.parent.name] = child.parent;
                    }
                }

                //找出锚点 进行添加
                if (child.name.indexOf('da_') > -1 && ((child.name.indexOf('T001') > -1) || (child.name.indexOf('T002') > -1) || (child.name.indexOf('T003') > -1) || (child.name.indexOf('T004'))) > -1) {
                    var door = new Door(child);
                    if (door.instacne)
                        door.instacne.onBorder(true);

                    if (door.isCreate === true) {
                        objectIdMap[door.id] = door;
                        objectNameMap[door.name] = door;
                        scene.add(door);

                        child.visible = false;
                    }
                }


                if (_options.isShadow) {
                    _options.shadowFilter(child);
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                if (child.name.indexOf('T024') > -1) {
                    var water = new Water(child.geometry); // 
                    // hzThree.logDepthBuffer = false;
                    //  EventConsts.logDepthBuffer = false;
                    //   renderer.capabilities.logarithmicDepthBuffer = false;  //一旦搜索到水面不采用原有的指数深度  这里动态改变会有现实问题等待更好的水面解决方案 暂时不用指数方式

                    // console.log('water:', child.name);
                }
                if (child.name.indexOf('zuni_da_') > -1) { //阻尼器锚点                
                    var arrester = new Arrester(child);
                    objectIdMap[arrester.id] = arrester;
                    objectNameMap[arrester.name] = arrester;
                    scene.add(arrester);

                }
            }

        }

        var tempName = null;
        if ((onLoad instanceof Handler) === true) {
            tempName = onLoad.args[0];
        }
        if (tempName !== undefined && tempName !== '' && objectNameMap.hasOwnProperty(tempName) === true) //已经有现成的对象了
        {

            hzThree.removeModelByName(tempName);

        }



        var loadCache = function (path, tempload) {
            var objClass = modelMap[path];
            var obj = null;
            obj = objClass.clone();
            obj.traverse(getMesh);



            if ((tempload instanceof Handler) === true) {
                tempload.executeWith(obj);
            } else {
                if (obj.type == 'Group') {
                    obj.name = fileName;
                }
                if (obj.type == 'Group' && (obj.name.indexOf('T005') > 0 || obj.name.indexOf('S005') > 0)) {
                    objectNameMap[obj.name] = obj;
                    addLib(obj);
                }
                if (obj.name.indexOf('T016') > -1) { //将房间box也添加进入
                    addLib(obj);
                }
                tempload(obj);
                scene.add(obj);

            }

        };

        if (loadingMap[objPath] !== undefined) {
            var handler = new Handler(loadCache, [objPath, onLoad]);
            loadingMap[objPath].push(handler);
            return;
        } else if (loadingMap[objPath] === undefined && modelMap.hasOwnProperty(objPath) === true && modelMap[objPath] !== undefined) { //没有正在加载并且已经有缓存了 

            var objClass = modelMap[objPath];
            var obj = null;
            obj = objClass.clone();
            obj.traverse(getMesh);

            if ((onLoad instanceof Handler) === true) {
                onLoad.executeWith(obj);
            } else {

                if (obj.type == 'Group') {
                    obj.name = fileName;
                }
                if (obj.type == 'Group' && (obj.name.indexOf('T005') > 0 || obj.name.indexOf('S005') > 0)) {
                    objectNameMap[obj.name] = obj;
                    addLib(obj);
                }
                if (obj.name.indexOf('T016') > -1) { //将房间box也添加进入
                    addLib(obj);
                }
                onLoad(obj);
                scene.add(obj);

            }


            return;
        }



        /*
         * 加载模型
         */
        mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(path);
        if (loadingMap[objPath] === undefined) { //判断是否正在加载
            loadingMap[objPath] = []; //正在加载模型

        }
        mtlLoader.load(mtlName, function (materials) {

            materials.preload(); // 创建材质对象

            objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials);

            objLoader.setPath(path);


            objLoader.load(objName, function (object) {

                if (object.type === 'Group') {
                    object.name = fileName;
                }
                object.traverse(getMesh);
                modelMap[objPath] = object;
                //   console.log(objPath, loadingMap[objPath]);
                if (loadingMap[objPath] !== undefined && loadingMap[objPath].length > 0) {
                    //执行缓存加载

                    for (var index = 0; index < loadingMap[objPath].length; index++) {
                        loadingMap[objPath][index].execute();
                    }

                }
                if (loadingMap[objPath] !== undefined) {
                    loadingMap[objPath].removeAll();
                    delete loadingMap[objPath];
                }



                if ((onLoad instanceof Handler) === true) {
                    onLoad.executeWith(object);
                } else {
                    if (object.type == 'Group') {
                        object.name = fileName;
                    }
                    if (object.type == 'Group' && (object.name.indexOf('T005') > 0 || object.name.indexOf('S005') > 0)) {
                        objectNameMap[object.name] = object;
                        addLib(object);
                        if (navMeshBuild[object.name] !== undefined) {
                            scene.add(navMeshBuild[object.name]);
                            navMeshBuild.delete(object.name);
                        }

                    }
                    if (object.name.indexOf('T016') > -1) { //将房间box也添加进入
                        addLib(object);
                    }
                    onLoad(object);

                }
                if (fileName.indexOf("_T025") > -1) { //查找到了寻路网格 这个可能需要用类别来区分
                    navMesh = object.children[0];
                    navMesh.material.wireframe = true;
                    navMesh.visible = false;
                    if (pathFinding === null) {
                        pathFinding = new PathFinding();
                        hzThree.PathFinding = pathFinding;
                    }
                    pathFinding.createZone(navMesh, fileName, _options.pathFindingURL);
                    objectNameMap[navMesh.name] = navMesh;
                    var nameArray = fileName.split("_");
                    var pName = nameArray[0] + "_" + nameArray[1] + "_" + nameArray[2] + "_" + 'in_T005';
                    navMeshBuild[pName] = object;


                }

                if (object.type == 'Group' && (object.children.length > 1) || (object.children[0].name.indexOf('door_') === -1)) { //由于现在场景中有很多乱起的名字中带有door所有现在只能通过这个办法暂时判断一下是否是门原型
                    if (object.children[0].name.indexOf('T017') === -1) {
                        scene.add(object);

                    }
                }
                // console.log(object);
                //  mesh = null;

            }, onProgress, onError);

        }, function () {}, onError);


    };


    /*
     * 获取场景拾取坐标（需要开启场景拾取）
     * @return {x: 0, y: 0, z: 0}
     */
    HzScene.prototype.getPickupPoint = function () {
        if (curPickupPoint) {
            return {
                x: curPickupPoint.x,
                y: curPickupPoint.y,
                z: curPickupPoint.z,
            };
        }
        return null;
    };

    function tweenUpdate () {
        try {
            TWEEN.update();
        } catch (e) {
            console.error(e);
        }
    }

    function controlsUpdate () {
        try {
            if (hzThree._isBoxSelect === false) {
                controls.update();
            }
        } catch (e) {
            console.error(e);
        }
    }

    function commUpdateTry () {
    	try {
    		commUpdate();
        } catch (e) {
            console.error(e);
        }
    }

    function commUpdate () {
        if (hzThree._isBoxSelect === true) {
            boxSelect.update();
        }

        if (_options.isDebug === true) {
            stats.update();
        }

        Building.update();
        InfoPanel.update();
        Water.update();
        patrol3D.update();

//		if (outLine.outlineArray.length > 0) {
//			outLine.update();
//		}

        if (onTouchMoveData !== null) {
            initEventFun.mousemove(onTouchMoveData, true);
            onTouchMoveData = null;
        }
        mapZoom.onTouchMove();
    }

    /*
     * 动画
     */
    function _animate() {
    	tweenUpdate();
    	commUpdateTry();
    	controlsUpdate();

        if (hzThree.isPatrol3ding === false) {
            renderer.render(scene, camera);
        } else {
            renderer.render(scene, walkCamera);
        }

        animatie = requestAnimationFrame(_animate);
    }



    /**
     * 删除边框
     */
    function removeMeshBorder(mesh) {
        if (mesh.parent)
            mesh.parent.remove(mesh.border);
        else
            scene.remove(mesh.border);

        if (mesh.border) {
            mesh.border.dispose();
            mesh.border = null;
        }
        //hzThree.outLine.removeOutline(mesh);
    }

    /**
     * 给对象添加边框 实际为每个材质改变颜色 并且扩大越有mesh
     * @param {Object} mesh
     */
    function addMeshBorder(mesh) {
        //        mesh.geometry.computeBoundingSphere();
        //        var sphere = mesh.geometry.boundingSphere;
        var borderMesh = mesh.clone();
        //        borderMesh.position.x = sphere.center.x;
        //        borderMesh.position.y = sphere.center.y;
        //        borderMesh.position.z = sphere.center.z;

        borderMesh.visible = true;
        borderMesh.name = 'clone_' + borderMesh.name;
        if (mesh.border === undefined || mesh.border === null) {
            mesh.border = borderMesh;
            var material = borderMesh.material.clone();
            analyseMaterial(material);
            borderMesh.material = material;

            if (mesh.parent)
                mesh.parent.add(borderMesh);
            else
                scene.add(borderMesh);
        }
        //        hzThree.outLine.addOutLine(mesh);
    }
    /**
     * 为了实现老接口 所以实现和mesh是一样的
     */
    function removeGroupBorder(group) {
        scene.remove(group.border);
        if (group.border) {
            group.border.dispose();
            group.border = null;
        }

        //        hzThree.outLine.removeOutline(group);
    }

    function addGroupBorder(group) {
        var borderGroup = group.clone();
        borderGroup.visible = true;
        borderGroup.name = 'clone_' + borderGroup.name;

        if (group.border === undefined || group.border === null) {
            for (var i = 0; i < borderGroup.children.length; i++) {
                var tempMesh = borderGroup.children[i];
                var material = tempMesh.material.clone();
                analyseMaterial(material);
                tempMesh.material = material;
            }
            group.border = borderGroup;
            scene.add(borderGroup);
        }

        //        hzThree.outLine.addOutLine(group);
    }

    var borderColor = 0xFF0000;

    function addBorder(obj, color) {
        borderColor = color || borderColor;

        if (obj.type == 'Group') {
            addGroupBorder(obj);
        } else if (obj.type == 'Mesh') {
            addMeshBorder(obj);
        }
    }

    function removeBorder(obj) {
        borderColor = 0xFF0000;

        if (obj.type == 'Group') {
            removeGroupBorder(obj);
        } else if (obj.type == 'Mesh') {
            removeMeshBorder(obj);
        }
    }

    function analyseMaterial(material) {
        if ((material instanceof THREE.MultiMaterial) === true) {
            for (var i = 0; i < material.materials.length; i++) {
                analyseMaterial(material.materials[i]);
            }

        } else {
            //做材质处理
            material.transparent = true;
            material.depthTest = true;
            material.depthWrite = false;
            material.alphaTest = 0.1;
            material.opacity = 0.5;
            material.side = THREE.FrontSide;
            material.color.set(borderColor);
            //            material.emissive.setHex(borderColor);
            //            material.color.setHex(borderColor);
        }
    }


    /*
     * 初始化事件
     */
    function _initEvents(register = true) {
        var clickTimer = null;
        var touchTimer = null;
        /*
         * 鼠标移动
         */


        function mousemove(event, isTouch) {
            if (event.clientX === mouseDownData.x && event.clientY === mouseDownData.y) {
                return;
            }

            if (isTouch === undefined) {
                isTouch = false;
            } else {
                isTouch = true;
            }
            if (hzThree._isEditRoute === true && mapRoute !== null) //处于编辑地图状态其他一切响应将被暂停
            {
                mapRoute.mouseMove(event);
                return;
            }
            // 根据屏幕鼠标坐标计算xy坐标
            mouseVector2.x = (event.clientX / width) * 2 - 1;
            mouseVector2.y = -(event.clientY / height) * 2 + 1;
            if (event.preventDefault !== undefined) {
                event.preventDefault();
            }


            if (evtDispatcher.hasEvent(MouseEvent.MOUSE_MOVE) === true) {
                var evtH = new Events(MouseEvent.MOUSE_MOVE, mouseVector2);
                evtDispatcher.dispatchEvent(evtH);
            }
            if (hzThree._isBoxSelect === true && boxSelect !== null) {
                // boxSelect.clear();
                boxSelect.setEndPos(event.clientX, event.clientY);

            }
            if (THREE.Object3D.prototype.activeModelArray.length > 0) {
                var intersect = _intersectObject(THREE.Object3D.prototype.activeModelArray); //选中的对象            
                intersectInfo = intersect;
                var sceneInterface = null;
                if (intersect) {
                    if (curIntersetModel !== intersect.object) {
                        lastIntersetModel = curIntersetModel;
                        curIntersetModel = intersect.object;

                        if (curIntersetModel.hasEvent(ModelEvent.MODEL_ROLL_OVER) === true) {
                            sceneInterface = _intersectObject(scene.children, undefined, true);
                            if (sceneInterface.object === curIntersetModel) {
                                intersectInfo.screenPos = curIntersetModel.toScreenPosition();
                                var evt = new Events(ModelEvent.MODEL_ROLL_OVER, intersectInfo);
                                intersect.object.dispatchEvent(evt);
                            }

                        }
                        if (curIntersetModel.isParentGroup() === true && curIntersetModel.parent.hasEvent(ModelEvent.MODEL_ROLL_OVER) === true && curIntersetGroup !== curIntersetModel.parent) {
                            sceneInterface = _intersectObject(scene.children, undefined, true);
                            curIntersetGroup = curIntersetModel.parent;
                            if (sceneInterface.object.parent == curIntersetGroup) {
                                intersectInfo.screenPos = curIntersetGroup.toScreenPosition();
                                var evt1 = new Events(ModelEvent.MODEL_ROLL_OVER, intersectInfo);
                                intersect.object.parent.dispatchEvent(evt1);
                            }

                        }

                        if (curBorderModel !== null && curBorderModel.isBorderShow === false) {
                            if (curBorderModel.type == 'Group' && curBorderModel !== curIntersetModel.parent) {
                                removeGroupBorder(curBorderModel);
                                curBorderModel = null;
                            } else if (curBorderModel.type == 'Mesh' && curBorderModel !== curIntersetModel) {

                                removeMeshBorder(curBorderModel);
                                curBorderModel = null;
                            }

                        }

                        if (isTouch === false && curIntersetModel !== null && curIntersetModel.isOnBorder === true && curIntersetModel.isBorderShow === false) //添加Group
                        {

                            curBorderModel = curIntersetModel;
                            var intersect1 = _intersectObject(scene.children, undefined, true);
                            if (intersect1.object === curIntersetModel) {
                                addMeshBorder(curIntersetModel);
                            } else {
                                curIntersetModel = null;
                                lastIntersetModel = null;
                            }



                        }
                        if (isTouch === false && curIntersetModel !== null && curIntersetModel.isParentGroup() === true && curIntersetModel.parent.isOnBorder === true && curIntersetModel.isBorderShow === false) //添加Group
                        {
                            curBorderModel = curIntersetModel.parent;
                            var intersect2 = _intersectObject(scene.children, undefined, true);
                            if (curBorderModel === intersect2.object.parent) {
                                addGroupBorder(curIntersetModel.parent);
                            } else {
                                curIntersetModel = null;
                                lastIntersetModel = null;
                            }

                        }

                        var info = {};
                        if (lastIntersetModel !== undefined && lastIntersetModel !== null) {
                            if (lastIntersetModel.hasEvent(ModelEvent.MODEL_ROLL_OUT) === true) //自己发送
                            {
                                info.pos = lastIntersetModel.position.clone();
                                info.screenPos = lastIntersetModel.toScreenPosition();
                                var evt2 = new Events(ModelEvent.MODEL_ROLL_OUT, info);
                                lastIntersetModel.dispatchEvent(evt2);
                            }
                            if (lastIntersetModel.isParentGroup() === true && lastIntersetModel.parent.hasEvent(ModelEvent.MODEL_ROLL_OUT) === true) //父级发送
                            {
                                info.pos = lastIntersetModel.parent.position.clone();
                                info.screenPos = lastIntersetModel.parent.toScreenPosition();
                                var evt3 = new Events(ModelEvent.MODEL_ROLL_OUT, info);
                                lastIntersetModel.parent.dispatchEvent(evt3);
                            }
                            lastIntersetModel = null;
                            curIntersetGroup = null;
                        }

                    }
                } else {

                    if (curIntersetModel !== undefined && curIntersetModel !== null) {
                        var info1 = {};
                        if (isTouch === false && curIntersetModel.hasEvent(ModelEvent.MODEL_ROLL_OUT) === true) //自己发送
                        {

                            info1.pos = curIntersetModel.position.clone();
                            info1.screenPos = curIntersetModel.toScreenPosition();
                            var evt4 = new Events(ModelEvent.MODEL_ROLL_OUT, info1);
                            curIntersetModel.dispatchEvent(evt4);


                        }
                        if (isTouch === false && curIntersetModel.isParentGroup() === true && curIntersetModel.parent.hasEvent(ModelEvent.MODEL_ROLL_OUT) === true) //父级发送
                        {

                            info1.pos = curIntersetModel.parent.position.clone();
                            info1.screenPos = curIntersetModel.parent.toScreenPosition();
                            var evt5 = new Events(ModelEvent.MODEL_ROLL_OUT, info1);
                            curIntersetModel.parent.dispatchEvent(evt5);


                        }
                        if (isTouch === false && curIntersetModel !== null && curIntersetModel.isOnBorder === true && curIntersetModel === curBorderModel && curIntersetModel.isBorderShow === false) //添加Group
                        {
                            removeMeshBorder(curIntersetModel);
                        }

                        if (isTouch === false && curIntersetModel.isParentGroup() === true && curIntersetModel.parent.isOnBorder === true && curIntersetModel.parent === curBorderModel && curIntersetModel.isBorderShow === false) {

                            removeGroupBorder(curIntersetModel.parent);
                        }
                        curIntersetModel = null;
                        curIntersetGroup = null;

                    }
                }


            }

        }

        function onTouchMove(event) {
            event.preventDefault();
            if (hzThree._isBoxSelect === true && boxSelect !== null) {
                onTouchMoveData = null;
                mousemove(event.touches[0], true); //这里本来想使用
            } else {
                onTouchMoveData = event.touches[0];
            }


        }
        /*
         * 鼠标按下
         */
        function mousedown(event, isTouch) {
            mouseDownData.x = event.clientX;
            mouseDownData.y = event.clientY;
            if (isTouch === undefined) {
                isTouch = false;
            } else {
                isTouch = true;
            }
            if (hzThree._isEditRoute === true && mapRoute !== null) //处于编辑地图状态其他一切响应将被暂停
            {

                mapRoute.mouseDown(event);
                return;
            }

            if (event.button === 0 && evtDispatcher.hasEvent(MouseEvent.MOUSE_DOWN) === true) {
                var evtH = new Events(MouseEvent.MOUSE_DOWN, mouseVector2);
                evtDispatcher.dispatchEvent(evtH);
            }
            if (event.button === 2 && evtDispatcher.hasEvent(MouseEvent.RIGHT_CLICK) === true) {
                curVector2 = mouseVector2.clone();
            }
            if (event.button === 2 && evtDispatcher.hasEvent(MouseEvent.RIGHT_MOUSE_DOWN) === true) {
                var evtH1 = new Events(MouseEvent.RIGHT_MOUSE_DOWN, mouseVector2);
                evtDispatcher.dispatchEvent(evtH1);
            }

            if (curIntersetModel !== undefined && curIntersetModel !== null) {

                if (event.button === 2 && curIntersetModel.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true) {
                    curDownModel = curIntersetModel;
                }
                if (event.button === 2 && curIntersetModel.isParentGroup() === true && curIntersetModel.parent.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true) {

                    curDownGroup = curIntersetModel.parent;
                }
            }

            if (hzThree._isBoxSelect === true && boxSelect !== null && event.button === 0) {
                boxSelect.clear();
                boxSelect.setStartPos(event.clientX, event.clientY);
                boxSelect.setEndPos(event.clientX, event.clientY);
                boxSelect.enabled = true;


            }
            if (isTouch === true) { //触屏点击点击第一下
                mouseVector2.x = (event.clientX / width) * 2 - 1;
                mouseVector2.y = -(event.clientY / height) * 2 + 1;
                if (THREE.Object3D.prototype.activeModelArray.length > 0) {
                    var intersect = _intersectObject(THREE.Object3D.prototype.activeModelArray); //选中的对象
                    if (intersect === undefined) return;
                    var touchInterset = intersect.object;
                    if (touchInterset.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true || touchInterset.hasEvent(ModelEvent.MODEL_CLICK) === true) {
                        touchDownInterest = touchInterset;
                        if (touchInterset.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true && touchTimer === null) {
                            touchTimer = setTimeout(touchRightClick, touchDelay, intersect);
                            threeMap.removeEventListener('mousemove', mousemove, false);

                        }
                    }
                    if (touchInterset.isParentGroup() === true &&
                        (touchInterset.parent.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true || touchInterset.parent.hasEvent(ModelEvent.MODEL_CLICK) === true)) {
                        touchDownParentInterset = touchInterset.parent;
                        if (touchInterset.parent.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true && touchTimer === null) {
                            touchTimer = setTimeout(touchRightClick, touchDelay, intersect);
                            threeMap.removeEventListener('mousemove', mousemove, false);

                        }
                    }
                }
            }



        }

        function touchRightClick(intersect) {
            clearTimeout(touchTimer);
            touchTimer = null;
            if (touchDownInterest !== null && touchDownInterest.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true) {
                intersect.screenPos = touchDownInterest.toScreenPosition();
                var evt3 = new Events(ModelEvent.MODEL_RIGHT_CLICK, intersect);
                touchDownInterest.dispatchEvent(evt3);
                touchDownInterest = null;
            }
            if (touchDownParentInterset !== null && touchDownParentInterset.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true) {
                intersect.screenPos = touchDownParentInterset.toScreenPosition();
                var evt4 = new Events(ModelEvent.MODEL_RIGHT_CLICK, intersect);
                touchDownParentInterset.dispatchEvent(evt4);
                touchDownParentInterset = null;
            }
            threeMap.addEventListener('mousemove', mousemove, false);
        }

        function onTouchStart(event) {
            event.preventDefault();
            var e = event.touches[0];
            mapZoom.show();
            if (hzThree.isShiftDown === true) {
                e.shiftKey = true;
            } else {
                e.shiftKey = false;
            }
            if (hzThree._isBoxSelect === true && boxSelect !== null) {
                e.button = 0;
            }
            mousedown(e, true);
        }
        /*
         * 鼠标弹起
         */
        function mouseup(event, isTouch) {
            if (isTouch === undefined) {
                isTouch = false;
            } else {
                isTouch = true;
            }
            if (hzThree._isEditRoute === true && mapRoute !== null) //处于编辑地图状态其他一切响应将被暂停
            {
                mapRoute.mouseUp(event);
                return;
            }

            if (event.button === 0 && evtDispatcher.hasEvent(MouseEvent.MOUSE_UP) === true) {
                var evtH = new Events(MouseEvent.MOUSE_UP, mouseVector2);
                evtDispatcher.dispatchEvent(evtH);
            }
            if (event.button === 2 && evtDispatcher.hasEvent(MouseEvent.RIGHT_CLICK) === true) {
                if (curVector2 !== null && curVector2.equals(mouseVector2)) {
                    var evtH1 = new Events(MouseEvent.RIGHT_CLICK, mouseVector2);
                    evtDispatcher.dispatchEvent(evtH1);
                    curVector2 = null;
                }

            }
            if (event.button === 2 && evtDispatcher.hasEvent(MouseEvent.RIGHT_MOUSE_UP) === true) {
                var evtH2 = new Events(MouseEvent.RIGHT_MOUSE_UP, mouseVector2);
                evtDispatcher.dispatchEvent(evtH2);

            }

            if (curIntersetModel !== undefined && curIntersetModel !== null) {
                if (event.button === 2 && curDownModel === curIntersetModel) {
                    if (curIntersetModel.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true) {
                        intersectInfo.screenPos = curIntersetModel.toScreenPosition();
                        var evt = new Events(ModelEvent.MODEL_RIGHT_CLICK, intersectInfo);
                        curIntersetModel.dispatchEvent(evt);
                    }

                }

                if (event.button === 2 && curDownGroup === curIntersetModel.parent) {
                    if (curIntersetModel.isParentGroup() === true && curIntersetModel.parent.hasEvent(ModelEvent.MODEL_RIGHT_CLICK) === true) {
                        intersectInfo.screenPos = curIntersetModel.parent.toScreenPosition();
                        var evt1 = new Events(ModelEvent.MODEL_RIGHT_CLICK, intersectInfo);
                        curIntersetModel.parent.dispatchEvent(evt1);
                        curDownGroup = null;
                    }

                }

            }
            if (hzThree._isBoxSelect === true && boxSelect !== null && event.button === 0) {
                boxSelect.setEndPos(event.clientX, event.clientY);
                boxSelect.enabled = false;
                var arr = boxSelect.check();
                var evt2 = new Events(HzEvent.PICK_UP_BOX_SELECT, arr);
                boxSelect.dispatchEvent(evt2);
                boxSelect.setIsBoxSelect(false);

            }
            if (isTouch === true) {
                mouseVector2.x = (event.clientX / width) * 2 - 1;
                mouseVector2.y = -(event.clientY / height) * 2 + 1;
                if (THREE.Object3D.prototype.activeModelArray.length > 0) {
                    var intersect = _intersectObject(THREE.Object3D.prototype.activeModelArray); //选中的对象
                    if (intersect === undefined) {
                        return;
                    }
                    var touchInterset = intersect.object;
                    if (touchDownInterest === touchInterset && touchInterset.hasEvent(ModelEvent.MODEL_CLICK) === true) {
                        if (touchTimer !== null) {
                            clearTimeout(touchTimer);
                            touchTimer = null;
                            threeMap.addEventListener('mousemove', mousemove, false);
                        }

                        intersect.screenPos = touchDownInterest.toScreenPosition();
                        var evt3 = new Events(ModelEvent.MODEL_CLICK, intersect);
                        touchDownInterest.dispatchEvent(evt3);
                        touchDownInterest = null;

                    }
                    if (touchInterset.parent === touchDownParentInterset && touchDownParentInterset.hasEvent(ModelEvent.MODEL_CLICK) === true) {
                        if (touchTimer !== null) {
                            clearTimeout(touchTimer);
                            touchTimer = null;
                            threeMap.addEventListener('mousemove', mousemove, false);
                        }
                        intersect.screenPos = touchDownParentInterset.toScreenPosition();
                        var evt4 = new Events(ModelEvent.MODEL_CLICK, intersect);
                        touchDownParentInterset.dispatchEvent(evt4);
                        touchDownParentInterset = null;
                    }
                }
            }


        }

        function onTouchEnd(event) {
            event.preventDefault();
            var e = event.changedTouches[0];
            if (hzThree.isShiftDown === true) {
                e.shiftKey = true;
            } else {
                e.shiftKey = false;
            }
            if (hzThree._isEditRoute === true && mapRoute !== null) {
                e.button = 0;
            }
            if (hzThree._isBoxSelect === true && boxSelect !== null) {
                e.button = 0;
            }
            mouseup(e, true);
        }
        /*
         * 鼠标点击
         */
        function click(event) {
            var lastModel = null;
            var clickFun = function (windowEvent) {
                window.event = windowEvent;
                if (evtDispatcher.hasEvent(MouseEvent.CLICK) === true) {
                    var evtH = new Events(MouseEvent.CLICK, mouseVector2);
                    evtDispatcher.dispatchEvent(evtH);
                }
                if (evtDispatcher.hasEvent(HzEvent.PICK_UP_MODEL) === true) {
                    var ext;
                    if (Array.isArray(hzThree.objectMap.S005) === true) {
                        ext = [transformControls].concat(hzThree.objectMap.S005);
                    } else {
                        ext = [transformControls];
                    }
                    var intersect = _intersectObject(scene.children, ext); //选中的对象
                    if (intersect === undefined) {
                        console.log('没有获取到任何对象');
                        return;
                    }

                    curIntersectObj = intersect.object;
                    if (curIntersectObj.name.indexOf('door_') > -1) { //点击了门的mesh
                        curIntersectObj = curIntersectObj.ownDoor; //返回父级的group
                    }
                    var evt = new Events(HzEvent.PICK_UP_MODEL, curIntersectObj);
                    evtDispatcher.dispatchEvent(evt);


                }
                if (evtDispatcher.hasEvent(HzEvent.PICK_UP_POINT) === true) {
                    var intersect1 = _intersectObject(scene.children); //选中的对象
                    if (intersect1 === undefined) {
                        console.warn('没有获取到任何对象');
                        return;
                    }

                    curIntersectObj = intersect1;
                    curPickupPoint = curIntersectObj.point;
                    var evt1 = new Events(HzEvent.PICK_UP_POINT, curPickupPoint);
                    evtDispatcher.dispatchEvent(evt1);

                }


                if (curIntersetModel !== undefined && curIntersetModel !== null && lastModel === curIntersetModel && mouseDownData.x === window.event.clientX && mouseDownData.y === window.event.clientY) {

                    if (curIntersetModel.hasEvent(ModelEvent.MODEL_CLICK) === true) //自己发送
                    {

                        intersectInfo.screenPos = curIntersetModel.toScreenPosition();
                        var evt2 = new Events(ModelEvent.MODEL_CLICK, intersectInfo);
                        curIntersetModel.dispatchEvent(evt2);
                    }
                    if (curIntersetModel.isParentGroup() === true && curIntersetModel.parent.hasEvent(ModelEvent.MODEL_CLICK) === true) {

                        intersectInfo.screenPos = curIntersetModel.parent.toScreenPosition();
                        var evt3 = new Events(ModelEvent.MODEL_CLICK, intersectInfo);
                        curIntersetModel.parent.dispatchEvent(evt3);
                    }
                }

                clickTimer = null;
            };



            if (clickTimer !== null) {
                clearTimeout(clickTimer);
                clickTimer = null;

            }
            if (curIntersetModel !== undefined && curIntersetModel !== null) {
                lastModel = curIntersetModel;
            }
            clickTimer = setTimeout(clickFun, dblDelay, event);





        }

        /*
         * 鼠标双击
         */
        function dblclick() {


            if (clickTimer !== null); {
                clearTimeout(clickTimer);
                clickTimer = null;

            }
            if (curIntersetModel !== undefined && curIntersetModel !== null) {

                if (curIntersetModel.hasEvent(ModelEvent.MODEL_DOUBLE_CLICK) === true) //自己发送
                {
                    intersectInfo.screenPos = curIntersetModel.toScreenPosition();
                    var evt = new Events(ModelEvent.MODEL_DOUBLE_CLICK, intersectInfo);
                    curIntersetModel.dispatchEvent(evt);
                }
                if (curIntersetModel.isParentGroup() === true && curIntersetModel.parent.hasEvent(ModelEvent.MODEL_DOUBLE_CLICK) === true) {

                    intersectInfo.screenPos = curIntersetModel.parent.toScreenPosition();
                    var evt1 = new Events(ModelEvent.MODEL_DOUBLE_CLICK, intersectInfo);
                    curIntersetModel.parent.dispatchEvent(evt1);
                }

            }
            if (evtDispatcher.hasEvent(MouseEvent.DOUBLE_CLICK) === true) {

                // var evtH = new Events(MouseEvent.DOUBLE_CLICK, mouseVector2);
                // evtDispatcher.dispatchEvent(evtH);


                let intersect1 = _intersectObject(scene.children); //选中的对象
                if (intersect1 === undefined) {
                    curPickupPoint = hzThree.getScreenTo3dPos(mouseVector2);
                }
                curIntersectObj = intersect1;
                curPickupPoint = curIntersectObj.point;
                var evt2 = new Events(MouseEvent.DOUBLE_CLICK, curPickupPoint);
                evtDispatcher.dispatchEvent(evt2);

            }
        }

        /*
         * 监听窗口调整大小
         */
        function resize() {

            width = threeMap.clientWidth || window.innerWidth;
            height = threeMap.clientHeight || window.innerHeight;

            hzThree.resolution.x = width;
            hzThree.resolution.y = height;

            camera.aspect = width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            outLine.setSize(width, height);
            if (boxSelectDiv !== null) {
                boxSelectDiv.width = width;
                boxSelectDiv.height = height;
            }
            if (mapRoute !== null) {
                mapRoute.setSize(width, height);
            }


        }

        function onKeyDown(e) {

            if (e.keyCode === 16) {
                hzThree.isShiftDown = true;
            }
            if (e.keyCode === 17) {
                hzThree.isCtrlDown = true;
            }
        }

        function onKeyUp(e) {
            if (e.keyCode === 16) {
                hzThree.isShiftDown = false;
            }
            if (e.keyCode === 17) {
                hzThree.isCtrlDown = false;
            }
        }

        function visbileChange() {
            var isHidden = document.hidden;
            if (isHidden) {
                hzThree.isPageShow = false;
            } else {
                hzThree.isPageShow = true;
            }
        }
        if (register === true) {


            threeMap.addEventListener('mousemove', mousemove, false);
            threeMap.addEventListener('mousedown', mousedown, false);
            threeMap.addEventListener('mouseup', mouseup, false);
            threeMap.addEventListener('click', click, false);
            threeMap.addEventListener('dblclick', dblclick, false);

            threeMap.addEventListener('touchstart', onTouchStart, false);
            threeMap.addEventListener('touchend', onTouchEnd, false);
            threeMap.addEventListener("touchcancel", onTouchEnd, false);
            threeMap.addEventListener("touchleave", onTouchEnd, false);
            threeMap.addEventListener('touchmove', onTouchMove, false);

            window.addEventListener('resize', resize, false);
            window.addEventListener('keydown', onKeyDown, false);
            window.addEventListener('keyup', onKeyUp, false);

            document.addEventListener('visibilitychange', visbileChange);
            return {
                mousemove: mousemove
            };
        } else {
            threeMap.removeEventListener('mousemove', mousemove, false);
            threeMap.removeEventListener('mousedown', mousedown, false);
            threeMap.removeEventListener('mouseup', mouseup, false);
            threeMap.removeEventListener('click', click, false);
            threeMap.removeEventListener('dblclick', dblclick, false);

            threeMap.removeEventListener('touchstart', onTouchStart, false);
            threeMap.removeEventListener('touchend', onTouchEnd, false);
            threeMap.removeEventListener("touchcancel", onTouchEnd, false);
            threeMap.removeEventListener("touchleave", onTouchEnd, false);
            threeMap.removeEventListener('touchmove', onTouchMove, false);

            window.removeEventListener('resize', resize, false);
            window.removeEventListener('keydown', onKeyDown, false);
            window.removeEventListener('keyup', onKeyUp, false);

            document.removeEventListener('visibilitychange', visbileChange);
        }


    }



    /* ******************************************************************************************************
     * ********************************************** 相机对象操作 *******************************************
     * ****************************************************************************************************** */
    function HzCamera() {

    }


    /*
     * 视角飞行定位
     * @param viewPoint 定位视角：{"x":"X坐标", "y":"Y坐标", "z":"Z坐标", "yaw":"旋转值(Y轴旋转值)","pitch":"俯仰值(X轴旋转值)", "roll":"平衡值(Z轴旋转值)"}
     * @param speed 飞行速度（过渡时长）
     */
    HzCamera.prototype.flyTo = function (viewPoint) {

        controls.flyTo(viewPoint);

    };


    function flyToOverFun(e) {
        var evt = new Events(HzEvent.FLY_OVER, e);
        hzThree.emit(evt);
    }
    /*
     * 获取当前视角点位
     */
    HzCamera.prototype.getViewPoint = function () {

        return controls.getCameraPos();

    };

    /*
     * 查找与射线相交的第一个对象  在数组中排他
     * ex 为排他数组
     *          */
    function _intersectObject(array, ex, bools) {
        var intersects;
        if (bools === undefined) {
            bools = true;
        }
        var showFun = function (element1) {
            var b = false;
            if (element1.visible === true) {
                b = true;
                if (element1.parent !== null && element1.parent.visible === true) {
                    b = true;
                } else if (element1.parent !== null && element1.parent.visible === false) {
                    b = false;
                }
                return b;
            } else {
                return b;
            }

        };
        var showArray = array.filter(showFun);



        if (ex !== undefined) {
            var exFun = function (element) {
                for (var index = 0; index < ex.length; index++) {
                    if (element !== ex[index]) {
                        return true;
                    } else {
                        return false;
                    }
                }

            };
            var newArray = showArray.filter(exFun);
            intersects = _intersectObjects(newArray, bools);

        } else {
            intersects = _intersectObjects(showArray, bools);
        }


        if (intersects.length > 0) {
            return intersects[0];
        }
    }

    /*
     * 查找与射线相交的第一个对象
     */
    function _intersectObjects(array, recursive) {

        if (typeof recursive !== 'boolean')
            recursive = true;
        raycaster.setFromCamera(mouseVector2, camera);

        return raycaster.intersectObjects(array, recursive);
    }


    //=========================下方为hzTree公用方法=================//



    /**
     * [getPickupPoint description]获取场景拾取坐标
     * @return {[type]} [description] 返回{x,y,z}
     */
    hzThree.getPickupPoint = function () {
        return curPickupPoint;
    };
    /**
     * [getPickupModels description] 获取场景模型
     * @return {[type]} [description] 返回模型数据
     *
     */
    hzThree.getPickupModels = function () {
        return curIntersectObj;

    };

    /**
     * [getViewPoint description] 获取当前视角位置
     * @return {[type]} [description] {x,y,z,targetX,targetY,yaw,roll,pitch}
     */
    hzThree.getViewPoint = function () {
        return controls.getCameraPos();
    };
    /**
     * [setViewPoint description] 设置视角位置
     * @param {[type]} val [description]{x,y,z,targetX,targetY,yaw,roll,pitch}
     */
    hzThree.setViewPoint = function (val) {
        controls.setCameraPos(val);
    };
    /**
     * [flyToViewPoint description]  设置视角飞行到的位置
     * @param  {[type]} val [description]{x,y,z,targetX,targetY,yaw,roll,pitch}
     * @return {[type]}     [description]
     */
    hzThree.flyToViewPoint = function (val) {
        controls.flyTo(val);
    };


    function loadComplete(mName, mPos, mRotataion, mdata, mCallbackHandler, obj) {
        obj.name = mName;
        objectNameMap[mName] = obj;
        addLib(obj);

        var objName = mdata.objName.toLowerCase(); //有可能出现Door 或者door为了判断 全部转换大小写为小写
        if (objName.indexOf('door_') === -1) {
            scene.add(obj);


        }
        if (mPos !== null) {
            obj.position.x = mPos.x;
            obj.position.y = mPos.y;
            obj.position.z = mPos.z;
        }
        if (mRotataion !== null) {
            obj.rotation.x = mRotataion.x;
            obj.rotation.y = mRotataion.y;
            obj.rotation.z = mRotataion.z;
        }
        if (mdata.hasOwnProperty('bornType') === true && mdata.bornType !== undefined && mdata.bornType !== null) { //添加方式
            obj.bornType = mdata.bornType;
        }
        if (mdata.hasOwnProperty('objType') === true && mdata.objType !== undefined && mdata.objType !== null) { //对象类型
            obj.objectType = mdata.objType;
        }
        //添加label标签
        if (mdata.hasOwnProperty('label') === true && mdata.label !== undefined && mdata.label !== null) {
            if (obj.label !== null) {
                scene.remove(obj.label);
                obj.label.dispose();
                obj.label = null;
            }
            obj.label = new Label3d(mdata.label, obj);
            scene.add(obj.label);

        }
        mCallbackHandler.executeWith(obj);
    }
    /**
     *
     * @param {Object} data 传入的参数数据object形式
     *       {
     * 			modelName:'test', //模型名
     * 			path:'http://192.16.1.1/', //模型根路径
     *          objName:'test.obj',//obj名
     *          mtlName:'test.mtl',//mtl名
     * 			bornType:'born_addModel' //模型来源，
     * 	    objType:'camera'
     *          //位置坐标
     * 			position:{
     * 						x:xx,
     * 						y:xx,
     * 						z:xx
     * 					 },
     * 			rotation:{
     * 						x:xx,
     * 						y:xx,
     * 						z:xx
     * 					 },
     * 			 label:{
     * 			     msg:'xxxxx',//显示的信息（必填 不填写就为空字符）
     * 			     fontface:'Arial',//字体名 (可缺失)
     * 			     fontsize：'100',//字体大小 (可缺失)
     * 			     textColor:'{r:255,b:255,g:255:a:1.0}', (可缺失) //字体颜色
     * 			     borderColor:'{r:255,b:255,g:255:a:1.0}' (可缺失) //描边颜色  缺失的情况下是没有描边的
     *
     * 			  }
     * 		 }
     *
     *
     *
     *
     *
     *
     *
     *
     *
     * @param {Object} callbackHandler  handler的回调函数
     */
    hzThree.addModel = function (data, callbackHandler) {
        if (data.hasOwnProperty('modelName') === false || data.modelName === undefined || data.modelName === null) {
            console.warn('addModel 数据格式不正确 缺少modelName');
            return;
        }
        if (data.hasOwnProperty('mtlName') === false || data.mtlName === undefined || data.mtlName === null) {
            console.warn('addModel 数据格式不正确 缺少mtlName');
            return;
        }
        if (data.hasOwnProperty('objName') === false || data.objName === undefined || data.objName === null) {
            console.warn('addModel 数据格式不正确 缺少objName');
            return;

        }
        if (callbackHandler === undefined || callbackHandler === null || (callbackHandler instanceof Handler) === false) {
            console.log('addModel 缺少回调函数或者 回调函数非Handler');
            return;
        }
        var modelPos = null;
        var modelRotation = null;
        if (data.hasOwnProperty('position') === true) {
            modelPos = new THREE.Vector3(parseFloat(data.position.x), parseFloat(data.position.y), parseFloat(data.position.z));
        }
        if (data.hasOwnProperty('rotation') === true) {
            modelRotation = new THREE.Vector3(parseFloat(data.rotation.x), parseFloat(data.rotation.y), parseFloat(data.rotation.z));
        }
        var completeHandler = new Handler(loadComplete, [data.modelName, modelPos, modelRotation, data, callbackHandler]);
        hzThree.scene.loadObj(data.path, data.mtlName, data.objName, {
            onLoad: completeHandler
        });
    };
    hzThree.load2d = function (imagePath, callbackHandler) {
        if (imagePath === undefined || imagePath === null || imagePath === '') {
            callbackHandler.execute();
            return;
        }
        var loader = new THREE.ImageLoader();
        loader.load(
            imagePath,
            function (image) {
                callbackHandler.executeWith(image);
            }
        );


    };

    function load2dComplete(labelName, title, labelPos, text, className, data, callbackHandler, obj) {
        var div = document.createElement('div');
        div.id = labelName;
        div.title = title || '';
        div.style.position = 'absolute';
        div.style.display = 'block';
        div.style.margin = '0';
        div.style.padding = '0';
        div.className = className || 'label-point';
        div.oncontextmenu = function () {
            return false;
        };

        if (!data.html) {
            if (obj !== undefined) {
                obj.className = 'label-image';
                div.appendChild(obj);
            }

            if (text !== undefined && text !== null && text !== '') {
                var span = document.createElement('span');
                span.innerHTML = text;
                span.className = 'label-span';
                div.appendChild(span);
            }
        } else {
            div.innerHTML = data.html;
        }

        threeMap.appendChild(div);
        var object2d = new Object2D(div, data, scene);
        object2dNameMap[labelName] = object2d;
        callbackHandler.executeWith(object2d);
    }
    /**
     *  data数据
     *  {
     *      id:test,//图片组件名
     *      image:http://192.16.1.1/test.jpg //图片地址
     *      position:{                      //需要传入3d的坐标地址
     * 				x:xx,
     * 				y:xx,
     * 				z:xx
     * 		 },
     *      text:xxx,文本内容
     *      className:xxxxx;//样式表
     *      minDis:10, //最小距离
     *      maxDis:1000 //最大距离
     * 
     *      //预留接口
     *      color:xxx//字体颜色
     *      bgColor:xxx//描边颜色
     *      font:字体//字体
     *      fontSize:xxx//
     *  }
     */

    hzThree.addLabel = function (data, callbackHandler) {

        if (data.hasOwnProperty('id') === false || data.id === undefined || data.id === null) {
            console.warn('addLabel 数据格式不正确 缺少modelName');
            return;
        }
        if (object2dNameMap[data.id] !== undefined) { //有相同元素
            hzThree.removeLabelById(data.id);
        }
        var labelPos = null;
        if (data.hasOwnProperty('position') === true) {
            labelPos = new THREE.Vector3(data.position.x, data.position.y, data.position.z);
        }
        var completeHandler = new Handler(load2dComplete, [data.id, data.title, labelPos, data.text, data.className, data, callbackHandler]);
        hzThree.load2d(data.image, completeHandler);

    };
    hzThree.getLabelById = function (val) {
        var node = object2dNameMap[val];
        return node;
    };
    /**
     * 通过id删除二维图标
     */
    hzThree.removeLabelById = function (val) {
        if (object2dNameMap.hasOwnProperty(val) === false) {
            console.warn('没有要删除的对象id为:' + val);
            return false;
        }
        var node = object2dNameMap[val];
        node.dispose();
        threeMap.removeChild(node.div);
        delete object2dNameMap[val];
        node = null;
        return true;
    };


    /**
     * 通过uuid删除场景中的模型  删除成功返回true 删除失败返回false
     * @param {Object} uuid 模型uid
     */
    hzThree.removeModelByUuid = function (uuid) {
        for (var i = 0; i < scene.children.length; i++) {
            var temp = scene.children[i];
            if (temp.uuid == uuid) {
                if (curIntersetModel !== null && curIntersetModel.isOnBorder === true && curIntersetModel === curBorderModel && curIntersetModel.isBorderShow === false) //添加Group
                {
                    removeMeshBorder(curIntersetModel);
                }

                if (curIntersetModel.isParentGroup() === true && curIntersetModel.parent.isOnBorder === true && curIntersetModel.parent === curBorderModel && curIntersetModel.isBorderShow === false) {

                    removeGroupBorder(curIntersetModel.parent);
                }
                curIntersetModel = null;
                curIntersetGroup = null;
                scene.remove(temp);
                temp.dispose();
                return true;
            }

        }
        return false;
    };

    /**
     * 通过name删除场景中的模型 删除成功返回true 删除失败返回false
     * @param {Object} modelName 模型名
     */
    hzThree.removeModelByName = function (modelName) {
        for (var i = 0; i < scene.children.length; i++) {
            var temp = scene.children[i];
            if (temp.name === modelName) {
                temp.showYArrow(false);
                if (curIntersetModel !== null) {
                    if (curIntersetModel !== null && curIntersetModel.isOnBorder === true && curIntersetModel === curBorderModel && curIntersetModel.isBorderShow === false) //添加Group
                    {
                        removeMeshBorder(curIntersetModel);
                    }

                    if (curIntersetModel.isParentGroup() === true && curIntersetModel.parent.isOnBorder === true && curIntersetModel.parent === curBorderModel && curIntersetModel.isBorderShow === false) {

                        removeGroupBorder(curIntersetModel.parent);
                    }
                    curIntersetModel = null;
                    curIntersetGroup = null;
                }
                scene.remove(temp);
                temp.dispose();
                return true;
            }

        }
        return false;
    };

    /**
     * 通过name删除场景中的模型 删除成功返回true 删除失败返回false
     * @param {Object} modelName 模型名
     */
    hzThree.removeModel = function (temp) {
        temp.showYArrow(false);
        if (curIntersetModel !== null) {
            if (curIntersetModel !== null && curIntersetModel.isOnBorder === true && curIntersetModel === curBorderModel && curIntersetModel.isBorderShow === false) {
                removeMeshBorder(curIntersetModel);
            }

            if (curIntersetModel.isParentGroup() === true && curIntersetModel.parent.isOnBorder === true && curIntersetModel.parent === curBorderModel && curIntersetModel.isBorderShow === false) {
                removeGroupBorder(curIntersetModel.parent);
            }
            curIntersetModel = null;
            curIntersetGroup = null;
        }
        scene.remove(temp);
        temp.dispose();
        return true;
    };


    hzThree.newHandler = function (fun, args) {
        return new Handler(fun, args);
    };



    //=================事件处理函数=======================//
    /**
     * 注册事件
     * @param {Object} type
     * @param {Object} listener
     */
    hzThree.on = function (type, listener) {
        evtDispatcher.addEventListener(type, listener);

    };

    /**
     * 判断是否已经注册该事件
     * @param {Object} type
     * @param {Object} listener
     */
    hzThree.hasOn = function (type, listener) {
        return evtDispatcher.hasEventListener(type, listener);
    };


    /**
     * 删除事件
     * @param {Object} type
     * @param {Object} listener
     */
    hzThree.off = function (type, listener) {
        evtDispatcher.removeEventListener(type, listener);
    };


    /**
     * 发送事件
     * @param {Object} event
     */
    hzThree.emit = function (event) {
        evtDispatcher.dispatchEvent(event);
    };
    hzThree.removeBorder = function (obj) {

        if (obj.border === undefined || obj.border === null) {
            return;
        }
        if (obj.type == 'Group') {
            removeGroupBorder(obj);
        } else if (obj.type == 'Mesh') {
            removeMeshBorder(obj);
        }
    };
    hzThree.setVisibleByName = function (na, visible) {
        if (objectNameMap.hasOwnProperty(na) === false) {
            console.warn('没有' + na + '==object');
            return;
        }
        if (objectNameMap.hasOwnProperty(na) === true) {
            if (objectNameMap[na] === undefined || objectNameMap[na] === null) {
                console.warn('没有' + na + '==object为空');
                return;
            }
            if ((objectNameMap[na] instanceof THREE.Object3D) === false) {
                console.warn(na + '类型不为Object3D');
                return;
            }
            objectNameMap[na].visible = visible;
        }

    };
    /**
     * 获取object的visible属性
     * @param {Object} na
     */
    hzThree.getVisibleByName = function (na) {
        if (objectNameMap.hasOwnProperty(na) === false) {
            console.warn('没有' + na + '==object');
            return undefined;
        }
        if (objectNameMap.hasOwnProperty(na) == true) {
            if (objectNameMap[na] === undefined || objectNameMap[na] === null) {
                console.warn('没有' + na + '==object为空');
                return undefined;
            }
            if ((objectNameMap[na] instanceof THREE.Object3D) === false) {
                console.warn(na + '类型不为Object3D');
                return undefined;
            }
            return objectNameMap[na].visible;
        }
    };
    /**
     * 根据name来获取对象
     * @param {Object} val
     */
    hzThree.getObjectByName = function (val) {
        //        if (objectNameMap.hasOwnProperty(val) === false) {
        //            console.warn('没有' + val + '==object');
        //            return undefined;
        //        }
        return objectNameMap[val];
    };
    /**
     * visible visbile属性的不停取反操作
     * @param {Object} na
     */
    hzThree.toggleVisibleByName = function (na) {
        hzThree.setVisibleByName(na, !hzThree.getVisibleByName(na));
    };
    /**
     * 设置控制器键盘是否可用
     * @param {Object} val
     */
    hzThree.setControlKeysEnable = function (val) {
        controls.enableKeys = val;
    };
    /**
     * 设置控制器鼠标事件是否可用
     * @param {Object} val
     */
    hzThree.setControlMouseEnable = function (val) {
        controls.enabledMouse = val;
    };


    hzThree.openDoor = function (objName) {
        var temp = hzThree.getObjectByName(objName);

        if (temp && temp.type === 'Door') {
            temp.openDoor();
        }

    };

    hzThree.closeDoor = function (objName) {
        var temp = hzThree.getObjectByName(objName);

        if (temp.type === 'Door') {
            temp.closeDoor();
        }
    };
    hzThree.openArrester = function (objName) {
        var temp = hzThree.getObjectByName(objName);
        if (temp && temp.type === 'arrester') {
            temp.open();
        }
    };
    hzThree.closeArrester = function (objName) {
        var temp = hzThree.getObjectByName(objName);
        if (temp && temp.type === 'arrester') {
            temp.close();
        }
    };
    hzThree.addScene = function (obj) {



        if (obj.name !== undefined && obj.name !== '' && obj.name !== null && objectNameMap.hasOwnProperty(obj.name) === false) {
            objectNameMap[obj.name] = obj;
            objectIdMap[obj.id] = obj;
            scene.add(obj);
        } else {
            console.warn('场景中已有该命名的对象!无法添加成功!');
        }


    };


    hzThree.sceneAdd = function (obj) {
        scene.add(obj);


    };
    hzThree.sceneRemove = function (obj) {
        scene.remove(obj);

    };



    /**
     * 围绕当前视点开始旋转
     * @return {[type]} [description]
     */

    hzThree.aroundPoint = function () {
        controls.aroundPoint();
    };
    /**
     * 旋转物体
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    hzThree.rotateObject3d = function (obj) {
        transformControls.detach();
        transformControls.setSpace('local');
        transformControls.setMode("rotate");
        transformControls.attach(obj);

    };

    /**
     * 旋转物体
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    hzThree.translateObject3d = function (obj) {
        transformControls.detach();
        transformControls.setSpace('world');
        transformControls.setMode('translate');
        transformControls.attach(obj);
    };

    /**
     * 取消选中旋转物体
     * @return {[type]} [description]
     */
    hzThree.detachObject3d = function () {
        transformControls.detach();
    };
    /**
     * 从2位点获取对象
     * @param  {[type]} arr [description]  配置需要查找的数组
     * @param  {[type]} v   [description]  二维坐标点
     * @return {[type]}     [description]
     */
    hzThree.findObject = function (arr, v) {
        raycaster.setFromCamera(v, camera);
        var result = raycaster.intersectObjects(arr, true);
        if (result.length > 0) {
            return result[0];
        }
        return undefined;
    };
    /**
     * 设置天空和盒子属性
     * {
     *    negX:xxx,
     *    negY:xxx,
     *    negZ:xxx,
     *    posX:zzz,
     *    posY:zzz,
     *    posZ:xxx,
     *    path://这只根路径
     * }
     * @param {[type]} data [description]
     */
    hzThree.setSkyBox = function (data, errorCall) {
        if (skyMesh !== null) { //如果不为空代表已经有天空盒子 先清除原有记录
            scene.remove(skyMesh);
            skyMesh.geometry.dispose();
            skyMesh.material.dispose();
        }

        var loader = new THREE.CubeTextureLoader();
        var loadStatus = true; // false 表示加载失败

        if (data.hasOwnProperty('path') === true && data.path !== undefined && data.path !== null) {
            loader.setPath(data.path);
        }

        var textureCube = loader.load([
            data.posX, data.negX,
            data.posY, data.negY,
            data.posZ, data.negZ,
        ], function () {
            var cubeShader = THREE.ShaderLib.cube;
            cubeShader.uniforms.tCube.value = textureCube;
            var geometry = new THREE.BoxGeometry(1000000, 1000000, 1000000);

            var skyBoxMaterial = new THREE.ShaderMaterial({
                fragmentShader: cubeShader.fragmentShader,
                vertexShader: cubeShader.vertexShader,
                uniforms: cubeShader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            });
            skyMesh = new THREE.Mesh(geometry, skyBoxMaterial);
            skyMesh.name = 'skyBox';
            scene.add(skyMesh);
        }, null, function () {
            console.log('加载天空盒失败!');
            if (loadStatus) {
                loadStatus = false;
                errorCall && errorCall();
            }
        });

        textureCube.needsUpdate = true;

    };
    hzThree.worldPos2ScreenPos = function (pos) {
        var vector = new THREE.Vector3();
        vector.x = pos.x;
        vector.y = pos.y;
        vector.z = pos.z;

        // TODO: need to update this when resize window
        var widthHalf = 0.5 * renderer.context.canvas.width;
        var heightHalf = 0.5 * renderer.context.canvas.height;

        // this.updateMatrixWorld();
        // vector.setFromMatrixPosition(this.matrixWorld);
        vector.project(camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;

        return {
            x: vector.x,
            y: vector.y
        };

    };
    //=========================================
    EventConsts.removeBorder = hzThree.removeBorder; //代理删除对象
    EventConsts.addBorder = addBorder;
    EventConsts.removeBorder = removeBorder;
    EventConsts.evtDispatcher = evtDispatcher;
    EventConsts.mapRoute = mapRoute;



    //==========================================
    Object.defineProperty(hzThree, 'hzThree.tweenRunning', {
        get: function () {
            return hzThree.tweenRunning;
        },
        set: function (val) {
            hzThree.tweenRunning = val;
        }
    });




    hzThree.createSphere = function (radius, color, position) {
        var geometry = new THREE.SphereGeometry(radius, 32, 32);
        var material = new THREE.MeshBasicMaterial({
            color: color || 0xffff00
        });

        material.alphaTest = 0.1;
        material.opacity = 0.5;
        material.transparent = true;
        position = position || {};

        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = position.x || 0;
        sphere.position.y = position.y || 0;
        sphere.position.z = position.z || 0;
        hzThree.sceneAdd(sphere);
        return sphere;
    };


    /*
     *
     */
    hzThree.transformControls = function () {
        return transformControls;
    };

    hzThree.getTransformCtrlObj = function () {
        return transformControls;
    };
    /**
     * 设置模型对象是否在Building的控制范围下 true为可控 false为不可控
     * @param  {[type]} arr   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    hzThree.buildingUnderControl = function (arr, value) {
        for (var index = 0; index < arr.length; index) {
            var obj = hzThree.getObjectByName(arr[index]);
            if (obj !== undefined) {
                obj.isCtrBuilding = value;
            }
        }
    };


    /*
     * 根据类型获取射线相交的模型
     */
    hzThree.getIntersectObjectByType = function (type) {
        var list = hzThree.objectMap[type];
        var nList = [];

        for (var i = 0; i < list.length; i++) {
            if (list[i].visible) {
                if (list[i].parent.visible)
                    nList.push(list[i]);
            }
        }

        return type ? _intersectObject(nList) : null;
    };
    /**
     * 根据点获取最近的box
     * @param  {[type]} p   [description]
     * @param  {[type]} max [description]
     * @return {[type]}     [description]
     */
    hzThree.getRoomBox = function (pos, maxDis) {
        var p = new THREE.Vector3(parseFloat(pos.x), parseFloat(pos.y), parseFloat(pos.z));
        var boxArray = hzThree.objectMap['T016'];
        var minBox = undefined;
        if (Array.isArray(boxArray) === false) {
            return minBox;
        }
        for (var index = 0; index < boxArray.length; index++) {
            var box = boxArray[index];
            if (box.boundingSphere === undefined || box.boundingSphere === null) {
                box.geometry.computeBoundingSphere();
            }
            var sphere = box.geometry.boundingSphere;
            var dis = sphere.center.distanceTo(p);
            if ((dis - sphere.radius) > maxDis) { //如果半径大于最大距离直接跳过
                continue;
            } else {
                if (minBox === undefined) { //找到第一个点
                    minBox = box;
                    minBox.disBox = dis;
                } else //找到第后边的点继续找
                {
                    if (minBox.disBox > dis) { //当前点的距离小于上个点
                        minBox = box;
                        minBox.disBox = dis;
                    }

                }

            }

        }
        return minBox;
    };


    /*
     * 获取镜头对象
     */
    hzThree.getCameraObj = function () {
        return camera;
    };
    /**
     * 判断点是否在网格内的矩形网格内 适合box 其他形状网格可能会有误差
     * p 为坐标点
     * boxname为box名字
     */
    hzThree.isInBox = function (p, boxname) {
        var v = new THREE.Vector3(parseFloat(p.x), parseFloat(p.y), parseFloat(p.z));
        var b = false;
        var box = hzThree.getObjectByName(boxname);
        if (box === undefined || box === null) {
            return true;
        }
        if (box instanceof THREE.Object3D) {
            box.geometry.computeBoundingBox();
            var box3 = box.geometry.boundingBox;
            b = box3.containsPoint(v);
        }
        return b;
    };
    hzThree.getScreenTo3dPos = function (data) {
        var vector = new THREE.Vector3();

        vector.set(
            data.x,
            data.y,
            0.5);

        vector.unproject(camera);

        var dir = vector.sub(camera.position).normalize();

        var distance = (-camera.position.y) / dir.y; //忽略那个轴的数据就设置那个轴数据

        var pos = camera.position.clone().add(dir.multiplyScalar(distance));

        pos = new THREE.Vector3(pos.x, pos.y, pos.z);
        return pos;
    };
    /**
     * 是否启用地图
     * @method enableMap
     * @method b  true/false
     * 
     */
    hzThree.enableMap = function (b) {
        if (b === false) {
            cancelAnimationFrame(animatie);
            _initEvents(false);
            controls.removeEvents();
            animatie = null;
            //threeMap.style.visibility = 'hidden';
        } else {
            if (animatie !== null) return;
            _animate();
            _initEvents(true);
            controls.initEvent();
            //threeMap.style.visibility = 'visible';
        }


    };
    /**
     * 绘制一个平面 
     * id为唯一标识符
     * data 数组三维点数据
     * options 为绘制参数
     * 主要是Material参数的直接实现
     *    
     * 返回创建的object3d
     */
    hzThree.drawPlane = function (id, data, options) {
        if (data.length < 3) {
            console.warn("绘制一个面至少需要3个点");
            return;
        }
        var geometry = new THREE.Geometry();
        var faceArray = [];
        for (var index = 0; index < data.length; index++) {
            var point = data[index];
            var v = new THREE.Vector3();
            v.copy(point);
            geometry.vertices.push(v);
            faceArray.push(index);
        }
        for (var key = 2; key < faceArray.length; key++) {
            geometry.faces.push(new THREE.Face3(faceArray[0], faceArray[key - 1], faceArray[key]));
        }
        if (options === undefined) {
            options = {};
            options.color = 0xFF0000;

        }
        if (options.color === undefined) {
            options.color = 0xFF0000;
        }
        options.side = THREE.DoubleSide;
        var material = new THREE.MeshBasicMaterial(options);
        var rectMesh = new THREE.Mesh(geometry, material);
        scene.add(rectMesh);
        objectNameMap[id] = rectMesh;
        return rectMesh;

    };
    //删除一个面
    hzThree.removePlane = function (id) {
        var obj = hzThree.getObjectByName(id);
        if (obj !== undefined) {
            scene.remove(obj);
            delete objectNameMap[id];
            obj.dispose();
        }


    };
    /**
     * val 传入3维物体 
     * 返回 这个物体整体的名字 层级到到scene
     */
    hzThree.getNameByObject3d = function (val) {

        if (val.parent === scene || val.parent === null || val.parent === undefined) {

            return val.name;
        } else {
            return hzThree.getNameByObject3d(val.parent);
        }
    };
    /*
     * 注入模块方法
     */
    try {
        var hz = window.top.hz;
        // 针对类似frame框架的模型化处理
        try {
            if (hz) {
                if (hz.hzThree) {
                    console.log('hz.three：引用顶层父级hzThree对象...');
                    return hz.hzThree;
                }
            } else {
                hz = window.top.hz = {};
            }
        } catch (e) {
            console.error('hz.db：引用顶层父级hzThree对象失败...');
        }

        // 初始化对象
        hzThree.scene = new HzScene();
        hzThree.camera = new HzCamera();
        hzThree.Building = Building;
        
        //事件模型
        hzThree.Events = Events;
        hzThree.HzEvent = HzEvent;
        hzThree.MouseEvent = MouseEvent;
        hzThree.ModelEvent = ModelEvent;
        hzThree.Handlers = Handler;
        hzThree.addBorder = addBorder;
        hzThree.removeBorder = removeBorder;
        hzThree.degToRad = THREE.Math.degToRad;

        hz.hzThree = window.top.hzThree = EventConsts.hzThree = hzThree;
        console.log('初始化 --> 三维地图加载模块...');

        return hzThree;
    } catch (e) {
        console.error('初始化 --> 三维地图加载模块失败，' + e);
    }

});