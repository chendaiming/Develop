package com.hz.cds.door.cache;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
public class DoorCardDtlsCache extends ACacheTable implements ICacheService {

	private static final Logger log = LoggerFactory.getLogger(DoorCardDtlsCache.class);

	public static final String doorCardCacheId = "dor_door_card_dtls";
	public static final String doorCardCacheOtherId = "dor_door_card_dtls_otherId";

	@Override
	public Boolean query() {
		Set<Object> cusNumberKeys = RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for (Object key : cusNumberKeys) {
			RedisUtil.deleteHash(doorCardCacheId + "_" + key);
			RedisUtil.deleteHash(doorCardCacheOtherId + "_" + key);
		}
		return queryDoorCardDtls(null, null);
	}

	private boolean queryDoorCardDtls(List<String> paraList, String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_door_card_dtls");
			if (paraList != null && paraList.size() > 0) {
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber = tempMap.get("dcd_cus_number").toString();
					String doorCardId = tempMap.get("dcd_door_card_id").toString();
					String doorCardOtherId = tempMap.get("dcd_surface_id").toString();
					RedisUtil.putHash(doorCardCacheId + "_" + cusNumber, doorCardId, JSON.toJSONString(tempMap));
					RedisUtil.putHash(doorCardCacheOtherId + "_" + cusNumber, doorCardOtherId, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存门禁卡信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存门禁卡信息..." , e);
			return false;
		}
	}

	@Override
	public boolean refresh() throws Exception {
		return queryDoorCardDtls(null, null);
	}

	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		String cusNumber = parasObject.getString("cusNumber");
		String id = parasObject.getString("id");
		if (StringUtil.isNull(cusNumber)) {
			throw new DbException(DbCodeUtil.CODE_0003, "参数=" + parasObject.toJSONString());
		} else {
			List<String> paraList = new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(id);
			return queryDoorCardDtls(paraList, "1");
		}
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber = parasObject.getString("cusNumber");
		String id = parasObject.getString("id");
		RedisUtil.deleteHash(doorCardCacheId + "_" + cusNumber, id);

		return true;
	}

	
	/**
	 * 根据cardId获取门禁卡基本信息
	 * @param cusNumber
	 * @param id
	 * @return
	 */
	public JSONObject getDoorCardInfo(String cusNumber,String id){
		JSONObject rtnObj=null;
		Object doorCardObj=RedisUtil.getObject(doorCardCacheId + "_" + cusNumber, id);
		if(doorCardObj!=null){
			String value=doorCardObj.toString();
			rtnObj=JSONObject.parseObject(value);
		}
		return rtnObj;
	}
	
	/**
	 * 根据卡面编号获取门禁卡基本信息
	 * @param cusNumber
	 * @param id
	 * @return
	 */
	public JSONObject getDoorCardInfoByOtherId(String cusNumber,String otherId){
		JSONObject rtnObj=null;
		Object doorCardObj=RedisUtil.getObject(doorCardCacheOtherId + "_" + cusNumber, otherId);
		if(doorCardObj!=null){
			String value=doorCardObj.toString();
			rtnObj=JSONObject.parseObject(value);
		}
		return rtnObj;
	}
}
