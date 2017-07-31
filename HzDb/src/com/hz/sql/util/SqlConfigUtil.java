package com.hz.sql.util;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.Tools;
import com.hz.sql.bean.SqlConfigBean;

public class SqlConfigUtil {
	// 日志输出
	private final static Logger log = LoggerFactory.getLogger(SqlConfigUtil.class);

	// SQL配置的缓存标识
	private static final String CACHE_KEY = "SQL_CONFIG";

	/**
	 * 存放SQL配置
	 * @param configBean
	 */
	public static void put (SqlConfigBean configBean) {
		String key = configBean.getSqlId();
		String value = JSON.toJSONString(configBean);
		RedisUtil.putHash(CACHE_KEY, key, value);
	}

	/**
	 * 获取SQL配置
	 * @param sqlId
	 */
	public static SqlConfigBean getConfig (JSONObject reqJSON) {
		return getConfig(reqJSON.getString(ReqParams.SQL_ID));
	}

	/**
	 * 根据SQL编号获取SQL配置
	 * @param sqlId
	 */
	public static SqlConfigBean getConfig (String sqlId) {
		String str = (String) RedisUtil.getObject(CACHE_KEY, sqlId);
		return Tools.notEmpty(str) ? JSON.parseObject(str, SqlConfigBean.class) : null;
	}

	/**
	 * 获取SQL语句
	 */
	public static String getSql (JSONObject reqJSON) {
		String sql = null;

		try {
			// 请求参数
			String sqlId = Tools.toStr(reqJSON.get(ReqParams.SQL_ID));
			String whereId = Tools.toStr(reqJSON.get(ReqParams.WHERE_ID));
			String orderId = Tools.toStr(reqJSON.get(ReqParams.ORDER_ID));
			sql = getSql(sqlId, whereId, orderId);
		} catch (Exception e) {
			log.error("SQL语句转换服务 --> 获取SQL配置失败：" + e.getMessage());
			log.error("SQL语句转换服务 --> 获取SQL配置的请求参数：<" + reqJSON.toJSONString() + ">");
		}

		return sql;
	}

	/**
	 * 获取SQL语句
	 */
	public static String getSql (String sqlId) {
		return getSql(sqlId, null, null);
	}

	/**
	 * 获取SQL语句
	 */
	public static String getSql (String sqlId, String whereId) {
		return getSql(sqlId, whereId, null);
	}

	/**
	 * 获取SQL语句
	 */
	public static String getSql (String sqlId, String whereId, String orderId) {
		String sql = null;

		try {
			// 获取SQL配置信息
			SqlConfigBean configBean = getConfig(sqlId);

			// 组装SQL
			if (configBean != null) {
				sql = configBean.getSqlBody();
				sql += join(configBean.getWhereMap(), whereId);
				sql += join(configBean.getOrderMap(), orderId);
			} else {
				log.error("SQL语句转换服务 --> 未获取到SQL配置，sqlId=" + sqlId);
			}
		} catch (Exception e) {
			log.error("SQL语句转换服务 --> 获取SQL配置失败：" + e.getMessage());
			log.error("SQL语句转换服务 --> 请求参数：sqlId=" + sqlId);
		}

		return sql;
	}
	
	/**
	 * 拼接SQL
	 * @param map 
	 * @param key
	 * @return
	 */
	private static String join (Map<String, String> map, String key) {
		if (Tools.notEmpty(key)) {
			key = map.get(key);

			if (Tools.notEmpty(key)) {
				return " " + key + " ";
			}
		}
		return "";
	}
}
