package com.hz.frm.net.netty.service;

import java.util.List;

public interface IMsgSender {

    /**
     * 登录成功
     * @param userId
     */
    public void loginSuccess(String cusNumber,String userId);

    /**
     * 退出
     * @param userId
     */
    public void logout(String userId);

    /**
     * 给指定用户发消息
     * @param userId
     * @param msg
     */
    public void sendMsg(String serviceId, String userId, Object msg);

    /**
     * 给一批指定用户发消息
     * @param userId
     * @param msg
     */
    public void sendMsg(String serviceId, List<String> userIdList, Object msg);


    /**
     * 给所有在线用户发消息
     * @param msg
     */
    public void sendMsgOnline(String serviceId, Object msg);
}
