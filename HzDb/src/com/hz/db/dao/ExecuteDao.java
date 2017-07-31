package com.hz.db.dao;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@Scope("prototype")
public class ExecuteDao {

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
	 * 获取连接的JDBC
	 * @param jdbcTemplate
	 * @param dataSource
	 */
	public JdbcDAO getJdbc() {
		return jdbcDAO;
	}
	
	/**
	 * 数据库存储过程处理
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 * @param packageName	命名空间
	 * @param hasReturn		是否有返回值
	 */
	public Map<String, Object> procedure (String procedureName, List<Object> params, String packageName, boolean hasReturn) throws Exception {
		return jdbcDAO.executeProcedure(hasReturn, packageName, procedureName, params.toArray());
	}


	/**
	 * 数据库存储过程处理（带返回值）
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 * @param packageName	命名空间
	 */
	public Map<String, Object> procedure (String procedureName, List<Object> params, String packageName) throws Exception {
		return procedure(procedureName, params, packageName, true);
	}


	/**
	 * 数据库存储过程处理（不带返回值）
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 * @param packageName	命名空间
	 */
	public void procedureNoReturn (String procedureName, List<Object> params, String packageName) throws Exception {
		procedure(procedureName, params, packageName, false);
	}


	/**
	 * 数据库存储过程处理
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 * @param hasReturn		是否有返回值
	 */
	public Map<String, Object> procedure (String procedureName, List<Object> params, boolean hasReturn) throws Exception {
		return procedure(procedureName, params, null, hasReturn);
	}


	/**
	 * 数据库存储过程处理（带返回值）
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 */
	public Map<String, Object> procedure (String procedureName, List<Object> params) throws Exception {
		return procedure(procedureName, params, null, true);
	}


	/**
	 * 数据库存储过程处理（不带返回值）
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 */
	public void procedureNoReturn (String procedureName, List<Object> params) throws Exception {
		procedure(procedureName, params, null, false);
	}

	/**
	 * 数据库存储过程处理
	 * @param procedureName	存储过程名称
	 * @param hasReturn		是否有返回值
	 * @param args			任意多的参数
	 */
	public Map<String, Object> procedure (String procedureName, boolean hasReturn, Object...args) throws Exception {
		return jdbcDAO.executeProcedure(hasReturn, null, procedureName, args);
	}



	/**
	 * 数据库存储过程处理
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 * @param packageName	命名空间
	 */
	public Map<String, Object> procedure (String procedureName, Map<String, Object> params, String packageName, boolean hasReturn) throws Exception {
		return jdbcDAO.executeProcedure(hasReturn, packageName, procedureName, params);
	}

	/**
	 * 数据库存储过程处理
	 * @param procedureName	存储过程名称
	 * @param params		存储过程参数
	 */
	public  Map<String, Object> procedure (String procedureName, Map<String, Object> params, boolean hasReturn) throws Exception {
		return procedure(procedureName, params, null, hasReturn);
	}

	/**
	 * 数据库存储过程处理
	 * @param procedureName	存储过程名称
	 */
	public  Map<String, Object> procedure (String procedureName) throws Exception {
		return procedure(procedureName, new LinkedHashMap<String, Object>(), null, false);
	}


	/**
	 * 数据库函数处理
	 */
	public <T> T function (Class<T> returnType, String functionName, Object... params) throws Exception {
		return jdbcDAO.executeFunction(returnType, functionName, params);
	}
}
