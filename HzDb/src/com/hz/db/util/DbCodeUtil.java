package com.hz.db.util;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.hz.db.bean.DbCodeBean;
import com.hz.frm.util.AbstractLoadXml;
import com.hz.frm.util.Tools;

@Component
public class DbCodeUtil extends AbstractLoadXml{
	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(DbCodeUtil.class);


	private static final Map<String, Map<String, String>> localMap = new LinkedHashMap<String, Map<String, String>>();
	private static final Map<String, String> thirdMap = new LinkedHashMap<String, String>();
	private static final String MODULE_DEFAULT = "default";

	public static final String CODE_0000 = "0000";
	public static final String CODE_0001 = "0001";
	public static final String CODE_0002 = "0002";
	public static final String CODE_0003 = "0003";
	public static final String CODE_0004 = "0004";
	public static final String CODE_0005 = "0005";
	public static final String CODE_0006 = "0006";

	public static final String CODE_1001 = "1001";
	public static final String CODE_1002 = "1002";
	public static final String CODE_1003 = "1003";


	/**
	 * 加载SQL配置文件
	 */
	@PostConstruct
	private void init () {
		// 初始化存储对象并加载配置文件
		super.loadXml("code", "module");
		log.info("初始化DB响应码配置文件...OK!");
	}

	@Override
	protected void parseXml(String fileName, NodeList nodeList) {
		Map<String, String> map = null;
		String moduleId = null;
		Element moduleItem = null;

		NodeList codeNodes = null;
		Element codeItem = null;

		for (int i = 0, I = nodeList.getLength(); i < I; i++) {
			moduleItem = (Element) nodeList.item(i);
			moduleId = moduleItem.getAttribute("id");

			if (localMap.containsKey(moduleId)) {
				map = localMap.get(moduleId);
			} else {
				map = new LinkedHashMap<String, String>();
				localMap.put(moduleId, map);
			}

			// 错误码
			codeNodes = moduleItem.getElementsByTagName("local");
			for (int x = 0, X = codeNodes.getLength(); x < X; x++) {
				codeItem = (Element) codeNodes.item(x);
				map.put(codeItem.getAttribute("code"), codeItem.getAttribute("desc"));
			}

			codeNodes = moduleItem.getElementsByTagName("third");
			for (int x = 0, X = codeNodes.getLength(); x < X; x++) {
				codeItem = (Element) codeNodes.item(x);
				thirdMap.put(codeItem.getAttribute("indexof"), codeItem.getAttribute("code"));
			}
		}
	}



	/**
	 * 获取系统默认编码描述
	 * @param code
	 * @return
	 */
	public static String getDesc (String code) {
		return getDesc(code, null);
	}

	/**
	 * 获取系统默认编码描述
	 * @param code
	 * @return
	 */
	public static String getDesc (String code, String defDesc) {
		return fmtDesc(getMap(MODULE_DEFAULT).get(code), defDesc);
	}


	/**
	 * 获取系统业务编码描述
	 * @param module 	业务模块
	 * @param code		响应编码
	 * @return
	 */
	public static String getDesc (String module, String code, String defDesc) {
		String desc = null;

		// 根据业务模块获取业务转码，如果转码失败再获取默认转码
		desc = getMap(module).get(code);
		desc = Tools.isEmpty(desc) ? getDesc(code, defDesc) : desc;

		return desc;
	}




	/**
	 * 转换异常错误
	 * @param ex
	 * @return
	 */
	public static DbCodeBean formatEx (Exception ex, String module) {
		DbCodeBean dbCodeBean = new DbCodeBean();
		String code = null;
		String desc = null;

		// 捕获内部自定义错误
		if (ex instanceof DbException) {
			code = ((DbException)ex).getErrCode();
			desc = ((DbException)ex).getErrMsg();
		} else {
			desc = ex.getMessage();
			// 数据库错误码转换
			if (Tools.notEmpty(desc)) {
				for(String key : thirdMap.keySet()) {
					if (desc.indexOf(key) > -1) {
						code = thirdMap.get(key); break;
					}
				}
			}

			// 如果转码失败则默认返回通用错误码并返回错误附加信息
			if (Tools.isEmpty(code)) {
				dbCodeBean.setPlus(desc);
				code = CODE_0001;
			}

			// 转码
			desc = getDesc(module, code, desc);
		}

		dbCodeBean.setModule(module);
		dbCodeBean.setCode(code);
		dbCodeBean.setDesc(desc);
		return dbCodeBean;
	}


	/**
	 * 转换异常错误
	 * @param ex
	 * @return
	 */
	public static DbCodeBean formatEx (Exception ex) {
		return formatEx(ex, null);
	}


	/**
	 * 抛出异常
	 * @param code
	 * @param msg
	 * @throws Exception
	 */
	public static void throwEx(String code, String msg, Object...args) throws Exception {
		throwEx(code, fillVal(msg, args));
	}


	/**
	 * 抛出异常
	 * @param code
	 * @param msg
	 * @throws Exception
	 */
	public static void throwEx(String code, String msg) throws Exception{
		throw new DbException(code, msg);
	}


	/**
	 * 抛出异常
	 * @param code
	 * @throws Exception
	 */
	public static void throwEx(String code) throws Exception{
		throw new DbException(code);
	}


	/**
	 * 抛出异常消息
	 * @param msg
	 * @throws Exception
	 */
	public static void throwExMsg(String msg) throws Exception{
		throwEx(CODE_0001, msg);
	}


	/**
	 * 抛出异常消息
	 * <br>例子：throwExMsg("异常消息：{}-{}", "测试", "1001")
	 * <br>结果：异常消息：测试-1001
	 * 
	 * @param msg 字符串中{}表示参数
	 * @param objects 字符串对应的参数，会一个一个替换msg中的{}
	 * @throws Exception
	 */
	public static void throwExMsg(String msg, Object... args) throws Exception {
		throwEx(CODE_0001, fillVal(msg, args));
	}






	/* ============================================= 私有方法定义 ============================================ */
	/**
	 * 填充参数
	 * @param msg
	 * @param args
	 * @return
	 */
	private static String fillVal (String msg, Object[] args) {
		if (args != null && args.length > 0) {
			for(Object obj : args) {
				msg = msg.replaceFirst("\\{\\}", Tools.toStr(obj));
			}
		}
		return msg;
	}


	/**
	 * 获取转码映射对象（更加业务模块获取，没有则返回默认）
	 * @param module
	 * @return
	 */
	private static Map<String, String> getMap(String module) {
		Map<String, String> map = localMap.get(module);
		return map == null ? localMap.get(MODULE_DEFAULT) : map;
	}


	/**
	 * 格式化编码描述
	 * @param desc
	 * @return
	 */
	private static String fmtDesc (String desc, String defDesc) {
		if (Tools.isEmpty(defDesc)) defDesc = "未知的错误描述!";
		if (Tools.isEmpty(desc)) desc = defDesc;
		return desc;
	}
}
