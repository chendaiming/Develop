package com.hz.cds.rfid.cache;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.util.RedisUtil;
import com.hz.db.util.ReqParams;


@Component
public class RFIDLabelPeopleBindCache extends ACacheTable {

	private static final Logger log = LoggerFactory.getLogger(RFIDLabelPeopleBindCache.class);
	private static final String cacheId = "RFIDLabelPeopleBindCache";
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
			queryJSON.put(ReqParams.SQL_ID, "select_rfid_bind_people_info_for_cache");
			queryAndPutHash(queryJSON, cacheId, new String []{"cus_number", "label_id"});
			log.info("缓存RFID标签绑定人员数据... OK!");
		} catch (Exception e) {
			log.error("缓存RFID标签绑定人员数据异常：" + e);
		}
	}


	/**
	 * 根据RFID标签获取绑定人员信息
	 * @param cusNumber
	 * @param labelId
	 * @return
	 */
	public static Map<String, Object> getRfidBindPeople (String cusNumber, String labelId) {
		return RedisUtil.getHashMap(cacheId, new String[]{cusNumber, labelId});
	}
}
