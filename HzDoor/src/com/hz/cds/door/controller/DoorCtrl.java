package com.hz.cds.door.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.door.service.IDoorCtrlService;
import com.hz.frm.bean.AjaxMessage;
import com.hz.frm.common.BaseController;
import com.hz.frm.util.StringUtil;
@Controller
@RequestMapping("doorCtrl")
public class DoorCtrl extends BaseController {
	private static final Logger logger = LoggerFactory.getLogger(DoorCtrl.class);
	@Autowired
	IDoorCtrlService doorCtrlService;
	
	@ResponseBody
	@RequestMapping("openDoor")
	public AjaxMessage openDoor(@RequestParam String args){
		AjaxMessage ajaxMsg = new AjaxMessage();
		ajaxMsg=process(args,"1");
		return ajaxMsg;
	}
	@ResponseBody
	@RequestMapping("closeDoor")
	public AjaxMessage closeDoor(@RequestParam String args){
		AjaxMessage ajaxMsg = new AjaxMessage();
		ajaxMsg=process(args,"0");
		return ajaxMsg;
	}

	@ResponseBody
	@RequestMapping("lockDoor")
	public AjaxMessage lockDoor(@RequestParam String args){
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
				List<Object> doorIdList=new ArrayList<Object>();
				String cusNumber=parasObject.getString("cusNumber");
				doorIdList=parasObject.getJSONArray("doorId");
				doorCtrlService.lockDoor(cusNumber, doorIdList);
				ajaxMsg.setSuccess(true);
			}else{
				ajaxMsg.setSuccess(false);
				ajaxMsg.setMsg("参数不能为空");
			}
		} catch (Exception e) {
			logger.error("", e);
			ajaxMsg.setSuccess(false);
			ajaxMsg.setMsg("出现异常:"+e.getMessage());
		}
		return ajaxMsg;
	}
	
	private AjaxMessage process(String args,String action){
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
				List<Object> parasList=new ArrayList<Object>();
				String cusNumber=parasObject.getString("cusNumber");
				parasList=parasObject.getJSONArray("doorId");
				for(int i=0;i<parasList.size();i++){
					String doorId=parasList.get(i).toString();
					doorCtrlService.openDoor(cusNumber,doorId,action);
				}
				ajaxMsg.setSuccess(true);
			}else{
				ajaxMsg.setSuccess(false);
				ajaxMsg.setMsg("参数不能为空");
			}
		} catch (Exception e) {
			logger.error("", e);
			ajaxMsg.setSuccess(false);
			ajaxMsg.setMsg("出现异常:"+e.getMessage());
		}
		return ajaxMsg;
	}
	

	
}
