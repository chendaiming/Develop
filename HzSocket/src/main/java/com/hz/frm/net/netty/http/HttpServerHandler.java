package com.hz.frm.net.netty.http;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.service.IMsgHandler;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;

/**
 * http服务处理类
 * @author comstar
 *
 */
public class HttpServerHandler extends SimpleChannelInboundHandler<Object> {
	private static final Logger logger = LoggerFactory.getLogger(HttpServerHandler.class);
	/** 消息处理对象 */
	private IMsgHandler msgHandler = new HttpMsgHandler();
    
    public HttpServerHandler(NettyConfig config, MsgComsumerGroup comsumer) {
    	msgHandler.init(config, comsumer);
    }
    
    @Override
    public void messageReceived(ChannelHandlerContext ctx, Object msg) {
    	logger.info(msg.toString());
    	msgHandler.onMessage(ctx, msg);
    }
    
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.flush();
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
