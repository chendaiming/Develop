define(["echarts","vue","frm/loginUser","frm/hz.db","frm/message","frm/datepicker","frm/dialog",'frm/select'],
		function(echarts,vue,login,db,message,datepicker,dialog,select){
	var vm = new vue({
		el:'body',
		data:{
			records:[],
			total:'',		//查询总记录
			search:'',		//查询框数据
			pageIndex:1,
			pageSize:20,
			cusNumber:login.cusNumber,
			today:(function(){
				var date = new Date();
				var day = date.getDate().toString().length == 2?date.getDate():'0'+date.getDate();
				var month = (date.getMonth()+1).toString().length == 2? (date.getMonth() +1):'0'+(date.getMonth()+1);
				var _today = date.getFullYear()+"-"+month+"-"+day;
				return _today;
			})()
		},
		watch:{//当值发生变化时触发
			today:function(val,old){
				conditionQuery(1,false);
			}
		},
		methods:{
			serch:function(){//搜索框按下回车时触发
				conditionQuery(1,false);
			}
		}
	});
	
	
	var line={
        	lineStyle:{
        		color:'rgb(255, 255, 255)'
        	}
        };
	var areaOption = {
		    title : {
		        text: '区统计',
		        textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        },
		        x:'center'
		    },
		    tooltip:{},
		    series : 
		        {
		            type: 'pie',
		            data:[{name:'zhangshan',value:'21234',label:'456'},{name:'xiaoming',value:'1210'}],
		        }
		    
		};

	var timeOption = {
			legend:{
				left:'0px'
			},
            title: {
                text: '时间段',
                x:'center',
                textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        }
            },
            tooltip: {
            },
            xAxis: {
            	 data:(function(){
                	var data=[];
                	for(var i=0;i<24;i++){
                		data.push({value: (i<10?('0'+i):i)+':00'});
                	}
                	return data;
                })(),
                axisLine:line
            },
            yAxis: {
            	axisLine:line
            },
            series: {
            	name:'播放次数',
                type: 'bar'
            }
        };
	//条件查询
	function conditionQuery(pageindex,isScroll){
		var param = {
			'cusNumber':login.cusNumber,
			'today':vm.today,
			'search':vm.search
		};
		//查询广播记录
		db.query({
			request:{
				sqlId:'query_broadcast_records',
				params:param,
				whereId:'0',
				orderId:'0',
				pageIndex:pageindex,
				pageSize:vm.pageSize
			},
			success:function(data){
				vm.pageIndex = pageindex;
				if(isScroll){
					vm.records=vm.records.concat(data.data);
				}else{
					vm.records=data.data;
					vm.total  =data.count;
				}
			},
			error:function(errorCode, errorMsg){
				message.alert(errorCode + ":" + errorMsg);
			}	
		});
		if(isScroll) return;
		//时间段统计
		db.query({
			request:{
				sqlId:'query_broadcast_time_records',
				params:param,
				whereId:'0',
				orderId:'0'
			},
			success:function(data){
				var xData = [];
				var yData = [];
				for(var j = 1; j <= 24; j++){
					var hasValue = false;
					for(var i = 0; i < data.length; i++){
						var x = data[i]['name'];
						var y = data[i]['value'];
						var m = x.substring(x.indexOf(" "));
						if(m == j){
							yData.push(y);
							hasValue = true;
							break;
						}
					}
					//当前时间点没有值，补0
					if(!hasValue){
						yData.push(0);
					}
				}
				
				timeOption.series.data = yData;
				echarts.init(document.getElementById("timeTable")).setOption(timeOption);
			},
			error:function(errorCode, errorMsg){
				message.alert(errorCode + ":" + errorMsg);
			}		
		});
		
		//区统计
		db.query({
			request:{
				sqlId:'query_broadcast_area_records',
				params:param,			
				whereId:'0',
				orderId:'0'
			},
			success:function(data){
				if(data.length > 0){
					areaOption.series.data = JSON.parse(JSON.stringify(data));
				}else{
					areaOption.series.data = [{name:'暂无数据',value:'0'}];
				}
				echarts.init(document.getElementById("areaTable")).setOption(areaOption);
			},
			error:function(errorCode, errorMsg){
				message.alert(errorCode + ":" + errorMsg);
			}	
		});
	}
	
	var direction=0;
	document.getElementById("scroll").onscroll=function(){
		//距离底部的高度
		var l=this.scrollHeight-this.scrollTop-this.clientHeight;
		f=l<direction;
		direction = l;
		if(f&&l==0){//滚动条滚到底时
			if(vm.total==vm.records.length){//已加载全部记录,return
				console.log('已加载全部记录');
				return;
			}
			//未加载全部记录
			vm.total> vm.records.length &&(conditionQuery(parseInt(vm.pageIndex)+1,true));
		}
	};
	//默认加载当天记录
	conditionQuery(1,false);
});