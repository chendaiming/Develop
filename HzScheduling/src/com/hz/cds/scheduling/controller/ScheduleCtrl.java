package com.hz.cds.scheduling.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.hz.cds.scheduling.webService.impl.ScheduleServiceImpl;
import com.hz.frm.util.StringUtil;

@Controller
@RequestMapping("schedule")
public class ScheduleCtrl {
	final Logger logger = LoggerFactory.getLogger(ScheduleCtrl.class);
	
	@Resource private ScheduleServiceImpl ScheduleServiceimpl;
	
	/**
	 * 
	 * @return
	 */
	@RequestMapping("excute")
	@ResponseBody
	public String scheduleProcess(@RequestParam() String args){
		logger.debug("通讯调度系统,传入参数===>>"+args);
		String message = "";
		String otype = "";
				
		if(!StringUtil.isNull(args)){
			//将前台参数转换为json对象
			JSONObject params = JSONObject.parseObject(args);
			otype = params.getString("otype");
			
			switch(otype){
				case "call"://呼叫
					String callee = params.getString("callee");
					message = ScheduleServiceimpl.callPhone(callee, 0);
					break;
				case "message"://短信
					String receive = params.getString("receive");
					String content = params.getString("content");
					String time    = params.getString("time");
					int type    = params.getInteger("type");
					message = ScheduleServiceimpl.sendMessage(receive, content, time, type);
					break;
				case "recordQuery"://录音查询
					int recordType   = params.getInteger("recordType");
					String caller    = params.getString("caller");
					String callee_2  = params.getString("callee");
					String timeMin   = params.getString("timeMin");
					String timeMax   = params.getString("timeMax");
					int pageIndex    = params.getInteger("pageIndex");
					int pageSize     = params.getInteger("pageSize");
					message = ScheduleServiceimpl.recordQuery(recordType, caller,callee_2,timeMin,timeMax,pageIndex,pageSize);
					break;
				case "callHangup"://
					String tel = params.getString("tel");
					message = ScheduleServiceimpl.callClose(tel);
					break;
				case "download"://文件下载
					String filename = params.getString("filename");
					int record_type = params.getInteger("type");
					message = ScheduleServiceimpl.fileDownload(filename, record_type);
					break;
				case "groupCall":
					String tels = params.getString("callee");
					message = ScheduleServiceimpl.groupCall(tels);
					break;
				case "callQuery"://查询新呼入
					message = ScheduleServiceimpl.CallinQuery();
					break;
				case "CallAnswer"://查询新呼入
					String _tel = params.getString("tel");
					message = ScheduleServiceimpl.CallAnswer(_tel);
					break;
			}
		}
		
		return message; 
	}

	@RequestMapping("meet")
	@ResponseBody
	public String meetProcess(@RequestParam() String args){
		logger.debug("通讯调度系统--电话会议,传入参数===>>"+args);
		String message = "";
		String otype = "";
				
		if(!StringUtil.isNull(args)){
			//将前台参数转换为json对象
			JSONObject params = JSONObject.parseObject(args);
			otype = params.getString("otype");
			
			switch(otype){
				case "queryMeet"://查询
					message = ScheduleServiceimpl.queryMeet();
					break;
				case "createMeet"://创建
					message = ScheduleServiceimpl.createMeet();
					break;
				case "deleteMeet"://删除
					String meetId    = params.getString("meetId");
					message = ScheduleServiceimpl.deleteMeet(meetId);
					break;
				case "endMeet"://结束会议
					String meetId_end    = params.getString("meetId");
					message = ScheduleServiceimpl.endMeet(meetId_end);
					break;
				case "lockMeet"://锁定会场
					String meetId_lock    = params.getString("meetId");
					int lock_type  = params.getIntValue("opType");
					message = ScheduleServiceimpl.lockMeet(meetId_lock,lock_type);
					break;
				case "voiceMeet": //录音播放
					String meetId_voice    = params.getString("meetId");
					   int voice_type  = params.getIntValue("opType");
					message = ScheduleServiceimpl.voiceMeet(meetId_voice, voice_type);
					break;
				case "recordMeet"://录音
					String meetId_record   = params.getString("meetId");
					   int record_type  = params.getIntValue("opType");
					message = ScheduleServiceimpl.recordMeet(meetId_record, record_type);
					break;
				case "memberJoin"://成员加入会议
					String meetId_join = params.getString("meetId");
					String tel_join = params.getString("tel");
					   int isSpeak = params.getIntValue("isSpeak");
					message = ScheduleServiceimpl.memberJoin(meetId_join, tel_join, isSpeak);
					break;
				case "memberLeave"://成员离开会议
					String meetId_leave = params.getString("meetId");
					String tel_leave = params.getString("tel");
					message = ScheduleServiceimpl.memberLeave(meetId_leave, tel_leave);
					break;
				case "memberLevel"://成员权限变更
					String meetId_Level = params.getString("meetId");
					String tel_Level = params.getString("tel");
					   int level = params.getIntValue("level");
					message = ScheduleServiceimpl.memberLevel(meetId_Level, tel_Level, level);
					break;					
			}
		}
		
		return message; 
	}
	
}

