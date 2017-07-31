define(function(require){
	var $ = require("jquery");
	var select = require('frm/select');
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var tip = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	
	var areaTree,setting;
	var vm = new vue({
		el:'body',
		data:{
			cameraData: [],
			baseScreenList: [],
			screenBaseCutList: [],
			screenBaseCut: {
				'sbc_cus_number': loginUser.cusNumber,
				'sbc_screen_id': window.top.screenId,
				'sbc_screen_win_id': '',
				'sbc_cut_num': 1,
				'sbc_camera_info': '',
				'sbc_crte_user_id': loginUser.userId,
				'sbc_updt_user_id': loginUser.userId,
				'sbi_other_idnty': '',
				'sbi_width': '',
				'sbi_height': '',
				'sbi_row_num': '',
				'sbi_column_num': ''
			}
		},
		methods:{
			selectedScreen:function(screenWinId){
				vm.screenBaseCut.sbc_screen_win_id = screenWinId;
				vm.screenBaseCut.sbc_cut_num = 1;
				vm.screenBaseCut.sbc_camera_info = '';
				$("div.baseScreen").removeClass("baseScreenSelected");
				$("div#baseScreen_" + screenWinId).addClass("baseScreenSelected");
				$("div.screen_div div.screen_box div.base").empty();
				var list = vm.screenBaseCutList;
				for(var i=0;i<list.length;i++){
					var id = list[i].sbc_screen_win_id;
					if(id == screenWinId){
						vm.screenBaseCut.sbc_cut_num = list[i].sbc_cut_num;
						vm.screenBaseCut.sbc_camera_info = list[i].sbc_camera_info;
						vm.screenBaseCut.sbi_other_idnty = list[i].sbi_other_idnty;
						vm.screenBaseCut.sbi_width = list[i].sbi_width;
						vm.screenBaseCut.sbi_height = list[i].sbi_height;
						vm.screenBaseCut.sbi_row_num = list[i].sbi_row_num;
						vm.screenBaseCut.sbi_column_num = list[i].sbi_column_num;
						break;
					}
				}
				vue.nextTick(function(){
					if(vm.screenBaseCut.sbc_camera_info){
						var cameraList = vm.screenBaseCut.sbc_camera_info.split(",");
						$("div.screen_box:visible").find("div.base").each(function(i){
							var camera = cameraList[i].split(":");
							var text = $("<div class='text' title='" + camera[1] + "'>" + camera[1] + "</div>");
							var input = $("<input type='hidden' value='" + camera[0] + "'>");
							$(this).html(text);
							$(this).append(input);
							var baseHeight = $(this).height();
							var textHeight = $(this).find(".text").height();
							var height = (baseHeight-textHeight)/2;
							if(height < 0){
								height = 0;
							}
							if(baseHeight < textHeight){
								$(this).find(".text").height(baseHeight);
							}
							$(this).find(".text").css("margin-top",height);
						})
					}
				})
			},
			saveScreenCut:function(){
				if(!vm.screenBaseCut.sbc_screen_win_id){
					tip.alert("请选择基础屏");
					return;
				}
				vm.screenBaseCut.sbc_camera_info = "";
				var cameraInfo = "";
				$("div.screen_box:visible div.base").each(function(){
					var cameraId = $(this).find("input").val();
					var cameraName = $(this).find("div.text").html();
					if(cameraId && cameraName){
						cameraInfo += cameraId + ":" + cameraName + ",";
					}
				})
				cameraInfo = cameraInfo ? cameraInfo.substring(0,cameraInfo.length-1) : cameraInfo;
				vm.screenBaseCut.sbc_camera_info = cameraInfo;
				db.updateByParamKey({ 
					request:{
						sqlId:'delete_screen_base_cut',
						params: vm.screenBaseCut
					},
					success:function(){
						db.updateByParamKey({ 
							request:{
								sqlId:'insert_screen_base_cut',
								params: vm.screenBaseCut
							},
							success:function(){
								queryScreenBaseCut();
								queryBaseScreen();
								sendCutInstruct();
							},
							error:function(data,respMsg){
								tip.alert(respMsg);
							}
						});
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			},
			clearCamera:function(){
				$("div.screen_box:visible div.base").empty();
			}
		}
	});
	/**
	 * 向后台发送基础屏切割指令
	 */
	function sendCutInstruct(){
		var screenId = vm.screenBaseCut.sbi_other_idnty;//大屏编号
		var width = vm.screenBaseCut.sbi_width;//宽度
		var height = vm.screenBaseCut.sbi_height;//高度
		var rowNum = vm.screenBaseCut.sbi_row_num;//行数
		var columnNum = vm.screenBaseCut.sbi_column_num;//列数
		var screenArea = [rowNum*height,rowNum*rowNum,width,height];
		var cutNum = vm.screenBaseCut.sbc_cut_num;//切割次数
		var cameraInfo = vm.screenBaseCut.sbc_camera_info;//摄像机信息
		alert("screenId = " + screenId + ", screenArea = " + JSON.stringify(screenArea) + ", cutNum = " + cutNum + ", cameraInfo = " + JSON.stringify(cameraInfo));
	}
	/**
	 * 查询基础屏信息
	 */
	function queryBaseScreen(){
		db.query({
			request: {
				sqlId: 'select_screenCut_screen_win_dtls',
				params: [loginUser.cusNumber,window.top.screenId],
				whereId: 0,
				orderId: 0
			},
			success: function (data) {
				for(var i=0;i<data.length;i++){
					data[i].seq = i+1;
				}
				vm.baseScreenList = data;
			},
			error: function (data) {
				
			}
		})
	}
	/**
	 * 查询基础屏分割信息
	 */
	function queryScreenBaseCut(){
		db.query({
			request: {
				sqlId: 'select_screen_base_cut',
				params: [loginUser.cusNumber,window.top.screenId],
				whereId: 0,
				orderId: 0
			},
			success: function (data) {
				vm.screenBaseCutList = data;
			},
			error: function (data) {
				
			}
		})
	}
	/**
	 * 初始化左侧区域摄像机树
	 * @returns
	 */
	var up_base = null;
	function initAreaCameraTree(){
		vm.cameraData = []; 
		setting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			edit: {
				enable: true,
				drag: {
					prev:false,
					next:false,
					inner:false
				},
				showRemoveBtn:false,
				showRenameBtn:false,
			},
			callback:{
				onDrop:function(e,treeId, treeNodes, targetNode, moveType, isCopy){
					var me = this;
					me.targetEl = $(e.target);
					up_base.css("background-color","inherit");
					up_base = null;
					var p_classId = me.targetEl.parent().attr('class');
					var parentId = me.targetEl.parent().parent().attr('id');
					var classId = me.targetEl.attr('class');
					if(p_classId == "screen_box" && classId.indexOf("base") != -1){
						var cameraId = treeNodes[0].id.split("_")[1];
						var text = $("<div class='text' title='" + treeNodes[0].name + "'>" + treeNodes[0].name + "</div>");
						var input = $("<input type='hidden' value='" + cameraId + "'>");
						me.targetEl.html(text);
						me.targetEl.append(input);
						var baseHeight = me.targetEl.height();
						var textHeight = me.targetEl.find(".text").height();
						var height = (baseHeight-textHeight)/2;
						if(height < 0){
							height = 0;
						}
						if(baseHeight < textHeight){
							me.targetEl.find(".text").height(baseHeight);
						}
						me.targetEl.find(".text").css("margin-top",height);
						me.isDrop = false;
					}
				},
				beforeDrag:function(treeId, treeNodes){
					var me = this;
					me.isDrop = false;
					for(var i=0;i<treeNodes.length;i++){
						return !treeNodes[i].isParent;
					}
				},
				onDragMove:function(e, treeId, treeNodes){
					var me = this;
					me.targetEl = $(e.target);
					var p_classId = me.targetEl.parent().attr('class');
					var classId = me.targetEl.attr('class');
					if(p_classId == "screen_box" && classId.indexOf("base") != -1){
						if(up_base != null){
							up_base.css("background-color","inherit");
						}
						me.targetEl.css("background-color","rgba(8, 159, 214, 0.23)");
						up_base = me.targetEl;
					}
				},
				onClick:function(event,treeId,treeNode){
					if(!treeNode || !treeNode.isParent){
						return;
					}
				},
				onDblClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.isParent){
						return;
					}
				}
			}
		}
		/**
		 * 查询摄像机信息
		 */
		db.query({
			request: {
				sqlId: 'select_video_area_tree',
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent=true;
					vm.cameraData.push(data[i]);
				}
				db.query({
					request: {
						sqlId: 'select_camera_tree',
						whereId: 0,
						params: [loginUser.cusNumber]
					},
					success: function (data) {
						for(var i=0,j=data.length;i<j;i++){
							data[i].id = 'c_'+data[i].id;
							vm.cameraData.push(data[i]);
						}
						vm.cameraData.push({
							id:loginUser.cusNumber,
							name:loginUser.cusNumberName,
							pid:0,
							isParent:true
						});
						areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
						areaTree.expandNode(areaTree.getNodes()[0],true);
					},
					error: function (code, msg) {
						console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
					}
				});
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
	}
	try {
		initAreaCameraTree();
		queryBaseScreen();
		queryScreenBaseCut();
	} catch (e) {
		console.log("数据加载失败!")
	}
	
});