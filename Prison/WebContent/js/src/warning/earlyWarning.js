define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/select","frm/datepicker","frm/message","frm/model","frm/loginUser","echarts"],
    function($,tpl,db,table,dialog,select,date,tip,modelData,login,chart){


    var flag=false,type=false,first=true;
    //创建模型
    //console.log(login);
    var model=new tpl({
        el:'#infolist',
        data:{
            infogroup:{
                'odd_name':'',
                'per_cus_number':login.cusNumber,
                'per_record_id':'',
                'per_name':'',
                'per_sex':'',
                'per_birthday':'',
                'per_cert_type':'',
                'per_cert_code':'',
                'per_family_address':'',
                'per_petition_time':'',
                'per_petition_reason':'',
                'per_petition_content':'',
                'per_create_uid':login.userId,
                'per_create_us':'',
                'per_create_datetime':'',
                'per_update_uid':login.userId,
                'per_update_us':'',
                'per_update_datetime':''
            },
            condition:{
                'ffdm_name':'',
                'org':'',
                'ffdm_asset_code':''
            },
            flag:false
        },
        watch: {
            'condition.ffdm_name': function (val) {
                refresh();
            },
            'condition.org': function (val) {
                if (val == '') {
                    this.condition.ffdm_dept_id = '';
                }
                refresh();
            },
            'condition.ffdm_asset_code': function (val, old) {
                refresh();
            }
        }
    });
document.getElement("#table").oncontentmen=function(){]
}
    //table表
    table.init("table",{
        request:{
            sqlId:'query_petition_info',
            params:model.condition,
            orderId:'0'
        },
        /*search:{
            key:'per_name',
            whereId:'1'
        },*/
        columns: [[
            {
                field: 'state',
                checkbox: true
            },
            {
                title: '标题',
                field: 'odd_name',
                align: 'center',
                valign: 'middle',
                /*visible: false*/

            },
            {
                title: '内容',
                field: "per_name",
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return '<div class="ellipsis" style="width: 70px;" title="' + value + '">' + value + '</div>';
                }
            },
            {
                title: '预警级别',
                field: "per_sex",
                align: 'center',
                valign: 'middle'
            },
            {
                title: '创建人',
                field: 'birthday',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '创建时间',
                field: 'per_cert_type',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '发布人',
                field: 'per_cert_code',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '发布时间',
                field: 'petition_time',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '状态',
                field: 'per_family_address',
                align: 'center',
                valign: 'middle',
                class:'fal'
            }
        ]],
        onDblClickRow:function(row,$el,field){
            type=true;
            model.flag = true;
             console.log($el.context);
            modelData.modelData(model.infogroup,row);
            model.infogroup['per_birthday'] = row.birthday;
            model.infogroup['per_petition_time'] = row.petition_time;
            model.infogroup['per_sex'] = row.sex;
            model.infogroup['per_cert_type'] = row.cert_type;
            model.infogroup['per_create_datetime'] = row.create_datetime;
            model.infogroup['per_update_uid'] = login.userId;
            model.infogroup['per_update_datetime'] = row.update_datetime;
            dialog.open({targetId:'infotd',title:'修改',h:"75",w:'60'});
        },
        onClickRow:function(row,$el,field){

        },
        onLoadSuccess: function () {
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
           // rMenuVue.bind('#table');
        },

    });
    function refresh(){
        table.method('refresh',{request:{
            params:model.condition
        }});
    }
    //新增删除
    $("#oprbutton").on("click","a",function(){
        if(this.textContent=='添加'){
            type=false;
            model.infogroup['per_name']=model.infogroup['per_sex']=model.infogroup['per_birthday']=
                model.infogroup['per_cert_type']=model.infogroup['per_cert_code']=model.infogroup['per_family_address']=
                    model.infogroup['per_petition_time']=model.infogroup['per_petition_reason']=model.infogroup['per_petition_content']=
                        model.infogroup['per_create_us']=model.infogroup['per_update_us']='';
            db.query({
                request:{
                    sqlId:'query_odd_name',
                    params:[login.cusNumber]
                },
                success:function(data){
                    data=JSON.parse(JSON.stringify(data));
                    model.infogroup['odd_name']=data[0].odd_name;
                }
            });
            dialog.open({targetId:'infotd',title:'添加',h:"75",w:'60'});
        }else{//记录删除

            var list=table.method("getSelections").map(function(row){
                return {'per_cus_number':row['per_cus_number'],'per_record_id':row['per_record_id']};
            });
            if(!list.length){
                tip.alert("请先选择要删除的项目");
                return;
            }
            //删除
            tip.confirm("是否删除已勾选的"+list.length+"条记录？",function(index){
                db.updateByParamKey({
                    request:{
                        sqlId:'delete_petition_info',
                        whereId:'0',
                        params:list
                    },
                    success:function(){
                        tip.alert("删除成功");
                        dialog.close();
                        if(model.infogroup['per_record_id'].length){
                            table.method("refresh",{request:{whereId:'0',params:{'per_record_id':model.infogroup['per_record_id']}}});

                            queryMonth(list[0].begin_time.slice(0,4));
                        }else{
                            table.method("refresh");

                            queryMonth(list[0].begin_time.slice(0,4));
                        }
                    },
                    error:function(data,respMsg){
                        tip.alert(respMsg);
                    }
                });
            });
        }
    });

    //添加修改
    $("#infotd a").on("click",function(){
        //console.log(model.infogroup);
       // if(validate(true))return;
        var sql;
        if(type){//修改
            sql="update_petition_info"
        }
        else{//新增
            sql="insert_petition_info"
        }

        tip.saving();
        db.updateByParamKey({
            request:{
                sqlId:sql,
                params:[model.infogroup]
            },
            success:function(data){
                !data.success&&tip.alert(data.respMsg);
//				table.method("refresh",{request:{params:{'per_record_id':model.infogroup['per_record_id']}}});
                table.method("refresh",{request:{whereId:"3",params:{'per_cus_number':login.cusNumber}}});
                dialog.close();
                tip.alert("保存成功");
                queryMonth(String(model.infogroup['per_petition_time']).slice(0,4));
                table.method("refresh",{request:{whereId:'2',params:{'chartData':String(model.infogroup['per_petition_time']).slice(0,7)}}});
            },
            error:function(data,respMsg){
                tip.alert(respMsg);
            }
        });
    });
    //取消按钮
    $("#quit").click(function(){
        dialog.close();
    });
    //图表


/*
    //默认显示当前年份的饼图数据
    var date = new Date();
    var currentYear = date.getFullYear();
    var mm=date.getMonth();
    mm=(mm+1)<10?('0'+(mm+1)):mm+1;
    var currentMonth = currentYear + '-' + mm;

    //默认显示当前月份的表格数据
    table.method("refresh",{request:{whereId:'2',params:{'chartData':currentMonth}}});*/
    //点击返回按钮
    $("#back").on("click",function() {
        table.method("refresh",{request:{whereId:'3',params:{'per_cus_number':login.cusNumber}}});
    });
    function validate(flag){
        if(flag){

            return !model.infogroup['per_name'].length&&!tip.alert("请输入姓名")||
                !model.infogroup['per_petition_time'].length&&!tip.alert("请输入上访时间")||
                !model.infogroup['per_family_address'].length&&!tip.alert("请输入家庭住址")||
                !model.infogroup['per_petition_reason'].length&&!tip.alert("请输入上访原因")||
                !model.infogroup['per_petition_content'].length&&!tip.alert("请输入上访处置情况");
        }
    }
});