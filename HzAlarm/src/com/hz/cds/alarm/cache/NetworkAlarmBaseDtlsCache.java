package com.hz.cds.alarm.cache;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
public class NetworkAlarmBaseDtlsCache extends ACacheTable implements ICacheService {

	private static final Logger log = LoggerFactory.getLogger(NetworkAlarmBaseDtlsCache.class);
	public static final String networkAlarmCacheId = "alt_network_base_dtls";

	@Override
	public Boolean query() {
		return queryNetworkAlarmBaseDtls(null,null);
	}

	private boolean queryNetworkAlarmBaseDtls(List<String> paraList, String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_network_base_dtls");
			if (paraList != null && paraList.size() > 0) {
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}

			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber=tempMap.get("nbd_cus_number").toString();
					String id = tempMap.get("nbd_id").toString();
					RedisUtil.putHash(networkAlarmCacheId+"_"+cusNumber, id, JSON.toJSON(tempMap));
				}
			}
			log.info("缓存网络报警信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存网络报警信息失败..." ,e);
			return false;
		}
	}

	/**
	 * 根据网络报警器ID获取设备基本信息
	 * @param cusNumber
	 * @param id
	 * @return
	 */
    public JSONObject getNetWorkAlarmInfo(String cusNumber,String id){
    	Object netWorkAlarmObj=RedisUtil.getHashMap(networkAlarmCacheId+"_"+cusNumber, id);
    	if(netWorkAlarmObj==null){
			List<String> paraList = new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(id);
    		queryNetworkAlarmBaseDtls(paraList,"1");
    		netWorkAlarmObj=RedisUtil.getHashMap(networkAlarmCacheId+"_"+cusNumber, id);
    	}
    	return JSONObject.parseObject(netWorkAlarmObj.toString());
    }

	@Override
	public boolean refresh() throws Exception {
		return queryNetworkAlarmBaseDtls(null, null);
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
			return queryNetworkAlarmBaseDtls(paraList, "1");
		}
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber = parasObject.getString("cusNumber");
		String id = parasObject.getString("id");
		RedisUtil.deleteHash(networkAlarmCacheId + "_" + cusNumber, id);
		return true;
	}
}
