package com.hz.db.extend;

import com.alibaba.fastjson.JSONObject;

/**
 * 数据库参数扩展服务接口（用于获取数据库操作的参数）
 * @author xie.yh
 *
 */
public interface IParamsExtend {
	/**
	 * 格式化数据库参数（键值对形式的传参）
	 * @param reqJSON 		前端请求参数
	 * @throws Exception
	 */
	public void fmtParamMap(JSONObject reqJSON, JSONObject respJSON) throws Exception;
	
	/**
	 * 格式化数据库参数（数组形式的传参）
	 * @param reqJSON 		前端请求参数
	 * @throws Exception
	 */
	public void fmtParamList(JSONObject reqJSON, JSONObject respJSON) throws Exception;
}
