package com.hz.cds.talkback.message;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.talkback.util.TalkbackConstants;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IQueryService;
import com.hz.db.service.IUpdateService;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.Tools;

@Service
public class TalkbackMessageProcess extends FeMessageProcessAbstract<TalkbackMessageBean> {
	// 日志对象
	private static final Logger logger = LoggerFactory.getLogger(TalkbackMessageProcess.class);

	@Autowired
	private IQueryService queryService;

	@Autowired
	private IUpdateService updateService;

	@Resource
	private MqMessageSendService mqMessageSendService;

	@Override
	public Class<TalkbackMessageBean> getBodyClass() {
		return TalkbackMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader msgHead, TalkbackMessageBean msgBody) {
		switch(msgHead.getMsgType()) {
			case TalkbackConstants.FIGHTTALK001: 
				fightTalkCall(msgHead, msgBody);
				break;
			case TalkbackConstants.FIGHTTALK002: 
				fightTalkOver(msgHead, msgBody);
				break;
			default: 
				logger.warn("无法处理该消息：未定义的对讲消息类型!");
				logger.warn("无法处理该消息 --> msgHead=" + JSON.toJSONString(msgHead));
				logger.warn("无法处理该消息 --> msgBody=" + JSON.toJSONString(msgBody));
				break;
		}
	}


	/**
	 * 受虐对讲呼叫处理
	 * @param msgHead
	 * @param msgBody
	 */
	private void fightTalkCall (FeMessageHeader msgHead, TalkbackMessageBean msgBody) {
		List<Object> params = new ArrayList<Object>();
		List<Map<String, Object>> queryResult = null;
		JSONObject paramsKey = null;

		try {
			// 查询对讲设备的条件参数
			params = new ArrayList<Object>();
			params.add(msgHead.getCusNumber());
			params.add(msgBody.getCallId());
			params.add(msgBody.getRecId());

			// 查询对讲设备信息
			queryResult = queryService.query("select_talkback_for_message_handle", "0", params);

			// 插入对讲记录表的数据参数
			paramsKey = new JSONObject();
			paramsKey.put("frd_cus_number", msgHead.getCusNumber());
			paramsKey.put("frd_fighttalk_id", "");
			paramsKey.put("frd_call_talk_id", msgBody.getCallId());
			paramsKey.put("frd_receive_talk_id", msgBody.getRecId());
			paramsKey.put("frd_start_time", msgBody.getCallTime());
			paramsKey.put("frd_connect_time", msgBody.getConnTime());
			paramsKey.put("frd_crte_user_id", "-1");
			paramsKey.put("frd_updt_user_id", "-1");

			// 设置对讲设备的部门区域信息
			if (queryResult != null) {
				String talkbackId = null;

				for(Map<String, Object> map : queryResult) {
					talkbackId = Tools.toStr(map.get("id"), "");

					if (talkbackId.equals( msgBody.getCallId() )){
						paramsKey.put("frd_call_talk_name", map.get("name"));
						paramsKey.put("frd_call_dept_id", map.get("dept_id"));
						paramsKey.put("frd_call_dept_name", map.get("dept_name"));
						paramsKey.put("frd_call_area_id", map.get("area_id"));
						paramsKey.put("frd_call_area_name", map.get("area_name"));
					} else if (talkbackId.equals( msgBody.getRecId() )) {
						paramsKey.put("frd_receive_talk_name", map.get("name"));
						paramsKey.put("frd_receive_dept_id", map.get("dept_id"));
						paramsKey.put("frd_receive_dept_name", map.get("dept_name"));
						paramsKey.put("frd_receive_area_id", map.get("area_id"));
						paramsKey.put("frd_receive_area_name", map.get("area_name"));
					}
				}
			}

			// 消息记录入库
			UpdateResp resp = updateService.updateByParamKey("insert_fighttalk_record_for_message_handle", paramsKey);
			if (resp != null && resp.getSuccess()) {
				logger.info("受虐对讲呼叫记录入库 --> 入库成功，记录编号=" + paramsKey.get("frd_fighttalk_id"));
			} else {
				logger.warn("受虐对讲呼叫记录入库 --> 入库失败!");
				logger.warn("受虐对讲呼叫记录入库 --> 入库数据=" + JSON.toJSONString(paramsKey));
			}

		} catch (Exception e) {
			logger.error("受虐对讲呼叫记录入库 --> 入库异常：", e);
			logger.error("受虐对讲呼叫记录入库 --> 入库数据查询条件=" + JSON.toJSONString(params));
			logger.error("受虐对讲呼叫记录入库 --> 入库数据=" + JSON.toJSONString(paramsKey));

		} finally {
			
			/*
			 * 查询联动设备发送到web前端
			 */
			JSONObject jsonObj = null;
			List<Map<String, Object>> linkDvcList = null;
			List<Map<String, Object>> pointViewList = null;

			// 查询关联设备
			try {
				params = new ArrayList<Object>();
				params.add(msgHead.getCusNumber());
				params.add(msgBody.getCallId());

				linkDvcList = queryService.query("select_talkback_link_dvc_for_message_handle", params);
				pointViewList = queryService.query("select_talkback_point_view_for_message_handle", "0", params);

				jsonObj = new JSONObject();
				jsonObj.put("baseInfo", paramsKey);
				jsonObj.put("linkDvcs", linkDvcList);
				jsonObj.put("pointView", pointViewList);

				mqMessageSendService.sendInternalWebMessage(jsonObj, msgHead.getCusNumber(), msgHead.getMsgType());
			} catch (Exception e) {
				logger.error("受虐对讲呼叫联动处理 --> 查询联动设备异常：", e);
				logger.error("受虐对讲呼叫联动处理 --> 查询条件=" + JSON.toJSONString(params));
			}
		}
	}


