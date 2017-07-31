package com.hz.frm.initdata;

import java.util.ArrayList;
import java.util.List;
/**
 * 初始化数据service配置类
 * @author zhongxy
 *
 */
public class InitDataServiceConfig {
    private static List<String> serviceList=new ArrayList<String>();
    private static InitDataServiceConfig instant=null;
    private InitDataServiceConfig(){
    };
    
    public static InitDataServiceConfig getInstant(){
    	if(instant==null){
    		instant=new InitDataServiceConfig();
    	}
    	return instant;
    }
    public synchronized static List<String> getInitDataService(){
    	return serviceList;
    }
    
}
