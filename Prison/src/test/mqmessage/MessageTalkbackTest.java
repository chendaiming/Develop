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
public class MessageTalkbackTest {
	static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static Integer cusNumber = 3223;		// 机构号需要修改
	static String tcpAddr = "tcp://192.168.3.100:8001";	// TCP 地址需要修改（改成测试的MQ地址）
	static String msgType = "FIGHTTALK001";				// 消息类型
	static String callId = "1";							// 呼叫对讲
	static String recId = "3";							// 接收对讲

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {

			String msgId = new SimpleDateFormat("yyyyMMddHHmmssss").format(new Date().getTime());
			String newDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			JSONObject body = null;	// 对讲结束

			//报警
			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID(msgId);
			msgHeader.setMsgType(msgType);
			msgHeader.setLength(12);
			msgHeader.setSender("fightTalk");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);

			switch (msgType) {
				case "FIGHTTALK001": body = FIGHTTALK001(); break;
				case "FIGHTTALK002": body = FIGHTTALK002(); break;
			}

			JSONObject reqJSON = new JSONObject();
			reqJSON.put("header", msgHeader);
			reqJSON.put("body", body);

			// Create a ConnectionFactory
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(tcpAddr);
			Connection connection = connectionFactory.createConnection();
			connection.start();

			Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			Destination destination = session.createQueue("queue.fe.talkback.in");
			MessageProducer producer = session.createProducer(destination);
			TextMessage message = session.createTextMessage(reqJSON.toJSONString());
			message.setIntProperty("cusNumber", cusNumber);
			// Tell the producer to send the message

			System.out.println("Sent message：" +  message.getText());
			producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
			producer.send(message);

			// Clean up
			session.close();
			connection.close();
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}

	private static JSONObject FIGHTTALK001 () {
		String callTime = dateFormat.format(new Date());
		String connTime = dateFormat.format(new Date());
		JSONObject body = new JSONObject();
		body.put("callId", callId);
		body.put("recId", recId);
		body.put("callTime", callTime);
		body.put("connTime", connTime);
		body.put("remark", "测试对讲消息");
		return body;
	}

	private static JSONObject FIGHTTALK002 () {
		String endTime = dateFormat.format(new Date());
		JSONObject body = new JSONObject();
		body.put("callId", callId);
		body.put("recId", recId);
		body.put("endTime", endTime);
		body.put("remark", "测试对讲消息");
		return body;
	}
}
