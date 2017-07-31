define(function (require) {
	var utils = require('frm/hz.utils');
	var loginUser = require('frm/loginUser');
	var ztree = require('ztree');
	var vue = require('vue');
	var dialog = require('frm/dialog');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var db = require('frm/hz.db');
	var chart = require('echarts');
	var videoClient = require('frm/hz.videoclient');
	var uploader = require('frm/hz.uploader');

	var treeUrl = 'cameraCtr/videoStorageRecord';
	var renameUrl = 'cameraCtr/renameFile';
	var deleteUrl = 'cameraCtr/deleteFile';
	var checkFileUrl = 'cameraCtr/checkFile';
	var checkStorageDtlsUrl = 'cameraCtr/checkStorageDtls';
	var zTreeObj = null,
	    videoCameras = [],
	    videoFiles = [],
	    setting = null
	    nodeNum = 0;
	var tables=document.getElementById("tableshow");
	
	var vm = new vue({
		el: 'body',
		data: {
			treeAllNodes:[],
			searchTree:'',
			searchRecord:'',
			searchDownload:'',
			selectRecords:[],//当前选中节点下的所有备份记录 包括子节点下
			selectDownloads:[],//当前选中节点下的所有视频文件 包括子节点下
			currentUrl:'',//当前选中文件夹路径
			treeNode:'',//当前选中文件夹节点
			pointSelectUrl:'#',
			pointSelectName:'',
			fileType:'',//文件类型
			layout:1,
			layouts:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
			isEnableType:false,//是否可播放的视频类型
			isSelectRecord:false,//是否选中
			isSelectDownload:false//是否选中,检测按钮是否可用
		},
		methods: {
			//打开选择画面布局界面
		    choseLayout:function(){
		    	showLayout();
		    },
		    //查询磁盘使用情况
		    choseStorage:function(){
		    	var rst = showStorage();
		    	if(rst != "close")
		    	utils.ajax(checkStorageDtlsUrl, null, function (data) {
		    		var rsp = data.respMsg;
		    		chart.init(tables).setOption({
		    			title : {
		    				text: '总容量:'+(JSON.parse(rsp)[0]["value"]+JSON.parse(rsp)[1]["value"])+'( TB )',
		    				left:'left',
		    				textStyle:{
		    					fontSize: 11,
		    					color: '#fff'		        	
		    				},
		    				x:'center'
		    			},
		    			 tooltip : {
		    			        trigger: 'item',
		    			        formatter: "{a} <br/>{b} : {c} ( TB )"
		    			    },
		    			series : [
		    				{
		    					name: '存储统计',
		    					type: 'pie',
		    					radius: '55%',
		    					data:rsp.length?JSON.parse(rsp):[{name:'暂无数据'}]
		    				}
		    			]
		    		});
		    	});
		    },
			 //设置画面布局
		    setLayout:function(index){
		    	this.layout = index ; 
		    	//调用视频客户端 设置画面布局方法
		    	videoClient.setLayout(index);
		    	showLayout();
		    },
		    playFile:function(){
//		    	videoClient.playFile(videoFiles);
		    	dialog.open({targetId:'video_play',title:'视频文件播放',h:"240",w:"320",top:"15%",maxmin:true});
		    },
		    playBack:function(){
		    	videoClient.playback(videoCameras);
		    },
		    uploadFile:function(){
				 uploader.addButton({ id: '#filePicker',label: '点击选择MP4文件'});
				 uploader.addButton({ id: '#filePicker2',label: '继续添加'});
				 dialog.open({targetId:'upload_dialog',title:'视频文件上传',h:"400",w:"420",top:"15%"});
		    },
		    renameFile:function(){
		    	$(".dow.selected").children("textarea").removeAttr("disabled");
		    	$(".dow.selected").children("textarea").get(0).focus();//定位焦点
		    },
		    deleteFile:function(){
		    	var map = {path:vm.pointSelectUrl};
		    	var params = {'args':JSON.stringify(map)};
		    	var id = $(".dow.selected").attr("id");
		    	if(id){
		    		layer.prompt({title:'请输入操作口令',formType: 1,value:'',maxlength:6}, function(pass, index){
						if(pass == loginUser.doorpwd){
							message.saving("删除中...");
			    			utils.ajax(deleteUrl, params, function (data) {
			    				message.close();
			    				for(var i=0;i<vm.selectDownloads.length;i++){
			    					if(vm.selectDownloads[i].id == id){
			    						if(data.respCode == '0000'){
			    							vm.selectDownloads.splice(i,1);
			    							vm.pointSelectUrl = '#';//重置链接
			    							vm.pointSelectName = '';
			    							vm.isEnableType = false;
			    							vm.isSelectDownload = false;
			    							
			    							delNode(id);//删除树节点
			    						}
			    					}
			    					message.alert(data.respMsg);
			    				}
			    			});
							layer.close(index);
						} else{
							layer.msg('密码错误');
						}
					});
		    	}else message.alert('获取文件失败,请重试');
		    },
		    choseRecOne:function(event){
		    	videoCameras = [];
				var id = $(event.currentTarget).attr('cid');
				for(var i=0;i<vm.selectRecords.length;i++){
					if(vm.selectRecords[i].id == id){
						if(vm.selectRecords[i].selected){
							vm.selectRecords[i].selected = false;
							vm.isSelectRecord = false;
							return;
						}
						clearSelectRecoNodes();
						vm.selectRecords[i].selected = true;	
						vm.isSelectRecord = true;
						pushVideoCameras(vm.selectRecords[i]);
					}
				}
		    },
		    choseDowOne:function(treeId,event){
		    	videoFiles = [];
		    	var id = null;
		    	if(treeId == 'empty') id = $(event.currentTarget).attr('id');
		    	else id = treeId;
				for(var i=0;i<vm.selectDownloads.length;i++){
					if(vm.selectDownloads[i].id == id){
						if(vm.selectDownloads[i].selected){
							vm.selectDownloads[i].selected = false;
							vm.isSelectDownload = false;
							vm.isEnableType = false;
							vm.pointSelectUrl = '#';
							vm.pointSelectName = '';
							//更新树节点不选中
							updateNodes(id,"check");
							return;
						}
						clearSelectDownNodes();
						vm.pointSelectUrl = vm.selectDownloads[i].dirPath;
						vm.pointSelectName = vm.selectDownloads[i].pname;
						vm.selectDownloads[i].selected = true;
						vm.isSelectDownload = true;
						vm.isEnableType = getEnableType(vm.selectDownloads[i].fileType);
//						pushVideoFiles(vm.selectDownloads[i]);//暂时使用浏览器窗口播放
						
						//更新树节点选中
						updateNodes(id,"check");
					}
				}
		    },
		    onBlur:function(event){//丢失焦点触发
		    	$(event.currentTarget).attr("disabled","disabled");//设置不可编辑
		    	var oldname = vm.pointSelectName,newname = $(event.currentTarget).val();
		    	if(oldname != newname){
		    		var fileType = '';
		    		var num = 0;
		    		//组装参数
		    		var id = $(event.currentTarget).parent("div").attr("id");
		    		for(var i=0;i<vm.selectDownloads.length;i++){
		    			if(vm.selectDownloads[i].id == id){
		    				fileType = vm.selectDownloads[i].fileType;
		    				num = i;
		    				break;
		    			}
		    		}
		    		var path = vm.pointSelectUrl.split(vm.pointSelectName+'.'+fileType)[0];
		    		var map = {oldname: oldname,newname:newname,path:path,fileType:fileType};
		    		var params = {'args':JSON.stringify(map)};
		    		message.saving("正在重命名...");
		    		utils.ajax(renameUrl, params, function (data) {
		    			message.close();
		    			if(data.respCode == '0000'){
		    				//更新模型
		    				vm.pointSelectName = newname;
		    				vm.pointSelectUrl = path + newname + '.' + fileType;
		    				vm.selectDownloads[num].pname = newname;
		    				vm.selectDownloads[num].dirPath = vm.pointSelectUrl;
		    				
		    				//更新树节点名称
		    				updateNodes(id,"name",newname);
		    			}else{
		    				vm.selectDownloads[num].pname = vm.pointSelectName;
		    				vm.selectDownloads[num].dirPath = vm.pointSelectUrl;
		    			}
		    			if(data.respCode != '0003'){//新旧文件名不相同
		    				message.alert(data.respMsg);
		    			}
		    		});
		    	}
		    }
		}
	});

	/*
	 * 加载目录树
	 */
	function loadDirTree () {
		setting = {
				view:{
					selectedMulti:false,//不可多选
					dblClickExpand:true //双击可展开
				},	
				data: {
					simpleData:{
						enable:true,
						pIdKey:'pid',
						idKey:'id'
					}
				},
				edit: {
					enable: true,
					drag: {
						prev:false,
						next:false,
						inner:false
					},
					showRemoveBtn:false,
					showRenameBtn:false,
				},
				callback: {
					onClick: function (event, treeId, treeNode) {
						if(!treeNode){
							return;
						}
						if((!treeNode.isParent&&treeNode.isNull)||treeNode.isParent){//如果文件夹
							loadDirList(treeNode);
						}
					},
					onDblClick: function (event, treeId, treeNode) {
						if(!treeNode.isParent&&!treeNode.isNull){//如果是文件
							for(var i=0;i<vm.selectDownloads.length;i++){
								if(vm.selectDownloads[i].id == treeNode.id){//如果点击的树节点能匹配到模型中的节点
				    				vm.choseDowOne(treeNode.id,null);
				    			}
							}
						}
					}
				}
			}
		utils.ajax(treeUrl, null, function (data) {
			vm.treeAllNodes = [];
			for(var i=0,j=data.length;i<j;i++){
				vm.treeAllNodes.push(data[i]);
			}
			zTreeObj = $.fn.zTree.init($('#dataTree'), setting, vm.treeAllNodes);
			
			//树加载后,默认选中根目录
			var treeNode = updateNodes(1001,'check');
			loadDirList(treeNode);
		});
	}
	
	/**
	 * 点击文件夹调用
	 * @param treeNode
	 * @returns
	 */
	function loadDirList (treeNode) {
		queryRecords(treeNode);
		
		queryDownload(treeNode);
		
		//设置非选中状态
		vm.isEnableType = false;
		vm.isSelectDownload = false;
		vm.isSelectRecord = false;
		
		//设置上传路径
		if(treeNode.level > 0) vm.currentUrl = treeNode.dirPath+'/';
		else vm.currentUrl = treeNode.dirPath;
		vm.treeNode = treeNode;
		
		uploader.setOption('formData',{savePath:vm.currentUrl});//附加参数
		//当文件被加入队列之前触发
		
		uploader.onBeforeFileQueued = function(file) {
			var map = {path:vm.currentUrl+file.name};
	    	var params = {'args':JSON.stringify(map)};
			utils.ajax(checkFileUrl , params , function (data) {
				if(data.respCode != '0000'){
					message.alert(data.respMsg);
					return false;
				}
			});
		};
	}
	
	loadDirTree();//加载树
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'dataTree',vm.treeAllNodes,setting);
	 });
	 
	/**
	 * 隐藏显示画面布局
	 * @returns
	 */
	function showLayout(){
		var layoutBtn = $("#layoutBtn").offset();//获取偏移量
    	var layout = $('#layout');
		if(layout.css('display') == 'block'){
			layout.css('display','none');
    	}else{
    		layout.css({
    			left:layoutBtn.left + "px", 
    			top:layoutBtn.top-450+"px",
    			opacity:0.85
    		}).slideDown("fast");	
    	}
	}
	
	/**
	 * 隐藏显示存储统计
	 * @returns
	 */
	function showStorage(){
		var storageBtn = $("#storageBtn").offset();//获取偏移量
		var storage = $('#storage');
		if(storage.css('display') == 'block'){
			storage.css('display','none');
			return "close";
		}else{
			storage.css({
				left:storageBtn.left + "px", 
				top:storageBtn.top-260 +"px"
			}).slideDown("fast");	
		}
	}
	
	/**
	 * 查询存储记录
	 * @param treeNode
	 * @returns
	 */
	function queryRecords(treeNode){
		//模型注入存储记录
		var params = {};
		//封装参数
		if(treeNode.level==0){
			params['cus_number'] = loginUser.cusNumber;
		}else if(treeNode.level==1){
			params['cus_number'] = loginUser.cusNumber;
			params['send_time'] = treeNode.name;
		}else if(treeNode.level==2){
			params['cus_number'] = loginUser.cusNumber;
			params['send_time'] = treeNode.getParentNode().name;
			params['file_path'] = treeNode.name;
		}else if(treeNode.level==3){
			params['cus_number'] = loginUser.cusNumber;
			params['send_time'] = treeNode.getParentNode().getParentNode().name;
			params['file_path'] = treeNode.getParentNode().name;
			params['event_id'] = treeNode.name;
		}
		 db.query({
			 request:{
				 sqlId:'select_video_storage_record',
				 params:params,
				 whereId:treeNode.level
			 },
			 success:function(data){
				 vm.selectRecords = [];
				 data.forEach(function(item){
					 vm.selectRecords.push({
						id:item.id,
						camera_id:item.camera_id,
						name:item.camera_name,
						cbd_type:item.camera_type,
						start_time:item.start_time,
						end_time:item.end_time,
						selected:false,
						isLoad:true
					 });
				 });
			 }
		 })
	}
	
	/**
	 * 查询存储文件
	 * @param treeNode
	 * @returns
	 */
	function queryDownload(treeNode){
		vm.selectDownloads = [];
		var nodesArray = zTreeObj.transformToArray(treeNode);
		for(var i=0,j=nodesArray.length;i<j;i++){
			if(!nodesArray[i].isParent&&!nodesArray[i].isNull){
				nodesArray[i].selected = false;
				vm.selectDownloads.push(nodesArray[i]);
			}
		}
	}
	
	/**
	 * 清除存储记录选中
	 * @returns
	 */
	function clearSelectRecoNodes(){
		for(var i=0,j=vm.selectRecords.length;i<j;i++){
			vm.selectRecords[i].selected = false;
		}
	}
	/**
	 * 清除存储文件选中
	 * @returns
	 */
	function clearSelectDownNodes(){
		for(var i=0,j=vm.selectDownloads.length;i<j;i++){
			vm.selectDownloads[i].selected = false;
		}
	}
	
	/**
	 * 清除树选中
	 * @returns
	 */
	function clearSelectTree(){
			zTreeObj.cancelSelectedNode();
	}
	
	/**
	 * 更新树节点
	 * @param treeNodeId 节点id
	 * @param property 属性  check:修改选中状态,name:修改节点名称
	 * @param value 属性值
	 * @returns
	 */
	function updateNodes(treeNodeId,property,value){
		var ztreeNode = zTreeObj.getNodeByParam("id",treeNodeId);
		if(property == 'check'){
//			clearSelectTree();//清除tree选中
			//展开关联节点
			if(ztreeNode.level>0){//选中某子节点
				zTreeObj.expandNode(ztreeNode);
				if(zTreeObj.isSelectedNode(ztreeNode)){//如果对应节点已选中
					if(!vm.isSelectDownload) zTreeObj.cancelSelectedNode(ztreeNode);//如果是取消选中文件,则取消选中树.否则不用再操作树
				}else {//如果对应节点没选中
					if(zTreeObj.getSelectedNodes().length==0) zTreeObj.selectNode(ztreeNode,false);//false仅代表不支持多选.如果所有节点都没选中,则选中该节点
					else {//如果存在选中的节点
						if(vm.isSelectDownload){//如果是选中文件
							clearSelectTree();
							zTreeObj.selectNode(ztreeNode,false);
						}else{//如果是取消选中文件
							clearSelectTree();
						}
					}
				}
			}else{//加载时默认选中顶级节点
				zTreeObj.selectNode(ztreeNode,false);
			}
			return ztreeNode;
		}else if(property == 'name'){
			ztreeNode.name = value+'.'+ztreeNode.fileType;
		}
		zTreeObj.updateNode(ztreeNode);
	}
	
	/**
	 * 删除树节点
	 * @returns
	 */
	function delNode(treeNodeId){
		var ztreeNode = zTreeObj.getNodeByParam("id",treeNodeId);
		zTreeObj.removeNode(ztreeNode);
		var parentNode = ztreeNode.getParentNode();
		if(parentNode.children.length==0){
			parentNode.isNull = true;
			parentNode.isParent = false;
			parentNode.icon = "image/nullDir.png";
			zTreeObj.updateNode(parentNode);
		}
	}
	
	/**
	 * 添加树节点(如果节点名称相同,则更新节点)
	 * @returns
	 */
	function addNode(parentNode,data){
		for(var i=0,j=vm.selectDownloads.length;i<j;i++){
			if(vm.selectDownloads[i].name == data.name){
				var ztreeNode = zTreeObj.getNodeByParam("id",vm.selectDownloads[i].id);
				ztreeNode.fileSize = data.fileSize;
				zTreeObj.updateNode(ztreeNode);
				return;
			}
			
		}
		var newNode = {
				pid:parentNode.pid,
				id:'add_'+ nodeNum++,
				name:data.name,
				dirPath:data.dirPath,
				fileSize:data.fileSize,
				pname:data.pname,
				isParent:false,
				isNull:false,
				selected:false,
				icon:'image/videoCamera.png',
				fileType:'mp4',
				typeUrl:'image/fileType/mp4.png'
		}
		zTreeObj.addNodes(parentNode, newNode);
	}
	
	/**
	 * 添加回放摄像机信息
	 * @param cameraId
	 * @returns
	 */
	function pushVideoCameras(cameraData){
		 var params = {};
		 params["cameraId"] = cameraData.camera_id+'';
		 params["beginTime"] = cameraData.start_time+'';
		 params["endTime"] = cameraData.end_time+'';
		 videoCameras.push(params);
	 }
	
	/**
	 * 添加播放文件信息
	 * @param cameraId
	 * @returns
	 */
	function pushVideoFiles(fileData){
		var params = {};
		params["fileName"] = fileData.dirPath+'';
		params["type"] = fileData.name.split(".")[1]+'';
		videoFiles.push(params);
	}
	
	/**
	 * 获得浏览器可以播放的视频格式
	 * @param fileType
	 * @returns
	 */
	function getEnableType(fileType){
		var map=["webm","gif","mp4","ogg","mpeg"];
		for(var i = 0;i<map.length;i++){
			if (fileType.compare(map[i])) return true;
		}
		return false;
	}
	
	/**
	 * 原型法:不区分大小写比较字符串
	 */
	String.prototype.compare = function(str){
		if(this.toLowerCase() == str.toLowerCase()){
		   return true; // 正确
		}else{
		   return false; // 错误
		}
	}
	
	/**
	 * 定制上传控件功能
	 */
	function setUploader(){
		 uploader.setOption('accept',{extensions: 'mp4',mimeTypes: 'video/mp4'});
		 uploader.setOption('server',ctx+'cameraCtr/fileUpload');//重设后台类+参数
		 uploader.setOption('duplicate',false);//不允许重复上传
		 //重定义上传成功后执行的方法
		 uploader.uploadSuccess =  function( file,response ){
				var result = JSON.parse(response);
				if(!result.success) {
					message.alert(result.msg);
					return;
				}
				//添加节点
				addNode(vm.treeNode,result);
				loadDirList(vm.treeNode);
		 };
		 uploader.uploadFinished = function() {
			 message.confirm("上传完成,要关闭上传窗口吗",function(){
				 dialog.close();
			 });
		 };
	}
	setUploader();
});