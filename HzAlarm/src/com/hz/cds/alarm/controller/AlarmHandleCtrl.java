package com.hz.cds.alarm.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.amq.service.MqMessageSendService;

@RequestMapping("alarmHandleCtrl")
@Controller
public class AlarmHandleCtrl {

	@Resource
	private MqMessageSendService mqMessageSendService;
	
	@RequestMapping("alarmReport")
	@ResponseBody
	public JSONObject alarmReport (@RequestParam() String alarmMsg) {
		JSONObject reqJSON = JSON.parseObject(alarmMsg);
		JSONObject msgJSON = reqJSON.getJSONObject("msg");

		String cusNumber = reqJSON.getString("cusNumber");
		String msgType = reqJSON.getString("msgType");

		mqMessageSendService.sendInternalWebMessage(msgJSON, cusNumber, msgType);

		JSONObject respJSON = new JSONObject();
		respJSON.put("success", true);

		return respJSON;
	}
}
