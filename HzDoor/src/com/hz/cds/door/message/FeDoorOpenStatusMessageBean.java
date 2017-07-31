package com.hz.cds.door.message;

public class FeDoorOpenStatusMessageBean {
	private String cusNumber;
	private String doorId;
	private String doorStatus;
	private String lockStatus;
	private String statusTime;
	
	public String getCusNumber() {
		return cusNumber;
	}
	public void setCusNumber(String cusNumber) {
		this.cusNumber = cusNumber;
	}
	public String getDoorId() {
		return doorId;
	}
	public void setDoorId(String doorId) {
		this.doorId = doorId;
	}
	public String getDoorStatus() {
		return doorStatus;
	}
	public void setDoorStatus(String doorStatus) {
		this.doorStatus = doorStatus;
	}
	public String getLockStatus() {
		return lockStatus;
	}
	public void setLockStatus(String lockStatus) {
		this.lockStatus = lockStatus;
	}
	public String getStatusTime() {
		return statusTime;
	}
	public void setStatusTime(String statusTime) {
		this.statusTime = statusTime;
	}
}
