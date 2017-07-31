define(["vue","frm/loginUser","frm/hz.db","frm/message","frm/datepicker","frm/treeSelect","frm/hz.videoclient","frm/select"],function(tpl,login,db,tip,t,tree,video){
	var model=new tpl({
		el:'#recordPatrol',
		data:{
			records:[],
			total:'0',
			multi:{
				'day':(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()<10?('0'+date.getDate()):date.getDate())})(),
				'plc':'',
				'p':'',
				'status':'',
				'cus':login.cusNumber
			}
		},
		watch:{
			'multi.day':function(val,old){
				model.multi['day']=val;
				query(1,true);
			},
			'multi.status':function(val){
				model.multi['status']=val;
				query(1,true);
			},
			'multi.plc':function(val){
				model.multi['plc']=val;
				query(1,true);
			}
		},
		methods:{
			query:function(){
				query(1,true);
			},
			playBack:function(record){
				playBack(record);
			},
			reset:function(){
				this.multi['plc']='';
				this.multi['p']='';
				this.multi['status']='';
			}
		}
	});
	//时间线
	function query(pageindex,flag,conc){
		//时间轴数据
		db.query({
			request:{
				sqlId:'select_record_patrol',
				params:model.multi,//[login.cusNumber,model.today],
				whereId:!conc?(flag?'0':''):'0',
				orderId:'0',
				pageIndex:pageindex,
				pageSize:20
			},
			success:function(data){
				model.total=data.count;
				model.records=flag?data.data:model.records.concat(data.data);
			}
		});
	}
	query(1,true);
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
			this.children.length>=20&&query(parseInt(this.children.length/20)+1,false,true);
		}
	};
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
								model.multi['p']=node.name;
								model.multi['plc']=node.id;
							}else{
								tip.alert("请选择刷卡人");
							}
						}
					}
			};
			tree.init("dep",setting,keepLeaf(data));
		}
	});
	//视频回放
	function playBack(item){
		db.query({
			request:{
				sqlId:'query_link_device_by_device',
				whereId:'0',
				params:{'cusNumber':login.cusNumber,'mainType':'16','dtlsType':'1','id':item.id}
			},
			success:function(data){
				if(data.length==0){
					tip.alert('未关联摄像机');
					return;
				}
				
				var time=new Date(item.rtime);
				var beginTime=new Date(time.getTime()-15000);
				beginTime=beginTime.getFullYear()+'-'+keepFomart(beginTime.getMonth()+1)+'-'+keepFomart(beginTime.getDate())+' '+keepFomart(beginTime.getHours())+':'+keepFomart(beginTime.getMinutes())+':'+keepFomart(beginTime.getSeconds());
				
				var endTime=new Date(time.getTime()+45000);
				
				endTime=endTime.getFullYear()+'-'+keepFomart(endTime.getMonth()+1)+'-'+keepFomart(endTime.getDate())+' '+keepFomart(endTime.getHours())+':'+keepFomart(endTime.getMinutes())+':'+keepFomart(endTime.getSeconds());
				
				var list=data.map(function(row){
					return {
						"cameraId":row['dld_dvc_id'],
						"beginTime":beginTime,
						"endTime":endTime
					};
				});
				
				video.playback(list);
				tip.alert('请求视频中...');
			}
		});
	}
	function keepFomart(value){
		if(value<10){
			return '0'+value;
		}else{
			return value;
		}
	}
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