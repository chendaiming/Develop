package com.hz.cds.common.meeage;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.hz.cds.common.utils.CommonConstants;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IUpdateService;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.StringUtil;
/**
 * 报警消息的处理类
 * @author zhongxy
 * @date 2015-05-20
 */
@Service
@Transactional
public class FeStatusMessageProcess extends FeMessageProcessAbstract<FeStatusMessageBean> {
	final static Logger logger = LoggerFactory.getLogger(FeStatusMessageProcess.class);
	@Resource
	private IUpdateService updateService;
	@Resource
	private MqMessageSendService mqMessageSendService;
	
	private static Map<String,String> sqlMapOld = new HashMap<String,String>();
	private static Map<String,String> sqlMapNew = new HashMap<String,String>();
	
	// 静态初始化设备类型与SQL语句的映射
	static {
		try {
			//兼容2.0版本设备状态更新
			sqlMapOld.put("1", "update_camera_status"); //摄像机
			sqlMapOld.put("2", "update_alertor_status");//报警器
			sqlMapOld.put("3", "update_door_status");   //门禁
			sqlMapOld.put("4", "update_talkback_stts"); //对讲
			sqlMapOld.put("5", "update_broadcast_device_stts");//数字广播
			sqlMapOld.put("20", "update_patrol_device_stts");//门禁巡更
			
			
			//新版3.0版本设备状态更新
			sqlMapNew.put("1", "update_camera_status"); //摄像机
			sqlMapNew.put("2", "update_door_status");   //门禁
			sqlMapNew.put("3", "update_talkback_stts"); //对讲
			sqlMapNew.put("4", "update_broadcast_device_stts");//数字广播
			sqlMapNew.put("6", "update_alertor_status");//报警器
			sqlMapNew.put("19","update_car_arrester_use_state");//阻车器
			sqlMapNew.put("20","update_patrol_device_stts");//门禁巡更	
			
			logger.info("初始化设备状态处理服务类映射成功...");
		} catch (Exception e) {
			logger.error("初始化设备状态处理服务类映射失败：", e);
		}
	}
	
	
	@Override
	public Class<FeStatusMessageBean> getBodyClass() {
		return FeStatusMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader feMessageHeader, FeStatusMessageBean feStatusMessageBean) {
		String deviceType = "";
		String updateSql = null;
		
		if(!StringUtil.isNull(feStatusMessageBean.getDvcType())){
			//dvcType 有值 从sqlMapNew中取SQL语句
			deviceType = feStatusMessageBean.getDvcType();
			updateSql  = sqlMapNew.get(deviceType);
		}else if(!StringUtil.isNull(feStatusMessageBean.getDeviceType())){
			//deviceType 有值 从sqlMapOld中取SQL语句
			deviceType = feStatusMessageBean.getDeviceType();
			updateSql  = sqlMapOld.get(deviceType);
		}else{
			//为空直接返回
			logger.error("设备类型为空,无效数据");
			return;
		}
		
		if(updateSql!=null){
			update(feMessageHeader.getCusNumber(),feStatusMessageBean,updateSql);
		}else{
			logger.debug("未知的设备类型:"+deviceType);
		}
	}
	
	/**
	 * 更新设备状态
	 * @param cusNumber
	 * @param feAlarmMessageBean
	 */
	private void update(String cusNumber,FeStatusMessageBean feStatusMessageBean,String sqlid){
		//更新数据库
		JSONObject param = new JSONObject();
		UpdateResp resp = null;
		try {
			param = feStatusMessageBean.getJson(cusNumber);
			resp = updateService.updateByParamKey(sqlid,param);
		} catch (Exception e) {
			logger.error("更新设备状态异常", e);
		}

		if (resp.getSuccess()) {
			logger.debug("更新设备状态成功");
			//前台消息推送
			mqMessageSendService.sendInternalWebMessage(param, cusNumber, CommonConstants.STATUS_MSG);
		}		
	}
}
