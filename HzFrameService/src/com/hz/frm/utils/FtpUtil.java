package com.hz.frm.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

/**
 * FTP工具类
 * @author shuxr
 * @see 日期 2015-12-4
 */
@Repository
public class FtpUtil {
	private static final Logger logger = LoggerFactory.getLogger(FtpUtil.class);
	/**
	 * 连接FTP服务器
	 * @param ip FTP服务器Ip(端口默认21)
	 * @param userName 用户名
	 * @param pwd  密码
	 * @return  返回创建好的FTP客户端对象
	 */
	public  FTPClient connectFTPServer(String ip,String userName,String pwd){
		FTPClient ftpClient = null;
		try {
			    ftpClient = new FTPClient();
			    ftpClient.connect(ip,21);
				//连接FTP服务器
			    ftpClient.login(userName, pwd);
				//设置为二进制传输模式
			    ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
			    ftpClient.setBufferSize(1024*1024*10);
			    ftpClient.setControlEncoding("GBK");
//				logger.debug("连接FTP服务器成功");
				return ftpClient;
		} catch (IOException e) {
			ftpClient = null;
			logger.error("连接FTP服务器失败"+e.getMessage());
		}
		return ftpClient;
	}
	/**
	 * 关闭FTP服务器连接
	 * @param ftpClient 传入要关闭的FTP客户端对象
	 * @return true 关闭连接成功, false 关闭连接异常
	 */
	public  boolean closeFTPConnect(FTPClient ftpClient){
		try {
			if(ftpClient!=null && ftpClient.isConnected()){
				ftpClient.logout();
				ftpClient.disconnect();
//				logger.debug("关闭FTP服务器连接成功");
			}else{
				logger.debug("FTP服务器连接不存在或已关闭");
			}
			return true;
		} catch (IOException e) {
			logger.error("关闭FTP服务器连接失败",e);
			return false;
		}
	}
	/**
	 * 文件上传
	 * @param in 存放文件对象的输入流
	 * @param remoteFileName 文件名
	 * @param ftpClient 已连接的FTP客户端
	 * @return true 上传成功  false 上传失败
	 */
	public boolean uploadForIn(InputStream in,String remoteFileName,FTPClient ftpClient){
				try {
					//文件名转码
					String fileName = new String(remoteFileName.getBytes("GBK"),"iso-8859-1");
					//文件上传
					if(ftpClient.storeFile(fileName, in)){
						logger.debug("上传文件成功");
						return true;
					}else{
						logger.debug("上传文件失败");
						return false;
					}
				} catch (IOException e) {
					logger.error("上传文件失败",e);
					return false;
				}finally{
						try {
							if(in!=null){
								in.close();
							}
						} catch (IOException e) {
							logger.error("关闭流失败",e);
						}
				}
	}
	/**
	 * FTP文件下载
	 * @param fileName 下载的文件名
	 * @param ftpClient FTP客户端
	 * @param localDir  下载到本地的目录 
	 * @return 下载完成后本地的文件名
	 */
	public boolean download(String fileName,FTPClient ftpClient,String localDir){
		FileOutputStream out = null;
		try {
			File file = new File(localDir+fileName);
			
			if(file.isFile()){
//				logger.debug("文件已存在,无需下载");
				return true;
			}
			out = new FileOutputStream(file);
			if(ftpClient.retrieveFile(fileName, out)){
				logger.debug("下载文件成功");
				return true;
			}else{
				return false;
			}
		} catch (IOException e) {
			logger.error("下载文件失败",e);
			return false;
		}finally{
			try {
				if(out!=null){
					out.close();
				}
			} catch (IOException e) {
				logger.error("关闭流失败",e);
			}
		}
	}
	/**
	 * 获取FTP服务器上制定后缀名的文件列表,并返回所有的文件名
	 * @param ftpClient
	 * @param suffix 指定后缀名
	 * @return String[] 文件名数组
	 */
	public List<String> ScanFiles(FTPClient ftpClient,String suffix){
		List<String>  fileNameList = new ArrayList<String>(); 
		try {
			String[] name  =  ftpClient.listNames();
			for(String fileName:name){
				if(fileName.endsWith(suffix)){
					fileNameList.add(fileName);
				}
					
			}
		} catch (IOException e) {
			logger.error("获取FTP服务器文件列表失败",e);
		}
		if(fileNameList.size()>0) logger.debug("获取FTP服务器文件列表成功");
		return fileNameList;
	}
	/**
	 * 删除FTP文件
	 * @param ftpClient
	 * @param filePath   文件路径+名称
	 * @return
	 */
	public boolean deleteFile(FTPClient ftpClient,String filePath){
		boolean flag = false;
		try {
			String path = new String(filePath.getBytes("GBK"),"iso-8859-1");
			if(ftpClient.deleteFile(path)){
				flag = true;
				logger.info("删除文件:"+filePath+"成功");
			}else{
				logger.info("删除文件:"+filePath+"失败");
			}
		} catch (IOException e) {
			logger.error("删除FTP文件异常:"+e.getMessage(),e);
		}
		return flag;
	}
}
