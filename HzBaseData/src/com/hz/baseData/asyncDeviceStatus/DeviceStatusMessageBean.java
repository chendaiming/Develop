package com.hz.baseData.asyncDeviceStatus;

import java.util.HashMap;
import java.util.Map;

public class DeviceStatusMessageBean {

	private String deviceType = "";	// 设备类型（旧），类型参考文档《安防系统接入技术规范1.2.0.docx》
	private String deviceID = "";	// 设备编号
	private String status = "";		// 设备状态
	private String dvcType = "";	// 设备类型（新），类型参考文档《安防系统接入技术规范1.2.0.docx》内的设备类型字典说明


	public String getDeviceType() {
		return deviceType;
	}
	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}
	public String getDeviceID() {
		return deviceID;
	}
	public void setDeviceID(String deviceID) {
		this.deviceID = deviceID;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	public String getDvcType() {
		return dvcType;
	}
	public void setDvcType(String dvcType) {
		this.dvcType = dvcType;
	}

	public Map<String,Object> getMap(String cus){
		Map<String,Object> map = new HashMap<String,Object>();

		map.put("deviceType", this.deviceType);
		map.put("deviceID", this.deviceID);
		map.put("status", this.status);
		map.put("dvcType", this.dvcType);
		map.put("cus", cus);

		return map;
	}


}
