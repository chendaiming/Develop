package com.hz.cds.person.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.hz.cds.person.bean.PersonMessageBean;
import com.hz.cds.person.util.Read_Excel;
import com.hz.frm.bean.AjaxMessage;

@Controller
@RequestMapping("excl")
public class UploadController {
	private static final Logger logger = LoggerFactory.getLogger(UploadController.class);
	
	@RequestMapping("/upload")
	@ResponseBody
	public AjaxMessage  upload(@RequestParam("file") MultipartFile partFile,HttpServletRequest request){
		AjaxMessage message = new AjaxMessage();
		String realPath = "E:/upload";
		System.out.println(partFile.toString());
		
		File pathFile = new File(realPath,partFile.getOriginalFilename());
		if(!pathFile.exists()){
			pathFile.mkdir();
		}
		System.out.println("文件类型"+partFile.getContentType());
		System.out.println("文件名称"+partFile.getOriginalFilename());
		System.out.println("文件大小"+partFile.getSize());
		
		try {
			partFile.transferTo(new File(realPath+"/"+partFile.getOriginalFilename()));
			
			List<Map<String,String>> listParams =Read_Excel.hssfWorkBook(pathFile, true, PersonMessageBean.class.getDeclaredFields());
			
			System.out.println(listParams.toString());
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		message.setMsg("上传成功");
		message.setSuccess(true);
		return message;
	}
}
