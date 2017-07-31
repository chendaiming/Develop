package com.hz.db.extend.imp;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.cache.util.RedisUtil;
import com.hz.db.cache.service.ConstantCodeDtlsCache;
import com.hz.db.cache.service.OrgDeptDtlsCache;
import com.hz.db.cache.service.UserBaseDtlsCache;
import com.hz.db.extend.IConvertExtend;
import com.hz.db.service.impl.ExtendConfigService;
import com.hz.frm.util.Tools;

/**
 * 常量转换扩展服务
 * @author xie.yh
 */
@Service
public class ConstConvertExtendImpl implements IConvertExtend {
	private static final Logger log = LoggerFactory.getLogger(ConstConvertExtendImpl.class);

	@Resource
	private ExtendConfigService extendConfigService;

	@PostConstruct
	public void setExtendService () {
		// 实例化对象时设置扩展服务
		if (extendConfigService != null) {
			extendConfigService.setConvertExtend(this);
			log.info("初始化设置常量转换扩展服务...");
		}
	}

	@Override
	public Object converter(String module, String constKey, String columnKey, Object columnVal) {
		Map<String, Object> where = null;
		Object result = null;

		if (Tools.isEmpty(module)) {
			where = new LinkedHashMap<String, Object>();
			where.put("type_id", constKey);
			where.put("key", columnVal);
			result = RedisUtil.getObject(ConstantCodeDtlsCache.cacheId, where, "value");
		}

		else if (module.equals("user")) {
			result = RedisUtil.getObject(UserBaseDtlsCache.cacheId, columnVal, "ubd_name");
		}

		else if (module.equals("dptt")) {
			result = RedisUtil.getObject(OrgDeptDtlsCache.cacheId, columnVal, "odd_name");
		}

		return result;
	}

	@Override
	public void formatter(Map<String, Object> map) {
		// TODO Auto-generated method stub
	}
}
