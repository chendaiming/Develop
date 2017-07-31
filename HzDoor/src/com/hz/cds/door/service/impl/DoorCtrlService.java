package com.hz.cds.door.service.impl;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.door.cache.DoorBaseDtlsCache;
import com.hz.cds.door.cache.DoorControlDeviceCache;
import com.hz.cds.door.service.IDoorCtrlService;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.net.netty.bean.MsgHeader;
import com.hz.frm.util.DateUtil;
import com.hz.frm.util.MsgIdUtil;

@Service
public class DoorCtrlService implements IDoorCtrlService {
	private static final Logger logger = LoggerFactory.getLogger(DoorCtrlService.class);
	private String openMsgType="DOOR002";
	@Resource
	private MqMessageSendService mqMessageSendService;
	@Resource
	private DoorBaseDtlsCache doorBaseDtlsCache;
	@Resource
	private DoorControlDeviceCache doorControlDeviceCache;
	
	/**
	 * 开关门
	 * @param cusNumber 监狱号
	 * @param doorID 门编号
	 * @param action 1 开 0 关
	 * @param brand 品牌
	 */
    public void openDoor(String cusNumber,String doorId,String action){
		JSONObject doorJson = new JSONObject();
		doorJson=getDoorInfo(cusNumber,doorId,action);
		doorJson.put("action", action);
		String openStr=createMessage(doorJson);
		mqMessageSendService.sendFeMessage(openStr, cusNumber);
		logger.debug("开关门指令发送完成"+openStr);
    }
    /**
     * 一键锁死
     * @param cusNumber 监狱号
     * @param doorIdList 门的IDList
     */
    public void lockDoor(String cusNumber,List<Object> doorIdList){
    	if(doorIdList!=null&&doorIdList.size()>0){
    		JSONArray doorArray=new JSONArray();
    		for(int i=0;i<doorIdList.size();i++){
    			String doorId=doorIdList.get(i).toString();
    			JSONObject doorJson=getDoorInfo(cusNumber,doorId,"2");
    			doorArray.add(doorJson);
    		}
    		String lockStr=createMessage(doorArray);
    		mqMessageSendService.sendFeMessage(lockStr, cusNumber);
    		logger.debug("一键锁门指令发送完成"+lockStr);
    	}
    }
    
    /**
     * 冲缓存中获取门和门禁控制器的基本信息
     * @param cusNumber 监狱号
     * @param doorId 门编号
     * @return
     */
    private JSONObject getDoorInfo(String cusNumber,String doorId,String action){
		JSONObject doorJson = new JSONObject();
		JSONObject doorObj=doorBaseDtlsCache.getDoorInfo(cusNumber, doorId);
		String doorOtherId="";
		String controlDeviceId="";
		String controlDeviceChannel="";
		String brand="";
		if(doorObj!=null){
			doorOtherId=doorObj.getString("dbd_other_id");
			controlDeviceId=doorObj.getString("dbd_ctrl_id");
			controlDeviceChannel=doorObj.getString("dbd_ctrl_chl");
			brand=doorObj.getString("dbd_brand");
		}
		
		JSONObject doorControlDeviceObj=doorControlDeviceCache.getDoorControlDeviceInfo(cusNumber, controlDeviceId);
        String controlDeviceIp="";
        String controlDevicePort="";
        String controlDeviceUserName="";
        String controlDevicePassword="";
        String controlDeviceOtherId="";
        if(doorControlDeviceObj!=null){
            controlDeviceIp=doorControlDeviceObj.getString("dcd_ip_addrs");
            controlDevicePort=doorControlDeviceObj.getString("dcd_port");
            controlDeviceUserName=doorControlDeviceObj.getString("dcd_user_name");
            controlDevicePassword=doorControlDeviceObj.getString("dcd_user_password");
            controlDeviceOtherId=doorControlDeviceObj.getString("dcd_other_id");
        }
		doorJson.put("doorId", doorId);
		doorJson.put("doorOtherId", doorOtherId);
		doorJson.put("controlDeviceIp", controlDeviceIp);
		doorJson.put("controlDevicePort", controlDevicePort);
		doorJson.put("controlDeviceUserName", controlDeviceUserName);
		doorJson.put("controlDevicePassword", controlDevicePassword);
		doorJson.put("controlDeviceOtherId", controlDeviceOtherId);
		doorJson.put("controlDeviceChannel", controlDeviceChannel);
		doorJson.put("brand", brand);
		doorJson.put("action", action);
		return doorJson;
    }
    
	private String createMessage(Object doorJson){
		MsgHeader msgHeader = new MsgHeader();
		msgHeader.setMsgID(MsgIdUtil.getMsgSeq("door"));
		msgHeader.setMsgType(openMsgType);
		msgHeader.setLength(0);
		msgHeader.setSender("SERVER");
		msgHeader.setRecevier("DOOR");
		msgHeader.setSendTime(DateUtil.getDateString(new Date(), DateUtil.sdf));
		JSONObject out = new JSONObject();
		out.put("header", JSON.toJSONString(msgHeader));
		out.put("body", JSON.toJSONString(doorJson));		
		return out.toJSONString();
	}
	
}
