package com.hz.db.service;

import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.db.bean.UpdateResp;

public interface IUpdateService {
	// ===============================【参数说明】=============================
	// sql: 执行的SQL语句（sql和sqlId必选其一，优先选择sql）
	// sqlId: 执行的SQL语句编号（sql和sqlId必选其一，优先选择sql）
	// whereId: 执行的SQL语句的条件编号（和sqlId一起使用，可选）
	// orderId: 执行的SQL语句的排序编号（和sqlId一起使用，可选）
	// params: SQL参数集合，格式：[[]]
	// paramsClass: 类型：listMap, map, listList, list
	// paramsType: SQL参数类型，格式{"index":"type"}（和params一起使用，可选）
	// 		index：params中参数在集合中的索引值
	// 		 type: params中参数的数据类型，当类型是CLOB、BLOB数据类型的需要指定，其它类型暂时不需要

	/**
	 * 设置连接的JDBC
	 * @param jdbcTemplate
	 * @param dataSource
	 */
	public void setJdbc(JdbcTemplate jdbcTemplate, DataSource dataSource);


	/**
	 * 数据库新增、删除、更新操作
	 * @param reqJSON 请求数据结构：{"sql":"", "sqlId":"", "whereId":"", "params":[[]], "paramsType":{"index":"type"}}
	 * @return
	 */
	public UpdateResp update (JSONObject reqJSON) throws Exception;


	/**
	 * 数据库新增、删除、更新操作
	 * @param sqlId		SQL编号
	 * @param whereId	条件编号
	 * @param params	请求参数
	 * @param parasType 请求参数类型{"index":"type"}
	 * @return
	 * @throws Exception
	 */
	public UpdateResp update (String sqlId, String whereId, JSONArray paramsList, JSONObject parasType) throws Exception;


	/**
	 * 数据库新增、删除、更新操作
	 * @param sqlId
	 * @param params
	 * @param parasType
	 * @return
	 * @throws Exception
	 */
	public UpdateResp update (String sqlId, JSONArray paramsList, JSONObject parasType) throws Exception;


	/**
	 * 数据库新增、删除、更新操作
	 * @param sqlId
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public UpdateResp update (String sqlId, List<Object> params) throws Exception;


	/**
	 * 数据库新增、删除、更新操作
	 * @param sqlId		SQL编号
	 * @param whereId	条件编号
	 * @param params	请求参数
	 * @param parasType 请求参数类型{"index":"type"}
	 * @return
	 * @throws Exception
	 */
	public UpdateResp update (JSONArray paramsList, String sqlId, String whereId, JSONObject parasType) throws Exception;


	/**
	 * 数据库新增、删除、更新操作
	 * @param sqlId
	 * @param params
	 * @param parasType
	 * @return
	 * @throws Exception
	 */
	public UpdateResp update (JSONArray paramsList, String sqlId, JSONObject parasType) throws Exception;


	/**
	 * 数据库新增、删除、更新批量操作（事务处理）
	 * @param reqArray 请求数据结构：[{"sql":"", "sqlId":"", "whereId":"", "orderId":"", "params":[[]], "paramsType":{"index":"type"}}]
	 * @return
	 */
	public UpdateResp update (JSONArray reqArray) throws Exception;


	/**
	 * 数据库新增、删除、更新批量操作
	 * @param reqArray 请求数据结构：{"sql":"", "sqlId":"", "whereId":"", "orderId":"", "params":[{}]}
	 * @return
	 */
	public UpdateResp updateByParamKey (JSONObject reqJSON) throws Exception;


	/**
	 * 数据库新增、删除、更新批量操作
	 * @param sqlId
	 * @param whereId
	 * @param paramsList
	 * @return
	 * @throws Exception
	 */
	public UpdateResp updateByParamKey (String sqlId, String whereId, JSONArray paramsList) throws Exception;


	/**
	 * 数据库新增、删除、更新批量操作
	 * @param sqlId
	 * @param whereId
	 * @param paramsList
	 * @return
	 * @throws Exception
	 */
	public UpdateResp updateByParamKey (String sqlId, String whereId, JSONObject paramsList) throws Exception;


	/**
	 * 数据库新增、删除、更新批量操作
	 * @param sqlId
	 * @param paramsList
	 * @return
	 * @throws Exception
	 */
	public UpdateResp updateByParamKey (String sqlId, JSONArray paramsList) throws Exception;


	/**
	 * 数据库新增、删除、更新批量操作
	 * @param sqlId
	 * @param paramsList
	 * @return
	 * @throws Exception
	 */
	public UpdateResp updateByParamKey (String sqlId, JSONObject params) throws Exception;


	/**
	 * 数据库新增、删除、更新批量操作
	 * @param reqArray 请求数据结构：[{"sql":"", "sqlId":"", "whereId":"", "orderId":"", "params":[{}]]
	 * @return
	 */
	public UpdateResp updateByParamKey (JSONArray reqArray) throws Exception;
}
