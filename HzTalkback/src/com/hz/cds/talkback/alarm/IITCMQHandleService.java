package com.hz.cds.talkback.alarm;

import com.alibaba.fastjson.JSONObject;

/**
 * ITC MQ消息的处理接口
 * @author xie.yh 2016.09.06
 */
public interface IITCMQHandleService {

	/**
	 * MQ消息处理
	 * @param msgJSON JSON消息
	 */
	public void handle (JSONObject msgJSON);
}
