package com.hz.baseData.asyncDeviceStatus;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;


@Service
public class DeviceStatusHandle  extends FeMessageActivatorAbstract{
	
	private static final Logger logger = LoggerFactory.getLogger(DeviceStatusHandle.class);

	// 静态初始化消息处理服务映射
	static {
		try {
			//设备状态接收处理
			FeMessageTypeServiceMap.put("DEV001", "deviceStatusProccess");
			
			logger.info("初始化前置消息服务映射：设备状态处理");
			
		} catch (Exception e) {
			logger.error("初始化公共消息处理服务类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
		logger.info("收到公共消息 cusNumber="+cusNumber+"msg="+message);
	}
}
