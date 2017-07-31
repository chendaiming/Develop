package com.hz.fe;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 消息服务映射类
 * @author hz208
 */
public class FeMessageTypeServiceMap {
	// 私有化
	private FeMessageTypeServiceMap() {

	};

	/** key msgType value:serviceName */
	private static Map<String, List<String>> serviceNameMap = new ConcurrentHashMap<String, List<String>>();
	private static FeMessageTypeServiceMap serviceMapingUtil = null;

	/**
	 * 获取对象实例
	 */
	public synchronized static FeMessageTypeServiceMap getInstance() {
		if (serviceMapingUtil == null) {
			serviceMapingUtil = new FeMessageTypeServiceMap();
		}
		return serviceMapingUtil;
	}

	/**
	 * 添加服务映射
	 * @param key	自定义名称
	 * @param value	服务名称
	 */
	public static void put(String key, String value) throws Exception {
		List<String> list = null;

		if (serviceNameMap.containsKey(key)) {
			list = serviceNameMap.get(key);
		} else {
			list = new ArrayList<String>();
			serviceNameMap.put(key, list);
		}

		if (list.contains(value)) {
			throw new Exception("服务名称[" + value + "]已存在");
		} else {
			list.add(value);
		}

//		if (!serviceNameMap.containsKey(key)) {
//			serviceNameMap.put(key, value);
//		} else {
//			throw new Exception("key 已存在");
//		}
	}

	/**
	 * 获取消息服务名称
	 */
	public synchronized List<String> getServiceNames(String msgType) {
		List<String> list = serviceNameMap.get(msgType);
		
		if (list != null) {
			
		}
		
		return serviceNameMap == null ? null : serviceNameMap.get(msgType);
	}
}
