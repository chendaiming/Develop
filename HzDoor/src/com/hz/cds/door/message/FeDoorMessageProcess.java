package com.hz.cds.door.message;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.door.cache.DoorBaseDtlsCache;
import com.hz.cds.door.cache.DoorCardDtlsCache;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
/**
 * 报警消息的处理类
 * @author zhongxy
 * @date 2015-05-20
 */
@Service
@Transactional
public class FeDoorMessageProcess extends FeMessageProcessAbstract<FeDoorMessageBean> {
	final Logger logger = LoggerFactory.getLogger(FeDoorMessageProcess.class);
	public static final String cacheId = "dor_swipe_card_record";
	@Resource
	private MqMessageSendService mqMessageSendService;
	@Resource
	private DoorBaseDtlsCache doorBaseDtlsCache;
	@Resource
	private DoorCardDtlsCache doorCardDtlsCache;
	
	@Override
	public Class<FeDoorMessageBean> getBodyClass() {
		return FeDoorMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader feMessageHeader, FeDoorMessageBean feDoorMessageBean) {
		feDoorMessageBean.setCusNumber(feMessageHeader.getCusNumber());
		//刷卡数据缓存到redis
		RedisUtil.putBound(cacheId, JSONObject.toJSONString(feDoorMessageBean));
		//消息推送到前台
		try {
			feDoorMessageBean.setDoorName(getDoorName(feMessageHeader.getCusNumber(),feDoorMessageBean.getDoorId()));
			feDoorMessageBean.setPeopleName(getPeopleName(feMessageHeader.getCusNumber(),feDoorMessageBean.getCardId()));
			mqMessageSendService.sendInternalWebMessage(feDoorMessageBean, feMessageHeader.getCusNumber(),feMessageHeader.getMsgType());
		} catch (Exception e) {
			logger.error("向Web端发送门禁消息异常 msgbody="+JSON.toJSONString(feDoorMessageBean),e);
		}		
	}
	
	/**
	 * 获取门禁名称
	 * @param cusNumber
	 * @param doorId
	 * @return
	 */
	private String getDoorName(String cusNumber,String doorId){
		String doorName = "未知门禁设备("+ doorId + ")";
		
		JSONObject doorObj=doorBaseDtlsCache.getDoorInfo(cusNumber, doorId);
		
		if(doorObj != null){
			doorName=doorObj.getString("dbd_name");
		}
		
		return doorName;
	}
	
	/**
	 * 获取刷卡人员姓名
	 * @param cusNumber
	 * @param cardId
	 * @return
	 */
	private String getPeopleName(String cusNumber,String cardId){
		String peopleName = "未知("+ cardId + ")";
		
		JSONObject cardObj = doorCardDtlsCache.getDoorCardInfoByOtherId(cusNumber,cardId);
		
		if(cardObj != null){
			peopleName=cardObj.getString("pbd_police_name");
		}
		
		return peopleName;
	}
}
