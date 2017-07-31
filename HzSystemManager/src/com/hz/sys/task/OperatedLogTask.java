package com.hz.sys.task;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IUpdateService;
import com.hz.frm.utils.SequenceUtil;
import com.hz.sys.log.service.OperatedLogService;

@Component
public class OperatedLogTask {
	private static final Logger logger = LoggerFactory.getLogger(OperatedLogTask.class);
	
	private static final int LOG_NUMBER = 50; // 每次请求取日志的数目
	
	private static final String TABLE_NAME = "SYS_USER_OPERATED_LOG"; // 操作日志表的表名
	
	private static final String COLUMN_NAME = "UOL_ID"; // 字段名
	
	private static final String CACHE_KEY = "SYS_USER_OPERATED_LOG_LIST"; // 正常存储操作日志的key
	
	private static final String ERROR_CACHE_KEY = "SYS_USER_OPERATED_LOG_ERROR_LIST"; // 存储更新失败日志的key

	@Resource
	private IUpdateService updateService;

	@Resource
	private SequenceUtil sequenceUtil;

	@Scheduled(cron="0/5 * * * * ?")
	public void logTask() {
		JSONArray list = OperatedLogService.get(LOG_NUMBER);
		List<String> sequences = null;

		if(list.size()!=0){
			try {
				sequences = sequenceUtil.getSequences(TABLE_NAME, COLUMN_NAME, list.size()); //获取id
			} catch (Exception e) {
				logger.error("执行用户操作日志更新时,获取id时发生异常：", e);
				//将缓存中取得的记录放回缓存中
				putLog2Cache(CACHE_KEY, list);
				return;
			}
			for(int i=0;i<list.size();i++){
				list.getJSONObject(i).put("id", sequences.get(i));
			}

			UpdateResp updateResp = null;
			try {
				updateResp = updateService.updateByParamKey("insert_log_table", list);
			} catch (Exception e) {
				logger.debug("用户操作日志批量更新插入失败，转为逐条更新！");
			}
				
			if(updateResp!=null && updateResp.getSuccess()){
				logger.debug("用户操作日志批量更新插入成功！");
			}else{
				//改为逐条更新，将失败的日志放入缓存中
				updateByStep(list);
			}

		}
	}
	
	/**
	 * 逐步更新日志数据，失败则存入缓存中
	 * @param arr
	 */
	private void updateByStep(JSONArray arr){
		UpdateResp updateResp = null;
		for(int i=0;i<arr.size();i++){
			JSONObject logObject = arr.getJSONObject(i);
			try {
				updateResp = updateService.updateByParamKey("insert_log_table", logObject);
			} catch (Exception e) {
				logger.debug("用户操作日志单条更新失败，存入缓存！");
			}
			if(updateResp==null || !updateResp.getSuccess()){//更新失败
				putLog2Cache(ERROR_CACHE_KEY, logObject);
			}
		}
	}
	
	/**
	 * 存放操作日志至缓存中（多条）
	 * @param cacheKeyName
	 * @param arr  JSONArray格式数据
	 */
	private void putLog2Cache(String cacheKeyName, JSONArray arr){
		for(int i=0;i<arr.size();i++){
			putLog2Cache(cacheKeyName, arr.getJSONObject(i));
		}
	}
	
	/**
	 * 存放操作日志至缓存中（单条）
	 * @param cacheKeyName
	 * @param jObject
	 */
	private void putLog2Cache(String cacheKeyName, JSONObject jObject){
		RedisUtil.opsForList().leftPush(cacheKeyName, jObject.toJSONString());
	}
	
}
