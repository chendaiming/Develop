define(function(require){
	var $ = require("jquery");
	var select = require('frm/select');
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var model = require('frm/model');
	var areaTree,setting;
		
	
	var vm = new vue({
		el:'body',
		data:{
			broadcastDeviceData:[],
			searchTree:'',
			broadcastDevice:{
				bbd_id:'',
				bbd_other_id:'',
				bbd_name:'',
				bbd_brand:'',
				bbd_ip:'',
				bbd_port:'',
				bbd_dept_id:'',
				bbd_dept_name:'',
				bbd_area_id:'',
				bbd_area_name:'',
				bbd_dvc_addrs:'',
				bbd_dvc_stts:'',
				bbd_dvc_stts_name:'',
				bbd_use_stts:'',
				bbd_use_stts_name:'',
				bbd_seq:'',
				bbd_crte_user_id:loginUser.userId,
				bbd_updt_user_id:loginUser.userId,
				bbd_cus_number:loginUser.cusNumber,
				id:'',
				icon:'',
				pid:'',
				name:'',
				tId:''
			}
		},
		methods:{
			reset:function(){
				reset();
			},
			saveDevice:function(){
				if(!this.broadcastDevice.bbd_name || !$.trim(this.broadcastDevice.bbd_name)){
					message.alert("请填写广播设备名称");
					return;
				}
				if(!this.broadcastDevice.bbd_dept_id){
					message.alert("请选择所属部门");
					return;
				}
				if(!this.broadcastDevice.bbd_other_id){
					message.alert("请填写厂商唯一编号");
					return;
				}
				if(!this.broadcastDevice.bbd_area_id){
					message.alert("请在左侧树选择所在区域");
					return;
				}
				if(!this.broadcastDevice.bbd_dvc_stts){
					message.alert("请选择广播设备状态");
					return;
				}
				if(!this.broadcastDevice.bbd_use_stts){
					message.alert("请选择广播使用状态");
					return;
				}
				if(!this.broadcastDevice.bbd_brand){
					message.alert("请选择广播设备品牌");
					return;
				}
				if(this.broadcastDevice.bbd_name.length > 26){
					message.alert("广播名称过长，请输入26个以内字符");
					return;
				}
				if(this.broadcastDevice.bbd_port && this.broadcastDevice.bbd_port.length > 65535){
					message.alert("端口号过长，请重新重新输入");
					return;
				}
				var sqlId = !this.broadcastDevice.bbd_id ? 'insert_broadcast_device' : 'update_broadcast_device' ;
				vm.broadcastDevice.bbd_crte_user_id = loginUser.userId;
				vm.broadcastDevice.bbd_updt_user_id = loginUser.userId;
				
				var devis = [];
				db.updateByParamKey({
					request: [{
						sqlId:sqlId,
						whereId:0,
						params:this.broadcastDevice
					}],
					success: function (data) {
						vm.broadcastDevice.name = vm.broadcastDevice.bbd_name+"-"+vm.broadcastDevice.bbd_dvc_stts_name;
						if(sqlId == 'insert_broadcast_device'){
							vm.broadcastDevice.bbd_id = vm.broadcastDevice.id = data.data[0].seqList[0];
							saveSuccess('保存成功','a');	
						}else if(sqlId == 'update_broadcast_device'){
							saveSuccess('更新成功','u');	
						}
					},
					error: function (code, msg) {
						message.alert(msg);
					}
				});					
			},
			delDevice:function(){
				var me =this;
				if(!this.broadcastDevice.bbd_id){
					message.alert("请在左侧树选择广播设备");
					return;
				}
				message.confirm('确定删除该广播设备吗？',function(index){
					db.update({
						 request:[{
							 sqlId: 'delete_broadcast_device',
							 params: [me.broadcastDevice.bbd_id]
						 }],
						 success: function (data) {
							 saveSuccess('删除成功','d');
						 },
						 error: function (code, msg) {
							 message.close();
						 }
					 });
				});
			}
		}
	});
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.broadcastDeviceData,setting);
	 });
	
	 /**
	  * 保存成功执行回调
	  * @returns
	  */
	 function saveSuccess(m,t){
		 message.close();
		 message.alert(m);
		 if(t=='u'){ 
			 var node = areaTree.getNodesByParam('id',vm.broadcastDevice.id)[0];
			 var pnode = areaTree.getNodesByParam('id',vm.broadcastDevice.pid)[0];
			 areaTree.addNodes(pnode,vm.broadcastDevice);
			 areaTree.removeNode(node);
		 }else if(t=='a'){
			 var pnode = areaTree.getNodesByParam('id',vm.broadcastDevice.pid);
			 vm.broadcastDevice.id = vm.broadcastDevice.bbd_id;
			 areaTree.addNodes(pnode[0],vm.broadcastDevice);
		 }else if(t=='d'){
			 var node = areaTree.getNodeByTId(vm.broadcastDevice.tId);
			 areaTree.removeNode(node);
			 node.getParentNode().isParent = true;
		 }
		 
		 
		 reset();
	 }
	 
	 
	 
	 
	 function reset(){
		 vm.broadcastDevice={
			bbd_id:'',
			bbd_other_id:'',
			bbd_name:'',
			bbd_brand:'',
			bbd_ip:'',
			bbd_port:'',
			bbd_dept_id:'',
			bbd_dept_name:'',
			bbd_area_id:'',
			bbd_area_name:'',
			bbd_dvc_addrs:'',
			bbd_dvc_stts:'',
			bbd_use_stts:'',
			bbd_crte_user_id:loginUser.userId,
			bbd_updt_user_id:loginUser.userId,
			bbd_cus_number:loginUser.cusNumber,
			id:'',
			icon:'',
			pid:'',
			name:'',
			tId:''
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
	 * 初始化左侧区域电网设备树
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
			callback:{
				onClick:function(event,treeId,treeNode){
					if(!treeNode || !treeNode.isParent){
						return;
					}
					vm.$set('broadcastDevice.bbd_area_name',treeNode.name);
					vm.$set('broadcastDevice.bbd_area_id',treeNode.id);
					vm.$set('broadcastDevice.pid',treeNode.id);
					vm.$set('broadcastDevice.tId',treeNode.tId);
				},
				onDblClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.isParent){
						return;
					}
					treeNode.id = treeNode.id.replace('v_','');
					model.modelData(vm.broadcastDevice,treeNode);
				}
			}
		}
		db.query({
			request: {
				sqlId: 'select_broadcast_device_area_tree',
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent=true;
					vm.broadcastDeviceData.push(data[i]);
				}
				db.query({
					request: {
						sqlId: 'select_broadcast_device_tree',
						whereId: 0,
						params: [loginUser.cusNumber]
					},
					success: function (data) {
						for(var i=0,j=data.length;i<j;i++){
							//data[i].icon = "";
							data[i].name = data[i].name +'-'+ data[i].bbd_dvc_stts_name;
							data[i].id = "v_"+data[i].id;
							vm.broadcastDeviceData.push(data[i]);
						}
						vm.broadcastDeviceData.push({
							id:loginUser.cusNumber,
							name:loginUser.cusNumberName,
							pid:0,
							isParent:true,
							open:true,
							icon:'org.png'
						});
						areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.broadcastDeviceData);
					},
					error: function (code, msg) {}
				});
			},
			error: function (code, msg) {}
		});
	}
	
	initAreaDeviceTree();
});