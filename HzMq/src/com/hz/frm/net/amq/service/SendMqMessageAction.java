package com.hz.frm.net.amq.service;

public interface SendMqMessageAction<T> {
	public void send(T message, String cusNumber,String msgId);
}
