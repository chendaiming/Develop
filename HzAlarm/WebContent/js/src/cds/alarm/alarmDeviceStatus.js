define(['jquery','vue','frm/hz.db',"frm/loginUser","frm/treeUtil","frm/model","frm/treeSelect","frm/message","frm/localData","frm/select"],function($,tpl,db,login,util,modelUtil,treeSelect,tip,localData){

	var treeContainer,
		list,
		orgContainer;

	var model=new tpl({
		el:"#form",
		data:{
			alarmDevs:[],
			area:'',
			search:""
		},methods:{
			close:function(e){
				window.frameElement.parentNode.parentNode.querySelector("a.layui-layer-close").click();
			}
		},
		watch:{
			searchd:function(val){
				if(val){
					model.alarmDevs=list.filter(function(item){
						if(item.name.indexOf(val)>-1) return true;
					});
				}else{
					model.alarmDevs=list;
				}
			}
		}
	});
	//树形设置
	var setting={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
			view: {dblClickExpand: false},
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			callback:{
				onClick:function(e,evnt,node){
					if(node.type!=1){
						model.area=node.name;
					}else{
						var p=node.getParentNode();
						
						model.area=p&&p.name;
					}
					model.alarmDevs= list =treeContainer.transformToArray(node).filter(function(item){
						if(item.type==1)return true;
					});
				}
			}
	};

	function initTreeS(){
		//初始化左侧树，系统管理员，一般用户,省局用户
		db.query({
			request:{
				sqlId:'query_alarm_area_tree',
				params:{org:login.sysAdmin||login.dataAuth==2?login.cusNumber:login.deptId,type:(!login.cusNumber||login.dataAuth==2)?'3':'2'},
				orderId:'0',
				whereId:(!login.cusNumber||login.dataAuth==2)?'':'0'
			},success:function(data){
				data=keepLeaf(data);
				treeContainer=$.fn.zTree.init($("#tree"),setting,data);
				model.$watch("search",function(val){
					util.searchTree("name",val,"tree",data,setting);
				});
				data.length>0&&$("#"+treeContainer.getNodes()[0].tId+"_a").click();
			}
		});
	}
	initTreeS();
	
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