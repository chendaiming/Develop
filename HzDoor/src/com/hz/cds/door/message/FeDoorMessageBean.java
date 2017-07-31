package com.hz.cds.door.message;

/**
 * 门禁消息实体类
 */
public class FeDoorMessageBean {
	private String cusNumber;
	private String doorId;
	private String doorName;
	private String cardId;
	private String peopleName;
	private String brushCardTime;
	private String peopleType;
	private String inOutFlag;
	private String status;
	private String remark;
	
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
	
	public String getDoorName() {
		return doorName;
	}
	public void setDoorName(String doorName) {
		this.doorName = doorName;
	}
	public String getCardId() {
		return cardId;
	}
	public void setCardId(String cardId) {
		this.cardId = cardId;
	}
	public String getPeopleName() {
		return peopleName;
	}
	public void setPeopleName(String peopleName) {
		this.peopleName = peopleName;
	}
	public String getBrushCardTime() {
		return brushCardTime;
	}
	public void setBrushCardTime(String brushCardTime) {
		this.brushCardTime = brushCardTime;
	}
	public String getPeopleType() {
		return peopleType;
	}
	public void setPeopleType(String peopleType) {
		this.peopleType = peopleType;
	}
	public String getInOutFlag() {
		return inOutFlag;
	}
	public void setInOutFlag(String inOutFlag) {
		this.inOutFlag = inOutFlag;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
}
