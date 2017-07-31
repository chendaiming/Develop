package com.hz.db.dao;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
/**
 * 数据库操作类
 * @author zhongxy
 */
@Repository
@Scope("prototype")
public class JdbcDAO {

	// the default JdbcTemplate. if u want change the property of JdbcTemplate,
	// create a new JdbcTemplate from DataSource.
	private static final Logger logger = LoggerFactory.getLogger(JdbcDAO.class);

	@Resource
	private JdbcTemplate jdbcTemplate;

	@Resource
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Resource
	private DataSource dataSource;


	public void setJdbc(JdbcTemplate jdbcTemplate, DataSource dataSource) {
		this.jdbcTemplate = jdbcTemplate;
		this.dataSource = dataSource;
	}

	@Autowired
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}

	public DataSource getDataSource(){
		return this.dataSource;
	}

	public JdbcTemplate getJdbcTemplate () {
		return jdbcTemplate;
	}

	
	
	/**
	 * batch update, insert and delete
	 * @param sql
	 *            a single sql command
	 * @param batchArgs
	 *            the binding params
	 * @return
	 */
	public int[] batchUpdate(String sql, List<Object[]> batchArgs) {
		return jdbcTemplate.batchUpdate(sql, batchArgs);
	}

	private SimpleJdbcCall createJdbcCallForFunction(String pacakgeName, String functionName) {
		// the jdbcTemplate is a default object, so you could not change it
		JdbcTemplate myJdbcTemplate = new JdbcTemplate(dataSource);
		myJdbcTemplate.setResultsMapCaseInsensitive(true);

		return new SimpleJdbcCall(myJdbcTemplate).withCatalogName(pacakgeName).withFunctionName(functionName);
	}

	private SimpleJdbcCall createJdbcCallForProcedure(String pacakgeName, String procedureName) {
		// the jdbcTemplate is a default object, so you could not change it
		JdbcTemplate myJdbcTemplate = new JdbcTemplate(dataSource);
		myJdbcTemplate.setResultsMapCaseInsensitive(true);

		return new SimpleJdbcCall(myJdbcTemplate).withCatalogName(pacakgeName).withProcedureName(procedureName);
	}

	public int[] executeBatchInsert(String tableName, List<Map<String, Object>> args) {
		return executeBatchInsert(null, tableName, args);
	}

	/**
	 * batch insert
	 * @param schemaName
	 *            if null,use defalut schema
	 * @param tableName
	 * @param args
	 *            a list of Map containing column names and corresponding value
	 * @return
	 */
	public int[] executeBatchInsert(String schemaName, String tableName, List<Map<String, Object>> args) {
		SimpleJdbcInsert insert = new SimpleJdbcInsert(dataSource).withSchemaName(schemaName).withTableName(tableName);
		@SuppressWarnings("unchecked")
		Map<String, Object> list[] = new HashMap[args.size()];
		return insert.executeBatch(args.toArray(list));
	}

	public <T> T executeFunction(Class<T> returnType, String functionName, Map<String, ?> params) {
		return executeFunction(returnType, null, functionName, params);
	}

	public <T> T executeFunction(Class<T> returnType, String functionName, Object... args) {
		return executeFunction(returnType, null, functionName, args);
	}

	/**
	 * execute a stored function
	 * @param returnType
	 *            返回值的类型
	 * @param pacakgeName
	 *            if null or "", the function is out of any package
	 * @param functionName
	 * @param params
	 *            Map containing the parameter values to be used in the call.
	 *            键�?是存储过程的入参�? * @return
	 */
	public <T> T executeFunction(Class<T> returnType, String pacakgeName, String functionName, Map<String, ?> params) {
		SimpleJdbcCall jdbcCall = createJdbcCallForFunction(pacakgeName, functionName);

		return null == params ? jdbcCall.executeFunction(returnType) : jdbcCall.executeFunction(returnType, params);
	}

	/**
	 * execute a stored function
	 * @param returnType
	 *            返回值的类型
	 * @param pacakgeName
	 *            if null or "", the function is out of any package
	 * @param functionName
	 * @param args
	 *            optional array containing the in parameter values to be used
	 *            in the call. Parameter values must be provided in the same
	 *            order as the parameters are defined for the stored procedure.
	 * @return 存储函数的返回�?
	 */
	public <T> T executeFunction(Class<T> returnType, String pacakgeName, String functionName, Object... args) {
		SimpleJdbcCall jdbcCall = createJdbcCallForFunction(pacakgeName, functionName);

		return jdbcCall.executeFunction(returnType, args);
	}

	public int executeInsert(String tableName, Map<String, Object> args) {
		return executeInsert(null, tableName, args);
	}

	/**
	 * execute an insert command
	 * @param schemaName
	 *            if null,use defalut schema
	 * @param tableName
	 * @param args
	 *            Map containing column names and corresponding value
	 * @return the number of rows affected as returned by the JDBC driver
	 */
	public int executeInsert(String schemaName, String tableName, Map<String, Object> args) {
		SimpleJdbcInsert insert = new SimpleJdbcInsert(dataSource).withSchemaName(schemaName).withTableName(tableName);
		return insert.execute(args);
	}

	public Number executeInsertAndReturnKey(String tableName, Map<String, Object> args, String generateKey) {
		return executeInsertAndReturnKey(null, tableName, args, generateKey);
	}

	/**
	 * execute an insert command
	 * @param schemaName
	 *            if null,use defalut schema
	 * @param tableName
	 * @param args
	 *            Map containing column names and corresponding value
	 * @param generateKey
	 *            the generated key column's name
	 * @return the generated key value
	 */
	public Number executeInsertAndReturnKey(String schemaName, String tableName, Map<String, Object> args,
			String generateKey) {
		SimpleJdbcInsert insert = new SimpleJdbcInsert(dataSource).withSchemaName(schemaName).withTableName(tableName)
				.usingGeneratedKeyColumns(generateKey);
		return insert.executeAndReturnKey(args);
	}

	public KeyHolder executeInsertAndReturnKeys(String tableName, Map<String, Object> args, String... generateKeys) {
		return executeInsertAndReturnKeys(null, tableName, args, generateKeys);
	}

	/**
	 * execute an insert command
	 * @param schemaName
	 * @param tableName
	 * @param args
	 *            Map containing column names and corresponding value
	 * @param generateKeys
	 *            the generated key columns' name
	 * @return the generated key values
	 */
	public KeyHolder executeInsertAndReturnKeys(String schemaName, String tableName, Map<String, Object> args,
			String... generateKeys) {
		SimpleJdbcInsert insert = new SimpleJdbcInsert(dataSource).withSchemaName(schemaName).withTableName(tableName)
				.usingGeneratedKeyColumns(generateKeys);
		return insert.executeAndReturnKeyHolder(args);
	}

	public Map<String, Object> executeProcedure(boolean withReturnValue, String procedureName,
			Map<String, Object> params) {
		return executeProcedure(withReturnValue, null, procedureName, params);
	}

	public Map<String, Object> executeProcedure(boolean withReturnValue, String procedureName, Object... args) {
		return executeProcedure(withReturnValue, null, procedureName, args);
	}

	/**
	 * execute a stored function or procedure
	 * <p>
	 * 如果函数也有出参，应该用本方法�?
	 * @param withReturnValue
	 *            include function or procedure's return value
	 * @param pacakgeName
	 *            如果存储过程不在包内，可以为null�?"
	 * @param procedureName
	 * @param params
	 *            Map containing the parameter values to be used in the call.
	 *            键�?是存储过程的入参�? * @return
	 *            存储过程的返回�?和出参�?返回值的键�?是�?return”，出参的键值是存储过程的出参名�?
	 */
	public Map<String, Object> executeProcedure(boolean withReturnValue, String pacakgeName, String procedureName,
			Map<String, Object> params) {
		SimpleJdbcCall jdbcCall = createJdbcCallForProcedure(pacakgeName, procedureName);
		if (withReturnValue)
			jdbcCall = jdbcCall.withReturnValue();

		return null == params ? jdbcCall.execute() : jdbcCall.execute(params);
	}
	
	public Map<String, Object> executeProcedure(boolean withReturnValue, String pacakgeName, String procedureName,
			List<String> params) {
		SimpleJdbcCall jdbcCall = createJdbcCallForProcedure(pacakgeName, procedureName);
		if (withReturnValue)
			jdbcCall = jdbcCall.withReturnValue();

		return null == params ? jdbcCall.execute() : jdbcCall.execute(params.toArray());
	}

	/**
	 * execute a stored function or procedure
	 * <p>
	 * 如果函数也有出参，应该用本方法�?
	 * @param withReturnValue
	 *            include function or procedure's return value
	 * @param pacakgeName
	 *            如果存储过程不在包内，可以为null�?"
	 * @param procedureName
	 * @param args
	 *            optional array containing the in parameter values to be used
	 *            in the call. Parameter values must be provided in the same
	 *            order as the parameters are defined for the stored procedure.
	 * @return 存储过程的返回�?和出参�?返回值的键�?是�?return”，出参的键值是存储过程的出参名�?
	 */
	public Map<String, Object> executeProcedure(boolean withReturnValue, String pacakgeName, String procedureName,
			Object... args) {
		SimpleJdbcCall jdbcCall = createJdbcCallForProcedure(pacakgeName, procedureName);
		if (withReturnValue)
			jdbcCall = jdbcCall.withReturnValue();

		return jdbcCall.execute(args);
	}

	public JdbcTemplate newJdbcTemplate() {
		return new JdbcTemplate(dataSource);
	}

	
	/**
	 * execute sql query
	 * @param maxRows
	 *            the number returning max rows. 0 mean the datasource's default
	 *            value
	 * @param sql
	 *            sql query
	 * @param args
	 *            绑定参数
	 * @return The results will be mapped to a List (one entry for each row) of
	 *         Maps (one entry for each column, using the column name as the
	 *         key).
	 * @throws DataAccessException
	 *             if there is any problem issuing the update(from spring
	 *             framework)
	 */
	public List<Map<String, Object>> query(int maxRows, String sql, Object... args) {
		// the jdbcTemplate is a default object, so you could not change it
		JdbcTemplate myJdbcTemplate = new JdbcTemplate(dataSource);
		myJdbcTemplate.setMaxRows(maxRows);
		return myJdbcTemplate.queryForList(sql, args);
	}
	
	/**
	 * Issue a single SQL update operation (such as an insert, update or delete
	 * statement)
	 * @param sql
	 *            SQL containing bind parameters
	 * @param args
	 *            arguments to bind to the query
	 * @return the number of rows affected
	 * @throws DataAccessException
	 *             if there is any problem issuing the update(from spring
	 *             framework)
	 */
	public int update(String sql, Object... args) {
		return jdbcTemplate.update(sql, args);
	}
	
	public boolean batchUpdate(String sql,final Integer[] objs){
		try {
			jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
				
				@Override
				public void setValues(PreparedStatement ps, int i) throws SQLException {
					ps.setInt(1, objs[i]);
				}
				
				@Override
				public int getBatchSize() {
					
					return objs.length;
				}
			});
			
			return true;
		} catch (DataAccessException e) {
			logger.error("",e);
			return false;
		}
	}


	/**
	 * 根据键值对参数查询数据
	 * @param sql
	 * @param paramMap
	 * @return
	 */
	public List<Map<String, Object>> queryByParamKey (String sql, Map<String,Object> paramMap) {
		return namedParameterJdbcTemplate.queryForList(sql, paramMap);
	}


	/**
	 * 按照参数key去新增修改
	 * @author Rui.Zhou
	 * @param sql
	 * @param paramMap
	 */
	public int updateByParamKey(String sql,Map<String,Object> paramMap){
		return namedParameterJdbcTemplate.update(sql, paramMap);
	}


	/**
	 * 按照参数key去批量新增修改
	 * @param sql
	 * @param paramMap
	 * @return
	 */
	public int[] updateByParamKey(String sql, List<Map<String,Object>> paramMap) {
		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(paramMap.toArray());
		return namedParameterJdbcTemplate.batchUpdate(sql, batch);
	}
}
