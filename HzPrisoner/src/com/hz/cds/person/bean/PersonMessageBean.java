package com.hz.cds.person.bean;

public class PersonMessageBean {
	//人员编号
	private  String personId;
	//人员类型 0：犯人 1：民警
	private String personType;
	//人脸库照片
	private String personDataImg;
	//现场照片
	private String personNowImg;
	//摄像机ID
	private String cameraId;
	//发送时间
	private String sendTime;
	
	
	public String getCameraId() {
		return cameraId;
	}
	public void setCameraId(String cameraId) {
		this.cameraId = cameraId;
	}
	public String getPersonId() {
		return personId;
	}
	public void setPersonId(String personId) {
		this.personId = personId;
	}
	public String getPersonType() {
		return personType;
	}
	public void setPersonType(String personType) {
		this.personType = personType;
	}
	public String getPersonDataImg() {
		return personDataImg;
	}
	public void setPersonDataImg(String personDataImg) {
		this.personDataImg = personDataImg;
	}
	public String getPersonNowImg() {
		return personNowImg;
	}
	public void setPersonNowImg(String personNowImg) {
		this.personNowImg = personNowImg;
	}
	public String getSendTime() {
		return sendTime;
	}
	public void setSendTime(String sendTime) {
		this.sendTime = sendTime;
	}
	
}
