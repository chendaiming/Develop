/**
 * 
 */
define(function(require){
	var hzEvent = require('frm/hz.event');
	var dialog = require('frm/dialog');
	var message = require('frm/message');


	/**
	 * 监听来电信息
	 */
	function callRemind(json){
		var data = json.msg;
		var phone = data.phone;
		var name = data.name;
		var dept = data.dept;
		message.notification( phone + '(' + dept + '-' + name +')' + '来电',null,'来电信息');
	}
	
	
	
	try {

		hzEvent.call('index.load.page', '#schedulingMini', 'page/cds/scheduling/scheduling_mini.html');
		
		//订阅对讲事件消息
		window.top.webmessage.off('SCHEDULING001','schedulingMsg');
		window.top.webmessage.on('SCHEDULING001','schedulingMsg',callRemind);	
		console.log('初始化 --> 通讯调度子模块');
	} catch (e) {
		console.log('初始化 --> 通讯调度子模块异常：', e);
	}
});