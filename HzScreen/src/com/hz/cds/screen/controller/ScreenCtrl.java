package com.hz.cds.screen.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.screen.service.ScreenService;
import com.hz.frm.bean.AjaxMessage;
import com.hz.frm.util.StringUtil;

@Controller
@RequestMapping("/screen")
public class ScreenCtrl {
	// 日志对象
	private static final Logger logger = LoggerFactory.getLogger(ScreenCtrl.class);
	
	@Resource ScreenService screenService;
	/**
	 * 大屏图像切换
	 * @param args
	 * @return
	 */
	@ResponseBody
	@RequestMapping("screenSwitch")
	public AjaxMessage controlScreen(@RequestParam String args){
		logger.info("传入的参数==>"+args);
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
			    String cusNumber=parasObject.getString("cusNumber");
			    String screenID=parasObject.getString("screenID");//
				String cameraID =parasObject.getString("cameraID");//
				String screenArea = parasObject.getString("screenArea");//
				screenService.screenSwitch(cusNumber, screenID, cameraID, screenArea);
				JSONObject rtnData = new JSONObject();
				ajaxMsg.setObj(rtnData);
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
	
	/**
	 * 大屏布局切换
	 * @param args
	 * @return
	 */
	@ResponseBody
	@RequestMapping("layoutSwitch")
	public AjaxMessage controlLayout(@RequestParam String args){
		logger.info("传入的参数==>"+args);
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
			    String cusNumber=parasObject.getString("cusNumber");
			    String screenID=parasObject.getString("screenID");//屏编号
				String layoutID =parasObject.getString("layoutID");//布局编号
				String remark = parasObject.getString("remark");//
				screenService.LayoutSwitch(cusNumber,screenID,layoutID,remark);
				JSONObject rtnData = new JSONObject();
				ajaxMsg.setObj(rtnData);
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

	/**
	 * 大屏布局切换
	 * @param args
	 * @return
	 */
	@ResponseBody
	@RequestMapping("excute")
	public AjaxMessage screenCtrl(@RequestParam String msg,@RequestParam String cusNumber){
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(msg) && !StringUtil.isNull(cusNumber)){
				screenService.ScreenSend(cusNumber, msg);
				ajaxMsg.setSuccess(true);
			}else{
				ajaxMsg.setSuccess(false);
				ajaxMsg.setMsg("消息不能为空");
			}
		} catch (Exception e) {
			logger.error("", e);
			ajaxMsg.setSuccess(false);
			ajaxMsg.setMsg("出现异常:"+e.getMessage());
		}
		return ajaxMsg;
	}	
}
