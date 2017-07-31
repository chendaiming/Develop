package com.hz.cds.broadcast.controller;

import java.io.File;
import java.io.InputStream;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.net.ftp.FTPClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.broadcast.service.BroadcatstService;
import com.hz.frm.bean.AjaxMessage;
import com.hz.frm.util.StringUtil;
import com.hz.frm.utils.FtpUtil;

@Controller
@RequestMapping("/broadcast")
public class BroadcastCtrl {
	// 日志对象
	private static final Logger logger = LoggerFactory.getLogger(BroadcastCtrl.class);
	
	@Value("${audio.broadcast}")
	private String audioPath;
	@Value("${ftp.ip}")
	private String ftp_ip;
	@Value("${ftp.user}")
	private String ftp_user;
	@Value("${ftp.pwd}")
	private String ftp_pwd;
	@Value("${ftp.dir}")
	private String ftp_dir;
	
	@Resource FtpUtil  ftpUtil;
	@Resource BroadcatstService broadcatstService;
	/**
	 * 查询音频文件列表
	 */
	@RequestMapping("/queryAudioList")
	@ResponseBody
	public JSONArray queryAudioFileList(){
		File file = new File(audioPath);
		if(file.exists() && file.isDirectory()){
			String[] files = file.list();
			if(files.length > 0){
				return JSON.parseObject(JSON.toJSONString(files),JSONArray.class);
			}
		}
		logger.debug("[公共广播]音频文件路径不存在！！！");
		return new JSONArray();
	}
	/**
	 * 获取FTP文件名列表
	 * @return
	 */
	@ResponseBody
	@RequestMapping("fileList")
	public AjaxMessage loadFileList(@RequestParam String args){
		logger.info("请求类型:数字广播--文件列表==>"+args);
		AjaxMessage ajaxMsg = new AjaxMessage();
		String suffix = "mp3";
		suffix = JSONObject.parseObject(args).getString("suffix");
		try {
			//连接FTP服务器
			FTPClient ftpClient = ftpUtil.connectFTPServer(ftp_ip,ftp_user,ftp_pwd);
			if(ftpClient == null){
				ajaxMsg.setSuccess(false);
				ajaxMsg.setMsg("连接FTP服务器失败,IP:"+ftp_ip);
				return ajaxMsg;
			}
			List<String>  fileList = ftpUtil.ScanFiles(ftpClient,suffix);
		    JSONArray fileListAry = JSON.parseObject(JSON.toJSONString(fileList),JSONArray.class);
			ftpUtil.closeFTPConnect(ftpClient);
			ajaxMsg.setObj(fileListAry);
			ajaxMsg.setSuccess(true);
		} catch (Exception e) {
			logger.error("获取数字广播文件列表===>>异常", e);
			ajaxMsg.setSuccess(false);
			ajaxMsg.setMsg("出现异常:"+e.getMessage());
		}
		return ajaxMsg;
	}
	
