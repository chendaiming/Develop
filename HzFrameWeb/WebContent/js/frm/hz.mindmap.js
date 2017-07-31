define(function(require){
	// 外部JS引用
	var $ = $ || require("jquery");

	// HTML模板
	var mmBoxHTML = '<div class="hz-mm-box"><div class="hz-mm-line"><div class="hz-mm-node-btn"></div></div></div>';
	var mmNodeHTML = '<div class="hz-mm-node"><div class="hz-mm-body"><a class="hz-mm-close"></a><div class="hz-mm-name"></div></div><div class="hz-mm-line-x"></div><div class="hz-mm-line-y"></div></div>';

	var $mmScene, $mainScene, $scaleText, $linkPoint, $rootBox, $childBox, position;

	// 节点数据存储对象
	var mmNodesMap = {};
	
	var scaleTimerId = null;




	/* ************************************************ */
	// 属性设置
	var emptyFn = function () {};
	var clickTimerId = null;			// 单击延迟处理对象ID，用来处理单双击事件

	// 默认属性设置对象
	var sysSetting = {
		data: {
			clickDelay: 300		// 单击延迟时间，onDblClick事件存在时有效
		},
		view: {
			showClose: false,
		},
		callback: {
			onClick: emptyFn,
			onDblClick: emptyFn,
			onRightClick: emptyFn,
			onCloseClick: emptyFn
		}
	};

	// 自定义属性设置对象
	var userSetting = sysSetting;


	/**
	 * 步骤画图对象
	 */
	function MindMap () {
		// 缩放参数
		var scale = 100;			// 缩放比例
		var scaleRatio = 5;			// 缩放系数
		var scaleMin = 20;			// 最小缩放比例
		var scaleMax = 150;			// 最大缩放比例
		var ctrlKey = false;		// Ctrl按键状态
		var mainPosition = null;

		// 初始化场景对象
		$mmScene = $('div.hz-mm-scene');

		if ($mmScene.length) {

			// 初始化场景三大元素
			$mainScene = $('<div class="hz-mm-main-scene"></div>').appendTo($mmScene);			// 主场景
//			$toolbar = $('<div class="scene-toolbar"></div>').appendTo($mmScene);				// 工具条
			$scaleText = $('<span class="hz-mm-scale-text"></span>').appendTo($mmScene)			// 缩放比例显示
			$linkPoint = $('<div class="hz-mm-link-point"></div>').appendTo($mainScene);		// 连接点
			$rootBox = $(mmBoxHTML).addClass('hz-mm-root').appendTo($mainScene);			// 根节点容器
			$childBox = $(mmBoxHTML).addClass('hz-mm-child').appendTo($mainScene);			// 子节点根容器

			// 记录连接点坐标
			position = $linkPoint.position();
			mainPosition = $mainScene.position();

			// 绑定拖动
			$mmScene.bind({
				'mousedown': function (event) {
					var downT = mainPosition.top;
					var downL = mainPosition.left;
					var downY = event.clientY;
					var downX = event.clientX;

					$mmScene.bind('mousemove', function (event) {
						// 计算连接点、根节点组和子节点组的位置
						mainPosition.top = downT + event.clientY - downY;
						mainPosition.left = downL + event.clientX - downX;
						$mainScene.css(mainPosition);
					});
				},
				'mouseup mouseleave': function () {
					$mmScene.unbind('mousemove');
				},
				'mousewheel': function (event) {
					if (ctrlKey) {
			            event.preventDefault();
			            event.stopPropagation();
						if (window.event.deltaY < 0) {
							scale += scaleRatio;	// 放大
							scale = scale < scaleMax ? scale : scaleMax;
						} else {
							scale -= scaleRatio;	// 缩小
							scale = scale > scaleMin ? scale : scaleMin;
						}

						// 计算中心点位置
						centerX = mainPosition.left + $mainScene.width() / 2;
						centerY = mainPosition.top + $mainScene.height() / 2;

						// 缩放画布
						$mainScene.css('-webkit-transform', 'scale(' + (scale / 100) + ', ' + (scale / 100) + ')');
						showScaleText(scale);

						// 通过中心位置重新计算位置
						mainPosition.left = centerX - $mainScene.width() / 2;
						mainPosition.top = centerY - $mainScene.height() / 2;
					}
				}
			});
		} else {
			throw new Error('init mindMap error：not find \'hz-mm-scene\' css.');
		}

		/*
		 * 监听按键
		 */
		function listener (event) {
			ctrlKey = event.ctrlKey;
			$mmScene.css('overflow', ctrlKey ? 'hidden' : '');
		}

		window.addEventListener('keydown', listener, false);
		window.addEventListener('keyup', listener, false);
		window.addEventListener('mouseenter', function (event) {
			window.focus();
		}, false);
	};


	/*
	 * 设置属性
	 * @param data 节点数据={"id":"", "text":"", "className": ""}
	 */
	MindMap.prototype.setting = function (setting) {
		userSetting = setting;
	};


	/*
	 * 添加根节点
	 * @param data 节点数据={"id":"", "text":"", "className": ""}
	 * @param prepend 是否前置
	 */
	MindMap.prototype.addRoot = function (data, prepend) {
		var result = addChildNode(data, $rootBox, prepend);
		updateBox($rootBox);
		updateRootCss();
		return result;
	};


	/*
	 * 删除根节点
	 * @param id 节点ID
	 */
	MindMap.prototype.removeRoot = function (id) {
		var $mmNode = getNode(id);
			$mmNode && $mmNode.remove();

		removeData(id);
		updateBox($rootBox);
		updateRootCss();
	};


	/*
	 * 添加子节点
	 * @param data 节点数据={"pid":"", "id":"", "text":"", "className": ""}
	 * @param prepend 是否前置
	 */
	MindMap.prototype.addChild = function (data, prepend) {
		var $mmNode, $mmBox, result;

		// 查找父节点
		if (data.pid || data.pid == 0) {
			$mmNode = getNode(data.pid);
		}

		// 查看父节点下是否存在子节点容器
		if ($mmNode) {
			$mmBox = $mmNode.find('>div.hz-mm-box');

			if ($mmBox.length == 0) {
				$mmBox = $(mmBoxHTML).addClass('hz-mm-child').appendTo($mmNode);
			}
		} else {
			$mmBox = $childBox;
		}

		// 添加子节点
		result = addChildNode(data, $mmBox, prepend);
		updateBox($mmBox);
		updateParents($mmBox);
		updateChildCss();

		return result;
	};


	/*
	 * 获取节点的所有子节点
	 * @param id 节点ID
	 */
	MindMap.prototype.getNodesByPid = function (pid) {
		var $mmNode = getNode(pid);
		if ($mmNode) {
			return $mmNode.find('.hz-mm-node');
		} else {
			return [];
		}
	};


	/*
	 * 删除子节点
	 * @param id 节点ID
	 */
	MindMap.prototype.removeChild = function (id) {
		var $mmBox, $mmNode = getNode(id);

		if ($mmNode) {
			$mmBox = $mmNode.parent();
			$mmNode.find('.hz-mm-node').each(function (i) {
				removeData($(this).attr('mm-id'));
			});

			$mmNode.remove();

			removeData(id);
			updateBox($mmBox);
			updateParents($mmBox);
			updateChildCss();
		}
	};


	/*
	 * 选择节点
	 * @param 节点编号
	 */
	MindMap.prototype.selectNode = function (id) {
		selectNode(getNode(id));
	};


	/*
	 * 选择节点
	 * @param 节点编号
	 */
	MindMap.prototype.unselectNode = function (id) {
		var $mmNode = getNode(id);
			$mmNode && $mmNode.removeClass('selected');
	};


	/*
	 * 选择节点
	 * @param 节点编号
	 */
	MindMap.prototype.clear = function () {
		$rootBox.find('>.hz-mm-node').remove();
		$childBox.find('>.hz-mm-node').remove();
		mmNodesMap = {};

		updateBox($rootBox);
		updateRootCss();

		updateBox($childBox);
		updateChildCss();
	};


	/*
	 * 选择节点
	 * @param 节点编号
	 */
	MindMap.prototype.setEditStatus = function (status) {
		$$('.hz-mm-close').each(function (i) {
			$(this).css('display', status ? '' : 'none');
		});
	};








	/* =============================================================================================================== */
	/* =============================================内部私有方法定义=================================================== */
	/* =============================================================================================================== */

	function $$ (s) {
		return $mmScene.find(s);
	}

	
	/*
	 * 根据ID获取节点
	 * @param id 节点ID
	 */
	function getNode (id, callback) {
		var $nodes = $$('[mm-id="' + id + '"]');
		if ($nodes.length) {
			return $nodes.eq(0);
		} else {
			return null;
		}
	}


	/*
	 * 选择节点
	 */
	function selectNode ($mmNode) {
		if ($mmNode) {
			$$('.selected').removeClass('selected');
			$mmNode.addClass('selected');
		}
	}


	/*
	 * 显示缩放比例
	 * @param scale 比例
	 */
	function showScaleText (scale) {
		$scaleText.html(scale + '%').fadeIn(500);

		scaleTimerId && clearTimeout(scaleTimerId);
		scaleTimerId = setTimeout(function () {
			$scaleText.fadeOut(1000);
		}, 1500);
	}


	/*
	 * 添加子节点
	 * @param data 节点数据={"pid":"", "id":"", "text":"", "className": ""}
	 * @param $mmBox
	 */
	function addChildNode (data, $mmBox, prepend) {
		var $mmNode, $mmBody, $mmClose, showClose;		
		var showClose = getting('view.showClose');
		var mmId = data.id;

		if (mmNodesMap[mmId]) {
			console.warn('id is exsit!');
			return false;
		}

		// 存储数据
		mmNodesMap[mmId] = data;

		// 添加子节点
		$mmNode = $(mmNodeHTML)[prepend ? 'prependTo' : 'appendTo']($mmBox);
		$mmNode.attr('mm-id', mmId).addClass(data.className || '');
		$mmNode.find('.hz-mm-name').html(data.text);

		// 设置块的大小
		$mmBody = $mmNode.find('.hz-mm-body').attr('title', data.title || '');
		$mmClose = $mmBody.find('>.hz-mm-close');

		$mmBody.css({
			'width': $mmBody.css('min-width'),
			'height': $mmBody.css('min-height'),
		});

		// 事件注册
		$mmBody.on('click', function (event) {
			selectNode($(this).parent());
			clickTimerId && clearTimeout(clickTimerId);
			clickTimerId = setTimeout(emitEvent, getClickDelay(), 'onClick', this, event);
		});

		$mmBody.on('dblclick', function (event) {
			clickTimerId && clearTimeout(clickTimerId);
			emitEvent('onDblClick', this, event);
		});


		// 判断是否需要显示关闭按钮
		if (showClose) {
			if (data.showClose == false) {
				showClose = false;
			}
		} else {
			if (data.showClose == true) {
				showClose = true;
			}
		}

		if (showClose) {
			$mmClose.on('click', function (event) {
				emitEvent('onCloseClick', $(this).parent()[0], event);
			});
		} else {
			$mmClose.remove();
		}

		return true;
	};


	/*
	 * 执行事件
	 */
	function emitEvent (name, target, event) {
		var mmid = $(target).parent().attr('mm-id');
		var data = mmNodesMap[mmid];
		callback(name, event, mmid, data);
	}


	/*
	 * 删除节点数据
	 * @param id 节点ID
	 */
	function removeData (id) {
		delete mmNodesMap[id];
	}

	/*
	 * 更新根节点容器样式
	 */
	function updateRootCss () {
		$rootBox.css({
			'top': position.top - $rootBox.height() / 2, 
			'left': position.left - $rootBox.width()
		});
	}


	/*
	 * 更新节点
	 * @param $mmBox 
	 */
	function updateBox ($mmBox) {
		if ($mmBox) {
			// 查找所有子节点
			var mmNodes = $mmBox.find('>div.hz-mm-node');

			if (mmNodes.length > 1) {
				$mmBox.addClass('multiple');
				$mmBox.find('>.hz-mm-line').show();
				$mmBox.find('>.hz-mm-node.first').removeClass('first');
				$mmBox.find('>.hz-mm-node.last').removeClass('last');
				mmNodes.eq(0).addClass('first');
				mmNodes.eq(-1).addClass('last');
			} else {
				$mmBox.find('>.hz-mm-line').toggle(mmNodes.length != 0);
				$mmBox.removeClass('multiple');
			}
		}
	}


	/*
	 * 更新节点及节点容器
	 * @param $mmBox node节点下的box
	 */
	function updateParents ($mmBox) {
		var $parentNode = null;

		if ($mmBox) {
			$parentNode = $mmBox.parent();

			if ($parentNode.is('.hz-mm-node')) {
				var ph = $parentNode.css('min-height').replace('px', '') * 1;
				var ch = $mmBox.height();

				$parentNode.css('height', ph < ch ? ch : ph);
				$mmBox.css('margin-top', -ch / 2);

				updateParents($parentNode.parent());
			}
		}
	}


	/*
	 * 更新子节点容器
	 */
	function updateChildCss () {
		$childBox.css({
			'top': position.top - $childBox.height() / 2,
			'left': position.left
		});
	}










	/* ************************************************************************************************** */
	/* ********************************************** 属性设置 ******************************************* */
	/* ************************************************************************************************** */
	/*
	 * 获取setting的属性
	 */
	function getting (pkg) {
		var args = pkg.split('.');
		var value = null;
		var sysProperty = sysSetting;
		var setProperty = userSetting;

		while(args.length) {
			value = args.shift();
			if (value) {
				sysProperty = sysProperty[value];
				setProperty = setProperty[value];
			}
		}

		return setProperty != undefined ? setProperty : sysProperty;
	}


	/*
	 * 获取单击延迟时间，如果存在双击事件时返回clickDelay，否则返回0
	 */
	function getClickDelay () {
		var delay = getting('data.clickDelay');
		var dblClick = getting('callback.onDblClick');
		return dblClick == emptyFn ? 0 : delay;
	}


	/*
	 * 回调处理
	 */
	function callback (name, event, mmid, data) {
		var callback = getting('callback.' + name);
		if (typeof callback === 'function')
			callback(event, mmid, data);
	}




	return new MindMap();
});
