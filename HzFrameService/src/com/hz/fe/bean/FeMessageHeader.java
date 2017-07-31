package com.hz.fe.bean;


public class FeMessageHeader {
	private String 	cusNumber	= null;	// 机构号
	private String 	msgID 		= null;	// 消息编号
	private String 	msgType 	= null;	// 消息类型
	private String 	sender 		= null;	// 发送者
	private String 	sendTime 	= null;	// 发送时间
	private String 	recevier 	= null;	// 接收者
	private Integer length 		= 0;	// 消息长度

	public String getCusNumber() {
		return cusNumber;
	}
	public void setCusNumber(String cusNumber) {
		this.cusNumber = cusNumber;
	}
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
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getSendTime() {
		return sendTime;
	}
	public void setSendTime(String sendTime) {
		this.sendTime = sendTime;
	}
	public String getRecevier() {
		return recevier;
	}
	public void setRecevier(String recevier) {
		this.recevier = recevier;
	}
	public Integer getLength() {
		return length;
	}
	public void setLength(Integer length) {
		this.length = length;
	}
}
