define(function(require){
	var $ = require('jquery');
	var layer = require('layer');
	layer.config({
		shift:0, //默认动画风格
		extend: ['blue/style.css'],
		path:ctx + 'libs/layer/' //layer.js所在的目录，requirejs必须用
	});

	return {
		alert:function(msg,time){
			layer.msg(msg, {time: time});
		},
		saving:function(text){
			layer.msg(!text ? '正在保存中...' : text, {icon:5,time:0,shade: [0.5,'#000']});
		},
		confirm:function(msg,callback,cancelcall,title,btn){
			layer.confirm(msg,{
				title:!title ? '提示':title,
				btn:!btn?['确定','取消']:btn		
			},function(index){
				if(callback && typeof callback ==='function'){
					callback(index);
				}
				layer.close(index);	
			},function(index){
				if(cancelcall && typeof cancelcall ==='function'){
					cancelcall(index);
				}
				layer.close(index);	
			});
		},
		close:function(){
			layer.closeAll('dialog');
		},
		/*
		 * html5桌面通知
		 */
		notification:function(msg,onclickEvent,title){
			if (window.Notification) { //判断浏览器是否支持
				if (Notification.permission === 'granted') {
					var _title = title ? title : '通知';
					var notification = new Notification(_title, {
						body : msg  //显示的内容
					});
					//点击事件
					if(onclickEvent && typeof onclickEvent ==='function' ){
						notification.onclick = onclickEvent;
					}
				} else {
					Notification.requestPermission();// 设置允许通知
				}
			}
		}
	}
});