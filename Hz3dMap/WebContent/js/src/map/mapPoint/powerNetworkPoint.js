/**
 * Created by chendm on 2017/4/5 16:45
 */
define(['frm/loginUser','frm/hz.db','ztree','vue','frm/treeUtil','frm/message','hz/map/map.handle','frm/select','frm/model','cxcolor','frm/hz.event'],
    function(user,db,ztree,vue,treeUtil,message,hzmap,select,model,cxcolor, hzEvent){
        $('.input-cxcolor').cxColor();

        //返回绘图接口
        function powerGrid () {
            return hzmap.hzThree.PowerGrid;
        }

        //窗口设置
        var pndiv = window.frameElement.parentNode.parentNode;
        var setWin = window.frameElement.parentNode.nextSibling;
        var title = window.frameElement.parentNode.previousSibling;
        pndiv.classList.add("flip");

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
                    //查询点位数据
                    vm.queryPoints(treeNode.id);
                    var plist =  vm.pointsList;

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
                    //hzmap.location(treeNode.getParentNode().id.replace('v_',''), !viewPoint.posX ? '' : viewPoint);
                },
                onCheck:function(event,treeId,treeNode){
                    if(hasCheckedNodes()){
                        $("#delBtn").removeClass("btn_disabled");
                    }else{
                        $("#delBtn").addClass("btn_disabled");
                    }
                },
                onClick:function(event,treeId,treeNode){
                    if(!treeNode.isParent){
                        $("#editBtn").removeClass("btn_disabled");
                    }else{
                        $("#editBtn").addClass("btn_disabled");
                    }

                }
            }
        }
        //树节点过滤器（已选中的所以最终节点）
        function treeNodeFilter(node){
            return !node.isParent && node.checked;
        }

        //是否有选中节点
        function hasCheckedNodes(){
            //已选中的所有最终节点
            var checkedNodes = pointTree.getNodesByFilter(treeNodeFilter);
            return checkedNodes.length > 0 ? true : false;
        }


        var initData = {
            pnViewPointInfo:{	//电网坐标信息
                id:'',
                name:'',
                pid:'',
                tId:'',
                old_id:'',		//修改使用的原id
                pgg_cus_number:user.cusNumber,
                pgg_power_grid_id:'',
                pgg_line_color:'0x00FF00',
                pgg_line_width:'5',
                pgg_electricity_color:'0xFF0000',
                pgg_create_uid:user.userId,
                pgg_update_uid:user.userId,
                pgg_view_id: 0,
                pgg_pos_x: 0,
                pgg_pos_y: 0,
                pgg_pos_z: 0,
                pgg_rot_x: 0,
                pgg_rot_y: 0,
                pgg_rot_z: 0,
                pgg_tar_x: 0,
                pgg_tar_y: 0,
                pgg_tar_z: 0
            },
            pnViewPoint:{	//电网坐标
                pgp_cus_number:user.cusNumber,
                pgp_power_grid_id:'',
                pgp_pos_x:'',
                pgp_pos_y:'',
                pgp_pos_z:'',
                pgp_seq:''
            },
            powerGrid:'powergrid'+user.cusNumber,	//绘图图形id
            powerGridList:[],	//绘图后返回数据
            pointsList:[],		//点位信息列表
            searchTree:'',		//树节点查询值
            paintingFlag:false,	//绘图标识	true:开始绘图	false:关闭绘图
            showFlag:false,	//预览标识	true:预览	false：关闭预览
            checked:false,	//是否选中
            treeData:[],	//树节点数据
            selected:false	//树节点是否选择
        }

        //重置数据
        var resetData = JSON.stringify(initData);

        var vm = new vue({
            el:'body',
            data:initData,
            watch:{
                'searchTree':function(){
                    treeUtil.searchTree('name',this.searchTree,'powerNetworkZtree',vm.treeData,treeSetting);
                },
                'pnViewPointInfo.pgg_line_color':function(){
                    vm.refresh();	//刷新点位图形
                },
                'pnViewPointInfo.pgg_line_width':function(){
                    vm.refresh();	//刷新点位图形
                },
                'pnViewPointInfo.pgg_electricity_color':function(){
                    vm.refresh();	//刷新点位图形
                }
            },
            methods:{
                reset:function(){			//重置
                    powerGrid().setIsEditRoute(false);
                    powerGrid().clearPowerGrid(vm.powerGrid);
                    vm.powerGridList = [];
                    vm.pointsList = [];
                    vm.showFlag = false;
                    powerGrid().setIsEditRoute(true);
                },
                backList:function(){		//返回
                    $("#powerNetworkPoint").removeClass('my-hide');
                    $("#powerNetworkPointAdd").addClass('my-hide');
                    //关闭绘图
                    vm.closePaining();
                },
                savePoints:function(){		//保存
                    //没有预览直接保存获取点位
                    if(vm.powerGridList.length <= 0){
                        vm.powerGridList = powerGrid().getRouteList();
                    }
                    var infoSqlId = !vm.pnViewPointInfo.id ? 'insert_pn_view_info' : 'update_pn_view_info' ;
                    //如果是编辑状态，不需要再次绘图即可保存
                    if((!vm.powerGridList || vm.powerGridList.length <= 0)) {
                        message.alert('<p class="message_transform">请先绘图</p>');
                        return;
                    }
                    if(!String(vm.pnViewPointInfo.pgg_power_grid_id)){
                        message.alert('请先选择电网设备');
                        return;
                    }
                    message.confirm('确认保存吗？',function(){
                        vm.updateViewInfo(infoSqlId);
                    })

                },
                painting:function(){
                    if(!vm.paintingFlag){	//开始绘图
                        //message.alert('请长按Shift键<br>点击鼠标左键进行绘图');
                        //设置点位数据，再次编辑点位
                        //查询点位数据
                        vm.queryPoints(vm.pnViewPointInfo.id);
                        powerGrid().setIsEditRoute(true);
                        if(vm.pointsList.length > 0){
                            powerGrid().clearPowerGrid(vm.pnViewPointInfo.id);
                            powerGrid().setPowerGridParam({
                                lineColor: vm.pnViewPointInfo.pgg_line_color,
                                lineWidth: vm.pnViewPointInfo.pgg_line_width,
                                electronColor:vm.pnViewPointInfo.pgg_electricity_color,
                                pathName:vm.pnViewPointInfo.id
                            });
                            powerGrid().setRoutePath(vm.pointsList);
                        }else{
                            vm.refresh();	//刷新电网
                        }
                        vm.paintingFlag = true;
                    }else{
                        //关闭绘图
                        vm.closePaining();
                    }
                },
                closePaining:function(){	//关闭绘图
                    powerGrid().setIsEditRoute(false);
                    powerGrid().clearPowerGrid(vm.powerGrid);
                    vm.paintingFlag = false;
                    vm.showFlag = false;
                    vm.powerGridList = [];
                },
                showPoints:function(){	//预览
                    if(vm.paintingFlag){
                        //获取预览数据
                        if(vm.powerGridList.length <= 0 || !vm.showFlag){
                            vm.powerGridList = powerGrid().getRouteList();
                        }
                        console.log(vm.powerGridList);
                        if(vm.powerGridList.length > 0){
                            if(vm.showFlag){
                                vm.showFlag = false;
                                vm.refresh();	//刷新电网
                            }else{
                                vm.showFlag = true;
                                vm.refresh();	//刷新电网
                            }
                        }else{
                            message.alert('<p class="message_transform">请先绘图</p>');
                        }
                    }else{
                        message.alert('<p class="message_transform">请先绘图</p>');
                    }
                },
                addPoints:function(){	//添加
                    $("#powerNetworkPoint").addClass('my-hide');
                    $("#powerNetworkPointAdd").removeClass('my-hide');
                    //重置数据
                    resetPoint();
                },
                editPoints:function(){	//编辑
                	$("#powerNetworkPoint").addClass('my-hide');
                    $("#powerNetworkPointAdd").removeClass('my-hide');
                    //已选择的节点
                    var selectNodes = pointTree.getSelectedNodes();
                    //复制节点数据
                    model.modelData(vm.pnViewPointInfo,selectNodes[0]);
                    vm.pnViewPointInfo.old_id = vm.pnViewPointInfo.id;
                    $(".line-color").css('color',vm.pnViewPointInfo.pgg_line_color.replace('0x','#'));
                    $(".electricity-color").css('color',vm.pnViewPointInfo.pgg_electricity_color.replace('0x','#'));

                    //设置点位数据，再次编辑点位
                    //查询点位数据
                    vm.queryPoints(vm.pnViewPointInfo.id);
                    vm.painting();
                    powerGrid().setRoutePath(vm.pointsList);
                },

                updateViewInfo:function(infoSqlId){		//更新添加电网图形信息
                    var view = hzmap.curViewMenu;
                    var point = hzmap.getViewPoint();
                    if(view){
                        vm.pnViewPointInfo.pgg_view_id = view.id;
                    }

                    vm.pnViewPointInfo.pgg_pos_x = point.posX;
                    vm.pnViewPointInfo.pgg_pos_y = point.posY;
                    vm.pnViewPointInfo.pgg_pos_z = point.posZ;
                    vm.pnViewPointInfo.pgg_rot_x = point.rotX;
                    vm.pnViewPointInfo.pgg_rot_y = point.rotY;
                    vm.pnViewPointInfo.pgg_rot_z = point.rotZ;
                    vm.pnViewPointInfo.pgg_tar_x = point.tarX;
                    vm.pnViewPointInfo.pgg_tar_y = point.tarY;
                    vm.pnViewPointInfo.pgg_tar_z = point.tarZ;

                    //添加、更新操作
                    db.updateByParamKey({
                        request: [{
                            sqlId:infoSqlId,
                            whereId:0,
                            params: vm.pnViewPointInfo
                        }],
                        success: function (data) {
                            vm.updateViewPoint(infoSqlId);
                        },
                        error: function (code, msg) {
                            if(code == '1002'){
                                message.alert('电网设备已经存在<br>请重新选择',4000);
                            } else {
                                message.alert(msg);
                            }
                        }
                    });
                },

                updateViewPoint:function(infoSqlId){		//更新添加电网点位信息
                    var pointList = [];
                    //组装坐标数据
                    for(var i = 0; i < vm.powerGridList.length; i++){
                        var point = JSON.parse(JSON.stringify(vm.pnViewPoint));
                        point.pgp_seq = i;
                        point.pgp_pos_x = vm.powerGridList[i].x;
                        point.pgp_pos_y = vm.powerGridList[i].y;
                        point.pgp_pos_z = vm.powerGridList[i].z;
                        point.pgp_power_grid_id = vm.pnViewPointInfo.pgg_power_grid_id;
                        pointList.push(point);
                    }
                    var request = [];
                    //有绘图数据、删除原有数据后重新添加
                    if(vm.powerGridList.length > 0){
                        request = [{
                            sqlId:'delete_pn_view_point',
                            whereId:0,
                            params:{
                                'cusNumber':user.cusNumber,
                                'pgp_power_grid_id':vm.pnViewPointInfo.pgg_power_grid_id
                            }
                        },{
                            sqlId:'insert_pn_view_point',
                            whereId:0,
                            params:pointList
                        }]
                    }else{	//无绘图数据、只更新点位数据关联的id
                        request = [{
                            sqlId:'update_pn_view_point',
                            whereId:0,
                            params:{
                                'pgp_cus_number':user.cusNumber,
                                'pgp_power_grid_id':vm.pnViewPointInfo.pgg_power_grid_id,
                                'old_id':vm.pnViewPointInfo.old_id
                            }
                        }]
                    }

                    //添加、更新点位
                    db.updateByParamKey({
                        request:request,
                        success:function(data){
                            if(infoSqlId.indexOf('insert') != -1){
                                message.alert('保存成功');
                            }else{
                                message.alert('更新成功');
                            }

                            vm.backList();		//返回列表
                            queryPointTree();	//刷新列表
                            vm.closePaining();	//关闭绘图

                            // 重新渲染三维地图电网
                            hzmap.loadPowerGrid();
                        },
                        error: function (code, msg) {
                            message.alert(msg);
                        }
                    })
                },
                delViewInfo:function(){	//删除电网图形信息
                    //已选中的所有最终节点
                    var checkedNodes = pointTree.getNodesByFilter(treeNodeFilter);
                    if(checkedNodes.length > 0){
                        message.confirm('确定删除吗？',function(){
                            var delList = [];
                            for(var i = 0; i < checkedNodes.length; i++){
                                var obj = {
                                    'cusNumber':user.cusNumber,
                                    'pgg_power_grid_id':checkedNodes[i].pgg_power_grid_id,
                                    'pgp_power_grid_id':checkedNodes[i].pgg_power_grid_id
                                }
                                delList.push(obj);
                            }
                            db.updateByParamKey({
                                request:{
                                    sqlId:'delete_pn_view_info',
                                    params:delList
                                },
                                success:function(res){
                                    for(var i = 0; i < checkedNodes.length; i++){
                                        pointTree.removeNode(pointTree.getNodeByTId(checkedNodes[i].tId));
                                    }
                                    $("#editBtn").addClass("btn_disabled");
                                    $("#delBtn").addClass("btn_disabled");
                                    hzmap.loadPowerGrid();
                                    vm.delPoints(delList);
                                },
                                error: function (code, msg) {
                                    message.alert(msg);
                                }
                            });
                        });
                    }
                },
                hasPoints:function(id){		//判断是否有电网点位
                    if(id){
                        vm.queryPoints(id);
                        return  vm.pointsList && vm.pointsList.length > 0 ? true : false;
                    }
                    return false;
                },
                queryPoints:function(id){		//查询电网点位信息
                    db.query({
                        request:{
                            sqlId:'select_pn_view_point_byid',
                            params:{'cusNumber':user.cusNumber,'pgp_power_grid_id':id}
                        },
                        async:false,
                        success:function(data){
                            vm.pointsList = data;
                        }
                    });
                },
                delPoints:function(delList){	//删除电网点位信息
                    db.updateByParamKey({
                        request:{
                            sqlId:'delete_pn_view_point',
                            params:delList
                        },
                        success:function(res){
                            message.alert('删除成功');
                        },
                        error: function (code, msg) {
                            message.alert(msg);
                        }
                    });
                },
                refresh:function(){		//刷新点位图形
                    powerGrid().clearPowerGrid(vm.powerGrid);
                    powerGrid().setPowerGridParam({
                        lineColor: vm.pnViewPointInfo.pgg_line_color,
                        lineWidth: vm.pnViewPointInfo.pgg_line_width,
                        electronColor:vm.pnViewPointInfo.pgg_electricity_color,
                        pathName:vm.powerGrid
                    });
                    if(vm.powerGridList.length > 0){
                        powerGrid().setRoutePath(vm.powerGridList);
                        if(vm.showFlag){	//正在预览状态
                            powerGrid().showPowerGrid({
                                pathName: vm.powerGrid,
                                pathData: vm.powerGridList
                            });
                            powerGrid().setIsEditRoute(false);
                        }else{
                            //如果当前在绘图状态，则设置开启绘图
                            if(vm.paintingFlag){
                                powerGrid().setIsEditRoute(true);
                            }else{
                                powerGrid().setIsEditRoute(false);
                            }
                        }
                    }else{
                        console.log("无点位数据");
                    }
                }
            }
        });



        //重置
        function resetPoint(){
            vm.pnViewPointInfo.pgg_power_grid_id = '';
            vm.pnViewPointInfo.id = '';
            vm.checked = false;
            vm.selected = false;
            vm.pnViewPointInfo.pgg_line_color = '0x00FF00';
            vm.pnViewPointInfo.pgg_line_width = '5';
            vm.pnViewPointInfo.pgg_electricity_color = '0xFF0000';
            $(".line-color").css('color','#00FF00');
            $(".electricity-color").css('color','#FF0000');
        }

        //窗口关闭同时关闭绘图
        setWin.childNodes[2].addEventListener('click',function(e){
            vm.closePaining();
        })

        function queryPointTree(){
            db.query({
                request:{
                    sqlId:'select_pn_view_info_ztree',
                    whereId:0,
                    params:{cusNumber:user.cusNumber}
                },
                success:function(data){
                    pointTree = $.fn.zTree.init($('#powerNetworkZtree'),treeSetting, vm.treeData = data);
                    pointTree.expandAll(true);
                }
            });
        }

        queryPointTree();
    });