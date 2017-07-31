package com.hz.cds.police.message;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.hz.cds.police.cache.PoliceBaseDtlsCache;
import com.hz.db.dao.UpdateDao;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.utils.SequenceUtil;
import com.hz.sql.util.SqlConfigUtil;
/**
 * 报警消息的处理类
 * @author zhongxy
 * @date 2015-05-20
 */
@Service
@Transactional
public class FePoliceMessageProcess extends FeMessageProcessAbstract<FePoliceMessageBean> {
	final Logger logger = LoggerFactory.getLogger(FePoliceMessageProcess.class);
	@Resource
	private UpdateDao updateDao;
	@Resource
	private MqMessageSendService mqMessageSendService;
	@Resource
	private SequenceUtil sequenceUtil;
	@Resource
	private PoliceBaseDtlsCache policeBaseDtlsCache;

	@Override
	public Class<FePoliceMessageBean> getBodyClass() {
		return FePoliceMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader feMessageHeader, FePoliceMessageBean fePoliceMessageBean) {
		//报警消息入库
		try {
			insert(feMessageHeader.getCusNumber(),fePoliceMessageBean);
		} catch (Exception e1) {
			logger.debug("插入民警进出记录表出错！msg="+JSON.toJSONString(fePoliceMessageBean), e1);
		}

		try {
			mqMessageSendService.sendInternalWebMessage(fePoliceMessageBean, feMessageHeader.getCusNumber(),feMessageHeader.getMsgType());
		} catch (Exception e) {
			logger.error("报警消息处理失败 msgbody="+JSON.toJSONString(fePoliceMessageBean),e);
		}		
	}
	
	@Transactional(rollbackFor = Exception.class)
	public void insert(String cusNumber, FePoliceMessageBean fePoliceMessageBean) throws Exception {
		String sql = SqlConfigUtil.getSql("insert_plc_police_inout_record");
		Map<String, Object> paramMap = new HashMap<String, Object>();
		String pirRecordId = sequenceUtil.getSequence("plc_police_inout_record", "pir_record_id");
		String policeId = fePoliceMessageBean.getPeopleID();
		String userId = policeBaseDtlsCache.queryUserId(cusNumber, policeId);
		paramMap.put("pir_cus_number", cusNumber);
		paramMap.put("pir_record_id", pirRecordId);
		paramMap.put("pir_police_id", fePoliceMessageBean.getPeopleID());
		paramMap.put("pir_user_id", userId);
		paramMap.put("pir_bsns_time", fePoliceMessageBean.getCompareTime());
		paramMap.put("pir_inout_flag", fePoliceMessageBean.getInOutFlag());
		paramMap.put("pir_remark", "");
		
		updateDao.updateByParamKey(sql, paramMap);
		
		//更新民警在监状态
		String updateSql = SqlConfigUtil.getSql("update_police_inout_status");
		Map<String,Object> updateParamMap = new HashMap<String, Object>();
		updateParamMap.put("pbd_in_prison", Integer.valueOf(fePoliceMessageBean.getInOutFlag()).intValue()-1);
		updateParamMap.put("pbd_cus_number", cusNumber);
		updateParamMap.put("pbd_user_id", userId);
		
		updateDao.updateByParamKey(updateSql, updateParamMap);
		
		String flag = fePoliceMessageBean.getInOutFlag().equals("1")? "进入": "离开";
		
		logger.debug(fePoliceMessageBean.getPeopleName() + flag + "监区");
		
	}
	
	
}
