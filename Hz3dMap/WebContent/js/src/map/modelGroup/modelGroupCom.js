define(function(require) {
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var message = require('frm/message');
	var loginUser = require('frm/loginUser');

	/*
	 * 验证空
	 */
	function _checkEmpty (val, msg) {
		if (!val && val !== 0) {
			message.alert(msg);
			throw msg;
		}
	}

	return {
		/*
		 * 初始化setting
		 */
		initSetting: function (callback) {
			return {
				view: {dblClickExpand: false},
				data: {
					simpleData: {
						enable: true,
						idKey: 'id',
						pIdKey: 'pid'
					}
				},
				callback: callback
			};
		},

		/*
		 * 初始化数据
		 */
		initParams: function () {
			return {
				cus_number: loginUser.cusNumber,
				cus_number_cn: loginUser.cusNumberName,
				pid: '',
				pname: '',
				id: '',
				name: '',
				type: '',
				order: '0',
				model_name: '',
				create_uid: loginUser.userId,
				create_user: '',
				create_datetime: '',
				update_uid: loginUser.userId,
				update_user: '',
				update_datetime: ''
			};
		},

		/*
		 * 加载树
		 */
		loadTree: function (success) {
			db.query({
				request: {
					sqlId: 'select_map_model_group_list',
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
		 * 插入
		 */
		insert: function (params, success) {

			try {
				_checkEmpty(params.name, '请输入分组名称!');
				_checkEmpty(params.type, '请输入分组类型!');
				_checkEmpty(params.order, '请输入排序序号!');
			} catch (e) {
				console.warn('添加模型分组数据验证未通过：', e);
				return;
			}

			db.updateByParamKey({
				request: {
					sqlId: 'map_add_model_group',
					params: [params],
				},
				success: function (data) {
					message.alert('添加成功!');
					success();
				},
				error: function (code, msg) {
					message.alert(msg);
				}
			});
		}
	};
});