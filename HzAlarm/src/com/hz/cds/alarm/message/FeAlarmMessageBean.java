package com.hz.cds.alarm.message;

import com.hz.frm.util.Tools;

/**
 * 报警消息实体类
 */
public class FeAlarmMessageBean {
	private String recordId;            // 记录编号
	private String alarmID;				// 报警编号
	private String alarmName;           // 报警器名称
	private String level;               // 报警等级
	private String alarmAddrs;          // 报警地址
	private String alarmDeviceType;		// 报警设备类型
	private String alarmDeviceTypeName;	// 报警设备类型名称
	private String alarmType;			// 报警类型
	private String alarmTypeName;     
    private String alarmTime;			// 报警时间
    private String alarmAction;			// 报警动作
    private String remark;				// 备注
    private String receiveDeptId;       // 通知部门       
    private String alarmImg;            // 报警截图

    private String deptId;				// 部门编号
    private String handleFlag = "1";	// 处置标识：0.不处置（不符合处置条件的报警）、1.处置（符合处置条件的报警，默认）

	public String getRecordId() {
		return recordId;
	}
	public void setRecordId(String recordId) {
		this.recordId = recordId;
	}
	public String getAlarmID() {
		return alarmID;
	}
	public void setAlarmID(String alarmID) {
		this.alarmID = alarmID;
	}
	public String getAlarmName() {
		return alarmName;
	}
	public void setAlarmName(String alarmName) {
		this.alarmName = alarmName;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public String getAlarmAddrs() {
		return alarmAddrs;
	}
	public void setAlarmAddrs(String alarmAddrs) {
		this.alarmAddrs = alarmAddrs;
	}
	public String getAlarmDeviceType() {
		return alarmDeviceType;
	}
	public void setAlarmDeviceType(String alarmDeviceType) {
		this.alarmDeviceType = alarmDeviceType;
	}
	public String getAlarmDeviceTypeName() {
		return alarmDeviceTypeName;
	}
	public void setAlarmDeviceTypeName(String alarmDeviceTypeName) {
		this.alarmDeviceTypeName = alarmDeviceTypeName;
	}
	public String getAlarmType() {
		return alarmType;
	}
	public void setAlarmType(String alarmType) {
		this.alarmType = alarmType;
	}
	public String getAlarmTypeName() {
		return alarmTypeName;
	}
	public void setAlarmTypeName(String alarmTypeName) {
		this.alarmTypeName = alarmTypeName;
	}
	public String getAlarmTime() {
		return alarmTime;
	}
	public void setAlarmTime(String alarmTime) {
		this.alarmTime = alarmTime;
	}
	public String getAlarmAction() {
		return alarmAction;
	}
	public void setAlarmAction(String alarmAction) {
		this.alarmAction = alarmAction;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getReceiveDeptId() {
		return receiveDeptId;
	}
	public void setReceiveDeptId(String receiveDeptId) {
		this.receiveDeptId = receiveDeptId;
	}
	public String getAlarmImg() {
		return alarmImg;
	}
	public void setAlarmImg(String alarmImg) {
		alarmImg = Tools.writeImgByBase64Str(alarmImg,"alarm");
		this.alarmImg = alarmImg;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getHandleFlag() {
		return handleFlag;
	}
	public void setHandleFlag(String handleFlag) {
		this.handleFlag = handleFlag;
	}
}
