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
public class DoorControlDeviceCache extends ACacheTable implements ICacheService {

	private static final Logger log = LoggerFactory.getLogger(DoorControlDeviceCache.class);
	/**
	 * key第三方Id value=doorId
	 */
	public static final String doorControlDeviceCacheId = "dor_door_control_device";

	@Override
	public Boolean query() {
		Set<Object> cusNumberKeys = RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for (Object key : cusNumberKeys) {
			RedisUtil.deleteHash(doorControlDeviceCacheId + "_" + key);
		}
		return queryDoorControlDeviceBaseDtls(null, null);
	}

	private boolean queryDoorControlDeviceBaseDtls(List<String> paraList, String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_door_control_device");
			if (paraList != null && paraList.size() > 0) {
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber = tempMap.get("dcd_cus_number").toString();
					String id = tempMap.get("dcd_id").toString();
					RedisUtil.putHash(doorControlDeviceCacheId + "_" + cusNumber, id, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存门禁控制器信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存门禁控制器信息..." ,e);
			return false;
		}
	}

	@Override
	public boolean refresh() throws Exception {
		return queryDoorControlDeviceBaseDtls(null, null);
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
			return queryDoorControlDeviceBaseDtls(paraList, "1");
		}
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber = parasObject.getString("cusNumber");
		String id = parasObject.getString("id");
		RedisUtil.deleteHash(doorControlDeviceCacheId + "_" + cusNumber, id);
		return true;
	}

	/**
	 * 根据Id获取门控制器基本信息
	 * @param cusNumber
	 * @param id
	 * @return
	 */
	public JSONObject getDoorControlDeviceInfo(String cusNumber,String id){
		JSONObject rtnObj=null;
		Object controlObj=RedisUtil.getObject(doorControlDeviceCacheId+ "_" + cusNumber, id);
		if(controlObj!=null){
			String value=controlObj.toString();
			rtnObj=JSONObject.parseObject(value);
		}

		return rtnObj;
	}
}
