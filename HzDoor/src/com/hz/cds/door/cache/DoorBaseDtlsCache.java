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
public class DoorBaseDtlsCache extends ACacheTable implements ICacheService {

	private static final Logger log = LoggerFactory.getLogger(DoorBaseDtlsCache.class);
	/**
	 * key第三方Id value=doorId
	 */
	public static final String doorForOtherIdCacheId = "dor_door_base_dtls_forotherid";
	public static final String doorCacheId = "dor_door_base_dtls";

	@Override
	public Boolean query() {
		Set<Object> cusNumberKeys = RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for (Object key : cusNumberKeys) {
			RedisUtil.deleteHash(doorForOtherIdCacheId + "_" + key);
			RedisUtil.deleteHash(doorCacheId + "_" + key);
		}
		return queryDoorBaseDtls(null, null);
	}

	private boolean queryDoorBaseDtls(List<String> paraList, String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_door_base_dtls");
			if (paraList != null && paraList.size() > 0) {
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber = tempMap.get("dbd_cus_number").toString();
					String otherId = tempMap.get("dbd_other_id").toString();
					// 如果第三方编号为空，则用控制器编号+通道号作为第三方编号
					if (StringUtil.isNull(otherId)) {
						otherId = tempMap.get("dbd_ctrl_id").toString() + tempMap.get("dbd_ctrl_chl").toString();
					}
					String doorId = tempMap.get("dbd_id").toString();
					RedisUtil.putHash(doorForOtherIdCacheId + "_" + cusNumber, otherId, doorId);
					RedisUtil.putHash(doorCacheId + "_" + cusNumber, doorId, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存门禁信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存门禁信息..." , e);
			return false;
		}
	}

	@Override
	public boolean refresh() throws Exception {
		return queryDoorBaseDtls(null, null);
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
			return queryDoorBaseDtls(paraList, "1");
		}
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber = parasObject.getString("cusNumber");
		String id = parasObject.getString("id");
		String otherId = parasObject.getString("otherId");
		RedisUtil.deleteHash(doorCacheId + "_" + cusNumber, id);
		RedisUtil.deleteHash(doorForOtherIdCacheId + "_" + cusNumber, otherId);
		return true;
	}

	/**
	 * 通过第三方门禁编号获取门编号
	 * 
	 * @param cusNumber
	 * @param otherid
	 * @return
	 */
	public String getDoorIdForOtherId(String cusNumber, String otherid) {
		Object doorIdObj = RedisUtil.getObject(doorForOtherIdCacheId+ "_" + cusNumber, otherid);
		// 如果缓存没有数据，按照机构号到数据库中查询，并存到缓存中
		if (doorIdObj == null) {
			List<String> paraList = new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(otherid);
			queryDoorBaseDtls(paraList, "2");
			doorIdObj = RedisUtil.getObject(doorForOtherIdCacheId+ "_" + cusNumber, otherid);
		}
		if(doorIdObj!=null){
			return doorIdObj.toString();
		}else{
			return "";
		}
	}
	
	/**
	 * 根据Id获取门基本信息
	 * @param cusNumber
	 * @param id
	 * @return
	 */
	public JSONObject getDoorInfo(String cusNumber,String id){
		JSONObject rtnObj=null;
		Object doorObj=RedisUtil.getObject(doorCacheId + "_" + cusNumber, id);
		if(doorObj!=null){
			String value=doorObj.toString();
			rtnObj=JSONObject.parseObject(value);
		}
		return rtnObj;
	}
}
