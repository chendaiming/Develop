define(function(require){
	var $ = require('jquery');
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var loginUser = require('frm/loginUser');
	var table = require('frm/table');
	var dialog = require('frm/dialog');
	var utils = require('frm/hz.utils');
	var datepicker = require('frm/datepicker');
	
	var nowDateTime = utils.formatterDate(new Date(),"yyyy-mm-dd hh:mi:ss");
	var nowDate = utils.formatterDate(new Date(),"yyyy-mm-dd");
	var daily = { 
		'pad_regtr_prsner':0,
		'pad_custody_prsner':0,
		'pad_large_prsner':0,
		'pad_back_rtal_prsner':0,
		'pad_probation_prsner':0,
		'pad_new_custody_prsner':0,
		'pad_released_prsner':0,
		'pad_death_prsner':0
	};
	
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#prisonDaily',
		data:{
			prisonName:loginUser.cusNumberName,
			dateTime:nowDateTime,
			date:nowDate,
			daily:daily
		},
		methods:{
			search:function(flag){
				if(flag){
					model.date = nowDate;
				}
				queryPrisonerCount();
			}
		}
	});
	queryPrisonerCount();
	/**
	 * 查询
	 */
	function queryPrisonerCount(){
		var queryDate = model.date == nowDate ? "" : model.date;
		tip.saving("正在查询中...");
		db.query({
			request:{
				sqlId: 'select_prison_area_dtls_count',
				params: [loginUser.cusNumber,queryDate,queryDate]
			},
			success:function(data){
				tip.close();
				if(data[0].pad_regtr_prsner){
					model.daily = data[0];
				}else{
					model.daily = daily;
				}
			}
		});
	}
	
	setInterval(function(){
		model.dateTime = utils.formatterDate(new Date(),"yyyy-mm-dd hh:mi:ss");
	},1000);
	
	var div = $("#content").parent();
	div.height(div.parent().height()-10);
	$(window).resize(function(){
		var div = $("#content").parent();
		div.height(div.parent().height()-10);
	})
})