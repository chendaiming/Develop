package com.hz.cds.LED.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.hz.cds.LED.service.LEDService;


@RequestMapping("LEDCtrl")
@Controller
public class LEDCtrl {

	@Autowired
	private LEDService ledService;

	@RequestMapping("sendMsg")
	@ResponseBody
	public JSONObject sendMsg (@RequestParam() String cusNumber, @RequestParam() String msgBody) {
		JSONObject respJSON = new JSONObject();
		respJSON.put("result", "SUCCESS");

		ledService.sendToMq(cusNumber, msgBody);

		return respJSON;
	}
}
