package com.hz.cds.scheduling.webService.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.rmi.RemoteException;
import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.scheduling.util.ScheduleConfigUtil;
import com.hz.cds.scheduling.webService.IScheduleService;
import com.hz.frm.bean.WebSocketMessage;
import com.hz.frm.net.amq.service.MqMessageSendService;

import cn.showclear.www.AppService.AppServicePortTypeProxy;
import cn.showclear.www.AppService.FileDownloadReq;
import cn.showclear.www.AppService.FileDownloadResp;
import cn.showclear.www.AppService.IdResp;
import cn.showclear.www.AppService.MsgSendReq;
import cn.showclear.www.AppService.RecordQueryReq;
import cn.showclear.www.AppService.RecordQueryResp;
import cn.showclear.www.VoiceService.CallAnswerReq;
import cn.showclear.www.VoiceService.CallHangupReq;
import cn.showclear.www.VoiceService.CallReq;
import cn.showclear.www.VoiceService.CallinQueryResp;
import cn.showclear.www.VoiceService.CommonReq;
import cn.showclear.www.VoiceService.CommonResp;
import cn.showclear.www.VoiceService.GroupCallReq;
import cn.showclear.www.VoiceService.JsonResp;
import cn.showclear.www.VoiceService.LoginReq;
import cn.showclear.www.VoiceService.LoginResp;
import cn.showclear.www.VoiceService.MeetCreateReq;
import cn.showclear.www.VoiceService.MeetCreateResp;
import cn.showclear.www.VoiceService.MeetIdReq;
import cn.showclear.www.VoiceService.MeetInfo;
import cn.showclear.www.VoiceService.MeetOperateReq;
import cn.showclear.www.VoiceService.MeetQueryResp;
import cn.showclear.www.VoiceService.MemberJoinReq;
import cn.showclear.www.VoiceService.MemberLeaveReq;
import cn.showclear.www.VoiceService.MemberLevelReq;
import cn.showclear.www.VoiceService.VoiceService2PortTypeProxy;
/**
 * 通讯调度实现类
 * @author Rui_Win8.1
 *
 */
@Service
public class ScheduleServiceImpl implements IScheduleService{
	final Logger logger = LoggerFactory.getLogger(ScheduleServiceImpl.class);
	/** 业务模块(发送短信,传真等) */
	private AppServicePortTypeProxy appProxy;
	/** 语音模块 */
	private VoiceService2PortTypeProxy voiceProxy;
	/** sessionId 登陆成功后赋值 */
	private static String sessionId = "";
	/** 主叫号码 登陆成功后赋值 */
	private static String caller = "";
	/** 执行失败原因,用于返回给前台 */
	private String errorReson = "";
	/** */
	private static boolean  logined = false;
	@Resource
	private MqMessageSendService mqMessageSendService;
	/**
	 * 初始化
	 */
	@PostConstruct
	private void init(){
		appProxy = new AppServicePortTypeProxy();
		voiceProxy = new VoiceService2PortTypeProxy();
		//登录通讯调度系统
		if(ScheduleConfigUtil.get("SCHEDULE_MODEL").trim().equals("0") && !login())  {
			 relogin();
		}
	}
	/**
	 * 容器销毁之前执行
	 */
	@PreDestroy
	private void destory(){
		//登出操作
		loginout();
	}
	/**
	 * 发送短信
	 */
	@Override
	public String sendMessage(String receive, String content, String time, Integer type) {
		logger.debug("通讯调度系统====>>发送短信;发送:"+caller+",接收:"+receive+",内容:"+content);
		MsgSendReq param = new MsgSendReq(caller,receive,content,time,type);
		try {
			IdResp result = appProxy.msgSend(param);
			if(result.getResultCode().equals("0")){
				return "发送短信成功...";
			}else{
				return "发送短信失败:"+result.getResultCode();
			}
		} catch (Exception e) {
			logger.error("通讯调度系统====>>发送短信异常:",e.getMessage());
			return "发送短信异常:"+e.getMessage();
		}
	}
	
