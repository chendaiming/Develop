define(function(require){
	var Vue = require('vue');
	var drag = drag || require('frm/hz.drag');
	var ls = ls || require('frm/localStorage');
	var mapHandle = require('hz/map/map.handle');
	var hzEvent =  require('frm/hz.event');
	var MapPrisoner =  require('hz/map/mapPoint/map.prisoner');

	var panelcomponent = Vue.extend({
		data:function(){
			return {
				topStyle:{
					cursor:'move',
					height:'35px',
					lineHeight:'35px',
				},
				iconStyle:{
					width:'20px',
					height:'20px',
					marginLeft:'10px',
					verticalAlign:'middle' 
				},
				titleStyle:{
					display:'inline-block',
					height:'100%',
					padding:'0 10px',
					fontWeight:600,
					fontSize:'16px',
					color:'#fff'
				},
				closeStyle:{
					position:'absolute',
					top:'8px',
					right:'0',
					width:'22px',
					height:'22px',
					cursor:'pointer'
				},
				refreshStyle:{
					position:'absolute',
					top:'8px',
					right:'25px',
					width:'22px',
					height:'22px',
					cursor:'pointer'
				},
				pStyle:{
					width:'',
					height:'',
					color:'#fff',
					background:'url(css/images/panel.png)'
				},
				simPanel:{
					width:'',
					height:'',
					left:this.left+'px',
					top:this.top+'px',
					color:'#fff'
				}
			}
		},
		beforeCompile:function(){
			var me = this;
			if(!me.p.w || me.p.w==0){
				me.p.w = '300'
			}
			if(!me.p.h || me.p.h==0){
				me.p.h = '350'
			}
			me.pStyle.width = me.p.w+'px';
			me.pStyle.height = me.p.h+'px';
		},
		ready:function(){
			var me =this;
			drag.on($(this.$el)[0].parentNode,this.p)
			var content = $('#panel_'+this.p.id);
			if(this.p.url){
				content.load(this.p.url, function (responseText, textStatus, XMLHttpRequest) {
					content.html(XMLHttpRequest.responseText);
				});				
			}
		},
		methods:{
			removePanel:function(pid){
				if (pid == 4) {
					ls.remove('isAddPointState');
					$('#addPointPanel').hide();
					if (window._mapPointData && window._mapPointData.curDoorModelObj){
						_mapPointData.curDoorModelObj.instacne.setBorderShow(false);
						_mapPointData.curDoorModelObj = null;
					}
					mapHandle.removeModelPointById('20161209');
				}
				if(pid == 7){
					hzEvent.off('trackMove.edit');
					mapHandle.hzThree.Track.setIsEditRoute(false);
				}
				if(pid==8){
					mapHandle.modelComponent.disabledEdit();
					mapHandle.removeComponentById('161226');
				}
				if(pid==10){
					var mapPrisoner = new MapPrisoner();
					mapPrisoner.disabledEdit();
				}
				for(var i=0;i<this.panels.length;i++){
					if(this.panels[i].id == pid){
						this.panels.$remove(this.panels[i]);
					}
				}

				// 关闭面板还原状态
				mapHandle.setHandleNormal();
				ls.setItem('ps',this.panels);
			}
		},
		props:['p','panels','tag'],
		template:'<div v-if="!p.simple" v-bind:style="pStyle">'+
				'<div v-bind:style="topStyle">'+
				 '<img v-if="p.icon && p.icon.length>0" v-bind:style="iconStyle" v-bind:src="p.icon"/>'+
				 '<span v-bind:style="titleStyle" v-text="p.name"></span>'+
				 '<img src="css/icons/refresh.png" :style="refreshStyle"/>'+
				 '<img @click="removePanel(p.id)" src="css/icons/close.png" :style="closeStyle" />'+
				 '</div>'+
				 '<div style="height:100%" v-bind:id="tag+p.id"></div>'+
				'</div>'+
				'<div v-if="p.simple" class="simple-panel">'+
				'<div class="title">'+
					'<span v-text="p.name"></span>'+
					'<img @click="removePanel(p.id)" src="css/icons/close.png"/>'+
				'</div>'+
				'<div  v-bind:id="tag+p.id"></div>'+
				'</div>'
	});
	Vue.component('hz-panel',panelcomponent);

	var configspanel = Vue.extend({
		props:['data'],
		template:'<div class="config-panel" v-for="p in data" track-by="id" v-bind:style="{left:p.left,top:p.top}">'+
				'<hz-panel :p="p" :panels="data" tag="panel_"/>'+
				'</div>'
	})
	Vue.component('hz-panels',configspanel);
});