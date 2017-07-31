define(function(require){
	var $ = require('jquery');
	var db = require('frm/hz.db');
	var vue = require('vue');
	var tip = require('frm/message');
	var loginUser = require('frm/loginUser');
	var table = require('frm/table');
	var dialog = require('frm/dialog');
	
	/**
	 * 创建模型
	 */
	var model = new vue({
		el:'#prisonAreaDaily',
		data:{
			deptName: loginUser.deptName,
			daily:{ 
				'pad_cus_number':loginUser.cusNumber,
				'pad_prsn_area_idnty':loginUser.deptId,
				'pad_regtr_prsner':0,
				'pad_custody_prsner':0,
				'pad_large_prsner':0,
				'pad_back_rtal_prsner':0,
				'pad_probation_prsner':0,
				'pad_new_custody_prsner':0,
				'pad_released_prsner':0,
				'pad_death_prsner':0,
				'pad_report_people':loginUser.userId
			}
		},
		methods:{
			openAddPanel:function(order){
				dialog.open({targetId:'add_panel',title:'信息上报',w:"800",h:"290"});
			},
			report:function(order){
				var request=[{
	 				sqlId:'insert_prison_area_dtls',
	 				params:model.daily
	 			}];
				db.updateByParamKey({
	 				request:request,
	 				success:function(data){
	 					tip.close();
	 					tip.alert("上报成功");
	 					dialog.close();
	 					table.method("refresh",{request:{whereId:'0',params:{pad_cus_number:loginUser.cusNumber,pad_prsn_area_idnty:loginUser.deptId}}});
	 				}
	 			})
			}
		}
	});
	
	initTable();
	$(window).resize(function(){
		$("#tableDiv").empty();
		$("#tableDiv").append('<table id="table"></table>');
		initTable();
	})
	function initTable(){
		table.init("table",{
			request:{
				sqlId:'select_prison_area_dtls',
				whereId:'0',
				orderId:'0',
				params:{pad_cus_number:loginUser.cusNumber,pad_prsn_area_idnty:loginUser.deptId}
			},
			showColumns:false,
			columns: [[
			    {
	                title: '上报时间',
	                field: 'pad_report_time',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '在册罪犯人数',
	                field: 'pad_regtr_prsner',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '在押罪犯人数',
	                field: 'pad_custody_prsner',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '在逃罪犯人数',
	                field: 'pad_large_prsner',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '解回再审人数',
	                field: 'pad_back_rtal_prsner',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '监外执行人数',
	                field: 'pad_probation_prsner',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '新收押人数',
	                field: 'pad_new_custody_prsner',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '刑满释放人数',
	                field: 'pad_released_prsner',
	                align: 'center',
	                valign: 'middle'
	            },{
	                title: '罪犯死亡人数',
	                field: 'pad_death_prsner',
	                align: 'center',
	                valign: 'middle'
	            }
	         ]],
	         onClickRow:function(row){
	        	 
	         }
		});
	}
})