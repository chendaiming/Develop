package com.hz.db.service;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface IQueryByParamKeyService {
	// ===============================【参数说明】=============================
	// sqlId: 执行的SQL语句编号（必填）
	// whereId: 执行的SQL语句的条件编号（可选）
	// orderId: 执行的SQL语句的排序编号（可选）
	// params: SQL参数集合（可选），格式：{}
	// minRow: 分页查询的最小行（可选，minRow和maxRow都没有时不分页）
	// maxRow: 分页查询的最大行（可选，minRow和maxRow都没有时不分页）

	/**
	 * 设置连接的JDBC
	 * @param jdbcTemplate
	 * @param dataSource
	 */
	public void setJdbc(JdbcTemplate jdbcTemplate, DataSource dataSource);


	/**
	 * 数据库通用查询
	 * @param reqJSON 请求数据结构：{"sqlId":"", "whereId":"", "orderId":"", "params":{}}
	 * @return [{}]
	 */
	public List<Map<String, Object>> query (JSONObject reqJSON) throws Exception;

	/**
	 * 数据库通用查询
	 * @param reqJSON 请求数据结构：{"sqlId":"", "whereId":"", "orderId":"", "params":{}}
	 * @return [[{}]]
	 */
	public List<List<Map<String, Object>>> query (JSONArray reqArr) throws Exception;


	public List<Map<String, Object>> query (String sqlId, String whereId, String orderId, JSONObject params) throws Exception;


	public List<Map<String, Object>> query (String sqlId, String whereId, JSONObject params) throws Exception;


	public List<Map<String, Object>> query (String sqlId, JSONObject params) throws Exception;


	

	/**
	 * 数据库通用查询（分页查询）
	 * @param reqJSON 请求数据结构：{"sqlId":"", "whereId":"", "orderId":"", "params":{}, "minRow":"", "maxRow":""}
	 * @return {"count":"", "data": [{}]}
	 */
	public Map<String, Object> queryPaging (JSONObject reqJSON) throws Exception;
}
