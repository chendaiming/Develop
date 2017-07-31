define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var tpl = require('vue');
	var modelData = require('frm/model');
	var dialog = require('frm/dialog');
	var table = require('frm/table');
	var select = require('frm/select');
	var tip = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	
	var screenGroup=$("#screenlist");
	var groups=$("#screenGroup");
	/**
	 * 搜索
	 */
	screenGroup.find("input:first").keyup(function(){
		var key=this.value;
		groups.children("li").each(function(){
			if(key&&this.innerHTML.indexOf(key)<0){
				this.style.display="none";
			}else{
				this.style.display="block";
			}
		});
	});
	/**
	 * 创建模型
	 */
	var model=new tpl({
		el:'#screenlist',
		data:{
			screenList:[],
			screenBaseList:[],
			screen:{ 
				'sbi_cus_number':loginUser.cusNumber,
				'sbi_screen_id':'',
				'sbi_other_idnty':'',
				'sbi_screen_name':'',
				'sbi_dept_id':'',
				'sbi_width':'',
				'sbi_height':'',
				'sbi_row_num':'',
				'sbi_column_num':'',
				'sbi_crte_user_id':loginUser.userId,
				'sbi_updt_user_id':loginUser.userId
			},
			screenBase:{
				'dcr_screen_win_id':'',
				'dcr_out_type':'',
				'dcr_signal_id':'',
				'dcr_decoder_id':'',
				'dcr_decoder_chl':'',
				'dcr_cut_seq':'',
				'dcr_updt_user_id':loginUser.userId,
				'dcr_cus_number':loginUser.cusNumber,
				'dcr_screen_id':'',
				'dcr_screen_win_id':''
			}
		},
		methods:{
			refresh:function(item,that){
				var _this=event.target;
				modelData.modelData(model.screen,item);
				createBaseScreen();
			}
		}
	});
	/**
	 * 设置选中状态
	 */
	groups.on("click","li",function(){
		groups.find("li").removeClass("active");
		$(this).addClass("active");
	});
	/**
	 * 添加大屏信息
	 */
	var isAdd = false;
	$("#groupbtn").find(".add").click(function(){
		isAdd = true;
		model.screen.sbi_screen_id = "";
		model.screen.sbi_other_idnty = "";
		model.screen.sbi_screen_name = "";
		model.screen.sbi_dept_id = "";
		model.screen.sbi_width = "";
		model.screen.sbi_height = "";
		model.screen.sbi_row_num = "";
		model.screen.sbi_column_num = "";
		$("#rowNum").attr("disabled",false);
		$("#colNum").attr("disabled",false);
		dialog.open({targetId:'add_edit_panel',title:'新增大屏',h:"440"});
	})
	/**
	 * 编辑大屏信息
	 */
	$("#groupbtn").find(".edit").click(function(){
		if(groups.find(".active").length == 0){
			tip.alert("请选择一个大屏");
			return;
		}
		isAdd = false;
		$("#rowNum").attr("disabled",true);
		$("#colNum").attr("disabled",true);
		groups.find(".active").click();
		dialog.open({targetId:'add_edit_panel',title:'编辑大屏',h:"440"});
	})
	/**
	 * 删除
	 */
	$("#groupbtn").find(".del").click(function(){
		if(groups.find(".active").length == 0){
			tip.alert("请选择一个大屏");
			return;
		}
		tip.confirm("确定删除[ " + model.screen.sbi_screen_name + " ]以及该大屏下的布局吗？",function(){
			var request=[{
				sqlId:'delete_screen_base_info',
				params:{sbi_cus_number:loginUser.cusNumber,sbi_screen_id:model.screen.sbi_screen_id}
			},{
				sqlId:'delete_setScreen_screen_scene',
				params:{ssn_cus_number:loginUser.cusNumber,ssn_screen_id:model.screen.sbi_screen_id}
			},{
				sqlId:'delete_setScreen_screen_scene_layout',
				params:{ssl_cus_number:loginUser.cusNumber,ssl_screen_id:model.screen.sbi_screen_id}
			}];
			db.updateByParamKey({
				request:request,
				success:function(data){
					queryScreen();
					queryScreenBase();
					$(".baseScreen").empty();
					tip.alert("删除成功");
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		});
	});
	/**
	 * 保存
	 */
	$("#add_edit_panel").find(".save").click(function(){
		if(!validate()){
			return;
		}
		dialog.close();
		if(isAdd){
			var request=[{
				sqlId:'insert_screen_base_info',
				params:[model.screen]
			}];
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					var seqId = data.data[0]['seqList'][0];
					request = [];
					var colNum = parseInt(model.screen.sbi_column_num);
					var rowNum = parseInt(model.screen.sbi_row_num);
					var num = 1;
					for(var i=0;i<colNum;i++){
						for(var j=0;j<rowNum;j++){
							var baseScreen = {
								'dcr_cus_number':loginUser.cusNumber,
								'dcr_screen_id':seqId,
								//'dcr_dept_id':model.screen.sbi_dept_id,
								'dcr_screen_win_id':num,
								'dcr_out_type':'',
								'dcr_signal_id':'',
								'dcr_decoder_id':'',
								'dcr_decoder_chl':'',
								'dcr_cut_seq':'',
								'dcr_width':model.screen.sbi_width,
								'dcr_height':model.screen.sbi_height,
								'dcr_screen_top':i,
								'dcr_screen_left':j,
								'dcr_crte_user_id':loginUser.userId,
								'dcr_updt_user_id':loginUser.userId
							}
							var args = {
								sqlId:'insert_screen_win_dtls',
								params:[baseScreen]
							}
							request.push(args);
							num++;
						}
					}
					db.updateByParamKey({
						request:request,
						success:function(data){
							
						},
						error:function(data,respMsg){
							tip.alert(respMsg);
						}
					});
					queryScreen();
					queryScreenBase();
					$(".baseScreen").empty();
					tip.close();
					tip.alert("保存成功");
				},
				error:function(data,respMsg){
					tip.alert(respMsg);
				}
			});
		}else{
			var request=[{
 				sqlId:'update_screen_base_info',
 				params:[{sbi_other_idnty:model.screen.sbi_other_idnty,
 						 sbi_screen_name:model.screen.sbi_screen_name,
 						 sbi_dept_id:model.screen.sbi_dept_id,
 						 sbi_width:model.screen.sbi_width,
 						 sbi_height:model.screen.sbi_height,
 						 sbi_updt_user_id:model.screen.sbi_updt_user_id,
 						 sbi_cus_number:model.screen.sbi_cus_number,
 						 sbi_screen_id:model.screen.sbi_screen_id}]
 			}];
			tip.saving();
 			db.updateByParamKey({
 				request:request,
 				success:function(data){
 					queryScreen();
 					$(".baseScreen").empty();
 					tip.close();
 					tip.alert("保存成功");
 				}
 			})
		}
	});
	/**
	 * 创建基础屏
	 */
	var col_base = null;//当前基础屏对象
	var curScreenBaseList = [];//当前大屏基础屏数据
	function createBaseScreen(){
		setCurScreenBaseList();
		var screen = model.screen;
		var screenBaseList = model.screenBaseList;
		var baseScreen = $(".baseScreen");
		baseScreen.empty();
		var colNum = screen.sbi_column_num;
		var rowNum = screen.sbi_row_num;
		var width = (100/parseInt(rowNum));
		var num = 1;
		for(var i=0;i<colNum;i++){
			var row = $("<div class='row'></div>");
			if(i == colNum-1){
				row = $("<div class='row s_bottom'></div>");
			}
			for(var j=0;j<rowNum;j++){
				if(j == rowNum-1){
					row.append("<div class='col-xs-1 col-base s_right' style='width: " + width + "%;'>" + num + "</div>");
				}else{
					row.append("<div class='col-xs-1 col-base' style='width: " + width + "%;'>" + num + "</div>");
				}
				num++;
			}
			baseScreen.append(row);
		}
		//加载已填写输出类型基础屏的样式
		baseScreen.find(".col-base").each(function(){
			for(var i=0;i<curScreenBaseList.length;i++){
				if(curScreenBaseList[i].dcr_screen_win_id == $(this).html() && curScreenBaseList[i].dcr_out_type != ""){
					$(this).addClass("isSave");
				}
			}
		})
		//基础屏点击事件
		baseScreen.find(".col-base").on("click",function(){
			col_base = $(this);
			model.screenBase.dcr_screen_win_id = $(this).html();
			model.screenBase.dcr_screen_id = model.screen.sbi_screen_id;
			for(var i=0;i<curScreenBaseList.length;i++){
				if(curScreenBaseList[i].dcr_screen_win_id == col_base.html()){
					model.screenBase.dcr_out_type = curScreenBaseList[i].dcr_out_type;
					model.screenBase.dcr_signal_id = curScreenBaseList[i].dcr_signal_id;
					model.screenBase.dcr_decoder_id = curScreenBaseList[i].dcr_decoder_id;
					model.screenBase.dcr_decoder_chl = curScreenBaseList[i].dcr_decoder_chl;
					model.screenBase.dcr_cut_seq = curScreenBaseList[i].dcr_cut_seq;
				}
			}
			dialog.open({targetId:'add_edit_base_panel',title:'编辑基础屏',h:"390"});
		});
	}
	/**
	 * 设置当前大屏基础屏数据
	 */
	function setCurScreenBaseList(){
		curScreenBaseList = [];
		var screen = model.screen;
		var screenBaseList = model.screenBaseList;
		for(var i=0;i<screenBaseList.length;i++){
			if(screenBaseList[i].dcr_screen_id == screen.sbi_screen_id){
				curScreenBaseList.push(screenBaseList[i]);
			}
		}
	}
	/**
	 * 编辑基础屏信息
	 */
	$("#add_edit_base_panel").find(".save").click(function(){
		if(!validate_base()){
			return;
		}
		dialog.close();
		var request=[{
			sqlId:'update_screen_win_dtls',
			params:model.screenBase
		}];
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				tip.close();
				tip.alert("保存成功");
				col_base.addClass("isSave");
				queryScreenBase();
				setCurScreenBaseList();
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	})
	/**
	 * 查询大屏基础信息
	 */
	function queryScreen(){
		db.query({
			request:{
				sqlId:'select_screen_base_info',
				whereId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.screenList = data;
				$("#screenGroup").show();
			}
		});
	}
	/**
	 * 查询大屏基础屏信息
	 */
	function queryScreenBase(){
		db.query({
			request:{
				sqlId:'select_screen_win_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.screenBaseList = data;
			}
		});
	}
	queryScreen();
	queryScreenBase();
	/**
	 * 大屏表单校验
	 */
	function validate(){
		var flag = true;
		if(!model.screen['sbi_screen_name']){
			tip.alert("请输入大屏名称");
			flag = false;
		}else if(!model.screen['sbi_other_idnty']){
			tip.alert("请输入大屏第三方编号");
			flag = false;
		}else if(!model.screen['sbi_dept_id']){
			tip.alert("请选择所属部门");
			flag = false;
		}else if(!model.screen['sbi_width']){
			tip.alert("请输入宽度");
			flag = false;
		}else if(isNaN(model.screen['sbi_width'])){
			tip.alert("宽度必须为数字");
			flag = false;
		}else if(model.screen['sbi_width'] < 0){
			tip.alert("宽度不能为负数");
			flag = false;
		}else if(!model.screen['sbi_height']){
			tip.alert("请输入高度");
			flag = false;
		}else if(isNaN(model.screen['sbi_height'])){
			tip.alert("高度必须为数字");
			flag = false;
		}else if(model.screen['sbi_height'] < 0){
			tip.alert("高度不能为负数");
			flag = false;
		}else if(!model.screen['sbi_column_num']){
			tip.alert("请输入行数");
			flag = false;
		}else if(isNaN(model.screen['sbi_column_num'])){
			tip.alert("行数必须为数字");
			flag = false;
		}else if(model.screen['sbi_column_num'] < 1){
			tip.alert("行数必须大于0");
			flag = false;
		}else if(model.screen['sbi_column_num'] > 15){
			tip.alert("行数不能超过15");
			flag = false;
		}else if(!model.screen['sbi_row_num']){
			tip.alert("请输入列数");
			flag = false;
		}else if(isNaN(model.screen['sbi_row_num'])){
			tip.alert("列数必须为数字");
			flag = false;
		}else if(model.screen['sbi_row_num'] < 1){
			tip.alert("列数必须大于0");
			flag = false;
		}else if(model.screen['sbi_row_num'] > 15){
			tip.alert("列数不能超过15");
			flag = false;
		}
		return flag;
 	}
	/**
	 * 基础屏表单校验
	 */
	function validate_base(){
		var flag = true;
		if(!model.screenBase['dcr_out_type']){
			tip.alert("请选择输出类型");
			flag = false;
		}else if(!model.screenBase['dcr_signal_id']){
			tip.alert("请选择信号源");
			flag = false;
		}else if(!model.screenBase['dcr_decoder_id']){
			tip.alert("请输入解码器编号");
			flag = false;
		}else if(!model.screenBase['dcr_decoder_chl']){
			tip.alert("请输入解码器通道号");
			flag = false;
		}else if(!model.screenBase['dcr_cut_seq']){
			tip.alert("请选择切割序号");
			flag = false;
		}
		return flag;
	}
});