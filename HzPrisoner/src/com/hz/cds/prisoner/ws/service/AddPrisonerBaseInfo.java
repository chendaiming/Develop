package com.hz.cds.prisoner.ws.service;

import java.util.List;

import javax.annotation.Resource;

import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.prisoner.ws.service.impl.PrisonerWsServiceImpl;
import com.hz.cds.prisoner.ws.util.PrisonerWsConfigUtil;
import com.hz.cds.prisoner.ws.util.PrisonerWsUtil;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IUpdateService;
import com.hz.db.util.RespParams;
import com.hz.frm.util.StringUtil;
/**
 * 罪犯基本信息插入
 * @author Rui_Win8.1
 *
 */
@Service
public class AddPrisonerBaseInfo {
	final Logger logger = LoggerFactory.getLogger(AddPrisonerBaseInfo.class);
	
	@Resource
	private IUpdateService updateService;
	@Resource PrisonerWsServiceImpl prisonerWsServiceImpl;
	@Resource PrisonerWsUtil prisonerWsUtil; 
	
	String cusNumber = PrisonerWsConfigUtil.get("CUS_NUMBER");   //机构编号
	
	int totalNum = 0; //数据总条数
	int addNum = 0; // 新增罪犯数	
	int updateNum = 0; //更新成功罪犯数
	int notInNum = 0; //刑满释放罪犯数
	int errorNum = 0; //处理异常数
	
	/**
	 * 插入罪犯信息
	 * @param child
	 */
	public void baseInfoProcess(List<Element> childElements){
		
		prisonerWsUtil.queryPrisonerList(cusNumber);
		prisonerWsUtil.getPrisnerDrpt(cusNumber);
		
		totalNum = childElements.size();
		addNum = 0; // 新增罪犯数	
		updateNum = 0; //更新成功罪犯数
		notInNum = 0; //刑满释放罪犯数
		errorNum = 0; //处理异常数
		
		for (Element child : childElements) {
			String prisonerId = prisonerWsUtil.getValue(child, "PBD_PRSNR_IDNTY");//罪犯编号
			
			/*
			 * 1.已释放的罪犯,不做处理
			 * 2.已在监的罪犯,更新处理
			 * 3.新入监的罪犯,添加处理
			 */
			if(prisonerWsUtil.notInPrisonList.contains(prisonerId)){
				continue;
			}
			
			Element prisoner_child = prisonerWsServiceImpl.getPrisonerInfoByid(prisonerId);
			
			if(prisonerWsUtil.inPrisonList.contains(prisonerId)){
				updatePrisonerBaseInfo(formatData(prisoner_child));
			}else{
				insertPrisonerBaseInfo(formatData(prisoner_child));
			}
		}
		
		logger.debug("罪犯基本信息同步完成。数据总条数:"+totalNum+
				     ",新增罪犯数:"+addNum+
				     ",更新成功罪犯数:"+updateNum+
				     ",刑满释放罪犯数:"+notInNum+
				     ",处理异常数:"+errorNum);
	}
	
	
	/**
	 * 新增罪犯信息
	 * @param child
	 */
	public void insertPrisonerBaseInfo(JSONObject data) {

		String prisonerId = data.getString("pbd_other_id");
		String name = data.getString("pbd_prsnr_name");
		
		//插入数据库
		JSONArray jsonary = new JSONArray();
		jsonary.add(data);
		JSONObject  jsonobj = new JSONObject();
		jsonobj.put("sqlId", "insert_prisoner_info_ws");
		jsonobj.put("params", jsonary);
		
		UpdateResp resp = null;
		try {
			resp = updateService.updateByParamKey(jsonobj);
		} catch (Exception e) {
			logger.error("新增犯人信息时出现异常：" + e.getMessage() + "犯人编号:" + prisonerId +",姓名:"+name);
			errorNum++;
			return;
		}
		JSONArray jsonArr = null;
		JSONObject jsonObj = null;
		String recordId = "";
		if(resp.getSuccess())  {
			logger.debug("新增罪犯信息成功!罪犯姓名:" + name);
			prisonerWsUtil.inPrisonList.add(prisonerId);
			
			jsonArr = (JSONArray) resp.getData();
			jsonObj = jsonArr.getJSONObject(0);
			recordId = jsonObj.getJSONArray(RespParams.SEQ_LIST).getString(0);
			//插入罪犯照片信息
			insertPrisonerIMG(recordId,data);
			
			addNum ++;
		}else{
			
		}
		
	}
	
