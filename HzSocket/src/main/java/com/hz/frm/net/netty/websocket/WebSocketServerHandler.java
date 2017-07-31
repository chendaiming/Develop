package com.hz.frm.net.netty.websocket;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.http.HttpMsgHandler;
import com.hz.frm.net.netty.service.IMsgHandler;
import com.hz.frm.net.netty.service.impl.MsgChannelManager;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;
import com.hz.frm.net.netty.service.impl.MsgDispatcher;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.websocketx.CloseWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PongWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshaker;

/**
 * websocket服务处理类
 * @author zhongxy
 *
 */
public class WebSocketServerHandler extends SimpleChannelInboundHandler<Object> {
	private static final Logger logger = LoggerFactory.getLogger(WebSocketServerHandler.class);
	/** 消息处理对象 */
	//private IMsgHandler msgHandler = new WebSocketMsgHandler();
	private IMsgHandler httpMsgHandler = new HttpMsgHandler();
	
    private MsgDispatcher webSocketMsgDispatcher;
    private MsgChannelManager msgChannelManager;
    private WebSocketServerHandshaker handshaker;
    
    public WebSocketServerHandler(NettyConfig config, MsgComsumerGroup comsumer) {
    	//msgHandler.init(config, comsumer);
    	httpMsgHandler.init(config, comsumer);
    	
		this.msgChannelManager = MsgChannelManager.getMsgChannelManager();
    	this.webSocketMsgDispatcher = MsgDispatcher.createMsgDispatcher(config);
    	webSocketMsgDispatcher.init(config, msgChannelManager, comsumer);
    }
    
    @Override
    public void messageReceived(ChannelHandlerContext ctx, Object msg) {
    	logger.info(JSON.toJSONString(msg));
    	if (msg instanceof FullHttpRequest) {
            httpMsgHandler.onMessage(ctx, (FullHttpRequest) msg);
        } else if (msg instanceof WebSocketFrame) {
        	onMessage(ctx, (WebSocketFrame)msg);
        }
    }
    
	public void onMessage(ChannelHandlerContext ctx, Object msg) {
		WebSocketFrame frame = (WebSocketFrame)msg;
		// Check for closing frame
        if (frame instanceof CloseWebSocketFrame) {
            handshaker.close(ctx.channel(), ( CloseWebSocketFrame )frame.retain());
            return;
        }
        /**
         * 心跳消息
         */
        if (frame instanceof PongWebSocketFrame) {
            ctx.channel().write(new PongWebSocketFrame(frame.content().retain()));
            return;
        }
        if (!(frame instanceof TextWebSocketFrame)) {
            throw new UnsupportedOperationException(String.format("%s frame types not supported", frame.getClass() .getName()));
        }
        //处理收到的数据
        String message = ((TextWebSocketFrame) frame).text();
        webSocketMsgDispatcher.dispatch(new WebSocketMsgChannel(ctx), message);
	}
    
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.flush();
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    	String address = ctx.channel().remoteAddress().toString();
//    	String ip = address.substring(address.indexOf("/") + 1 , address.indexOf(":"));
    	logger.debug("WebSocket[" + address + "]连接已断开：" + cause.getMessage());
//    	
//    	try{
//    		SessionManager.removeByLoginIp( ip );
//    	} catch(Exception ex) {
//    		logger.error("销毁登录信息异常：" + ex.getMessage());
//    	}
    	webSocketMsgDispatcher.close();
    	//msgHandler.exceptionCaught();
        ctx.close();
    }
}

