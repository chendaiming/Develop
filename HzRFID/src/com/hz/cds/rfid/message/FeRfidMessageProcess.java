package com.hz.cds.rfid.message;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.rfid.cache.RFIDBaseDtlsCache;
import com.hz.cds.rfid.cache.RFIDLabelPeopleBindCache;
import com.hz.cds.rfid.service.RFIDRecordService;
import com.hz.cds.rfid.utils.RFIDCommonUtil;
import com.hz.db.service.IQueryByParamKeyService;
import com.hz.db.service.IUpdateService;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.Tools;
import com.hz.frm.utils.SequenceUtil;

/**
 * RFID消息的处理类
 * 
 * @author chendm
 *
 * @date 2017年01月16日
 */
@Service
@Transactional
public class FeRfidMessageProcess extends FeMessageProcessAbstract<FeRfidMessageBean> {
	private static final Logger logger = LoggerFactory.getLogger(FeRfidMessageProcess.class);
	
	@Resource
	private MqMessageSendService mqMessageSendService;
	
	@Resource
	private IQueryByParamKeyService queryService;
	
	@Resource
	private IUpdateService updateService;
	
	@Resource
	private SequenceUtil sequenceUtil;
	
	@Override
	public Class<FeRfidMessageBean> getBodyClass() {
		return FeRfidMessageBean.class;
	}


	@Override
	protected void process(FeMessageHeader feMessageHeader, FeRfidMessageBean msgBody) {
		//redis标识+机构号+用户id拼出redis key
//		String cacheKey = RFIDConstants.REDIS_KEY + "_" + feMessageHeader.getCusNumber();

		// TODO: 
		// 查询RFID基站设备信息
		// 查询RFID标签和人员绑定信息
		// 查询RFID基站关联设备信息

		msgBody.setCusNumber(feMessageHeader.getCusNumber());


		// 查询RFID标签绑定人员信息
		if (!queryBindPeople(msgBody)) return;

		// 查询RFID信息
		if (!queryRfidData(msgBody)) return;

		// 记录RFID信息
		if (!insertDate(msgBody)) return;

		// 查询关联摄像机数据
		queryCameraData(msgBody);

		//只缓存需要的数据
		Map<String,Object> redisMap = new HashMap<>();
		redisMap.put("rfid", msgBody.getRfidId());		//rfid
		redisMap.put("rfidname",msgBody.getRfidName());//rfid名称
		redisMap.put("peopleId", msgBody.getPeopleId());//罪犯id
		redisMap.put("inout", msgBody.getInOut());		//进出标识
		redisMap.put("time", feMessageHeader.getSendTime());	//时间
		redisMap.put("area", msgBody.getAreaId());	//区域
		redisMap.put("areaname", msgBody.getAreaName());	//区域名称
		redisMap.put("cameraIds", msgBody.getCameraIds());	//摄像机id


/*
 		//获取Redis缓存数据
		Object rfidJson = RedisUtil.getOpsObject(cacheKey);
		//当前罪犯RFID数据
		LinkedList<Map<String,Object>> redisLinkedList = new LinkedList<>();

		//添加缓存数据
		Map<String,Object> dataMap = JSON.parseObject(String.valueOf(rfidJson),HashMap.class);
		if(!CollectionUtils.isEmpty(dataMap) && dataMap.get(msgBody.getPeopleId()) != null){
			redisLinkedList = JSON.parseObject(JSON.toJSONString(dataMap.get(msgBody.getPeopleId())),LinkedList.class);
			redisLinkedList.addLast(redisMap);
			if (redisLinkedList.size() > 20) {
				redisLinkedList.removeFirst();
			}
			dataMap.put(msgBody.getPeopleId(), redisLinkedList);
			RedisUtil.putOpsObject(cacheKey, JSON.toJSONString(dataMap));
		} else {
			//首次调用执行
			HashMap<String,Object> map = new HashMap<>();
			LinkedList<Map<String,Object>> linkedList = new LinkedList<>();
			linkedList.addFirst(redisMap);
			redisLinkedList = linkedList;
			map.put(msgBody.getPeopleId(),linkedList);
			RedisUtil.putOpsObject(cacheKey, JSON.toJSONString(map));
		}
*/
		Map<String,Object> map = new HashMap<>();

		map.put("rfidInfo", redisMap);
		map.put("beanData", msgBody);//推送信息

		try {
			//查询罪犯关联的RFID
			if("1".equals(msgBody.getInOut()) && isOver(msgBody.getCusNumber(), msgBody.getPeopleId(), msgBody.getRfidId())){//越界
				msgBody.setOver(true);
			}

			//向前端发送消息
			mqMessageSendService.sendInternalWebMessage(JSON.toJSONString(map), feMessageHeader.getCusNumber(),feMessageHeader.getMsgType());

			//查询罪犯关联的RFID
//			if (msgBody.isOver()) {//越界
//				mqMessageSendService.sendInternalWebMessage(JSONObject.toJSONString(msgBody), feMessageHeader.getCusNumber(),"RFID001_OVER");
//			}
		} catch (Exception e) {
			logger.error("RFID基站消息处理失败， msgbody="+map,e);
		}	
	}


