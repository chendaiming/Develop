define(function(require){
	
	var $ = require('jquery');
	var select = require('frm/select');
	var vue = require('vue');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var db = require('frm/hz.db');
	var message = require('frm/message');
	
	var areaTree,setting;
		
	var vm = new vue({
		el:'body',
		data:{
			cameraData:[],
			searchTree:'',
			camera:{
				id:'',
				cbd_other_id:'',
				name:'',
				cbd_type:'0',
				cbd_brand:'',
				cbd_ip_addrs:'',
				cbd_dept_id:'',
				cbd_area_id:'',
				cbd_dvc_addrs:'',
				cbd_stts_indc:'0',
				cbd_stream_type:'0',
				cbd_playnow_type:'',
				cbd_playback_type:'',
				cbd_crte_user_id:loginUser.userId,
				cbd_updt_user_id:loginUser.userId,
				cbd_cus_number:loginUser.cusNumber,
				
				cbd_dept_name:'',
				cbd_area_name:''
			},
			devices:[{
				cvr_chnnl_code:'',//设备通道号
				cvr_device_id:''//设备编号
			}]
		},
		methods:{
			reset:function(){
				reset();
			},
			saveCamera:function(){
				var me=this;
				if(!this.camera.name || !$.trim(this.camera.name)){
					message.alert("请填写摄像机名称");
					return;
				}
				if(!this.camera.cbd_dept_id){
					message.alert("请选择所属部门");
					return;
				}
				if(!this.camera.cbd_area_id){
					message.alert("请在左侧树选择所在区域");
					return;
				}
				if(this.camera.name.length > 26){
					message.alert("摄像机名称过长，请输入26个以内字符");
					return;
				}
				/*if(!this.camera.cbd_other_id || !$.trim(this.camera.cbd_other_id)){
					message.alert("请填写厂商唯一编号");
					return;
				}
				*/
				if(this.camera.cbd_other_id && this.camera.cbd_other_id.length > 26){
					message.alert("厂商唯一编号过长，请输入26个以内字符");
					return;
				}
				if(this.camera.cbd_dvc_addrs && this.camera.cbd_dvc_addrs.length > 80){
					message.alert("安装位置过长，请输入80个以内字符");
					return;
				}
				if(!this.camera.cbd_brand) {
					message.alert("请选择摄像机品牌");
					return;
				}
				if(!this.camera.cbd_playnow_type) {
					message.alert("请选择监控处理");
					return;
				}
				if(!this.camera.cbd_playback_type) {
					message.alert("请选择录像处理");
					return;
				}
				var deviceIds = [];
				var isError = false;
				for(var i=0;i<this.devices.length;i++){
					if(this.devices[i].cvr_device_id) {
						deviceIds.push(this.devices[i].cvr_device_id);
					}
					if (this.devices[i].cvr_chnnl_code && this.devices[i].cvr_chnnl_code.length > 26) {
						isError = true;
						break;
					}
				}
				if (isError) {
					message.alert("设备通道号过长，请输入26个以内字符");
					return;
				}
				if(deviceIds.length == 0) {
					message.alert("请选择的关联设备");
					return;
				}
				if(isRepeat(deviceIds)){
					message.alert("选择的关联设备不允许重复");
					return;
				}
				var sqlId = !this.camera.id ? 'insert_camera' : 'update_camera' ;
				
				
				db.updateByParamKey({
					request: [{
						sqlId:sqlId,
						params:this.camera
					}],
					success: function (data) {
						var seqId = !me.camera.id ? data.data[0].seqList[0] : me.camera.id;
						
						var devis = [];
						if(me.devices.length > 0){
							for(var i=0,j=me.devices.length;i<j;i++){
								if(me.devices[i].cvr_device_id){
									devis.push({
										cvr_cus_number:loginUser.cusNumber,
										cvr_camera_id:seqId,
										cvr_chnnl_code:me.devices[i].cvr_chnnl_code,
										cvr_device_id:me.devices[i].cvr_device_id
									});
								}
							}
						}
						var cameraId = me.camera.id;
						if(devis.length >= 0){
							db.updateByParamKey({
								request: [{
									sqlId:'del_camera_video',
									params:{cvr_cus_number:loginUser.cusNumber,cvr_camera_id:seqId}
								},{
									sqlId:'insert_camera_video',
									params:devis
								}],
								success:function(data){
									var videoId = devis[0].cvr_device_id;
									if(!cameraId){
										_refreshCache('add',seqId,videoId);
									}else{
										_refreshCache('update',seqId,videoId);
									}
									if(data.success){
										me.devices = [{
											cvr_chnnl_code:'',
											cvr_device_id:''
										}]
									}
								},
								error: function (code, msg) {
									message.alert(msg);
								}
							});
						}
						if(sqlId == 'insert_camera'){
							me.camera.id = seqId;
							saveSuccess('保存成功','a');	
						}else if(sqlId == 'update_camera'){
							saveSuccess('保存成功','u');
						}
					},
					error: function (code, msg) {
						message.close();
					}
				});					
			},
			delCamera:function(){
				var me =this;
				if(!this.camera.id){
					message.alert("请在左侧树选择摄像机设备");
					return;
				}
				message.confirm('确定删除该摄像机设备吗？',function(index){
					var cameraId = me.camera.id;
					db.update({
						 request:[{
							 sqlId: 'del_camera',
							 params: [me.camera.id]
						 }],
						 success: function (data) {
							 db.updateByParamKey({
								request: [{
									sqlId:'del_camera_video',
									params:{cvr_cus_number:loginUser.cusNumber,cvr_camera_id:me.camera.id}
								}],
								success:function(data){
									_refreshCache('delete',cameraId);
								}
							 });
							 saveSuccess('删除成功','d');
						 },
						 error: function (code, msg) {
							 message.close();
						 }
					 });
				});
			},
			copyAndAddDevice:function(){
				var me =this;
				this.devices.push({
					cvr_chnnl_code:'',
					cvr_device_id:''
				});
			},
			delDevice:function(d){
				var me =this;
				me.devices.$remove(d);
			}
		}
	});
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.cameraData,setting);
	 });
	
	 /**
	  * 保存成功执行回调
	  * @returns
	  */
	 function saveSuccess(m,t){
		 message.close();
		 message.alert(m);
		 
		 if(vm.camera.cbd_type=='0'){
			 vm.camera.icon = 'image/qiang.png';
		 }else if(vm.camera.cbd_type=='1'){
			 vm.camera.icon = 'image/all_ball.png';
		 }else if(vm.camera.cbd_type=='2'){
			 vm.camera.icon = 'image/ban_ball.png';
		 }
		 
		 if(t=='u'){
			 var node = areaTree.getNodeByTId(vm.camera.tId);
			 var pnode = areaTree.getNodesByParam('id',vm.camera.pid);
			 node = vm.camera;
			 areaTree.moveNode(pnode[0],node,'inner');
			 areaTree.updateNode(node);
			 initAreaCameraTree();
		 }else if(t=='a'){
			 var pnode = areaTree.getNodesByParam('id',vm.camera.pid);
			 areaTree.addNodes(pnode[0],vm.camera);
			 vm.cameraData.push(vm.camera);
		 }else if(t=='d'){
			 var node = areaTree.getNodeByTId(vm.camera.tId);
			 areaTree.removeNode(node);
			 initAreaCameraTree();
		 }
		 
		 
		 reset();
	 }
	 
	 function reset(){
		 vm.devices = [{
			cvr_chnnl_code:'',
			cvr_device_id:''
		 }]
		 vm.camera={
			id:'',
			cbd_other_id:'',
			name:'',
			cbd_type:'0',
			cbd_brand:'',
			cbd_ip_addrs:'',
			cbd_dept_id:'',
			cbd_area_id:'',
			cbd_dvc_addrs:'',
			cbd_stts_indc:'0',
			cbd_stream_type:'0',
			cbd_playnow_type:'',
			cbd_playback_type:'',
			cbd_crte_user_id:loginUser.userId,
			cbd_updt_user_id:loginUser.userId,
			cbd_cus_number:loginUser.cusNumber
		 }
	 }
	 
	 function isRepeat(arr){
		var hash = {};
		for(var i in arr) {
			if(arr[i] && hash[arr[i]]){
				return true;				
			}
			hash[arr[i]] = true;
		}
		return false;
	 }
	 
	 
	 /**
	  * 加载关联视频设备
	  * @param cameraId
	  * @returns
	  */
	 function loadCameraDevices(cameraId){
		 db.query({
			 request:{
				 sqlId:'select_cameravideo',
				 params:[loginUser.cusNumber,vm.camera.id]
			 },
			 success:function(data){
				 vm.devices = data;
			 },
			 error:function(code, msg){
				 
			 }
		 });
	 }
	 
	 
	/**
	 * 初始化左侧区域摄像机树
	 * @returns
	 */
	function initAreaCameraTree(){
		vm.cameraData = []; 
		setting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			callback:{
				onClick:function(event,treeId,treeNode){
					
					var flag = true;
					if(treeNode && treeNode.children) {
						$.each(treeNode.children, function(idx, item){
							if (item.type == -1) {
								flag = false;
								return false;
							}
						})
					}
					if (!flag) {
						vm.$set('camera.cbd_area_name','');
						vm.$set('camera.cbd_area_id','');
						vm.$set('camera.pid','');
						return;
					}
					
					if(!treeNode || treeNode.cbd_area_id){
						addNavDom(treeId,treeNode);
						return;
					}
					vm.$set('camera.cbd_area_name',treeNode.name);
					vm.$set('camera.cbd_area_id',treeNode.id);
					vm.$set('camera.pid',treeNode.id);
				},
				onDblClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.isParent){
						return;
					}
					if(!treeNode.cbd_area_id){
						return;
					}
					vm.camera = treeNode;
					vm.camera.id = treeNode.id.replace('c_','');
					loadCameraDevices(treeNode.id.replace('c_',''));
				}
			}
		}
		db.query({
			request: {
				sqlId: 'select_video_area_tree',
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent=true;
					vm.cameraData.push(data[i]);
				}
				db.query({
					request: {
						sqlId: 'select_camera_tree',
						whereId: 0,
						params: [loginUser.cusNumber]
					},
					success: function (data) {
						for(var i=0,j=data.length;i<j;i++){
							data[i].id = 'c_'+data[i].id;
							vm.cameraData.push(data[i]);
						}
						vm.cameraData.push({
							id:loginUser.cusNumber,
							name:loginUser.cusNumberName,
							pid:0,
							isParent:true
						});
						areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.cameraData);
						areaTree.expandNode(areaTree.getNodes()[0],true);
					},
					error: function (code, msg) {}
				});
			},
			error: function (code, msg) {}
		});
	}
	
	initAreaCameraTree();
	
	function addNavDom(treeId,treeNode){
		var tid = treeNode.tId;
		var dom = $('#'+tid+'_a');
		var cameraId =  (treeNode.id+'').replace('c_','');
		var btnSpan  = dom.find('#nav_'+cameraId);
		$('.c_nav').hide();
		if(dom.find('#nav_'+cameraId).length==0){
			btnSpan = $('<img id="nav_'+cameraId+'" src="image/location.png" alt="定位" class="c_nav" />');			
			dom.append(btnSpan);
		}else{
			btnSpan.show();
		}
		$('#nav_'+cameraId).off('click');
		$('#nav_'+cameraId).on('click',function(){
			require(['hz/map/map.handle'],function(hzMap){
				hzMap.locationDvc(1,cameraId);
			})
		})
	}
	
	function _refreshCache(action,cameraid,videoid){
		//刷新redis缓存数据
		db.refreshCache({
			request:{
				serviceName:'cameraBaseDtlsCache',
				action:action,
				params:{
					cusNumber:loginUser.cusNumber,
					id:cameraid
				}
			},
			success:function(data){
				console.log('刷新摄像机缓存数据成功');
				videoid && _refreshVideoCache(action,videoid);
			},
			error:function(errorCode, errorMsg){
				console.log('刷新摄像机缓存数据失败'+errorCode + ":" + errorMsg);
			}
		});
	}
	
	
	function _refreshVideoCache(action,videoid){
		//刷新redis缓存数据
		db.refreshCache({
			request:{
				serviceName:'videoDeviceBaseDtlsCache',
				action:action,
				params:{
					cusNumber:loginUser.cusNumber,
					id:videoid
				}
			},
			success:function(data){
				console.log('刷新视频设备缓存数据成功');
			},
			error:function(errorCode, errorMsg){
				console.log('刷新视频设备缓存数据失败'+errorCode + ":" + errorMsg);
			}
		});
	}
	
});