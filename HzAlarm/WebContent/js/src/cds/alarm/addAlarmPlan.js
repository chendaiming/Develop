define(function(require) {
			var $ = require("jquery");
			var db = require('frm/hz.db');
			var ztree = require('ztree');
			var vue = require('vue');
			var select = require('frm/select');
			var message = require('frm/message');
			var treeUtil = require('frm/treeUtil');
			var loginUser = require('frm/loginUser');
			var piny = require('frm/pinyin');
			var dialog = require('frm/dialog');
			var videoClient = require('frm/hz.videoclient');
			var hzEvent = require('frm/hz.event');
			var hzUtils = require('frm/hz.utils');
			var localStorage = require('frm/localStorage');
			var hzFlow = require('frm/hz.FlowChart')
			var drag = require('frm/hz.drag')
			var vm = null;

			function initVue(selector) {
				// 在VUE初始化完成myFuncMenus的DOM数据之后再显示
				vue.nextTick(function() {
							// $(selector).show();

							hzEvent.on('add.alarm.plan.start', function() {
										vm.created();
									});
						});

				vm = new vue({
							el : selector,
							data : {
								linkDvcArr : []
							},
							methods : {
								created : function() {

									vm.close();
									
									var params = hzEvent.call('get.alarm.plan.params');

									var array = params.array;

									var alarmArray = [];
									for (var i = 0, len = array.length; i < len; i++) {
										if (array[i].original.mpi_link_type == 6) {
											alarmArray.push(array[i]);
											array.splice(i, 1);
											i--;
											len--;
										}
									}

									if (alarmArray.length == 0) {
										return false;
									}
									
									var data = [{
												pid : -1,
												id : '20F644DE-23C5-4E04-BE38-991710D2DA13',
												text : '根结点',
												tip : '',
												className : 'normal',
												icon : {
													normal : '../../css/flowimg/normal.png',
													active : '../../css/flowimg/activation.png',
													hover : '../../css/flowimg/hover.png'
												},
												action : {
													type : 'A001',
													auth : '0001',
													data : {}
												},
												attributes : {
													spacingLeft : 150
												},
												children : []
											}];

									$.each(alarmArray, function(idx, item) {
												var a = {
													pid : '20F644DE-23C5-4E04-BE38-991710D2DA13',
													id : item.id,
													text : item.name,
													tip : item.name,
													className : 'top6',
													icon : {
														normal : '../../css/flowimg/normal.png',
														active : '../../css/flowimg/activation.png',
														hover : '../../css/flowimg/hover.png'
													},
													action : {
														type : 'A001',
														auth : '000' + (idx + 1),
														data : {}
													},
													attributes : {
														spacingLeft : 150
													},
													children : []
												};
												$.each(array, function(idx1, item1) {

															vm.linkDvcArr.push({
																		ldr_alertor_type : item.original.mpi_link_type,
																		ldr_alteror_id : item.original.mpi_link_id,
																		ldr_dvc_type : item1.original.mpi_link_type,
																		ldr_dvc_id : item1.original.mpi_link_id
																	})

															a.children.push({
																		pid : item.original.mpi_link_id,
																		id : item.original.mpi_link_id + '_' + item1.original.mpi_link_type + '_' + item1.original.mpi_link_id,
																		text : item1.name,
																		tip : item1.name,
																		className : 'top'+item1.original.mpi_link_type,
																		icon : {
																			normal : '../../css/flowimg/normal.png',
																			active : '../../css/flowimg/activation.png',
																			hover : '../../css/flowimg/hover.png'
																		},
																		action : {
																			type : 'A001',
																			auth : '000' + (idx1 + 1),
																			data : {}
																		},
																		attributes : {
																			spacingLeft : 150
																		},
																		children : []
																	});
														})
												data[0].children.push(a);
											})
									console.log(JSON.stringify(data))
									$("#addAlarmPlanSection").show();
									hzFlow.init({
												myChart : '#chart',
												data : data,// 节点数据
												drag : false,/* 拖动节点 */
												rightMenu : true,// 禁止鼠标右键菜单
												tool : [
														// {id: "edit",name:
														// "编辑",icon:
														// "icon-bianji"},
														// {id: "add",name:
														// "添加",icon:
														// "icon-iconfontadd"},
														{
													id : "delete",
													name : "删除",
													icon : "icon-jinlingyingcaiwangtubiao20"
												}]
											});

									hzFlow.addEvent('#chart', 'click', function(e) {
												hzFlow.reomveList(function(data) {

															if (data.pid == -1) {
																vm.linkDvcArr = [];
															} else {
																for (var i = 0, len = vm.linkDvcArr.length; i < len; i++) {
																	var item = vm.linkDvcArr[i];

																	if (data.children.length > 0) {
																		if (item.ldr_alteror_id == data.id) {

																			vm.linkDvcArr.splice(i, 1);
																			i--;
																			len--;
																		}
																	} else {
																		if ((item.ldr_alteror_id + '_' + item.ldr_dvc_type + '_' + item.ldr_dvc_id) == data.id) {

																			vm.linkDvcArr.splice(i, 1);
																			i--;
																			len--;
																			break;
																		}
																	}
																}
															}

															if (vm.linkDvcArr.length == 0) {

																vm.close()
															}

															return false;
														});
											}, '#delete')

									// hzFlow.simpleDrag('chart')

								},
								close : function() {
									hzFlow.removeEvent('#chart', 'click', '#delete');
									hzFlow.empty($('#chart'));
									this.linkDvcArr = [];
									$("#addAlarmPlanSection").hide();
								},
								save : function() {

									if (this.linkDvcArr.length > 0) {
										var params = [];
										$.each(this.linkDvcArr, function(idx, item) {
													seq = 1;

													params.push({
																cus_number : loginUser.cusNumber,
																alertor_type : item.ldr_alertor_type,
																alertor_id : item.ldr_alteror_id,
																dvc_type : item.ldr_dvc_type,
																dvc_id : item.ldr_dvc_id,
																dvc_act : '',
																seq : seq++,
																crte_user_id : loginUser.userId,
																updt_user_id : loginUser.userId
															});
												})

										db.updateByParamKey({
													request : [{
																sqlId : 'delete_link_dvc_for_alarm_plan',
																whereId : 2,
																params : params
															}, {
																sqlId : 'insert_link_dvc_for_alarm_plan',
																params : params
															}],
													success : function(data) {
														message.alert('保存成功')
														vm.close();
													},
													error : function(code, desc) {
														att.showMsg(code + ':' + desc);
													}
												});
									}
								}
							}

						});

			}

			try {

				/*
				 * hzEvent.bind(window, 'mousedown', function () { videoVue; });
				 */

				console.log('初始化系统菜单模块成功...');

				/*
				 * 返回对象并暴露一个方法
				 */
				return {
					initMenu : function(selector) {
						drag.on($(selector));
						$(selector).hide();
						$(selector).load('page/cds/alarm/addAlarmPlan.html', function(responseText, textStatus, XMLHttpRequest) {
									$(this).html(XMLHttpRequest.responseText);
									initVue(selector);
								});
					}
				}
			} catch (e) {
				console.error('初始化系统菜单模块异常：', e);
			}
		})