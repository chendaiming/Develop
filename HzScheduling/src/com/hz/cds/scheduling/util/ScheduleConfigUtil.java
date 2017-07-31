package com.hz.cds.scheduling.util;

import java.util.ResourceBundle;

/**
 * 项目参数工具类
 * @author zhongxy
 */
public class ScheduleConfigUtil {
	/** 资源对象 */
	private static final ResourceBundle bundle = ResourceBundle.getBundle("scheduling/scheduling-config");
	/**
	 * 通过键获取值
	 * @param key
	 * @return
	 */
	public static final String get(String key) {
		return bundle.getString(key);
	}
}
