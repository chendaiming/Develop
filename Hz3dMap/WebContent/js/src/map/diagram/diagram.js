define(["jquery","frm/hz.event","vue",'frm/hz.db',"frm/loginUser",'hz/map/map.handle'],function($,event,tpl,db,login,map){
	//楼层缓存
	var list={};
	
	var model = new tpl({
		el: '#diagramck',
		data:{
			levels:[]
		},
		methods: {
			show: function (e) {
				if (e.layerX > 205 && e.layerY < 15) {
					e.target.style.display='none';
				}
			}
		}
	});

	var container = $("#diagramck").children("ul");

	//注册监听事件
	event.subs("hz.building.floor.separate","datagram",function(a,b){
		container.children("li").removeClass("active");
		db.query({
			request:{
				sqlId:"select_count_prisoner_by_rfid_area",
				params:{'cusNumber':login.cusNumber, 'parentId':a.area_id},
				whereId:'0',
				orderId:'0'
			},success:function(data){
				list[a.id] = data;
				list[a.id].length && container.parent().show();
				model.levels = data;
			}
		});
	});

	event.subs("hz.building.floor.click","datagram",function(level){
		container.children("li").removeClass("active");
		container.children("#gram"+level.area_id).addClass("active");
	});

	container.on("click","li",function(e){
		container.children("li").removeClass("active");
		this.classList.add("active");
		map.locationArea(this.dataset.area);
	});
});