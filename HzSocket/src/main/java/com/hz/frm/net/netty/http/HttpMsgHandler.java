package com.hz.frm.net.netty.http;

import static io.netty.handler.codec.http.HttpHeaders.isKeepAlive;
import static io.netty.handler.codec.http.HttpHeaders.setContentLength;
import static io.netty.handler.codec.http.HttpHeaders.Names.HOST;
import static io.netty.handler.codec.http.HttpMethod.GET;
import static io.netty.handler.codec.http.HttpResponseStatus.BAD_REQUEST;
import static io.netty.handler.codec.http.HttpResponseStatus.FORBIDDEN;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshaker;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshakerFactory;
import io.netty.util.CharsetUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.service.IMsgHandler;
import com.hz.frm.net.netty.service.impl.MsgChannelManager;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;
import com.hz.frm.net.netty.service.impl.MsgDispatcher;

/**
 * http消息包处理类(暂未使用)
 */
public class HttpMsgHandler implements IMsgHandler {
	private static final Logger logger = LoggerFactory.getLogger(HttpMsgHandler.class);
    private MsgDispatcher msgDispatcher;
    private MsgChannelManager msgChannelManager;
    
	private static final String WEBSOCKET_PATH = "/websocket";
    private WebSocketServerHandshaker handshaker;
    private NettyConfig config = null;
    
	@Override
	public void init(NettyConfig config, MsgComsumerGroup comsumer) {
    	this.msgChannelManager = MsgChannelManager.getMsgChannelManager();
    	this.msgDispatcher = MsgDispatcher.createMsgDispatcher(config);
    	msgDispatcher.init(config, msgChannelManager, comsumer);
    	this.config = config;
	}
	
	@Override
	public void onMessage(ChannelHandlerContext ctx, Object msg) {
		FullHttpRequest req = (FullHttpRequest)msg;
		// Handle a bad request.
        if (!req.getDecoderResult().isSuccess()) {
            sendHttpResponse(ctx, req, new DefaultFullHttpResponse(HTTP_1_1, BAD_REQUEST));
            return;
        }
        /**
         * websocket 客户端向服务端发送http报文格式的请求，而且是GET方法的请求
         * 与普通的http请求有稍微不同的地方，那就是头部connection字段是Upgrade，然后有Upgrad字段，值是websocket
         * Upgrade: websocket
         * Connection: Upgrade
         * 如果不是get请求，那么就出错了
         */
        if (req.getMethod() != GET) {
            sendHttpResponse(ctx, req, new DefaultFullHttpResponse(HTTP_1_1, FORBIDDEN));
            return;
        }
/*        if ("/favicon.ico".equals(req.getUri())) {
            FullHttpResponse res = new DefaultFullHttpResponse(HTTP_1_1, NOT_FOUND);
            sendHttpResponse(ctx, req, res);
            return;
        }*/
        /**
         * 创建websocket进行连接握手的工厂类，因为不同版本的连接握手不太一样
         */
        WebSocketServerHandshakerFactory wsFactory = new WebSocketServerHandshakerFactory(getWebSocketLocation(req, config.isSsl()), null, false);
        /**
         * Websocket 握手开始  
         * 这里会根据不同的websocket版本来安排不同的握手handler
         */
        handshaker = wsFactory.newHandshaker(req);
        if (handshaker == null) {
            WebSocketServerHandshakerFactory.sendUnsupportedWebSocketVersionResponse(ctx.channel());
        } else {
        	/**
        	 * 其实这里在将用于建立连接的http报文发送回去之后，会将前面添加的http部分的handler都移除
        	 * 然后加上用于decode和encode针对websocket帧的handler
        	 */
            handshaker.handshake(ctx.channel(), req);
        }
	}

	private static void sendHttpResponse(
            ChannelHandlerContext ctx, FullHttpRequest req, FullHttpResponse res) {
        // Generate an error page if response getStatus code is not OK (200).
        if (res.getStatus().code() != 200) {
            ByteBuf buf = Unpooled.copiedBuffer(res.getStatus().toString(), CharsetUtil.UTF_8);
            res.content().writeBytes(buf);
            buf.release();
            setContentLength(res, res.content().readableBytes());
        }


        // Send the response and close the connection if necessary.
        ChannelFuture f = ctx.channel().writeAndFlush(res);
        if (!isKeepAlive(req) || res.getStatus().code() != 200) {
            f.addListener(ChannelFutureListener.CLOSE);
        }
    }
    
    private static String getWebSocketLocation(FullHttpRequest req, boolean isSsl) {
        String location =  req.headers().get(HOST) + WEBSOCKET_PATH;
        if (isSsl) {
            return "wss://" + location;
        } else {
            return "ws://" + location;
        }
    }
    
	@Override
	public void exceptionCaught() {
		msgDispatcher.close();
	}
}