	private void insertPrisonerIMG(String recordId, JSONObject data) {
		
		
	}


	/**
	 * 更新已在监罪犯信息
	 * @param child
	 */
	public void updatePrisonerBaseInfo(JSONObject data){
		
		String name = data.getString("pbd_prsnr_name");
		
		//更新数据库
		JSONArray jsonary = new JSONArray();
		jsonary.add(data);
		JSONObject  jsonobj = new JSONObject();
		jsonobj.put("sqlId", "update_prisoner_info_ws");
		jsonobj.put("params", jsonary);
		
		UpdateResp resp = null;
		try {
			resp = updateService.updateByParamKey(jsonobj);
		} catch (Exception e) {
			logger.error("更新罪犯信息异常!未找到该罪犯,姓名:" + name);
			errorNum++;
		}
		
		if(resp.getSuccess())  {
			String prisonerId = data.getString("pbd_other_id");
			String status = data.getString("pbd_stts_indc");
			if(status.equals("0") && prisonerWsUtil.inPrisonList.contains(prisonerId)){
				//罪犯离监,加入不在监罪犯List中,下次不更新
				prisonerWsUtil.notInPrisonList.add(prisonerId);
				//罪犯离监,从在监罪犯List中移除
				prisonerWsUtil.inPrisonList.remove(prisonerId);
				logger.debug(name+"刑满释放");
				notInNum++;
			}
			updateNum ++;
		}	
	}
	
	
	/**
	 * 格式化数据
	 * @param child
	 * @return
	 */
	private JSONObject formatData(Element child){
		
		JSONObject prisoner = new JSONObject();
		
		prisoner.put("pbd_cus_number", cusNumber);
		prisoner.put("id", "");
		prisoner.put("pbd_other_id", prisonerWsUtil.getValue(child,"PBD_PRSNR_IDNTY"));
		prisoner.put("pbd_prsnr_name", prisonerWsUtil.getValue(child,"PBD_PRSNR_NAME"));//罪犯姓名
		
		String areaId   = prisonerWsUtil.getValue(child,"PBD_PRSN_AREA_IDNTY");
		String areaName = prisonerWsUtil.getValue(child,"PBD_PRSN_AREA");
		
		//1.从部门集合中找出匹配的部门编号
		//2.未找到对应的编号且部门编号不为空的情况下,自动新增一个监区并返回监区编号
		if(prisonerWsUtil.drptMap.containsKey(areaName)){
			areaId = prisonerWsUtil.drptMap.get(areaName);
		}else if (!StringUtil.isNull(areaId)){
			areaId = createArea(areaName);
		}
		
		prisoner.put("pbd_prsn_area_id",areaId);
		prisoner.put("pbd_prsn_area",areaName);//监区名称
//		prisoner.put("pbd_crtfcts_type",child.element("PBD_CRTFCTS_TYPE").getTextTrim());  //证件类型
		prisoner.put("pbd_crtfcts_type",1);  //证件类型
		prisoner.put("pbd_crtfcts_id",child.element("PBD_CRTFCTS_IDNTY").getTextTrim());	 //证件号码
		prisoner.put("pbd_sex_indc",child.element("PBD_SEX_INDC").getTextTrim().equals("男")?2:1);//性别
		prisoner.put("pbd_birth_date",child.element("PBD_BIRTH_DATE").getTextTrim());  //出生日期
		prisoner.put("pbd_cltre_level",child.element("PBD_CLTRE_LEVEL").getTextTrim());  //文化程度
		prisoner.put("pbd_mrrge_stts",child.element("PBD_MRRGE_STTS").getTextTrim());  //婚姻
		prisoner.put("pbd_arrst_cmpny",child.element("PBD_ARRST_CMPNY").getTextTrim());  //单位
		prisoner.put("pbd_nation",child.element("PBD_NATION").getTextTrim());    //民族
		prisoner.put("pbd_native_addrs",child.element("PBD_NATIVE_ADDRS").getTextTrim());     //籍贯
		prisoner.put("pbd_home_addrs",child.element("PBD_HOME_ADDRS").getTextTrim()); //家庭住址
		prisoner.put("pbd_detain_type",child.element("PBD_DETAIN_TYPE").getTextTrim());   //收押类别
		prisoner.put("pbd_charge_type",child.element("PBD_CHARGE_TYPE").getTextTrim());   //分押类别
		prisoner.put("pbd_sprt_mnge",child.element("PBD_SPRT_MNGE").getTextTrim());   //分管等级
		prisoner.put("pbd_accstn",child.element("PBD_ACCSTN").getTextTrim());     //罪名
//		prisoner.put("pbd_left_img_dir",child.element("PBD_LEFT_IMG_DIR").getTextTrim());// 左侧照片路径
//		prisoner.put("pbd_right_img_dir",child.element("PBD_RIGHT_IMG_DIR").getTextTrim());// 右侧照片路径
//		prisoner.put("pbd_front_img_dir",child.element("PBD_FRONT_IMG_DIR").getTextTrim());// 正面照片路径
//		prisoner.put("pbd_door_card_idnty",child.element("PBD_DOOR_CARD_IDNTY").getTextTrim());//
//		prisoner.put("pbd_bed_id",child.element("PBD_BED_ID").getTextTrim());//床位编号
//		prisoner.put("pbd_floor_id",child.element("PBD_FLOOR_ID").getTextTrim());//
//		prisoner.put("pbd_dorm_id",child.element("PBD_DORM_ID").getTextTrim());//
		prisoner.put("pbd_sntn_type",child.element("PBD_SNTN_TYP").getTextTrim());     //刑种
		prisoner.put("pbd_sntn_term",child.element("PBD_EXCTN_TERM").getTextTrim());     //判决刑期
		prisoner.put("pbd_sntn_start_date",child.element("PBD_SNTN_START_DATE").getTextTrim());   //判决刑期起日
		prisoner.put("pbd_sntn_end_date",child.element("PBD_SNTN_END_DATE").getTextTrim());   //判决刑期止日
		prisoner.put("pbd_entry_prisoner_date",child.element("PBD_ENTRY_PRISONER_DATE").getTextTrim());   //入监日期
		prisoner.put("pbd_serious_prsnr",child.element("PBD_SERIOUS_PRSNR").getTextTrim());
		prisoner.put("pbd_type_indc",child.element("PBD_TYPE_INDC").getTextTrim().equals("")?0:1);  //重点案犯
		prisoner.put("pbd_sntn_dprvtn_term",child.element("PBD_SNTN_DPRVTN_TERM").getTextTrim()); //剥夺政治权力 
		prisoner.put("pbd_stts_indc", prisonerWsUtil.getValue(child,"PBD_STTS_INDC").equals("在押")?"1":"0");
		prisoner.put("pbd_prsnr_stts",child.element("PBD_PRSNR_STTS_INDC").getTextTrim());  //罪犯状态2
		prisoner.put("pbd_grp_name",child.element("PBD_GRP_NAME").getTextTrim());//
		prisoner.put("pbd_grp_leader_indc",child.element("PBD_GRP_LEADER_INDC").getTextTrim());//
		prisoner.put("pbd_remark","");
		prisoner.put("userId",0);
		
		return prisoner;
	}
	
