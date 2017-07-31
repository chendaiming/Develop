define(function(require) {
    var Logo = function(canvas) {
        var scene;
        var camera;
        var render;

        var boxMesh;

        var width = canvas.width;
        var height = canvas.height;

        var txt = '智慧监所';


        var font = undefined;
        var txtMesh;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, width / height, 10, 100);
        camera.position.set(0, 2, 30);
        camera.lookAt(scene.position);
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        scene.add(camera);


        var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
        dirLight.position.set(0, 0, 1).normalize();
        scene.add(dirLight);
        var pointLight = new THREE.PointLight(0xffffff, 1.5);
        pointLight.position.set(0, 100, 90);
        scene.add(pointLight);


        //		var  ambientLight = new THREE.AmbientLight('rgb(255,255,255)', 1);
        //      scene.add(ambientLight);

        var fontPath = ctx + 'models/Microsoft YaHei_Bold.json';

        function loadFont() {
            var loader = new THREE.FontLoader();
            loader.load(fontPath, function(response) {
                font = response;
                createTxt();
            });
        }
        var group;

        function createTxt() {
            var geometry = new THREE.TextGeometry(txt, {
                font: font,
                size: 10,
                height: 3
            });
            geometry.computeBoundingBox();
            geometry.computeVertexNormals();

            var centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            material = new THREE.MultiMaterial([
                new THREE.MeshPhongMaterial({
                    color: 0x00FFFF,
                    shading: THREE.FlatShading
                }), // front
                new THREE.MeshPhongMaterial({
                    color: 0x00FFFF,
                    shading: THREE.SmoothShading
                }) // side
            ]);
            txtMesh = new THREE.Mesh(geometry, material);

            txtMesh.position.x = centerOffset;


            group = new THREE.Group();
            group.add(txtMesh);
            scene.add(group);
        }



        loadFont();

        //		var geometry = new THREE.BoxGeometry( 10, 10, 10 );
        //		var material = new THREE.MeshPhongMaterial( {color: 0xFFFF00} );
        //		var cube = new THREE.Mesh( geometry, material );
        //		scene.add( cube );


        renderer.setClearColor(0xFF0000, 0); // 清除颜色

        renderer.setPixelRatio(window.devicePixelRatio);

        function render() {


            renderer.render(scene, camera);


        }
        this.update = function() {
            //			if(group!==undefined&&group!==null)
            //			{
            //				group.rotation.y+=0.01;
            //				group.rotation.x+=0.01;
            //
            //			}

            render();
        };

    };
    Logo.prototype.constructor = Logo;

    return Logo;


});
