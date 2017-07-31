package com.hz.db.extend.imp;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.db.extend.IParamsExtend;
import com.hz.db.service.impl.ExtendConfigService;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.ReqParams;
import com.hz.db.util.RespParams;
import com.hz.frm.util.Tools;
import com.hz.frm.utils.SequenceUtil;
import com.hz.sql.bean.SqlConfigBean;
import com.hz.sql.util.SqlConfigUtil;


/**
 * 序列号扩展服务
 * @author xie.yh
 */
@Service
public class SequenceExtendImpl implements IParamsExtend {
	private static final Logger log = LoggerFactory.getLogger(SequenceExtendImpl.class);
//	private static final String SEQ_PARAMS = "seqParams";	// 序列号参数
//	private static final String SEQ_LIST = "seqList";	// 序列号参数

	@Resource
	private SequenceUtil sequenceUtil;

	@Resource
	private ExtendConfigService extendConfigService;

	@PostConstruct
	public void setExtendService () {
		// 实例化对象时设置扩展服务
		if (extendConfigService != null) {
			extendConfigService.setParamsExtend(this);
			log.info("初始化设置序列号扩展处理服务...");
		}
	}

	@Override
	public void fmtParamMap(JSONObject reqJSON, JSONObject respJSON) throws Exception {
		String sqlId = reqJSON.getString(ReqParams.SQL_ID);
		SqlConfigBean sqlConfigBean = SqlConfigUtil.getConfig(sqlId);

		if (sqlConfigBean != null) {
			String seqParams = sqlConfigBean.getSeq();
			String tableName = null;	// 表名
			String fieldName = null;	// 字段名
			String columnName = null;	// 列名
			Object seqNum = null;

			JSONArray paramMapList = reqJSON.getJSONArray(ReqParams.PARAMS);
			JSONArray seqList = new JSONArray();
			JSONObject paramMap = null;

			if (Tools.notEmpty(seqParams)) {
				String[] args = seqParams.split("@");
				if (args != null && args.length > 1) {
					tableName = args[0];
					fieldName = columnName = args[1];

					if (args.length > 2) {
						fieldName = args[2];
					}

					for(int i = 0; i < paramMapList.size(); i++) {
						seqNum = getSequence(tableName, fieldName);
						paramMap = paramMapList.getJSONObject(i);
						paramMap.put(columnName, seqNum);
						seqList.add(seqNum);
					}

					respJSON.put(RespParams.SEQ_LIST, seqList);
				} else {
					DbCodeUtil.throwExMsg("SQL配置文件的seq配置格式错误，无法解析");
				}
			}
		} else {
			DbCodeUtil.throwExMsg("无效的SQL配置：sqlid=" + sqlId);
		}
	}


	@Override
	public void fmtParamList(JSONObject reqJSON, JSONObject respJSON) throws Exception {
		JSONArray paramsList = reqJSON.getJSONArray(ReqParams.PARAMS);		// 数据库参数
		JSONArray seqArray = reqJSON.getJSONArray(ReqParams.SEQ_PARAMS);	// 序列号参数
		JSONArray seqList = new JSONArray();								// 格式化结果集（存放获取的序列号）
		int index = 0;														// 序列号所在集合中的索引

		JSONArray params = null;
		Object seqNum = null;

		if (seqArray != null && paramsList != null) {
			if (seqArray.size() > 2) {
				index = seqArray.getInteger(0);

				for(int i = 0, I = paramsList.size(); i < I; i++) {
					params = paramsList.getJSONArray(i);
					seqNum = getSequence(seqArray.getString(1), seqArray.getString(2));// 获取序列号
					seqList.add(seqNum);

					if (seqNum != null) {
						// 整合序列号
						if (params.getString(index).equals("?")) {
							params.remove(index);
							params.add(index, seqNum);
						} else {
							DbCodeUtil.throwEx(DbCodeUtil.CODE_0005, "参数格式错误：参数集合中指定索引<{}>位置的参数不是通配符<?>", index);
						}
					} else {
						DbCodeUtil.throwEx(DbCodeUtil.CODE_0006);
					}
				}
				respJSON.put(RespParams.SEQ_LIST, seqList);
			} else {
				DbCodeUtil.throwEx(DbCodeUtil.CODE_0003, "序列号参数数量不匹配");
			}
		}
	}



	/**
	 * 获取序列号
	 * @param seqArray 序列参数组
	 * @return
	 * @throws Exception
	 */
	private synchronized String getSequence (String tableName, String columnName) throws Exception {
		return sequenceUtil.getSequence(tableName, columnName);
	}
}
