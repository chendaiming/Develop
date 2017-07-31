define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var table = require('frm/table');
	var dialog = require('frm/dialog');
	var select = require('frm/select');
	var tree = require('frm/treeSelect');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	var datepicker = require('frm/datepicker');
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#clockRecord',
		data:{
			cusNumber: loginUser.cusNumber,
			deptPoliceList: [],
			search:{ 
				'ped_sdate': '',
				'ped_edate': '',
				'ped_dept_id': '',
				'ped_shift_id': '',
				'ped_job_id': '',
				'ped_id': '',
				'ped_name': '',
				'clock_status': ''
			}
		},
		methods:{
			openSearchPanel:function(){
				model.search.ped_sdate = utils.formatterDate(new Date(),"yyyy-mm-dd");
				model.search.ped_edate = utils.formatterDate(new Date(),"yyyy-mm-dd");
				model.search.ped_dept_id = '';
				model.search.ped_shift_id = '';
				model.search.ped_job_id = '';
				model.search.ped_id = '';
				model.search.ped_name = '';
				model.search.clock_status = '';
				dialog.open({targetId:'search_panel',title:'查询',w:"550",h:"400"});
			},
			serach:function(){
				tip.alert("正在查询中...");
				dialog.close();
				table.method("refresh",{
					request:{
						whereId:model.search.clock_status ? model.search.clock_status: 10,
						params:{
							'ped_cus_number': loginUser.cusNumber,
							'ped_sdate': model.search.ped_sdate,
							'ped_sdate': model.search.ped_sdate,
							'ped_edate': model.search.ped_edate,
							'ped_edate': model.search.ped_edate,
							'ped_dept_id': model.search.ped_dept_id,
							'ped_dept_id': model.search.ped_dept_id,
							'ped_shift_id': model.search.ped_shift_id,
							'ped_shift_id': model.search.ped_shift_id,
							'ped_job_id': model.search.ped_job_id,
							'ped_job_id': model.search.ped_job_id,
							'ped_id': model.search.ped_id,
							'ped_id': model.search.ped_id
						}
					}
				});
				tip.close();
			}
		}
	});
	/**
	 * 加载部门民警树形列表
	 * @returns
	 */
	function loadDeptPolice(){
		db.query({
			request:{
				sqlId:'select_checkWork_drptmnt_police_tree',
				params:[loginUser.cusNumber,loginUser.cusNumber]
			},success:function(data){
				model.deptPoliceList = data;
				var setting = {
						offSearch: true,
						key:'name',
						diyClass:'conditionslid',
						zindex: 100,
						expand: true,
						path:'../../../libs/ztree/css/zTreeStyle/img/',
						data: {simpleData: {enable: true,pIdKey: "pid"}},
						callback:{
							onClick:function(e,id,node){
								model.search.ped_id = node.id.split("_")[1];
								model.search.ped_name = node.name;
							}
						}
				};
				tree.init("pedId",setting,model.deptPoliceList);
				//搜索
				var timeSearch;
				$("#pedId").off().keyup(function(){
					var val = this.value;
					clearTimeout(timeSearch);
					timeSearch = setTimeout(function(){
						treeUtil.searchTree(setting.key,val,"repedId",model.deptPoliceList,setting);
					},500)
				});
			}
		})
	}
	/**
	 * 加载表格
	 */
	function initTable(){
		table.init("table",{
			request:{
				sqlId:'select_ckw_clock_record2',
				params: {'ped_cus_number': loginUser.cusNumber},
				whereId: '1',
				orderId: '0'
			},
			showColumns: true,
			columns: [[
				{
	                title: '值班日期',
	                field: 'ped_date',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '部门',
	                field: 'odd_name',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '班次',
	                field: 'sbd_name',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '岗位',
	                field: 'jbd_name',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '值班人员',
	                field: 'ped_name',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '值班开始时间',
	                field: 'scd_shift_start_time',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '值班结束时间',
	                field: 'scd_shift_end_time',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '上班打卡时间',
	                field: 'ckr_until_date',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '上班打卡状态',
	                field: 'ckr_until_status_ch',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '下班打卡时间',
	                field: 'ckr_back_date',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '下班打卡状态',
	                field: 'ckr_back_status_ch',
	                align: 'center',
	                valign: 'middle'
	            }]]
		});
	}
	try {
		initTable();
		loadDeptPolice();
	} catch (e) {
		
	}
})