package test.mqmessage;



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
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String dateTime = dateFormat.format(new Date());
			
			// Create a messages
			String text = "";
			//门禁
		/*	DoorControlBrushCardMessage dcmsg=new DoorControlBrushCardMessage();
			dcmsg.setCusNumber(1);
			dcmsg.setMsgType(1001);
			dcmsg.setDoorControlIdentify("35532");
			dcmsg.setDoorIdentify("3333");
			dcmsg.setAddress("192.18.0.1");
			dcmsg.setCardIdentify("11200173");
			dcmsg.setInOutFlag(1);
			dcmsg.setBrushCardTime(dateTime);
			dcmsg.setStatus("0");
			//报警
			AlertMessage alertMessage=new AlertMessage();
			alertMessage.setCusNumber("1");
			alertMessage.setAlertLevel("2");
			alertMessage.setAlertorIdentify("10.58.7.134");
			alertMessage.setAlertAction("1");
			alertMessage.setAlertTime(dateTime);
			alertMessage.setAlertType("1");
			alertMessage.setMsgType("801");
			alertMessage.setRemark("5555");
			//外来人员
			ForeignPeopleMessage foreignPeople=new ForeignPeopleMessage();
			foreignPeople.setCusNumber("1");
			foreignPeople.setMsgType("601");
			foreignPeople.setRegisterIdnty("685f1f50-9a0a-4516-86a4-cfaa16024f19");
			foreignPeople.setAccompanyPolice("吕银");
			foreignPeople.setPhone("15800399921");
			foreignPeople.setDirection("一监区");
			foreignPeople.setDriverFlag("");
			foreignPeople.setIdImgDir("");
			foreignPeople.setLocalImgDir("");
			foreignPeople.setName("盛中琼");
			foreignPeople.setCardTypeIndc("1");
			foreignPeople.setCardCode("342423198010061783");
			foreignPeople.setReason("");
			foreignPeople.setOprtnPolice("");
			foreignPeople.setOprtnTime("2014-11-28 08:38:31");
			foreignPeople.setRemark("");
			foreignPeople.setSexIndc(1);
			foreignPeople.setEnterTime("2014-11-28 08:45:17");
			//foreignPeople.setCheckStts("1");
			foreignPeople.setLeaveTime("2014-11-28 16:22:54");*/
