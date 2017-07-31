package com.hz.cds.video.message;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.db.service.IQueryByParamKeyService;
import com.hz.db.service.IUpdateService;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;

/**
 * 
 * 
 * @author 
 *
 * @date 2017年01月16日
 */
@Service
@Transactional
public class FePatrolMessageProcess extends FeMessageProcessAbstract<FePatrolMessageBean> {
	private static final Logger logger = LoggerFactory.getLogger(FePatrolMessageProcess.class);

	@Resource
	private MqMessageSendService mqMessageSendService;

	@Resource
	private IQueryByParamKeyService queryService;

	@Resource
	private IUpdateService updateService;

	@Override
	public Class<FePatrolMessageBean> getBodyClass() {
		return FePatrolMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader feMessageHeader, FePatrolMessageBean msgBody) {
		String cusNumber = feMessageHeader.getCusNumber();
		String tagId = msgBody.getPatrolTagId();
		String sendJsonString = "";

		Map<String,Object> queryMap = null;

		try {
			msgBody.setCusNumber(cusNumber);

			// 查询绑定标签的民警信息
			queryMap = getPoliceIdByDoorTagId(tagId, cusNumber);
			if (queryMap != null) {
				msgBody.setPoliceId(queryMap.get("people_id").toString());
			}

			// 查询线路信息
			queryMap = getLineId(msgBody.getPatrolDevId(), cusNumber);
			if (queryMap != null) {
				msgBody.setLineId(queryMap.get("plr_line_id").toString());
			}

			// 插入巡更记录
			insertPatrolRecord(msgBody);

			// 查询巡更记录
			queryMap = getPatrolRecord(cusNumber, msgBody.getLineId());

			//向前端发送消息
			if (queryMap != null) {
				sendJsonString = JSON.toJSONString(queryMap);
				mqMessageSendService.sendInternalWebMessage(sendJsonString, cusNumber, feMessageHeader.getMsgType());
			}
		} catch (Exception e) {
			logger.error("巡更消息处理失败， msgbody=" + JSON.toJSONString(msgBody), e);
		}	
	}


	private Map<String,Object> getPatrolRecord(String cusNumber,String lineId) throws Exception{
		JSONObject params = new JSONObject();
		params.put("cusNumber", cusNumber);
		params.put("lineId", lineId);

		List<Map<String, Object>> resultObj = queryService.query("select_patrol_line_record", "1", params);

		if (resultObj.isEmpty()){
			return null;
		}else{
			return resultObj.get(0);			
		}
	}


	private void insertPatrolRecord(FePatrolMessageBean msgBody) throws Exception{
		updateService.updateByParamKey("insert_patrol_record", (JSONObject)JSON.toJSON(msgBody));
	}


	/**
	 * 根据门禁卡或其他签到设备ID 去 DOR_DOOR_CARD_DTLS 表查询警员编号
	 * @param tagId
	 * @return
	 * @throws Exception 
	 */
	private Map<String,Object> getPoliceIdByDoorTagId(String tagId,String cusNumber) throws Exception{
		JSONObject params = new JSONObject();
		params.put("cusNumber", cusNumber);
		params.put("cardId", tagId);

		List<Map<String, Object>> list = queryService.query("select_police_bydoorordeviceid", params);

		if (list.isEmpty()) 
			return null;

		return list.get(0);
	}


	/**
	 * 
	 * @param getLineId
	 * @return
	 * @throws Exception 
	 */
	private Map<String,Object> getLineId(String pointId,String cusNumber) throws Exception{
		JSONObject param = new JSONObject();
		param.put("cusNumber", cusNumber);
		param.put("pointId", pointId);

		List<Map<String,Object>> list = queryService.query("select_lineid_bypointid", param);

		if (list.isEmpty()) 
			return null;
		return list.get(0);
	}
}
