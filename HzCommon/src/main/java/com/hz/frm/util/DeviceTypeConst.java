package com.hz.frm.util;

import java.util.HashMap;

public class DeviceTypeConst {
	//摄像机
	public static final int CAMERA_TYPE=1;
	//门
	public static final int DOOR_TYPE=2;
	//对讲
	public static final int TALK_TYPE=3;
	//广播
	public static final int BROADCAST_TYPE=4;
	//大屏
	public static final int SCREEN_TYPE=5;
	//网络报警
	public static final int NETWORK_ALARM_TYPE=6;
	private static HashMap<String,String> deviceTableNameMap=new HashMap<String,String>();
	static{
		deviceTableNameMap.put(String.valueOf(CAMERA_TYPE), "cmr_camera_base_dtls");
		deviceTableNameMap.put(String.valueOf(DOOR_TYPE), "dor_door_base_dtls");
	}
	
	public static String getCacheId(String deviceType){
		if(deviceTableNameMap.containsKey(deviceType)){
			return deviceTableNameMap.get(deviceType);
		}else{
			return null;
		}
	}
}
