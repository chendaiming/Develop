define(['frm/hz.db','frm/loginUser',"frm/treeUtil","frm/message","frm/treeSelect","frm/hz.videoclient"],function(db,login,util,tip,videoClient){
	var treeContainer,currentDevice;
	
	var sessionId='';//回话id
	//初始化设备树
	db.query({
		request:{
			sqlId:'select_videotalk_org',
			orderId:'0',
			params:{
				org:login.dataAuth==0?login.deptId:login.cusNumber,//
				cus:login.cusNumber,
			    level:login.dataAuth==2?3:2,//如果为省局用户
			}
		},success:function(data){
			var setting={
					path:'../../../libs/ztree/css/zTreeStyle/img/',
					data: {simpleData: {enable: true,pIdKey: "pid"}},
					check: {enable:true},
					callback:{
						onClick:function(e,id,node){
						}
					}
			};
			data=keepLeaf(data);
			treeContainer=$.fn.zTree.init($("#tree"), setting,data.length?data:[{icon:'org.png',pid:'-2',id:'-1','name':login.cusNumberName}]);
			treeContainer.expandAll(true);
			//搜索树
			$("#input").keyup(function(){
				util.searchTree("name",this.value,"tree",data,setting);
			});
		}
	});
	//注册事件监听状态
	function listenStatus(){
		
	}
	//监听
	function  listen(){
		var list=getSelect(['0','1']);//获取设备
		if(!list.length){
			tip.alert("请先勾选需要监听的对讲机");
			return;
		}
		var callback=function (){
			var param={
					'send_terminal':'',//主叫方
					'recive_terminal':''//被叫方
			}
			$.get('itcTalkCtrl/httpGet/monitor.json', param);
		}
		changeStatus(list,{listen:true,type:'listen'},callback);//修改状态
	}
	//广播
	function broad(){
		var list=getSelect(['0'],'1');//获取设备
		if(!list.length){
			tip.alert("请勾选空闲中的对讲机");
			return;
		}
		var callback=function(){
			var param={
					'send_terminal':'',//主叫方
					'recive_terminal':''//被叫方
			}
			$.get('itcTalkCtrl/httpGet/call.json', param);
		}
		updateStatus(list,{'listen':true,'name':' 广播..','status':'1','type':'broad'},callback);
	}
	//呼叫
	function call(){
		var list=getSelect(['0'],'1');//1代表通话中
		if(!list.length){
			tip.alert("请先勾选空闲的对讲机");
			return;
		}
		var callback=function (){
			var param={
				'send_terminal':'',//主叫方
				'recive_terminal':''//被叫方
				}
			$.get('itcTalkCtrl/httpGet/talk.json', param);
		}
		updateStatus(list,{'name':' 通话..','status':'-1','icon':'talking.png'},callback);
	}
	//挂断
	function cancel(){
		var list=getSelect(['-1'],'0');//1代表通话中
		if(!list.length){
			tip.alert("请先勾选正在通话中的对讲机");
			return;
		}
		var callback=function(){
			var param={
					'id':'',//主叫方
					'recive_terminal':''//被叫方
					}
				$.get('itcTalkCtrl/httpGet/call_close.json', param);
		}
		updateStatus(list,{'name':'','status':'0','icon':'talk.png','talking':false},callback);
	}
	//获取正在通话的设备
	function  queryDevice(){
		db.query({
			request:{
				sqlId:'select_videotalk_org',
				whereId:'',
				params:{
					org:login.dataAuth==0?login.deptId:login.cusNumber,//
					cus:login.cusNumber,
				    level:login.dataAuth==2?3:2,//如果为省局用户
				}
			},success:function(data){
				
			}
		});
	}
	//更改呼叫的设备状态
	function updateStatus(list,node,callback){
		db.updateByParamKey({
			request:{
				sqlId:'update_talk_by_id',
				params:list
			},success:function(data){
				changeStatus(list,node);
				callback&&callback();
			}
		});
	}
	//获取选中的设备
	function getSelect(search,status){
		if(!treeContainer)return [];
		var temp=[];
		//查询所有设备为对讲机的节点
		treeContainer.getCheckedNodes().forEach(function(item){
			if(item.type==1){
				temp.push({device:item.id,tid:item.tId,name:item.name,status:item.status});
			}
		});
		//根据状态不同查询不同节点
		if(search){
			var filter=[];
			temp.forEach(function(row){
				if(search.indexOf(row.status+'')>-1){
					filter.push({device:row.device,tid:row.tid,name:row.name,status:status});
				}
			});
			temp=filter;
		}
		return temp;
	}
	//更新设备状态
	function changeStatus(list,node){
		var temp;
		if(node.listen){
			for(var i=0;i<list.length;i++){
				temp=treeContainer.getNodeByTId(list[i].tid);
				treeContainer.updateNode(temp);
				if(node.type=='listen'){
					$("#"+list[i].tid+"_a").addClass("listen").removeClass("broad");
				}else{
					$("#"+list[i].tid+"_a").addClass("broad").removeClass("listen");
				}
			}
			return;
		}
		for(var i=0;i<list.length;i++){
			temp=treeContainer.getNodeByTId(list[i].tid);
			if(temp){
				temp.status=node.status;
				temp.name=temp.tname+node.name;
				temp.icon=node.icon?node.icon:temp.icon;
				treeContainer.updateNode(temp);
				$("#"+list[i].tid+"_a").removeClass("listen broad");
			}
		}
	}
	//过滤节点树
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
	
	//按钮事件
	$("#oprbtn").on("click","a",function(){
		
		if(this.textContent=='呼叫'){
			call();
		}else if(this.textContent=='挂断'){
			cancel()
		}else if(this.textContent=='广播'){
			broad();
		}else if(this.textContent=='监听'){
			listen();
		}
	});
	//向服务器注册主机号
	function  hostTalkId(){
		db.query({
			request:[{
				sqlId:'select_main_talk_id',
				params:{'cus':login.cusNumber}
			}],success:function(data){
				var device=data[0]['device'];
				currentDevice=device;
				device&&db.update({
					request:{
						sqlId:'update_talk_by_id',
						params:{'device':device,'status':'1'}
					},success:function(data){
						
					}
				});
			}
		});
	}
	//向记录表中插入记录
	function  addRecord(event,list){
		db.query({
			request:[{
				sqlId:"insert_videotalk_record",
				params:{'device':currentDevice,'event':event,'user':login.userId},
			},list],
			success:function(data){
				
			}
		});
	}
	function videoTalk(){
		
	}
	setTimeout(function(){window.top.webmessage.on('501','videoTalk',videoTalk)},500);
});