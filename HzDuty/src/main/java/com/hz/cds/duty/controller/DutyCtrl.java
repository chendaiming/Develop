package com.hz.cds.duty.controller;

import java.net.URLDecoder;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.duty.service.IDutyService;
import com.hz.frm.common.BaseController;
@Controller
@RequestMapping("dutyCtrl")
public class DutyCtrl extends BaseController {
	private static final Logger logger = LoggerFactory.getLogger(DutyCtrl.class);
	
	@Autowired
	IDutyService dutyCtrlService;
	
	/**
	 * 生成值班模板excel文件
	 * @param args
	 * @return
	 */
	@ResponseBody
	@RequestMapping("exportExcel")
	public JSONObject exportExcel(@RequestParam String args){
		JSONObject argsObj = JSONObject.parseObject(args);
		String result = null;
		try {
			result = dutyCtrlService.exportExcel(argsObj);
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.debug("result = " + result);
		JSONObject obj = new JSONObject();
		obj.put("result", result);
		return obj;
	}
	/**
	 * 下载值班模板excel文件
	 * @param response
	 * @param pathName
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping("downloadExcel")
	public void uploadExcel(@RequestParam String args, HttpServletResponse response) throws Exception{
		String pathName = URLDecoder.decode(JSONObject.parseObject(args).getString("pathName"), "UTF-8");
		dutyCtrlService.uploadExcel(pathName,response);
	}
	/**
	 * 导入值班表excel文件
	 * @param args
	 * @return
	 */
	@ResponseBody
	@RequestMapping("importExcel")
	public List<List<Map<String, Object>>> importExcel(@RequestParam CommonsMultipartFile file){
		List<List<Map<String, Object>>> dataList = dutyCtrlService.importExcel(file);
		return dataList;
	}
}
