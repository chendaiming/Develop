package com.hz.frm.util;

import java.lang.reflect.Method;
/*import com.hz.cis.bean.CdsPoliceBaseDtls;
import com.hz.cis.bean.DvcDeviceMaster;*/

public class ReflectUtil {

	/**
	 * 根据方法名称取得反射方法的参数类型(没有考虑同名重载方法使用时注意)
	 * @param obj         类实例  
	 * @param methodName  方法名
	 * @return
	 * @throws ClassNotFoundException
	 */
	public static Class<?>[]  getMethodParamTypes(Object classInstance, String methodName) throws ClassNotFoundException{
		Class<?>[] paramTypes = null;
		Class<?>[] params = null;
		Method[]  methods = classInstance.getClass().getMethods();//全部方法

		for (int  i = 0;  i< methods.length; i++) {
			if (methodName.equals(methods[i].getName())) {//和传入方法名匹配 
				params = methods[i].getParameterTypes();
	         /* paramTypes = new Class[ params.length] ;
	           for (int j = 0; j < params.length; j++) {
	            	if("int".equals(params[j].getName())){
	            		paramTypes[j] = int.class;
	            	}else{
	            		paramTypes[j] = Class.forName(params[j].getName());
	            	}
	            }*/
				return params;
	            //break;
	        }
	    }

		return paramTypes;
	}
	
}
