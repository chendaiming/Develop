package com.hz.frm.net.netty.bean;

import com.hz.frm.net.netty.util.MessageSeq;

public class WebSocketMsgToWeb {
	private String msgId;
	private String msgType;
	private Object msg;
	public String getMsgId() {
		if (msgId == null) {
			msgId = MessageSeq.getMsgSeq("");
		}
		return msgId;
	}
	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public Object getMsg() {
		return msg;
	}
	public void setMsg(Object msg) {
		this.msg = msg;
	}
	
}
