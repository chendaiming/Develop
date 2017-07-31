package com.hz.frm.net.netty.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.hz.frm.net.netty.bean.WebSocketMsg;
import com.hz.frm.net.netty.service.IMsgChannel;
import com.hz.frm.net.netty.service.IService;

public class WebSocketMsgHandlerRunnable implements Runnable {
	private IMsgChannel msgChannel = null;
	private IService service = null;
	private WebSocketMsg msg = null;
	
	private final Logger logger = LoggerFactory.getLogger(WebSocketMsgHandlerRunnable.class);
	
	public WebSocketMsgHandlerRunnable(IMsgChannel msgChannel, IService service, WebSocketMsg msg) {
		this.msgChannel = msgChannel;
		this.service = service;
		this.msg = msg;
	}
	
	@Override
	public void run() {
		try {
            String rs = service.handleMsg(msg);
            if (!isNull(rs)) {
            	msgChannel.write(rs);
            }
        } catch (Throwable ex) {
        	logger.error("serviceId" + msg.getServiceId() + " 处理发生异常", ex);
        }
	}
    public  boolean isNull(String param) {
    	if (null == param) {
            return true;
        } else if (0 == param.trim().length()) {
            return true;
        }
        return false;
    }
}
