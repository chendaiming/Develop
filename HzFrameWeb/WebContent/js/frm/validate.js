/**
 * js验证
 * 
 * @author chendm
 * 
 * @date 2016年12月22日
 * 
 */
define(function() {

	var v = {
		empty_string_regexp : /^\s*$/,
		chinese_regexp : /^[\u4e00-\u9fa5]$/,
		email_regexp : /^[0-9a-zA-Z_-]+[.0-9a-zA-Z_-]+@([0-9a-zA-Z]+)(([.]+[a-zA-Z]+){1,2})$/,
		ip_regexp:/^\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/,
		mobile_regexp:/^1(3|4|5|7|8)\d{9}$/,
		phone_regexp:/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
		/**
		 * 匹配数字
		 */
		isNumber : function(value) {
			return typeof value === 'number' && !isNaN(value);
		},
		/**
		 * 匹配函数
		 */
		isFunction : function(value) {
			return typeof value === 'function';
		},
		/**
		 * 匹配整数对象
		 */
		isInteger : function(value) {
			return v.isNumber(value) && value % 1 === 0;
		},
		/**
		 * 匹配正整数
		 */
		isPositiveInteger : function(value) {
			return /^\d+$/.test(value);
		},
		/**
		 * 匹配IP
		 */
		isIP : function(value) {
			return v.ip_regexp.test(value);
		},
		/**
		 * 匹配手机
		 */
		isMobile:function(value){
			return v.mobile_regexp.test(value);
		},
		/**
		 * 匹配座机
		 */
		isTelePhone:function(value){
			return v.phone_regexp.test(value);
		},
		/**
		 * 匹配邮箱
		 */
		isEmail : function(value) {
			return v.email_regexp.test(value);
		},
		/**
		 * 匹配布尔类型
		 */
		isBoolean : function(value) {
			return typeof value === 'boolean';
		},
		/**
		 * 匹配object
		 */
		isObject : function(obj) {
			return obj === Object(obj);
		},
		/**
		 * 匹配日期
		 */
		isDate : function(obj) {
			return obj instanceof Date;
		},
		/**
		 * 匹配中文字符
		 */
		isChinese : function(value) {
			return v.chinese_regexp.test(value);
		},
		/**
		 * 匹配已定义
		 */
		isDefined : function(obj) {
			return obj !== null && obj !== undefined;
		},
		/**
		 * 匹配jquery节点
		 */
		isJqueryElement : function(o) {
			return o && v.isString(o.jquery);
		},
		/**
		 * 匹配dom节点
		 */
		isDomElement : function(o) {
			if (!o) {
				return false;
			}

			if (!o.querySelectorAll || !o.querySelector) {
				return false;
			}

			if (v.isObject(document) && o === document) {
				return true;
			}

			if (typeof HTMLElement === "object") {
				return o instanceof HTMLElement;
			} else {
				return o && typeof o === "object" && o !== null
						&& o.nodeType === 1 && typeof o.nodeName === "string";
			}
		},
		/**
		 * 匹配字符串
		 */
		isString : function(value) {
			return typeof value === 'string';
		},
		/**
		 * 匹配数组
		 */
		isArray : function(value) {
			return {}.toString.call(value) === '[object Array]';
		},
		/**
		 * 匹配键值对对象
		 */
		isHash : function(value) {
			return v.isObject(value) && !v.isArray(value)
					&& !v.isFunction(value);
		},
		/**
		 * 检查obj是否包含value
		 */
		isContains : function(obj, value) {
			if (!v.isDefined(obj)) {
				return false;
			}
			if (v.isArray(obj)) {
				return obj.indexOf(value) !== -1;
			}
			return value in obj;
		},
		/**
		 * 匹配是否为空 (null、undefined 返回true)
		 */
		isEmpty : function(value) {
			var attr;

			if (!v.isDefined(value)) {
				return true;
			}

			if (v.isFunction(value)) {
				return false;
			}

			if (v.isString(value)) {
				return v.empty_string_regexp.test(value);
			}

			if (v.isArray(value)) {
				return value.length === 0;
			}

			if (v.isDate(value)) {
				return false;
			}

			if (v.isObject(value)) {
				for (attr in value) {
					return false;
				}
				return true;
			}
			return false;
		},
		/**
		 * 过滤重复元素
		 * 
		 * @return 新数组
		 */
		unique : function(array) {
			if (!v.isArray(array)) {
				return array;
			}
			return array.filter(function(el, index, array) {
				return array.indexOf(el) == index;
			});
		}
	}
	return v;
});