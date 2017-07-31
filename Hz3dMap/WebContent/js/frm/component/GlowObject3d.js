define(function(require) {
    require('THREE');
    require('frm/core/expand');
    var EventConsts = require('frm/events/EventConsts');
    var vertexShader = [
        "uniform vec3 viewVector;",
        "uniform float c;",
        "uniform float p;",
        "varying float intensity;",
        "void main()",
        "{",
        "vec3 vNormal = normalize( normalMatrix * normal );",
        "vec3 vNormel = normalize( normalMatrix * viewVector );",
        "intensity = pow( c - dot(vNormal, vNormel), p );",

        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"

    ].join("\n");
    var fragmentShader = [
        "uniform vec3 glowColor;",
        "varying float intensity;",
        "void main() {",
        "vec3 glow = glowColor * intensity;",
        "gl_FragColor = vec4(glow, 1.0);",
        "}"
    ].join("\n");

    var GlowObject3d = function(geometries) {
        var camera = EventConsts.camera;
        THREE.Object3D.call(this);
        this.geometries = geometries.clone(); //获取几何矩形


        var customMaterial = new THREE.ShaderMaterial({
            uniforms: {
                "c": { type: "f", value: 0.7 },
                "p": { type: "f", value: 4.8 },
                glowColor: { type: "c", value: new THREE.Color(0xff0000) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.mesh = new THREE.Mesh(this.geometries, customMaterial);
        this.mesh.scale.multiplyScalar(1.006);
        this.add(this.mesh);
        GlowObject3d.glowObject3dArray.add(this.mesh);

    };
    GlowObject3d.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        constructor: GlowObject3d,
        dispose: function() {

        }

    });
    GlowObject3d.glowObject3dArray = [];
    GlowObject3d.update = function() {
        for (var index = 0; index < GlowObject3d.glowObject3dArray.length; index++) {
            var mesh = GlowObject3d.glowObject3dArray[index];
            mesh.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(EventConsts.camera.position, mesh.parent.position);
        }
    };
    return GlowObject3d;
});