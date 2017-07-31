package com.hz.cds.scheduling.webService;


/**
 * 通讯调度接口(调用WebService) --叙简
 * 定义通讯调度需要实现的功能
 * @author @shuxr
 *
 */
public interface IScheduleService {
	/**
	 * 发送短信
	 * @param sender 必填 发送号码
	 * @param receive 必填  接收号码(多个号码时用  ; 隔开)
	 * @param content 必填  短信内容。最长512个字节（汉字算两个字节）
	 * @param time  可选 定时发送时间。格式：2013-11-11 10:10:10
	 * @param type  通知类型，0：普通；1：通知无回执；2：通知有回执。默认0。
	 * @return
	 */
	public String sendMessage(String receive,String content,String time,Integer type);
	/**
	 * 登录通讯调度系统
	 */
	public boolean login();
	/**
	 * 呼叫(单个用户)
	 * @param sessionId 用户登录成功后续访问的有效ID
	 * @param caller  主叫号码（操作员号码）
	 * @param callee  被叫号码
	 * @param isRecord  是否录音。（暂时不支持，后续开发）0: 否；1：是。默认0
	 * @return
	 */
	public String callPhone(String callee,Integer isRecord);
	/**
	 * 切断与被叫号码的连接(挂机)
	 * @param tel 被叫号码
	 * @return
	 */
	public String callClose(String tel);
	/**
	 * 心跳连接,保持平台与通讯调度系统的通信,间隔15S调用一次
	 */
	public void heartbeat();
	/**
	 * 组呼/选呼
	 * @param caller  主叫号码
	 * @param tels 多个成员号码。格式为8000|8001|8002|8003|8004。号码数目最多16个。
	 * @param groupId  如果使用通讯录，设置组ID为groupId，与通讯录关联时进行组呼需要携带该值。可以用来进行【结束组呼】操作。
					      如果不使用通讯录，加入默认会场 type=0, groupId使用“登录用户名”；如果加入新会场type=1, groupId使用fk_xxx, xxx为自定义的key，key不能超过17位。
	 * @param type     类型：【0】加入默认会场，【1】新创建会场，并将成员加入会场中。默认为0.
	 * @return  
	 */
	public String groupCall(String tels);
	/**
	 * 录音查询
	 * @param recordType  录音类型。【0：平台通话录音；1：调度操作员录音】
	 * @param caller  主叫
	 * @param callee  被叫
	 * @param timeMin 开始时间范围最小值。格式：yyyyMMddHHmmss，如：20131202102703。
	 * @param timeMax 开始时间范围最大值。格式：yyyyMMddHHmmss，如：20131202102703。
	 * @param pageIndex 查询页码，最小值为1
	 * @param pageSize  查询数量
	 * @return 
	 */
	public String recordQuery(int recordType, String caller, String callee, String timeMin, String timeMax,
			int pageIndex, int pageSize);
	/**
	 * 文件下载
	 * @param filename 文件名
	 * @param type     下载类型【0：接收传真；1：平台通话录音；2：调度操作员录音；3：会议录音；4、通知音】
	 * @return
	 */
	public String fileDownload(String filename,Integer type);
	/**
	 * 查询新呼入
	 * @return
	 */
	public String CallinQuery();
	/**
	 * 呼入应答
	 * @param callinTel 呼入号码
	 * @return
	 */
	public String CallAnswer(String callinTel);
	
	
	
	
	/**
	 * 查询会议列表
	 * @return   {
	 *             isLock:是否锁定, 1 已锁定 0 未锁定
	 *             isRecord:是否录音,1 正在录音 0 未录音
	 *             isVoice:是否正在播放背景音乐, 1 正在播放 0 未在播放
	 *             meetId:会议ID, 
	 *             meetNo:会议号,
	 *             members:会议成员列表
	 *             	    [{MeetMember},{MeetMember}]
	 *           }
	 */
	public String queryMeet();
	
	/**
	 * 创建会议
	 * @return
	 */
	public String createMeet();
	
	/**
	 * 删除会议 -- 将会议删除，会议不再存在，不能继续使用。
	 * @param meetId
	 * @return
	 */
	public String deleteMeet(String meetId);
	
	
	/**
	 * 结束会议 -- 结束正在进行中的会议，将会场中的所有成员都踢出会场，会议可以继续使用。
	 * @param meetId
	 * @return
	 */
	public String endMeet(String meetId);
	
	/**
	 * 锁定/解锁会场
	 * @param meetId
	 * @param opType  0 解锁  1 锁定
	 * @return
	 */
	public String lockMeet(String meetId,int opType);
	
	/**
	 * 会场播放背景音乐
	 * @param meetId 
	 * @param opType 0：停止放音；1：开始放音
	 * @return
	 */
	public String voiceMeet(String meetId,int opType);
	
	/**
	 * 会场录音
	 * @param meetId
	 * @param opType 0：停止录音；1：开始录音
	 * @return
	 */
	public String recordMeet(String meetId,int opType);
	
	/**
	 * 成员加入会议 
	 * @param meetId  会议ID
	 * @param tel 号码
	 * @param isSpeak 发言权限  0： 禁止发言；1：允许发言。
	 * @return
	 */
	public String memberJoin(String meetId,String tel,int isSpeak);
	
	/**
	 * 成员离开会议
	 * @param meetId 会议ID
	 * @param tel 号码
	 * @return
	 */
	public String memberLeave(String meetId,String tel);
	
	
	/**
	 * 修改成员等级
	 * @param meetId
	 * @param tel
	 * @param level  0：听众(不能发言)；1：发言者；2：主席。
	 * @return
	 */
	public String memberLevel(String meetId,String tel,int level);
	
}
