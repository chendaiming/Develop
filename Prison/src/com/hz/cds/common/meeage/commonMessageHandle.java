package com.hz.cds.common.meeage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.common.utils.CommonConstants;
import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;

/**
 * 接收前置机报警消息处理类
 * @author zhongxy
 */
@Service
public class commonMessageHandle extends FeMessageActivatorAbstract{
	private static final Logger logger = LoggerFactory.getLogger(commonMessageHandle.class);

	// 静态初始化消息处理服务映射
	static {
		try {
			//报警处理
			FeMessageTypeServiceMap.put(CommonConstants.STATUS_MSG, "feStatusMessageProcess");
			logger.info("初始化前置消息服务映射：公共消息处理");
		} catch (Exception e) {
			logger.error("初始化公共消息处理服务类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
		logger.info("收到公共消息 cusNumber="+cusNumber+"msg="+message);
	}


}
