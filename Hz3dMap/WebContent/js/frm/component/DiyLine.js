/**
 * 自定义管线
 */
define(function (require) {
    require('THREE');
    // require('frm/core/expand');
    /**
     * 
     * @param {*} start  开始点
     * @param {*} end    结束点
     * @param {*} radius  半径尺寸
     * @param {*} color   颜色
     */
    var DiyLine = function (start, end, radius = 1, color = 0xff0000) {
        THREE.Object3D.call(this);
        var scope = this;
        this.start = start;
        this.end = end;
        this.tubeMesh = null;
        this.radius = radius;
        this.color = color;





        this.create = function () {
            var path = new THREE.LineCurve3(scope.start, scope.end);
            var geometry = new THREE.TubeBufferGeometry(path, 20, scope.radius, 15, false);
            var material = new THREE.MeshPhongMaterial({
                color: scope.color,
                specular: 0xCCCCCC,
                shininess: 1,
                side: THREE.DoubleSide
            });

            scope.tubeMesh = new THREE.Mesh(geometry, material);
            scope.add(scope.tubeMesh);
        };
        /**
         * 设置结束点
         */
        this.setEnd = function (pos) {
            scope.end = pos;
            if (scope.tubeMesh !== null) {
                scope.remove(scope.tubeMesh);
                scope.tubeMesh.dispose();
            }


            scope.create();
        };
        /**
         * 设置开始点
         */
        this.setStart = function (pos) {
            scope.start = pos;
            if (scope.tubeMesh !== null) {
                scope.remove(scope.tubeMesh);
                scope.tubeMesh.dispose();
            }


            scope.create();
        };
        /**
         * 删除后调用一下
         */
        this.dispose = function () {
            if (scope.tubeMesh !== null) {
                this.remove(scope.tubeMesh);
                scope.tubeMesh.dispose();
                scope.tubeMesh = null;
            }

        };
        this.getSP = function () {
            return scope.start.clone();
        };
        this.getEP = function () {
            return scope.end.clone();
        };
        /**
         * 获取线段长度
         */
        this.distance = function () {
            return parseInt(scope.start.distanceTo(scope.end));
        };
        this.create();

    };
    Object.assign(DiyLine.prototype, THREE.Object3D.prototype, {
        //实现包装类的射线检测
        raycast: function (raycaster, intersects) {
            var interset = raycaster.intersectObject(this.tubeMesh, false);
            if (interset.length > 0) {
                interset[0].object = this;
                intersects.push(interset[0]);
                intersects.push(interset[0]);
            }

        }

    });
    return DiyLine;
});