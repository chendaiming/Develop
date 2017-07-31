package com.hz.frm.net.netty.tcpsocket;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.ssl.SslContext;

import java.nio.charset.Charset;

import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;

/**
 * 
 * @author zhongxy
 *
 */
public class TcpSocketChannelInitializer extends ChannelInitializer<SocketChannel> {
    private final SslContext sslCtx;
    private final NettyConfig config;
    private MsgComsumerGroup comsumer = null;
    private String MsgEncoding="UTF-8";
    //private byte[] MsgDelimiter=new byte[]{(byte) 0x1c, (byte) 0x1c};
    private byte[] MsgDelimiter=new byte[]{(byte) 0x0D, (byte) 0x0A};
    
    public TcpSocketChannelInitializer(SslContext sslCtx, NettyConfig config, MsgComsumerGroup comsumer) {
        this.sslCtx = sslCtx;
        this.config = config;
        this.comsumer = comsumer;
    }
    /**
     * 当新连接accept的时候，这个方法会调用
     */
    @Override
    public void initChannel(SocketChannel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        if (sslCtx != null) {
            pipeline.addLast(sslCtx.newHandler(ch.alloc()));
        }        
        pipeline.addLast("framer", new DelimiterBasedFrameDecoder(1024*1024*20, getDelimiter()));
        pipeline.addLast("decoder", new StringDecoder(Charset.forName(MsgEncoding)));
        pipeline.addLast("encoder", new StringEncoder(Charset.forName(MsgEncoding)));

        pipeline.addLast(new LoggingHandler(LogLevel.INFO));
        pipeline.addLast("handler", new TcpSocketServerHandler(config, comsumer));
    }
    
    private ByteBuf[] getDelimiter(){
        return new ByteBuf[] {
                Unpooled.wrappedBuffer(MsgDelimiter)
        };
    }
}
