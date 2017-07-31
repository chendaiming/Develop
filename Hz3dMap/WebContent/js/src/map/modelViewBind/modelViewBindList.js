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
	
	var parentDialog;
	
	var model=new vue({
		el:'#mvb_list_con',
		data:{
			main:{
				mvb_model_id:'',
				mvb_model_name:''
			},
			search:{
				mvb_model_id:'',
				mvb_model_name:'',
				mvb_cus_number:login.cusNumber
			}
		},
		watch:{
			'search.mvb_model_id':function(val,oldVal){
				refreshTable();
			},
			'search.mvb_model_name':function(val,oldVal){
				refreshTable();
			}
			
		},
		methods:{	
			deleteInfo:function(){
				var list = table.method("getSelections");
				if (!list.length) {
					tip.alert("请先选择要删除的项目");
					return;
				}
				if($("#editPanel_con").length){
					if(!$("#editPanel_con").parent().is(":hidden")){
						tip.alert("请先关闭编辑窗口");
						return;
					}
				}
				var temp = [];
				for (var i = 0, leg = list.length; i < leg; i++) {
					temp.push({
						mvb_model_id : list[i].mvb_model_id
					});
				}
				
				tip.confirm('确定要删除该记录吗？',function(){
					db.updateByParamKey({
	                    request:{
	                        sqlId:'delete_mvb_map_list',
	                        params:temp
	                    },
	                    success:function(data){
	                    	tip.alert('删除成功');
	                    	$("#table").bootstrapTable("refresh");
	                    }
	                });
				});
			},
			resetSearch:function(){
				model.search.mvb_model_id = '';
				model.search.mvb_model_name = '';
				refreshTable();
			}
		},
	});
	
   window.onbeforeunload = function () {
    	hzEvent.unsubs('refreshMvbTable', 'modelViewBindRefresh');
    }
	hzEvent.subs('refreshMvbTable', 'modelViewBindRefresh', function () {
		parentDialog.querySelector('a.layui-layer-max').click();
		table.method('refresh');
		tip.alert("操作成功")
		
    });
	
	
	//初始化表格
	var initTable = function(){
		table.init("table",{
			request:{
				sqlId:'query_mvb_map_list',
				params:{'mvb_cus_number':login.cusNumber}
			},
			searchOnEnterKey:true,
			searchAlign:'right',
			showColumns:true,
			showRefresh:false,
			columns: [[  
						{field : 'state',checkbox : true},
						{title: "模型编号",field:'mvb_model_id',align:'center',valign:'middle'},
						{title: '模型名称',field: 'mvb_model_name',align: 'center',valign: 'middle'},
						{title: '视角坐标X',field: 'mvb_pos_x',align: 'center',valign: 'middle'},
						{title: '视角坐标Y',field: 'mvb_pos_y',align: 'center',valign: 'middle'},
						{title: '视角坐标Z',field: 'mvb_pos_z',align: 'center',valign: 'middle'},
						{title: '视角角度X',field: 'mvb_rot_x',align: 'center',valign: 'middle',visible: false},
						{title: '视角角度Y',field: 'mvb_rot_y',align: 'center',valign: 'middle',visible: false},
						{title: '视角角度Z',field: 'mvb_rot_z',align: 'center',valign: 'middle',visible: false},
						{title: '视角目标点X',field: 'mvb_tar_x',align: 'center',valign: 'middle',visible: false},
						{title: '视角目标点Y',field: 'mvb_tar_y',align: 'center',valign: 'middle',visible: false,
							formatter: function (value,row,index) {
		                	 return '<div class="ellipsis" style="width: 40px;" title="' + value + '">' + value + '</div>';
		                }},
						{title: '视角目标点Z',field: 'mvb_tar_z',align: 'center',valign: 'middle',visible: false,
							formatter: function (value,row,index) {
			                	 return '<div class="ellipsis" style="width: 40px;" title="' + value + '">' + value + '</div>';
			                }
						}
		              ]],
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
	        	 rMenuVue.bindTab('#table');
	         },
	         onClickRow:function(row){

	         },
	         onDblClickRow:function(row){
	        	 loadEditDialog(row);
	         }
		});
	}
	
	
	initTable();
	
	/*
	 * TODO: 右键菜单 -----------BEGIN
	 */
	var rMenuVue = new vue({
		el: '.right-menus',
		data: {
			rm: $('.right-menus'),
			row: null,
			vStts: false
		},
		methods: {
			rmShow: function (row, pos) {
				pos.left += 5;
				pos.top += 5;

				if (row.mri_status == 1) {
					this.vStts = false;
				} else {
					this.vStts = true;
				}
				this.row = row;
				this.rm.fadeIn(300);
				this.rm.css(pos);
			},
//			rmDetail:function(){
//				this.rmHide();
//				loadEditData(this.row,false,'detail');
//			},
			rmHide: function () {
				this.rm.fadeOut(200);
			},
			rmDel: function () {
				this.rmHide();
				var list = this.row;
				tip.confirm('确定要删除该记录吗？',function(){
					db.updateByParamKey({
	                    request:{
	                        sqlId:'delete_mvb_map_list',
	                        params:{mvb_model_id:list.mvb_model_id}
	                    },
	                    success:function(data){
	                    	tip.alert('删除成功');
	                    	$("#table").bootstrapTable("refresh");
	                    	hzEvent.emit('deleteMvbTableList');
	                    }
	                });
				});
				
			},
			rmEdit: function () {
				this.rmHide();
				var list = this.row;			
				loadEditDialog(list);
				
  				
			},
			bindTab: function (selector) {
				$(selector).find('>tbody >tr').each(function (i) {
					var rowData = table.method('getData')[i];
					if (rowData) {
						// 通过鼠标按下来模拟表格的右键事件
						$(this).on('mouseup', function (e) {
				    		if (e.button == 2) {
				    			rMenuVue.rmShow(rowData, {'top': window.event.clientY, 'left': window.event.clientX});
				    		}
				    	});
					}
				});
			}
		}
	});

	rMenuVue.rm.on('mousedown', function () {
		event.stopPropagation();
	});

	$(window).on('mousedown', function () {
		rMenuVue.rm.hide();
	});
	// 右键菜单 -----------END
	
	function loadEditDialog(list){
		var item = dialog.top.open({
			id : 10002,
			type : 2,
			title : '编辑',
			modal:true, 
			w:'400',
			h:'250',
			top:80,
			closeBtn:0,
			url : 'page/map/modelViewBind/modelViewBindAdd.html?id='+list.mvb_model_id,
			success:function(layero, index){
				alert('success');
			}
		});
		hzEvent.emit('modelViewBindEditId',list.mvb_model_id);
//		hzEvent.one('modelViewBindEditIdOne',function(){
//			return list.mvb_model_id;
//		})
			if(item.index){
				showIndex = item.index; 
			}
			parentDialog = window.frameElement.parentNode.parentNode;
			parentDialog.querySelector('a.layui-layer-min').click();
	}
	
	function refreshTable(){
		table.method('refresh',{request:{
            whereId:'0', 
            params:model.search
        }});
	}
	

	
	function validate(){
		return  !model.bean.mri_material_name && !tip.alert("请输入物资名称");
				
	}
	
});	