	/**
	 * 判断罪犯是否越界
	 * @param cusNumber
	 * @param peopleId
	 * @param rfidId
	 * @return
	 */
	public boolean isOver(String cusNumber, String peopleId, String rfidId) {
//		JSONObject param=JSONObject.parseObject("{sqlId: 'select_prisoner_is_overArea',params: {cus:'"+cus+"',prisoner:'"+prisoner+"'}}");

		try {
//			List<Map<String, Object>> list = queryService.query(param);

			JSONObject params = new JSONObject();
			params.put("cus", cusNumber);
			params.put("prisoner", peopleId);

			List<Map<String, Object>> list = queryService.query("select_prisoner_is_overArea", params);

			if (list != null && list.size() > 0) {
				String rfids = (String)list.get(0).get("rfid");

				if (rfids.length() > 0 && !rfids.contains(rfidId)) {
					return true;
				}
			}
		} catch (Exception e) {
			logger.error("检查人员是否越界异常：", e);
		}
		return false;
	}


	/**
	 * 数据填充(查询摄像机)
	 * @param data 前置机推送数据
	 * @param feMessageHeader 消息头
	 * @return FeRfidMessageBean
	 */
	private void queryCameraData(FeRfidMessageBean data){
//		JSONObject paramsJSON = null;
//		List<Map<String, Object>> resultObj = null;
//
//		try {
//			paramsJSON = new JSONObject();
//			paramsJSON.put("cusNumber", data.getCusNumber());
//			paramsJSON.put("mainDvcType", "15");
//			paramsJSON.put("linkDvcType", "1");
//			paramsJSON.put("rfidDvcId", data.getDeviceId());
//
//			resultObj = queryService.query("select_rfid_link_dvc_list", paramsJSON);
//
//			if (resultObj != null) {
//				List<Object> list = new ArrayList<Object>();
//				for(Map<String, Object> map : resultObj) {
//					list.add(map.get("dld_dvc_id"));
//				}
//				data.setCameraIds(list.toArray());
//			}
//		} catch (Exception e) {
//			logger.error("[基站信息] 根据ID查询摄像机数据失败:{}",e.getMessage());
//		}
	}


	/**
	 * 数据填充(查询FRID信息)
	 * @param data 前置机推送数据
	 * @param feMessageHeader 消息头
	 * @return FeRfidMessageBean
	 */
	private boolean queryRfidData(FeRfidMessageBean data){
		Map<String, Object> baseInfo = null;

		try {
			baseInfo = RFIDBaseDtlsCache.getRfidBaseInfo(data.getCusNumber(), data.getDeviceId());

			if (baseInfo != null) {
				data.setRfidId(Tools.toStr(baseInfo.get("rfid_id")));
				data.setRfidName(Tools.toStr(baseInfo.get("rfid_name")));
				data.setRfidDeptId(Tools.toStr(baseInfo.get("dept_id")));
				data.setRfidDeptName(Tools.toStr(baseInfo.get("dept_name")));
				data.setAreaId(Tools.toStr(baseInfo.get("area_id")));
				data.setAreaName(Tools.toStr(baseInfo.get("area_name")));
				data.setRfidStatus(Tools.toStr(baseInfo.get("rfid_stts")));

				data.setLabelCode(data.getTagId());
				data.setLabelType(data.getTagType());
				data.setMonitorFlag(data.getInOut());
				data.setMonitorTime(data.getTime());
				return true;
			} else {
				logger.warn("未查询到RFID基站[" + data.getDeviceId() + "]信息...");
			}
			
		} catch (Exception e) {
			logger.error("[基站信息] 根据RFID查询数据失败:{}",e.getMessage());
		}
		return false;
	}


	/**
	 * 数据填充(查询罪犯信息)
	 * @param data 前置机推送数据
	 * @param feMessageHeader 消息头
	 * @return FeRfidMessageBean
	 */
	private boolean queryBindPeople(FeRfidMessageBean data){
		Map<String, Object> bindData = null;

		try {
			bindData = RFIDLabelPeopleBindCache.getRfidBindPeople(data.getCusNumber(), data.getTagId());

			if (bindData != null) {
				data.setPeopleId(Tools.toStr(bindData.get("people_id")));	
				data.setPeopleName(Tools.toStr(bindData.get("people_name")));
				data.setPeopleType(Tools.toStr(bindData.get("people_type")));
				return true;
			} else {
				logger.warn("RFID标签[" + data.getTagId() + "]未绑定人员信息...");
			}
		} catch (Exception e) {
			logger.error("根据RFID标签查询绑定人员信息异常：" + e.getMessage());
		}
		return false;
	}



	/**
	 * rfid数据入库
	 * @param data
	 * @return
	 */
	private boolean insertDate(FeRfidMessageBean data){
		try {
			String recordTime = RFIDCommonUtil.getPresentTime();
			data.setRecordTime(recordTime); // 设置记录时间
			
			String recordId = null;
			try {
				recordId = sequenceUtil.getSequence("DVC_RFID_MONITOR_RECORD", "RMR_RECORD_ID");
			} catch (Exception e) {
				logger.error("[基站信息记录] 函数获取recordId失败，改为时间戳id:{}", e.getMessage());
				recordId = RFIDCommonUtil.getRecordId();
			}
			data.setRecordId(recordId); // 设置记录编号
			
			RFIDRecordService.putRecord(data); // 将数据记入入库缓存中
			
			RFIDRecordService.putNewestRecord(data); // 将最新记录记入缓存中
			
			return true;
		} catch (Exception e) {
			logger.error("[基站信息记录] 数据入缓存失败:{}", e.getMessage());
		}
		return false;
	}
}














