define(function(require){
	var db = require('frm/hz.db');
	var message = require('frm/message');
	var loginUser = require('frm/loginUser');
	
	var userSetting = {
			/**
			 * 添加用户设定
			 * @param timerTaskInfo
			 */
			addSetting:function(setTing,callback){
				db.updateByParamKey({
					request:{
						sqlId:'insert_user_setting',
						params:setTing
					},
					success:function(data){
						if(callback &&  typeof callback =='function'){
							callback(data);
						}
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
			},
			/**
			 * 更新用户设定
			 * @param timerTaskInfo
			 * @param callback执行成功时回调
			 */
			updateSetting:function(setTing,callback){
				db.updateByParamKey({
					request:{
						sqlId:'update_user_setting',
						params:setTing
					},
					success:function(data){
						if(callback &&  typeof callback =='function'){
							callback(data);
						}
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
			},
			deleteSetting:function(id,msg){
				db.updateByParamKey({
					request:{
						sqlId:'',
						whereId:'0',
						params:{'id':id}
					},
					success:function(){
						message.alert(msg);
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
			},
			/**
			 * 查询用户设定信息
			 * 
			 */
			querySetting:function(param){
				db.query({
					request:{
						sqlId:'select_user_setting',
						whereId:param.whereId,
						params:param.data
					},
					success:function(data){
						if(param.success &&  typeof param.success =='function'){
							param.success(data);
						}else{
							
						}
					},
					error:function(errorCode, errorMsg){
						message.alert(errorCode + ":" + errorMsg);
					}
				});
			}
	};
	return userSetting;
});