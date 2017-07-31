package com.hz.frm.net.netty.tcpsocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.netty.service.IMsgChannel;
import com.hz.frm.net.netty.service.IService;

public class TcpSocketMsgHandlerRunnable implements Runnable {
	private IMsgChannel msgChannel = null;
	private IService service = null;
	private JSONObject msg = null;
	
	private final Logger logger = LoggerFactory.getLogger(TcpSocketMsgHandlerRunnable.class);
	
	public TcpSocketMsgHandlerRunnable(IMsgChannel msgChannel, IService service, JSONObject msg) {
		this.msgChannel = msgChannel;
		this.service = service;
		this.msg = msg;
	}
	
	@Override
	public void run() {
		try {
            service.handleMsg(msg);
        } catch (Throwable ex) {
        	logger.error("msg:" + msg + " 处理发生异常", ex);
        }
	}

}
