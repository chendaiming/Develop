package com.hz.cds.video.test;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.video.message.FePatrolMessageBean;
import com.hz.cds.video.utils.PatrolConstants;
import com.hz.frm.net.netty.bean.MsgHeader;

/**
 * @version 2014-7-26 下午10:13:06
 * 
 */
public class MessagePatrolTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String datetime = dateFormat.format(new Date());

		ActiveMQConnectionFactory connectionFactory = null;
		Connection connection = null;
		Session session = null;
		Destination destination = null;
		MessageProducer producer = null;
		TextMessage message = null;

		JSONObject out = null;		
		MsgHeader pnHeader = null;
		FePatrolMessageBean bean = null;

		Integer cusNumber = 3;
		String dvcId = "103600000003";		// 巡更设备编号
		String tagId = "201512100045";		// 标签 或门禁卡ID （和民警绑定的卡或标签）

		try {
			connectionFactory = new ActiveMQConnectionFactory("tcp://0.0.0.0:8001");
			connection = connectionFactory.createConnection();
			connection.start();

			session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			destination = session.createQueue("queue.fe.patrol.in");
			producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);


			pnHeader = new MsgHeader();
			pnHeader.setMsgID(String.valueOf(new Date().getTime()));
			pnHeader.setMsgType(PatrolConstants.PATROLID);
			pnHeader.setLength(4);
			pnHeader.setSender("巡更系统");
			pnHeader.setRecevier("Plat");
			pnHeader.setSendTime(datetime);

			bean = new FePatrolMessageBean();
			bean.setPatrolDevId(dvcId);
			bean.setPatrolTagId(tagId);
			bean.setPatrolTime(dateFormat.format(new Date()));

			out = new JSONObject();
			out.put("header", pnHeader);
			out.put("body", JSON.toJSONString(bean));

			message = session.createTextMessage(out.toJSONString());
			message.setIntProperty("cusNumber", cusNumber);
			producer.send(message);

			session.close();
			connection.close();
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}

}
