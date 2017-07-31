package com.hz.cds.alarm.message;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.alarm.cache.AlarmBaseDtlsCache;
import com.hz.cds.alarm.service.AlarmMessageService;
import com.hz.cds.alarm.utils.AlarmConstants;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IQueryService;
import com.hz.db.service.IUpdateService;
import com.hz.db.util.RespParams;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.DeviceTypeConst;
import com.hz.frm.util.Tools;
/**
 * 报警消息的处理类
 * @author zhongxy
 * @date 2015-05-20
 */
@Service
@Transactional
public class FeAlarmMessageProcess extends FeMessageProcessAbstract<FeAlarmMessageBean> {
	static final Logger logger = LoggerFactory.getLogger(FeAlarmMessageProcess.class);
	static final SimpleDateFormat sdfAll = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static final SimpleDateFormat sdfHMS = new SimpleDateFormat("HH:mm:ss");	

	static final String NOTICE_FLAG_OFF = "0";	// 关闭通知
	static final String NOTICE_FLAG_ON = "1";	// 开启通知
	
	@Resource
	private MqMessageSendService mqMessageSendService;

	@Resource
	private IQueryService queryService;

	@Resource
	private IUpdateService updateService;

	@Resource
	private AlarmBaseDtlsCache alarmBaseDtlsCache;

	@Resource
	private AlarmMessageService alarmMessageService;

	@Override
	public Class<FeAlarmMessageBean> getBodyClass() {
		return FeAlarmMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader msgHeader, FeAlarmMessageBean msgBean) {
		JSONObject rtnObj = null;
		JSONArray handleArr = null;
	
		try {
			String alarmAction = msgBean.getAlarmAction();
			String cusNumber = msgHeader.getCusNumber();

			// 暂时只处理报警的消息
			if (AlarmConstants.ALARM_ACTION_1.equals(alarmAction)) {

				//报警消息入库
				handleArr = insert(cusNumber, msgBean);

				// 判断是否开启通知（不符合报警分级规则的报警消息不通知）
				if (NOTICE_FLAG_ON.equals(msgBean.getHandleFlag())) {
					if (handleArr != null) {

						//联动处理
						rtnObj = alarmMessageService.alarmProcess(cusNumber, msgBean);
						rtnObj.put("handleAuth", handleArr);// 处理权限数据

						// 发送通知到Web前端
						mqMessageSendService.sendInternalWebMessage(rtnObj, cusNumber, msgHeader.getMsgType());
					}
				}
			} else {
				// 取消报警暂时不处理
			}
		} catch (Exception e) {
			logger.error("报警消息处理失败 msgbody = "+JSON.toJSONString(msgBean), e);
		}		
	}


