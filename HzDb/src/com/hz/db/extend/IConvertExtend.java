package com.hz.db.extend;

import java.util.Map;

/**
 * 查询结果集数据处理扩展服务接口（用于常量转换，数据格式化操作）
 * @author xie.yh
 *
 */
public interface IConvertExtend {
	
	/**
	 * 常量转换（如果返回结果为null则去原值）
	 * @param module 	转换模块
	 * @param constKey	常量名
	 * @param columnKey	字段名
	 * @param columnVal	字段值
	 * @return 常量值
	 */
	public Object converter (String module, String constKey, String columnKey, Object columnVal);


	/**
	 * 数据转换（直接修改对象数据内容）
	 * @param map
	 * @return
	 */
	public void formatter (Map<String, Object> map);
}
