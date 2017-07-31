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
	
	var treeContainer;
	var server_http = 'http://10.43.239.25:6101';
	var server_url = server_http + '/api.aspx';
	
	model=new tpl({
		el:'body',
		data:{
			playertree:[],//终端列表
			program:[],//节目单列表
			selectPlayer:{},//当前选中终端,目前只支持单选
			selectProgram:{},//当前选中的节目,目前只支持单选
			sendProgram:[{  //发送节目结构体
				'programId':'', //节目id
				'name':'', //节目名称 
				'priority':'',//节目播放的优先级，0为普通，1为插播
				'beginTime':'',//节目开始播放的时间（开始时间和结束时间要同一天）
				'endTime':'',//节目结束播放的时间（开始时间和结束时间要同一天）
				'deviceId':''//播放机的id
			}]
		},
		methods:{
			/*
			 * 获取节目内容
			 */
			getprogramcontent:function(id,typeName){
				_getprogramcontent(id,typeName);
			},
			/*
			 * 节目选择
			 */
			programSelect:function(program){
				var id = program.id;
				$('.item').removeClass("select");
				if($('#'+id).hasClass("select")){
					this.selectProgram = {};
				}else{
					this.selectProgram = program;
				}
				$('#'+id).toggleClass("select");
			},
			programSend:function(){
				_programSend();
			}
		}
	});
	var setting={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			data: {simpleData: {enable: true,pIdKey: "pid"}},
			callback:{
				onClick:function(e,id,node){
					if(!node.type) return;
					if(node.type == 1){
						model.selectPlayer = node;
					}
				}
			}
	};

	/**
	 * 加载终端列表
	 */
	function _loadDeviceList(){
		var url = server_url + '?accessToken=1560a0092f2d4843beb2352600ef7994&apiId=player&command=getplayertree';
		
		utils.ajax('infopublishHttpCtrl/deviceList', {'url':url}, function(json){
			console.log(json);
			var result = JSON.parse(json);
			if (result.errorCode == 0 || result.errorCode == '0') {
				var data = result.data;
				var treeData = new Array();
				//定义根节点数据
				var root = {
						icon:'prison.png',
						id:data.id,
						name:"明康监狱",
						pid:'',
						type:0		
				};
				//push根节点数据
				treeData.push(root);
				//加载子节点数据
				loadInfopublishDevice(treeData,data);
				//初始化设备树
				treeContainer=$.fn.zTree.init($("#tree"), setting,treeData);
				$("#input").keyup(function(){
					util.searchTree("name",this.value,"tree",treeData,setting);
				});
			} else {
				tip.alert(result.errorMsg);
			}
		}, function(json){
			tip.alert('服务器通信异常'+json);
		});
	}
	/*
	 * 加载区域所属信息发布设备信息
	 */
	function loadInfopublishDevice(treeData,areaData){
		var data  = areaData.children;
		var pid = areaData.id;
		//状态信息 如果设备的isOnline字段为false,标记设备为离线状态
		var statusStr = '';
		
		for(var i=0;i<data.length;i++){
			if(data[i].isPlayer){
				//设备是否在线
				if(!data[i].isOnline){
					statusStr = '(离线)';
				}else{
					statusStr = ''
				}
				
				treeData.push({
					icon:'play.png',
					id :  data[i].id,
					name: data[i].name + statusStr,
					pid:pid,
					type:1,
					attributes:data[i]
				});
			}else{
				treeData.push({
					icon:'org.png',
					id :  data[i].id,
					name: data[i].name,
					pid:pid,
					type:0,
					attributes:data[i]
				});
				//加载子节点
				if(data[i].children.length>0){
					loadInfopublishDevice(treeData,data[i]);
				}
			}
		}
		
	}
	
	_loadDeviceList();
	/*
	 * 加载节目清单
	 */
	function loadProgram(){
		var url = server_url + '?accessToken=1560a0092f2d4843beb2352600ef7994&apiId=program&command=getprogram';
		_httpGet(url,function(json){
			var result = JSON.parse(json);
			if(result.errorCode == 0 || result.errorCode == '0'){
				model.program = result.data; 
			}else{
				tip.alert(result.errorMsg);
			}
		});
	}
	
	loadProgram();
	
	/*
	 * 获取节目内容
	 */
	function _getprogramcontent(categoryId,typeName){
		var url = server_url + '?accessToken=1560a0092f2d4843beb2352600ef7994' + 
		                        '&apiId=program'+
		                        '&command=getprogramcontent'+
		                        '&programId='+categoryId;
		_httpGet(url,function(json){
			var result = JSON.parse(json);
			if(result.errorCode == 0 || result.errorCode == '0'){
				model.programcontent = result.data;
				if(typeName == '图片'){
					var data = JSON.parse(result.data);
					var src = data.elements[0].items[0].src;
					window.open(server_http + src);
				}
			}else{
				tip.alert(result.errorMsg);
			}
		});
	}
	/*
	 * 发送节目
	 */
	function _programSend(){
		if(!model.selectPlayer.id){
			tip.alert('请选择要推送的终端!');
			return;
		}
		
		if(!model.selectProgram.id){
			tip.alert('请选择要发送的节目!');
			return;
		}
		
		model.sendProgram[0].programId = model.selectProgram.id;
		model.sendProgram[0].name = model.selectProgram.name;
		model.sendProgram[0].priority = 0;
		model.sendProgram[0].beginTime = new Date().Format("yyyy-MM-dd") +' 00:00:00';
		model.sendProgram[0].endTime = new Date().Format("yyyy-MM-dd") +' 23:59:59';
		model.sendProgram[0].deviceId = model.selectPlayer.attributes.deviceId;
		
		var param = 'accessToken=1560a0092f2d4843beb2352600ef7994' + 
					'&apiId=program'+
					'&command=programSend'+
					'&data='+JSON.stringify(model.sendProgram)+
					'&autoCheck=true';
		_httpPost(server_url,param,function(json){
			try {
				var result = JSON.parse(json);
				if(result.errorCode == 0 || result.errorCode == '0'){
					tip.alert('发送成功');
				}else{
					tip.alert(result.errorMsg);
				}
			} catch (e) {
				console.log(json);
			}
		});
	}
	
	/**
	 * 发送Http Get请求
	 */
	function _httpGet (url,success) {
		utils.ajax('itcTalkCtrl/httpGet', {'url':url}, function(json){
			success(json);
		}, function(json){
			tip.alert('服务器通信异常'+json);
		});
	}
	/**
	 * 发送Http Post请求
	 */
	function _httpPost (url,param,success) {
		utils.ajax('infopublishHttpCtrl/httpPost', {'url':url,'param':param}, function(json){
			success(json);
		}, function(json){
			tip.alert('服务器通信异常:'+json);
		});
	}
});