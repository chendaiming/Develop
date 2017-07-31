package com.hz.frm.net.netty.service;

public interface IMsgChannel {

    /**
     * 写消息
     * @param msg
     */
    public void write(Object msg);

    /**
     * 关闭
     */
    public void close();

    /**
     * 设置连接来源
     * @param connSource
     */
    public void setConnSource(String connSource);
    
    /**
     * 获取连接来源
     * @return
     */
    public String getConnSource();
    
    /**
     * 设置用户ID
     * @param userId
     */
    public void setUserId(String userId);

    /**
     * 读取用户ID
     * @return
     */
    public String getUserId();
    
    /**
     * 设置用户所属机构
     * @param branch
     */
    public void setBranch(String branch);
    
    /**
     * 读取用户所属机构
     * @return
     */
    public String getBranch();
}
