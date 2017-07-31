package com.hz.frm.bean;

public class AjaxMessage {
	private Boolean success = null;
	private String msg = null;
	private Object obj = null;
	
	public AjaxMessage (Boolean success, Object obj, String msg) {
		
	}
	
	public AjaxMessage (Boolean success, Object obj) {
		
	}
	
	public AjaxMessage (Boolean success) {
		
	}
	public AjaxMessage () {
		
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}
}
