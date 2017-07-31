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
public class CameraBaseDtlsCache extends ACacheTable implements ICacheService{
	@Resource
	private QueryDao queryDao;

	private static final Logger log = LoggerFactory.getLogger(CameraBaseDtlsCache.class);
	public static final String cameraCacheId = "cmr_camera_base_dtls";

	@Override
	public Boolean query() {
		Set<Object> cusNumberKeys=RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for(Object key:cusNumberKeys){
			RedisUtil.deleteHash(cameraCacheId+"_"+key);
		}
		return queryCameraBaseDtls(null,null);
	}
  
	private boolean queryCameraBaseDtls(List<String> paraList,String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_camera_base_dtls");
			if(paraList!=null&&paraList.size()>0){
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber=tempMap.get("cbd_cus_number").toString();
					String id=tempMap.get("cbd_id").toString();
					RedisUtil.putHash(cameraCacheId+"_"+cusNumber, id, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存摄像机基本信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存摄像机基本信息...",e);
			return false;
		}
	}
	
	@Override
	public boolean refresh() throws Exception {
		return queryCameraBaseDtls(null,null);
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String id=parasObject.getString("id"); 
		RedisUtil.deleteHash(cameraCacheId+"_"+cusNumber, id);
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
			return queryCameraBaseDtls(paraList,"1");
		}
	}
	
	/**
	 * 通过摄像机编号获取摄像机信息
	 * @param cusNumber
	 * @param cameraId
	 * @return
	 */
	public JSONObject getCameraInfo(String cusNumber,String cameraId){
		JSONObject cameraObj=null;
		String cameraStr=RedisUtil.getHashMap(cameraCacheId+"_"+cusNumber, cameraId).toString();
		cameraObj=JSONObject.parseObject(cameraStr);
		return cameraObj;
	}
	
	/**
	 * 通过摄像机编号获取摄像机名称
	 * @param cusNumber 监狱号
	 * @param cameraId 摄像机编号
	 * @return
	 */
	public String getCameraName(String cusNumber,String cameraId){
		String name="";
		JSONObject cameraObj=getCameraInfo(cusNumber,cameraId);
		if(cameraObj!=null){
			name=cameraObj.getString("cbd_name");
		}
		return name;
	}
}
