package com.hz.cds.rfid.utils;

public interface RFIDConstants {
	// 基站id
	public static final String RFID = "RFID001";	
	//redis标识
	public static final String REDIS_KEY = "RFID_RECORD";
	
	// 缓存中存储RFID记录的key
	public static final String RFID_RECORD_KEY4CACHE = "DVC_RFID_MONITOR_RECORD_LIST";
	
	// 缓存中存储rfid最新记录的key(真正的key末尾有_HASH，因RedisUtil会格式化，所以这边没有加_HASH)
	public static final String RFID_NEWEST_RECORD_KEY4CACHE = "DVC_RFID_MONITOR_NEWEST_RECORD";
	
	// 缓存中存储更新失败的RFID记录的key
	public static final String ERROR_RFID_RECORD_KEY4CACHE = "DVC_RFID_MONITOR_RECORD_ERROR_LIST";
}
