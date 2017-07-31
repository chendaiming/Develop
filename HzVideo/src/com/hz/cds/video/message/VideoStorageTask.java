package com.hz.cds.video.message;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.hz.db.dao.QueryDao;
import com.hz.db.dao.UpdateDao;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.MsgIdUtil;
import com.hz.frm.util.Tools;
import com.hz.frm.utils.SequenceUtil;
import com.hz.sql.util.SqlConfigUtil;


@Component
public class VideoStorageTask {
	private static final Logger logger = LoggerFactory.getLogger(VideoStorageTask.class);
	@Resource
	private MqMessageSendService mqMessageSendService;
	@Resource
	private QueryDao queryDao;
	@Resource
	private UpdateDao updateDao;
	@Resource
	private SequenceUtil sequenceUtil;
	
	
	@Scheduled(cron = "0 59 23 * * ?")
//	@Scheduled(cron="0/10 * * * * ?")
	public void run() throws Exception{
		runAlerts();//推送报警事件
		runTalkBack();//推送受虐对讲事件
	}
	
	/**
	 * 执行报警事件推送任务
	 * @throws Exception
	 */
	private void runAlerts() throws Exception{
		String sql = SqlConfigUtil.getSql("select_alarm_record_dtls");
		List<Map<String,Object>> result= queryDao.query(sql);
		logger.debug("智能存储 ->>> 开始推送《基本报警事件》");
		logger.debug("启动时间:"+getCurrentTime());
		if(result != null && result.size() > 0){
			for(Map<String,Object> map : result){
				if(map.get("oprtn_finish_time")!=null&&map.get("alert_time")!=null){
					videoMsgSend(
							Tools.toStr(map.get("dvc_type"), ""),
							Tools.toStr(map.get("event_name"), ""),
							Tools.toStr(map.get("record_id"), ""),
							Tools.toStr(map.get("storage_addr"), ""),
							Tools.toStr(map.get("alertor_id"), ""),
							getBeAfTime(Tools.toStr(map.get("alert_time"), ""),Long.parseLong(Tools.toStr(map.get("before_time"), ""))), 
							getBeAfTime(Tools.toStr(map.get("oprtn_finish_time"), ""),Long.parseLong(Tools.toStr(map.get("after_time"), ""))),
							"/"+map.get("alert_date")+"/"+map.get("storage_addr")+"/"+map.get("record_id")+"/"+map.get("dvc_name"),
							getCurrentTime());
				}else if(map.get("oprtn_finish_time")!=null&&map.get("alert_time")==null){
					logger.debug("丢失报警事件开始时间,检测下一个...");
				}else if(map.get("oprtn_finish_time")==null&&map.get("alert_time")!=null){
					logger.debug("丢失报警事件结束时间,检测下一个...");
				}else logger.debug("丢失报警事件起止时间,检测下一个...");
			}
		}
		logger.debug("总条数:"+result.size());
	}
	
	/**
	 * 执行受虐对讲事件推送任务
	 * @throws Exception
	 */
	private void runTalkBack() throws Exception{
		doFlighttalk("呼叫方","select_flighttalk_call_record","call_name");
//		doFlighttalk("接听方","select_flighttalk_receive_record","receive_name");//只存储发起方关联视频
	}
	
	/**
	 * 呼叫、接听分开存储
	 * @param sendName
	 * @param sql
	 * @param talkName
	 * @throws Exception
	 */
	private void doFlighttalk(String sendName,String sql,String talkName) throws Exception{
		//呼叫方
		String sqlCall = SqlConfigUtil.getSql(sql);
		List<Map<String,Object>> result= queryDao.query(sqlCall);
		logger.debug("智能存储 ->>> 开始推送《"+sendName+"受虐对讲记录》");
		logger.debug("启动时间:"+getCurrentTime());
		if(result != null && result.size() > 0){
			for(Map<String,Object> map : result){
				if(map.get("end_time")!=null&&map.get("start_time")!=null){
					videoMsgSend(
							"20",
							Tools.toStr(map.get("event_name"), ""),
							Tools.toStr(map.get("record_id"), ""),
							Tools.toStr(map.get("storage_addr"), ""),
							Tools.toStr(map.get("dvc_id"), ""),
							getBeAfTime(Tools.toStr(map.get("start_time"), ""),Long.parseLong(Tools.toStr(map.get("before_time"), ""))), 
							getBeAfTime(Tools.toStr(map.get("end_time"), ""),Long.parseLong(Tools.toStr(map.get("after_time"), ""))),
//							"video/"+map.get("create_date")+"/"+map.get("storage_addr")+"/"+map.get("record_id")+"/"+map.get(talkName)+"("+sendName+")/"+map.get("dvc_name"),
							"/"+map.get("create_date")+"/"+map.get("storage_addr")+"/"+map.get("record_id")+"/"+map.get("dvc_name"),
							getCurrentTime());
				}else if(map.get("end_time")!=null&&map.get("start_time")==null){
					logger.debug("丢失"+sendName+"发起时间,检测下一个...");
				}else if(map.get("end_time")==null&&map.get("start_time")!=null){
					logger.debug("丢失"+sendName+"挂断时间,检测下一个...");
				}else logger.debug("丢失"+sendName+"起止时间,检测下一个...");
			}
		}
		logger.debug("总条数:"+result.size());
	}
	
