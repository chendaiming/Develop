package com.hz.db.cache.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.db.util.ReqParams;

@Component
public class UserBaseDtlsCache extends ACacheTable{

	private static final Logger log = LoggerFactory.getLogger(UserBaseDtlsCache.class);
	public static final String cacheId = "SYS_USER_BASE_DTLS";


	@Override
	public Boolean query() {
		JSONObject queryJSON = null;

		try {

			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "query_user_base_dtls_for_cache");
			queryAndPutHash(queryJSON, cacheId, "ubd_id");
			log.info("缓存用户基础信息表数据... OK!");

		} catch (Exception e) {
			log.error("缓存用户基础信息表数据... ERROR：" + e);
		}

		return true;
	}
}
