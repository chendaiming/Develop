package com.hz.cds.callroll.message;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.callroll.cache.TimingCallRollCache;
import com.hz.cds.callroll.cache.TimingCallrollWorkCache;
import com.hz.cds.callroll.message.bean.TimingCallRollMessageBean;
import com.hz.cds.callroll.service.CallRollHandleService;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IQueryService;
import com.hz.db.service.IUpdateService;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.net.netty.bean.MsgHeader;
import com.hz.frm.util.DateUtil;
import com.hz.frm.util.Tools;

/**
 * RFID消息的处理类
 * 
 * @author chendm
 *
 * @date 2017年01月16日
 */
@Service
public class TimingCallRollMessageProcess extends FeMessageProcessAbstract<TimingCallRollMessageBean> {
	private static final Logger logger = LoggerFactory.getLogger(TimingCallRollMessageProcess.class);
	private static SimpleDateFormat yyyymmddHHmmss = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static SimpleDateFormat HHmm = new SimpleDateFormat("HH:mm");

	private static String MSG_TYPE_ACR001 = "ACR001";
	private static String CRM_TYPE_2 = "2";		// 点名类型
	private static String CRD_STATUS_0 = "0"; 	// 点名状态：未点名
	private static String CRD_STATUS_1 = "1";	// 点名状态：已点名

	// 点名中的数据
	private Map<String, JSONObject> callrollingMap = new LinkedHashMap<String, JSONObject>();
	private Date nowDate = null;
	private String nowHHmm = null;

	private JSONObject nowCallrollMap = null;	// 当前时间点名的任务列表映射
	private JSONArray nowCallrollList = null;	// 当前时间点名的任务列表	
	private String batchCode = null;



	@Resource
	private MqMessageSendService mqMessageSendService;

	@Resource
	private IQueryService queryService;

	@Resource
	private IUpdateService updateService;

	@Resource 
	private CallRollHandleService callrollHandleService;

	@Resource
	private CallRollMessageProcess callRollMessageProcess;



	public TimingCallRollMessageProcess () {

	}


	@Override
	public Class<TimingCallRollMessageBean> getBodyClass() {
		return TimingCallRollMessageBean.class;
	}


