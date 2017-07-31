/**
 * 回调类方法
 */
define(function(require) {
    var Handler = function(method, args) {
        if (method === undefined || method === null) {
            console.error('回调方法不能为空');
            return;
        }
        var scope = this;
        this.method = method;
        this.args = args || [];
        if ((this.args instanceof Array) === false) {
            console.error('回调参数必须以数组的形式');
            return;
        }


        /**
         * 执行回调
         */
        this.execute = function() {
            if (scope.method !== null) {
                scope.method.apply(null, args);
                //scope.args = undefined;
            }
        };
        /**
         * 执行回调 添加参数
         */
        this.executeWith = function(data) {
            if (data === null || data === undefined) {
                return scope.execute();
            }
            if (scope.method !== null) {

                scope.method.apply(null, scope.args ? scope.args.concat(data) : data);
                //scope.args = undefined;

            }
        };
    };
    Handler.prototype.constructor = Handler;
    return Handler;
});