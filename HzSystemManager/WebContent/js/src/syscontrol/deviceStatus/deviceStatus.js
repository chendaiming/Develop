define(function(require){
	var vue = require('vue'),
		ztree = require('ztree'),
		db = require('frm/hz.db'),
		user = require('frm/loginUser'),
		treeUtil = require('frm/treeUtil'),
		hzDrag = require('frm/hz.drag'),
		mindMap = require('frm/hz.mindmap'),
		message = require('frm/message');

	var $handleStatus = $('span.handle-status');
	var $dvcTypePanel = $('.dvc-type-panel');
	var $linkDvcPanel = $('.link-dvc-panel');
	var $hzmmScene = $('div.hz-mm-scene');

	// 报警设备的查询SQL
	var alarmDvcSql = {
		'1': 'select_camera_alarm_for_alarm_plan',
		'2': 'select_door_alarm_for_alarm_plan',
		'4': 'select_broadcast_alarm_for_alarm_plan',
		'6': 'select_network_alarm_for_alarm_plan',
		'7': 'select_power_network_alarm_for_alarm_plan',
		'10':'select_talkback_alarm_for_alarm_plan',
		'15': 'select_rfid_alarm_for_alarm_plan',
		'17': 'select_wireless_alarm_master_for_alarm_plan'	// 无线报警主机
	};

	// 默认显示的报警设备树的索引
	var defaultShowAlarmDvc = [0,1,2,3,5,9];

	// 关联设备的查询SQL
	var linkDvcSql = {
		'1': 'select_cameras_for_alarm_plan',
		'2': 'select_door_for_alarm_plan',
		'4': 'select_broadcast_for_alarm_plan'
	};

	var NODETYPE = {
		ALERTOR: 1,
		PLUS: 2,
		LINKTYPE: 3,
		LINKDVC: 4
	};

	var recordNode = null;	// 保存之后的zNode，用来做刷新后定位的
	var ctrlKey = false;
	var clickTimerId = null;


	/* ****************************************************************************************************************** */
	/* ***********************************************【报警设备树设置】  ************************************************* */
	/* ****************************************************************************************************************** */
	// TODO: setting报警设备树设置
	var setting = {
		data: {
			simpleData:{
				enable:true,
				pIdKey:'pid',
				idKey:'rid'
			}
		},
		check: {
			enable: true
		},
		view: {
			selectedMulti: false
		},
		callback: {

			/*
			 * 点击节点复选框之前
			 */
			beforeCheck: function (treeId, treeNode) {
				if (att.selectedNode && att.hasLinked(att.selectedNode)) {
					if (att.selectedNode != treeNode && !att.isEdit) {
						att.showMsg('查询状态下无法勾选其它报警设备!');
						return false;
					}
				}
				return true;
			},

			/*
			 * 选择节点
			 */
			onCheck: function (event, treeId, treeNode) {
				if (treeNode.checked) {
					if (att.isEdit) {									// 编辑状态下：只选择未配置的报警设备
						mmt.addAlertor(treeNode, true, true);
					} else {
						if (att.isAdd) {								// 新增状态下：选择未配置的报警器同时选中
							mmt.addAlertor(treeNode, true, true);
						} else {
							att.enabledEdit(treeNode);					// 未新增状态下，激活新增（因为已配置的是没有复选框的）
						}
					}
				} else {
					if (att.isEdit) {
						if (treeNode == att.editingNode) {				// 编辑状态下：取消勾选的和编辑的节点相同时，退出编辑
							att.cancelEdit();
						} else {
							mmt.removeAlertor(treeNode);				// 编辑状态下：取消勾选的和编辑的节点不相同，移除取消勾选的节点配置
						}
					} else {
						if (att.isAdd) {								// 新增状态下：取消勾选的从配置图中移除，同时配置为零时自动退出新建
							att.cancelSelect(treeNode);
							mmt.removeAlertor(treeNode);
							if (mmt.alertors.length == 0) {
								mmt.clear();
								att.cancelEdit();
							}
						}
					}
				}
			},

			// 单击前
			beforeClick: function (treeId, treeNode) {
				clickTimerId && clearTimeout(clickTimerId);			// 取消上一次单击事件

				if (treeNode.isParent) return false;				// 父节点不触发事件

				if (att.isEdit || att.isAdd) {						// 编辑或新增状态下：
					if (att.hasLinked(treeNode)) {					// 已配置的节点
						if (treeNode == att.editingNode) 			// 同一节点不处理
							return false;
					} else {										// 未配置的节点
						if (att.selectedNode != treeNode) {			// 点击勾选/取消复选框交替
							if (treeNode.checked) {
								att.cancelCheck(treeNode, true);
							} else {
								att.checkNode(treeNode, true);
							}
							return false;
						}
					}
				}
			},

			// 点击事件
			onClick: function (event, treeId, treeNode, chickFlag) {
				clickTimerId = setTimeout(function (treeNode) {
					if (att.selectedNode != treeNode) {	// 过滤重复点击
						att.clickNode(treeNode, false);	// 点击节点
					}
				}, 350, treeNode);
			},

			beforeDblClick: function (treeId, treeNode) {
				clickTimerId && clearTimeout(clickTimerId);// 取消单击事件
				if (treeNode) {
					if (treeNode.isParent) return false;	// 父节点不出发事件
					if (att.isEdit || att.isAdd) {			// 编辑或新增状态下：
						if (!att.hasLinked(treeNode))		// 未配置的节点不出发双击
							return false;
					}
				}
				return true;
			},

			onDblClick: function (event, treeId, treeNode, reload) {
				treeNode && att.clickNode(treeNode, true);
			}
		}
	};







	/* ****************************************************************************************************************** */
	/* *************************************************【报警器树管理】************************************************** */
	/* ****************************************************************************************************************** */
	// TODO: （att）报警器树管理alertorTreeTool
	var att = {
		showTimerId: null,
		selectedNode: null,		// 选择的节点
		editingNode: null,		// 编辑的节点

		isEdit: false,			
		isAdd: false,

		/*
		 * 初始化树
		 */
		initTree: function (treeId, setting, zNodes, zTree, zNode) {
			zTree = $.fn.zTree.init($('#' + treeId), setting, zNodes);
			if (recordNode) {
				zNode = zTree.getNodeByParam('rid', recordNode.rid);
				recordNode = null;

				if (zNode) {
					zTree.selectNode(zNode);
					att.clickNode(zNode);
				}
			}
			return zTree;
		},

		/*
		 * 单击/双击节点
		 * @param treeNode 节点对象
		 * @param isEdit 是否编辑（此属性也可以判断是否是双击事件）
		 */
		clickNode: function (treeNode, isEdit) {
			att.cancelSelect();				// 取消已选择的（防止多选）
			att.setSelectNode(treeNode);	// 设置已选择节点

			if (att.hasLinked(treeNode)) {			// 已配置的节点
				if (att.isEdit || att.isAdd) {			// 编辑状态, 新增状态下
					if (treeNode != att.editingNode) {	// 不是同一个则提示
						message.confirm(att.isEdit ? ('正在编辑预案 <<span>' + att.editingNode.name + '</span>>，是否取消编辑并继续?') : '正在新增预案，是否取消新增并继续?', 
							function () {
								att.cancelEdit();				// 退出编辑
								vm.detail(treeNode, isEdit);	// 查询详情
							}, 
							function () {
								att.cancelSelect();		// 取消选中的节点
								att.selectNode();		// 选择编辑的节点
							}
						);
					} else {
						att.cancelEdit();				// 退出编辑
					}
				} else {
					vm.detail(treeNode, isEdit);		// 直接查询
				}
			} else {								// 未配置的节点
				mmt.clear();						// 清除画布
				if (isEdit) {						// 双击进入新增同时取消选中
					att.enabledEdit(treeNode);		
					att.cancelSelect();
				} else {
					att.showMsg('该报警设备未配置预案，勾选或双击可新增预案...');
				}
			}
		},

		/*
		 * 是否已配置预案
		 */
		hasLinked: function (node) {
			return node.link_id && node.id == node.link_id;
		},

		/*
		 * 启动编辑
		 */
		enabledEdit: function (node) {
			if (att.hasLinked(node)) {
				if (att.isEdit) return;
				att.isEdit = true;
				att.isAdd = false;
				att.showMsg('已进入编辑状态，双击可取消编辑...');
			} else {
				if (att.isAdd) return;
				att.isEdit = false;
				att.isAdd = true;
				att.showMsg('已进入新增状态...');
				mmt.addAlertor(node, true, true);
			}

			att.editingNode = node;
			att.checkNode(node);
			att.selectNode(node);
			mindMap.setEditStatus(true);
			mmt.addPlus();
		},

		/*
		 * 取消编辑
		 */
		cancelEdit: function (msg) {
			if (att.isEdit || att.isAdd) {
				utils.each([].concat(mmt.alertors), function (alertor) {
					var data = alertor.data || {};
					if (data.zNode != att.editingNode || !att.isEdit) {
						mmt.removeAlertor(data.zNode);
					}
				});

				att.showMsg(msg || (att.isEdit ? '已退出编辑状态...' : '已退出新增状态...'));
				att.isEdit && att.selectNode();	// 取消后默认选中已配置的
				att.cancelCheck();
				att.isEdit = false;
				att.isAdd = false;

				mindMap.setEditStatus(false);
				mmt.removePlus();
			}
		},

		/*
		 * 取消勾选
		 */
		cancelCheck: function (node, callbackFlag) {
			if (node) {
				node.nocheck = att.hasLinked(node);
				att.each(function (tree) {
					tree.checkNode(node, false, true, callbackFlag);
				});
			} else {
				if (att.editingNode) {
					att.cancelCheck(att.editingNode);
					att.editingNode = null;
				}
				att.each(function (tree) {
					tree.checkAllNodes(false);
				});
			}
		},

		/*
		 * 勾选节点
		 */
		checkNode: function (node, callbackFlag) {
			if (att.hasLinked(node)) {
				att.editingNode = node;
				node.nocheck = false;
			}
			att.each(function (tree) {
				tree.checkNode(node, true, true, callbackFlag);
			});
		},

		/*
		 * 取消选中
		 */
		cancelSelect: function (node) {
			node = node || att.selectedNode;

			if (att.selectedNode == node) {
				att.selectedNode = null;
			}

			node && att.each(function (tree) {
				tree.cancelSelectedNode(node);
			});
		},

		/*
		 * 选中节点
		 */
		selectNode: function (node) {
			node = node || att.editingNode;
			if (node) {
				att.setSelectNode(node);
				att.each(function (tree) {
					tree.selectNode(node);
				});
			}
		},

		/*
		 * 设置选择节点
		 */
		setSelectNode: function (node) {
			att.selectedNode = node;
		},

		/*
		 * 更新节点
		 */
		updateNode: function (node) {
			this.each(function (tree) {
				tree.updateNode(node);
			});
		},

		each: function (callback) {
			utils.each(vm.zTreeObjs, function(zTreeObj){
				callback(zTreeObj);
			});
		},

		/*
		 * 显示提示信息
		 * @param msg 自定义消息
		 */
		showMsg: function (msg) {
			$('.msg-status').html('提示：' + msg).stop().fadeIn(500);

			this.showTimerId && clearTimeout(this.showTimerId);
			this.showTimerId = setTimeout(function () {
				$('.msg-status').fadeOut(2000);
			}, 3000);
		}
	};








	/* ****************************************************************************************************************** */
	/* ********************************************** 【mindMap的属性设置】*********************************************** */
	/* ****************************************************************************************************************** */
	// TODO: mindMap的属性设置mmSetting
	var mmSetting = {
		data: {
			clickDelay: 200
		},
		view: {
			showClose: true,
		},
		callback: {
			onClick: function (event, nodeId, nodeData) {
				if (nodeData.type === NODETYPE.PLUS) {
					vm.enabledEdit();
				}
			},

			onDblClick: function (event, nodeId, nodeData) {
				switch(nodeData.type) {
					case NODETYPE.LINKTYPE:
						att.isEdit && vm.enabledEdit(nodeData.data.id);
						break;

					case NODETYPE.LINKDVC: break;
				}
			},

			onCloseClick: function (event, nodeId, nodeData) {
				var data = nodeData.data;
				var callback = null;
				var confirm = function () {
					callback();
					att.showMsg('按住Ctrl键可直接点击删除节点...');
				};
				switch(nodeData.type) {
					case NODETYPE.LINKTYPE:
						callback = function () {
							var dvcs = [].concat(mmt.dvcs);
							for(var i = 0; i < dvcs.length; i++) {
								if (dvcs[i].type == data.id) {
									mmt.removeNode(dvcs[i].type, dvcs[i].id);
								}
							}
						};

						ctrlKey ? callback() : message.confirm('是否取消关联的所有<<span>' + nodeData.text + '</span>>设备?', confirm);
						break;

					case NODETYPE.LINKDVC: 
						callback = function(){mmt.removeNode(data.type, data.id);}
						ctrlKey ? callback() : message.confirm('是否取消关联<<span>' + nodeData.text + '</span>>?', confirm);
						break;
					
					case NODETYPE.ALERTOR:
						callback = function(){att.cancelCheck(data.zNode, true);};

//						if (mmt.alertors.length == 1 && mmt.dvcs.length > 0) {
//							message.confirm('删除该报警设备后将清除之前的预案配置，是否继续?', callback);
//						} else {
							ctrlKey ? callback() : message.confirm('是否删除<<span>' + nodeData.text + '</span>>报警设备?', confirm);
//						}
						break;
				}
			}
		}
	};






	/* ****************************************************************************************************************** */
	/* ************************************************** 【vue对象】 **************************************************** */
	/* ****************************************************************************************************************** */
	// TODO: vue对象
	var vm = new vue({
		el:'body',
		data:{
			zTreeMaps: {},
			zTreeObjs: [],
			zTreeShows: [],

			isExpand:false,
			isHandle: true,	// 是否可操作数据库

			searchTree:'',
			searchDvc: '',

			area: [],
			deviceTypes: [],
			checkedStatus: [],

			// 选择的关联类型
			selectedLinkType: null,
			selectedLinkData: null,

			// 关联数据
			dvcCacheByType: {},	// 缓存的关联数据，格式{"设备类型":[]}
			linkTypes: [],
			linkDvcTree: [],
		},
		watch:{
			'checkedStatus': function () {
				var searchVal, treeId, node, newNodes;
				if (this.checkedStatus.length == 1) {
					searchVal = this.checkedStatus[0];
				}

				this.zTreeObjs = [];

				for(var type in this.zTreeMaps) {
					treeNodes = this.zTreeMaps[type];
					treeId = baseTool.getTreeId(type);
					newNodes = [];

					if (searchVal) {
						for(var i = 0, I = treeNodes.length; i < I; i++) {
							node = treeNodes[i];

							if (node.hasLinked) {
								if (node.hasLinked == searchVal) {
									newNodes.push(node);
								}
							} else {
								newNodes.push(node);
							}
						}
					} else {
						newNodes = treeNodes;
					}
					baseTool.initTree(treeId, newNodes);
				}
			},

			'searchTree':function(){
				for(var type in this.zTreeMaps) {
					treeUtil.searchTree('name', this.searchTree, baseTool.getTreeId(type), this.zTreeMaps[type], setting);
				}
			},
			'searchDvc': function () {
				treeUtil.searchTree('name', this.searchDvc, 'linkDvcTree', this.linkDvcTree, dvcSetting);
			}
		},
		methods:{
			// 展开/收拢
			expand: function () {
				this.isExpand=!this.isExpand
			},

			/*
			 * 编辑预案
			 */
			enabledEdit: function (type) {
				$('div.link-panel').fadeIn(300);
				this.isHandle = false;
				mmt.edit();
				if (type) {
					utils.each(this.linkTypes, function (obj) {
						if (obj.id == type) {
							vm.selectLinkType(obj);
						}
					});
				} else {
					this.selectLinkType(this.linkTypes[0]);
				}
			},

			/*
			 * 确定编辑
			 */
			sureEdit: function () {
				this.outEdit();
				mmt.sure();
			},

			/*
			 * 取消编辑预案
			 */
			cancelEdit: function () {
				this.outEdit();
				mmt.cancel();
			},

			/*
			 * 退出编辑
			 */
			outEdit: function () {
				$('div.link-panel').fadeOut(300);
				this.selectedLinkType = null;
				this.isHandle = true;
			},
			
			/*
			 * 缓存设备信息
			 */
			cacheDvcs: function (type, list) {
				this.dvcCacheByType[type] = list;
			},

			/*
			 * 选择关联类型
			 */
			selectLinkType: function (data) {
				var type = data.id;
				if (this.selectedLinkType != type) {
					this.selectedLinkType = type;
					this.selectedLinkData = data;
					this.initDvcTree(type, this.dvcCacheByType[type] || []);
				}
			},

			/*
			 * 初始化设备树
			 */
			initDvcTree: function (type, dvcs) {
				this.linkDvcTree = [];//

				// 默认选中已配置的
				utils.each(dvcs, function (treeDvc) {
					treeDvc.checked = false;
					utils.each(mmt.dvcs, function (linkDvc) {
						if (linkDvc.type == type) {
							return treeDvc.checked = (treeDvc.id == linkDvc.id);
						}
					});
				});

				// 合并区域
				baseTool.concatArea(vm.linkDvcTree, dvcs);

				// 初始化树
				$linkDvcTree = att.initTree('linkDvcTree', dvcSetting, vm.linkDvcTree);
				$linkDvcTree.expandNode($linkDvcTree.getNodes()[0], true);
			},

			/*
			 * 显示关联详情
			 */
			detail: function (node, isEdit) {
				db.query({
					request: {
						sqlId: 'select_link_dvc_for_alarm_plan',
						whereId: 1,
						orderId: 1,
						params: [user.cusNumber, node.type, node.id]
					},
					success: function (data) {
						if (data && data.length) {
							mmt.clear();
							mmt.addAlertor(node, false, false);
							mmt.removePlus();

							utils.each(data, function (idata) {
								var type = idata.dvc_type;

								utils.each(vm.dvcCacheByType[type] || [], function (jdata) {
									if (idata.dvc_id == jdata.id) {
										idata.dvc_name = jdata.name;
										return true;
									}
								});

								mmt.addNode(idata.dvc_type, idata.dvc_id, idata.dvc_name, idata);
							});

							if (isEdit) {
								att.enabledEdit(node);
							} else {
								att.showMsg('双击可编辑该预案...');
								mindMap.setEditStatus(false);
							}
						}
					}
				});
			},

			/*
			 * 保存关联设备信息
			 */
			save: function () {

				// 格式化数据
				var alertor, dvc, seq, params = [], delParams = [], msg = '', 
					alertorLen = mmt.alertors.length,
					dvcLen = mmt.dvcs.length;

				if (alertorLen == 0) {
					message.alert('请选择报警设备!'); return;
				}

				if (dvcLen == 0) {
					message.alert('请选择报警关联设备!'); return;
				}

				for(var i = 0; i < alertorLen; i++) {
					alertor = mmt.alertors[i].data.zNode;
					seq = 1;

					delParams.push({
						cus_number: user.cusNumber,
						alertor_type: alertor.type,
						alertor_id: alertor.id
					});

					if (i == 0) msg = alertor.name;
					if (i == 1) msg += ', ' + alertor.name;

					for(var j = 0; j < dvcLen; j++) {
						dvc = mmt.dvcs[j];
						params.push({
							cus_number: user.cusNumber,
							alertor_type: alertor.type,
							alertor_id: alertor.id,
							dvc_type: dvc.type,
							dvc_id: dvc.id,
							dvc_act: '',
							seq: seq++,
							crte_user_id: user.userId,
							updt_user_id: user.userId
						});
					}
				}

				if (alertorLen > 2) {
					msg += ', ...等' + alertorLen + '个';
				}

				if (att.isEdit || att.isAdd) {
					message.confirm('是否保存 <<span>' + msg + '</span>> 预案?', function () {
						update();
					});
				}

				function update () {
					// 保存
					db.updateByParamKey({
						request: [{
							sqlId: 'delete_link_dvc_for_alarm_plan',
							whereId: 2,
							params: delParams
						},{
							sqlId: 'insert_link_dvc_for_alarm_plan',
							params: params
						}],
						success: function (data) {
							recordNode = mmt.alertors[0].data.zNode;
							att.cancelEdit('报警预案保存成功!');
							mmt.clear();
							while(delParams.length) {
								baseTool.refreshAlertor(delParams.shift().alertor_type);
							}
						},
						error: function (code, desc) {
							att.showMsg(code + ':' + desc);
						}
					});
				}
			},

			/*
			 * 删除预案
			 */
			remove: function () {
				var treeNode = att.selectedNode;
				if (treeNode) {
					if (att.hasLinked(treeNode)) {
						message.confirm('是否确认删除 <<span>' + treeNode.name + '</span>> 预案?', function () {
							db.update({
								request: {
									sqlId: 'delete_link_dvc_for_alarm_plan',
									whereId: 1,
									params: [user.cusNumber, treeNode.type, treeNode.id]
								},
								success: function (data) {
									recordNode = treeNode;
									att.cancelEdit('报警预案删除成功!');
									mmt.clear();
									baseTool.refreshAlertor(treeNode.type);
								},
								error: function (code, desc) {
									att.showMsg(code + ':' + desc);
								}
							});
						});
					} else {
						message.alert('该报警设备未配置预案!')
					}
				} else {
					message.alert('请选择要删除预案!')
				}
			},

			reset: function () {
				if (att.isEdit || att.isAdd) {
					message.confirm('是否重置所有数据?', function () {
						att.cancelEdit('所有数据已重置...');
						att.cancelSelect();
						mmt.clear();
					});
				} else {
					message.alert('数据已重置!')
				}
			}
		}
	});


















	/* ****************************************************************************************************************** */
	/* ***********************************************【报警设备树设置】  ************************************************* */
	/* ****************************************************************************************************************** */
	// TODO: dvcSetting关联设备树属性设置
	var $linkDvcTree = null;
	var dvcSetting = {
		data:{simpleData:{enable:true,pIdKey:'pid',idKey:'rid'}},
		check:{enable:true},
		callback: {
			onCheck: function (event, treeId, treeNode) {
				var type = vm.selectedLinkType;
				var dvcId = treeNode.id;
				if (treeNode.checked) {
					mmt.removePlus();
					mmt.addNode(type, dvcId, treeNode.name);
					mmt.addPlus();
				} else {
					mmt.removeNode(type, dvcId);
				}
			}
		}
	}

	/* ****************************************************************************************************************** */
	/* ************************************************【baseTool对象】 ************************************************** */
	/* ****************************************************************************************************************** */
	// TODO: 基础数据查询
	var baseTool = {
		/*
		 * 获取树ID
		 */
		getTreeId: function (type) {
			return 'alertorTree_' + type;
		},

		/*
		 * 加载报警器设备
		 */
		loadAlertor: function (typeObj) {
			var typeKey = typeObj.id;
			var typeVal = typeObj.name;
			var cusNumber = user.cusNumber;
			var sqlId = alarmDvcSql[typeKey], zTreeId, zNodes, zTreeObj;

			if (sqlId) {
				// 添加根节点
				zTreeId = this.getTreeId(typeKey);
				zNodes = vm.zTreeMaps[typeKey] = [];
				zNodes.push({pid: 0, rid: cusNumber, id: cusNumber, name: typeVal, nocheck:true, open: true});

				db.query({
					request: {
						sqlId: sqlId, whereId: 1, orderId: 1,
						params:[typeKey, cusNumber, typeKey, cusNumber]
					},
					success: function (data) {
						baseTool.fomatterAlertor(data, zNodes);
						baseTool.initTree(zTreeId, zNodes);
					},
					error: function (code, msg) {}
				});
			}
		},


		/*
		 * 刷新报警器
		 */
		refreshAlertor: function (type) {
			utils.each(vm.deviceTypes, function (data) {
				if (data.id == type) {
					baseTool.loadAlertor(data);
				}
			});
		},

		/*
		 * 初始化树
		 */
		initTree: function (zTreeId, zNodes) {
			vm.zTreeObjs.push( att.initTree(zTreeId, setting, zNodes) );
		},

		/*
		 * 格式化报警器
		 */
		fomatterAlertor: function (nodes, zNodes) {
			var sNode = recordNode || {};

			utils.each(nodes, function (node) {

				if (sNode.type == node.type && sNode.id == node.id) {
					node.open = true;
				}

				if (node.id === node.link_id) {
					node.nocheck = true;
					node.hasLinked = '1';
				} else {
					node.hasLinked = '2';
				}
			});
			this.concatArea(zNodes, nodes);
		},

		/*
		 * 合并区域
		 */
		concatArea: function (zNodes, nodes) {
			var filter = {};
			var opens = {};
			function filterArea (filter, opens) {
				var array = [], temp = {}, oTemp = {}, hasNext = false;
				utils.each(vm.area, function (area) {
					if (filter[area.id]) {
						if (opens[area.id]) {
							oTemp[area.pid] = true;
							area.open = true;
						}
						hasNext = temp[area.pid] = true;
						zNodes.push(area);
					} else {
						array.push(area);
					}
				});
				hasNext && filterArea(temp, oTemp);
			}

			// 统计有设备的区域
			utils.each(nodes, function (obj) {
				zNodes.push(obj);
				filter[obj.pid] = true;
				obj.open && (opens[obj.pid] = true);
			});

			// 过滤空节点
			filterArea(filter, opens);
		}
	};





	/* ****************************************************************************************************************** */
	/* ************************************************【utils对象】 ************************************************** */
	/* ****************************************************************************************************************** */
	var utils = {
		/*
		 * 循环
		 */
		each: function (array, callback) {
			for(var i = 0, I = array.length; i < I; i++) {
				if (I == array.length) {
					if (callback(array[i], i)) {
						break;
					}
				}
			}
		},
	};


	/*
	 * 加载区域
	 */
	function loadArea (callback) {
		db.query({
			async: false,
			request: {
				sqlId: 'select_area_tree_for_alarm_plan', 
				whereId: 1, 
				orderId: 1,
				params:[user.cusNumber]
			},
			success: function (data) {
				vm.area = data;
				for(var i = 0, I = data.length; i < I; i++) {
					data[i].isParent = true;
					data[i].nocheck = true;
					data[i].open = false;
				}
				callback();
			},
			error: function (code, msg) {
				message.alert('加载区域失败：' + msg);
			}
		});
	}




	/*
	 * 加载报警设备类型
	 * @returns
	 */
	function loadDeviceTypes(){
		db.query({
			request: {
				sqlId:'select_constant_bycode', whereId:0, params:['securityDeviceType']
			},
			success: function (data) {

				// 标记不支持的报警设备
				for(var i = 0; i < data.length; i++) {
					if (!alarmDvcSql[data[i].id]) {
						data[i].disabled = true;
						data[i].tip = '暂不支持该设备的报警预案配置!';
					}
				}

				vm.deviceTypes = data;

				// 显示默认配置的设备树
				for(var i = 0; i < defaultShowAlarmDvc.length; i++) {
					vm.zTreeShows[defaultShowAlarmDvc[i]] = true;
				}

				// 加载设备树
				for(var i = 0, I = data.length; i < I; i++) {
					baseTool.loadAlertor(data[i]);
				}
			}
		});
	}

//	/*
//	 * 监听按键状态
//	 */
//	function keyListener (event) {
//		ctrlKey = event.ctrlKey;
//	}


	try {
		// 监听键盘ctrl按键
//		window.addEventListener('keydown', keyListener);
//		window.addEventListener('keyup', keyListener);

		// 初始化mindMap设置
		mindMap.setting(mmSetting);

		// 加载地区树并加载设备类型和关联类型数据
		loadArea(function () {
			loadDeviceTypes();
			loadLinkTypes();
		});		
	} catch (e) {
		console.error(e);
	}
});
