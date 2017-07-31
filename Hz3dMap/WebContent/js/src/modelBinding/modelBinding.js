define(function(require){
	var $ = require('jquery'),
	    tpl=require('vue'),
	    db=require('frm/hz.db'),
	    table=require("frm/table"),
	    dialog=require("frm/dialog"),
	    select=require("frm/select"),
	    tip=require("frm/message"),
	    modelData=require("frm/model"),
	    login=require("frm/loginUser");
	
	var layer =require('layer');
    var flag=false,type=false,first=true;
    var hzEvent = require('frm/hz.event');
    function modelBindingAdd(dmb_dvc_id){
    	var item = dialog.top.open({
			id : 10002,
			type : 2,
			title : '编辑',
			w : 400,
			h : 300,
			top : 90,
			url : 'page/map/modelBinding/modelBindingAdd.html?dmb_dvc_id='+dmb_dvc_id
		});
    }
    // console.log(login);
    var model=new tpl({
        el:'#infolist',
        data:{
            modelDevice:{
                'dmb_cus_number': login.cusNumber,
		       	'dmb_dvc_id': '',
		       	'dmb_dvc_type': '',
		       	'dmb_dvc_type_name':'',
		       	'dmb_dvc_name': '',
		       	'dmb_model_name': '',
		       	'dmb_crte_uid': login.userId,
		       	'dmb_crte_name': login.userName,
		       	'dmb_crte_time': '',
		       	'dmb_updt_uid': '',
		       	'dmb_updt_name':'',
		       	'dmb_updt_time': ''
            },
            condition:{
                'dmb_cus_number': login.cusNumber,
                'dmb_dvc_type':'',
                'dmb_dvc_name':''
            },
            type:false,
            flag:false
        },
        watch: {
            'condition.dmb_dvc_type': function (val) {
                refresh();
            },
            'condition.dmb_dvc_name': function (val) {
                refresh();
            }
        },
        methods:{
            showAll:function(){
                table.method('refresh',{request:{
                    whereId:'1',
                    params:model.condition
                }});
                model.condition = {
            		 'dmb_cus_number': login.cusNumber,
                     'dmb_dvc_type':'',
                     'dmb_dvc_name':''
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
            vRemove: false
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
            rmEdit: function () {//编辑
            	modelBindingAdd(this.row.dmb_dvc_id);
            	dialog.curClose();
                rMenuVue.hide(200);
            },
            rmRemove: function () { //删除
                var that = this;
                rMenuVue.hide(200);
                tip.confirm("是否删除该信息？",function(index){
                    db.updateByParamKey({
                        request:{
                            sqlId:'delete_map_device_model_bind',
                            params:{
                                dmb_cus_number:login.cusNumber,
                                dmb_dvc_id:that.row['dmb_dvc_id']
                            }
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
            },
            rmHide: function () {
                this.rm.fadeOut(200);
            }
        }
    });

    rMenuVue.rm.on('mousedown', function () {
        event.stopPropagation();
    });

    $(window).on('mousedown', function () {
        rMenuVue.hide(0);
    });
    //查询
    function refresh(){
        table.method('refresh',{request:{
            whereId:'0',
            params:model.condition
        }});
    }
    //table表
    table.init("table",{
        request:{
            sqlId:'query_map_device_model_bind',
            params:{dmb_cus_number:login.cusNumber}
        },
        pageSize:20,
        columns: [[
            {title: '设备名称',field: "dmb_dvc_name",align: 'center',valign: 'middle'}, 
            {title: '设备类型',field: 'dmb_dvc_type_name',align: 'center',valign: 'middle'},
            {title: '模型名称',field: "dmb_model_name",align: 'center',valign: 'middle'},
            {title: '创建人',field: 'dmb_crte_name',align: 'center',valign: 'middle'},
            {title: '创建时间',field: 'dmb_crte_time',align: 'center',valign: 'middle'}
        ]],
        onDblClickRow:function(row){
        	modelBindingAdd(row.dmb_dvc_id);
        	dialog.curClose();
            rMenuVue.hide(200);
        },
        onLoadSuccess: function (data) {
            rMenuVue.bind('#table');
        },
    });
});