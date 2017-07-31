package com.hz.cds.video.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.collections.map.CaseInsensitiveMap;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.video.cache.CameraBaseDtlsCache;
import com.hz.cds.video.cache.VideoDeviceBaseDtlsCache;
import com.hz.db.service.IQueryService;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.RespParams;
import com.hz.frm.util.ConfigUtil;
import com.hz.frm.util.StringUtil;

@Controller
@RequestMapping("cameraCtr")
public class CameraCtr {
	private Logger logger=LoggerFactory.getLogger(CameraCtr.class);

	@Resource
	private CameraBaseDtlsCache cameraBaseDtlsCache;

	@Resource
	private VideoDeviceBaseDtlsCache videoDeviceBaseDtlsCache;

	@Resource
	IQueryService queryService;

	/**
	 * 通过摄像机ID查询打开实时视频的信息
	 * @param args
	 * @return
	 */
	@RequestMapping("queryCameraInfoForPlayVideo")
	@ResponseBody
	public JSONObject queryCameraInfoForPlayVideo (@RequestParam() String args) {
		JSONObject reqJSON = null;
		try {
			reqJSON = JSON.parseObject(args);
			JSONArray caremaArray=getCameraInfo(reqJSON);
			return response(DbCodeUtil.CODE_0000, "", caremaArray);
		} catch (Exception e) {
			logger.error("查询摄像机信息失败", e);
			return response(DbCodeUtil.CODE_0001, "", "查询摄像机信息失败");
		}

	}
	
	/**
	 * 临时使用，背后调用公用的
	 * @param code
	 * @param msg
	 * @param data
	 * @return
	 */
	private JSONObject response (String code, String msg, Object data) {
		JSONObject result = null;	// 响应结果
		result = new JSONObject();
		result.put(RespParams.SUCCESS, DbCodeUtil.CODE_0000.equals(code));		
		result.put(RespParams.RESP_CODE, code);
		result.put(RespParams.RESP_MSG, msg);
		result.put(RespParams.DATA, data);
		return result;
	}
	
	/**
	 * 获取摄像机信息
	 * @param reqJSON
	 * @param type 1 实时视频   2 视频回放
	 * @return
	 */
	private JSONArray getCameraInfo(JSONObject reqJSON){
		JSONArray cameraInfoArray=new JSONArray();
		String cusNumber=reqJSON.getString("cusNumber");
		String cameraArray=reqJSON.getString("cameraArray");
		String type=reqJSON.getString("type");
		if(!StringUtil.isNull(cameraArray)){
			JSONArray cameraIdArray=JSONArray.parseArray(cameraArray);
			for(int i=0;i<cameraIdArray.size();i++){
				JSONObject cameraObj=cameraIdArray.getJSONObject(i);
				JSONObject cameraMessage=new JSONObject();
				if(!StringUtil.isNull(type)&&"2".equals(type)){
					String startTime=cameraObj.getString("beginTime");
					String endTime=cameraObj.getString("endTime");
					cameraMessage.put("startTime", startTime);
					cameraMessage.put("endTime", endTime);
				}
				String cameraId=cameraObj.getString("cameraId");
				String index=cameraObj.getString("index");
				if(!StringUtil.isNull(index)){
					cameraMessage.put("index", index);
				}
				
				//摄像机的基本信息
				JSONObject cameraObjInfo=null;
				try {
					cameraObjInfo = cameraBaseDtlsCache.getCameraInfo(cusNumber, cameraId);
				} catch (Exception e) {
					logger.error("获取摄像机基础信息异常：", e);
				}
				if(cameraObjInfo!=null){
					cameraMessage.put("cameraId", cameraObjInfo.getString("cbd_id"));
					cameraMessage.put("cameraName", cameraObjInfo.getString("cbd_name"));
					cameraMessage.put("cameraBrand", cameraObjInfo.getString("cbd_brand"));
					cameraMessage.put("streamType", cameraObjInfo.getString("cbd_stream_type"));
					if(!StringUtil.isNull(type)&&"1".equals(type)){
						cameraMessage.put("mode", cameraObjInfo.getString("cbd_playnow_type"));
					}else{
						cameraMessage.put("mode", cameraObjInfo.getString("cbd_playback_type"));
					}
					
				}
				
				//NVR信息
				JSONObject nvrObjInfo=null;
				try {
					nvrObjInfo = videoDeviceBaseDtlsCache.getNvrDeviceInfo(cusNumber, cameraId);
				} catch (Exception e) {
					logger.error("获取NVR信息失败"+e.getMessage());
				}
				JSONObject nvrObj=new JSONObject();
				if(nvrObjInfo!=null){
					nvrObj.put("channel",nvrObjInfo.getString("cvr_chnnl_code"));
					nvrObj.put("brand", nvrObjInfo.getString("vdd_device_brand"));
					nvrObj.put("ip", nvrObjInfo.getString("vdd_ip_addrs"));
					nvrObj.put("port", nvrObjInfo.getString("vdd_port"));
					nvrObj.put("userName", nvrObjInfo.getString("vdd_user_name"));
					nvrObj.put("password", nvrObjInfo.getString("vdd_user_password"));
				}
				cameraMessage.put("dvr", nvrObj);
				
				//平台信息
				JSONObject platformObjInfo=null;
				try {
					platformObjInfo = videoDeviceBaseDtlsCache.getPlatformInfo(cusNumber, cameraId);
				} catch (Exception e) {
				}
				JSONObject platformObj=new JSONObject();
				if(platformObjInfo!=null){
					platformObj.put("id",platformObjInfo.getString("cvr_chnnl_code"));
					platformObj.put("brand", platformObjInfo.getString("vdd_device_brand"));
					platformObj.put("ip", platformObjInfo.getString("vdd_ip_addrs"));
					platformObj.put("port", platformObjInfo.getString("vdd_port"));
					platformObj.put("userName", platformObjInfo.getString("vdd_user_name"));
					platformObj.put("password", platformObjInfo.getString("vdd_user_password"));
				}
				cameraMessage.put("platform", platformObj);
				
				//流媒体信息
				if(!StringUtil.isNull(type)&&"1".equals(type)){
					JSONObject streamObjInfo=null;
					try {
						streamObjInfo = videoDeviceBaseDtlsCache.getStreamInfo(cusNumber, cameraId);
					} catch (Exception e) {
					}
					JSONObject streamObj=new JSONObject();
					if(streamObjInfo!=null){
						streamObj.put("ip", streamObjInfo.getString("vdd_ip_addrs"));
						streamObj.put("port", streamObjInfo.getString("vdd_port"));
						streamObj.put("streamType", streamObjInfo.getString("vdd_user_name"));
					}
					cameraMessage.put("stream", streamObj);
				}
				cameraInfoArray.add(cameraMessage);
			}
		}
		return cameraInfoArray;
	}

