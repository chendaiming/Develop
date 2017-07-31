package com.hz.cds.wirelessalarm;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.alarm.extend.impl.AlarmExtendService;
import com.hz.db.service.IQueryService;

/**
 * 无线报警扩展服务
 * @author xieyh
 */
@Service
public class WirelessAlarmExtendService extends AlarmExtendService {

	private static final Logger log = LoggerFactory.getLogger(WirelessAlarmExtendService.class);

	@Resource
	private IQueryService queryService;


	/*
	 * 注册服务
	 */
	public WirelessAlarmExtendService () {
		super.register(ALARM_TYPE_17, this);
	}

	@Override
	public List<Map<String, Object>> getBaseInfos() {
		List<Map<String, Object>> listMap = null;

		try {
			listMap = queryService.query("select_wireless_alarm_master_info", null);
		} catch (Exception e) {
			log.error("获取无线报警主机表数据异常：", e);
		}

		return listMap;
	}

	@Override
	public String getAlarmTypeCn(String alarmType) {
		// TODO Auto-generated method stub
		return null;
	}
}
