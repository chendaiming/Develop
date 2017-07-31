package com.hz.cds.callroll.message.bean;

/**
 * RFID消息实体类
 */
public class TimingCallRollMessageBean {

	private String tagType = "";	// 标签类型
	private String tagId = "";		// rfid标签号
	private String deviceId = "";	// rfid平台id
	private String oldDeviceId = "";// 上一个设备
	private String inOut = "";		// 进出标识(1进，2出)
	private String time = "";		// 时间

	public String getTagType() {
		return tagType;
	}
	public void setTagType(String tagType) {
		this.tagType = tagType;
	}
	public String getTagId() {
		return tagId;
	}
	public void setTagId(String tagId) {
		this.tagId = tagId;
	}
	public String getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}
	public String getOldDeviceId() {
		return oldDeviceId;
	}
	public void setOldDeviceId(String oldDeviceId) {
		this.oldDeviceId = oldDeviceId;
	}
	public String getInOut() {
		return inOut;
	}
	public void setInOut(String inOut) {
		this.inOut = inOut;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}


}
