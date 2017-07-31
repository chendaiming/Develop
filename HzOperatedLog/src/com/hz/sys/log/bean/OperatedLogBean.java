package com.hz.sys.log.bean;

public class OperatedLogBean {

	private Object cusNumber = ""; 		// 机构号
	private Object id = ""; 			// 操作ID
	private Object type = ""; 			// 操作类型
	private Object userId = ""; 		// 操作用户ID
	private Object userName = ""; 		// 操作用户姓名
	private Object operatedTime = ""; 	// 操作时间
	private Object operatedDesc = ""; 	// 操作内容
	private Object loginIp = ""; 		// 登录IP
	private Object systemTime = ""; 	// 系统时间

	public Object getCusNumber() {
		return cusNumber;
	}
	public void setCusNumber(Object cusNumber) {
		this.cusNumber = cusNumber;
	}
	public Object getId() {
		return id;
	}
	public void setId(Object id) {
		this.id = id;
	}
	public Object getType() {
		return type;
	}
	public void setType(Object type) {
		this.type = type;
	}
	public Object getUserId() {
		return userId;
	}
	public void setUserId(Object userId) {
		this.userId = userId;
	}
	public Object getUserName() {
		return userName;
	}
	public void setUserName(Object userName) {
		this.userName = userName;
	}
	public Object getOperatedTime() {
		return operatedTime;
	}
	public void setOperatedTime(Object operatedTime) {
		this.operatedTime = operatedTime;
	}
	public Object getOperatedDesc() {
		return operatedDesc;
	}
	public void setOperatedDesc(Object operatedDesc) {
		this.operatedDesc = operatedDesc;
	}
	public Object getLoginIp() {
		return loginIp;
	}
	public void setLoginIp(Object loginIp) {
		this.loginIp = loginIp;
	}
	public Object getSystemTime() {
		return systemTime;
	}
	public void setSystemTime(Object systemTime) {
		this.systemTime = systemTime;
	}
}
