package com.hz.frm.net.amq.service;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.frm.net.netty.service.IMsgChannel;
import com.hz.frm.net.netty.service.impl.MsgChannelManager;
@Service
public class NettyMessageSendService {
	private final static Logger logger = LoggerFactory.getLogger(NettyMessageSendService.class);

	public static final String COMMON_MESSAGE = "9001";

	@Resource
	private MessageSubscribe messageSubscribe = null;

	
	public String handleNettyMessage(String message, String cusNumber) {
		List<IMsgChannel> msgChannelList = MsgChannelManager.getMsgChannelManager().getOnLineMsgChannel();
		
		logger.debug("消息通道数：" + msgChannelList.size());

		for(IMsgChannel channel : msgChannelList) {
			channel.write(message);
		}
		return null;
	}

/*	public String handleNettyMessage(String message, String cusNumber) {
		JSONObject msgObject=JSONObject.parseObject(message);
		String msgTypeString = msgObject.getString("msgType");
		//鏍规嵁娑堟伅绫诲瀷鑾峰彇璁㈤槄鐨勭敤鎴�
		JSONArray userArray = messageSubscribe.getUserId(msgTypeString);

		if(msgTypeString!=null){
			//閫氱敤娑堟伅涓嶉渶瑕佽闃�
			if(msgTypeString.equals(COMMON_MESSAGE)){
				List<String> userList=MsgChannelManager.getMsgChannelManager().getUserList();
				for(String userId:userList){
					IMsgChannel channel = MsgChannelManager.getMsgChannelManager().getMsgChannel(userId);
					if (null != channel) {
						String userCusNumber=channel.getBranch();
						if(userCusNumber!=null&&cusNumber.equals(userCusNumber)){
							channel.write(message);
							logger.debug("send web msg:cusNumber="+cusNumber+" userId="+userId+"msg="+message);
						}
					}	
				}
			}else{
				if(userArray!=null){
					for(int i=0;i<userArray.size();i++){
						String jsonUser=userArray.getString(i);
						JSONObject userObj=JSONObject.parseObject(jsonUser);
						String userCusNumber=userObj.getString("cusNumber");
						if((!StringUtil.isNull(userCusNumber)&&userCusNumber.equals(cusNumber))||(StringUtil.isNull(cusNumber))){
							String userId=userObj.getString("userId");
							IMsgChannel channel = MsgChannelManager.getMsgChannelManager().getMsgChannel(userId);
							if (null != channel) {
								channel.write(message);
								logger.debug("send web msg:cusNumber="+cusNumber+" userId="+userId+"msg="+message);
							}
						}
					}
				}
			}
		}else{
			logger.error("鍙戦�佺殑娑堟伅绫诲瀷涓虹┖message="+message);
		}
		return null;
	}*/
}
