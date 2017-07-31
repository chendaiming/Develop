package com.hz.frm.net.netty.http;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.ssl.SslContext;

import com.hz.frm.net.netty.bean.NettyConfig;
import com.hz.frm.net.netty.service.impl.MsgComsumerGroup;

public class HttpChannelInitializer extends ChannelInitializer<SocketChannel> {
    private final SslContext sslCtx;
    private final NettyConfig config;
    private MsgComsumerGroup comsumer = null;
    
    public HttpChannelInitializer(SslContext sslCtx, NettyConfig config, MsgComsumerGroup comsumer) {
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
        pipeline.addLast(new HttpServerCodec());
        pipeline.addLast(new HttpObjectAggregator(65536));
        pipeline.addLast(new HttpServerHandler(config, comsumer));
    }
}
