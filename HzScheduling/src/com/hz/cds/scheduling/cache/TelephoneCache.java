package com.hz.cds.scheduling.cache;

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

/**
 * 平台电话号码缓存,包含内容
 *  1.警员信息中填写了电话号码的警员
 *  2.通讯调度通讯录表(SHD_ADDRESS_BOOK)中的数据
 *  2017-07-28
 * @author Rui_MSI
 * 
 */
@Component
public class TelephoneCache extends ACacheTable implements ICacheService{
	@Resource
	private QueryDao queryDao;

	private static final Logger log = LoggerFactory.getLogger(TelephoneCache.class);
	public static final String telePhoneCacheId = "hz_scheduling_telephone";

	@Override
	public Boolean query() {
		Set<Object> cusNumberKeys=RedisUtil.getTemplate().opsForHash().keys("cusnumber");
		for(Object key:cusNumberKeys){
			RedisUtil.deleteHash(telePhoneCacheId+"_"+key);
		}
		return queryTelephoneBaseDtls(null,null);
	}
  
	private boolean queryTelephoneBaseDtls(List<String> paraList,String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_scheduling_telephone_cache");
			if(paraList!=null&&paraList.size()>0){
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber=tempMap.get("cusNumber").toString();
					String phone =tempMap.get("tel").toString();
					RedisUtil.putHash(telePhoneCacheId+"_"+cusNumber, phone, JSON.toJSONString(tempMap));
				}
			}
			log.info("缓存通讯调度通讯录信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存通讯调度通讯录信息...ERROR",e);
			return false;
		}
	}
	
	@Override
	public boolean refresh() throws Exception {
		return queryTelephoneBaseDtls(null,null);
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String tel=parasObject.getString("tel"); 
		RedisUtil.deleteHash(telePhoneCacheId+"_"+cusNumber, tel);
		return true;
				
	}
	
	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		String cusNumber=parasObject.getString("cusNumber"); 
		String tel=parasObject.getString("tel");
		if(StringUtil.isNull(cusNumber)){
			throw new DbException(DbCodeUtil.CODE_0003, "参数="+parasObject.toJSONString());
		}else{
			List<String> paraList=new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(tel);
			return queryTelephoneBaseDtls(paraList,"1");
		}
	}
	
	/**
	 * 通过电话号码获取与之绑定的人员信息
	 * @param cusNumber
	 * @param tel 电话号码
	 * @return
	 */
	public JSONObject getTelephoneInfo(String cusNumber,String tel){
		JSONObject rtnObj=null;
		Object telephoneObj= RedisUtil.getObject(telePhoneCacheId+"_"+cusNumber, tel);
		if(telephoneObj !=null){
			String value=telephoneObj.toString();
			rtnObj=JSONObject.parseObject(value);
		}
		return rtnObj;
	}
}