/*			String newDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			//民警刷卡
			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID("201506110000000002");
			msgHeader.setMsgType("POLICE001");
			msgHeader.setLength(4);
			msgHeader.setSender("DOOR");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);
			
			JSONObject body = new JSONObject();
			body.put("peopleID", "3236325"); // 人员编号
			body.put("peopleName", "000000"); // 人员姓名
			body.put("peopleType","1"); // 人员类型 1 民警 2 职工 
			//body.put("compareTime",newDate);//进出时间
			body.put("compareTime","2016/09/21 11:53:50");//进出时间
			body.put("inOutFlag","1"); //进出标示   1 进 2出
			//body.put("compareFlag","1"); //比对结果  1 通过  2 不通过
			body.put("doorID","1"); //关联门禁编号
			//body.put("image",image);  //人员图片 比对成功时的图片
			//body.put("image","");  //人员图片 比对成功时的图片

			JSONObject out = new JSONObject();
			out.put("header", msgHeader);
			out.put("body", body.toJSONString());
			text=out.toJSONString();*/
			
			//人员统计
			/*PeopleStatisticalMessage peopleStatistical=new PeopleStatisticalMessage();
			peopleStatistical.setAreaId("1");
			peopleStatistical.setAreaName("一监区");
			peopleStatistical.setCusNumber("1");
			peopleStatistical.setPeopleNum("100");
			peopleStatistical.setMsgType("101");
			
			//零星流动
			SporadicFlowMessage sporadicFlow=new SporadicFlowMessage();
			sporadicFlow.setCusNumber("1");
			sporadicFlow.setMsgType("201");
			sporadicFlow.setCurrentArea("d2c44279-8ccc-4efc-9331-8593ebd28a02");
			sporadicFlow.setEndAddress("00000000-0000-0000-0000-0000000000000");
			sporadicFlow.setFlowDirection("1");
			sporadicFlow.setFlowId("d255dc54-de05-4202-a287-150122d1ffd4");
			sporadicFlow.setFlowType("0");
			sporadicFlow.setReason("去厂房取货");
			sporadicFlow.setStartAddress("00000000-0000-0000-0000-000000000000");
			sporadicFlow.setTime("2014-11-28 17:51:21");
			List<PeopleMessage> pList=new ArrayList<PeopleMessage>();
			PeopleMessage people =new PeopleMessage();
			people.setPeopleId("326100004552");
			people.setPeopleType("1");
			pList.add(people);
			sporadicFlow.setPeopleList(pList);
			
			//点名
			CallNameMessage callName=new CallNameMessage();
			callName.setCusNumber("1");
			callName.setCallId("3000");
			callName.setAreaId("1");
			callName.setAreaName("一监区");
			callName.setStartTime("2014-12-08 17:00:00");
			callName.setEndTime("2014-12-08 18:00:00");
			callName.setTotal("300");
			callName.setCallNum("8");
			callName.setOtherCallNum("10");
			callName.setHospitalNum("1");
			callName.setUncallNum("90");
			callName.setPrisonerId("326100003434");
			callName.setMsgType("301");
			//可视对讲
			TalkMessage talkMessage=new TalkMessage();
			talkMessage.setCusNumber("1");
			talkMessage.setMsgType("501");
			talkMessage.setCallTalkIdentify("2001");
			talkMessage.setReceiveTalkIdentify("2002");
			talkMessage.setTalkTime("2014-10-11 15:15:15");
			talkMessage.setStatus("1");
			//高压电网
			PowerNetworkMessage PowerNetWorkMessage=new PowerNetworkMessage();
			PowerNetWorkMessage.setCusNumber("1");
			PowerNetWorkMessage.setMsgType("901");
			PowerNetWorkMessage.setPowerNetworkIdnty("1132");
			PowerNetWorkMessage.setPowerNetworkName("1111");
			PowerNetWorkMessage.setIp("192.168.0.1");
			PowerNetWorkMessage.setABoxVoltage("3");
			PowerNetWorkMessage.setBBoxVoltage("4");
			PowerNetWorkMessage.setPowerSourceVoltage("20");
			PowerNetWorkMessage.setABoxPowerFlow("6");
			PowerNetWorkMessage.setBBoxPowerFlow("3");
			PowerNetWorkMessage.setPowerSourcePowerFlow("30");
			PowerNetWorkMessage.setUpdateTime("2014-09-29 13:15:15");
			PowerNetWorkMessage.setStatus("1"); 
			
			ForeignCarMessage foreignCarMessage=new ForeignCarMessage();
			foreignCarMessage.setCardIdnty("222");
			foreignCarMessage.setCarLicense("苏BA7358");
			foreignCarMessage.setCarType("1");
			foreignCarMessage.setChassisInImgDir("");
			foreignCarMessage.setChassisOutImgDir("");
			foreignCarMessage.setCheckIdnty("201409150853334");
			foreignCarMessage.setCheckStatus("1");
			foreignCarMessage.setCompany("");
			foreignCarMessage.setCusNumber("1");
			foreignCarMessage.setDriverIdImgDir("");
			foreignCarMessage.setDriverLocalImgDir("");
			foreignCarMessage.setDriverName("陈涛");
			foreignCarMessage.setEnterTime("2014-12-09 13:15:15");
			foreignCarMessage.setInImgDir("");
			foreignCarMessage.setLeadPoliceName("李丽  ");
			//foreignCarMessage.setLeaveTime("2014-12-08 15:15:15");
			foreignCarMessage.setMsgType("1201");
			foreignCarMessage.setOperationPolice("潘国华");
			foreignCarMessage.setOperationTime("2014-12-08 15:15:15");
			foreignCarMessage.setOutImgDir("");
			foreignCarMessage.setOutsideIdnty("266");
			foreignCarMessage.setReason("提货");
			foreignCarMessage.setRegisterIdnty("111111");
			foreignCarMessage.setRemark("");
			foreignCarMessage.setDirection("四监区");
			
			SecurityDoorBean securityDoorBean=new SecurityDoorBean();
			securityDoorBean.setCusNumber("1");
			securityDoorBean.setMsgType("8888");
			securityDoorBean.setDoorId("3333");
			*/
	/*		JSONObject json = new JSONObject();
			json.put("msgType", "9999");
			json.put("type", "2");
			text = json.toJSONString();*/
			
