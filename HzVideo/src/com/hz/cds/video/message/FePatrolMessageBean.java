package com.hz.cds.video.message;

/**
 * 巡更消息实体类
 * 
 * @author chendm	
 *
 * @date 2017年01月16日
 */
public class FePatrolMessageBean {
	private String cusNumber;
	private String recordId="";
	private String pointId;
	private String lineId;
	private String policeId;
	private String realTime;
	private String status = "0";

	
	//============= 推送消息 ===============
	//巡更设备编号
	private String patrolDevId = "";
	//巡更标签编号
	private String patrolTagId = "";
	//巡更时间
	private String patrolTime = "";



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
	public String getPointId() {
		return pointId;
	}
	public void setPointId(String pointId) {
		this.pointId = pointId;
	}
	public String getLineId() {
		return lineId;
	}
	public void setLineId(String lineId) {
		this.lineId = lineId;
	}
	public String getPoliceId() {
		return policeId;
	}
	public void setPoliceId(String policeId) {
		this.policeId = policeId;
	}
	public String getRealTime() {
		return realTime;
	}
	public void setRealTime(String realTime) {
		this.realTime = realTime;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPatrolDevId() {
		return patrolDevId;
	}
	public void setPatrolDevId(String patrolDevId) {
		this.patrolDevId = patrolDevId;
	}
	public String getPatrolTagId() {
		return patrolTagId;
	}
	public void setPatrolTagId(String patrolTagId) {
		this.patrolTagId = patrolTagId;
	}
	public String getPatrolTime() {
		return patrolTime;
	}
	public void setPatrolTime(String patrolTime) {
		this.patrolTime = patrolTime;
	}
	
	
	
}
