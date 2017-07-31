package com.hz.cds.talkback.cache;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ACacheTable;
import com.hz.cache.service.ICacheService;
import com.hz.cache.util.RedisUtil;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.DbException;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.StringUtil;

@Component
public class TalkbackBaseDtlsCache extends ACacheTable implements ICacheService {

	private static final Logger log = LoggerFactory.getLogger(TalkbackBaseDtlsCache.class);
	public static final String talkbackCacheId = "tbk_talkback_base_dtls";
	public static final String talkbackidCacheId = "tbk_talkback_id";

	@Override
	public Boolean query() {
		return queryTalkbackBaseDtls(null,null);
	}

	private boolean queryTalkbackBaseDtls(List<String> paraList, String whereId) {
		JSONObject queryJSON = null;
		try {
			queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_talkback_base_dtls");
			if (paraList != null && paraList.size() > 0) {
				queryJSON.put(ReqParams.WHERE_ID, whereId);
				queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			}
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					String cusNumber=tempMap.get("tbd_cus_number").toString();
					String id = tempMap.get("tbd_id").toString();
					RedisUtil.putHash(talkbackCacheId+"_"+cusNumber, id, JSON.toJSON(tempMap));
					String otherid = tempMap.get("tbd_other_id").toString();
					RedisUtil.putHash(talkbackidCacheId+"_"+cusNumber, otherid, JSON.toJSON(tempMap));
				}
			}
			log.info("缓存对讲机信息... OK!");
			return true;
		} catch (Exception e) {
			log.error("缓存对讲机信息失败..." + e);
			return false;
		}
	}

	/**
	 * 根据对讲机第三方编号获取对讲设备基本信息
	 * @param cusNumber
	 * @param id
	 * @return
	 */
    public JSONObject getTalkbackInfo(String cusNumber,String id){
    	Object talkbackObj=RedisUtil.getHashMap(talkbackidCacheId+"_"+cusNumber, id);
    	if(talkbackObj==null){
			List<String> paraList = new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(id);
			queryTalkbackBaseDtls(paraList,"1");
			talkbackObj=RedisUtil.getHashMap(talkbackidCacheId+"_"+cusNumber, id);
    	}
    	return talkbackObj!=null?JSONObject.parseObject(talkbackObj.toString()):null;
    }

	@Override
	public boolean refresh() throws Exception {
		return queryTalkbackBaseDtls(null, null);
	}

	@Override
	public boolean refresh(JSONObject parasObject) throws Exception {
		String cusNumber = parasObject.getString("cusNumber");
		String id = parasObject.getString("id");
		if (StringUtil.isNull(cusNumber)) {
			throw new DbException(DbCodeUtil.CODE_0003, "参数=" + parasObject.toJSONString());
		} else {
			List<String> paraList = new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(id);
			return queryTalkbackBaseDtls(paraList, "1");
		}
	}

	@Override
	public boolean refreshForDelete(JSONObject parasObject) throws Exception {
		String cusNumber = parasObject.getString("cusNumber");
		String id = parasObject.getString("id");
		RedisUtil.deleteHash(talkbackCacheId + "_" + cusNumber, id);
		return true;
	}
}
