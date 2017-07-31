package com.hz.frm.net.netty.service;

import io.netty.channel.ChannelHandlerContext;

import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;

public interface IMsgHandler {
	
	/**
	 * 初始化
	 * @param config
	 */
	void init(NettyConfig config, MsgComsumerGroup comsumer);
	
	/**
	 * 消息处理接口
	 * @param ctx
	 * @param msg
	 */
	void onMessage(ChannelHandlerContext ctx, Object msg);
	
	/**
	 * 异常/关闭处理
	 */
	void exceptionCaught();
}
