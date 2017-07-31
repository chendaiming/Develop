 package com.hz.db.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.db.bean.DbCodeBean;
import com.hz.db.bean.UpdateResp;
import com.hz.db.dao.UpdateDao;
import com.hz.db.extend.IParamsExtend;
import com.hz.db.service.IUpdateService;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.DbException;
import com.hz.db.util.ReqParams;
import com.hz.db.util.ReqParamsUtil;

@Service
@Transactional
@Scope("prototype")
public class UpdateServiceImpl implements IUpdateService {
	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(UpdateServiceImpl.class);

	private IParamsExtend paramsExtend;

	@Autowired
	private ExtendConfigService extendService;

	@Resource
	private UpdateDao updateDao;


	@Override
	public void setJdbc(JdbcTemplate jdbcTemplate, DataSource dataSource) {
		updateDao.setJdbc(jdbcTemplate, dataSource);
	}


	@Override
	public UpdateResp update (JSONObject reqJSON) throws Exception {
		JSONArray reqArray = new JSONArray();
		reqArray.add(reqJSON);
		return update(reqArray);
	}

	@Override
	public UpdateResp update(String sqlId, String whereId, JSONArray paramsList, JSONObject parasType) throws Exception {
		JSONObject reqJSON = new JSONObject();
		reqJSON.put(ReqParams.SQL_ID, sqlId);
		reqJSON.put(ReqParams.WHERE_ID, whereId);
		reqJSON.put(ReqParams.PARAMS, paramsList);
		reqJSON.put(ReqParams.PARAMS_TYPE, parasType);
		return update(reqJSON);
	}


	@Override
	public UpdateResp update(JSONArray paramsList, String sqlId, String whereId, JSONObject parasType) throws Exception {
		JSONArray params = new JSONArray();
		params.add(paramsList);

		return update(sqlId, whereId, params, parasType);
	}


	@Override
	public UpdateResp update(JSONArray paramsList, String sqlId, JSONObject parasType) throws Exception {
		JSONArray params = new JSONArray();
		params.add(paramsList);

		return update(sqlId, params, parasType);
	}


	@Override
	public UpdateResp update(String sqlId, JSONArray paramsList, JSONObject parasType) throws Exception {
//		JSONObject reqJSON = new JSONObject();
//		reqJSON.put(ReqParams.SQL_ID, sqlId);
//		reqJSON.put(ReqParams.PARAMS, paramsList);
//		reqJSON.put(ReqParams.PARAMS_TYPE, parasType);
//		return update(reqJSON);
		return update(sqlId, "", paramsList, parasType);
	}

	@Override
	public UpdateResp update (String sqlId, List<Object> params) throws Exception {
		JSONArray array = new JSONArray();
		array.add(params);
		return update(sqlId, "", array, null);
	}




	@Override
	@Transactional(rollbackFor = Exception.class)
	public UpdateResp update (JSONArray reqArray) throws Exception {
		UpdateResp updateResp = new UpdateResp();	// 返回对象
		List<Object[]> paramsList = null;			// 多集合参数

		JSONObject reqJSON = null;			// 单个的操作对象
		JSONObject paramsType = null;		// 数据参数类型
		String sql = null;					// 执行的SQL

		int[] updateNum = null;
		int updateSize = reqArray.size();	// 
		int needUpdateCount = 0;			// 需要操作的总数量
		int successUpdateCount = 0;			// 操作成功的总数量

		// 返回结果集
		JSONArray respArray = new JSONArray();
		JSONObject respJSON = null;

		try {
			// 轮循处理
			for(int i = 0; i < updateSize; i++) {
				// 获取请求
				reqJSON = reqArray.getJSONObject(i);
				respJSON = new JSONObject();

				// 获取参数之前对操作数据进行处理
				fmtParamList(reqJSON, respJSON);

				// 数据库操作参数
				paramsType = ReqParamsUtil.getParamsType(reqJSON);
				paramsList = ReqParamsUtil.getParamsList(reqJSON);
				sql = ReqParamsUtil.getSql(reqJSON);

				// 批量更新
				updateNum = updateDao.updateBatch(sql, paramsList, paramsType);

				// 统计更新结果
				for(int result : updateNum) {
					successUpdateCount = countResult(successUpdateCount, result);
				}

				if (paramsList == null) {
					needUpdateCount = successUpdateCount;
				} else {
					needUpdateCount += paramsList.size();
				}

				// 返回数据
				respJSON.put("result", updateNum);
				respArray.add(respJSON);
			}
		} catch (Exception e) {
			log.error("操作失败：", e);
			throwEx(reqJSON, e);
		}

		updateResp.setSuccess(needUpdateCount == successUpdateCount);	// 所有的操作结果都返回正确时设置为true
		updateResp.setData(respArray);	// 只有一个更新操作语句是返回对象，多个返回对象集合
		return updateResp;
	}


	@Override
	public UpdateResp updateByParamKey(JSONObject reqJSON) throws Exception {
		JSONArray reqArray = new JSONArray();
		reqArray.add(reqJSON);
		return updateByParamKey(reqArray);
	}


