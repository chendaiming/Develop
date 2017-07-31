package com.hz.frm.net.amq.service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.hz.cache.util.RedisUtil;
import com.hz.db.service.IQueryService;

@Service
public class MessageSubscribe {
	private final static Logger logger = LoggerFactory.getLogger(MessageSubscribe.class);

	@Resource
	private IQueryService queryService;

	/**
	 * 消息订阅用户Map key：msgIdnty  用户的List<Map<String,String>>>  key:MSD_USER_ID、MSD_CUS_NUMBER
	 */
	private final static String msgIdntyUserMap="msg_id_user";

	
    @PostConstruct
	public void init(){
		RedisUtil.deleteHash(msgIdntyUserMap);
		logger.debug("开始初始化消息订阅");

		/*
		JSONObject sqlJSON = new JSONObject();
		sqlJSON.put("sqlId", "cds_query_message_subscribe");

		List<Map<String,Object>> rtnList = null;
		try {
			rtnList = queryService.query(sqlJSON);
		} catch (Exception e) {
			e.printStackTrace();
		}

		String msgIdntyLast="";
		JSONArray jsonArray = new JSONArray();
		int num=0;

		if(rtnList!=null&&rtnList.size()>0){
			for(Map<String,Object> msgMap:rtnList){
				num++;
				JSONObject user=new JSONObject();
				String msgIdnty=msgMap.get("MSD_MSG_IDNTY").toString();
				String cusNumber=msgMap.get("MSD_CUS_NUMBER").toString();
				String userId=msgMap.get("MSD_USER_ID").toString();
				user.put("cusNumber", cusNumber);
				user.put("userId", userId);
				user.put("msgIdnty", msgIdnty);
				if(!StringUtil.isNull(msgIdntyLast)&&(!StringUtil.isNull(msgIdnty)&&!msgIdnty.equals(msgIdntyLast))){
					RedisUtil.putHash(msgIdntyUserMap, msgIdntyLast, jsonArray.toJSONString());
					jsonArray=new JSONArray();
				}
				jsonArray.add(user);
				msgIdntyLast=msgIdnty;
				if(num==rtnList.size()){
					RedisUtil.putHash(msgIdntyUserMap, msgIdntyLast, jsonArray.toJSONString());
				}
			}
		}
		*/
	}
	
	public JSONArray getUserId(String msgIdnty){
		String jsonStr=(String)RedisUtil.getObject(msgIdntyUserMap, msgIdnty);
		JSONArray jsonArray=JSONArray.parseArray(jsonStr);
		return jsonArray;
	}
}
