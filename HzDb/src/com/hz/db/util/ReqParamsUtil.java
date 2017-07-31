package com.hz.db.util;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.frm.util.Tools;
import com.hz.sql.util.SqlConfigUtil;

/**
 * 参数处理基础类（处理请求数据）
 * @author xie.yh
 */
public class ReqParamsUtil {

	// 分页查询的SQL体
	private static final String QUERY_PAGE = "SELECT tt.* FROM (SELECT ROWNUM rn, t.* FROM ({SQL}) t WHERE ROWNUM <= ?) tt WHERE tt.rn > ?";
	private static final String QUERY_COUNT = "SELECT COUNT(0) COUNT ";
//	private static final String[] strs = new String[]{" ", ",", ")", "\n", "\t"};
//	private static final String[] notFilters = new String[]{":MI", ":SS"};

	/**
	 * 获取SQL语句
	 * @param reqJSON
	 * @return
	 */
	public static String getSql (JSONObject reqJSON) throws Exception {
		String sql = (String) reqJSON.get(ReqParams.SQL);

		// 检查SQL
		if (Tools.isEmpty(sql)) {
			sql = SqlConfigUtil.getSql(reqJSON);
		} else {
			DbCodeUtil.throwEx("-1", "暂未开放直接传入SQL语句");
		}

		// SQL为空抱出异常
		if (Tools.isEmpty(sql))
			DbCodeUtil.throwEx(DbCodeUtil.CODE_1001);

		return sql;
	}

	/**
	 * 获取SQL语句
	 * @param reqJSON
	 * @return
	 */
	public static String getSql (String sqlId, String whereId, String orderid) throws Exception {
		String sql = SqlConfigUtil.getSql(sqlId, whereId, orderid);

		// SQL为空抱出异常
		if (Tools.isEmpty(sql))
			DbCodeUtil.throwEx(DbCodeUtil.CODE_1001, "sqlid '" + sqlId + "' 无效!");

		return sql;
	}

	/**
	 * 获取分页查询的SQL
	 * @param reqJSON	查询请求参数
	 * @param sql		查询的SQL（没有则通过reqJSON去获取）
	 * @return
	 */
	public static String getPageSql (String sql) throws Exception {
		return QUERY_PAGE.replace("{SQL}", sql);
	}


	/**
	 * 获取统计查询的SQL
	 * @param reqJSON	查询请求参数
	 * @param sql		查询的SQL（没有则通过reqJSON去获取）
	 * @return
	 */
	public static String getCountSql (String sql) throws Exception {
		// 将sql字符串转换成大写之后获取第一个"FROM"字符串的索引位置并获取它后面的所有字符串

		// 情况一：SELECT ... FROM 之间套SELECT ... FROM
		// 情况二：SELECT ... FROM 之后有GROUP BY 语句

		return QUERY_COUNT.concat(sql.substring(sql.toUpperCase().indexOf("FROM")));
	}


	/**
	 * 获取请求参数（内部整合序列号）
	 * @param reqJSON
	 * @return
	 */
	public static List<Object> getParams (JSONObject reqJSON) throws Exception {
		return getParams(reqJSON, false);
	}


	/**
	 * 获取请求参数（内部整合序列号）
	 * @param reqJSON	请求参数
	 * @param isClone	是否克隆
	 * @return
	 */
	public static List<Object> getParams (JSONObject reqJSON, Boolean isClone) throws Exception {
		JSONArray paramsJSON = reqJSON.getJSONArray(ReqParams.PARAMS); 
		if (paramsJSON != null)
			return isClone ? JSON.parseArray(paramsJSON.toJSONString()) : paramsJSON;
		else
			return null;
	}


	/**
	 * 获取请求参数
	 * @param reqJSON
	 * @return
	 */
	public static JSONObject getParamsType (JSONObject reqJSON) {
		return reqJSON.getJSONObject(ReqParams.PARAMS_TYPE);
	}


	/**
	 * 获取请求参数
	 * @param reqJSON
	 * @return
	 */
	public static List<Object[]> getParamsList (JSONObject reqJSON) {
		JSONArray paramsListJSON = reqJSON.getJSONArray(ReqParams.PARAMS);
		if (paramsListJSON != null)
			return JSON.parseArray(paramsListJSON.toJSONString(), Object[].class);
		else
			return null;
	}


	/**
	 * 获取MAP格式的请求参数
	 * @param reqJSON
	 * @return
	 */
	public static Map<String, Object> getParamMap (JSONObject reqJSON) {
		return reqJSON.getJSONObject(ReqParams.PARAMS);
	}


	/**
	 * 获取MAP格式的请求参数
	 * @param reqJSON
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<Map<String, Object>> getParamMaps (JSONObject reqJSON) {
		List<Map<String, Object>> paramMap = new ArrayList<Map<String, Object>>();
		JSONArray paramsListJSON = reqJSON.getJSONArray(ReqParams.PARAMS);

		if (paramsListJSON != null)
			return JSONObject.parseObject(paramsListJSON.toJSONString(), paramMap.getClass());
		else
			return null;
	}


	/**
	 * 检查SQL语句常数是否匹配
	 * @param sql
	 * @param list
	 * @return
	 */
	public static void checkParams (String sql, List<Object> params) throws Exception {
		if (params == null)
			params = new ArrayList<Object>();
		checkParams(sql, params.toArray());
	}


	/**
	 * 检查SQL语句常数是否匹配
	 * @param sql
	 * @param list
	 * @return
	 */
	public static void checkParams (String sql, Object[] params) throws Exception {
		if (params == null)
			params = new Object[0];

		int sqlCount = sql.length() - sql.replace("?", "").length();
		int paramsCount = params.length;

		if (sqlCount != paramsCount) {
			// 数据库参数不匹配，目标参数<?>个，实际参数<?>
			DbCodeUtil.throwEx(DbCodeUtil.CODE_0003, "数据参数不匹配，目标参数<{}>个，实际参数<{}>个", sqlCount, paramsCount);
		}
	}


	/**
	 * 检查SQL语句常数是否匹配
	 * @param sql
	 * @param list
	 * @return
	 */
	public static void checkParams (String sql, Map<String, Object> params) throws Exception {
		if (params == null) 
			params = new LinkedHashMap<String, Object>();
		checkParamKeys(sql, params);
	}


	/**
	 * 
	 */
	public synchronized static void checkParamKeys(String sql, Map<String, Object> params) throws Exception {
//		int index = sql.indexOf(":");
//		if (index > -1) {
//			sql = sql.substring(index);
//
//			int index0 = sql.length();
//			int index1 = 0;
//			for(String str : strs) {
//				index1 = sql.indexOf(str);
//				if (index1 > 0)
//					index0 = Math.min(index0, index1);
//			}
//
//			String key = sql.substring(1, index0).trim();
//			if (Tools.notEmpty(key)) {
//				if (params.containsKey(key)) {
//					if (index > -1) {
//						checkParamKeys(sql.substring(index0), params);
//					}
//				} else {
//					DbCodeUtil.throwEx(DbCodeUtil.CODE_0003, "数据参数不匹配，找不到<{}>参数", key);
//				}
//			}
//		}
	}
}
