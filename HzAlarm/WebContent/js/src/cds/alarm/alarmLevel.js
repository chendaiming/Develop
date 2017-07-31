define(function(require){
	var vue = require('vue'),
		db = require('frm/hz.db'),
		select = require('frm/select'),
		user = require('frm/loginUser'),
		ztree = require('ztree'),
		datepicker = require('frm/datepicker'),
		treeUtil = require('frm/treeUtil'),
		message = require('frm/message');
	var hzEvent = require('frm/hz.event');

	var cameraTree,doorTree,alarmTree,powerTree;
	var alarmLevels=[];
	var nowDate = new Date();
	var YYYY = nowDate.getFullYear();
	var MM = nowDate.getMonth() + 1;
	var DD = nowDate.getDate();

	var setting = {
		data:{simpleData:{enable:true,pIdKey:'pid',idKey:'rid'}},
		check:{enable:true},
		callback:{
			onCheck:function(event,treeId,treeNode){
				if(treeNode.checked){
					loadLevelsByDeciceId(treeNode.id,'push');					
				}else{
					for(var i=0;i<alarmLevels.length;i++){
						if(treeNode.id == alarmLevels[i].lhs_alertor_id){
							alarmLevels.splice(i,1); break;
						}
					}
				}
			},
			onDblClick:function(event,treeId,treeNode){
				if(!treeNode || treeNode.isParent){
					return;
				}
				$.fn.zTree.getZTreeObj(treeId).checkAllNodes(false);
				$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode,true,false,true);
				loadLevelsByDeciceId(treeNode.id,'query');
			}
		}
	};

	var defConfig = {
		'lhs_cus_number': user.cusNumber,
		'lhs_start_time': YYYY + '-' + MM + '-' + DD,
		'lhs_end_time': '9999-' + MM + '-' + DD,
		'lhs_level': 1,
		'lhs_receive_dept_id': user.deptId,
		'lhs_handle_btime': '00:00:00',
		'lhs_handle_etime': '23:59:59',
		'notice_dept_ids':[],
		'lhs_alarm_type':''
	};
	var vm = new vue({
		el:'body',
		data:{
			expandSearchMenu:false,
			isExpand:false,
			alarmType:[
				{id:'1',tip:'摄像机',code:'ALARM_TYPE_NAME_1'},
				{id:'2',tip:'门禁',code:'ALARM_TYPE_NAME_2'},
				{id:'3',tip:'对讲',code:'ALARM_TYPE_NAME_3'},
				{id:'4',tip:'广播',code:'ALARM_TYPE_NAME_4'},
				{id:'6',tip:'网络报警器',code:'ALARM_TYPE_NAME_6'},
				{id:'7',tip:'高压电网',code:'ALARM_TYPE_NAME_7'},
				{id:'15',tip:'RFID基站',code:'ALARM_TYPE_NAME_15'},
				{id:'17',tip:'无线主机报警',code:'ALARM_TYPE_NAME_17'}
			],
			alarmTypeTip:'摄像机',
			alarmTypeCode:'ALARM_TYPE_NAME_1',
			searchTree:'',
			deviceTypes:[],
			checkdTypes:[],//选中的设备类型
			ztreeDataMap:{},//存放所有tree对应的 data key 为报警设备id
			ALARM_DEVICE_TYPE:'1',
			isset:[],
			sqlIds: {
				'1': 'select_camera_alarm',								// 摄像机：智能分析
				'2': 'select_door_alarm',								// 门禁
				'3': 'select_talkback_alarm_for_alarm_level',			// 对讲机
				'4': 'select_broadcast_alarm_for_alarm_level',			// 广播
				'6': 'select_network_alarm',							// 网络报警器
				'7': 'select_power_alarm',								// 高压电网
				'15': 'select_rfid_alarm_for_alarm_level',				// RFID基站
				'17': 'select_wireless_master_alarm_for_alarm_level'	// 无线报警主机
			},

			checkedAlarmDevices:[],//左侧树 所有选中的报警设备
			alarmAll:[{id:'0',name:'全部'}],

			levels:[defConfig]
		},
		watch:{
			'isset':function(){
				filterBySet();
			},
			'searchTree':function(){
				searchTree();
			},
			'ALARM_DEVICE_TYPE':function(){
				for(var i = 0; i < vm.levels.length; i++){
					vm.levels[i].lhs_alarm_type = '';
				}
				for(var i = 0; i < vm.alarmType.length; i ++){
					if(vm.ALARM_DEVICE_TYPE == vm.alarmType[i].id){
						vm.alarmTypeTip = vm.alarmType[i].tip;
						vm.alarmTypeCode = vm.alarmType[i].code;
						break;
					}
				}
			}
		},
		methods:{
			expand:function(){this.isExpand=!this.isExpand},
			expandMenu:function(){this.expandSearchMenu=!this.expandSearchMenu},
			setSearchType:function(d){this.searchType = d.id;this.searchTypeName = d.name;this.expandSearchMenu = false;},
			reset:function(){resetData()},
			isCheck:function(type){return isExist(type)},
			addLevel:function(){addLevel()},
			removeLevel:function(l){this.levels.$remove(l)},
			saveAlarmLevel:function(){
				saveAlarmLevels();
			}
		}
	});

	function saveAlarmLevels(){
		getCheckedAlarmDevices();
		var delAlarmLevelParams=[];
		var delAlarmLevelNoticeDeptParams=[];
		var insertAlarmLevelNoticeDeptParams=[];
		var realSubmitLevels= [];//真正提交到后台的 新增报警分级参数数组
		
		if(vm.checkedAlarmDevices.length == 0){
			message.alert('请勾选左侧树上的报警设备');
			return;
		}
		
		for(var j =0,k=vm.checkedAlarmDevices.length;j<k;j++){
			var deviceId = vm.checkedAlarmDevices[j].deviceId;
			var deviceType = vm.checkedAlarmDevices[j].deviceType;
			
			delAlarmLevelParams.push({
				cusNumber:user.cusNumber,
				lhs_alertor_id:deviceId
			});
			for(i=0;i<vm.levels.length;i++){
				realSubmitLevels.push({
					'lhs_cus_number': user.cusNumber,
					'lhs_alertor_id': deviceId,//报警器编号
					'lhs_start_time': vm.levels[i].lhs_start_time + ' 00:00:00',
					'lhs_end_time': vm.levels[i].lhs_end_time + ' 23:59:59',
					'lhs_level': vm.levels[i].lhs_level,
					'lhs_dvc_type': deviceType,//报警器类别对应 tree上的 type字段
					'lhs_receive_dept_id': vm.levels[i].lhs_receive_dept_id,
					'lhs_seq': 0,
					'lhs_crte_user_id': user.userId,
					'lhs_updt_user_id': user.userId,
					'notice_dept_ids': vm.levels[i].notice_dept_ids,
					'lhs_handle_btime': vm.levels[i].lhs_handle_btime,
					'lhs_handle_etime': vm.levels[i].lhs_handle_etime,
					'lhs_alarm_type':vm.levels[i].lhs_alarm_type=='0'?'':vm.levels[i].lhs_alarm_type
				});				
			}
		}
		
		for(var h=0;h<alarmLevels.length;h++){
			delAlarmLevelNoticeDeptParams.push({
				cusNumber:user.cusNumber,
				lhs_id:alarmLevels[h].lhs_id
			});
		}
		var msg;
		for(var i=0;i<realSubmitLevels.length;i++){
			if(!realSubmitLevels[i].lhs_start_time){
				msg = "开始时间不能为空";
				break;
			}
			if(!realSubmitLevels[i].lhs_end_time){
				msg = "结束时间不能为空";
				break;
			}
			if(!realSubmitLevels[i].lhs_receive_dept_id){
				msg = "请选择接警部门";
				break;
			}
			if(!realSubmitLevels[i].lhs_level){
				msg = "请选择报警等级";
				break;
			}
			if(realSubmitLevels[i].lhs_end_time <= realSubmitLevels[i].lhs_start_time){
				msg = "第"+(i+1)+"个的报警等级开始时间小于结束时间";
				break;
			}
		}
		if(msg){
			message.alert(msg);
			return;
		}

		if(delAlarmLevelParams.length>0){
			db.updateByParamKey({
				request:[{
					sqlId:'delete_alarm_level',
					params:delAlarmLevelParams
				}],
				success:function(data){}
			});
		}
		
		db.updateByParamKey({
			request:[{
				sqlId:'insert_alarm_level',
				params:realSubmitLevels
			}],
			success:function(data){
				var seqList = data.data[0].seqList;
				for(var i=0;i<realSubmitLevels.length;i++){
					var noticeDept = realSubmitLevels[i].notice_dept_ids; 
					for(var j=0;j<noticeDept.length;j++){
						insertAlarmLevelNoticeDeptParams.push({
							anr_cus_number:user.cusNumber,
							anr_handle_id:seqList[i],
							anr_notice_dept_id:noticeDept[j],
							anr_seq:0
						});				
					}
				}
				if(delAlarmLevelNoticeDeptParams.length>0){
					db.updateByParamKey({
						request:[{
							sqlId:'delete_alarm_level_notice_dept',
							params:delAlarmLevelNoticeDeptParams
						}],
						success:function(data){}
					});
				}
				db.updateByParamKey({
					request:[{
						sqlId:'insert_alarm_level_notice_dept',
						params:insertAlarmLevelNoticeDeptParams
					}],
					success:function(){}
				});
				reset();
			}
		});
	}
	
	function reset(){

		message.alert('保存成功');
		initTrees();
		filterBySet();
		resetData();
	}

	function resetData(){
		resetLevels();
		vm.checkedAlarmDevices=[];
		alarmLevels=[];
		clearTreeChecked();
	}
	function resetLevels(){
		vm.levels = [{
			'lhs_cus_number': user.cusNumber,
			'lhs_start_time': YYYY + '-' + MM + '-' + DD,
			'lhs_end_time': '9999-' + MM + '-' + DD,
			'lhs_level': 1,
			'lhs_receive_dept_id': user.deptId,
			'lhs_handle_btime': '00:00:00',
			'lhs_handle_etime': '23:59:59',
			'notice_dept_ids':[],
			'lhs_alarm_type':''
		}];
	}

	function clearTreeChecked(){
		for(var i=0;i<vm.deviceTypes.length;i++){
			var tree = getZtreeById(vm.deviceTypes[i].id);
			if(tree){
				tree.checkAllNodes(false);				
			}
		}
	}

	/**
	 * 获取左侧树所有勾选的 报警设备
	 */
	function getCheckedAlarmDevices(){
		vm.checkedAlarmDevices = [];
		for(var i=0;i<vm.deviceTypes.length;i++){
			var tree = getZtreeById(vm.deviceTypes[i].id);
			if(tree){
				var checkeds = tree.getCheckedNodes(true);
				for(var j=0;j<checkeds.length;j++){
					vm.checkedAlarmDevices.push({
						deviceId:checkeds[j].id,
						deviceType:checkeds[j].type
					});
				}
			}
		}
	}
	
	/**
	 * 根据设备id 查询报警分级列表
	 * @returns
	 */
	function loadLevelsByDeciceId(deviceId,option){
		db.query({
			request: {
				sqlId:'select_alarm_level_ids',
				whereId:0,
				params:{cusNumber:user.cusNumber,lhs_alertor_id:deviceId}
			},
			success: function (data) {
				if(option == 'push'){
					for(var i=0;i<data.length;i++){
						alarmLevels.push(data[i]);					
					}					
				}else if(option == 'query'){
					vm.levels =[];
					var deptIds = [];
					if(data.length == 0){
						resetLevels();
					}else{
						for(var i=0;i<data.length;i++){
							if(data[i].dept_ids){
								deptIds = data[i].dept_ids.split(',');
							}
							data[i].notice_dept_ids = deptIds;
							var type = data[i].lhs_alarm_type;
							data[i].lhs_alarm_type = type == ''?'0':type;
							vm.levels.push(data[i]);
						}
					}
				}
			}
		});
	}

	/**
	 * 初始化所有树
	 * @returns
	 */
	function initTrees(){
		for(var i=0;i<vm.deviceTypes.length;i++){
			var deviceType = vm.deviceTypes[i].id;
			var sqlId = vm.sqlIds[deviceType];
			if (sqlId) {
				var ztreeData = [{
					id:user.cusNumber,
					rid:user.cusNumber,
					name:vm.deviceTypes[i].name,
					pid:0,
					isParent:true,
					nocheck:'true',
					open:true
				}];
				db.query({
					async:false,
					request: {
						sqlId:sqlId,
						orderId:0,
						params:{cusNumber:user.cusNumber,deviceType:deviceType}
					},
					success: function (data) {
						for(var k=0,j=data.length;k<j;k++){
							ztreeData.push(data[k]);
						}
						vm.ztreeDataMap[''+deviceType] = ztreeData;
						$.fn.zTree.init($('#alarm_'+deviceType),setting,ztreeData);
					}
				});
			}
		}
	}
	
	/**
	 * 加载报警设备类型
	 * @returns
	 */
	function loadDeviceTypes(){
		db.query({
			request: {
				sqlId:'select_constant_bycode',
				whereId:0,
				params:['LDR_ALERTOR_TYPE']
			},
			success: function (data) {
				var list = [];

				// 标记不支持的报警设备
				for(var i = 0; i < data.length; i++) {
					// 过滤没有配置的报警设备类型
					if (vm.sqlIds[data[i].id]) {
						list.push(data[i]);
					} else {
//						data[i].disabled = true;
//						data[i].tip = '暂不支持该设备的报警预案配置!';
					}
				}

				vm.deviceTypes = list;
				vm.checkdTypes.push(data[0]);
				vue.nextTick(function(){
					initTrees();					
				});
			}
		});
	}
	
	function addLevel(){
		vm.levels.push({
			lhs_cus_number:user.cusNumber,
			lhs_start_time:'',
			lhs_end_time:'',
			lhs_level:'',
			lhs_receive_dept_id:'',
			notice_dept_ids:[]
		});
	}
	
	function searchTree(){
		for(var z in vm.ztreeDataMap){
			var tree = getZtreeById(z);
			if(tree){
				var datas =vm.ztreeDataMap[z];
				var filterDatas = [];
				if(vm.isset.length==1 && vm.isset[0] == '1'){
					for(var j=0,k=datas.length;j<k;j++){
						if(datas[j].nocheck == 'true' || (datas[j].nocheck == 'false' && datas[j].levelids)){
							filterDatas.push(datas[j]);
						}
					}
				}else if(vm.isset.length==1 && vm.isset[0] == '2'){
					for(var j=0,k=datas.length;j<k;j++){
						if(datas[j].nocheck == 'true' || (datas[j].nocheck == 'false' && !datas[j].levelids)){
							filterDatas.push(datas[j]);
						}
					}
				}else{
					filterDatas = datas;
				}
				treeUtil.searchTree('name',vm.searchTree,'alarm_'+z,filterDatas,setting);
			}
		}
	}
	
	/**
	 * 已设置，未设置
	 * @returns
	 */
	function filterBySet(){
		for(var z in vm.ztreeDataMap){
			var tree = getZtreeById(z);
			if(tree){
				var datas =vm.ztreeDataMap[z];
				var filterDatas = [];
				if(vm.isset.length==1 && vm.isset[0] == '1'){
					for(var j=0,k=datas.length;j<k;j++){
						if(datas[j].nocheck == 'true' || (datas[j].nocheck == 'false' && datas[j].levelids)){
							filterDatas.push(datas[j]);					
						}
					}	
				}else if(vm.isset.length==1 && vm.isset[0] == '2'){
					for(var j=0,k=datas.length;j<k;j++){
						if(datas[j].nocheck == 'true' || (datas[j].nocheck == 'false' && !datas[j].levelids)){
							filterDatas.push(datas[j]);			
						}
					}
				}else{
					filterDatas = datas;
				}
				$.fn.zTree.init($('#alarm_'+z),setting,filterDatas);
			}
		}
	}
	
	/**
	 * 判断是否存在
	 * @returns
	 */
	function isExist(id){
		if(vm.checkdTypes.id == id){
			showAlarmDeviceType(id);
			return true;
		}
		return false;
	}

	function showAlarmDeviceType(id){
		vm.ALARM_DEVICE_TYPE = id;
	}
	
	function getZtreeById(id){
		return $.fn.zTree.getZTreeObj("alarm_"+id);
	}
	
	function init(){
		// 获取各个模块的关于报警等级设置的SQLID
		var data = hzEvent.call('alarm.main.data') || {};
		var sqlIds = data.alarmLevelSqlIds;
		if (sqlIds) {
			for(var key in sqlIds) {
				vm.sqlIds[key] = sqlIds[key];
			}
		}

		loadDeviceTypes();
	}
	
	init();
});
