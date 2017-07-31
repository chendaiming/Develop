package com.hz.ws;

import org.apache.cxf.annotations.WSDLDocumentation;

@javax.jws.WebService
public interface HzWebService {
	/**
	 * webService入口
	 * @param method 方法(模块)
	 * @param param  传入的参数
	 * @return	
	 */
	@WSDLDocumentation(value = "传入参数:method(执行类型),cusNumber(机构编号)\r\n" 
							 + "已实现接口alertor:报警器,camera:摄像机,dvr:硬盘录像机,broadcast:数字广播;\r\n", 
			placement = WSDLDocumentation.Placement.BINDING_OPERATION_INPUT)
	public String queryByCusnumber(String method,String cusNumber);
}
