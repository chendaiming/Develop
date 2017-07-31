define(function(require){
	var $ = require('jquery');
	var vue = require('vue');
	var db = require('frm/hz.db');
	var user = require('frm/loginUser');
	var table = require('frm/table');
	var datepicker = require('frm/datepicker');
	var dialog = require('frm/dialog');
	var message = require('frm/message');

	require('frm/select');

	// 查询定时器编号
	var queryTimerId = null;

	/*
	 * 创建模型
	 */
	var model = new vue({
		el: '#vsmQuery',
		data: {
			edit: initData(),
			query: {
				event_name: '',
				storage_addr: ''
			},
			request: {
				sqlId: 'select_cmr_video_storage_dtls',
				whereId: '0',
				params: {vel_cus_number: user.cusNumber}
			}
		},
		methods: {
			showAddPanel: function () {
				this.edit = initData();

				dialog.open({
					targetId: 'addPanel',
					title: '新增',
					top: '30%',
					h: '315'
				});
			},
			insert: function () {
				// 修改
				if (model.edit.vel_id) {
					model.edit.vel_updt_user = user.userId;

					db.updateByParamKey({
						request: {
							sqlId: 'update_cmr_video_storage_dtls',
							whereId: '0',
							params: model.edit
						},
						success: function (result) {
							if (result && result.success) {
								message.alert('修改成功!');
								loadTable();
							} else {
								message.alert('修改失败!');
								console.warn(result);
							}
						},
						error: function () {

						}
					});
				} else {
					// 新增
					model.edit.vel_crte_user = user.userId;
					model.edit.vel_updt_user = user.userId;

					db.updateByParamKey({
						request: {
							sqlId: 'insert_cmr_video_storage_dtls',
							params: model.edit
						},
						success: function (result) {
							if (result && result.success) {
								message.alert('添加成功!');
								loadTable();
							} else {
								message.alert('添加失败!');
								console.warn(result);
							}
						},
						error: function () {
							
						}
					});
				}
			},
			reset: function () {
				$('.layui-layer-title').html('新增');
				this.edit = initData();
			},
			cancel: function () {
				dialog.close();
			},
			remove: function () {
				var list = [];

				table.method("getSelections").map(function (row) {
					list.push(row.vel_id);
	 	 		});

				if (list.length) {
					message.confirm('确定要删除勾选的' + list.length + '条数据?', function () {
						removeData([user.cusNumber, list.join(',')]);
					});
				} else {
					message.alert('请勾选一条或多条要删除的数据!');
				}
			},
			queryData: function () {
				queryTimerId && clearTimeout(queryTimerId);
				queryTimerId = setTimeout(queryData, 500);
			}
		}
	});


	function queryData () {
		var event_name = '%' + model.query.event_name + '%';
		var storage_addr = '%' + model.query.storage_addr + '%';

		loadTable({
			sqlId: 'select_cmr_video_storage_dtls',
			whereId: '1',
			params: {cus_number: user.cusNumber, event_name: event_name, storage_addr: storage_addr}
		});
	}


	/*
	 * 初始化数据
	 */
	function initData () {
		return {
			vel_cus_number: user.cusNumber,
			vel_id: '',
			vel_event_id: '',
			vel_event_name: '',
			vel_storage_addr: '',
			vel_before_time: '',
			vel_after_time: '',
			vel_crte_user: '',
			vel_crte_time: '',
			vel_updt_user: '',
			vel_updt_time: ''
		};
	}


	/*
	 * 加载表格
	 */
	function loadTable (request) {
		$("#tableDiv").empty();
		$("#tableDiv").append('<table id="table"></table>');
		initTable(request);
	}


	/*
	 * 初始化表格
	 */
	function initTable (request) {
		table.init("table", {
			request: request || model.request,
			showColumns: true,
			columns: [[
			    {title: '选择', field: 'state', checkbox: true},     
			    {title: '机构号', field: 'vel_cus_number', align: 'center', valign: 'middle', visible: false},
			    {title: '编号', field: 'vel_id', align: 'center', valign: 'middle',visible: false},
	            {title: '事件名称', field: 'vel_event_name', align: 'center', valign: 'middle'},
	            {title: '存储文件夹名称', field: 'vel_storage_addr', align: 'center', valign: 'middle'},
	            {title: '提前录像时间', field: 'vel_before_time', align: 'center', valign: 'middle'},
	            {title: '延后录像时间', field: 'vel_after_time', align: 'center', valign: 'middle'},
	            {title: '创建用户', field: 'vel_crte_user', align: 'center', valign: 'middle', visible: false},
	            {title: '创建日期', field: 'vel_crte_time', align: 'center', valign: 'middle', visible: false},
	            {title: '更新用户', field: 'vel_updt_user', align: 'center', valign: 'middle', visible: false},
	            {title: '更新日期', field: 'vel_updt_time', align: 'center', valign: 'middle', visible: false}
	         ]],
	         onClickRow:function (row) {
	        	 model.edit.vel_id = row.vel_id;
	        	 model.edit.vel_event_id = row.vel_event_id;
	        	 model.edit.vel_storage_addr = row.vel_storage_addr;
	        	 model.edit.vel_before_time = row.vel_before_time;
	        	 model.edit.vel_after_time = row.vel_after_time;

	        	 dialog.open({
	        		 targetId: 'addPanel',
	        		 title: '修改',
	        		 top: '30%',
	        		 h: '315'
	        	 });
	         }
		});
	}


	/*
	 * 删除数据
	 */
	function removeData (params) {
		db.update({
			request: {
				sqlId: 'delete_cmr_video_storage_dtls',
				whereId: 0,
				params: params
			},
			success: function (result) {
				if (result && result.success) {
					message.alert('删除成功!');
					loadTable();
				} else {
					message.alert('删除失败!');
					console.warn(result);
				}
			},
			error: function () {
				
			}
		});
	}

	try {

		initTable();

	} catch (e) {
		console.error('', e);
	}
})