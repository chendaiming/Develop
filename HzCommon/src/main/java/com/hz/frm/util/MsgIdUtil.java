package com.hz.frm.util;

public class MsgIdUtil {
	private static long msgSeqNum = 0;
	/**
	 * 分配消息序号
	 * @param sender
	 * @return
	 */
	synchronized public static String getMsgSeq(String sender) {
		++msgSeqNum;
		String msgSeq = String.format("%s%s%010d", sender, DateUtil.getTodayString("yyyyMMdd"), msgSeqNum);
		return msgSeq;
	}
}
