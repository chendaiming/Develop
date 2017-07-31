package com.hz.db.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.db.service.impl.QueryServiceImpl;
import com.hz.frm.util.ApplicationContextUtil;
import com.hz.sql.bean.SqlConfigBean;

public class DvcPermisson {
	
	private static  ApplicationContextUtil app=ApplicationContextUtil.getInstance();
	
	public static List<Map<String, Object>> getPermissionData(List<Map<String,Object>> dvcList,SqlConfigBean configBean) throws Exception{
		
		QueryServiceImpl dbquery=(QueryServiceImpl)app.getBean("queryServiceImpl");
		
		List<Map<String, Object>> authList=RedisUtil.getMapList("permisson_data",new HashMap<String,Object>());
		
		if(authList.size()<1){
			authList=dbquery.query(JSONObject.parseObject("{params:[],sqlId:'select_dvc_auth_all'}"));
		}
		
		//每条记录的主键
		String key=configBean.getFilterId().toUpperCase();
		
		//常量表里维护
		String type=configBean.getFilterType();
		//过滤后的链表
		List<Map<String,Object>> linkList=new LinkedList<Map<String,Object>>();

		Iterator<Map<String,Object>>  it=dvcList.iterator();
		
		while(it.hasNext()){
			
			Map<String,Object> m=it.next();
			
			for(Map<String,Object> au:authList){
					
				if(type.equals("2")&&type.equals(au.get("type").toString())&&m.get(key)!=null&&m.get(key).equals(au.get("id"))){
					linkList.add(m);
					break;
				}else if(type.equals(au.get("type").toString())&&m.get(key)!=null&&m.get(key).equals(au.get("id"))){
					it.remove();
					break;
				}
			}
		}
		if(linkList.size()==0){
			return dvcList;
		}else{
			return linkList;
		}
	}
	
	
	public static Map<String,Object> getPermissionData(String key,String type,Map<String,Object> m,List<Map<String, Object>> authList){
		
		for(Map<String,Object> au:authList){
			if(m.get(type)!=null&&au.get(type)!=null){
				if(m.get(type).toString().equals(au.get(type).toString())&&m.get(key)!=null&&m.get(key).equals(au.get(key))){
					return m;
				}
			}
		}
		return null;
		
	}
}
