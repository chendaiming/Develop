package com.hz.fe;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.hz.fe.service.IFeMessageProcess;
import com.hz.frm.util.ApplicationContextUtil;
import com.hz.frm.util.StringUtil;

public class FeMessageRunnable implements Runnable {
	private final Logger logger = LoggerFactory.getLogger(FeMessageRunnable.class);
	private JSONObject msgJSONObject;
	private String cusNumber=null;
	private String serviceName=null;
	
	public FeMessageRunnable(String cusNumber,JSONObject msgJSONObject,String serviceName) {
		this.cusNumber=cusNumber;
		this.msgJSONObject = msgJSONObject;
		this.serviceName=serviceName;
	}
	
	@Override
	public void run() {
		try {
			if(!StringUtil.isNull(serviceName)){
				IFeMessageProcess messageProcess = (IFeMessageProcess) ApplicationContextUtil.getInstance().getBean(serviceName);
				messageProcess.processMessage(cusNumber,msgJSONObject);
			}
		} catch (JSONException ex) {
			logger.error("JSON格式转换错误:",ex);
		} catch (NullPointerException ex) {
			logger.error("空对象异常：",ex);
		}catch(Exception e){
			logger.error("",e);
		}
	}

}
