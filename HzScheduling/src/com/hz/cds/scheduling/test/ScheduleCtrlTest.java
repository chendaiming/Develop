package com.hz.cds.scheduling.test;

import java.rmi.RemoteException;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.scheduling.util.ScheduleConfigUtil;

import cn.showclear.www.ScService.BWListQueryResp;
import cn.showclear.www.ScService.ScServicePortTypeProxy;
import cn.showclear.www.VoiceService.CommonReq;
import cn.showclear.www.VoiceService.CommonResp;
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

public class ScheduleCtrlTest {
	
	static VoiceService2PortTypeProxy voiceProxy = null;
	private static String sessionId = "admin1500896112220";
	
	/** 执行失败原因,用于返回给前台 */
	private String errorReson = "";
	
	public ScheduleCtrlTest(){
		voiceProxy =  new VoiceService2PortTypeProxy();
	}
	
	
	public static void main(String[] args) {	
		
//		 ScheduleCtrlTest ctrl = new ScheduleCtrlTest();
		 try {
				    ScServicePortTypeProxy  scs = new ScServicePortTypeProxy();
					 BWListQueryResp resp =  scs.BWListQuery();
					 System.out.println("操作结果代码:"+ resp.getReturnCode());
					 System.out.println("总条数:"+ resp.getTotal());
					 System.out.println("列表:"+ resp.getBeans());
					// TODO Auto-generated catch block
			 
//			 sessionId = "admin1500903862026";
//			 AppServicePortTypeProxy appProxy = new AppServicePortTypeProxy();
//			 MsgSendReq params = new MsgSendReq("93158110","18970849689","怀集监狱指挥调度平台测试短信2","",0);
//			 IdResp result = appProxy.msgSend(params);
//				if(result.getResultCode().equals("0")){
//					System.out.println("发送短信成功...");
//				}else{
//					System.out.println("发送短信失败:"+result.getResultCode());
//				}
//			 voiceProxy =  new VoiceService2PortTypeProxy();
//			 CallReq call = new CallReq(sessionId,"998","18970849689",0);
//			 CommonResp callResult =	voiceProxy.call(call);
//			 System.out.println(callResult.getResultCode());
//				if(commonResult("call",callResult.getResultCode())){
//					logger.debug("通讯调度系统====>>呼叫"+callee+"成功!");
//					return new AjaxMessage(true,"","呼叫成功");
//				}else{
//					return new AjaxMessage(false,"","呼叫失败:"+errorReson);
//				}
			 //查询会议
//			 String result = ctrl.queryMeet();
//			 
			 //创建会议
//			 String result = ctrl.createMeet();
			 
			 //删除会议
//			 String result = ctrl.deleteMeet("1001");
			 
			 //结束会议
//			 String result = ctrl.endMeet("1001");
			 
			 //锁定/解锁会场
//			 String result = ctrl.lockMeet("1001",0);
			 
			 //会场播放背景音乐
//			 String result = ctrl.voiceMeet("1001",1); //开始播放背景音乐
//			 String result = ctrl.voiceMeet("1001",0); //停止播放背景音乐
			 
			 //会场录音
//			 String result = ctrl.recordMeet("1001", 1); //开始录音 
//			 String result = ctrl.recordMeet("1001", 0); //结束录音
			 
			 //成员加入会议
//			 String result = ctrl.memberJoin("1001", "018616618785", 1);
//			 String result = ctrl.memberJoin("1001", "018970849689", 1);
//			 String result = ctrl.memberJoin("1001", "013824428481", 0);
			 
			 //成员离开会议
//			 String result = ctrl.memberLeave("1001", "018970849689");
//			 String result = ctrl.memberLeave("1001", "018616618785");
//			 String result = ctrl.memberLeave("1001", "013824428481");
			 
			 //修改成员等级
//			 String result = ctrl.memberLevel("1001", "018970849689",1);
//			 String result = ctrl.memberLevel("1001", "013824428481",1);
			 
//			 System.out.println(result);
		 } catch (RemoteException e) {
			 e.printStackTrace();
		 }
	}
	
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
	 * @throws RemoteException
	 */
	public String queryMeet()throws RemoteException{
		
		 CommonReq req = new CommonReq(sessionId);
		 
		 MeetQueryResp  resp = voiceProxy.meetQuery(req);
		
		 String meetInfo = "";
		 
		 if(commonResult("查询会议",resp.getResultCode())){
			 MeetInfo[] infoList  =  resp.getMeetInfos();
			 if(infoList.length > 0){
				  meetInfo = JSON.toJSONString(infoList); 
			 }
		 }
		return meetInfo;
	}
	
