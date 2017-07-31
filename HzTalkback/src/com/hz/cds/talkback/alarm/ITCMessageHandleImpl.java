package com.hz.cds.talkback.alarm;

import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.talkback.service.TalkStatusService;
import com.hz.cds.talkback.util.TalkbackConfigUtil;
import com.hz.db.dao.UpdateDao;
import com.hz.db.service.IQueryService;
import com.hz.fe.service.IFeMessageProcess;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.net.netty.bean.MsgHeader;
import com.hz.frm.util.DateUtil;
import com.hz.frm.utils.SequenceUtil;


/**
 * ITC MQ 消息处理（主要发送到前台）
 * @author xie.yh 2016.09.06
 *
 */
@Service(value="itcMessageHandleImpl")
public class ITCMessageHandleImpl implements IITCMQHandleService {
	final Logger logger = LoggerFactory.getLogger(ITCMessageHandleImpl.class);
	//---------不合理代码开始----------------
//	@Resource
//	private IAddService addService;
	@Resource
	private UpdateDao updateDao;
	@Resource
	private SequenceUtil sequenceUtil;
//	@Resource
//	private AlarmMessageService alarmMessageService;
	@Resource
	private IFeMessageProcess feAlarmMessageProcess;
	@Resource
	IQueryService queryService;
	@Resource
	private MqMessageSendService mqMessageSendService;
	@Resource
	private TalkStatusService talkStatusService;
	//---------不合理代码结束----------------
	/**
	 * 开始呼叫,发起一键求助
	 */
	private static final String EVENT_START = "start";
	/**
	 * 结束呼叫,结束一键求助
	 */
	private static final String EVENT_CLOSE = "close";
	/**
	 * 设备上线
	 */
	private static final String EVENT_ONLINE = "online";
	/**
	 * 设备下线
	 */
	private static final String EVENT_OFFLINE = "offline";	
	
	public ITCMessageHandleImpl () {
		ITCMQListener.onOneKeyTalkbackEvent("itcMessageHandleImpl");
		ITCMQListener.onTalkbackEvent("itcMessageHandleImpl");
		ITCMQListener.onAlarmForHelp("itcMessageHandleImpl");
		ITCMQListener.onoffevent("itcMessageHandleImpl");
//		ITCMQListener.onAlarmForHelp("ITCAlarmHandle");
	}

	@Override
	public void handle(JSONObject msgJSON) {
		
		//-----------垃圾逻辑开始--------------
		String jobType = msgJSON.getString("job_type");
		switch(jobType){
			case "alarmforhelp":
				if(EVENT_START.equals(msgJSON.getString("job_status"))){
					talkAlarm(msgJSON);
				}else if(EVENT_CLOSE.equals(msgJSON.getString("job_status"))){
					String caller = msgJSON.getString("caller");
					JSONObject jsonCaller = JSONObject.parseObject(caller);
					String name  = jsonCaller.getString("name");//对讲机名称
					logger.debug("对讲机"+name +"结束报警");
					//TODO 取消报警处理
				}
				break;
			case "onekeytalkbackevent":	
			case "talkbackevent": //对讲事件推送
				//TODO 对讲事件响应
				talkbackeventHandle(msgJSON);
				break;
			case "onoffevent"://终端上下线推送
				onoffeventHandle(msgJSON);
				break;
		}
		//-----------垃圾逻辑结束--------------
//		String orgCode = ConfigUtil.get("PRISON_CODE_DEFAULT");
//		String msgType = ConfigUtil.get("ITC_MQ_MSG_TYPE");
//		WebSocketMessage webSocketMessage = new WebSocketMessage();
//		webSocketMessage.setMsgType(msgType);
//		webSocketMessage.setContent(msgJSON);
		// 向前台发送消息
//		MsgManager.sendNettyMessage(JSON.toJSONString(webSocketMessage), orgCode);
	}	
	/**
	 * 对讲报警处理
	 * @param msgJSON
	 */
	private void talkAlarm(JSONObject msgJSON){
//		String action = msgJSON.getString("job_status");
//		String name  = jsonCaller.getString("name");//主叫的名字
		
		String cusNumber = TalkbackConfigUtil.get("CUSNUMBER");
		
		String caller = msgJSON.getString("caller");
		JSONObject jsonCaller = JSONObject.parseObject(caller);
		
		String telephone =  jsonCaller.getString("telephone");//主叫的号码
		
		String talkId  = getTalkbackInfo(cusNumber,telephone,"tbd_id"); //对讲设备编号
		if(talkId.equals(""))  talkId = telephone;
		
		String nowTime = DateUtil.getDateString(new Date(), "yyyyMMddHHmmss");
		String alarmTime = dateFormat(msgJSON.getString("datetime"));
		
//		String departmentId  =  getTalkbackInfo(cusNumber,telephone,"tbd_dept_id");
		
		
		//消息头
		MsgHeader msgHeader = new MsgHeader();
		msgHeader.setMsgID(nowTime);
		msgHeader.setMsgType("Alarm001");
		msgHeader.setLength(4);
		msgHeader.setSender("Server");
		msgHeader.setRecevier("Server");
		msgHeader.setSendTime(nowTime);
		
		//组成消息体
		JSONObject body = new JSONObject();
		body.put("alarmID", talkId); // 报警器编号
		body.put("alarmDeviceType","3"); // 报警设备类型
		body.put("alarmType","1"); // 对讲机一键求助报警
		body.put("alarmTime",alarmTime);//报警时间
		body.put("alarmAction","1"); //动作 1 报警 2 取消报警
		body.put("alarmImg",""); //报警图片(对讲机报警没有报警图片)
		body.put("remark","对讲机一键求助报警"); //关联门禁编号
		
		
		//消息体
		JSONObject msg = new JSONObject();
		msg.put("header", JSON.toJSONString(msgHeader));
		msg.put("body", body.toJSONString());
		
		try {
			feAlarmMessageProcess.processMessage(cusNumber,msg);
		} catch (Exception e) {
			logger.error("对讲报警消息处理失败 msgbody="+JSON.toJSONString(msg),e);
		}
	}
	
