package com.hz.frm.util;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
/**
 * 类说明:常用工具类
 *
 */
public class Tools {
	private static Logger log = LoggerFactory.getLogger(Tools.class);
	/**
	 * 时间格式化对象到秒
	 */
	private final static FastDateFormat SDF_time = FastDateFormat.getInstance("HH:mm:ss");
	/**
	 * 日期格式化对象到毫秒
	 */
	private final static FastDateFormat SDF_millisecond = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss.SSS");
	/**
	 * 日期格式化对象到毫秒-无间隔
	 */
	private final static FastDateFormat SDF_millisecond2 = FastDateFormat.getInstance("yyyyMMddHHmmssSSS");
	/**
	 * 日期格式化对象到日
	 */
	private final static FastDateFormat SDF_date = FastDateFormat.getInstance("yyyy-MM-dd");
	/**
	 * 日期格式化对象到8位无符号日期
	 */
	private final static FastDateFormat SDF_date8 = FastDateFormat.getInstance("yyyyMMdd");
	
	/**
	 * 功能描述:将格式为yyyy-MM-dd的日期字符串转换成yyyy-MM-dd 00:00:00.000的格式
	 * @param date String 格式为yyyy-MM-dd
	 * @return String timestamp 格式为yyyy-MM-dd 00:00:00.000
	 * @throws ParseException
	 */
	public static String formatToTimestamp(String date) throws ParseException{
		return SDF_millisecond.format(java.sql.Date.valueOf(date));
	}
	/**
	 * 功能描述:将格式为yyyy-MM-dd HH:mm:ss.SSS的时间字符串转换成yyyy-MM-dd的格式
	 * @param timestamp String 格式为yyyy-MM-dd HH:mm:ss.SSS
	 * @return String date 格式为yyyy-MM-dd
	 * @throws ParseException
	 */
	public static String formatToDate(String timestamp) throws ParseException{
		return SDF_date.format(Timestamp.valueOf(timestamp).getTime());
	}
	/**
	 * 功能描述：将格式为yyyy-MM-dd的日期格式化成yyyyMMdd的格式
	 * @param date 格式 yyyy-MM-dd
	 * @return String date 格式yyyyMMdd
	 * @throws ParseException
	 */
	public static String formatToDate8(String date) throws ParseException{
		return SDF_date8.format(java.sql.Date.valueOf(date));
	}
	/**
	 * 功能描述：返回系统的当前时间,格式 HH:mm:ss
	 * @return String
	 */
	public static String getCurrentTime(){
		java.util.Date today=new Date();
		today.setTime(System.currentTimeMillis());
		return SDF_time.format(today);
	}
	/**
	 * 功能描述：返回系统的当前时间,格式yyyy-MM-dd HH:mm:ss.SSS
	 * @return String
	 */
	public static String getCurrentTimestamp(){
		java.util.Date today=new Date();
		today.setTime(System.currentTimeMillis());
		return SDF_millisecond.format(today);
	}
	
	/**
	 * 功能描述：返回系统的当前时间,格式yyyyMMddHHmmssSSS
	 * @return String
	 */
	public static String getCurrentTimestamp2(){
		java.util.Date today=new Date();
		today.setTime(System.currentTimeMillis());
		return SDF_millisecond2.format(today);
	}
	
