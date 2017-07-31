package com.hz.cds.screen.service;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.hz.frm.net.amq.service.MqMessageSendService;
@Service
public class ScreenService {
	private static final Logger logger = LoggerFactory.getLogger(ScreenService.class);
	@Resource MqMessageSendService mMessageSendService;
	/**
	 * 图像切换
	 * @param screenID  大屏编号
	 * @param cameraID  摄像机编号
	 * @param screenArea 切换区域 (输入通道) 
	 */
    public void screenSwitch(String cusNumber,String screenID,String cameraID,String screenArea){
		JSONObject sendJson = new JSONObject();
		sendJson.put("msgType", "SCREEN001");
		sendJson.put("screenID", screenID); //大屏编号
		sendJson.put("cameraID", cameraID); //摄像机地址码 (ipaddr)
		sendJson.put("screenArea", screenArea);//切换区域 (大屏输入通道) 
		mMessageSendService.sendFeMessage(sendJson.toString(), cusNumber);
		logger.debug("大屏图像切换指令发送完成:"+sendJson.toString());
    }
    
    /**
	 * 布局切换
	 * @param screenID 大屏编号
	 * @param layoutID  
	 * @param remark 备注
	 */
    public void LayoutSwitch(String cusNumber,String screenID,String layoutID,String remark){
		JSONObject sendJson = new JSONObject();
		sendJson.put("msgType", "SCREEN010");
		sendJson.put("screenID", screenID); //大屏编号
		sendJson.put("layoutID", layoutID); //布局编号(场景地址码)
		sendJson.put("remark", remark);//
		mMessageSendService.sendFeMessage(sendJson.toString(), cusNumber);
		logger.debug("大屏布局切换指令发送完成:"+sendJson.toString());
    }
    
    /**
	 * 图像放大
	 * @param args
	 */
    public void Screen002(JSONObject args){
		JSONObject sendJson = new JSONObject();
		sendJson.put("msgType", "SCREEN002");
		sendJson.put("screenID", args.getString("screenID")); //大屏编号
		sendJson.put("cameraID", args.getString("cameraID")); //摄像机编号()
		sendJson.put("screenArea", args.getString("screenArea"));//原始区域 [上偏移量，左偏移量，宽度，高度]
		sendJson.put("screenBigArea", args.getString("screenBigArea"));//放大后区域 [上偏移量，左偏移量，宽度，高度]
		mMessageSendService.sendFeMessage(sendJson.toString(), args.getString("cusNumber"));
		logger.debug("图像放大指令发送完成:"+sendJson.toString());
    }
    
    /**
	 * 图像还原
	 * @param args
	 */
    public void Screen003(JSONObject args){
		JSONObject sendJson = new JSONObject();
		sendJson.put("msgType", "SCREEN003");
		sendJson.put("screenID", args.getString("screenID")); //大屏编号
		sendJson.put("cameraID", args.getString("cameraID")); //摄像机编号()
		sendJson.put("screenArea", args.getString("screenArea"));//原始区域 [上偏移量，左偏移量，宽度，高度]
		sendJson.put("screenBigArea", args.getString("screenBigArea"));//放大后区域 [上偏移量，左偏移量，宽度，高度]
		mMessageSendService.sendFeMessage(sendJson.toString(), args.getString("cusNumber"));
		logger.debug("图像还原指令发送完成:"+sendJson.toString());
    }
    /**
     * 公共MQ通信
     * @param cusNumber
     * @param args
     */
    public void ScreenSend(String cusNumber,String msg){
		mMessageSendService.sendFeMessage(msg,cusNumber);
		logger.debug("大屏指令发送完成:"+msg.toString());
    }
}
