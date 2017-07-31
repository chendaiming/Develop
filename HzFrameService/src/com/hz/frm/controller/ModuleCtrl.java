package com.hz.frm.controller;

import java.io.File;
import java.net.URL;
import java.net.URLDecoder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;


@RequestMapping("moduleCtrl")
@Controller
public class ModuleCtrl {

	// 日志打印对象
	private static final Logger log = LoggerFactory.getLogger(ModuleCtrl.class);


	/**
	 * 获取模块组件主函数（JS）列表
	 * @param path 主函数（JS）目录
	 * @return
	 */
	@RequestMapping("loadModules")
	@ResponseBody
	public JSONObject loadModules (@RequestParam String path) {
		// 返回对象格式：{"JS文件名（不带后缀）": "JS文件名（带后缀）"}
		JSONObject respJSON = new JSONObject();
		String[] fileList = null;	// 文件集合
		String filePath = null;		// 文件路径
		String suffix = null;		// 文件后缀
		File file = null;			// 文件对象

		try {
			filePath = new URL(this.getClass().getResource("/") + "../../" + path).getPath();
			filePath = URLDecoder.decode(filePath, "utf-8");
			file = new File(filePath);
			fileList = file.list();

			if (fileList != null) {
	    		for (String fileName : fileList) {
	    			suffix = fileName.substring(fileName.lastIndexOf(".") + 1);

	    			if ("js".equals(suffix)) {
	    				respJSON.put(fileName.replace(".js", ""), fileName);
	    			}
	    		}
			}
		} catch (Exception e) {
			log.error("获取模块组件主函数（JS）列表异常：", e);
		}
		return respJSON;
	}
}
