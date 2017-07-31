define(["echarts","vue","frm/loginUser","frm/hz.db","frm/message","frm/datepicker","frm/dialog","frm/treeSelect","frm/hz.videoclient","frm/model","frm/select"],function(chart,tpl,login,db,tip,t,dialog,tree,video,modeld){
	var tables=document.getElementById("tableshow");
	var count=0,time=flag=true;

	var detail=document.querySelector("#detail");
	
	var model=new tpl({
		el:'#record',
		data:{
			procFlow:[],
			record:{
				"address":"",
				"name":"",
				"ard_alert_police_name":"",
				"ard_alert_time":"",
				"ard_rec_police_name":"",
				"ard_receive_time":"",
				"ard_alert_level":"",
				"ard_oprtn_stts":"",
				"ard_dvc_type":"",
				"ard_event_type":"",
				"ard_oprtr_name":"",
				"ard_sure_police_name":"",
				"ard_event_user_name":"",
				"ard_event_time":"",
				"ard_alert_reason":"",
				"ard_local_case":"",
				"ard_oprtn_desc":"",
				"ard_oprtn_result":"",
				"ard_remark":"",
				"ard_img_src":"",
			},
			records:[],
			total:'0',
			done:'0',
			wait:'0',
			plc:'',
			alarm:{
				'day':(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()})(),
				'cus':login.cusNumber,
				'type':'',
				'result':'',
				'plc':'',
				'org':login.sysAdmin==1||login.dataAuth!=0?login.cusNumber:login.deptId,
			},
			today:(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()})()
		},
		watch:{
			today:function(val,old){
				model.alarm['day']=val;
				conditionQuery(val);
				time=false;
			},
			'alarm.type':function(val,old){
				val.length&&conditionQuery(model.alarm,true);
			},
			'alarm.result':function(val,old){
				val.length&&conditionQuery(model.alarm,true);
			},
			'alarm.plc':function(val,old){
				val.length&&conditionQuery(model.alarm,true);
			}
		},
		methods:{
			showDetail:function(item,e){
				if(e.target.tagName=='BUTTON'){
					return ;
				}
				detail.scrollTop=0;
				
				if(item.procFlow){
					
					model.procFlow=item.procFlow;
					modeld.modelData(model.record,item);
					detail.classList.add("show");
				}else{
					//查询对应的处置流程
					db.query({
						request:{
							sqlId:'select_proc_flow_by_alarm_id',
							params:{
								alarmId:item.ard_record_id
							}
						},success:function(data){
							model.procFlow=data;
							item.procFlow=data;
							modeld.modelData(model.record,item);
							detail.classList.add("show");
						}
					});
				}
				
			},
			query:function(e){
				if(validate()){
					tip.alert('请选择查询条件');
					return;
				}		
				conditionQuery(model.alarm,true);
			},
			reset:function(){
				if(validate()){
					return;
				}
				model.alarm['type']='';
				model.alarm['result']='';
				model.alarm['plc']='';
				model['plc']='';
				conditionQuery(model.alarm,true);
			},
			replay:function(record){
				db.query({
					request:{
						sqlId:'query_alt_link_dvc_by_device',
						whereId:'0',
						orderId:'0',
						params:{
							cusNumber:login.cusNumber,
							id:record.ard_alertor_id,
							mainType:record.maintype,
							dtlsType:1
						}
					},success:function(data){
						if(data.length){
							var list=replayTime(record.ard_alert_time,data);
							video.setLayout(list.length);
							video.playback(list);
						}else{
							tip.alert("该设备暂未关联摄像机");
						}
					}
				});
			}
		}
	});
	//获取回放时间
	function replayTime(time,list){
		
		var t=new Date(time);
		
		list = list.map(function(item){
			return {
				"cameraId":item.id,
				"beginTime":convertDate(new Date(t.getTime()-5*60)),
				"endTime":convertDate(new Date(t.getTime()+5*60))
			}
		});
		return list;
	}
	
	//获取回放时间
	/*function replayTime(time,list){
		
		var t=new Date(time);
		
		list.map(function(item){
			return {
				"cameraId":item.id,
				"beginTime":convertDate(new Date(t.getTime()-5*60)),
				"endTime":convertDate(new Date(t.getTime()+5*60))
			}
		});
		return list;
	}*/
	//隐藏详细弹框
	document.addEventListener("click", function(e) {
		if(e.target.parentNode.tagName!='LI'&&!e.target.classList.contains("detail")){
			detail.classList.remove("show");
		}
	},true);
	
	//转换
	function fillDouble(time){
		return time < 10 ? '0'+time : time;
	}
	//时间转换
	function convertDate(time){
		return time.getFullYear()+'-'+ fillDouble(time.getMonth()+1)+'-' + fillDouble(time.getDate()) +
		' '+ fillDouble(time.getHours()) +':'+fillDouble(time.getMinutes())+':'+fillDouble(time.getSeconds());
	}
	conditionQuery(model.today);
	//时间线
	function query(pageindex,flag){
		var  dayS = model.alarm.day.split("-")
		if(model.alarm.day.split("-")[1].length<2){
			dayS[1] = "0"+dayS[1];
		}
		if(model.alarm.day.split("-")[2].length<2){
			dayS[2] = "0"+dayS[2];
		}
		model.alarm.day = dayS[0]+"-"+dayS[1]+"-"+dayS[2];
		//时间轴数据
		db.query({
			request:{
				sqlId:'select_alaram_record_byday',
				params:model.alarm,
				whereId:(flag||!validate())&&'1',
				orderId:'0',
				pageIndex:pageindex,
				pageSize:20
			},
			success:function(data){
				model.total=count=data.count;
				model.records=flag?data.data:model.records.concat(data.data);
			}
		});
	}
	//报警器查询
	var timer=null,key;
	//滚动事件
	var direction=0;
	document.getElementById("scroll").onscroll=function(e){
		//滚动条高度
		var scroll=this.clientHeight*this.clientHeight/this.scrollHeight;
		//滚动条距离顶部高度
		var top=(this.clientHeight*this.scrollTop)/this.scrollHeight;
		//距离底部的高度
		var l=this.clientHeight-(scroll+top),f=l<direction;
		direction= l;
		if(f&&l<1){//判断滚动方向小于乡下
			if(model.total==this.childElementCount){
				tip.alert("数据已全部加载");
				return;
			}
			this.childElementCount>=20&&query(parseInt(this.childElementCount/20)+1,false);
		}
	};
	var line={
        	lineStyle:{
        		color:'rgb(255, 255, 255)'
        	}
        };
      var xAxisData = (function(){
            	var data=[];
            	for(var i=0;i<24;i++){
            		data.push({value: (i<10?('0'+i):i)+':00',textStyle:{fontSize:4}});
            	}
            	return data;
            })();
	var options = {
			legend:{
				left:'0px'
			},
            title: {
                text: '时间段',
                textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        }
            },
            tooltip: {
        		trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
            },
            xAxis: {
                data: xAxisData,
                axisLine:line
            },
            yAxis: {
            	axisLine:line
            },
            series: {
            	name:'报警次数',
                type: 'bar'
            }
        };

	//条件查询
	function conditionQuery(date,f){
		    query(1,true);
			//一天中各个时间点的报警次数
			db.query({
				request:{
					sqlId:'select_alarm_record_bytime',
					params:model.alarm,//[date,login.cusNumber],
					orderId:'0',
					whereId:f&&'1'
				},
				success:function(data){
					options.series.data=data[0].r&&data[0].r.split(",");
					options.xAxis.data=data[0].t?data[0].t.split(","):xAxisData;
					chart.init(tables.nextElementSibling).setOption(options);
				}
			});
			//按照报警类型查询
			db.query({
				request:{
					sqlId:'select_alarm_record_bytype',
					params:model.alarm,
					orderId:'0',
					whereId:f&&'1'
				},
				success:function(arr){
					var d=[{"name":"摄像机","value":64},{"name":"网络","value":5}];
					chart.init(tables).setOption({
						 title : {
						        text: '报警设备类型',
						        left:'left',
						        textStyle:{
						        	fontSize: 11,
						        	color: '#fff'		        	
						        },
						        x:'center'
						    },
					    tooltip:{},
					    series : [
					              {
					                  name: '报警来源',
					                  type: 'pie',
					                  radius: '55%',
					                  data:arr.length?JSON.parse(JSON.stringify(arr)):[{name:'暂无数据'}]
					              }
					          ]
		          });
			   }
			});
			//报警已处理情况
			db.query({
				request:{
					sqlId:'select_alarm_result_byday',
					params:model.alarm,
					orderId:f&&'0',
					whereId:'1'
				},success:function(data){
					setTimeout(function(){
						model.done=data[0]?data[0]['sum']:'0';
						model.wait=(model.total-model.done)>0?(model.total-model.done):'0';
					},300);

				}
			});
	}
	//用户树
	db.query({
		request:{
			sqlId:'select_plc_by_orgid',
			params:{'org':login.cusNumber,'level':(login.dataAuth!=2)?'2':'3'}
		},success:function(data){
			var setting={
					key:'name',
					diyClass:'conditionslid',
					expand:true,
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(e,id,node){
							if(node.type==1){	
								model.plc=node.name;
								model.alarm['plc']=node.id;
							}else{
								tip.alert("请选择刷卡人");
							}
						}
					}
			};
			tree.init("plcTree",setting,keepLeaf(data));
		}
	});
	function keepLeaf(list){
		var leaf=[];
		//获取子元素
		for(var i=0;i<list.length;i++){
			if(list[i]['type']==1){
				leaf.push(list.splice(i,1)[0]);
				i--;
			}
		}
		var pid=[];
		//获取父元素id
		for(var j=0;j<leaf.length;j++){
			if(pid.indexOf(leaf[j]['pid'])<0){
				pid.push(leaf[j]['pid'])
			}
		}
		var treeArray=[];
		//搜索父级元素
		var searchP=function(pid){
			for(var i=0;i<list.length;i++){
				if(list[i]['id']==pid){
					var temp=list.splice(i,1)[0];
					treeArray.push(temp);
					searchP(temp['pid']);
					i--;
				}
			}
		};
		//根据父id搜索
		for(var l=0;l<pid.length;l++){
			searchP(pid[l]);
		}
		return treeArray.concat(leaf);
	}
	
	function validate(){
		return !model.alarm['plc'].length&&!model.alarm['type'].length&&
		!model.alarm['result'].length;
	}
});