package com.hz.db.service;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface IQueryService {
	// ===============================【参数说明】=============================
	// sql: 执行的SQL语句（sql和sqlId必选其一，优先选择sql）
	// sqlId: 执行的SQL语句编号（sql和sqlId必选其一，优先选择sql）
	// whereId: 执行的SQL语句的条件编号（和sqlId一起使用，可选）
	// orderId: 执行的SQL语句的排序编号（和sqlId一起使用，可选）
	// params: SQL参数集合（可选）
	// minRow: 分页查询的最小行
	// maxRow: 分页查询的最大行

	/**
	 * 设置连接的JDBC
	 * @param jdbcTemplate
	 * @param dataSource
	 */
	public void setJdbc(JdbcTemplate jdbcTemplate, DataSource dataSource);

	/**
	 * 数据库查询
	 * @param reqJSON 请求数据结构：{"sqlId":"", "whereId":"", "orderId":"", "params":[]}
	 * @return
	 */
	public List<Map<String, Object>> query (JSONObject reqJSON) throws Exception;


	/**
	 * 数据库查询（批量查询）
	 * @param reqArr 请求数据结构：[{"sqlId":"", "whereId":"", "orderId":"", "params":[]}]
	 * @return
	 */
	public List<List<Map<String, Object>>> query (JSONArray reqArr) throws Exception;


	/**
	 * 数据库分页查询
	 * @param reqJSON 请求数据结构：{"sqlId":"", "whereId":"", "orderId":"", "params":[], "minRow":"", "maxRow":""}
	 * @return {"count":"", "data": [{}]}
	 */
	public Map<String, Object> queryPage (JSONObject reqJSON) throws Exception;


	/**
	 * 单条数据查询
	 * @param reqJSON 请求数据结构：{"sqlId":"", "whereId":"", "orderId":"", "params":[]}
	 * @return
	 */
	public Map<String, Object> queryMap (JSONObject reqJSON) throws Exception;


	/**
	 * 单个值查询
	 * @param reqJSON 请求数据结构：{"sqlId":"", "whereId":"", "orderId":"", "params":[]}
	 * @return
	 */
	public Object queryValue (JSONObject reqJSON) throws Exception;



	public List<Map<String, Object>> query (String sqlId, String whereId, String orderId, List<Object> params) throws Exception;

	public List<Map<String, Object>> query (String sqlId, String whereId, List<Object> params) throws Exception;

	public List<Map<String, Object>> query (String sqlId, List<Object> params) throws Exception;


	public Map<String, Object> queryPage (String sqlId, String whereId, String orderId, List<Object> params, int minRow, int maxRow) throws Exception;

	public Map<String, Object> queryPage (String sqlId, String whereId, List<Object> params, int minRow, int maxRow) throws Exception;

	public Map<String, Object> queryPage (String sqlId, List<Object> params, int minRow, int maxRow) throws Exception;


	public Map<String, Object> queryMap (String sqlId, List<Object> params) throws Exception;
}
