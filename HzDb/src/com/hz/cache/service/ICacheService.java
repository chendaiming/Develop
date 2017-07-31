package com.hz.cache.service;

import com.alibaba.fastjson.JSONObject;

/**
 * 缓存服务接口
 * @author xie.yh
 *
 */
public interface ICacheService {

	/**
	 * 刷新缓存
	 * @return
	 */
	public boolean refresh () throws Exception;
	/**
	 * 按照参数刷新缓存
	 * @return
	 */
	public boolean refresh (JSONObject parasObject) throws Exception;
	/**
	 * 按照机构号和编号删除缓存数据
	 * @return
	 */
	public boolean refreshForDelete (JSONObject parasObject) throws Exception;
}
