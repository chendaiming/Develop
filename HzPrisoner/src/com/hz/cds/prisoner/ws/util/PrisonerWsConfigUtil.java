package com.hz.cds.prisoner.ws.util;

import java.util.ResourceBundle;

public class PrisonerWsConfigUtil {
	/** 资源对象 */
	private static final ResourceBundle bundle = ResourceBundle.getBundle("prisoner/prisoner-config");
	/**
	 * 通过键获取值
	 * @param key
	 * @return
	 */
	public static final String get(String key) {
		return bundle.getString(key);
	}
}
