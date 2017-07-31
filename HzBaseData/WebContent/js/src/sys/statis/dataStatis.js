define(function(require){
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var vue = require('vue');
	var message = require('frm/message');
	var echarts = require("echarts");
	var loginUser = require('frm/loginUser');
	var dialog = require('frm/dialog');
	
	var vm = new vue({
		el:'body',
		data:{
			selectIndex:[],
			activeTab:1,
			policeBarData:{
				xData:[],
				yData:[]
			},
			policePieTopData:[],
			policePieBottomData:[],
			prisonerBarData:{
				xData:[],
				yData:[]
			},
			prisonerPieTopData:[],
			prisonerPieBottomData:[]
		},
		methods:{
			setActiveTab:function(n){
				vm.activeTab = n;
				if(n==2 && !vm.contains(n)){
					//初始化罪犯柱状图
					initPrisonerBarCharts();
				}
				if(!vm.contains(n)){
					vm.selectIndex.push(n);
				}
			},
			contains:function(val){
				if(vm.selectIndex){
					for(var i = 0; i < vm.selectIndex.length;i++){
						if(vm.selectIndex[i] == val) return true;
					}
				}
				return false;
			}
		}
	}); 
	
	//初始化民警柱状图
	function initPoliceBarCharts(groupId){
		db.query({
			request:{
				sqlId:'select_police_statis_info',
				whereId: groupId ? 1 : 0,
				params: groupId ? {"groupId":groupId} : {"cusNumber":loginUser.cusNumber}
			},
			success:function(data){
				vm.policeBarData.xData = data.map(function(item){
					return item.name;
				})
				vm.policeBarData.yData = data.map(function(item){
					return item.count;
				})
				//初始化
				initPoliceBarChartsOption();
			},
			error:function(code,msg){
				message.alert(msg);
			}
		})
	}
	
	//初始化民警柱状图参数
	function initPoliceBarChartsOption(){
		var option = {
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'item'
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : vm.policeBarData.xData,
		            color: '#FFFFFF',
		            axisTick: {
		                alignWithLabel: true
		            },
		            axisLabel:{
		                textStyle:{
		                    color:'#FFFFFF'
		                }
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            axisLabel:{
		               textStyle:{
		                    color:'#FFFFFF'
		                }
		            }
		        }
		    ],
		    series : [
		        {
		            name:'民警人数',
		            type:'bar',
		            barWidth: '60%',
		            data:vm.policeBarData.yData,
		            itemStyle: {
		                normal: {
		                    barBorderRadius:0,
		                    label : {
		                        show: true,
		                        position: 'top',
		                        textStyle:{
		                        	color:'#FFFFFF'
		                        }
		                    }
		                }
		            }
		        }
		        
		    ]
		};
		echarts.init(document.getElementById("policeCharts")).setOption(option);
	}
	
	
	
	
	//初始化民警top饼图
	function initPolicePieTopCharts(){
		initPolicePieTopChartsOption();
	}
	
	//初始化民警top饼图参数
	function initPolicePieTopChartsOption(){
		var option = {
		    title: {
		        text: '本月预警次数',
		        subtext: '144次',
		        x: 'center',
		        y: 'center',
		        textStyle: {
		            fontWeight: 'normal',
		            color:'#FFFFFF',
		            fontSize: 15
		        }
		    },
		    tooltip: {
		    	confine:true,
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    series: [
		       
		        {
		            name:'访问来源',
		            type:'pie',
		            radius: ['40%', '55%'],
		            data:[
		                {value:335, name:'一监区'},
		                {value:310, name:'二监区'},
		                {value:234, name:'三监区'},
		                {value:135, name:'四监区'},
		                {value:1048, name:'五监区'},
		                {value:251, name:'六监区'},
		                {value:147, name:'七监区'},
		                {value:102, name:'八监区'}
		            ]
		        }
		    ]
		};
		echarts.init(document.getElementById("policePieTop")).setOption(option);
	}
	
	//初始化民警bottom饼图
	function initPolicePieBottomCharts(){
		initPolicePieBottomChartsOption();
	}
	
	//初始化民警bottom饼图参数
	function initPolicePieBottomChartsOption(){
		var option = {
		    title: {
		        text: '本月各时间段',
		        subtext: '预警次数',
		        x: 'center',
		        y: 'center',
		        textStyle: {
		            fontWeight: 'normal',
		            color:'#FFFFFF',
		            fontSize: 15
		        }
		    },
		    tooltip: {
		    	confine:true,
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    series: [
		       
		        {
		            name:'访问来源',
		            type:'pie',
		            radius: ['40%', '55%'],
		            data:[
		            	 {value:335, name:'一监区'},
		                {value:310, name:'二监区'},
		                {value:234, name:'三监区'},
		                {value:135, name:'四监区'},
		                {value:1048, name:'五监区'},
		                {value:251, name:'六监区'},
		                {value:147, name:'七监区'},
		                {value:102, name:'八监区'}
		            ]
		        }
		    ]
		};
		echarts.init(document.getElementById("policePieBottom")).setOption(option);
	}
	
	//初始化民警柱状图
	initPoliceBarCharts();
	//初始化民警top饼状图
	//initPolicePieTopCharts();
	//初始化民警bottom饼状图
	//initPolicePieBottomCharts();
	
	
	//初始化罪犯柱状图
	function initPrisonerBarCharts(groupId){
		db.query({
			request:{
				sqlId:'select_prisoner_statis_info',
				whereId: 0,
				params:  {
					"groupId":groupId ? groupId : 239,
					"cusNumber":loginUser.cusNumber
				}
			},
			success:function(data){
				vm.prisonerBarData.xData = data.map(function(item){
					return item.name;
				})
				vm.prisonerBarData.yData = data.map(function(item){
					return item.count;
				})
				//初始化
				initPrisonerBarChartsOption();
			},
			error:function(code,msg){
				message.alert(msg);
			}
		})
	}
	
	//初始化罪犯柱状图参数
	function initPrisonerBarChartsOption(){
		var option = {
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
	            axisPointer : {
	                type : 'shadow'
	            }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : vm.prisonerBarData.xData,
		            color: '#FFFFFF',
		            axisTick: {
		                alignWithLabel: true
		            },
		            axisLabel:{
		                textStyle:{
		                    color:'#FFFFFF'
		                }
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            axisLabel:{
		               textStyle:{
		                    color:'#FFFFFF'
		                }
		            }
		        }
		    ],
		    series : [
		        {
		            name:'罪犯人数',
		            type:'bar',
		            barWidth: '60%',
		            data:vm.prisonerBarData.yData,
		            itemStyle: {
		                normal: {
		                    barBorderRadius:0,
		                    label : {
		                        show: true,
		                        position: 'top',
		                        textStyle:{
		                        	color:'#FFFFFF'
		                        }
		                    }
		                }
		            }
		        }
		        
		    ]
		};
		echarts.init(document.getElementById("prisonerCharts")).setOption(option);
	}
	

	
});