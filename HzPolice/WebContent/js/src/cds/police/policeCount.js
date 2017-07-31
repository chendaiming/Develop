
define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var modelUtil = require('frm/model');	
	var tip = require('frm/message');
	var chart =   require('echarts');
	var utils = require('frm/hz.utils');
	var hzdate = require('frm/datepicker');
	
	var tables=  chart.init(document.getElementById("tableshow"));
	//部门名称,部门警员数量
	var departmentName  = [],departmentCount = [];
        model=new tpl({
			el:'#form',
			data:{
				count:{
					'inPrison':'0', //在监人数
					'other':'0',//不在监
					'total':'0'//总数	
				},
				policeinfo:[],
				viewtext:'监内警员信息',
				tableModel:0, //左下方显示的数据表格 0 各部门人员统计 1 按时段统计全监出入监情况 
				searchDate:new Date().Format('yyyy-MM-dd')
			},
			methods:{
				reset:function(){
					this.policeinfo = [];
					this.viewtext = '无';
				}
			},
			watch:{
				tableModel:function(value){
					if(value == 0){
						loadTimeTable();
					}else if(value == 1){
						loadDeptPoliceTable();
					}else if(value == 2){
						loadPoliceTable();
					}
				},
				searchDate:function(date){
					loadTimeTable();
				}
			}
			
	});
       //加载警员在监情况 
        db.query({
    		request:{
    			sqlId:'select_police_inout_count',
    			params:[login.cusNumber]
    		},
    		async:false,
    		success:function(data){
    			if(!data) return;
    			for(var i=0;i<data.length;i++){
    				if(data[i].flag == 0){//在监
    					model.count.inPrison = data[i].count;
    				}else{
    					model.count.other = data[i].count;
    				}
    			}
    			model.count.total = Number(model.count.inPrison) + Number(model.count.other);
    		},
    		error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
    	});
        //加载饼状图
        
        option = {
        		title : {
    		        text: '警员数量统计',
    		        textStyle:{
    		        	fontSize: 12,
    		        	color: '#fff'		        	
    		        },
    		        x:'center'
        		},
        	    tooltip : {
        	        trigger: 'item',
        	        formatter: "{b}  {c}人({d}%)"
        	    },
        	    legend: {
        	        orient : 'vertical',
        	        x : 'left',
        	        data:['监外','监内'],
        	        textStyle:{
        	        	color: 'auto'
        	        }
        	    },
        	    color:['#c23531','#32cd32'],
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
								{value:model.count.other,name:'监外'},
								{value:model.count.inPrison,name:'监内'}
        	                ]
        	        }
        	    ]
        	};      
    tables.setOption(option);   
    /**
     * 注册点击事件
     */
    tables.on('click',function(param){
    	loadPoliceInfo(param.name);
    });
    
    //====================== 各部门警员分布情况 柱状图 ============================//
    function loadPoliceTable(){
    	departmentName = [];
    	departmentCount = [];
        /** 柱状图对象 */
        var tableBar=  chart.init(document.getElementById("tableBar"));
    	 //查询警员分布情况
        db.query({
    		request:{
    			sqlId:'select_police_drptmnt_count',
    			whereId:'0',
    			params:[login.cusNumber]
    		},
    		async:false,
    		success:function(data){
    			if(!data) return;
    			for(var i=0;i<data.length;i++){
    				departmentName.push(data[i].odd_name);
    				departmentCount.push({value:data[i].count,name:data[i].pbd_drptmnt_id});
    			}
    		},
    		error:function(errorCode, errorMsg){
    			tip.alert(errorCode + ":" + errorMsg);
    		}
    	});
        
      //设定柱状图属性
     var option = {
        	    title : {
        	        text: '各部门警员数量统计',
        	        textStyle:{
    		        	fontSize: 12,
    		        	color: '#fff'		        	
    		        },
    		        x:'center'
        	    },
        	    legend: {
        	        orient : 'vertical',
        	        x : 'left',
        	        data:['人数'],
        	        textStyle:{
        	        	color: 'auto'
        	        }
        	    },
        	    color:['#1f699e'],
        	    tooltip : {
        	        trigger: 'axis',
        	    },
        	    calculable : true,
        	    xAxis : [
        	        {
        	            type : 'category',
        	            data : departmentName,
        	            axisLine:{lineStyle:{color:'white'}},
        	            axisLabel:{  
                            interval:0,//横轴信息全部显示  
                            rotate:-45,//-45度角倾斜显示  
                       }  
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
        		        data:departmentCount,
//        	            markPoint : {data : [{type : 'max', name: '最多'},{type : 'min', name: '最少'}]},
//        	            markLine : {data : [{type : 'average', name: '平均值'}]},
    					label:{
    						normal: {
    							show: true,
    							position: 'top',
    							textStyle:{
    								color: '#fff'
    							}
    						}
    					},
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
        tableBar.on('click',function(param){
        	console.log(param);
        	loadPoliceInfo(param.data.name,param.name);
        });  
    }    
   
    function loadTimeTable(){
    	var timeTableBar=  chart.init(document.getElementById("timeTableBar"));
    	var timeList = new Array();;
    	var inData = [];
    	var outData = [];
    	 //查询警员分布情况
        db.query({
    		request:{
    			sqlId:'select_police_inout_time_count',
    			whereId:'0',
    			orderId:'0',
    			params:{cusNumber:login.cusNumber,date:model.searchDate}
    		},
    		async:false,
    		success:function(data){
    			if(!data) return;
    			
    			data.forEach(function(item,index){
    				if(!timeList.contains(item.time)){
    					timeList.push(item.time);
    				}
    				if(item.pir_inout_flag == 1){
    					inData.push({value:item.count,name:item.time});
    				}else if(item.pir_inout_flag == 2){
    					outData.push({value:item.count,name:item.time});
    				}
    			});
    		},
    		error:function(errorCode, errorMsg){
    			tip.alert(errorCode + ":" + errorMsg);
    		}
    	});
        
      //设定柱状图属性
      var   option = {
        	    title : {
        	        text: '各时段警员出入监情况',
        	        textStyle:{
    		        	fontSize: 12,
    		        	color: '#fff'		        	
    		        },
    		        x:'center'
        	    },
        	    legend: {
        	        orient : 'vertical',
        	        x : 'left',
        	        data:['进','出'],
        	        textStyle:{
        	        	color: 'auto'
        	        },
        	        selected:{
        	        	'进':true,
        	        	'出':true
        	        }
        	    },
        	    color:['#1f699e','#32cd32'],
        	    tooltip : {
        	        trigger: 'axis',
        	    },
        	    calculable : false,
        	    xAxis : [
        	        {
        	            type : 'category',
        	            data : timeList,
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
        	            name:'进',
        	            type:'bar',
        	            textStyle:{color:'#fff'},	
        		        data:inData,
//        	            markPoint : {data : [{type : 'max', name: '最多'},{type : 'min', name: '最少'}]},
//        	            markLine : {data : [{type : 'average', name: '平均值'}]},
    					label:{
    						normal: {
    							show: true,
    							position: 'top',
    							textStyle:{
    								color: '#fff'
    							}
    						}
    					},
        	            itemStyle: {
    		                emphasis: {
    		                    shadowBlur: 10,
    		                    shadowOffsetX: 0,
    		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
    		                }
    		            }
        	        },
        	        {
        	            name:'出',
        	            type:'bar',
        	            textStyle:{color:'#fff'},	
        		        data:outData,
//        	            markPoint : {data : [{type : 'max', name: '最多'},{type : 'min', name: '最少'}]},
//        	            markLine : {data : [{type : 'average', name: '平均值'}]},
    					label:{
    						normal: {
    							show: true,
    							position: 'top',
    							textStyle:{
    								color: '#fff'
    							}
    						}
    					},
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
      timeTableBar.setOption(option);
      timeTableBar.on('click',function(param){
    	    loadTimePoliceInfo(param,timeTableBar);
      });  
    }
    
    function loadDeptPoliceTable(){
    	var deptTableBar=  chart.init(document.getElementById("deptTableBar"));
    	var departmentList = new Array();
    	var intDeptList = new Array();
    	var outDeptList = new Array();
    	var inData = [];
    	var outData = [];
    	 //查询警员分布情况
        db.query({
    		request:{
    			sqlId:'select_police_inout_drptmnt_count',
    			whereId:'0',
    			orderId:'0',
    			params:{cusNumber:login.cusNumber}
    		},
    		async:false,
    		success:function(data){
    			if(!data) return;
    			
    			data.forEach(function(item,index){
    				if(!departmentList.contains(item.odd_name)){
    					departmentList.push(item.odd_name);
    				}
    				if(item.flag == 0){
    					inData.push({value:item.count,name:item.odd_name});
    					intDeptList.push(item.odd_name);
    				}else if(item.flag == 1){
    					outData.push({value:item.count,name:item.odd_name});
    					outDeptList.push(item.odd_name);
    				}
    			});
    		},
    		error:function(errorCode, errorMsg){
    			tip.alert(errorCode + ":" + errorMsg);
    		}
    	});
        
      //设定柱状图属性
      var   option = {
        	    title : {
        	        text: '各部门警员当前出入监情况',
        	        textStyle:{
    		        	fontSize: 12,
    		        	color: '#fff'		        	
    		        },
    		        x:'center'
        	    },
        	    legend: {
        	        orient : 'vertical',
        	        x : 'left',
        	        data:['在监','离监'],
        	        textStyle:{
        	        	color: 'auto'
        	        },
        	        selected:{
        	        	'在监':true,
        	        	'离监':true
        	        }
        	    },
        	    color:['#1f699e'],
        	    tooltip : {
        	        trigger: 'axis',
        	    },
        	    calculable : false,
        	    xAxis : [
        	        {
        	            type : 'category',
        	            data : intDeptList,
        	            axisLine:{lineStyle:{color:'white'}},
        	            axisLabel:{  
                            interval:0,//横轴信息全部显示  
                            rotate:-45,//-45度角倾斜显示  
                       }  
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
        	            name:'在监',
        	            type:'bar',
        	            textStyle:{color:'#fff'},	
        		        data:inData,
//        	            markPoint : {data : [{type : 'max', name: '最多'},{type : 'min', name: '最少'}]},
//        	            markLine : {data : [{type : 'average', name: '平均值'}]},
    					label:{
    						normal: {
    							show: true,
    							position: 'top',
    							textStyle:{
    								color: '#fff'
    							}
    						}
    					},
        	            itemStyle: {
    		                emphasis: {
    		                    shadowBlur: 10,
    		                    shadowOffsetX: 0,
    		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
    		                }
    		            }
        	        },
        	        {
        	            name:'离监',
        	            type:'bar',
        	            textStyle:{color:'#fff'},	
        		        data:outData,
//        	            markPoint : {data : [{type : 'max', name: '最多'},{type : 'min', name: '最少'}]},
//        	            markLine : {data : [{type : 'average', name: '平均值'}]},
    					label:{
    						normal: {
    							show: true,
    							position: 'top',
    							textStyle:{
    								color: '#fff'
    							}
    						}
    					},
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
      deptTableBar.setOption(option);
      deptTableBar.on('click',function(param){
    	    loadDeptPoliceInfo(param,deptTableBar);
      });     	
    }
    
    /**
     * 加载警员数据
     */
    function loadPoliceInfo(value,name){
    	var info = '',wid='0',param=[];
    	switch(value){
    	case '监内':
    		param = [login.cusNumber,0];
    		model.viewtext='监内警员信息';
    		break; 
    	case '监外':
    		param = [login.cusNumber,1];
    		model.viewtext='监外警员信息';
    		break;
    	case '全部':
    		wid = 1;
    		param = [login.cusNumber];
    		model.viewtext='全部警员信息';
    		break;
    	case '':
    		break;
    	default://按部门编号查询
    		if(isNaN(value)) return;//传入的数值不为部门编号(通常为一串数字)时,不做处理直接返回
    		wid = 2;
    	    param = [login.cusNumber,value];
    	    model.viewtext=name+'警员信息';
    	    break;
    	}
    	db.query({
    		request:{
    			sqlId:'select_police_base_info',
    			whereId:wid,
    			orderId:'0',
    			params:param
    		},
    		success:function(data){
    			model.policeinfo = [];
    			if(!data) return;
    			model.policeinfo = model.policeinfo.concat(data);
    			$('#infoUl').show();
    		},
    		error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
    	});
    }
    
    /**
     * 加载警员数据
     */
    function loadTimePoliceInfo(params,barObj){
    	
    	var wid='0',param={};
    	var data_name = params.data.name;
    	//根据legend选择情况进行筛选
    	var legendSelected = barObj.getOption().legend[0].selected;
    	var inSelectedFlag = legendSelected['进'];
    	var outSelectedFlag = legendSelected['出'];
    	
    	if(inSelectedFlag && outSelectedFlag){  //进出都显示
        	param={cusNumber:login.cusNumber,time:model.searchDate + ' ' + data_name};
        	model.viewtext= model.searchDate + ' ' + data_name + '时段进出监警员信息';
    	}else if(inSelectedFlag && !outSelectedFlag){ //只显示进
    		wid = '1';
        	param={cusNumber:login.cusNumber,time:model.searchDate + ' ' + data_name,flag:1};
        	model.viewtext= model.searchDate + ' ' + data_name + '时段进监警员信息';
    	}else if(!inSelectedFlag && outSelectedFlag){//只显示出
    		wid = '1';
        	param={cusNumber:login.cusNumber,time:model.searchDate + ' ' + data_name,flag:2};
        	model.viewtext= model.searchDate + ' ' + data_name + '时段出监警员信息';
    	}
    	
    	db.query({
    		request:{
    			sqlId:'select_inout_police_info',
    			whereId:wid,
    			orderId:'0',
    			params:param
    		},
    		success:function(data){
    			model.policeinfo = [];
    			if(!data) return;
    			model.policeinfo = model.policeinfo.concat(data);
    			$('#infoUl').show();
    		},
    		error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
    	});
    }

    /**
     * 加载警员数据(按部门)
     */
    function loadDeptPoliceInfo(params,barObj){
    	var wid='2',param=[];
    	var deptid = params.data.name;
    	var deptName = params.name;
    	//根据legend选择情况进行筛选
    	var legendSelected = barObj.getOption().legend[0].selected;
    	var inSelectedFlag = legendSelected['在监'];
    	var outSelectedFlag = legendSelected['离监'];
    	
    	if(inSelectedFlag && outSelectedFlag){  //进出都显示
        	param=[login.cusNumber,deptid];
        	model.viewtext= deptName + ' 进出监警员信息';
    	}else if(inSelectedFlag && !outSelectedFlag){ //只显示在监
    		wid = '3';
        	param=[login.cusNumber,deptid,0];
        	model.viewtext= deptName + ' 在监警员信息';
    	}else if(!inSelectedFlag && outSelectedFlag){//只显示离监
    		wid = '3';
        	param=[login.cusNumber,deptid,1];
        	model.viewtext= deptName + ' 离监警员信息';
    	}
    	
    	db.query({
    		request:{
    			sqlId:'select_police_base_info',
    			whereId:wid,
    			orderId:'0',
    			params:param
    		},
    		success:function(data){
    			model.policeinfo = [];
    			if(!data) return;
    			model.policeinfo = model.policeinfo.concat(data);
    			$('#infoUl').show();
    		},
    		error:function(errorCode, errorMsg){
				tip.alert(errorCode + ":" + errorMsg);
			}
    	});
    }
    
    window.top.webmessage.on('POLICE001','police',policeCountMsg);
    
    function policeCountMsg(msg){
    	console.log('民警数量消息处理 msg='+msg);
    }
    //默认加载在监警员数据
    loadPoliceInfo('监内');
});