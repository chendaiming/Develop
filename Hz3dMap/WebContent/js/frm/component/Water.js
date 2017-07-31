define(function(require) {
    var WaterShader = require('frm/extra/WaterShader');
    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');
    var water;
    var Water = function(geo) {
        var camera = EventConsts.camera;
        var scene = EventConsts.scene;
        var renderer = EventConsts.renderer;
        var light = new THREE.Vector3(-1, -1, -1);
        var geometry = geo;

        var waterNormals = new THREE.TextureLoader().load(ctx + 'css/images/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        water = new WaterShader(renderer, camera, scene, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 0.8,
            sunDirection: light.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 50.0
        });
        var mirrorMesh = new THREE.Mesh(
            // new THREE.PlaneBufferGeometry(2000, 2000),
            geometry,
            water.material
        );
        mirrorMesh.add(water);
        scene.add(mirrorMesh);
        mirrorMesh.position.y = 10;
    };
    Object.assign(Water.prototype, THREE.EventDispatcher.prototype, {

    });
    Water.update = function() {
        if (water !== undefined) {
            water.material.uniforms.time.value += 1.0 / 100.0;
            water.render();
        }


    };
    return Water;
});