define(function(require){
	var $ = require("jquery");
	var db = require('frm/hz.db');
	var login =  require('frm/loginUser');
	var hzEvent = require('frm/hz.event');

	var talkbackConfig = {};
	var config = null;
	var configbyid = null;
	/** 数据库编号和第三方编号映射 idMapping[tbd_id]=tbd_other_id*/
	var idMapping = null;
	/**
	 * 获取当前机构下的对讲服务信息(默认条件)
	 * 返回id最小的配置信息
	 * return {
	 *   			tsd_cus_number:'机构编号',
	 *				tsd_id:'对讲服务ID',
	 *				tsd_name:'对讲服务名称',
	 *				tsd_type:'对讲服务类型'
	 *				tsd_ip: '对讲服务IP',
	 *				tsd_port:'对讲服务端口',
	 *				tsd_login_name:'登录用户名',
     *				tsd_login_pwd:'登录密码',
	 *				tsd_http_url:'http服务地址'
	 *        }
	 **/
	function _getConfig(){
		console.log('查询对讲服务配置信息...');
		if(config){
			return config;
		}
		db.query({
			request:{
				sqlId:'select_tbk_talkback_service_info',
				whereId:'0',
				orderId:'0',
				params:{'cusNumber':login.cusNumber}
			},
			async:false,
			success:function(data){
				if(data.length>0) config = data[0];
			},
			error:function(errorCode, errorMsg){
				console.error("获取对讲服务配置信息失败:" + errorMsg);
			}
		});
		return config; 
	}
	/**
	 * 根据id获取对讲服务配置信息
	 * return {
	 *   			tsd_cus_number:'机构编号',
	 *				tsd_id:'对讲服务ID',
	 *				tsd_name:'对讲服务名称',
	 *				tsd_type:'对讲服务类型'
	 *				tsd_ip: '对讲服务IP',
	 *				tsd_port:'对讲服务端口',
	 *				tsd_login_name:'登录用户名',
     *				tsd_login_pwd:'登录密码',
	 *				tsd_http_url:'http服务地址'
	 *        }
	 */
	function _getConfigByid(id){
		console.log('根据id: '+id+' 查询对讲服务配置信息...');
		if(configbyid){
			return configbyid;
		}
		db.query({
			request:{
				sqlId:'select_tbk_talkback_service_info',
				whereId:'1',
				params:{'cusNumber':login.cusNumber,'tsd_id':id}
			},
			async:false,
			success:function(data){
				if(data.length>0) configbyid = data[0];
			},
			error:function(errorCode, errorMsg){
				console.error("根据id获取对讲服务配置信息失败:" + errorMsg);
			}
		});
		return configbyid; 
	}
	/**
	 * 获取当前用户关联的对讲主机
	 * return {
	 *   			sus_record_id:'记录编号',
	 *				sus_value:'关联对讲主机第三方编号',
	 *				tbd_name:'关联对讲主机名称',
	 *				tbd_relation_service:'关联的对讲服务'
	 *        }
	 */
	function _getRelationHost(){
		var hostInfo = {};
		db.query({
			request:{
				sqlId:'select_user_host_setting',
				whereId:'0',
				params:{'cusNumber':login.cusNumber,'userId':login.userId}
			},
			async:false,
			success:function(data){
				if(data.length>0) hostInfo = data[0];
			},
			error:function(errorCode, errorMsg){
				console.error("获取用户关联对讲主机信息失败:" + errorMsg);
			}
		});
		return hostInfo;
	}
	/**
	 * 查询对讲ID映射
	 */
	function getIdMapping(){
		idMapping = new Object();
		db.query({
			request:{
				sqlId:'select_talkback_id_otherid_mapping',
				whereId:'0',
				params:{'cusNumber':login.cusNumber}
			},
			async:false,
			success:function(data){
				if(data && data.length>0){
					for(var i=0;i<data.length;i++){
						idMapping[data[i].tbd_id] = data[i].tbd_other_id;
					}
				}
			},
			error:function(errorCode, errorMsg){
				console.error("查询对讲ID映射信息失败:" + errorMsg);
			}
		});
	}
	/**
	 * 根据对讲机第三方编号查询关联摄像机
	 */
	function _getLinkDevice(talkback){
		var linkDeviceList = [];
		db.query({
			request:{
				sqlId:'select_talkback_link_deviceList',
				whereId:'0',
				params:{'cusNumber':login.cusNumber,'other_id':talkback.id}
			},
			async:false,
			success:function(data){
				if(data.length>0 && data[0].link_device){
					linkDeviceList = data[0].link_device.split(',');
				}else{
					console.warn('该对讲机未关联摄像机:'+talkback.name);
				}
			},
			error:function(errorCode, errorMsg){
				console.error("查询对讲关联设备失败:" + errorMsg);
			}
		});
		
		return linkDeviceList;
	}
	
	/*
	 * 注入模块方法
	 */
	try {

		// 针对类似frame框架的模型化处理
		try {
			var hz = window.top.hz;
			if (hz) {
				talkbackConfig = hz.talkbackConfig;
				if (talkbackConfig) {
					console.log('获取对讲服务配置对象...');
					return talkbackConfig;
				}
			} else {
				hz = window.top.hz = {};
			}
			talkbackConfig = hz.talkbackConfig = {};
		} catch (e) {
			console.error('hz.talkbackConfig：引用顶层父级talkbackConfig对象失败...');
		}
		//查询ID映射
		getIdMapping();
		
		// 获取/创建模块并注入方法
		talkbackConfig.getConfig = _getConfig;		// 获取对讲服务配置信息
		talkbackConfig.getConfigByid = _getConfigByid; //根据对讲服务ID获取配置信息
		talkbackConfig.getRelationHost = _getRelationHost;
		talkbackConfig.idMapping = idMapping;
		talkbackConfig.getLinkDevice = _getLinkDevice;

		hzEvent.init('talkbackConfig', talkbackConfig);
		
		return talkbackConfig;
	} catch (e) {
		console.error('初始化 --> 对讲服务配置信息模块失败，' + e);
	}
});


