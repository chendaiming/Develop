package com.hz.frm.util;

import java.util.ResourceBundle;

/**
 * 项目参数工具类
 * @author zhongxy
 */
public class ConfigUtil {
	/** 登录模式 */
	public static final String USER_LOGIN_MODEL = "USER_LOGIN_MODEL";

	/** 系统管理平台的系统码 **/
	public static final String AUTH_SYSTEM_CODE = "AUTH_SYSTEM_CODE";

	/** 系统管理平台的根组织机构编码（省局）*/
	public static final String AUTH_SYSTEM_BASE_ORG_CODE = "AUTH_SYSTEM_BASE_ORG_CODE";

	/** 数据库插入CLOB类型数据的编码格式 */
	public static final String CLOB_CHARSET = "CLOB_CHARSET";

	/** 视频客户端默认云控制服务的IP地址 */
	public static final String VIDEOCLIENT_DEF_CONTORL_ADDR = "VIDEOCLIENT.DEF.CONTORL.ADDR";
	
	/** 视频客户端默认截图路径 */
	public static final String VIDEOCLIENT_DEF_SNAPPATH = "VIDEOCLIENT.DEF.SNAPPATH";

	/** 视频客户端默认录像路径 */
	public static final String VIDEOCLIENT_DEF_RECORDPATH = "VIDEOCLIENT.DEF.RECORDPATH";

	/** 视频客户端默认宽度 */
	public static final String VIDEOCLIENT_DEF_WIDTH = "VIDEOCLIENT.DEF.WIDTH";

	/** 视频客户端默认高度 */
	public static final String VIDEOCLIENT_DEF_HEIGHT = "VIDEOCLIENT.DEF.HEIGHT";

	/** 视频客户端默认X坐标 */
	public static final String VIDEOCLIENT_DEF_X = "VIDEOCLIENT.DEF.X";

	/** 视频客户端默认Y坐标 */
	public static final String VIDEOCLIENT_DEF_Y = "VIDEOCLIENT.DEF.Y";

	/** 视频客户端最大布局 */
	public static final String VIDEOCLIENT_MAX_LAYOUT = "VIDEOCLIENT.MAX.LAYOUT";
	
	/** 资源对象 */
	private static final ResourceBundle bundle = ResourceBundle.getBundle("system-config");

	/**
	 * 获得sessionInfo名字
	 * @return
	 */
	public static final String getSessionInfoName() {
		return bundle.getString("sessionInfoName");
	}

	/**
	 * 通过键获取值
	 * @param key
	 * @return
	 */
	public static final String get(String key) {
		return bundle.getString(key);
	}

}