	/**
	 * 插入报警记录
	 * @param cusNumber
	 * @param feAlarmMessageBean
	 */
//	private void insert(String cusNumber,FeAlarmMessageBean feAlarmMessageBean){
//		String sql=SqlConfigUtil.getSql("insert_alt_alert_record_dtls");
//		Map<String, Object> paramMap=new HashMap<String,Object>();
//		try {
//			String ardRecordId=sequenceUtil.getSequence("alt_alert_record_dtls", "ard_record_id");
//			feAlarmMessageBean.setRecordId(ardRecordId);
//			String alarmId=feAlarmMessageBean.getAlarmID();
//			String deviceType=feAlarmMessageBean.getAlarmDeviceType();
//			String alarmType=feAlarmMessageBean.getAlarmType();
//			paramMap.put("ard_cus_number", cusNumber);
//			paramMap.put("ard_record_id", ardRecordId);
//			paramMap.put("ard_alertor_id", alarmId);
//			paramMap.put("ard_alertor_name", feAlarmMessageBean.getAlarmName());
//			paramMap.put("ard_alert_addrs", feAlarmMessageBean.getAlarmAddrs());
//			paramMap.put("ard_alert_level", feAlarmMessageBean.getLevel());
//			paramMap.put("ard_dvc_type", deviceType);
//			paramMap.put("ard_alert_reason", alarmType);
//			paramMap.put("ard_alert_time", feAlarmMessageBean.getAlarmTime());
//			paramMap.put("ard_alert_stts", feAlarmMessageBean.getAlarmAction());
//			paramMap.put("ard_remark", feAlarmMessageBean.getRemark());
//			paramMap.put("ard_img_src", "");
//			logger.debug(JSON.toJSONString(paramMap));
//			updateDao.updateByParamKey(sql, paramMap);
//		} catch (Exception e) {
//			logger.error("插入对讲报警记录失败 msg="+JSON.toJSONString(feAlarmMessageBean),e);
//		}
//	}
	/**
	 * 一般对讲事件处理(开始结束呼叫)
	 * @param msgJSON
	 */
	private void talkbackeventHandle(JSONObject msgJSON){
		String job_status = msgJSON.getString("job_status");
		String strStatus = "";
		int intStatus = 0;
		if(EVENT_START.equals(job_status)){
			strStatus = "正在呼叫";
			intStatus = 2; //开始通话,通话状态
		}else if(EVENT_CLOSE.equals(job_status)){
			strStatus = "已挂断";
			intStatus = 0; //结束通话,空闲状态
		}
		//主叫
		JSONObject caller =  msgJSON.getJSONObject("caller");
		String caller_id = caller.getString("telephone");
		String caller_name = caller.getString("name");
		caller.put("id", caller_id);
		
		//被叫
		JSONObject callee = msgJSON.getJSONObject("callee");
		String callee_id = callee.getString("telephone");
		String callee_name = callee.getString("name");
		callee.put("id", callee_id);
		
		String msg  = caller_name + "-->" +  callee_name + "," + strStatus;
		logger.debug(msg);
		JSONObject json = new JSONObject();
		json.put("msg", msg);
		json.put("type", job_status);
		json.put("caller", caller);
		json.put("callee", callee);
		
		//更新设备状态
		talkStatusService.updateStatus(intStatus, caller_id);
		talkStatusService.updateStatus(intStatus, callee_id);
		//推送信息到前台
		mqMessageSendService.sendInternalWebMessage(json,TalkbackConfigUtil.get("CUSNUMBER"),"TALKBACK002");
	}
	
	/**
	 * 设备上下线事件处理
	 * @param msgJSON
	 */
	private void onoffeventHandle(JSONObject msgJSON){
		logger.debug("对讲设备上下线"+msgJSON.toJSONString());
		String job_status = msgJSON.getString("job_status");
		String strStatus = "";
		int intStatus = 0;
		if(EVENT_ONLINE.equals(job_status)){
			strStatus = "上线";
			intStatus = 0;
		}else if(EVENT_OFFLINE.equals(job_status)){
			strStatus = "下线";
			intStatus = 1;
		}
		String telephone = msgJSON.getString("telephone");
		String name = msgJSON.getString("name");
		String msg = "对讲设备  "+ name + "(" + telephone + ")" + strStatus;
		logger.debug(msg);
		JSONObject json = new JSONObject();
		json.put("msg", msg);
		json.put("type", job_status);
		//更新设备状态
		talkStatusService.updateStatus(intStatus, telephone);
		//推送信息到前台
		mqMessageSendService.sendInternalWebMessage(msg,TalkbackConfigUtil.get("CUSNUMBER"),"TALKBACK002");
	}
	
	/**
	 * 获取对讲设备信息
	 * @param cusNumber
	 * @param otherid 
	 * @param key
	 * @return
	 */
	public String getTalkbackInfo(String cusNumber,String otherid,String key){
		String id="";
		Map<String, Object> talkbackMap=RedisUtil.getHashMap("tbk_talkback_id"+"_"+cusNumber, otherid);
		if(talkbackMap!=null){
			id=talkbackMap.get(key).toString();
		}
		return id;
	}
	
	/**
	 * 日期格式转换
	 * @param date
	 * @return
	 */
	private String dateFormat(String date){
		return DateUtil.convertDate(date,"yyyyMMddHHmmss", "yyyy-MM-dd HH:mm:ss");
	}
}