	int fileNum = 1001;

	@RequestMapping("videoStorageRecord")
	@ResponseBody
	public JSONArray videoStorageRecord () {
		JSONArray jsonArray = new JSONArray();
		String path = ConfigUtil.get("SHARE_VIDEO_STORAGE");
		List<File> files = null;
		int fileId = 0;
		
		fileNum = 1001;
		try {
			files = orderFileByName(path);
			fileId = fileNum++;
			if (files.size() > 0) {
				readNext(jsonArray, fileId ,files);
			}
		} catch (Exception e) {
			logger.error("读取存储目录错误：", e);
		} finally {
			putArray(jsonArray, true , false ,"-1", fileId,"", "智能存储", path);
		}

		return jsonArray;
	}

	   /** 文件重命名 
	    * @param path 文件目录 
	    * @param oldname  原来的文件名 
	    * @param newname 新文件名 
	 * @throws Exception 
	    */ 
		@RequestMapping("renameFile")
		@ResponseBody
	    public JSONObject renameFile(@RequestParam String args){ 
			JSONObject reqJSON = JSON.parseObject(args);
			String oldname = reqJSON.getString("oldname"),
			newname = reqJSON.getString("newname"),
			fileType = reqJSON.getString("fileType"),
			path = ConfigUtil.get("SHARE_VIDEO_STORAGE")+reqJSON.getString("path").split(ConfigUtil.get("HTTP_VIDEO_STORAGE"))[1].replaceAll("/", "\\\\");
	        if(!oldname.equals(newname)){//新的文件名和以前文件名不同时,才有必要进行重命名 
	            File oldfile=new File(path+oldname+"."+fileType); 
	            File newfile=new File(path+newname+"."+fileType); 
	            if(!oldfile.exists()){
	            	return response(DbCodeUtil.CODE_0002, "重命名失败：原文件不存在", null);//重命名文件不存在
	            }
	            if(newfile.exists())//若在该目录下已经有一个文件和新文件名相同，则不允许重命名 
	            	return response(DbCodeUtil.CODE_0001, "重命名失败：存在同名文件", null); 
	            else{ 
	            	if(!renameFile(oldfile,newfile)){
	            		return response(DbCodeUtil.CODE_0004, "重命名失败：文件被其他程序占用,请稍后再试", null); 
					} else{
						return response(DbCodeUtil.CODE_0000, "<span style='color:#15ec59;'>重命名成功!</span>", null); 
					}
	            } 
	        }else{
	        	return response(DbCodeUtil.CODE_0003, "重命名失败：新旧文件名相同", null); 
	        }
	    }
	
