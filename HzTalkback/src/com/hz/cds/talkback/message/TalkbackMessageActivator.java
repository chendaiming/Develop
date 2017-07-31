package com.hz.cds.talkback.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.talkback.util.TalkbackConstants;
import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;

@Service
public class TalkbackMessageActivator extends FeMessageActivatorAbstract {

	private static final Logger logger = LoggerFactory.getLogger(TalkbackMessageActivator.class);

	// 静态初始化消息处理服务映射
	static {
		try {
			//报警处理
			FeMessageTypeServiceMap.put(TalkbackConstants.FIGHTTALK001, "talkbackMessageProcess");
			FeMessageTypeServiceMap.put(TalkbackConstants.FIGHTTALK002, "talkbackMessageProcess");
			logger.info("初始化前置消息服务映射：对讲消息处理");
		} catch (Exception e) {
			logger.error("初始化对讲消息处理服务类映射失败：", e);
		}
	}

	@Override
	public void printLog(String message, String cusNumber) {
		logger.info("收到对讲消息: cusNumber = " + cusNumber + " | msg = " + message);
	}
}
