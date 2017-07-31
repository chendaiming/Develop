package com.hz.frm.utils;

public interface IMsgTypeConst {
	//web 请求响应的统一type
	public static final String REQUEST_RESPONT="0001";
	//公用消息类型
	public static final String COMMON_MESSAGE="9001";
	//警力区域分布
	public static final String POLICE_AREA_COUNT="1001";
	// 当前会见
	public static final String CURRENT_MEETING="3002";
	// 当前零星流动
	public static final String CURRENT_FLOW_PEOPLE="3003";
	// 当前刷卡人
	public static final String CURRENT_BRUSH_PEOPLE="3004";
	// 当前对讲
	public static final String CURRENT_TALK="3005";
	//安检门报警
	public static final String SECURITY_DOOR="5001";
	
	
	//现在在用的消息类型
	//外来人员
	public static final String FOREIGN_PEOPLE_COUNT="2001";
	//外来车辆
	public static final String FOREIGN_CAR_COUNT="2002";
	//外来车辆
	public static final String FOREIGN_CAR_INFO="2003";
	//当前监内民警
	public static final String CURRENT_POLICE_COUNT="1003";
	//监内民警超过24小时
	public static final String POLICE_IN_24="1004";
	
	//点名
	public static final String PRISONER_CALL="4001";
	//罪犯在线统计
	public static final String PRISONER_ONLINE="4002";
	// 当前报警
	public static final String CURRENT_ALERT="3001";
	//上级报警处理的报警
	public static final String SUPERIOR_ALERT="3006";
	//省局的报警消息
	public static final String PROVINCE_ALERT="3007";
	
	//罪犯外出
	public static final String PERSION_GOOUT="8001";
	public static final String PERSION_GOOUT_NUM="8002";
	
}
