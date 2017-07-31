package com.hz.cds.callroll.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.callroll.message.CallRollMessageProcess;
import com.hz.cds.callroll.service.CallRollHandleService;


@RequestMapping("callrolltest")
@Controller
public class CallRollTest {
	// 日志
	private static final Logger log = LoggerFactory.getLogger(CallRollTest.class);

	@Autowired
	private CallRollHandleService callRollHandleService;

	@Autowired
	private CallRollMessageProcess callRollMessageProcess;


	@RequestMapping(value="test", method=RequestMethod.POST)
	@ResponseBody
	public JSONObject testData (@RequestParam() String action, @RequestParam() String params) {
		JSONObject reqJSON = JSON.parseObject(params);
		JSONObject respJSON = new JSONObject(); 

		String cusNumber = "";
		String recordId = "";
		String prisonerId = "";
		try {
			switch (action) {
				case "BEGIN":
					callRollHandleService.addCallRollMaster(reqJSON);

					cusNumber = reqJSON.getString("crm_cus_number");
					recordId = reqJSON.getString("crm_record_id");
					callRollMessageProcess.sendCallRollBeginMsg(cusNumber, recordId);
					break;

				case "CALL":
					callRollHandleService.addCallRollDtls(reqJSON); 

					cusNumber = reqJSON.getString("crd_cus_number");
					recordId = reqJSON.getString("crd_record_id");
					prisonerId = reqJSON.getString("crd_prisoner_id");
					callRollMessageProcess.sendCallRollingMsg(cusNumber, recordId, prisonerId);
					break;

				case "END":
					callRollHandleService.updateCallRollMaster(reqJSON); 

					cusNumber = reqJSON.getString("crm_cus_number");
					recordId = reqJSON.getString("crm_record_id");
					callRollMessageProcess.sendCallRollEndMsg(cusNumber, recordId);
					break;

				default: break;
			}
		} catch (Exception e) {
			log.error("测试异常：", e);
		}
		respJSON.put("success", "true");

		return reqJSON;
	}
}
