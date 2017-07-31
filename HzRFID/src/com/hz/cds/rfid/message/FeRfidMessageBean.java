package com.hz.cds.rfid.message;

/**
 * RFID消息实体类
 * 
 * @author chendm	
 *
 * @date 2017年01月16日
 */
public class FeRfidMessageBean {
	// 机构号
	private String cusNumber = "";	
	//记录编号
	private String recordId = "";
	//RFID基站编号
	private String rfidId = "";
	//RFID基站名称
	private String rfidName = "";
	//部门编号
	private String rfidDeptId = "";
	//部门名称
	private String rfidDeptName = "";
	//检测标识(1，进，2，出)
	private String monitorFlag = "";
	//检测时间
	private String monitorTime = "";
	//人员类型: 1 警员、2.罪犯
	private String peopleType = "";
	//人员编号
	private String peopleId = "";
	//人员名称
	private String peopleName = "";
	//区域id
	private String areaId = "";
	//区域名称
	private String areaName = "";
	//标签类型
	private String labelType = "";
	//标签编码
	private String labelCode = "";
	//记录时间
	private String recordTime = "";
	//备注
	private String remark = "";
	//上一个基站编号
	private String beforeRfidId = "";
	//上一个基站名称
	private String beforeRfidName = "";
	//三维地图xyz坐标
	private String posXYZ = "";
	
	
	//状态 0 rfid正常   1 rfid异常
	private String rfidStatus = "0";

	// 是否越界
	private boolean isOver = false;
	
 	//摄像机id
	private Object[] cameraIds;


	//============= 推送消息 ===============
	//rfid标签号
	private String tagId = "";
	//rfid平台id
	private String deviceId = "";
	//上一个设备
	private String oldDeviceId = "";
	//进出标识(1进，2出)
	private String inOut = "";
	//标签类型
	private String tagType = "";
	//时间
	private String time = "";
	
	
	public String getPosXYZ() {
		return posXYZ;
	}
	public void setPosXYZ(String posXYZ) {
		this.posXYZ = posXYZ;
	}
	public String getCusNumber() {
		return cusNumber;
	}
	public void setCusNumber(String cusNumber) {
		this.cusNumber = cusNumber;
	}
	public String getRecordId() {
		return recordId;
	}
	public void setRecordId(String recordId) {
		this.recordId = recordId;
	}
	public String getRfidId() {
		return rfidId;
	}
	public void setRfidId(String rfidId) {
		this.rfidId = rfidId;
	}
	public String getRfidName() {
		return rfidName;
	}
	public void setRfidName(String rfidName) {
		this.rfidName = rfidName;
	}
	public String getRfidDeptId() {
		return rfidDeptId;
	}
	public void setRfidDeptId(String rfidDeptId) {
		this.rfidDeptId = rfidDeptId;
	}
	public String getRfidDeptName() {
		return rfidDeptName;
	}
	public void setRfidDeptName(String rfidDeptName) {
		this.rfidDeptName = rfidDeptName;
	}
	public String getMonitorFlag() {
		return monitorFlag;
	}
	public void setMonitorFlag(String monitorFlag) {
		this.monitorFlag = monitorFlag;
	}
	public String getMonitorTime() {
		return monitorTime;
	}
	public void setMonitorTime(String monitorTime) {
		this.monitorTime = monitorTime;
	}
	public String getPeopleType() {
		return peopleType;
	}
	public void setPeopleType(String peopleType) {
		this.peopleType = peopleType;
	}
	public String getPeopleId() {
		return peopleId;
	}
	public void setPeopleId(String peopleId) {
		this.peopleId = peopleId;
	}
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getLabelType() {
		return labelType;
	}
	public void setLabelType(String labelType) {
		this.labelType = labelType;
	}
	
	public String getLabelCode() {
		return labelCode;
	}
	public void setLabelCode(String labelCode) {
		this.labelCode = labelCode;
	}
	public String getRecordTime() {
		return recordTime;
	}
	public void setRecordTime(String recordTime) {
		this.recordTime = recordTime;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getRfidStatus() {
		return rfidStatus;
	}
	public void setRfidStatus(String rfidStatus) {
		this.rfidStatus = rfidStatus;
	}
	public Object[] getCameraIds() {
		return cameraIds;
	}
	public void setCameraIds(Object[] cameraIds) {
		this.cameraIds = cameraIds;
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
	public String getTagType() {
		return tagType;
	}
	public void setTagType(String tagType) {
		this.tagType = tagType;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getPeopleName() {
		return peopleName;
	}
	public void setPeopleName(String peopleName) {
		this.peopleName = peopleName;
	}
	public String getBeforeRfidId() {
		return beforeRfidId;
	}
	public void setBeforeRfidId(String beforeRfidId) {
		this.beforeRfidId = beforeRfidId;
	}
	public String getBeforeRfidName() {
		return beforeRfidName;
	}
	public void setBeforeRfidName(String beforeRfidName) {
		this.beforeRfidName = beforeRfidName;
	}
	public boolean isOver() {
		return isOver;
	}
	public void setOver(boolean isOver) {
		this.isOver = isOver;
	}
	
	
	
	
	
	
}