	/**
	 * 发送给前置机视频存储消息
	 * 注：发给前置机的文件存储目录是完整路径，入库存储的路径是文件夹名，通过拼接取完整路径
	 * @throws Exception
	 */
	private void videoMsgSend(String dvcType,String eventName,String eId,String dirName,String cameraId,String startTime,String endTime,String filePath,String sendTime) throws Exception{
		JSONObject json=new JSONObject();
		JSONObject jHeader=new JSONObject();
		JSONObject jBody=new JSONObject();
		
		jHeader.put("msgType", "VIDEOSTORAGE");
		jHeader.put("cusNumber","3032");
		jHeader.put("msgId", MsgIdUtil.getMsgSeq("VIDEO"));
		jHeader.put("userId", "VIDEOSTORAGE");
		jHeader.put("sendTime", getCurrentTime());
		
		jBody.put("eventId", MsgIdUtil.getMsgSeq(""));
		jBody.put("cameraId", cameraId);
		jBody.put("startTime", startTime);
		jBody.put("endTime", endTime);
		jBody.put("filePath", filePath);
		
		json.put("header", jHeader.toString());
		json.put("body", jBody.toString());
		
		logger.debug("消息Json:"+json);
		
		mqMessageSendService.sendFeMessage(json.toString(), "3032");//推送
		insertToDb(dvcType,eventName,eId,cameraId,startTime,endTime,dirName,sendTime);//入库
	}
	
	/**
	 * 视频存储消息入库
	 * @throws Exception
	 */
	private void insertToDb(String dvcType,String eventName,String eId,String cameraId,String startTime,String endTime,String dirName,String sendTime) throws Exception{
		String sql = SqlConfigUtil.getSql("insert_video_storage_record");
		String vsrId = sequenceUtil.getSequence("CMR_VIDEO_STORAGE_RECORD", "VSR_ID");
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("vsr_cus_number", "3032");
		paramMap.put("vsr_id", vsrId);
		paramMap.put("vsr_event_type", dvcType);
		paramMap.put("vsr_event_name", eventName);
		paramMap.put("vsr_event_id", eId);
		paramMap.put("vsr_camera_id", cameraId);
		paramMap.put("vsr_start_time", startTime);
		paramMap.put("vsr_end_time", endTime);
		paramMap.put("vsr_filepath", dirName);
		paramMap.put("vsr_send_time", sendTime);
		updateDao.updateByParamKey(sql, paramMap);
	}
	
	/**
	 * 日期格式化对象到秒(Apache commons-lang中的FastDateFormat)
	 */
	private final static FastDateFormat SDF_second = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss");
	
	/**
	 * 日期格式化对象到秒(JDK里自带的SimpleDateFormat)
	 */
	private final static SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟  
	
	/**
	 * 功能描述：返回系统的当前时间,格式 yyyy-MM-dd HH:mm:ss
	 * @return String
	 */
	public static String getCurrentTime(){
		Date today=new Date();
		today.setTime(System.currentTimeMillis());
		return SDF_second.format(today);
	}
	
	/**
	 * PARAMS:strDate,i
	 * 功能描述：返回给定时间strDate+i毫秒,格式 yyyy-MM-dd HH:mm:ss
	 * @return String
	 * @throws ParseException 
	 */
	public static String getBeAfTime(String strDate,long i) throws ParseException{
		Date date=new Date(sdf.parse(strDate).getTime()+i*1000);
		return SDF_second.format(date);
	}
	
}
