package com.hz.cds.alarm.extend;

import java.util.List;
import java.util.Map;

/**
 * 报警服务接口
 */
public interface IAlarmExtendService {

	/*
	 * 报警设备类型
	 */
	public static final String ALARM_TYPE_01 = "1";		// 摄像机
	public static final String ALARM_TYPE_02 = "2";		// 门禁
	public static final String ALARM_TYPE_03 = "3";		// 对讲机
	public static final String ALARM_TYPE_04 = "4";		// 广播
	public static final String ALARM_TYPE_05 = "5";		// 电视墙
	public static final String ALARM_TYPE_06 = "6";		// 网络报警器
	public static final String ALARM_TYPE_07 = "7";		// 高压电网
	public static final String ALARM_TYPE_08 = "8";		// 周界红外
	public static final String ALARM_TYPE_09 = "9";		// 周界光纤
	public static final String ALARM_TYPE_10 = "10";	// 蛇腹网
	public static final String ALARM_TYPE_11 = "11";	// 电子围栏
	public static final String ALARM_TYPE_12 = "12";	// 消防报警器
	public static final String ALARM_TYPE_13 = "13";	// 智能钥匙箱
	public static final String ALARM_TYPE_14 = "14";	// 智能监舍
	public static final String ALARM_TYPE_15 = "15";	// RFID基站
	public static final String ALARM_TYPE_16 = "16";	// 巡更刷卡器
	public static final String ALARM_TYPE_17 = "17";	// 无线报警主机
	public static final String ALARM_TYPE_18 = "18";	// 无线报警终端

	/*
	public static final String ALARM_TYPE_CAMERA = "1";		// 摄像机
	public static final String ALARM_TYPE_DOOR = "2";		// 门禁
	public static final String ALARM_TYPE_TALKBACK = "3";		// 对讲机
	public static final String ALARM_TYPE_BROADCAST = "4";		// 广播
	public static final String ALARM_TYPE_SCREEN = "5";		// 电视墙
	public static final String ALARM_TYPE_NETWORKALARM = "6";		// 网络报警器
	public static final String ALARM_TYPE_POWERNETWORK = "7";		// 高压电网
	public static final String ALARM_TYPE_08 = "8";		// 周界红外
	public static final String ALARM_TYPE_09 = "9";		// 周界光纤
	public static final String ALARM_TYPE_10 = "10";	// 蛇腹网
	public static final String ALARM_TYPE_11 = "11";	// 电子围栏
	public static final String ALARM_TYPE_12 = "12";	// 消防报警器
	public static final String ALARM_TYPE_13 = "13";	// 智能钥匙箱
	public static final String ALARM_TYPE_14 = "14";	// 智能监舍
	public static final String ALARM_TYPE_RFID = "15";	// RFID基站
	public static final String ALARM_TYPE_16 = "16";	// 巡更刷卡器
	public static final String ALARM_TYPE_WIRELESSALARM_MASTER = "17";	// 无线报警主机
	public static final String ALARM_TYPE_WIRELESSALARM_CLIENT = "18";	// 无线报警终端
	*/

	/**
	 * 获取设备基础信息
	 * @return
	 */
	public List<Map<String, Object>> getBaseInfos ();


	/**
	 * 获取报警类型的转义
	 */
	public String getAlarmTypeCn (String alarmType);
}
