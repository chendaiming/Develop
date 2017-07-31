package com.hz.frm.bean;

public class WebSocketMessage {
    private String msgType = null;	// 消息类型
    private String content = null;	// 消息内容（字符串）
    private Object message = null;	// 消息内容（对象）

	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Object getMessage() {
		return message;
	}
	public void setMessage(Object message) {
		this.message = message;
	}
}
