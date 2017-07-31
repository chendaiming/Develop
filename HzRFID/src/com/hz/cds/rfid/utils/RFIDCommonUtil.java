package com.hz.cds.rfid.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class RFIDCommonUtil {
	
	public static String lastTimeStamp = "";// 上一个时间戳记录
	
	public static int index = 0;
	
	/**
	 * 获取当前系统时间
	 * @return
	 */
	public static String getPresentTime(){
		Date now = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(now);
	}
	
	/**
	 * 判空
	 * @param str
	 * @return
	 */
	public static boolean isEmpty(String str){
		return str==null || str.trim().length()==0;
	}
	
	/**
	 * 根据时间戳获取唯一id
	 * @return
	 */
	public static String getRecordId(){
		String nowTimeStamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		if(lastTimeStamp.equals(nowTimeStamp)){
			index++;
		}else{
			index = 1;
			lastTimeStamp = nowTimeStamp;
		}
		return new StringBuffer().append(nowTimeStamp).append(index).toString();
	}
}
