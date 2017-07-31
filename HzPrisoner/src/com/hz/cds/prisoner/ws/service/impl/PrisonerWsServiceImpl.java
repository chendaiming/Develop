package com.hz.cds.prisoner.ws.service.impl;

import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.entlogic.jgxt.realtime.webServices.RtInterfaceProxy;
import com.hz.cds.prisoner.ws.service.AddPrisonerBaseInfo;
import com.hz.db.service.IUpdateService;

/**
 * 罪犯相关信息同步处理类
 * @author Rui_Win8.1
 *
 */
@Service
public class PrisonerWsServiceImpl {
	final Logger logger = LoggerFactory.getLogger(PrisonerWsServiceImpl.class);
	
	@Resource AddPrisonerBaseInfo addPrisonerBaseInfo;  //罪犯基本信息插入
//	@Resource AddJuRewardService addJuRewardService;    //罪犯司法奖励信息插入
//	@Resource AddPoliticsRewardService addPoliticsRewardService; //罪犯奖励信息插入
//	@Resource AddPopunishService addPopunishService; //行政处罚信息插入
	@Resource
	private IUpdateService updateService;
	
	private RtInterfaceProxy  proxy;
	
	/** 罪犯基本信息_批量 **/
	public final String JBXX_PL = "af_hd_jbxx_pl";
	/** 罪犯基本信息_单个 **/
	public final String JBXX_DG = "af_hd_jbxx_dg";
	/** 罪犯惩罚信息_单个 **/
	public final String CFXX_DG = "af_hd_cf_dg";
	/** 罪犯惩罚信息_批量 **/
	public final String CFXX_PL = "af_hd_cf_pl";
	/** 罪犯奖励信息_批量 **/
	public final String JL_PL = "af_hd_jl_pl";
	/** 罪犯奖励信息_单个 **/
	public final String JL_DG = "af_hd_jl_dg";
	/** 罪犯司法奖励信息_单个 **/
	public final String SFJL_DG = "af_hd_xfbd_dg";
	/** 罪犯司法奖励信息_批量**/
	public final String SFJL_PL = "af_hd_xfbd_pl";
	/** 罪犯离监就医信息 **/
	public final String LJJY = "af_hd_ljjy";		
	/** 罪犯离监探亲信息 **/
	public final String LJTQ = "af_hd_ljtq";	
	/** 罪犯离监住院信息_批量 **/
	public final String LJZY_PL = "af_hd_ljzy_pl";
	/** 重点罪犯信息 **/
	public final String ZDZF = "af_hd_zdzf";
	
	@PostConstruct
	private void init(){
		proxy = new RtInterfaceProxy();
	}
	
	/**
	 * 批量更新罪犯相关信息
	 * @param serchType  查询类型       jbxx_dg--罪犯基本信息(单个)jbxx_pl(批量)
	 *							  cf_dg 罪犯惩罚信息(单个) cf_pl(批量)
	 *							  jl_dg 罪犯奖励信息(单个) jl_pl(批量)
	 *		                      xfbd_dg 罪犯司法奖励信息(单个) xfbd_pl(批量)
	 * @param date 此日期以后入监的罪犯相关数据
	 * @return
	 * @throws Exception
	 */
	public void getPrisonerInfo(String serchType,String param) throws Exception{
			
			//从WebService获取数据
			String  result = invoke(serchType,param);
			//字符串转化为XML
			Document doc = DocumentHelper.parseText(result);
			
			switch(serchType){
				case JBXX_PL:
					//基本信息
					getPrinerInfoForXML(doc,1);
					break;
				case CFXX_DG:
				case CFXX_PL:
					//惩罚信息
					getPrinerInfoForXML(doc,2);
					break;
				case JL_PL:
				case JL_DG:
					//奖励信息
					getPrinerInfoForXML(doc,3);
					break;
				case SFJL_DG:
				case SFJL_PL:
					//司法奖励
					getPrinerInfoForXML(doc,4);
					break;
				case "ljxx_dg"://离监释放
					String prisoners = formatXML(doc);
					//更新罪犯在监状态
					updateinPrisonerStatus(prisoners);
					break;
				case LJTQ://离监探亲	
				case LJJY://离监就医
				case ZDZF://重点罪犯
					String prisonerIds = formatXML(doc);
					updatePrisonerStatus(prisonerIds,serchType);
					break;
				case LJZY_PL://离监住院 批量
					break;
			}
	}
	/**
	 * 插入罪犯信息
	 * @param doc
	 * @return
	 */
	public void getPrinerInfoForXML(Document doc,int infoType){
		Element root = doc.getRootElement();
		@SuppressWarnings("unchecked")
		List<Element> childElements = root.elements();
		
		switch(infoType){
		case 1:
			//罪犯基本信息
			addPrisonerBaseInfo.baseInfoProcess(childElements);
			break;
		case 2:
			//罪犯惩罚信息
//			addPopunishService.insertPopunish(childElements);
			break;
		case 3:
			//罪犯奖励信息
//			addPoliticsRewardService.insertPoliticsReward(childElements);
			break;
		case 4:
			//罪犯司法奖励信息
//			addJuRewardService.insertJuReward(childElements);
			break;
		}
	}
	
