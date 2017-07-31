define(function(require){
	var $ = require("jquery"); 
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
	var select = require('frm/select');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');

	 
	var areaTree,setting,deptTree;
	 
	 var vm = new vue({
		 el:'body',
		 data:{
			 typeData:[],
			 levelData:[],
			 isUpdate:false,
			 searchTree:'',
			 areaData:[],
			 area:{
				 oldId:'',
				 abd_cus_number:loginUser.cusNumber,
				 abd_area_type:'',
				 abd_area_level:'',
				 id:'',
				 name:'',
				 pid:'',
				 pname:'',
				 abd_2dmap_id:'',
				 abd_3dmap_id:'',
				 abd_seq:'',
				 abd_crte_user_id:loginUser.userId,
				 abd_updt_user_id:loginUser.userId,
				 dept_ids:'',
				 dept_names:'',
				 isParent:false
			 },
			 dept_names:'',
			 deptIds:[]
		 },
		 methods:{
			 showDept:function(e){
				 if($('#deptCon').css('display')=='none'){
					 $('#deptCon').css('display',"block");
				 }else{
					 $('#deptCon').css('display','none');
				 }
			 },
			 reset:function(){
				 resetData();
			 },
			 delArea:function(){
				 var me=this;
				 if(!me.area.oldId){
					 message.alert('请在左侧区域树双击选择一个区域');
					 return;
				 }
				 var ms = !me.area.isParent ? '确定要删除该区域吗？' : '确定删除该区域以及子区域吗？';
				
				 message.confirm(ms,function(index){
					 db.updateByParamKey({
						 request: [{
							 sqlId:'del_org_area',
							 params:{oldId:me.area.oldId,cus_number:loginUser.cusNumber}
						 },{
							 sqlId: 'delete_area',
							 whereId:0,
							 params:{oldId:me.area.oldId,abd_cus_number:loginUser.cusNumber}
						 },{
							 sqlId: 'delete_area',
							 whereId:1,
							 params:{oldId:me.area.oldId,abd_cus_number:loginUser.cusNumber}
						 }],
						 success: function (data) {
							 saveSuccess('删除成功','d');
						 },
						 error: function (code, msg) {}
					 });						 
				 });
			 },
			 saveArea:function(){
				 var me=this;
				 if(!me.area.pname){
					 //message.alert('请在左侧树选择上级区域');
					 //return;
					 me.area.pid = loginUser.cusNumber;
				 }
				 if(!me.area.id){
					 message.alert('请填写区域编号');
					 return;
				 }
				 if(me.area.id.length>15){
					 message.alert('区域编号过长');
					 return;
				 }
				 if(!me.area.name){
					 message.alert('请填写区域名称');
					 return;
				 }
				 if(me.area.name.length>15){
					 message.alert('区域名称过长');
					 return;
				 }
				 if(me.deptIds.length==0){
					 message.alert('请选择所属部门');
					 return;
				 }
				 if(!me.area.abd_area_type){
					 message.alert('请选择区域类型');
					 return;
				 }
				 var reg = new RegExp("^[0-9]*$");  
				 if(!reg.test(me.area.id)){
					 message.alert('区域编号必须由数字组成');
					 return;
				 }
				 if(me.area.abd_2dmap_id.length>20){
					 message.alert('二维图层过长');
					 return;
				 }
				 if(me.area.abd_3dmap_id.length>20){
					 message.alert('三维模型过长');
					 return;
				 }
				 message.saving();
				 var sqlId = !me.area.oldId ? 'insert_area' : 'update_area'
				 var areaid = me.area.oldId ? me.area.oldId:me.area.id;
				 var areaDepts=[];
				 for(var i=0;i<me.deptIds.length;i++){
					 areaDepts.push({
						 cus_number:loginUser.cusNumber,
						 area_id:me.area.id,
						 dept_id:me.deptIds[i]
					 });
				 }	
				 db.updateByParamKey({
					 request: [{
						 module:'areamng',
						 sqlId:sqlId,
						 params:me.area
					 },{
						 sqlId:'del_org_area',
						 params:{oldId:areaid,cus_number:loginUser.cusNumber}
					 },{
						 sqlId:'insert_org_area',
						 params:areaDepts
					 }],
					 success: function (data) {
						 if(me.area.isParent && sqlId == 'update_area'){
							 db.updateByParamKey({
								 request: [{
									 sqlId:'update_area_pid',
									 params:{oldId:me.area.oldId,id:me.area.id,abd_cus_number:loginUser.cusNumber}
								 }],
								 success: function (data) {
									 saveSuccess('保存成功','u');	
								 },
								 error: function (code, msg) {
									 message.alert(msg);
								 }
							 });
						 }else{
							 if(sqlId == 'update_area'){
								 saveSuccess('保存成功','u');							 
							 }else if(sqlId=='insert_area'){
								 saveSuccess('保存成功','a');	
							 }
						 }
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
		 treeUtil.searchTree('name',vm.searchTree,'areaTree',vm.areaData,setting);
	 });
	 
	 /**
	  * 保存成功执行回调
	  * @returns
	  */
	 function saveSuccess(m,type){
		 message.close();
		 message.alert(m);
//		 initAreaTree();
		 if(type=='u'){
			 var node = areaTree.getNodeByTId(vm.area.tId);
			 var pnode = areaTree.getNodesByParam('id',vm.area.pid);
			 node = vm.area;
			 areaTree.updateNode(node);	
			 areaTree.moveNode(pnode[0],node,'inner');
		 }else if(type=='a'){
			 var pnode = areaTree.getNodesByParam('id',vm.area.pid);
			 areaTree.addNodes(pnode[0],vm.area);
		 }else if(type=='d'){
			 var node = areaTree.getNodeByTId(vm.area.tId);
			 areaTree.removeNode(node);
		 }
		 
		 resetData();
	 }
	 
	 function resetData(){
		 vm.deptIds=[];
		 deptTree.checkAllNodes(false);
		 vm.area={
			 oldId:'',
			 abd_cus_number:loginUser.cusNumber,
			 abd_area_type:'',
			 abd_area_level:'',
			 id:'',
			 name:'',
			 pid:'',
			 pname:'',
			 abd_2dmap_id:'',
			 abd_3dmap_id:'',
			 abd_seq:'',
			 abd_crte_user_id:loginUser.userId,
			 abd_updt_user_id:loginUser.userId,
			 dept_ids:'',
			 dept_names:'',
			 isParent:false
		 }
	 }
	 
	 /**
	  * 初始化左侧区域树
	  * @returns
	  */
	 function initAreaTree(){
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
					if(treeNode.isParent){
						vm.$set('area.pname',treeNode.name);
						vm.$set('area.pid',treeNode.id);
					}
				},
				onDblClick:function(event,treeId,treeNode){
					vm.area.pname = '';
					if(!treeNode || treeNode.id == loginUser.cusNumber){
						return;
					}
					vm.$set('area',treeNode);
					vm.$set('area.oldId',treeNode.id);
					vm.$set('area.pname',treeNode.getParentNode().name);
					
					if(vm.area.dept_ids){
						var deptIds = vm.area.dept_ids.split(',');
						vm.deptIds = deptIds;
						deptTree.checkAllNodes(false);
						var depts = deptTree.transformToArray(deptTree.getNodes());
						for(var i=0;i<vm.deptIds.length;i++){
							for(var j=0;j<depts.length;j++){
								if(vm.deptIds[i] == depts[j].id){
									deptTree.checkNode(depts[j]);
								}
							}
						}
					}
				}
			}
		}
		db.query({
			request: {
				sqlId: 'basedata_select_area_tree',
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				vm.areaData = data;
				data.push({
					id:loginUser.cusNumber,
					name:loginUser.cusNumberName,
					pid:0,
					isParent:true
				});
				areaTree = $.fn.zTree.init($('#areaTree'),setting,data);
				areaTree.expandNode(areaTree.getNodes()[0],true);
			},
			error: function (code, msg) {}
		});
	 }
	 /**
	 * 初始化部门树
	 * @returns
	 */
	function initDeptTree(){
		var s={
			data:{
				simpleData:{
					enable:true,
					pIdKey:'pid'
				}
			},
			check:{
				enable:true,
				chkboxType: { "Y": "", "N": "" }
			},
			callback:{
				beforeCheck:function(treeId,treeNode){
//					console.log(treeNode.id);
//					console.log(vm.area.dept_ids);
//					if(vm.area.dept_ids){
//						if(vm.area.dept_ids.indexOf(treeNode.id) == -1){
//							message.alert('请在父级区域所属部门【'+vm.area.dept_names+'】中选择');
//							return false;
//						}
//					}
				},
				onCheck:function(event,treeId,treeNode){
					vm.area.dept_names='';
					vm.area.dept_ids='';
					vm.deptIds=[];
					var chks = deptTree.getCheckedNodes(true);
					for(var i=0;i<chks.length;i++){
						vm.area.dept_names+=chks[i].name+',';
						vm.area.dept_ids+=chks[i].id+',';
						vm.deptIds.push(chks[i].id);
					}
					vm.area.dept_ids = vm.area.dept_ids.substring(0,vm.area.dept_ids.length-1);
					vm.area.dept_names = vm.area.dept_names.substring(0,vm.area.dept_names.length-1);
				}
			}
		}
		db.query({
			request: {
				sqlId: "select_org_dept",
				whereId: 0,
				params: [loginUser.cusNumber]
			},
			success: function (data) {
				if(data.length>0){
					data[0].nocheck=true;
					deptTree = $.fn.zTree.init($('#deptTree'),s,data);			
					deptTree.expandAll(true);					
				}
			},
			error: function (code, msg) {
			}
		});
	}
	initAreaTree();
	initDeptTree();
});