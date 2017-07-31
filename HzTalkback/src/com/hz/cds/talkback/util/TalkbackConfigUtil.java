package com.hz.cds.talkback.util;

import java.util.ResourceBundle;

/**
 * 项目参数工具类
 * @author zhongxy
 */
public class TalkbackConfigUtil {
	/** 资源对象 */
	private static final ResourceBundle bundle = ResourceBundle.getBundle("talkback/talkback-config");
	/**
	 * 通过键获取值
	 * @param key
	 * @return
	 */
	public static final String get(String key) {
		return bundle.getString(key);
	}
}
