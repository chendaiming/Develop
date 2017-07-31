define(function(require){
	var ls = require("frm/localStorage");
	var tpl = require("vue");
	var data =ls.getItem("data");
	var model = new tpl({
		el:'#form',
		data:{
			prisoner:{
				'name':'',
				'prisonerid':'',
				'pbd_sex_indc':''
			}
		}
	});
	model.prisoner = data;
	
})