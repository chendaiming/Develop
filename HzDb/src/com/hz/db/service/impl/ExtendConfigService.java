package com.hz.db.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.hz.db.extend.IConvertExtend;
import com.hz.db.extend.IParamsExtend;

/**
 * 扩展服务的配置服务类
 * @author xie.yh
 */
@Component
public class ExtendConfigService {
	// 日志记录对象
	private static final Logger log = LoggerFactory.getLogger(ExtendConfigService.class);

	private IConvertExtend convertExtend;		// 查询结果集数据处理扩展服务对象（用于常量转换，数据格式化操作）
	private IParamsExtend paramsExtend;			// 数据库参数扩展服务对象（用于获取数据库操作的参数）


	public IConvertExtend getConvertExtend() {
		if (convertExtend == null)
			log.warn("未实现查询结果集数据处理扩展服务接口<IConvertExtend>，无法进行<常量转换>，<数据格式化>等操作");
		return convertExtend;
	}

	public void setConvertExtend(IConvertExtend convertExtend) {
		this.convertExtend = convertExtend;
	}

	public IParamsExtend getParamsExtend() {
		if (paramsExtend == null)
			log.warn("未实现数据库参数扩展服务接口<IParamsExtend>，无法对数据库执行参数进行处理");
		return paramsExtend;
	}

	public void setParamsExtend(IParamsExtend paramsExtend) {
		this.paramsExtend = paramsExtend;
	}
}
