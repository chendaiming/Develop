package com.hz.cds.talkback.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hz.frm.http.HttpGetService;

/**
 * ITC 对讲
 * @author xie.yh 2016.09.05
 *
 */
@Controller
@RequestMapping("itcTalkCtrl")
public class ITCTalkCtrl {
	
	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(ITCTalkCtrl.class);
	@Resource HttpGetService  httpGetService;
	
	@ResponseBody
	@RequestMapping("httpGet")
	public String httpGet (@RequestParam() String url) {
		log.debug("请求的URL:"+url);
		return httpGetService.httpGet(url);
	}
}
