package com.hz.cds.scheduling.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.hz.cds.scheduling.webService.impl.IccphoneWsImpl;
import com.hz.frm.util.StringUtil;

@Controller
@RequestMapping("iccPhoneCtrl")
public class IccPhoneCtrl {
	final Logger logger = LoggerFactory.getLogger(IccPhoneCtrl.class);
	
	@Resource private IccphoneWsImpl iccphoneWsImpl;
	
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
			String sphone = "";
			String sheetNum = "";
			String sendNum = "";
			switch(otype){
				case "call"://呼叫
					sphone = params.getString("sphone");
					sheetNum = params.getString("sheetNum");
					sendNum = params.getString("sendNum");
					message = iccphoneWsImpl.call(sheetNum, sendNum, sphone);
					break;
				case "message"://短信
					String msg = params.getString("msg");
					sphone = params.getString("sphone");
					message = iccphoneWsImpl.sendMessage(sphone, msg);
					break;
				case "clearCall"://挂断
					sheetNum = params.getString("sheetNum");
					message = iccphoneWsImpl.clearCall(sheetNum);
					break;
				case "sheetStatus"://获取坐席状态
					sheetNum = params.getString("sheetNum");
					message = iccphoneWsImpl.getSheetStatus(sheetNum);
					break;
				case "filePath"://获取文件虚拟目录
					String dirfile = params.getString("dirfile");
					message = iccphoneWsImpl.getRecordPathByFile(dirfile);
					break;
				case "calloutQun"://群呼(电话会议发起)
					sphone = params.getString("sphone");
					sheetNum = params.getString("sheetNum");
					sendNum = params.getString("sendNum");
					message = iccphoneWsImpl.callOutQun(sheetNum, sendNum, sphone);
					break;
				case "callOutQun_Option":
					sphone = params.getString("sphone");
					sheetNum = params.getString("sheetNum");
					String sOption = params.getString("sOption");
					message = iccphoneWsImpl.CallOutQun_Option(sheetNum, sphone, sOption);
					break;
				case "changeVoice":
					sheetNum = params.getString("sheetNum");
					String voice = params.getString("voice");
					message = iccphoneWsImpl.changeVoice(sheetNum, voice);
					break;
				case "lis":
					sheetNum = params.getString("sheetNum");
					String ctrlSheetNum = params.getString("ctrlSheetNum");
					message = iccphoneWsImpl.lisCall(sheetNum, ctrlSheetNum);
					break;
				case "into":
					sheetNum = params.getString("sheetNum");
					String ctrlNum = params.getString("ctrlSheetNum");
					message = iccphoneWsImpl.intoCall(sheetNum, ctrlNum);
					break;
			}
		}
		
		return message; 
	}
	/**
	 * 查询通话记录
	 * @param args
	 * @return
	 */
	@RequestMapping("record")
	@ResponseBody
	public JSONObject scheduleRecord(@RequestParam() String args){
		logger.debug("通讯调度系统,录音查询===>>"+args);
		JSONObject message = null;
				
		if(!StringUtil.isNull(args)){
			//将前台参数转换为json对象
			JSONObject param =  JSONObject.parseObject(args).getJSONObject("params");
			String phoneNum = param.getString("phoneNum");
			String startTime = param.getString("startTime");
			String endTime = param.getString("endTime");
			message = iccphoneWsImpl.getRecordData(phoneNum, startTime,endTime);
		}
		return message; 
	}
	
	/**
	 * 获取用户通讯录
	 * @param cusNumber
	 * @param sPhone  
	 * @return
	 */
	@RequestMapping("userPhone")
	@ResponseBody
	public JSONObject scheduleUserPhone(@RequestParam() String groupId,@RequestParam() String sPhone){
		return iccphoneWsImpl.getUserPhone(groupId, sPhone);
	}
	
	/**
	 * 获取黑名单
	 * @param sPhone
	 * @param nAction  
	 * @return
	 */
	@RequestMapping("blackList")
	@ResponseBody
	public JSONObject scheduleBlackList(@RequestParam() String sPhone,@RequestParam() int nAction){
		return iccphoneWsImpl.doBlackList(sPhone,nAction);
	}
	
	/**
	 * 获取所有内线分机号
	 * @return
	 */
	@RequestMapping("allSheet")
	@ResponseBody
	public JSONObject SheetList(){
		return iccphoneWsImpl.getALLSheetNo();
	}	
}
