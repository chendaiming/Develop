package com.hz.frm.net.amq.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.netty.bean.WebSocketMsgToWeb;

/**
 * 发送MQ消息类
 * @author zhongxy
 *
 */
@Service
public class MqMessageSendService {

	@Autowired
	private SendMqMessageAction<String> sendInternalFeMessageAction = null;
	@Autowired
	private SendMqMessageAction<String> sendInternalWebMessageAction = null;
	@Autowired
	private SendMqMessageAction<String> sendFeMessageAction = null;

	/**
	 * 向前置机内部Queue发送消息
	 * @param cusNumber
	 * @param msg
	 */
	public  void sendInternalFeMessage(String msg, String cusNumber) {
		sendInternalFeMessageAction.send(msg, cusNumber,null);
	}
	
	/**
	 * 向前置机发送消息
	 * @param msg
	 * @param cusNumber
	 * @param msgId
	 */
	public void sendFeMessage(String msg, String cusNumber){
		sendFeMessageAction.send(msg, cusNumber,null);
	}

	/**
	 * 向Web端Queue发送消息
	 * @param userId
	 * @param msg
	 */
	public void sendInternalWebMessage(Object msg, String cusNumber,String msgType) {
		//预先检查channel是否存在
//		if (checkUserOnline(userId)) {
//			msgSender.getSendNettyMessage().send(msg, userId);
//		}

		WebSocketMsgToWeb webSocketMsgToWeb = new WebSocketMsgToWeb();
		webSocketMsgToWeb.setMsgType(msgType);
		webSocketMsgToWeb.setMsg(msg);
		sendInternalWebMessageAction.send(JSONObject.toJSONString(webSocketMsgToWeb), cusNumber, null);
	}
}