	@Override
	public UpdateResp updateByParamKey(String sqlId, String whereId, JSONArray paramsList) throws Exception {
		JSONObject reqJSON = new JSONObject();
		reqJSON.put(ReqParams.SQL_ID, sqlId);
		reqJSON.put(ReqParams.WHERE_ID, whereId);
		reqJSON.put(ReqParams.PARAMS, paramsList);

		return updateByParamKey(reqJSON);
	}


	@Override
	public UpdateResp updateByParamKey(String sqlId, String whereId, JSONObject paramsList) throws Exception {
		JSONArray jsonArray = new JSONArray();
		jsonArray.add(paramsList);
		return updateByParamKey(sqlId, whereId, jsonArray);
	}


	@Override
	public UpdateResp updateByParamKey(String sqlId, JSONArray paramsList) throws Exception {
		return updateByParamKey(sqlId, "", paramsList);
	}


	@Override
	public UpdateResp updateByParamKey(String sqlId, JSONObject params) throws Exception {
		JSONArray paramsList = new JSONArray();
		paramsList.add(params);

		return updateByParamKey(sqlId, paramsList);
	}


	@Override
	@Transactional(rollbackFor = Exception.class)
	public UpdateResp updateByParamKey(JSONArray reqArray) throws Exception {
		UpdateResp updateResp = new UpdateResp();		// 返回对象
		List<Map<String, Object>> paramsList = null;	// 多集合参数

		JSONArray respArray = new JSONArray();	// 返回结果集
		JSONObject respJSON = null;				// 
		JSONObject reqJSON = null;				// 单个的操作对象
		String sql = null;						// 执行的SQL

		int updateNum = 0;					// 更新结果
		int updateSize = reqArray.size();	// 更新的数量
		int needUpdateCount = 0;			// 需要操作的总数量
		int successUpdateCount = 0;			// 操作成功的总数量

		try {
			// 轮循处理
			for(int i = 0; i < updateSize; i++) {
				// 获取请求
				reqJSON = reqArray.getJSONObject(i);
				respJSON = new JSONObject();

				// 获取参数之前对操作数据进行处理
				fmtParamMap(reqJSON, respJSON);

				// 数据库操作参数
				paramsList = ReqParamsUtil.getParamMaps(reqJSON);
				sql = ReqParamsUtil.getSql(reqJSON);

				if (paramsList != null) {
					for (Map<String, Object> paramMap : paramsList) {
						updateNum = updateDao.updateByParamKey(sql, paramMap);
						successUpdateCount = countResult(successUpdateCount, updateNum);
						needUpdateCount++;
					}
				} else {
					updateNum = updateDao.updateByParamKey(sql, new HashMap<String, Object>());
					needUpdateCount = successUpdateCount = countResult(successUpdateCount, updateNum);
				}

				// 返回数据
				respJSON.put("result", updateNum);
				respArray.add(respJSON);
			}
		} catch (DbException e) {
			log.error("操作失败：", e);
			throwEx(reqJSON, e);
		} catch (Exception e) {
			log.error("操作失败：", e);
			throwEx(reqJSON, e);
		}

		updateResp.setSuccess(needUpdateCount == successUpdateCount);	// 所有的操作结果都返回正确时设置为true
		updateResp.setData(respArray);	// 只有一个更新操作语句是返回对象，多个返回对象集合
		return updateResp;
	}


	/**
	 * 异常转码
	 * @param reqJSON
	 * @param e
	 * @throws Exception
	 */
	private void throwEx (JSONObject reqJSON, Exception e) throws Exception {
		String module = reqJSON.getString(ReqParams.MODULE);
		DbCodeBean codeBean = DbCodeUtil.formatEx(e, module);
		DbCodeUtil.throwEx(codeBean.getCode(), codeBean.getDescAndPlus());
	}


	/**
	 * 统计更新结果
	 * @param count
	 * @param result
	 * @return
	 */
	private int countResult (int count, int result) {
		// -2 表示成功执行了命令，但受影响的行数是未知的
		// 使用jdbc的batchupdate时返回的是-2的数组
		if (result > 0 || result == -2) {
			return ++count;
		} else {
			return count;
		}
	}

	/**
	 * 格式化参数
	 * @param reqJSON
	 * @throws Exception
	 */
	private void fmtParamList (JSONObject reqJSON, JSONObject respJSON) throws Exception {
		// 数据参数扩展处理
		if (paramsExtend == null) paramsExtend = extendService.getParamsExtend();
		if (paramsExtend != null) paramsExtend.fmtParamList(reqJSON, respJSON);
	}

	/**
	 * 格式化参数
	 * @param reqJSON
	 * @throws Exception
	 */
	private void fmtParamMap (JSONObject reqJSON, JSONObject respJSON) throws Exception {
		// 数据参数扩展处理
		if (paramsExtend == null) paramsExtend = extendService.getParamsExtend();
		if (paramsExtend != null) paramsExtend.fmtParamMap(reqJSON, respJSON);
	}
}