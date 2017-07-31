package com.hz.cds.rfid.task;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.rfid.service.RFIDRecordService;
import com.hz.cds.rfid.utils.RFIDConstants;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IUpdateService;

@Component
public class RFIDRecordTask {
	private static final Logger logger = LoggerFactory.getLogger(RFIDRecordTask.class);
	
	private static final int RFIDRECORD_NUM = 50;// 每次从缓存至获取的记录数
	
	@Resource
	private IUpdateService updateService;
	
	@Scheduled(cron="0/5 * * * * ?")
	public void rfidRecordTask(){
		JSONArray list = RFIDRecordService.get(RFIDRECORD_NUM); // 从缓存中获取指定数目的RFID记录
		
		if(list!=null && list.size()!=0){
			UpdateResp updateResp = null;
			try {
				updateResp = updateService.updateByParamKey("insert_prisoner_rfid_record_from_cache", list);
			} catch (Exception e) {
				logger.debug("RFID记录批量更新失败！");
			}
			
			if(updateResp!=null && updateResp.getSuccess()){
				logger.debug("RFID记录批量更新插入成功！");
			}else{//批量更新失败
				updateByStep(list);
			}
			
		}
	}
	
	/**
	 * 逐步更新rfid记录，失败则存入缓存中
	 * @param arr
	 */
	private void updateByStep(JSONArray arr){
		UpdateResp updateResp = null;
		for(int i=0;i<arr.size();i++){
			JSONObject logObject = arr.getJSONObject(i);
			try {
				updateResp = updateService.updateByParamKey("insert_prisoner_rfid_record_from_cache", logObject);
			} catch (Exception e) {
				logger.debug("用户操作日志单条更新失败，存入缓存！");
			}
			if(updateResp==null || !updateResp.getSuccess()){//更新失败
				putLog2Cache(RFIDConstants.ERROR_RFID_RECORD_KEY4CACHE, logObject);
			}
		}
	}
	
	/**
	 * 存放rfid记录至缓存中
	 * @param cacheKeyName
	 * @param jObject
	 */
	private void putLog2Cache(String cacheKeyName, JSONObject jObject){
		RedisUtil.opsForList().leftPush(cacheKeyName, jObject.toJSONString());
	}
	
}
