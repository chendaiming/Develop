define(["jquery","ztree","frm/treeUtil"],function($,ztree,util){
	//用于存储选中的值
	var container;
	//d
	var option,input;
	
	var datalist={};
	//设置
	var setting={
			data:{simpleData:{enable: true},key:{name:'name'}},
	};
	//基础方法
	function fundation(id,options,data){
		var zindex=options.zindex?options.zindex:99;
		var cid=(options.type?options.type:'')+id;
				
		//下拉框容器
		var html='<div id="id'+cid+'" class="'+(options.diyClass&&options.diyClass)+' combox_panel " style="display:none;z-index:'+zindex+';"><ul id="re'+cid+ '" class="ztree"></ul></div>';
		//将下拉框追加到页面上
		var panel=$(html).appendTo('body').mouseleave(function(){this.style.display="none";}).click(function(e){
			if(e.target.parentNode.nodeName=='A'){
				this.style.display='none';
			}
		});
		
		var input=$("#"+id);
		//将树形结构移动到input下
		if(!options.click){
			input.parent().off().click(function(){
				var offset=$(this).offset();
				$("#id"+this.dataset.rel).css({left:offset.left,top:offset.top+this.clientHeight,width:$(this).width()}).slideDown();
				return false;
			})[0].dataset.rel=cid;
		}
		//设置
		option=options=$.extend(setting,options);
		//初始化树形结构
		var treeContainer=$.fn.zTree.init(panel.find("ul"),options,data);
		options.expand&&treeContainer.expandNode(treeContainer.getNodes()[0],true);
		//搜索
		if(!options.offSearch){
			var timeSearch;
			if(options.key&&options.key.length){
				input.off().keyup(function(){
					var val = this.value;
					clearTimeout(timeSearch);
					timeSearch = setTimeout(function(){
						util.searchTree(options.key,val,"re"+cid,data,options);
					},500)
				});
			}
		}
		return treeContainer;
	}

	var base={
			init:function(id,options,data){
				return fundation(id,options,data);
			}
			
	};
	return base;
});