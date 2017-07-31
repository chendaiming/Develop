package com.hz.cds.broadcast.service;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IUpdateService;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.utils.SequenceUtil;

@Service
public class BroadcatstService {
	@Resource
	MqMessageSendService mMessageSendService;
	@Resource
	private IUpdateService updateService;
	@Resource
	private SequenceUtil sequenceUtil;
	
	@Value("${ftp.ip}")
	private String ftp_ip;
	
	private static final Logger logger = LoggerFactory.getLogger(BroadcatstService.class);
	/**
	 * 发送数字广播消息指令
	 * @param cusNumber
	 * @param broadcastType
	 * @param videoPath
	 * @param broadcastClient
	 * @param remark
	 */
    public void sendBroadcast(String cusNumber,String broadcastType,String videoPath,String clientID,String remark,String action){
		JSONObject sendJson = new JSONObject();
		sendJson.put("cusNumber", cusNumber);
		sendJson.put("msgType", "BROADCAST001");
		sendJson.put("broadcastType", broadcastType); //播放类型
		sendJson.put("videoPath", videoPath); //音频文件所在前置机路径,mp3格式
		sendJson.put("clientID", clientID);//广播终端结构
		sendJson.put("action", action);
		sendJson.put("remark", remark);
		mMessageSendService.sendFeMessage(sendJson.toString(), cusNumber);
		logger.debug("数字广播指令发送完成:"+sendJson.toString());
    }
    
    /**
     * 发送广播喊话指令
     * @param cusNumber
     * @param clientID 需要喊话的客户端id
     * @param remark 
     * @param action  1开始喊话  2停止喊话 
     */
    public void sendSay(String cusNumber,String clientID,String remark,String action){
  		JSONObject sendJson = new JSONObject();
  		sendJson.put("cusNumber", cusNumber);
  		sendJson.put("msgType", "BROADCAST002");
  		sendJson.put("clientID", clientID);//广播终端结构
  		sendJson.put("action", action); //1开始喊话  2停止喊话
  		sendJson.put("remark", remark);
  		mMessageSendService.sendFeMessage(sendJson.toString(), cusNumber);
  		logger.debug("数字广播指令发送完成:"+sendJson.toString());
      }
    /**
     * 数字广播控制音量
     * @param cusNumber
     * @param clientID 终端ID
     * @param volume   音量值
     */
    public void ctrlVolume(String cusNumber,String clientID,String volume){
  		JSONObject sendJson = new JSONObject();
  		sendJson.put("cusNumber", cusNumber);
  		sendJson.put("msgType", "BROADCAST003");
  		sendJson.put("ClientID", clientID);//广播终端结构
  		sendJson.put("Volume", volume); //音量值
  		mMessageSendService.sendFeMessage(sendJson.toString(), cusNumber);
  		logger.debug("数字广播指令发送完成:"+sendJson.toString());
      }
    
	/**
	 * 插入数字广播推送记录
	 * @param parasObject
	 */
	public void insertPlayRecord(JSONObject parasObject) {
		
		  String cusNumber=parasObject.getString("cusNumber");
		  String broadcastType=parasObject.getString("broadcastType");//播放类型 1播放一次 2循环播放
		  String videoPath =parasObject.getString("videoPath");//音频文件所在前置机路径,mp3格式
		  String clientID = parasObject.getString("clientID");//多个终端之间用“；”分割
		  String user = parasObject.getString("user");
		  
		  String playid = null;
		try {
			playid = sequenceUtil.getSequence("BCT_BROADCAST_PLAY_RECORD", "BSR_PLAY_ID");
		} catch (Exception e1) {
			logger.error("数字广播==>>获取序列失败",e1);
		}
		  
//		  videoPath = "http://" + ftp_ip   + '/' + videoPath ;
		  		   
			//插入数据库
			JSONObject parasList=new JSONObject();
			           parasList.put("cusNumber", cusNumber);//机构编号
			           parasList.put("playId", playid);//播放编号
			           parasList.put("broadcastType", broadcastType);//播放类型
			           parasList.put("videoPath", videoPath);//音频文件路径
			           parasList.put("userId", user);//播放人
			JSONArray jsonary = new JSONArray();
			jsonary.add(parasList);
			JSONObject  jsonobj = new JSONObject();
			jsonobj.put("sqlId", "insert_broadcast_play_record");
			jsonobj.put("params", jsonary);
			
			UpdateResp resp = null;
			try {
				resp = updateService.updateByParamKey(jsonobj);
			} catch (Exception e) {
				logger.error("数字广播推送记录插入异常",e);
			}
			
			if(resp.getSuccess())  {
				logger.debug("数字广播推送记录插入成功");
			}	
			
			if(clientID.indexOf(";")!=-1){
				   String[] ids = clientID.split(";");
				   for(String id:ids){
					   insertSendClient(cusNumber,playid,id);
				   }
			}else{
				   insertSendClient(cusNumber,playid,clientID);
			}
	}
	
	/**
	 * 广播终端插入
	 * @param cusNumber
	 * @param sendId
	 * @param clientId
	 */
	private void insertSendClient(String cusNumber,String playid,String clientId){
		//插入数据库
		JSONObject parasList=new JSONObject();
		           parasList.put("cusNumber", cusNumber); //机构编号
		           parasList.put("playId", playid);//播放编号
		           parasList.put("clientId", clientId);//广播终端编号
		JSONArray jsonary = new JSONArray();
		jsonary.add(parasList);           
		JSONObject  jsonobj = new JSONObject();
		jsonobj.put("sqlId", "insert_broadcast_play_client");
		jsonobj.put("params", jsonary);
		
		UpdateResp resp = null;
		try {
			resp = updateService.updateByParamKey(jsonobj);
		} catch (Exception e) {
			logger.error("数字广播推送终端插入异常",e);
		}
		
		if(resp.getSuccess())  {
			logger.debug("数字广播推送终端插入成功");
		}	
	}

	/**
	 * 更新广播终端状态
	 * @param cusNumber
	 * @param clientId
	 * @param status
	 */
	public void updateClientStatus(String cusNumber,String clientId,int status){
		//插入数据库
		JSONObject parasList=new JSONObject();
				   parasList.put("status", status);//使用状态 1 /未播放  2 播放中
		           parasList.put("cusNumber", cusNumber); //机构编号
		           parasList.put("clientId", clientId);//广播终端编号
		JSONArray jsonary = new JSONArray();
		jsonary.add(parasList);     		           
		JSONObject  jsonobj = new JSONObject();
		jsonobj.put("sqlId", "update_broadcast_device_status");
		jsonobj.put("params", jsonary);
		
		UpdateResp resp = null;
		try {
			resp = updateService.updateByParamKey(jsonobj);
		} catch (Exception e) {
			logger.error("更新广播终端状态异常",e);
		}
		
		if(resp.getSuccess())  {
			logger.debug("更新广播终端状态成功");
		}	
	} 
}
