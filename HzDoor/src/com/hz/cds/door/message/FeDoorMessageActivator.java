package com.hz.cds.door.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.hz.cds.door.utils.DoorConstants;
import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;

/**
 * 接收前置机门禁消息处理类
 * @author zhongxy
 */
@Service
public class FeDoorMessageActivator extends FeMessageActivatorAbstract{
	private static final Logger logger = LoggerFactory.getLogger(FeDoorMessageActivator.class);

	// 静态初始化消息处理服务映射
	static {
		try {
			//门禁刷卡处理
			FeMessageTypeServiceMap.put(DoorConstants.DOOR_SWIPE, "feDoorMessageProcess");
			FeMessageTypeServiceMap.put(DoorConstants.DOOR_OPEN_STATUS, "feDoorOpenStatusMessageProcess");
			logger.info("初始化前置消息服务映射：门禁消息处理");
		} catch (Exception e) {
			logger.error("初始化门禁消息处理服务类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
		logger.info("收到门禁消息 cusNumber="+cusNumber+"msg="+message);
		
	}


}
