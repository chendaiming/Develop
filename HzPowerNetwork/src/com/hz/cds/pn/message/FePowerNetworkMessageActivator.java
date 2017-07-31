package com.hz.cds.pn.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.pn.utils.PowerNetworkConstants;
import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;

/**
 * 接受前置机高压电网消息处理类
 * 
 * @author chendm
 *
 * @date 2016年11月14日
 */
@Service
public class FePowerNetworkMessageActivator extends FeMessageActivatorAbstract {
	private static final Logger logger = LoggerFactory.getLogger(FePowerNetworkMessageActivator.class);
	
	static{
		try {
			//高压电网消息处理
			FeMessageTypeServiceMap.put(PowerNetworkConstants.POWER_NETWORK, "fePowerNetworkMessageProcess");
			logger.info("初始化前置消息服务映射：高压电网消息处理");
		} catch (Exception e) {
			logger.error("初始化高压电网消息处理服务类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
		// TODO Auto-generated method stub
		logger.info("收到高压电网消息 cusNumber="+cusNumber+"msg="+message);
	}

}
