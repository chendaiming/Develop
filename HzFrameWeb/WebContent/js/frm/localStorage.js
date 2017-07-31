define(function(require){
	var isAndroid = (/android/gi).test(navigator.appVersion);
	return {
		hzStorage:function(){
	        var ls = window.localStorage;
	        if(isAndroid){
	           ls = os.localStorage();
	        }
	        return ls;
	    },
		setItem:function(key, value){
			var me=this;
			if(arguments.length === 2){
				var v = value;
				if(typeof v == 'object'){
					v = JSON.stringify(v);
					v = 'obj-'+ v;
				}else{
					v = 'str-'+ v;
				}
				var ls = me.hzStorage();
				if(ls){
					ls.setItem(key, v);
				}
			}
		},
		getItem : function(key){
			var ls = this.hzStorage();
			if(ls){
				var v = ls.getItem(key);
				if(!v){return;}
				if(v.indexOf('obj-') === 0){
					v = v.slice(4);
					return JSON.parse(v);
				}else if(v.indexOf('str-') === 0){
					return v.slice(4);
				}
			}
		},
		remove : function(key){
			var ls = this.hzStorage();
			if(ls && key){
				ls.removeItem(key);
			}
		},
		clear : function(){
			var ls = this.hzStorage();
			if(ls){
				ls.clear();
			}
		},
		menus:function(){
			var list = this.getItem("userInfo")['menus'] || [];
			
			for(var j=0,len=list.length;j<len;j++){
				(len!=list.length)&&(len=list.length,j--);
				this.menu(list[j],list,list);
			}
			return list;
		},
		menu:function(item,list,l){
			for(var i =0;i<list.length;i++){
				if(item.id==list[i].pid){
					!item.childs&&(item.childs=[]);
					
					item.childs=item.childs.concat(list.splice(i,1));
					i--;
					continue;
				}else if(item.pid==list[i].id){
					!list[i].childs&&(list[i].childs=[]);
					list[i].childs.unshift(l.splice(l.indexOf(item),1)[0]);
					continue;
				}
				
				if(item.id!=list[i].id&&list[i].childs){
					this.menu(item,list[i].childs,l);
				}
			}
		},
		getPermission:function(){
			var list=this.getItem("userInfo")['menus'];
			var permission=[];
			for(var i=0,len=list.length;i<len;i++){
				permission.unshift(list[i]['permission']);
			}
			return list;
		}
	}
});