	@Override
	protected void process(FeMessageHeader feMessageHeader, TimingCallRollMessageBean msgBody) {
		// RFID推送消息的处理字段
		Map<String, Object> bindData = null;
		JSONObject master = null;
		JSONObject params = null;

		UpdateResp resp = null;
		String callrollKey = null;
		String cusNumber = null;
		String recordId = null;
		String peopleId = null;
		String tagId = null;
		String dpttId = null;

		try {
			if (!callrollingMap.isEmpty()) {									// 1. 检查当前是否有自动点名
				cusNumber = feMessageHeader.getCusNumber();
				tagId = msgBody.getTagId();
				bindData = TimingCallRollCache.getRfidBindPeople(tagId);

				if (bindData != null) {											// 2. 获取RFID标签绑定的人员信息
					dpttId = Tools.toStr(bindData.get("dept_id"));
					master = callrollingMap.get(cusNumber);				// 3. 根据绑定人员的机构号，获取点名任务（判断是部门点名 还是全部点名）

					if (master == null) {								// 4. 不是全部点名则根据部门获取点名任务
						callrollKey = getTimingKey(cusNumber, dpttId);
						master = callrollingMap.get(callrollKey);
					}

					if (master != null) {								// 5. 最终获取到了点名任务则开始点名
						recordId = master.getString("recordId");
						peopleId = Tools.toStr(bindData.get("people_id"));

						params = new JSONObject();
						params.put("cusNumber", cusNumber);
						params.put("recordId", recordId);
						params.put("peopleId", peopleId);
						params.put("stts", CRD_STATUS_1);
						params.put("time", msgBody.getTime());

						// 更新店面人员信息
						resp = updateService.updateByParamKey("update_callroll_people_stts", "0", params);

						if (resp != null && resp.getSuccess()) {
							callRollMessageProcess.sendCallRollingMsg(cusNumber, recordId, peopleId);
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("RFID基站消息处理失败：", e);
		}	
	}


	/**
	 * 定时处理
	 */
	@Scheduled(cron="0/10 * * * * ?")
	private void timingHandle() {
		nowDate = new Date();
		nowHHmm = HHmm.format(nowDate);
		nowCallrollMap = TimingCallrollWorkCache.getWorkByTime(nowHHmm) ;// timingJSON.getJSONObject(nowHHmm);

		if (nowCallrollMap != null) {

			for(String key : nowCallrollMap.keySet()) {
				nowCallrollList = nowCallrollMap.getJSONArray(key);

				if (nowCallrollList != null) {
					batchCode = Tools.toStr(nowDate.getTime());

					for(int i = 0; i < nowCallrollList.size(); i++) {
						try {
							startCallroll(batchCode, i);
						} catch (Exception e) {
							logger.error("定时点名异常：", e);
						}
					}
				}
			}
		}
	}


	/*
	 * 开始点名
	 */
	@Transactional(rollbackFor = Exception.class)
	private void startCallroll (String batch, int i) throws Exception {
		JSONObject params = null;
		UpdateResp resp = null;
		String recordId = null;

		JSONObject nowCallrollObj = nowCallrollList.getJSONObject(i);
		String cusNumber = nowCallrollObj.getString("cusNumber");
		String cusName = nowCallrollObj.getString("cusName");
		String dpttId = nowCallrollObj.getString("dpttId");
		String dpttName = nowCallrollObj.getString("dpttName");
		String beginTime = yyyymmddHHmmss.format(nowDate);
		String timingKey = getTimingKey(cusNumber, dpttId); // cusNumber + ("".equals(dpttId) ? "" : ("_" + dpttId));

		int maxTime = nowCallrollObj.getIntValue("maxTime");

		// 判断是否正在点名
		if (!callrollingMap.containsKey(timingKey)) {
			callrollingMap.put(timingKey, null);

			params = new JSONObject();
			params.put("cusNumber", cusNumber);
			params.put("recordId", "");
			params.put("serialCode", batch + i);
			params.put("batchCode", batch);
			params.put("dpttId", dpttId);
			params.put("dpttName", dpttName);
			params.put("type", CRM_TYPE_2);
			params.put("beginTime", beginTime);

			// 插入点名主表
			resp = updateService.updateByParamKey("insert_callroll_master_by_timing", params);

			if (resp != null && resp.getSuccess()) {
				recordId = params.getString("recordId");
				nowCallrollObj.put("recordId", recordId);
				callrollingMap.put(timingKey, nowCallrollObj);

				params = new JSONObject(); 				
				params.put("cusNumber", cusNumber);
				params.put("recordId", recordId);
				params.put("dpttId", dpttId);
				params.put("stts", CRD_STATUS_0);

				// 插入预计点名人员信息
				resp = updateService.updateByParamKey("insert_predict_callroll_prisoner_by_timing", params);

				if (resp != null && resp.getSuccess()) {
					callRollMessageProcess.sendCallRollBeginMsg(cusNumber, recordId);
					callrollTimingClose(timingKey, maxTime);
					sendCallrollMsg(cusNumber, "1", 0);

					logger.debug(cusName + "." + dpttName + "开始自动点名，点名时长" + maxTime + "分钟...");
				} else {
					logger.warn(cusName + "." + dpttName + "无点名人员信息!");
				}
			}
		}
	}


	/**
	 * 获取定时KEY
	 * @param cusNumber
	 * @param dpttId
	 * @return
	 */
	private String getTimingKey (String cusNumber, String dpttId) {
		if (Tools.isEmpty(dpttId)) {
			return cusNumber;
		} else {
			return cusNumber + "_" + dpttId;
		}
	}


	/**
	 * 定时关闭点名
	 * @param key 	记录编号
	 * @param time 	时长，单位：分钟
	 */
	private void callrollTimingClose (final String key, final int time) {
		Thread tt = new Thread(new Runnable() {
			@Override
			public void run() {
				JSONObject master = null;
				JSONObject params = null;
				UpdateResp resp = null;
				String cusNumber = null;
				String recordId = null;

				try {
					// 休眠指定时间后关闭点名
					Thread.sleep(time * 60 * 1000);

					master = callrollingMap.remove(key);
					if (master != null) {
						cusNumber = master.getString("cusNumber");
						recordId = master.getString("recordId");

						params = new JSONObject();
						params.put("cusNumber", cusNumber);
						params.put("recordId", recordId);
						params.put("endTime", yyyymmddHHmmss.format(new Date()));

						resp = updateService.updateByParamKey("update_callroll_master_by_callroll_over", params);

						if (resp != null && resp.getSuccess()) {
							callRollMessageProcess.sendCallRollEndMsg(cusNumber, recordId);

							logger.debug(master.getString("cusName") + "." + master.getString("dpttName") + "自动点名结束...");
						}
					}

					sendCallrollMsg(cusNumber, "2", 0);

				} catch (Exception e) {
					logger.error("定时关闭点名异常：", e);
				}
			}
		});

		tt.setPriority(Thread.NORM_PRIORITY);
		tt.start();
	}


	/**
	 * 发送点名消息到前置机
	 * @param cusNumber	机构号
	 * @param action	动作
	 * @param maxTime	时长
	 */
	private void sendCallrollMsg (String cusNumber, String action, int maxTime) {
		MsgHeader msgHeader = null;
		JSONObject msgBody = null;
		JSONObject msgJSON = null;

		Boolean hasSend = true;
		Date date = new Date();

		// 1. 检查同一个机构下已经有点名任务在执行，则不再发自动点名消息
		// 2. 检查同一个机构下还有点名任务在执行，则不发取消自动点名消息
		for(JSONObject temp : callrollingMap.values()) {
			if (cusNumber.equals(temp.getString("cusNumber"))) {
				hasSend = false; break;
			}
		}

		if (hasSend) {
			msgBody = new JSONObject();
			msgBody.put("action", action);
			msgBody.put("rangeTime", maxTime);

			msgHeader = new MsgHeader();
			msgHeader.setMsgID(yyyymmddHHmmss.format(date));
			msgHeader.setMsgType(MSG_TYPE_ACR001);
			msgHeader.setLength(msgBody.size());
			msgHeader.setSender("HzCallRoll");
			msgHeader.setRecevier("");
			msgHeader.setSendTime(DateUtil.getDateString(date, DateUtil.sdf));

			msgJSON = new JSONObject();
			msgJSON.put("header", JSON.toJSONString(msgHeader));
			msgJSON.put("body", msgBody.toJSONString());

			mqMessageSendService.sendFeMessage(msgJSON.toJSONString(), cusNumber);
		}
	}
}
