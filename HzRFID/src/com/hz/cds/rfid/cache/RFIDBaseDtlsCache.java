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
public class RFIDBaseDtlsCache extends ACacheTable {

	private static final Logger log = LoggerFactory.getLogger(RFIDBaseDtlsCache.class);
	private static final String cacheId = "RFIDBaseDtlsCache";
	private JSONObject queryJSON = null;


	@Override
	public Boolean query() {
		cacheRfidBaseInfo();
		return true;
	}


	/**
	 * 缓存RFID人员绑定数据
	 */
	private void cacheRfidBaseInfo () {
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_rfid_base_info_for_cache");
			queryAndPutHash(queryJSON, cacheId, new String []{"cus_number", "rfid_oid"});
			log.info("缓存RFID基站基础数据... OK!");
		} catch (Exception e) {
			log.error("缓存RFID基站基础数据异常：" + e);
		}
	}


	/**
	 * 根据RFID标签获取绑定人员信息
	 * @param cusNumber
	 * @param otherId
	 * @return
	 */
	public static Map<String, Object> getRfidBaseInfo (String cusNumber, String otherId) {
		return RedisUtil.getHashMap(cacheId, new String[]{cusNumber, otherId});
	}
}
