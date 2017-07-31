package com.hz.cds.talkback.task;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hz.cds.talkback.service.TalkStatusService;

public class TalkbackTask {
	
	private static final Logger logger = LoggerFactory.getLogger(TalkbackTask.class);
	@Resource 
	TalkStatusService talkStatusService;

	public void startRun() {
		try {
			logger.debug("开始更新对讲设备状态信息...");
			talkStatusService.getStatus();
			logger.debug("更新对讲设备状态信息...完成");
		} catch (Exception e) {
			logger.error("更新对讲设备状态信息异常：", e);
		}
	}
}
