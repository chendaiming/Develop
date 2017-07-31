define(["jquery", "vue", "hz/map/map.handle"],function($, vue, map){
	var overAlarm;
	var model;

	/*
	 * 初始化
	 */
	function init () {
		overAlarm = document.createElement("section");
		overAlarm.id = "overAlarm";
		overAlarm.className = "overAlarm h";
		top.document.body.appendChild(overAlarm);

		$(overAlarm).load("page/cds/prisoner/overAlarm/overAlarm.html",function(responseText, textStatus, XMLHttpRequest){
			overAlarm.innerHTML = XMLHttpRequest.responseText;

			model = new vue({
				el:overAlarm,
				data:{
					alarms:[]
				},
				methods:{
					locate: function (t) {
						map.locationDvc(15, t.rfidId);//RFID id
					},
					slidup: function (e) {
						var ele = e.target.previousElementSibling;
						
						ele.style.height = ele.clientHeight + 'px';

						setTimeout(function(){e.target.parentNode.parentNode.classList.add("h")}, 100);
					}
				}
			});

			overAlarm = overAlarm.querySelector("ul");
		});
	}


	function msgHandle (data) {
		var msgBody = JSON.parse(data.msg).beanData;

		if (msgBody.over) {
			overAlarm.parentNode.parentNode.classList.remove("h");
			overAlarm.style.height = '';

			if (model.alarms.length > 10) {
				model.alarms = [];
			}

			model.alarms.push(msgBody);
			model.$nextTick(function(){
				overAlarm.scrollTop = overAlarm.scrollHeight;
			});
		}
	}

	try {

		if (window.top.webmessage) {
			window.top.webmessage.on('RFID001', 'prisoner_over', msgHandle);
		}else{
			setTimeout(bindLisenter, 200);
		}

		init();

		console.log('初始化越界报警模块...');
	} catch (e) {
		// TODO: handle exception
	}
});