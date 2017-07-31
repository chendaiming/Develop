 //框选操作

 define(['frm/events/EventConsts', 'THREE', 'frm/core/expand'], function (EventConsts, THREE, Expand) {

     var objectNameMap = EventConsts.objectNameMap;

     var BoxSelect = function (canvas) {
         this.hzThree = EventConsts.hzThree;
         this.canvas = canvas;
         this.startPos = new THREE.Vector2(0, 0); //开始点
         this.endPos = new THREE.Vector2(0, 0); //结束点
         this.cxt = canvas.getContext("2d");
         this.cxt.fillStyle = 'rgba(0,0,0,.3)';
         this.cxt.strokeStyle = '#FF0000';
         this.enabled = false;
         this.checkType = []; //需要检查的类型
         this.objectArray = []; //需要检查的数组
         this.findObjectArray = []; //找到的对象

         this.maxX = 0;
         this.minX = 0;
         this.maxY = 0;
         this.minY = 0;

         this.leftTopPoint = new THREE.Vector2(0, 0);
         this.rightTopPoint = new THREE.Vector2(0, 0);
         this.rightBottomPoint = new THREE.Vector2(0, 0);
         this.leftBottomPoint = new THREE.Vector2(0, 0);
     };

     Object.assign(BoxSelect.prototype, THREE.EventDispatcher.prototype, {

         update: function () {
             if (this.enabled === false) return;
             this.clear();
             this.cxt.fillRect(this.startPos.x, this.startPos.y, (this.endPos.x - this.startPos.x), (this.endPos.y - this.startPos.y));
             this.cxt.strokeRect(this.startPos.x, this.startPos.y, (this.endPos.x - this.startPos.x), (this.endPos.y - this.startPos.y));
         },
         setStartPos: function (x, y) {
             this.startPos.x = x;
             this.startPos.y = y;
         },
         setEndPos: function (x, y) {
             this.endPos.x = x;
             this.endPos.y = y;
         },
         clear: function () {
             this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
         },
         /**
          * 开始出发检查
          */
         check: function () {
             if (this.startPos.x === this.endPos.x || this.startPos.y === this.endPos.y) {
                 console.warn('开始结束点重叠不能绘制出矩形');
                 return;
             }
             this.findObjectArray.removeAll();
             if (this.startPos.x < this.endPos.x) {
                 this.minX = this.startPos.x;
                 this.maxX = this.endPos.x;
             } else if (this.startPos.x > this.endPos.x) {
                 this.minX = this.endPos.x;
                 this.maxX = this.startPos.x;
             }

             if (this.startPos.y < this.endPos.y) {
                 this.minY = this.startPos.y;
                 this.maxY = this.endPos.y;
             } else if (this.startPos.y > this.endPos.y) {
                 this.minY = this.endPos.y;
                 this.maxY = this.startPos.y;
             }

             this.leftTopPoint.x = this.minX;
             this.leftTopPoint.y = this.minY;

             this.rightTopPoint.x = this.maxX;
             this.rightTopPoint.y = this.minY;

             this.rightBottomPoint.x = this.maxX;
             this.rightBottomPoint.y = this.maxY;

             this.leftBottomPoint.x = this.minX;
             this.leftBottomPoint.y = this.maxY;


             for (var i = 0; i < this.objectArray.length; i++) {
                 var item = this.objectArray[i];
                 if (this.isInArea(item.toScreenPosition()) === true) {
                     this.findObjectArray.add(item);
                 }
             }


             return this.findObjectArray.slice();
         },

         /**
          *
          * @param {Object} v
          */
         isInArea: function (v) {

             //在矩形内
             if ((this.minX <= v.x && v.x <= this.maxX) &&
                 (this.minY <= v.y && v.y <= this.maxY)) {
                 return true;
             }
             return false;

         },
         //获取框选框四个点的三维坐标 左上角开始 顺时针 左下角结束
         getRectWorldPos: function () {
             if (this.leftBottomPoint.equals(this.leftTopPoint) === true) {
                 return [];
             }
             var leftTop = this.hzThree.getScreenTo3dPos(this.convertPoint(this.leftTopPoint));
             var rightTop = this.hzThree.getScreenTo3dPos(this.convertPoint(this.rightTopPoint));
             var rightBottom = this.hzThree.getScreenTo3dPos(this.convertPoint(this.rightBottomPoint));
             var leftBottom = this.hzThree.getScreenTo3dPos(this.convertPoint(this.leftBottomPoint));
             var arr = [leftTop,rightTop,rightBottom,leftBottom];
             return arr;

         },
         convertPoint: function (v) {
             var newV = new THREE.Vector2();
             newV.x = (v.x / this.hzThree.resolution.x) * 2 - 1;
             newV.y = -(v.y / this.hzThree.resolution.y) * 2 + 1;
             return newV;
         },
         /**
          * 传入需要检查的类型  并且在对象数组中生产需要检查的对象
          * @param {Object} arr
          */
         setCheckType: function (arr) {

             if (this.objectArray.length > 0) {
                 this.objectArray.removeAll();
             }

             if (arr.constructor == String) {

                 this.checkType.push(arr);
             }
             if (arr instanceof Array) {
                 this.checkType = arr;
             }

             for (var i = 0; i < this.checkType.length; i++) {

                 var item = this.checkType[i];
                 for (var type in objectNameMap) {
                     var obj = objectNameMap[type];
                     // tem.indexOf('born')!==-1)
                     //
                     // obj.bornType===item)
                     //
                     // his.objectArray.add(obj);
                     //
                     // e
                     //
                     //
                     //
                     //
                     if (obj.objectType === item) {
                         this.objectArray.add(obj);
                     }

                 }
             }


             if (this.objectArray.length === 0) {
                 console.warn('没有一个类型符合条件');
             }
         },
         /**
          * 如何不用框选功能 最好释放一下 消除不必要的数组引用
          * @return {[type]} [description]
          */
         dispose: function () {
             this.objectArray.removeAll();
             this.checkType.removeAll();
             this.findObjectArray.removeAll();
             this.enabled = false;
         },
         setIsBoxSelect: function (val) {
             if (val === this.hzThree._isBoxSelect) return;
             this.hzThree._isBoxSelect = val;
             this.hzThree.Controls.enabled = !this.hzThree._isBoxSelect;
             if (this.hzThree._isBoxSelect === false) {
                 this.clear();
                 this.dispose();
             }

         },


     });
     return BoxSelect;
 });