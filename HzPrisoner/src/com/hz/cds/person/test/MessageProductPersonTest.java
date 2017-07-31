package com.hz.cds.person.test;



import java.text.SimpleDateFormat;
import java.util.Date;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.netty.bean.MsgHeader;

/**
 * @version 2014-7-26 下午10:13:06
 * 
 */
public class MessageProductPersonTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String dateTime = dateFormat.format(new Date());
			
			// Create a messages
			String text = "";
			String newDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			
			//人脸识别
			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID("201506110000000002");
			msgHeader.setMsgType("PERSON001");
			msgHeader.setLength(4);
			msgHeader.setSender("PERSON");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);
			System.out.println("--------------->"+newDate);
			
//			String imgFile = "d:\\11.jpg";// 待处理的图片
//			InputStream in = new FileInputStream(imgFile);
//			System.out.println("#######################"+in.available());
//			byte[] data = new byte[in.available()];
//			in.read(data);
//			in.close();
//			
//			String str =Base64.encode(data);
//			System.out.println("??????????????????"+str);
			JSONObject body = new JSONObject();
			body.put("personId", "1"); //测试数据--->3223014:犯人编号。 3201001：警员编号322300001
			body.put("personType", "1"); //人员类型---》0：犯人 1：警员
			body.put("cameraId", "38"); 
			body.put("personDataImg", ""); 
			body.put("personNowImg", ""); 
			body.put("sendTime", newDate); 

			JSONObject out = new JSONObject();
			out.put("header", msgHeader);
			out.put("body", body.toJSONString());
			text=out.toJSONString();

			// Create a ConnectionFactory
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://0.0.0.0:8001");
			//ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("failover:(tcp://10.58.6.105:8001,tcp://10.58.6.106:8001,tcp://10.58.6.107:8001)");
			Connection connection = connectionFactory.createConnection();
			connection.start();
			Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			//Destination destination = session.createQueue("queue.fe.police.in");
			//Destination destination = session.createQueue("queue.fe.door.in");
			Destination destination = session.createQueue("queue.fe.person.in");
			MessageProducer producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);


			TextMessage message = session.createTextMessage(text);
			message.setIntProperty("cusNumber", 3);

			System.out.println("Sent message: " +  text);
			//for(int i=0;i<40;i++){
				producer.send(message);
			//}
			

			// Clean up
			session.close();
			connection.close();
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}

}
