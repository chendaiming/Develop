package com.hz.cds.prisoner.ws;

import com.entlogic.jgxt.realtime.webServices.RtInterfaceProxy;

public class PrisonerWebserviceTest {
	/** 测试用main方法*/
	public static void main(String[] args) {
		RtInterfaceProxy proxy = new RtInterfaceProxy();
		try {
//		String result = proxy.invoke("unitop", "unitop", "4416", "ljxx_dg", "@rq=20170301");
//		String num = proxy.invoke("unitop", "unitop", "4416", "tjs", "");//当前在监数量统计
//		String result = proxy.invoke("unitop", "unitop", "4416", "xfbd_pl", "@rq=20010517"); //惩罚 _批量
//		int num = stringNumbers(result,"ljxx_dg"); 
//		System.out.println(result);
//		System.out.println(num);
//		String result = proxy.invoke("unitop", "unitop", "cf_dg", "@bh=4464000395"); //惩罚_单个 
//		String result = proxy.invoke("unitop", "unitop", "jl_pl", "@rq=20160301"); 
//			String result = proxy.invoke("unitop", "unitop", "jl_dg", "@bh=4464002157"); //
//			String result = proxy.invoke("unitop", "unitop", "zdzf", "");//重点罪犯
//			String result = proxy.invoke("unitop", "unitop", "4416","ljjy", "");//离监就医
//		String result = proxy.invoke("unitop", "unitop","af_hd_jbxx_pl", "@rq=20170101");
		String result = proxy.invoke("unitop", "unitop","af_hd_jbxx_dg", "@bh=4409048766");
		
		System.out.println(result);
//		String endPoint = 	proxy.getEndpoint();
//		System.out.println(endPoint);
//		String server = endPoint.substring(0,endPoint.lastIndexOf(":"));
//		System.out.println(server);
		
		
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	

}
