define(function(){
    var localData;
    localData = {
        /*Trees本地数据 ---添加数据
        * @param attr 本地数据
        * @param val  要添加的数据
        * */
        addTrees: function (attr, val) {
            var fal = true,leg = attr.length;
            for (var i = 0; i < leg; i++) {
                if (attr[i].id == val.id) {
                    fal = false;
                }
            }
            if (fal) {
                attr.push(val);
            }
            return attr;//添加后的数据
        },

        /*Trees本地数据 ---修改数据
        * @param attr  本地数据
        * @param val   修改的数据
        * */
        changeTrees: function (attr, val) {
            var leg = attr.length;
            for (var i = 0; i < leg; i++) {
                if (attr[i].id == val.id) {
                    for (var key in attr[i]) {
                        attr[i][key] = val[key] ? val[key] : attr[i][key];
                    }
                }
            }
            return attr;//修改后的数据
        },

        /*Trees本地数据 ---删除数据
        * @param attr 本地数据
        * @param video 要删除的数据
        * */
        removeTrees: function (attr, video) {
            var leg = attr.length;
            for (var i = 0; i < leg; i++) {
                if (attr[i].id == video.id) {
                    attr.splice(i, 1);
                    break;
                }
            }
            return attr;//删除后的数据
        },

        /*Trees- ---只能选择最子级的区域
        * @param  node：待判断的数据
        * @param  fn:回掉函数
        * @param  type 判断类型
        * @param  num 类型的值
        * */
        subsetZTrees: function (node, fn, num, type) {
            var numS,typeS;
            numS = num ? num : 0;
            typeS = type ? type : 'type';
            var whether = false;
            if (node.children) {
                for (var i = 0, leg = node.children.length; i < leg; i++) {
                    if (node.children[i][typeS] == numS) {
                        whether = true;
                        break;
                    }
                }
            }
            if (!whether) {
               return fn();
            }
        }
    };
    return localData;
});
