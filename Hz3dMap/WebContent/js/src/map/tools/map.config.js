/**
 * 地图数据配置对象
 */
define(function(require) {
//	var configHtml = '<div class="map-config"><a class="map-base-bgc map-config-btn" title="地图数据控制显示列表">显示控制</a><ul class="map-config-list map-base-bgc"></ul></div>';
	var configHtml = '<div class="map-config" oncontextmenu="return false;"><ul class="map-config-list"></ul></div>';
	var labelTypeRoom = 2;


	/*
	 * 依赖模块引入
	 */
	var localStorage = require('frm/localStorage');
	var hzEvent = require('frm/hz.event');
	var db = require('frm/hz.db');


	/*
	 * 保存配置
	 */
	function setConfig (id, checked) {
		localStorage.setItem('MAP_CONFIG_'+ id, checked);
	}


	/*
	 * 获取配置
	 */
	function getConfig (id) {
		var config = localStorage.getItem('MAP_CONFIG_'+ id);
		if (config != undefined) {
			return config == 'true';
		}
	}


	/*
	 * 地图配置对象
	 */
	function MapConfig (parent) {
		this.parent = parent;
		this.configMap = {}; 	// 配置映射对象
		this.hasInit = false;
		this.waitAddList = [];		// 等待初始化的功能
		this.callbackPools = {};	// 各配置的回调事件映射
		this.$ul = null;

		this.init = function () {
			if (this.hasInit == false && parent.mapId) {
				this.hasInit = true;

				var $hzMap = $('#' + parent.mapId);
				var $config = $(configHtml).appendTo($(window.top.document.body));
				var $ul = this.$ul = $config.find('>ul');
				var isAnimate = true;
					hasHidden = true;


				/*
				 * 添加显示控制的右侧按钮及事件处理
				 */
				hzEvent.load('hz.rightnav', function (rightNav) {
					var jqNav = rightNav.add('MAP.CONFIG.NAV', '显示控制', 'map-config-btn', 0);
					if (jqNav) {
						jqNav.on('mouseup', function () {
							$config.addClass('show');
							event.stopPropagation();
						});
					}
				});


				// 点击配置面板时阻止$hzMap的点击事件
				$config.on('mouseup', function () {
					event.stopPropagation();
				});

				hzEvent.bind(window.top, 'mouseup', function (event) {
					$config.removeClass('show');
				});


				/*
				 * 添加显示选项
				 */
				this._add('STATS001', '显示运行状态', function (id, checked) {
					parent.mapStats.showPanel(id, checked);
				});

				this._add('CONSOLE001', '显示系统消息', function (id, checked) {
					if (checked) {
						$('div.map-console').fadeIn(500);
					} else {
						$('div.map-console').fadeOut(500);
					}
				});

				/*
				this._add('MESH001', '显示寻路网格', function (id, checked) {
					if (parent.curViewMenu) {
						var wayObj = parent.Wayfinding.findWay(parent.curViewMenu.id);
						if (wayObj) {
							wayObj.mesh.visible = checked;
						} else {
							checked && parent.console(parent.curViewMenu.name + '视角下没有寻路网格，无法显示!');
						}
					}
				});
				*/

				while(this.waitAddList.length) {
					this._add.apply(this, this.waitAddList.shift());
				}

				/*
				 * 添加操作说明
				 */
				hzEvent.load('hz.handledesc', function (handleDesc) {
					handleDesc.add('HANDLE.001', '左键双击', '在地图上双击鼠标左键可以快速定位到点击的位置!');
					handleDesc.add('HANDLE.002', '右键双击', '在地图上双击鼠标右键可以让地图围绕中心点旋转!');
				})

				console.log('初始化系统功能列表...');
			}		
		};

		this.getConfig = getConfig;
	}


	/*
	 * 添加配置
	 * @param id	配置编号
	 * @param name	配置名称
	 * @param click 点击事件，接受2个参数：id-配置编号, checked-是否已选择true/false
	 * @param checked 是否默认选中：true 是 / false 否
	 */
	MapConfig.prototype.add = function (id, name, click, checked) {
		// 初始化
		if (this.hasInit == false) {
			this.waitAddList.push([id, name, click, checked]);
		} else {
			this._add(id, name, click, checked);
		}
	}


	/*
	 * 添加配置
	 * @param id	配置编号
	 * @param name	配置名称
	 * @param click 点击事件，接受2个参数：id-配置编号, checked-是否已选择true/false
	 * @param checked 是否默认选中：true 是 / false 否
	 */
	MapConfig.prototype._add = function (id, name, click, checked) {
		try {
			var thiz = this;
			if (this.hasInit == true) {
				// 添加节点
				if (this.$ul.find('#' + id).length == 0) {
					this.callbackPools[id] = click;

					var $li = $('<li id="' + id + '">' + name + '</li>').on({
						'click': function () {
							var checked = !$(this).hasClass('checked');
							if (checked) {
								$(this).addClass('checked');
							} else {
								$(this).removeClass('checked');
							}
							setConfig(this.id, checked);
//							click(this.id, checked);
							thiz.callbackPools[this.id](this.id, checked);
						}
					}).appendTo(this.$ul);

					var config = getConfig(id);
					if (config == undefined) {
						if (checked != undefined) {
							$li.addClass(checked ? '': 'checked').click();
						}
					} else {
						$li.addClass(config ? '': 'checked').click();
					}

				} else {
					if (this.$ul.find('#' + id).html() == name) {
						return '配置编号和名称已存在!';
					} else {
						return '配置编号已存在!';
					}
				}
				return '';
			} else {
				return '配置对象还未初始化完成，无法添加!';
			}
		} catch (e) {
			console.error(e);
		}
	}


	/*
	 * 删除节点
	 * @param id 配置编号
	 */
	MapConfig.prototype.remove = function (id) {
		if (this.hasInit) {
			this.$ul.find('#' + id).remove();
		}
	}


	/*
	 * 选择节点
	 * @param id		节点的编号
	 * @param checked	是否选中
	 * @param isEmit	是否触发事件（回调）
	 */
	MapConfig.prototype.checked = function (id, checked, isEmit) {
		var $node = this.$ul.find('#' + id);
		if ($node.length) {
			if (checked) {
				$node.addClass('checked');
			} else {
				$node.removeClass('checked');
			}

			if (isEmit) {
				setConfig(id, checked);
				this.callbackPools[id](id, checked);
			}
		}
	}

	return MapConfig;
})