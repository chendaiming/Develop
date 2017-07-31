package com.hz.cds.scheduling.test;

import org.tempuri.IccphonesProxy;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class IccphoneWsTest {
	 public static void main(String[] args) {
		 IccphonesProxy icc = new IccphonesProxy();
		 try {
//			 String str = icc.getRecordData("","2016-12-01","2017-03-22"); //获取所有通话记录
//			 String str = icc.getRecordPathByFile("D://Program Files/ccphone/HF_Record/Record_OUT/2016/12/02/15917391616-U164720312.wav");//查询文件所在虚拟目录,只到根目录
//			 String str = icc.getSheetStatus("");
//			 String str = icc.clearCall("801");//挂断
//			 String str = icc.intoCall("801", "802");
//			 String str = icc.lisCall("801", "802");
//			 String str = icc.callOut("805", "13929165497", "18970849689");//呼出 呼叫时坐席状态会发生改变但没有实际效果
//			 String str = icc.doGetUserPhone("");//获取所有人员通讯录
//			 String str = icc.doErrorPhone("",3);//查询黑名单
//			 icc.doErrorPhone(sPhone, nAction)
//			 String str = icc.doErrorPhone("22233344",1);//添加黑名单
//			 String str = icc.doErrorPhone("22233344",2);//删除黑名单
//			 String str = icc.sendDX("13682223467", "明康监狱综合调度测试短信"); //测试成功
//			 String str = icc.doGetALLSheetNo();
//			 String str = icc.doGetALLSheetNo();
			 String str = icc.getAreaForPhone("018970849689");
//			 String str = IccphoneWsTest.getSheetList(icc);
			 System.out.println(str);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	 
	 
	 private static String getSheetList(IccphonesProxy icc)throws Exception{
		 JSONArray sheetAry = new JSONArray();
		 String sheets = icc.doGetALLSheetNo();
		 if(sheets.length()>0){
			 String[] sheetList = sheets.split(",");
			 for(String sheet:sheetList){
				 JSONObject sheetObj = new JSONObject();
				 sheetObj.put("id", sheet);
				 sheetObj.put("name", sheet + "(" + icc.getSheetStatus(sheet) + ")");
				 sheetAry.add(sheetObj);
			 }
		 }
		 
		 return sheetAry.toJSONString();
	 }
}
