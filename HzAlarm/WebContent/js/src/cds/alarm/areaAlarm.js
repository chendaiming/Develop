define(["hz/map/map.handle",'frm/hz.db',"frm/loginUser","vue","frm/message","frm/treeUtil","ztree"],function(mapHandle,db,login,tpl,tip){
	//窗口设置
	var p=window.frameElement.parentNode.parentNode;//包含iframe的div
	var f=document.querySelector("div.left-con"),treeContainer;
	
	var list=[];
	var areaCache = [];
	var boxSelect = mapHandle.boxSelect;

	var model=new tpl({
		el:'#form',
		data:{
			prisons:[],
			RFID:[112]
		},
		methods:{
			choose:function(e,item,index){
				e.target.classList.toggle("select");
				if(e.target.classList.contains("select")){
					list.splice(index,0,item);
				}else{
					list.splice(index,1);
				}
			},
			save:function(){
				if(list.length==0){
					tip.alert("请选择罪犯");
					return;
				}
				if(!this.RFID.length){
					tip.alert("请框选范围");
					return;
				}
				save();
			},
			computed:{
				areas:function(){
					
				}
			}
		}
	});
	function areaBox(){
		model.prisons=[];
		list=[];
	}
	function save(){
		var arr=[];
		for(var i=0,len=model.RFID.length;i<len;i++){
			arr=arr.concat(list.map(function(item){
				return {
					poa_cus_number:login.cusNumber,
					poa_rfid: model.RFID[i],
					poa_prisoner_id:item.id
				};
			}));
		}

		db.updateByParamKey({
			request:{
				sqlId:"insert_prisoner_over_alarm",
				params:arr
			},success:function(data){
				console.log(data);
				if(data.success){
					tip.alert("保存成功");
					model.prsions=list=[];
				}
			}
		});
	}

	p.querySelector("a.layui-layer-close").addEventListener("click",function(){
		boxSelect.disabledBoxSelect();
	});


	//初始化罪犯
	db.query({
		request:{
			sqlId:"select_prisoner_for_control",
			params:{
				org:login.dataAuth>0?login.cusNumber:login.deptId
			}
		},success:function(data){
			//树形设置
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					view: {dblClickExpand: false},
					callback:{
						onClick:function(e,tree,node){
							model.prisons=list=treeContainer.transformToArray(node).filter(function(item){
								if(item.type==1)return true;
							});
						}
					}
			}
			treeContainer=$.fn.zTree.init($("#tree"),setting,keepLeaf(data));
		}
	});

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

	try {
		boxSelect.setSelectStatus(true,{objectTypes:15});
		boxSelect.onSelect(function(arr){
			arr = [12];
			arr.length && (p.style.width="725px",f.style.width="",f.nextElementSibling.style.display="");
			areaBox();
		}, 'areaSelectAlarm');

		window.onbeforeunload = function () {
			boxSelect.setSelectStatus(false);
			boxSelect.offSelect('areaSelectAlarm');
		}
	} catch(e) {
		console.error(e);
	}
});