	/**
	 * 创建会议
	 * @return
	 * @throws RemoteException
	 */
	public String createMeet() throws RemoteException{
		 String meetNo = ScheduleConfigUtil.get("SCHEDULE_USERNAME").trim();
		 String meetId = "";
		 
		 MeetCreateReq req = new MeetCreateReq();
		 	           req.setSessionId(sessionId);
		 	           req.setMeetNo(meetNo);
		 	           req.setIsRecord(0);
		 
		 MeetCreateResp resp = voiceProxy.meetCreate(req);
		 
		 if(commonResult("创建会议",resp.getResultCode())){
			 meetId = resp.getMeetId();
		 }else{
			 System.out.println("创建会议失败:"+errorReson);
		 }
		 
		 return meetId;
	}
	
	/**
	 * 删除会议 -- 将会议删除，会议不再存在，不能继续使用。
	 * @param meetId
	 * @return
	 * @throws RemoteException
	 */
	public String deleteMeet(String meetId) throws RemoteException{
		MeetIdReq req = new MeetIdReq();
				  req.setSessionId(sessionId);
				  req.setMeetId(meetId);
		
		CommonResp resp = voiceProxy.meetDelete(req);
		 if(commonResult("删除会议",resp.getResultCode())){
			 return "删除会议成功,meetId:"+meetId;
		 }else{
			 return "删除会议失败,meetId:"+meetId+","+errorReson;
		 }
	}
	
	/**
	 * 结束会议 -- 结束正在进行中的会议，将会场中的所有成员都踢出会场，会议可以继续使用。
	 * @param meetId
	 * @return
	 * @throws RemoteException
	 */
	public String endMeet(String meetId) throws RemoteException{
		MeetIdReq req = new MeetIdReq();
				  req.setSessionId(sessionId);
		          req.setMeetId(meetId);
		          
		CommonResp resp = voiceProxy.meetEnd(req);
		 if(commonResult("结束会议",resp.getResultCode())){
			 return "结束会议成功,meetId:"+meetId;
		 }else{
			 return "结束会议失败,meetId:"+meetId+","+errorReson;
		 }
	}
	
