/**
 * ===============================树数据转换插件===============================
 * setting对象说明：{
 * 		"idKey": "指定树的ID字段，默认id",
 * 		"pidKey": "指定树的父ID字段，默认pid",
 * 		"nameKey": "指定树的显示文本字段，默认name",
 * 		"fields": {
 * 			pid: '节点父ID的字段名，默认pid',
 * 			id: '节点ID字段名，默认id',
 * 			name: '节点名称的字段名，默认name',
 * 			level: '节点等级字段名，默认level',
 * 			attributes: '节点属性的字段名，默认attributes',
 * 			children: '节点子集的字段名，默认children',
 * 			isRoot: '节点是否根节点字段名，默认isRoot',
 * 			isLeaf: '节点是否末节点字段名，默认isLeaf'
 * 		},
 * 		"before": "在格式化之前的处理函数，函数有1个参数：data：原数据，函数返回处理后的新数据",
 * 		"formatter": "格式化器，函数有1个参数：node-转换后的节点对象",
 * 		"success": "格式化成功后处理函数，函数有2个参数：tree-参考tree说明, maps-参考maps说明"
 * }
 * 
 * 
 * 
 * ====================【格式化后的节点对象结构说明】=====================
 * 这里描述的是默认格式化时返回的结构，如果有指定setting.fields则按指定的结构返回：
 * node = {
 * 		"pid": "节点父ID",
 * 		"id": "节点ID",
 * 		"name": "节点显示文本",
 * 		"level": "节点等级，从1开始"
 * 		"attributes": "节点自定义属性，除id,pid,text以外的其它数据属性，格式:{...}",
 * 		"children": "子节点集合，格式：[node1,node2,...,nodeN]",
 * 		"isRoot": "是否根节点，true是，没有此属性或其它值否",
 * 		"isLeaf": "是否末节点，true是，没有此属性或其它值否"
 * }
 *
 *
 *
 * ====================【tree对象说明：】===================
 * tree = [node1, node2, ..., nodeN]
 * tree数组类的对象结构参考上面的node结果说明
 * 
 * 
 * 
 * ====================【maps对象说明】====================
 * maps = {
 * 		"nodeId1": node1,
 * 		"nodeId2": node2,
 * 		...,
 * 		"nodeIdN": nodeN,
 * }
 */

define(function (require) {
	// 默认配置
	var _default = {
		rootlvl: 1,		// 根节点默认等级
		fields: {
			pid: 'pid',
			id: 'id',
			name: 'name',
			level: 'level',
			attributes: 'attributes',
			children: 'children',
			isRoot: 'isRoot',
			isLeaf: 'isLeaf'
		}
	};

	/**
	 * 将数据格式为树对象
	 * 
	 */
	function _toTree (data, setting) {
		var parent = null;		// 父节点
		var node = null			// 节点对象
		var temp = null;		// 临时对象
		var maps = {};			// 节点索引：用来快速查找节点
		var pids = {};			// 临时索引：用来判断是否是末节点
		var roots = [];			// 根节点菜单集合
		var nodes = [];			// 节点排序

		// 检查缺省参数
		setting = setting || {};
		data = data || [];

		// 初始化格式化字段模板
		var fields = _default.fields;
		if (setting.fields) {
			for (var key in fields) {
				fields[key] = setting.fields[key] || fields[key];
			}
		}

		// 初始化核心字段映射
		var _id = setting.idKey || fields.id;
		var _pid = setting.pidKey || fields.pid;
		var _name = setting.nameKey || fields.name;
		var _attributes = fields.attributes;
		var _children = fields.children;
		var _filter = {};

		// 添加属性时过滤的字段
		_filter[_id] = true;
		_filter[_pid] = true;
		_filter[_name] = true;

		// 格式化之前执行的函数
		var before = setting.before;
		if (typeof before == 'function'){
			data = before(data) || [];
		}

		// 格式化数据并添加索引
		var btime = _getTime();
		for(var i = 0, I = data.length; i < I; i++) {
			temp = data[i];

			// 创建对象并设置基础属性
			node = {};
			node[fields.pid] = temp[_pid];
			node[fields.id] = temp[_id];
			node[fields.name] = temp[_name];
			node[fields.level] = 1;
			node[fields.attributes] = {};
			node[fields.children] = [];
			nodes.push(node);

			// 添加自定义属性
			for (var key in temp) {
				_filter[key] || (node[fields.attributes][key] = temp[key]);
			}

			maps[node[fields.id]] = node;	// 添加索引（无序）
			pids[node[fields.pid]] = true;	// 用于末节点检查
		}
		var time1 = _getTime();
		_log('log', '添加节点索引耗时：' + (time1 - btime));

		// 将节点转换为树结构
		while (nodes.length) {
			temp = nodes.shift();
			parent = maps[temp[fields.pid]];// 获取父节点

			if (parent) {
				temp.parent = parent;
				// 节点ID在父节点集合类找不到则表示该节点为末节点
				pids[temp[fields.id]] || (temp[fields.isLeaf] = true);
				parent[fields.children].push(temp);
			} else {
				// 没有父节点的节点设置为根节点
				temp[fields.isRoot] = true;
				roots.push(temp);
			}
		}
		var time2 = _getTime();
		_log('log', '转换树结构耗时：' + (time2 - time1));

		// 检查自定义格式化器
		var formatter = setting.formatter;
		if (typeof formatter != 'function') {
			formatter = function () {};
		}

		// 格式化数据并设置节点等级
		_formatter(roots, fields.level, 1, formatter);
		_log('log', '格式化节点耗时：' + (_getTime() - time2));

		// 返回结果
		var success = setting.success;
		if (typeof success == 'function'){
			success(roots, maps);
		}
	}

	/**
	 * 格式化节点
	 * @param nodes 节点集合
	 * @param level 等级
	 */
	function _formatter (nodes, lvlKey, level, formatter) {
		var node = null;
		for(var i = 0, I = nodes.length; i < I; i++) {
			node = nodes[i];
			node[lvlKey] = level;
			formatter(node);
			_formatter(node.children || [], lvlKey, level + 1, formatter);
		}
	}

	/**
	 * 获取当前时间
	 */
	function _getTime () {
		return (new Date()).getTime();
	}

	/**
	 * 日志打印
	 * @param lvl 日志级别：log|info|warn|error
	 * @param msg 日志消息
	 */
	function _log(lvl, msg) {
		console[lvl]('树模块 --> ' + msg);
	}



	/** 
	 * ######菜单模块注册######
	 */
	try {
		console.log('模块注册 --> 树模块注册完成...');
		return {
			'toTree': _toTree
		};
	} catch (e) {
		console.log('模块注册 --> 树模块注册异常...', e);
	}
});