	/**
	 * 功能描述：返回系统的当前日期,格式yyyy-MM-dd
	 * @return
	 */
	public static String getCurrentDate(){
		java.util.Date today=new Date();
		return SDF_date.format(today);
	}
	/**
	 * 功能描述：将格式为yyyy-MM-dd HH:mm:ss.SSS的时间字符串还原成long时间数字
	 * @param timestamp 
	 * @return long
	 * @throws ParseException
	 */
	public static long timestampToLong(String timestamp) throws ParseException{
		return Timestamp.valueOf(timestamp).getTime();
	}
	/**
	 * 功能描述：对两个格式为yyyy-MM-dd HH:mm:ss.SSS的时间字符串转换成long时间数字后相减，以求之间的间隔，单位为毫秒
	 * @param timestamp1
	 * @param timestamp2
	 * @return long 间隔毫秒数,除1000后为秒,负数表示timestamp1<timestamp2,0表示timestamp1=timestamp2,正数表示timestamp1>timestamp2
	 * @throws ParseException
	 */
	public static long timestampBetween(String timestamp1,String timestamp2)throws ParseException{
		long t1=Timestamp.valueOf(timestamp1).getTime();
		long t2=Timestamp.valueOf(timestamp2).getTime();
		return t1-t2;
	}
	/**
	 * 功能描述：求两日期之间的天数,日期格式为yyyy-MM-dd
	 * @param date1 String 日期字符串
	 * @param date2 String 日期字符串
	 * @return int 负数表示date1<date2,0表示date1=date2,正数表示date1>date2
	 * @throws ParseException
	 */
	public static int daysBetween(String date1,String date2) throws Exception{
		if(date1.equals(date2))return 0 ;
		int d1=Integer.parseInt(StringUtils.replaceChars(date1, "-", ""));
		int d2=Integer.parseInt(StringUtils.replaceChars(date2, "-", ""));
		return d1-d2 ; 
	}
	/**
	 * 功能描述：向页面返回通过Ajax访问后台的处理结果，包括正常回执和错误回执
	 * @param statusCode 200处理正常 300处理错误
	 * @param message 要返回的数据 任意文字串或JSONObject.toString()
	 * @param navTabId 可null
	 * @param rel  可null
	 * @param callbackType 可null
	 * @param forwardUrl 可null
	 * @param response 返回对象
	 * @throws IOException 从response获取out或者out输出时会存在IO错误，需要外部调用方法自行捕捉，但一旦出错前台就无法获取数据，只能得到Ajax的301超时错误，然后重新登录
	 */
	public static void sendToPage(int statusCode, String message, String navTabId,String rel,String callbackType,String forwardUrl,HttpServletResponse response) throws IOException {
		JSONObject jo = new JSONObject();
		jo.put("statusCode", statusCode);
		jo.put("message", message);
		jo.put("navTabId", (navTabId==null?"":navTabId));
		jo.put("rel", (rel==null?"":rel));
		jo.put("callbackType", (callbackType==null?"":callbackType));
		jo.put("forwardUrl", (forwardUrl==null?"":forwardUrl));
		response.setContentType("text/json;charset=GBK");
		PrintWriter out = response.getWriter();
		out.println(jo.toString());
		out.flush();
		out.close();
	}
	/**
	 * 功能描述：获得下一日 日期格式yyyy-MM-dd
	 * @param SDate String 日期字符串
	 * @return 下一日 Date
	 * @throws ParseException
	 */
	public static String getTomorrow(String SDate) throws ParseException{
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        Date nextDate=sdf.parse(SDate);
        Calendar c=Calendar.getInstance();
        c.setTime(nextDate);
        int day=c.get(Calendar.DATE);
        c.set(Calendar.DATE, day+1);
        return sdf.format(c.getTime());
	}
	
	/**
	 * 功能描述：获得指定天数后的日期 日期格式yyyy-MM-dd
	 * @param SDate String 日期字符串
	 * @return 下一日 Date
	 * @throws ParseException
	 */
	public static String getDate(String SDate,int dayCount) throws ParseException{
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        Date nextDate=sdf.parse(SDate);
        Calendar c=Calendar.getInstance();
        c.setTime(nextDate);
        int day=c.get(Calendar.DATE);
        c.set(Calendar.DATE, day+dayCount);
        return sdf.format(c.getTime());
	}
	/**
	 * 功能描述：获得上一日 日期格式yyyy-MM-dd
	 * @param SDate String 日期字符串
	 * @return 上一日 Date
	 * @throws ParseException
	 */
	public static String getYestDay(String SDate) throws ParseException{
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        Date nextDate=sdf.parse(SDate);
        Calendar c=Calendar.getInstance();
        c.setTime(nextDate);
        int day=c.get(Calendar.DATE);
        c.set(Calendar.DATE, day-1);
        return sdf.format(c.getTime());
	}
	
	/**
	 * 功能描述：判断字符串是否为数字
	 * @param String Str 字符串
	 * @return boolean
	 * @throws ParseException
	 */
	public static boolean isNumberic(String str){
		Pattern pattern=Pattern.compile("[0-9]*");
		return pattern.matcher(str).matches();
	}
	
	/**
	 * 每月天数,第1个元素不用，2月份另算
	 */
	private final static int[] monthDays=new int[]{0,31,-1,31,30,31,30,31,31,30,31,30,31};
	private final static Pattern pDate8=Pattern.compile("20\\d{2}\\d{2}\\d{2}");
	/**
	 * 功能描述：判断yyyymmdd格式的日期是否合法
	 * @param ymd 格式yyyymmdd的日期
	 * @return boolean  true合法false非法
	 */
	public static boolean dateCheck(String ymd){
		Matcher matcher=pDate8.matcher(ymd);
		if(matcher.matches()){
			int y=Integer.parseInt(ymd.substring(0,4));
			int m=Integer.parseInt(ymd.substring(4,6));
			int d=Integer.parseInt(ymd.substring(6,8));
			if(m<1||m>12)return false ;
			int ds=0;
			if(m==2){
				if((y%4==0 && y%100!=0)||y%400==0) ds=29;
				else ds=28;
			}else{
				ds=monthDays[m];
			}
			if(d<1||d>ds)return false ;
		}else
			return false ;
		return true ;
	}
	/**
	 * 功能描述：将格式yyyymmdd的日期转换成yyyy-mm-dd日期格式
	 * @param date8 格式yyyymmdd的日期
	 * @return String 格式yyyy-mm-dd的日期
	 */
	public static String formatToDate10(String date8){
		return date8.substring(0,4)+"-"+date8.substring(4,6)+"-"+date8.substring(6,8);
	}
	
