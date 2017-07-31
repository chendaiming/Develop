/**
 * 加载三维地图
 */
define(function (require) {
	var user = require('frm/loginUser');
	var _onlyLoad = {},
		_onlyLoadLike = [],
		_onlyLoadCount = 0;

	var _notLoad = {},
		_notLoadLike = [],
		_notLoadCount = 0

	function put (name, arg1) {
		name = name.toLowerCase();// 统一转换成小写
		if (arg1) {
			if (name.indexOf('*') > -1) {
				_onlyLoadLike.push(name);
			} else {
				_onlyLoad[name] = true;
			}
			_onlyLoadCount++;
		} else {
			if (name.indexOf('*') > -1) {
				_notLoadLike.push(name);
			} else {
				_notLoad[name] = true;
			}
			_notLoadCount++;
		}
	};


	function _filter (array, name) {
		var args = [], str, maxLen, maxTrue, value;
		for(var i = 0; i < array.length; i++) {
			args = array[i].split('*');
			maxLen = maxTrue = 0;
			value = name;

			while(args.length) {
				str = args.shift();
				if (str) {
					maxLen++;

					if (value.indexOf(str) > -1) {
						value = value.replace(str, '');
						maxTrue++;
					}
				}
			}

			if (maxLen > 0 && maxLen == maxTrue) {
				return true;
			}
		}
		return false;
	}

	function _notLoadFilter (name) {
		if (_notLoadCount > 0) {
			if (_notLoad[name]) {
				return false;
			} else {
				if (_filter(_notLoadLike, name)) {
					return false;
				}
			}
		}
		return true;
	}


	try {
//		put('whjds_dx', true);
//		put('whjds_simple*', true);
//		put('whjds_zhjs_f*_', true);

		return {
			/*
			 * 过滤
			 * @return true 表示通过， false 表示不通过
			 */
			filter: function (name) {
				if (_onlyLoadCount > 0) {
					if (_onlyLoad[name]) {
						return _notLoadFilter(name);
					} else {
						if (_filter(_onlyLoadLike, name)) {
							return _notLoadFilter(name);
						}
						return false;
					}
				}
				return _notLoadFilter(name);
			}
		};
	} catch (e) {
		console.error(e);
	}
});