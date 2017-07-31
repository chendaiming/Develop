define(function(require){
	var vue = require('vue');
	var hzdate = require('hzdate');
	
	Flatpickr.l10n.weekdays.shorthand = ['周日', '周一', '周二', '周三', '周四','周五', '周六'];
	Flatpickr.l10n.weekdays.longhand = ['星期日','星期一', '星期二','星期三','星期四','星期五', '星期六'];
	Flatpickr.l10n.months.longhand = ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月', '九月', '十月', '十一月', '十二月'];
	Flatpickr.l10n.months.shorthand = ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月', '九月', '十月', '十一月', '十二月'];
	
		
		var datecomponent = vue.extend({
			ready:function(){
				var me =this;
				if(!me.format){
					me.format = 'Y-m-d';
					if(me.enabletime){
						me.format = 'Y-m-d H:i';
						if(me.enablesecond){
							me.format = 'Y-m-d H:i:S';
						}
					}
				}
				require(['hzdate'],function(){
					me.dateInput = $(me.$el).find('input').flatpickr({
						minuteIncrement:1,
						utc:false,
						maxDate:me.maxdate,
						minDate:me.mindate,
						dateFormat:me.format,
						enableTime:me.enabletime || me.enabletime==1 ? true :false,
						enableSeconds :me.enablesecond == 1 ? true : false,
						time_24hr:true,
						onOpen:function(){
							$('.flatpickr-month').find('input').attr('title','鼠标滚动快速选择');
							$('.flatpickr-time').find('input').attr('title','鼠标滚动快速选择');
						},
						onClose:function(dateObj, dateStr, instance){
							me.val = dateStr;
						}
					});
				})
			},
			props:['val','tip','enabletime','enablesecond','format','maxdate','mindate','onlytime'],
			template :'<div class="input icon date-input">'
				+ '<input type="text" data-input v-model="val" readonly  placeholder="{{tip}}">'
				+ '<span class="datetime" data-toggle></span>'
				+ '</div>'
		});
		
		var timecomponent = vue.extend({
			ready:function(){
				var me =this;
				require(['hzdate'],function(){
					me.dateInput = $(me.$el).find('input').flatpickr({
						minuteIncrement:1,
						dateFormat:!me.format ? 'H:i:S' : me.format,
						enableTime:true,
						enableSeconds :me.enablesecond == 1 ? true : false,
						time_24hr:true,
						noCalendar:true,
						allowInput:false,//是否允许用户自行输入
						onOpen:function(dateObj, dateStr){
							$('.flatpickr-time').find('input').attr('title','鼠标滚动快速选择');
							//时刻保持控件与输入框的值一致
							if(dateStr && dateStr.indexOf(':') != -1){
								var _hour = dateStr.substr(0,dateStr.indexOf(':'));
								var _minute =  dateStr.substr(dateStr.indexOf(':')+1).split(":")[0];
								$('.flatpickr-time').find('.flatpickr-hour').val(_hour);
								$('.flatpickr-time').find('.flatpickr-minute').val(_minute);
							}else{
								$('.flatpickr-time').find('.flatpickr-hour').val('12');
								$('.flatpickr-time').find('.flatpickr-minute').val('00');
								me.val = '12:00';
							}
						},
						onClose:function(dateObj, dateStr, instance){
							me.val = dateStr;
						},
						onValueUpdate:function(selectedDates, dateStr, instance){
							//消除赋值延迟
							me.val = dateStr;
						}
					});
				});
			},
			props:['val','tip','format','enablesecond'],
			template :'<div class="input icon date-input">'
				+ '<input type="text" v-model="val"  placeholder="{{tip}}">'
				+ '<span class="datetime"></span>'
				+ '</div>'
		});
		
		vue.component('hz-date', datecomponent);
		vue.component('hz-time', timecomponent);
		
	
});