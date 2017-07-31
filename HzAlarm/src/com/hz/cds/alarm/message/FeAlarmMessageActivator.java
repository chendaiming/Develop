package com.hz.cds.alarm.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.alarm.utils.AlarmConstants;
import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;

/**
 * 接收前置机报警消息处理类
 * @author zhongxy
 */
@Service
public class FeAlarmMessageActivator extends FeMessageActivatorAbstract{
	private static final Logger logger = LoggerFactory.getLogger(FeAlarmMessageActivator.class);

	// 静态初始化消息处理服务映射
	static {
		try {
			//报警处理
			FeMessageTypeServiceMap.put(AlarmConstants.ALARM_MSG_001, "feAlarmMessageProcess");
			FeMessageTypeServiceMap.put(AlarmConstants.ALARM_MSG_002, "feAlarmMessageProcess");
			FeMessageTypeServiceMap.put(AlarmConstants.ALARM_MSG_003, "feAlarmMessageProcess");
			FeMessageTypeServiceMap.put(AlarmConstants.ALARM_MSG_004, "feAlarmMessageProcess");
			logger.info("初始化前置消息服务映射：报警消息处理");
		} catch (Exception e) {
			logger.error("初始化报警消息处理服务类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
		logger.info("收到报警消息 cusNumber="+cusNumber+"msg="+message);
		
	}


}
