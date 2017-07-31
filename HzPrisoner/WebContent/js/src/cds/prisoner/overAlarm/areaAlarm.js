define(["hz/map/map.handle",'frm/hz.db',"frm/loginUser","vue","frm/message","frm/treeUtil","ztree"],function(mapHandle,db,login,tpl,tip,util){
	//窗口设置
	var p=window.frameElement.parentNode.parentNode;//包含iframe的div
	
	var f=document.querySelector("div.left-con"),treeContainer;
	
	var list=[];
	var falg = true;
	var areaCache=[];
	var boxSelect = mapHandle.boxSelect;
	var nodes;
	var model=new tpl({
		el:'#form',
		data:{
			prisons:[],
			RFID:[],
			key:''
		},
		methods:{
			choose:function(e,item){
				e.target.classList.toggle("select");
				var index=list.indexOf(item);
				var treeObj = $.fn.zTree.getZTreeObj("tree");
				if(e.target.classList.contains("select")){
					list.remove(item);
					treeObj.checkNode(item, false, true);
					for(var i=0;i<list.length;i++){
						if(list[i].id==item.id){
							list.splice(i,1);
							break;
						}
					}
				}else{
					treeObj.checkNode(item,true, true);
					list.push(item);
				}
			},
			remove:function(t){
				for(var i=0;i<this.RFID.length;i++){
					if(this.RFID[i]['linkId']==t['linkId']){
						this.RFID.splice(i--,1);
					}
				}
			},
			save:function(){
				
				if(!this.RFID.length){
					tip.alert("请框选范围");
					return;
				}
				if(!list.length){
					tip.alert("请选择罪犯");
					return;
				}
				save();
			},
			reset:function(){
				this.prisons=[];
				this.RFID=[];
				treeContainer.checkAllNodes(false);
			}
		}
	});
	function areaBox(arr){
		var temp=[];
		for(var i=0,len=arr.length;i<len;i++){
			if(arr[i].type==15){
				temp.push({'linkId':arr[i].linkId,'name':arr[i].name});
			}
		}
		if(!temp.length){
			tip.alert("未获取到RFID基站");
			return;
		}
		p.left='20%',p.style.width="60%",f.style.width="",f.nextElementSibling.style.display=""
		//model.prisons=[];
		console.log(temp);
		temp.length&&(model.RFID=temp);
		//list=[];
	}
	function save(){
		var arr=[];
		for(var i=0,len=model.RFID.length;i<len;i++){
			arr=arr.concat(list.map(function(item){
				return {
					poa_cus_number:login.cusNumber,
					poa_rfid:model.RFID[i].linkId,
					poa_prisoner_id:item.id
				};
			}));
		}

		tip.saving();

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
					path:'../../../../libs/ztree/css/zTreeStyle/img/',
					edit: {enable: true,showRenameBtn:false,showRemoveBtn: false},
					check: {enable: true,chkStyle: "checkbox",chkboxType:{ "Y" : "s", "N" : "s" }},
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					view: {dblClickExpand: false},
					callback:{
						onCheck:function(e,tree,node){
							var temp=[];
							nodes = node;
							temp=treeContainer.transformToArray(node).filter(function(item){
								if(item.type==1)return true;
							});
							if(node.checked){
								//list.remove(temp);
								list=list.concat(temp);
								//model.prisons.remove(temp);
								model.prisons=model.prisons.concat(temp);
							}else{
								for(key in model.prisons){
									if(node.id==model.prisons[key].id){
										model.prisons.splice(key,1);
									}
								};
								for(key in list){
									if(node.id==list[key].id){
										list.splice(key,1);
									}
								};
							}

						},
						onClick:function(e,tree,node){
							/*var temp=[];
							for(i in node.children){
								if(node.children[i].children){
									temp = temp.concat(node.children[i].children);
								}else{
									temp = temp.concat(node.children[i]);
								}
							}

							if(falg){
								treeContainer.checkAllNodes(true);
								list=list.concat(temp);
								model.prisons=model.prisons.concat(temp);
								falg = false;
							}else{
								treeContainer.checkAllNodes(false);
								list=[];
								model.prisons=[];
								falg = true;
							}*/

							/*var temp=[];
							temp=treeContainer.transformToArray(node).filter(function(item){
								if(item.type==1)return true;
							});

							if(e.ctrlKey){
								list=list.concat(temp);
								model.prisons=model.prisons.concat(temp);
							}else{
								list=temp;
								model.prisons=list.slice();
							}*/
						}
					}
			}
			data=keepLeaf(data);
			treeContainer=$.fn.zTree.init($("#tree"),setting,data);
			model.$watch("key",function(val){
				util.searchTree("name",val,"tree",data,setting);
			});
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
//			arr = [12];
//			arr.length && (p.style.width="725px",f.style.width="",f.nextElementSibling.style.display="");
			areaBox(arr);
		}, 'areaSelectAlarm');

		window.onbeforeunload = function () {
			boxSelect.setSelectStatus(false);
			boxSelect.offSelect('areaSelectAlarm');
		}
	} catch(e) {
		console.error(e);
	}
});