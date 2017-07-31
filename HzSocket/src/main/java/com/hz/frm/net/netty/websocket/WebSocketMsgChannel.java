package com.hz.frm.net.netty.websocket;

import com.hz.frm.net.netty.service.IMsgChannel;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.AttributeKey;

public class WebSocketMsgChannel implements IMsgChannel{

    static final AttributeKey<String> UserId = AttributeKey.valueOf("UserId");
    static final AttributeKey<String> Branch = AttributeKey.valueOf("branch");

    private ChannelHandlerContext ctx;

    public WebSocketMsgChannel(ChannelHandlerContext ctx){
        this.ctx = ctx;
    }

    @Override
    public void write(Object msg) {
    	ctx.channel().write(new TextWebSocketFrame(msg.toString()));
		ctx.channel().flush();
    }

    @Override
    public void close() {
        ctx.close();
    }

    @Override
    public void setUserId(String userId) {
        ctx.attr(UserId).set(userId);
    }

    @Override
    public String getUserId() {
        return ctx.attr(UserId).get();
    }

	@Override
	public void setBranch(String branch) {
		ctx.attr(Branch).set(branch);
	}

	@Override
	public String getBranch() {
		return ctx.attr(Branch).get();
	}

	@Override
	public void setConnSource(String connSource) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getConnSource() {
		// TODO Auto-generated method stub
		return null;
	}

}
