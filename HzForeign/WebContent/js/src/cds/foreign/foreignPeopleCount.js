var gotoPanel;
define(function(require){
	$ = require("jquery");
	var tpl = require('vue');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var modelUtil = require('frm/model');	
	var tip = require('frm/message');
	var chart =   require('echarts');
	var bootstrap = require('bootstrap');

        model=new tpl({
			el:'#form',
			data:{
				count:{
					'inPrison':'0', //在监人数
					'outPrison':'0',//离监
					'wait':'0',//待进
					'total':'0'//总数	
				},
				countByTime:{
					'count':[],
					'hours':[]
				},
				peopleinfo:[],//人员信息存放
				inoutinfo:[],//人员进出记录存放
				viewtext:'在监外来人员信息'
			},
			methods:{
				reset:function(){
					this.peopleinfo = [];
					this.viewtext = '无';
				}
			}
	});
        //====================== 外来人员在监情况 饼状图 ============================//       
       //加载外来人员在监情况 
        db.query({
    		request:{
    			sqlId:'select_foreign_people_inout_count',
    			params:[login.cusNumber]
    		},
    		async:false,
    		success:function(data){
    			if(!data || data.length == 0) return;
    			for(var i=0;i<data.length;i++){
    				if(data[i].stts && data[i].flag == 1){
    					model.count.inPrison = data[i].count;//在监
    				}else if(data[i].stts && data[i].flag == 2){
    					model.count.outPrison = data[i].count; //离监
    				}else{
    					model.count.wait = data[i].count; //待进
    				}
    			}
    			model.count.total = Number(model.count.inPrison) + Number(model.count.outPrison) + Number(model.count.wait);
    		},
    		error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
    	});
        //饼状图对象
        var tables=  chart.init(document.getElementById("tableshow"));
        //饼状图初始化设置
        option = {
        		title : {
    		        text: '今日进监外来人员统计',
    		        textStyle:{
    		        	fontSize: 12,
    		        	color: '#fff'		        	
    		        },
    		        x:'center'
        		},
        	    tooltip : {
        	        trigger: 'item',
        	        formatter: "{a} <br/>{b} : {c} ({d}%)",
        	    },
        	    legend: {
        	        orient : 'vertical',
        	        x : 'left',
        	        data:['待进','离监','在监'],
        	        textStyle:{
        	        	color: 'auto'
        	        }
        	    },
        	    color:['#1f699e','#c23531','#32cd32'],
        	    calculable : true,
        	    series : [
        	        {
        	            name:'人数',
        	            type:'pie',
        	            radius : ['50%', '70%'],
        	            itemStyle : {
        	                normal : {
        	                    label : {
        	                        show : false
        	                    },
        	                    labelLine : {
        	                        show : false
        	                    }
        	                },
        	                emphasis : {
        	                    label : {
        	                        show : false,
        	                        position : 'center',
        	                        textStyle : {
        	                            fontSize : '30',
        	                            baseline:'middle',
        	                            fontWeight : 'bold'
        	                        }
        	                    }
        	                }
        	            },
        	            data:[
        	                {value:model.count.wait, name:'待进'},  
        	                {value:model.count.outPrison, name:'离监'},  
        	                {value:model.count.inPrison, name:'在监'}
        	                ]
        	        }
        	    ]
        	};        
    tables.setOption(option);   
    /**
     * 注册点击事件
     */
    tables.on('click',function(param){
    	loadPeopleInfo(param.name);
    });
    
    //====================== 各时段外来人员分布情况 柱状图 ============================//
    //查询外来人员分布情况
    db.query({
		request:{
			sqlId:'select_foreign_people_inout_count_groupbytime',
			whereId:'0',
			orderId:'0',
			params:[login.cusNumber]
		},
		async:false,
		success:function(data){
			if(!data || data.length == 0) return;
			for(var i=0;i<data.length;i++){
				model.countByTime.hours.push(data[i].hours);
				model.countByTime.count.push({value:data[i].count,name:data[i].hours});
			}
		},
		error:function(errorCode, errorMsg){
			tip.alert(errorCode + ":" + errorMsg);
		}
	});
    /** 柱状图对象 */
    var tableBar=  chart.init(document.getElementById("tableBar"));
    //设定柱状图属性
    option = {
    	    title : {
    	        text: '各时段外来人员分布情况',
    	        textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        },
		        x:'center'
    	    },
    	    //鼠标悬浮显示详情
    	    tooltip : {
    	        trigger: 'axis',
    	    },
    	    calculable : true,
    	    xAxis : [
    	        {
    	            type : 'category',
    	            data : model.countByTime.hours,
    	            axisLine:{lineStyle:{color:'white'}}
    	        }
    	    ],
    	    yAxis : [
    	        {
    	            type : 'value',
    	            axisLine:{lineStyle:{color:'white'}}
    	        }
    	    ],
    	    series : [
    	        {
    	            name:'人数',
    	            type:'bar',
    	            textStyle:{color:'#fff'},	
    		        data:model.countByTime.count,
    	            markPoint : {data : [{type : 'max', name: '最多'},{type : 'min', name: '最少'}]},
    	            markLine : {data : [{type : 'average', name: '平均值'}]},
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
    //加载柱状图
    tableBar.setOption(option);  
    /**
     * 注册点击事件
     */
    tableBar.on('click',function(param){loadPeopleInfo(param.data.name,param.name);});
    
	/**
	 * 加载进出记录
	 */
	 gotoPanel = function(obj){
		var vhref = obj.href;
		var id = vhref.substr(vhref.indexOf('_')+1);
		//加载对应的进出记录
	    db.query({
	    	request:{
	    	sqlId:'select_foreign_people_inout_infobyid',
	    	whereId:'0',
	    	orderId:'0',
	    	params:[login.cusNumber,id]
	       },
	       success:function(data){
	    		model.inoutinfo = [];
	    		if(!data || data.length == 0){
	    			obj.text ='(暂无进出记录)';
	    			return;
	    		}
	    		model.inoutinfo = model.inoutinfo.concat(data);
	    	},
	    	error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
	    });	
	}
	 /**
	  * 加载外来人员信息
	  */
	 function loadPeopleInfo(value,name){
		 var wid='0',param=[];
		 switch(value){
		 case '在监':
			 param = [login.cusNumber,1];
			 model.viewtext = '在监外来人员信息';
			 break;
		 case '离监':
			 param = [login.cusNumber,2];
			 model.viewtext = '离监外来人员信息';
			 break;
		 case '待进':
			 param = [login.cusNumber];
			 wid = 1;
			 model.viewtext = '待进外来人员信息';
			 break;
		default:
			if(isNaN(value)) return;
			wid = 3;
			param = [login.cusNumber,value];
			model.viewtext = name+'点进监外来人员信息';
			break;
		 }
		 
	    db.query({
	    	request:{
	    	sqlId:'select_foreign_people_base_info',
	    	whereId:wid,
	    	orderId:'0',
	    	params:param
	       },
	       success:function(data){
	    		model.peopleinfo = [];
	    		if(!data || data.length == 0) return;
	    		model.peopleinfo = model.peopleinfo.concat(data);
	    		$('#infoUl').show();
	    	},
	    	error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
	    });		 
	 }
	 //默认加载在监外来人员数据
	 loadPeopleInfo('在监');
});