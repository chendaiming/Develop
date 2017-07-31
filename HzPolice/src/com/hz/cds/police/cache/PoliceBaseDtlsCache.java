package com.hz.cds.police.cache;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.service.ICacheService;
import com.hz.cache.util.RedisUtil;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.DbException;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.StringUtil;

@Component
	@Resource
	public class PoliceBaseDtlsCache extends ACacheTable implements ICacheService{
	private static final Logger log = LoggerFactory.getLogger(PoliceBaseDtlsCache.class);
	public static final String cacheId = "plc_police_base_dtls_forpoliceId";

	@Override
	public Boolean query() {
		deteleAllPoliceHash();
		return queryPoliceBaseDtls(null,null);
	}
	
	private void deteleAllPoliceHash(){
		Set<Object> cusNumberKeys=RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for(Object key:cusNumberKeys){
			RedisUtil.deleteHash(cacheId+"_"+key);
		}
	}
	
	private boolean queryPoliceBaseDtls(List<String> paraList,String whereId){
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_police_base_dtls_cache");
			queryJSON.put(ReqParams.WHERE_ID, whereId);
			if(paraList!=null&&paraList.size()>0){
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumberQuery=tempMap.get("pbd_cus_number").toString();
					String policeIdQuery=tempMap.get("pbd_police_id").toString();
					RedisUtil.putHash(cacheId+"_"+cusNumberQuery, policeIdQuery, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存民警基本信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存民警基本信息...",e);
			return false;
		}
	}

	/**
	 * 根据警号查询用户ID
	 * @param cusNumber
	 * @param policeId
	 * @return
	 */
	public String queryUserId(String cusNumber,String policeId){
		String userId = "";
		Object policeObj = RedisUtil.getHashMap(cacheId+"_"+cusNumber, policeId);
		if(policeObj !=null){
			JSONObject policejsonObj=JSONObject.parseObject(policeObj.toString());
			userId = policejsonObj.getString("pbd_user_id");
		}
		return userId;
	}
	@Override
	public boolean refresh() throws Exception {
		return queryPoliceBaseDtls(null,null);
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("policeId"); 
		RedisUtil.deleteHash(cacheId+"_"+cusNumber, id);
		return true;
				
	}
	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("id"); 
		if(StringUtil.isNull(cusNumber)){
			throw new DbException(DbCodeUtil.CODE_0003, "参数="+parasObject.toJSONString());
		}else{
			List<String> paraList=new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(id);
			queryPoliceBaseDtls(paraList,"0");
		}
		return false;
	}
}
