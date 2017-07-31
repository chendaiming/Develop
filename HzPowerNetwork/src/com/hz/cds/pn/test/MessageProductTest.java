package com.hz.cds.pn.test;



import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.pn.message.FePowerNetworkMessageBean;
import com.hz.cds.pn.utils.PowerNetworkConstants;
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
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			// Create a messages
			Date date = new Date();
			String sendTime = sdf.format(date);
			String text = "";

			//============================== 高压电网测试================================
			MsgHeader pnHeader = new MsgHeader();
			pnHeader.setMsgID(String.valueOf(date.getTime()));
			pnHeader.setMsgType(PowerNetworkConstants.POWER_NETWORK);
			pnHeader.setLength(4);
			pnHeader.setSender("powerNetwork");
			pnHeader.setRecevier("SERVER");
			pnHeader.setSendTime(sendTime);
			
			// Create a ConnectionFactory
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://0.0.0.0:8001");
			//ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("failover:(tcp://10.58.6.105:8001,tcp://10.58.6.106:8001,tcp://10.58.6.107:8001)");
			// Tell the producer to send the message

			System.out.println("Sent message: " +  text);
			for (int i = 0; i < 6; i++) {
				new Timer().schedule(new TimerTask() {
					@Override
					public void run() {
						try {
							Connection connection = connectionFactory.createConnection();
							connection.start();
							Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
							
							
							FePowerNetworkMessageBean bean=new FePowerNetworkMessageBean();
							bean.setCusNumber("3223");
							bean.setPowerNetworkIdnty(String.valueOf((int)(Math.random()*6)+1));
							bean.setPowerNetworkName("1111");
							bean.setIp("192.168.0.1");
							bean.setABoxVoltage("2");
							bean.setBBoxVoltage("3");
							bean.setPowerSourceVoltage(String.valueOf((int)(Math.random()*20)+1));	
							bean.setABoxPowerFlow("6");
							bean.setBBoxPowerFlow("3");
							bean.setPowerSourcePowerFlow(String.valueOf((int)(Math.random()*30)+1));
							bean.setUpdateTime("2014-09-29 13:15:15");
							bean.setStatus("1");
							System.out.println(JSON.toJSONString(bean));

							JSONObject out = new JSONObject();
							out.put("header", pnHeader);
							out.put("body", JSONObject.toJSONString(bean));
							TextMessage message = session.createTextMessage(out.toJSONString());
							message.setIntProperty("cusNumber", 3223);
							//Destination destination = session.createQueue("queue.fe.police.in");
							Destination destination = session.createQueue("queue.fe.powerNetwork.in");
							MessageProducer producer = session.createProducer(destination);
							producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
							producer.send(message);
							session.close();
							connection.close();
						} catch (JMSException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
				}, 0,1000);
			}
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}




}
