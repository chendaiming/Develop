package com.hz.frm.net.netty.websocket;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hz.frm.net.netty.bean.WebSocketMsg;
import com.hz.frm.net.netty.service.IMsgChannel;
import com.hz.frm.net.netty.service.IMsgSender;
import com.hz.frm.net.netty.service.impl.MsgChannelManager;

public class WebSocketMsgSender implements IMsgSender {
    private IMsgChannel msgChannel = null;
    private MsgChannelManager msgChannelManager = null;
    private final Logger logger = LoggerFactory.getLogger(WebSocketMsgSender.class);
	
    public void setMsgChannel(IMsgChannel msgChannel) {
        this.msgChannel = msgChannel;
    }

    public void setMsgChannelManager(MsgChannelManager msgChannelManager) {
        this.msgChannelManager = msgChannelManager;
    }
    
    @Override
    public void loginSuccess(String cusNumber,String userId) {
        msgChannel.setUserId(userId);
        //测试值
        msgChannel.setBranch(cusNumber);
        this.msgChannelManager.putMsgChannel(msgChannel);
    }

    @Override
    public void logout(String userId) {
        IMsgChannel mc = this.msgChannelManager.getMsgChannel(userId);
        if (mc != null) {
            this.msgChannelManager.removeMsgChannel(userId);
            mc.close();
        }else{
            logger.warn("用户:{}的连接找不到",userId);
        }

    }

	@Override
	public void sendMsg(String serviceId, String userId, Object msg) {
		String[] userIdList = {userId};
        sendMsg(serviceId, Arrays.asList(userIdList), msg);
	}

	@Override
	public void sendMsg(String serviceId, List<String> userIdList, Object msg) {
		for (int i = 0; i < userIdList.size(); i++) {
            String userId = userIdList.get(i);
            IMsgChannel channel = this.msgChannelManager.getMsgChannel(userId);
            if (channel != null) {
                String msgStr = WebSocketMsg.pkgMsg(serviceId, userId, channel.getBranch(), msg.toString());
                if (msgStr != null) {
                    try {
                        channel.write(msgStr);
                    }catch (Throwable ex){
                        logger.error("写用户:"+userId+"的MsgChannel发生异常",ex);
                    }
                }
            }else{
                logger.warn("用户:{}的连接找不到,无法发送消息",userIdList);
            }
        }

	}

	@Override
	public void sendMsgOnline(String serviceId, Object msg) {
		List<String> userIdList = msgChannelManager.getUserList();
        sendMsg(serviceId, userIdList,msg);
	}

}
