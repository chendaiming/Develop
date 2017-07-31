package com.hz.cds.rfid.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.rfid.message.FeRfidMessageBean;
import com.hz.cds.rfid.utils.RFIDConstants;

public class RFIDRecordService {
	/**
	 * 存放RFID记录至缓存
	 * @param bean
	 * @throws Exception
	 */
	public static void putRecord(FeRfidMessageBean bean) throws Exception{
		RedisUtil.opsForList().leftPush(RFIDConstants.RFID_RECORD_KEY4CACHE, JSON.toJSONString(bean));
	}
	
	/**
	 * 存放最新的记录至缓存
	 * @param bean
	 * @throws Exception
	 */
	public static void putNewestRecord(FeRfidMessageBean bean) throws Exception{
		RedisUtil.putHash(RFIDConstants.RFID_NEWEST_RECORD_KEY4CACHE, 
				bean.getCusNumber()+"_"+bean.getPeopleId(), JSON.toJSONString(bean));
	}
	
	/**
	 * 根据peopleId获取缓存中最新的记录
	 * @param peopleId
	 * @return
	 */
	public static Map<String, Object> getRecordByPeopleId(String cusNumber, String peopleId){
		Map<String, Object> resultMap = RedisUtil.getHashMap(RFIDConstants.RFID_NEWEST_RECORD_KEY4CACHE, cusNumber+"_"+peopleId);
		return resultMap;
	}
	
	/**
	 * 获取RFID记录
	 * @param num 获取数量
	 * @param <T>
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> get(int num, Class<?> T) {
		List<T> listBean = new ArrayList<T>();
		List<String> list = rightPop(num);

		for(String val : list) {
			listBean.add((T)JSON.toJavaObject(JSON.parseObject(val), T));
		}

		return listBean;
	}

	/**
	 * 获取RFID记录
	 * @param num 获取数量
	 */
	public static JSONArray get(int num) {
		JSONArray listBean = new JSONArray();
		List<String> list = rightPop(num);

		for(String val : list) {
			listBean.add(JSON.parseObject(val));
		}

		return listBean;
	}

	/**
	 * 获取RFID记录集合
	 * @param num
	 * @return
	 */
	public static synchronized List<String> rightPop (int num) {
		List<String> list = new ArrayList<String>();
		String result = null;

		while(num-- > 0) {
			result = rightPop();
			if (result != null) {
				list.add(result);
			}
		}
		return list;
	}

	/**
	 * 获取一条RFID记录
	 * @return
	 */
	public static synchronized String rightPop () {
		return RedisUtil.opsForList().rightPop(RFIDConstants.RFID_RECORD_KEY4CACHE);
	}
	
}
