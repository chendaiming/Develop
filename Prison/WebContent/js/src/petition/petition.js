define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/select","frm/datepicker","frm/message","frm/model","frm/loginUser","echarts"],function($,tpl,db,table,dialog,select,date,tip,modelData,login,chart){
	
	
	var flag=false,type=false,first=true;
	//创建模型
	//console.log(login);
	var model=new tpl({
		el:'#infolist',
		data:{
			infogroup:{ 
				'odd_name':'',
				'per_cus_number':login.cusNumber,
				'per_record_id':'',
				'per_name':'',
       			'per_sex':'',
       			'per_birthday':'',
       			'per_cert_type':'',
       			'per_cert_code':'',
       			'per_family_address':'',
       			'per_petition_time':'',
			    'per_petition_reason':'',
			    'per_petition_content':'',
			    'per_create_uid':login.userId,
			    'per_create_us':'',
			    'per_create_datetime':'',
			    'per_update_uid':login.userId,
			    'per_update_us':'',
			    'per_update_datetime':''
					}
		}
	});
	
	//table表
	table.init("table",{
		request:{
			sqlId:'query_petition_info',
			orderId:'0'
		},
		search:{
			key:'per_name',
			whereId:'1'
		},
		columns: [[  
					{
					    field: 'state',
					    checkbox: true
					},
	                  {
	                    title: '机构名称',
	                    field: 'odd_name',
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                    	
	                },
	                {
	                    title: '姓名',
	                    field: "per_name",
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '性别',
	                    field: "per_sex",
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '出生日期',
	                    field: 'birthday',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '证件类型',
	                    field: 'per_cert_type',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '证件号码',
	                    field: 'per_cert_code',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '上访时间',
	                    field: 'petition_time',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '家庭住址',
	                    field: 'per_family_address',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '上访原因',
	                    field: 'per_petition_reason',
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                },
	                {
	                    title: '上访处置情况',
	                    field: 'per_petition_content',
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                },
	                {
	                    title: '创建人',
	                    field: 'per_create_us',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '创建时间',
	                    field: "create_datetime",
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '更新人',
	                    field: 'per_update_us',
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                },
	                {
	                    title: '更新时间',
	                    field: "update_datetime",
	                    align: 'center',
	                    valign: 'middle',
	                    visible: false
	                }
	              ]],
         onClickRow:function(row){
        	 type=true;
        	// console.log(row);
        	 modelData.modelData(model.infogroup,row);
        	 model.infogroup['per_birthday'] = row.birthday;
        	 model.infogroup['per_petition_time'] = row.petition_time;
        	 model.infogroup['per_sex'] = row.sex;
        	 model.infogroup['per_cert_type'] = row.cert_type;
        	 model.infogroup['per_create_datetime'] = row.create_datetime;
        	 model.infogroup['per_update_uid'] = login.userId;
        	 model.infogroup['per_update_datetime'] = row.update_datetime;
        	 dialog.open({targetId:'infotd',title:'修改',h:"480"});
        	 
         }
	});
	$("input.input-sm").attr("placeholder","请输入姓名");
	//上访信息新增删除
	$("#oprbutton").on("click","a",function(){
		if(this.textContent=='添加'){
			type=false;
			model.infogroup['per_name']=model.infogroup['per_sex']=model.infogroup['per_birthday']=
				model.infogroup['per_cert_type']=model.infogroup['per_cert_code']=model.infogroup['per_family_address']=
					model.infogroup['per_petition_time']=model.infogroup['per_petition_reason']=model.infogroup['per_petition_content']=
						model.infogroup['per_create_us']=model.infogroup['per_update_us']='';
			db.query({
				request:{
					sqlId:'query_odd_name',
					params:[login.cusNumber]
				},
				success:function(data){
					data=JSON.parse(JSON.stringify(data));
					model.infogroup['odd_name']=data[0].odd_name;
				}
			});
			dialog.open({targetId:'infotd',title:'添加',h:"480"});
		}else{//记录删除
			
			var list=table.method("getSelections").map(function(row){
 	 			return {'per_cus_number':row['per_cus_number'],'per_record_id':row['per_record_id']};
 	 		});
			if(!list.length){
				tip.alert("请先选择要删除的项目");
				return;
			}
			//删除
			tip.confirm("是否删除已勾选的"+list.length+"条记录？",function(index){
				db.updateByParamKey({ 
					request:{
						sqlId:'delete_petition_info',
						whereId:'0',
						params:list
					},
					success:function(){
						tip.alert("删除成功");
						dialog.close();
						if(model.infogroup['per_record_id'].length){
							table.method("refresh",{request:{whereId:'0',params:{'per_record_id':model.infogroup['per_record_id']}}});
							refreshBar();
							queryMonth(list[0].begin_time.slice(0,4));
						}else{
							table.method("refresh");
							refreshBar();
							queryMonth(list[0].begin_time.slice(0,4));
						}
					},
					error:function(data,respMsg){
						tip.alert(respMsg);
					}
				});
			});
		}
	});
	
	//上访信息添加修改
	$("#infotd a").on("click",function(){
		//console.log(model.infogroup);
		if(validate(true))return;
		var sql;
		if(type){//修改
			sql="update_petition_info"
		}
		else{//新增
			sql="insert_petition_info"
		}
		
		tip.saving();
		db.updateByParamKey({
			request:{
				sqlId:sql,
				params:[model.infogroup]
			},
			success:function(data){
				!data.success&&tip.alert(data.respMsg);
//				table.method("refresh",{request:{params:{'per_record_id':model.infogroup['per_record_id']}}});
				table.method("refresh",{request:{whereId:"3",params:{'per_cus_number':login.cusNumber}}});
				dialog.close();
				tip.alert("保存成功");
				refreshBar();
				queryMonth(String(model.infogroup['per_petition_time']).slice(0,4));
				table.method("refresh",{request:{whereId:'2',params:{'chartData':String(model.infogroup['per_petition_time']).slice(0,7)}}});
			},
			error:function(data,respMsg){
				tip.alert(respMsg);
			}
		});
	});
	//取消按钮
	$("#quit").click(function(){
		dialog.close();
	});
	//图表
	function refreshBar() {
		var myChart = chart.init($("#barshow")[0]);
		var option = {
			    title : {
			        text: '上访年份统计',
			        textStyle:{
			        	fontSize: 11,
			        	color: '#fff'		        	
			        },
			        x:'left'
			    },
			    tooltip:{
			    	  trigger: 'item',
			    	  formatter:'{a}<br />{b}:共{c}次记录'
			    },
			    dataZoom : {
			    	show : true,
			    	realtime : true,
			    	height : 20,
			    	end : 100
			    },
			    xAxis : {
			            type : 'category',
			            axisLabel : {
			            	show : true,
			            	interval : '0',
			            	textStyle : {color:'#fff'}
			            },
			            data : []
			        },
			    yAxis :  {
			            type : 'value',
			            minInterval : '1',
			            axisLabel : {
			            	show : 'true',
			            	textStyle : {color:'#fff'}
			            }
			        },
			    series : 
			        {	name : '上访年份',
			            type : 'bar',
			            data : []
		        }
			};
		db.query({
			request:{
				sqlId:'query_petition_years',
				orderId:'0'
			},
			success:function(data){
				data=JSON.parse(JSON.stringify(data));
				for(var k in data){
					option.dataZoom.start = 100*(1-4/data.length);
					option.xAxis.data.push(data[k].per_petition_years);
					option.series.data.push(data[k].per_petition_count);
					myChart.setOption(option);
				}
			}
		});
		myChart.on('click',function(param) {
				queryMonth(param.name);
				//主图点击事件
				table.method("refresh",{request:{whereId:'4',params:{'yearData':param.name}}});
			});
	}
	refreshBar();
	function refreshPie(legend,series) {
		var myChart = chart.init($("#pieshow")[0]);
		var option = {
			    title : {
			        text: '上访月份统计',
			        textStyle:{
			        	fontSize: 11,
			        	color: '#fff'		        	
			        },
			        x:'left'
			    },
//			    legend: {
//		            x : 'left',
//		            y : 'bottom',
//		            textStyle:{
//		            	color:'#fff'
//		            },
//		            data:legend
//		        },
			    tooltip:{
			    	  trigger: 'item',
			    	  position:['50%','50%'],
			    	  formatter:'{a}<br />{b}:共{c}次记录'
			    },
			    series : 
			        {	name : '上访年月',
			            type : 'pie',
			            radius : '55%',
			            center : ['50%', '50%'],
			            data : series
		        }
			};
		myChart.setOption(option);
		//饼图点击事件
		myChart.on('click',function(param) {
			table.method("refresh",{request:{whereId:'2',params:{'chartData':param.name}}});
		});
	}
	//查询月份函数
	function queryMonth(year){
		db.query({
			request:{
				sqlId:'query_petition_months',
				params:[year],
				orderId:'0'
			},
			success:function(data){
				data=JSON.parse(JSON.stringify(data));
				var legendData = [];
				var seriesData = [];
				for(var k in data){
					//legendData.push(data[k].begin_months);
					seriesData.push({name:data[k].begin_months,value:data[k].begin_count});
					refreshPie(legendData,seriesData);
				}
			}
		});
	}
	//默认显示当前年份的饼图数据
	var date = new Date();
	var currentYear = date.getFullYear();
	var mm=date.getMonth();
	mm=(mm+1)<10?('0'+(mm+1)):mm+1;
	var currentMonth = currentYear + '-' + mm;
	queryMonth(currentYear);
	
	//默认显示当前月份的表格数据
	table.method("refresh",{request:{whereId:'2',params:{'chartData':currentMonth}}});
	//点击返回按钮
	$("#back").on("click",function() {
		table.method("refresh",{request:{whereId:'3',params:{'per_cus_number':login.cusNumber}}});
	});
	function validate(flag){
		if(flag){
			var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
			var per_sex = model.infogroup['per_cert_code'].slice(16,17)%2==0?1:2;
			var date=new Date();
			var yyyy=date.getFullYear();
			var mm=date.getMonth();
			var dd=date.getDate();
			yyyy=yyyy<10?('0'+yyyy):yyyy;
			mm=(mm+1)<10?('0'+(mm+1)):mm+1;
			dd=dd<10?('0'+dd):dd;
			var current = yyyy+'-'+mm+'-'+dd;
			return !model.infogroup['per_name'].length&&!tip.alert("请输入姓名")||
			!String(model.infogroup['per_sex']).length&&!tip.alert("请选择性别")||
			!model.infogroup['per_birthday'].length&&!tip.alert("请输入出生日期")||
			!String(model.infogroup['per_cert_type']).length&&!tip.alert("请选择证件类型")||
			!model.infogroup['per_cert_code'].length&&!tip.alert("请输入身份证号码")||
			reg.test(model.infogroup['per_cert_code'])==false&&!tip.alert("身份证号码输入不规范")||
			model.infogroup['per_cert_code'].slice(6,14)!=model.infogroup['per_birthday'].split('-').join('')&&!tip.alert("出生日期与身份证中的信息不符")||
			model.infogroup['per_sex']!=per_sex&&!tip.alert("性别与身份证中的信息不符")||
			!model.infogroup['per_petition_time'].length&&!tip.alert("请输入上访时间")||
			model.infogroup['per_petition_time']>current&&!tip.alert("上访时间必须小于等于当前时间")||
			(model.infogroup['per_birthday']>=model.infogroup['per_petition_time'])&&!tip.alert("上访时间必须大于出生时间")||
			!model.infogroup['per_family_address'].length&&!tip.alert("请输入家庭住址")||
			!model.infogroup['per_petition_reason'].length&&!tip.alert("请输入上访原因")||
			!model.infogroup['per_petition_content'].length&&!tip.alert("请输入上访处置情况");
		}
 	}
});