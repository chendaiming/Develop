package com.hz.cds.alarm.extend.impl;

import java.util.LinkedHashMap;
import java.util.Map;

import com.hz.cds.alarm.extend.IAlarmExtendService;


public abstract class AlarmExtendService implements IAlarmExtendService {

	// 服务映射列表
	private static Map<String, IAlarmExtendService> serviceMap = new LinkedHashMap<String, IAlarmExtendService>();


	/**
	 * 注册服务
	 * @param type	报警类型（设备类型）
	 * @param service	服务对象
	 * @throws Exception
	 */
	protected void register (String type, IAlarmExtendService service) {
		if(!serviceMap.containsKey(type))
			serviceMap.put(type, service);
		else
			new Exception("类型[" + type + "]的服务已存在!");
	};


	/**
	 * 获取服务映射对象
	 * @return
	 */
	public Map<String, IAlarmExtendService> getServiceMap () {
		return serviceMap;
	}
}
