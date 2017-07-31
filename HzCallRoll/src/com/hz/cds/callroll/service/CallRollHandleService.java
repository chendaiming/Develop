package com.hz.cds.callroll.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.callroll.bean.CallRollMasterBean;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IQueryService;
import com.hz.db.service.IUpdateService;

@Service
public class CallRollHandleService {

	// 日志对象
	private static final Logger logger = LoggerFactory.getLogger(CallRollHandleService.class);

	@Resource
	private IUpdateService updateService;

	@Resource
	private IQueryService queryService;

	/**
	 * 添加点名主表记录
	 * @param master
	 * @return
	 */
	public boolean addCallRollMaster (CallRollMasterBean master) {
		JSONObject params = null;
		try {
			params = new JSONObject();
			params.put("crm_cus_number", master.getCrmCusNumber());
			params.put("crm_record_id", master.getCrmRecordId());
			params.put("crm_serial_code", master.getCrmSerialCode());
			params.put("crm_batch_code", master.getCrmBatchCode());
			params.put("crm_dprt_id", master.getCrmDprtId());
			params.put("crm_dprt_name", master.getCrmDprtName());
			params.put("crm_police_id", master.getCrmPoliceId());
			params.put("crm_police_name", master.getCrmPoliceName());
			params.put("crm_predict_num", master.getCrmPredictNum());
			params.put("crm_fact_num", master.getCrmFactNum());
			params.put("crm_begin_time", master.getCrmBeginTime());
			params.put("crm_end_time", master.getCrmEndTime());

			if (this.addCallRollMaster(params)) {
				master.setCrmRecordId(params.getString("crm_record_id"));
				return true;
			}
		} catch (Exception e) {
			logger.error("添加人员点名记录主表异常 --> 入库参数=" + JSON.toJSONString(params));
			logger.error("添加人员点名记录主表异常 --> 异常日志：", e);
		}
		return false;
	}


	/**
	 * 添加点名主表记录
	 * @param params
	 * @return
	 */
	public boolean addCallRollMaster (JSONObject params) {
		UpdateResp result = null;
		try {
			result = updateService.updateByParamKey("insert_call_roll_record_master", params);

			if (result != null) {
				return result.getSuccess();
			}
		} catch (Exception e) {
			logger.error("添加人员点名记录主表异常 --> 入库参数=" + JSON.toJSONString(params));
			logger.error("添加人员点名记录主表异常 --> 异常日志：", e);
		}
		return false;
	}



	public boolean updateCallRollMaster (JSONObject params) {
		UpdateResp result = null;
		try {
			result = updateService.updateByParamKey("update_call_roll_record_master", params);

			if (result != null) {
				return result.getSuccess();
			}
		} catch (Exception e) {
			logger.error("更新人员点名记录主表异常 --> 入库参数=" + JSON.toJSONString(params));
			logger.error("更新人员点名记录主表异常 --> 异常日志：", e);
		}
		return false;
	}



	public boolean addCallRollDtls (JSONObject params) {
		UpdateResp result = null;
		try {
			result = updateService.updateByParamKey("insert_call_roll_record_dtls", params);

			if (result != null) {
				return result.getSuccess();
			}
		} catch (Exception e) {
			logger.error("添加人员点名记录详情表异常 --> 入库参数=" + JSON.toJSONString(params));
			logger.error("添加人员点名记录详情表异常 --> 异常日志：", e);
		}
		return false;
	}


	/**
	 * 查询点名主表信息
	 * @param cusNumber 机构号
	 * @param recordId	记录编号
	 * @return
	 */
	public List<Map<String, Object>> queryCallRollMaster (String cusNumber, String recordId) {
		List<Map<String, Object>> result = null;
		List<Object> params = null;

		try {
			params = new ArrayList<Object>();
			params.add(cusNumber);
			params.add(recordId);

			result = queryService.query("select_call_roll_record_master", "0", params);
		} catch (Exception e) {
			logger.error("查询人员点名记录主表异常 --> 查询参数=" + JSON.toJSONString(params));
			logger.error("查询人员点名记录主表异常 --> 异常日志：", e);
		}
		return result;
	}


	/**
	 * 查询点名主表信息
	 * @param cusNumber 机构号
	 * @param recordId	记录编号
	 * @param prisonerId 被点人员编号（罪犯编号）
	 * @return
	 */
	public List<Map<String, Object>> queryCallRollDtls (String cusNumber, String recordId, String prisonerId) {
		List<Map<String, Object>> result = null;
		List<Object> params = null;

		try {
			params = new ArrayList<Object>();
			params.add(cusNumber);
			params.add(recordId);
			params.add(prisonerId);

			result = queryService.query("select_call_roll_record_dtls", "0", params);
		} catch (Exception e) {
			logger.error("查询人员点名记录详情表异常 --> 查询参数=" + JSON.toJSONString(params));
			logger.error("查询人员点名记录详情表异常 --> 异常日志：", e);
		}
		return result;
	}
}
