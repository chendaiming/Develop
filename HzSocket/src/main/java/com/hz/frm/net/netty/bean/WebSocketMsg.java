package com.hz.frm.net.netty.bean;

import com.alibaba.fastjson.JSONObject;

/**
 * 客户端消息类
 */
public class WebSocketMsg {
	/** 消息ID KEY */
	public final static String MSG_ID_KEY = "msgId";
	/** 业务ID KEY */
	public final static String SERVICE_ID_KEY = "serviceId";
	/** 用户ID KEY */
	public final static String USER_ID_KEY = "userId";
	/** 机构编号 KEY */
	public final static String CUS_NUMBER_KEY = "cusNumber";
	/** 消息体 KEY*/
	public final static String MSG_BODY_KEY = "msg";
	/** 调用的方法名称*/
	public final static String METHOD_KEY="method";
	
	/** 消息唯一编号(常用于消息处理异常时定位问题) */
	private String msgId;
	/** 消息业务ID */
	private String serviceId;
	/** 用户ID*/
    private String userId;
    /** 机构*/
    private String cusNumber;
    /** 消息报文体 */
    private String msg;
    /** 调用的方法 */
    private String method;
    public WebSocketMsg() {
    	
    }
    
	/** 
	 * 解析消息
	 * @param jsonMsg
	 */
	public WebSocketMsg(final String jsonMsg) {
		JSONObject route = JSONObject.parseObject(jsonMsg);
		this.msgId = route.getString(MSG_ID_KEY);
		this.serviceId = route.getString(SERVICE_ID_KEY);
		this.userId = route.getString(USER_ID_KEY);
		this.cusNumber = route.getString(CUS_NUMBER_KEY);
		this.msg = route.getString(MSG_BODY_KEY);
		this.method=route.getString(METHOD_KEY);
	}
	
	
    /**
     * 组完整消息(暂时只返回msg)
     * @return
     */
    public static String pkgMsg(String serviceId, String userId, String CusNumber, String msg) {
    	return msg;
    }
    
	public String getMsgId() {
		return msgId;
	}
	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}
	public String getServiceId() {
		return serviceId;
	}
	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getCusNumber() {
		return cusNumber;
	}
	public void setCusNumber(String CusNumber) {
		this.cusNumber = CusNumber;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}
	
}
