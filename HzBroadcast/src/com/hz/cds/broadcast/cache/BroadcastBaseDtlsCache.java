package com.hz.cds.broadcast.cache;

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
import com.hz.db.dao.QueryDao;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.DbException;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.StringUtil;

@Component
public class BroadcastBaseDtlsCache extends ACacheTable implements ICacheService{
	@Resource
	private QueryDao queryDao;

	private static final Logger log = LoggerFactory.getLogger(BroadcastBaseDtlsCache.class);
	public static final String broadcastCacheId = "bct_broadcast_base_dtls";

	@Override
	public Boolean query() {
		Set<Object> cusNumberKeys=RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for(Object key:cusNumberKeys){
			RedisUtil.deleteHash(broadcastCacheId+"_"+key);
		}
		return queryBroadcastBaseDtls(null,null);
	}
  
	private boolean queryBroadcastBaseDtls(List<String> paraList,String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_broadcast_base_dtls");
			if(paraList!=null&&paraList.size()>0){
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber=tempMap.get("bbd_cus_number").toString();
					String id=tempMap.get("bbd_id").toString();
					RedisUtil.putHash(broadcastCacheId+"_"+cusNumber, id, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存数字广播设备基本信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存数字广播设备基本信息...ERROR",e);
			return false;
		}
	}
	
	@Override
	public boolean refresh() throws Exception {
		return queryBroadcastBaseDtls(null,null);
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("id"); 
		RedisUtil.deleteHash(broadcastCacheId+"_"+cusNumber, id);
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
			return queryBroadcastBaseDtls(paraList,"1");
		}
	}
	
	/**
	 * 通过数字广播编号获取数字广播信息
	 * @param cusNumber
	 * @param broadcastId 数字广播编号
	 * @return
	 */
	public JSONObject getBroadcastInfo(String cusNumber,String broadcastId){
		JSONObject broadcastObj=null;
		String broadcastStr=RedisUtil.getHashMap(broadcastCacheId+"_"+cusNumber, broadcastId).toString();
		broadcastObj=JSONObject.parseObject(broadcastStr);
		return broadcastObj;
	}
	
	/**
	 * 通过数字广播编号获取数字广播名称
	 * @param cusNumber 监狱号
	 * @param broadcastId 数字广播编号
	 * @return
	 */
	public String getBroadcastName(String cusNumber,String broadcastId){
		String name="";
		JSONObject broadcastObj=getBroadcastInfo(cusNumber,broadcastId);
		if(broadcastObj!=null){
			name=broadcastObj.getString("bbd_name");
		}
		return name;
	}
}