	/**
	 * 插入报警记录
	 * @param cusNumber
	 * @param msgBean
	 */
	private JSONArray insert(String cusNumber, FeAlarmMessageBean msgBean){
		List<Map<String, Object>> listMap = null;	// 用于接收listMap数据
		Map<String, Object> publicMap = null;		// 通用的报警分级配置
		Map<String, Object> privateMap = null;		// 私有的报警分级配置（针对某一报警类型的）

		Map<String, Object> whereMap = null;		// 查询设备类型的条件集合

		JSONArray handleDepts = new JSONArray();	// 通知、处置部门集合
    	JSONObject handleDept = null;				// 通知、处置部门信息

		UpdateResp resp = null;		// 报警记录保存结果
		JSONArray jsonArr = null;
		JSONObject jsonObj = null;

		try {
			String dvcType = Tools.toStr(msgBean.getAlarmDeviceType(), "");
			String dvcTypeName = "未知设备";
			String alarmId = Tools.toStr(msgBean.getAlarmID(), "");
			String alarmTime = Tools.toStr(msgBean.getAlarmTime(), "");
			String alarmType = Tools.toStr(msgBean.getAlarmType(), "");
			String alarmTypeName = getAlarmTypeName(dvcType, alarmType);
			String alarmLevel = "";
			String receiveDeptId = "";
			String recordId = "";
			String remark = "";		// 追加的报警备注信息

			// 报警分级处理规则分析的属性参数
			boolean valid = true;
			int nowTime = 0;			// 获取当前的日期 和 时间的值
			String bTime = null;		// 报警处置额有效开始时间
			String eTime = null;		// 报警处置额有效结束时间
			String timeRanges = "";		// 报警处置的有效时间段范围

			// 获取报警器的基本信息
			String dvcDeptId = Tools.toStr(alarmBaseDtlsCache.getAlarmDepartmentId(cusNumber, alarmId, dvcType), "");
			String alarmName = Tools.toStr(alarmBaseDtlsCache.getAlarmName(cusNumber, alarmId, dvcType), "");
			String alarmAddrs = Tools.toStr(alarmBaseDtlsCache.getAlarmAddress(cusNumber, alarmId, dvcType), "");


			/*
			 * 获取报警设备的类型名称
			 */
			try {
				whereMap = new LinkedHashMap<String, Object>();
				whereMap.put("type_id", "securityDeviceType");
				whereMap.put("key", dvcType);
				dvcTypeName = Tools.toStr(RedisUtil.getObject("ConstantCodeDtls", whereMap, "value"), dvcTypeName);
			} catch (Exception e) {
				logger.warn("获取缓存常量的设备类型名称失败：参数" + JSON.toJSONString(whereMap));
			}


			/*
			 * 获取报警分级处置规则并分析报警消息是否匹配规则
			 * 1. 未配置：默认按一级报警处置且通知报警设备所关联的部门
			 * 
			 * 2. 已配置：根据时间段划分报警等级及所对应的通知和处理部门
			 * 		1. 获取通用报警分级配置（报警类型为空的）和 私有报警分级配置（指定报警类型的）
			 * 		2. 优先匹配私有报警分级配置	
			 * 	    3. 而后匹配通用报警分级配置
			 * 		4. 无符合报警处理条件则只记录数据不通知
			 */
			listMap = getAlarmLevel(cusNumber, dvcType, alarmId, alarmType, msgBean.getAlarmTime());

			if (listMap != null && listMap.size() > 0) {
				nowTime = timeToInt(sdfHMS.format(sdfAll.parse(alarmTime))); // 获取报警时间

				// 验证报警消息处理的时段（过滤掉不符合报警处置时间段的配置）
				for(Map<String, Object> map : listMap) {
					valid = true;
					bTime = Tools.toStr(map.get("btime"), "");
					eTime = Tools.toStr(map.get("etime"), "");
					timeRanges += "[" +bTime + "~" + eTime + "]";

					// 验证时段
					if (bTime.length() > 0 && nowTime < timeToInt(bTime)) {
						valid = false;
					}
					if (eTime.length() > 0 && nowTime > timeToInt(eTime)) {
						valid = false;
					}

					// 判断验证结果
					if (valid) {

						// 优先获取私有的报警分级配置
						if (alarmType.equals(Tools.toStr(map.get("alarm_type")))) {
							if (privateMap == null) privateMap = map;
						} else {
							if (publicMap == null) publicMap = map;
						}

						// 获取第一个有效的报警等级 和 接警部门
//						if ("".equals(alarmLevel)) {
//							receiveDeptId = Tools.toStr(map.get("receive_dept_id"), dvcDeptId);
//							alarmLevel = Tools.toStr(map.get("lvl"), "");
//						}
//
//						handleDept = new JSONObject();
//						handleDept.put("alarmLevel", map.get("lvl"));
//						handleDept.put("handleDeptId", map.get("receive_dept_id"));
//						handleDept.put("noticeDeptIds", map.get("notice_dept_ids"));
//						handleDepts.add(handleDept);
					}
				}

				// 没有私有的报警分级配置则获取通用的
				if (privateMap == null) {
					privateMap = publicMap;
				}

				// 设置报警分级数据
				if (privateMap != null) {
					// 获取第一个有效的报警等级 和 接警部门
					if ("".equals(alarmLevel)) {
						receiveDeptId = Tools.toStr(privateMap.get("receive_dept_id"), dvcDeptId);
						alarmLevel = Tools.toStr(privateMap.get("lvl"), "");
					}

					handleDept = new JSONObject();
					handleDept.put("alarmLevel", privateMap.get("lvl"));
					handleDept.put("handleDeptId", privateMap.get("receive_dept_id"));
					handleDept.put("noticeDeptIds", privateMap.get("notice_dept_ids"));
					handleDepts.add(handleDept);
				}

				// 如果未获取有效的报警等级或部门则默认取第一条记录的
				if ("".equals(alarmLevel)) {
					receiveDeptId = Tools.toStr(listMap.get(0).get("receive_dept_id"), dvcDeptId);
					alarmLevel = Tools.toStr(listMap.get(0).get("lvl"), "");
					remark = "（备注：该报警消息的处理时段在" + timeRanges + "，该报警消息不符合通知或处理条件!）";
					msgBean.setHandleFlag(NOTICE_FLAG_OFF);	// 设置处置标识：不符合处置条件
				}
			} else {
				// 在未配置报警分级处置规则时 默认一级报警，接警部门默认报警设备所在部门
				receiveDeptId = dvcDeptId;
				alarmLevel = "1";
			}

			msgBean.setLevel(alarmLevel);
			msgBean.setAlarmDeviceTypeName(dvcTypeName);
			msgBean.setAlarmTypeName(alarmTypeName);
			msgBean.setAlarmName(alarmName);
			msgBean.setAlarmAddrs(alarmAddrs);
			msgBean.setDeptId(dvcDeptId);
			msgBean.setReceiveDeptId(receiveDeptId);

			// 插入报警记录
			jsonObj = new JSONObject();
			jsonObj.put("ard_cus_number", cusNumber);
			jsonObj.put("ard_record_id", recordId);
			jsonObj.put("ard_alertor_id", alarmId);
			jsonObj.put("ard_alertor_name", alarmName);
			jsonObj.put("ard_alert_addrs", alarmAddrs);
			jsonObj.put("ard_alert_level", alarmLevel);
			jsonObj.put("ard_dvc_type", dvcType);
			jsonObj.put("ard_alert_reason", alarmType);
			jsonObj.put("ard_alert_time", alarmTime);
			jsonObj.put("ard_alert_stts", Tools.toStr(msgBean.getAlarmAction(), ""));
			jsonObj.put("ard_remark", Tools.toStr(msgBean.getRemark(), "") + remark);
			jsonObj.put("ard_img_src", Tools.toStr(msgBean.getAlarmImg(), ""));

			resp = updateService.updateByParamKey("insert_alt_alert_record_dtls", jsonObj);

			try {
				// 获取插入的报警记录编号
				if (resp.getSuccess()) {
					jsonArr = (JSONArray) resp.getData();
					jsonObj = jsonArr.getJSONObject(0);
					recordId = jsonObj.getJSONArray(RespParams.SEQ_LIST).getString(0);
					msgBean.setRecordId(recordId);
					return handleDepts;
				}
			} catch (Exception e) {
				logger.error("获取报警记录编号失败：" + JSON.toJSONString(resp));
			}
		} catch (Exception e) {
			logger.error("插入报警记录失败 msg=" + JSON.toJSONString(jsonObj), e);
		}
		return null;
	}


