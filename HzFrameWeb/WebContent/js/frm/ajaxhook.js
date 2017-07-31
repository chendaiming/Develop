//拦截所有ajax请求
define(function(){
	var hookAjax = function (funs) {
        window._ahrealxhr = window._ahrealxhr || XMLHttpRequest
        XMLHttpRequest = function () {
        	
            this.xhr = new window._ahrealxhr;
            
            for (var attr in this.xhr) {
                var type = "";
                try {
                    type = typeof this.xhr[attr]
                } catch (e) {}
                if (type === "function") {
                    this[attr] = hookfun(attr);
                } else {
                    Object.defineProperty(this, attr, {
                        get: getFactory(attr),
                        set: setFactory(attr)
                    });
                }
            }
        }

        function getFactory(attr) {
            return function () {
                return this[attr + "_"] || this.xhr[attr]
            }
        }

        function setFactory(attr) {
            return function (f) {
                var xhr = this.xhr;
                var that = this;
                if (attr.indexOf("on") != 0) {
                    this[attr + "_"] = f;
                    return;
                }
                if (funs[attr]) {
                    xhr[attr] = function () {
                        funs[attr](that) || f.apply(xhr, arguments);
                    }
                } else {
                    xhr[attr] = f;
                }
            }
        }

        function hookfun(fun) {
            return function () {
                var args = [].slice.call(arguments)
                if (funs[fun] && funs[fun].call(this, args, this.xhr,this)) {
                    return;
                }
                return this.xhr[fun].apply(this.xhr, args);
            }
        }
		
        return window._ahrealxhr;
    }
	
	return {hookAjax:hookAjax};
});

