define(function(require){
	var select = require('frm/select'),
		vue = require('vue'),
		user = require('frm/loginUser'),
		db = require('frm/hz.db'),
		message = require('frm/message'),
		treeUtil =require('frm/treeUtil')
	
	var deviceTypeTree,setting;
	
	var vm = new vue({
		el:'body',
		data:{
			typeData:[],
			searchTree:'',
			dt:{
				id:'',
				name:'',
				pid:user.cusNumber,
				pname:'',
				dgt_dvc_type:'',
				dgt_seq:'',
				dgt_cus_number:user.cusNumber,
				dgt_crte_user_id:user.userId,
				dgt_updt_user_id:user.userId
			}
		},
		methods:{
			saveType:function(){
				var me=this;
				if(!me.dt.pname){
					message.alert('请选择上级类型');
					return;
				}
				if(!me.dt.name){
					message.alert('请填写类型名称');
					return;
				}
				if(!me.dt.dgt_dvc_type){
					message.alert('请选择设备类型');
					return;
				}
				var sqlId = !me.dt.id ? 'insert_device_type' : 'update_device_type'
				db.updateByParamKey({
					 request: [{
						 sqlId:sqlId,
						 params:me.dt
					 }],
					 success: function (data) {
						 var seqId = !me.dt.id ? data.data[0].seqList[0] : me.dt.id;
						 if(sqlId == 'insert_device_type'){
							 me.dt.id = seqId;
							 saveSuccess('保存成功','a');							
						 }else if(sqlId == 'update_device_type'){
							 saveSuccess('保存成功','u');	
						 }
						 initDeviceTypeTree();
					 },
					 error: function (code, msg) {}
				 });
			},
			delType:function(){
				var me=this;
				if(me.dt.id.length==0){
					message.alert('请双击选择左侧设备预案类型');
					return;
				}
				var ms = !me.dt.isParent ? '确定要删除该设备类型吗？' : '确定删除该设备类型以及子节点吗？';
				message.confirm(ms,function(index){
					db.updateByParamKey({
						request: [{
							sqlId:'delete_device_type',
							whereId:0,
							params:{id:me.dt.id}
						},{
							sqlId:'delete_device_type',
							whereId:1,
							params:{id:me.dt.id}
						}],
						success: function (data) {
							saveSuccess('删除成功','d');
							initDeviceTypeTree();
						},
						error: function (code, msg) {}
					})
				});
			},
			reset:function(){
				reset();
			}
		}
	});
	
	/**
	  * 搜索tree监听函数
	  */
	 vm.$watch('searchTree',function(){
		 treeUtil.searchTree('name',vm.searchTree,'deviceTypeTree',vm.typeData,setting);
	 });
	
	function saveSuccess(m,t){
		message.close();
		message.alert(m);
		
		if(t=='u'){
			 var node = deviceTypeTree.getNodeByTId(vm.dt.tId);
			 var pnode = deviceTypeTree.getNodesByParam('id',vm.dt.pid);
			 node = vm.dt;
			 deviceTypeTree.moveNode(pnode[0],node,'inner');
			 deviceTypeTree.updateNode(node);	
		 }else if(t=='a'){
			 var pnode = deviceTypeTree.getNodesByParam('id',vm.dt.pid);
			 deviceTypeTree.addNodes(pnode[0],vm.dt);
		 }else if(t=='d'){
			 var node = deviceTypeTree.getNodeByTId(vm.dt.tId);
			 deviceTypeTree.removeNode(node);
		 }
		
		reset();
	}
	function reset(){
		vm.dt={
			id:'',
			name:'',
			pid:user.cusNumber,
			pname:'',
			dgt_dvc_type:'',
			dgt_seq:'',
			dgt_cus_number:user.cusNumber,
			dgt_crte_user_id:user.userId,
			dgt_updt_user_id:user.userId	
		}	
	}
	/**
	 * 初始化设备类型树
	 * @returns
	 */
	function initDeviceTypeTree(){
		setting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					if(treeNode.id == vm.dt.id){
						return;
					}
					vm.dt.pname = treeNode.name;
					vm.dt.pid = treeNode.id;
				},
				onDblClick:function(event, treeId, treeNode){
					if(!treeNode || treeNode.id == -1){
						reset();
						return;
					}
					vm.dt = treeNode;
					if(treeNode.getParentNode()){
						vm.dt.pname = treeNode.getParentNode().name;
						vm.dt.pid = treeNode.getParentNode().id;						
					}
				}
			}
		}
		
		db.query({
			request:{
				sqlId:'select_device_type',
				params:[user.cusNumber]
			},
			success:function(data){
				data.push({
					id:user.cusNumber,
					name:user.cusNumberName,
					pid:null,
					isParent:true,
					open:true
				});
				vm.typeData = data;
				deviceTypeTree = $.fn.zTree.init($('#deviceTypeTree'),setting,data);
			}
		});
	}
	
	initDeviceTypeTree();
});