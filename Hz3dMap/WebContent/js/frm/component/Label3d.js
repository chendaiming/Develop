define(function(require) {
	require('THREE');

    /**
     *
     * 			     msg:'xxxxx',//显示的信息（必填 不填写就为空字符）
     * 			     fontface:'Arial',//字体名 (可缺失)
     * 			     fontsize：'100',//字体大小 (可缺失)
     * 			     textColor:'{r:255,b:255,g:255:a:1.0}', (可缺失) //字体颜色
     * 			     borderColor:'{r:255,b:255,g:255:a:1.0}' (可缺失) //描边颜色  缺失的情况下是没有描边的
     *
     * */
    var Label3d = function(data,owner) {
        THREE.Object3D.call(this);
        this.data = data;
        this.owner = owner;
        this.txt = makeTextSprite(data.msg, data);
        this.add(this.txt);
        this.refreshPos();
        /**
         * 创建永远面向相机的2D文字
         * */
        function makeTextSprite(message, parameters) {
            if (parameters === undefined) parameters = {};
            var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
            var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 100;
            var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 6;
            var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : {r: 255, g: 0, b: 0, a: 1.0};
            var canvas = document.createElement('canvas');

            canvas.width = 1024;
            canvas.height = 256;

            var context = canvas.getContext('2d');
            context.font = "Bold " + fontsize + "px " + fontface;
            var metrics = context.measureText(message);
            var textWidth = metrics.width;
            var n = Math.ceil(Math.log2(textWidth));
            var txtWidth = Math.pow(2, n);
            //  canvas.width = 1024;


            context.lineWidth = borderThickness;

            if (parameters.hasOwnProperty("borderColor") === true) {
                var borderColor = parameters["borderColor"];
                context.strokeStyle = "rgba(" + borderColor.r + ", " + borderColor.g + ", " + borderColor.b + "," + borderColor.a + ")";
                context.strokeText(message, borderThickness, fontsize + borderThickness);
            }

            context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + "," + textColor.a + ")";
            context.fillText(message, borderThickness, fontsize + borderThickness);

            var texture = new THREE.Texture(canvas)
            texture.needsUpdate = true;

            var spriteMaterial = new THREE.SpriteMaterial({
                map: texture

            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
            return sprite;
        }


    };

    Label3d.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {

        constructor: Label3d,
        //销毁
        dispose:function(){
            this.remove(this.txt);
            this.txt.material.dispose();
            if(this.txt.material.map!==null){
               this.txt.material.map.dispose();
            }
            this.txt = null;
            this.data = null;
            this.owner = null;
        },
        /**
         * 刷新坐标  一旦字的样子改变
         * @return {[type]} [description]
         */
        refreshPos:function(){
            if(this.owner===null||this.owner===undefined){
                console.warn('label没有宿主对象');
                return;
            }
            var mesh = null;
            if(this.owner.type=='Group')
            {
               mesh = this.owner.children[0]
            }else if(this.owner.type=='Mesh'){
                mesh = this.owner;
            }else{
                console.warn('label宿主的类型不对 无法计算宿主的宽高');
                this.position.x = this.owner.position.x;
                this.position.y = this.owner.position.y;
                this.position.z = this.owner.position.z;
                return;
            }
            mesh.geometry.computeBoundingSphere();
            var sp = mesh.geometry.boundingSphere;      
            this.txt.position.x = this.owner.position.x+sp.radius;
            this.txt.position.y = this.owner.position.y+sp.radius;
            this.txt.position.z = this.owner.position.z+sp.radius;

        }
    });
    return Label3d;
});
