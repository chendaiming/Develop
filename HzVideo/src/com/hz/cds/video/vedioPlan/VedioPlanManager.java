package com.hz.cds.video.vedioPlan;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class VedioPlanManager {
	private static final Logger logger = LoggerFactory.getLogger(VedioPlanManager.class);
	
	private static SchedulerFactory ckChedulerFactory = new StdSchedulerFactory();  
	
	private static String JOB_GROUP="VEDIO_PLAN_JOB_GROUP";//任务组
	
	private static String TRIGGER_GROUP="VEDIO_PLAN_TRIGGER_GROUP";//触发组
	
	
	
	public  static void addJob(String planId,String time,String fre,String cus,Class<? extends Job> task){
		
		try{
			
			Scheduler scheduler = ckChedulerFactory.getScheduler();
			
			JobDetail job = JobBuilder.newJob(task).withIdentity(planId, VedioPlanManager.JOB_GROUP).build();
			
			//检查任务是否已经存在
			if(!scheduler.checkExists(job.getKey())){
				
				JobDataMap map=job.getJobDataMap();
				
				map.put("planId",planId); 
				
				map.put("cus",cus); 
				
				String con=parseTime(time,fre);
				
				Trigger trigger=TriggerBuilder.newTrigger().withIdentity(planId, VedioPlanManager.TRIGGER_GROUP).withSchedule(CronScheduleBuilder.cronSchedule(con)).build();
				
				scheduler.scheduleJob(job, trigger);
				
				if(!scheduler.isStarted()){
					scheduler.start();
				}
			}
			
		}catch(Exception e){
			logger.info("任务添加失败："+e);
		}
	}
	//删除任务
	public static void removeJob(String planId){
		
		try{
			
			Scheduler sch=ckChedulerFactory.getScheduler();
			
			JobKey key=new JobKey(planId,VedioPlanManager.JOB_GROUP);
			
			TriggerKey trigger=new TriggerKey(planId,VedioPlanManager.TRIGGER_GROUP);
			
			sch.pauseTrigger(trigger);
			
			sch.pauseJob(key);
			
			sch.unscheduleJob(trigger);
			
			sch.deleteJob(key);
			
		}catch(Exception e){
			
			logger.info("任务删除失败"+e);
			
		}
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static void editJob(String planId,String time,String fre){
		
		try{
			Scheduler sch=ckChedulerFactory.getScheduler();
			
			CronTrigger  trigger=(CronTrigger) sch.getTrigger(new TriggerKey(planId,VedioPlanManager.TRIGGER_GROUP));
			if(trigger==null){
				return;
			}
			
			String oldTime = trigger.getCronExpression();  
			
			time=parseTime(time,fre);
            
			if (!oldTime.equalsIgnoreCase(time)) {  
            	
                JobDetail jobDetail = sch.getJobDetail(new JobKey(planId,VedioPlanManager.JOB_GROUP));  
                
                String cus=jobDetail.getJobDataMap().getString("cus");
                
				Class task= jobDetail.getJobClass();
                
                removeJob(planId);  
                addJob(planId, time,fre,cus, task);  
            } 
			
		}catch(Exception e){
			logger.info("任务修失败"+e);
		}
	}
	
	
	private static String parseTime(String time,String frequences){
		String[]  temp=time.contains(":")?time.split(":"):time.split(" ");
		
		time=(temp.length<3?"00":temp[2])+" "+temp[1]+" "+temp[0];
		if("1".equals(frequences)){//每天
			return time+" * * ?";
		}else if("2".equals(frequences)){//每
			return time+" * * ?";
		}
		return "";
	}
}
