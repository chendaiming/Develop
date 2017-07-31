package com.hz.frm.bean;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;

/**
 * 会话实体类
 * @author xie.yh
 */
public class SessionBean{
	private static final SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private String sessionId = null;// 会话ID
	private String loginIp = null;// 登录IP
	private String loginKey = null;// 登录标识(唯一)
	private Long   loginTime = ( new Date() ).getTime();// 登录时间
	private String loginTimeStr = SDF.format( new Date() );

	private HashMap<String, Object> attributes = new LinkedHashMap<String, Object>();
	
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public String getLoginIp() {
		return loginIp;
	}
	public void setLoginIp(String loginIp) {
		this.loginIp = loginIp;
	}
	public String getLoginKey() {
		return loginKey;
	}
	public void setLoginKey(String loginKey) {
		this.loginKey = loginKey;
	}
	public Long getLoginTime() {
		return loginTime;
	}
	public String getLoginTimeStr() {
		return loginTimeStr;
	}
	public HashMap<String, Object> getAttributes() {
		return attributes;
	}	
	public void setAttributes(HashMap<String, Object> attributes) {
		this.attributes = attributes;
	}
	
	public Object getAttribute(String key) {
		return attributes.get(key);
	}
	public void setAttribute(String key, Object value) {
		this.attributes.put(key, value);
	}
}