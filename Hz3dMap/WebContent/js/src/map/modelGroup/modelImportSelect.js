define(function(require) {
	var vue = vue || require('vue');
	var $ = $ || require('jquery');
	var db = db || require('frm/hz.db');
	var ztree = ztree || require('ztree');

	
	var selectcomponent = vue.extend({
		data : function() {
			return {
				name:'',
				datas:[{}]
			}
		},
		ready:function(){
			var me =this;
			me.load();
			$(me.$el).find('.combox_panel').on('mouseleave',function(){
				$(me.$el).find('.combox_panel').hide();
			});
		},
		watch:{
			'id':function(){
				if((this.id && this.id !='') || this.id=='0'){
					if(this.showload){
						this.load();
					}else{
						this.findName();						
					}
				}else{
					this.name="";
				}
			},
			'sname':function(val){
				if(this.sname.length>0){
					for(var i=0,j=this.datas.length;i<j;i++){
						if(val == this.datas[i].name){
							this.selected = this.datas[i];
							this.id = this.datas[i].id;
							this.name = this.datas[i].name;
						}
					}
				}else{
					this.selected  = null;
					this.id = '';
					this.name = '';
				}
			}
		},
		methods : {
			findName:function(){
				for(var i=0,j=this.datas.length;i<j;i++){
					if(this.id == this.datas[i].id){
						this.selected = this.datas[i];
						this.name = this.datas[i].name;
						this.sname = this.datas[i].name;
						return false;
					}
				}
			},
			load:function(){
				var me =this;
				me.name="";
				if(me.code){
					me.sqlid = "select_constant_bycode";
					db.query({
						request: {
							sqlId:me.sqlid,
							whereId:0,
							params:[me.code]
						},
						success: function (data) {
							me.datas=data;
							if((me.id && me.id!='') || me.id=='0'){
								me.findName();
							}
						}
					});
				}else if(me.list){
					me.datas=me.list;
					if((me.id && me.id!='') || me.id=='0'){
						me.findName();
					}
				}else{
					db.query({
						request: {
							sqlId:me.sqlid,
							whereId:!me.whereid ? 0 : me.whereid,
							orderId:!me.orderid ? 0 : me.orderid,
							params:me.params
						},
						success: function (data) {
							me.datas=data;	
							if((me.id && me.id!='') || me.id=='0'){
								me.findName();
							}
						}
					});
				}
			},
			setval : function(item) {
				this.selected = item;
				this.name = item.name;
				this.sname = item.name;
				this.id = item.id;
				this.show();
				this.$emit('select',this.id);
			},
			show : function() {
				var pdiv = $(this.$el.parentNode);
				var input = $(this.$el.parentNode).find('input');
				var companel = pdiv.find('.combox_panel');
				if(companel.length>0){
					if(companel.css('display')=='none'){
						if(this.showload){
							this.load();
						}
						companel.css({
							width:input.outerWidth()+'px'
						}).show();						
					}else{
						companel.css('display','none') ;
					}
				}
			}
		},
		props : [ 'code','tip', 'search', 'issearch','id','params','whereid','sqlid','showload','selected','sname','list'],
		template :'<div class="input icon">'
				+ '<input type="text" v-model="name" readonly @click="show" placeholder="{{tip}}">'
				+ '<span class="drop" @click="show" ></span>'
				+ '<div class="combox_panel" style="display:none">'
				+ '<div style="padding:6px;" v-if="issearch"><input style="height:30px;" v-model="search" class="search" placeholder="关键字搜索" /></div>'
				+ '<a class="select_item" v-bind:class={"selected":item.id==id} @click="setval(item)" v-for="item in datas | filterby searchtxt in "name"" v-text="item.name"></a>'
				+ '</div>'
				+ '</div>'
	});
	vue.component('hz-select', selectcomponent);
	
	var treeSelectComponent = vue.extend({
		data : function() {
			return {
				treeId:randomNum(5),
				name:'',
				datas:[{}]
			}
		},
		ready:function(){
			var me =this;
			this.load();
			$(me.$el).find('.combox_panel').on('mouseleave',function(){
				$(me.$el).find('.combox_panel').hide();
			});
		},
		watch:{
			'id':function(){
				if(!this.id && this.id!='0'){
					this.name="";
				}else{
					this.findName();
				}					
			},
			'sqlid':function(){
				this.load();
			}
		},
		methods : {
			findName:function(){
				for(var i=0,j=this.datas.length;i<j;i++){
					if(this.id == this.datas[i].id){
						this.selected = this.datas[i];
						this.name = this.datas[i].name;
						return false;
					}
				}
			},
			load:function(){
				var me =this;
				var s={
					data:{simpleData:{enable:true,pIdKey:'pid'}},
					callback:{
						onClick:function(event,treeId, treeNode){
							if(!me.isleaf){
								me.selected = treeNode;
								me.sname = treeNode.name;									
								me.name = treeNode.name;
								me.id = treeNode.id;
								me.hide();																
							}else{
								if(!treeNode || !treeNode.isParent){
									me.selected = treeNode;
									me.sname = treeNode.name;									
									me.name = treeNode.name;
									me.id = treeNode.id;
									me.hide();
								}
							}
							$(me.$el.parentNode).find('input').focus();
						}
					}
				}
				db.query({
					request: {
						sqlId:me.sqlid,
						whereId:!me.whereid ? 0 : me.whereid,
						params:me.params
					},
					success: function (data) {
						var ul = $(me.$el.parentNode).find('.ztree');
						if(data && data.length>0){
							data[0].nocheck = true;
							me.datas = data;
							me.findName();
							me.tree = $.fn.zTree.init(ul,s,data);	
							me.tree.expandNode(me.tree.getNodes()[0]);
						}
					}
				});
			},
			show : function() {
				var pdiv = $(this.$el.parentNode);
				var input = $(this.$el.parentNode).find('input');
				var companel = pdiv.find('.combox_panel');
				if(companel.length>0){
					if(companel.css('display')=='none'){
						companel.css({
							width:input.outerWidth()+'px'
						}).show();						
					}else{
						companel.css('display','none') ;
					}
				}
			},
			hide:function(){
				var pdiv = $(this.$el.parentNode);
				var input = $(this.$el.parentNode).find('input');
				var companel = pdiv.find('.combox_panel');
				if(companel.length>0){
					companel.hide();
				}
			}
		},
		props : ['tip','sqlid','id','whereid','params','isleaf','sname','selected'],//isleaf为根节点是否能点
		template : '<div class="input icon">'
				+ '<input v-model="name" readonly @click="show" placeholder="{{tip}}">'
				+ '<span class="drop" @click="show" ></span>'
				+ '<div class="combox_panel tree-con" style="width:100%;display:none">'
				+ '<ul class="ztree" :id="treeId" style="margin-top:0;"></ul>'
				+ '</div>'
				+ '</div>'
	});
	vue.component('hz-treeselect', treeSelectComponent);

	var checktreeComponent = vue.extend({
		data : function() {
			return {
				names:'',
				treeId:randomNum(5),
				datas:[{}]
			}
		},
		ready:function(){
			var me =this;
			me.load();
			$(me.$el).find('.combox_panel').on('mouseleave',function(){
				$(me.$el).find('.combox_panel').hide();
			});
		},
		watch:{
			ids:function(){
				if(this.ids.length==0){
					var me =this;
					this.names='';
					me.tree.checkAllNodes(false);
					me.tree.cancelSelectedNode();
				}else{
					this.findName();
				}
			},
			params:function(){
				this.load();
			}
		},
		methods : {
			findName:function(){
				var me=this;
				if(me.ids){
					var len = me.ids.length;
				}else {
					var len = 0;
				}
				
				if(len>0){
					var nameArry = [];
					me.tree.checkAllNodes(false);
					for(var i=0,j=me.datas.length;i<j;i++){
						for(var k=0;k<len;k++){
							if(me.datas[i].id == me.ids[k]){
								nameArry.push(me.datas[i].name);
								var no = me.tree.getNodeByParam('id',me.ids[k]);
								me.tree.checkNode(no,true);
							}
						}
					}
					me.names = nameArry.toString();
					me.sname = nameArry.toString();
				}
			},
			load:function(){
				var me =this;
				var s={
					data:{simpleData:{enable:true,pIdKey:'pid'}},
					check:{enable:true,chkboxType: { "Y": "s", "N": "s" }},
					callback:{
						onCheck:function(event,treeId, treeNode){
							var chks = me.tree.getCheckedNodes(true);
							var nameArry = [];
							me.ids=[];
							for(var i=0;i<chks.length;i++){
								nameArry.push(chks[i].name);
								me.ids.push(chks[i].id);
							}
							me.names = nameArry.toString();
						},
						/*
						 * 修改点击选中
						 */
						onClick:function(event, treeId, treeNode){
							if(treeNode.checked){
								me.tree.checkNode(treeNode, false, false);
							}else{
								me.tree.checkNode(treeNode, true, false);
							}
							var chks = me.tree.getCheckedNodes(true);
							var nameArry = [];
							me.ids=[];
							for(var i=0;i<chks.length;i++){
								nameArry.push(chks[i].name);
								me.ids.push(chks[i].id);
							}
							me.names = nameArry.toString();
						}
					}
				}
				db.query({
					request: {
						sqlId:me.sqlid,
						whereId:!me.whereid ? 0 : me.whereid,
						params:me.params
					},
					success: function (data) {
						var ul = $(me.$el.parentNode).find('.ztree');
						if(data && data.length>0){
							if(me.firstcheck){
								data[0].nocheck = false;
							}
							me.datas = data;
							me.tree = $.fn.zTree.init(ul,s,data);	
							me.tree.expandNode(me.tree.getNodes()[0]);
							me.findName();
						}else{
							$(ul).html('');
							me.names = [];
							me.ids = []; 
						}
					}
				});
			},
			show : function() {
				var pdiv = $(this.$el.parentNode);
				var input = $(this.$el.parentNode).find('input');
				var companel = pdiv.find('.combox_panel');
				if(companel.length>0){
					if(companel.css('display')=='none'){
						companel.css({
							width:input.outerWidth()+'px'
						}).show();						
					}else{
						companel.css('display','none') ;
					}
				}
			},
			hide:function(){
				var pdiv = $(this.$el.parentNode);
				var input = $(this.$el.parentNode).find('input');
				var companel = pdiv.find('.combox_panel');
				if(companel.length>0){
					companel.hide(); 
				}
			}
		},
		props : [ 'tip','sqlid','ids','whereid','params','firstcheck','sname'],
		template : '<div class="input icon">'
				+ '<input v-model="names" readonly @click="show" placeholder="{{tip}}">'
				+ '<span class="drop" @click="show" ></span>'
				+ '<div class="combox_panel tree-con" style="width:100%;display:none">'
				+ '<ul class="ztree" :id="treeId" style="margin-top:0;"></ul>'
				+ '</div>'
				+ '</div>'
	});
	vue.component('hz-checktree', checktreeComponent);
	
	function randomNum(n){
	  var rnd="";
	  for(var i=0;i<n;i++)
	     rnd+=Math.floor(Math.random()*10);
	  return rnd;
	}
	
});