define(function(require){	
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var select = require('frm/select');
	var treeSelect = require('ztree');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils');
	var datepicker = require('frm/datepicker');
	var chart = require('echarts');
	
	var peopleId = parent.$('#peopleId').val();
	var stratDate = parent.$("#stratDate").val();
	var endDate = parent.$("#endDate").val();
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#dutyRecordManage',
		data:{
			cusNumber: loginUser.cusNumber,
			peopleId: '',
			startDate: '',
			endDate: '',
			peopleList: [],
			peopleList_temp: []
		},
		methods:{
			laodPeopleList:function(){
				queryPoliceInfo();
			}
		}
	});
	if(peopleId){
		model.peopleId = "p_" + peopleId;
		model.startDate = stratDate;
		model.endDate = endDate;
		queryPoliceInfo();
	}else{
		model.startDate = utils.formatterDate(new Date(),"yyyy-mm-dd");
		model.endDate = utils.formatterDate(new Date(),"yyyy-mm-dd");
	}
	/**
	 * 查询值班人员
	 */
	function queryPoliceInfo(){
		if(!validate()){
			return;
		}
		db.query({
			request:{
				sqlId:'select_dtyRecord_people',
				whereId:0,
				orderId:0,
				params:[loginUser.cusNumber,model.peopleId.split("_")[1],model.startDate,model.endDate]
			},
			success:function(data){
				model.peopleList = data;
				model.peopleList_temp = data;
				var list = model.peopleList;
				var nowYMD = utils.formatterDate(new Date(),"yyyy-mm-dd");
				var nowHMS = utils.formatterDate(new Date(),"hh:mi:ss");
				for(var i=0;i<list.length;i++){
					var date = list[i].ped_date;
					var startTime = list[i].scd_shift_start_time;
					var endTime = list[i].scd_shift_end_time;
					list[i].today = false;
					list[i].week = getWeek(date);
					if(date < nowYMD){
						list[i].remark = "已值班";
						list[i].flag = 1;
					}else if(date == nowYMD){
						list[i].today = true;
						if(endTime < nowHMS){
							list[i].remark = "已值班";
							list[i].flag = 1;
						}else if(startTime <= nowHMS && endTime >= nowHMS){
							list[i].remark = "值班中";
							list[i].flag = 2;
						}else{
							list[i].remark = "未值班";
							list[i].flag = 3;
						}
					}else{
						list[i].remark = "未值班";
						list[i].flag = 3;
					}
				}
			}
		});
		queryDtyShiftCount();
	}
	/**
	 * 表单校验
	 */
	function validate(){
		var flag = true;
		if(!model.peopleId){
			tip.alert("请选择值班人员");
			return;
		}else if(!model.startDate){
			tip.alert("请选择开始日期");
			flag = false;
		}else if(!model.endDate){
			tip.alert("请选择结束日期");
			flag = false;
		}else if(model.startDate > model.endDate){
			tip.alert("开始日期不能大于结束日期");
			flag = false;
		}
		return flag;
 	}
	/**
	 * 查询各班次值班次数
	 */
	function queryDtyShiftCount(){
		db.query({
			request:{
				sqlId:'select_dtyRecord_shift_count',
				params:[loginUser.cusNumber,model.peopleId.split("_")[1],model.startDate,model.endDate]
			},
			success:function(data){
				var shiftNameList = [];
				var shiftCountList = [];
				for(var i=0;i<data.length;i++){
					shiftNameList.push(data[i].scd_shift_name);
					shiftCountList.push({value:data[i].dtycount,name:data[i].scd_shift_name});
				}
				loadPie(shiftNameList,shiftCountList);
			}
		});
	}
	/**
	 * 加载饼状图
	 */
	function loadPie(shiftNameList,shiftCountList){
	    var pie = chart.init(document.getElementById("pie"));
	    //设定饼状图属性
	    var option = {
		    title : {
		        text: '值班次数',
		        textStyle:{
		        	fontSize: 12,
		        	color: '#fff'	        	
		        },
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b} <br/>{a} : {c} ({d}%)"
		    },
		    series : [
	              {
	                  name: '次数',
	                  type: 'pie',
	                  radius : '55%',
	                  center: ['50%', '60%'],
	                  data: shiftCountList,
	                  itemStyle: {
	                      emphasis: {
	                          shadowBlur: 10,
	                          shadowOffsetX: 0,
	                          shadowColor: 'rgba(0, 0, 0, 0.5)'
	                      }
	                  }
	              }
	          ]
		};
	    pie.setOption(option);
	    //注册点击事件
	    pie.on('click',function(param){
	    	model.peopleList = model.peopleList_temp;
	    	var list = model.peopleList;
	    	var peopleList = [];
	    	for(var i=0;i<list.length;i++){
	    		var shiftName = list[i].scd_shift_name;
	    		if(shiftName == param.name){
	    			peopleList.push(list[i]);
	    		}
	    	}
	    	model.peopleList = [];
	    	model.peopleList = peopleList;
	    });
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
})