	/**
	 * 登录
	 * @return true 登录成功　false 失败
	 */
	@Override
	public boolean login(){
		if(logined){
			return true;
		}
		//获取登录通讯调度平台所需信息
		String username = ScheduleConfigUtil.get("SCHEDULE_USERNAME").trim(); //用户名
		String password = ScheduleConfigUtil.get("SCHEDULE_PASSWORD").trim(); //密码
		String centerNo = ScheduleConfigUtil.get("SCHEDULE_CENTERNO").trim(); //中心
		LoginReq login = new LoginReq(username,password,centerNo);
		try {
			//登录并解析返回结果
			LoginResp result = 	voiceProxy.login(login);
			if(commonResult("login",result.getResultCode())){
				sessionId = result.getSessionId();
				caller = centerNo;
				logger.debug("通讯调度系统====>>登录成功!sessionId:"+sessionId);
				logined = true;
				//登录成功,发送心跳包
				heartbeat();
				callQuery();
				return true;
			}else{
				logined = false;
			}
		} catch (RemoteException e) {
			logger.error("通讯调度系统====>>登录出现异常:",e.getMessage());
			logined = false;
		}
		return false;
	}
	/**
	 * 登出通讯调度系统
	 */
	private void loginout(){
		try {
		CommonResp	result =  voiceProxy.logout(new CommonReq(sessionId));
		if(commonResult("登出",result.getResultCode())){
			logger.debug("通讯调度系统====>>登出...成功");
			logined = false;
		}else{
			logger.debug("通讯调度系统====>>登出...失败"+errorReson);
		}
		} catch (RemoteException e) {
			logger.error("通讯调度系统====>>登出异常:",e.getMessage());
		}
	}
	/**
	 * 呼叫单个用户
	 */
	@Override
	public String callPhone(String callee,Integer isRecord) {
		 logger.info("sessionId:"+sessionId);
		 CallReq call = new CallReq(sessionId,caller,callee,isRecord);
			try {
			//呼叫接口 主叫号码默认为操作员号码
			CommonResp callResult =	voiceProxy.call(call);
			if(commonResult("call",callResult.getResultCode())){
				logger.debug("通讯调度系统====>>呼叫"+callee+"成功!");
				return "呼叫成功";
			}else{
				return "呼叫失败:"+errorReson;
			}
		} catch (RemoteException e) {
			logger.error("通讯调度系统====>>呼叫单个用户出现异常:",e.getMessage());
			return "呼叫异常:"+e.getMessage();
		}
	}
	@Override
	public String callClose(String tel) {
		try {
			//呼叫接口 主叫号码默认为操作员号码
			CommonResp result =	voiceProxy.callHangup(new CallHangupReq(tel,sessionId));
			if(commonResult("callClose",result.getResultCode())){
				logger.debug("通讯调度系统====>>挂断"+tel+"成功!");
				return "挂断"+tel+"成功";
			}else{
				return "挂断失败:"+errorReson;
			}
		} catch (RemoteException e) {
			logger.error("通讯调度系统====>>挂断用户通话异常:",e.getMessage());
			return "挂断异常:"+e.getMessage();
		}
	}
	@Override
	/**
	 * 间隔15S发送一次心跳包
	 */
	public void heartbeat() {
		Timer heartbeatTimer = new Timer();
		CommonReq param = new CommonReq(sessionId);
		heartbeatTimer.schedule(new TimerTask() {
		      public void run() {
		        try {
		        	CommonResp result = voiceProxy.heartbeat(param);
		        	if(commonResult("心跳连接",result.getResultCode())){
		        		logger.info("通讯调度系统====>>心跳连接...正常,sessionId:"+sessionId);
		        		logined = true;
		        	}else{
		        		heartbeatTimer.cancel();//停止定时器
						logined = false;
		        		relogin();//尝试重新登录
		        	}
				} catch (RemoteException e) {
					logger.error("通讯调度系统====>>心跳连接...异常",e.getMessage());
					heartbeatTimer.cancel();//停止定时器
					logined = false;
					relogin();//尝试重新登录
				}
		      }
		    },0,15000);// 每隔15S执行一次
	}
	/**
	 * 自动重连
	 */
	private void relogin(){
		Timer  relogintimer = new Timer();
		relogintimer.schedule(new TimerTask() {
		      public void run() {
		    	  if(logined) {
		    		  logger.info("通讯调度系统====>>已登录,停止计时器");
		    		  relogintimer.cancel();
		    	  } else if(login()){
		    		  logger.info("通讯调度系统====>>重连成功!停止计时器");
		    		  relogintimer.cancel();
		    	  }else {
		    		  logger.info("通讯调度系统====>>重连失败");
		    	  }
		      }
		 },0,30*1000);
	}
	/**
	 * 组呼
	 */
	@Override
	public String groupCall(String tels) {
//		GroupCallReq param = new GroupCallReq(sessionId,caller,tels,ScheduleConfigUtil.get("SCHEDULE_USERNAME").trim(),0);
		 GroupCallReq  param = new GroupCallReq();
		 param.setSessionId(sessionId);
		 param.setTels(tels);
		 param.setCaller(caller);
		 param.setGroupId(ScheduleConfigUtil.get("SCHEDULE_USERNAME").trim());
		 param.setType(0);
//		GroupCallReq param = new GroupCallReq(sessionId,caller,tels,"fk_001",1);
		 try {
	        	CommonResp result = voiceProxy.groupCall(param);
	        	if(commonResult("组呼",result.getResultCode())){
	        		logger.info("通讯调度系统====>>组呼...成功");
	        		return "组呼成功";
	        	}else{
	        		return "组呼失败:"+errorReson;
	        	}
			} catch (RemoteException e) {
				logger.error("通讯调度系统====>>组呼...异常",e.getMessage());
				return "组呼异常:"+e.getMessage();
			}
	}
	/**
	 * 返回结果公共处理类
	 * @param type
	 * @param result
	 * @return
	 */
	public boolean commonResult(String type,String resultCode){		
		JSONObject resultJson = JSONObject.parseObject(resultCode);
		String code = resultJson.getString("code");
		if(code.equals("0")){
			//调用成功
			return true;
		}else{
			//调用失败
			errorReson = formatReason(resultJson.getString("reason"));
			logger.debug("通讯调度系统====>>"+type+"失败:"+errorReson);
			return false;
		}	
	}
	/**
	 * 解析错误类型
	 * @param reason
	 * @return
	 */
	public String formatReason(String reason){
		String result = "";
		switch(reason){
			case "USER_HAS_LOGIN":    result = "用户已经登录";   break;
			case "AUTH_FAIL":         result = "鉴权失败";       break;	
			case "OPERATE_BAN":       result = "方法调用被禁止"; break;
			case "SERV_CONN_TIMEOUT": result = "服务器连接超时"; break;
			case "SERV_CONN_ERROR":   result = "服务器连接错误"; break;
			case "CLIENT_CONN_FULL":  result = "连接的客户端达到最大数"; break;
			case "SERV_DIS_CONN":     result = "未与服务器连接或连接已断开"; break;
			case "PARAM_ERROR":       result = "参数错误"; break;
			case "HEADER_EMPTY":      result = "sessionId为空"; break;
			case "FILE_ERROR":        result = "文件错误"; break;
			case "DB_EXECUTE_ERROR":  result = "数据库执行错误"; break;
			case "DB_QUERY_EMPTY":    result = "数据库查询为空"; break;
			case "DB_DATA_EXIST":     result = "数据已存在"; break;
			case "DB_DATA_NOEXIST":   result = "数据不存在"; break;
			case "UNKOWN":            result = "未知错误"; break;
		    default :                 result =  reason; break;
		}
		return result;
	}
	@Override
	public String recordQuery(int recordType, String caller, String callee, String timeMin, String timeMax,
			int pageIndex, int pageSize) {
		RecordQueryReq param = new RecordQueryReq();
		param.setRecordType(recordType); //录音类型。【0：平台通话录音；1：调度操作员录音】
		if(!caller.equals("")) param.setCaller(caller);//主叫
		if(!callee.equals("")) param.setCallee(callee);//被叫
		if(!timeMin.equals("")) param.setTimeMin(timeMin);//开始时间范围最小值。格式：yyyyMMddHHmmss，如：20131202102703。
		if(!timeMax.equals("")) param.setTimeMax(timeMax);//开始时间范围最大值。格式：yyyyMMddHHmmss，如：20131202102703。
		param.setPageIndex(pageIndex);
		param.setPageSize(pageSize);
		try {
			RecordQueryResp result = appProxy.recordQuery(param);
			if(result.getResultCode().equals("0")){
				logger.info("通讯调度系统====>>录音查询...成功");
//				return new String(true,result,"查询成功");
			}else{
//				return new String(false,"","查询失败");
			}
		} catch (RemoteException e) {
			logger.error("通讯调度系统====>>录音查询...异常",e.getMessage());
//			return new String(true,"","查询异常,请稍后再试");
		}
		return null;
	}
	@Override
	public String fileDownload(String filename, Integer type) {
		//判断文件是否存在
		String filePath = ScheduleConfigUtil.get("SCHEDULE_WAVDIR") + filename;
		File file = new File(filePath);
		if(file.exists()){
			//文件存在,直接播放
			return "文件存在";
		}
		//文件不存在,从通讯调度系统下载文件
		FileDownloadReq parameters = new FileDownloadReq(filename,type);
		try {
			FileDownloadResp result = 	appProxy.fileDownload(parameters);
			if(result.getResultCode().equals("0")){
				//下载成功
			     byte[] fileContent = 	result.getFilecontent();
			     if(writeFile(filePath,fileContent)){
			    	 return "下载完成";
			     }else{
			    	 return "下载失败";
			     }
			}
		} catch (RemoteException e) {
			logger.error("文件下载异常",e.getMessage());
			return "下载异常";
		}
		return "下载失败";
	}
	/**
	 * 写入文件到本地
	 * @param fileName
	 * @param fileContent
	 * @return
	 */
	private boolean writeFile(String filePath,byte[] fileContent){
		FileOutputStream out = null;
		File file = new File(filePath);
		try {
			out = new FileOutputStream(file);
			out.write(fileContent, 0, fileContent.length);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}finally{
			try {
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return true;
	}
	@Override
	public String CallinQuery() {
		try {
			CallinQueryResp resp = 	voiceProxy.callinQuery(new CommonReq(sessionId));
			if(resp.getResultCode().equals("0")){
				logger.info("通讯调度系统====>>新呼入查询...成功");
//				return new String(true,resp.getTels(),"查询成功");
			}else{
//				return new String(false,null,"查询失败");
			}
		} catch (RemoteException e) {
			logger.error("通讯调度系统====>>新呼入查询...异常",e.getMessage());
//			return new String(false,null,e.getMessage());
		}
		return null;
	}
	/**
	 * 查询推送消息
	 */
	public void callQuery(){
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
		      public void run() {
		        try {
		        	JsonResp resp = voiceProxy.pushServQuery(new CommonReq(sessionId));
					String json = resp.getJsonData();
					if(json!=null){
						JSONObject jsonMsg = JSON.parseObject(json);
						String callin = jsonMsg.getString("callin");
						String status = jsonMsg.getString("status");
						if(!callin.equals("[]")){
							logger.debug("查询到新呼入信息:"+callin);
							WebSocketMessage webSocketMessage = new WebSocketMessage();
							webSocketMessage.setMsgType("SCHEDULE001");
							webSocketMessage.setContent(callin);
//							mqMessageSendService.sendInternalWebMessage(JSONObject.toJSONString(webSocketMessage),"4437","SCHEDULING001");
						}else if(!status.equals("[]")){
							logger.debug("查询到状态信息:"+status);
							JSONArray statusJson = JSONArray.parseArray(status);
							String tel = statusJson.getJSONObject(1).getString("tel");
							logger.debug("tel:"+tel);
							WebSocketMessage webSocketMessage = new WebSocketMessage();
							webSocketMessage.setMsgType("SCHEDULE001");
							webSocketMessage.setContent(tel);
//							mqMessageSendService.sendInternalWebMessage(JSONObject.toJSONString(webSocketMessage),"4437","SCHEDULING001");
						}
					}else{
						logger.info("空推送消息:"+json);
					}
				} catch (RemoteException e) {
					logger.error("通讯调度系统====>>接受推送消息...异常",e.getMessage());
					timer.cancel();//停止定时器
				}
		      }
		    },0,3000);// 每隔3S执行一次
	}
	@Override
	public String CallAnswer(String callinTel) {
		CallAnswerReq parameters = new CallAnswerReq();
		parameters.setCallinTel(callinTel);
		parameters.setAnswerTel(caller);
		parameters.setSessionId(sessionId);
		try {
			CommonResp resp = 	voiceProxy.callAnswer(parameters);
			if(resp.getResultCode().equals("0")){
				logger.info("通讯调度系统====>>新呼入查询...成功");
//				return new String(true,callinTel,"呼入应答成功");
			}else{
//				return new String(false,callinTel,"呼入应答失败");
			}
		} catch (RemoteException e) {
			logger.error("通讯调度系统====>>呼入应答...异常",e.getMessage());
//			return new String(false,null,"呼入应答...异常:"+e.getMessage());
		}
		return null;
	}
	
