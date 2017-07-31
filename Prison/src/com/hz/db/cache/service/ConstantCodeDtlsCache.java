package com.hz.db.cache.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.db.util.ReqParams;

@Component
public class ConstantCodeDtlsCache extends ACacheTable{

	private static final Logger log = LoggerFactory.getLogger(ConstantCodeDtlsCache.class);
	public static final String cacheId = "ConstantCodeDtls";


	@Override
	public Boolean query() {
		JSONObject queryJSON = null;

		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "sys_query_constant_code_dtls");
			queryJSON.put(ReqParams.ORDER_ID, "0");
			queryAndPutList(queryJSON, cacheId);
			log.info("缓存常量信息表数据... OK!");
		} catch (Exception e) {
			log.error("缓存常量信息表数据... ERROR：" + e);
		}

		return true;
	}
}
