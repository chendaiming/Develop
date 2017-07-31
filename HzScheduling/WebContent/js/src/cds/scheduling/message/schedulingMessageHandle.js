/**
 * 
 */
define(function (require) {
	/*
	 * 依赖引入
	 */
	var message = require('frm/message');



	/*
	 * 订阅受虐对讲呼叫的消息
	 */
	function subsMessage () {
		var webmessage = window.top.webmessage;
		
		if (webmessage) {
			webmessage.on('SCHEDULING001', 'SCHEDULING.LINK.HANDLE', function (message) {
				if (message) {
					var data = message.msg;
					if (data) {
						message.notification(data + ' 来电');
					}
				}
			});
		} else {
			setTimeout(subsMessage, 1000);	// 消息对象不存在则1秒后重新尝试
		}
	}
	subsMessage();
});