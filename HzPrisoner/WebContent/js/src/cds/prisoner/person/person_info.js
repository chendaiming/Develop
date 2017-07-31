define(function(require){
	var tpl = require("vue");
	var ls = require("frm/localStorage");
	var hzEvent = require('frm/hz.event');
	var hzEvent = require('frm/hz.event');
	var data =ls.getItem("data");
	var model = new tpl({
		el:'#form',
		data:{
			prisoner:{
				'prisonerid':'',//人员编号
				'name':'',//人员姓名
				'img_url':'', //人脸库照片
				'img_url_scene':'',//现场照片
				'type':'',//人员类型
				'addrs':'',//所在位置
				'reason':'出监就医'//出监原因	
			},
			openCount:0
		}
	})
	if(model.openCount == 0)model.prisoner = data;//首次加载时,personData事件还未注册
	hzEvent.off('personData');//事件注销
	hzEvent.on('personData',function(data){ //事件注销
		//页面渲染完成后执行
		model.prisoner = data.data;
		model.openCount ++;
	});
})