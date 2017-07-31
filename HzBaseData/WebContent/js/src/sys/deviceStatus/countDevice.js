define(['jquery','vue','frm/hz.db',"frm/table","frm/message","frm/model","frm/treeSelect","frm/loginUser","echarts","frm/select","frm/datepicker"],function($,tpl,db,table,tip,modelData,tree,login,chart){
	
	var d=new Date();
	
	var date = d.Format('yyyy-MM-dd'),areaTree,echart;
	
	var end=new Date(Date.parse(d)-1000*60*60*24*7).Format('yyyy-MM-dd');
	
	var pie=document.querySelector("#tablepie");
	
	var model=new tpl({
		el:'#constlist',
		data:{
			condition:{
				'begin':end,
				'end':date,
				'dsr_dvc_name':'',
				'dsr_dvc_type':'',
				'dsr_dvc_status':''
			},
			flag:true
		},
		watch:{
			'condition.begin':function(val){
				this.flag&&refresh();
			},
			'condition.end':function(val){
				this.flag&&refresh();
			},
			'condition.dsr_dvc_type':function(){
				this.flag&&refresh();
			},
			'condition.dsr_dvc_name':function(val,old){
			
				this.flag&&refresh();
			},
			'condition.dsr_dvc_status':function(val,old){
				this.flag&&refresh();
			}
		},
		methods:{
			clear:function(){
				this.flag=false;
				model.condition.begin=end;
				model.condition.end=date;
				model.condition.dsr_dvc_type='';
				model.condition.dsr_dvc_name='';
				model.condition.dsr_dvc_status='';
				
				refresh();
			}
		}
	});
	function refresh(t){
		t||initPie();
		table.method('refresh',{request:{
			params:model.condition
	     }});
		model.$nextTick(function(){
			model.flag=true;
		});
	}
	var option = {
			title:{
				text:'',
				textAlign:'center',
				bottom:'0px',
				left:'45%',
				textStyle:{
	        		color:'#fef',
	        		fontSize:'12'
        		},
			},
		    tooltip: {
		        trigger: 'item',
		        formatter:"<span>{a}</span> <br/>{b}: {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        x: 'left',
		        textStyle:{
	        		color:'#fff'
        		},
		        data:[]
		    },
		    series: [
		        {
		            name:'正常',
		            type:'pie',
		            selectedMode: 'single',
		            radius: [0, '30%'],
		            center: ['50%', '50%'],
		            label: {
		                normal: {
		                    position: 'inner'
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: true
		                }
		            },
		            data:[]
		        },
		        {
		            name:'异常',
		            type:'pie',
		            radius: ['50%', '65%'],
		            center: ['50%', '50%'],
		            data:[]
		        }
		    ]
		};
	//初始化饼状图
	function  initPie(flag){
		option.series[0].data=[];
		option.series[1].data=[];
		option.legend.data=[];
		option.title.text=model.condition.begin.replace(/-/g,'.')+'~'+model.condition.end.replace(/-/g,'.')+':期间各个设备状态统计';
		db.query({
			request:{
				sqlId:'select_device_status_echart_all',
				params:model.condition,
				orderId:'0',
				whereId:'0'
			},success:function(data){
				
				if(data.length){
					for(var i=0,len=data.length;i<len;i++){
						if(data[i]['dsr_dvc_status']==0){//正常
							option.series[0].data.push(data[i]);
							option.legend.data.push(data[i]['name']);
						}else{
							option.series[1].data.push(data[i]);
						}
					}
				}else{
					option.series[0].data=[{name:'暂无数据'}];
					option.series[1].data=[{name:'暂无数据'}];
				}
				//option.title.text=model.condition.year+'设备异常数量统计';
				
				option.series[0].data.length&&(option.series[0].data[0].selected=true);
				
				echart=chart.init(pie);
				
				echart.setOption(option);
				
				if(flag){//窗口大小改变
					table.method("resetView");
				}else{
					echart.on('click',function(item){
						model.flag=false;
						model.condition.dsr_dvc_status=item.data['dsr_dvc_status'];
						model.condition.dsr_dvc_type=item.data['dsr_dvc_type'];
						refresh(true);
					});
				}
			}
		});
		
	}
	initPie();
	//table表
	table.init("table",{
		search:false,
		showColumns:true,
		request:{
			sqlId:'select_device_status_all',
			whereId:'0',
			params:model.condition,
			orderId:'0'
		},
		columns: [[   
					{
					    title: '设备类型',
					    field: 'dsr_dvc_type_name',
					    align: 'center',
					    valign: 'middle'
					},
		            {
			            title: '设备名称',
			            field: 'dsr_dvc_name',
			            align: 'center',
			            valign: 'middle'
			        },
	                {
	                    title: '设备状态',
	                    field: 'dsr_dvc_status',
	                    align: 'center',
	                    valign: 'middle',
	                    formatter:function(item){
	                    	
	                    	return "<span style='color:"+(item=="正常"?"green":"red")+"'>"+item+"</span>"
	                    }
	                },
	                {
	                    title: '状态描述',
	                    field: 'status',
	                    align: 'center',
	                    valign: 'middle'
	                },
	                {
	                    title: '更新日期',
	                    field: 'fredate',
	                    align: 'center',
	                    valign: 'middle'
	                }
	              ]]
	});
  
    window.onresize=function(){
    	initPie(true);
    }
});