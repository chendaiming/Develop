package com.hz.frm.controller;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.common.IConst;
import com.hz.frm.poi.ImpPoliceInfoByPoi;
import com.hz.frm.util.ConfigUtil;

@Controller
@RequestMapping(IConst.UPLOADFILECTRL)
public class UploadFileCtrl {
	private static final Logger logger = LoggerFactory.getLogger(UploadFileCtrl.class);
	@Resource
	ImpPoliceInfoByPoi impPoliceInfoByPoi;

	@RequestMapping(IConst.UPLOAD)
	@ResponseBody
	public String upload(@RequestParam(value="file",required=false) CommonsMultipartFile file,@RequestParam(value="uploadType",required=false) String uploadType) {
		JSONObject result = new JSONObject();
		logger.debug("文件上传===>>"+file.getOriginalFilename()+",upload_type:"+ uploadType);
	
		FileOutputStream os = null;	
//		ByteArrayInputStream in = null;
		InputStream in = null;
		if(!file.isEmpty()){
			String fileName_old = file.getOriginalFilename();//取得文件名
			int pre = (int)System.currentTimeMillis();
			try {
				
				// bug:这种写法存在filePath 和resltPath  可能获取不到图片
				 //存到服务器上的路径
				 //String filePath = ConfigUtil.get("POLICE_IMG_DIR") + new Date().getTime() + file.getOriginalFilename();
				 //发布的HTTP服务地址(存入到数据库)
				 //String resultPath = ConfigUtil.get("POLICE_IMG_HTTP") + new Date().getTime() + file.getOriginalFilename();
				 // modify  lhs 
				 long time = new Date().getTime() ;
				 String filePath = ConfigUtil.get("POLICE_IMG_DIR") + time + file.getOriginalFilename();
				 //发布的HTTP服务地址(存入到数据库)
				 String resultPath = ConfigUtil.get("POLICE_IMG_HTTP") + time + file.getOriginalFilename();
				 
				// 判断是否存在文件夹
				 File policeImgDir = new File(ConfigUtil.get("POLICE_IMG_DIR")) ;
				 if(!policeImgDir.exists()){
					 // 不存在目录就新建一个目录
					 policeImgDir.mkdirs() ;
				 }
				 
				 os = new FileOutputStream(filePath);
				 in = file.getInputStream();
				int b = 0;
				while((b=in.read()) != -1){
					os.write(b);
				}
				os.flush();
				int fin = (int)System.currentTimeMillis();
				logger.debug("文件上传===>>成功,耗时(ms):" + (fin - pre));
				
				if(uploadType.equals("police_excel")){
					impPoliceInfoByPoi.Import(filePath);
				}
				
				result.put("success", true);
				result.put("msg", "上传成功");
				result.put("filePath", resultPath);
				result.put("fileType", uploadType);
				return result.toJSONString();
			} catch (Exception e) {
				logger.error("文件上传异常:"+fileName_old,e);
				result.put("success", false);
				result.put("msg", "上传异常");
				return result.toJSONString();
			}finally {
				try {
					if(os!=null) os.close();
					if(in!=null) in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		result.put("success", false);
		result.put("msg", "上传失败");
		return result.toJSONString();
	}

	@RequestMapping(IConst.UPLOAD_FILE)
	@ResponseBody
	public String uploadFile(HttpServletRequest request,
			@RequestParam(value = "file", required = false) CommonsMultipartFile file,
			@RequestParam(value = "uploadType", required = false) String uploadType,
			@RequestParam(value = "uploadPath", required = false) String uploadPath) {
		JSONObject result = new JSONObject();
		logger.debug("文件上传===>>" + file.getOriginalFilename() + ",upload_type:" + uploadType + ",upload_path:" + uploadPath);

		FileOutputStream os = null;
		// ByteArrayInputStream in = null;
		InputStream in = null;
		if (!file.isEmpty()) {
			String fileName_old = file.getOriginalFilename();// 取得文件名
			int pre = (int) System.currentTimeMillis();
			try {

				String filePath = request.getSession().getServletContext().getRealPath("..") + uploadPath;

				// 判断是否存在文件夹
				File policeImgDir = new File(filePath);
				if (!policeImgDir.exists()) {
					// 不存在目录就新建一个目录
					policeImgDir.mkdirs();
				}

				long time = new Date().getTime();
				String fileName = time + file.getOriginalFilename();
				filePath = filePath + fileName;

				os = new FileOutputStream(filePath);
				in = file.getInputStream();
				int b = 0;
				while ((b = in.read()) != -1) {
					os.write(b);
				}
				os.flush();
				int fin = (int) System.currentTimeMillis();
				logger.debug("文件上传===>>成功,耗时(ms):" + (fin - pre));
				result.put("success", true);
				result.put("msg", "上传成功");
				result.put("fileType", uploadType);
				result.put("filePath", uploadPath + fileName);
				return result.toJSONString();
			} catch (Exception e) {
				logger.error("文件上传异常:" + fileName_old, e);
				result.put("success", false);
				result.put("msg", "上传异常");
				return result.toJSONString();
			} finally {
				try {
					if (os != null)
						os.close();
					if (in != null)
						in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		result.put("success", false);
		result.put("msg", "上传失败");
		return result.toJSONString();
	}
}