	public boolean checkLogin(){
		return logined;
	}
	
	//======================  电话会议模块 start ==========================
	
	/**
	 * 查询会议列表
	 * @return   {
	 *             isLock:是否锁定, 1 已锁定 0 未锁定
	 *             isRecord:是否录音,1 正在录音 0 未录音
	 *             isVoice:是否正在播放背景音乐, 1 正在播放 0 未在播放
	 *             meetId:会议ID, 
	 *             meetNo:会议号,
	 *             members:会议成员列表
	 *             	    [{MeetMember},{MeetMember}]
	 *           }
	 */
	@Override
	public String queryMeet(){
		
		 String message = new String();
		
		 CommonReq req = new CommonReq(sessionId);
		 
		 try {
			 MeetQueryResp  resp = voiceProxy.meetQuery(req);
			 
			 if(commonResult("查询会议",resp.getResultCode())){
				 MeetInfo[] infoList  =  resp.getMeetInfos();
				 
//				 message.setSuccess(true);
//				 message.setObj(infoList);
//				 message.setMsg("查询会议信息成功");
				 
				 logger.debug("通讯调度系统====>>查询会议信息成功");
			 }else{
//				 message.setSuccess(false);
//				 message.setMsg("查询会议信息失败:"+errorReson);
			 }
		} catch (Exception e) {
//			 message.setSuccess(false);
//			 message.setMsg("查询会议信息异常:"+e.getMessage());
			 logger.error("通讯调度系统====>>查询会议信息异常:",e);
		}

		return message;
	}
	