	/**
	 * 受虐对讲结束处理
	 * @param msgHead
	 * @param msgBody
	 */
	private void fightTalkOver (FeMessageHeader msgHead, TalkbackMessageBean msgBody) {
		List<Map<String, Object>> queryResult = null;
		JSONArray params = null;
		UpdateResp updateResp = null;
		Object recordId = null;
		String endTime = null;

		try {
			params = new JSONArray();
			params.add(msgHead.getCusNumber());
			params.add(msgBody.getCallId());
			params.add(msgBody.getRecId());

			queryResult = queryService.query("select_fighttalk_record_id_for_update", params);

			if (queryResult != null) {

				if (queryResult.size() > 0) {
					recordId = queryResult.get(0).get("frd_fighttalk_id");	// 获取记录编号
					endTime = Tools.toStr(queryResult.get(0).get("frd_end_time"), "");

					if (endTime.length() == 0) {
						params = new JSONArray();
						params.add(msgBody.getEndTime());
						params.add(recordId);

						updateResp = updateService.update(params, "update_fighttalk_record_for_message_handle", null);
						if (updateResp != null && updateResp.getSuccess()) {
							logger.info("受虐对讲结束记录更新 --> 更新成功，记录编号=" + recordId);
						} else {
							logger.warn("受虐对讲结束记录更新 --> 更新失败!");
							logger.warn("受虐对讲结束记录更新 --> 更新数据=" + JSON.toJSONString(params));
						}
					} else {
						logger.warn("受虐对讲结束记录更新 --> 查询到受虐对讲记录，该记录已标记为结束对讲，记录编号=" + recordId + "，结束时间=" + endTime);
						logger.warn("受虐对讲结束记录更新 --> 查询条件=" + JSON.toJSONString(params));
					}

				} else {
					logger.warn("受虐对讲结束记录更新 --> 未查询到近期的对讲呼叫记录!");
					logger.warn("受虐对讲结束记录更新 --> 查询条件=" + JSON.toJSONString(params));
				}

			} else {
				logger.warn("受虐对讲结束记录更新 --> 查询呼叫记录异常!");
				logger.warn("受虐对讲结束记录更新 --> 查询条件=" + JSON.toJSONString(params));
			}
		} catch (Exception e) {
			logger.error("受虐对讲结束记录更新 --> 更新异常：", e);
			logger.error("受虐对讲结束记录更新 --> 异常数据=" + JSON.toJSONString(params));
		}
	}
}