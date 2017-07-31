package com.hz.cds.person.message;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.person.bean.PersonMessageBean;
import com.hz.cds.prisoner.cache.PrisonerBaseDtlsCache;
import com.hz.db.dao.UpdateDao;
import com.hz.db.service.IQueryService;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.util.ConfigUtil;
import com.hz.frm.util.StringUtil;
import com.hz.frm.utils.SequenceUtil;
import com.hz.sql.util.SqlConfigUtil;

/**
 * 人脸识别消息处理
 * @author zhangyl
 * @date 2017-01-12
 */
@Service("fePersonMessageProcess")
@Transactional
public class FePersonMessageProcess extends FeMessageProcessAbstract<PersonMessageBean>{
	private static final Logger logger = LoggerFactory.getLogger(FePersonMessageProcess.class);
	
	@Resource private IQueryService queryService;
	@Resource private UpdateDao updateDao;
	@Resource private SequenceUtil sequenceUtil;
	@Resource private MqMessageSendService mqMessageSendService;
	@Resource private PrisonerBaseDtlsCache prisonerBaseDtlsCache;
	
	@Override
	public Class<PersonMessageBean> getBodyClass() {
		return PersonMessageBean.class;
	}
	@Override
	protected void process(FeMessageHeader feMessageHeader, PersonMessageBean msgBody) {
		  String cusNumber = feMessageHeader.getCusNumber().trim();//机构编号
		  String personType = msgBody.getPersonType().trim();//人员类型
	      String personId = msgBody.getPersonId().trim();//人员编号
	      
	      String seq = "",//记录编号(序列号)
	    		 httpUrl = "";//本机IP
			 try {
				 httpUrl = ConfigUtil.get("HTTP_URL");
		    	  seq = sequenceUtil.getSequence("PSR_FACE_RECOGNITION_RECORD","frr_record_id");
			} catch (Exception e) {
				logger.error("获取人脸识别记录表序列失败",e);
			}
		  //保存人脸库照片
		  //保存到本地的目录(用于判断是否存在该目录,不存在将自动创建)
		  String pathDir =  ConfigUtil.get("HTTP_DIR")+"faceImg/";
		  //保存到本地的文件路径
		  String data_img_pathFile = pathDir +personType+"_data_face"+seq+".jpg";
		  //保存到数据库的URL
		  String data_img_savePath  = "";
		  if(upload(msgBody.getPersonDataImg(),data_img_pathFile,pathDir)){
			  data_img_savePath = httpUrl+"/faceImg/" + personType+"_data_face"+seq+".jpg";
		  }
		  //保存现场照片
		  //保存到本地的文件路径
		  String now_img_pathFile = pathDir + personType+"_now_face"+seq+".jpg";
		  //保存到数据库的URL
		  String now_img_savePath  = "";
		  if(upload(msgBody.getPersonNowImg(),now_img_pathFile,pathDir)){
			  now_img_savePath = httpUrl+"/faceImg/" + personType+"_now_face"+seq+".jpg";
		  }
		  
	      //人脸识别记录插入
	      insert(cusNumber, seq, msgBody, data_img_savePath, now_img_savePath);
	      
	      List<Map<String, Object>>  resultData = new ArrayList<Map<String, Object>>();
		  Map<String, Object> map = new HashMap<String, Object>();
		try {
			//0:犯人信息  1：警员信息
			if("0".equals(personType)){
				map.put("prisonerid",personId);
				map.put("name",prisonerBaseDtlsCache.getPrisonerInfoByOtherid(cusNumber, personId, "pbd_prsnr_name"));
				map.put("type","病员");
				map.put("img_url",data_img_savePath);
				map.put("img_url_scene",now_img_savePath);
				map.put("addrs","");//摄像机所在位置
				map.put("frr_camera_id",msgBody.getCameraId().trim());//
				map.put("reason","出监就医");//出监原因
				resultData.add(map);
			}else if("1".equals(personType)){
				map.put("prisonerid",personId);
				map.put("name",queryRedisData(cusNumber,"policeName",personId));
				map.put("type","警员");
				map.put("img_url",data_img_savePath);
				map.put("img_url_scene",now_img_savePath);
				map.put("addrs","");//摄像机所在位置
				map.put("frr_camera_id",msgBody.getCameraId().trim());//
				map.put("reason","");//出监原因
				resultData.add(map);
			}
			logger.info(JSON.toJSONString(resultData));
			mqMessageSendService.sendInternalWebMessage(resultData, cusNumber, feMessageHeader.getMsgType());
		} catch (Exception e) {
			logger.error("无此人信息",e);
		}
	}
	/**
	 * 插入数据库
	 * @param cusNumber
	 * @param seq
	 * @param msgBody
	 * @param data_img_savePath
	 * @param now_img_savePath
	 */
	public void insert(String cusNumber, String seq, PersonMessageBean msgBody, String data_img_savePath, String now_img_savePath){
		String sql=SqlConfigUtil.getSql("insert_psr_face_recognition_record");
		Map<String, Object> paramMap=new HashMap<String,Object>();
		try{
			paramMap.put("frr_cus_number", cusNumber);
			paramMap.put("frr_record_id", seq);
			paramMap.put("frr_person_id", queryRedisData(cusNumber,msgBody.getPersonType(),msgBody.getPersonId().trim()));
			paramMap.put("frr_person_type", msgBody.getPersonType());
			paramMap.put("frr_data_img", data_img_savePath);
			paramMap.put("frr_now_img", now_img_savePath);
			paramMap.put("frr_send_time", msgBody.getSendTime());
			paramMap.put("frr_camera_id", msgBody.getCameraId().trim());
//			paramMap.put("frr_camera_id", queryRedisData(cusNumber,"cameraId",msgBody.getCameraId()));
			logger.debug(JSON.toJSONString(paramMap));
			updateDao.updateByParamKey(sql, paramMap);			
		}catch(Exception e){
			logger.error("插入人脸识别记录失败",e);
		}
		
	}
	/**
	 * 写入文件到本地
	 * @param data
	 * @param pathFile
	 * @param fileDir
	 * @return
	 */
	public boolean upload(String imgStr, String pathFile,String fileDir){
		InputStream in = null;
		FileOutputStream os = null;	
		try {
			if(StringUtil.getByteForStr(imgStr) == null) return false;
			in  = new ByteArrayInputStream(StringUtil.getByteForStr(imgStr));
			isDir(fileDir);
			os  = new FileOutputStream(pathFile);
			byte[] buf = new byte[1024*1024]; //定义一个1M的缓冲区
			int size = 0;
			while((size=in.read(buf)) != -1){
				os.write(buf,0,size);
			}
			os.flush();
			logger.debug("图片写入成功");
			return true;
		} catch (Exception e) {
			logger.error("写入图片文件失败",e);
			return false;
		}finally{
			try {
				if(os!=null) os.close();
				if(in!=null) in.close();
			} catch (IOException e) {
				logger.error("关闭输入输出流失败对象失败",e);
				return false;
			}
		}
	}
	/**
	 * 查询Redis缓存数据
	 * @param cusNumber  机构编号
	 * @param type 查询类型 
	 * @param key key值 
	 * @return
	 */
	public String queryRedisData(String cusNumber,String type,String key){
		String cacheId = "",//cache ID
			   column = "",//查询的字段名
			   value  = "";//返回值
		switch(type){
			case "0": //查询罪犯(病员)编号
				return prisonerBaseDtlsCache.getPrisonerInfoByOtherid(cusNumber, key, "pbd_prsnr_id");
			case "1": //查询警员编号
				cacheId = "plc_police_base_dtls_forpoliceId";
				column = "pbd_user_id";
				break;
			case "policeName"://查询姓名
				cacheId = "plc_police_base_dtls_forpoliceId";
				column = "pbd_police_name";
				break;
			case "cameraId"://查询摄像机编号
				cacheId = "cmr_camera_base_dtls";
				column = "cbd_id";
				break;
		}
		Map<String, Object> redisMap = new HashMap<String, Object>();
		
		if(RedisUtil.hasKey(cacheId+"_"+cusNumber, key)){
			redisMap = RedisUtil.getHashMap(cacheId+"_"+cusNumber, key);
		}
		
		if(!redisMap.isEmpty()){
			value=redisMap.get(column).toString();
		}
		return value;
	}
	/**
	 * 判断目录是否存在,不存在自动创建
	 * @param dir
	 */
	private void isDir(String dir){
		File file = new File(dir);
		if(!file.exists())file.mkdirs();
	}
}
