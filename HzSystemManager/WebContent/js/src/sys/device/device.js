define(["vue","frm/message","frm/loginUser","frm/dialog",'frm/hz.db',"frm/treeSelect","frm/model","echarts","frm/datepicker","frm/select"],function(tpl,tip,login,dialog,db,tree,modelData,chart){
	//设备缓存
	var deviceList={};
	//是否打开了弹窗
	var dialogf=false;
	//详细信息
	var detailCon=$("#details");
	var setting={
			diyClass:'conditionslid',
			expand:true,
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			callback:{
				onClick:function(e,id,node){
					if(node.type==1){
						var p=node.getParentNode();
						if(dialogf){
							model.record['devicename']=node.name;
							model.record['deviceid']=node.id;
							model.record['areaid']=node.pid?node.pid.replace("1-",""):"";
							model.record['area']=p?p.name:'';
						}else{
							model.condition['devicename']=node.name;
							model.condition['deviceid']=node.id;
						}
					}else{
						tip.alert("请选择设备");
					}
				}
			}
	};
	
	var deviceSql={
			"1":{//摄像机类别1
				sqlId:'select_device_camera_type',
				params:{'cus':login.cusNumber},
				orderId:'0',
				whereId:'0'
			},
			"2":{//门禁类别为2
				sqlId:'select_device_door_type',
				params:{'cus':login.cusNumber},
				orderId:'0',
				whereId:'0'
			},
			"3":{//对讲设备
				sqlId:'select_device_videotalk_type',
				params:{'cus':login.cusNumber},
				orderId:'0',
				whereId:'0'
			},	
			"4":{//广播
				sqlId:'select_device_broadcast_type',
				params:{'cus':login.cusNumber},
				orderId:'0',
				whereId:'0'
			},
			"5":{//大屏
				sqlId:'select_device_screen_type',
				params:{'cus':login.cusNumber},
				whereId:'0'
			},
			"6":{//网络报警select_device_alertor_type
				sqlId:'select_device_alertor_type',
				params:{'cus':login.cusNumber},
				orderId:'0',
				whereId:'0'
			},
			"7":{//高压电网select_device_network_type
				sqlId:'select_device_network_type',
				params:{'cus':login.cusNumber},
				orderId:'0',
				whereId:'0'
			}
			
	}
	var currentDay=(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()<10?('0'+date.getDate()):date.getDate())+" "+date.getHours()+":"+date.getMinutes()})();
	var model=new tpl({
		el:'#record',
		data:{
			records:[],
			total:'',
			condition:{
				userid:login.userId,
				username:'',
				devicetype:'',
				deviceid:'',
				devicename:'',
				cus:login.cusNumber,
				rel:'',
				date:currentDay.substr(0,10)
			},
			record:{
				cus:login.cusNumber,
				repairdate:currentDay,
				repairman:'',
				devicetype:'',
				devicename:'',
				deviceid:'',
				area:'',
				areaid:'',
				mark:'',
				user:login.userId,
				recorder:login.userName
			},
			detail:{
				mark:'',
				devicename:'',
				area:''
			}
		},
		methods:{
			open:function(){
				dialogf=true;
				modelData.clear(model.record,{"cus":"","user":"","repairdate":"","recorder":""});
				model.devicetype='';
				dialog.open({
					targetId:'newRecord',
					title:'新增',
					h:'350',
					closeCallback:function(){
						dialogf=false;
					}
				});
			},
			query:function(){
				query(1,false,true);
			},
			reset:function(){
				modelData.clear(model.condition,{"cus":"","date":"","recorder":""});
			},
			save:function(){
				if(validate())return;
				db.updateByParamKey({
					request:{
						sqlId:'insert_device_repair_record',
						params:model.record
					},success:function(data){
						tip.alert("保存成功");
						dialog.close();
						dialogf=false;
						query(1,false,true);
					}
				});
			},
			showDevice:function(e){
				if(!model.condition['devicetype'].length){
					tip.alert("请先选择设备类型");
					return;
				}
				var offset=$(e.target).offset();
				var deviceType=model.condition['devicetype'];
				if(!deviceList[deviceType]){
					//
					db.query({
						request:deviceSql[deviceType],
						success:function(data){
							deviceList[deviceType]=keepLeaf(data);
							setting.type=deviceType;
							setting.click=false;
							tree.init("deviceName",setting,deviceList[deviceType]);
							$("#id"+deviceType+"deviceName").css({left : offset.left,top : offset.top+e.target.clientHeight,width:e.target.clientWidth}).slideDown();
						}
					});
					return;
				}
				$("#id"+deviceType+"deviceName").css({left:offset.left,top:offset.top+e.target.clientHeight,width:e.target.clientWidth}).slideDown();

			},
			checkType:function(e){
				if(!model.record['devicetype']){
					tip.alert("请先选择设备类型");
					e.stopPropagation();
					return false;
				}
			},
			details:function(record){
				model.detail['mark']=record.mark;
				model.detail['area']=record.area;
				model.detail['devicename']=record.devicename;
				detailCon.css("height","100px");
			},
			close:function(e){
				if(e.layerY<20&&e.layerX>280){
					e.target.style.height="0px";
				}
			}
		},
		watch:{
			"record.devicetype":function(val,old){
				if(val.length==0)return;
				model.condition['rel']=val+'deviceName';
				model.record['devicename']='';
				if(!deviceList[val]){
					//
					db.query({
						request:deviceSql[val],
						success:function(data){
							deviceList[val]=keepLeaf(data);
							setting.type=val;
							tree.init("deviceName",setting,deviceList[val]);
						}
					});
				}
			},
			"condition.devicetype":function(){
				model.condition['devicename']='';
			},
			"condition.devicename":function(val){
				if(!val){
					model.condition['deviceid']='';
				}
			},
			"condition.username":function(val){
				if(!val){
					model.condition['userid']='';
				}
			},
			"condition.date":function(val){
				query(1,false,true);
			}
		}
	});
	var option = {
		    title : {
		        text: '类型统计',
		        textStyle:{
		        	fontSize: 11,
		        	color: '#fff'		        	
		        },
		        x:'center'
		    },
		    tooltip:{
		    	  trigger: 'item',
		          formatter: "{b}>>维修次数  {c} 次"
		    },
		    series : 
		        {	
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
	        },
	        legend: {
	            orient : 'vertical',
	            x : 'left',
	            textStyle:{
	            	color:'#fff'
	            },
	            data:['摄像机','门禁','对讲','广播','大屏','网络报警','高压电网']
	        },
		};
	var tables=document.getElementById("tableshow");
	//flag是否重新渲染
	function query(pageindex,flag,con){
		//时间轴数据
		db.query({
			request:{
				sqlId:'select_device_repair_record',
				params:model.condition,//[login.cusNumber,model.today],
				whereId:con?"0":"",
				orderId:'0',
				pageIndex:pageindex,
				pageSize:20
			},
			success:function(data){
				
				model.total=data.count;
				model.records=flag?model.records.concat(data.data):data.data;
				//多条件查询
				con&&db.query({
					request:{
						sqlId:'select_device_groupby_type',
						params:model.condition,
						whereId:con?"0":"",
						orderId:'0'
					},
					success:function(data){
						option.series.data=data.length?JSON.parse(JSON.stringify(data)):[{name:'暂无数据',value:''}];
						chart.init(tables).setOption(option);
					}
				});
			}
		});
	}
	query(1,false,true);
	//用户树
	db.query({
		request:{
			sqlId:'select_record_user',
			params:{'cus':login.cusNumber}
		},success:function(data){
			var setting={
					diyClass:'conditionslid',
					expand:true,
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(e,id,node){
							if(node.type==1){
									model.condition['username']=node.name;
									model.condition['userid']=node.id;
							}else{
								tip.alert("请选择人物");
							}
						}
					}
			};
			tree.init("findauser",setting,keepLeaf(data));
		}
	});
	//滚动事件
	var direction=0;
	var listContainer=document.getElementById("scroll");
	listContainer.onscroll=function(){
		//距离底部的高度
		var l=this.scrollHeight-this.scrollTop-this.clientHeight,f=l<direction;
		direction= l;
		if(f&&l==0){//判断滚动方向小于乡下
			if(model.total==this.children.length){
				tip.alert("数据已全部加载");
				return;
			}
			this.children.length>=20&&query(parseInt(this.children.length/20)+1,true);
		}
	};
	function validate(){
		return !model.record['devicetype'].length&&!tip.alert("请选择设备类型")||
		!model.record['devicename'].length&&!tip.alert("请选择设备名称")||
		!model.record['repairman'].length&&!tip.alert("请输入维修人员")||
		model.record['mark'].length>850&&!tip.alert("维修详情字数需小于850个字符");
	}
	//保留子节点
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