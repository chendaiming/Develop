package com.hz.cds.callroll.message.bean;

public class CallRollingBean {

	private String crdCusNumber = null; 		// 机构编号
	private String crdRecordId = null; 			// 点名记录编号
	private String crdPrisonerId = null; 		// 点名罪犯编号
	private String crdPrisonerName = null; 		// 点名罪犯姓名
	private String crdDprtId = null; 			// 罪犯部门编号
	private String crdDprtName = null; 			// 罪犯部门名称
	private String crdPoliceId = null; 			// 点名民警编号
	private String crdTime = null; 				// 点名时间
	private String crdStatus = null; 			// 点名状态：0.未点名、1.已点名
	private String crdUpdateTime = null; 		// 更新时间

	public String getCrdCusNumber() {
		return crdCusNumber;
	}
	public void setCrdCusNumber(String crdCusNumber) {
		this.crdCusNumber = crdCusNumber;
	}
	public String getCrdRecordId() {
		return crdRecordId;
	}
	public void setCrdRecordId(String crdRecordId) {
		this.crdRecordId = crdRecordId;
	}
	public String getCrdPrisonerId() {
		return crdPrisonerId;
	}
	public void setCrdPrisonerId(String crdPrisonerId) {
		this.crdPrisonerId = crdPrisonerId;
	}
	public String getCrdPrisonerName() {
		return crdPrisonerName;
	}
	public void setCrdPrisonerName(String crdPrisonerName) {
		this.crdPrisonerName = crdPrisonerName;
	}
	public String getCrdDprtId() {
		return crdDprtId;
	}
	public void setCrdDprtId(String crdDprtId) {
		this.crdDprtId = crdDprtId;
	}
	public String getCrdDprtName() {
		return crdDprtName;
	}
	public void setCrdDprtName(String crdDprtName) {
		this.crdDprtName = crdDprtName;
	}
	public String getCrdPoliceId() {
		return crdPoliceId;
	}
	public void setCrdPoliceId(String crdPoliceId) {
		this.crdPoliceId = crdPoliceId;
	}
	public String getCrdTime() {
		return crdTime;
	}
	public void setCrdTime(String crdTime) {
		this.crdTime = crdTime;
	}
	public String getCrdStatus() {
		return crdStatus;
	}
	public void setCrdStatus(String crdStatus) {
		this.crdStatus = crdStatus;
	}
	public String getCrdUpdateTime() {
		return crdUpdateTime;
	}
	public void setCrdUpdateTime(String crdUpdateTime) {
		this.crdUpdateTime = crdUpdateTime;
	}

}
