package com.hz.cds.alarm;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hz.db.extend.InitDataAbstract;

@Service
public class InitAlarmConstants extends InitDataAbstract {

	@Override
	protected void initData() {
		// TODO Auto-generated method stub
		List<Map<String, Object>> result = jdbcDAO.query(1, "SELECT 'SUCCESS' AS RESULT FROM DUAL");

		System.out.println("InitAlarmConstants result：" + result.get(0).get("RESULT"));
	}
}
