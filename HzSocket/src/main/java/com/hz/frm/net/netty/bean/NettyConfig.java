package com.hz.frm.net.netty.bean;

import com.hz.frm.net.netty.tcpsocket.TcpSocketMsgDispatcher;
import com.hz.frm.net.netty.websocket.WebSocketMsgDispatcher;

public class NettyConfig {
	/** websocket通讯模式 */
	public static final String WEB_SOCKET_MODE = "websocket";
	/** http通讯模式*/
	public static final String HTTP_MODE = "http";
	/** tcpsocket通讯模式 */
	public static final String TCP_SOCKET_MODE = "tcpsocket";
	
	/** 是否sll加密 */
	private boolean ssl;
	/** ssl加密侦听端口 */
	private int sslPort;
	/** 侦听端口 */
	private int port;
	/** 通讯模式 websocket，http或者tcpsocket*/
	private String communicationMode = WEB_SOCKET_MODE;
	/** 网络读socket工作线程池数量 */
	private int netWorkerNum = 6;
	/** 消息处理线程池 */
    private int msgComsumerNum;
    /** 是否消息处理线程池 */
    private boolean msgComsumerPool;
    
    /** 消息分派器类名 */
    private String webSocketMsgDispatcher = WebSocketMsgDispatcher.class.getName();
    
    /** tcp socket消息分派器类名 */
    private String tcpSocketMsgDispatcherClass = TcpSocketMsgDispatcher.class.getName();
    
    /** 消息服务类包路径 */
    private String msgServicePackage;

	public boolean isSsl() {
		return ssl;
	}

	public void setSsl(boolean ssl) {
		this.ssl = ssl;
	}

	public int getSslPort() {
		return sslPort;
	}

	public void setSslPort(int sslPort) {
		this.sslPort = sslPort;
	}

	public int getPort() {
		return (ssl ? sslPort : port);
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getCommunicationMode() {
		return communicationMode;
	}

	public void setCommunicationMode(String communicationMode) {
		this.communicationMode = communicationMode;
	}

	public int getNetWorkerNum() {
		return netWorkerNum;
	}

	public void setNetWorkerNum(int netWorkerNum) {
		this.netWorkerNum = netWorkerNum;
	}

	public int getMsgComsumerNum() {
		return msgComsumerNum;
	}

	public void setMsgComsumerNum(int msgComsumerNum) {
		this.msgComsumerNum = msgComsumerNum;
	}

	public String getMsgDispatcherClass() {
		return webSocketMsgDispatcher;
	}

	public void setMsgDispatcherClass(String msgDispatcherClass) {
		this.webSocketMsgDispatcher = msgDispatcherClass;
	}

	public String getTcpSocketMsgDispatcherClass() {
		return tcpSocketMsgDispatcherClass;
	}

	public void setTcpSocketMsgDispatcherClass(String tcpSocketMsgDispatcherClass) {
		this.tcpSocketMsgDispatcherClass = tcpSocketMsgDispatcherClass;
	}

	public String getMsgServicePackage() {
		return msgServicePackage;
	}

	public void setMsgServicePackage(String msgServicePackage) {
		this.msgServicePackage = msgServicePackage;
	}

	public boolean isMsgComsumerPool() {
		return msgComsumerPool;
	}

	public void setMsgComsumerPool(boolean msgComsumerPool) {
		this.msgComsumerPool = msgComsumerPool;
	}
}
