
/**
 * 罪犯信息面板
 */
define(function (require) {
	var InfoPanel = require('frm/component/InfoPanel');
	var hzEvent = require('frm/hz.event');


	function MapInfoPanel (parent) {
		this.parent = parent;
		this.infoPanels = [];
//		InfoPanel = parent.InfoPanel;
	}


	/*
	 * 添加罪犯信息面板
	 * @param params = {
	 * 		"name": "面板名称",
	 * 		"canvas": "面板画布",
	 * 		"position": {}
	 * }
	 */
	MapInfoPanel.prototype.add = function (params) {
        var infoPanel;

		if (!params.name) throw '缺少参数[name]';
		if (!params.canvas) throw '缺少参数[canvas]';
		if (!params.position) throw '缺少参数[position]';

        infoPanel = new InfoPanel({
        	name: params.name,
        	width: params.width || 80,
        	height: params.height || 40,
        	canvas: params.canvas,
        	userData: params.userData,
        	position: params.position
        });

        this.parent.hzThree.addScene(infoPanel);
        this.infoPanels.push(infoPanel);

        return infoPanel;
	}


	/*
	 * 清除所有面板
	 */
	MapInfoPanel.prototype.clear = function () {
		if (this.infoPanels) {
			while(this.infoPanels.length > 0) {
				this._remove(this.infoPanels.shift());
			}
		}
	}


	/*
	 * 删除模型面板
	 * @param panelObj 模型
	 */
	MapInfoPanel.prototype.removeByName = function (name) {
		for(var i = 0; i < this.infoPanels.length; i++) {
			panelObj = this.infoPanels[i];
			if (panelObj.name.indexOf(name) > -1) {
				this._remove(panelObj);
				this.infoPanels.splice(i--, 1);
			}
		}
	}


	/*
	 * 删除模型面板
	 * @param panelObj 模型
	 */
	MapInfoPanel.prototype.removeByObj = function (panelObj) {
		for(var i = 0; i < this.infoPanels.length; i++) {
			if (this.infoPanels[i] == panelObj) {
				this._remove(panelObj);
				this.infoPanels.splice(i--, 1);
			}
		}
	}


	/*
	 * 删除模型面板
	 * @param panelObj 模型
	 */
	MapInfoPanel.prototype._remove = function (panelObj) {
		var parent = null;
		if (panelObj) {
			if (parent = panelObj.parent) {
				parent.remove(panelObj);
			}
			panelObj.dispose();
			panelObj = undefined;
		}
	}

	return MapInfoPanel;
});