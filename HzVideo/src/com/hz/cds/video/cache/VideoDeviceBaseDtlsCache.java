package com.hz.cds.video.cache;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.service.ICacheService;
import com.hz.cache.util.RedisUtil;
import com.hz.db.dao.QueryDao;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.DbException;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.StringUtil;

@Component
public class VideoDeviceBaseDtlsCache extends ACacheTable implements ICacheService{
	@Resource
	private QueryDao queryDao;

	private static final Logger log = LoggerFactory.getLogger(VideoDeviceBaseDtlsCache.class);
	public static final String videoDeviceCacheId = "cmr_video_device_dtls";

	@Override
	public Boolean query() {
		//删除所有的map
		Set<Object> cusNumberKeys=RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for(Object key:cusNumberKeys){
			RedisUtil.deleteHash(videoDeviceCacheId+"_"+key);
		}
		return queryVideoDeviceBaseDtls(null,null);
	}
  
	private boolean queryVideoDeviceBaseDtls(List<String> paraList,String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_video_device_dtls");
			if(paraList!=null&&paraList.size()>0){
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumberQuery=tempMap.get("vdd_cus_number").toString();
					String idQuery=tempMap.get("cvr_camera_id").toString();
					String deviceType=tempMap.get("vdd_device_type").toString();
					RedisUtil.putHash(videoDeviceCacheId+"_"+cusNumberQuery+"_"+deviceType, idQuery, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存视频设备基本信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存视频设备基本信息...",e);
			return false;
		}
	}

	@Override
	public boolean refresh() throws Exception {
		return queryVideoDeviceBaseDtls(null,null);
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("id"); 
		RedisUtil.deleteHash(videoDeviceCacheId+"_"+cusNumber, id);
		return true;
				
	}
	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("id"); 
		if(StringUtil.isNull(cusNumber)){
			throw new DbException(DbCodeUtil.CODE_0003, "参数="+parasObject.toJSONString());
		}else{
			List<String> paraList=new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(id);
			queryVideoDeviceBaseDtls(paraList,"1");
		}
		return false;
	}
	/**
	 * 获取NVR的信息
	 * @param cusNumber
	 * @param cameraId
	 * @return
	 */
	public JSONObject getNvrDeviceInfo(String cusNumber,String cameraId){
		JSONObject deviceinfo = null;
		try {
			deviceinfo = getVideoDeviceInfo(cusNumber,cameraId,"0");
		} catch (Exception e) {
			deviceinfo = getVideoDeviceInfo(cusNumber,cameraId,"1");
		}
		return deviceinfo;
	}
	/**
	 * 获取平台的信息
	 * @param cusNumber
	 * @param cameraId
	 * @return
	 */
	public JSONObject getPlatformInfo(String cusNumber,String cameraId){
		return getVideoDeviceInfo(cusNumber,cameraId,"2");
	}
	
	/**
	 * 获取流媒体的信息
	 * @param cusNumber
	 * @param cameraId
	 * @return
	 */
	public JSONObject getStreamInfo(String cusNumber,String cameraId){
		return getVideoDeviceInfo(cusNumber,cameraId,"3");
	}
	
	private JSONObject getVideoDeviceInfo(String cusNumber,String cameraId,String deviceType){
		JSONObject cameraObj=null;
		String cameraStr=RedisUtil.getHashMap(videoDeviceCacheId+"_"+cusNumber+"_"+deviceType, cameraId).toString();
		cameraObj=JSONObject.parseObject(cameraStr);
		return cameraObj;
	}
}