	private static final Pattern pNum8=Pattern.compile("\\d{8}");
	private static final Pattern pNum10=Pattern.compile("\\d{10}");
	private static final Pattern pNum15=Pattern.compile("\\d{15}");
	private static final Pattern pNum17=Pattern.compile("\\d{17}");
	/**
	 * 功能描述：判断是否符合长度的全数字串
	 * @param num 数字串
	 * @param len 长度 8 10 15 17
	 * @return boolean 
	 */
	public static boolean numberCheck(String num,int len){
		Matcher matcher;
		switch (len) {
		case 8:
			matcher=pNum8.matcher(num);
			break;
		case 10:
			matcher=pNum10.matcher(num);
			break;
		case 15:
			matcher=pNum15.matcher(num);
			break;
		case 17:
			matcher=pNum17.matcher(num);
			break;
		default:
			return false ;
		}
		if(matcher.matches())return true ;
		return false ;
	}
	/**
	 * 功能描述：判断浮点数的整数位长度
	 * @param String 数字串
	 * @return int 整数长度 
	 */
	public static int isInteger(String decimals){
		if(decimals.indexOf(".")==-1)return decimals.length();
		String Integer=decimals.substring(0,decimals.indexOf("."));
		return Integer.length();
	}
	/**
	 * 功能描述：判断浮点数的小叔位长度
	 * @param String 数字串
	 * @return int 小数长度 
	 */
	public static int isDecimals(String decimals){
		if(decimals.indexOf(".")==-1)return 0;
		String decimal=decimals.substring(decimals.indexOf(".")+1,decimals.length());
		return decimal.length();
	}

	/**
	 * int类型转换
	 * @param val 转换值
	 * @param def 默认值
	 * @return
	 */
	public static Integer toInt(Object val, int def){
		Integer ret = toInt( val );
		return ret == null ? def : ret;
	}

	/**
	 * int类型转换
	 * @param val 转换值
	 * @return
	 */

	public static Integer toInt(Object val){
		try{
			return val == null ? null : Integer.valueOf( val.toString() );
		} catch(Exception ex){
			log.error("转换Int类型失败，参数：" + val, ex);
			return null;
		}
	}

	/**
	 * String类型转换

	 * @param val 转换值
	 * @return
	 */

	public static String toStr(Object val){
		try {
			return val == null ? null : String.valueOf( val );
		} catch (Exception e) {
			log.error("转换String类型失败，参数：" + val, e);
			return null;
		}
	}

	/**
	 * String类型转换
	 * @param val 转换值
	 * @param def 默认值
	 * @return
	 */
	public static String toStr(Object val, String def){
		String str = toStr( val );
		return str == null ? def : str;
	}
	
	/**
	 * 抛出异常消息
	 * @param msg 消息
	 */
	public static void exception(String msg) throws Exception {
		throw new Exception(msg);
	}
	
	/**
	 * 是否为null或""
	 * @param arg
	 * @return
	 */
	public static boolean isEmpty(String arg){
		return arg == null || arg.isEmpty();
	}
	
	/**
	 * 是否不为null或""
	 * @param arg
	 * @return
	 */
	public static boolean notEmpty(String arg){
		return !isEmpty(arg);
	}
	/**
	 * base64转byte[]并写入本地文件
	 * @param imgStr base64字符串
	 * @param fileType 图片类型 如:报警图片:alarm
	 * @return
	 */
	public static String writeImgByBase64Str(String imgStr,String fileType){
		String httpUrl = (String)ConfigUtil.get("HTTP_URL");//HTTP
		String httpDir = (String)ConfigUtil.get("HTTP_DIR"); //HTTP服务文件目录
		String fileDir = "";//分类文件目录
		String fileName = fileType + getCurrentTimestamp2() + ".jpg"; //文件名
		String fullName = ""; //完整文件路径
		String resultUrl = ""; //写入成功后返回的路径
		switch(fileType){
			case "alarm"://报警图片
				fileDir = (String)ConfigUtil.get("HTTP_ALARM_IMG_DIR");
				break;
		}
		fullName = httpDir + fileDir + fileName ;
		resultUrl = httpUrl + fileDir + fileName; 
		InputStream in = null;
		FileOutputStream os = null;	
		//不为空
		if(!StringUtil.isNull(imgStr)){
			try {
				in  = new ByteArrayInputStream(StringUtil.getByteForStr(imgStr));
				isDir(httpDir + fileDir);
				os  = new FileOutputStream(fullName);
				byte[] buf = new byte[1024*1024]; //定义一个1M的缓冲区
				int size = 0;
				while((size=in.read(buf)) != -1){
					os.write(buf,0,size);
				}
				os.flush();
				return resultUrl;
			} catch (Exception e) {
				return "";
			}finally{
				try {
					if(os!=null) os.close();
					if(in!=null) in.close();
				} catch (IOException e) {
					return "";
				}
			}
		}else{
			return "";
		}
	}
	
	/**
	 * 判断目录是否存在,不存在自动创建
	 * @param dir
	 */
	private static void isDir(String dir){
		File file = new File(dir);
		if(!file.exists())file.mkdirs();
	}
}