/*			String callNameTest = "{\"cusNumber\":1,\"msgType\":301,\"areaId\":\"de1143ff-ab26-4cc6-8c0e-92c8861d6194\",\"areaName\":\"一监区\",\"callId\":\"2A19B95E-C8AF-4795-A0A9-3B62C3833F3E\",\"startTime\":\"2014-12-09 09:00:00\",\"endTime\":\"2014-12-09 11:00:00\",\"total\":229,\"callNum\":25,\"otherCallNum\":1,\"hospitalNum\":0,\"uncallNum\":203,\"prisonerId\":\"326100000086\"}";
			String foreignCar="{\"carLicense\":\"苏DLL995\",\"carType\":3,\"cardIdnty\":\"1E562111\",\"chassisInImgDir\":\"\",\"chassisOutImgDir\":\"\",\"checkIdnty\":\"201412271518502\",\"checkStatus\":\"0\",\"company\":\"溧阳怡州服饰\",\"cusNumber\":1,\"department\":\"三监区 \",\"driverIdImgDir\":null,\"driverLocalImgDir\":null,\"driverName\":\"朱建春\",\"enterTime\":\"2014-12-29 15:00:00\",\"inImgDir\":\"\",\"leadPoliceName\":\"薛逸枫 \",\"leaveTime\":\"2014-12-29 14:00:00\",\"msgType\":1201,\"operationPolice\":\"马翔玲\",\"operationTime\":\"2014-12-27 15:26:25\",\"outImgDir\":\"\",\"outsideIdnty\":\"00135\",\"reason\":\"送货\",\"registerIdnty\":\"66121903-797c-4a10-ab52-0a8e8da94241\",\"remark\":null}";
			JSONObject json = JSON.parseObject(foreignCar);*/


			//text=JSONObject.toJSONString(policeBrushCardMessage);

			//text=JSONObject.toJSONString(json);


			// 大屏预案
/*			JSONObject json = new JSONObject();
			json.put("cusNumber", "1");
			json.put("msgType", "401");
			json.put("screenChannelIdentify", "001001021000");
			json.put("cameraIdentify", "1631");
			json.put("remark", "");
			text = json.toJSONString();
			
			text = JSONObject.toJSONString(foreignPeople);*/
			
			
			
			String newDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			
			//报警
			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID("201506110000000002");
			//msgHeader.setMsgType(PowerNetworkConstants.POWER_NETWORK);
			msgHeader.setLength(4);
			msgHeader.setSender("alarm");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);
			
			JSONObject body = new JSONObject();
			body.put("alarmID", "24"); 
			body.put("alarmDeviceType", "6"); 
			body.put("alarmType","1"); 
			body.put("alarmTime","2016-12-17 13:01:01");
			body.put("alarmAction","1"); 
			body.put("remark","1"); //关联门禁编号
			
			//门禁刷卡
/*			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID("201506110000000002");
			msgHeader.setMsgType("DOOR001");
			msgHeader.setLength(4);
			msgHeader.setSender("door");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);
			
			JSONObject body = new JSONObject();
			body.put("doorID", "1"); 
			body.put("cardID", "1"); 
			body.put("brushCardTime","2016-11-09 13:01:01"); 
			body.put("peopleType","1");
			body.put("inOutFlag","1"); 
			body.put("status","0"); 
			body.put("remark",""); */
			
/*			MsgHeader msgHeader = new MsgHeader();
			msgHeader.setMsgID("201506110000000002");
			msgHeader.setMsgType("POLICE001");
			msgHeader.setLength(4);
			msgHeader.setSender("DOOR");
			msgHeader.setRecevier("SERVER");
			msgHeader.setSendTime(newDate);
			
			JSONObject body = new JSONObject();
			body.put("peopleID", "3201001"); // 人员编号
			body.put("peopleName", "小谢谢"); // 人员姓名
			body.put("peopleType","1"); // 人员类型 1 民警 2 职工 
			//body.put("compareTime",newDate);//进出时间
			body.put("compareTime","2016/11/11 11:53:50");//进出时间
			body.put("inOutFlag","1"); //进出标示   1 进 2出
			body.put("doorID","1"); //关联门禁编号
*/
			
			
			//============================== 高压电网测试================================
			MsgHeader pnHeader = new MsgHeader();
			pnHeader.setMsgID("201506110000000002");
			//pnHeader.setMsgType(PowerNetworkConstants.POWER_NETWORK);
			pnHeader.setLength(4);
			pnHeader.setSender("powerNetwork");
			pnHeader.setRecevier("SERVER");
			pnHeader.setSendTime(newDate);
			
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
							
							
							//FePowerNetworkMessageBean bean=new FePowerNetworkMessageBean();
							/*bean.setCusNumber("3223");
							bean.setPowerNetworkIdnty(String.valueOf((int)(Math.random()*6)+1));
							bean.setPowerNetworkName("1111");
							bean.setIp("192.168.0.1");
							bean.setaBoxPowerFlow("2");
							bean.setbBoxVoltage("3");
							bean.setPowerSourceVoltage(String.valueOf((int)(Math.random()*20)+1));	
							bean.setaBoxPowerFlow("6");
							bean.setbBoxPowerFlow("3");
							bean.setPowerSourcePowerFlow(String.valueOf((int)(Math.random()*30)+1));
							bean.setUpdateTime("2014-09-29 13:15:15");
							bean.setStatus("1"); */
							
							JSONObject out = new JSONObject();
							out.put("header", pnHeader);
							//out.put("body", JSON.toJSONString(bean));
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
