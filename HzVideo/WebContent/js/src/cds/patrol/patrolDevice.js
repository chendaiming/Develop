define(function(require){
	var user = require('frm/loginUser');
	var vue = require('vue');
	var ztree = require('ztree');
	var message =require('frm/message');
	var select = require('frm/select');
	var treeUtil = require('frm/treeUtil');
	var db =require('frm/hz.db');
	var localData = require('frm/localData');
	var areaPatrolTree,
		treeSetting={
			view:{dblClickExpand:false},	 
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			callback:{
				onClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.tree_type=='ppi'){
						return;
					}
					localData.subsetZTrees(treeNode, function () {
						vm.patrol.ppi_area_name = treeNode.name;
						vm.patrol.pid = treeNode.id;
						vm.patrol.ppi_area_id = treeNode.id.replace('p_','');
					},'area','tree_type');

				},
				onDblClick:function(event,treeId,treeNode){
					if(!treeNode || treeNode.tree_type=='area'){
						return;
					}
					vm.patrol = treeNode;
					if(treeNode.getParentNode()){
						vm.patrol.ppi_area_name = treeNode.getParentNode().name;
						vm.patrol.ppi_area_id = treeNode.getParentNode().id.replace('p_','');						
					}
					vm.patrol.id = treeNode.id.replace('p_','');
					var index = treeNode.name.indexOf("-");
					if(index>-1){
						vm.patrol.name = treeNode.name.substr(0,index);
					}
				}
			}
		};
	
	var vm =new vue({
		el:'body',
		data:{
			treeData:[],
			searchTree:'',
			patrol:{
				ppi_cus_number:user.cusNumber,
				id:'',
				ppi_other_id:'',
				name:'',
				ppi_brand:'',
				ppi_dept_id:'',
				ppi_area_name:'',
				ppi_area_id:'',
				ppi_rlan_ctrl:'',//关联控制器
				ppi_dvc_addrs:'',
				ppi_dvc_stts:'0',
				ppi_seq:0,
				ppi_crte_user_id:user.userId,
				ppi_updt_user_id:user.userId,
				tree_type:'ppi'
			}
		},
		watch:{
			searchTree:function(){
				 treeUtil.searchTree('name',vm.searchTree,'areaPatrolTree',vm.treeData,treeSetting);
			}
		},
		methods:{
			save:function(){savePatrol();},
			del:function(){delPatrol();},
			reset:function(){reset()}
		}
	});
	
	function savePatrol(){
		if(!vm.patrol.name.trim()){
			message.alert('请填写巡更点名称');
			return;
		}
		if(!vm.patrol.ppi_brand){
			message.alert('请选择设备品牌');
			return;
		}
		if(!vm.patrol.ppi_rlan_ctrl){
			message.alert('请选择控制器');
			return;
		}
		if(!vm.patrol.ppi_dept_id){
			message.alert('请选择所属部门');
			return;
		}
		if(!vm.patrol.ppi_area_id){
			message.alert('请在左侧树选择所属区域');
			return;
		}
		if(vm.patrol.name.length > 26){
			message.alert("巡更点名称过长，请输入26个以内字符");
			return;
		}
		if(vm.patrol.ppi_other_id && vm.patrol.ppi_other_id.length > 26){
			message.alert("厂商唯一编号过长，请输入26个以内字符");
			return;
		}

		vm.patrol.ppi_updt_user_id = user.userId;
		var sqlId = !vm.patrol.id ? 'insert_patrol' :'update_patrol';
		db.updateByParamKey({
			request:[{
				sqlId:sqlId,
				params:vm.patrol
			}],
			success:function(data){
				var seqId = !vm.patrol.id ? data.data[0].seqList[0] : vm.patrol.id;
				if(sqlId == 'insert_patrol'){
					vm.patrol.id = seqId;

					saveSuccess('保存成功','a');							
				}else if(sqlId == 'update_patrol'){

					saveSuccess('保存成功','u');	
				}
			}
		});
	};
	function delPatrol(){
		if(!vm.patrol.id){
			message.alert('请双击选择左侧要删除的巡更点');
			return;
		}
		message.confirm('确定要删除该巡更点吗？',function(index){
			db.update({
				request:[{
					sqlId:'delete_patrol',
					params:[user.cusNumber,vm.patrol.id]
				}],
				success:function(data){
					saveSuccess('删除成功','d');							
				}
			});
		});
	}

	function saveSuccess(m,t){
		 message.close();
		 message.alert(m);
		var pnode,node;
		 if(t=='u'){/*改*/
			 localData.changeTrees(vm.treeData,vm.patrol);
			 //node = areaPatrolTree.getNodeByTId(vm.patrol.tId);
			 pnode = areaPatrolTree.getNodesByParam('id',vm.patrol.pid);
			 node = vm.patrol;
			 if(vm.patrol.ppi_dvc_stts == '1'){
				 node.name = viewStatus(vm.patrol.name);
			 }
			 areaPatrolTree.moveNode(pnode[0],node,'inner');
			 areaPatrolTree.updateNode(node);	
		 }else if(t=='a'){/*增*/
			 pnode = areaPatrolTree.getNodesByParam('id',vm.patrol.pid);
			 vm.patrol.tree_type='ppi';
			 var newNodes = areaPatrolTree.addNodes(pnode[0],vm.patrol);
			 localData.addTrees(vm.treeData,newNodes[0]);
		 }else if(t=='d'){/*删*/
			 localData.removeTrees(vm.treeData,vm.patrol);
			 node = areaPatrolTree.getNodeByTId(vm.patrol.tId);
			 areaPatrolTree.removeNode(node);
		 }
		 
		 reset();
	}
	function reset(){
		vm.patrol = {
			ppi_cus_number:user.cusNumber,
			id:'',
			ppi_other_id:'',
			name:'',
			ppi_brand:'',
			ppi_dept_id:'',
			ppi_rlan_ctrl:'',
			ppi_area_name:'',
			ppi_area_id:'',
			ppi_dvc_addrs:'',
			ppi_dvc_stts:'0',
			ppi_seq:0,
			ppi_crte_user_id:user.userId,
			ppi_updt_user_id:user.userId
		}
	}
	function initAreaPatrolTree(){
		db.query({
			request:{
				sqlId:'select_patrol_device_ztree',
				params:{cusNum:user.cusNumber}
			},
			success:function(data){
				vm.treeData = data;
				vm.treeData.push({
					id:'p_'+user.cusNumber,
					name:user.cusNumberName,
					pid:0,
					tree_type:'area'
				});
				
				
				appendStatus(data);
				
				areaPatrolTree = $.fn.zTree.init($('#areaPatrolTree'),treeSetting,data);
				areaPatrolTree.expandNode(areaPatrolTree.getNodes()[0],true);
			}
		});
	}
	
	/**
	 * 状态信息追加
	 */
	function appendStatus(data){
		
		for(var i=0;i<data.length;i++){
			if(data[i].tree_type == 'ppi' && data[i].ppi_dvc_stts == 1){
				data[i].name = viewStatus(data[i].name);
			}
		}
	}
	
	function viewStatus(name){
		return name + '-故障';
	}
	
	initAreaPatrolTree();
});