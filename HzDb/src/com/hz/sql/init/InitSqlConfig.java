package com.hz.sql.init;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hz.frm.util.AbstractLoadXml;
import com.hz.frm.util.Tools;
import com.hz.sql.bean.SqlConfigBean;
import com.hz.sql.util.SqlConfigUtil;

/**
 * SQL配置文件初始化类
 * @author xie.yh
 */
@Component
public class InitSqlConfig extends AbstractLoadXml {

	private final static Logger log = LoggerFactory.getLogger(InitSqlConfig.class);
	private List<String> sqlIdList = null;	// 存放SQL编号，用来检测SQL编号是否重复
	private List<String> repeatList = null;	// 记录重复的SQL编号，以便SQL加载完成后打印日志

	/*
	 * 私有化类
	 */
	private InitSqlConfig () {
		this.init();
	}

	/**
	 * 加载SQL配置文件
	 */
	public synchronized boolean init () {
		boolean result = true;

		// 初始化存储对象并加载配置文件
		sqlIdList = new ArrayList<String>();
		repeatList = new ArrayList<String>();
		super.loadXml("sql", "item");


		// 重复的SQL打印输出日志
		if (repeatList.size() > 0) {
			this.printLog(repeatList);
			result = false;
		}

		// 清空并返回结果
		sqlIdList = null;
		repeatList = null;
		return result;
	}


	/**
	 * 获取重复的SQL编号集合
	 */
	public List<String> getRepeatList () {
		return repeatList;
	}


	@Override
	protected void parseXml(String fileName, NodeList nodeList) {
		Element item = null;
		Element ele = null;
		String sqlId = null;
		String sqlDesc = null;
		SqlConfigBean sqlBean = null;

		for (int i = 0, I = nodeList.getLength(); i < I; i++) {
			item = (Element) nodeList.item(i);
			sqlId = item.getAttribute("id");
			sqlDesc = item.getAttribute("desc");
			sqlBean = new SqlConfigBean();

			if (!sqlIdList.contains(sqlId)) {
				sqlIdList.add(sqlId);
				sqlBean.setSqlId(sqlId);
				sqlBean.setSqlDesc(sqlDesc);
				sqlBean.setSqlBody(getNodeValue(item, "sql"));
				sqlBean.setSeq(getNodeValue(item, "seq"));

				sqlBean.setConstMap(getConstItem(item));

				sqlBean.setWhereMap(getNodeItem(item, "where", "id"));
				sqlBean.setOrderMap(getNodeItem(item, "order", "id"));

				// 解析数据过滤节点
				ele = (Element) item.getElementsByTagName("filter").item(0);
				if (ele != null) {
					sqlBean.setFilter(true);
					sqlBean.setFilterId(ele.getAttribute("id"));
					sqlBean.setFilterType(ele.getAttribute("type"));
				}

				SqlConfigUtil.put(sqlBean);
			} else {
				repeatList.add(sqlId);
			}
		}
	}


	/**
	 * 获取子节点的文本值
	 * @param item		父节点对象
	 * @param tagName	子节点名称
	 * @return
	 */
	private String getNodeValue (Element item, String tagName) {
		Node node = item.getElementsByTagName(tagName).item(0);
		String value = null;

		if (node != null) {
			value = node.getFirstChild().getNodeValue();

			if (Tools.notEmpty(value)) {
				value = value.replace("#", "<");
			}
		}
		return value;
	}


	/**
	 * 获取节点数据
	 * @param parent	父节点
	 * @param tagName	子节点名称
	 * @param attrName	子节点的属性名
	 * @return
	 */
	private Map<String, String> getNodeItem (Element parent, String tagName, String attrName) {
		NodeList nodeList = parent.getElementsByTagName(tagName);
		Map<String, String> map = new HashMap<String, String>();

		if (nodeList != null) {
			Element item = null;	// 节点元素
			String attr = null;		// 节点属性
			String text = null;		// 节点文本

			for (int i = 0, I = nodeList.getLength(); i < I; i++) {
				item = (Element) nodeList.item(i);
				attr = item.getAttribute(attrName);
				text = item.getFirstChild().getNodeValue();
				text = text.replace("#", "<");

				map.put(attr, text);
			}
		}
		return map;
	}


	/**
	 * 获取节点数据
	 * @param parent	父节点
	 * @param tagName	子节点名称
	 * @return
	 */
	private Map<String, Map<String, String>> getConstItem (Element parent) {
		NodeList nodeList = parent.getElementsByTagName("const");
		Map<String, Map<String, String>> mapMap = new HashMap<String, Map<String, String>>();
		Map<String, String> map = null;

		if (nodeList != null) {
			Element item = null;	// 节点元素
			String key = null;		// 节点属性
			String value = null;	// 节点文本
			String module = null;
			Node node = null;

			for (int i = 0, I = nodeList.getLength(); i < I; i++) {
				item = (Element) nodeList.item(i);
				key = item.getAttribute("key");
				module = item.getAttribute("module");
				node = item.getFirstChild();
				value = node != null ? node.getNodeValue() : "";

				map = new HashMap<String, String>();
				map.put("module", Tools.isEmpty(module) ? "" : module);
				map.put("value", value);
				mapMap.put(key, map);
			}
		}
		return mapMap;
	}
	

	private void printLog (final List<String> list) {
		Thread tt = new Thread(new Runnable(){

			@Override
			public void run() {
				try {
					Thread.sleep(5000l);
					// 重复的SQL打印输出日志
					if (list.size() > 0) {
						for (String str : list) {
							log.warn("SQL编号[" + str + "]已重复!");
						}
					}
				} catch (InterruptedException e) {
					log.error("初始化SQL日志打印错误：", e);
				}
			}
		});

		tt.setPriority(Thread.NORM_PRIORITY);
		tt.start();
	}
}
