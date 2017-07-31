define(function(require){
	var $ = require('jquery');
	var vue = require('vue');
	var db = require('frm/hz.db');
	var treeSelect = require('ztree');
	var table = require('frm/table');
	var dialog = require('frm/dialog');
	var tip = require('frm/message');
	var modelUtil = require('frm/model');
	var util = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var select = require('frm/select');
	var treeSelect = require('frm/treeSelect');
	var video = require('frm/hz.videoclient');
	
	
	var vm=new vue({
		el:"#app",
		data:{
			dataList:{
				vrd_title:'',
				vrd_start_time:'',
			    vrd_end_time:'', 
			    vrd_duration:'',
			    vrd_remark:'',
			    vrd_place:'',
			    vrd_path:'',
			    vrd_file_name:'',
			    vrd_img_name:'',
			    vrd_format_type:'',
			    vrd_format_type_name:'',
			    vrd_type:'',
			    vrd_type_name:'',
			    vrd_state:'',
			    vrd_flag:'', 
			    vrd_create_user:'',
			    vrd_create_time:'',
			    vrd_update_user:'',
			    vrd_update_time:''
			}
		},
		methods:{
			add:function(){
				openDetailWindow();
			},
			del:function(){
				
			}
		}
	})
	
	function openDetailWindow(){
		dialog.top.open({
			id:10002,
			type:2,
			title:'录像详情',
			w:55,
			h:60,
			top:90,
			url:'page/cds/video/videoPlayCut.html'
		});
	}
	
	// table表
	table.init("table", {
				request : {
					sqlId : 'select_video_record',
//					whereId : 1,
					orderId : '0',
					params : {
						vrd_cus_number : loginUser.cusNumber,
						user_id : loginUser.userId
					}
				},
				columns : [[{
					field : 'state',
					checkbox : true
				},
				{
					title:"标题",
					field:"vrd_title",
					align:"center",
					valign:"middle"
				},
				{
					title:"录制时长",
					field:"vrd_duration",
					align:"center",
					valign:"middle"
				},
				{
					title:"记录人",
					field:"ubd_name",
					align:"center",
					valign:"middle"
				},
				{
					title:"事件类型",
					field:"vrd_type_name",
					align:"center",
					valign:"middle"
				},
				{
					title:"视频格式类型",
					field:"vrd_format_type_name",
					align:"center",
					valign:"middle",
					visible:false
				},
				{
					title:"开始时间",
					field:"vrd_start_time",
					align:"center",
					valign:"middle",
					visible:false
				},
				{
					title:"结束时间",
					field:"vrd_end_time",
					align:"center",
					valign:"middle",
					visible:false
				},
				{
					title:"创建时间",
					field:"vrd_create_time",
					align:"center", 
					valign:"middle",
					visible:false
				}]],
				onClickRow : function(row) {
					window.top.videoPlayInfoTableRow = row;
					window.top.videoPlayInfoTable = table;
					openDetailWindow();
				},
				onLoadSuccess : function(data) { 
					vm.dataList = data.rows;
				}
			});
	
	//删除
	$("#del").on('click',function(){
		if(window.parent.$("#10002").length){
			
			if(!window.parent.$("#10002").parent().is(':hidden')){
				tip.alert("请先关闭编辑窗口");
				return;
			}
		}
		
		
		var list=table.method("getSelections");
		if(!list.length){
			tip.alert("请先选择要删除的项目");
			return;
		}
		
		
		
		var flag = false;
		var title = '';
		$.each(list, function(idx, item){
			if (item.vrd_state == 2) {
				flag = true;
				title = item.vrd_title;
				return false;
			}
		})
		if (flag) {
			tip.alert(title + "已经被引用,不能被删除");
			return;
		}
		
		//删除
		tip.confirm("确认删除吗？",function(index){
			db.updateByParamKey({ 
				request:{
					sqlId:'delete_video_record',
					whereId:0,
					params:list
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
	})
	
	
})