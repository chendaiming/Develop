package com.hz.db.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.db.dao.QueryDao;
import com.hz.db.service.IQueryService;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.ReqParams;
import com.hz.db.util.ReqParamsUtil;
import com.hz.frm.util.Tools;

@Service
@Scope("prototype")
public class QueryServiceImpl extends QueryAbstractService implements IQueryService {

	// 日志记录对象
//	private static final Logger log = LoggerFactory.getLogger(QueryServiceImpl.class);

	@Resource
	private QueryDao queryDao;


	@Override
	public void setJdbc (JdbcTemplate jdbcTemplate, DataSource dataSource) {
		queryDao.setJdbc(jdbcTemplate, dataSource);
	}


	@Override
	public List<Map<String, Object>> query (JSONObject reqJSON) throws Exception {
		return query(reqJSON, ReqParamsUtil.getSql(reqJSON), ReqParamsUtil.getParams(reqJSON));
	}


	@Override
	public List<List<Map<String, Object>>> query(JSONArray reqArr) throws Exception {
		List<List<Map<String, Object>>> returnResult = new ArrayList<List<Map<String, Object>>>();
		List<Map<String, Object>> queryResult = null;

		for(int i = 0, len = reqArr.size(); i < len; i++) {
			queryResult = query(reqArr.getJSONObject(i));
			returnResult.add(queryResult);
		}

		return returnResult;
	}


	@Override
	public Map<String, Object> queryPage(JSONObject reqJSON) throws Exception {
		String minRow = reqJSON.getString(ReqParams.MINROW);	// 查询的最小行
		String maxRow = reqJSON.getString(ReqParams.MAXROW);	// 查询的最大行
		String sql = ReqParamsUtil.getSql(reqJSON);				// 原始查询的SQL
		String pageSql = null;							// 分页查询的SQL
		String countSql = null;							// 统计查询的SQL
		int countRow = 0;								// 统计查询的行数

		List<Object> pageParams = ReqParamsUtil.getParams(reqJSON);		// 分页查询请求参数
		List<Map<String, Object>> pageResult = null;					// 分页查询结果
		List<Map<String, Object>> countResult = null;					// 统计查询结果
		Map<String, Object> respJSON = null;							// 响应结果

		// 判断是否需要进行分页查询
		if (Tools.notEmpty(minRow) || Tools.notEmpty(maxRow)) {
			if (Tools.isEmpty(minRow)) minRow = "0";									// 最小值0
			if (Tools.isEmpty(maxRow)) maxRow = Tools.toStr(QueryDao.QUERY_MAX_ROWS);	// 最大值取查询默认的最大值
			if (pageParams == null) pageParams = new ArrayList<Object>();

			// 统计数据
			countSql = ReqParamsUtil.getCountSql(sql);	
			countResult = query(reqJSON, countSql, pageParams);

			if (countResult != null && countResult.size() > 0) {
				countRow = Tools.toInt(countResult.get(0).get("count"));
			}

			// 加入分页参数
			pageParams.add(maxRow);
			pageParams.add(minRow);

			// 分页查询数据
			pageSql = ReqParamsUtil.getPageSql(sql);					// 分页查询的SQL
			pageResult = query(reqJSON, pageSql, pageParams);
		} 
		else {
			// 没有分页直接查询并把查询结果集大小作为count返回
			pageResult = query(reqJSON, sql, pageParams);
			countRow = pageResult.size();
		}

		// 返回数据集
		respJSON = new LinkedHashMap<String, Object>();
		respJSON.put("count", countRow);
		respJSON.put("data", pageResult);	

		// 返回结果
		return respJSON;
	}


	@Override
	public Map<String, Object> queryMap (JSONObject reqJSON) throws Exception {
		return getFirstMap( query(reqJSON) );
	}

	@Override
	public Map<String, Object> queryMap (String sqlId, List<Object> params) throws Exception {
		return getFirstMap( query(sqlId, params) );
	}


	/*
	 * 获取结果集第一条记录
	 */
	private Map<String, Object> getFirstMap (List<Map<String,Object>> result) {
		if (result != null && result.size() > 0) {
			return result.get(0);
		}
		return null;
	}


	@Override
	public Object queryValue (JSONObject reqJSON) throws Exception {
		Map<String,Object> map = queryMap(reqJSON);
		Object[] values = null;
		Object result = null;

		if (map != null) {
			values = map.values().toArray();
			result = values != null ? values[0] : null;
		}
		return result;
	}



	/**
	 * 数据库查询
	 * @param reqJSON	请求参数
	 * @param sql		查询SQL
	 * @param params	查询参数
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> query (JSONObject reqJSON, String sql, List<Object> params) throws Exception {
		List<Map<String, Object>> result = null;

		// 查询数据库
		result = queryDao.query(sql, params);

		// 查询成功数据处理
		if (result != null)
			convert(reqJSON, result);	// 常量转换
		else
			DbCodeUtil.throwEx(DbCodeUtil.CODE_1003);	// 查询结果为NULL

		return result;
	}


	@Override
	public List<Map<String, Object>> query(String sqlId, String whereId, String orderId, List<Object> params) throws Exception {
		String sql = ReqParamsUtil.getSql(sqlId, whereId, orderId);
		JSONObject reqJSON = new JSONObject();
		
		reqJSON.put(ReqParams.SQL_ID, sqlId);
		reqJSON.put(ReqParams.WHERE_ID, whereId);
		reqJSON.put(ReqParams.ORDER_ID, orderId);
		reqJSON.put(ReqParams.PARAMS, params);

		return query(reqJSON, sql, params);
	}


	@Override
	public List<Map<String, Object>> query(String sqlId, String whereId, List<Object> params) throws Exception {
		return query(sqlId, whereId, null, params);
	}


	@Override
	public List<Map<String, Object>> query(String sqlId, List<Object> params) throws Exception {
		return query(sqlId, null, null, params);
	}


	@Override
	public Map<String, Object> queryPage(String sqlId, String whereId, String orderId, List<Object> params, int minRow, int maxRow) throws Exception {
		JSONObject reqJSON = new JSONObject();
		
		reqJSON.put(ReqParams.SQL_ID, sqlId);
		reqJSON.put(ReqParams.WHERE_ID, whereId);
		reqJSON.put(ReqParams.ORDER_ID, orderId);
		reqJSON.put(ReqParams.PARAMS, params);
		reqJSON.put(ReqParams.MINROW, minRow);
		reqJSON.put(ReqParams.MAXROW, maxRow);
		
		return queryPage(reqJSON);
	}


	@Override
	public Map<String, Object> queryPage(String sqlId, String whereId, List<Object> params, int minRow, int maxRow) throws Exception {
		return queryPage(sqlId, whereId, null, params, minRow, maxRow);
	}


	@Override
	public Map<String, Object> queryPage(String sqlId, List<Object> params, int minRow, int maxRow) throws Exception {
		return queryPage(sqlId, null, null, params, minRow, maxRow);
	}
}