	    /** 
	     *  根据路径删除指定的目录或文件 
	     *@param path  要删除的目录或文件 
	     *@return 
	     *@throws Exception 
	     */  
		@RequestMapping("deleteFile")
		@ResponseBody
	    public JSONObject deleteFolder(@RequestParam String args){  
			JSONObject reqJSON = JSON.parseObject(args);
			String path = ConfigUtil.get("SHARE_VIDEO_STORAGE")+reqJSON.getString("path").split(ConfigUtil.get("HTTP_VIDEO_STORAGE"))[1].replaceAll("/", "\\\\");
        	File file = new File(path);  
        	// 判断目录或文件是否存在  
        	if (!file.exists()) {  // 不存在返回 false  
        		return response(DbCodeUtil.CODE_0001, "删除失败：原文件不存在", null); 
        	} else {  
        		// 判断是否为文件  
        		if (file.isFile()) {  // 为文件时调用删除文件方法  
        			if(!deleteFile(file)) {
        				return response(DbCodeUtil.CODE_0003, "删除失败：文件被其他程序占用,请稍后再试", null);
					}else{
						return response(DbCodeUtil.CODE_0000, "<span style='color:#15ec59;'>删除成功!</span>", null); 
					}
        		} else {  // 为目录
        			return response(DbCodeUtil.CODE_0002, "删除失败：目录受保护", null);  
        		}  
        	}  
	    }  
		
