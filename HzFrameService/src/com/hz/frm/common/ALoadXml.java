package com.hz.frm.common;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.hz.frm.util.Tools;

/**
 * 加载XML配置的抽象类
 * @author xie.yh
 *
 */
public abstract class ALoadXml {
	private static Logger log = LoggerFactory.getLogger(ALoadXml.class);
	private DocumentBuilderFactory factory;
	private DocumentBuilder builder;
	private Document document;

	/**
	 * 加载XML配置文件
	 * @param path 		相对路径（目录）
	 * @param xmlName 	文件名, 加载时指定加载的文件, 没有指定则加载相对路径下所有的xml
	 * @param tagName 	读取的节点
	 */
	public synchronized void loadXml(String path, String xmlName, String tagName){
		try {
			factory = DocumentBuilderFactory.newInstance();
			builder = factory.newDocumentBuilder();
			loadingXml(path, tagName, xmlName);
		} catch (MalformedURLException e) {
			log.error("加载XML配置文件路径异常：", e);
		} catch (ParserConfigurationException e) {
			log.error("解析配置文件异常：", e);
		} catch (UnsupportedEncodingException e) {
			log.error("编码转换异常：不支持的编码类型", e);
		} catch (Exception e) {
			log.error("加载XML配置文件异常: ", e);
		} finally {
			document = null;
			builder = null;
			factory = null;
		}
	}


	/**
	 * 加载XML配置文件
	 * @param path		相对路径（目录）
	 * @param tagName	读取的节点
	 * @param xmlName	加载指定的文件, 没有指定则加载相对路径下所有的xml
	 * @throws Exception
	 */
	private void loadingXml(String path, String tagName, String xmlName) throws Exception{
		// 加载文件的相对路径
		String[] filesName = null;
		String filePath = null;
		String suffix = "";
		File directory = null;
		File file = null;

		filePath = new URL(this.getClass().getResource("/") + path).getPath();
		filePath = URLDecoder.decode(filePath, "utf-8");
		directory = new File(filePath);
		filesName = directory.list();
		log.info("加载文件路径：" + filePath);

		for (String fileName : filesName) {
			file = new File(filePath + "\\" + fileName);

			// 判断是文件还是文件夹
			if (file.isFile()) {
				suffix = fileName.substring(fileName.lastIndexOf(".") + 1);

				// 只读取XML配置文件
				if ("xml".equals(suffix.toLowerCase())) {

					// 如果指定了读取的文件名称则只读取该文件
					if (Tools.notEmpty(xmlName)) {
						if (xmlName.equals(fileName)){
							readXml(file, tagName);
							return;
						}
					} else {
						readXml(file, tagName);
					}
				}
			} else if (file.isDirectory()) {
				loadingXml(path + "/" + fileName, tagName, xmlName);
			}
		}
	}

	/**
	 * 读取配置文件
	 * @param file		文件路径
	 * @param tagName	加载的节点名称
	 */
	private void readXml (File file, String tagName) {
		String fileName = null;
		try {
			// 读取配置文件
			fileName = file.getName();
			document = builder.parse(file);
			log.info("加载" + fileName + "配置文件...");

			// 解析配置文件
			parseXml(fileName, document.getElementsByTagName(tagName));

		} catch (SAXException e) {
			log.error("解析生成DOM对象异常：", e);
		} catch (IOException e) {
			log.error("配置文件读写异常：", e);
		}
	}

	/**
	 * 具体解析XML规则
	 * @param fileName 文件名称
	 * @param nodeList 读取的节点集合
	 */
	protected abstract void parseXml (String fileName, NodeList nodeList);
}
