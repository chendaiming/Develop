define(function(require){
	var $ = require("jquery");
	var tpl = require('vue');
	var utils = require('frm/hz.utils');
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var tip = require('frm/message');
	var dialog = require('frm/dialog');
	var select = require('frm/select');
	var datepicker = require('frm/datepicker');
	
	var talkbackConfig = require('cds/talkback/talkbackConfig');
	
	var config = talkbackConfig.getConfig();//对讲服务配置信息
	var audio_path = 'http://' + config.tsd_ip + "/record/";  //录音文件存放路径
	var sound_record_url = config.tsd_http_url + "sound_record.json?";
	
	model=new tpl({
		el:'body',
		data:{
			caller :getCaller(),
			callee : '',
			call_type : 'unicast',
			auditionAudio : '',
			total : 0,
			records : [],
			callTypeList : {
				'broadcast' : '广播',
				'channel' : '频道',
				'unicast' : '对讲',
				'conference' : '会议',
				'record' : '录音',
				'spy' : '监听'
			},
			talkSimpleInfoList:[],
			cusNumber:login.cusNumber
		},
		methods:{
			audition:function(value){		//试听
				model.auditionAudio = audio_path + value;
				var obj = document.getElementById("audio-path")
				obj.load();
				dialog.open({targetId:'audio-div',title:'录音播放',h:'75px',w:'300',closeCallback:function(){
					//音乐窗口关闭回调
					document.getElementById("audio-path").pause();
				}});
				obj.play();
			}
		},
		watch:{
			caller:function(val){
				_httpGet(sound_record_url + 'caller='+val+'&call_type='+model.call_type);
			},
			call_type:function(val){
				_httpGet(sound_record_url + 'caller='+model.caller+'&call_type='+val);
			},
		}
	});
	/**
	 * 发送Http请求
	 */
	function _httpGet (url) {
		utils.ajax('itcTalkCtrl/httpGet', {'url':url}, function(json){
			var jsonobj = JSON.parse(json);
			formatRecordData(jsonobj.message);
			model.records = jsonobj.message;
			model.total = jsonobj.message.length;
		}, function(json){
			tip.alert('获取录音信息异常');
		});
	}
	
	function _talkSimpleInfo () {
			db.query({
				request: {
					sqlId: 'select_talkback_otherid_name',
					whereId: 0,
					params: [login.cusNumber]
				},
			success: function (data) {
				for(var i=0,j=data.length;i<j;i++){
					model.talkSimpleInfoList[data[i].id] =  data[i].name;
				}
				_httpGet(sound_record_url + 'caller='+model.caller+'&call_type='+model.call_type);
			},
			error: function (errorCode, errorMsg) {
				_httpGet(sound_record_url + 'caller='+model.caller+'&call_type='+model.call_type);
				message.alert(errorCode + ":" + errorMsg);
			}
		});
	}
	
	//加载对讲机第三方编号和名称对应信息
	_talkSimpleInfo();
	
	/**
	 * 格式化录音数据
	 */
	function formatRecordData(data){
		if(!data) return;
		for(var i=0;i<data.length;i++){
			if(data[i].call_type){
				data[i].call_type = model.callTypeList[data[i].call_type];
			}
			//格式化开始时间
			if(data[i].start_time) data[i].start_time = formatDate(data[i].start_time);
			//主叫
			data[i].caller = model.talkSimpleInfoList[data[i].caller] ? model.talkSimpleInfoList[data[i].caller]:data[i].caller;
			//被叫
			if(data[i].callees){
				data[i].callees = model.talkSimpleInfoList[data[i].callees] ? model.talkSimpleInfoList[data[i].callees]:data[i].callees;
			}
		}
	}
	
	/**
	 * 格式化对讲录音记录的日期(可能只适用于当前页面)
	 */
	function formatDate(date){
		return date.replace('T',' ').replace('+08:00','');
	}
	
	/*
	 * 获取当前用户关联的对讲主机
	 */
	function getCaller(){
		var hostInfo = talkbackConfig.getRelationHost();
		if(hostInfo.sus_value){
			return hostInfo.sus_value;
		}else{
			tip.alert('该用户尚未关联对讲主机');
			return '';
		}
	}
});