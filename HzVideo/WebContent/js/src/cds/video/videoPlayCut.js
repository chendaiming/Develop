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
	
	
	var tableOut=window.top.videoPlayInfoTable;
	
	var vm = new vue({
		el:'body',
		data:{
			searchTree:'',
			videoCut:{
				vrd_cus_number : loginUser.cusNumber,
				user_id : loginUser.userId,
				vrd_title:'',
				vrd_id:'',
				vrd_start_time:'',
			    vrd_end_time:'', 
			    vrd_duration:'',
			    vrd_remark:'',
			    vrd_place:'',
			    vrd_path:'',
			    vrd_file_name:'',
			    vrd_img_name:'',
			    vrd_format_type:'',
			    vrd_type:'1',
			    vrd_state:1,
			    vrd_flag:'', 
			    vrd_create_user:'',
			    vrd_create_time:'',
			    vrd_update_user:'',
			    vrd_update_time:''
			},
			img_url : '截图地址' + this.vrd_img_name,
			dataRow:[],
			playVideoPng:"image/start.png"
		},
		created:function(){
			
			var params = hzEvent.call('get.video.record.params');
			if (params) {
			    
				this.videoCut.vrd_title = params.title;
				this.videoCut.vrd_start_time = params.startTime;
			    this.videoCut.vrd_end_time = params.endTime;
			    this.videoCut.vrd_duration = params.duration;
			    this.videoCut.vrd_place = params.place;
			    this.videoCut.vrd_path = params.filePath;
			    this.videoCut.vrd_file_name = params.fileName
			    this.videoCut.vrd_img_name = params.imgName
			    this.videoCut.vrd_format_type = params.formatType
			} else {
				var list=window.top.videoPlayInfoTableRow;
				if(list){
					this.videoCut=list
				}
			}
			
			
		},
		methods:{
			reset:function(){
				reset();
			},
			startVideoCut:function(){
				videoClient.getVideoWindowIndex();
			},
			hoverPng:function(){
				vm.playVideoPng='image/start_hover.png'
			},
			leavePng:function(){
				vm.playVideoPng='image/start.png' 
			},
			saveVideoCut:function(){
				if(!validateInfo()) {
					return;
				}
				
				if (!vm.videoCut.vrd_id) {
					db.updateByParamKey({
						request:{
							sqlId:'insert_video_record',
							params:vm.videoCut							
						},
						success: function (data) {
							if(data){
								message.alert("保存成功");
								setTimeout("window.top.$('#10002').parent().find('.layui-layer-close').trigger('click')",800)
								//window.top.$("#10002").parent().find('.layui-layer-close').trigger('click');
								tableOut.method("refresh");
							}
							
						},
						error: function (code, msg) {
							message.close(msg);
						}
					})
				} else {
					db.updateByParamKey({
						request:{
							sqlId:'update_video_record',
							whereId:'0',
							params:{
								'vrd_title':vm.videoCut.vrd_title,
								'vrd_remark':vm.videoCut.vrd_remark,
								'vrd_type':vm.videoCut.vrd_type,
								'user_id':loginUser.userId,
								'vrd_cus_number':loginUser.cusNumber,
								'vrd_id':vm.videoCut.vrd_id
							}
							
						},
						success: function (data) {
							if(data){
								message.alert("保存成功");
								setTimeout("window.top.$('#10002').parent().find('.layui-layer-close').trigger('click')",800)
								//window.top.$("#10002").parent().find('.layui-layer-close').trigger('click');
								tableOut.method("refresh");
							}
							
						},
						error: function (code, msg) {
							message.close(msg);
						}
					})
				}
				
			},
			pushVideoCut:function(){
				
			},
			playVideo : function(){
				var _this = this;
				videoClient.downloadFile('serverIp', 'port', 'userName', 'password', _this.videoCut.vrd_path, _this.videoCut.vrd_file_name, function(data){
					videoClient.playVideoFile('-1', _this.videoCut.vrd_format_type, _this.videoCut.vrd_path + _this.videoCut.vrd_file_name, function(data){
						
					})
				})
				
			}

		}
	});
	
	//验证信息
	function validateInfo(){
		if (vm.videoCut.vrd_state == 2) {
			message.alert("该记录已经被引用,不能被修改");
			return false;
		}
		if(!vm.videoCut.vrd_title){
			message.alert("请输入标题");
			return false;
		}
		if(vm.videoCut.vrd_title.length>40){
			message.alert("标题过长，不得超过40个字");
			return false;
		}
		if(!vm.videoCut.vrd_remark){
			message.alert("请输入详细描述");
			return false;
		}
		if(vm.videoCut.vrd_remark.length>120){
			message.alert("描述过长，不得超过120个字");
			return false;
		}
		return true;
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