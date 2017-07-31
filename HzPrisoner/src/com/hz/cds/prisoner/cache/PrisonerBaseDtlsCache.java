package com.hz.cds.prisoner.cache;

import java.util.ArrayList;
import java.util.HashMap;
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
import com.hz.db.dao.QueryDao;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.DbException;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.StringUtil;
/**
 * 缓存罪犯(病员)数据
 * @author Rui_Win8.1
 *
 */
@Component
public class PrisonerBaseDtlsCache extends ACacheTable implements ICacheService{
	@Resource
	private QueryDao queryDao;
	private static final Logger log = LoggerFactory.getLogger(PrisonerBaseDtlsCache.class);
	public static final String prisonerCacheOtherid = "prisoner_base_dtls_cache_otherid";

	@Override
	public Boolean query() {
		Set<Object> cusNumberKeys=RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for(Object key:cusNumberKeys){
			RedisUtil.deleteHash(prisonerCacheOtherid+"_"+key);
		}
		return queryPrisonerBaseDtls(null,null);
	}
  
	private boolean queryPrisonerBaseDtls(List<String> paraList,String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_prisoner_base_dtls_cache");
			if(paraList!=null&&paraList.size()>0){
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber=tempMap.get("pbd_cus_number").toString();
					String id=tempMap.get("pbd_other_id").toString();
					RedisUtil.putHash(prisonerCacheOtherid+"_"+cusNumber, id, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存罪犯(病员)基本信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存罪犯(病员)基本信息...",e);
			return false;
		}
	}
	
	@Override
	public boolean refresh() throws Exception {
		return queryPrisonerBaseDtls(null,null);
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("otherid"); 
		RedisUtil.deleteHash(prisonerCacheOtherid+"_"+cusNumber, id);
		return true;
				
	}
	
	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("otherid"); 
		if(StringUtil.isNull(cusNumber)){
			throw new DbException(DbCodeUtil.CODE_0003, "参数="+parasObject.toJSONString());
		}else{
			List<String> paraList=new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(id);
			return queryPrisonerBaseDtls(paraList,"1");
		}
	}
	
	/**
	 * 通过第三方罪犯编号查询罪犯信息
	 * @param cusNumber
	 * @param otherid
	 * @return
	 */
	public JSONObject getPrisonerInfoByOtherid(String cusNumber,String otherid){
		JSONObject prisonerObj=null;
		String prisonerStr=RedisUtil.getHashMap(prisonerCacheOtherid+"_"+cusNumber, otherid).toString();
		prisonerObj=JSONObject.parseObject(prisonerStr);
		return prisonerObj;
	}
	
	/**
	 * 通过第三方罪犯编号查询罪犯信息(单个字段)
	 * @param cusNumber 机构编号
	 * @param otherid 第三方罪犯编号
	 * @param key 查询的字段名
	 * @return
	 */
	public String getPrisonerInfoByOtherid(String cusNumber,String otherid,String key){
		Map<String, Object> redisMap = new HashMap<String, Object>();
		String value = "";
		if(RedisUtil.hasKey(prisonerCacheOtherid+"_"+cusNumber, otherid)){
			redisMap = RedisUtil.getHashMap(prisonerCacheOtherid+"_"+cusNumber, otherid);
		}
		if(!redisMap.isEmpty() && redisMap.containsKey(key)){
			value=redisMap.get(key).toString();
		}
		return value;
	}
}
