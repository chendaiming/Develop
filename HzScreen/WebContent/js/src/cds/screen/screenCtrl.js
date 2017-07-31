define(function(require){
	var $ = require("jquery");
	var select = require('frm/select');
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var tip = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var dialog = require('frm/dialog');
	var bootstrapMenu = require('bootstrapMenu');
	var utils = require('frm/hz.utils'); // 加载辅助模块
	var video = require('frm/hz.videoclient');
	
	
	var areaTree,setting;
//	loginUser.dept_id = 3044;
//	loginUser.dept_id = 3023;
	var vm = new vue({
		el:'body',
		data:{
			cameraData:[],
			searchTree:'',
			screenSceneList:[],
			screenSceneLayoutList:[],
			screenScene:{
				'ssn_cus_number':loginUser.cusNumber,
				'ssn_screen_id':'',
				'sbi_other_idnty':'',
				'ssn_dept_id':loginUser.deptId,
				'ssn_scene_name':'',
				'ssn_status':1,
				'ssn_remark':'',
				'ssn_crte_user_id':loginUser.userId,
				'ssn_updt_user_id':loginUser.userId
			},
			screenSceneLayout:{
				'ssl_cus_number':loginUser.cusNumber,
				'ssl_screen_id':'',
				'ssl_dept_id':loginUser.deptId,
				'ssl_scene_id':'',
				'ssl_camera_idnty':'',
				'ssl_camera_name':'',
				'ssl_crte_user_id':loginUser.userId,
				'ssl_updt_user_id':loginUser.userId,
				'dcr_cus_number':loginUser.cusNumber,
				'dcr_screen_id':''
			},
			screenSceneLayout2:{
				'ssl_cus_number':loginUser.cusNumber,
				'ssl_screen_id':'',
				'ssl_dept_id':loginUser.deptId,
				'ssl_scene_id':'',
				'ssl_screen_idnty':'',
				'ssl_camera_idnty':'',
				'ssl_camera_name':'',
				'ssl_width':'',
				'ssl_height':'',
				'ssl_screen_top':'',
				'ssl_screen_left':'',
				'ssl_scene_old_id':'',
				'ssl_crte_user_id':loginUser.userId,
				'ssl_updt_user_id':loginUser.userId
			},
			mergeBaseSreen:[],
			mergeSreen:[],
			mergeCameraId:'',
			mergeSreenId:'',
		},
		methods:{
			toMenuContent:function(index){
				if(index == 2){
					$("div.tab-menu div.menu1_btn").removeClass("selected2");
					$("div.tab-menu div.menu2_btn").addClass("selected2");
					$("div.menu1_content").hide();
					$("div.menu2_content").show();
					$("div.menu2_content iframe").attr("src","screenCut.html");
				}else{
					$("div.tab-menu div.menu2_btn").removeClass("selected2");
					$("div.tab-menu div.menu1_btn").addClass("selected2");
					$("div.menu2_content").hide();
					$("div.menu1_content").show();
					$("div.menu2_content iframe").attr("src","");
				}
			},
			enlarge:function(){
				var body = {
					'screenID':'1',
					'cameraID':'1',
					'screenArea':'',
					'screenBigArea':'',
				};
				commonCtrl('SCREEN002',body);
			},
			narrow:function(){
				var body = {
					'screenID' : '',
					'cameraID' : '',
					'screenArea' : '',
					'screenBigArea' : '',
				};
				commonCtrl('SCREEN003',body);				
			}
		}
	});
	/**
	 * 大屏参数
	 */
	var css_width = null;//当前基础屏宽度(CSS)
	var css_height = null;//当前基础屏高度(CSS)
	var dcr_width = null;//当前基础屏宽度(真实宽度)
	var dcr_height = null;//当前基础屏高度(真实高度)
	var dcr_rowNum = null;//当前基础屏行数
	var dcr_colNum = null;//当前基础屏列数
	var up_base = null;//上一个基础屏对象
	var r_base = null;//基础屏对象(右击获取)
	var s_baseList = [];//基础屏集合(框选获取)
	var s_baseDataList = [];//基础屏数据集合(框选获取)
	var s_layout = null;//选中的布局对象
	var s_up_layout = null;//当前上屏布局对象
	var layoutScreenList = [];//当前上屏布局基础屏数据集合
	var currentScreenId = null;//当前大屏编号
	var currentSceneId = null//当前上屏布局编号
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.cameraData,setting);
	 });
	
	/**
	 * 初始化左侧区域摄像机树
	 * @returns
	 */
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
					up_base.css("background-color","#3CA9C4");
					up_base = null;
					var id = me.targetEl.parent().attr('id');
					var parentId = me.targetEl.parent().parent().attr('id');
					var classId = me.targetEl.attr('class');
					if(id == "baseScreen" && classId.indexOf("base") != -1){
						var text = $("<div class='text' title='" + treeNodes[0].name + "'>" + treeNodes[0].name + "</div>");
						var input = $("<input type='hidden' value='" + treeNodes[0].id + "'>");
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
					}else if(parentId == "baseScreen" && id == null && classId == "text"){
						var text = $("<div class='text' title='" + treeNodes[0].name + "'>" + treeNodes[0].name + "</div>");
						var input = $("<input type='hidden' value='" + treeNodes[0].id + "'>");
						var parent = me.targetEl.parent();
						parent.empty();
						parent.append(text);
						parent.append(input);
						var baseHeight = parent.height();
						var textHeight = parent.find(".text").height();
						var height = (baseHeight-textHeight)/2;
						if(height < 0){
							height = 0;
						}
						if(baseHeight < textHeight){
							parent.find(".text").height(baseHeight);
						}
						parent.find(".text").css("margin-top",height);
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
					var id = me.targetEl.parent().attr('id');
					var parentId = me.targetEl.parent().parent().attr('id');
					var classId = me.targetEl.attr('class');
					if(id == "baseScreen" && classId.indexOf("base") != -1){
						if(up_base != null){
							up_base.css("background-color","#3CA9C4");
						}
						me.targetEl.css("background-color","#39E9C6");
						up_base = me.targetEl;
					}else if(parentId == "baseScreen" && id == null && classId == "text"){
						if(up_base != null){
							up_base.css("background-color","#3CA9C4");
						}
						me.targetEl.parent().css("background-color","#39E9C6");
						up_base = me.targetEl.parent();
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
					var text = $("<div class='text'>" + treeNode.name + "</div>");
					var input = $("<input type='hidden' value='" + treeNode.id + "'/>");
					for(var i=0;i<dcr_rowNum;i++){
						for(var j=0;j<dcr_colNum;j++){
							var base = $("#baseScreen .base[s_top='" + i + "'][s_left='" + j + "'][isMergeScreen='true']");
							if(!base.attr("screenId")){
								base = $("#baseScreen .base[s_top='" + i + "'][s_left='" + j + "']");
							}
							if(base.find("input").length == 0 && base.css("display") != "none"){
								base.append(text);
								base.append(input);
								resizeBase();
								return false;
							}
						}
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
	/**
	 * 拼接屏基础信息查询
	 */
	function screenWinDtlsQuery(){
		db.query({
			request:{
				sqlId:'select_screen_win_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				vm.screenWinDtls = data;
			}
		});
	}
	/**
	 * 大屏当前布局信息查询
	 */
	function screenCurrentSceneQuery(){
		db.query({
			request:{
				sqlId:'select_screen_current_layout',
				whereId: 0,
				params:[loginUser.cusNumber,loginUser.deptId]
			},
			async:false,
			success:function(data){
				if(data != ""){
					currentScreenId = data[0].scl_screen_id;
					currentSceneId = data[0].scl_scene_id;
				}
			}
		});
	}
	/**
	 * 大屏布局基础屏查询
	 */
	function screenSceneLayoutQuery(){
		db.query({
			request:{
				sqlId:'select_screen_scene_layout',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber,loginUser.deptId]
			},
			async:false,
			success:function(data){
				vm.screenSceneLayoutList = data;
			}
		});
	}
	/**
	 * 大屏布局信息查询
	 */
	function screenSceneQuery(flag){
		db.query({
			request:{
				sqlId:'select_screen_scene',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber,loginUser.deptId]
			},
			success:function(data){
				vm.screenSceneList = data;
				loadLayoutList(flag);
			}
		});
	}
	/**
	 * 加载大屏布局列表
	 */
	function loadLayoutList(flag){
		var layoutDiv = $("#bottomScreen #layout_div");
		layoutDiv.empty();
		var screenScene = vm.screenSceneList;
		if(screenScene.length > 0){
			$(".empty").remove();
		}
		for(var i=0;i<screenScene.length;i++){
			var screenId = screenScene[i].ssn_screen_id;
			var otherId = screenScene[i].sbi_other_idnty;
			var sceneId = screenScene[i].ssn_scene_id;
			var sceneName = screenScene[i].ssn_scene_name;
			var layoutId = screenScene[i].ssn_remark;
			if(screenId == currentScreenId && sceneId == currentSceneId){
				base = $("<div class='base checked_up'></div>");
			}else{
				base = $("<div class='base'></div>");
			}
			base.append("<div class='text' title='" + sceneName + "'>" + sceneName + "</div>");
			base.append("<input type='hidden' id='screenId' value='" + screenId + "'/>");
			base.append("<input type='hidden' id='otherId' value='" + otherId + "'/>");
			base.append("<input type='hidden' id='sceneId' value='" + sceneId + "'/>");
			base.append("<input type='hidden' id='layoutId' value='" + layoutId + "'/>");
			layoutDiv.append(base);
		}
		resizeLayout();
		layoutClick();
		if(flag){
			if(currentSceneId){
				layoutDiv.find(".checked_up").click();
			}else{
				layoutDiv.children().eq(0).click();
			}
		}
	}
	/**
	 * 布局点击、双击事件
	 */
	function layoutClick(){
		$("#bottomScreen #layout_div .base").unbind("click");
		$("#bottomScreen #layout_div .base").click(function(){
			$("#bottomScreen #layout_div .base").each(function(){
				$(this).removeClass("checked");
			})
			$(this).addClass("checked");
			s_layout = $(this);
			var screenId = s_layout.find("#screenId").val();
			var sceneId = s_layout.find("#sceneId").val();
			setScreenParams(screenId,sceneId);
			createLayoutScreen();
		})
		$("#bottomScreen #layout_div .base").unbind("dblclick");
		$("#bottomScreen #layout_div .base").dblclick(function(){
			$("#bottomScreen #layout_div .base").each(function(){
				$(this).removeClass("checked_up");
			})
			$(this).addClass("checked_up");
			s_up_layout = $(this);
			var screenId = s_layout.find("#screenId").val();
			var otherId = s_layout.find("#otherId").val();
			var sceneId = s_layout.find("#sceneId").val();
			var layoutId = s_layout.find("#layoutId").val();
			layoutUpScreen(screenId,otherId,sceneId,layoutId);
		})
	}
	/**
	 * 设置大屏参数
	 */
	function setScreenParams(screenId,sceneId){
		window.top.screenId = screenId;
		layoutScreenList = [];
		for(var i=0;i<vm.screenSceneLayoutList.length;i++){
			if(sceneId == vm.screenSceneLayoutList[i].ssl_scene_id)
				layoutScreenList.push(vm.screenSceneLayoutList[i]);
		}
		var data = vm.screenWinDtls;
		dcr_rowNum = 0;
		dcr_colNum = 0;
		for(var i=0;i<data.length;i++){
			if(screenId == data[i].dcr_screen_id){
				if(data[i].dcr_screen_left == 0){
					dcr_rowNum++;
				}
				if(data[i].dcr_screen_top == 0){
					dcr_colNum++;
				}
				dcr_width = parseInt(data[i].dcr_width);
				dcr_height = parseInt(data[i].dcr_height);
			}
		}
	}
	/**
	 * 创建布局基础屏
	 */
	function createLayoutScreen(){
		var baseScreen = $("#baseScreen");
		baseScreen.empty();
		css_width = Math.ceil(baseScreen.width()/dcr_colNum)-2;
	    css_height = Math.ceil(baseScreen.height()/dcr_rowNum)-4;
	    var l_borderNum = 2;
	    var isMergeScreen = false;
	    var screenOldIds = "";
		for(var i=0;i<layoutScreenList.length;i++){
			var margin_top = 0;
			var margin_left = 0;
			var top = layoutScreenList[i].ssl_screen_top;
			var left = layoutScreenList[i].ssl_screen_left*css_width;
			var col = layoutScreenList[i].ssl_width/dcr_width;
		    var row = layoutScreenList[i].ssl_height/dcr_height;
			var width = col > 1 ? css_width*col : css_width;
			var height = row > 1 ? css_height*row : css_height;
			
			if(width > css_width || height > css_height){
				isMergeScreen = true;
			}
			
			if(top > 0){
				 margin_top = (top*css_height)+(top*2);
			}
			if(left > 0){
				if(isMergeScreen){
					margin_left = left+(layoutScreenList[i].ssl_screen_left*2);
				}else{
					margin_left = left+l_borderNum;
					l_borderNum += 2;
				}
			}else{
				margin_left = 0;
				l_borderNum = 2;
			}
			
			var w = Math.ceil(width/css_width);
		    var h = Math.ceil(height/css_height);
			if(w > 1){
				width = width+((w-1)*2);
			}
			if(h > 1){
				height = height+((h-1)*2);
			}
			
			var div = $("<div class='base' screenId='" + layoutScreenList[i].ssl_screen_idnty + "'"
					   + "otherId='" + layoutScreenList[i].sbi_other_idnty + "'"
					   + "isMergeScreen='" + isMergeScreen + "'"
					   + "s_width='" + layoutScreenList[i].ssl_width + "'"
		 			   + "s_height='" + layoutScreenList[i].ssl_height + "'"
		 			   + "s_top='" + layoutScreenList[i].ssl_screen_top + "'"
		 			   + "s_left='" + layoutScreenList[i].ssl_screen_left + "'"
		 			   + "style='width: " + width  + "px;"
		 			   + "height: " + height + "px;"
		 			   + "margin-top: " + margin_top + "px;"
		 			   + "margin-left: " + margin_left + "px;'></div>");
			if(isMergeScreen){
				div.css({"z-index" : 1});
				div.attr("base_screenIds",layoutScreenList[i].ssl_scene_old_id);
				screenOldIds += layoutScreenList[i].ssl_scene_old_id + ",";
				isMergeScreen = false;
			}
			if(layoutScreenList[i].ssl_camera_idnty){
				div.append("<div class='text' title='" + layoutScreenList[i].ssl_camera_name + "'>" + layoutScreenList[i].ssl_camera_name + "</div>");
				div.append("<input type='hidden' value='" + layoutScreenList[i].ssl_camera_idnty + "'/>");
			}
			baseScreen.append(div);
		}
		if(screenOldIds){
			screenOldIds = screenOldIds.split(",");
			for(var i=0;i<screenOldIds.length-1;i++){
				baseScreen.find(".base[screenId='" + screenOldIds[i] + "']").hide();
			}
		}
		baseScreenRightClick();
		resizeBase();
	}
	/**
	 * 基础屏右击事件
	 */
	var isClear = false;//能否清除
	var isUpScreen = false;//能否上屏
	var isMerge = false;//能否合屏
	var isApart = false;//能否拆屏
	function baseScreenRightClick(){
		$("#baseScreen .base").unbind("mousedown");
		$("#baseScreen .base").mousedown(function(e){ 
	        if(3 == e.which){ 
	        	r_base = $(this);
	        	isClear = true;
	        	isUpScreen = r_base.find("input").length > 0 ? true : false;
	        	isMerge = s_baseDataList.length > 1 ? true : false;
	        	isApart = r_base.attr("isMergeScreen") == "true" && s_baseDataList.length < 2 ? true : false;
	        	for(var i=0;i<s_baseDataList.length;i++){
	        		var isMergeScreen = s_baseDataList[i].isMergeScreen;
	        		if(isMergeScreen == "true"){
	        			isMerge = false;
	        		}
	        		if(s_baseDataList[i].cameraId){
	        			isUpScreen = true;
	        		}
	        	}
	        }
		});
	}
	/**
	 * 新建
	 */
	$("#add").click(function(){
		vm.screenScene.ssn_screen_id = "";
		vm.screenScene.ssn_remark = "";
		vm.screenScene.ssn_scene_name = "";
		vm.screenScene.ssn_remark = "";
		dialog.open({targetId:'layout_panel_add',title:'新建布局',h:"240"});
	})
	/**
	 * 编辑
	 */
	$("#edit").click(function(){
		if(s_layout){
			vm.screenScene.ssn_remark = s_layout.find("#layoutId").val();
			vm.screenScene.ssn_scene_name = s_layout.find(".text").attr("title");
			console.log( s_layout.find("#layoutId").val());
			vm.screenScene.ssn_remark = s_layout.find("#layoutId").val();
			dialog.open({targetId:'layout_panel_edit',title:'编辑布局',h:"200"});
		}else{
			tip.alert("请选择一个布局");
		}
	})
	/**
	 * 保存
	 */
	$("#save").click(function(){
		if(s_layout){
			var request = [];
			$("#baseScreen .base").each(function(){
				var screenId = $(this).attr("screenId");
				var cameraId = $(this).find("input").val();
				var cameraName = $(this).find(".text").html();
				cameraId = cameraId == null ? "" : cameraId;
				cameraName = cameraName == null ? "" : cameraName;
				//修改布局基础屏信息
				request.push({
					sqlId:'update_screen_scene_layout',
					params:{ssl_camera_idnty:cameraId,ssl_camera_name:cameraName,
						    ssl_cus_number:loginUser.cusNumber,ssl_screen_id:s_layout.find("#screenId").val(),
						    ssl_scene_id:s_layout.find("#sceneId").val(),ssl_screen_idnty:screenId}
				});
			})
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					tip.close();
					tip.alert("保存成功");
					screenSceneLayoutQuery();
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		}else{
			tip.alert("请选择一个布局");
		}
	})
	/**
	 * 删除
	 */
	$("#delete").click(function(){
		if(s_layout){
			tip.confirm("确定删除布局[ " + s_layout.find(".text").html() + " ]吗？",function(){
				var request=[{
					sqlId:'delete_screen_scene',
					params:{ssn_cus_number:loginUser.cusNumber,ssn_screen_id:s_layout.find("#screenId").val(),ssn_scene_id:s_layout.find("#sceneId").val()}
				},{
					sqlId:'delete_screen_scene_layout',
					params:{ssl_cus_number:loginUser.cusNumber,ssl_screen_id:s_layout.find("#screenId").val(),ssl_scene_id:s_layout.find("#sceneId").val()}
				}];
				if(currentSceneId == s_layout.find("#sceneId").val()){
					request.push({
						sqlId:'delete_screen_current_layout',
						params:{scl_cus_number:loginUser.cusNumber,scl_dept_id:loginUser.deptId}
					});
				}
				db.updateByParamKey({
					request:request,
					success:function(data){
						tip.alert("删除成功");
						s_layout.remove();
						s_layout = null;
						$("#baseScreen").empty();
						if($("#layout_div").find(".base").length > 0){
							if($("#layout_div").find(".checked_up").length > 0){
								$("#layout_div").find(".checked_up").click();
							}else{
								$("#layout_div").children().eq(0).click();
							}
						}else{
							isClear = false;
							isUpScreen = false;
							isMerge = false;
							isApart = false;
							$("#baseScreen").append('<div class="empty" style="margin-top: 14%;">当前没有布局上屏</div>');
							$("#bottomScreen").append('<div class="empty" style="margin-top: 8%;">当前没有布局，点击新建布局</div>');
						}
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			})
		}else{
			tip.alert("请选择一个布局");
		}
	})
	/**
	 * 添加大屏布局信息、基础屏信息
	 */
	$("#addScene").click(function(){
		if(!validate(1)){
			return;
		}
		dialog.close();
		var screenId = vm.screenScene.ssn_screen_id.split("_")[0];
		var otherId = vm.screenScene.ssn_screen_id.split("_")[1];
		vm.screenScene.ssn_screen_id = screenId;
		vm.screenScene.sbi_other_idnty = otherId;
		var request=[{
			sqlId:'insert_screen_scene',
			params:vm.screenScene
		}];
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				var seqId = data.data[0]['seqList'][0];
				vm.screenSceneLayout.ssl_scene_id = seqId;
				vm.screenSceneLayout.dcr_screen_id = vm.screenScene.ssn_screen_id;
				var request=[{
					sqlId:'insert_screen_scene_layout',
					params:vm.screenSceneLayout
				}];
				db.updateByParamKey({
					request:request,
					success:function(data){
						$(".empty").remove();
						tip.close();
						tip.alert("保存成功");
						var len = $("#layout_div").find(".base").length;
						var height = "50px";
						if(len > 0){
							height = $("#layout_div").children(0).css("height");
						}
						var base = $("<div class='base' style='height: " + height + ";'></div>");
						base.append("<div class='text' title='" + vm.screenScene.ssn_scene_name + "'>" + vm.screenScene.ssn_scene_name + "</div>");
						base.append("<input type='hidden' id='screenId' value='" + vm.screenScene.ssn_screen_id + "'/>");

						base.append("<input type='hidden' id='otherId' value='" + vm.screenScene.sbi_other_idnty + "'/>");
						base.append("<input type='hidden' id='sceneId' value='" + seqId + "'/>"); 
						base.append("<input type='hidden' id='layoutId' value='" + vm.screenScene.ssn_remark + "'/>");

						$("#bottomScreen #layout_div").append(base);
						resizeLayout();
						layoutClick();
						screenSceneLayoutQuery();
						base.click();
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
	})
	/**
	 * 修改大屏布局信息
	 */
	$("#editScene").click(function(){
		if(!validate(2)){
			return;
		}
		dialog.close();
		var request=[{
			sqlId:'update_screen_scene',
			params:{ssn_remark:vm.screenScene.ssn_remark,
					ssn_scene_name:vm.screenScene.ssn_scene_name,
				    ssn_cus_number:loginUser.cusNumber,
				    ssn_screen_id:s_layout.find("#screenId").val(),
				    ssn_scene_id:s_layout.find("#sceneId").val()}
		}];
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				tip.close();
				tip.alert("保存成功");
				s_layout.find("#layoutId").val(vm.screenScene.ssn_remark);
				s_layout.find(".text").html(vm.screenScene.ssn_scene_name);
				s_layout.find(".text").attr("title",vm.screenScene.ssn_scene_name);
				s_layout.find("#layoutId").val(vm.screenScene.ssn_remark);
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	})
	/**
	 * 表单校验
	 */
	function validate(type){
		var flag = true;
		if(type == 1){
			if(!vm.screenScene['ssn_screen_id']){
				tip.alert("请选择大屏");
				flag = false;
			}else if(!vm.screenScene['ssn_scene_name']){
				tip.alert("请输入布局名称");
				flag = false;
			}
		}else{
			if(!vm.screenScene['ssn_scene_name']){
				tip.alert("请输入布局名称");
				flag = false;
			}
		}
		return flag;
	}
	/**
	 * 窗口调整大小
	 */
	resizeStyle();
	$(window).resize(function(){
		resizeStyle();
		resizeLayout();
		if(vm.screenWinDtls){
			var rs_width = Math.ceil($("#baseScreen").width()/dcr_colNum)-2;
		    var rs_height = Math.ceil($("#baseScreen").height()/dcr_rowNum)-4;
		    var isMergeScreen = false;
			var l_borderNum = 2;
		    $("#baseScreen .base").each(function(){
		    	var margin_top = 0;
		    	var margin_left = 0;
		    	var top = $(this).attr("s_top");
				var left = $(this).attr("s_left")*rs_width;
				var col = $(this).attr("s_width")/dcr_width;
			    var row = $(this).attr("s_height")/dcr_height;
				var width = col > 1 ? rs_width*col : rs_width;
				var height = row > 1 ? rs_height*row : rs_height;
				
				if(width > rs_width || height > rs_height){
					isMergeScreen = true;
				}
				
				if(top > 0){
					margin_top = (top*rs_height)+(top*2);
				}
				
				if(left > 0){
					if(isMergeScreen){
						margin_left = left+($(this).attr("s_left")*2);
					}else{
						margin_left = left+l_borderNum;
					}
					l_borderNum += 2;
				}else{
					margin_left = 0;
					l_borderNum = 2;
				}
				
				var w = Math.ceil(width/rs_width);
			    var h = Math.ceil(height/rs_height);
				if(w > 1){
					width = width+((w-1)*2);
				}
				if(h > 1){
					height = height+((h-1)*2);
				}
				
			    $(this).width(width-2);
		    	$(this).height(height-2);
		    	$(this).css("margin-top",margin_top);
		    	$(this).css("margin-left",margin_left);
		    })
		    resizeBase();
		}
	});
	/**
	 * 宽高自适应
	 */
	function resizeStyle(){
		var rightHeight = $(".right-con").height();
		$("#baseScreen").height(rightHeight*0.6);
		$("#bottomScreen").height((rightHeight*0.4)-1);
	}
	/**
	 * 布局自适应
	 */
	function resizeLayout(){
		var rightHeight = $(".right-con").height();
		var height = parseInt(((rightHeight*0.4)-1)/4)-2;
		$("#bottomScreen #layout_div .base").css("height",height);
		$("#bottomScreen #layout_div .base .text").each(function(){
			var baseHeight = $(this).parent().height();
			var textHeight = $(this).height();
			var height = (baseHeight-textHeight)/2;
			$(this).css("margin-top",height);
		})
	}
	/**
	 * 大屏自适应
	 */
	function resizeBase(){
		 $("#baseScreen .base .text").each(function(){
	    	$(this).css("height","auto");
	    	var baseHeight = $(this).parent().height();
			var textHeight = $(this).height();
			var height = (baseHeight-textHeight)/2;
			if(height < 0){
				height = 0;
			}
			if(baseHeight < textHeight){
				$(this).height(baseHeight);
			}
			$(this).css("margin-top",height);
	    })
	}
	/**
	 * 清除大屏
	 */
	function clearScreen(){
		if(s_baseList != ""){
			for(var i=0;i<s_baseList.length;i++){
				s_baseList[i].empty();
			}
		}else{
			r_base.empty();
		}
	}
	/**
	 * 摄像机上屏
	 */
	function upScreen(screenId,otherId,cameraId,screenArea){
		var body = {
				 screenID : otherId,
				 cameraID : cameraId,
				 screenArea : screenArea
			};
		commonCtrl('SCREEN001',body);
	}
	/**
	 * 合屏
	 */
	function mergeScreen(){
		var top_t = 0;
		var left_t = 0;
		var index = 0;
		var if_flag = true;
		for(var i=0;i<s_baseDataList.length;i++){
			var top = parseInt(s_baseDataList[i].s_top);
			var left = parseInt(s_baseDataList[i].s_left);
			if(top <= top_t && left <= left_t){
				index = i;
			}
			top_t = top;
			left_t = left;
			if(vm.mergeBaseSreen.length > 0){
				var if_width = parseInt(s_baseDataList[i].s_width);
				var if_height = parseInt(s_baseDataList[i].s_height);
				var if_top = parseInt(s_baseDataList[i].s_top);
				var if_left = parseInt(s_baseDataList[i].s_left);
				if((if_top*if_height) == vm.mergeBaseSreen[0] && (if_left*if_width) == vm.mergeBaseSreen[1] 
					&& if_width == vm.mergeBaseSreen[2] && if_height == vm.mergeBaseSreen[3]){
					if_flag = false;
				}
			}
		}
		if(if_flag){
			vm.mergeBaseSreen = [];
		}
		var s_width = parseInt(s_baseDataList[index].s_width);
		var b_width = s_width;
		var s_height = parseInt(s_baseDataList[index].s_height);
		var b_height = s_height;
		var s_top = parseInt(s_baseDataList[index].s_top);
		var s_left = parseInt(s_baseDataList[index].s_left);
		if(vm.mergeBaseSreen.length == 0){
			var screenArea = [s_top*s_height,s_left*s_width,s_width,s_height];
			vm.mergeBaseSreen = screenArea;
		}
		var width = parseInt(s_baseDataList[index].width) + 2;
		var height = parseInt(s_baseDataList[index].height) + 2;
		var base_screenIds = "";
		var setObj = new Set();
		for(var i=0;i<s_baseDataList.length;i++){
			setObj.add(s_baseDataList[i].s_top);
			var screenIdnty = s_baseDataList[i].screenIdnty;
			//s_baseList[i].hide();
			base_screenIds += screenIdnty;
			if(i != s_baseDataList.length-1)
				base_screenIds += ",";
		}
		var maxTop = setObj.size;
		var maxRow = maxTop == 1 ? parseInt(s_baseDataList.length) : parseInt(s_baseDataList.length)/maxTop;
		
		s_width = s_width*maxRow;
		s_height = s_height*maxTop;
		width = width*maxRow;
		height = height*maxTop;
		
		var screenIdnty = getMaxScreenIdnty(s_layout.find("#screenId").val(),s_layout.find("#sceneId").val())
		
		vm.screenSceneLayout2.ssl_screen_id = s_layout.find("#screenId").val();
		vm.screenSceneLayout2.ssl_scene_id = s_layout.find("#sceneId").val();
		vm.screenSceneLayout2.ssl_screen_idnty = screenIdnty;
		vm.screenSceneLayout2.ssl_width = s_width;
		vm.screenSceneLayout2.ssl_height = s_height;
		vm.screenSceneLayout2.ssl_screen_top = s_top;
		vm.screenSceneLayout2.ssl_screen_left = s_left;
		vm.screenSceneLayout2.ssl_scene_old_id = base_screenIds;
		var screenArea = [s_top*b_height,s_left*b_width,s_width,s_height];
		vm.mergeSreen = screenArea;
		var request=[{
			sqlId:'insert_screen_scene_layout_2',
			params:vm.screenSceneLayout2
		}];
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				tip.close();
				screenSceneLayoutQuery();
				setScreenParams(vm.screenSceneLayout2.ssl_screen_id,vm.screenSceneLayout2.ssl_scene_id);
				createLayoutScreen();
				baseScreenRightClick();
				s_baseList = [];
				s_baseDataList = [];
				//放大
	        	var body = {
						'screenID' : vm.mergeSreenId,
						'cameraID' : vm.mergeCameraId,
						'screenArea':vm.mergeBaseSreen,
						'screenBigArea':vm.mergeSreen,
				};
	        	commonCtrl('SCREEN002',body);
	        	vm.mergeBaseSreen = [];
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	}
	/**
	 * 根据布局编号获取该布局下的最大值屏号+1
	 */
	function getMaxScreenIdnty(screenId,sceneId){
		var maxScreenIdnty = null;
		db.query({
			request:{
				sqlId:'select_screen_scene_layout_maxScreenIdnty',
				whereId: 0,
				params:[loginUser.cusNumber,screenId,sceneId]
			},
			async:false,
			success:function(data){
				maxScreenIdnty = data[0].maxscreenidnty+1;
			}
		});
		return maxScreenIdnty;
	}
	/**
	 * 拆屏
	 */
	function apartScreen(){
		var request=[{
			sqlId:'delete_screen_scene_layout_2',
			params:{ssl_cus_number:loginUser.cusNumber,ssl_screen_id:s_layout.find("#screenId").val(),ssl_scene_id:s_layout.find("#sceneId").val(),ssl_screen_idnty:r_base.attr("screenId")}
		}];
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				 tip.close();
				 screenSceneLayoutQuery();
				 setScreenParams(s_layout.find("#screenId").val(),s_layout.find("#sceneId").val());
				 createLayoutScreen();
				 r_base.remove();
			}
		});

	}
	
	/**
	 * 框选功能
	 */
	(function($) {
		$.fn.dom = function() { return this[0] ;}
	})($) ;
	function Pointer(x, y) {
		this.x = x ;
		this.y = y ;
	}
	function Position(left, top) {
		this.left = left ;
		this.top = top ;
	}
	function Direction(horizontal, vertical) {
		this.horizontal = horizontal ;
		this.vertical = vertical ;
	}
	$(function() {
		loadMenu();
		var clientWidth = document.documentElement.clientWidth || document.body.clientWidth ;
		var clientHeight = document.documentElement.clientHeight || document.body.clientHeight ;
		$(".desktop_bg").width(clientWidth).height(clientHeight) ;

		var oldPointer = new Pointer() ;
		var oldPosition = new Position() ;
		var direction = new Direction() ;
		var div = $("<div></div>").css({
			background : "#fff",
			position  : "absolute",
			opacity : "0.2"
		}).appendTo($("body")) ;
		var isDown = false ;
		$("#baseScreen").mousedown(function(e) {
			e.preventDefault();
			if(3 == e.which){ 
	        	return false;
	        }
			s_baseList = [];
			s_baseDataList = [];
			if(div.dom().setCapture) {
				div.dom().setCapture(true) ;
			}
			$("#baseScreen .base").css("background-color", "#3CA9C4");
			$("#baseScreen .base").css("box-shadow", "none");
			isDown = true ;
			oldPointer.x = e.clientX ;
			oldPointer.y = e.clientY ;
			oldPosition.left = e.clientX,
			oldPosition.top = e.clientY
			div.css({
				left : e.clientX,
				top : e.clientY
			}) ;
		}) ;
		div.extend({
			 checkC : function() {
				var $this = this;
				$("#baseScreen .base").each(function() {
					if($this.offset().left + $this.width() > $(this).offset().left && 
					  $this.offset().left < $(this).offset().left + $(this).width()
					   && $this.offset().top + $this.height() > $(this).offset().top 
					   && $this.offset().top < $(this).offset().top + $(this).height()) {
						if($(this).css("display") != "none"){
							var flag = true;
							if(s_baseDataList.length > 0){
								for(var i=0;i<s_baseDataList.length;i++){
									if(s_baseDataList[i].screenIdnty == $(this).attr("screenId")){
										flag = false;
										break;
									}
								}
							}
							if(flag){
								s_baseList.push($(this));
								s_baseDataList.push({
									screenIdnty: $(this).attr("screenId"),
									s_width: $(this).attr("s_width"),
									s_height: $(this).attr("s_height"),
									s_top: $(this).attr("s_top"),
									s_left: $(this).attr("s_left"),
									width: $(this).width(),
									height: $(this).height(),
									isMergeScreen: $(this).attr("isMergeScreen"),
									cameraId: $(this).find("input").val()
								});
							}
							$(this).css("background-color", "#18D7D7");
							$(this).css("box-shadow", "0px 0px 4px 1px #11EEEE inset");
						}
					 } else {
						$(this).css("background-color", "#3CA9C4");
						$(this).css("box-shadow", "none");
					 }
				}) ;
			}
		}) ;
		$(document).mousemove(function(e) {
			if(!isDown) return isDown;
			if(e.clientX > oldPointer.x) {
				direction.horizontal = "Right";
			} else if(e.clientX < oldPointer.x) {
				direction.horizontal = "Left";
			} else {
				direction.horizontal = "";
			}
			if(e.clientY > oldPointer.y) {
				direction.vertical = "Down" ;
			} else if(e.clientY < oldPointer.y) {
				direction.vertical = "Up" ;
			} else {
				direction.vertical = "" ;
			}
			var directionOperation = {
				LeftUp : function() {
					div.css({
						width : Math.abs(e.clientX - oldPointer.x),
						height : Math.abs(e.clientY - oldPointer.y),
						top : oldPosition.top - Math.abs(e.clientY - oldPointer.y),
						left : oldPosition.left - Math.abs(e.clientX - oldPointer.x)
					}) ;
				},
				LeftDown : function() {
					div.css({
						width : Math.abs(e.clientX - oldPointer.x),
						height : Math.abs(e.clientY - oldPointer.y),
						left : oldPosition.left - Math.abs(e.clientX - oldPointer.x)
					}) ;
				},
				Down : function() {
					div.css({
						width : 1,
						height : Math.abs(e.clientY - oldPointer.y)
					}) ;
				},
				Up : function() {
					div.css({
						width : 1,
						height : Math.abs(e.clientY - oldPointer.y),
						top : oldPosition.top - Math.abs(e.clientY - oldPointer.y)
					}) ;
				},
				Right : function() {
					div.css({
						width : Math.abs(e.clientX - oldPointer.x),
						height : 1
					}) ;
				},
				Left : function() {
					div.css({
						width : Math.abs(e.clientX - oldPointer.x),
						height : 1,
						left : oldPosition.left - Math.abs(e.clientX - oldPointer.x)
					}) ;
				},
				RightDown : function() {
					div.css({
						width : Math.abs(e.clientX - oldPointer.x),
						height : Math.abs(e.clientY - oldPointer.y)
					}) ;
				},
				RightUp : function() {
					div.css({
						width : Math.abs(e.clientX - oldPointer.x),
						height : Math.abs(e.clientY - oldPointer.y),
						top : oldPosition.top - Math.abs(e.clientY - oldPointer.y)
					}) ;
				}
			}
			directionOperation[direction.horizontal + direction.vertical]() ;
			div.checkC();
		});
		$(document).mouseup(function() {
			if(!isDown) return isDown ;
			isDown = false ;
			div.width(0).height(0) ;
			if(div.dom().releaseCapture) {
				div.dom().releaseCapture(true) ;
			}
		});
	});
	/**
	 * 大屏右击菜单
	 */
	function loadMenu(){
		var menu = new BootstrapMenu('#baseScreen', {
		      actions: [{
		        name: '清除',
		        onClick: function() {
		        	clearScreen();
		        },
		        isEnabled: function(row) {
		        	return isClear;
		        }
		      }, {
		        name: '上屏',
		        onClick: function(event,row) {
		        	var cameraId = r_base.find("input").val().substr(2);
		        	var screenId = r_base.attr('screenId');
		        	var otherId = r_base.attr('otherId');
		        	var s_width = r_base.attr('s_width');
		        	var s_height = r_base.attr('s_height');
		        	var s_top = r_base.attr('s_top');
		        	var s_left = r_base.attr('s_left');
		        	var screenArea = [s_top*s_height,s_left*s_width,s_width,s_height];
		        	upScreen(screenId,otherId,cameraId,screenArea);
		        },
		        isEnabled: function(row) {
		        	return isUpScreen;
		        }
		      }, {
//		        name: '合屏',
		    	name: '放大',
		        onClick: function() {
		        	
		        	/*if(!vm.mergeBaseSreen){
		        		tip.alert('请先设定放大基础屏');
		        		return;
		        	}*/
//		        	var s_width = r_base.attr('s_width');
//		        	var s_height = r_base.attr('s_height');
//		        	var s_top = r_base.attr('s_top');
//		        	var s_left = r_base.attr('s_left');
//		        	var screenArea = [s_top*s_height,s_left*s_width,s_width,s_height];
//		        	vm.mergeSreen = screenArea;
		        	mergeScreen();
		        },
		        isEnabled: function(row) {
		        	return isMerge;
		        }
		      }, {
//		        name: '拆屏',
		    	name: '缩小',
		        onClick: function() {
		        	var body = {
							'screenID' : vm.mergeSreenId,
							'cameraID' : vm.mergeCameraId,
							'screenArea' :vm.mergeBaseSreen,
							'screenBigArea' :vm.mergeSreen,
					};
					commonCtrl('SCREEN003',body,apartScreen);		
//		        	apartScreen();
		        },
		        isEnabled: function(row) {
		        	return isApart;
		        }
		      }, {
			    	name: '设为放大基础屏',
			        onClick: function() {
//			        	var cameraId = r_base.find("input").val().substr(2);
			        	var screenId = r_base.attr('otherId');
			        	var s_width = r_base.attr('s_width');
			        	var s_height = r_base.attr('s_height');
			        	var s_top = r_base.attr('s_top');
			        	var s_left = r_base.attr('s_left');
			        	var screenArea = [s_top*s_height,s_left*s_width,s_width,s_height];
			        	vm.mergeBaseSreen = screenArea;
//			        	vm.mergeCameraId = cameraId;
			        	vm.mergeSreenId = screenId;
			        }
			      }]
	    });
	}
	initAreaCameraTree();
	screenWinDtlsQuery();
	screenSceneLayoutQuery();
	screenCurrentSceneQuery();
	screenSceneQuery(true);
	
	
	/**
	 * 布局上屏
	 */
	function layoutUpScreen(screenId,otherId,sceneId,layoutId){
		var body = {"screenID":otherId,"layoutID":layoutId,"remark":''};
		//成功回调
		function success(data){
			currentSceneId = sceneId;
			var request=[{
				sqlId:'delete_screen_current_layout',
				params:{scl_cus_number:loginUser.cusNumber,scl_dept_id:loginUser.deptId}
			},{
				sqlId:'insert_screen_current_layout',
				params:{scl_cus_number:loginUser.cusNumber,scl_screen_id:screenId,scl_dept_id:loginUser.deptId,scl_scene_id:sceneId,scl_updt_user_id:loginUser.userId}
			}];
			db.updateByParamKey({
				request:request,
				success:function(data){
					 tip.alert("布局切换指令发送成功");
					 currentSceneId = s_layout.find("#sceneId").val();
				}
			});
		}
		commonCtrl('SCREEN010',body,success);
	}
	/*
	 * 公用后台通信方法 
	 */
	function commonCtrl(msgType,msgBody,success){
		
		//获取消息头
		var msgHeader=video.getMsgHeader(msgType);
		//组装消息
		var sendMsg={
				header:	JSON.stringify(msgHeader),
				body:JSON.stringify(msgBody)
		};
		
		var reqs;
		
		if(success && typeof success == 'function'){
			reqs = success;
		}else{
			reqs = function(json){
				if (json.success) {
					tip.alert('指令发送成功!');
				} else {
					tip.alert('指令发送失败!');
				}
			}
		}
		
		function error(){
			tip.alert('与服务器通信异常');
		}
		utils.ajax('screen/excute', {"msg":JSON.stringify(sendMsg),"cusNumber":loginUser.cusNumber},reqs,error);
	}
});