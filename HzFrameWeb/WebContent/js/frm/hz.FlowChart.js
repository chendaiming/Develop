define(function  (repuire) {
	var $ = require('jquery');
	function PlanChart(){
		console.log('create PlanChart ...');
		var suredStep,callback;
		return {
			stepMap : {},		// 流程步骤节点的MAP
			dataS : {
		        "pid": '',
		        "id": '',
		        "text": "",
		        "tip": "",
		        "className": "",
		        "icons": {
		            "normal": "../../css/flowimg/normal.png",
		            "active": "../../css/flowimg/activation.png",
		            "hover": "../../css/flowimg/hover.png"
		        },
		        "action": {"type": "","auth": "","data": {}},
		        "attributes": {"spacingLeft": 150},
		        "children": []
		    },
		    /*流程图初始化
		     * @param para.myChart 		存放流程图的标签
		     * @param para.data			节点数据
		     * @param para.drag 		是否拖动节点(boolean)
		     * @param para.rightMenu	禁止右键菜单
		     * 
		     * @param para.tool			功能（自定义右键菜单）
		     * @param para.tool.id 		元素id,
			 * @param para.tool.name 	功能名称,
			 * @parma para.tool.icon 	图标样式,
		     * */
			init:function(para){
				if((typeof para.myChart) == 'string' ){
					this.myChart = $(para.myChart);
				} else{
					this.myChart = para.myChart;
				}
				for(var i = 0, len = para.data.length; i < len; i++){
					this.add(para.data[i], this.myChart);
				}
				this.line(this.myChart.children(".flex"));//连线
	
				para.drag&&this.drag(this.myChart);//拖动节点
	
				para.rightMenu&&this.rightMenu(this.myChart.parent());//禁止右键菜单
				para.callback && (callback = para.callback);
				para.tool&&this.newTool(this.myChart,para.tool);//功能
				para.suredStep && (suredStep = para.suredStep);
				return this.stepMap;
			},
			/*下拉列表 
			 * @param inputDt			显示的框; 
			 * @param childrenClass		收放元素;
			 * @param option			选项;
			 * @param dates				时间/s;
			 * */
			spinner:function (inputDt,childrenClass,option,dates){
				dates = dates?dates:100;
				$(inputDt).on('click',function(){
					$(this).parent().children(childrenClass).slideToggle(dates);
				});
				$(inputDt).parent().on('mouseleave',function() {
					$(this).children(childrenClass).slideUp(dates);
				});
				$(option).on('click',function(){
					var html = $(this).html();
					$(this).parent().parent().children(inputDt).html(html);
					$(this).parent().slideToggle(dates);
				});
			},
			/*
			 *禁止鼠标右键菜单
			 * */
			rightMenu:function(myChart){
				$(myChart).on("contextmenu",function(){
					return false;
				});
			},
			/*
			 * 简单拖拽
			 * @param id 拖拽元素的id
			 * */
			simpleDrag:function(id){
				var myChartId = document.getElementById(id);
				myChartId.onmousedown = function(en){
					//console.log(en);
					var ev = ev || event;
		             var disX = en.clientX - myChartId.offsetLeft;
		             var disY = en.clientY - myChartId.offsetTop;
		            if (myChartId.setCapture) {
		            	myChartId.setCapture();
		             }
		 
		             document.onmousemove = function (en) {
		                 var ev = ev || event;
		                 myChartId.style.top = en.clientY - disY + 'px';
		                 myChartId.style.left = en.clientX - disX + 'px';
		             };
		             document.onmouseup = function () {
		                 document.onmousemove = null;
		                 if (myChartId.releaseCapture) {
		                	 myChartId.releaseCapture()
		                 }
		             };
		             offset = {
		             	top:myChartId.style.top,
		             	left:myChartId.style.left
		             };
		             return offset;//拖拽后的top，left
					
				};
				
			},
			 /*自定义鼠标右键菜单
			  * @param toolData.id 		元素id,
			  * @param toolData.name 	功能名称,
			  * @parma toolData.icon 	图标样式,
			  */
			newTool:function(myChart,toolData){
				if(toolData){
					var toolDiv = $('<div id="tool"></div>');
					var toolId = [],icon;
					var bomTool = '<div class="tool_btn">'
					for(var i=0,leg=toolData.length;i<leg;i++){
						icon = toolData[i].icon ? toolData[i].icon : '';
						bomTool += '<button id="'+toolData[i].id+'" class="iconfont '+icon+'">'+toolData[i].name+'</button>';
						toolId.push(toolData[i].id);
					};
					bomTool +='</div>';
				};
				toolDiv.html(bomTool);
				myChart.append(toolDiv);
				this.tool(myChart,toolDiv);
				this.toolHide(myChart,toolDiv,toolId)
			},
			tool:function(myChart,myTool){//显示tool
				this.myChart.on("mousedown",'.list',function(e){
					$('.zIndex')&&$('.zIndex').removeClass('zIndex');
					$(this).parent().addClass('zIndex');
					var winHeight = $(window).height();
					var winWidth = $(window).width();
	
					var width = $(this).width();
					var left = e.pageX+10-myChart.offset().left;
					var top =  e.pageY+10-myChart.offset().top;
					var leftT = true,topT = true;
					if (e.clientY + myTool.height() + 30 > winHeight) {
						top -= myTool.height()+30;
						topT = false;
					}
	
					if(e.clientX + myTool.width() + 30 > winWidth){
						left -= myTool.width() + 30;
						leftT = false;
					};
					if(topT){
						if(leftT){
							myTool.attr('class','toolLeftT')
						}else{
							myTool.attr('class','toolRightT')
						}
					}else{
						if(leftT){
							myTool.attr('class','toolLeftB')
						}else{
							myTool.attr('class','toolRightB')
						}
					}
					if(e.which == 3){
						myTool.css({
							left:left+"px",
							top: top + "px"
						});
						myTool.show();
					}
				});
			},
			toolHide:function(myChart,myTool,toolId){//隐藏tool
				this.myTool = myTool;
				$(document).on("mousedown",function(e){
					if(e.which == 3){
						var classM = e.target.className;
						if(classM &&(typeof classM) == 'string' ){
							if(!(/list/.test(classM))){
								myTool.hide();
							}
						}else{
							myTool.hide();
						}
					}else if(e.which == 1){
						if(!e.target.parentNode.classList.contains('tool_btn')){
							myTool.hide();
						}
					};
					
				});
			},
			/*遍历节点
			 * @param item 		节点数据
			 * @param chartId 	父节点
			 * @param classN 	null
			 * */
			add:function(item,chartId,classN){
				var that = this;
				classN = classN?'flex'+' '+classN:'flex';
				var flex = $("<div class='"+classN+"'><div class='list' title='"+item.tip+"'><i></i></div></div>").appendTo(chartId);
				var lineS = $("<div class='lineS'></div>");
				var itemLen = item.children.length;
				
				flex.append(lineS);
				item.attributes && item.attributes.spacingLeft&& flex.attr('style', 'margin-left:'+item.attributes.spacingLeft + 'px');
				flex.find('.list').addClass(item.className).attr({'id': item.id}).append(item.text);
	
				item.status = 'normal';
				that.stepMap[item.id] = item;
	
				if (item.children.length > 0) {
					for(var i = 0, len = itemLen; i < len; i++){
						that.add(item.children[i], lineS);
					}
				}
			},
			/*节点连线
			 * @param chartId	节点
			 * */
			line: function(chartId,fal){
				if(fal)$('.div_svg').remove();
				if(chartId.length<=0)return;
				var that = this;
	
				var listwidth = $(".list") ? $(".list").width() : 131;
				var marginLeft = chartId.attr("style") && chartId.attr("style").split(':')[1].split('p')[0];
	
				if (chartId.children(".lineS").children().length>0){
					var offsetX = chartId.offset().top;
					var offsetY = chartId.offset().left;
					var fY= chartId.height() / 2;	// 起点、终端的Y坐标
	
					var thisPadding = chartId.children(".list").css("padding").split(' ')[1].split('p')[0];
					var fX = listwidth + 3 + 40;	// 起点X坐标
	
					var listId = chartId.children(".list").attr('id');
					var fXL = fX + 50;				// 终点X坐标
	
					var path = '';
					var childX = chartId.width();
	
					md = 'M' + fX + ',' + fY + 'L' + fXL + ',' + fY;
					path += '<path id="line_c_'+listId+'" d="' + md + '" class="path normal"></path>';
	
	
					chartId.children(".lineS").children(".flex").each(function(i,item){
						var Y = $(this).offset().top - offsetX + $(this).height() / 2;
						var X = $(this).offset().left - offsetY;
						var d = 'M' + fXL + ',' + fY + 'L' + fXL + ',' + Y + 'L' + X + ',' + Y;
	
						/*折线*/
						path += '<path id="line_p_' + $(this).children(".list").attr('id') + '" d="' + d + '" class="path normal"></path>';
						that.line($(this));
					})
	
					chartId.append($('<div class="div_svg"><svg >'+path+'</svg></div>'));
				}else{
	
				}
			},
			drag:function(myChart){//拖动节点
				var that = this;
				var listUp;
				document.onmousedown = function(en){
					var ev = ev || event;	
					if(en.which == 1){
						if(en.target.classList.contains('list')){
							var listEn = en.target;
							$('.zIndex10') && $('.zIndex10').removeClass('zIndex10');
							listEn.parentNode.classList.add('zIndex10');
							var listData = that.stepMap[listEn.id];
							var res = that.stepMap[that.parentId(listEn)];
							var fal = false;
							
							// 删除相应数据
							if(res){
								for(var i=0,leg=res.children.length;i<leg;i++){
									if(res.children[i].id == listData.id){
										res.children.splice(i,1);
										break;
									}
								}
								fal = true;
							}
							
							var targetList = listEn.parentNode;/*拖动的元素*/
							//获取元素坐标
							var leftX = targetList.style.left == ''?0:targetList.style.left.split('p')[0];
							var topY = targetList.style.top == ''?0:targetList.style.top.split('p')[0];

				            if (targetList.setCapture) {
				            	targetList.setCapture();
				             }
				             //鼠标点击时的坐标
				             var pageY = en.pageY;
				             var pageX = en.pageX;

							document.onmousemove = function (en) {
				                 var ev = ev || event;
				                 //设置元素坐标
				                 targetList.style.top = en.pageY + parseInt(topY) - pageY + 'px';
				                 targetList.style.left = en.pageX + parseInt(leftX) - pageX + 'px';
				                 $('.borderColor')&&$('.borderColor').removeClass('borderColor');
				                 var listUp = that.isList({y:en.pageY,x:en.pageX},'.list',listEn);
				                 if(listUp){
				               		listUp.classList.add('borderColor'); 
				                }

				             }

				            document.onmouseup = function (e) {
				            	document.onmousemove = null;
				            	$('.zIndex10') && $('.zIndex10').removeClass('zIndex10');
				            	$('.borderColor')&&$('.borderColor').removeClass('borderColor');
				               /*通过鼠标抬起时的坐标获取该坐标所在的元素*/
				               	listUp = that.isList({y:e.pageY,x:e.pageX},'.list',listEn);
				                if(listUp){
				                	var listUpParent,parentId;
				                	if(listUp[0]){
				                		listUpParent = listUp[0].parentNode;
				                	}else{
				                		listUpParent = listUp.parentNode;
				                	}
				                	listUpParent.getElementsByClassName('lineS')[0].appendChild(targetList)
				                	
				                	//添加相应数据
				                	if(fal){
				                		parentId = listUpParent.getElementsByClassName('list')[0].id;
				                		listData.pid = parentId;
				                		parentId && that.stepMap[parentId].children.push(listData);
				                		if(!(listUp.classList.contains('active'))){
				                			that.stepMap[listData.id].status = 'normal';
				                			var arrt = that.stepMapID(that.stepMap[listData.id]);
				                			[].forEach.call(arrt,function(item){
				                				that.stepMap[item].status = 'normal';
				                				suredStep && (delete suredStep[item]);
				                			});
				                			
				                			$(listUp).parent().find('.lineS').find('.list').attr('class','list normal');
				                		};
				                		callback && callback(listData);
				                	}
				                	
				                }
				                //初始化元素坐标
				                targetList.style.top = 0;
				                targetList.style.left = 0;
				             
				                /*重新连线*/
				                that.line(myChart.children(".flex"),true);

				                 if (targetList.releaseCapture) {
				                	 targetList.releaseCapture()
				                 }
				             }
				            return listUp?listUp.parentNode:null;//拖动元素的父元素
							
						}
						
					}
				};
			},
			/*获取父级数据的id
			 * @param listEn 子元素
			 * */
			parentId:function(listEn){
				var id='';
				var listNode = listEn.parentNode.parentNode;
				if(listNode.classList.contains('lineS')){
					id = listNode.parentNode.getElementsByClassName('list')[0].id;
				}
				return id;
			},
			/*
			 * 通过点获取元素
			 * @param coordinate 点坐标
			 * @param bomClass   匹配的元素
			 * */
			isList:function (coordinate,bomClass,targetList){
				if(targetList)var targetListId = targetList.id;
				bomClass = $(bomClass);
				var that = null,getTop,getLeft,isY,isX;
				for(var i=0,leg=bomClass.length;i<leg;i++){

					isY = this.rangeNumber(bomClass[i],coordinate,true);
					isX = this.rangeNumber(bomClass[i],coordinate,false);

					if(isY && isX){
						if(bomClass[i].id != targetListId){
							that = bomClass[i];
							break;
						}
					};
				};
				return that;
			},
			/*
			 * 判断值的范围
			 * @param el   	元素
			 * @param num 	数值
			 * @param bool 	true:Y坐标 || false:X坐标
			 * */
			rangeNumber:function(el,num,bool){
				var small,large;
				if(bool){
					small = this.getTop(el);
					large = el.offsetHeight;
					num = num.y;
				}else{
					small = this.getLeft(el);
					large = el.offsetWidth;
					num = num.x;
				};
				return (small <= num && small+large >= num);
			},
			/*
			 * 获取元素的横坐标（相对于窗口）
			 * @param e 元素
			 * */
			getLeft:function(e){
				 var offset=e.offsetLeft;
			    if(e.offsetParent!=null) offset+=this.getLeft(e.offsetParent);
			    return offset;
			},
			/*
			 * 获取元素的纵坐标（相对于窗口）
			 * @param e 元素
			 * */
			getTop:function(e){
				var offset=e.offsetTop;
			    if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
			    return offset;
			},
			/*
			 * 事件绑定
			 * @param element  元素
			 * @param type     事件（不带on）
			 * @param fn	   方法
			 * @param myThis   子元素
			 * */
			addEvent:function( element, type, fn, myThis){
				if((typeof element) == 'string' ){
					this.element = $(element);
				} else{
					this.element = element;
				}
				var that = this;
				if(myThis){
					this.element.on(type, myThis, function(){
						that.myTool.hide();
						return fn();
					});
					
				}else{
					this.element.on(type, function(){
						that.myTool.hide();
						return fn();
					});
				}
	
			},
			/*
			 * 移除事件绑定
			 * @param element 元素
			 * @param type    事件
			 * @param myThis  子元素||null
			 * */
			removeEvent:function(element, type, myThis ){
				if(myThis){
					$(element).off(type, myThis);
				}else{
					$(element).off(type);
				}
			},
			/*
			 * 删除节点
			 * @param fn 回调函数
			 * */
			reomveList:function(fn){
				var that = this;
				var zIndex = that.myChart.find('.zIndex');//点击的节点
				var zIndexId = zIndex.children('.list').attr("id");
				var stepMapS = zIndexId?that.stepMap[zIndexId]:null;
				that.myTool.hide();
				
				
				var arrId = that.stepMapID(stepMapS)
				arrId.forEach(function(item){
					delete that.stepMap[item];
				})
				zIndex.remove();
				that.line(that.myChart.children(".flex"),true);
				return fn?fn(stepMapS):null;/*//  that.stepMap[zIndexId]：删除节点的数据*/
			},
			/*
			 * 获取子集id
			 * @param stepMapS 	数据
			 * @param arr 	  	子id数组
			 * */
			stepMapID:function(stepMapS,arr){
				var that = this;
				if(!arr)var arr = [stepMapS.id];
				for(var i in that.stepMap){
					if(that.stepMap[i] && that.stepMap[i].pid == stepMapS.id){
						arr.push(that.stepMap[i].id);
						that.stepMapID(that.stepMap[i],arr);
					}
				}
				
				return arr;
			},
			/*
			 * 添加节点
			 * @param dataS 添加节点的数据
			 * @param fn    回调函数
			 * */
			addList:function(dataS,fn){
				var that = this;
				var zIndex = that.myChart.find('.zIndex');//点击的节点
				var zIndexId = zIndex.children('.list').attr("id");
				var res = that.stepMap[zIndexId];//this的数据
				that.myTool.hide();
				
				if(dataS){
					that.dataS = dataS;
				}else{
					console.log('无数据');
					return ;
				}
	            res.children.push(that.dataS) ;
				that.add(that.dataS,zIndex.children('.lineS'),'zIndex');
				zIndex.removeClass('zIndex');
				/*重新连线*/
				that.line(that.myChart.children(".flex"),true);
				return fn&&fn(zIndexId);/*zIndexId :父元素id*/
				
			},
			empty:function(myChart){
				myChart.html('');
				this.stepMap = {};
			},
			/*判断数据类型
			 *@param o 		数据
			 *@param typy	类型
			 **/
			isType:function(o,type){
				var gettype=Object.prototype.toString;
				var setType = gettype.call(o);
				if(type){
					switch (type){
						case 'null'      : return setType === '[object Null]';
						case 'number'    : return setType === '[object Number]';
						case 'boolean'   : return setType === '[object Boolean]';
						case 'string'    : return setType === '[object String]';
						case 'undefined' : return setType === '[object Undefined]';
						case 'object'    : return setType === '[object Object]';
						case 'array'     : return setType === '[object Array]';
						case 'function'  : return setType === '[object Function]';
					}
				}
				return setType;
			}
		};
	}
	return PlanChart();
});