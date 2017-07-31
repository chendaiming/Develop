define(function(require){
	var $ = require('jquery');
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var loginUser = require('frm/loginUser');
	var table = require('frm/table');
	var datepicker = require('frm/datepicker');
	
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#flghtTalkQuery',
		data:{
			frd_call_talk_name:'',
			frd_receive_talk_name:'',
			frd_start_time:'',
			request:{
				sqlId:'select_fighttalk_record_dtls',
				whereId:'0',
				orderId:'0',
				params:{frd_cus_number:loginUser.cusNumber}
			}
		},
		methods:{
			search:function(){
				model.request = {
					sqlId:'select_fighttalk_record_dtls',
					whereId:'1',
					orderId:'0',
					params:{frd_cus_number:loginUser.cusNumber,
							frd_call_talk_name:model.frd_call_talk_name,frd_call_talk_name2:model.frd_call_talk_name,
							frd_receive_talk_name:model.frd_receive_talk_name,frd_receive_talk_name2:model.frd_receive_talk_name,
						    frd_start_time:model.frd_start_time,frd_start_time2:model.frd_start_time}
				};
				$("#tableDiv").empty();
				$("#tableDiv").append('<table id="table"></table>');
				initTable();
			},
			reset:function(){
				model.frd_call_talk_name = '';
				model.frd_receive_talk_name = '';
				model.frd_start_time = '';
				model.request = {
					sqlId:'select_fighttalk_record_dtls',
					whereId:'0',
					orderId:'0',
					params:{frd_cus_number:loginUser.cusNumber}
				};
				$("#tableDiv").empty();
				$("#tableDiv").append('<table id="table"></table>');
				initTable();
			}
		}
	});
	
	initTable();
	$(window).resize(function(){
		$("#tableDiv").empty();
		$("#tableDiv").append('<table id="table"></table>');
		initTable();
	})
	
	function initTable(request){
		table.init("table",{
			request:model.request,
			showColumns:true,
			columns: [[
			     {
	                title: '呼叫方对讲机编号',
	                field: 'frd_call_talk_id',
	                align: 'center',
	                valign: 'middle',
	                visible: false
	            },{
	                title: '呼叫方对讲机名称',
	                field: 'frd_call_talk_name',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '呼叫方部门名称',
	                field: 'frd_call_dept_name',
	                align: 'center',
	                valign: 'middle',
	                visible: false
	            },{
	                title: '呼叫方区域名称',
	                field: 'frd_call_area_name',
	                align: 'center',
	                valign: 'middle',
	                visible: false
	            },{
	                title: '接听方对讲机编号',
	                field: 'frd_receive_talk_id',
	                align: 'center',
	                valign: 'middle',
	                visible: false
	            },{
	                title: '接听方对讲机名称',
	                field: 'frd_receive_talk_name',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '接听方部门名称',
	                field: 'frd_receive_dept_name',
	                align: 'center',
	                valign: 'middle',
	                visible: false
	            },{
	                title: '接听方区域名称',
	                field: 'frd_receive_area_name',
	                align: 'center',
	                valign: 'middle',
	                visible: false
	            },{
	                title: '发起时间',
	                field: 'frd_start_time',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '接通时间',
	                field: 'frd_connect_time',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '挂断时间',
	                field: 'frd_end_time',
	                align: 'center',
	                valign: 'middle'
	            }
	         ]]
		});
	}
})