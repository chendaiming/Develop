package com.hz.frm.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.math.BigDecimal;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Component;

import com.hz.db.dao.ExecuteDao;

import oracle.jdbc.OracleTypes;

@Component
public class SequenceUtil {

	@Resource
	private ExecuteDao executeDao;


	/**
	 * 获取序列号
	 * @param tableName		表名（不区分大小写，统一转大写）
	 * @param columnName	字段名（不区分大小写，统一转大写）
	 * @return 序列号
	 * @throws Exception
	 */
	public synchronized String getSequence (String tableName, String columnName) throws Exception {
		BigDecimal seq = executeDao.function(BigDecimal.class, "FMS_F_SEQ_GET", tableName.toUpperCase(), columnName.toUpperCase());
		if (seq != null) {
			return seq.toString();
		} else
			return null;
	}

	/**
	 * 获取序列号集合
	 * @param tableName		表名（不区分大小写，统一转大写）
	 * @param columnName	字段名（不区分大小写，统一转大写）
	 * @param number		获取序列号个数
	 * @return [序列号, ...]
	 * @throws Exception
	 */
	public synchronized List<String> getSequences (String tableName, String columnName, Integer number) throws Exception {
		List<String> list = new ArrayList<String>();
		Map<String, Object> execute = null;
		SimpleJdbcCall call = null;
		Clob result = null;
		String str = null;

		call = new SimpleJdbcCall(executeDao.getJdbc().getDataSource());  
		call.withFunctionName("FUNC_GET_IDS");  
	    call.declareParameters(new SqlOutParameter("result", OracleTypes.CLOB));

	    execute = call.execute(tableName, columnName, number);
	    result = (Clob)execute.get("result");

		if (result != null) {
			str = ClobToString(result);

			for(String seq : str.split(",")) {
				list.add(seq);
			}
		}

		return list;
	}


	/**
	 * CLOB类型转成字符串
	 */
	public String ClobToString(Clob clob) throws SQLException, IOException {
		Reader is = clob.getCharacterStream();// 得到流
		BufferedReader br = new BufferedReader(is);
		StringBuffer sb = new StringBuffer();
		String s = br.readLine();

		while (s != null) {// 执行循环将字符串全部取出付值给StringBuffer由StringBuffer转成STRING
			sb.append(s);
			s = br.readLine();
		}

		if(br != null) br.close();
		if(is != null) is.close();

		return sb.toString();
	}
}
