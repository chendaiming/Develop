package com.hz.db.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.fastjson.JSONObject;
import com.hz.db.extend.IConvertExtend;
import com.hz.db.util.DvcPermisson;
import com.hz.sql.bean.SqlConfigBean;
import com.hz.sql.util.SqlConfigUtil;

public abstract class QueryAbstractService {

	// 日志记录对象
	private static final Logger log = LoggerFactory.getLogger(QueryAbstractService.class);

	@Autowired
	protected ExtendConfigService extendService;


	/**
	 * 常量转换
	 * @param reqJSON	请求参数
	 * @param listMap	查询的结果集
	 * @throws Exception
	 */
	public void convert(JSONObject reqJSON, List<Map<String, Object>> listMap) throws Exception {
		IConvertExtend convertExtend = extendService.getConvertExtend();
		SqlConfigBean configBean = null;		// SQL配置信息
//		Map<String, String> constMap = null;	// 常量转换配置
		Map<String, Map<String, String>> constMap = null;	// 常量转换配置

		String columnKey = null;				// 表字段名
		Object columnVal = null;				// 表字段值
		
		Map<String, String> columnMap = null;	

		String constModule = null;
		String constKey = null;					// 常量名
		Object constVal = null;					// 常量值

		// 检查扩展接口
		if (convertExtend != null) {
			if (listMap != null) {

				Set<String> keySet = null;
				String[] keys = null;
				Object rowVal = null;

				// 通过SQLID获取到SQL配置
				configBean = SqlConfigUtil.getConfig(reqJSON);

				if (configBean != null) {
					constMap = configBean.getConstMap();
//					constMap = configBean.getModuleMap();
				}
				if(configBean.getFilterId()!=null&&configBean.getFilterType()!=null){
					listMap=DvcPermisson.getPermissionData(listMap,configBean);
				}
				// 轮循数据列表
				for (Map<String,Object> rowMap : listMap) {

					// 字段统一转换小写BEGIN				
					keySet = rowMap.keySet();
					
					keys = new String[keySet.size()];
					rowVal = null;

					for(String key : keySet.toArray(keys)) {
						rowVal = rowMap.get(key);
						rowMap.put(key.toLowerCase(), rowVal == null ? "" : rowVal);
					}
					// 字段统一转换小写END

					// 常量转换 BEGIN
					if (constMap != null) {
						for(Entry<String, Map<String, String>> entry : constMap.entrySet()) {
							columnKey = entry.getKey().toLowerCase();
							columnMap = entry.getValue();
							constModule = columnMap.get("module");
							constKey = columnMap.get("value");

							if (rowMap.containsKey(columnKey)) {
								columnVal = rowMap.get(columnKey);

								// 通过常量转换服务来转换字段值（如果服务存在）
								if (columnVal != null) {
									constVal = convertExtend.converter(constModule, constKey, columnKey, columnVal);
									rowMap.put(columnKey, constVal == null ? columnVal : constVal);
								}
							}
						}
					}

//					if (constMap != null) {
//						for(Entry<String,String> entry : constMap.entrySet()) {
//							columnKey = entry.getKey().toLowerCase();
//							constKey = entry.getValue();
//
//							if (rowMap.containsKey(columnKey)) {
//								columnVal = rowMap.get(columnKey);
//
//								// 通过常量转换服务来转换字段值（如果服务存在）
//								if (columnVal != null) {
//									constVal = convertExtend.converter(constKey, columnKey, columnVal);
//									rowMap.put(columnKey, constVal == null ? columnVal : constVal);
//								}
//							}
//						}
//					}
					// 常量转换 END

					// 数据格式化
					convertExtend.formatter(rowMap);
				}
			}
		} else {
			log.warn("查询结果集数据处理扩展服务接口<IConvertExtend>未实现，无法进行常量转换、数据格式化等操作...");
		}
	}
}