	/**
	 * 自动添加监区(防止出现因罪犯改造系统监区为非数字数据时同步出错)
	 * @param areaName
	 * @return
	 */
	private String createArea(String areaName){
		
		String areaId = "";
		
		JSONObject org = new JSONObject();
		
		org.put("id", "");
		org.put("name", areaName);
		org.put("pid", cusNumber);
		org.put("groupid", "239");//监区分组标识
		org.put("use",1); 
		org.put("remark", "同步罪犯数据时自动添加");
		org.put("auth", 0);//本辖区
		org.put("odd_crte_user_id", 0);
		
		//更新数据库
		JSONArray jsonary = new JSONArray();
		jsonary.add(org);
		JSONObject  jsonobj = new JSONObject();
		jsonobj.put("sqlId", "insert_org_org");
		jsonobj.put("params", jsonary);
		
		UpdateResp resp = null;
		try {
			resp = updateService.updateByParamKey(jsonobj);
		} catch (Exception e) {
			logger.error("自动添加监区信息异常:",e);
		}
		
		JSONArray jsonArr = null;
		JSONObject jsonObj = null;
		
		if(resp.getSuccess())  {
			logger.debug("自动添加监区信息成功!监区名称:" + areaName);
			
			jsonArr = (JSONArray) resp.getData();
			jsonObj = jsonArr.getJSONObject(0);
			areaId = jsonObj.getJSONArray(RespParams.SEQ_LIST).getString(0);
			
			//重新初始化部门列表
			prisonerWsUtil.getPrisnerDrpt(cusNumber);
			
		}	
		
		return areaId;
	}
}
