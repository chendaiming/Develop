/*define(['jquery','vue','frm/hz.db','frm/message','frm/loginUser', 'frm/hz.tree'],
function($,vue,db,message,user, hzTree){*/
	

define(function(require) {
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var ztree = require('ztree');
	var vue = require('vue');
//	var select = require('frm/select');
	var message = require('frm/message');
	var treeUtil = require('frm/treeUtil');
	var tree = require('frm/treeSelect');
	var user = require('frm/loginUser');
	var validate = require('frm/validate');
	var hzTree = require('frm/hz.tree');
	var clickTimerId = null;
	var modelTree ;
	
	
	var vm = new vue({
		el:'body',
		data:{
			path:'mkjy',
			modelLog:'暂无记录日志',
			success:0,	//导入记录
			error:0,	//导入失败记录
			updateSuccess:0,	//更新记录
			updateError:0,		//更新失败记录
			modelTreeData:[],	
			cusNumber:user.cusNumber,
			result:[],
			acceptDeptList:[],
			model:{
			   mfi_cus_number:user.cusNumber,
			   mfi_file_id:'',		//id
			   mfi_file_pid:'',		//文件父id
			   mfi_file_name:'',	//文件名称
			   mfi_file_pName:'',   //文件父名称
			   mfi_file_title:'',	//标题（别名，暂时与文件名称相同）
			   mfi_file_path:'',	//文件全路径
			   mfi_file_type:'',	//1.文件夹、2.OBJ文件';
			   mfi_file_flag:'',	//0.常规模型、1.外模型、2.内模型';
			   mfi_file_attr:'',	//存放模型文件的配置信息,可为空
			   mfi_file_order:'0',	//排序，默认给mfi_file_id 
			   mfi_create_uid:user.userId,
			   mfi_update_uid:user.userId,
			   mfi_dept_id: '',
			   mfi_load_flag: '1'
			},
			readFlag:true,
			treeData: [],
			searchVal: '',
			treeIndex:""
		},
		computed:{
			mfi_file_title() {
				return this.model.mfi_file_title;
			},
			mfi_file_type() {
				return this.model.mfi_file_type;
			},
			mfi_file_flag(){
				return this.model.mfi_file_flag;
			},
			mfi_file_attr(){
				return this.model.mfi_file_attr;
			},
			mfi_file_order(){
				return this.model.mfi_file_order;
			},
			mfi_dept_id(){
				return this.model.mfi_dept_id;
			},
			mfi_load_flag(){
				return this.model.mfi_load_flag;
			}
			
		},
		watch:{
			mfi_file_title : function(val,oldVal){
				if(vm.treeIndex != "" || vm.treeIndex === 0){
					vm.treeData[vm.treeIndex].title = val;
				}
			},
			mfi_file_type : function(val,oldVal){
				if(vm.treeIndex != "" || vm.treeIndex === 0){
					vm.treeData[vm.treeIndex].type = val;
				}
			},
			mfi_file_flag :function(val,oldVal){
				if(vm.treeIndex != "" || vm.treeIndex === 0){
					vm.treeData[vm.treeIndex].flag = val;
				}
			},
			mfi_file_attr:function(val,oldVal){
				if(vm.treeIndex != "" || vm.treeIndex === 0){
					vm.treeData[vm.treeIndex].attr = val;
				}
			},
			mfi_file_order:function(val,oldVal){
				if(vm.treeIndex != "" || vm.treeIndex === 0){
					var reg = /^\+?[0-9][0-9]*$/;
					if(!reg.test(vm.model.mfi_file_order)){
						message.alert("文件"+vm.model.mfi_file_name+"的排序不正确，请输入小于3个数字,且不为空");
						vm.model.mfi_file_order='0'; 
						return false;
					}else{
						vm.treeData[vm.treeIndex].order = val;
					}
					
				}
			},
			mfi_dept_id:function(val,old){
				if(vm.treeIndex != "" || vm.treeIndex === 0){
					vm.treeData[vm.treeIndex].dept_id = val;
				}
			},
			mfi_load_flag:function(val,old){
				if(vm.treeIndex != "" || vm.treeIndex === 0){
					vm.treeData[vm.treeIndex].load_flag = val;
				}
			}
		},
		methods:{
			save:function(){		//保存
				
				vm.convertModel(vm.treeData);
			},
			requestModel:function(){	//请求获取文件数据
				$.ajax({
					url: mapBasePath + 'map/getModelData',
					data:{path:vm.path},
					success:function(data){
						data = JSON.parse(data);
						if(!data || data.length <= 0){
							vm.print("获取模型数据失败！！！",false);
						}else{
							vm.print("获取模型数据成功！！！",true);
							vm.convertModel(data);
						}
					},
					error:function(req,status,msg){
						message.alert(msg);
					}
				})
			},
			convertModel:function (data) {		//转换数据
				
				
				hzTree.toTree(data, {
					formatter: function (node) {
						// TODO: 格式化数据
					}, 
					success: function (nodes, maps) {
						//console.log('toTree --> ' + JSON.stringify(nodes));
						vm.modelTreeData = nodes;
					}
				});
				if(!vm.modelTreeData || vm.modelTreeData.length <= 0){
					vm.modelLog += "转换树节点数据失败！！！";
					return;
				}
				//插入数据
				vm.insertModel(0,[vm.modelTreeData[0]]);
				vm.print("模型导入结束！！！",true);
				vm.print("导入成功:"+vm.success+" 导入失败:"+vm.error,true);
				vm.print("更新成功:"+vm.updateSuccess+" 更新失败:"+vm.updateError,true);
				vm.success = vm.updateSuccess = vm.error = vm.updateError = 0;
			},
			joinModel:function(obj){		//组装数据
				var modelData = JSON.parse(JSON.stringify(vm.model));
				modelData.mfi_file_id = obj.id;
				modelData.mfi_file_pid = obj.pid;
				modelData.mfi_file_name = obj.name;
				modelData.mfi_file_title = obj.attributes.title || obj.name;
				modelData.mfi_file_path = obj.attributes.path || '';
				modelData.mfi_file_type = obj.attributes.type || 1;
				modelData.mfi_file_order = obj.attributes.order.toString() || 0;
				modelData.mfi_file_flag = obj.attributes.flag || 0;
				modelData.mfi_load_flag = obj.attributes.load_flag != 0 ? 1 : 0;
				modelData.mfi_dept_id = obj.attributes.dept_id || '';
				modelData.mfi_file_attr = obj.attributes.attr || '';
				return modelData;
			},
			insertModel:function (pid,childrens) {	//添加数据
				for(var i = 0; i < childrens.length; i++){
					var obj = childrens[i];
					obj.pid = pid;
					//获取入库数据
					var modelData = vm.joinModel(obj);
					
					//添加数据
					var sqlId = 'insert_model_data';
					//返回查询数据
					vm.checkModel(obj.attributes.path);
					
					if(vm.result && vm.result.length > 0){
						sqlId = 'update_model_data';
						modelData.mfi_file_id = vm.result[0].mfi_file_id;
					}
					
						db.updateByParamKey({
							request: [{
								sqlId:sqlId,
								whereId:0,
								params:modelData
							}],
							async:false,
							success: function (data) {
								var tid = 0;
								if(sqlId.indexOf('insert') != -1){
									vm.print("导入成功：<br>"+modelData.mfi_file_path,true);
									tid = data.data[0].seqList[0];
									
									vm.success++;
								}else{
									vm.print("更新成功：<br>"+modelData.mfi_file_path,true);
									tid = modelData.mfi_file_id;
									vm.updateSuccess++;
								}
								//判断是否有子节点
								if(obj.children && obj.children.length > 0){
									vm.insertModel(tid,obj.children);
								}
							},
							error: function (code, msg) {
								if(sqlId.indexOf('insert') != -1){
									vm.print("导入失败：<br>"+modelData.mfi_file_path,false);
									vm.error++;
								}else{
									vm.print("更新失败：<br>"+modelData.mfi_file_path,false);
									vm.updateError++;
								}
								//判断是否有子节点
								if(obj.children && obj.children.length > 0){
									vm.insertModel(modelData.mfi_file_id,obj.children);
								}
							}
						})
					
				}
				vm.readFlag = true;
			},
			checkModel:function(path){		//检查模型是否唯一
				db.query({
					request: {
						sqlId: 'select_model_data_by_path',
						whereId: 0,
						params: {'mfi_cus_number':user.cusNumber,'mfi_file_path':path}
					},
					async:false,
					success: function (data) {
						vm.result = data;
					},
					error: function (code, msg) {
						console.log(msg);
						vm.result = [];
					}
				});
			},
			print:function(msg,flag){	//打印插入记录
				if(!flag){
					vm.modelLog += '<p style="color:#ff6f6f">'+msg+'</p>';
				}else{
					vm.modelLog += '<p>'+msg+'</p>';
				}
			},
			readFileName:function(){
				if(!vm.path){
					message.alert("请输入导入文件路径名");
					return false;
				}
				vm.readFlag = false;
				vm.model.mfi_file_id='';		//id
				vm.model.mfi_file_pid='';		//文件父id
				vm.model.mfi_file_name='';	//文件名称
				vm.model.mfi_file_pName='';   //文件父名称
				vm.model.mfi_file_title='';	//标题（别名，暂时与文件名称相同）
				vm.model.mfi_file_path='';	//文件全路径
				vm.model.mfi_file_type='';	//1.文件夹、2.OBJ文件';
				vm.model.mfi_file_flag='';	//0.常规模型、1.外模型、2.内模型';
				vm.model.mfi_file_attr='';	//存放模型文件的配置信息,可为空
				vm.model.mfi_file_order='0';	//排序，默认给mfi_file_id
				vm.model.mfi_dept_id='';
				$("#input").val('');
				loadTree();
			}
		}
	})
	
	function loadTree() {
		treeLoading(true, '正在加载数据...');
		$.ajax({
			url: mapBasePath + 'map/getModelData',
			data:{path:vm.path},
			success:function(data){
				data = JSON.parse(data);
				if(!data || data.length <= 0){
					vm.print("获取模型数据失败！！！",false);
				}else{
					vm.print("获取模型数据成功！！！",true);
					vm.treeData = data;
					
					modelTree = $.fn.zTree.init($('#modelFileInfoTree'), setting, data);
				}
				$("#input").keyup(function(){
					treeUtil.searchTree("name",this.value,"modelFileInfoTree",data,setting);
				});
			},
			error:function(req,status,msg){
				message.alert(msg);
			}
		})
		
	}
	var setting = {
			view: {dblClickExpand: false},
			data: {
				simpleData: {
					enable: true,
					idKey: 'id',
					pIdKey: 'pid'
				}
			},
			callback: {
				// 单机选择父类
				onClick: function(event, treeId, treeNode) {
					
				},
				// 双击查看编辑
				onDblClick: function(event, treeId, treeNode) {
					/*var id = treeNode.tId;*/
					var num = parseInt(treeNode.tId.split("_")[1])-1;
					var list = vm.treeData[num];
					vm.treeIndex = num;
					vm.model.mfi_file_title = list.title;//标题（别名，暂时与文件名称相同）
					vm.model.mfi_file_name = list.name;	//文件名称
					vm.model.mfi_file_path = list.path;	//文件全路径
					vm.model.mfi_file_type = list.type;	//1.文件夹、2.OBJ文件';
					vm.model.mfi_file_flag = list.flag;	//0.常规模型、1.外模型、2.内模型';
					vm.model.mfi_file_attr = list.attr;	//存放模型文件的配置信息,可为空
					vm.model.mfi_file_order = list.order;
					if(list.dept_id){
						vm.model.mfi_dept_id = list.dept_id;
					}else{
						vm.model.mfi_dept_id = '';
						
					}
					if(list.load_flag){
						vm.model.mfi_load_flag = list.load_flag;
					}else {
						vm.model.mfi_load_flag = '1';
					}
					
//					vm.model.mfi_dept_id = '';
					if(treeNode.getParentNode()){
						vm.model.mfi_file_pName = treeNode.getParentNode().name;
					}
					
					
				}
			}
		};
	
	/*
	 * 加载效果处理
	 */
	function treeLoading (visible, msg) {
		$('div.no-tree').toggle(visible);
		$('div.dis-tab div').html(msg);
	}
	/*
	 * 初始化数据
	 */
	function initParams () {
		return {
		   mfi_cus_number:user.cusNumber,
		   mfi_file_id:'',		//id
		   mfi_file_pid:'',		//文件父id
		   mfi_file_name:'',	//文件名称
		   mfi_file_title:'',	//标题（别名，暂时与文件名称相同）
		   mfi_file_path:'',	//文件全路径
		   mfi_file_type:'',	//1.文件夹、2.OBJ文件';
		   mfi_file_flag:'',	//0.常规模型、1.外模型、2.内模型';
		   mfi_file_attr:'',	//存放模型文件的配置信息,可为空
		   mfi_file_order:'',	//排序，默认给mfi_file_id
		   mfi_create_uid:user.userId,
		   mfi_update_uid:user.userId
		};
	}
	/*
	 * 重置数据
	 */
	function reset () {
		vm.params = initParams();
	}
	
	
	/*
	 * 加载详情
	 */
	function loadDetail (groupId) {
		var num = perseInt(groupId.split("_")[1]);
		
		
	}
	/*
	 * 查询会员信息
	 */
	function queryUserName(id){
		var userData;
		db.query({
			request:{
				sqlId:'query_user_info_by_id',
				whereId:0,
				params:[user.cusNumber,id]
			},
			async:false,
			success:function(data){
				userData = data[0];
			},
			error:function(code,msg){
				message.alert(msg);
			}
		})
		return userData;
	}
	
	
	
	
})