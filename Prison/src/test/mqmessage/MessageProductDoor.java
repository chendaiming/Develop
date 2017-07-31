package test.mqmessage;



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
public class MessageProductDoor {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String dateTime = dateFormat.format(new Date());
			
			// Create a messages
			String text = "";
			String newDate = new SimpleDateFormat("yyyy-MM-dd ").format(new Date());
		
			//门禁刷卡
			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID("201506110000000002");
			msgHeader.setMsgType("DOOR001");
			msgHeader.setLength(4);
			msgHeader.setSender("door");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);
			SimpleDateFormat formated=new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			JSONObject body = new JSONObject();
			body.put("doorId", "123193232_1"); 
			body.put("cardId", "22"); 
			body.put("brushCardTime",formated.format(new Date())); 
			body.put("peopleType","1");
			body.put("inOutFlag","1"); 
			body.put("status","0"); 
			body.put("remark","");

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
			Destination destination = session.createQueue("queue.fe.door.in");
			MessageProducer producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);


			TextMessage message = session.createTextMessage(text);
			message.setIntProperty("cusNumber", 3223);

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
