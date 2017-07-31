define(function(require){
	var $ = require("jquery");
	var tpl = require("vue");
	var db = require('frm/hz.db'); 
	var tip = require('frm/message');
	var ls = require("frm/localStorage");
	var data =ls.getItem("data");
	var hzEvent = require('frm/hz.event');

	var model = new tpl({
		el:'#baseinfo',
		data:{
			police:{}
		}
	})
	model.police = data;
	hzEvent.on('policeData',function(data){
		model.police = data.data;
	});
	
});