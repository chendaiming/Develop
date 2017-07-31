package com.hz.ws.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.db.service.IQueryService;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.StringUtil;
import com.hz.ws.HzWebService;

@javax.jws.WebService(endpointInterface="com.hz.ws.HzWebService")
public class HzWebServiceImpl implements HzWebService{
	
	private static final Logger log = LoggerFactory.getLogger(HzWebServiceImpl.class);
	@Resource
	protected IQueryService queryService;
	
	@Override
	public String queryByCusnumber(String method, String cusNumber) {
		
		String result = "";
		if(StringUtil.isNull(method)){
			return "error:未指定的webService接口类型";
		}
		
		if(StringUtil.isNull(cusNumber)){
			return  "error:未传参";
		}
		
		//根据传入的类型调用指定的方法
		switch(method){
		case "alertor"://报警器
			result = query(cusNumber,"select_network_base_dtls","2");
			break;
		case "camera"://摄像机
			result = query(cusNumber,"select_camera_webService","0");
			break;
		case "dvr"://硬盘录像机
			result = query(cusNumber,"select_video_tree","0");
			break;
		case "broadcast"://广播
			result = query(cusNumber,"select_broadcast_base_dtls","2");
			break;
		case "doorctrl"://门禁控制器
			result = query(cusNumber,"select_door_control_device","2");
			break;
		case "door"://门禁
			result = query(cusNumber,"select_door_base_dtls","3");
			break;
		case "patrol"://巡更设备
			result = query(cusNumber,"select_patrol_webService","0");
			break;
		case "talkback"://对讲机
			result = query(cusNumber,"select_talkback_webService","0");
			break;
		case "led"://LED
			result = query(cusNumber,"select_led_webService","0");
			break;
		case "floodlight"://智能照明
			result = query(cusNumber,"select_floodlight_webService","0");
			break;
		case "audiomonitor"://拾音器
			result = query(cusNumber,"select_audiomonitor_webService","0");
			break;
		case "rfidbind"://RFID绑定信息
			result = query(cusNumber,"select_rfidbind_webService","0");
			break;
		default: 
			result = "尚未实现的接口";
			break;
		}
		return result;
	}
	/**
	 * 查询数据并返回
	 * @param param 
	 * @param sqlId
	 * @param whereId
	 * @return
	 */
	private String query(String cusNumber,String sqlId,String whereId){
		JSONObject queryJSON = null;
		JSONArray array=new JSONArray();
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, sqlId);
			queryJSON.put(ReqParams.WHERE_ID, whereId);
			List<String> paraList = new ArrayList<String>();
			paraList.add(cusNumber);
			queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					array.add(tempMap);
				}
			}
			return array.toJSONString();
		} catch (Exception e) {
			log.error("数据查询失败..." + e);
		}
		return null;
	}

}
