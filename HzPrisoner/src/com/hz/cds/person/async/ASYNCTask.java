package com.hz.cds.person.async;


import java.math.BigDecimal;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.hz.sql.bean.SqlConfigBean;
import com.hz.sql.util.SqlConfigUtil;

public class ASYNCTask {
	
	@Autowired
	@Qualifier("jdbcTemplate")
	private JdbcTemplate jdbc;
	
	@Autowired
	@Qualifier("jdbcTemplate1")
	private JdbcTemplate jdbc1;
	
	/*@Scheduled(cron="0/5 * * * * ?")
	@Transactional(rollbackFor=Exception.class)*/
	private void async(){
		
		SqlConfigBean query = SqlConfigUtil.getConfig("query_async_data");
		
		String sql = query.getSqlBody();
		
		Date date=getDate();
		
		List<Map<String, Object>> list=jdbc1.queryForList(sql,date);
				
		SqlConfigBean insert = SqlConfigUtil.getConfig("insert_async_data");
		
		String insertSql = insert.getSqlBody();
		
		String [] keys=insertSql.substring(insertSql.indexOf("("), insertSql.indexOf(")")).split(",");
		int  len=insertSql.substring(insertSql.lastIndexOf("("),insertSql.lastIndexOf("")).split("?").length-1;
		jdbc.batchUpdate(insertSql,new BatchPreparedStatementSetter() {
			
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				
				Map<String,Object> map=list.get(i);
				
				for(int i1=0;i1<len;i1++){
					
					ps.setObject(i1+1, map.get(keys[i1]));
					
				}
			}
			
			public int getBatchSize() {
				return list.size();
			}
		});
	}
	
	private Date getDate(){
		
		Map<String,Object> map=jdbc.queryForMap("select max(pbd_crte_time)date from psr_prisoner_base_dtls");
		
		return (Date) map.get("date");
	}
	
	
	
	
}
