package com.hz.db.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hz.db.util.ReqParamsUtil;


/**
 * 数据库查询操作的DAO类
 * @author xie.yh 2016.08.17
 */
@Repository
@Scope("prototype")
public class QueryDao {

	// 数据查询的最大行数
	public static final int QUERY_MAX_ROWS = 100000;

	@Resource
	private JdbcDAO jdbcDAO;


	/**
	 * 设置连接的JDBC
	 * @param jdbcTemplate
	 * @param dataSource
	 */
	public void setJdbc(JdbcTemplate jdbcTemplate, DataSource dataSource) {
		jdbcDAO.setJdbc(jdbcTemplate, dataSource);
	}


	/**
	 * 查询数据
	 * @param sql		查询语句
	 * @return
	 */
	public List<Map<String, Object>> query (String sql) throws Exception {
		return query(sql, null);
	}


	/**
	 * 查询数据
	 * @param sql		查询语句
	 * @param params	查询条件
	 * @return
	 */
	public List<Map<String, Object>> query (String sql, List<Object> params) throws Exception {
		ReqParamsUtil.checkParams(sql, params);
		return jdbcDAO.query(QUERY_MAX_ROWS, sql, params != null ? params.toArray() : null);
	}


	/**
	 * 查询数据
	 * @param sql		查询语句
	 * @param params	查询条件
	 * @return
	 */
	public List<Map<String, Object>> queryByParamKey (String sql, Map<String, Object> params) throws Exception {
		ReqParamsUtil.checkParams(sql, params);
		return jdbcDAO.queryByParamKey(sql, params);
	}


	/**
	 * 获取序列号
	 * @param seqName 序列号名称
	 * @return
	 */
	public String querySequence(String seqName)  throws Exception {
		String sql = "SELECT " + seqName + ".NEXTVAL SEQ FROM DUAL";
		List<Map<String, Object>> rtnList = jdbcDAO.query(1, sql);
		if (rtnList != null && rtnList.size() > 0) {
			return rtnList.get(0).get("SEQ").toString();
		}
		return "";
	}
}
