package com.hz.db.bean;

public class DbCodeBean {
	public String module = "";		// 业务模块
	public String code = "";		// 编码
	public String desc = "";		// 描述
	public String plus = "";		// 附加描述（对编码描述的额外附加描述）

	public String getModule() {
		return module;
	}
	public void setModule(String module) {
		this.module = module;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getPlus() {
		return plus;
	}
	public void setPlus(String plus) {
		this.plus = plus;
	}
	
	public String getDescAndPlus() {
		return desc + ((plus != null && plus.trim().length() > 0) ? (";" + plus) : "");
	}
}
