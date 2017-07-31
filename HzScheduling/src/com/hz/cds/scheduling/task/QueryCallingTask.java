package com.hz.cds.scheduling.task;

import java.util.Date;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.hz.cds.scheduling.cache.TelephoneCache;
import com.hz.cds.scheduling.util.ScheduleConfigUtil;
import com.hz.cds.scheduling.webService.impl.IccphoneWsImpl;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.DateUtil;
import com.hz.frm.util.StringUtil;


public class QueryCallingTask {
	private static final Logger logger = LoggerFactory.getLogger(QueryCallingTask.class);
	
	@Resource  IccphoneWsImpl iccphoneWsImpl;   
	@Resource  MqMessageSendService mqMessageSendService;
	@Resource  TelephoneCache telephoneCache;
	
	private static String cusNumber = ScheduleConfigUtil.get("CUSNUMBER");
	
//	@Scheduled(cron="0/3 * * * * ?")
	public void startRun() {
		String result = iccphoneWsImpl.getCalling();
		if(!StringUtil.isNull(result)){
			logger.debug("通讯调度====>>通话列表:"+ result);
			String[] list = result.split(",");
			//暂时只截取第一个来电
			String sphone = list[0];
			String sheetNum = list[1];
			String time = list[2];
			
			JSONObject msg = new JSONObject();
			msg.put("phone", sphone);
			msg.put("time", time);
			//尝试从缓存中获取来电人员信息
			JSONObject phoneObj = telephoneCache.getTelephoneInfo(sheetNum, sphone);
			
			if(phoneObj != null){
				msg.put("name", phoneObj.getString("name"));
				msg.put("dept", phoneObj.getString("deptName"));
			}else{
				//缓存中无此人信息再获取归属地
				msg.put("name", "未知人员");
				msg.put("dept", iccphoneWsImpl.getArea(sphone));
			}
			//推送到前台
			mqMessageSendService.sendInternalWebMessage(msg,cusNumber,"SCHEDULING001");
			//清除此号码的来电信息
			iccphoneWsImpl.clearCalling(sphone);
		}
	}
	
	
}
