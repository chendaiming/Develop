package com.hz.fe.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.fe.bean.FeMessageHeader;

/**
 * 消息处理抽象类
 * @author xie.yh 2016.05.23
 */
public abstract class FeMessageProcessAbstract<T> implements IFeMessageProcess{

	/**
	 * 消息处理
	 * @param cusNumber	机构号
	 * @param jsonObj	消息-JSON对象
	 */
	@Override
	public void processMessage(String cusNumber, JSONObject jsonObj) {
		FeMessageHeader msgHeader = new FeMessageHeader();
		T msgBody = null;

		Object header = jsonObj.get("header");
		Object body = jsonObj.get("body");

		msgHeader = toJavaObject(header, FeMessageHeader.class);
		msgBody = toJavaObject(body, getBodyClass());

		// 设置机构号
		msgHeader.setCusNumber(cusNumber);

		// 消息处理实现
		process(msgHeader, msgBody);
	}

	@SuppressWarnings("hiding")
	private <T> T toJavaObject(Object value, Class<T> clasz) {
		if (value.getClass().equals(String.class)) {
			return JSON.toJavaObject(JSONObject.parseObject((String)value), clasz);
		} else {
			return JSON.toJavaObject((JSONObject)value, clasz);
		}
	}


	/**
	 * 获取消息体对象类型
	 * @return
	 */
	public abstract Class<T> getBodyClass();

	/**
	 * 消息处理
	 * @param msgHead 消息头
	 * @param msgBody 消息体
	 */
	protected abstract void process (FeMessageHeader feMessageHeader, T msgBody);
	
	
	public static void main(String[] args) {
		JSONObject bodyJSON = new JSONObject();
		bodyJSON.put("doorId", "aaaaaaa");
		
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("header", "{\"msgType\":\"0001\"}");
		jsonObj.put("body", bodyJSON);

		Object header = jsonObj.get("header");
		
		System.out.println(header.getClass().getSimpleName() + " | " + header.getClass().equals(String.class));
		
		
		Object body = jsonObj.get("body");
		
		System.out.println(body.getClass().getSimpleName() + " | " + body.getClass().equals(JSONObject.class));
		
		if (header.getClass().equals(String.class)) {
			
		}
	}
}
