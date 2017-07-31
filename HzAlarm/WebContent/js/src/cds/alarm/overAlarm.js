define([],function(){
	
	function init(){
		var sec=document.createElement("section");
		sec.classList.add("doorRecord");
		
		//初始化vue
		document.appendChild(sec);
	}
	
	//监听事件
	window.top.webmessage&&window.top.webmessage.on('DOOR001','door',init);
});