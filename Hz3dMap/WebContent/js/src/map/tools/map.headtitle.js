/**
 * 
 */
define(function(require){
	var $ = require("jquery");
	var hzEvent = require('frm/hz.event');

	var nodeHTML = '<span class="mht-node"></span>';

	/*
	 * 地图顶部信息对象
	 */
	function MapHeadTitle () {
		$(window.top.document.body).append('<div class="map-head-title map-base-bgc" style="display:none;"></div>');
		var jqMHT = this;
		this.jqDom = $('div.map-head-title');

		this.visible = function () {
			if (this.jqDom.find('>span.mht-node').length) {
				this.jqDom.show();
			} else {
				this.jqDom.hide();
			}
		}
	}


	/*
	 * 添加信息
	 * @param data = {id:'', html:'', index:0}
	 * @param isUpdate 是否更新 true是 | false否
	 */
	MapHeadTitle.prototype.add = function (data, isUpdate) {
		var jqNode = $(nodeHTML).html(data.html || '').attr('mht-id', data.id || '');
		var jqSpan = null;
		var index = data.index;

		if (index != undefined) {
			jqSpan = this.jqDom.find('>span:eq(' + index + ')')
		}

		if (this.getNodeById(data.id).length == 0) {
			if (jqSpan && jqSpan.length) {
				jqSpan.before(jqNode);
			} else {
				this.jqDom.append(jqNode);
			}

			this.visible();

			return jqNode;
		} else {
			if (isUpdate) {
				return this.update(data.id, data.html);
			} else {
				console.error('[id]重复!');
			}
		}
	}


	/*
	 * 获取节点
	 * @param id 
	 */
	MapHeadTitle.prototype.getNodeById = function (id) {
		return this.jqDom.find('[mht-id=' + id + ']');
	}


	/*
	 * 删除信息
	 * @param id 
	 * @param html
	 */
	MapHeadTitle.prototype.update = function (id, html) {
		return this.getNodeById(id).html(html);
	}


	/*
	 * 删除信息
	 * @param id 
	 */
	MapHeadTitle.prototype.remove = function (id) {
		var jsNode = this.getNodeById(id).remove();
		this.visible();
		return jsNode;
	}


	// 针对类似frame框架的模型化处理
	try {
		// 如果已经初始化则直接返回对象
		var hz = window.top.hz;

		if (hz) {
			if (hz.mapHeadTitle) {
				console.log('headtitle.extend：引用顶层父级HeadTitleExtend对象...');
				return hz.mapHeadTitle;
			}
		} else {
			hz = window.top.hz = {};
		}

		hzEvent.init('map.headtitle', hz.mapHeadTitle = new MapHeadTitle());
		console.log('初始化三维地图顶部信息扩展模块...');

		return hz.mapHeadTitle;
	} catch (e) {
		console.log('初始化三维地图顶部信息扩展模块...', e);
	}
});