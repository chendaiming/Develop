package com.hz.cds.scheduling.webService;

import com.alibaba.fastjson.JSONObject;

/**
 * 通讯调度WebService接口(海峰)
 * @author shuxr
 *
 */
public interface IccphoneWs {
	/**
	 * 呼叫
	 * @param sheetNum   坐席号
	 * @param sendNum    外送号码(暂不确定)
	 * @param sphone 	  呼叫的号码(暂不确定) 多个号码以","隔开,注意:最后一个号码也必须跟",",否则最后一个号码呼叫不了
	 * @return 1 调用成功  0 调用失败
	 */
	public String call(String sheetNum,String sendNum,String sphone);
	/**
	 * 挂断
	 * @param SheetNum
	 * @return 1 调用成功  0 调用失败
	 */
	public String clearCall(String sheetNum);
	/**
	 * 发送短信
	 * @param phone 呼叫的号码.多个号码以","隔开,注意:最后一个号码也必须跟",",否则最后一个号码呼叫不了
	 * @param msg 短信内容
	 * @return 1 调用成功  0 调用失败
	 */
	public String sendMessage(String phone, String msg);
	/**
	 * 获取坐席状态
	 * @param sheetNum 坐席号
	 * @return 200:空闲;201:摘机;202:按键;203:拨号;204:通话;205:振铃;999:坐席异常
	 * @return 1 调用成功  0 调用失败
	 */
	public String getSheetStatus(String sheetNum);
	/**
	 * 获取通话记录
	 * @param PhoneNum  PhoneNum通话号码(如果为空则查询全部，否则查询某个号码)
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 * @return
	 */
	public JSONObject getRecordData(String phoneNum, String startTime, String endTime);
	/**
	 * 通过文件名查询文件的虚拟目录
	 * @param dirfile 文件名
	 * @return
	 */
	public String getRecordPathByFile(String dirfile);
	/**
	 * 获取用户通讯录
	 * @param cusNumber
	 * @param sPhone 根据电话号码模糊查询,传空为查询所有记录
	 * @return
	 */
	public JSONObject getUserPhone(String groupId,String sPhone);
	/**
	 * 黑名单操作
	 * @param sPhone
	 * @param nAction 1添加 2删除 3查询
	 * @return
	 */
	public JSONObject doBlackList(String sPhone,int nAction);
	/**
	 * 监听 
	 * @param curSheetNum  当前坐席
	 * @param callingSheetNum 要监听的坐席
	 * @return
	 */
	public String lisCall(String curSheetNum,String callingSheetNum);
	/**
	 * 强插
	 * @param curSheetNum  当前坐席
	 * @param callingSheetNum 要强插的坐席
	 * @return
	 */
	public String intoCall(String curSheetNum,String callingSheetNum);
	/**
	 * 群外呼
	 * @param sheetNum
	 * @param sendNum
	 * @param sphone
	 * @return
	 */
	public String callOutQun(String sheetNum,String sendNum,String sphone);
	/**
	 * 群呼操作
	 * @param sheetNum
	 * @param sphone 
	 * @param sOption 操作类型 1添加新号码，2禁言某个号码，3可言某个号码，4挂断某个号码
	 * @return
	 */
	public String CallOutQun_Option(String sheetNum,String sphone,String sOption);
	/**
	 * 获取呼入号码信息
	 * @return
	 */
	public String getCalling();
	/**
	 * 清空呼入号码信息列表
	 * @return
	 */
	public String clearCalling(String sphone);
	/**
	 * 获取所有坐席编号
	 * @return
	 */
	public JSONObject getALLSheetNo();
	/**
	 * 调节通话音量
	 * @param sheetNum 坐席编号
	 * @param voice 音量值 (0-20)
	 * @return
	 */
	public String changeVoice(String sheetNum,String voice);
	/**
	 * 获取来电号码归属地信息
	 * @param sphone
	 * @return
	 */
	public String getArea(String sphone);
}
