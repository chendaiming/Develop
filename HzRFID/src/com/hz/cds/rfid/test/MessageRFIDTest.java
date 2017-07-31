package com.hz.cds.rfid.test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

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
public class MessageRFIDTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String datetime = dateFormat.format(new Date());
		Random random = new Random();

		ActiveMQConnectionFactory connectionFactory = null;
		Connection connection = null;
		Session session = null;
		Destination destination = null;
		MessageProducer producer = null;
		TextMessage message = null;

		JSONObject out = null;		
		MsgHeader pnHeader = null;
		FeRfidMessageBean bean = null;

		try {
			connectionFactory = new ActiveMQConnectionFactory("tcp://0.0.0.0:8001");
			connection = connectionFactory.createConnection();
			connection.start();

			session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			destination = session.createQueue("queue.fe.rfid.in");
			producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);

			//手环绑定编号
			String[] tids = new String[]{"10001","10002","10003","10005","10007","10010","10012","10015","10021","10024","10031","10035","10051", "20100", "20101"};
			//第三方基站编号
			String[] dids = new String[]{"10026","10036","10048","10030","10051","10044","10014","10008","10002","10044","10020","10001","10030", "10004", "10006"};

			Integer cusNumber = 3;
			String tid = "";
			String did = "";
			int num = 0;
			int num1 = 0;
			int num2 = 0;

			pnHeader = new MsgHeader();
			pnHeader.setMsgID(String.valueOf(new Date().getTime()));
			pnHeader.setMsgType(RFIDConstants.RFID);
			pnHeader.setLength(4);
			pnHeader.setSender("秀派RFID服务");
			pnHeader.setRecevier("Plat");
			pnHeader.setSendTime(datetime);

			bean = new FeRfidMessageBean();
			bean.setTagType("1");	//  1，手环  2，卡片
			bean.setOldDeviceId("0");
			bean.setInOut("1");


			for(int i = 0; i < 100000; i++) {

				num = random.nextInt(tids.length);
				while(num1 == num) {
					num = random.nextInt(tids.length);
				}
				num1 = num;
				System.out.println("num1 = " + num1);
				tid = tids[num1];
				
				num = random.nextInt(dids.length);
				while(num2 == num) {
					num = random.nextInt(dids.length);
				}
				num2 = num;
				System.out.println("num2 = " + num2);
				did = dids[num2];

				pnHeader.setMsgID(String.valueOf(new Date().getTime()) + i);

				bean.setTagId(tid);
				bean.setDeviceId(did);
				bean.setTime(dateFormat.format(new Date()));

				out = new JSONObject();
				out.put("header", pnHeader);
				out.put("body", JSON.toJSONString(bean));

				message = session.createTextMessage(out.toJSONString());
				message.setIntProperty("cusNumber", cusNumber);
				producer.send(message);

				Thread.sleep(500l);
			}

			session.close();
			connection.close();
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}

}
