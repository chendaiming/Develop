package com.hz.frm.net.netty.websocket;

import java.lang.reflect.Constructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.bean.WebSocketMsg;
import com.hz.frm.net.netty.service.IMsgChannel;
import com.hz.frm.net.netty.service.IService;
import com.hz.frm.net.netty.service.impl.MsgChannelManager;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;
import com.hz.frm.net.netty.service.impl.MsgDispatcher;
import com.hz.frm.net.service.LoginService;

public class WebSocketMsgDispatcher extends MsgDispatcher {
	private MsgComsumerGroup comsumer = null;
	private MsgChannelManager msgChannelManager = null;
	private NettyConfig config = null;
	private final Logger logger = LoggerFactory.getLogger(WebSocketMsgDispatcher.class);
	
	@Override
	public void init(NettyConfig config, MsgChannelManager msgChannelManager, MsgComsumerGroup comsumer) {
		if (config.isMsgComsumerPool()) {
			this.comsumer = comsumer;
		} else {
			this.comsumer = new MsgComsumerGroup(config.getMsgComsumerNum());
		}
		this.msgChannelManager = msgChannelManager;
		this.config = config;
	}


	@Override
	public void dispatch(IMsgChannel msgChannel, Object msg) {
		try {
			Runnable runnable = createMsgRunnable(msgChannel, msg);
			if(runnable!=null){
				comsumer.execute(runnable);
			}else{
				WebSocketMsg webSocketMsg = new WebSocketMsg(msg.toString());
				//构建执行者
				String serviceId=webSocketMsg.getServiceId();
				if(!isNull(serviceId)&&serviceId.equals("LoginService")){
				}else{
		            try {
		                msgChannel.write(getErrMsg(msg, "没有找到处理类"));
		            }catch (Throwable t){
		                //这里再发生异常就无奈了
		                logger.error("写消息发生异常",t);
		            }
				}

			}
        } catch (Throwable ex) {
            logger.error("消息分派发生异常",ex);
            try {
                msgChannel.write(getErrMsg(msg, "系统分派请求时出现异常"));
            }catch (Throwable t){
                //这里再发生异常就无奈了
                logger.error("写消息发生异常",t);
            }
        }

	}

	@Override
	public String getErrMsg(Object reqMsg, String errorMsg) {
		WebSocketMsg webSocketMsg = new WebSocketMsg(reqMsg.toString());
        JSONObject json=new JSONObject();
        json.put("msgType", "error");
        json.put("msgId", webSocketMsg.getMsgId());
        json.put("cusNumber", webSocketMsg.getCusNumber());
        json.put("userId", webSocketMsg.getUserId());
        JSONObject content=new JSONObject();
        content.put("successFlag", true);
        content.put("msg", errorMsg);
        json.put("content", content.toJSONString());
		return json.toJSONString();
	}

	@Override
	public void close() {
		if (!config.isMsgComsumerPool()) {
			comsumer.shutdown();
		}
	}


	/**
	 * 创建消息处理Runnabl
	 * @param msgChannel
	 * @param msg
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Runnable createMsgRunnable(IMsgChannel msgChannel,Object msg) {
		try {
			WebSocketMsg webSocketMsg = new WebSocketMsg(msg.toString());
			//构建执行者
			String serviceId=webSocketMsg.getServiceId();
			WebSocketMsgHandlerRunnable webSocketMsgHandlerRunnable;
            //登录处理
            if(!isNull(serviceId)&&serviceId.equals("LoginService")){
            	LoginService loginService=new LoginService();
            	String rtnMsg=loginService.login(msgChannel, msgChannelManager, webSocketMsg);
            	msgChannel.write(rtnMsg);
            	return null;
            }
            else{
                Class clazz = Class.forName(config.getMsgServicePackage() + serviceId);
                Constructor constructor = clazz.getConstructor();
                IService service = (IService)constructor.newInstance();
                if(service!=null){
                	webSocketMsgHandlerRunnable = new WebSocketMsgHandlerRunnable(msgChannel, service, webSocketMsg);
                }else{
                	return null;
                }
                
            }
			return webSocketMsgHandlerRunnable;
		} catch (Throwable ex){
            throw new RuntimeException("createMsgRunnable异常",ex);
        }
	}
	/**
     * 判断是否为空字符串或者为空。
     * @param param：需要判断的字符串。
     * @return false：非空返回  true:空字符串或者null时返回。
     */
    public static boolean isNull(String param) {
    	if (null == param) {
            return true;
        } else if (0 == param.trim().length()) {
            return true;
        }
        return false;
    }  
}
