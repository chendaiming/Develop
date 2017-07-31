package com.hz.cds.prisoner.ws.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.dom4j.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hz.db.service.IQueryService;

@Service
public class PrisonerWsUtil {
	
	final Logger logger = LoggerFactory.getLogger(PrisonerWsUtil.class);
	@Resource
	private IQueryService queryService;
	/**用于存放已释放罪犯编号信息的List,已释放的罪犯信息不需要更新  */
	public List<String> notInPrisonList = null;
	/**用于存放在监罪犯编号信息的map,对已在监的罪犯信息进行更新  */
	public List<String> inPrisonList = null;
	/**用于存放部门信息的MAP**/
	public HashMap<String,String>  drptMap = null;
	
	/**
	 * 获取数据库中所有罪犯的编号及在监状态,对其分类(放入对应的List中)
	 * @param cusNumber
	 */
	public void queryPrisonerList(String cusNumber){
		notInPrisonList = new ArrayList<String>();
		inPrisonList = new ArrayList<String>();
		List<Map<String,Object>> rtnList=new ArrayList<Map<String,Object>>();
		List<Object> parasList=new ArrayList<Object>();
		parasList.add(cusNumber);
		try {
			rtnList= queryService.query("select_prisoner_no_list","0",parasList);
			//遍历查询结果
			for(Map<String,Object> row:rtnList){
				String prisonerId = row.get("pbd_other_id").toString();
				String status = row.get("pbd_stts_indc").toString();
				if(status.equals("0")){
					//离监(已释放)罪犯
					notInPrisonList.add(prisonerId);
				}else{
					inPrisonList.add(prisonerId);
				}
			}
			logger.info("初始化已释放和在监罪犯编号集合...完成");
		} catch (Exception e) {
			logger.error("初始化已释放和在监罪犯编号集合...异常",e);
		}
	}
	
	/**
	 * 根据key返回对应的值
	 * @param child
	 * @param key
	 * @return
	 */
	public String getValue(Element child,String key){
		return child.element(key).getTextTrim();
	}
	
	/**
	 * 初始化部门信息(应对罪犯改造系统与本系统部门编号不一致的情况)
	 * @param cusNumber
	 */
	public  void getPrisnerDrpt(String cusNumber){
		drptMap = new HashMap<String,String>();
		List<Map<String,Object>> rtnList=new ArrayList<Map<String,Object>>();
		List<Object> parasList=new ArrayList<Object>();
		parasList.add(cusNumber);
		
		try {
			rtnList = queryService.query("select_dept_info_ws","0",parasList);
			//遍历查询结果
			for(Map<String,Object> row:rtnList){
				String dprtmntid = row.get("odd_id").toString();
				String drptmntName = row.get("odd_name").toString();
				drptMap.put(drptmntName, dprtmntid);
			}
			logger.info("初始化部门信息...完成");
		} catch (Exception e) {
			logger.error("初始化部门信息...异常",e);
		}
	}
}
