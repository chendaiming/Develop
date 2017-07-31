/**
 * 加载三维地图
 */
define(function (require) {
	var user = require('frm/loginUser');
	var db = require('frm/hz.db');
	var _onlyLoad = {},
		_onlyLoadLike = [],
		_onlyLoadCount = 0;

	var _notLoad = {},
		_notLoadLike = [],
		_notLoadCount = 0

	function put (name, arg1) {
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
	
	
	function queryModel(){
		var wid = '1',
		    param = {cusNumber:user.cusNumber};
		
		if (user.dataAuth == 1 || user.dataAuth == 2) { // 监狱权限用户（指挥中心）
			
		} else{
			console.log('监区用户,按权限加载模型..');
			wid = '2';
			param = {cusNumber:user.cusNumber,dept_id:user.deptId};
		}

		db.query({
			request: {
				sqlId: 'select_map_file_for_dept',
				whereId: wid,
				params: param
			},
			success: function (data) {
				console.log(data);
				for(var i=0,j=data.length;i<j;i++){
					var fileName = data[i].mfi_file_name;
						fileName = fileName.substr(0,fileName.length-4).toLowerCase();
					console.log('fileName.length-4:'+fileName);

					put(fileName, true);
				}
			},
			error: function (errorCode, errorMsg) {
				message.alert(errorCode + ":" + errorMsg);
			},
			async:false
		});
	}

	try {

		put('*_dx*', true);
//		put('mkjy_zhjs_*', true);
//		queryModel();

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