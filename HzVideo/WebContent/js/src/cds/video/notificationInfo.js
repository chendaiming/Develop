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
	var table = require('frm/table');
	var hzUtils = require('frm/hz.utils');

	var roleTree;// 推送树
	var videoTree;// 视频树

	var vm = new vue({
				el : "#app",
				data : {
					main : {
						vsm_cus_number : loginUser.cusNumber,
						user_id : loginUser.userId,
						vsm_id : 0,
						vsm_title : '',
						vsm_remark : '',
						vsm_type : -1,
						vsm_push_range : 1,
						vsm_push_time : '',
						vsm_state : '',
						vsm_level : -1,
						vsm_create_user : '',
						vsm_create_time : '',
						ubd_name:''
					},
					saveFlag : true,
					isPushFlag : true,
					treeList : [],
					activeTab : 1,
					videoList : [],
					pushNameList : [],
					isUpdate : false,
					isPushCanShow:true,
					playVideoPng:"image/start.png",
					isPushAlreadyFlag:true,
					videoCheckedList:[]   //点击进入详情，存下所有已经被选中的节点
				},
//				watch : {
//					'main.vsm_push_range' : function(val, oldVal) {
//						if (val == 2) {
//							db.query({
//								request : {
//									sqlId : 'query_user_tree',
//									params : {
//										'odd_id' : loginUser.deptId,
//										'user_id' : loginUser.userId
//									}
//								},
//								success : function(data) {
//									
//									dialog.open({
//										targetId : 'openPushList',
//										title : '选择推送对象',
//										h : "400",
//										modal : true
//										});
//									// 左侧菜单
//									var set = {
//										data : {
//											simpleData : {
//												enable : true,
//												pIdKey : "pid"
//											}
//										},
//										check : {
//											enable : true,
//											chkStyle : "checkbox",
//											chkboxType : {
//												"Y" : "ps",
//												"N" : "s"
//											}
//										}
//									}
//									roleTree = $.fn.zTree.init($("#roleopr"), set, data);
//									roleTree.expandAll(true);
//									if(vm.treeList){
//										for(var i = 0;i<vm.treeList.length;i++){
//											var node= roleTree.getNodeByParam("id", vm.treeList[i], null);
//											roleTree.checkNode(node, true, true);
//										}
//										/*$("#openPushList_con").parent().hide(); */
//									}
//									
//									
//
//								}
//							});
//						}
//					}
//
//				},
				methods : {
					showFormTable : function() {
						openFormTable();
						startTimeSet();
						resetTableDate();
						vm.videoList = [];
						this.saveFlag = false;
						this.main.vsm_create_user = loginUser.userName;
						this.main.ubd_name = loginUser.userName;
						vm.isUpdate = false;
						vm.isPushCanShow=true;
						vm.isPushAlreadyFlag = true;
						vm.videoCheckedList=[];
					},
					hoverPng:function(){
						vm.playVideoPng='image/start_hover.png'
					},
					leavePng:function(){
						vm.playVideoPng='image/start.png' 
					},
					hideFormTable : function() {
						//resetTableDate();
						// 提交数据
						$("#dailyReceipt").hide();
						this.saveFlag = true;
						stopTimeSet();
					},
					saveTreeNodes : function() {
						vm.treeList = [];
						vm.pushNameList = [];
						var childNodes = roleTree.getCheckedNodes(true);
						if (childNodes.length) {
							for (var i = 0; i < childNodes.length; i++) {
								if (!childNodes[i].isParent) {
									vm.treeList.push(childNodes[i].id);
									vm.pushNameList.push(childNodes[i].name);
								}
							}
						}
						$("#openPushList_con").parent().hide();
					},
					openPushDialog:function(){
						db.query({
							request : {
								sqlId : 'query_user_tree',
								params : {
									'odd_id' : loginUser.dataAuth != 0 ? loginUser.cusNumber : loginUser.deptId,
									'user_id' : loginUser.userId
								}
							},
							success : function(data) {
								
								dialog.open({
									targetId : 'openPushList',
									title : '选择推送对象',
									h : "400",
									modal : true
									});
								// 左侧菜单
								var set = {
									data : {
										simpleData : {
											enable : true,
											pIdKey : "pid"
										}
									},
									check : {
										enable : true,
										chkStyle : "checkbox",
										chkboxType : {
											"Y" : "ps",
											"N" : "ps"
										}
									}
								}
								roleTree = $.fn.zTree.init($("#roleopr"), set, data);
								roleTree.expandAll(true);
								if(vm.treeList){
									for(var i = 0;i<vm.treeList.length;i++){
										var node= roleTree.getNodeByParam("id", vm.treeList[i], null);
										roleTree.checkNode(node, true, true);
									}
									/*$("#openPushList_con").parent().hide(); */
								}
								
								

							}
						});
					},		
					
					openVideoDialog : function() {
						db.query({
							request : {
								sqlId : "select_video_record",
								whereId : '0',
								orderId : '0',
								params : {
									'vrd_cus_number' : loginUser.cusNumber,
									'user_id' : loginUser.userId
								}
							},
							success : function(data) {
								if(!data.length && !vm.videoCheckedList.length){
									message.alert("暂无视频截图记录，请先新增记录");
									return;
								}
								
								dialog.open({
									targetId : 'openVideoList',
									title : '选择视频截图记录',
									h : "400",
									modal : true
								});
								var set = {
									data : {
										simpleData : {
											enable : true
										},
										key : {
											name : 'vrd_title'
										}
									},
									check : {
										enable : true,
										chkStyle : "checkbox",
										chkboxType : {
											"Y" : "ps",
											"N" : "s"
										}
									}
								}
								videoTree = $.fn.zTree.init($("#roleoprVideo"), set, data);
								videoTree.expandAll(true);
								if(vm.videoList){
									for(var i = 0 ; i<vm.videoCheckedList.length; i++){
										var newNode = vm.videoCheckedList[i];
										newNode.name=vm.videoCheckedList[i].vrd_title;
										videoTree.addNodes(null,newNode);
									}
									
									for(var i = 0; i<vm.videoList.length;i++){
										/*var newNode = vm.videoList[i];
										newNode.name=vm.videoList[i].vrd_title;
										videoTree.addNodes(null,newNode);*/
										var node= videoTree.getNodeByParam("vrd_id", vm.videoList[i].vrd_id, null);
										videoTree.checkNode(node, true, true);
									}
									
								
								} 
								
							}
						});
					},
					setActiveTab : function(n) {
						vm.activeTab = n;
					},
					saveVideoTreeNodes : function() {
						vm.videoList = [];
						vm.videoList = videoTree.getCheckedNodes(true);
						$("#openVideoList_con").parent().hide();

					},
					turnTimeType : function(data) {
						var dt = new Date(data);
						return dt.toLocaleString();
					},
					saveItem : function(num) {
						if(vm.main.vsm_title=='' || vm.main.vsm_title.length > 40){
							message.alert('请输入标题且字数不能超过40');
							return;
						}
						if(vm.main.vsm_remark=='' || vm.main.vsm_remark.length > 120){
							message.alert('请输入通报内容且字数不能超过120');
							return;
						}
						if(vm.main.vsm_push_range==2 && vm.treeList.length == 0){
							message.alert('请选择推送人员');
							return;
						}
						if(vm.videoList.length<1){
							message.alert('请选择截图记录');
							return;
						}
						
						
						if (vm.isUpdate) {

							if (!validateState()) {
								return false;
							}
							vm.main.vsm_state = num;
							if (vm.main.vsm_state == 2) {
								vm.main.vsm_push_time = hzUtils.formatterDate(new Date(), 'yyyy-mm-dd hh:mi:ss')
							}
							// 更新
							db.updateByParamKey({
										request : {
											sqlId : 'update_video_supervise_main',
											whereId : '0',
											params : vm.main
										},
										success : function(data) {


											db.updateByParamKey({
												request : {
													sqlId : 'update_video_record',
													whereId : 1,
													params : resetVideoCheckedList(vm.videoCheckedList)
												},
												success : function(data) {
													db.updateByParamKey({
														request : {
															sqlId : 'delete_video_supervise_detail',
															whereId : '0',
															params : {
																vsd_vsm_id : vm.main.vsm_id
															}
														},
														success : function(data) {

															if (vm.main.vsm_push_range == 2) {
																saveVideoSuperviseDetail(vm.main.vsm_id)
															}
														},
														error : function(data, respMsg) {
															message.alert(respMsg);
														}
													});
													db.updateByParamKey({
															request : {
																sqlId : 'delete_video_supervise_rltn',
																whereId : '0',
																params : {
																	vsr_vsm_id : vm.main.vsm_id
																}
															},
															success : function(data) {
																// 保存视频检测关联表
																if (vm.videoList.length) {
																	saveVideoSuperviseRltn(vm.main.vsm_id)
																}
															},
															error : function(data, respMsg) {
																message.alert(respMsg);
															}
														});

												}
											})
											
											
											message.alert("保存成功");
											vm.hideFormTable();
											table.method("refresh");
										},
										error : function(data, respMsg) {
											message.alert(respMsg);
										}
									});
						} else {
							vm.main.vsm_state = num;
							vm.main.vsm_create_time = $('#clock').html();
							if (vm.main.vsm_state == 2) {
								vm.main.vsm_push_time = $('#clock').html();
							}
							// 新增
							db.updateByParamKey({
										request : {
											sqlId : 'insert_video_supervise_main',
											params : vm.main
										},
										success : function(data) {
											var retrunData = data;

											if (retrunData.data[0].seqList[0]) {

												if (vm.main.vsm_push_range == 2) {
													saveVideoSuperviseDetail(retrunData.data[0].seqList[0])
												}

												// 保存视频检测关联表
												if (vm.videoList.length) {
													saveVideoSuperviseRltn(retrunData.data[0].seqList[0])
												}
											}
											message.alert("保存成功");
											vm.hideFormTable();
											table.method("refresh");
										},
										error : function(data, respMsg) {
											message.alert(respMsg);
										}
									});
						}
					},
					delMainData : function() {
						var list = table.method("getSelections");
						if (!list.length) {
							message.alert("请先选择要删除的项目");
							return;
						}
						var temp = [];
						var temp1 = [];
						var temp2 = [];
						var flag = false;
						var title = '';
						for (var i = 0, leg = list.length; i < leg; i++) {

							if (list[i].vsm_state == 2) {
								title = list[i].vsm_title;
								flag = true;
								temp = [];
								break;
							}
							temp.push({
										vsm_cus_number : loginUser.cusNumber,
										vsm_id : list[i].vsm_id
									});
							temp1.push({
								vsd_vsm_id : list[i].vsm_id
							});
							temp2.push({
								vrd_cus_number : loginUser.cusNumber,
								user_id : loginUser.userId,
								vsr_vsm_id : list[i].vsm_id
							});
						}

						if (flag) {
							message.alert(title + "已经被推送不能删除");
							return;
						}

						// 删除
						message.confirm("确认删除吗？", function(index) {
									db.updateByParamKey({
												request : [
													{
														sqlId : 'delete_video_supervise_main',
														whereId : '0',
														params : temp
													},
													{
														sqlId : 'delete_video_supervise_detail',
														whereId : '0',
														params : temp1
													},
													{
														sqlId : 'update_video_record',
														whereId : 2,
														params : temp2
													},
													{
														sqlId : 'delete_video_supervise_rltn',
														whereId : '0',
														params : temp2
													}
												],
												success : function(data) {
													message.alert("删除成功");
													table.method("refresh");
												},
												error : function(data, respMsg) {
													message.alert(respMsg);
												}
											});
								});
					},
					playVideo : function(item) {
						videoClient.downloadFile('serverIp', 'port', 'userName', 'password', item.vrd_path, item.vrd_file_name, function(data){
							videoClient.playVideoFile('-1', item.vrd_format_type, item.vrd_path + item.vrd_file_name, function(data){

							});
						})
					}
				}
			});

	// 打开详情页面
	function openFormTable() {
		$("#dailyReceipt").show();
		this.saveFlag = false;
	}

	// 设置时间
	var timeSetId;
	function startTimeSet() {
		timeSetId = setInterval(function() {
					var t = new Date()
					$("#clock").html(hzUtils.formatterDate(t, 'yyyy-mm-dd hh:mi:ss'));
				}, 50)
	}
	// 关闭时间计时器
	function stopTimeSet() {
		window.clearInterval(timeSetId);
	}

	// 重置表格数据
	function resetTableDate() {
		vm.main = {
			vsm_cus_number : loginUser.cusNumber,
			user_id : loginUser.userId,
			vsm_id : 0,
			vsm_title : '',
			vsm_remark : '',
			vsm_type : -1,
			vsm_push_range : 1,
			vsm_push_time : '',
			vsm_state : '',
			vsm_level : -1,
			vsm_create_user : '',
			vsm_create_time : ''
		}
		$("#clock").html('');
		vm.treeList = [];
		vm.videoList = [];
		vm.pushNameList = [];
		/* $("#clock").html(row.vsm_create_time); */
	}

	function saveVideoSuperviseDetail(vsd_vsm_id) {

		var saveTreeList = []
		for (var i = 0; i < vm.treeList.length; i++) {
			saveTreeList.push({
						'vsd_cus_number' : loginUser.cusNumber,
						'vsd_vsm_id' : vsd_vsm_id,
						'vsd_receive_user' : vm.treeList[i]
					})
		}
		db.updateByParamKey({
					request : {
						sqlId : "insert_video_supervise_detail",
						params : saveTreeList
					},
					success : function(data) {

					}
				})
	}
	
	function resetVideoCheckedList(list){
		var saveList=[];
		for(var i = 0;i < list.length; i++){
			saveList.push({
				vrd_state : '1',
				user_id : loginUser.userId,
				vrd_cus_number : loginUser.cusNumber,
				vrd_id : list[i].vrd_id
			})
		}
		return saveList;
	}

	function saveVideoSuperviseRltn(vsr_vsm_id) {

		var saveVideoList = [];
		var updateVideoList = [];
		for (var i = 0; i < vm.videoList.length; i++) {
			saveVideoList.push({
						vsr_cus_number : loginUser.cusNumber,
						vsr_vrd_id : vm.videoList[i].vrd_id,
						vsr_vsm_id : vsr_vsm_id,
						vsr_type : '1'
					});
			updateVideoList.push({
						vrd_state : '2',
						user_id : loginUser.userId,
						vrd_cus_number : loginUser.cusNumber,
						vrd_id : vm.videoList[i].vrd_id
					})
		}

		db.updateByParamKey({
					request : [{
						sqlId : 'insert_video_supervise_rltn',
						params : saveVideoList
					},{
						sqlId : 'update_video_record',
						whereId : 1,
						params : updateVideoList
					}],
					success : function(data) {
						console.log(data);
					}
				})
	}

	function validateState() {
		if (vm.main.vsm_state == 2) {
			message.alert('该记录已经被推送不能修改')
			return false;
		}
		return true;
	}

	// 外层List的table表
	table.init("table", {
				request : {
					sqlId : 'select_video_supervise_main',
					params : {
						vsm_cus_number : loginUser.cusNumber,
						user_id : loginUser.userId
					}
				},
				// search : {
				// key : 'drm_date',
				// whereId : '0'
				// },
				columns : [[{
							field : 'state',
							checkbox : true
						}, {
							title : '通报标题',
							field : 'vsm_title',
							align : 'center',
							valign : 'middle'
						}, {
							title : '推送范围',
							field : 'vsm_push_range',
							align : 'center',
							valign : 'middle',
							formatter:function(data,type,row){
		                    	if(data == 1){
		                    		return "公开推送";
		                    	}else {
		                    		return "指定推送"
		                    	}
		                    }
						}, {
							title : '推送时间',
							field : 'vsm_push_time',
							align : 'center',
							valign : 'middle'
						},
						{
							title:"是否推送",
							field:'vsm_state',
							align:"center",
							valign:"middle",
							formatter:function(data,type,row){
								if(data == 1){
									return '未推送';
								}else{
									return '已推送'
								}
							}
						}, {
							title : '通报内容',
							field : 'vsm_remark',
							align : 'center',
							valign : 'middle',
							visible:false
						}
						
						
						
						]],
				onClickRow : function(row) {
					
					if(loginUser.userId != row.vsm_create_user){
						
						vm.isPushCanShow=false;
					}else{
						vm.isPushCanShow=true;
					}
					
					

					vm.isUpdate = true;
					vm.saveFlag = false;
					openFormTable();
					vm.main.vsm_id = row.vsm_id;
					vm.main.vsm_title = row.vsm_title;
					vm.main.vsm_remark = row.vsm_remark;
					vm.main.vsm_type = row.vsm_type;
					vm.main.vsm_level = row.vsm_type;
					vm.main.vsm_create_user = row.vsm_create_user;
					vm.main.vsm_push_range = row.vsm_push_range;
					vm.main.ubd_name = row.ubd_name;
					vm.main.vsm_state = row.vsm_state;
					$("#clock").html('');
					$("#clock").html(row.vsm_create_time);
					vm.pushNameList = [];
					vm.treeList = [];
					vm.videoList = [];
					if(row.vsm_push_range==2){
						$("#openPushList_con").parent().hide();
						db.query({
							request : {
								sqlId : 'select_video_supervise_detail',
								whereId : '0',
								params : {
									'vsd_vsm_id' : row.vsm_id,
									'vsd_cus_number' : loginUser.cusNumber 
								}
							},
							success:function(data){
								var nodes=[];
								var list=data;
								for(var i = 0;i<list.length;i++){
									vm.pushNameList.push(list[i].ubd_name);
									vm.treeList.push(list[i].ubd_id);
								}
								
								
								
								
							}
						});
					}
					
					db.query({
						request : {
							sqlId : 'select_video_supervise_rltn',
							whereId:0,
							params : {
								'vsr_vsm_id' : row.vsm_id,
								'vsr_cus_number' : loginUser.cusNumber
							}
						},
						success:function(data){
							vm.videoList=data;
							vm.videoCheckedList=data;
						}
					});
					
					
					
					
					
					
					
					if (row.vsm_state == 1) {
						// 未推送
						/*$(".isPush").show();*/
						vm.isPushAlreadyFlag = true;

					} else if (row.vsm_state == 2 && loginUser.userId == row.vsm_create_user) {
						// 已推送
						//vm.isPushCanShow=false;
						vm.isPushAlreadyFlag = false;
					}
				},
				onLoadSuccess : function(data) {

				}
			});

		// 视频记录

	})