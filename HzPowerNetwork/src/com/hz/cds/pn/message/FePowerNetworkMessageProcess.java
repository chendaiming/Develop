package com.hz.cds.pn.message;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.pn.bean.PowerNetworkBean;
import com.hz.db.service.IQueryService;
import com.hz.fe.bean.FeMessageHeader;
import com.hz.fe.service.FeMessageProcessAbstract;
import com.hz.frm.net.amq.service.MqMessageSendService;
import com.hz.frm.net.netty.bean.WebSocketMsgToWeb;

/**
 * 高压电网消息的处理类
 * 
 * @author chendm
 *
 * @date 2016年11月14日
 */
@Service
@Transactional
public class FePowerNetworkMessageProcess extends FeMessageProcessAbstract<FePowerNetworkMessageBean> {
	private static final Logger logger = LoggerFactory.getLogger(FePowerNetworkMessageProcess.class);
	
	public static String redisKey = "power_network_record";
	
	@Resource
	private MqMessageSendService mqMessageSendService;
	
	@Resource
	private IQueryService queryService;

	@Override
	public Class<FePowerNetworkMessageBean> getBodyClass() {
		// TODO Auto-generated method stub
		return FePowerNetworkMessageBean.class;
	}

	@Override
	protected void process(FeMessageHeader feMessageHeader, FePowerNetworkMessageBean msgBody) {
		
		String cacheKey = redisKey+"_"+feMessageHeader.getCusNumber()+"_"+msgBody.getPowerNetworkIdnty();
		
		//拼装前端折线图使用的数据
		PowerNetworkBean bean = convertPowerNetworkData(feMessageHeader, msgBody);
		
		//==================== 高压电网电压数据 =================
		Object voltageJson = RedisUtil.getOpsObject(cacheKey+"_voltage");
		if(voltageJson != null){
			LinkedList<String[]> redisLinkedList = JSON.parseObject(String.valueOf(voltageJson),LinkedList.class);
			String[] data = new String[2];
			data[0] = bean.getTime();
			data[1] = bean.getVoltage();
			redisLinkedList.addLast(data);
			if(redisLinkedList.size() > 100){
				redisLinkedList.removeFirst();
			}
			voltageJson = JSON.toJSONString(redisLinkedList);
			RedisUtil.putOpsObject(cacheKey+"_voltage", voltageJson);
		}else{
			//首次调用执行
			LinkedList<String[]> linkedList = new LinkedList<>();
			String[] data = new String[2];
			data[0] = bean.getTime();
			data[1] = bean.getVoltage();
			linkedList.addFirst(data);
			RedisUtil.putOpsObject(cacheKey+"_voltage", JSON.toJSONString(linkedList));
		}
		
		
		//==================== 高压电网电流数据 =================
		Object flowJson = RedisUtil.getOpsObject(cacheKey+"_flow");
		if(flowJson != null){
			LinkedList<String[]> redisLinkedList = JSON.parseObject(String.valueOf(flowJson),LinkedList.class);
			String[] data = new String[2];
			data[0] = bean.getTime();
			data[1] = bean.getFlow();
			redisLinkedList.addLast(data);
			if(redisLinkedList.size() > 100){
				redisLinkedList.removeFirst();
			}
			flowJson = JSON.toJSONString(redisLinkedList);
			RedisUtil.putOpsObject(cacheKey+"_flow", flowJson);
		}else{
			//首次调用执行
			LinkedList<String[]> linkedList = new LinkedList<>();
			String[] data = new String[2];
			data[0] = bean.getTime();
			data[1] = bean.getFlow();
			linkedList.addFirst(data);
			RedisUtil.putOpsObject(cacheKey+"_flow", JSON.toJSONString(linkedList));
		}
				
		
		Map<String,Object> map = new HashMap<>();
		//存放已经换成的100条数据
		map.put("voltageCacheList", voltageJson);
		map.put("flowCacheList", flowJson);
		//推送信息
		map.put("echartsData", bean);
		
		try {
			logger.debug("高压电网缓存数据：{}",map);
			//向前端发送消息
			mqMessageSendService.sendInternalWebMessage(JSON.toJSONString(map), feMessageHeader.getCusNumber(),feMessageHeader.getMsgType());
		} catch (Exception e) {
			logger.error("高压电网消息处理失败， msgbody="+map,e);
		}	
	}
	
	/**
	 * 转换高压电网数据
	 * @param data 前置机推送数据
	 * @param feMessageHeader 消息头
	 * @return PowerNetworkBean
	 */
	private PowerNetworkBean convertPowerNetworkData(FeMessageHeader header,FePowerNetworkMessageBean data){
		LocalDateTime date = LocalDateTime.now();
		PowerNetworkBean bean = new PowerNetworkBean();
		bean.setCusNumber(header.getCusNumber());
		bean.setId(data.getPowerNetworkIdnty());
		bean.setVoltage(data.getPowerSourceVoltage());
		bean.setFlow(data.getPowerSourcePowerFlow());
		bean.setIp(data.getIp());
		bean.setDate(date.toLocalDate().toString());
		bean.setTime(date.format(DateTimeFormatter.ofPattern("HH:mm:ss")));
		
		//查询数据库  转换最高最低电压电流数据
		String queryData = "{sqlId: 'select_pn_device_tree_byid',params: ["+header.getCusNumber()+","+data.getPowerNetworkIdnty()+"]}";
		try {
			Object resultObj = queryService.queryMap(JSON.parseObject(queryData));
			JSONObject jData = (JSONObject) JSON.toJSON(resultObj);
			bean.setMaxVlotage(jData.getString("pnb_max_voltage"));
			bean.setMinVlotage(jData.getString("pnb_min_voltage"));
			bean.setMaxFlow(jData.getString("pnb_max_flow"));
			bean.setMinFlow(jData.getString("pnb_min_flow"));
			logger.debug("[高压电网] 根据id查询数据 = {}",jData);
		} catch (Exception e) {
			logger.error("[高压电网] 根据ID查询数据失败:{}",e.getMessage());
		}
		
		return bean;
	}
}
