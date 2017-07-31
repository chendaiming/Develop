package com.hz.sys.cache;

import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.service.ICacheService;
import com.hz.cache.util.RedisUtil;
import com.hz.db.util.ReqParams;

@Component
	@Resource
	public class CusNumberCache extends ACacheTable implements ICacheService{
	private static final Logger log = LoggerFactory.getLogger(CusNumberCache.class);
	public static final String cacheId = "cusnumber";

	@Override
	public Boolean query() {
		return queryCusNumberInfo();
	}
	
	private boolean queryCusNumberInfo(){
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_cusNumber");
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber=tempMap.get("odd_id").toString();
					RedisUtil.putHash(cacheId, cusNumber,tempMap);
					RedisUtil.deleteHash(cacheId+"_"+cusNumber);
				}
			}
			log.debug("缓存cusNumber成功");
			return true;
		} catch (Exception e) {
			log.error("缓存cusNumber失败",e);
			return false;
		}
	}

	@Override
	public boolean refresh() throws Exception {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		// TODO Auto-generated method stub
		return false;
	}
	
}
