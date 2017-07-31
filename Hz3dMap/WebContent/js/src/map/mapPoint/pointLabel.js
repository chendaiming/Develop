define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/message","frm/model","frm/select","frm/loginUser",'hz/map/map.handle','frm/hz.event',"frm/treeSelect","frm/model"],
		  function($,vue,db,table,dialog,message,modelData,select,user,mapHandle,hzEvent,treeSelect,modelData){
	 	var flag=false,type=false; 
	 	var position, modelObj;

		//创建模型
		var model=new vue({
			el:'#labelPanel',
			data:{
				img: '',
				icons:[
				    {id:'icon01', name: '无', image:''},
					{id:'icon02', name: '楼栋', image:'css/images/building.png'},
					{id:'icon03', name: '监舍', image:'css/images/room.png'}
				],
				openFlag:false,
				selectedIcon: null,
				labelData:{ 
					   'lpi_cus_number':user.cusNumber,
					   'lpi_point_id':'',
				       'lpi_link_type':'',
				       'lpi_link_id':'',
				       'lpi_link_name':'',
				       'lpi_show_text':'',
				       'lpi_show_icon':'',
				       'lpi_line_height':'0',
				       'lpi_dis_min':'10',
				       'lpi_dis_max':'100000',
				       'lpi_pos_x':'',
				       'lpi_pos_y':'',
				       'lpi_pos_z':'',
				       'lpi_point_type':'',
				       'lpi_view_id':'',
				       'lpi_bind_model':'',
				       'lpi_view_pos_x':'',
				       'lpi_view_pos_y':'',
				       'lpi_view_pos_z':'',
				       'lpi_view_rot_x':'',
				       'lpi_view_rot_y':'',
				       'lpi_view_rot_z':'',
				       'lpi_view_tar_x':'',
				       'lpi_view_tar_y':'',
				       'lpi_view_tar_z':'',
				       'lpi_create_uid':user.userId,
				       'lpi_update_uid':user.userId
				}
			},
			watch:{
				'selectedIcon': function () {
					this.labelData.lpi_show_icon = this.selectedIcon.image;
				},
				'labelData.lpi_show_icon':function(){
					if (this.labelData.lpi_show_icon) {
						this.img = basePath + this.labelData.lpi_show_icon;
					} else {
						this.img = '';
					}
					refreshPoint();
				},
				'labelData.lpi_show_text':function(){
					refreshPoint();
				}
			},
			methods:{
				operLabel:function(){
					if(!model.labelData.lpi_show_text){
						message.alert('请输入标注名称');
						return;
					}
					if(model.openFlag){
						model.openFlag = false;
						stopLabel();
						removeLabel();
					}else{
						message.alert('请选择标注模型');
						model.openFlag = true;
						startLabel();
						
					}
				},
				addLabel:function(){
					var p=window.frameElement.parentNode.nextElementSibling.children;
					p[0].click();
					//开启点位标注
					dialog.top.open({
						id:10002,
						type:2,
						title:'新增点位标注',
						w:23,
						h:40,
						top:100,
						url:'page/map/mapPoint/pointLabelAdd.html',
						closeCallback:function(){
							console.log('关闭点位标注');
							stopLabel();
							removeLabel();
						}
					});
				},
				saveLabel:function(){
					if(!model.labelData.lpi_link_type){
						message.alert('请选择关联类型');
						return;
					}
					if(!model.labelData.lpi_point_type){
						message.alert('请选择点位类型');
						return;
					}
					if(!model.labelData.lpi_show_text){
						message.alert('请输入标注名称');
						return;
					}

					if(!model.openFlag){
						message.alert('请先标注');
						return;
					}
					
					if(!modelObj){
						message.alert('请先在地图上添加点位');
						return;
					}

					var view = mapHandle.curViewMenu;
					var point = mapHandle.getViewPoint();

					if(view){
						model.labelData.lpi_view_id = view.id;
					}

					model.labelData.lpi_view_pos_x = point.posX;
					model.labelData.lpi_view_pos_y = point.posY;
					model.labelData.lpi_view_pos_z = point.posZ;
					model.labelData.lpi_view_rot_x = point.rotX;
					model.labelData.lpi_view_rot_y = point.rotY;
					model.labelData.lpi_view_rot_z = point.rotZ;
					model.labelData.lpi_view_tar_x = point.tarX;
					model.labelData.lpi_view_tar_y = point.tarY;
					model.labelData.lpi_view_tar_z = point.tarZ;
					
					model.labelData.lpi_pos_x = position.x;
					model.labelData.lpi_pos_y = position.y;
					model.labelData.lpi_pos_z = position.z;
					model.labelData.lpi_bind_model = (modelObj && modelObj.name);

					//保存入库
					savePointLabel();
				},
				delLabel:function(){
					var list=table.method("getSelections");
					if(!list.length){
						message.alert("请先选择要删除的项目");
						return;
					}
					list=list.map(function(item){
						return {
							'lpi_point_id':item.lpi_point_id
						}
					});
					//删除
					message.confirm("确认删除吗？",function(index){
						db.updateByParamKey({ 
							request:{
								sqlId:'delete_point_label_info',
								params:list
							},
							success:function(){
								message.alert("删除成功");
								table.method("refresh");
							},
							error:function(data,respMsg){
								message.alert(respMsg);
							}
						});
					});
				},
				reset: resetData
			}
				
		});
		
		//table表
		table.init("table",{
			request:{
				sqlId:'select_point_label_list',
				whereId:'0',
				params:{
					lpi_cus_number:user.cusNumber
				}
			},
			search:{
				key:'lpi_show_text',
				whereId:'1',
				params:{
					lpi_cus_number:user.cusNumber
				}
			},
			columns: [[
				{field: 'state', checkbox: true},
				{title: '关联类型', field: 'lpi_link_type', align: 'center', valign: 'middle'},
				{title: '关联区域', field: 'lpi_link_name', align: 'center', valign: 'middle'},
				{title: '点位类型', field: 'lpi_point_type', align: 'center', valign: 'middle'},
				{title: '显示名称', field: 'lpi_show_text', align: 'center', valign: 'middle',
					formatter:function(value,row,index){
						$(document).on('click','#point_'+row.lpi_point_id,function(){
							var p=window.frameElement.parentNode.nextElementSibling.children;
							p[0].click();
							require(['hz/map/map.handle'],function(hzMap){
								hzMap.location(null,{
									posX: row.lpi_view_pos_x, posY: row.lpi_view_pos_y, posZ:row.lpi_view_pos_z, rotY: row.lpi_view_rot_y,
									rotX: row.lpi_view_rot_x, rotZ: row.lpi_view_rot_z, tarX: row.lpi_view_tar_x, tarZ: row.lpi_view_tar_z,
									tarY: row.lpi_view_tar_y});
							})
						})
						return value+'<img id="point_'+row.lpi_point_id+'" src="icon/location.png" title="定位" style="cursor: pointer" />';
					}
				},
				{title: '显示图标', field: 'lpi_show_icon', align: 'center', valign: 'middle'}
			]],
	         onClickRow:function(row){
	 			 
	         }
		});

		/**
		 * 刷新点位标识
		 */
		function refreshPoint(){
			addLabel(position, modelObj);
		}
		
		/**
		 * 点位添加页面刷新表格页面
		 */
		hzEvent.on('refresh.point.label.table',function(){
			table.method("refresh");
		})

		/**
		 * 重置
		 */
		function resetData(){
			modelData.clear(model.labelData,{
				'lpi_cus_number':user.cusNumber,
				'lpi_show_icon': '',
				'lpi_line_height':'0',
				'lpi_dis_min':'10',
			   	'lpi_dis_max':'100000',
			   	'lpi_create_uid':user.userId,
			   	'lpi_update_uid':user.userId
			});
			modelObj = null;
		}

		/**
		 * 保存点位标识
		 */
		function savePointLabel(){
			db.updateByParamKey({ 
				request:{
					sqlId:'insert_point_label_info',
					params:model.labelData
				},
				success:function(){
					message.alert("添加成功");
					model.openFlag = false;
					hzEvent.call('refresh.point.label.table');
					//关闭编辑状态
					stopLabel();
					removeLabel();
					resetData();
				},
				error:function(data,respMsg){
					message.alert(respMsg);
				}
			});
		}


		/**
		 * 开启点位标注
		 */
		function startLabel() {
			mapHandle.label.enabled(function (_position, _modelObj) {
				if(_modelObj){
					position = _position;
					modelObj = _modelObj;
					addLabel(position, modelObj);
				}else{
					message.alert('请选择房屋');
				}
			});
		}

		/**
		 * 关闭点位标注
		 */
		function stopLabel() {
			mapHandle.label.disabled();
			position = null;
		}

		/**
		 * 添加点位标注
		 */
		function addLabel(position, modelObj) {
			var icon = model.labelData.lpi_show_icon;

			if (icon) {
				icon = basePath + icon;
			}

			removeLabel();
			if (position) {
				mapHandle.label.add({
					id: '20170112',
					text: model.labelData.lpi_show_text,
					image: icon,
					className: '',
					minDis: 10,
					maxDis: 100000,
					position: position
				}, {
					click: function (event) {
						console.log(event);
					}
				});
			}
		};

		/**
		 * 移除点位标注
		 */
		function removeLabel() {
			mapHandle.label.remove('20170112');
		}
});