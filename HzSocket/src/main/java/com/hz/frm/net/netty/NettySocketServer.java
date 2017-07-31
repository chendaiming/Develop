package com.hz.frm.net.netty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.http.HttpChannelInitializer;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;
import com.hz.frm.net.netty.tcpsocket.TcpSocketChannelInitializer;
import com.hz.frm.net.netty.websocket.WebSocketChannelInitializer;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.util.SelfSignedCertificate;

/**
 * 
 * @author zhongxy
 *
 */
public final class NettySocketServer extends Thread{
	private static final Logger logger = LoggerFactory.getLogger(NettySocketServer.class);
	@Autowired
	private NettyConfig nettyConfig = null;
	private MsgComsumerGroup comsumer = null;
	
	public void run(){
		try {
			final SslContext sslCtx;
			if (nettyConfig.isSsl()) {
				SelfSignedCertificate ssc = new SelfSignedCertificate();
				sslCtx = SslContext.newServerContext(ssc.certificate(),ssc.privateKey());
			} else {
				sslCtx = null;
			}
			 //用来处理accept事件
			EventLoopGroup bossGroup = new NioEventLoopGroup(1);
			//这个是用于处理accept到的channel
			EventLoopGroup workerGroup = new NioEventLoopGroup(nettyConfig.getNetWorkerNum());
			//创建全局消息消费线程池
			setComsumer();
			try {
				ServerBootstrap b = new ServerBootstrap();
				b.group(bossGroup, workerGroup);
				//用它来建立新accept的连接，用于构造serversocketchannel的工厂类
				b.channel(NioServerSocketChannel.class);
				b.handler(new LoggingHandler(LogLevel.INFO));
				//为accept channel的pipeline预添加的inboundhandler
				String communicationMode = nettyConfig.getCommunicationMode();
				if (NettyConfig.WEB_SOCKET_MODE.equals(communicationMode)) {
					b.childHandler(new WebSocketChannelInitializer(sslCtx, nettyConfig, comsumer));
				} else if (NettyConfig.HTTP_MODE.equals(communicationMode)) {
					b.childHandler(new HttpChannelInitializer(sslCtx, nettyConfig, comsumer));
				} else if (NettyConfig.TCP_SOCKET_MODE.equals(communicationMode)) {
					b.childHandler(new TcpSocketChannelInitializer(sslCtx, nettyConfig, comsumer));
				}
				Channel ch = b.bind(nettyConfig.getPort()).sync().channel();
				//相当于在这里阻塞，直到serverchannel关闭
				ch.closeFuture().sync();
			} finally {
				bossGroup.shutdownGracefully();
				workerGroup.shutdownGracefully();
				if (null != comsumer) {
					comsumer.shutdown();
				}
			}
		} catch (Exception e) {
			logger.error("",e);
		}
	}

	public NettyConfig getNettyConfig() {
		return nettyConfig;
	}

	public void setNettyConfig(NettyConfig nettyConfig) {
		this.nettyConfig = nettyConfig;
	}
	
	/**
	 * 设置全局消息消费线程池
	 * @param nettyConfig
	 */
	private void setComsumer() {
		if (nettyConfig.isMsgComsumerPool()) {
			comsumer = new MsgComsumerGroup(nettyConfig.getMsgComsumerNum());
		}
		 
	}
}
