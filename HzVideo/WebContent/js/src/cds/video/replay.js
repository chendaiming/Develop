define(function(require){
	var $ = require('jquery'),
		vue = require('vue'),
		db = require('frm/hz.db'),
		user = require('frm/loginUser'),
		ztree = require('ztree'),
		select = require('frm/select'),
		datepicker = require('frm/datepicker'),
		treeUtil = require('frm/treeUtil'),
		videoClient = require('frm/hz.videoclient'),
		message = require('frm/message'),
		moment = require('moment');
		require('twix');
		
	var areaTree,setting,dateFormat='YYYY-MM-DD HH:mm:ss',timeFormat='YYYY-MM-DD HH:mm:ss';
	
	var vm = new vue({
		el:'body',
		data:{
			searchTree:'',
			cameraData:[],
			replayMode:'1',
			starttime:moment().subtract(1,'h').format(dateFormat),
			endtime:moment().format(dateFormat),
			layout:4,			//默认4布局
			layoutIndex:0,		//布局选中坐标
			layouts:[1,4,7,9],
			layoutCameras:[]
		},
		computed:{
			seconds:function(){
				return moment(this.starttime).twix(this.endtime).count('seconds');
			}
		},
		methods:{
			layoutClick:function(index){
				vm.layoutIndex = index;

			},
			setLayout:function(item){
				if(!vm.starttime || !vm.endtime){
					message.alert('开始时间和结束时间不能为空');
					return;
				}
				this.layout = item;
				videoClient.setLayout(item);
				this.showAndHideLayout();
				changeTime();
				vm.layoutIndex = 0;
			},
			showAndHideLayout:function(){
				showLayout();
			},
			replay:function(){
				var c = {};
				for(var i=0;i<this.layout;i++){
					if(this.layoutCameras[i].id){
						c[i+''] = {
							cameraId:this.layoutCameras[i].id,
							beginTime:this.layoutCameras[i].starttime,
							endTime:this.layoutCameras[i].endtime
						}
					}
				}
				videoClient.playback(c);
			}
		}
	});
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.cameraData,setting);
	 });

	 vm.$watch('replayMode',function(newVal,oldVal){
		 if(!vm.starttime || !vm.endtime){
			message.alert('开始时间和结束时间不能为空');
			return;
		 }
		 if(newVal == 2 && oldVal == 1){
			 replayMode1To2Reset();
		 }
		 if(newVal == 3 && oldVal == 1){
			 replayMode1To3Reset();
		 }
		 if(newVal == 3 && oldVal == 2){
			 replayMode2To3Reset();
		 }
		 if(newVal == 2 && oldVal == 3){
			 replayMode3To2Reset();
		 }
		 if(newVal == 1){
			 replayMode1Reset();
		 }
	 });
	 
	 vm.$watch('starttime',function(newVal){
		 if(!newVal){
			 return;
		 }
		 if(!vm.starttime || !vm.endtime){
			message.alert('开始时间和结束时间不能为空');
			return;
		 }
		 timeChange('s');
	 });
	 
	 vm.$watch('endtime',function(newVal){
		 if(!vm.endtime){
			 return;
		 }
		 if(!vm.starttime || !vm.endtime){
			message.alert('开始时间和结束时间不能为空');
			return;
		 }
		 timeChange('e');
	 });

	function timeChange(tag){
		var disseconds = moment(vm.starttime).twix(vm.endtime).count("seconds");
		if(disseconds<=1){
			message.alert('结束时间必须大于开始时间');
			if(tag == 's'){
				vm.starttime=null;
			}else if(tag=='e'){
				vm.endtime = null;
			}
			return;
		}
		changeTime();
	}
	
	function changeTime(){
		//单点多时段
		if(vm.replayMode == 1){
			var ms = vm.seconds / vm.layout;
			var realM = parseInt(ms);
			var stime = vm.starttime;
			var etime;
			for(var i=0;i<vm.layout;i++){
				if(i>0){
					stime = moment(etime).add(1,'s').format(dateFormat);
				}
				etime = moment(stime).add(realM,'s').format(dateFormat);
				if(i==vm.layout-1){
					etime = vm.endtime;
				}
				vm.layoutCameras[i].starttime = moment(stime).format(timeFormat);
				vm.layoutCameras[i].endtime = moment(etime).format(timeFormat);
			}			
		}else if(vm.replayMode==2){		//多点同时段
			for(var i=0;i<vm.layout;i++){
				vm.layoutCameras[i].starttime = moment(vm.starttime).format(timeFormat);
				vm.layoutCameras[i].endtime = moment(vm.endtime).format(timeFormat);				
			}
		}else if(vm.replayMode == 3){	//多点不同时段
			vm.layoutCameras[vm.layoutIndex].starttime = moment(vm.starttime).format(timeFormat);
			vm.layoutCameras[vm.layoutIndex].endtime = moment(vm.endtime).format(timeFormat);
		}
	}
	
	function changeMode1Layout(){
		 var id='',type='',name='';
		 if(vm.layoutCameras.length>0 && vm.layoutCameras[0].id){
			 id = vm.layoutCameras[0].id.replace('c_','');
			 type = vm.layoutCameras[0].cbd_type;
			 name = vm.layoutCameras[0].name;
		 }
		 vm.layoutCameras = [];
		 var ms = vm.seconds / vm.layout;
		 var realM = parseInt(ms);
		 var stime = vm.starttime;
		 var etime;
		 for(var i=0;i<9;i++){
			 if(i>0){
				 stime = moment(etime).add(1,'s').format(dateFormat);
			 }
			 etime = moment(stime).add(realM,'s').format(dateFormat);
			 if(i==vm.layout-1){
				 etime = vm.endtime;
			 }
			 vm.layoutCameras.push({
				 id:id,
				 type:type,
				 name:name,
				 starttime:moment(stime).format(timeFormat),
				 endtime:moment(etime).format(timeFormat)
			 });
		 }

	 }
	
	/**
	 * 回放模式 从2,3 到 1
	 * @returns
	 */
	function replayMode1Reset(){
		changeMode1Layout();
	}
	
	/**
	 * 回放模式 从1到2
	 * @returns
	 */
	function replayMode1To2Reset(){
		for(var i=0;i<vm.layout;i++){
			if(i>0){
				vm.layoutCameras[i].id='';
				vm.layoutCameras[i].type='';
				vm.layoutCameras[i].name='';
			}
			vm.layoutCameras[i].starttime = moment(vm.starttime).format(timeFormat);
			vm.layoutCameras[i].endtime = moment(vm.endtime).format(timeFormat);
		}
	}
	
	/**
	 * 回放模式 从1到3
	 * @returns
	 */
	function replayMode1To3Reset(){
		var ms = vm.seconds / vm.layout;
		var realM = parseInt(ms);
		var stime = vm.starttime;
		var etime;
		for(var i=0;i<vm.layout;i++){
			 if(i>0){
				 stime = moment(etime).add(1,'s').format(dateFormat);
				 vm.layoutCameras[i].id='';
				 vm.layoutCameras[i].type='';
				 vm.layoutCameras[i].name='';
			 }
			 etime = moment(stime).add(realM,'s').format(dateFormat);
			 if(i==vm.layout-1){
				 etime = vm.endtime;
			 }
			 vm.layoutCameras[i].starttime = moment(stime).format(timeFormat);
			 vm.layoutCameras[i].endtime = moment(etime).format(timeFormat);
		}
	}
	
	/**
	 * 回放模式 从2到3
	 * @returns
	 */
	function replayMode2To3Reset(){
		var ms = vm.seconds / vm.layout;
		var realM = parseInt(ms);
		var stime = vm.starttime;
		var etime;
		for(var i=0;i<vm.layout;i++){
			 if(i>0){
				 stime = moment(etime).add(1,'s').format(dateFormat);
			 }
			 etime = moment(stime).add(realM,'s').format(dateFormat);
			 if(i==vm.layout-1){
				 etime = vm.endtime;
			 }
			 if(vm.layoutCameras[i].starttime && vm.layoutCameras[i].endtime){
				 vm.layoutCameras[i].starttime = moment(stime).format(timeFormat);
				 vm.layoutCameras[i].endtime = moment(etime).format(timeFormat);				 
			 }
		}
	}
	/**
	 * 回放模式 从3到2
	 * @returns
	 */
	function replayMode3To2Reset(){
		for(var i=0;i<vm.layout;i++){
			if(vm.layoutCameras[i].starttime && vm.layoutCameras[i].endtime){
				vm.layoutCameras[i].starttime = moment(vm.starttime).format(timeFormat);
				vm.layoutCameras[i].endtime = moment(vm.endtime).format(timeFormat);				
			}
		}
	}
	
	/**
	 * 隐藏显示画面布局
	 * @returns
	 */
	function showLayout(){
		var layoutBtn = $("#layoutBtn").offset();
    	var layout = $('#layout');
		if(layout.css('display') == 'block'){
			layout.css('display','none');
    	}else{
    		layout.css({
    			left:layoutBtn.left-450 + "px", 
    			top:layoutBtn.top+35+"px",
    			opacity:0.85,
    			display:'block',
    			zIndex:100
    		}).slideDown("fast");	
    	}

	}
	
	/**
	 * 加载视频预案树
	 * @returns
	 */
	function initAreaCameraTree(){
		vm.cameraData = []; 
		setting={
			view:{dblClickExpand:false,selectedMulti:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
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
				showRenameBtn:false
			},
			callback:{
				onDblClick:function(e,treeId, treeNode){
					if(!treeNode || treeNode.isParent){
						return;
					}
					if(vm.replayMode == 1){
						for(var i=0;i<vm.layout;i++){
							vm.layoutCameras[i].id = treeNode.id.replace('c_','');
							vm.layoutCameras[i].cbd_type = treeNode.cbd_type;
							vm.layoutCameras[i].name = treeNode.name;
						}
					}
				},
				onDrop:function(e,treeId, treeNodes, targetNode, moveType, isCopy){
					var me=this;
					var index ;
					var c = treeNodes[0];
					if(e.target.tagName=='TD'){
						index = e.target.attributes['index'].value;
						if(vm.replayMode != 1){
							vm.layoutCameras[index].id = c.id.replace('c_','');
							vm.layoutCameras[index].cbd_type = c.cbd_type;
							vm.layoutCameras[index].name = c.name;
						}else{
							for(var i=0;i<vm.layout;i++){
								vm.layoutCameras[i].id = c.id.replace('c_','');
								vm.layoutCameras[i].cbd_type = c.cbd_type;
								vm.layoutCameras[i].name = c.name;
							}
						}
					}
					if(e.target.tagName=='SPAN'){
						index = e.target.parentNode.attributes['index'].value;
						if(vm.replayMode != 1){
							vm.layoutCameras[index].id = c.id.replace('c_','');
							vm.layoutCameras[index].cbd_type = c.cbd_type;
							vm.layoutCameras[index].name = c.name;
						}else{
							for(var i=0;i<vm.layout;i++){
								vm.layoutCameras[i].id = c.id.replace('c_','');
								vm.layoutCameras[i].cbd_type = c.cbd_type;
								vm.layoutCameras[i].name = c.name;
							}
						}
					}
				},
				beforeDrag:function(treeId, treeNodes){
					var me =this;
					me.isDrop = false;
					for(var i=0;i<treeNodes.length;i++){
						return !treeNodes[i].isParent;
					}
				}
			}
		}
		
		switch (user.dataAuth) {
			case 0:
				deptAreaCameraData();			
				break;
			case 1:
				prisonAreaCameraData();
				break;
			case 2:
				provinceAreaCameraData();
				break;
		}
	}
	
	
	/**
	 * 省局级别加载区域摄像机树
	 * @returns
	 */
	function provinceAreaCameraData(){
		//加载所有监狱
		db.query({
			async:false,
			request: {
				sqlId: 'select_org_dept',
				whereId:2,
				orderId:0
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
			}
		});
		//加载区域
		db.query({
			async:false,
			request: {
				sqlId: 'select_province_include_camera_area_tree',
				orderId:0
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
			}
		});
		db.query({
			request: {
				sqlId: 'select_camera_tree',
				orderId:0
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].id = 'c_'+data[i].id;
					vm.cameraData.push(data[i]);
				}
				areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
				areaTree.expandNode(areaTree.getNodes()[0],true);
				initReplayCamera();
			}
		});
	}
	
	/**
	 * 监狱级别加载区域摄像机树
	 * @returns
	 */
	function prisonAreaCameraData(){
		//加载区域
		db.query({
			async:false,
			request: {
				sqlId: 'select_include_camera_area_tree',
				orderId:0,
				params: [user.cusNumber,user.cusNumber]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
			}
		});
		//加载摄像机列表
		db.query({
			request: {
				sqlId: 'select_camera_tree',
				whereId: 0,
				orderId:0,
				params: [user.cusNumber]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].id = 'c_'+data[i].id;
					vm.cameraData.push(data[i]);
				}
				vm.cameraData.push({
					id:user.cusNumber,
					name:user.cusNumberName,
					pid:0,
					isParent:true
				});
				areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
				areaTree.expandNode(areaTree.getNodes()[0],true);
				initReplayCamera();
			}
		});
	}
	
	/**
	 * 部门级别加载区域摄像机树
	 * @returns
	 */
	function deptAreaCameraData(){
		//加载区域
		db.query({
			async:false,
			request: {
				sqlId: 'select_org_dept_byoddid',
				orderId:0,
				params: [user.deptId]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent = true;
					vm.cameraData.push(data[i]);
				}
			}
		});
		//加载摄像机列表
		db.query({
			request: {
				sqlId: 'select_camera_dept',
				orderId:0,
				params: [user.deptId,user.userId]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].id = 'c_'+data[i].id;
					vm.cameraData.push(data[i]);
				}
				vm.cameraData.push({
					id:user.cusNumber,
					name:user.cusNumberName,
					pid:0,
					isParent:true
				});
				areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
				areaTree.expandNode(areaTree.getNodes()[0],true);
				initReplayCamera();
			}
		});
	}
	
	initAreaCameraTree();
	changeMode1Layout();
	
	function initReplayCamera(){
		//地图摄像机模型右键回放
		if(window.top.replayCamera){
			var replayCamera = window.top.replayCamera;
			
			for(var i=0;i<9;i++){
				vm.layoutCameras[i].id = replayCamera.id+'';
				vm.layoutCameras[i].cbd_type = replayCamera.type;
				vm.layoutCameras[i].name = replayCamera.name;														
			}
			
			window.top.replayCamera = null;
			areaTree.selectNode(areaTree.getNodesByParam('id','c_'+replayCamera.id)[0]);
		}		
	}

});