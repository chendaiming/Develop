package com.hz.baseData.asyncDeviceStatus;

import org.springframework.stereotype.Component;

import com.hz.cache.util.RedisUtil;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;

@Component
public class DeviceStatusProccess extends FeMessageProcessAbstract<DeviceStatusMessageBean> {

	@Override
	public Class<DeviceStatusMessageBean> getBodyClass() {
		// TODO Auto-generated method stub
		return DeviceStatusMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader mheader, DeviceStatusMessageBean msg) {
		//将接受到的消息暂时存放到redis中，
		RedisUtil.putList("ASYNC_DEVICE_STATUS_"+msg.getDeviceType(), msg.getMap(mheader.getCusNumber()));
	}

}
