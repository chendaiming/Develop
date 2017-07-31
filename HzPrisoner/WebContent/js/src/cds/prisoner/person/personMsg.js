define(function(require){
	
	var dialog = require('frm/dialog');
	var ls = require("frm/localStorage");
	var tpl = require("vue");
	var hzEvent = require('frm/hz.event');
	var videoClient = require('frm/hz.videoclient');
	
    function personMsg(result){
    	var data =result.msg;
    	//打开摄像机
    	var cameraId = data[0].frr_camera_id;
    	if(cameraId){
        	videoClient.setLayout(1)
        	videoClient.play(cameraId);
    	}else{
    		console.error('未关联摄像机!');
    	}
    	
    	ls.setItem("data",data[0]);
    	hzEvent.call('personData',{data:data[0]});
    	dialog.open({
			id:'227',
			title:'人脸识别-信息',
			type:2,
			w:890,
			h:390,
			url:'page/cds/prisoner/person/personInfo.html'
		});
    	
    	//警员信息
    	/*if(data[0].frr_person_type==1){
    		ls.setItem("data",data[0]);
    		hzEvent.call('policeData',{data:data[0]});
    		dialog.open({
    			id:'226',
    			title:'人脸识别-警员信息',
    			type:2,
    			w:800,
    			h:450,
    			url:'page/cds/prisoner/person/police.html?'+new Date()
    		});
    	}
    	
    	//犯人信息
    	if(data[0].frr_person_type==0){
    		ls.setItem("data",data[0]);
    		hzEvent.call('personData',{data:data[0]});
//    		dialog.open({
//    			id:'227',
//    			title:'人脸识别-犯人信息',
//    			type:2,
//    			w:800,
//    			h:450,
//    			url:'page/cds/prisoner/person/person.html'
//    		});
    		dialog.open({
    			id:'227',
    			title:'学员基础信息',
    			type:2,
    			w:1200,
    			h:780,
    			url:'page/cds/prisoner/person/personStatic.html'
    		});
    	}*/
    	
    }
	return {
		initPersonEvent:function(){
			//订阅后台推送消息
			window.top.webmessage.on('PERSON001','PERSON',personMsg);			
		}
	}
	
});