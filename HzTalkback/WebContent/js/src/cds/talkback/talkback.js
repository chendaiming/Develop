define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var util  = require('frm/treeUtil');
	var modelUtil = require('frm/model');	
	var treeSelect = require('frm/treeSelect');
	var tip = require('frm/message');
	var select = require('frm/select');
	var dialog = require('frm/dialog');
	var videoClient = require('frm/hz.videoclient');
	var userSetting = require('userSetting');
	var talkback = require('frm/hz.itcTalkback');
	var hzEvent = require('frm/hz.event');
	
	var talkbackConfig = window.top.hz.talkbackConfig;//对讲服务配置信息
	
	var hz_talk = false;
	
	var treeContainer;
	model=new tpl({
		el:'body',
		data:{
			caller:getCaller(),
			callee:'',
			calleeName:'',
			cusNumber:login.cusNumber,
			userName:login.userName,
			call_id:'',//当前会话id
			info:{
				
			},
			itcStatus:'',
			serviceId:'',
			userSettingInfo:{
				sus_cus_number:login.cusNumber,
				sus_record_id:'',
				sus_type:1,//对讲主机关联
				sus_value:'',
				sus_user_id:login.userId,
				userId:login.userId			
			},
			call_info:[],
			selectAreaName:'',
			linkDeviceList:[]
		},
		methods:{
			talk:function(){
				_talk();
				hz_talk = false;
			},
			call_close:function(){
				_call_close();
				hz_talk = false;
			},
			call:function(){
				_call();
				hz_talk = false;
			},
			monitor:function(){
				_monitor();
				hz_talk = false;
			},
			startTalk:function(){
				if(!check()) return;
				viewInfo('正在呼叫,请等待应答...',2);
				
				var loginName = talkbackConfig.getConfig().tsd_login_name;
				if(loginName){
					hz_talk = true;
					videoClient.startTalk(model.callee);
					openLinkCamera();
					talkback.getCallMsg(loginName,setCallid);	
				}else{
					tip.alert('未配置对讲服务,无法进行呼叫!')
				}
			},
			stopTalk:function(){
				hz_talk = true;
				_call_close();
			},
			relationDialog:function(){
				var hostInfo = talkbackConfig.getRelationHost();
				if(hostInfo.sus_record_id){
					model.serviceId = hostInfo.tbd_relation_service;
					model.userSettingInfo.sus_record_id = hostInfo.sus_record_id;
					model.userSettingInfo.sus_value = hostInfo.sus_value;
				}else{
					console.log('该用户还未关联对讲主机');
				}

				dialog.open({targetId:'relation_dialog',title:'对讲主机关联',h:"50",w:"480",top:"3%"});
			},
			saveRelation:function(){
				if(!getTalkbackStatus(model.userSettingInfo.sus_value)){
					return;
				}
				if(this.userSettingInfo.sus_record_id){
					userSetting.updateSetting(this.userSettingInfo,function(){
						tip.alert('更新关联对讲主机成功');
					});
				}else{
					userSetting.addSetting(this.userSettingInfo,function(){
						tip.alert('添加关联对讲主机成功');
					});
				}
				videoClient.setTalkConfigByid(this.serviceId);
				model.caller = getCaller();
				talkback.setHttpUrl(talkbackConfig.getConfigByid(this.serviceId).tsd_http_url);
			},
			switchHost:function(){
				if(!getTalkbackStatus(model.userSettingInfo.sus_value)){
					return;
				}
				if(this.serviceId){
					console.log('对讲配置切换到编号为:'+this.serviceId+'的对讲服务');
					videoClient.setTalkConfigByid(this.serviceId) && tip.alert('对讲主机配置切换成功');
				}else{
					tip.alert('该对讲主机未关联相应的对讲服务');
				}
			}
		}
	});
	/*
	 * 获取当前用户关联的对讲主机
	 */
	function getCaller(){
		var hostInfo = talkbackConfig.getRelationHost();
		if(hostInfo.sus_value){
			return {id:hostInfo.sus_value,name:hostInfo.tbd_name};
		}else{
			tip.alert('该用户尚未关联对讲主机');
			return {id:'',name:''};
		}
	}
	
	var setting={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			view: {dblClickExpand:false},
			callback:{
				onClick:function(e,id,node){
					if(!node.type) return;
					if(node.type == 1){
						model.callee= node.other_id;
						model.calleeName = node.tname;
						//TODO 广播时被叫可为多个设备
 					}else if(node.type == 2){
						model.selectAreaName = node.name;
					}
				},
				onDblClick:function(e,id,node){
					// 设备正在通话中,获取会话ID(只获取一次)
					if(node.type == 1 && node.status == 2)
						talkback.getCallid(node.other_id,setCallid);
				}
			}
	};
	//初始化设备树
	db.query({
		request:{
			sqlId:'select_talkback_org',
			orderId:'0',
			params:{
				org:login.dataAuth==0?login.deptId:login.cusNumber,//
				cus:login.cusNumber,
			    level:login.dataAuth==2?3:2,//如果为省局用户
			}
		},success:function(data){
			treeContainer=$.fn.zTree.init($("#tree"), setting,keepLeaf(data));
			treeContainer.expandAll(true);
		}
	});
	
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
	
	/**
	 * 对讲
	 */
	function _talk(){
		if(!check()) return;
		viewInfo('正在呼叫,请等待应答...');
		
		talkback.talk(model.caller.id,model.callee,setCallid);
		
		openLinkCamera();
	}
	/**
	 * 监听
	 */
	function _monitor(){
		if(!check()) return;
		viewInfo('连接中,请等待...');
		
		talkback.monitor(model.caller.id,model.callee,setCallid);
		
		openLinkCamera();
	}
	/**
	 * 广播
	 */
	function _call(){
		if(!check()) return;
		viewInfo('连接中,请等待...');
		
		talkback.broadcast(model.caller.id,model.callee,setCallid);
		
		openLinkCamera();
	}
	/**
	 * 挂断
	 */
	function _call_close(){
		if(model.call_id == '') {
			tip.alert('没有需要挂断的会话');
			return;
		}
		talkback.close(model.call_id,close_success);
	}
	/*
	 * 挂断成功回调
	 */
	function close_success(){
		console.log('成功挂断会话id为'+model.call_id+'的通话');
		if(hz_talk){
			viewInfo('已挂断',2);
		}else{
			viewInfo('已挂断');
		}		
		model.call_id = '';
	}
	
	function check(){
		if(model.caller.id == ''){
			tip.alert('请先关联操作的对讲主机');
			return false;
		}
		if(model.callee == ''){
			tip.alert('请选择被叫的对讲主机');
			return false;
		}
		if(model.call_id !=''){
			tip.alert('请挂断当前会话后再进行其他操作!');
			return false;
		}
		return true;
	}
	
	/**
	 * 获取对讲机设备状态
	 */
	function getTalkbackStatus(otherid){
		var flag = false;
		db.query({
			request:{
				sqlId:'select_talkback_status_map',
				whereId:'1',
				params:{'cusNumber':login.cusNumber,'other_id':otherid}
			},
			async:false,
			success:function(data){
				if(data.length>0) {
					var status = data[0].dvc_stts;
					switch(status){
					case 0: flag = true;break;
					case 1: tip.alert('对讲主机离线中,暂时无法完成切换'); break;
					case 2: tip.alert('对讲主机正在使用中,暂时无法完成切换'); break;
					}
				}
			},
			error:function(errorCode, errorMsg){
				tip.alert("获取对讲服务配置信息失败:" + errorMsg);
			}
		});
		return flag;
	}
	
	/*
	 * 打印通话信息(会自动获取主叫和被叫) 
	 * @param info 附加信息
	 */
	function viewInfo(info,type){
		var callerName = model.caller.name;
		if(type && type == 2){
			callerName = '本机';
		}
		var msg = {
			msg : new Date().Format('hh:mm:ss') + '  ' + callerName
					+ '-->' + model.calleeName + '  ' + info
		};
		model.call_info.push(msg);
	}
	/*
	 * 打开关联摄像机
	 */
	function openLinkCamera(){
		model.linkDeviceList =[];
		
//		getLinkDeviceId(model.caller.id);
		getLinkDeviceId(model.callee);
		
		videoClient.setLayout(model.linkDeviceList.length);
		videoClient.play(model.linkDeviceList);
	}
	/*
	 * 获取关联的摄像机数据
	 * @param otherid 对讲机第三方编号
	 */
	function getLinkDeviceId(otherid){
		 var link_id = null; 
		 var node = treeContainer.getNodeByParam("other_id",otherid);
		 if (node.link_device_id) {
			 var idList = node.link_device_id.split(',');
			 model.linkDeviceList = model.linkDeviceList.concat(idList);
		} else {
			tip.alert('对讲机:' + node.tname + '未关联摄像机!');
		}
	}
	
	/*
	 * 设定当前会话ID
	 * @param callid 返回的会话ID
	 */
	function setCallid(callid){
		model.call_id = callid;
		if(hz_talk){
			viewInfo('已建立会话',2);
		}else{
			viewInfo('已建立会话');
		}
	}
	
	/**
	 * 设备状态变更处理
	 */
	function msgCallback(json){
		// 更新节点 (icon,name)
		var  node=treeContainer.getNodeByParam("other_id",json.msg.id);
		var status = json.msg.status;
		switch(status){
		case 0:
			node.icon = 'talk.png';
			node.name = node.tname;
			node.status = status;
			break;
		case 1:
			node.icon = 'talk.png';
			node.name = node.tname + '(离线)';
			node.status = status;
			break;
		case 2:
			node.icon = 'talking.png';
			node.name = node.tname + '(通话中)';
			node.status = status;
			break;
		}
		treeContainer.updateNode(node);
	}
	
	/**
	 * 对讲开始结束事件处理
	 */
	function talkingCallback(json){
		//在此获取会话编号
		//TODO 开始通话才获取会话ID
		if(json.msg.type == 'stop')
			model.call_info.push(json.msg);
	}
	//订阅对讲设备状态消息
	window.top.webmessage.off('TALKBACK001','talkbackStatus');
	window.top.webmessage.on('TALKBACK001','talkbackStatus',msgCallback);
	//订阅对讲事件消息
//	window.top.webmessage.off('TALKBACK002','talkbackMsg');
//	window.top.webmessage.on('TALKBACK002','talkbackMsg',talkingCallback);	
});