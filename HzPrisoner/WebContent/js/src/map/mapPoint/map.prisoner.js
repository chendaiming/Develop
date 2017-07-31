
/**
 * 罪犯信息面板
 */
define(function (require) {
	var mapHandle = require('hz/map/map.handle'),
		hzEvent = require('frm/hz.event');

	var emptyFunc = function () {};

	function PrisonerPanel () {
		var self = this;

		this.editStatus = false;
		this.editCallback = null;
		this.editHandle = function (event) {
			if (mapHandle.handleStatus == mapHandle.EDITMODEL && self.editStatus) {
				if (window.top.event.ctrlKey) {
					self.editCallback(event.data);
				}
			} else {
				self.disabledEdit();
			}
		};
	}


	/*
	 * 开启编辑（ 开启编辑之后使用Ctrl+点击触发事件）
	 */
	PrisonerPanel.prototype.enabledEdit = function (callback) {
		if (!this.editStatus) {
			this.editStatus = true;
			this.editCallback = callback || emptyFunc;
			mapHandle.setHandleStatus(mapHandle.EDITMODEL);
			mapHandle.hzThree.on(mapHandle.hzThree.HzEvent.PICK_UP_POINT, this.editHandle);
			console.log('已开启罪犯信息面板编辑...');
		} else {
			console.warn('已经开启过面板编辑，不能重复操作!');
		}
	}


	/*
	 * 关闭编辑
	 */
	PrisonerPanel.prototype.disabledEdit = function () {
		if (this.editStatus) {
			this.editStatus = false;
			this.editCallback = null;
			mapHandle.setHandleNormal();
			mapHandle.hzThree.off(mapHandle.hzThree.HzEvent.PICK_UP_POINT, this.editHandle);
			console.log('已关闭罪犯信息面板编辑...');
		} else {
			console.warn('未开启模型组件编辑，不能进行关闭操作!');
		}
	}


	/*
	 * 添加罪犯信息面板
	 * @param params = {
	 * 		"id": "ID",
	 * 		"code": "罪犯编号（必填）",
	 * 		"name": "罪犯姓名（必填）",
	 * 		"image": "罪犯照片（必填）",
	 * 		"position": {},
	 * 		"width": "面板宽度（可选，默认80）",
	 * 		"height": "面板高度（可选，默认40）"
	 * }
	 * 
	 * @param callback 回掉函数，函数接收一个参数：panelObj - 添加的面板对象
	 */
	PrisonerPanel.prototype.add = function (params, callback) {
		if (!params.id) throw '请输入编号[id]';
		if (!params.code) throw '请输入编号[code]';
		if (!params.name) throw '请输入名称[name]';
		if (!params.image) throw '请输入图片路径[image]';
		if (!params.position) throw '请输入面板点位[position]';
		if (typeof callback != 'function') callback = function () {};

		var canvas = document.createElement('canvas');
        var cWidth = canvas.width = 512;
        var cHeight = canvas.height = 256;
        var context = canvas.getContext('2d');
        var image = new Image();	// 图片
        var self = this;

        // 绘制边框
        context.beginPath();
        context.moveTo(2, 2);           // 创建开始点
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineTo(510, 2);
        context.lineTo(510, 246);
        context.lineTo(272, 246);
        context.lineTo(256, 254);
        context.lineTo(240, 246);
        context.lineTo(2, 246);
        context.lineTo(2, 2);
        context.strokeStyle = 'rgba(0,255,255,0.8)';
        context.stroke();                // 进行绘制

        context.beginPath();
        context.moveTo(4, 4);
        context.lineTo(508, 4);
        context.lineTo(508, 244);
        context.lineTo(272, 244);
        context.lineTo(256, 252);
        context.lineTo(240, 244);
        context.lineTo(4, 244);
        context.lineTo(4, 4);

        context.fillStyle = 'rgba(31,49,69,.9)';
        context.fill();

        context.strokeStyle = 'rgba(31,49,69,.9)';
        context.stroke();                // 进行绘制

        // 绘制文字
        context.font = "26px 微软雅黑";
        context.textAlign = "left";
        context.fillStyle = '#FFFFFF';
        context.fillText('编号：' + (params.code || ''), cWidth / 2 - 10, 50);
        context.fillText('姓名：' + (params.name || ''), cWidth / 2 - 10, 95);
        context.fillText('床号：' + (params.bedCode || ''), cWidth / 2 - 10, 140);

        function drawPanel () {
        	callback(mapHandle.infoPanel.add({
            	name: fmtName(params.id),
            	width: params.width || 80,
            	height: params.height || 40,
            	canvas: canvas,
            	userData: params,
            	position: params.position
            }));
        }

        if (params.image) {
        	// 绘制图片
            image.src = params.image; // 设置图片源地址
            image.onload = function () {
                context.drawImage(image, 0, 0, image.width, image.height, 10, 10, cWidth / 2 - 30, cHeight - 30);
                drawPanel();
            }
            image.onerror = function () {
            	console.error('罪犯信息面板加载图片失败...');
            	drawPanel();
            }
        } else {
        	drawPanel();
        }
	}


	/*
	 * 清除所有面板
	 */
	PrisonerPanel.prototype.clear = function () {
		mapHandle.infoPanel.clear();
	}


	/*
	 * 删除模型面板
	 * @param panelObj 模型
	 */
	PrisonerPanel.prototype.removeById = function (id) {
		mapHandle.infoPanel.removeByName(fmtName(id));
	}


	/*
	 * 删除模型面板
	 * @param panelObj 模型
	 */
	PrisonerPanel.prototype.removeByObj = function (panelObj) {
		mapHandle.infoPanel.removeByObj(panelObj);
	}


	function fmtName (val) {
		return 'prisoner_' + val;
	}


	return PrisonerPanel;
});