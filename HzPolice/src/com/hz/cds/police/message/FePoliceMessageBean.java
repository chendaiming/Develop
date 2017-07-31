package com.hz.cds.police.message;

/**
 * 民警进出记录实体类
 */
public class FePoliceMessageBean {
	private String peopleID;
	private String peopleName;
	private String peopleType;
	private String compareTime;
	private String inOutFlag;
	private String doorID;
	public String getPeopleID() {
		return peopleID;
	}
	public void setPeopleID(String peopleID) {
		this.peopleID = peopleID;
	}
	public String getPeopleName() {
		return peopleName;
	}
	public void setPeopleName(String peopleName) {
		this.peopleName = peopleName;
	}
	public String getPeopleType() {
		return peopleType;
	}
	public void setPeopleType(String peopleType) {
		this.peopleType = peopleType;
	}
	public String getCompareTime() {
		return compareTime;
	}
	public void setCompareTime(String compareTime) {
		this.compareTime = compareTime;
	}
	public String getInOutFlag() {
		return inOutFlag;
	}
	public void setInOutFlag(String inOutFlag) {
		this.inOutFlag = inOutFlag;
	}
	public String getDoorID() {
		return doorID;
	}
	public void setDoorID(String doorID) {
		this.doorID = doorID;
	}
	
}
