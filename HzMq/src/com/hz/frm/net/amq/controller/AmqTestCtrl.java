package com.hz.frm.net.amq.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.Resource;
import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.amq.service.MqMessageSendService;

@RequestMapping("amqTestCtrl")
@Controller
public class AmqTestCtrl {
	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Resource
	private MqMessageSendService mqMessageSendService;
	
	@RequestMapping("send")
	@ResponseBody
	public JSONObject send (@RequestParam() String args) {
		JSONObject reqJSON = JSON.parseObject(args);
		JSONObject respJSON = new JSONObject();

		ActiveMQConnectionFactory connectionFactory = null;
		Connection connection = null;

		Destination destination = null;
		MessageProducer producer = null;
		Session session = null;
		TextMessage message = null;

		try {
			connectionFactory = new ActiveMQConnectionFactory(reqJSON.getString("tcpUrl"));
			connection = connectionFactory.createConnection();
			connection.start();

			session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			message = session.createTextMessage(reqJSON.getString("message"));
			message.setIntProperty("cusNumber", reqJSON.getIntValue("cusNumber"));

			destination = session.createQueue(reqJSON.getString("queueName"));
			producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
			producer.send(message);

			// Clean up
			session.close();
			connection.close();
			respJSON.put("result", "success");
		} catch (Exception e) {
			e.printStackTrace();
			respJSON.put("result", e.getMessage());
		}
		respJSON.put("time", sdf.format(new Date()));
		return respJSON;
	}
}
