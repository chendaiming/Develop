package com.hz.cds.callroll.message;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.hz.cds.callroll.service.CallRollHandleService;
import com.hz.cds.callroll.utils.CallRollConstants;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;

@Service
public class CallRollMessageProcess extends FeMessageProcessAbstract<JSONObject> {

	// 日志对象
	private static final Logger logger = LoggerFactory.getLogger(CallRollMessageProcess.class);


	@Resource
	private MqMessageSendService mqMessageSendService;

	@Resource
	private CallRollHandleService callRollHandleService;


	@Override
	public Class<JSONObject> getBodyClass() {
		return JSONObject.class;
	}

	@Override
	protected void process(FeMessageHeader feMessageHeader, JSONObject msgBody) {
		logger.info("点名消息处理...");
	}




	/**
	 * 发送开始点名消息
	 * @param cusNumber 机构号
	 * @param recordId	记录编号
	 */
	public void sendCallRollBeginMsg (String cusNumber, String recordId) {
		this.sendMsgToWeb(cusNumber, CallRollConstants.CALLROLL_BEGIN, callRollHandleService.queryCallRollMaster(cusNumber, recordId));
	}


	/**
	 * 发送点名人员信息
	 * @param cusNumber 机构号
	 * @param recordId	记录编号
	 * @param prisonerId 被点人员编号（罪犯编号）
	 */
	public void sendCallRollingMsg (String cusNumber, String recordId, String prisonerId) {
		this.sendMsgToWeb(cusNumber, CallRollConstants.CALLROLL_ING, callRollHandleService.queryCallRollDtls(cusNumber, recordId, prisonerId));
	}


	/**
	 * 发送点名结束消息
	 * @param cusNumber 机构号
	 * @param recordId	记录编号
	 */
	public void sendCallRollEndMsg (String cusNumber, String recordId) {
		this.sendMsgToWeb(cusNumber, CallRollConstants.CALLROLL_END, callRollHandleService.queryCallRollMaster(cusNumber, recordId));
	}


	/**
	 * 发送消息给WEB端
	 * @param cusNumber
	 * @param msgType
	 * @param msgBody
	 */
	public void sendMsgToWeb (String cusNumber, String msgType, Object msgBody) {
		mqMessageSendService.sendInternalWebMessage(msgBody, cusNumber, msgType);
	}
}