	/**
	 * 获取报警等级设置
	 * @param cusNumber	机构号
	 * @param dvcType	报警设备类型
	 * @param alarmId	报警设备编号
	 * @param alarmType	报警类型
	 * @param alarmTime	报警日期
	 * @return
	 */
	private List<Map<String, Object>> getAlarmLevel(String cusNumber, String dvcType, String alarmId, String alarmType, String alarmTime){
		List<Object> params = null;
    	try {
    		params = new ArrayList<Object>();
    		params.add(cusNumber);
    		params.add(dvcType);
    		params.add(alarmId);
    		params.add(alarmType);
    		params.add(alarmTime);
    		params.add(alarmTime);

    		return queryService.query("select_level_handle_set", "0", "0", params);
		} catch (Exception e) {
			logger.error("查询报警等级出错",e);
		}
    	return null;
	}
	
	/**
	 * 获取报警类型名称
	 * @param dvcType
	 * @param alarmType
	 * @return
	 */
	private String getAlarmTypeName(String dvcType,String alarmType){
		int type=Integer.valueOf(dvcType).intValue();
		String alarmTypeName="";
		if(type==DeviceTypeConst.CAMERA_TYPE){//摄像机报警器

		}else if(type==DeviceTypeConst.NETWORK_ALARM_TYPE){//网络报警器
			
		}
		return alarmTypeName;
	}
	
	/**
	 * 获取报警器的名称
	 * @param cusNumber
	 * @param alarmId
	 * @param dvcType
	 * @return
	 */
	public String getAlarmDeviceName(String cusNumber,String alarmId,String dvcType){
		int type = Integer.valueOf(dvcType).intValue();
		String deviceName="";
		if(type == DeviceTypeConst.CAMERA_TYPE){//摄像机报警器
			deviceName=alarmMessageService.getCameraInfo(cusNumber, alarmId,"cbd_name");
		}else if(type == DeviceTypeConst.NETWORK_ALARM_TYPE){//网络报警器
			deviceName = alarmMessageService.getNetworkAlarmInfo(cusNumber, alarmId,"nbd_name");
		}
		return deviceName;
	}
	
	/**
	 * 获取报警器设备的地址
	 * @param cusNumber
	 * @param alarmId
	 * @param dvcType
	 * @return
	 */
	public String getAlarmDeviceAddr(String cusNumber,String alarmId, String dvcType){
		int type = Integer.valueOf(dvcType).intValue();
		String deviceAddrs="";
		if(type==DeviceTypeConst.CAMERA_TYPE){//摄像机报警器
			deviceAddrs=alarmMessageService.getCameraInfo(cusNumber, alarmId,"cbd_dvc_addrs");
		}else if(type==DeviceTypeConst.NETWORK_ALARM_TYPE){//网络报警器
			deviceAddrs=alarmMessageService.getNetworkAlarmInfo(cusNumber, alarmId,"nbd_dvc_addrs");
		}
		return deviceAddrs;
	}

	private int timeToInt (String val) {
		return Integer.parseInt(val.replaceAll(":", ""));
	}
}
