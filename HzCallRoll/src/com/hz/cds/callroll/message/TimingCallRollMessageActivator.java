package com.hz.cds.callroll.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.callroll.utils.CallRollConstants;
import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;

/**
 * 接受RFID消息处理类
 * 
 * @author chendm
 *
 * @date 2017年01月16日
 */
@Service
public class TimingCallRollMessageActivator extends FeMessageActivatorAbstract {
	private static final Logger logger = LoggerFactory.getLogger(TimingCallRollMessageActivator.class);
	
	static{
		try {
			FeMessageTypeServiceMap.put(CallRollConstants.RFID, "timingCallRollMessageProcess");
			logger.info("初始化前置消息服务映射：RFID定时点名消息处理");
		} catch (Exception e) {
			logger.error("初始化RFID定时点名消息处理类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
//		logger.info("收到RFID消息 cusNumber="+cusNumber+"msg="+message);
	}
}
