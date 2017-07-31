package com.hz.frm.common;

public interface IConst {
	
	/**************************************************************************************
	 * 									      框架
	 **************************************************************************************/
	//查询参数配置的sqlid的key
	public static final String SQLID="sqlid";
	public static final String WHERID="whereId";
	public static final String ORDERID="orderId";
	public static final String SEQ = "seq";
	public static final String TABLENAME="tableName";
	public static final String COLUMNNAME="columnName";
	public static final String SEQINDEX="seqIndex";
	public static final String RELATION_TABLENAME="relationTableName";
	public static final String RELATION_COLUMNNAME="relationColumnName";
	public static final String RELATION_SEQINDEX="relationSeqIndex";
	public static final String PARAS="parasList";
	public static final String QUERYTYPE="queryType";
	//通用查询控制类
	public static final String QUERYCTRL="queryCtrl";
	public static final String QUERYFORlISTLIST="/queryForListList";
	public static final String QUERYFORlISTMAP="/queryForListMap";
	public static final String QUERYFORMAP="/queryForMap";
	public static final String QUERY_IMG = "/queryImg";
	public static final String QUERY_SEQ = "/querySeq";
	public static final String GET_SEQ = "/getSeq";
	//通用更新控制类
	public static final String UPDATECTRL="/updateCtrl";
	public static final String UPDATE="/update";
	public static final String BATCH_UPDATE="/batchUpdate";
	public static final String DELETECTRL="deleteCtrl";
	public static final String UPDATECLOB="/updateClob";
	//通用新增控制类
	public static final String ADDCTRL="addCtrl";
	public static final String ADD="/add";
	public static final String ADD_LIST="/addList";
	public static final String ADDCLOB="/addClob";
	public static final String DUTY="duty";
	//上传
	public static final String UPLOADCTRL="/uploadCtrl";
	public static final String UPLOADFILECTRL="/uploadFileCtrl";
	public static final String UPLOAD="/upload";
	public static final String UPLOAD_FILE="/uploadFile";
	
	//消息推送
	public static final String MESSAGE_SEND_CTR="/messageSendCtrl";
	//查询今日值班
	public static final String QUERYDUTYINFO="queryDutyInfo";
	
	public static final String PRISONER="prisoner";
	//查询实时押犯人
	public static final String QUERYREALTIMEPRISONERCOUNT="queryRealTimePrisonerCount";
	
	/** 回话管理  */
	public static final String SESSION="/session";
	/** 回话管理-登录  */
	public static final String SESSION_LOGIN="/login";
	/** 回话管理-单点登录(无密码无校验)  */
	public static final String SESSION_SINGLE_LOGIN="/singlelogin";
	/** 回话管理-登出  */
	public static final String SESSION_LOGOUT="/logout";

	/** 登录管理  */
	public static final String LOGIN_CTRL="/loginCtrl";
	/** 用户登录  */
	public static final String USER_LOGIN="/login";
	/** 用户登出  */
	public static final String USER_LOGOUT="/logout";

	/** 通用组件  */
	public static final String COMPAGE="/comPage";
	
	/** 简单分页查询组件  */
	public static final String PAGINATION="/pagination";
	
	/** dataGrid 分页查询控件*/
	public static final String DATAGRID="/dataGrid";
	
	/** 控制器-处理  */
	public static final String CONTROLLER_EXCUTE="/excute";
	
	
}