	/**
	 * 创建会议
	 * @return
	 */
	@Override
	public String createMeet(){
		 String message = new String(); 
		
		 String meetNo = ScheduleConfigUtil.get("SCHEDULE_USERNAME").trim();
		 
		 MeetCreateReq req = new MeetCreateReq();
		 	           req.setSessionId(sessionId);
		 	           req.setMeetNo(meetNo);
		 	           req.setIsRecord(0);
		 	           
		try {
			 MeetCreateResp resp = voiceProxy.meetCreate(req);
			 
			 if(commonResult("创建会议",resp.getResultCode())){
				 
				 String meetId = resp.getMeetId();
				 
//				 message.setSuccess(true);
//				 message.setObj(meetId);
//				 message.setMsg("创建会议成功");
				 
				 logger.debug("通讯调度系统====>>创建会议成功,meetId:"+meetId);
			 }else{
//				 message.setSuccess(false);
//				 message.setMsg("创建会议失败:"+errorReson);
			 }			
		} catch (RemoteException e) {
//			 message.setSuccess(false);
//			 message.setMsg("创建会议异常:"+e.getMessage());
			 
			 logger.error("通讯调度系统====>>创建会议信息异常:",e);			
		}
		 
		 return message;
	}
	
	/**
	 * 删除会议 -- 将会议删除，会议不再存在，不能继续使用。
	 * @param meetId
	 * @return
	 */
	@Override
	public String deleteMeet(String meetId){
		String message = new String();
		String opTypeStr = "删除会议";

		MeetIdReq req = new MeetIdReq();
		req.setSessionId(sessionId);
		req.setMeetId(meetId);

		CommonResp resp = null;
		try {
			resp = voiceProxy.meetDelete(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());

			logger.error("通讯调度系统====>>" + opTypeStr + "异常:", e);
		}

		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");
			
			logger.debug(opTypeStr + "成功,meetId:"+meetId);
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败" + errorReson);
		}