	/**
	 * 锁定/解锁会场
	 * @param meetId
	 * @param opType  0 解锁  1 锁定
	 * @return
	 * @throws RemoteException
	 */
	public String lockMeet(String meetId,int opType)throws RemoteException{
		MeetOperateReq req = new MeetOperateReq();
					   req.setSessionId(sessionId);
					   req.setMeetId(meetId);
					   req.setOpType(opType);
		String opTypeStr = (opType == 0)?"解锁会场":"锁定会场";			   
		CommonResp resp = voiceProxy.meetLock(req);
		if (commonResult(opTypeStr, resp.getResultCode())) {
			return opTypeStr + "成功,meetId:" + meetId;
		} else {
			return opTypeStr + "失败,meetId:" + meetId + "," + errorReson;
		}		
	}
	
	
	/**
	 * 会场播放背景音乐
	 * @param meetId 
	 * @param opType 0：停止放音；1：开始放音
	 * @return
	 * @throws RemoteException
	 */
	public String voiceMeet(String meetId,int opType)throws RemoteException{
		MeetOperateReq req = new MeetOperateReq();
					   req.setSessionId(sessionId);
					   req.setMeetId(meetId);
					   req.setOpType(opType);
		String opTypeStr = (opType == 0) ? "停止放音" : "开始放音";
		CommonResp resp = voiceProxy.meetVoice(req);
		if (commonResult(opTypeStr, resp.getResultCode())) {
			return opTypeStr + "成功,meetId:" + meetId;
		} else {
			return opTypeStr + "失败,meetId:" + meetId + "," + errorReson;
		}
	}
	/**
	 * 会场录音
	 * @param meetId
	 * @param opType 0：停止录音；1：开始录音
	 * @return
	 * @throws RemoteException
	 */
	public String recordMeet(String meetId,int opType)throws RemoteException{
		
		MeetOperateReq req = new MeetOperateReq();
					   req.setSessionId(sessionId);
					   req.setMeetId(meetId);
					   req.setOpType(opType);
					   
		String opTypeStr = (opType == 0) ? "停止录音" : "开始录音";
		
		CommonResp resp = voiceProxy.meetRecord(req);
		if (commonResult(opTypeStr, resp.getResultCode())) {
			return opTypeStr + "成功,meetId:" + meetId;
		} else {
			return opTypeStr + "失败,meetId:" + meetId + "," + errorReson;
		}
	}
	
	
	/**
	 * 成员加入会议 
	 * @param meetId  会议ID
	 * @param tel 号码
	 * @param isSpeak 发言权限  0： 禁止发言；1：允许发言。
	 * @return
	 * @throws RemoteException
	 */
	public String memberJoin(String meetId,String tel,int isSpeak)throws RemoteException{
		
		String opTypeStr = "成员加入会议" + "(";
	       opTypeStr +=  (isSpeak == 1)?"允许发言":"禁止发言" +")" ;
		
		MemberJoinReq req = new MemberJoinReq();
			          req.setSessionId(sessionId);
			          req.setMeetId(meetId);
			          req.setTel(tel);
			          req.setIsSpeak(isSpeak);
			          
		CommonResp resp = voiceProxy.memberJoin(req);
		if (commonResult(opTypeStr, resp.getResultCode())) {
			return opTypeStr + "成功,meetId:" + meetId +",tel:"+tel;
		} else {
			return opTypeStr + "失败,meetId:" + meetId +",tel:"+tel + "," + errorReson;
		}          
	}
	
	/**
	 * 成员离开会议
	 * @param meetId 会议ID
	 * @param tel 号码
	 * @return
	 * @throws RemoteException
	 */
	public String memberLeave(String meetId,String tel)throws RemoteException{
		
		String opTypeStr = "成员离开会议";
	       
		MemberLeaveReq req = new MemberLeaveReq();
			           req.setSessionId(sessionId);
			           req.setMeetId(meetId);
			           req.setTel(tel);
		
		CommonResp resp = voiceProxy.memberLeave(req);
		if (commonResult(opTypeStr, resp.getResultCode())) {
			return opTypeStr + "成功,meetId:" + meetId + ",tel:" + tel;
		} else {
			return opTypeStr + "失败,meetId:" + meetId + ",tel:" + tel + "," + errorReson;
		}
	}
	
	
	/**
	 * 修改成员等级
	 * @param meetId
	 * @param tel
	 * @param level  0：听众(不能发言)；1：发言者；2：主席。
	 * @return
	 * @throws RemoteException
	 */
	public String memberLevel(String meetId,String tel,int level)throws RemoteException{
		
		String opTypeStr = "修改成员等级";
	       
		MemberLevelReq req = new MemberLevelReq();
			           req.setSessionId(sessionId);
			           req.setMeetId(meetId);
			           req.setTel(tel);
			           req.setLevel(level);
		
		CommonResp resp = voiceProxy.memberLevel(req);
		
		if (commonResult(opTypeStr, resp.getResultCode())) {
			return opTypeStr + "成功,meetId:" + meetId + ",tel:" + tel;
		} else {
			return opTypeStr + "失败,meetId:" + meetId + ",tel:" + tel + "," + errorReson;
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
			System.out.println("通讯调度系统====>>"+type+"失败:"+errorReson);
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
}
