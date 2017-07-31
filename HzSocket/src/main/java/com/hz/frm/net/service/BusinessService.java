package com.hz.frm.net.service;

import com.alibaba.fastjson.JSONObject;

public abstract class BusinessService extends BaseService {
	@Override
	public String handleMsg(JSONObject msg) {
		//FepMessage fepMsg = new FepMessage(msg);
		//FepServerMsgThread.putMessage(fepMsg);
		return null;
	}
}
