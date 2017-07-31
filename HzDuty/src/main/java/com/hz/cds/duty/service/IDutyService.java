package com.hz.cds.duty.service;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSONObject;

public interface IDutyService {
	/**
	 * 生成值班模板excel文件
	 */
    public String exportExcel(JSONObject argsObj) throws Exception;
    /**
	 * 下载值班模板excel文件
	 */
    public void uploadExcel(String pathName, HttpServletResponse response) throws Exception;
    /**
	 * 导入值班表excel文件
	 */
    public List<List<Map<String, Object>>> importExcel(CommonsMultipartFile file);
}
