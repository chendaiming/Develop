package com.hz.ws.impl;

import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

import com.hz.ws.HzWebService;

public class HzWebServiceTest {
	public static void main(String[] args) {
		JaxWsProxyFactoryBean svr = new JaxWsProxyFactoryBean();
		svr.setServiceClass(HzWebService.class);
		svr.setAddress("http://127.0.0.1:8080/Prison/ws/ws");
//		 svr.setAddress("http://10.43.239.22:8080/Prison/ws/ws");
		HzWebService web = (HzWebService) svr.create();
		String str = "";
//		str = web.queryByCusnumber("alertor", "3223");// 报警器
//		str = web.queryByCusnumber("camera", "3223"); // 摄像机
//		str = web.queryByCusnumber("dvr", "3223");// 硬盘录像机
//		str = web.queryByCusnumber("broadcast", "3223");// 数字广播
//		str = web.queryByCusnumber("doorctrl", "3");// 门禁控制器
//		str = web.queryByCusnumber("door", "3223");// 门禁
//		str = web.queryByCusnumber("patrol", "3");// 巡更设备
		str = web.queryByCusnumber("talkback", "3");// 对讲机
//		str = web.queryByCusnumber("led", "3223");//LED
//		str = web.queryByCusnumber("floodlight", "3223");//智能照明
//		str = web.queryByCusnumber("audiomonitor", "3223");//拾音器
		//str = web.queryByCusnumber("rfidbind", "3223");//rfid绑定
		System.out.println(str);
	}
}
