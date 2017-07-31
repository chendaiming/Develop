package com.hz.cds.video.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.hz.cds.video.vedioPlan.PlanTask;
import com.hz.cds.video.vedioPlan.VedioPlanManager;
import com.hz.db.service.IQueryService;

@Controller
@RequestMapping("vedioPlan")
public class VedioPlan implements ApplicationListener<ContextRefreshedEvent>{
	
	private static final Logger logger = LoggerFactory.getLogger(VedioPlan.class);
	
	@Resource
	IQueryService queryService;
	
	
	@Override
	public void onApplicationEvent(ContextRefreshedEvent arg0) {
		if (arg0.getApplicationContext().getParent() != null) {
			//系统重启后恢复计划
			List<Map<String, Object>> list;

			try {
				list = queryService.query("select_resume_plan_all", null);
				logger.info("恢复计划任务个数>>>"+list.size());
				String planId;
				for(Map<String,Object> task:list){
					planId=task.get("vpp_id").toString();
					
					VedioPlanManager.addJob(planId,task.get("vpp_excute_time").toString(), task.get("vpp_frequenes").toString(),task.get("cus").toString() ,PlanTask.class);
					logger.info("恢复计划任务名称>>>"+planId);
				}
			} catch (Exception e) {
				logger.error("计划恢复失败");
				e.printStackTrace();
			}
		}
	}

	@SuppressWarnings("unchecked")
	@RequestMapping("opr")
	@ResponseBody
	public String opr(@RequestParam String args) {
		
		Map<String, Object>[] arr = JSONArray.parseObject(args, Map[].class);
		
		Map<String, Object> task;
		
		String opr;
		
		for (int i = 0; i < arr.length; i++) {
			
			task =arr[i];
			
			opr=task.get("opr").toString();
			
			switch(opr){
				case "add":
					VedioPlanManager.addJob(task.get("vpp_id").toString(),task.get("vpp_excute_time").toString(), task.get("vpp_frequenes").toString(),task.get("cus").toString() ,PlanTask.class);
					break;
				case "update":
					//VedioPlanManager.editJob(task.get("vpp_name").toString(),task.get("vpp_excute_time").toString(), task.get("vpp_frequenes").toString(), String.valueOf(task.get("vpp_id")));
					VedioPlanManager.removeJob(task.get("vpp_id").toString());
					VedioPlanManager.addJob(task.get("vpp_id").toString(),task.get("vpp_excute_time").toString(), task.get("vpp_frequenes").toString(),task.get("cus").toString() ,PlanTask.class);
					break;
				case "remove":
					VedioPlanManager.removeJob(task.get("vpp_id").toString());
			}
		}
		
		return "1";
	}
	
	
	public static void main(String args[]){
		
		String d="[{\"sqlId\":\"insert_vedio_plan\",\"params\":[{\"vpp_cus_number\":3223,\"vpp_name\":\"\",\"vpp_excute_time\":\"09:57:00\",\"vpp_frequenes\":\"1\",\"vpp_creater\":10286,\"index\":0}],\"opr\":\"add\"}]";
		System.out.println(JSONArray.parseArray(d));
	}

	
}
