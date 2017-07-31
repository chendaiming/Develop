/**
 * 第一主角类 主要用于在场景中进行 第一视角巡视
 */
define(["frm/events/EventConsts", "THREE"], function(EventConsts, THREE) {
    var Player = function() {
        THREE.Object3D.call(this);
        this.box = null; // 目标检测本身

        var boxGemo = new THREE.BoxBufferGeometry(50, 170, 50);
        var material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
        this.box = new THREE.Mesh(boxGemo, material);
        this.add(this.box);
        this.box.position.y = -85;

    };
    Player.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        constructor: Player,



    });
    return Player;
});