/**
 * 
 * 检索参数对象说明：options=对象|查询值
 * options = 查询值，相当于options对象的value属性
 * options = {
 * 		"mode": "显示模式：tree树结构（默认）、list列表",
 * 		"open": "是否展开：true是（默认）、false否；mode='tree'时有效",
 * 		"value": "查询值",
 * 		"query": "查询器：自定义查询匹配条件；
 * 				  参数：node-节点对象, value-检索的值；
 * 				  结果：true匹配，false不匹配，默认按显示文本模糊匹配",
 * 		"result": "查询结果集（内部属性），将所有匹配的节点存在结果集"
 * }
 */
define(function (require) {
	var __counter = 1;	// 计数器
	var __TID = '_TID';


	/**
	 * ************************ zTree控件扩展对象 ************************
	 */
	function ZTreeExtend (scrollId, treeId, zNodes, setting) {
		var btime = __getTime();
		this._zPitch = new ZPitch(this);
		this._zSearch = new ZSearch(this);

		// 格式化树节点数据
		__counter = 1;
		__fmtTree(zNodes, function (node) {
			node[__TID] = 'T_' + __counter++;
		});
		console.log('ZTreeExtend：格式化数据 --> 耗时：' + (__getTime() - btime) + ', 数据大小：', __counter);

		// 初始化树控件
		btime = __getTime();
		__initZTree(treeId, setting, zNodes);
		console.log('ZTreeExtend：初始化树控件 --> 耗时：' + (__getTime() - btime));

		// 初始化属性
		this.zTree = __getZTreeObj(treeId);
		this.zTreeId = treeId;		// 树控件ID
		this.zNodes = zNodes;		// 树控件初始值（原始值）
		this.rNodes = zNodes;		// 树控件重新加载的数据
		this.setting = setting;		// 树控件的属性对象
		this.scrollId = scrollId;	// 滚动面板ID
	}

	/**
	 * 重新加载树控件数据
	 * @param rNodes 重新加载的数据
	 */
	ZTreeExtend.prototype.reload = function (rNodes) {
		__initZTree(this.zTreeId, this.setting, rNodes);
		this.zTree = __getZTreeObj(this.zTreeId);
		this.rNodes = rNodes;
	};

	/**
	 * 定位于
	 * @param key	定位匹配的字段名
	 * @param args	定位匹配的值：单个直接传值、多个值格式[{"value":"值", "pitch":"是否定位true|false，多个表示pitch的只取第一个"}]
	 * @param top	顶部距离，默认0
	 * @param speed 定位的持续效果，默认0
	 */
	ZTreeExtend.prototype.pitch = function (key, args, top, speed) {
		this._zPitch.pitch(key, args, top, speed);
	};

	/**
	 * 检索匹配
	 * @param options 参考检索参数对象说明
	 */
	ZTreeExtend.prototype.search = function (options) {
		return this._zSearch.search(options);
	};

	/**
	 * 折叠、展开树
	 * @param flag true展开、false折叠
	 */
	ZTreeExtend.prototype.expand = function (flag) {
		__fmtTree(this.rNodes, function (node) {
			node.open = flag;
		});
		this.reload(this.rNodes);
	};


	/**
	 * ************************ 定位树节点对象 ************************
	 */
	function ZPitch (parent) {
		this.p = parent;
		this.filterValues = null;
		this.filterZNodes = null;
		this.pitchVal = null;
		this.pitchZNode = null;
	}

	/**
	 * 定位于
	 * @param key	定位匹配的字段名
	 * @param args	定位匹配的值：单个直接传值、多个值格式[{"value":"值", "pitch":"是否定位true|false，多个表示pitch的只取第一个"}]
	 * @param top	顶部距离，默认0
	 * @param speed 定位的持续效果，默认0
	 */
	ZPitch.prototype.pitch = function (key, args, top, speed) {
		top = top || 0;
		speed = speed || 0;

		try {
			var time1 = __getTime();
			if (this._fmatter(args)) {
				this._search(this.p.zNodes, key);

				if (this.pitchZNode) {
					top = __getTop(this.pitchZNode.tId) - __getTop(this.p.zTreeId) - top;
					top = Math.round(top);

					console.log('top -->', top);
					_$(this.p.scrollId).scrollTop(top);
					_$(this.p.scrollId).scrollLeft(0);
				}
			}
			var time2 = __getTime();
			console.log('ZPitch --> 定位查找耗时：' + (time2 - time1));
		} catch (e) {
			console.error('ZPitch.pitch：', e);
		}
	};

	/**
	 * 格式化定位匹配的值
	 * @param args	定位匹配的值
	 * @returns {Boolean}
	 */
	ZPitch.prototype._fmatter = function(args) {
		try {
			this.filterValues = '';
			this.filterZNodes = [];
			this.pitchVal = null;
			this.pitchZNode = null;

			if (args instanceof Array) {
				var temp = null;
				for (var i = 0, I = args.length; i < I; i++) {
					temp = args[i];
					this.filterValues += __fmtVal(temp.value);
					this.pitchVal || (this.pitchVal = temp.pitch ? temp.value : '');
				}
			} else if (typeof args == 'string'){
				this.filterValues = __fmtVal(args);
				this.pitchVal = args;
			} else {
				console.error('ZPitch.fmatter --> [args]参数类型错误，只能是Array或String类型!');
				return false;
			}
		} catch (e) {
			console.error('ZPitch.fmatter：', e);
			return false;
		}
		return true;
	};

	/**
	 * 搜索定位的对象(迭代处理)
	 * @param key
	 * @param args
	 * @returns {Boolean}
	 */
	ZPitch.prototype._search = function (nodes, key) {
		try {
			var zNode = null;
			var children = null;
			var tNode = null;
			var tVal = null;

			for (var i = 0, I = nodes.length; i < I; i++) {
				tNode = nodes[i];
				children = tNode.children;

				// 搜索到节点之后使该节点的父节点展开
				if (children && children.length) {
					if (this._search(children, key)) {
						this.p.zTree.expandNode(this._getZNode(tNode), true);
					}
				} else {
					// 查找到第一个定位对象之后不再查找其他的要定位对象，但是会继续匹配查找的值
					tVal = tNode[key] || tNode.attributes[key];

					if (this.filterValues.indexOf(__fmtVal(tVal)) > -1) {
						if (tVal == this.pitchVal) {
							zNode = this._getZNode(tNode);
							this.filterZNodes.push(zNode);
							this.pitchZNode || (this.pitchZNode = zNode);
						}
						return true;
					}
				}
			}
		} catch(e) {
			console.error('ZPitch.search：', e);
			return false;
		}
	};

	/*
	 * 获取zNode对象
	 */
	ZPitch.prototype._getZNode = function (data) {
		return this.p.zTree.getNodeByParam(__TID, data._TID);
	};





	/**
	 * ************************ 检索过滤的对象 ************************
	 */
	function ZSearch (parent) {
		this.p = parent;
	}

	/**
	 * 检索匹配
	 * @param options 	参考检索参数对象说明
	 */
	ZSearch.prototype.search = function (options) {
		var btime = __getTime();
		var value = null;
		var zNodes = [];

		// 类型容错处理
		if (typeof options == 'string') {
			value = options;
			options = {'value': value};
		} else {
			value = options.value;
		}

		// 检查参数
		options = options || {};						// 查询参数对象检测
		options.result = [];							// 查询结果集list
		options.value = (value || '').trim();			// 查询检索值
		options.mode || (options.mode = 'tree');		// 查询模式：tree|list
		options.open || (options.open = true);			// 查询展开：tree|false
		options.query || (options.query = __query);		// 查询器
		console.log('ZSearch.search：搜索原始值[' + value + ']，处理后的值[' + options.value + ']');

		// 条件判断
		if (options.value) {
			// 查询节点
			btime = __getTime();
			this._query(this.p.zNodes, zNodes, options);
			console.log('ZSearch.search：搜索节点 --> 耗时：' + (__getTime() - btime));

			// 将检索的数据重新初始化为树控件
			btime = __getTime();
			this.p.reload(zNodes);
			console.log('ZSearch.search：处理节点 --> 耗时：' + (__getTime() - btime) + ', 搜索结果：' + options.result.length + '\n');
		} else {
			this.p.reload(this.p.zNodes);
		}
		return options.result;
	};

	/**
	 * 查询并处理节点
	 * @param oNodes 	原节点集合
	 * @param nNodes 	新节点集合
	 * @param options 	参考检索参数对象说明
	 */
	ZSearch.prototype._query = function (oNodes, nNodes, options) {
		var i = 0, I = oNodes.length;
		var oTemp = null;			// 旧节点对象
		var oChildren = null;			// 
		var nTemp = null;			// 新节点对象
		var nChildren = null;

		while (i < I) {
			oTemp = oNodes[i++];
			oChildren = oTemp.children;
			nTemp = __copy(oTemp);
			nChildren = [];

			// 先查询子类
			if (oChildren && oChildren.length) {
				this._query(oChildren, nChildren, options);
			}

			// 判断是否存在子类
			if (nChildren.length) {
				nTemp.open = options.open;
				nTemp.children = nChildren;
			}

			// 如果自定义查询器则使用它，反之默认按名称模糊匹配
			if (options.query(oTemp, options.value)) {
				options.result.push(nTemp);
				nNodes.push(nTemp);
			} else {
				// 展现方式为tree时，显示子类的父节点
				if (options.mode == 'tree') {
					nChildren.length && nNodes.push(nTemp);
				}
			}
		}
	};

	/**
	 * 默认查询匹配的条件
	 * @param node	节点
	 * @param value	匹配值
	 */
	function __query (node, value) {
		return node.name.indexOf(value) > -1;
	}

	/*
	 * 初始化树控件
	 */
	function __initZTree (treeId, setting, zNodes) {
		$.fn.zTree.destroy(treeId);
		$.fn.zTree.init(_$(treeId), setting, zNodes);
	}

	/*
	 * 获取树控件对象
	 */
	function __getZTreeObj (treeId) {
		return $.fn.zTree.getZTreeObj(treeId);
	}

	/**
	 * 格式化树
	 * @param nodes	节点数据
	 * @param fmatter 自定义栅格处理
	 */
	function __fmtTree (nodes, fmatter) {
		var temp = null;
		var children = null;

		// 给所有的树节点添加自定义标识，用于内部查找处理
		for (var i = 0, I = nodes.length; i < I; i++) {
			temp = nodes[i];
			fmatter(temp);	// 自定义格式化

			if (temp.children) {
				__fmtTree(temp.children, fmatter);
			}
		}
	}

	/*
	 * 复制除children的所有属性
	 */
	function __copy (node) {
		var temp = {};
		for(var name in node) {
			name == 'children' || (temp[name] = node[name]);
		}
		return temp;
	}

	/*
	 * 格式化值
	 */
	function __fmtVal (val) {
		return '[' + val + ']';
	}

	/*
	 * 获取滚动条的顶部距离
	 */
	function __getTop (id) {
		return _$(id).position().top;
	}

	/*
	 * 获取时间
	 */
	function __getTime () {
		return (new Date()).getTime();
	}

	/*
	 * 创建jQuery对象根据ID
	 */
	function _$(id) {return $('#' + id);}



	/*
	 * 注入模块方法
	 */
	try {
		// 针对类似frame框架的模型化处理
		var hz = window.top.hz;

		if (hz) {
			if (hz.ztreeExtend) {
				//console.error('hz.ztree.extend：引用顶层父级ZTreeExtend对象失败...');
				//return hz.ztreeExtend;
			}
		} else {
			hz = window.top.hz = {};
		}

		hz.ztreeExtend = {
			'create': function (scrollId, treeId, zNodes, setting) {
				return new ZTreeExtend(scrollId, treeId, zNodes, setting);
			}
		};
		console.log('初始化ZTreeExtend对象成功!');

		return hz.ztreeExtend;
	} catch (e) {
		console.error('初始化ZTreeExtend对象失败...');
	}
});