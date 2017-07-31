package com.hz.cds.rfid.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;

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
import com.hz.cds.rfid.message.FeRfidMessageBean;
import com.hz.cds.rfid.utils.RFIDConstants;
import com.hz.db.service.IQueryService;
import com.hz.frm.net.netty.bean.MsgHeader;
import com.hz.frm.util.Tools;

@Controller
@RequestMapping("/rfidTestCtrl")
public class RFIDTestCtrl {

	private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static boolean hasStarted = false;
	private static String startTime = "";

	@Resource
	private IQueryService queryService;


	/**
	 * 开始模拟RFID消息
	 */
	@RequestMapping("/start")
	@ResponseBody
	public JSONObject testStart(@RequestParam() String cusNumber, @RequestParam() String sleep){
		JSONObject respJSON = new JSONObject();

		if (!hasStarted) {
			hasStarted = true;
			startTime = dateFormat.format(new Date());

			respJSON.put("startTime", startTime);
			respJSON.put("message", "RFID消息模拟程序启动成功!");

			testMsg(Integer.valueOf(cusNumber), Long.valueOf(sleep));
		} else {
			respJSON.put("startTime", startTime);
			respJSON.put("message", "RFID消息模拟程序已处于运行状态...");
		}

		return respJSON;
	}


	/**
	 * 停止模拟RFID消息
	 */
	@RequestMapping("/stop")
	@ResponseBody
	public JSONObject testStop(){
		JSONObject respJSON = new JSONObject();

		if (hasStarted) {
			hasStarted = false;
			respJSON.put("stopTime", dateFormat.format(new Date()));
			respJSON.put("message", "RFID消息模拟程序停止成功!");
		} else {
			respJSON.put("message", "RFID消息模拟程序未启动...");
		}

		return respJSON;
	}
	
	
	private void testMsg (Integer cusNumber, Long sleep) {
		Thread tt = new Thread(new Runnable() {
			@Override
			public void run() {
				// TODO Auto-generated method stub
				List<Map<String, Object>> labelListMap = null;
				List<Map<String, Object>> rfidListMap = null; 

				List<String> labelList = new ArrayList<String>();
				List<String> rfidList = new ArrayList<String>();

				String datetime = dateFormat.format(new Date());
				Random random = new Random();

				ActiveMQConnectionFactory connectionFactory = null;
				Connection connection = null;
				Session session = null;
				Destination destination = null;
				MessageProducer producer = null;
				TextMessage message = null;

				JSONObject msgJSON = null;		
				MsgHeader msgHead = null;
				FeRfidMessageBean msgBody = null;

				String msgId = "20170420";
				String tid = "";
				String did = "";

				int index = 100000001;
				int num = 0;
				int numA = 0;
				int numB = 0;
				

				try {
					labelListMap = queryService.query("select_rfid_bind_people_info_for_cache", null);
					rfidListMap = queryService.query("select_rfid_base_info_for_cache", null);

					for(Map<String, Object> map : labelListMap) {
						labelList.add(Tools.toStr(map.get("label_id")));
					}

					for(Map<String, Object> map : rfidListMap) {
						rfidList.add(Tools.toStr(map.get("rfid_oid")));
					}

					connectionFactory = new ActiveMQConnectionFactory("tcp://0.0.0.0:8001");
					connection = connectionFactory.createConnection();
					connection.start();

					session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
					destination = session.createQueue("queue.fe.rfid.in");
					producer = session.createProducer(destination);
					producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);


					msgHead = new MsgHeader();
					msgHead.setMsgType(RFIDConstants.RFID);
					msgHead.setLength(50);
					msgHead.setSender("秀派RFID服务");
					msgHead.setRecevier("Plat");
					msgHead.setSendTime(datetime);

					msgBody = new FeRfidMessageBean();
					msgBody.setTagType("1");	//  1，手环  2，卡片
					msgBody.setOldDeviceId("0");
					msgBody.setInOut("1");


					while(hasStarted) {
						num = random.nextInt(labelList.size());
						while(numA == num) {
							num = random.nextInt(labelList.size());
						}
						numA = num;
						tid = labelList.get(numA);
						
						num = random.nextInt(rfidList.size());
						while(numB == num) {
							num = random.nextInt(rfidList.size());
						}
						numB = num;
						did = rfidList.get(numB);
						System.out.println("发送 --> RFID标签编号：" + tid + "， RFID设备编号：" + did);

						msgHead.setMsgID(msgId + index++);

						msgBody.setTagId(tid);
						msgBody.setDeviceId(did);
						msgBody.setTime(dateFormat.format(new Date()));

						msgJSON = new JSONObject();
						msgJSON.put("header", msgHead);
						msgJSON.put("body", JSON.toJSONString(msgBody));

						message = session.createTextMessage(msgJSON.toJSONString());
						message.setIntProperty("cusNumber", cusNumber);
						producer.send(message);

						Thread.sleep(sleep);
					}

					session.close();
					connection.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
		tt.setPriority(Thread.NORM_PRIORITY);
		tt.start();
	}
}
