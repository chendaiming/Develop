package com.hz.cds.pn.bean;

/**
 * 高压电网bean
 *
 * @author chendm
 *
 * @date 2016年11月17日
 */
public class PowerNetworkBean {
	//机构号
	private String cusNumber;
	//电网id
	private String id;
	//电网ip
	private String ip;
	//电网名称
	private String name;
	//电网电压
	private String voltage;
	//最大电压
	private String maxVlotage;
	//最小电压
	private String minVlotage;
	//电网电流
	private String flow;
	//最大电流
	private String maxFlow;
	//最小电流
	private String minFlow;
	//日期
	private String date;
	//时间
	private String time;
	
	
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCusNumber() {
		return cusNumber;
	}
	public void setCusNumber(String cusNumber) {
		this.cusNumber = cusNumber;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getVoltage() {
		return voltage;
	}
	public void setVoltage(String voltage) {
		this.voltage = voltage;
	}
	public String getMaxVlotage() {
		return maxVlotage;
	}
	public void setMaxVlotage(String maxVlotage) {
		this.maxVlotage = maxVlotage;
	}
	public String getMinVlotage() {
		return minVlotage;
	}
	public void setMinVlotage(String minVlotage) {
		this.minVlotage = minVlotage;
	}
	public String getFlow() {
		return flow;
	}
	public void setFlow(String flow) {
		this.flow = flow;
	}
	public String getMaxFlow() {
		return maxFlow;
	}
	public void setMaxFlow(String maxFlow) {
		this.maxFlow = maxFlow;
	}
	public String getMinFlow() {
		return minFlow;
	}
	public void setMinFlow(String minFlow) {
		this.minFlow = minFlow;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	
	
	
}
