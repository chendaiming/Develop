package com.hz.frm.common;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hz.frm.security.StringEscapeEditor;

/**
 * 控制器模板类
 * @author xie.yh
 *
 */
public abstract class BaseController{
	/**
	 * 防止XSS攻击
	 * @param binder
	 */
	@InitBinder
	public void initBinder(ServletRequestDataBinder binder) {
		// 自动转换日期类型的字段格式
		binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"), true));
		// 防止XSS攻击
		binder.registerCustomEditor(String.class, new StringEscapeEditor(false, false));
	}

	/**
	 * 用户跳转JSP页面 此方法不考虑权限控制
	 * @param folder路径
	 * @param jspName
	 * @return 指定JSP页面
	 */
	@RequestMapping("/{folder}/{jspName}")
	public String redirectJsp(@PathVariable String folder, @PathVariable String jspName) {
		return "/" + folder + "/" + jspName;
	}
}
