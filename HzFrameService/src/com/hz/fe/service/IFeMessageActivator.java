package com.hz.fe.service;

/**
 * 消息处理激活器接口（用于接收前置机MQ通道消息）
 * @author xie.yh 2016.05.23
 */
public interface IFeMessageActivator {

	/**
	 * 钱直接消息处理方法
	 * @param message	收到的消息
	 * @param cusNumber	监狱机构号
	 */
	public void handle (String message, String cusNumber);
}
