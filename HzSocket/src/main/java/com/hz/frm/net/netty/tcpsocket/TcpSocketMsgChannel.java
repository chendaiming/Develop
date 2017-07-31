package com.hz.frm.net.netty.tcpsocket;

import com.hz.frm.net.netty.service.impl.BaseMsgChannel;

import io.netty.channel.ChannelHandlerContext;

public class TcpSocketMsgChannel extends BaseMsgChannel {

	private ChannelHandlerContext ctx;
	/** 连接来源 **/
	private String connSource;
	public TcpSocketMsgChannel(ChannelHandlerContext ctx) {
		this.ctx = ctx;
	}
	
	@Override
	public void write(Object msg) {
		ctx.writeAndFlush(msg);
	}

	@Override
	public void close() {
		ctx.close();
	}
	
	@Override
	public void setConnSource(String connSource) {
		this.connSource = connSource;
	}

	@Override
	public String getConnSource() {
		return this.connSource;
	}
}
