define(["echarts","vue","frm/loginUser","frm/hz.db","frm/message","frm/datepicker","frm/treeSelect","frm/localStorage"],function(chart,tpl,login,db,tip,t,tree,ls,util){
    var currentDay=(function(){var date = new Date();return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()<10?('0'+date.getDate()):date.getDate())})();
	var model=new tpl({
		el:"#record",
		data:{
			records:[],
			talk:'',
			day:currentDay,
			condition:{
				talk:'',
				day:currentDay
			},
			total:''
		},
		methods:{
			query:function(){
				query(1,false);
			}
		},
		watch:{
			talk:function(val,old){
				if(val.length==0){
					model.condition['talk']='';
				}
				query(1,false);
			},
			day:function(val){
				model.condition.day=val;
				query(1,false);
			}
		}
	});
	//对讲记录
	function query(pageindex,flag){
		db.query({
			request:{
				sqlId:'select_talk_record',
				params:{'cus':login.cusNumber,'day':model.condition.day,'talkid':model.condition['talk'],'min':20*(pageindex-1),'max':20*pageindex},
				whereId:model.condition['talk']?'0':'',
			    orderId:'0'
			},success:function(data){
				if(!data.length)return;
				model.total=data.shift().name;
				model.records=flag?model.records.concat(data):data;
			}
		});
	}
	query(1);
	//对讲机搜索
	db.query({
		request:{
			sqlId:'select_talk_device',
			params:{'level':(login.dataAuth!=2)?'2':'3','cus':login.cusNumber}
		},success:function(data){
			var setting={
					key:'name',
					diyClass:'conditionslid',
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					expand:true,
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					view: {dblClickExpand: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					callback:{
						onClick:function(id,e,node){
							if(node.type==1){
								model.talk=node.name;
								model.condition['talk']=node.id;
							}
						}
					}
			}
			tree.init("talk",setting,keepLeaf(data));
		}
	});
	//滚动事件
	var direction=0;
	document.getElementById("ullist").onscroll=function(){
		var l=this.scrollHeight-this.scrollTop-this.clientHeight,f=l<direction;
		direction= l;
		if(f&&l==0){//判断滚动方向小于乡下
			if(model.total==this.children.length){
				tip.alert("数据已全部加载");
				return;
			}
			console.log(this.children.length);
			this.children.length>=19&&query(this.children.length/19+1,true);
		}
	};
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