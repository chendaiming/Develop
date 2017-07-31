package com.hz.fe.service;

import com.alibaba.fastjson.JSONObject;

/**
 * 消息处理接口
 * @author xie.yh 2016.05.24
 * 
 */
public interface IFeMessageProcess {

	/**
	 * 消息处理
	 * @param cusNumber	机构号
	 * @param jsonObj	消息-JSON对象
	 */
	public void processMessage(String cusNumber, JSONObject jsonObj);

}