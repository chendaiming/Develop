package com.hz.cds.callroll.cache;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.service.ICacheService;
import com.hz.frm.util.Tools;


@Component
public class TimingCallrollWorkCache extends ACacheTable implements ICacheService {

	private static final Logger logger = LoggerFactory.getLogger(TimingCallrollWorkCache.class);
	private static JSONObject timingJSON = new JSONObject();// 存储定时任务的对象

	public static final String CACHE_KEY = "TimingCallrollWorkCache";


	@Override
	public Boolean query() {
		loadTimingCallRollData();
		return true;
	}

	@Override
	public boolean refresh() throws Exception {
		return this.query();
	}


	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		return this.query();
	}


	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		return this.query();
	}


	/**
	 * 加载定时点名数据
	 */
	public void loadTimingCallRollData () {
		List<Map<String, Object>> listMap = null;
		Map<String, Object> map = null;

		JSONObject tempJSON = null;
		JSONObject jsonObj = null;
		JSONArray jsonArray = null;
		String cusNumber = null;
		String beginTime = null;
		String dpttId = null;

		try {
			listMap = queryService.query("select_all_timing_callroll_data", null);

			if (listMap != null && listMap.size() > 0) {
				timingJSON.clear();

				for(int i = 0, I = listMap.size(); i < I; i++) {
					map = listMap.get(i);
					cusNumber = Tools.toStr(map.get("cus_number"));
					beginTime = Tools.toStr(map.get("begin_time"));
					dpttId = Tools.toStr(map.get("dptt_id"), "");

					tempJSON = new JSONObject();
					tempJSON.put("tid", Tools.toStr(map.get("id")));
					tempJSON.put("cusNumber", cusNumber);
					tempJSON.put("cusName", Tools.toStr(map.get("cus_name")));
					tempJSON.put("beginTime", beginTime);
					tempJSON.put("maxTime", Tools.toStr(map.get("max_time"), ""));
					tempJSON.put("dpttId", dpttId);
					tempJSON.put("dpttName", Tools.toStr(map.get("dptt_name")));
					tempJSON.put("areaId", Tools.toStr(map.get("area_id"), ""));
					tempJSON.put("areaName", Tools.toStr(map.get("area_name")));

					if (timingJSON.containsKey(beginTime)) {
						jsonObj = timingJSON.getJSONObject(beginTime);
					} else {
						jsonObj = new JSONObject();
						timingJSON.put(beginTime, jsonObj);
					}

					if (jsonObj.containsKey(cusNumber)) {
						jsonArray = jsonObj.getJSONArray(cusNumber);
					} else {
						jsonArray = new JSONArray();
						jsonObj.put(cusNumber, jsonArray);
					}

					if ("".equals(dpttId)) {
						jsonArray.clear();
						jsonArray.add(tempJSON);
					} else {
						if (jsonArray.size() > 0) {
							dpttId = jsonArray.getJSONObject(0).getString("dpttId");

							if (dpttId.length() > 0) {
								jsonArray.add(tempJSON);
							}
						} else {
							jsonArray.add(tempJSON);
						}
					}
				}
			}
			logger.info("缓存定时点名任务数据成功!");
		} catch (Exception e) {
			logger.error("缓存定时点名任务数据异常：", e);
		}
	}


	/**
	 * 根据时间获取任务列表
	 * @param hhmm 时间，格式HH:mm
	 * @return
	 */
	public synchronized static JSONObject getWorkByTime (String hhmm) {
		return timingJSON.getJSONObject(hhmm);
	}
}
