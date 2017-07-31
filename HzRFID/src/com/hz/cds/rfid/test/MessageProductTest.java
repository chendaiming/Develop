package com.hz.cds.rfid.test;

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
import com.hz.cds.rfid.message.FeRfidMessageBean;
import com.hz.cds.rfid.utils.RFIDConstants;
import com.hz.frm.net.netty.bean.MsgHeader;

/**
 * @version 2014-7-26 下午10:13:06
 * 
 */
public class MessageProductTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {

			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://0.0.0.0:8001");
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String datetime = dateFormat.format(new Date());

			Integer cusNumber = 3223;
			String tagType = "1";
			String tagId = "457577";	// rfid标签编号
			String dvcId = "10001"; // 基站编号

			MsgHeader pnHeader = new MsgHeader();
			pnHeader.setMsgID(String.valueOf(new Date().getTime()));
			pnHeader.setMsgType(RFIDConstants.RFID);
			pnHeader.setLength(4);
			pnHeader.setSender("RFID");
			pnHeader.setRecevier("SERVER");
			pnHeader.setSendTime(datetime);

			Connection connection = connectionFactory.createConnection();
			connection.start();
			Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

			FeRfidMessageBean bean = new FeRfidMessageBean();
			bean.setTagType(tagType);	//  1，手环  2，卡片
			bean.setTagId(tagId);// 绑定手环/卡片 编号
			bean.setDeviceId(dvcId); // RFID编号
			bean.setOldDeviceId(null);
			bean.setInOut("1");
			bean.setTime(dateFormat.format(new Date()));

			JSONObject out = new JSONObject();
			out.put("header", pnHeader);
			out.put("body", JSON.toJSONString(bean));
			TextMessage message = session.createTextMessage(out.toJSONString());
			message.setIntProperty("cusNumber", cusNumber);

			Destination destination = session.createQueue("queue.fe.rfid.in");
			MessageProducer producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
			producer.send(message);
			session.close();
			connection.close();
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}

}
