package com.hz.fe;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.fe.bean.FeMessageHeader;


/**
 * 前置消息分发器
 * @author zhongxy
 *
 */
public class FeMessageDispatcher{
	private FeMessageThreadGroup feMessageThreadGroup = null;
	private final Logger logger = LoggerFactory.getLogger(FeMessageDispatcher.class);
	public FeMessageDispatcher(){
		this.feMessageThreadGroup = new FeMessageThreadGroup();
	}
	
	/**
	 * 分发消息
	 * @param cusNumber
	 * @param msg
	 */
	public void dispatch(String cusNumber,String msg) {
		try {
			JSONObject msgJSONObject = JSONObject.parseObject(msg);
			FeMessageHeader feMessageHeader = JSON.toJavaObject(JSONObject.parseObject(msgJSONObject.getString("header")), FeMessageHeader.class);
			String msgType = feMessageHeader.getMsgType();
			List<String> serviceNames = FeMessageTypeServiceMap.getInstance().getServiceNames(msgType);
			Runnable runnable = null;

			for(String serviceName : serviceNames) {
				try {
					runnable = createMsgRunnable(cusNumber, msgJSONObject, serviceName);
					if (runnable != null) {
						feMessageThreadGroup.execute(runnable);
					}
				} catch (Exception e) {
					logger.error("消息分发异常：服务名" + serviceName, e);
				}
			}

        } catch (Throwable ex) {
            logger.error("异常的消息内容："+msg);
            logger.error("消息分派发生异常",ex);
        }
	}


	/**
	 * 创建消息处理Runnabl
	 * @param msg
	 * @return
	 */
	private Runnable createMsgRunnable(String cusNumber,JSONObject msgJSONObject,String serviceName) {
		try {
            FeMessageRunnable feMessageRunnable = new FeMessageRunnable(cusNumber,msgJSONObject,serviceName);
			return feMessageRunnable;
		} catch (Throwable ex){
            throw new RuntimeException("createMsgRunnable异常",ex);
        }
	}
}
