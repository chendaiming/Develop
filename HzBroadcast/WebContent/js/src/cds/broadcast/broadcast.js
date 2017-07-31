define(function(require){
	var $ = require("jquery");
	var bootstrap = require("bootstrap");
	var select = require('frm/select');
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var dialog = require('frm/dialog');
	var vue = require('vue');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var utils = require('frm/hz.utils'); // 加载辅助模块
	var uploader = require('frm/hz.uploader');
	var datepicker = require('frm/datepicker');
	var timerTask = require('frm/timerTask');
	
	var areaTree,setting;
	var childrenNodes = [];
	var uploadflag = false;
	var checkNum = 0;
	var vm = new vue({
		el:'body',
		data:{
			broadcastDeviceData:[],	//数字广播设备列表
			audioListData:[],		//音频列表
			searchTree:'',			//搜索树
			isPlay:0,				//播放按钮样式判断
			auditionAudio:'',		//试听音频
			playAudio:'',			//播放音频
			playTask:{              //定时任务
				'utt_cus_number':loginUser.cusNumber,
				'utt_task_id':'',
				'utt_task_name':'',
				'utt_user_id':loginUser.userId,
				'utt_task_type':4,//定时广播
				'utt_device_id':'',
				'utt_device_name':'',
				'utt_play_file':'',
				'utt_exec_week':'',
				'utt_exec_time':'',
				'utt_remind_time':'',
				'utt_task_status':1,
				'userId':loginUser.userId
			},
			weekCheck:[false,false,false,false,false,false,false],
			everyDay:true
		},
		watch:{
			everyDay:function(checked){
				if(checked){//勾选状态,周一到周日全部取消勾选
					this.weekCheck = [false,false,false,false,false,false,false];
				}else if(!checked && this.playTask.utt_exec_week == ''){
					//取消勾选状态且周一到周日都没有勾选,周一到周日全部勾选
					this.weekCheck = [true,true,true,true,true,true,true];
				}
			},
			weekCheck:function(val,oldVal){
				var neverCheckFlag = true;
				this.playTask.utt_exec_week = '';
				for(var i=0;i<val.length;i++){
					if(val[i] == true){
						this.playTask.utt_exec_week += '' + i; 
						neverCheckFlag = false;
					}
				}
				this.everyDay = neverCheckFlag;
			}
		},
		methods:{
			audition:function(i){		//试听
				vm.auditionAudio = http_broadcast + vm.audioListData[i].value;
				var obj = document.getElementById("audio-path")
				obj.load();
				dialog.open({targetId:'audio-div',title:'试听播放器',h:'75px',w:'300',closeCallback:function(){
					//音乐窗口关闭回调
					document.getElementById("audio-path").pause();
				}});
				obj.play();
			},
			clickAudioDiv:function(i){	//音频列表选中事件
				for(var j = 0; j < vm.audioListData.length; j++){
					vm.audioListData[j].isSelected = 0;
				}
				vm.audioListData[i].isSelected = 1;
				vm.playAudio = vm.audioListData[i].value; //设定播放文件为选中的文件
			},
			playToggle:function(){		//列表播放器按钮选择事件
				_play(vm.isPlay == 0 ? 1:2);
			},
			modeToggle:function(i){
				_modeToggle(i);
			},
			audioPreviose:function(){	//上一首
				//样式
				for(var j = 0; j < vm.audioListData.length; j++){
					var o = vm.audioListData[j];
					if(o.isSelected == 1){
						if(j != 0){
							o.isSelected = 0;
							j--;
							vm.audioListData[j].isSelected = 1;
							vm.isPlay = vm.audioListData[j].isPlay;
							vm.playAudio = vm.audioListData[j].value;//设定为播放文件
							_play(1); //播放
							return true;
						}else{
							message.alert("没有上一首了");
							return false;
						}
					}
				}
				
			},
			audioNext:function(){		//下一首
				//样式
				for(var j = 0; j < vm.audioListData.length; j++){
					var o = vm.audioListData[j];
					if(o.isSelected == 1){
						if(j != vm.audioListData.length-1){
							o.isSelected = 0;
							j++;
							vm.audioListData[j].isSelected = 1;
							vm.isPlay = vm.audioListData[j].isPlay;
							vm.playAudio = vm.audioListData[j].value;//设定为播放文件
							_play(1); //播放
							return true;
						}else{
							message.alert("没有下一首了");
							return false;
						}
					}
				}
			},
			showUpload:function(){
				 //重新添加一次文件选择按钮,防止该按钮点击无效
				 uploader.addButton({ id: '#filePicker',label: '点击选择MP3文件'});
				 uploader.addButton({ id: '#filePicker2',label: '继续添加'});
				 dialog.open({targetId:'upload_dialog',title:'MP3文件上传',h:"400",w:"420",top:"15%"});
			},
			deleteFile:function(fileName){ //删除FTP文件
				message.confirm("确认删除此文件?",function(){
					_deleteFile(fileName);
					initAudioList();
				});
			},
			input_check:function(obj){
				obj.checked = !obj.checked?true:false;
				if(obj.checked){
					checkNum++;
				}else if(obj.checked && checkNum!=0){
					checkNum--;
				}
			},
			selectAll:function(check){
				for(var i=0;i<vm.audioListData.length;i++){
					vm.audioListData[i].checked = check;
					if(vm.audioListData[i].checked){
						checkNum++;
					}else if(!vm.audioListData[i].checked && checkNum!=0){
						checkNum--;
					}
				}
			},
			deleteSelect:function(){
				if(checkNum == 0){
					message.alert('请勾选需要删除的MP3文件');
					return;
				}else{
					message.confirm("将在FTP服务器上删除所有已勾选的MP3文件,是否继续?",function(){
						for(var i=0;i<vm.audioListData.length;i++){
							if(vm.audioListData[i].checked){
								_deleteFile(vm.audioListData[i].value);
							}
						}
						initAudioList();
					});
				}
			},
			/**
			 * 打开创建定时任务面板
			 */
			showCreateTask:function(){
				var device = getCheckDeviceId();
//				var name = getCheckDeviceId().device_name;
				if(!device.device_id) return;
				this.playTask.utt_device_id = device.device_id.replace(/;/g, ',');;
				this.playTask.utt_device_name = device.device_name;
				//开始播放时,必须选择要播放的mp3文件
				if(this.playAudio == ''){
					message.alert('请选择要播放的mp3文件');
					return;
				}
				this.playTask.utt_play_file = this.playAudio;
				dialog.open({targetId:'addTask_dialog',title:'设置定时任务',h:"345",w:"480",top:"5%"});
			},
			/**
			 * 保存定时任务
			 */
			saveTask:function(){
				if(!task_input_check()) return;
				timerTask.addTimerTask(this.playTask,function(timerTaskInfo){
					timerTask.createTaskByInfo(timerTaskInfo);
				});
				dialog.close();
			},
			createTimerTask:function(){
//				message.notification('即将执行定时广播任务--',function(){
//					window.open('https://www.baidu.com');
//				});
//				 timerTask.createTimerTask();
//				getLocation();
			}
		}
	});
	
		function getLocation()
		{
		    if (navigator.geolocation)
		    {
		    	console.log('获取地理位置..start');
		        navigator.geolocation.getCurrentPosition(showPosition);
		    }
		    else
		    {
		        message.alert("该浏览器不支持获取地理位置。");
		    }
		}

		function showPosition(position)
		{
			console.log('获取地理位置..end');
			console.log(position);
			
		    console.log("纬度: " + position.coords.latitude ); 
		    console.log("经度: " + position.coords.longitude);  
		}
	
	// 初始化
	var init = function(){
		// 初始化播放模式
		$(".mode-popover").popover({
			content:$("#mode-div").html(),
			container:'body',
			placement:'top',
			html:'true',
			trigger:'focus'
		});
		
		//初始化音量按钮
		$(".sound-popover").popover({
			content:$("#sound-div").html(),
			container:'body',
			placement:'top',
			html:'true',
			trigger:'click'
		});
	}
	init();
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.broadcastDeviceData,setting);
	 });
	 
	 //树节点过滤器（已选中的所以最终节点）
	 function treeNodeFilter(node){
		 return !node.isParent && node.checked;
	 }
	 //获取父节点下的所有子节点
	 function getAllLastChildrenNodes(treeNode){
	      if (treeNode.isParent) {
	        var nodes = treeNode.children;
	        if (nodes) {
	            for (var i = 0; i < nodes.length; i++) {
	            	if(!nodes[i].isParent){
	            		childrenNodes.push(nodes[i]);
	            	}
	            	getAllLastChildrenNodes(nodes[i]);
	            }
	        }
	    }
	}
	 
	/**
	 * 初始化左侧区域数字广播设备树
	 * @returns
	 */
	function initAreaDeviceTree(){
		vm.broadcastDeviceData = [];  
		setting={
			path:'../../../libs/ztree/css/zTreeStyle/img/',
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			callback:{
				beforeCheck:function(treeId, treeNode){
					
					if(treeNode.type == 1){
						if(treeNode.status == 4){
							message.alert(treeNode.deviceName + '正在执行定时广播任务,无法进行相应操作');
							return false;
						}else{
							vm.isPlay = treeNode.status;
						}
					}
					
					childrenNodes = [];
					var msg = "广播状态不一致，请重新选择";
					//已选中的所有最终节点
					var checkedNodes = areaTree.getNodesByFilter(treeNodeFilter);
					//如果选择父节点，首先检查所有子节点状态是否一致
					if(treeNode.isParent){
						//查询父节点下所有最终节点
						getAllLastChildrenNodes(treeNode);
						//比较所有最终节点状态是否一致
						if(childrenNodes){
							for(var i = 0; i < childrenNodes.length; i++){
								var children =  childrenNodes[i];
								if(checkedNodes.length > 0 ){	//已经有选中节点
									if(checkedNodes[0].status != children.status){
										message.alert(msg);
										return false;
									}
								}else{
									if(childrenNodes[0].status != children.status){
										message.alert(msg);
										return false;
									}
								}
							}
						}
					}else{
						//检查所有已选择最终节点状态是否一致
						for(var i = 0; i < checkedNodes.length; i++){
							if(checkedNodes[i].status != treeNode.status){
								message.alert(msg);
								return false;
							}
						}	
					}
					
				},
				onCheck:function(event,treeId, treeNode){

				},
				onClick:function(event,treeId, treeNode){
					if(treeNode.status == 4){
						message.alert(treeNode.deviceName + ' 正在执行定时广播任务,无法进行相应操作');
						return false;
					}
				}
			}
		}

		db.query({
			request: {
				sqlId: 'select_broadcast_tree',
				params: [loginUser.cusNumber,loginUser.cusNumber]
			},
		success: function (data) {
			for(var i=0,j=data.length;i<j;i++){
				if(data[i].type == 1){
					data[i].deviceName = data[i].name;
					data[i].name = data[i].name +'-'+ data[i].dvc_stts;
					data[i].status = data[i].bbd_dvc_stts;
				}
				vm.broadcastDeviceData.push(data[i]);
			}
//			vm.broadcastDeviceData.push({
//				id:loginUser.cusNumber,
//				name:loginUser.cusNumberName,
//				pid:0,
//				isParent:false,
////				open:true,
//				icon:''
//			});
			areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.broadcastDeviceData);
		},
		error: function (errorCode, errorMsg) {
			message.alert(errorCode + ":" + errorMsg);
		}
	});
	}
	
	initAreaDeviceTree();
	
	//初始化音频列表
	var initAudioList = function (){
		vm.audioListData = [];
		var url = "broadcast/fileList";
		var args = {"suffix":"mp3"};
		//成功回调
		function success(data){
			var _data = data.obj;
			if(!_data || _data.length == 0) return; 
			for(var i=0;i<_data.length;i++){
				var obj = {}
				obj.value = _data[i];
				obj.isPlay = 0;
				obj.isSelected = i == 0 ? 1 : 0;
				obj.checked = false;
				vm.audioListData.push(obj);
			}
			vm.playAudio = vm.audioListData[0].value;
		}
		utils.ajax(url,{"args":JSON.stringify(args)},success);
	}
	initAudioList();
	
	/**
	 * 播放
	 */
	function _play(action){
		var checkDevice = getCheckDeviceId();
		var clientId = checkDevice.device_id;
		if(!clientId) return;
		if(action == 1 && checkDevice.deviceStatus.indexOf('4') != -1){
			var index = checkDevice.deviceStatus.indexOf('4');
			var deviceName = checkDevice.device_name.split(';')[index];
			message.alert(deviceName +'正在执行定时广播任务,请稍候再进行操作');
			return;
		}
		//播放模式 == 3 喊话
		if(playMode == 3) {
			say(clientId,action);
			return;
		}
		//开始播放时,必须选择要播放的mp3文件
		if(action == 1 && vm.playAudio == ''){
			message.alert('请选择要播放的mp3文件');
			return;
		}
		var url = 'broadcast/play';
		var args = {
			'cusNumber':loginUser.cusNumber,
			'broadcastType':playMode,
			'videoPath':vm.playAudio,
			'clientID':clientId,
			'action':action,//1播放,2停止
			'user':loginUser.userId,
		};
		
		var reqs = function(json){
			if(json.success){
				console.log('指令发送成功');
				vm.isPlay = (vm.isPlay == 0)?2:0;
				//更新节点中的设备状态
				updateCheckDeviceStatus();
			}else{
				message.alert('发送播放指令失败,请稍候重试');
			}
		};
		/*
		 * 请求响应失败处理
		 */
		function reqe () {
			message.alert('请求失败，服务器响应超时~!');
		};
		
		// 请求处理
		utils.ajax(url, {'args': JSON.stringify(args)}, reqs, reqe,false);
	}
	/**
	 * 喊话(需插件支持)
	 * @param clientId
	 * @param type
	 */
	function say(clientId,type){
		
		var url = 'broadcast/say';
		var args = {
				'cusNumber':loginUser.cusNumber,
				'clientID':clientId,
				'action':type,//1开始喊话,2停止喊话
		};
		
		var reqs = function(json){
			if(json.success){
				console.log('指令发送成功');
				vm.isPlay = (vm.isPlay == 0)?2:0;
				//更新节点中的设备状态
				updateCheckDeviceStatus();
			}else{
				message.alert('指令发送失败,请稍候重试');
			}
		};
		/*
		 * 请求响应失败处理
		 */
		function reqe () {
			message.alert('请求失败，服务器响应超时~!');
		};
		
		// 请求处理
		utils.ajax(url, {'args': JSON.stringify(args)}, reqs, reqe,false);
	}
	/**
	 * 音量调节
	 * @param value
	 */
	_ctrlVolume = function(value){
		var clientId = getCheckDeviceId().device_id;
		if(!clientId) return;
		var url = 'broadcast/volume';
		var args = {
			'cusNumber':loginUser.cusNumber,
			'clientID':clientId,
			'volume':value
		}
		
		var reqs = function(json){
			if(json.success){
				console.log('音量调节成功');
			}else{
				message.alert('音量调节失败');
			}
		};
		/*
		 * 请求响应失败处理
		 */
		function reqe () {
			message.alert('请求失败，服务器响应超时~!');
		};
		
		// 请求处理
		utils.ajax(url, {'args': JSON.stringify(args)}, reqs, reqe,false);
	}
	/**
	 * 删除文件
	 */
	function _deleteFile(fileName){
		var url = "broadcast/deletefile";
		var args = {"filePath":fileName};
		//成功回调
		function success(data){
			return true;
//			initAudioList();
		}
		/*
		 * 请求响应失败处理
		 */
		function error () {
			message.alert('请求失败，服务器响应超时~!');
			return false;
		};
		utils.ajax(url,{"args":JSON.stringify(args)},success,error,false);
	}
	
	/**
	 * 获取已勾选的客户端ID
	 */
	function getCheckDeviceId(){
		var device_id = '';
		var device_name = '';
		var deviceStatus = '';
		var checkNodes = areaTree.getNodesByFilter(treeNodeFilter);
		if(checkNodes.length == 0){
			message.alert("请在左侧勾选要播放或喊话的设备");
			return false;
		}
		var checkName;
		for(var i=0;i<checkNodes.length;i++){
			device_id += (i==0)?checkNodes[i].other_id:(';'+checkNodes[i].other_id);
			checkName = checkNodes[i].name.substr(0,checkNodes[i].name.indexOf('-'));
			device_name += (i==0)?checkName:(','+checkName);
			deviceStatus +=checkNodes[i].status;
		}
		return {'device_id':device_id,'device_name':device_name,'deviceStatus':deviceStatus};
	}
	/**
	 * 更新已勾选的设备状态
	 */
	function updateCheckDeviceStatus(){
		var checkNodes = areaTree.getNodesByFilter(treeNodeFilter);
		for(var i=0;i<checkNodes.length;i++){
			checkNodes[i].status = vm.isPlay;
			var name = checkNodes[i].name;
			var _status = '',bbd_name = '';
			bbd_name = checkNodes[i].bbd_name;
			if(playMode == 3 && vm.isPlay == 2){
				_status = '喊话中';
			}else if(vm.isPlay == 2){
				_status = '使用中';
			}else{
				_status = '空闲';
			}
			checkNodes[i].name = bbd_name + '-' + _status;
			areaTree.updateNode(checkNodes[i]);
		}
	}
	/**
	 * 定制上传控件功能
	 */
	function setUploader(){
		 uploader.setOption('accept',{extensions: 'mp3',mimeTypes: 'audio/mpeg'});
		 uploader.setOption('server',ctx+'broadcast/upload');//设定后台类
		 uploader.setOption('fileNumLimit',5);//最多同时上传5个文件
		 uploader.setOption('fileSingleSizeLimit',20*1024*1024);//单个文件最大为20M
		 uploader.setOption('threads',1);//每次上传1个文件
		 //重定义上传成功后执行的方法
		 uploader.uploadSuccess =  function( file,response ){
				var result = JSON.parse(response);
				
				if(!result.success) {
					message.alert(result.msg);
					return;
				}
//				uploadflag = true;
				//重新加载音频列表
				initAudioList();
		 };
		uploader.uploadFinished = function() {
//			uploadflag &&
//			message.confirm("上传完成,要关闭上传窗口吗",function(){
//				dialog.close();
//			});
		};
	}
	setUploader();
	/*
	 * 定时任务创建录入参数验证
	 */
	function task_input_check(){
		if($.trim(vm.playTask.utt_task_name).length == 0){
			message.alert('请填写任务名称!');
			return false;
		}
		
		if(vm.playTask.utt_exec_time == '' || vm.playTask.utt_exec_time.length == 0){
			message.alert('请选择任务执行时间!');
			return false;
		}
		
		return true;
	}
});