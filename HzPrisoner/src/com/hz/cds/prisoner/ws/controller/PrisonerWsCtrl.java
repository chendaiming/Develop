package com.hz.cds.prisoner.ws.controller;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.bean.AjaxMessage;
import com.hz.frm.util.StringUtil;
@Controller
@RequestMapping("PrinsonerWs")
public class PrisonerWsCtrl {
	final Logger logger = LoggerFactory.getLogger(PrisonerWsCtrl.class);
//    @Resource PrisonerWsServiceImpl prisonerWsServiceImpl;
		
	/**
	 * 按日期批量获取罪犯信息(入监日期大于等于该日期)
	 * @return
	 */
	@RequestMapping("prionerInfo")
	@ResponseBody
	public AjaxMessage getPrisonerInfoForDate_pl(@RequestParam() String args){
		logger.debug("传入的参数==>"+args);
		String serchType = "";//查询类型
		int type = 0; //单个0 批量1
		String prisonerId = "";
		String date = "";
		
		if(!StringUtil.isNull(args)){
			//将前台参数转换为json对象
			JSONObject params = JSONObject.parseObject(args);
			serchType = params.getString("serchType");
			// type 0 单条记录,type 1 多条记录 2 其他查询
			type = Integer.parseInt(params.getString("type"));
			if(type == 0){
				prisonerId = params.getString("prisonerId");
			}else if(type == 1){
				date = params.getString("date");
			}
		}
		String  result = null;
		try {
			switch(type){
				case 0:
					//以罪犯编号为条件查询单条记录
//					result = prisonerWsServiceImpl.invoke(serchType, "@bh="+prisonerId);
					break;
				case 1:
					//以入监时间为条件查询多条记录
//					result = prisonerWsServiceImpl.invoke(serchType, "@rq="+date);
					break;
				case 2:
					//查询重点罪犯,离监探亲,离监就医
//					result = prisonerWsServiceImpl.invoke(serchType, "");
					break;
				default:
					logger.info("暂不支持的接口功能");
					break;
			}
			//字符串转化为XML
			Document doc = DocumentHelper.parseText(result);
			//查询类型  jbxx_dg--罪犯基本信息(单个)jbxx_pl(批量)
			//cf_dg 罪犯惩罚信息(单个) cf_pl(批量)
			//jl_dg 罪犯奖励信息(单个) jl_pl(批量)
			//xfbd_dg 罪犯司法奖励信息(单个) xfbd_pl(批量)
			//zdzf 重点罪犯
			//ljjy 离监就医
			//ljtq 离间探亲
			if(serchType.equals("jbxx_dg")||serchType.equals("jbxx_pl")){
//				prisonerWsServiceImpl.getPrinerInfoForXML(doc,1);
			}else if(serchType.equals("cf_dg")||serchType.equals("cf_pl")){
//				prisonerWsServiceImpl.getPrinerInfoForXML(doc,2);
			}else if(serchType.equals("jl_dg")||serchType.equals("jl_pl")){
//				prisonerWsServiceImpl.getPrinerInfoForXML(doc,3);
			}else if(serchType.equals("xfbd_dg")||serchType.equals("xfbd_pl")){
//				prisonerWsServiceImpl.getPrinerInfoForXML(doc,4);
			}else if(serchType.equals("zdzf")||serchType.equals("ljjy")||serchType.equals("ljtq")){
//				String str = prisonerWsServiceImpl.formatXML(doc);
				if(serchType.equals("zdzf")){
					//更新数据库中的罪犯状态为重点罪犯 //1-重点罪犯
//					prisonerWsServiceImpl.updatePrisonerStatus(str,"");
				}
//				return new AjaxMessage(true,str,"");
			}
			return new AjaxMessage(true,"","");
	 	}catch (Exception e) {
	 		e.printStackTrace();
	 		return new AjaxMessage(false,"","");
		}
	}
}



