package com.hz.cds.alarm.utils;

public interface AlarmConstants {
	
	
	
	
/*	public static final String SYSTEM_USER = "-1";				// 系统用户

	 报警设备类型 
	public static final String ALARM_DVC_TYPE_8 = "8";			// 人工报警

	 报警处置状态 
	public static final String ARD_OPRTN_STTS_1 = "1";			// 发生报警

	 通知前端的报警消息类型 
	public static final String ALARM_MSG_3001 = "3001";				// 当前报警
	public static final String ALARM_MSG_3006 = "3006";				// 上级报警处理的报警
	public static final String ALARM_MSG_3007 = "3007";				// 省局的报警消息
*/
	/* 接收到的报警设备的消息类型 */
	public static final String ALARM_MSG_001 = "Alarm001";			// 报警消息
	public static final String ALARM_MSG_002 = "Alarm002";			// 布防、撤防消息
	public static final String ALARM_MSG_003 = "Alarm003";			// 报警器状态
	public static final String ALARM_MSG_004 = "Alarm004"; 			// 返回信息

	// 报警状态 
	public static final String ALARM_ACTION_1 = "1";				// 报警
	public static final String ALARM_ACTION_2 = "2";				// 取消报警

	// 查询报警记录
	/*public static final String CDS_ADD_ALARM_RECORD = "cds_add_alarm_record";
	// 获取报警顶级
	public static final String ALARM_LEVEL_QUERY="alarm_level_query";
	// 更新报警器状态
	public static final String ALARM_RECORD_STATUS_UPDATE="alarm_record_status_update";
	// 更新报警器状态
	public static final String ALERTOR_STATUS_UPDATE="alertor_status_update";

	*//** 更新接警状态 *//*
	public static final String CDS_ALARM_UPDATERECEIVESTATUS= "cds_alarm_updateReceiveStatus";

	*//** 删除报警处置流程 *//*
	public static final String CDS_ALARM_DELTFLOWITEM = "cds_alarm_deltFlowItem";

	*//** 添加报警处置流程项 *//*
	public static final String CDS_ALARM_ADDFLOWITEM = "cds_alarm_addFlowItem";

	*//** 添加报警处置流程 *//*
	public static final String CDS_ALARM_ADDFLOW = "cds_alarm_addFlow";

	*//** 更新报警处置流程 *//*
	public static final String CDS_ALARM_UPDATEFLOW = "cds_alarm_updateFlow";

	*//** 查询下一个处置流程编号 *//*
	public static final String CDS_ALARM_QUERYFLOWSEQ = "cds_alarm_queryFlowSeq";*/
}
