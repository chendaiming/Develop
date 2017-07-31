package com.hz.frm.controller;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.hz.frm.common.IConst;

@Controller
@RequestMapping(IConst.UPLOADCTRL)
public class UploadCtrl {
	private static final Logger logger = LoggerFactory.getLogger(UploadCtrl.class);

	@RequestMapping(IConst.UPLOAD)
	@ResponseBody
	public void upload(@RequestParam(value="file",required=false) CommonsMultipartFile file) {
		logger.debug( file + " 99999");
		logger.debug(file.getOriginalFilename());
		if(!file.isEmpty()){
			int pre = (int)System.currentTimeMillis();
			try {
				FileOutputStream os = new FileOutputStream("D:/" + new Date().getTime() + file.getOriginalFilename());
				FileInputStream in = (FileInputStream)file.getInputStream();
				int b = 0;
				while((b=in.read()) != -1){
					os.write(b);
				}
				os.flush();
				os.close();
				in.close();
				int fin = (int)System.currentTimeMillis();
				System.out.println(fin - pre);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}
}
