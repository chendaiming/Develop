package com.hz.cds.callroll.cache;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.util.RedisUtil;
import com.hz.db.util.ReqParams;


@Component
public class TimingCallRollCache extends ACacheTable{

	private static final Logger log = LoggerFactory.getLogger(TimingCallRollCache.class);
	public static final String CACHE_RFID = "TimingCallRollCache_RFID_BIND";

	private JSONObject queryJSON = null;

	@Override
	public Boolean query() {
		queryRfidBindPeople();
		return true;
	}


	/**
	 * 缓存RFID人员绑定数据
	 */
	private void queryRfidBindPeople () {
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_all_bind_rfid_people_info_for_cache");
			queryAndPutHash(queryJSON, CACHE_RFID, "label_id");
			log.info("定时点名缓存RFID绑定人员信息数据... OK!");
		} catch (Exception e) {
			log.info("定时点名缓存RFID绑定人员信息数据异常：", e);
		}
	}


	/**
	 * 根据RFID标签获取绑定人员信息
	 * @param tagId
	 * @return
	 */
	public static Map<String, Object> getRfidBindPeople (String tagId) {
		return RedisUtil.getHashMap(CACHE_RFID, tagId);
	}
}