		/** 
		 *  文件上传 
		 *@param file 
		 *@return 
		 *@throws Exception 
		 */  
		@ResponseBody
		@RequestMapping("fileUpload")
		public String fileUpload(@RequestParam(value="file")CommonsMultipartFile file,@RequestParam(value="savePath",required=false) String savePath){  
			JSONObject result = new JSONObject();
			logger.debug("文件上传===>>"+file.getOriginalFilename());
			FileOutputStream os = null;	
			InputStream in = null;
			if(!file.isEmpty()){
				String fileName = file.getOriginalFilename();//取得文件名
				int pre = (int)System.currentTimeMillis();
				try {
					String saveUrl = ConfigUtil.get("SHARE_VIDEO_STORAGE");
					if(!savePath.equals("")){
						String splitUrl[] = savePath.split(ConfigUtil.get("HTTP_VIDEO_STORAGE"));
						if(splitUrl.length>0) saveUrl = saveUrl + splitUrl[1].replaceAll("/", "\\\\");
					}
					String filePath = saveUrl + fileName;
					String httpPath = savePath + fileName;
					in = file.getInputStream();
					os = new FileOutputStream(filePath);
					byte[] buf = new byte[20480];
					int len = 0 ;
					while((len=in.read(buf)) != -1){
						os.write(buf,0,len);
					}
					os.flush();
					int fin = (int)System.currentTimeMillis();
					logger.debug("文件上传===>>成功,耗时(ms):" + (fin - pre));
					
					result.put("success", true);
					result.put("msg", "上传成功");
					result.put("dirPath", httpPath);
					result.put("name", fileName);
					result.put("pname", getFilePrefix(fileName));
					result.put("fileSize", formetFileSize(getFileSizes(multipartToFile(file))));
					return result.toJSONString();
				} catch (Exception e) {
					logger.error("文件上传异常:"+fileName,e);
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
		
		/** 
	     *  检测文件是否存在
	     *@param path  要检测的目录或文件 
	     *@return 
	     *@throws Exception 
	     */  
		@RequestMapping("checkFile")
		@ResponseBody
	    public JSONObject checkFiler(@RequestParam String args){  
			JSONObject reqJSON = JSON.parseObject(args);
			String path = ConfigUtil.get("SHARE_VIDEO_STORAGE")+reqJSON.getString("path").split(ConfigUtil.get("HTTP_VIDEO_STORAGE"))[1].replaceAll("/", "\\\\");
        	File file = new File(path);  
        	// 判断目录或文件是否存在  
        	if (!file.exists()) {  // 不存在返回 false  
        		return response(DbCodeUtil.CODE_0000, "文件不存在", null); 
        	} else {
        		logger.debug("文件上传===>>失败,"+file.getName()+" 文件已存在");
    			return response(DbCodeUtil.CODE_0001, "文件已存在", null);  
        	}  
	    }
		
		/** 
		 *  二级存储使用情况
		 *@param
		 *@return 
		 *@throws Exception 
		 */  
		@RequestMapping("checkStorageDtls")
		@ResponseBody
		public JSONObject checkStorageDtls(){  
			JSONArray jspArray = new JSONArray();
			JSONObject rspJson = new JSONObject();
			JSONObject rspJson1 = new JSONObject();
			String path = ConfigUtil.get("SHARE_VIDEO_STORAGE");
			
			File file = new File(path); 
			long totalSpace = file.getTotalSpace();  
	        long freeSpace = file.getFreeSpace();  
	        long usedSpace = totalSpace - freeSpace;  
	        
	        long remain = freeSpace / 1024 / 1024 / 1024 / 1024;
	        long used = usedSpace / 1024 / 1024 / 1024 / 1024 ;
	        rspJson.put("name", "剩余");
	        rspJson.put("value", remain);
	        jspArray.add(rspJson);
	        rspJson1.put("name", "已用");
	        rspJson1.put("value", used);
	        jspArray.add(rspJson1);
			return response(DbCodeUtil.CODE_0001, jspArray.toJSONString(), null);  
		}
		
	/*
	 * 读取下级目录
	 */
	private void readNext (JSONArray jsonArray, int pid , List<File> files) throws Exception {
		int fileId = 0;
		if(files.size() > 0){
			for(File file : files) {
				if(file.isDirectory()) {
					if(file.listFiles().length > 0){
						fileId = fileNum++;
						putArray(jsonArray, true, false , pid, fileId, "",file.getName(), file.getPath());
						readNext(jsonArray, fileId , Arrays.asList(file.listFiles()));
					}else{
						fileId = fileNum++;
						putArray(jsonArray, false, true , pid, fileId,"",file.getName(), file.getPath());
					}
				}else{
					fileId = fileNum++;
					putArray(jsonArray, false,false, pid, fileId, formetFileSize(getFileSizes(file)), file.getName(), file.getPath());
				}
			}
		}
	}

	/*
	 * 存放数据
	 */
	private void putArray (JSONArray jsonArray,boolean isParent, boolean isNull, Object pid, Object id, Object fileSize ,Object name, Object path) {
		JSONObject jsonObj = null;
		String http_path =  ConfigUtil.get("HTTP_VIDEO_STORAGE");
		
		String spStr = "\\\\\\\\10.2.3.117\\\\videoStorage\\\\videoStorage\\\\";
		String[] dir_path = path.toString().split(spStr);
		if(dir_path.length>0) http_path = http_path + dir_path[1].replaceAll("\\\\", "/");
		
		jsonObj = new JSONObject();
		jsonObj.put("pid", pid);
		jsonObj.put("id", id);
		jsonObj.put("name", name);
		jsonObj.put("dirPath", http_path);
		jsonObj.put("isParent", isParent);
		jsonObj.put("isNull", isNull);
		jsonObj.put("selected", false);
		if(pid=="-1"){
			jsonObj.put("open", true);//节点打开
		}
		if(!isParent&&isNull){//使用标识isNull定制空文件夹的显示
			jsonObj.put("icon", "image/nullDir.png");
		}else if(!isParent&&!isNull){
			jsonObj.put("icon", "image/videoCamera.png");
			jsonObj.put("name", name);
			jsonObj.put("pname", getFilePrefix(name.toString()));
			jsonObj.put("fileSize", fileSize);
			jsonObj.put("fileType", getFileSuffix(name.toString()));
			jsonObj.put("typeUrl", getFileTypeUrl(getFileSuffix(name.toString())));
		}
		jsonArray.add(jsonObj);
	}
	
	/**
	 * 按文件名称从大到小排序
	 * 默认为升序
	 * 将		 return o1.getName().compareTo(o2.getName());    
	 * 改为
	 *			 return o2.getName().compareTo(o1.getName());   
	 * 则为降序
	 * @param fliePath
	 */
	private List<File> orderFileByName(String fliePath) {  
		  List<File> files = Arrays.asList(new File(fliePath).listFiles());  
		  Collections.sort(files, new Comparator< File>() {  
		   @Override  
		   public int compare(File o1, File o2) {  
		    if (o1.isDirectory() && o2.isFile())  
		          return -1;  
		    if (o1.isFile() && o2.isDirectory())  
		          return 1;  
		    return o2.getName().compareTo(o1.getName());  
		   }  
		  });  
		return files;
    }  
	
	/**
	 * 取得文件大小
	 * @param f
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("resource")
	private long getFileSizes(File f) throws Exception{
        long s=0;
        if (f.exists()) {
            FileInputStream fis = null;
            fis = new FileInputStream(f);
           s= fis.available();
        } else {
            f.createNewFile();
            logger.error("文件不存在");
        }
        return s;
    }
	
	/**
	 * 转换文件大小
	 * @param fileS
	 * @return
	 */
    private String formetFileSize(long fileS) {
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        if (fileS < 1024) {
            fileSizeString = df.format((double) fileS) + "B";
        } else if (fileS < 1048576) {
            fileSizeString = df.format((double) fileS / 1024) + "K";
        } else if (fileS < 1073741824) {
            fileSizeString = df.format((double) fileS / 1048576) + "M";
        } else {
            fileSizeString = df.format((double) fileS / 1073741824) + "G";
        }
        return fileSizeString;
    }
 
    /**
     * 获取文件名(前缀)
     * @param fileName
     * @return
     */
    private String getFilePrefix(String fileName) {
    	String prefixName = fileName.substring(0,fileName.lastIndexOf("."));
    	return prefixName;
    	
    }
    
    /**
     * 获取文件类型(后缀)
     * @param fileName
     * @return
     */
    private String getFileSuffix(String fileName) {
    	String suffixName = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length());
    	return suffixName;
    }
    
    /**
     * 获得文件类型Url
     * @param fileType
     * @return
     */
    @SuppressWarnings("unchecked")
	private String getFileTypeUrl(String fileType){
    	Map<String,String> urlMap = new CaseInsensitiveMap();//不区分KEY大小写
    	urlMap.put("mp4", "image/fileType/mp4.png");
    	urlMap.put("mpeg", "image/fileType/mpeg.png");
    	urlMap.put("ogg", "image/fileType/ogg.png");
    	urlMap.put("3gp", "image/fileType/3gp.png");
    	urlMap.put("avi", "image/fileType/avi.png");
    	urlMap.put("flv", "image/fileType/flv.png");
    	urlMap.put("gif", "image/fileType/gif.png");
    	urlMap.put("mkv", "image/fileType/mkv.png");
    	urlMap.put("mov", "image/fileType/mov.png");
    	urlMap.put("mpg", "image/fileType/mpg.png");
    	urlMap.put("swf", "image/fileType/swf.png");
    	urlMap.put("vob", "image/fileType/vob.png");
    	urlMap.put("webm", "image/fileType/webm.png");
    	urlMap.put("wmv", "image/fileType/wmv.png");
    	urlMap.put("mp3", "image/fileType/mp3.png");
    	urlMap.put("wav", "image/fileType/wav.png");
    	urlMap.put("wma", "image/fileType/wma.png");
    	if(urlMap.get(fileType)==null){
    		return "image/fileType/undefined.png";
    	}
    	return urlMap.get(fileType);
    }
    
    /**
     * 重命名文件
     * @param file
     * @return
     * @throws Exception
     */
    private boolean renameFile(File oldfile,File newfile){
    	boolean flag = oldfile.renameTo(newfile); 
//    	if(!flag) renameFile(oldfile,newfile);  //如遇资源被占用时会报错
    	return flag;
    }
    
    /**
     * 删除文件
     * @param file
     * @return
     * @throws Exception
     */
    private boolean deleteFile(File file){
    	boolean flag = file.delete();
//        if(!flag) deleteFile(file);  //如遇资源被占用时不会报错,迭代直到删除为止
        return flag;
    }
    
    /** 
     * CommonsMultipartFile 转换成File 
     * @param CommonsMultipartFile 原文件类型 
     * @return File 
     * @throws IOException 
     */  
    private File multipartToFile(CommonsMultipartFile multfile) throws IOException {  
        //这个myfile是MultipartFile的  
        DiskFileItem fi = (DiskFileItem) multfile.getFileItem();  
        File file = fi.getStoreLocation();  
        //手动创建临时文件  
        if(file.length() < 2*1024*1024){  //小于2MB创建临时文件
            File tmpFile = new File(System.getProperty("java.io.tmpdir") + System.getProperty("file.separator") +   
                    file.getName());  
            multfile.transferTo(tmpFile);  
            return tmpFile;  
        }  
        return file;  
    } 
}
