//鼠标事件常量设置名
define(function(require) {
    //鼠标事件
    var MouseEvent = {
        CLICK: 'click', //单击
        MOUSE_DOWN: 'mousedown', //按下
        MOUSE_UP: 'mouseup', //放开
        MOUSE_MOVE: 'mousemove',
        MOUSE_WHEEL: 'mousewheel', //滑轮滚动
        DOUBLE_CLICK: "doubleClick",
        RIGHT_CLICK: "rightClick",
        RIGHT_MOUSE_DOWN: "rightMouseDown",
        RIGHT_MOUSE_UP: 'rightMouseUp'

    };
    //系统设定的事件名
    var HzEvent = {
        PICK_UP_MODEL: 'pickupmodel', //拾取模型事件
        PICK_UP_POINT: 'pickuppoint', //拾取点事件
        MOUSE_WHEEL: 'mousewheel', //滑轮滚动
        EDIT_ROUTE_CLICK: 'edit_route_click', //编辑路径点击地面
        PICK_UP_BOX_SELECT: 'pick_up_box_select', //框选成功后得到数据发送的事件
        PATROL_3D_OVER: 'patrol_3d_over', //3d巡视结束
        UPDATE_SEARCH_DATA: 'update_search_data', //更新巡视时的搜索点事件
        TRACK_OVER: 'track_over', //轨迹跟踪结束
        OPEN_DOOR: 'open_door', //开门  Door类内部使用
        CLOSE_DOOR: 'close_door', //关门 Door内部使用
        OPEN_DOOR_OVER: 'open_door_over', //门打开过程结束
        CLOSE_DOOR_OVER: 'close_door_over', //门关闭过程结束
        ADD_POINT_ROUTE: 'add_point_route', //在路由编辑上加点事假(内部用)
        CHANGE_POINT_ROUTE: 'change_point_route', //在路由编辑上修改点位置(内部用)
        DELETE_POINT_ROUTE: 'delete_point_route', //在路由上删除模一个点
        SELECT_POINT_ROUTE: 'select_point_route', //选择到路由点
        ADD_POINT_ROUTE_ONLINE: 'add_point_route_online', //在线段上点击天机一个点
        MOVE_PATROL3D: 'move_patrol3d', //在3d巡视的时候 每移动一帧就触发该事件
        MOVEOBJ3D_STOP: 'moveobj3d_stop', //移动3d物体移动结束
        MOVEOBJ3D_UPDATE: 'moveobj3d_update', //移动每帧触发
        FLY_OVER: 'fly_over', //飞行结束
        UPDATE_CAMERA_ROTATE: 'update_camera_rotate', //摄像机角度变换 影响指南针
        ARRESTER_OPEN:'Arrester_open',//阻止器开启
        ARRESTER_CLOSE:'Arrester_close'//阻止器关闭

    };
    var ModelEvent = {
        MODEL_CLICK: 'modelclick', //模型左键单击
        MODEL_DOUBLE_CLICK: 'modeldoubleclick', //模型双击
        MODEL_ROLL_OVER: 'modelrollover', //模型移入
        MODEL_ROLL_OUT: 'modelrollout', //模型移出  
        MODEL_RIGHT_CLICK: 'modelrightclick' //模型右键单击
    };
    //对象类型 用于搜索判断
    // var ObjectType = {
    //     camera: 'camera' //摄像机

    // };
    //对象来源
    var ObjectSrcType = {
        ADD_MODEL: 'born_addModel', //自定义添加
        LOAD: 'born_load' //默认初始化加载进来的
    };

    /**
     * 事件类
     * @param {Object} eventName 事件名
     * @param {Object} data  需要发送的数据
     */
    var Events = function(eventName, data) {
        this.type = eventName;
        this.data = data;

    };
    Events.prototype.constructor = Events;

    var objectIdMap = {}; ///网格字典
    var modelMap = {}; //模型字典
    var objectNameMap = {};
    var doorCache = {}; //门原型缓存
    var bedCache = {}; //床原型缓存
    var object2dNameMap = {}; //2d图片缓存
    var arresterCache = {};//阻止器的缓存

    var logDepthBuffer = false;
    var removeBorder;
    var addBorder;
    var removeBorder;
    var renderer;
    var camera;
    var scene;
    var evtDispatcher; //事件单例
    var hzThree; //主类本身
    var frustum;
    var light;
    return {
        logDepthBuffer:logDepthBuffer,
        MouseEvent: MouseEvent,
        HzEvent: HzEvent,
        Events: Events,
        ModelEvent: ModelEvent,
        objectIdMap: objectIdMap,
        modelMap: modelMap,
        objectNameMap: objectNameMap,
        doorCache: doorCache,
        bedCache: bedCache,
        ObjectSrcType: ObjectSrcType,
        renderer: renderer,
        camera: camera,
        evtDispatcher: evtDispatcher,
        hzThree: hzThree,
        scene: scene,
        object2dNameMap: object2dNameMap,
        frustum: frustum,
        arresterCache:arresterCache

    };

});