/**
 * Created by chendm on 2017/3/30 16:02
 */
define(['vue','hz/map/map.handle','frm/loginUser','frm/message','frm/hz.db','frm/treeUtil','frm/hz.event','frm/select'],
    function(vue,mapHandle,user,message,db,treeUtil,hzEvent,select){

    var Track = mapHandle.hzThree.Track;
    var pointTree;
    var treeSetting = {
        data:{
            simpleData:{
                enable:true,
                pIdKey:'pid'
            }
        },
        path:'../../../',
        check:{enable:true},
        callback:{
            onDblClick:function(event,treeId,treeNode){
                if(!treeNode || treeNode.nocheck){
                    return;
                }
                var viewPoint = {
                    posX:treeNode.v_pos_x,
                    posY:treeNode.v_pos_y,
                    posZ:treeNode.v_pos_z,
                    rotX:treeNode.v_rot_x,
                    rotY:treeNode.v_rot_y,
                    rotZ:treeNode.v_rot_z,
                    tarX:treeNode.v_tar_x,
                    tarY:treeNode.v_tar_y,
                    tarZ:treeNode.v_tar_z
                };
                mapHandle.location(treeNode.getParentNode().id.replace('v_',''), !viewPoint.posX ? '' : viewPoint);
            },
            beforeCheck:function(treeId,treeNode){
                var isok = true;
                if(!treeNode.checked){
                    if(vm.rlanWith == 1){
                        for(var i=0;i<vm.endChecked.length;i++){
                            if(vm.endChecked[i] == treeNode.id){
                                isok = false;
                                message.alert("终点名称中已关联该设备,不能重复");
                                break;
                            }
                        }
                    }else if(vm.rlanWith == 2){
                        for(var i=0;i<vm.startChecked.length;i++){
                            if(vm.startChecked[i] == treeNode.id){
                                isok = false;
                                message.alert("起点名称中已关联该设备,不能重复");
                                break;
                            }
                        }
                    }
                }
                return isok;
            },
            onCheck:function(event,treeId,treeNode){
                if(treeNode.checked){
                    if(vm.rlanWith == 1){
                        vm.startChecked.push(treeNode.id+'');
                        vm.startNames.push(treeNode.name);
                        vm.startType.push(treeNode.id+'_'+treeNode.type);
                    }else if(vm.rlanWith == 2){
                        vm.endChecked.push(treeNode.id+'');
                        vm.endNames.push(treeNode.name);
                        vm.endType.push(treeNode.id+'_'+treeNode.type);
                    }
                }else{
                    if(vm.rlanWith == 1){
                        vm.startChecked.$remove(treeNode.id+'');
                        vm.startNames.$remove(treeNode.name);
                        vm.startType.$remove(treeNode.id+'_'+treeNode.type);
                    }else if(vm.rlanWith == 2){
                        vm.endChecked.$remove(treeNode.id+'');
                        vm.endNames.$remove(treeNode.name);
                        vm.endType.$remove(treeNode.id+'_'+treeNode.type);
                    }
                }
            }
        }
    }

    var vm =new vue({
        el:'body',
        data:{
            isView:false,//是否在预览
            isPruse:false,
            searchTree:'',
            treeData:[],
            pointList:[],
            startChecked:[],
            startNames:[],
            endNames:[],
            endChecked:[],
            startType:[],
            endType:[],
            rlanWith:0,//当前是关联哪个起点
            track:{
                omg_cus_number:user.cusNumber,
                omg_id:'',
                omg_origin_name:'',
                omg_destination_name:'',
                omg_remark:'',
                omg_create_uid:user.userId,
                omg_update_uid:user.userId,
                omg_view_id: 0,
                omg_pos_x: 0,
                omg_pos_y: 0,
                omg_pos_z: 0,
                omg_rot_x: 0,
                omg_rot_y: 0,
                omg_rot_z: 0,
                omg_tar_x: 0,
                omg_tar_y: 0,
                omg_tar_z: 0
            }
        },
        watch:{
            'searchTree':function(){
                treeUtil.searchTree('name',this.searchTree,'rlanDevice',vm.treeData,treeSetting);
            },
            'rlanWith':function(){
                this.showTree(this.rlanWith);
            }
        },
        methods:{
            save:function(){
                var me=this;
                var routeLists = Track.getRouteList();
                if(routeLists.length>0){
                    me.pointList = 	routeLists  ;
                }
                if(vm.track.omg_origin_name == vm.track.omg_destination_name){
                    message.alert('起点名称不能与终点名称相同');
                    return;
                }
                if(me.pointList.length==0){
                    message.alert('请先绘制轨迹');
                    return;
                }
                if(me.pointList.length==1){
                    message.alert('点位不够无法形成轨迹路径');
                    return;
                }
                if(!me.track.omg_origin_name){
                    message.alert('请填写起点名称');
                    return;
                }
                if(!me.track.omg_destination_name){
                    message.alert('请填写终点名称');
                    return;
                }
                if(me.startChecked.length>0 && me.endChecked.length==0){
                    message.alert('起点关联设备已选择，终点关联设备不能为空');
                    return;
                }
                if(me.startChecked.length==0 && me.endChecked.length>0){
                    message.alert('终点关联设备已选择，起点关联设备不能为空');
                    return;
                }
                var point = mapHandle.getViewPoint();

                //vm.track.omg_view_id = view.id;
                vm.track.omg_pos_x = point.posX;
                vm.track.omg_pos_y = point.posY;
                vm.track.omg_pos_z = point.posZ;
                vm.track.omg_rot_x = point.rotX;
                vm.track.omg_rot_y = point.rotY;
                vm.track.omg_rot_z = point.rotZ;
                vm.track.omg_tar_x = point.tarX;
                vm.track.omg_tar_y = point.tarY;
                vm.track.omg_tar_z = point.tarZ;
                console.log(me.track);
                var sqlId = !me.track.omg_id ? 'insert_orbit_move' : 'update_track_move';
                db.updateByParamKey({
                    request: [{
                        sqlId:sqlId,
                        params:vm.track
                    }],
                    success: function (data) {
                        if(sqlId == 'insert_orbit_move'){
                            me.track.omg_id = data.data[0].seqList[0];
                        }
                        if(sqlId == 'update_track_move'){
                            db.updateByParamKey({
                                request:[{
                                    sqlId:'delete_movepoint_byomgid',
                                    params:{omg_id:me.track.omg_id}
                                }]
                            });
                            db.updateByParamKey({
                                request:[{
                                    sqlId:'delete_moverlan_byomgid',
                                    params:{omg_id:me.track.omg_id}
                                }]
                            });
                        }
                        var rlans = [];
                        var points = [];
                        for(var i=0;i<me.startChecked.length;i++){
                            for(var j=0;j<me.endChecked.length;j++){
                                rlans.push({
                                    omr_cus_number:user.cusNumber,
                                    omr_omg_id:me.track.omg_id,
                                    omr_a_dvc_type:me.startType[i].split("_")[1],
                                    omr_a_dvc_id:me.startChecked[i],
                                    omr_b_dvc_type:me.endType[j].split("_")[1],
                                    omr_b_dvc_id:me.endChecked[j]
                                });
                            }
                        }
                        for(var i=0;i<me.pointList.length;i++){
                            points.push({
                                omp_cus_number:user.cusNumber,
                                omp_omg_id:me.track.omg_id,
                                omp_pos_x:me.pointList[i].x,
                                omp_pos_y:me.pointList[i].y,
                                omp_pos_z:me.pointList[i].z,
                                omp_seq:i
                            });
                        }
                        db.updateByParamKey({
                            request: [{
                                sqlId:'insert_move_rlans',
                                    params:rlans
                            }],
                            success:function(res){}
                        });
                        db.updateByParamKey({
                            request: [{
                                sqlId:'insert_move_point',
                                params:points
                            }],
                            success:function(res){}
                        });
                        saveSuccess();
                    },
                    error: function (code, msg) {
                        if(code == '1002'){
                            message.alert('起点和终点名称已存在',4000);
                        } else {
                            message.alert(msg);
                        }
                    }
                });
            },
            startTrackPath:function(){
                startTrackPath();
            },
            showTree:function(n){
                this.rlanWith = n;
                pointTree.checkAllNodes(false);
                if(n==1){
                    for(var i=0;i<vm.startChecked.length;i++){
                        var nodeId = vm.startChecked[i];
                        pointTree.checkNode(pointTree.getNodeByParam('id',nodeId),true);
                    }
                }else if(n==2){
                    for(var i=0;i<vm.endChecked.length;i++){
                        var nodeId = vm.endChecked[i];
                        pointTree.checkNode(pointTree.getNodeByParam('id',nodeId),true);
                    }
                }
                $('#trackMove').css('width',690);
                $('.relanDevices').removeClass('hide');
                $('.relanDevices').addClass('vbox');
            },
            reset:function(){
                reset();
            },
            pruseTrackPath:function(){
                this.isPruse=!this.isPruse;
                Track.trackToggle();
            },
            stopTrackPath:function(){
                this.isView=false;
                this.isPruse = false;
                Track.stopTrack();
            }
        }
    });

    function saveSuccess(){
        message.alert('保存成功');
        hzEvent.call('trackMove.reload');

        pointTree.checkAllNodes(false);
        reset();
    }
    function reset(){
        Track.stopTrack();
        Track.clearRoute();
        pointTree.checkAllNodes(false);
        vm.pointList=[];
        vm.startChecked=[];
        vm.startNames=[];
        vm.endNames=[];
        vm.endChecked=[];
        vm.track={
            omg_cus_number:user.cusNumber,
            omg_id:'',
            omg_origin_name:'',
            omg_destination_name:'',
            omg_remark:'',
            omg_create_uid:user.userId,
            omg_update_uid:user.userId,
            omg_view_id: 0,
            omg_pos_x: 0,
            omg_pos_y: 0,
            omg_pos_z: 0,
            omg_rot_x: 0,
            omg_rot_y: 0,
            omg_rot_z: 0,
            omg_tar_x: 0,
            omg_tar_y: 0,
            omg_tar_z: 0
        }
    }
    //初始化绘制路径参数
    function initStartTrack(){
        Track.defalutY = 20;
        Track.cameraDis = 3000;
        Track.cameraHeight = 4000;
        Track.setIsEditRoute(true);
        console.log('开启轨迹绘制成功');
    }

    function startTrackPath(){
        var list = Track.getRouteList();
        if(list.length>0){
            vm.pointList = 	list  ;
        }
        if(vm.pointList.length==0){
            message.alert('请先绘制轨迹');
            return;
        }
        if(vm.pointList.length==1){
            message.alert('点位不够无法形成轨迹路径');
            return;
        }
        Track.on(mapHandle.hzThree.HzEvent.TRACK_OVER, function () {
            vm.isView=false;
            vm.isPruse = false;

            $('#centerX, #centerY').show();
        });

        _getModel(function (model) {
            $('#centerX, #centerY').hide();
            vm.isView = true;
            Track.setTrackParam({
                viewType: 3,
                model: model //mapHandle.hzThree.createSphere(100, 0xFF0000)
            });
            Track.setTrackPath(vm.pointList,1);
            hzEvent.call('trackMove.isGo');
        });
    }

    /*
     * 获取Track对象
     */
    var _modelObj = null;
    function _getModel (callback) {
        var self = this;
        if (!_modelObj) {
            mapHandle.addModel({
                'modelName': 'people_man',
                'path': basePath + 'models/people/',
                'objName': 'people_man.obj',
                'mtlName': 'people_man.mtl',
                'bornType': 'born_addModel',
                'objType': 'people_man',
                'position': {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }, function (obj) {
                obj.scale.x = 30;
                obj.scale.y = 30;
                obj.scale.z = 30;
                //obj.children[0].rotation.y = Math.PI * 0.5;

                callback(_modelObj = obj);
            });
        } else {
            callback(_modelObj);
        }
    }
    var dataList = [];
    function queryPoints(){
        db.query({
            request:{
                sqlId:'select_door_point_ztree',
                whereId:0,
                async:false,
                params:{cusNumber:user.cusNumber}
            },
            async:false,
            success:function(data){
                data.push({'id': 'v_', 'name': '门禁', 'pid': null, 'type': 2, 'icon': 0, 'cus_number': user.cusNumber, 'nocheck': 'true', 'isParent': 'true'});
                dataList = data;
            }
        });
    }

    hzEvent.on('trackMove.edit', function (data) {
        var omgId = data.omg_id;
        vm.track.omg_id = omgId;
        vm.track.omg_origin_name = data.omg_origin_name;
        vm.track.omg_destination_name = data.omg_destination_name;
        vm.track.omg_remark = data.omg_remark;
        if(omgId){
            Track.stopTrack();
            vm.rlanWith = 1;
            db.query({
                request:{
                    sqlId:'select_move_points',
                    whereId:0,
                    params:{cusNumber:user.cusNumber,omg_id:omgId}
                },
                success:function(res){
                    vm.pointList = res;
                }
            });
            db.query({
                request:{
                    sqlId:'select_move_start_rltn',
                    whereId:0,
                    params:{cusNumber:user.cusNumber,omg_id:omgId}
                },
                success:function(res){
                    vm.startChecked = [];
                    vm.startNames=[];
                    vm.startType = [];
                    console.log(pointTree);
                    if(pointTree){
                        pointTree.checkAllNodes(false);
                    }
                    for(var i=0;i<res.length;i++){
                        var treeNode = pointTree.getNodeByParam('id',res[i].omr_a_dvc_id);
                        pointTree.checkNode(treeNode,true);
                        vm.startChecked.push(res[i].omr_a_dvc_id+'');
                        vm.startNames.push(res[i].mpi_point_name);
                        vm.startType.push(treeNode.id+'_'+treeNode.type);
                    }
                }
            });
            db.query({
                request:{
                    sqlId:'select_move_end_rltn',
                    whereId:0,
                    params:{cusNumber:user.cusNumber,omg_id:omgId}
                },
                success:function(res){
                    console.log(res);
                    vm.endChecked=[];
                    vm.endType = [];
                    vm.endNames=[];
                    for(var i=0;i<res.length;i++){
                        var treeNode = pointTree.getNodeByParam('id',res[i].omr_b_dvc_id);
                        vm.endChecked.push(res[i].omr_b_dvc_id+'');
                        vm.endNames.push(res[i].mpi_point_name);
                        vm.endType.push(treeNode.id+'_'+treeNode.type);
                    }
                }
            });
        }
    });
    function queryBaseStation(callback){
        db.query({
            request:{
                sqlId:'select_station_tree',
                whereId:0,
                params:{cusNumber:user.cusNumber}
            },
            success:function(data){
                data.push({'id': 'r_' + user.cusNumber, 'name': 'RFID基站', 'pid': null, 'type': 15, 'icon': 0, 'cus_number': user.cusNumber, 'nocheck': 'true', 'isParent': 'true'});
                for(var i=0;i<data.length;i++){
                    dataList.push(data[i]);
                }
                vm.treeData = dataList;
                pointTree = $.fn.zTree.init($('#rlanDevice'),treeSetting,vm.treeData);
                pointTree.expandAll(true);
                var data = sessionStorage.getItem("trackMove");
                console.log(data);
                if(data){
                    sessionStorage.removeItem("trackMove");
                    hzEvent.call('trackMove.edit',JSON.parse(data));
                }
            }
        });
    }

    //初始化数据
    function initData(){
        try {
            pointTree = null;
            dataList = [];
            queryPoints();
            queryBaseStation();
        } catch(e) {
            console.error(e);
        }
    }

    
    try {    	
    	initStartTrack();
    	initData();

    	window.onbeforeunload = function () {
    		hzEvent.off('trackMove.edit');
    		Track.setIsEditRoute(false);
    	}
    	
	} catch (e) {
		// TODO: handle exception
	}
});