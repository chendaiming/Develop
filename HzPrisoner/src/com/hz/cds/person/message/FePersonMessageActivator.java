package com.hz.cds.person.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.person.util.PersonConstants;
import com.hz.fe.FeMessageTypeServiceMap;
import com.hz.fe.service.FeMessageActivatorAbstract;
/**
 * 接收前置机人脸识别消息处理类
 * @author zhangyl
 *
 */
@Service("fePersonMessageActivator")
public class FePersonMessageActivator extends FeMessageActivatorAbstract{
	private final static Logger logger = LoggerFactory.getLogger(FePersonMessageActivator.class);
	static{
		try{
			FeMessageTypeServiceMap.put(PersonConstants.PERSON_MSG, "fePersonMessageProcess"); 
			logger.info("初始化前置消息服务映射：人脸识别消息处理");
		}catch(Exception e){
			logger.error("初始化人脸识别消息处理服务映射类失败",e);
		}
	}
	@Override
	public void printLog(String message, String cusNumber) {
		//这里会传输图片,所以不打印消息内容
		logger.info("收到初始化人脸识别消息：cusNumber="+cusNumber);
	}
}