	/**
	 * 音频文件广播
	 * @param args
	 * @return
	 */
	@ResponseBody
	@RequestMapping("play")
	public AjaxMessage controlBroadcast(@RequestParam String args){
		logger.info("请求类型:数字广播--文件播放==>"+args);
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
			    String cusNumber=parasObject.getString("cusNumber");
			    String broadcastType=parasObject.getString("broadcastType");//播放类型 1播放一次 2循环播放
				String videoPath =ftp_dir + parasObject.getString("videoPath");//音频文件所在前置机路径,mp3格式
				String clientID = parasObject.getString("clientID");//多个终端之间用“；”分割
				String _action = parasObject.getString("action");//执行动作 1-播放,2-停止
				String action = "";
				if(_action.equals("3")){//定时广播
					action = "1";
				}else{
					action = _action;
				}
				String remark = parasObject.getString("remark");//备注
				broadcatstService.sendBroadcast(cusNumber, broadcastType, videoPath, clientID,remark,action);
				JSONObject rtnData = new JSONObject();
				ajaxMsg.setObj(rtnData);
				ajaxMsg.setSuccess(true);
				//发送开始播放指令时,插入播放记录
				if(_action.equals("1") || _action.equals("3"))
					broadcatstService.insertPlayRecord(parasObject);
				
				//更新广播设备使用状态
				int status = 2; //播放中
				switch(_action){
				case "1":status = 2; break; //开始播放 --使用中
				case "2":status = 0; break; //停止播放 --空闲
				case "3":status = 4; break; //定时广播 -- 定时广播
				}
				broadcatstService.updateClientStatus(cusNumber,clientID,status);
				
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
	
	@ResponseBody
	@RequestMapping("say")
	public AjaxMessage controlBroadcastSay(@RequestParam String args){
		logger.info("请求类型:数字广播--实时喊话==>"+args);
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
			    String cusNumber=parasObject.getString("cusNumber");
				String clientID = parasObject.getString("clientID");//多个终端之间用“；”分割
				String action = parasObject.getString("action");//执行动作 1-开始播放,2-停止播放
				String remark = parasObject.getString("remark");//备注
				broadcatstService.sendSay(cusNumber,clientID,remark,action);
				JSONObject rtnData = new JSONObject();
				ajaxMsg.setObj(rtnData);
				ajaxMsg.setSuccess(true);
				
				int status = action.equals("1")?3:0;  //开始喊话 -- 喊话中(3) 停止喊话 --空闲(0)
				broadcatstService.updateClientStatus(cusNumber,clientID,status);
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
	@ResponseBody
	@RequestMapping("volume")
	public AjaxMessage controlBroadcastVolume(@RequestParam String args){
		logger.info("请求类型:数字广播--音量控制==>"+args);
		AjaxMessage ajaxMsg = new AjaxMessage();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
			    String cusNumber=parasObject.getString("cusNumber");
				String clientID = parasObject.getString("clientID");//多个终端之间用“；”分割
				String volume = parasObject.getString("volume");//音量值
				broadcatstService.ctrlVolume(cusNumber,clientID,volume);
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
	 * 上传音频文件到FTP服务器
	 * @param file
	 * @return
	 */
	@ResponseBody
	@RequestMapping("upload")
	public String uploadFile(@RequestParam(value="file")CommonsMultipartFile file){
		logger.info("请求类型:数字广播--文件上传");
		JSONObject result = new JSONObject();
		try {
			//连接FTP服务器
			FTPClient ftpClient = ftpUtil.connectFTPServer(ftp_ip,ftp_user,ftp_pwd);
			if(ftpClient == null){
				result.put("success", false);
				result.put("msg", "连接FTP服务器失败,IP:"+ftp_ip);
				return result.toJSONString();
			}
			InputStream  in = file.getInputStream();
			String fileName  = file.getOriginalFilename();
			boolean flag  =  ftpUtil.uploadForIn(in,fileName, ftpClient);
			ftpUtil.closeFTPConnect(ftpClient);
			if(flag){
				result.put("success", true);
				result.put("msg", "上传成功");
			}else{
				result.put("success", false);
				result.put("msg", "上传失败,请检查文件名是否有特殊字符");
			}
		} catch (Exception e) {
			logger.error("上传文件到FTP服务器失败", e);
			result.put("success", false);
			result.put("msg", "上传异常:"+e.getMessage());
		}
		return result.toJSONString();
	}	

	/**
	 * 删除FTP服务器上的文件
	 * @param file
	 * @return
	 */
	@ResponseBody
	@RequestMapping("deletefile")
	public String uploadFile(@RequestParam String args){
		logger.info("请求类型:数字广播--文件删除");
		JSONObject result = new JSONObject();
		try {
			if(!StringUtil.isNull(args)){
				JSONObject parasObject=JSON.parseObject(args);
				String filePath=parasObject.getString("filePath");
				FTPClient ftpClient = ftpUtil.connectFTPServer(ftp_ip,ftp_user,ftp_pwd);
				if(ftpClient == null){
					result.put("success", false);
					result.put("msg","连接FTP服务器失败,IP:"+ftp_ip);
					return result.toJSONString();
				}
				if(ftpUtil.deleteFile(ftpClient, filePath)){
					result.put("success", true);
					result.put("msg", "删除成功");
				}else{
					result.put("success", false);
					result.put("msg", "删除失败");
				}
			}
		} catch (Exception e) {
			logger.error("上传文件到FTP服务器失败", e);
			result.put("success", false);
			result.put("msg", "上传异常:"+e.getMessage());
		}
		return result.toJSONString();
	}	
}
