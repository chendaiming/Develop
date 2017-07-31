package com.hz.cds.scheduling.webService.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.annotation.PostConstruct;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.tempuri.IccphonesProxy;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.scheduling.webService.IccphoneWs;

@Service
public class IccphoneWsImpl implements IccphoneWs{
	final Logger logger = LoggerFactory.getLogger(IccphoneWsImpl.class);
	/**
	 * 通讯调度对象
	 */
	private IccphonesProxy iccphone; 
	/**
	 * 初始化
	 */
	@PostConstruct
	private void init(){
		iccphone = new IccphonesProxy();
		//登录通讯调度系统
	}
	@Override
	public String call(String sheetNum, String sendNum, String sphone) {
		String result = "";
		try {
			 result = iccphone.callOut(sheetNum, sendNum, sphone,"3223");
			 result = commonResult("呼叫",result);
		} catch (Exception e) {
			logger.error("通讯调度===>>呼叫发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}

	@Override
	public String clearCall(String sheetNum) {
		String result = "";
		try {
			 result = iccphone.clearCall(sheetNum);
			 result = commonResult("挂断",result);
		} catch (Exception e) {
			logger.error("通讯调度===>>挂断发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}

	@Override
	public String sendMessage(String phone, String msg) {
		String result = "";
		try {
			 result = iccphone.sendDX(phone, msg);
			 result = commonResult("发送短信",result);
		} catch (Exception e) {
			logger.error("通讯调度===>>发送短信发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}

	@Override
	public String getSheetStatus(String sheetNum) {
		JSONObject json = new JSONObject();
		String result = "";
		try {
			 result = iccphone.getSheetStatus(sheetNum);
			 json.put("id", result);
			 json.put("value", formatStatus(result));
		} catch (Exception e) {
			logger.error("通讯调度===>>获取坐席状态发生异常:"+ e.getMessage());
			return "获取坐席状态发生异常:"+e.getMessage();
		}
		return json.toJSONString();
	}

	/**
	 * 状态信息转换为中文
	 * @param code
	 * @return
	 */
	private String formatStatus(String code){
		String value  = "未知";
		
		switch(code){
		case "200": value = "空闲"; break;
		case "201": value = "已摘机"; break;
		case "202": value = "按键"; break;
		case "203": value = "拨号中"; break;
		case "204": value = "通话中"; break;
		case "205": value = "振铃中"; break;
		case "999": value = "异常"; break;
		}
		
		return value;
	}
	
	@Override
	public JSONObject getRecordData(String phoneNum, String startTime, String endTime) {
		JSONObject result = new JSONObject();
		JSONArray array = new JSONArray();
		JSONObject data = new JSONObject();
		String _result = "";
		try {
				_result = iccphone.getRecordData(phoneNum, startTime, endTime);
				List<Element> elements = formatXmlData(_result);
				for(int i=0;i<elements.size();i++){
					JSONObject json = new JSONObject();
					json.put("rn", i+1);
					json.put("sheet_id", elements.get(i).attributeValue("sheet_id"));
					json.put("ndate", elements.get(i).attributeValue("ndate"));
					json.put("sdate", dateFormat(elements.get(i).attributeValue("sdate")));
					json.put("edate", dateFormat(elements.get(i).attributeValue("edate")));
					json.put("calling", elements.get(i).attributeValue("calling"));
					json.put("called", elements.get(i).attributeValue("called"));
					json.put("callnum", elements.get(i).attributeValue("callnum"));
					json.put("sumchar", elements.get(i).attributeValue("sumchar"));
					json.put("call_to", elements.get(i).attributeValue("call_to"));
					json.put("sfile", elements.get(i).attributeValue("sfile"));
					json.put("dirfile", elements.get(i).attributeValue("dirfile"));
					json.put("playfile", getRecordPathByFile(elements.get(i).attributeValue("dirfile")));
					array.add(json);
				}
				data.put("data", array);
				data.put("count", array.size());
				result.put("data", data);
				result.put("success", true);
		} catch (Exception e) {
			logger.error("通讯调度===>>获取通话记录发生异常:"+ e.getMessage());
			result.put("success", false);
		}
		return result;
	}

	@Override
	public String getRecordPathByFile(String dirfile) {
		String result = "";
		try {
			 result = iccphone.getRecordPathByFile(dirfile);
		} catch (Exception e) {
			logger.error("通讯调度===>>获取文件虚拟目录异常:"+ e.getMessage());
		}
		return result;
	}

	@Override
	public JSONObject getUserPhone(String groupId,String sPhone){
		JSONObject result = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			String userPhone = iccphone.doGetUserPhone(sPhone);
			List<Element> elements = formatXmlData(userPhone);
			for(int i=0;i<elements.size();i++){
				JSONObject json = new JSONObject();
				json.put("id", elements.get(i).attributeValue("id"));
				json.put("policeid", "");
				json.put("pid", groupId);
				json.put("icon", "user.png");
				json.put("tel", elements.get(i).attributeValue("sphone"));
				json.put("name", elements.get(i).attributeValue("sname"));
				json.put("remark", elements.get(i).attributeValue("smemo"));
				json.put("type", 1);
				array.add(json);
			}
			result.put("count", elements.size());
			result.put("data", array);
			result.put("success", true);
		} catch (Exception e) {
			logger.error("通讯调度==>>获取通讯录异常"+e.getMessage());
			result.put("success", false);
		}
		return result;
	}
	
	
	@Override
	public JSONObject doBlackList(String sPhone,int nAction){
		JSONObject result = new JSONObject();
		JSONArray array = new JSONArray();
		try {
			String returnStr = iccphone.doErrorPhone(sPhone, nAction);
			
			switch(nAction){
			case 1:
			case 2:
				if(returnStr.equals("1")){
					result.put("success", true);
					result.put("msg", nAction == 1?"添加黑名单成功":"删除黑名单成功");
				}else{
					result.put("success", false);
					result.put("msg", nAction == 1?"添加黑名单失败":"删除黑名单失败");
				}
				break;
			case 3:	
				List<Element> elements = formatXmlData(returnStr);
				for(int i=0;i<elements.size();i++){
					JSONObject json = new JSONObject();
					json.put("phone", elements.get(i).attributeValue("phone"));
					array.add(json);
				}
				result.put("count", elements.size());
				result.put("data", array);
				result.put("success", true);
				break;
			}
		} catch (Exception e) {
			logger.error("通讯调度==>>获取黑名单异常:"+e.getMessage());
			result.put("success", false);
			result.put("msg", "黑名单操作异常");
		}
		return result;
	}
	
	@Override
	public String lisCall(String curSheetNum, String callingSheetNum) {
		String result = "";
		try {
			 result = iccphone.lisCall(curSheetNum, callingSheetNum);
			 result = commonResult("监听",result);
		} catch (Exception e) {
			logger.error("通讯调度===>>监听发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}
	@Override
	public String intoCall(String curSheetNum, String callingSheetNum) {
		String result = "";
		try {
			 result = iccphone.intoCall(curSheetNum, callingSheetNum);
			 result = commonResult("强插",result);
		} catch (Exception e) {
			logger.error("通讯调度===>>强插发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}
	@Override
	public String callOutQun(String sheetNum, String sendNum, String sphone) {
		String result = "";
		try {
			 result = iccphone.callOutQun(sheetNum, sendNum, sphone,"3223");
			 result = commonResult("群呼",result);
		} catch (Exception e) {
			logger.error("通讯调度===>>群呼发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}
	/**
	 * String 转换为XML并返回数据
	 * @param data
	 * @return
	 */
	private List<Element>  formatXmlData(String data){
		Document doc = null;
		try {
			doc = DocumentHelper.parseText(data);
		} catch (DocumentException e) {
			logger.error("通讯调度==>返回数据转换成XML异常:"+e.getMessage());
		}
		Element root = doc.getRootElement();
		@SuppressWarnings("unchecked")
		List<Element> elements = root.element("ROWDATA").elements("ROW");
		return elements;
	}
	/**
	 * 日期格式化 
	 * @param date
	 * @return
	 */
	private String dateFormat(String date){
		 SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd'T'HH:mm:ssFFF");
		 SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		 try {
			return  format.format(sdf.parse(date));
		 } catch (ParseException e) {
			logger.error("通讯调度==>>日期格式转换异常"+e.getMessage());
			return "";
		 }
	}
	/**
	 * 通用返回数据处理
	 * @param strType 操作类型
	 * @param strResult 返回数据
	 * @return  操作类型+成功/失败
	 */
	private String commonResult(String strType,String strResult){
		return strResult.equals("1")?strType+"成功":strType+"失败";
	}
	@Override
	public String getCalling() {
		if(iccphone == null) return "暂未初始化";
		String result = "";
		try {
			 result = iccphone.doGetALLCalling();
		} catch (Exception e) {
			logger.error("通讯调度===>>查询通话列表发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}
	@Override
	public String CallOutQun_Option(String sheetNum, String sphone, String sOption) {
		String result = "";
		try {
			 result = iccphone.callOutQun_Option(sheetNum, sphone, sOption);
			 result = commonResult(formatOption(sOption,sphone),result);
		} catch (Exception e) {
			logger.error("通讯调度===>>电话会议操作发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}
	/**
	 * 翻译操作类型
	 * @param sOption
	 * @param sphone
	 * @return
	 */
	private String formatOption(String sOption,String sphone){
		String result = "";
		switch(sOption){
		case "1": result = "电话会议-添加新号码 "+sphone+" ";break;
		case "2": result = "电话会议-禁言号码 "+sphone+" ";break;
		case "3": result = "电话会议-取消号码  "+sphone+" 的禁言" ;break;
		case "4": result = "电话会议-挂断号码 "+sphone+" ";break;
		}
		return result;
	}
	
	@Override
	public String clearCalling(String sPhone) {
		String result = "";
		try {
			 result = iccphone.clearCalling(sPhone);
			 result = commonResult("将 "+sPhone+" 从来电列表中清除" ,result);
		} catch (Exception e) {
			logger.error("通讯调度===>>清除来电列表发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;
	}
	@Override
	public JSONObject getALLSheetNo() {
		JSONObject json = new JSONObject();
		
		JSONArray sheetAry = new JSONArray();
		
		try {
			 String sheets = iccphone.doGetALLSheetNo();
			 if(sheets.length()>0){
				 String[] sheetList = sheets.split(",");
				 for(String sheet:sheetList){
					 JSONObject sheetObj = new JSONObject();
					 sheetObj.put("id", sheet);
					 String _status = getSheetStatus(sheet);
					 JSONObject statusJson = JSONObject.parseObject(_status);
					 sheetObj.put("name", sheet + "(" + statusJson.getString("value") + ")");
					 sheetAry.add(sheetObj);
				 }
				 json.put("success", true);
				 json.put("data", sheetAry);
			 }else{
				 json.put("success", false);
				 json.put("msg", "获取坐席列表失败");
			 }
		} catch (Exception e) {
			logger.error("通讯调度===>>获取坐席列表发生异常:"+ e.getMessage());
			 json.put("success", false);
			 json.put("msg","获取坐席列表发生异常:"+e.getMessage());
		}
		return json;
	}
	@Override
	public String changeVoice(String sheetNum, String voice) {
		String result = "";
		try {
			 result = iccphone.changeVoice(sheetNum, voice);
			 result = commonResult("音量调节成功",result);
		} catch (Exception e) {
			logger.error("通讯调度===>>音量调节发生异常:"+ e.getMessage());
			result = e.getMessage();
		}
		return result;	
	}
	@Override
	public String getArea(String sphone) {
		String result = "";
		try {
			 result = iccphone.getAreaForPhone(sphone);
		} catch (Exception e) {
			logger.error("通讯调度===>>获取来电归属地发生异常:"+ e.getMessage());
			result = "归属地获取失败";
		}
		return result;	
	}
}
