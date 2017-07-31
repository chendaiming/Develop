define(["vue","frm/loginUser","frm/hz.db","frm/message","frm/datepicker","frm/treeSelect","frm/localStorage","frm/select"],function(tpl,login,db,tip,t,tree,ls){
	var model=new tpl({
		el:'#recordFace',
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
			clera:function(){
				this.multi['day']=(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()<10?('0'+date.getDate()):date.getDate())})();
				this.multi['plc']='';
				this.multi['p']='';
				this.multi['status']='';
			}
		}
	});
	//时间线
	function query(pageindex,flag){
		//时间轴数据
		db.query({
			request:{
				sqlId:'select_face_recognition_record',
				params:model.multi,//[login.cusNumber,model.today],
				whereId:flag?'0':'',
				orderId:'0',
				pageIndex:pageindex,
				pageSize:20
			},
			success:function(data){
				model.total=data.count;
				console.log(JSON.stringify(data.data))
				model.records=flag?data.data:model.records.concat(data.data);
				if( model.multi['status'] || model.multi['p'] ){
					if(model.records.length==0 & model.multi['status']==''){
						tip.alert("暂无此人记录!");
					}
					if( model.records.length==0 & model.multi['status']!='' & model.multi['p']!=''){
						tip.alert("暂无此人记录或类型不匹配!");
					}
				}
				
			}
		});
	}
	query(1,true);
	//人物快速查询
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
	//警员树
	db.query({
		request:{
			sqlId:'select_face_by_orgid',
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
								model.multi['p']=node.name;
								model.multi['plc']=node.id;
							}else{
								tip.alert("请选择警员");
							}
						}
					}
			};
			tree.init("dep",setting,keepLeaf(data));
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