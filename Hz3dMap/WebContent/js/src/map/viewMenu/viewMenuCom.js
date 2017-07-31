/**
 * 
 */
define(function(require) {
	var $ = require("jquery");
	var message = require('frm/message');
	var loginUser = require('frm/loginUser');
	var db = require('frm/hz.db');
	var hzThree = window.hzThree;

	var typeMap = {
		'0': '1',	// 其他-自由视角
		'1': '2',	// 楼栋-楼栋
		'2': '3',	// 楼层-楼层
		'3': '3',	// 楼层内-楼层
		'4': '3',	// 楼层外-楼层
		'5': '3',	// 楼层内模型-楼层
		'6': '3'	// 楼层外模型-楼层
	};

	return {
		getViewType: function (type) {
			return typeMap[type];
		},
		setViewPoint: function (vm) {
			var viewPoint = hzThree.getViewPoint();
			var params = vm.params;

			if (viewPoint) {
				params.pos_x = viewPoint.posX;
				params.pos_y = viewPoint.posY;
				params.pos_z = viewPoint.posZ;

				params.rot_x = viewPoint.rotX;
				params.rot_y = viewPoint.rotY;
				params.rot_z = viewPoint.rotZ;

				params.tar_x = viewPoint.tarX;
				params.tar_y = viewPoint.tarY;
				params.tar_z = viewPoint.tarZ;
				console.log('更新设置视角坐标...', viewPoint);
			}
		},

		initParams: function () {
			return {
				cus_number: loginUser.cusNumber,
				cus_number_cn: loginUser.cusNumberName,
				id: '',
				name: '',
				pid: '',
				pname: '',
				model_group_id: '',
				model_group_name: '',
				type: 1,
				icon_url: '',
				host_key: '',
				status: 1,
				order: 0,
				is_default: 0,
				pos_x: 0,
				pos_y: 0,
				pos_z: 0,
				rot_x: 0,
				rot_y: 0,
				rot_z: 0,
				tar_x: 0,
				tar_y: 0,
				tar_z: 0,
				create_uid: loginUser.userId,
				create_user: '',
				create_datetime: '',
				update_uid: loginUser.userId,
				update_user: '',
				update_datetime: '',
				area_id:'',
				area_name:''
			};
		},

		/*
		 * 初始化zTree属性
		 */
		initSetting: function (callback) {
			return {
				view: {
					dblClickExpand: false,
					selectedMulti: false
				},
				data: {
					simpleData: {
						enable: true,
						idKey: 'id',
						pIdKey: 'pid'
					}
				},
				callback: callback
			}
		},

		/*
		 * 加载树
		 */
		loadModelTree: function (success) {
			db.query({
				request: {
					sqlId: 'select_map_model_file_list_for_view',
					whereId: 1,
					orderId: 1,
					params: [loginUser.cusNumber]
				},
				success: success,
				error: function(code, msg) {
					message.alert(code + ':' + msg);
				}
			});
		},

		/*
		 * 加载树
		 */
		loadViewTree: function (success) {
			db.query({
				request: {
					sqlId: 'select_map_view_menu_list',
					whereId: 1,
					orderId: 1,
					params: [loginUser.cusNumber]
				},
				success: success,
				error: function(code, msg) {
					message.alert(code + ':' + msg);
				}
			});
		},

		getRequest: function () {
			return [{
				sqlId: 'update_cancel_default_view_menu',
				whereId: 0,
				params: [{cus_number: loginUser.cusNumber}],
			}];
		},

		/*
		 * 插入数据
		 */
		insert: function (params, success) {

			try {
				this.checkEmpty(params.name, '请输入视角名称!');
				this.checkEmpty(params.order, '请输入排序序号!');
			} catch (e) {
				console.warn('插入数据验证失败：', e);
				return false;
			}

			var vm = this;
			this.checkDefault(params, function (result) {
				if (result) {
					vm._insert(params, vm.getRequest(), success);
				} else {
					message.confirm('是否确定保存视角<<span>' + params.name + '</span>>?', function () {
						vm._insert(params, [], success);
					});
				}
			});
		},

		_insert: function (params, request, success) {
			request.push({
				sqlId: 'insert_map_view_menu',
				params: [params],
			});

			db.updateByParamKey({
				request: request,
				success: function (result) {
					if (result) {
						var id = null;
						if (request.length == 1) {
							id = result.data[0].seqList[0];
						} else {
							id = result.data[1].seqList[0];
						}
						success(id);
					} else {
						console.warn('视角菜单添加失败：', result);
						success(null);
					}
				},
				error: function (code, msg) {
					message.alert(msg);
				}
			});
		},

		/*
		 * 检查默认视角
		 */
		checkDefault: function (params, success) {
			if (params.is_default == '1') {
				db.query({
					request: {
						sqlId: 'select_default_view_menu',
						whereId: 0,
						params: [loginUser.cusNumber],
					},
					success: function (result) {
						if (result && result.length) {
							message.confirm('是否将默认视角<<span>' + result[0].name + '</span>>更改为<<span>' + params.name + '</span>>并继续此操作?', success);
						} else {
							success();
						}
					},
					error: function (code, msg) {
						message.alert(msg);
					}
				});
			} else {
				success();
			}
		},

		checkEmpty: function (val, msg) {
			if (!val && val !== 0) {
				message.alert(msg);
				throw msg;
			}
		}
	};
});