package com.hz.cds.talkback.message;

public class TalkbackMessageBean {

	private String callId 	= null;		// 呼叫方编号
	private String recId 	= null;		// 接听方编号
	private String callTime = null;		// 呼叫时间
	private String connTime = null;		// 接通时间
	private String endTime 	= null;		// 结束时间
	private String remark 	= null;		// 备注

	public String getCallId() {
		return callId;
	}
	public void setCallId(String callId) {
		this.callId = callId;
	}
	public String getRecId() {
		return recId;
	}
	public void setRecId(String recId) {
		this.recId = recId;
	}
	public String getCallTime() {
		return callTime;
	}
	public void setCallTime(String callTime) {
		this.callTime = callTime;
	}
	public String getConnTime() {
		return connTime;
	}
	public void setConnTime(String connTime) {
		this.connTime = connTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
}
