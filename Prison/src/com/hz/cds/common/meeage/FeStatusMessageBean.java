package com.hz.cds.common.meeage;

import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

/**
 * 报警消息实体类
 */
public class FeStatusMessageBean {
	/** 设备类型 : 1 摄像机 2 网络报警 3 门禁 4 可视对讲 5 数字广播 6 红外报警 7 智能钥匙8电子围栏 9点名设备   */
	private String deviceType;
	/** 设备编号 */
	private String deviceID;	
	/** 设备状态 */
	private String status;
	/** 新版3.0设备类型 **/
	private String dvcType;
	
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
	
	public JSONObject getJson(String cusNumber){
		JSONObject json=new JSONObject();
		
		json.put("device_type", (this.dvcType != null)?this.dvcType:this.deviceType);
		
		json.put("device_id", this.deviceID);
		
		json.put("device_status", this.status);
		
		json.put("cusNumber", cusNumber);
		
		return json;
	}
}
