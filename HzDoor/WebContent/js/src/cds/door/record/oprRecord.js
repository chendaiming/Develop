define(["echarts","vue","frm/loginUser","frm/hz.db","frm/message","frm/datepicker","frm/treeSelect","frm/localStorage"],function(chart,tpl,login,db,tip,t,tree,ls,util){
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
			multi:{
				'day':currentDay,
				'plc':'',
				'doorId':doorId,
				'org':login.cusNumber,
				'cus':login.cusNumber
			},
			today:currentDay//(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()})()
		},
		watch:{
			today:function(val,old){
				model.multi['day']=val;
				conditionQuery(val);
			}
		},
		methods:{
			query:function(){
				if(!model.multi['plc']&&!model.multi['doorId']){
					tip.alert("请先选择查询条件");
				}else{
					!model.plc.length&&(model.multi['plc']='');
					!model.address.length&&(model.multi['doorId']='');
					conditionQuery(model.today,true);
				}
			}
		}
	});
	conditionQuery(model.today);
	//时间线
	function query(pageindex,flag){
		//时间轴数据
		db.query({
			request:{
				sqlId:'select_opr_record_bydate',
				params:model.multi,//[login.cusNumber,model.today],
				whereId:(model.multi.doorId.length?'0':''),
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
			this.children.length>=20&&query(parseInt(this.children.length/2)+1,false);
		}
	};
	var option = {
		    title: {
		        text: '操作类型',
		        left: 'center',
		        top: 20,
		        textStyle: {
		            color: '#ccc'
		        }
		    },

		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}  {c} ({d}%)"
		    },
		    visualMap: {
		        show: false,
		        min: 80,
		        max: 600,
		        inRange: {
		            colorLightness: [0, 1]
		        }
		    },
		    series : [
		        {
		            name:'访问来源',
		            type:'pie',
		            radius : '55%',
		            center: ['50%', '50%'],
		            roseType: 'angle'
		           
		        }
		    ]
		};
	//条件查询
	function conditionQuery(date,multi){
			//时间线查询
			query(1,true);
			//按照时间段查询，一天24小时
			db.query({
				request:{
					sqlId:'query_record_time',
					params:model.multi,//[date,login.cusNumber],
					orderId:'0',
					whereId:multi?'1':model.multi.doorId?'0':''
				},
				success:function(data){
					option.series.data=data;
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
							if(node.type==1){
								model['address']=node.name;
								model.multi['doorId']=node.id;
							}else{
								tip.alert("请选择门禁");
							}
						}
					}
			}
			var temp=tree.init("address",setting,keepLeaf(data));
			if(doorId.length){
				var node=temp.getNodeByParam("id",doorId);
				model.address=node.name;
				model.multi['doorId']=doorId;
			}
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