package com.hz.frm.net.netty.service.impl;

import java.lang.reflect.Constructor;
import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.service.IMsgChannel;

public abstract class MsgDispatcher {

    abstract public void init(NettyConfig config,MsgChannelManager msgChannelManager, MsgComsumerGroup comsumer);

    abstract public void dispatch(IMsgChannel msgChannel,Object msg);

    abstract public String getErrMsg(Object reqMsg, String msg);

    abstract public void close();

    /**
     * 创建分派器
     * @param config
     * @return
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
	static public MsgDispatcher createMsgDispatcher(NettyConfig config){
        try {
			Class clazz = null;
			if (NettyConfig.TCP_SOCKET_MODE.equals(config.getCommunicationMode())) {
				clazz = Class.forName(config.getTcpSocketMsgDispatcherClass());
			} else {
				clazz = Class.forName(config.getMsgDispatcherClass());
			}
            Constructor cons = clazz.getConstructor();
            return (MsgDispatcher)cons.newInstance();
        }catch (Throwable ex){
            throw new RuntimeException(ex);
        }
    }
}
