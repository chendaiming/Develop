define(function(require){
	var $ = require("jquery");
	var vue = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var modelUtil = require('frm/model');	
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var table = require('frm/table');
	var select = require('frm/select');
	var hzEvent = require('frm/hz.event');
	var datepicker = require('frm/datepicker');
	
	var model=new vue({
		el:'#logContent',
		data:{
			search:{
				uol_user_name:'',
				uol_operated_desc:'',
				uol_startTime:'',
				uol_endTime:'',
				uol_cus_number:login.cusNumber,
				uol_type:''
			}
		},
		watch:{
			'search.uol_user_name':function(){
				this.searchInfo();
			},
			'search.uol_operated_desc':function(){
				this.searchInfo();
			}
		},
		methods:{	
			searchInfo:function(){
				$("#table").bootstrapTable('refresh',{
					request:{
						sqlId:'query_suol_log_table',
						params:model.search,
						whereId:'0',
						orderId:'0'
					}
				})	
			},
			resetSearch:function(){
				model.search.uol_user_name='';
				model.search.uol_operated_desc='';
				model.search.uol_startTime='';
				model.search.uol_endTime='';
				model.search.uol_type = '';
				$("#table").bootstrapTable('refresh',{
					request:{
						sqlId:'query_suol_log_table',
						params:model.search,
						orderId:'0'
					}
				})
			}
		},
	});
	
	initTable();
	//初始化表格
	function initTable () {
		table.init("table", {
			request:{
				sqlId:'query_suol_log_table',
				orderId:'0',
				params:{uol_cus_number:login.cusNumber}
			},
			searchOnEnterKey:true,
			searchAlign:'right',
			showColumns:true,
			showRefresh:false,
			columns: [[  
						{field : 'state',checkbox : true},
						{title: "机构号",field:'uol_cus_number',align:'center',valign:'middle',visible: false},
						{title: '日志编号',field: 'uol_id',align: 'center',valign: 'middle'},
						{title: '用户编号',field: 'uol_user_id',align: 'center',valign: 'middle',visible: false},
						
						{title: '日志类型',field: 'uol_type_name',align: 'center',valign: 'middle'},
						{title: '操作用户',field: 'uol_user_name',align: 'center',valign: 'middle'},
						{title: '操作时间',field: 'uol_operated_time',align: 'center',valign: 'middle'},
						{title: '操作内容', field: 'uol_operated_desc', align: 'center', valign: 'middle',
			                formatter: function (value,row,index) {
			                	 return '<div class="ellipsis" style="width: 120px;" title="' + value + '">' + value + '</div>';
			                }
			            },
						{title: '登录地址',field: 'uol_login_ip',align: 'center',valign: 'middle'},
						{title: '系统记录时间',field: 'uol_system_time',align: 'center',valign: 'middle', visible: false}
		              ]],
	         onLoadSuccess: function () {
	        	 // 调整ellipsis的宽度
	        	 $('#table >tbody >tr >td >.ellipsis').each(function () {
	        		var ow = $(this).parent().outerWidth();
	        		var pw = $(this).parent().width();
	        		var tw = $(this).width();
	        		if (tw < pw) {
	        			// 这里必须要同时设置TD的宽度样式才不会乱
	        			$(this).css('width', pw).parent().css('width', ow);
	        		}
	        	 });
	         }
		});
	}
	


	

	
});	