package com.hz.db.dao;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.support.AbstractLobCreatingPreparedStatementCallback;
import org.springframework.jdbc.support.lob.LobCreator;
import org.springframework.jdbc.support.lob.LobHandler;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.hz.db.util.ReqParamsUtil;
import com.hz.frm.util.Tools;

/**
 * 数据库增、删、改操作的DAO类
 * @author xie.yh 2016.08.17
 */
@Repository
@Transactional
@Scope("prototype")
public class UpdateDao {

	@Autowired
	@Qualifier("defaultLobHandler")
	private LobHandler lobHandler;

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
	 * 数据库新增、删除、更新操作
	 * @param sql			SQL语句
	 * @param paramList		SQL参数
	 * @return
	 * @throws Exception
	 */
	public int update (String sql, List<Object> params) throws Exception {
		ReqParamsUtil.checkParams(sql, params);
		if (params != null)
			return jdbcDAO.update(sql, params.toArray());
		else
			return jdbcDAO.update(sql);
	}


	/**
	 * 数据库新增、删除、更新操作（支持CLOB和BLOB类型数据）
	 * @param sql			SQL语句
	 * @param paramList		SQL参数
	 * @param paramType		SQL参数类型，格式：{"索引":"类型"}
	 * 								<br>索引：此索引对应的params数组的索引值
									<br>类型：数据类型为CLOB、BLOB类型的需要标明为CLOB和BLOB（支持大小写），其它的暂不需要说明
	 * @return
	 * @throws Exception
	 */
	public int update (String sql, List<Object> paramList, JSONObject paramType) throws Exception {
		if (paramList == null) paramList = new ArrayList<Object>();
		if (paramType == null) paramType = new JSONObject();
		return execute(sql, paramList.toArray(), paramType);
	}


	/**
	 * 数据库（批量）新增、删除、更新操作
	 * @param sql			SQL语句
	 * @param paramsList	SQL参数
	 * @return
	 * @throws Exception
	 */
	public int[] updateBatch (String sql, List<Object[]> paramsList) throws Exception {
		for(Object[] params : paramsList) {
			ReqParamsUtil.checkParams(sql, params);
		}
		return jdbcDAO.batchUpdate(sql, paramsList);
	}


	/**
	 * 数据库（批量）新增、删除、更新操作（支持CLOB和BLOB类型数据）
	 * @param sql			SQL语句
	 * @param paramsList	SQL参数
	 * @param paramType		SQL参数类型，格式：{"索引":"类型"}
	 * 								<br>索引：此索引对应的params数组的索引值
									<br>类型：数据类型为CLOB、BLOB类型的需要标明为CLOB和BLOB（支持大小写），其它的暂不需要说明
	 * @return
	 * @throws Exception
	 */
	@Transactional(rollbackFor = Exception.class)
	public int[] updateBatch (String sql, List<Object[]> paramsList, JSONObject paramType) throws Exception {
		int[] result;
		int i = 0;

		if (paramsList != null) {
			result = new int[paramsList.size()];

			for(Object[] args : paramsList) {
				result[i++] = execute(sql, args, paramType);
			}
		} else {
			result = new int[1];
			result[0] = execute(sql, null, null);
		}

		return result;
	}









	/**
	 * 数据库新增、删除、更新操作
	 * @param sql		SQL语句
	 * @param paramMap	SQL参数，MAP类型
	 * @return
	 * @throws Exception
	 */
	public int updateByParamKey (String sql, Map<String, Object> paramMap) throws Exception {
		//ReqParamsUtil.checkParams(sql, paramMap);
		return jdbcDAO.updateByParamKey(sql, paramMap);
	}


	/**
	 * 数据库（批量）新增、删除、更新操作
	 * @param sql		SQL语句
	 * @param paramsMap	SQL参数
	 * @return
	 * @throws Exception
	 */
	public int[] updateByParamKey (String sql, List<Map<String, Object>> paramMaps) throws Exception {
/*		for(Map<String, Object> paramMap : paramMaps) {
			ReqParamsUtil.checkParams(sql, paramMap);
		}*/
		return jdbcDAO.updateByParamKey(sql, paramMaps);
	}







	/**
	 * 数据库新增、删除、更新操作（支持CLOB和BLOB类型数据）
	 * @param sql			SQL语句
	 * @param paramList		SQL参数
	 * @param paramType		SQL参数类型，格式：{"索引":"类型"}
	 * 								<br>索引：此索引对应的params数组的索引值
									<br>类型：数据类型为CLOB、BLOB类型的需要标明为CLOB和BLOB（支持大小写），其它的暂不需要说明
	 * @return
	 */
	private int execute (String sql, final Object[] paramList, final JSONObject paramType) throws Exception {
		// 检测请求参数
		ReqParamsUtil.checkParams(sql, paramList);
		return jdbcDAO.getJdbcTemplate().execute(sql, new AbstractLobCreatingPreparedStatementCallback (lobHandler) {
			@Override
			protected void setValues(PreparedStatement pstmt, LobCreator lobCreator) throws SQLException {
				int index = 0;
				if (paramList != null) {
					for(Object obj : paramList) {
						if (paramType != null) {
							switch (Tools.toStr(paramType.get(Tools.toStr(index++)), "").toUpperCase()) {
								case "CLOB": lobCreator.setClobAsString(pstmt, index, obj != null ? obj.toString() : null); break;
								case "BLOB": lobCreator.setBlobAsBytes(pstmt, index, obj != null ? (byte[])obj : null); break;
								default: pstmt.setObject(index, obj); break;
							}
						} else {
							pstmt.setObject(++index, obj);
						}
					}
				}
			}
		});
	}
}
