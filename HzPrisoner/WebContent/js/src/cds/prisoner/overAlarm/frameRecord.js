define(['jquery','vue','frm/hz.db',"frm/loginUser","frm/treeSelect","frm/model","frm/message","frm/treeUtil","frm/select","frm/table","frm/dialog"],
    function($,tpl,db,loginUser,treeSelect,modelUtil,tip,util,select,table,dialog){
        var columnsNameS;
        var request,auth;
        //console.log(loginUser);
    var model=new tpl({
        el:'#form',
        data:{
            station:{
                'pid':'',
                'tid':'',
                'id':'',
                'rbd_cus_number':loginUser.cusNumber,
                'rbd_other_id':'',
                'name':'',
                'rbd_brand':'',
                'rbd_ip':'',
                'rbd_port':'',
                'rbd_dept_id':'',
                'rbd_dept':'',
                'rbd_area_id':'',
                'rbd_area':'',
                'rbd_room_id':'',
                'rbd_dvc_addrs':'',
                'rbd_stts':'',
                'rbd_seq':'',
                'rbd_crte_time':'',
                'rbd_crte_user_id':loginUser.userId,
                'rbd_crte_us':'',
                'rbd_updt_time':'',
                'rbd_updt_user_id':loginUser.userId,
                'rbd_updt_us':'',
                tableData:[]
            }
        },
        methods:{
            activeClick:function(e){
                 $(".active").removeClass("active");
                e.target.parentNode.classList.add("active");
                refreshTable("0",{poa_cus_number:loginUser.cusNumber});
                if( e.target.innerHTML == "基站查询"){
                    $(".table_id_1").show();
                    $(".table_id_2").hide();
                    columnsNameS = [{
                            field: 'state',
                            checkbox: true
                        },
                        {
                            title: '基站名称',
                            field: 'rfid_name',
                            align: 'center',
                            valign: 'middle'
                        },
                        {
                            title: '姓名',
                            field: 'people_name',
                            align: 'center',
                            valign: 'middle'
                        },
                        {
                            title: '区域',
                            field: 'rfid_area_name',
                            align: 'center',
                            valign: 'middle'
                        }];
                    auth=loginUser.dataAuth!=2?'2':'3';
                    request={
                        sqlId:'query_station_info',
                        orderId:'0',
                        params:[auth,loginUser.cusNumber]
                    };
                    loginUser.dataAuth!=2&&(request.whereId=0,request.params.push(loginUser.cusNumber));
                    zTreeS(request);
                    tableF('0',{poa_cus_number:loginUser.cusNumber},"table",columnsNameS);
                }else if(e.target.innerHTML == "姓名查询"){
                    $(".table_id_1").hide();
                    $(".table_id_2").show();
                    columnsNameS = [{
                            field: 'state',
                            checkbox: true
                        },
                        {
                            title: '姓名',
                            field: 'people_name',
                            align: 'center',
                            valign: 'middle'
                        },
                        {
                            title: '基站名称',
                            field: 'rfid_name',
                            align: 'center',
                            valign: 'middle'
                        },
                        {
                            title: '区域',
                            field: 'rfid_area_name',
                            align: 'center',
                            valign: 'middle'
                        }];

                    request={
                        sqlId:"select_prisoner_for_control",
                        params:{
                            org:loginUser.dataAuth>0?loginUser.cusNumber:loginUser.deptId
                        }
                    };
                    zTreeS(request);
                    tableF('0',{poa_cus_number:loginUser.cusNumber},"tableS",columnsNameS);
                }
                table.method("refresh");
                //console.log( e.target.innerHTML)
            }
        }
    });
    //基站信息
    var treeContainer, depTree,tId;
        function zTreeS(requests){
            //如果用户的数据权限不是本辖区的则部门号就是机构号

            //loginUser.dataAuth!=2&&(request.whereId=0,request.params.push(loginUser.cusNumber));
            db.query({
                request:requests,
                success:function(data){
                    var setting={
                        path:'../../../../libs/ztree/css/zTreeStyle/img/',
                        data: {simpleData: {enable: true,pIdKey: "pid"}},
                        check: {enable: false},
                        callback:{
                            onClick:function(e,id,node){
                                if(node.name=='武汉戒毒所'){
                                    refreshTable("0",{poa_cus_number:loginUser.cusNumber});
                                }else if(node.id.length<8 && node.id.split("-").length==1){
                                    refreshTable("1",{poa_cus_number:loginUser.cusNumber,poa_rfid:node.id});
                                }else if(node.id.split("-").length==1){
                                    refreshTable("2",{poa_cus_number:loginUser.cusNumber,poa_prisoner_id:node.id});
                                }
                                //console.log(node.id.length)
                            },
                            onDblClick:function(id,e,node){

                            }
                        }
                    };
//			model.station['rbd_stts']=0;
                    treeContainer=$.fn.zTree.init($("#tree"), setting,data);
                    $("#input").keyup(function(){
                        util.searchTree("name",this.value,"tree",data,setting);
                    });
                }
            });
        }
        auth=loginUser.dataAuth!=2?'2':'3';
        request={
            sqlId:'query_station_info',
            orderId:'0',
            params:[auth,loginUser.cusNumber]
        };
        zTreeS(request);


    var roleTree,errorMessage;
    var index;//弹出框

    //table表
    columnsNameS = [{
            field: 'state',
            checkbox: true
        },
        {
            title: '基站名称',
            field: 'rfid_name',
            align: 'center',
            valign: 'middle'
        },
        {
            title: '姓名',
            field: 'people_name',
            align: 'center',
            valign: 'middle'
        },
        {
            title: '区域',
            field: 'rfid_area_name',
            align: 'center',
            valign: 'middle'
        }]
    tableF('0',{poa_cus_number:loginUser.cusNumber},"table",columnsNameS);
    function tableF(whereId,parameter,el,columnsName){
        table.init(el,{
            request:{
                sqlId:'select_people_over_alarm_config',
                whereId:whereId,
                orderId:'0',
                params:parameter
            },
            columns: [columnsName],
            onClickCell:function(field, value, row){
                if(field == 'count'){
                    tableColQuery(row);
                }
            },
            onLoadSuccess:function(data){
                model.tableData=data.rows;
            }
        });

    }

    //删除
    $("#del").on('click',function(){
        var list=table.method("getSelections");
        if(!list.length){
            tip.alert("请先选择要删除的项目");
            return;
        }
        var tmpe =[];
        for(var i= 0,leg=list.length;i<leg;i++){
            tmpe.push({poa_cus_number:loginUser.cusNumber,poa_rfid:list[i].rfid_id,poa_prisoner_id:list[i].people_id})
        }
        //删除
        tip.confirm("确认删除吗？",function(index){
            db.updateByParamKey({
                request:{
                    sqlId:'delete_people_over_alarm_config',
                    whereId:'0',
                    params:tmpe
                },
                success:function(){
                    tip.alert("删除成功");
                    table.method("refresh");
                },
                error:function(data,respMsg){
                    tip.alert(respMsg);
                }
            });
        });
    });

    $("#rollcall").on("click",".buttons a",function(){
        if(this.textContent=="新增"){
            dialog.open({targetId:'operPanel',title:'新增信息',w:"835px"});
        }else if(this.textContent=="查询"){
            dialog.open({targetId:'searchTable',title:'查询信息',w:'430px',h:'240px'})
        }
    });

    function zTreeOnCheck(event, treeId, treeNode) {
        //model.treeList.push(treeNode.tId);
    };

    //保存定时点名配置

    //表格刷新方法
    function refreshTable(whereId,param){
        table.method("refresh",{
            request:{
                sqlId:'select_people_over_alarm_config',
                whereId:whereId,
                orderId:'0',
                params:param
            }
        })
    }



});