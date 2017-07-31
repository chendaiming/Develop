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
			pnDeviceData:[],
			searchTree:'',
			isRelation:false,	//点位关联
			pnDevice:{
				pnb_id:'',
				pnb_name:'',
				pnb_brand:'',
				pnb_ip:'',
				pnb_port:'',
				pnb_dprtmnt:'',
				pnb_dprtmnt_name:'',
				pnb_area:'',
				pnb_area_name:'',
				pnb_stts_indc:'',
				pnb_stts_indc_name:'',
				pnb_addrs:'',
				pnb_max_voltage:'',
				pnb_min_voltage:'',
				pnb_max_flow:'',
				pnb_min_flow:'',
				pnb_crte_user_id:loginUser.userId,
				pnb_updt_user_id:loginUser.userId,
				pnb_cus_number:loginUser.cusNumber,
				id:'',
				tId:'',
				icon:'',
				pid:'',
				name:''
			}
		},
		methods:{
			reset:function(){
				reset();
			},
			checkNumber:function(num,msg){
				if(!/^[0-9]*$/.test(num)){
					message.alert(msg);
					return false;
				}
				return true;
			},
			checkIsEmpty:function(data,msg){
				if(!data || !$.trim(data)){
					message.alert(msg);
					return false;
				}
				return true;
			},
			savePNDevice:function(){
				var result = vm.checkIsEmpty(vm.pnDevice.pnb_name,"请填写电网名称") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_dprtmnt,"请选择所属部门") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_area,"请选择所在区域") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_stts_indc,"请选择电网状态") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_brand,"请选择电网品牌") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_ip,"请输入IP地址") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_port,"请输入端口号") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_max_voltage,"请输入电压上限") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_min_voltage,"请输入电压下限") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_max_flow,"请输入电流上限") &&
				vm.checkIsEmpty(vm.pnDevice.pnb_min_flow,"请输入电流下限") &&
				vm.checkNumber(vm.pnDevice.pnb_port,"端口号不是整数") &&
				vm.checkNumber(vm.pnDevice.pnb_max_voltage,"电压上限不是整数") &&
				vm.checkNumber(vm.pnDevice.pnb_min_voltage,"电压下限不是整数") &&
				vm.checkNumber(vm.pnDevice.pnb_max_flow,"电流上限不是整数") &&
				vm.checkNumber(vm.pnDevice.pnb_min_flow,"电流下限不是整数");
				if(!result){
					return;
				}
				if(vm.pnDevice.pnb_name.length > 26){
					message.alert("电网名称过长，请输入26个以内字符");
					return;
				}
				if(parseInt(vm.pnDevice.pnb_port) > 65535){
					message.alert("端口号过长，请重新重新输入");
					return;
				}
				var sqlId = !vm.pnDevice.pnb_id ? 'insert_pn_device' : 'update_pn_device' ;
				vm.pnDevice.pnb_crte_user_id = loginUser.userId;
				vm.pnDevice.pnb_updt_user_id = loginUser.userId;
				
				var devis = [];
				db.updateByParamKey({
					request: [{
						sqlId:sqlId,
						whereId:0,
						params:vm.pnDevice
					}],
					success: function (data) {
						vm.pnDevice.name = vm.pnDevice.pnb_name+'-'+ vm.pnDevice.pnb_stts_indc_name;
						if(sqlId == 'insert_pn_device'){
							vm.pnDevice.pnb_id = vm.pnDevice.id = data.data[0].seqList[0];
							saveSuccess('保存成功','a');	
						}else if(sqlId == 'update_pn_device'){
							saveSuccess('更新成功','u');	 
						}
					},
					error: function (code, msg) {
						message.alert(msg);
					}
				});					
			},
			delPNDevice:function(){
				if(!vm.pnDevice.id){
					message.alert("请在左侧树选择电网设备");
					return;
				}
				//检查点位关联
				vm.checkRelationPoint(vm.pnDevice.pnb_id)
				if(vm.isRelation){
					message.alert('此设备已经关联地图点位，不能删除');
					return;
				}
				message.confirm('确定删除该电网设备吗？',function(index){
					db.update({
						 request:[{
							 sqlId: 'delete_pn_device',
							 params: [vm.pnDevice.pnb_id]
						 }],
						 success: function (data) {
							 saveSuccess('删除成功','d');
						 },
						 error: function (code, msg) {
							 message.close();
						 }
					 });
				});
			},
			checkRelationPoint:function(id){	//检查点位是否已经关联（控制面板）
				db.query({
					request: {
						sqlId: 'select_pn_view_info_ztree',		//查询电网点位图形数据
						whereId: 1,
						params: {'cusNumber':loginUser.cusNumber,'pnb_id':id}
					},
					async:false,
					success: function (data) {
						if(data && data.length > 0){
							vm.isRelation = true;
						}else{
							vm.isRelation = false; 
						}
						message.close();
					},
					error: function (code, msg) {
						message.alert(msg);
					}
				});
			}
		}
	});
	
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.pnDeviceData,setting);
	 });
	
	 /**
	  * 保存成功执行回调
	  * @returns
	  */
	 function saveSuccess(m,t){
		 message.close();
		 message.alert(m);
		 
		 if(t=='u'){
			 var node = areaTree.getNodeByTId(vm.pnDevice.tId);
			 var pnode = areaTree.getNodesByParam('id',vm.pnDevice.pid);
			 model.modelData(node,vm.pnDevice);
			 areaTree.updateNode(node);	
		 }else if(t=='a'){
			 var pnode = areaTree.getNodesByParam('id',vm.pnDevice.pid);
			 areaTree.addNodes(pnode[0],vm.pnDevice);
		 }else if(t=='d'){
			 var node = areaTree.getNodeByTId(vm.pnDevice.tId);
			 areaTree.removeNode(node);
		 }
		 reset();
	 }
	 
	 function reset(){
		 vm.pnDevice={
			pnb_id:'',
			pnb_name:'',
			pnb_brand:'',
			pnb_ip:'',
			pnb_port:'',
			pnb_dprtmnt:'',
			pnb_dprtmnt_name:'',
			pnb_area:'',
			pnb_area_name:'',
			pnb_stts_indc:'',
			pnb_stts_indc_name:'',
			pnb_addrs:'',
			pnb_max_voltage:'',
			pnb_min_voltage:'',
			pnb_max_flow:'',
			pnb_min_flow:'',
			pnb_crte_user_id:loginUser.userId,
			pnb_updt_user_id:loginUser.userId,
			pnb_cus_number:loginUser.cusNumber,
			id:'',
			tId:'',
			icon:'',
			pid:'',
			name:''
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
		vm.pnDeviceData = []; 
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
					if(!treeNode || !treeNode.isParent || treeNode.name == loginUser.cusNumberName){
						return;
					}
					vm.$set('pnDevice.pnb_area_name',treeNode.name);
					vm.$set('pnDevice.pnb_area',treeNode.id);
					vm.$set('pnDevice.pid',treeNode.id);
				},
				onDblClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.isParent){
						return;
					}
					treeNode.id = treeNode.id.replace('v_','');
					model.modelData(vm.pnDevice,treeNode);
				}
			}
		}
		db.query({
			request: {
				sqlId: 'select_pn_device_area_tree',
				whereId: 0,
				params: [loginUser.cusNumber,'99999']
			},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					data[i].isParent=true;
					data[i].pid = loginUser.cusNumber;
					vm.pnDeviceData.push(data[i]);
				}
				db.query({
					request: {
						sqlId: 'select_pn_device_tree',
						whereId: 0,
						params: {'cusNumber':loginUser.cusNumber}
					},
					success: function (data) {
						for(var i=0,j=data.length;i<j;i++){
							data[i].name = data[i].name +'-'+ data[i].pnb_stts_indc_name;
							data[i].id = 'v_'+data[i].id;
							vm.pnDeviceData.push(data[i]);
						}
						vm.pnDeviceData.push({
							id:loginUser.cusNumber,
							name:loginUser.cusNumberName,
							pid:0,
							isParent:true,
							icon:'org.png'
						});
						areaTree = $.fn.zTree.init($('#areaTree'),setting,vm.pnDeviceData);
						areaTree.expandAll(true);
						
					},
					error: function (code, msg) {}
				});
			},
			error: function (code, msg) {}
		});
	}
	
	initAreaDeviceTree();
});