package com.hz.frm.initdata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;

public class InitDataService implements ApplicationListener<ApplicationEvent> {
	private static final Logger log = LoggerFactory.getLogger(InitDataService.class);
    private static boolean isStart=false;
	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		if(!isStart){
			log.info("初始化数据开始！");			
		}
		
	}

}
