package com.hz.frm.net.netty.tcpsocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.netty.bean.MsgHeader;
import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;
import com.hz.frm.net.netty.service.impl.MsgDispatcher;
import com.hz.frm.net.netty.util.DateUtil;
import com.hz.log.MessageLog;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
/**
 * tcp socket服务处理类
 * @author zhongxy
 */
public class TcpSocketServerHandler extends SimpleChannelInboundHandler<String> {
	private static final Logger logger = LoggerFactory.getLogger(TcpSocketServerHandler.class);
	private MsgDispatcher tcpSocketMsgDispatcher;
    
    public TcpSocketServerHandler(NettyConfig config, MsgComsumerGroup comsumer) {
    	this.tcpSocketMsgDispatcher = MsgDispatcher.createMsgDispatcher(config);
    	tcpSocketMsgDispatcher.init(config, null, comsumer);
    }
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
    	logger.debug("receive msg:"+msg);
    	JSONObject jsonMsg=null;
    	try {
			jsonMsg = JSONObject.parseObject(msg.toString());
		} catch (Exception e) {
			logger.error("TcpSocketServerHandler.channelRead 解析json出错  msg="+msg, e);
		}
    	if(jsonMsg!=null){
    		MsgHeader header=null;
    		String msgType=null;
    		try {
				header = (MsgHeader) JSONObject.parseObject(jsonMsg.get("header").toString(), MsgHeader.class);
				msgType = header.getMsgType();
				if (msgType!=null&&!"HB".equals(msgType)) {
					MessageLog.printLog(msgType, DateUtil.getTodayString() + " receive msg=" + msg);
				} else {
					logger.debug(DateUtil.getTodayString() + " receive msg:{}", msg);
				} 
			} catch (Exception e) {
				logger.error("TcpSocketServerHandler.channelRead get msgType error! msg="+msg, e);
			}
    		if(msgType!=null){
    			tcpSocketMsgDispatcher.dispatch(new TcpSocketMsgChannel(ctx), msg);
    		}
    	}
    }
    
    
    @Override
    public void messageReceived(ChannelHandlerContext ctx, String msg) {
    	//这个函数不需要实现
    }
    
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.flush();
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    	logger.info("has exception");
    	tcpSocketMsgDispatcher.close();
        cause.printStackTrace();
        ctx.close();
    }
}

