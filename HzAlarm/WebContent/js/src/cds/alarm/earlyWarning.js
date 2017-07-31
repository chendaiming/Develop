define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/select","frm/datepicker","frm/message","frm/model","frm/loginUser","echarts"],
    function($,tpl,db,table,dialog,select,date,tip,modelData,login,chart){


    var flag=false,type=false,first=true;
    //创建模型
   // console.log(login);
    var model=new tpl({
        el:'#infolist',
        data:{
            infogroup:{
                'ewi_cus_number': login.cusNumber,
                'ewi_id':'',
                'ewi_title':'',
                'ewi_level':0,
                'ewi_content':'',
                'ewi_status':'',
                'ewi_crte_name':login.realName,
                'ewi_crte_uid':login.userId,
                'ewi_crte_time':'',
                'ewi_name':'',
                'ewi_leve':'',
                'ewi_publish_name':'',
                'ewi_publish_uid':'',
                'ewi_updt_uid':'',
                'ewi_updt_time':'',
                'ewi_publish_time':''
            },
            condition:{
                'cus_number': login.cusNumber,
                'ewi_title':'',
                'ewi_content':'',
                'ewi_level':''
            },
            flag:false,
            type:false,
            dateil:false
        },
        watch: {
            'condition.ewi_title': function (val) {
                refresh();
            },
            'condition.ewi_content': function (val) {

                refresh();
            },
            'condition.ewi_level': function (val, old) {
                refresh();
            }
        },
        methods:{
            close:function(){//取消按钮
                dialog.close();
            },
            preserve:function(){
                preserve();
            },
            showAll:function(){
                table.method('refresh',{request:{
                    whereId:'1',
                    params:model.condition
                }});
                model.condition = {
                    'cus_number': login.cusNumber,
                    'ewi_title':'',
                    'ewi_content':'',
                    'ewi_level':''
                };
            }
        }
    });
        /*
         * TODO: 右键菜单 -----------BEGIN
         */
        var rMenuVue = new tpl({
            el: '.right-menus',
            data: {
                rm: $('.right-menus'),
                row: null,
                vEdit: false,
                vRemove: false,
                statusMenu:''
            },
            methods: {
                bind: function (selector) {
                    // 扩展表格的右键事件
                    $(selector).find('>tbody >tr').each(function (i) {
                        $(this).on('mouseup', function (e) {
                            if (e.button == 2) {
                                rMenuVue.show(table.method('getData')[i], {'top': window.event.clientY, 'left': window.event.clientX});
                            }
                        });
                    });
                },
                show: function (row, pos) {
                    pos.left += 5;
                    pos.top += 5;

                    this.vEdit = false;
                    this.vRemove = false;
                    this.row = row;
                    this.statusMenu = row['ewi_status'];
                    this.rm.fadeIn(300);
                    this.rm.css(pos);

                    if (row.frd_status == 0 || row.frd_status == 1) {
                        this.vEdit = true;

                        if (row.frd_status == 1) {
                            this.vRemove = true;
                        }
                    }
                },
                hide: function (speed) {
                    this.rm.fadeOut(speed);
                },
                rmDetail: function () {//详情
                    model.dateil=true;
                    let row = this.row
                    model.type=true;
                    model.flag = true;
                    modelData.modelData(model.infogroup,row);
                    dialog.open({targetId:'infotd',title:'详情',h:"75",w:'60'});
                    rMenuVue.hide(200);
                },
                rmEdit: function () {//编辑
                    model.dateil=false;
                    let row = this.row
                    model.type=true;
                    model.flag = true;
                    modelData.modelData(model.infogroup,row);
                    dialog.open({targetId:'infotd',title:'修改',h:"75",w:'60'});
                    rMenuVue.hide(200);
                },
                rmRemove: function () { //删除
                    var that = this;
                    rMenuVue.hide(200);
                    tip.confirm("是否删除该信息？",function(index){
                        db.updateByParamKey({
                            request:{
                                sqlId:'delete_early_warning_info',
                                params:{
                                    ewi_cus_number:login.cusNumber,
                                    ewi_id:that.row['ewi_id']
                                }
                            },
                            success:function(){
                                tip.alert("删除成功");
                                table.method("refresh");
                                /*dialog.close();*/

                            },
                            error:function(data,respMsg){
                                tip.alert(respMsg);
                            }
                        });
                    });
                },
                rmHide: function () {
                    this.rm.fadeOut(200);
                },
                rmPrint: function () {//撤销
                    var that = this;
                    rMenuVue.hide(0);
                    tip.confirm("是否撤销该信息？",function(index){
                        let req = {
                            sqlId:'updata_early_warning_info_status2',
                            params:{
                                ewi_cus_number:login.cusNumber,
                                ewi_id:that.row['ewi_id'],
                                ewi_status:2
                            }
                        }
                        query(req,'撤销成功')
                    });

                },
                rmRelease:function(){//发布
                    rMenuVue.hide(0);
                    var that = this;
                    tip.confirm("是否发布该信息？",function(index){
                        let req = {
                            sqlId:'updata_early_warning_info_status1',
                            params:{
                                ewi_cus_number:login.cusNumber,
                                ewi_id:that.row['ewi_id'],
                                ewi_publish_uid : login.userId,
                                ewi_status:1
                            }
                        }
                        query(req,'发布成功');
                    });

                }
            }
        });

        rMenuVue.rm.on('mousedown', function () {
            event.stopPropagation();
        });

        rMenuVue.rm.find('li').on('click', function () {

        });

        $(window).on('mousedown', function () {
            rMenuVue.hide(0);
        });
        //修改状态
        function query(request,alt){
            db.updateByParamKey({
                request:request,
                success:function(data){
                    tip.alert(alt);
                    table.method("refresh");
                },
                error:function(data,respMsg){
                    tip.alert(respMsg);
                }
            });
        }

        function refresh(){
            table.method('refresh',{request:{
                whereId:'0',
                params:model.condition
            }});
        }
    //table表
    table.init("table",{
        request:{
            sqlId:'query_early_warning_info',
            params:{cus_number:login.cusNumber}
        },
        columns: [[
            {
                title: '标题',
                field: 'ewi_title',
                align: 'center',
                valign: 'middle',
            },
            {
                title: '内容',
                field: "ewi_content",
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return '<div class="ellipsis" style="width: 70px;" title="' + value + '">' + value + '</div>';
                }
            },
            {
                title: '预警级别',
                field: "ewi_leve",
                align: 'center',
                valign: 'middle'
            },
            {
                title: '创建人',
                field: 'ewi_crte_name',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '创建时间',
                field: 'ewi_crte_time',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '发布人',
                field: 'ewi_publish_name',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '发布时间',
                field: 'ewi_publish_time',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '状态',
                field: 'ewi_name',
                align: 'center',
                valign: 'middle',
                class:'fal'
            }
        ]],
        onDblClickRow:function(row){
            model.dateil=true;
            model.type=true;
            model.flag = true;
            modelData.modelData(model.infogroup,row);
            dialog.open({targetId:'infotd',title:'详情',h:"75",w:'60'});
            rMenuVue.hide(200);
        },
        onLoadSuccess: function (data) {
           // console.log(data)
            // 调整ellipsis的宽度
            $('#table >tbody >tr >td >.ellipsis').each(function () {
                var ow = $(this).parent().outerWidth();
                var pw = $(this).parent().width();
                var tw = $(this).width();

                if (tw < pw) {
                    // 这里必须要同时设置TD的宽度样式才不会乱
                    $(this).css('width', pw).parent().css('width', ow);
                }
            });
           rMenuVue.bind('#table');
        },

    });

    //新增
    $("#oprbutton").on("click","a",function(){
        model.type=false;
        model.dateil=false;
        model.flag = false;
        reset()
        dialog.open({targetId:'infotd',title:'添加',h:"75",w:'60'});
    });
    function reset(){
        model.infogroup = {
            'ewi_cus_number': login.cusNumber,
            'ewi_id':'',
            'ewi_title':'',
            'ewi_level': '',
            'ewi_content':'',
            'ewi_status':'',
            'ewi_crte_name':login.realName,
            'ewi_crte_uid':login.userId,
            'ewi_crte_time':'',
            'ewi_name':'',
            'ewi_publish_name':'',
            'ewi_publish_uid':'',
            'ewi_updt_uid':'',
            'ewi_updt_time':'',
            'ewi_publish_time':''
        };
    }
    //添加修改
    function preserve(){
        //console.log(model.infogroup);
        if(validate(true))return;
        var sql,request;
        if(model.type){//修改
            model.infogroup['ewi_publish_uid']=login.userId;
            request = {
                sqlId:"updata_early_warning_info",
                params:model.infogroup,
                whereId:'0',
            }
        }
        else{//新增
            request = {
                sqlId:"insert_early_warning_info",
                params:model.infogroup
            }
        }

        tip.saving();
        db.updateByParamKey({
            request:request,
            success:function(data){
                !data.success&&tip.alert(data.respMsg);
                table.method("refresh");
                dialog.close();
                tip.alert("保存成功");
            },
            error:function(data,respMsg){
                tip.alert(respMsg);
            }
        });
    };

    function validate(flag){

        if(flag){

            return !model.infogroup['ewi_title'].length>0&&!tip.alert("请输入标题")||
                !(model.infogroup['ewi_title'].length<25)&&!tip.alert("标题不能超过25个字符")||
                !model.infogroup['ewi_content'].length>0&&!tip.alert("请输入内容")||
                !model.infogroup['ewi_level']!=0&&!tip.alert("请选择预警级别");
        }
    }
});