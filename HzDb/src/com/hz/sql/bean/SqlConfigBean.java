package com.hz.sql.bean;

import java.util.LinkedHashMap;
import java.util.Map;

public class SqlConfigBean {
	private String sqlId = null;	// SQL编号
	private String sqlDesc = null;	// SQL语句描述
	private String sqlBody = null;	// SQL语句主体
	private String seq = null;		// SQL插入时的序列号主键

	// 数据权限过滤属性
	private boolean isFilter = false;	// 是否过滤数据
	private String filterId = null;		// 过滤匹配的ID
	private String filterType = null;	// 过滤匹配的数据类型

	private Map<String, Map<String, String>> constMap = new LinkedHashMap<String, Map<String, String>>();		// 模块常量字段转换
	private Map<String, String> whereMap = new LinkedHashMap<String, String>();		// SQL语句的条件
	private Map<String, String> orderMap = new LinkedHashMap<String, String>();		// SQL语句的排序


	public String getSqlId() {
		return sqlId;
	}
	public void setSqlId(String sqlId) {
		this.sqlId = sqlId;
	}
	public String getSqlDesc() {
		return sqlDesc;
	}
	public void setSqlDesc(String sqlDesc) {
		this.sqlDesc = sqlDesc;
	}
	public String getSqlBody() {
		return sqlBody;
	}
	public void setSqlBody(String sqlBody) {
		this.sqlBody = sqlBody;
	}
	public String getSeq() {
		return seq;
	}
	public void setSeq(String seq) {
		this.seq = seq;
	}
	public Map<String, Map<String, String>> getConstMap() {
		return constMap;
	}
	public void setConstMap(Map<String, Map<String, String>> constMap) {
		this.constMap = constMap;
	}
	public Map<String, String> getWhereMap() {
		return whereMap;
	}
	public void setWhereMap(Map<String, String> whereMap) {
		this.whereMap = whereMap;
	}
	public Map<String, String> getOrderMap() {
		return orderMap;
	}
	public void setOrderMap(Map<String, String> orderMap) {
		this.orderMap = orderMap;
	}
	public boolean isFilter() {
		return isFilter;
	}
	public void setFilter(boolean isFilter) {
		this.isFilter = isFilter;
	}
	public String getFilterId() {
		return filterId;
	}
	public void setFilterId(String filterId) {
		this.filterId = filterId;
	}
	public String getFilterType() {
		return filterType;
	}
	public void setFilterType(String filterType) {
		this.filterType = filterType;
	}
}
