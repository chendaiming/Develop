package com.hz.frm.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.util.Tools;
import com.hz.frm.utils.SequenceUtil;

@RequestMapping("seqCtrl")
@Controller
public class SequenceCtrl {

	private static final Logger log = LoggerFactory.getLogger(SequenceCtrl.class);

	@Resource
	private SequenceUtil sequenceUtil;

	@RequestMapping("getSeq")
	@ResponseBody
	public JSONObject getSeq(@RequestParam String tableName, @RequestParam String columnName) {
		JSONObject respJSON = new JSONObject();

		// 返回序列号，没有则表示获取序列号失败
		respJSON = new JSONObject();
		respJSON.put("msg", "");
		respJSON.put("seq", "");

		try {
			respJSON.put("seq", sequenceUtil.getSequence(tableName, columnName));
		} catch (Exception e) {
			log.error("生成表" + tableName + "字段" + columnName + "的序列号异常：", e);
			respJSON.put("msg", e.getMessage());
		}

		return respJSON;
	}

	@RequestMapping("getSeqList")
	@ResponseBody
	public JSONObject getSeqList(@RequestParam String tableName, @RequestParam String columnName, @RequestParam String number) {
		JSONObject respJSON = new JSONObject();

		// 返回序列号，没有则表示获取序列号失败
		respJSON = new JSONObject();
		respJSON.put("msg", "");
		respJSON.put("seqList", "");

		try {
			respJSON.put("seqList", sequenceUtil.getSequences(tableName, columnName, Tools.toInt(number)));
		} catch (Exception e) {
			log.error("生成表" + tableName + "字段" + columnName + "的序列号异常：", e);
			respJSON.put("msg", e.getMessage());
		}

		return respJSON;
	}
}
