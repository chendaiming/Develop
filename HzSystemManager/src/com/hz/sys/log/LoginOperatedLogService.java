package com.hz.sys.log;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.hz.sys.log.bean.OperatedLogBean;
import com.hz.sys.log.service.OperatedLogService;


@Service
public class LoginOperatedLogService {

	private static final Logger log = LoggerFactory.getLogger(LoginOperatedLogService.class);

	/**
	 * 存放用户登录登出日志
	 * @param userInfo
	 * @param desc
	 */
	public void put (Map<String, Object> userInfo, String desc) {
		try {
			putLog(userInfo, desc);
		} catch (Exception e) {
			log.warn("用户" + desc + "日志记录失败：" + JSON.toJSONString(userInfo));
		}
	}

	/*
	 * 存放日志
	 */
	private void putLog(Map<String, Object> userInfo, String desc) {
		// 用户登录日志记录
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String userName = userInfo.get("user_name").toString();
		String dateTime = sdf.format(new Date());
		OperatedLogBean logBean = new OperatedLogBean();

		logBean.setCusNumber(userInfo.get("cus_number"));
		logBean.setType("0");
		logBean.setUserId(userInfo.get("id"));
		logBean.setUserName(userName);
		logBean.setOperatedTime(dateTime);
		logBean.setOperatedDesc(desc);
		logBean.setLoginIp(userInfo.get("loginip"));

		OperatedLogService.put(logBean);
	}
}
