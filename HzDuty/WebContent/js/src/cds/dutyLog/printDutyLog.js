define(['jquery','vue','frm/hz.db',"frm/table","frm/dialog","frm/message","frm/model","frm/loginUser","frm/datepicker"],
		function($,vue,db,table,dialog,tip,modelData,login){
	var date = new Date();
	var currentDay = (function(){return date.getFullYear()+"-"+((date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<10?('0'+date.getDate()):date.getDate())})();

	
	var  model=new vue({
		el:"#container",
		data:{
			main:{//主表字段
				cus_number:login.cusNumber,
				id:'',
				clm_date:currentDay,
				clm_regular_leader:'',
				clm_deputy_leader:'',
				user_id:login.userId
			},
			subs:[],
			first:{
				cld_clm_id:'',
				cld_begin_time:'', 
				cld_end_time:'',
				cld_handle_situation:'',
				cld_handle_sender:'',
				cld_handle_receiver:'',
				cld_device_situation:'',
				cld_device_sender:'',
				cld_device_receiver:''
			}
		},
		methods:{
			print:function(){
				$(".printBtn").hide();
				$(".form-horizontal").removeClass('overFlow');
				window.print();
				$(".printBtn").show();
				$(".form-horizontal").addClass('overFlow');
			}
		}
	});
	queryItemById();
	
	function queryItemById(){
		var id = getQueryString('id');
		var href = location.href.split('=');
		if (href && href.length > 1) {
			db.query({
				request : {
					sqlId : 'query_ctrl_log_main',
					whereId : '2',
					params : {
						cus_number : login.cusNumber,
						clm_id : id
					}
				},
				success : function(data) {
					var row = data[0];
					model.main.clm_date=row.clm_date;
					model.main.clm_regular_leader=row.clm_regular_leader;
					model.main.clm_deputy_leader=row.clm_deputy_leader;
				}
			})
			db.query({
				request : {
					sqlId : 'query_ctrl_log_detail',
					whereId : '0',
					orderId : '0',
					params : {
						cld_clm_id : id
					}
				},
				success : function(data) {
					model.first = data[0];
					data.splice(0,1);
					model.subs = data;
				}
			})
		}
	}

	
	function getQueryString(name) { 
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null; 
		} 
	

});