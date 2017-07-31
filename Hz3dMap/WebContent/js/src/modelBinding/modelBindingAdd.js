define(function(require){
	var $ = require('jquery'),
	    tpl=require('vue'),
	    db=require('frm/hz.db'),
	    dialog=require("frm/dialog"),
	    select=require("frm/select"),
	    date=require("frm/datepicker"),
	    message=require("frm/message"),
	    login=require("frm/loginUser");
	
	var hzEvent = require('frm/hz.event');
	var mapHandle = require('hz/map/map.handle');
	var ztree = require('ztree');
    var flag=false,type=false,first=true;
    var modelQuery = true;
    var sqlMap = {
		'1': 'select_camera_alarm_for_model_bind',				// 摄像机：智能分析
		'2': 'select_door_alarm_for_model_bind',				// 门禁
		'3': 'select_talkback_alarm_for_model_bind',			// 对讲机
		'4': 'select_broadcast_alarm_for_model_bind',			// 广播
		'6': 'select_network_alarm_for_model_bind',				// 网络报警器
		'7': 'select_power_network_alarm_for_model_bind',		// 高压电网
		'15': 'select_rfid_alarm_for_model_bind',				// RFID基站
		'17': 'select_wireless_alarm_master_for_model_bind'		// 无线报警主机
    };
    function modelDeviceData(param){
    	var modelObj = {
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
            }
    	return modelObj;
    };
    function modelBinding(){
    	var item = dialog.top.open({
			id : 10004,
			type : 2,
			title : '设备模型绑定列表',
			top : 90,
			url : 'page/map/modelBinding/modelBinding.html'
		});
    };
    var dvc_id = location.search.replace('?', '').split('=')[1];
    var sqlIdMdel;
    var zTreeObj;
    var model
    function modelFn(param){
    	model=new tpl({
            el:'#infolist',
            data:{
                modelDevice: param?param[0] : modelDeviceData(),
                modelData:[]
            },
            watch: {
                'modelDevice.dmb_dvc_type': function (val) {
                	this.modelDevice.dmb_dvc_id = '';
                	this.modelDevice.dmb_dvc_name = '';
                	modelQuery = true;
                }
            },
            methods:{
                close:function(){//取消按钮
                	currentClose()
                },
                closeTerr:function(){//隐藏ztree
                	$('#terrPanel').fadeOut(100);
                },
                preserve:function(){/*新增保存*/
                    preserve();
                },
                modelNameDvc:function(){
            		if(this.modelDevice.dmb_model_name == ''){
            			message.alert('请选择模型');
                    }
                },
                modelNameClick:function(){
                	if(this.modelDevice.dmb_dvc_type){
                		$('#terrPanel').fadeIn(100);
                		if(modelQuery){
                			modelQuery = false;
                			query($('#terr'));
                		}
                	}else{
                		message.alert('请选择设备类型');
                		return;
                	}
                },
                modelTypeClick:function(){
                	$('div.combox_dev').show();
                },
                modelAClick:function(e,key){
                	this.modelDevice.dmb_dvc_type_name = key.name;
                	this.modelDevice.dmb_dvc_type = key.id;
                	e.target.classNmae = 'combox_dev_a';
                	$('div.combox_dev').hide();
                }
            }
        });
    }
    
    $('div.divInput').on('mouseleave',function(){
		$('div.combox_dev').hide();
	});
    //树形设置
	var setting = {
			data: {
				simpleData:{enable:true,pIdKey:'pid',idKey:'id'}
			},
			callback: {
				onClick: function (event, treeId, treeNode, chickFlag) {
					if(treeNode.type == 1){
						queryArea(treeNode)
						treeNode.type = 2;
					}
				},
				onDblClick: function (event, treeId, treeNode, reload) {
					if(treeNode.type == 0){
						model.modelDevice.dmb_dvc_id = treeNode.id.split('_')[1];
						model.modelDevice.dmb_dvc_name = treeNode.name;
						$('#terrPanel').fadeOut(100);
					}
				}
			}
		};
	/*初始化树  获取区域*/
	function query(tree){
		db.query({
			request:{
				sqlId:'select_dptt_tree_for_model_bind',
				whereId: 0,
				params: [login.cusNumber]
			},success:function(data){
				zTreeObj = $.fn.zTree.init(tree, setting, data);
			}
		});
	}
	/* 获取设备*/
	function queryArea(network){
		db.query({
			request:{
				sqlId: sqlMap[model.modelDevice.dmb_dvc_type],
				whereId: 1,
				params: {
					cus_number:login.cusNumber,
					dept_id:network.id
				}
			},success:function(data){
				var dataS = [];
				data.forEach(function(item,index){
					item.id = 'z_'+item.id;
					dataS.push(item);
				})
				zTreeObj.addNodes( network, -1, dataS);
			}
		});
	}
   /*重置输入框*/
    function reset(){
        model.modelDevice = modelDeviceData();
    }
    //添加修改
    function preserve(){
        //console.log(model.modelDevice);
        if(validate(true))return;
        var sql,request;
        if(first){/*修改*/ 
           db.updateByParamKey({
                request:{
                    sqlId:"delete_map_device_model_bind",
                    params:{dmb_dvc_id:dvc_id,dmb_cus_number:login.cusNumber}
                },
                success:function(data){
                	modelBind(function(){
                		message.confirm("修改成功,是否继续操作？",function(){
                   		 currentClose()
                        },function(){
                       	 hzEvent.unsubs('maphandle.pickup.model', 'modelBindingAdd');
                       	 dialog.curClose();
                        });
                	})
                },
                error:function(data,respMsg){
                    message.alert(respMsg);
                }
            });
        }
        else{/*新增*/
            modelBind(function(){
            	message.confirm("保存成功,是否继续操作？",function(){
                  	reset();
                },function(){
                	currentClose()
                });
            })
        }
    };
    /*
     * 验证
     * */
    function validate(flag){
        if(flag){
            return !model.modelDevice['dmb_model_name'] != ''&&!message.alert("请获取模型")||
                !model.modelDevice['dmb_dvc_name'] != ''&&!message.alert("请选择设备");
        }
    }
    /*
     * 保存  设备模型绑定
     * */
    function modelBind(fn){
    	judge(model.modelDevice.dmb_dvc_id,function(data){
    		/*判断该设备已进行过绑定*/
        	if(data <= 0){
             	message.saving();
                 db.updateByParamKey({
                     request:{
                         sqlId:"insert_map_device_model_bind",
                         params:model.modelDevice
                     },
                     success:function(data){
                    	 fn(data);
                     },
                     error:function(data,respMsg){
                         message.alert(respMsg);
                     }
                 });
             }else{
             	message.alert('该设备已与'+data[0].dmb_model_name+'绑定,不能再次绑定');
             }
    	});
    };
    /*
     * 获取已绑定设备
     * @id 设备id
     * @fn 回调函数
     * */
    function judge(id,fn){
    	db.query({
        	request:{
                sqlId:'query_map_device_model_bind',
                whereId:'2',
                params:{
                	dmb_cus_number:login.cusNumber,
                	dmb_dvc_id:id
                }
            },
            success:function(data){
            	fn(data);
            },
            error:function(data,respMsg){
                message.alert(respMsg);
            }
        });
    }
    /*编辑 || 新增*/
    if(dvc_id){
    	judge(dvc_id,function(data){
    		first = true;
        	modelFn(data);
    	})
    }else{
    	first = false;
    	modelFn();
    }
    /*
	 * 加载报警设备类型
	 * @returns
	 */
	function loadDeviceTypes(){
		db.query({
			request: {
				sqlId:'select_constant_bycode', whereId:0, params:['securityDeviceType']
			},
			success: function (data) {
				var list = [];
				// 标记不支持的报警设备
				for(var i = 0; i < data.length; i++) {
					if (sqlMap[data[i].id]) {
						list.push(data[i]);
					}
				}
				model && (model.modelData = list);
			}
		});
	}
	loadDeviceTypes();
	/*关闭当前窗口*/
	function currentClose(param){
		if(first){
        	modelBinding();
        	dialog.curClose();
        }else{
        	if(!param){
    			dialog.curClose();
    		}
        }
		hzEvent.unsubs('maphandle.pickup.model', 'modelBindingAdd');
	};
	/*获取模型名称*/
    hzEvent.subs('maphandle.pickup.model', 'modelBindingAdd', function (modelObj) {
    	var modelName = mapHandle.getModelName(modelObj) || modelObj.name;
    	model.modelDevice.dmb_model_name = modelName;
    });
    /*页面关闭前执行的事件*/
    window.onbeforeunload = function () { 
    	currentClose(1);
    };
});