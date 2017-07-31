package com.hz.frm.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
/**
 * 用于获取spring实例后的bean
 * @author zhongxy
 *
 */

public class ApplicationContextUtil implements ApplicationContextAware {

	private static ApplicationContext applicationContext = null;
	private static ApplicationContextUtil applicationContextUtil = null;
	private ApplicationContextUtil(){};

	public synchronized static ApplicationContextUtil getInstance() {
		if (applicationContextUtil == null) {
			applicationContextUtil = new ApplicationContextUtil();
		}
		return applicationContextUtil;
	}
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		ApplicationContextUtil.applicationContext = applicationContext;
	}

	public synchronized Object getBean(String beanName) {
		try {
			return applicationContext.getBean(beanName);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
