package com.hz.cds.LED.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.LED.utils.LEDConstants;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.net.netty.bean.MsgHeader;

@Service
public class LEDService {
	private static final Logger logger = LoggerFactory.getLogger(LEDService.class);
	private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssss");
	private static SimpleDateFormat dateFormatYMD = new SimpleDateFormat("yyyy-MM-dd");

	private static Map<String, String> alarmMap = new HashMap<String, String>();

	@Resource
	private MqMessageSendService mqMessageSendService;


	public void sendToMq (String cusNumber, String body) {
		Date date = new Date();
		String msgId = dateFormat.format(date);
		String newDate = dateFormatYMD.format(date);

		JSONObject msgBody = JSON.parseObject(body);
		String ledId = msgBody.getString("ledId");
		String text = msgBody.getString("content");

		// TODO: 临时处理 - 在显示了报警信息的LED上不在显示其它信息，直到取消了报警
		if (alarmMap.containsKey(ledId)) {
			if (alarmMap.get(ledId).equals(text)) {	// 相同的报警消息不处理
				return;
			}

			if (text.indexOf("报警") > 0) {		// 如果是已经报警的LED可以被其它报警覆盖
				alarmMap.put(ledId, text);
			} else if (text.equals("时间")) {	// 如果消息="时间"则表示取消报警
				logger.info("LED设备[" + ledId + "]已取消报警消息显示...");
				msgBody.put("remark", alarmMap.get(ledId) + "已取消");
				alarmMap.remove(ledId);
			} else {
				logger.info("LED设备[" + ledId + "]正在显示报警消息，其它消息暂时不处理...");
				return;							// 现在报警消息的LED不在显示其他信息
			}
		} else {
			if (text.indexOf("报警") > 0) {
				alarmMap.put(ledId, text);
			}
		}


		//报警
		MsgHeader msgHeader = new MsgHeader();
		msgHeader.setMsgID(msgId);
		msgHeader.setMsgType(LEDConstants.MSGTYPE);
		msgHeader.setLength(msgBody.size());
		msgHeader.setSender("HZLED");
		msgHeader.setRecevier("");
		msgHeader.setSendTime(newDate);

		// LED那边是按这样的格式解析的
		JSONObject reqJSON = new JSONObject();
		reqJSON.put("header", JSON.toJSONString(msgHeader));
		reqJSON.put("body", msgBody.toJSONString());

		mqMessageSendService.sendFeMessage(reqJSON.toJSONString(), cusNumber);
	}
}
