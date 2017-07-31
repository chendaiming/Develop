package com.hz.db.util;

public class DbException extends Exception{

	private static final long serialVersionUID = -8829244575693408056L;
	private String errCode = null;	// 错误码
	private String errMsg = null;	// 错误消息

	public DbException(String errCode, String errMsg) {
		this.errCode = errCode;
		this.errMsg = errMsg;
	}

	public DbException(String errCode) {
		this.errCode = errCode;
		this.errMsg = DbCodeUtil.getDesc(errCode);
	}

	public DbException() {

	}




	public String getErrCode() {
		return errCode;
	}

	/**
	 * 设置错误码，系统自动转换中文描述
	 * @param errCode
	 */
	public void setErrCode(String errCode) {
		this.errCode = errCode;
		this.errMsg = DbCodeUtil.getDesc(errCode);
	}

	public String getErrMsg() {
		return errMsg;
	}

	public void setErrMsg(String errMsg) {
		this.errMsg = errMsg;
	}

	@Override
	public String toString() {
		return "错误码：" + this.errCode + ", 描述：" + this.errMsg;
	}
}
