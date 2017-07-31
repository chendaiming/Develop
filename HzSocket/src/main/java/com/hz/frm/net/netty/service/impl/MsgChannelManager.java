package com.hz.frm.net.netty.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import com.hz.frm.net.netty.service.IMsgChannel;

public class MsgChannelManager {
	/** */
    private Map<String/*userId*/,IMsgChannel> msgChannelMap = new ConcurrentHashMap<String,IMsgChannel>();
    private static MsgChannelManager msgChannelManager = null;
    
    /**
     * 获取消息Channel管理对象
     * @return
     */
    public synchronized static MsgChannelManager getMsgChannelManager() {
    	if (null == msgChannelManager) {
    		msgChannelManager = new MsgChannelManager();
    	}
    	return msgChannelManager;
    }
    
    /**
     * 单例类禁止构造
     */
    private MsgChannelManager() {
    	
    }
    
    /**
     * 添加消息channel，按用户管理
     * @param msgChannel
     */
    public void putMsgChannel(IMsgChannel msgChannel){
    	String userId = msgChannel.getUserId();
        msgChannelMap.put(userId, msgChannel);
    }
    public void putMsgChannel(IMsgChannel msgChannel,String userId){
        msgChannelMap.put(userId, msgChannel);
    }

    /**
     * 删除消息channel，并删除机构用户列表中该用户
     * @param userId
     */
    public void removeMsgChannel(String userId){
        msgChannelMap.remove(userId);
    }

    /**
     * 根据用户得到channel
     * @param userId
     * @return
     */
    public IMsgChannel getMsgChannel(String userId){
        return msgChannelMap.get(userId);
    }
    /**
     * 获取所有在线用户的channel
     * @param userId
     * @return
     */
    public List<IMsgChannel> getOnLineMsgChannel(){
		List<IMsgChannel> channelList = new ArrayList<IMsgChannel>();
		channelList=getMsgChannel(getUserList());
		return channelList;
    }

    /**
     * 得到所有用户列表
     * @return
     */
    public List<String> getUserList(){
        List<String> rs = new ArrayList<String>();
        Set<String> set = msgChannelMap.keySet();
        rs.addAll(set);
        return rs;
    }
    
    
    

	
	/**
	 * 判断用户netty是否在线
	 * @param userId
	 * @return
	 */
	private  boolean checkUserOnline(String userId) {
		return null != getMsgChannel(userId);
	}
	
	/**
	 * 根据批量userId得到netty channel(暂时没有使用)
	 * @param userIdlList
	 * @return
	 */
	private  List<IMsgChannel> getMsgChannel(List<String> userIdlList) {
		List<IMsgChannel> channelList = new ArrayList<IMsgChannel>();
		for (String userId : userIdlList) {
			IMsgChannel channel = getMsgChannel(userId);
			if (null != channel) {
				channelList.add(channel);
			}
		}
		return channelList;
	}
}
