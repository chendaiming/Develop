define(function(require){
	
	 var chart=require("echarts"),
	    tpl=require("vue"),
	    login=require("frm/loginUser"),
	    db=require("frm/hz.db"),
	    tip=require("frm/message"),
	    dialog=require("frm/dialog"),
	    t=require("frm/datepicker"),
	    tree=require("frm/treeSelect"),
	    ls=require("frm/localStorage");
	
	
	
	
	var tables=document.getElementById("tableshow");
	var count=0,time=true;
	var tempId=ls.getItem("doorId");
	var doorId=tempId?tempId:'';
	
    var currentDay=(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()<10?('0'+date.getDate()):date.getDate())})();
	var model=new tpl({
		el:'#record',
		data:{
			records:[],
			total:'0',
			out:'0',
			enter:'0',
			plc:'',
			address:'',
			area:'',
			multi:{
				'day':currentDay,
				'area':'',
				'plc':'',
				'doorId':doorId,
				'org':login.cusNumber
			},
			today:currentDay//(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()})()
		},
		watch:{
			today:function(val,old){
				model.multi['day']=val;
				conditionQuery(val);
				time=false;
			}
/*			plc:function(val,old){
				time=false;
				if(val.length){
					query(1,model.multi['plc']);
				}else{
					query(1);
				}
			}*/
		},
		methods:{
			query:function(){
				if(!model.multi['plc']&&!model.multi['doorId']&&!model.multi['area']){
					tip.alert("请先选择查询条件");
				}else{
					!model.plc.length&&(model.multi['plc']='');
					!model.address.length&&(model.multi['doorId']='');
					!model.area.length&&(model.multi['area']='');
					conditionQuery(model.today,true);
				}
			},
			reset:function(){
				model.address='';
				model.area='';
				model.plc='';
				this.query();
			},
			exportClick:function(num){
				switch(num){
					case 0:
						$('#divExcel').fadeIn();
					  break;
					case 1:
						tableToExcel('tableExcel');
						$('#divExcel').fadeOut();
					  break;
					case 2:
						$('#divExcel').fadeOut();
					  break;
				}
				 
			}
		}
	});
	conditionQuery(model.today);
	var tableToExcel = (function() {  
        var uri = 'data:application/vnd.ms-excel;base64,',  
            template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',  
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },  
            format = function(s, c) {  
                    return s.replace(/{(\w+)}/g,function(m, p) { 
	                    		return c[p]; 
	                    	}) 
             }  
        return function(table, name) {  
            if (!table.nodeType) table = document.getElementById(table)  
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}  
            window.location.href = uri + base64(format(template, ctx))  ;
            tip.alert("门禁卡记录导出成功");
        }  
    })()  
	
	//时间线
	function query(pageindex,key){
		var type=(key&&typeof key=='object');
		var param=!type?{'org':model.multi['org'],'day':model.today,'plc':key?key:null,'doorId':doorId}:key;
		//时间轴数据
		db.query({
			request:{
				sqlId:'select_records_by_date',
				params:param,//[login.cusNumber,model.today],
				whereId:!type?(param.doorId.length?'-1':(param.plc?'0':'')):'1',
				orderId:'0',
				pageIndex:pageindex,
				pageSize:20
			},
			success:function(data){
				model.total=count=data.count;
				model.records=!time?data.data:model.records.concat(data.data);
				time=true;
			}
		});
	}
	//刷卡人快速查询
	var timer=null,key;
	
	//滚动事件
	var direction=0;
	document.getElementById("scroll").onscroll=function(){
		//距离底部的高度
		var l=this.scrollHeight-this.scrollTop-this.clientHeight,f=l<direction;
		direction= l;
		if(f&&l==0){//判断滚动方向小于乡下
			console.log(this.children.length);
			if(model.total==this.children.length){
				tip.alert("数据已全部加载");
				return;
			}
			this.children.length>=20&&query(parseInt(this.children.length/20)+1,key);
		}
	};
	var option = {
		    title : {
		        text: '区统计',
		        left:'left',
		        textStyle:{
		        	fontSize: 11,
		        	color: '#fff'	
		        },
		        x:'center'
		    },
		    tooltip:{
		    	  trigger: 'item',
		          //formatter: "{b}:刷卡{c}次",
		    	  formatter:function(a,b,c){
		    		  if(a.data.value){
		    			  return a.name+":刷卡"+a.data.value+"次"
		    		  }else{
		    			  return "暂无数据" 
		    		  }
		    		  
		    	  },
		          textStyle:{
		        	  fontSize:12	
		          },
		          x: 81,
		          y: 133
		    },
		    series : 
		        {	
		    		name: '刷卡区域',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		        }
		};
	var line={
        	lineStyle:{
        		color:'rgb(255, 255, 255)'
        	}
        };
	var options = {
			legend:{left:'0px'},
            title: {
                text: '时间段',
                textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        }
            },
            tooltip: {},
            xAxis: {
                data: (function(){
                	var data=[];
                	for(var i=0;i<24;i++){
                		data.push({value: (i<10?('0'+i):i)+':00',textStyle:{fontSize:4}});
                	}
                	return data;
                })(),
                axisLine:line
            },
            yAxis: {
            	axisLine:line
            },
            series: {
            	name:'刷卡次数',
                type: 'bar'
            }
        };
	//条件查询
	function conditionQuery(date,multi){
			time=false;
			//时间线查询
			query(1,model.multi);
			//按照时间段查询，一天24小时
			db.query({
				request:{
					sqlId:'query_record_time',
					params:model.multi,//[date,login.cusNumber],
					orderId:'0',
					whereId:multi?'1':model.multi.doorId?'0':''
				},
				success:function(data){
					options.series.data=data[0].r&&data[0].r.split(",");
					chart.init(tables.nextElementSibling).setOption(options);
				}
			});
			//按照区域查询
			db.query({
				request:{
					sqlId:'query_record_area',
					params:model.multi,//[login.cusNumber,date],
					orderId:'0',
					whereId:multi?'1':model.multi.doorId?'0':''
				},
				success:function(data){
					option.series.data=data.length?JSON.parse(JSON.stringify(data)):[{name:'暂无数据'}];
					chart.init(tables).setOption(option);
				}
			});
			//出门次数
			db.query({
				request:{
					sqlId:'query_record_out',
					params:model.multi,
					whereId:multi?'1':model.multi.doorId?'0':'',
					orderId:'0'
				},success:function(data){
					setTimeout(function(){
						model.out=data[0]?data[0]['out']:'0';
						model.enter=(model.total-model.out)>0?(model.total-model.out):'0';
					},200);
				}
			});
	}
	//地点树
	db.query({
		request:{
			sqlId:'select_address_by_org',
			orderId:'0',
			where:(login.dataAuth!=2)?'':'0',
			params:{'level':(login.dataAuth!=2)?'2':'3','org':login.cusNumber}
		},success:function(data){
			var setting={
					path:'../../../../libs/ztree/css/zTreeStyle/img/',
					diyClass:'conditionslid',
					expand:true,
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(id,e,node){
//							if(node.type==1){
								model['address']=node.name;
								model.multi['doorId']=node.id;
//							}else{
//								tip.alert("请选择地址");
//							}
						}
					}
			}
			var temp=tree.init("address",setting,keepLeaf(data));
			if(doorId.length){
				var node=temp.getNodeByParam("id",doorId);
				model.address=node.name;
				model.multi['doorId']=doorId;
			}
			//区域树
			db.query({
				request:{
					sqlId:'select_query_area',
					params:{'org':model.multi['org'],'doorId':doorId,'level':(login.dataAuth!=2)?'2':'3'}
				},success:function(data){
					var setting={
							diyClass:'conditionslid',
							expand:true,
							edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
							view: {dblClickExpand: false},
							data: {simpleData: {enable: true,pIdKey: "pid"}},
							callback:{
								onClick:function(id,e,node){
									if(node.type==1){
										model['area']=node.name;
										model.multi['area']=node.id;
									}else{
										tip.alert("请选择区域");
									}
								}
							}
					}
					tree.init("dep",setting,data);
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
									path:'../../../../libs/ztree/css/zTreeStyle/img/',
									data: {simpleData: {enable: true,pIdKey: "pid"}},
									callback:{
										onClick:function(e,id,node){
											if(node.type==1){	
												model.plc=node.name;
												model.multi['plc']=node.id;
											}else{
												tip.alert("请选择刷卡人");
											}
										}
									}
							};
							tree.init("finda",setting,keepLeaf(data));
						}
					});
				}
			});
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
});