package com.hz.cds.rfid.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.rfid.service.RFIDRecordService;
import com.hz.cds.rfid.utils.RFIDCommonUtil;
import com.hz.cds.rfid.utils.RFIDConstants;
import com.hz.db.service.IQueryService;

@Controller
@RequestMapping("/rfidController")
public class RfidController {
	private static final Logger logger = LoggerFactory.getLogger(RfidController.class);
	
	@Resource
	private IQueryService queryService;

	/**
	 * 查询rfid缓存数据
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/queryRedisData")
	@ResponseBody
	public Object queryRedisData(String cusNumber,String prisonerId){
		String cacheKey = RFIDConstants.REDIS_KEY+"_"+cusNumber;
		Object o = RedisUtil.getOpsObject(cacheKey);
		Map<String,Object> map = JSON.parseObject(String.valueOf(o),HashMap.class);
		if(map != null){
			Object list = map.get(prisonerId);
			return list == null ? "" : list;
		}else{
			return "";
		}
	}
	
	/**
	 * 查询当前监控人员信息
	 * @param cusNumber
	 * @param rfidId
	 * @param peopleId
	 * @return
	 */
	@RequestMapping("/queryMonitorPeople")
	@ResponseBody
	public List<Map<String, Object>> queryMonitorPeople(@RequestParam() String cusNumber, @RequestParam() String rfidId, @RequestParam() String peopleId){
		List<Map<String, Object>> resultList = new ArrayList<>();
		if(RFIDCommonUtil.isEmpty(cusNumber) || RFIDCommonUtil.isEmpty(rfidId) || RFIDCommonUtil.isEmpty(peopleId)){//参数存在空值
			return resultList;
		}
		//根据peopleId在缓存中获取最新的记录
		Map<String, Object> newestRecord = RFIDRecordService.getRecordByPeopleId(cusNumber, peopleId);
		//构建查询的参数
		List<Object> params = new ArrayList<>();
		params.add(cusNumber);
		params.add(rfidId);
		params.add(peopleId);
		if(newestRecord==null || newestRecord.isEmpty()){//如果缓存中未查询到记录，则去数据库进行查询
			try {
				resultList = queryService.query("select_people_info_by_rfid", "0", params);
			} catch (Exception e) {
				logger.error("查询当前监控人员信息出错", e);
			}
		}else{
			String peopleType = (String)newestRecord.get("peopleType");
			String monitorFlag = (String)newestRecord.get("monitorFlag");
			if("2".equals(peopleType) && "1".equals(monitorFlag)){//验证数据通过
				params = new ArrayList<>();
				params.add(cusNumber);
				params.add(peopleId);
				List<Map<String, Object>> peopleInfoList = null;
				try {
					//查询人员信息
					peopleInfoList = queryService.query("select_people_info_by_peopleId_and_cusNumber", "0", params);
				} catch (Exception e) {
					logger.error("查询当前监控人员信息出错", e);
				}
				if(peopleInfoList!=null && peopleInfoList.size()>0){//在数据库查询到人员信息，进行数据拼装
					Map<String, Object> resultMap = peopleInfoList.get(0);
					resultMap.put("rfid_id", newestRecord.get("rfidId"));
					resultMap.put("record_id", newestRecord.get("recordId"));
					resultMap.put("rfid_name", newestRecord.get("rfidName"));
					resultMap.put("dept_name", newestRecord.get("rfidDeptName"));
					resultMap.put("before_rfid_name", newestRecord.get("beforeRfidName"));
					resultMap.put("people_type", newestRecord.get("peopleType"));
					resultMap.put("people_id", newestRecord.get("peopleId"));
					resultMap.put("people_name", newestRecord.get("peopleName"));
					resultMap.put("pos_xyz", newestRecord.get("posXYZ"));
					resultMap.put("monitor_time", newestRecord.get("monitorTime"));
					resultList.add(resultMap);
				}
			}else{
				try {
					resultList = queryService.query("select_people_info_by_rfid", "0", params);
				} catch (Exception e) {
					logger.error("查询当前监控人员信息出错", e);
				}
			}
		}
		return resultList;
	}
}




