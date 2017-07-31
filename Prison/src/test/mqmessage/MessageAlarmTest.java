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
public class MessageAlarmTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyyMMddHHmmssss");
			String dateTime = dateFormat.format(new Date());
			String msgId = dateFormat1.format(new Date());
			String tcpAddr = "tcp://192.168.3.100:8001";	// TCP 地址需要修改（改成测试的MQ地址）
			String alarmId = "224";							// 报警器编号需要修改（改成测试的报警器编号）
			Integer cusNumber = 3223;						// 机构号

			// Create a messages
			String text = "";
			String newDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

			//报警
			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID(msgId);
			msgHeader.setMsgType("Alarm001");
			msgHeader.setLength(4);
			msgHeader.setSender("alarm");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);

			JSONObject body = new JSONObject();
			body.put("alarmID", alarmId); 		
			body.put("alarmDeviceType", "6"); 
			body.put("alarmType","1"); 			// 报警类型
			body.put("alarmTime", dateTime);
			body.put("alarmAction","1"); 
			body.put("remark","1"); //关联门禁编号

			JSONObject out = new JSONObject();
			out.put("header", msgHeader);
			out.put("body", body.toJSONString());
			text = out.toJSONString();

			// Create a ConnectionFactory
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(tcpAddr);
			Connection connection = connectionFactory.createConnection();
			connection.start();

			Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			Destination destination = session.createQueue("queue.fe.alertor.in");
			MessageProducer producer = session.createProducer(destination);
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);

			TextMessage message = session.createTextMessage(text);
			message.setIntProperty("cusNumber", cusNumber);
			// Tell the producer to send the message

			System.out.println("Sent message: " +  text);
			for(int i=0;i<1;i++){
				producer.send(message);
			}
			

			// Clean up
			session.close();
			connection.close();
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}

}
