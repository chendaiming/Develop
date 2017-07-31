package com.hz.cds.door.message;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.door.cache.DoorBaseDtlsCache;
import com.hz.cds.door.cache.DoorCardDtlsCache;
import com.hz.db.dao.UpdateDao;
import com.hz.frm.utils.SequenceUtil;
import com.hz.sql.util.SqlConfigUtil;
@Component
public class FeDoorTask {
	private static final Logger logger = LoggerFactory.getLogger(FeDoorTask.class);
	@Resource
	private UpdateDao updateDao;
	@Resource
	private DoorBaseDtlsCache doorBaseDtlsCache;
	@Resource
	private DoorCardDtlsCache doorCardDtlsCache;
	@Resource
	private SequenceUtil sequenceUtil;
	
	@Scheduled(cron="0/5 * * * * ?")
	public void startRun() {
		insertSwipeCardRecord();
		updateDoorOpenStatus();
	}
	
	private void insertSwipeCardRecord(){
		List<String> rtnList=RedisUtil.getBoundValue("dor_swipe_card_record");
		String sql=SqlConfigUtil.getSql("insert_dor_swipe_card_record");
		if(rtnList!=null&&rtnList.size()>0){
			List<Object[]> paramsList=new ArrayList<Object[]>();
			for(String value:rtnList){
				FeDoorMessageBean feDoorMessageBean=JSONObject.parseObject(value, FeDoorMessageBean.class);
//				String doorId=doorBaseDtlsCache.getDoorIdForOtherId(feDoorMessageBean.getCusNumber(), feDoorMessageBean.getDoorId());
				String doorId = feDoorMessageBean.getDoorId();
				JSONObject doorObj=doorBaseDtlsCache.getDoorInfo(feDoorMessageBean.getCusNumber(), doorId);
//				JSONObject doorCardObj=doorCardDtlsCache.getDoorCardInfo(feDoorMessageBean.getCusNumber(), feDoorMessageBean.getCardId());
				JSONObject doorCardObj=doorCardDtlsCache.getDoorCardInfoByOtherId(feDoorMessageBean.getCusNumber(), feDoorMessageBean.getCardId());
				String doorName="";
				String deptId="";
				String deptName="";
				String areaId="";
				String areaName="";
				String peopleId="";
				String peopleName="";
				String peopleType="";
				String recordId = "";
				String cardId = "";
				try {
					recordId = sequenceUtil.getSequence("DOR_SWIPE_CARD_RECORD", "SCR_RECORD_ID");
				} catch (Exception e) {
					logger.error("门禁刷卡信息插入=>>获取序列号失败");
				}
				if(doorObj!=null){
					doorName=doorObj.getString("dbd_name");
					deptId=doorObj.getString("dbd_dept_id");
					deptName=doorObj.getString("odd_name");
					areaId=doorObj.getString("dbd_area_id");
					areaName=doorObj.getString("abd_area_name");
					peopleId=doorObj.getString("");
					peopleName=doorObj.getString("");
					peopleType=doorObj.getString("");
				}
				if(doorCardObj!=null){
					peopleId=doorCardObj.getString("dcd_people_id");
					peopleName=doorCardObj.getString("pbd_police_name");
					peopleType=doorCardObj.getString("dcd_people_type");
					cardId = doorCardObj.getString("dcd_door_card_id");
				}
				List<String> paraList=new ArrayList<String>();
				paraList.add(feDoorMessageBean.getCusNumber());
				paraList.add(recordId);
				paraList.add(doorId);
				paraList.add(doorName);
				paraList.add(deptId);
				paraList.add(deptName);
				paraList.add(areaId);
				paraList.add(areaName);
				paraList.add(peopleId);
				paraList.add(peopleType);
				paraList.add(peopleName);
				paraList.add(cardId);
				paraList.add(feDoorMessageBean.getInOutFlag());
				paraList.add(feDoorMessageBean.getBrushCardTime());
				paraList.add(feDoorMessageBean.getStatus());
				paraList.add(feDoorMessageBean.getRemark());
				paramsList.add(paraList.toArray());
			}
			try {
				updateDao.updateBatch(sql, paramsList);
			} catch (Exception e) {
				logger.error("插入门禁刷卡信息失败 msg="+rtnList,e);
			}
		}
	}
	
	private void updateDoorOpenStatus(){
		List<String> rtnList=RedisUtil.getBoundValue("dor_door_open_status");
		String sql=SqlConfigUtil.getSql("update_door_open_status");
		if(rtnList!=null&&rtnList.size()>0){
			List<Object[]> paramsList=new ArrayList<Object[]>();
			for(String value:rtnList){
				FeDoorOpenStatusMessageBean feDoorOpenStatusMessageBean=JSONObject.parseObject(value, FeDoorOpenStatusMessageBean.class);
				List<String> paraList=new ArrayList<String>();
//				paraList.add(feDoorOpenStatusMessageBean.getLockStatus());
				paraList.add(feDoorOpenStatusMessageBean.getDoorStatus());
				paraList.add(feDoorOpenStatusMessageBean.getCusNumber());
				paraList.add(feDoorOpenStatusMessageBean.getDoorId());
				paramsList.add(paraList.toArray());
			}
			try {
				updateDao.updateBatch(sql, paramsList);
			} catch (Exception e) {
				logger.error("更新门开关状态失败 msg="+rtnList,e);
			}
		}
	}
}
