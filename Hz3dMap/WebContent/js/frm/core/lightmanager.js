define(function(require) {
    require('THREE');


    let EventConsts = require('frm/events/EventConsts');
    let LightManager = function() {
        let scope = this;
        this.hzThree = EventConsts.hzThree;
        let lightMap = new Map();

        function addLight(obj) {
            lightMap.set(obj.id, obj);
            this.hzThree.sceneAdd(obj);
        }
        this.loadLightFile = function(url) {
            let loader = new THREE.FileLoader();

            //load a text file a output the result to the console
            loader.load(
                // resource URL
                url,

                // Function when resource is loaded
                function(data) {
                    // output the text to the console

                    let obj = JSON.parse(data);
                    scope.importLight(obj);
                },

                function() {},

                // Function called when download errors
                function(xhr) {
                    console.log('读取光源文件失败');
                    scope.loadDefault();
                }
            );
        };
        this.loadDefault = function() {
            scope.loadLightFile(ctx + '/js/frm/data/defaultLight.json');

        };
        /**
         * 导入光源数据
         */
        this.importLight = function(data) {
            scope.deleteAllLights();

            var loader = new THREE.ObjectLoader();

            let arr = data;


            for (let lightjson of arr) {
                lightjson = JSON.parse(lightjson);
                let light1 = loader.parse(lightjson);
                addLight(light1);
            }
        };
        this.deleteAllLights = function() {
            for (let [id, light] of lightMap.entries()) {
                light.parent.remove(light);
                lightMap.delete(id);
                light.dispose();
            }
        };

    };
    return LightManager;
});