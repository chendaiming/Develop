package com.hz.frm.bean;

/**
 * 响应前端的实体类
 * @author xie.yh 2016.08.17
 */
public class ResponseBean {

	/* 属性定义 */ 
	private String respCode = null;		// 响应编码
	private String respMsg = null;		// 响应描述
	private Object data = null;			// 响应数据


	/**
	 * 构造函数定义
	 * @param respCode	响应编码
	 * @param respMsg	响应描述
	 * @param data		响应数据
	 */
	public ResponseBean (String respCode, String respMsg, Object data) {
		this.respCode = respCode;
		this.respMsg = respMsg;
		this.data = data;
	}

	/**
	 * 构造函数定义
	 * @param respCode	响应编码
	 * @param respMsg	响应描述
	 */
	public ResponseBean (String respCode, String respMsg) {
		this.respCode = respCode;
		this.respMsg = respMsg;
	}

	/**
	 * 构造函数定义
	 * @param respCode	响应编码
	 */
	public ResponseBean (String respCode) {
		this.respCode = respCode;
	}

	/**
	 * 构造函数定义
	 */
	public ResponseBean () {
		
	}



	/*
	 * 属性的get/set方法定义
	 */
	public String getRespCode() {
		return respCode;
	}
	public void setRespCode(String respCode) {
		this.respCode = respCode;
	}
	public String getRespMsg() {
		return respMsg;
	}
	public void setRespMsg(String respMsg) {
		this.respMsg = respMsg;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
}
