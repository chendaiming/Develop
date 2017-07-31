define(function (require) {

    var UAV = function (mesh) {
        var scope = this;
        this.rotY = 0;
        var propellerNameArray = ["UAV_model_r_f", "UAV_model_r_b", "UAV_model_l_b", "UAV_model_l_f"];
        var posArray = [new THREE.Vector4(40,8,50),new THREE.Vector4(-40,8,50),new THREE.Vector4(40,8,-50),new THREE.Vector4(-40,8,-50)];
        var propellerArray = [];
        for (var index = 0; index < propellerNameArray.length; index++) {
            var propellerName = propellerNameArray[index];
            var obj = mesh.getObjectByName(propellerName);
            var out = new THREE.Object3D();
            out.add(obj);
            mesh.add(out);
            obj.geometry.center();

            out.position.copy(posArray[index]);
            propellerArray.push(out);
    
            

        }

        this.update = function (val) {    
            scope.rotY+=val;    
            for (var index = 0; index < propellerArray.length; index++) {
                var obj = propellerArray[index];
                obj.rotation.y +=0.7;
            }
        };
    };

    return UAV;
});