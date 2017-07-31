define(function(require){
	var $ = require("jquery");
	var vue = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var modelUtil = require('frm/model');	
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var table = require('frm/table');
	var select = require('frm/select');
	var hzEvent = require('frm/hz.event');
	var datepicker = require('frm/datepicker');
	
	var mapHandle = require('hz/map/map.handle');
	
	var model=new vue({
		el:'#modelViewAdd',
		data:{
			main:{
				mvb_model_id:'',
				mvb_cus_number:login.cusNumber,
				mvb_model_name:'',
				mvb_pos_x:'',
				mvb_pos_y:'',
				mvb_pos_z:'',
				mvb_rot_x:'',
				mvb_rot_y:'',
				mvb_rot_z:'',
				mvb_tar_x:'',
				mvb_tar_y:'',
				mvb_tar_z:''
			},
			editFlag:false,
			editId:''
		},
		watch:{
			editId:function(val,old){
				if(val){
					getItemById(val);
				}
				
			}
		},
		methods:{	
			saveModel:function(){
				if(!(model.main.mvb_model_id && model.main.mvb_model_name)){
					tip.alert('请填写模型名称并选择模型编号');
					return;
				}
				
				var sqlId='';
				if (model.editFlag){
					//编辑
					sqlId = 'update_mvb_map_table';
					
				}else{
					//新增
					sqlId = 'insert_mvb_map_table';
				}
				
				var list = mapHandle.getViewPoint();
				loadModelMain(list);
				db.updateByParamKey({
					request:{
						sqlId:sqlId,
						params:model.main
					},
					success:function(data){
						tip.alert("保存成功！");
						
						tip.confirm("保存成功是否继续操作",function(){
							if (model.editFlag){
								hzEvent.emit('refreshMvbTable');
								closeSelf();
							}else{
								model.main.mvb_model_name = '';
								model.main.mvb_model_id = '';
							}
						},function(){
							closeSelf();
							if (model.editFlag){
								hzEvent.emit('refreshMvbTable');
							}
							
						})
						
						
						
					},
					error:function(cd,msg){
						console.log(cd+msg);
						
						if(cd == 1002){
							tip.alert("该模型已存在请重新选择");
						}else{
							tip.alert("保存失败，请稍后再试");
						}
					}
				})
				
			},
			cancelModel:function(){
				resetModelMain();
				model.main.mvb_model_id = '';
				closeSelf();
				if (model.editFlag){
					hzEvent.emit('refreshMvbTable');
				}
			}
			
		},
	});
	
	function closeSelf(){
		var parentDialog = window.frameElement.parentNode.parentNode;
			parentDialog.querySelector('a.layui-layer-close').click();
	}
	
	function resetModelMain(){
		model.main.mvb_pos_x = '';
		model.main.mvb_pos_y = '';
		model.main.mvb_pos_z = '';
		model.main.mvb_rot_x = '';
		model.main.mvb_rot_y = '';
		model.main.mvb_rot_z = '';
		model.main.mvb_tar_x = '';
		model.main.mvb_tar_y = '';
		model.main.mvb_tar_z = '';
		model.main.mvb_model_name = '';
	}
	
	function loadModelMain(list){
		model.main.mvb_pos_x = list.posX;
		model.main.mvb_pos_y = list.posY;
		model.main.mvb_pos_z = list.posZ;
		model.main.mvb_rot_x = list.rotX;
		model.main.mvb_rot_y = list.rotY;
		model.main.mvb_rot_z = list.rotZ;
		model.main.mvb_tar_x = list.tarX;
		model.main.mvb_tar_y = list.tarY;
		model.main.mvb_tar_z = list.tarZ;
	}
	
    window.onbeforeunload = function () {
    	hzEvent.unsubs('maphandle.pickup.model', 'modelViewBindAdd');
    	hzEvent.unsubs('deleteMvbTableList', 'modelViewBindDel');
    	hzEvent.unsubs('modelViewBindEditId','modelViewBindEditId');
    }
	
	hzEvent.subs('maphandle.pickup.model', 'modelViewBindAdd', function (modelObj) {
    	var modelId = mapHandle.getModelName(modelObj) || modelObj.name;
    	model.main.mvb_model_id = modelId;
    	
    });

	hzEvent.subs('deleteMvbTableList', 'modelViewBindDel', function () {
		closeSelf();
    });
	
	hzEvent.subs('modelViewBindEditId','modelViewBindEditId',function(data){
		model.editId = data;
	})
	
	
//	model.editId = hzEvent.call('modelViewBindEditIdOne');
//	if(model.editId){
//		getItemById(model.editId);
//	}else{
//		model.main.mvb_model_name = '';
//		model.main.mvb_model_id = '';
//	}
	var href = location.href.split('=');
	if (href && href.length > 1) {
		model.editId = href[1];
		getItemById(model.editId)
	}else{
		model.editFlag = false;
		model.main.mvb_model_name = '';
		model.main.mvb_model_id = '';
	}
	
	
	
	function getItemById(param){
//		href = location.href.split('=');
//		if (href && href.length > 1) {
//			hzEvent.off('modelViewBindEditId');
		model.editFlag = true;
		db.query({
			request:{
				sqlId:'query_mvb_map_list',
				whereId:'1',
				params:{
					mvb_cus_number:login.cusNumber,
					mvb_model_id:param
				}
			},
			success:function(data){
				var list = data[0];
				model.main.mvb_model_id = list.mvb_model_id;
				model.main.mvb_model_name = list.mvb_model_name;
				var item = {};
				item = {
						posX : list.mvb_pos_x,
						posY : list.mvb_pos_y,
						posZ : list.mvb_pos_z,
						rotX : list.mvb_rot_x,
						rotY : list.mvb_rot_y,
						rotZ : list.mvb_rot_z,
						tarX : list.mvb_tar_x,
						tarY : list.mvb_tar_y,
						tarZ : list.mvb_tar_z
				}
				mapHandle.flyTo(item);
			}
		})
			
		
	}


	


	

	
});	