define(function(require){
	var hzEvent = require('frm/hz.event');
	
	return {
		click: function (event, data){
			hzEvent.emit('modelpoint.onclick', event, data);
		},
		rclick: function (event, data){
			hzEvent.call('pointRight',{
				data:data,
				event:event
			});
		},
		mouseover: function (event,data){
			$('#hzMap >canvas:eq(0)').css('cursor', 'pointer');
			hzEvent.call('pointMouseover',{
				data:data,
				event:event
			});
		},
		mouseout: function (event,data){
			$('#hzMap >canvas:eq(0)').css('cursor', '');
			hzEvent.call('pointMouseout',{
				data:data,
				event:event
			});
		},
		dblclick: function (event,data){
			hzEvent.call('pointDblclick',{
				data:data,
				event:event
			});
		}
	}
});