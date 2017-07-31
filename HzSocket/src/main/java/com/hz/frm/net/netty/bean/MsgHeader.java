package com.hz.frm.net.netty.bean;


public class MsgHeader {
	private String msgID;
	private String msgType;
	private Integer length;
	private String sender;
	private String recevier;
	private String sendTime;
	
	public String getMsgID() {
		return msgID;
	}
	public void setMsgID(String msgID) {
		this.msgID = msgID;
	}
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public Integer getLength() {
		return length;
	}
	public void setLength(Integer length) {
		this.length = length;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getRecevier() {
		return recevier;
	}
	public void setRecevier(String recevier) {
		this.recevier = recevier;
	}
	public String getSendTime() {
		return sendTime;
	}
	public void setSendTime(String sendTime) {
		this.sendTime = sendTime;
	}

}
