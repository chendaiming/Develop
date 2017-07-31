define(function(require){
   var $ =require('jquery');
   var layerContainer = {};

   /*
	* 弹出框 obj {}
	    包含参数：
	     id:层ID 用于控制弹出限制
	     type:2为iframe打开方式，1位 load html片段方式
	     top:相对于顶部的距离 数值型；不传默认值为 80 ；
	     title:窗体的标题 ；不传则不显示标题栏
	     w:窗体的宽度；不传默认值为65%；
	     h:窗体的高度；不传默认值为75%；
	     shadeClose：如果开启了遮罩，点击遮罩是否关闭窗体 boolean 类型;
	     modal：是否开启遮罩 boolean类型 默认关闭
	     maxmin：是否显示最大化最小化按钮 默认显示
	     tBackColor:标题背景色
	     bBackColor:主题背景色
	     url:窗体body加载的 html 路径 必传
	     closeCallback:窗体关闭回调
     	后续参数再加。。。
	*/
	var dialog = {
		top: null,
		index: '',
		open: function (obj) {
			var me = this;
			var url = obj.url;

			if (obj.w) {
				obj.w += '';
				if (obj.w.indexOf('px') == -1) {
					obj.w += (obj.w > 100) ? 'px' : '%';
				}
			} else {
				obj.w = "85%";
			}

			if (obj.h) {
				obj.h += '';
				if (obj.h.indexOf('px') == -1) {
					obj.h += (obj.h > 100) ? 'px' : '%';
				}
			} else {
				obj.h = "85%";
			}

			if (obj.h.indexOf('%') > 0) {
				if (obj.top == undefined) {
					obj.top = (100 - obj.h.replace('%', '') * 1) / 2 + '%';
				}
			}

			if (obj.top == undefined) {
				obj.top = '10%';
			}

			if (obj.maxmin !== false || obj.maxmin !== true) {
				obj.maxmin = true;
			}
			if (obj.modal !== false || obj.modal !== true) {
				obj.modal = false;
			}

			if (url && url.indexOf('http://') != 0 && url.indexOf('https://') != 0) {
				url = ctx + url;
			}

			if (obj.targetId) {
				if (layerContainer[obj.targetId]) {
					var dailog = document.getElementById(layerContainer[obj.targetId]);
					obj.title && (dailog.children[0].textContent = obj.title);
					dailog.style.display = "block";
					return me;
				}
				me.index = layer.open({
					id: !obj.id ? obj.targetId + '_con' : obj.id,
					type: 1,
					title: !obj.title ? '' : obj.title,
					offset: typeof obj.top === 'string' ? obj.top : obj.top + "px",
					shadeClose: !obj.shadeClose ? false : true,
					shade: obj.modal,
					maxmin: 0,
					area: [obj.w, obj.h],
					success: function (layero, index) {
//				   me.bodyClick(layero);
						layero.css('z-index', 99);
						layero.css('background', 'rgba(1,26,53,0.98)');

						var temp = document.getElementById(obj.targetId);
						if (!temp) {
							alert("未找到弹窗");
							return;
						}
						layero.find("div.layui-layer-content").addClass("vbox")[0].appendChild(temp);
						temp.style.display = "";
						obj.callback && obj.callback();
					}
				});
				layerContainer[obj.targetId] = "layui-layer" + me.index;
				$("#layui-layer" + me.index).find("a.layui-layer-close").off().click(function () {
					document.getElementById(layerContainer[obj.targetId]).style.display = "none";
					obj.closeCallback && obj.closeCallback();
					return false;
				});
			} else {
				//<img src='css/icons/win_icon.png' style='width:25px;height:25px;vertical-align:middle'/>
				me.index = layer.open({
					id: obj.id,
					type: 2,
					title: !obj.title ? '' : "<span style='padding-left:5px;display:inline;font-size:17px'>" + obj.title + "</span>",
					offset: typeof obj.top === 'string' ? obj.top : obj.top + "px",
					shadeClose: !obj.shadeClose ? false : true,
					shade: obj.modal,
					resize: true,
					maxmin: obj.maxmin,
					area: [obj.w, obj.h],
					content: [url, 'yes'],
					zIndex: 1990,
					skin:obj.skin?obj.skin:'',
					success: function (layero, index) {
						var win = layero[0].children[1].children[0].contentWindow;

						win.params = obj.params || {};	// 权限控制按钮 - 传参数到弹出的iframe中的window对象中
						win.onload = obj.callback;		// 页面加载成功之后

						// iframe关闭之前
						obj.onBeforeCancel = function () {
							if (win.onbeforeunload) {
								win.onbeforeunload();
							}
						};

						me.bodyClick(layero);
					},
					cancel: function (index) {
						if (obj.id == 293) {
							require(['frm/hz.event'], function (hzEvent) {
								hzEvent.off('trackMove.reload');
								hzEvent.off('trackMove.isGo');
							});
						}
						obj.onBeforeCancel && obj.onBeforeCancel();
						obj.closeCallback && obj.closeCallback();
					},
					full: function (el) {
						layer.iframeAuto(layer.index);
					},
					min: function (layero) {
//				   layer.iframeAuto(layer.index);
						setTimeout(function () {
							layero.css({
								left: 'auto',
								right: 0,
								bottom: 0
							});
						}, 10);
					},
					restore: function (el) {
						layer.iframeAuto(layer.index);
					}
				});
			}
			return me;
		},
		switchTheme: function (layero) {
			var me = this;
			var themeKey = window.localStorage.getItem("themeKey");
			if (!themeKey) {
				return;
			}
			switch (themeKey) {
				case 'blue':
					break;
				default:
					layero.find('iframe').contents().find('.form-horizontal').addClass(themeKey + '_theme');
					break;
			}
		},
		bodyClick: function (layero) {
			$('.layui-layer').css('z-index', 1990);
			layero.css('z-index', layero.css('z-index') + 100);

			layero.on('mousedown', function () {
				$('.layui-layer').css('z-index', 1990);
				layero.css('z-index', layero.css('z-index') + 100);
			});

			var iframe = layero.find('iframe');
			var iframeBody = iframe.contents().find('body');
			iframeBody.on('mousedown', function (event) {
				$('.layui-layer').css('z-index', 1990);
				layero.css('z-index', layero.css('z-index') + 100);
				if (!(event.target.className == "combox_panel" || event.target.tagName == "SPAN" || event.target.tagName == "LI")) {
					iframeBody.find('.combox_panel').fadeOut("fast");
					iframeBody.find('.treeContent').fadeOut("fast");
					iframeBody.find('.layoutContent').fadeOut("fast");
				}
			});
		},
		close: function (index) {
			if (index) {
				this.index = index;
			}
			document.getElementById("layui-layer" + this.index).style.display = "none";
		},
		curClose:function(){/*关闭当前iframe*/
			var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
			parent.layer.close(index);
		}
	}

	/*
	 * 注入模块方法
	 */
	try {

		// 针对类似frame框架的模型化处理
		try {
			var hz = window.top.hz;
			if (!hz) {
				hz = window.top.hz = {};
			}

			if (hz.dialog) {
				dialog.top = hz.dialog;				// 初始化顶层dialog对象
				console.log('hz.dialog：初始化顶层dialog对象!');
			} else {
				dialog.top = hz.dialog = dialog;	// 初始化模块dialog对象
				console.log('hz.dialog：初始化模块dialog对象!');
			}
		} catch (e) {
			console.error('hz.dialog：引用顶层父级dialog对象失败...');
		}
	} catch (e) {
		console.error('初始化 --> 对话框模块异常，' + e);
	}

   return dialog;
});
