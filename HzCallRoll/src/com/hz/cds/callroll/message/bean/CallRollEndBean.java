package com.hz.cds.callroll.message.bean;

public class CallRollEndBean {

	private String crmCusNumber = null; 	// 机构编号
	private String crmRecordId = null; 		// 点名记录编号
	private String crmSerialCode = null; 	// 点名批次流水号
	private String crmBatchCode = null; 	// 点名批次编号
	private String crmDprtId = null; 		// 点名部门编号
	private String crmDprtName = null; 		// 点名部门名称
	private String crmPoliceId = null; 		// 点名民警编号
	private String crmPoliceName = null; 	// 点名民警名称
	private String crmPredictNum = null; 	// 预计点名人数
	private String crmFactNum = null; 		// 实际点名人数
	private String crmBeginTime = null; 	// 点名开始时间
	private String crmEndTime = null; 		// 点名结束时间

	public String getCrmCusNumber() {
		return crmCusNumber;
	}
	public void setCrmCusNumber(String crmCusNumber) {
		this.crmCusNumber = crmCusNumber;
	}
	public String getCrmRecordId() {
		return crmRecordId;
	}
	public void setCrmRecordId(String crmRecordId) {
		this.crmRecordId = crmRecordId;
	}
	public String getCrmSerialCode() {
		return crmSerialCode;
	}
	public void setCrmSerialCode(String crmSerialCode) {
		this.crmSerialCode = crmSerialCode;
	}
	public String getCrmBatchCode() {
		return crmBatchCode;
	}
	public void setCrmBatchCode(String crmBatchCode) {
		this.crmBatchCode = crmBatchCode;
	}
	public String getCrmDprtId() {
		return crmDprtId;
	}
	public void setCrmDprtId(String crmDprtId) {
		this.crmDprtId = crmDprtId;
	}
	public String getCrmDprtName() {
		return crmDprtName;
	}
	public void setCrmDprtName(String crmDprtName) {
		this.crmDprtName = crmDprtName;
	}
	public String getCrmPoliceId() {
		return crmPoliceId;
	}
	public void setCrmPoliceId(String crmPoliceId) {
		this.crmPoliceId = crmPoliceId;
	}
	public String getCrmPoliceName() {
		return crmPoliceName;
	}
	public void setCrmPoliceName(String crmPoliceName) {
		this.crmPoliceName = crmPoliceName;
	}
	public String getCrmPredictNum() {
		return crmPredictNum;
	}
	public void setCrmPredictNum(String crmPredictNum) {
		this.crmPredictNum = crmPredictNum;
	}
	public String getCrmFactNum() {
		return crmFactNum;
	}
	public void setCrmFactNum(String crmFactNum) {
		this.crmFactNum = crmFactNum;
	}
	public String getCrmBeginTime() {
		return crmBeginTime;
	}
	public void setCrmBeginTime(String crmBeginTime) {
		this.crmBeginTime = crmBeginTime;
	}
	public String getCrmEndTime() {
		return crmEndTime;
	}
	public void setCrmEndTime(String crmEndTime) {
		this.crmEndTime = crmEndTime;
	}
}
