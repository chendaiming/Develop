package com.hz.db.bean;

/**
 * 更新结果
 * @author xie.yh
 */
public class UpdateResp {
	private Boolean success = false;	// 更新结果
	private Object data = null;			// 返回数据

	public Boolean getSuccess() {
		return success;
	}
	public void setSuccess(Boolean success) {
		this.success = success;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
}
