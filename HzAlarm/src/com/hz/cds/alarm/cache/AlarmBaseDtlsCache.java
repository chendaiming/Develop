package com.hz.cds.alarm.cache;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.service.ICacheService;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.alarm.extend.IAlarmExtendService;
import com.hz.cds.alarm.service.AlarmService;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.Tools;

@Component
public class AlarmBaseDtlsCache extends ACacheTable implements ICacheService {

	private static final Logger log = LoggerFactory.getLogger(AlarmBaseDtlsCache.class);
//	private static final String[] paramKeys = new String[]{"cus_number", "id", "name", "dept_id", "addrs"};

	private static final String keyCusNumber = "cus_number";
	private static final String keyId = "id";
	private static final String keyName = "name";
	private static final String keyDeptId = "dept_id";
	private static final String keyAddrs = "addrs";

	public static final String alarmBaseInfoCacheId = "alarm_base_info_dtls";


	@Resource
	private AlarmService alarmService;

	@Override
	public Boolean query() {
		cacheAlarmBaseInfo();
		return queryNetworkAlarmBaseDtls(null,null);
	}


	private boolean cacheAlarmBaseInfo () {
		Map<String, IAlarmExtendService> extendServiceMap = null;
		IAlarmExtendService extendService = null;
		List<Map<String, Object>> listMap = null;

		String cacheKey = null;
		String queryKey = null;

		try {
			// 获取注册服务列表
			extendServiceMap = alarmService.getServiceMap();

			// 获取每个服务提供的设备基础数据
			for(String type : extendServiceMap.keySet()) {
				extendService = extendServiceMap.get(type);
				listMap = extendService.getBaseInfos();

				if (listMap != null && listMap.size() > 0) {
					if (checkParams(extendService.getClass().getSimpleName(), listMap.get(0))) {
						for(Map<String, Object> map : listMap){
							map.put("type", type);

							// 缓存数据
							cacheKey = alarmBaseInfoCacheId + "_" + Tools.toStr(map.get(keyCusNumber));
							queryKey = type + "_" + Tools.toStr(map.get(keyId));

							RedisUtil.putHash(cacheKey, queryKey, JSON.toJSON(map));
						}
					}
				}
			}

			log.info("缓存报警基础数据... OK!");
			return true;

		} catch (Exception e) {
			log.error("缓存报警基础数据异常：", e);
			return false;
		}
	}


	/**
	 * 检查参数的数据格式
	 * @param map
	 * @return
	 * @throws Exception
	 */
	private boolean checkParams (String serviceName, Map<String, Object> map) throws Exception {
		String keyFlag = "";

		if (!map.containsKey(keyCusNumber)) keyFlag = keyCusNumber;
		if (!map.containsKey(keyId)) keyFlag = keyId;
		if (!map.containsKey(keyName)) keyFlag = keyName;
		if (!map.containsKey(keyDeptId)) keyFlag = keyDeptId; 
		if (!map.containsKey(keyAddrs)) keyFlag = keyAddrs;

		if (keyFlag.length() > 0) {
			throw new Exception("服务[" + serviceName + "]返回数据格式错误，缺少字段[" + keyFlag + "]");
		}

		return true;
	}



	private boolean queryNetworkAlarmBaseDtls(List<String> paraList, String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_alarm_base_info_dtls");
			if (paraList != null && paraList.size() > 0) {
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			String cusNumber = null;
			String id = null;
			String type = null;

			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					cusNumber = tempMap.get(keyCusNumber).toString();
					id = tempMap.get(keyId).toString();
					type = tempMap.get("type").toString();
					RedisUtil.putHash(alarmBaseInfoCacheId+"_"+cusNumber, type+"_"+id, JSON.toJSON(tempMap));
				}
			}
			log.info("缓存报警基础信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存报警基础信息失败...",e);
			return false;
		}
	}

	/**
	 * 根据网络报警器ID获取设备基本信息
	 * @param cusNumber
	 * @param id
	 * @return
	 */
    public JSONObject getAlarmBaseInfo(String cusNumber,String id,String type){
    	Object netWorkAlarmObj = RedisUtil.getHashMap(alarmBaseInfoCacheId+"_"+cusNumber, type+"_"+id);
    	if (netWorkAlarmObj==null) {
			List<String> paraList = new ArrayList<String>();
			paraList.add(cusNumber);
    		queryNetworkAlarmBaseDtls(paraList,"1");
    		netWorkAlarmObj = RedisUtil.getHashMap(alarmBaseInfoCacheId+"_"+cusNumber, type+"_"+id);
    	}

    	if (netWorkAlarmObj != null) {
    		return JSONObject.parseObject(netWorkAlarmObj.toString());
    	} else {
    		return new JSONObject();
    	}
    }
    
    /**
     * 获取报警器名称
     * @param cusNumber
     * @param id
     * @param type
     * @return
     */
    public String getAlarmName(String cusNumber,String id,String type){
		JSONObject alarmObj = getAlarmBaseInfo(cusNumber,id,type);
		String name = "";

		if (alarmObj != null) {
			name = alarmObj.getString("name");
		}
		return name;
    }
    /**
     * 获取报警器地址
     * @param cusNumber
     * @param id
     * @param type
     * @return
     */
    public String getAlarmAddress(String cusNumber,String id,String type){
		String name="";
		JSONObject alarmObj=getAlarmBaseInfo(cusNumber,id,type);
		name=alarmObj.getString("addrs");
		return name;
    }
    /**
     * 获取报警器所属部门
     * @param cusNumber
     * @param id
     * @param type
     * @return
     */
    public String getAlarmDepartmentId(String cusNumber,String id,String type){
		String name="";
		JSONObject alarmObj = getAlarmBaseInfo(cusNumber,id,type);
		if(alarmObj!=null)
			name=alarmObj.getString("dept_id");
		return name;
    }

	@Override
	public boolean refresh() throws Exception {
		return queryNetworkAlarmBaseDtls(null, null);
	}

	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		return true;
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		return true;
	}
}
