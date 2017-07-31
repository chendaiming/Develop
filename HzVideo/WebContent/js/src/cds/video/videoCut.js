define(function(require){
	var $ = require('jquery');
	var select = require('frm/select');
	var vue = require('vue');
	var treeUtil = require('frm/treeUtil');
	var loginUser = require('frm/loginUser');
	var db = require('frm/hz.db');
	var message = require('frm/message');
	var treeSelect = require("frm/treeSelect");
	var hzUtils = require("frm/hz.utils");
	var videoClient = require('frm/hz.videoclient');
	var hzEvent = require('frm/hz.event');
	
	var vm = new vue({
		el:'body',
		data:{
			searchTree:'',
			videoCut:{
				vcd_cus_number:loginUser.cusNumber,
				vcd_cut_id:'',
				vcd_push_user:[],
				vcd_push_user_name:[],
				vcd_title:'测试地点_'+hzUtils.formatterDate(new Date(),'yyyy-mm-dd')+'_'+String(new Date().getTime()).substring(5,11),
				vcd_record_user:loginUser.userId,
				vcd_record_user_name:loginUser.userName,
				vcd_time:hzUtils.formatterDate(new Date(),'yyyy-mm-dd hh:mi:ss'),
				vcd_place:'测试地点',
				vcd_problem_type:'',
				vcd_detail:'',
				vcd_file_type:'1',
				vcd_use_status:'2',
				vcd_cut_url:''
			}
		},
		methods:{
			reset:function(){
				reset();
			},
			startVideoCut:function(){
				videoClient.getVideoWindowIndex();
			},
			saveVideoCut:function(){
				if(!validateInfo()) {
					return;
				}
				//保存视频截图信息
				saveVideoCutInfo();		
			},
			pushVideoCut:function(){
				
			}
			

		}
	});
	
	//验证信息
	function validateInfo(){
		var flag = true;
		if(!vm.videoCut.vcd_title){
			message.alert("请输入标题");
			flag = false;
		}
		if(!vm.videoCut.vcd_detail){
			message.alert("请输入详细描述");
			flag = false;
		}
		return flag;
	}
	
	//保存视频截图信息
	function saveVideoCutInfo(){
		db.updateByParamKey({
			request: [{
				sqlId:"insert_video_cut_info",
				params:vm.videoCut
			}],
			success: function (data) {
				message.alert('保存成功');	
			},
			error: function (code, msg) {
				message.close(msg);
			}
		});			
	}
	

	//初始化视频截图
	function initVideoCut(index){
		//获取记录地点
		var place = hzEvent.call('get.video.cut.place');
		//视频截图名称
		var fileName = place+'_'+hzUtils.formatterDate(new Date(),'yyyy-mm-dd')+'_'+'截图'+'_'+new Date().getTime().substring(6);
		videoClient.videoCut(index,fileName);
	}
	
	//视频客户端订阅
	videoClient.webmessage.off("VIDEO026","VIDEO026");
	videoClient.webmessage.on('VIDEO026','VIDEO026',function(data){
		console.log(data);
	});
	
	//视频截图返回
	videoClient.webmessage.off("VIDEO019","VIDEO019");
	videoClient.webmessage.on('VIDEO019','VIDEO019',function(data){
		console.log(data);
	});

	//发送视频窗体索引指令
	videoClient.getVideoWindowIndex();
});