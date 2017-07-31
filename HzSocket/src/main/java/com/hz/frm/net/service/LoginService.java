package com.hz.frm.net.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.netty.bean.FepMessage;
import com.hz.frm.net.netty.bean.MsgHeader;
import com.hz.frm.net.netty.bean.WebSocketMsg;
import com.hz.frm.net.netty.service.IMsgChannel;
import com.hz.frm.net.netty.service.impl.MsgChannelManager;
import com.hz.frm.net.netty.util.DateUtil;
import com.hz.frm.net.netty.util.MessageSeq;
import com.hz.frm.net.netty.websocket.WebSocketMsgSender;

public class LoginService {
	private final static Logger logger=LoggerFactory.getLogger(LoginService.class);
	private String EndTag = new String(new byte[]{(byte) 0x0D, (byte) 0x0A});
	public String login(IMsgChannel msgChannel,MsgChannelManager msgChannelManager,WebSocketMsg msg) {
		logger.debug("WebSocket连接：cusNumber：" + msg.getCusNumber() + "，userId：" + msg.getUserId());

        WebSocketMsgSender msgSender = new WebSocketMsgSender();
        msgSender.setMsgChannel(msgChannel);
        msgSender.setMsgChannelManager(msgChannelManager);
        msgSender.loginSuccess(msg.getCusNumber(),msg.getUserId());

        JSONObject json=new JSONObject();
        json.put("msgType", "0001");
        json.put("msgId", msg.getMsgId());
        json.put("cusNumber", msg.getCusNumber());
        json.put("userId", msg.getUserId());

        JSONObject content=new JSONObject();
        content.put("successFlag", true);
        content.put("msg", "websocket login success");
        json.put("content", content.toJSONString());
		return json.toJSONString();
	}

	public String login(IMsgChannel msgChannel, Object msg) {
		JSONObject jsonMsg = JSONObject.parseObject(msg.toString());
		MsgHeader msgHeader = (MsgHeader)JSONObject.parseObject(jsonMsg.get("header").toString(), MsgHeader.class);
		//记住登录消息的通道
		MsgChannelManager.getMsgChannelManager().putMsgChannel(msgChannel, msgHeader.getSender());
		//返回登录信息
		FepMessage loginAckMessage = new FepMessage();
		MsgHeader ackHeader = loginAckMessage.getHeader();
		ackHeader.setMsgType("Login02");
		ackHeader.setSender(msgHeader.getRecevier());
		ackHeader.setRecevier(msgHeader.getSender());
		ackHeader.setMsgID(MessageSeq.getMsgSeq(ackHeader.getSender()));
		Map<String, String> body = new HashMap<String, String>();
		body.put("msgID", msgHeader.getMsgID());
		body.put("result", "0");
		body.put("error", "");
		JSONObject ack = new JSONObject();
		ack.put("header", ackHeader);
		ack.put("body", body);
		
		loginAckMessage.setMsg(ack.toJSONString());
		msgChannel.write(loginAckMessage.getMsg()+EndTag);
		logger.info(DateUtil.getTodayString()+"Send Fep Msg:"+loginAckMessage.getMsg()+EndTag);
		return null;
	}

}
