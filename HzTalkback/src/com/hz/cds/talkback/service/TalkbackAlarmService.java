package com.hz.cds.talkback.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cds.alarm.extend.impl.AlarmExtendService;
import com.hz.db.service.IQueryService;

@Service
public class TalkbackAlarmService extends AlarmExtendService{

	private static final Logger log = LoggerFactory.getLogger(TalkbackAlarmService.class);

	@Resource
	private IQueryService queryService;


	/*
	 * 注册服务
	 */
	public TalkbackAlarmService () {
		super.register(ALARM_TYPE_03, this);
	}

	@Override
	public List<Map<String, Object>> getBaseInfos() {
		List<Map<String, Object>> listMap = null;

		try {
			listMap = queryService.query("select_talkback_info_for_cache", null);
		} catch (Exception e) {
			log.error("对讲设备基础信息表数据异常：", e);
		}

		return listMap;
	}

	@Override
	public String getAlarmTypeCn(String alarmType) {
		// TODO Auto-generated method stub
		return null;
	}
}
