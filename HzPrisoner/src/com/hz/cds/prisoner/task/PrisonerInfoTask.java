package com.hz.cds.prisoner.task;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hz.cds.prisoner.ws.service.impl.PrisonerWsServiceImpl;
import com.hz.cds.prisoner.ws.util.PrisonerWsConfigUtil;
import com.hz.cds.prisoner.ws.util.PrisonerWsUtil;
import com.hz.db.service.IQueryService;
import com.hz.frm.quartz.IScheduledTask;
import com.hz.frm.util.StringUtil;

public class PrisonerInfoTask implements IScheduledTask {
	private static final Logger logger = LoggerFactory.getLogger(PrisonerInfoTask.class);
	@Resource
	PrisonerWsServiceImpl prisonerWsServiceImpl;
	@Resource
	PrisonerWsUtil prisonerWsUtil; 
	@Resource
	IQueryService queryService;
	
	private String cusNumber = PrisonerWsConfigUtil.get("CUS_NUMBER");

	@Override
	public void startRun() {
		try {
			logger.debug("开始同步罪犯基本信息...");
			// 同步罪犯基本信息
			prisonerWsServiceImpl.getPrisonerInfo(prisonerWsServiceImpl.JBXX_PL, "@rq=20060801");
			logger.debug("==================罪犯基本信息同步完成==================");
			
//			// 同步罪犯司法奖励信息
//			logger.debug("开始同步罪犯司法奖励信息...");
//			String juRewardTime = getMaxUpdateTime("cds_prisoner_judicial_reward_maxUpdateTime_query_huadu");
//			logger.info("犯人司法奖励表最大更新时间 +1：" + juRewardTime);
//			prisonerWsServiceImpl.getPrisonerInfo(prisonerWsServiceImpl.SFJL_PL, "@rq="+juRewardTime);
//			logger.debug("==================罪犯司法奖励信息同步完成==================");
//
//			// 同步罪犯奖励信息
//			logger.debug("开始同步罪犯奖励信息...");
//			String politicsRewardTime = getMaxUpdateTime("cds_prisoner_politics_reward_maxUpdateTime_query_huadu");
//			logger.info("犯人行政奖励表最大更新时间：" + politicsRewardTime);
//			prisonerWsServiceImpl.getPrisonerInfo(prisonerWsServiceImpl.JL_PL, "@rq="+politicsRewardTime);
//			logger.debug("==================罪犯奖励信息同步完成==================");
//
//			// 同步罪犯惩罚信息
//			logger.debug("开始同步罪犯惩罚信息...");
//			String popunishTime = getMaxUpdateTime("cds_prisoner_politics_punish_maxUpdateTime_query_huadu");
//			logger.info("犯人行政处罚表最大更新时间：" + popunishTime);
//			prisonerWsServiceImpl.getPrisonerInfo(prisonerWsServiceImpl.CFXX_PL,"@rq="+popunishTime);
//			logger.debug("==================罪犯惩罚信息同步完成==================");
//			
//			//同步重点罪犯信息
//			logger.debug("开始同步重点罪犯信息...");
//			prisonerWsServiceImpl.getPrisonerInfo(prisonerWsServiceImpl.ZDZF, "");
//			logger.debug("==================重点罪犯信息同步完成==================");
//			
//			//同步离监就医
//			logger.debug("开始同步离监就医信息...");
//			prisonerWsServiceImpl.getPrisonerInfo(prisonerWsServiceImpl.LJJY, "");
//			logger.debug("==================罪犯离监就医信息同步完成==================");
//			
//			//同步离监就医
//			logger.debug("开始同步离监探亲信息...");
//			prisonerWsServiceImpl.getPrisonerInfo(prisonerWsServiceImpl.LJTQ, "");
//			logger.debug("==================罪犯离监探亲信息同步完成==================");
			
		} catch (Exception e) {
			logger.error("同步罪犯信息发生异常：", e);
		}
	}

	/*
	 * 查询最大更新时间
	 */
	public String getMaxUpdateTime(String sqlId) {

		String maxUpdateTime = null;
		List<Object> parasList = new ArrayList<Object>();
		parasList.add(cusNumber);
//		maxUpdateTime = queryService.queryValue(sqlId, parasList);

		return !StringUtil.isNull(maxUpdateTime)?maxUpdateTime:"20170101";
	}

}
