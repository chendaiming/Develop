package com.hz.cds.video.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.video.utils.PatrolConstants;
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
public class FePatrolMessageActivator extends FeMessageActivatorAbstract {
	private static final Logger logger = LoggerFactory.getLogger(FePatrolMessageActivator.class);
	
	static{
		try {
			FeMessageTypeServiceMap.put(PatrolConstants.PATROLID, "fePatrolMessageProcess");
			logger.info("初始化前置消息服务映射：智能巡更消息处理");
		} catch (Exception e) {
			logger.error("初始化智能巡更消息处理服务类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
		logger.info("收到智能巡更消息 cusNumber="+cusNumber+"msg="+message);
	}

}
