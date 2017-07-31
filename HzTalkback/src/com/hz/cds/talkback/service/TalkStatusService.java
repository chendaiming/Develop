package com.hz.cds.talkback.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.talkback.util.TalkbackConfigUtil;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IQueryService;
import com.hz.db.service.IUpdateService;
import com.hz.db.util.ReqParams;
import com.hz.frm.http.HttpGetService;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.utils.SequenceUtil;

/**
 * 处理对讲机设备状态
 * @author shuxr
 *
 */
@Service
public class TalkStatusService {
	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(TalkStatusService.class);
	@Resource private IQueryService queryService;
	@Resource private IUpdateService updateService;
	@Resource private HttpGetService httpGetService;
	@Resource private SequenceUtil sequenceUtil;
	@Resource private MqMessageSendService mqMessageSendService;
	@Value("${talkback.server.ip}")
	private String server_ip;
	/** 设备状态Map(设备是否在线) 0 在线 1 离线 */
	private static HashMap<String,Integer> statusMap = new HashMap<String,Integer>();
//	/** 设备使用状态Map 0 空闲 1 使用中 */
//	private static HashMap<String,Integer> useMap = new HashMap<String,Integer>();
	/** 在线 */
	public static final int ONLINE = 0;
	/** 离线 */
	public static final int OFFLINE = 1;
	/** 使用中 */
	public static final int BUSY = 2;
	
	public JSONArray getStatus(){
		JSONArray jsonary = new JSONArray();
		//请求的url地址
		String url = "http://"+server_ip+"/v2/audio/terminals_status.json";
		String result = httpGetService.httpGet(url);
		try {
			jsonary = JSON.parseObject(result).getJSONArray("terminal");
//			if(statusMap.size() == 0){
				getStatusMap();
//			}
			if(jsonary.size() > 0){
				for(int i=0;i<jsonary.size();i++){
					JSONObject obj = jsonary.getJSONObject(i);
					String id  = obj.getString("exten");//对讲设备编号
					if(!statusMap.containsKey(id)){
//						insertTalkback(obj); 
						continue;
					}
					String status = obj.getString("status");//状态
					
					switch(status){
					case "online"://在线
						//设备状态发生改变 更新设备状态信息
						if(statusMap.get(id)!=ONLINE)
							updateStatus(ONLINE,id);
						break;
					case "offline"://不在线
						//设备状态发生改变 更新设备状态信息
						if(statusMap.get(id)!=OFFLINE)
							updateStatus(OFFLINE,id);
						break;
					case "busy"://忙碌中
						//使用状态发生改变 更新使用状态信息
						if(statusMap.get(id)!=BUSY)
							updateStatus(BUSY,id);
						break;
					default://
					}
				}
			}
		} catch (Exception e) {
			log.error("获取对讲状态信息失败",e);
		}
		
		return jsonary;
	}
	
	/**
	 * 新增对讲机数据
	 * @param obj
	 */
//	private void insertTalkback(JSONObject obj) {
//		  String otherid=obj.getString("exten");
//		  String name=obj.getString("name");//
//		  String _status =obj.getString("status");//
//		  int status = 0;  
//		  switch(_status){
//			case "online"://在线
//				status = 0;
//				break;
//			case "offline"://不在线
//				status = 1;
//				break;
//			case "busy"://忙碌中
//				status = 2;
//				break;
//		  }
//		  String ip = obj.getString("client_ip");//
//		  
//
//		// 插入数据库
//		JSONObject parasList = new JSONObject();
//		parasList.put("cus",TalkbackConfigUtil.get("CUSNUMBER"));// 机构编号
//		parasList.put("tbd_id", "");// 设备编号
//		parasList.put("name", name);// 设备名称
//		parasList.put("tbd_other_id", otherid);// 厂商唯一编号
//		parasList.put("tbd_ip", ip);// 设备IP
//		parasList.put("tbd_port", "");// 
//		parasList.put("tbd_area_id", "");//
//		parasList.put("tbd_brand", 1);// 
//		parasList.put("tbd_mian_id", "");// 
//		parasList.put("tbd_child_id", "");// 
//		parasList.put("dep", "");// 
//		parasList.put("tbd_room_id", "");// 
//		parasList.put("tbd_dvc_addrs", name);// 
//		parasList.put("tbd_dvc_stts", status);// 状态
//		parasList.put("tbd_use_stts", "");// 
//		parasList.put("tbd_crte_user_id", 0);//
//		parasList.put("tbd_updt_user_id", 0);//
//		JSONArray jsonary = new JSONArray();
//		jsonary.add(parasList);
//		JSONObject jsonobj = new JSONObject();
//		jsonobj.put("sqlId", "insert_talkback");
//		jsonobj.put("params", jsonary);
//
//		UpdateResp resp = null;
//		try {
//			resp = updateService.updateByParamKey(jsonobj);
//		} catch (Exception e) {
//			log.error("对讲设备信息插入异常", e);
//		}
//
//		if (resp.getSuccess()) {
//			log.debug("对讲设备信息新增成功"+name);
//			//新增到map中
//			statusMap.put(otherid,status);
//		}
//	}

	/**
	 * 更新对讲机设备状态
	 * @param status 设备状态
	 * @param deviceid 厂商唯一编号
	 */
	public void  updateStatus(int status,String deviceid){
		//更新数据库
		JSONObject parasList = new JSONObject();
		parasList.put("status", status);// 0 正常 1 故障  2 使用中
		parasList.put("device_id", deviceid);//终端编号
		JSONArray jsonary = new JSONArray();
		jsonary.add(parasList);
		JSONObject jsonobj = new JSONObject();
		jsonobj.put("sqlId", "update_talkback_status");
		jsonobj.put("params", jsonary);
		UpdateResp resp = null;
		try {
			resp = updateService.updateByParamKey(jsonobj);
		} catch (Exception e) {
			log.error("更新对讲机状态异常", e);
		}

		if (resp.getSuccess()) {
			log.debug("更新对讲机状态成功:deviceid:"+deviceid+",status:"+status);
			//更新Map中的值
			statusMap.replace(deviceid, status);
			JSONObject msg = new JSONObject();
			msg.put("id", deviceid);
			msg.put("status", status);
			mqMessageSendService.sendInternalWebMessage(msg,TalkbackConfigUtil.get("CUSNUMBER"),"TALKBACK001");
		}	
	}
	
	/**
	 * 获取对讲设备状态信息
	 */
	private void getStatusMap(){
		log.debug("获取对讲设备状态信息");
		JSONObject queryJSON = null;
		statusMap.clear();
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_talkback_status_map");
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					statusMap.put(tempMap.get("device_id").toString(),
							Integer.parseInt(tempMap.get("dvc_stts").toString()));
//					useMap.put(tempMap.get("device_id").toString(),
//							Integer.parseInt(tempMap.get("use_stts").toString()));
				}
			}
		} catch (Exception e) {
			log.error("数据查询失败..." + e);
		}
	}
	
}
