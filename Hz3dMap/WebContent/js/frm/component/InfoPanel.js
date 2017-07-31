/**
 * 床铺类
 * @type {[type]}
 *
 *
 * 数据格式       {
             name:'李四',
             code:'12121212121212112',
             img: 'http://192.168.3.121:8080/models/mkjy/avatar.jpg',
             bgColor:{r:255,g:0,b:0,a:0.5},
             textColor:{r:255,g:255,b:0,a:1},
             bgImageUrl:'http://192.168.3.121:8080/models/mkjy/avatar.jpg',
             bgImageAlpha:0.8
              }
 *
 */
define(function(require) {
    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');
    var Events = EventConsts.Events;

    /*
     * 添加面板
     * @param params = {
     * 		"name":"面板显示名称（必填）",
     * 		"canvas": "",
     * 		"width": "",
     * 		"height": "",
     * 		"userData": "", 
     * 		"position": {
     * 			"x": 0,
     * 			"y": 0,
     * 			"z": 0,
     * 		},
     * 		
     * }
     */
    function InfoPanel(params) {
        THREE.Object3D.call(this);

        var texture, geometry, material, infoMesh, self = this;

        if (!params) throw '请输入请求参数';
        if (!params.name) throw '请输入名称[name]';
        if (!params.canvas) throw '请输入画布[canvas]';
        if (!params.position) throw '请输入面板点位[position]';

        params.width = params.width || 80;
        params.height = params.height || 40;

        this.proxydispose = THREE.Object3D.prototype.dispose;
        this.instance = null;
        this.name = 'info_panel_' + params.name;
        this.type = 'InfoPanel';
        this.data = params.userData;

        // 创建贴图
        texture = new THREE.Texture(params.canvas);
        texture.needsUpdate = true;

        // 创建几何
        geometry = new THREE.PlaneGeometry(params.width, params.height);

        // 创建材质
        material = new THREE.MeshBasicMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            map: texture,
        });

        // 创建网格
        infoMesh = new THREE.Mesh(geometry, material);
        infoMesh.name = 'info_plane_mesh_' + params.name;
        infoMesh.position.y = params.height / 2;

        this.position.x = params.position.x || 0;
        this.position.y = params.position.y || 0;
        this.position.z = params.position.z || 0;

        this.instance = infoMesh;
        this.add(infoMesh);


        // 初始化事件
        function onModelClick(e) {
            var evt = new Events(InfoPanel.event.CLICK, e.data);
            self.dispatchEvent(evt);
        }

        function onModelOver(e) {
            var evt = new Events(InfoPanel.event.MOUSE_OVER, e.data);
            self.dispatchEvent(evt);
        }

        function onModelOut(e) {
            var evt = new Events(InfoPanel.event.MOUSE_OUT, e.data);
            self.dispatchEvent(evt);
        }

        function onModelRightClick(e) {
            var evt = new Events(InfoPanel.event.RIGHT_CLICK, e.data);
            self.dispatchEvent(evt);
        }


        this.instance.on('modelclick', onModelClick);
        this.instance.on('modelrollover', onModelOver);
        this.instance.on('modelrollout', onModelOut);
        this.instance.on('modelrightclick', onModelRightClick);

        InfoPanel.instancesArray.push(this);
    }

    /*
     * 更新画布
     */
    InfoPanel.prototype.updateCanvas = function(canvas) {

    };


    InfoPanel.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        constructor: InfoPanel,

        /*
         * 销毁对象
         */
        dispose: function() {
            InfoPanel.instancesArray.remove(this);

            this.proxydispose();
            this.instance.removeAllEvents();
            this.remove(this.instance);
            this.instance.dispose();

            this.proxydispose = undefined;
            this.instance = undefined;
            this.type = undefined;
            this.data = undefined;
        }
    });




    InfoPanel.instancesArray = [];

    InfoPanel.event = {
        CLICK: 'click',
        MOUSE_OVER: 'mouse_over',
        MOUSE_OUT: 'mouse_out',
        RIGHT_CLICK: 'right_click'
    };


    InfoPanel.update = function() {
        var size = InfoPanel.instancesArray.length,
            instace;
        for (var i = 0; i < size; i++) {
            instace = InfoPanel.instancesArray[i];
            instace.lookAt(EventConsts.camera.position);
        }
    };




    return InfoPanel;
});