package com.hz.cds.infopublish.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.http.HttpGetService;
import com.hz.frm.http.HttpPostService;


@Controller
@RequestMapping("infopublishHttpCtrl")
public class InfopublishHttpCtrl {
	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(InfopublishHttpCtrl.class);
	@Resource HttpPostService httpPostService;
	@Resource HttpGetService httpGetService;
	
	@ResponseBody
	@RequestMapping("deviceList")
	public String getDeviceList (@RequestParam() String url) {
		log.debug("信息发布==>请求终端列表");
		String str =  httpGetService.httpGet(url);
		JSONObject json = JSONObject.parseObject(str);
		return json.toJSONString();
	}
	
	@ResponseBody
	@RequestMapping("httpPost")
	public String httpPost (@RequestParam() String url,@RequestParam() String param) {
		log.debug("信息发布==>HTTP POST请求:"+url + ',' + param);
		String str =  httpPostService.httpPost(url, param);
		JSONObject json = JSONObject.parseObject(str);
		return json.toJSONString();
	}
	
}
