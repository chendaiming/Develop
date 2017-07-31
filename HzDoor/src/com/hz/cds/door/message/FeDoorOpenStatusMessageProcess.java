package com.hz.cds.door.message;

import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
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
public class FeDoorOpenStatusMessageProcess extends FeMessageProcessAbstract<FeDoorOpenStatusMessageBean> {
	final Logger logger = LoggerFactory.getLogger(FeDoorOpenStatusMessageProcess.class);
	public static final String cacheId = "dor_door_open_status";
	@Resource
	private MqMessageSendService mqMessageSendService;

	@Override
	public Class<FeDoorOpenStatusMessageBean> getBodyClass() {
		return FeDoorOpenStatusMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader feMessageHeader, FeDoorOpenStatusMessageBean feDoorOpenStatusMessageBean) {
		feDoorOpenStatusMessageBean.setCusNumber(feMessageHeader.getCusNumber());
		//刷卡数据缓存到redis
		RedisUtil.putBound(cacheId, JSONObject.toJSONString(feDoorOpenStatusMessageBean));
		//消息推送到前台
		try {
			mqMessageSendService.sendInternalWebMessage(feDoorOpenStatusMessageBean, feMessageHeader.getCusNumber(),feMessageHeader.getMsgType());
		} catch (Exception e) {
			logger.error("门开关状态msgbody="+JSON.toJSONString(feDoorOpenStatusMessageBean),e);
		}		
	}

}
