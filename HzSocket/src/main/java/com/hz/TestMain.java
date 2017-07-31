package com.hz;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class TestMain {
	private static final Logger logger = LoggerFactory.getLogger(TestMain.class);
    public static void main(String[] args) {
		ConfigurableApplicationContext applicationContext = new ClassPathXmlApplicationContext(
                new String[] { "spring/spring-socket.xml" }, false);
		applicationContext.refresh();
		System.out.println("start activemq connector success");
		logger.debug("start activemq connector success");
	}
}