	/**
	 * 离监探亲,离监就医,重点罪犯接口数据取出,多个罪犯编号的情况,罪犯编号用','分隔返回
	 * @param doc
	 * @param serchType
	 * @return
	 */
	public String formatXML(Document doc) {
		Element root = doc.getRootElement();
		@SuppressWarnings("unchecked")
		List<Element> childElements = root.elements();
		StringBuilder prionerids = new StringBuilder();
		for(Element child:childElements){
			String prisonerid = child.element("x1").getTextTrim();
			//避免添加重复数据
			if(!prionerids.toString().contains(prisonerid)){
				prionerids.append(prisonerid+",");
			}
				
		}
		String result = prionerids.toString();
 		if(result.endsWith(","))
 			result = result.substring(0, result.length()-1);
		return result;
	}
	/**'
	 * 更新离监信息
	 * @param prisoners
	 */
	public void updateinPrisonerStatus(String prisoners){
		List<Object> parasList = new ArrayList<Object>();
	     parasList.add(0);
	     parasList.add(prisoners);
	     logger.info("prisonerId:"+prisoners);
//	     updateService.update("fm_prisoner_master_inPrison_update",parasList);
	}
	
	/**
	 * 重点罪犯标记
	 * @param prisonerId
	 */
	public void updatePrisonerStatus(String prisonerId,String type) {
		
		if(type.equals(ZDZF)){
			logger.debug("更新重点罪犯标记==>>"+prisonerId);
			//更新重点罪犯标记
			List<Object> parasList = new ArrayList<Object>();
			parasList.add(1);
			parasList.add(prisonerId);
//			updateService.update("fm_prisoner_master_status_update", parasList);
			// 其他罪犯更新为非重点罪犯
			List<Object> list = new ArrayList<Object>();
			list.add(0);
			list.add(prisonerId);
//			updateService.update("fm_prisoner_master_status_update_2", list);
		}else if(type.equals(LJTQ)){
			logger.debug("更新离监探亲状态");
			List<Object> parasList = new ArrayList<Object>();
			parasList.add("ljtq");
			parasList.add(prisonerId);
//			updateService.update("fm_prisoner_master_prsnr_stts_update", parasList);
		}else if(type.equals(LJJY)){
			logger.debug("更新离监就医状态");
			List<Object> parasList = new ArrayList<Object>();
			parasList.add("ljjy");
			parasList.add(prisonerId);
//			updateService.update("fm_prisoner_master_prsnr_stts_update", parasList);
		}
		
	}
	
	/**
	 * 通用罪犯改造系统查询 
	 * @param serchType 查询类型
	 * @param param 传入参数
	 * @return
	 */
	public String invoke(String serchType,String param){
		String result = null;
		try {
			result =  proxy.invoke("unitop", "unitop",serchType,param);
		} catch (RemoteException e) {
			logger.error("获取罪犯改造系统数据失败:"+e.getMessage());
		}
		return result;
	}

	/**
	 * 根据罪犯编号获取单个罪犯信息
	 * @param id
	 * @return Element 
	 */
	public Element getPrisonerInfoByid(String id){
		String result = invoke(JBXX_DG, "@bh="+id);
		
		Document doc = null;
		try {
			doc = DocumentHelper.parseText(result);
		} catch (DocumentException e1) {
			logger.error("转换为XML文件异常:"+e1.getMessage());
		}
		
		@SuppressWarnings("unchecked")
		List<Element> childElements = doc.getRootElement().elements();
		Element child = null;
		if(childElements.size()>0){
			child = childElements.get(0);
		}
		
		return child;
	}

//	public void updatePrisonerInfo(){
//		addPrisonerBaseInfo.updatePrisonerInfo(proxy);
//	}
}
