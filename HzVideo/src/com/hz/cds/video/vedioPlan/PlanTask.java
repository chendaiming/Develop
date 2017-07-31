package com.hz.cds.video.vedioPlan;

import java.util.List;
import java.util.Map;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.hz.db.service.IQueryByParamKeyService;
import com.hz.db.service.IUpdateService;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.ApplicationContextUtil;

public class PlanTask implements Job{
	
	private static final Logger logger = LoggerFactory.getLogger(PlanTask.class);
	
	private static  ApplicationContextUtil app=ApplicationContextUtil.getInstance();
	
	@Override
	public void execute(JobExecutionContext job) throws JobExecutionException {
		
		
		
		JobDataMap jobDetail=job.getJobDetail().getJobDataMap();
	 
		String planid=jobDetail.getString("planId");//获取要巡视计划主键
	 
		logger.info("开始执行计划任务planId:"+planid);
		
		String cus=jobDetail.getString("cus");//获取要巡视计划主键
		
		try {
			 
			IUpdateService updateService=(IUpdateService) app.getBean("updateServiceImpl");
			
			MqMessageSendService message=(MqMessageSendService) app.getBean("mqMessageSendService");
			 
			String sqlParam="[{params:[{cus:'"+cus+"',planid:'"+planid+"'}],sqlId:'insert_into_vedio_plan_record'}]";
			
			updateService.updateByParamKey(JSONObject.parseArray(sqlParam));
			
			//
			IQueryByParamKeyService query=(IQueryByParamKeyService) app.getBean("queryByParamKeyServiceImpl");
			
			List<Map<String,Object>> list=query.query(JSONObject.parseObject("{params:{cus:'"+cus+"',planid:'"+planid+"'},sqlId:'select_video_plan_notice'}"));
		
			if(list.size()>0){
				JSONObject json=new JSONObject();
				json.put("notice", list.get(0));//用户信息以逗号分隔的字符串形式'user1,user2'
				//json.put("cameras", list.toArray());//摄像机，{name:'',id:''}
				message.sendInternalWebMessage(json, cus, "VEDIO_PLAN_NOTICE");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
