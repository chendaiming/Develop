define(function(require){	
	var $ = require("jquery");
	var db = require("frm/hz.db");
	var vue = require("vue");
	var tip = require("frm/message");
	var loginUser = require("frm/loginUser");
	require("highcharts");
	require("highcharts3d");
	
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#prisonerCount',
		data:{
			prisonAreaCount: ''
		}
	});
	
	$("#tableBar").width($("#tableBar").parent().width());
	$("#tableBar").height($("#tableBar").parent().height());
	$(window).resize(function(){
		$("#tableBar").width($("#tableBar").parent().width());
		$("#tableBar").height($("#tableBar").parent().height());
	});
	
	/**
	 * 查询类别岗位信息
	 */
	db.query({
		request: {
			sqlId: 'select_prisoner_prisonArea_count',
			params: [loginUser.cusNumber]
		},
		async:false,
		success: function (data) {
			model.prisonAreaCount = data;
		},
		error: function (code, msg) {
			console.log('查询失败，响应码<' + code + ">，响应结果<" + msg + ">");
		}
	});
	
	/**
	 * 加载柱状图
	 */
	function loadTableBar(){
		var countlist = model.prisonAreaCount;
		var numList = [];
		var nameList = [];
		var dataList = [];
		for(var i=0;i<countlist.length;i++){
			var list = [];
			list.push(countlist[i].odd_name);
			list.push(countlist[i].count);
			dataList.push(list);
			numList.push(countlist[i].count);
			nameList.push(countlist[i].odd_name);
		}
		Highcharts.chart('tableBar', {
		    chart: {
		    	backgroundColor: 'rgba(0,0,0,0.2)',
		        type: 'column',
		        options3d: {
		            enabled: true,
		            alpha: 15,
		            beta: 8,
		            depth: 40
		        }
		    },
		    title: {
		    	text: '',
		        //text: '各监区罪犯人数统计',
		        //style: { "color": "#fff", "fontSize": "18px" }
		    },
		    subtitle: {
		        text: ''
		    },
		    plotOptions: {
		        column: {
		            depth: 25,
		            dataLabels:{
                        enabled:true,
                        style:{
                            color:'#D7DEE9'
                        }
                    }
		        }
		    },
		    legend: {
		    	enabled: false
		    },
		    xAxis: {
		        categories: nameList,
		        labels: {
		        	style: {"color": "#fff"},
		        	//rotation: 0
		        	//, "writingMode": "tb-rl"
		        	//y: 100
		        }
		    },
		    yAxis: {
		    	//categories: numList,
		        title: {
		            text: null
		        }
		    },
		    series: [{
		        name: '罪犯人数',
		        data: dataList
		    }]
		});
	}
	loadTableBar();
})