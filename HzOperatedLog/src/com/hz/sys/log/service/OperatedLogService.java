package com.hz.sys.log.service;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.hz.cache.util.RedisUtil;
import com.hz.sys.log.bean.OperatedLogBean;

/**
 * 系统操作日志服务接口
 * @author xieyh
 */
public class OperatedLogService {

	private static final String cacheKey = "SYS_USER_OPERATED_LOG_LIST";

	/**
	 * 存放操作日志
	 * @param bean 操作日志对象
	 */
	public static void put (OperatedLogBean bean) {
		RedisUtil.opsForList().leftPush(cacheKey, JSON.toJSONString(bean));
	}

	/**
	 * 获取操作日志
	 * @param num 获取数量
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
	 * 获取操作日志
	 * @param <T>
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
	 * 获取缓存日志集合
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
	 * 获取缓存日志
	 * @return
	 */
	public static synchronized String rightPop () {
		return RedisUtil.opsForList().rightPop(cacheKey);
	}
}
