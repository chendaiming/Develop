package com.hz.fe.service;

import com.hz.fe.FeMessageDispatcher;

/**
 * 接收前置机消息处理抽象类
 * @author zhongxy
 *
 */
public abstract class FeMessageActivatorAbstract implements IFeMessageActivator{
	private FeMessageDispatcher feMessageDispatcher;
	public FeMessageActivatorAbstract(){
		feMessageDispatcher=new FeMessageDispatcher();
	}
	@Override
	public void handle(String message, String cusNumber) {
		printLog(message,cusNumber);
		feMessageDispatcher.dispatch(cusNumber, message);
	}
	
	/**
	 * 打印收到消息的消息日志
	 * @param message
	 * @param cusNumber
	 */
	public  abstract void printLog(String message, String cusNumber);
}
