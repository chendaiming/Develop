define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var treeSelect = require('ztree');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	var datepicker = require('frm/datepicker');
	var bootstrapMenu = require('bootstrapMenu');
	var dialog = require('frm/dialog');
	var utils = require('frm/hz.utils'); 
	
	var scheduleTree = null;
	var deptPoliceTree = null;
	var handleType = null;
	
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#scheduleManage',
		data:{
			orderList:[],
			jobList:[],
			dateList:[],
			modeList:[],
			modeData:[],
			scheduleList:[],
			peopleList:[],
			policeList:[],
			searchTree_sd:'',
			searchTree_dp:'',
			schedule:{ 
				'scd_cus_number':loginUser.cusNumber,
				'scd_start_date':'',
				'scd_end_date':'',
				'scd_mode_idnty':'',
				'scd_mode_name':'',
				'scd_dept_id':'',
				'mbd_mode_idnty':''
			},
			police:{
				'pbd_police_id':'',
				'name':'',
				'pbd_pstn_name':'',
				'pbd_drptmnt':'',
				'pbd_talk_num':''
			},
			parentNode:{}
		},
		methods:{
			cloneOrder:function(order){
				var orderId = order.id;
				var jobIdList = order.jobIds.split("_");
				for(var i=0;i<jobIdList.length;i++){
					clonePeople(orderId,jobIdList[i]);
				}
			},
			cloneJob:function(job){
				var orderId = job.orderId;
				var jobId = job.id;
				clonePeople(orderId,jobId);
			},
			exportExcel:function(){
				//alert(JSON.stringify(model.orderList));
				//alert(JSON.stringify(model.jobList));
				//alert(JSON.stringify(model.dateList));
				//return;
				if(handleType == null){
					tip.alert("请选择值班模板或排班");
					return;
				}
				if(!validate()){
					return;
				}
				var title = handleType == "add" ? "值班模板" : "值班信息";
				var fileName = model.schedule.scd_start_date + "~" + model.schedule.scd_end_date 
							 + loginUser.deptName + title;
				var request = {
					orderList: model.orderList,
					jobList: model.jobList,
					dateList: model.dateList,
					fileName: fileName
				};
				tip.saving("正在导出中...");
				utils.ajax('dutyCtrl/exportExcel', {'args': JSON.stringify(request)}, function(json){
					var result = null;
					if(typeof(json) == "string"){
						result = JSON.parse(json.result);
					}else{
						result = json.result;
					}
					var pathName = json.result;
					tip.close();
					request = {'pathName': encodeURI(encodeURI(pathName))};
					var action = "../../../dutyCtrl/downloadExcel?args=" + JSON.stringify(request);
					$("#dloadExcel").remove();
					var form = $("<form id='dloadExcel' method='post' action='" + action + "'></form>");
					$("html").append(form);
					$("#dloadExcel").submit();
				}, function(){
				});
			},
			openImportPanel:function(){
				if(handleType != "add"){
					tip.alert("请选择值班模板");
				}else if(handleType == "add" && validate()){
					$("#file").val("");
					dialog.open({targetId:'import_panel',title:'导入值班表',w: "400",h:"115"});
				}
			},
			importExcel:function(){
				importExcel();
			}
		}
	});
	/**
	 * 导入已编排的值班表excel
	 */
	function importExcel(){
		var fd = new FormData();
		var file = document.getElementById("file").files[0];
		fd.append("file",file);
		$.ajax({
			url: ctx+"dutyCtrl/importExcel",
			type: "post",
			data: fd,
			cache: false,
			processData: false,
			contentType: false,
			success: function(data){
				if(typeof(data) == "string"){
					data = JSON.parse(data);
				}
				//alert(JSON.stringify(data));
				$(".content table").find("tr").each(function(i){
					var list = data[i];
					$(this).find(".peopleTd").each(function(j){
						$(this).empty();
						var name = list[j].name;
						if(name){
							var nameList = [];
							if(name.indexOf("#") != -1){
								nameList = name.split("#");
							}else{
								nameList[0] = name;
							}
							var policeList = model.policeList;
							var peopleList = [];
							for(var i=0;i<nameList.length;i++){
								for(var j=0;j<policeList.length;j++){
									var policeName = policeList[j].pbd_police_name;
									if(nameList[i].replace(/\s+/g, "") == policeName.replace(/\s+/g, "")){
										peopleList.push({
											'id': policeList[j].pbd_user_id,
											'name': policeName
										});
									}
								}
							}
							for(var i=0;i<peopleList.length;i++){
								var div = $("<div class='name' title='" + peopleList[i].name + "' " +
									    "name='" + peopleList[i].name + "' value='" + peopleList[i].id + "'>" 
									    + peopleList[i].name + "</div>");
								$(this).append(div);
							}
							resizeTable_body();
						}
					})
				})
			}
		})
		dialog.close();
	}
	/**
	 * 导出excel
	 */
	function tableToExcel(table,name){
		var uri = 'data:application/vnd.ms-excel;base64,'
			  , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="vnd.ms-excel.numberformat:@">{table}</table></body></html>'
			  , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); }
			  , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };
			if (!table.nodeType) table = document.getElementById(table);
			var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
			window.location.href = uri + base64(format(template, ctx));
	}
	/**
	 * 初始化左侧值班类别部门模板编排信息
	 * @returns
	 */
	function initScheduleTree(){
		var scheduleList = [];
		var setting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			edit: {
				enable: false,
				drag: {
					isCopy: true,
					isMove: true,
					prev: function(treeId, nodes, targetNode){
						return !targetNode.isParent;
					},
					next: function(treeId, nodes, targetNode){
						return !targetNode.isParent;
					},
					inner: false
				},
				showRemoveBtn:false,
				showRenameBtn:false,
			},
			callback:{
				onDrop:function(event, treeId, treeNodes, targetNode, moveType, isCopy){
					return true;
				},
				onClick:function(event,treeId,treeNode){
					var type = treeNode.type;
					if(type == "mode"){
						handleType = null;
						model.orderList = [];
						model.jobList = [];
						model.dateList = [];
						model.modeData = [];
						model.schedule.scd_start_date = "";
						model.schedule.scd_end_date = "";
						model.schedule.mbd_mode_idnty = "";
						model.schedule.scd_mode_idnty = "";
						model.schedule.scd_mode_name = "";
						model.schedule.scd_dept_id = "";
						var node = null;
						vue.nextTick(function () {
							resizeTable_head();
							resizeTable_body();
						})
						model.parentNode = treeNode.getParentNode().getParentNode();
						model.schedule.mbd_mode_idnty = treeNode.id.split("_")[1];
						model.schedule.scd_dept_id = treeNode.pid.split("_")[1];
						loadScheduleMode();
						handleType = "add";
						loadScroll();
					}
				},
				onDblClick:function(event,treeId,treeNode){
					var type = treeNode.type;
					if(type == "schedule"){
						handleType = null;
						model.orderList = [];
						model.jobList = [];
						model.dateList = [];
						model.modeData = [];
						model.schedule.scd_start_date = "";
						model.schedule.scd_end_date = "";
						model.schedule.mbd_mode_idnty = "";
						model.schedule.scd_mode_idnty = "";
						model.schedule.scd_mode_name = "";
						model.schedule.scd_dept_id = "";
						var node = null;
						vue.nextTick(function () {
							resizeTable_head();
							resizeTable_body();
						})
						model.parentNode = treeNode.getParentNode();
						model.schedule.scd_mode_idnty = treeNode.id.split("_")[1];
						model.schedule.scd_mode_name = treeNode.name;
						model.schedule.scd_dept_id = treeNode.pid.split("_")[1];
						loadScheduleModePeople();
						handleType = "update";
						loadScroll();
					}
				}
			}
		}
		//loginUser.deptId = 3044;
		/**
		 * 查询值班编排树信息
		 */
		db.query({
			request: {
				sqlId: 'select_dty_category_dept_tree2',
				params: [loginUser.cusNumber,loginUser.deptId]
			},
			success: function (data) {
				//data.splice(0,1);
				for(var i=0;i<data.length;i++){
					var type = data[i].type;
					if(type == "dept"){
						data.push({id: "mf_" + data[i].id.split("_")[1], 
								   name: "值班模板",
								   pid: data[i].id,
								   type: "modeFolder"});
						/*data.push({id: "sf_" + data[i].id.split("_")[1],
								   name: "值班编排",
								   pid: data[i].id,
								   type: "scheduleFolder"});*/
					}
				}
				scheduleList = data;
				db.query({
					request: {
						sqlId: 'select_dty_mode_schedule_tree',
						params: [loginUser.cusNumber,scheduleList[0].pid.split("_")[1],loginUser.deptId,loginUser.cusNumber,loginUser.deptId]
					},
					success: function (data) {
						for(var i=0;i<scheduleList.length;i++){
							var type = scheduleList[i].type;
							if(type == "modeFolder"){
								for(var j=0;j<data.length;j++){
									type = data[j].type;
									if(type == "mode"){
										scheduleList.push({id: data[j].id, 
														   name: data[j].name, 
														   pid: scheduleList[i].id,
														   type: data[j].type});
									}
								}
							}
						}
						for(var i=0;i<data.length;i++){
							var type = data[i].type;
							if(type == "schedule"){
								scheduleList.push(data[i]);
							}
						}
						scheduleTree = $.fn.zTree.init($('#scheduleTree'),setting,scheduleList);
						scheduleTree.expandNode(scheduleTree.getNodes()[0],true);
						//scheduleTree.expandNode(scheduleTree.getNodes()[0].children[0],true);
					}
				});
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		  * 搜索tree监听函数
		  */
		model.$watch('searchTree_sd',function(){
			 treeUtil.searchTree('name',model.searchTree_sd,'scheduleTree',scheduleList,setting);
		});
		/**
		 * 加载值班编排模板
		 */
		function loadScheduleMode(){
			model.orderList = [];
			model.jobList = [];
			model.dateList = [];
			model.modeData = [];
			var list = model.modeList;
			var orderStrList = [];
			var modeLen = 0;
			for(var i=0;i<list.length;i++){
				if(list[i].mbd_mode_idnty == model.schedule.mbd_mode_idnty){
					model.modeData.push(list[i]);
					modeLen++;
					var orderStr = list[i].mbd_shift_id +""
								 + list[i].mbd_shift_name +""
								 + list[i].mbd_shift_start_time +""
								 + list[i].mbd_shift_end_time;
					if(JSON.stringify(orderStrList).indexOf(orderStr) != -1){
						var orderList = model.orderList;
						for(var j=0;j<orderList.length;j++){
							if(list[i].mbd_shift_id == orderList[j].id){
								orderList[j].col = orderList[j].col + 1;
								orderList[j].jobIds += "_" + list[i].mbd_job_id;
							}
						}
					}else{
						orderStrList.push(orderStr);
						model.orderList.push({id: list[i].mbd_shift_id,
											  name: list[i].mbd_shift_name,
											  start_time: list[i].mbd_shift_start_time,
											  end_time: list[i].mbd_shift_end_time,
											  col: 1,
											  jobIds: list[i].mbd_job_id});
					}
					model.jobList.push({id: list[i].mbd_job_id,
										name: list[i].mbd_job_name,
										orderId: list[i].mbd_shift_id,
										stimeFlag: list[i].sbd_stime_flag,
										startTime: list[i].mbd_shift_start_time,
										etimeFlag: list[i].sbd_etime_flag,
										endTime: list[i].mbd_shift_end_time,
										deptId: model.schedule.scd_dept_id});
				}
			}
			var stratDate = model.schedule.scd_start_date;
			var endDate = model.schedule.scd_end_date;
			var diff = dateDiff(stratDate,endDate);
			for(var i=0;i<=diff;i++){
				var peopleList = [];
				for(var j=0;j<modeLen;j++){
					peopleList.push({flag: 1});
				}
				model.dateList.push({name: stratDate, className: "date", peopleList: peopleList});
				stratDate = addDate(fmtStrDate(stratDate));
			}
		}
		/**
		 * 加载值班编排模板、值班人员
		 */
		function loadScheduleModePeople(){
			model.orderList = [];
			model.jobList = [];
			model.dateList = [];
			model.modeData = [];
			var list = model.scheduleList;
			var orderStrList = [];
			var stratDate = null;
			var endDate = null;
			for(var i=0;i<list.length;i++){
				var deptId = list[i].scd_dept_id;
				if(deptId == model.schedule.scd_dept_id && list[i].scd_mode_idnty == model.schedule.scd_mode_idnty){
					model.modeData.push(list[i]);
					stratDate = list[i].scd_start_date;
					endDate = list[i].scd_end_date;
					var orderStr = list[i].scd_shift_id +""
								 + list[i].scd_shift_name +""
								 + list[i].scd_shift_start_time +""
								 + list[i].scd_shift_end_time;
					if(JSON.stringify(orderStrList).indexOf(orderStr) != -1){
						var orderList = model.orderList;
						for(var j=0;j<orderList.length;j++){
							if(list[i].scd_shift_id == orderList[j].id){
								orderList[j].col = orderList[j].col + 1;
								orderList[j].jobIds += "_" + list[i].scd_job_id;
							}
						}
					}else{
						orderStrList.push(orderStr);
						model.orderList.push({id: list[i].scd_shift_id,
											  name: list[i].scd_shift_name,
											  start_time: list[i].scd_shift_start_time,
											  end_time: list[i].scd_shift_end_time,
											  col: 1,
											  jobIds: list[i].scd_job_id});
					}
					model.jobList.push({id: list[i].scd_job_id,
										name: list[i].scd_job_name,
										orderId: list[i].scd_shift_id,
										stimeFlag: list[i].sbd_stime_flag,
										startTime: list[i].scd_shift_start_time,
										etimeFlag: list[i].sbd_etime_flag,
										endTime: list[i].scd_shift_end_time,
										deptId: model.schedule.scd_dept_id});
				}
			}
			model.schedule.scd_start_date = stratDate;
			model.schedule.scd_end_date = endDate;
			loadDateList();
		}
	}
	initScheduleTree();
	/**
	 * 确定
	 */
	$("#dateForm").find(".save").click(function(){
		if(!validate()){
			return;
		}
		if(model.orderList.length == 0){
			tip.alert("请选择一个模板或排班");
			return;
		}
		var flag = true;
		var stratDate = model.schedule.scd_start_date;
		var endDate = model.schedule.scd_end_date;
		var childrenList = model.parentNode.children;
		for(var i=0;i<childrenList.length;i++){
			var type = childrenList[i].type;
			var modeId = childrenList[i].id.split("_")[1];
			if(type == "schedule" && modeId != model.schedule.scd_mode_idnty){
				var name = childrenList[i].name;
				var startDate_t = name.split("~")[0];
				var endDate_t = name.split("~")[1];
				var diff = dateDiff(startDate_t,endDate_t);
				for(var j=0;j<=diff;j++){
					if(stratDate <= startDate_t && endDate >= startDate_t){
						flag = false;
						tip.alert(startDate_t + "已排班，请重新选择值班日期");
					    model.schedule.scd_start_date = "";
					    model.schedule.scd_end_date = "";
						break;
					}
					startDate_t = addDate(fmtStrDate(startDate_t));
				}
			}
		}
		if(!flag){
			return;
		}
		loadDateList();
	})
	/**
	 * 加载值班天数
	 */
	function loadDateList(){
		model.dateList = [];
		var stratDate = model.schedule.scd_start_date;
		var endDate = model.schedule.scd_end_date;
		var diff = dateDiff(stratDate,endDate);
		var peopleList = model.peopleList;
		var jobList = model.jobList;
		var dateTime = utils.formatterDate(new Date(),"yyyy-mm-dd hh:mi:ss");
		for(var i=0;i<=diff;i++){
			var list1 = [];
			for(var j=0;j<jobList.length;j++){
				var flag = false;
				var list2 = [];
				var startTime = jobList[j].startTime + ":00";
				var endTime = jobList[j].endTime + ":00";
				var s_date = stratDate;
				var e_date = stratDate;
				if(jobList[j].stimeFlag > 1){
					s_date = addDate(fmtStrDate(s_date));
				}
				if(jobList[j].etimeFlag > 1){
					e_date = addDate(fmtStrDate(e_date));
				}
				startTime = s_date + " " +  startTime;
				endTime = e_date + " " +  endTime;
				for(var k=0;k<peopleList.length;k++){
					var date = peopleList[k].ped_date;
					var deptId = peopleList[k].ped_dept_id;
					var orderId = peopleList[k].ped_shift_id;
					var jobId = peopleList[k].ped_job_id;
					var id = peopleList[k].ped_id;
					var name = peopleList[k].ped_name;
					if(date == stratDate && deptId == jobList[j].deptId 
							&& orderId == jobList[j].orderId && jobId == jobList[j].id){
						list2.push({'id': id, 'name': name});
						flag = true;
					}
				}
				var flagNum = 1;
				if(flag){
					flagNum = 2;
				}
				if(handleType == "add"){
					list1.push({'flag': flagNum, 'list': list2, 'orderId': jobList[j].orderId, 'jobId': jobList[j].id});
				}else{
					if(endTime < dateTime){
						list1.push({'flag': flagNum, 'className': "top", 'list': list2, 'orderId': jobList[j].orderId, 'jobId': jobList[j].id});
					}else if(startTime <= dateTime && endTime >= dateTime){
						list1.push({'flag': flagNum, 'className': "mid", 'list': list2, 'orderId': jobList[j].orderId, 'jobId': jobList[j].id});
					}else{
						list1.push({'flag': flagNum, 'list': list2, 'orderId': jobList[j].orderId, 'jobId': jobList[j].id});
					}
				}
			}
			model.dateList.push({'name': stratDate, 'week': getWeek(stratDate), 'className': "date", 'peopleList': list1});
			stratDate = addDate(fmtStrDate(stratDate));
		}
		vue.nextTick(function () {
			resizeTable_head();
			resizeTable_body();
		})
	}
	/**
	 * 查询值班模板信息
	 */
	function queryMode(){
		db.query({
			request:{
				sqlId:'select_dty_mode_base_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.modeList = data;
			}
		});
	}
	/**
	 * 查询值班编排模板信息
	 */
	function queryScheduleMode(){
		db.query({
			request:{
				sqlId:'select_dty_schedule_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.scheduleList = data;
			}
		});
	}
	/**
	 * 查询值班编排人员信息
	 */
	function querySchedulePeople(){
		db.query({
			request:{
				sqlId:'select_dty_people_dtls',
				whereId: 0,
				orderId: 0,
				params:[loginUser.cusNumber]
			},
			async:false,
			success:function(data){
				model.peopleList = data;
			}
		});
	}
	/**
	 * 查询警员信息
	 */
	function queryPoliceInfo(){
		db.query({
			request:{
				sqlId:'select_dty_police_base_dtls',
				whereId: 0,
				params:[loginUser.cusNumber]
			},
			success:function(data){
				model.policeList = data;
			}
		});
	}
	queryMode();
	queryScheduleMode();
	querySchedulePeople();
	queryPoliceInfo();
	/**
	 * 初始化左侧部门民警信息
	 * @returns
	 */
	function initDeptPoliceTree(){ 
		var deptPoliceList = [];
		var setting = {
			path:'../../../libs/ztree/css/zTreeStyle/img/',
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
					isCopy: true,
					isMove: true,
					prev: false,
					next: false,
					inner: false
				},
				showRemoveBtn:false,
				showRenameBtn:false,
			},
			callback:{
				onDrop:function(e, treeId, treeNodes, targetNode, moveType, isCopy){
					var me = $(e.target);
					$("div.content").find("td").removeClass("isMoveUp");
					var parentClassId = me.parent().parent().parent().parent().attr('class');
					var parentClassId_2 = me.parent().parent().parent().parent().parent().attr('class');
					var classId = me.attr('class');
					var flag = false;
					if(parentClassId == "content" && classId != "name"){
						flag = true;
					}else if(parentClassId_2 == "content" && classId == "name"){
						flag = true;
						me = me.parent();
					}
					if(me.attr("class") && me.attr("class").indexOf("top") != -1){
						return false;
					}
					me.find(".name").each(function(){
						var name = $(this).attr("name");
						if(name == treeNodes[0].name){
							tip.alert("值班人员[ " + name + " ]重复");
							flag = false;
						}
					})
					if(flag){
						var div = $("<div class='name' title='" + treeNodes[0].name + "' " +
								    "name='" + treeNodes[0].name + "' value='" + treeNodes[0].id.split("_")[1] + "'>" 
								    + treeNodes[0].name + "</div>");
						me.append(div);
						resizeTable_body();
					}
					deptPoliceTree.cancelSelectedNode();
				},
				beforeDrag:function(treeId, treeNodes){
					return treeNodes[0].type == "police";
				},
				onDragMove:function(e, treeId, treeNodes){
					var me = $(e.target);
					$("div.content").find("td").removeClass("isMoveUp");
					var parentClassId = me.parent().parent().parent().parent().attr('class');
					var parentClassId_2 = me.parent().parent().parent().parent().parent().attr('class');
					var classId = me.attr('class');
					var flag = false;
					if(parentClassId == "content" && classId != "name"){
						flag = true;
					}else if(parentClassId_2 == "content" && classId == "name"){
						flag = true;
						me = me.parent();
					}
					if(me.attr("class") && me.attr("class").indexOf("top") != -1){
						return false;
					}
					if(flag){
						me.addClass("isMoveUp");
					}
				},
				onClick:function(event,treeId,treeNode){
				
				}
			}
		}
		/**
		 * 查询信息
		 */
		db.query({
			request: {
				sqlId: 'select_drptmnt_police_tree',
				params: [loginUser.cusNumber,loginUser.cusNumber]
			},
			success: function (data) {
				deptPoliceList = data;
				deptPoliceTree = $.fn.zTree.init($('#deptPoliceTree'),setting,deptPoliceList);
				deptPoliceTree.expandNode(deptPoliceTree.getNodes()[0],true);
				var list = deptPoliceTree.getNodes()[0].children;
				for(var i=0;i<list.length;i++){
					var deptId = list[i].id.split("_")[1];
					if(loginUser.deptId == deptId){
						deptPoliceTree.expandNode(list[i],true);
					}
				}
			},
			error: function (code, msg) {
				console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
			}
		});
		/**
		  * 搜索tree监听函数
		  */
		model.$watch('searchTree_dp',function(){
			 treeUtil.searchTree('name',model.searchTree_dp,'deptPoliceTree',deptPoliceList,setting);
		});
	}
	initDeptPoliceTree();
	/**
	 * 保存
	 */
	$(".bottom").find(".save").click(function(){
		if(!handleType){
			tip.alert("请选择一个模板或排班");
			return;
		}
		if(!validate()){
			return;
		}
		if(handleType == "add"){
			var list = model.modeData;
			if(!list || list.length == 0){
				return;
			}
			if(!tableValidate()){
				return;
			}
			var date1 =  model.schedule.scd_start_date.split('-');
			// 得到月数
			date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
			// 拆分年月日
			date2 = model.schedule.scd_end_date.split('-');
			// 得到月数
			date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
			var m = Math.abs(date1 - date2);
			if(m > 0){
				var date = model.schedule.scd_start_date;
				var isEnd = false;
				for(var i=0;i<=m;i++){
					var yyyy = date.split('-')[0];
					var mm = date.split('-')[1];
					var startDate = null;
					var endDate = null;
					if(i == 0){
						startDate = model.schedule.scd_start_date;
					}else{
						startDate = yyyy + "-" + mm + "-01";
					}
					if(i == m){
						isEnd = true;
						endDate = model.schedule.scd_end_date;
					}else{
						var curMonthDays = new Date(yyyy, mm, 0).getDate();
						endDate = yyyy + "-" + mm + "-" + curMonthDays;
					}
					addDutyData(list,startDate,endDate,isEnd);
					//alert(startDate);
					//alert(endDate);
					//alert("本月共有 "+ curMonthDays +" 天");
					date = addMonth(fmtStrDate(date));
				}
			}else{
				addDutyData(list,model.schedule.scd_start_date,model.schedule.scd_end_date,true);
			}
		}else{
			var list = model.modeData;
			var modeName = model.schedule.scd_start_date + "~" + model.schedule.scd_end_date;
			var request = [{
				sqlId:'update_dty_schedule_dtls',
				params:[{'scd_start_date': model.schedule.scd_start_date,'scd_end_date': model.schedule.scd_end_date,
					     'scd_mode_name': modeName,'scd_cus_number': loginUser.cusNumber,
					     'scd_mode_idnty': model.schedule.scd_mode_idnty}]
			},{
				sqlId:'delete_dty_people_dtls',
				params:[{'ped_cus_number': loginUser.cusNumber,'ped_mode_idnty': list[0].scd_mode_idnty}]
			}];
			$("div.content table").find("tr").each(function(){
				var date = null;
				$(this).find("td").each(function(i){
					if(i == 0){
						date = $(this).attr("date");
					}else{
						var relationId = list[i-1].scd_relation_id;
						$(this).find(".name").each(function(j){
							var id = $(this).attr("value");
							var name = $(this).attr("name");
							request.push({
								sqlId:'insert_dty_people_dtls',
								params:[{'ped_cus_number': loginUser.cusNumber,'ped_relation_id': relationId,
								         'ped_date': date,'ped_id': id,'ped_name': name,
								         'ped_seq': j,'ped_crte_user_id': loginUser.userId,
								         'ped_updt_user_id': loginUser.userId,'scd_cus_number': loginUser.cusNumber,
								         'scd_relation_id': relationId}]
							});
						});
					}
				});
			});
			tip.saving();
			db.updateByParamKey({
				request:request,
				success:function(data){
					queryScheduleMode();
					querySchedulePeople();
					initScheduleTree();
					tip.close();
					tip.alert("保存成功");
					handleType = null;
				}
			});
		}
	})
	/**
	 * 添加值班编排信息
	 */
	function addDutyData(list,startDate,endDate,isEnd){
		var startDateN = startDate.replace("-","").replace("-","").replace("-","");
		var endDateN = endDate.replace("-","").replace("-","").replace("-","");
		var modeIdnty = list[0].mbd_mode_idnty + "#" + model.schedule.scd_dept_id + "#" + startDateN + "#" + endDateN;
		var modeName = startDate + "~" + endDate;
		var request = [];
		for(var i=0;i<list.length;i++){
			request.push({
				sqlId:'insert_dty_schedule_dtls',
				params:[{'scd_cus_number': loginUser.cusNumber,'scd_start_date': startDate,
				         'scd_end_date': endDate,'scd_mode_idnty': modeIdnty,
				         'scd_mode_name': modeName,'scd_category_id': list[i].mbd_category_id,
				         'scd_shift_id': list[i].mbd_shift_id,'scd_shift_name': list[i].mbd_shift_name,
				         'scd_shift_start_time': list[i].mbd_shift_start_time,'scd_shift_end_time': list[i].mbd_shift_end_time,
				         'scd_job_id': list[i].mbd_job_id,'scd_job_name': list[i].mbd_job_name,
				         'scd_dept_id': model.schedule.scd_dept_id,'scd_crte_user_id': loginUser.userId,
				         'scd_updt_user_id': loginUser.userId}]
			});
		}
		tip.saving();
		db.updateByParamKey({
			request:request,
			success:function(data){
				var request = [];
				var dataList = data.data;
				$("div.content table").find("tr").each(function(){
					var date = null;
					var flag = false;
					$(this).find("td").each(function(i){
						if(i == 0){
							date = $(this).attr("date");
							if(date >= startDate && date <= endDate){
								flag = true;
							}
						}else{
							if(flag){
								var seqId = dataList[i-1]['seqList'][0];
								$(this).find(".name").each(function(j){
									var id = $(this).attr("value");
									var name = $(this).attr("name");
									request.push({
										sqlId:'insert_dty_people_dtls',
										params:[{'ped_cus_number': loginUser.cusNumber,'ped_relation_id': seqId,
										         'ped_date': date,'ped_id': id,'ped_name': name,
										         'ped_seq': j,'ped_crte_user_id': loginUser.userId,
										         'ped_updt_user_id': loginUser.userId,'scd_cus_number': loginUser.cusNumber,
										         'scd_relation_id': seqId}]
									});
								});
							}
						}
					});
				});
				db.updateByParamKey({
					request:request,
					success:function(data){
						if(isEnd){
							querySchedulePeople();
							queryScheduleMode();
							initScheduleTree();
							tip.close();
							tip.alert("保存成功");
							handleType = null;
						}
					}
				});
				//model.schedule.scd_start_date = "";
				//model.schedule.scd_end_date = "";
				//model.orderList = [];
				//model.jobList = [];
				//model.dateList = [];
				//model.modeData = [];
			}
		});
	}
	
	/**
	 * 删除
	 */
	$(".bottom").find(".del").click(function(){
		if(handleType != "update"){
			tip.alert("请选择一个排班");
			return;
		}
		tip.confirm("确定删除[ " + model.schedule.scd_mode_name + " ]的排班吗？",function(){
			var request = [{
				sqlId:'delete_dty_people_dtls',
				params:[{'ped_cus_number': loginUser.cusNumber,'ped_mode_idnty': model.schedule.scd_mode_idnty}]
			},{
				sqlId:'delete_dty_schedule_dtls',
				params:[{'scd_cus_number': loginUser.cusNumber,'scd_mode_idnty': model.schedule.scd_mode_idnty}]
			}];
			db.updateByParamKey({
				request:request,
				success:function(data){
					tip.alert("删除成功");
					model.schedule.scd_start_date = "";
					model.schedule.scd_end_date = "";
					model.orderList = [];
					model.jobList = [];
					model.dateList = [];
					model.modeData = [];
					handleType = null;
					queryScheduleMode();
					querySchedulePeople();
					initScheduleTree();
				}
			});
		});
	});
	/**
	 * 表单校验
	 */
	function validate(){
		var flag = true;
		if(!model.schedule['scd_start_date']){
			tip.alert("请选择开始日期");
			flag = false;
		}else if(!model.schedule['scd_end_date']){
			tip.alert("请选择结束日期");
			flag = false;
		}else if(model.schedule['scd_start_date'] > model.schedule['scd_end_date']){
			tip.alert("开始日期不能大于结束日期");
			flag = false;
		}
		return flag;
 	}
	/**
	 * 值班表校验
	 */
	function tableValidate(){
		var flag = true;
		$("div.content table").find("tr").each(function(){
			var date = null;
			$(this).find("td").each(function(i){
				if(i == 0){
					date = $(this).attr("date");
				}else{
					var nameList = [];
					$(this).find(".name").each(function(j){
						nameList.push($(this).attr("name"));
					})
					$(this).find(".name").each(function(j){
						var name = $(this).attr("name");
						var num = 0;
						for(var k=0;k<nameList.length;k++){
							if(name == nameList[k]){
								num++;
							}
						}
						if(num > 1){
							tip.alert(date + "值班人员[ " + name + " ]重复，请删除");
							flag = false;
							return false;
						}
					})
					if(!flag){
						return false;
					}
				}
			})
			if(!flag){
				return false;
			}
		})
		return flag;
	}
	/**
	 * 右击菜单
	 */
	function loadMenu(){
		var menu = new BootstrapMenu('div.content .name', {
			  fetchElementData: function(row) {
				  $("div.content .name").removeClass("rightClick");
		          row.addClass("rightClick");
		          row.isDelete = true;
		          var className = row.parent().attr("class");
		          if(className){
			          /*if(className.indexOf("top") != -1 || className.indexOf("mid") != -1){
			        	  row.isDelete = false;
			          }*/
			          if(className.indexOf("top") != -1){
			        	  row.isDelete = false;
			          }
		          }
		    	  return row;
	    	  },
		      actions: [{
		        name: '删除',
		        onClick: function(row) {
		        	row.remove();
		        	resizeTable_body();
		        },
		        isEnabled: function(row) {
		        	return row.isDelete;
		        }
		      }, {
		        name: '详情',
		        onClick: function(row) {
		        	peopleInfo(row);
		        },
		        isEnabled: function(row) {
		        	return true;
		        }
		      }]
	    });
		$(document).click(function(){
			 $("div.content .name").removeClass("rightClick");
		});
		/**
		 * 值班人员详情
		 */
		function peopleInfo(row){
			var list = model.policeList;
			var peopleId = row.attr("value");
			var peopleName = row.attr("name");
			for(var i=0;i<list.length;i++){
				if(peopleId == list[i].pbd_user_id){
					model.police.pbd_police_id = list[i].pbd_police_id;
					model.police.name = peopleName;
					model.police.pbd_pstn_name = list[i].pbd_pstn_name;
					model.police.pbd_drptmnt = list[i].odd_name;
					model.police.pbd_talk_num = list[i].pbd_talk_num;
					if(list[i].pbd_img)
						$("#imageview img").attr("src",list[i].pbd_img);
					else
						$("#imageview img").attr("src","image/police.jpg");
				}
			}
			dialog.open({targetId:'info_panel',title:'详情',w: "430",h:"229"});
		}
	}
	loadMenu();
	/**
	 * 加载滚动事件
	 */
	function loadScroll(){
		$("div.content").scroll(function(){
			var scrollTop = $(this).scrollTop();
			var scrollLeft = $(this).scrollLeft();
			$("div.right").css("top","-" + scrollTop);
			$("div.head").css("left","-" + scrollLeft);
		})
	}
	/**
	 * 同步表格头td高宽度
	 */
	function resizeTable_head(){
		$("div.title table").find("td").each(function(i){
			var w = $("div.head table").children().eq(0).children().eq(i).children().eq(0).width();
			var h = $("div.head table").children().eq(0).children().eq(i).children().eq(0).height();
			$(this).width(w);
			$(this).height(h);
		})
	}
	/**
	 * 同步表格内容td高宽度
	 */
	function resizeTable_body(){
		$("div.content table").width($("div.head table").width());
		$("div.right table").find("td").each(function(i){
			var w = $("div.content table").children().eq(0).children().eq(i).children().eq(0).width();
			var h = $("div.content table").children().eq(0).children().eq(i).children().eq(0).height();
			$(this).width(w);
			$(this).height(h);
		})
	}
	/**
	 * 窗口大小发生改变，表格自适应大小
	 */
	$(window).resize(function(){
		var w = $("div.head").parent().width();
		var w_h = $("div.head").width();
		if(w > w_h){
			$("div.head").width(w);
		}else{
			$("div.head").css("width","auto");
		}
		resizeTable_head();
		resizeTable_body();
	})
	/**
	 * 值班人员周期复制
	 */
	function clonePeople(orderId,jobId){
		var startNum = -1;
		var endNum = $("div.content table").find("td[orderId='" + orderId + "'][jobId='" + jobId + "']").length;
		$("div.content table").find("td[orderId='" + orderId + "'][jobId='" + jobId + "']").each(function(i){
			var nameLen = $(this).find(".name").length;
			if(nameLen == 0 && startNum == -1){
				startNum = i;
			}else if(nameLen > 0){
				startNum = -1;
			}
		})
		var list = [];
		var index = 0;
		if(startNum != -1){
			$("div.content table").find("td[orderId='" + orderId + "'][jobId='" + jobId + "']").each(function(i){
				if(i < startNum){
					var names = $(this).html();
					list.push(names);
				}else if(i >= startNum){
					$(this).append(list[index]);
					index++;
					if(index == list.length){
						index = 0;
					}
				}
			})
		}
		resizeTable_body();
	}
	/**
	 * 返回两个日期之间相差的天数
	 */
	function dateDiff(sDate1,sDate2){
	    var aDate,oDate1,oDate2,iDays  
	    aDate = sDate1.split("-")  
	    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	    aDate = sDate2.split("-")  
	    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);
	    return iDays;
	}
	/**
	 * 字符串类型转Date类型
	 */
	function fmtStrDate(str){
		str = str.replace(/-/g,"/");
		var date = new Date(str);
		return date;
	}
	/**
	 * 日期天数加1
	 */
	function addDate(date) {
		date = date.getTime() + 1 * 24 * 60 * 60 * 1000;
	    var result = new Date(date);
	    var month = (result.getMonth() + 1);
	    if(month < 10){
	    	month = "0" + month;
	    }
	    var day = result.getDate();
	    if(day < 10){
	    	day = "0" + day;
	    }
	    return result.getFullYear() + "-" + month + "-" + day;
	}
	/**
	 * 日期月份加1
	 */
	function addMonth(date) {
	    var result = new Date(date.getTime());
	    result.setMonth(result.getMonth()+1);
	    var month = (result.getMonth() + 1);
	    if(month < 10){
	    	month = "0" + month;
	    }
	    var day = result.getDate();
	    if(day < 10){
	    	day = "0" + day;
	    }
	    return result.getFullYear() + "-" + month + "-" + day;
	}
	/**
	 * 根据日期获取星期
	 */
	function getWeek(str){
		var week = null;
		var day = fmtStrDate(str).getDay();
		if (day == 0) {  
			week = "星期日";  
		}else if(day == 1) { 
			week = "星期一";
		}else if(day == 2) {  
			week = "星期二";
		}else if(day == 3) {  
			week = "星期三";
		}else if(day == 4) {  
			week = "星期四";
		}else if(day == 5) {
			week = "星期五";  
		}else if(day == 6) { 
			week = "星期六";
		}  
		return week;
	}
});