		return message;
	}
	
	/**
	 * 结束会议 -- 结束正在进行中的会议，将会场中的所有成员都踢出会场，会议可以继续使用。
	 * @param meetId
	 * @return
	 */
	@Override
	public String endMeet(String meetId){
		String message = new String();

		String opTypeStr = "结束会议";

		MeetIdReq req = new MeetIdReq();
				  req.setSessionId(sessionId);
				  req.setMeetId(meetId);

		CommonResp resp = null;

		try {
			resp = voiceProxy.meetEnd(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());

			logger.error("通讯调度系统====>>"+ opTypeStr + "异常:", e);
		}

		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");

			logger.debug(opTypeStr + "成功,meetId:" + meetId);
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败:" + errorReson);
		}
		
		return message;
	}
	
	/**
	 * 锁定/解锁会场
	 * @param meetId
	 * @param opType  0 解锁  1 锁定
	 * @return
	 */
	@Override
	public String lockMeet(String meetId,int opType){
		String message = new String();
		
		MeetOperateReq req = new MeetOperateReq();
					   req.setSessionId(sessionId);
					   req.setMeetId(meetId);
					   req.setOpType(opType);
		String opTypeStr = (opType == 0)?"解锁会场":"锁定会场";	
		
		CommonResp resp = null;
		try {
			resp = voiceProxy.meetLock(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());
			logger.error("通讯调度系统====>>"+ opTypeStr + "异常:", e);
		}
		
		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");
			logger.debug(opTypeStr + "成功,meetId:" + meetId);
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败");
		}		
		
		return message;
	}
	
	
	/**
	 * 会场播放背景音乐
	 * @param meetId 
	 * @param opType 0：停止放音；1：开始放音
	 * @return
	 */
	@Override
	public String voiceMeet(String meetId,int opType){
		String message = new String();
		
		MeetOperateReq req = new MeetOperateReq();
					   req.setSessionId(sessionId);
					   req.setMeetId(meetId);
					   req.setOpType(opType);
		String opTypeStr = (opType == 0) ? "停止放音" : "开始放音";
		CommonResp resp = null;
		try {
			resp = voiceProxy.meetVoice(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());
			logger.error("通讯调度系统====>>"+ opTypeStr + "异常:", e);
		}
		
		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");
			logger.debug(opTypeStr + "成功,meetId:" + meetId);
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败");
		}
		
		return message;
	}
	
	
	/**
	 * 会场录音
	 * @param meetId
	 * @param opType 0：停止录音；1：开始录音
	 * @return
	 */
	@Override
	public String recordMeet(String meetId,int opType){
		String message = new String();
		
		MeetOperateReq req = new MeetOperateReq();
					   req.setSessionId(sessionId);
					   req.setMeetId(meetId);
					   req.setOpType(opType);
					   
		String opTypeStr = (opType == 0) ? "停止录音" : "开始录音";
		
		CommonResp resp = null;
		try {
			resp = voiceProxy.meetRecord(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());
			logger.error("通讯调度系统====>>"+ opTypeStr + "异常:", e);
		}
		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");
			logger.debug(opTypeStr + "成功,meetId:" + meetId);
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败");
		}
		
		return message;
	}
	
	
	/**
	 * 成员加入会议 
	 * @param meetId  会议ID
	 * @param tel 号码
	 * @param isSpeak 发言权限  0： 禁止发言；1：允许发言。
	 * @return
	 */
	@Override
	public String memberJoin(String meetId,String tel,int isSpeak){
		
		String message = new String();
		
		String opTypeStr = "成员加入会议" + "(";
	       opTypeStr +=  (isSpeak == 1)?"允许发言":"禁止发言" +")" ;
		
		MemberJoinReq req = new MemberJoinReq();
			          req.setSessionId(sessionId);
			          req.setMeetId(meetId);
			          req.setTel(tel);
			          req.setIsSpeak(isSpeak);
			          
		CommonResp resp = null;
		try {
			resp = voiceProxy.memberJoin(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());
			logger.error("通讯调度系统====>>"+ opTypeStr + "异常:", e);
		}
		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");
			logger.debug(opTypeStr + "成功,meetId:" + meetId +",tel:"+tel);
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败");
		}      
		
		return message;
	}
	
	/**
	 * 成员离开会议
	 * @param meetId 会议ID
	 * @param tel 号码
	 * @return
	 */
	@Override
	public String memberLeave(String meetId,String tel){
		
		String message = new String();
		
		String opTypeStr = "成员离开会议";
	       
		MemberLeaveReq req = new MemberLeaveReq();
			           req.setSessionId(sessionId);
			           req.setMeetId(meetId);
			           req.setTel(tel);
		
		CommonResp resp = null;
		try {
			resp = voiceProxy.memberLeave(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());
			logger.error("通讯调度系统====>>"+ opTypeStr + "异常:", e);
		}
		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");
			logger.debug(opTypeStr + "成功,meetId:" + meetId + ",tel:" + tel );
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败");
		}
		
		return message;
	}
	
	
	/**
	 * 修改成员等级
	 * @param meetId
	 * @param tel
	 * @param level  0：听众(不能发言)；1：发言者；2：主席。
	 * @return
	 */
	@Override
	public String memberLevel(String meetId,String tel,int level){
		
		String message = new String();
		
		String opTypeStr = "修改成员等级";
	       
		MemberLevelReq req = new MemberLevelReq();
			           req.setSessionId(sessionId);
			           req.setMeetId(meetId);
			           req.setTel(tel);
			           req.setLevel(level);
		
		CommonResp resp = null;
		try {
			resp = voiceProxy.memberLevel(req);
		} catch (RemoteException e) {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "异常:" + e.getMessage());
			logger.error("通讯调度系统====>>"+ opTypeStr + "异常:", e);
		}
		
		if (commonResult(opTypeStr, resp.getResultCode())) {
//			message.setSuccess(true);
//			message.setMsg(opTypeStr + "成功");
			logger.debug(opTypeStr + "成功,meetId:" + meetId + ",tel:" + tel);
		} else {
//			message.setSuccess(false);
//			message.setMsg(opTypeStr + "失败");
		}
		
		return message;
	}
	//======================  电话会议模块 end ==========================
}
