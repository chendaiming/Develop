package com.hz.cds.pn.message;

/**
 * 高压电网消息实体类
 * 
 * @author chendm
 *
 * @date 2016年11月14日
 */
public class FePowerNetworkMessageBean {
	// 机构号
	private String 	cusNumber;	
	//ip
	private String ip;
	
	//A箱电压
	private String aBoxVoltage;
	
	//B箱电压
	private String bBoxVoltage;
	
	//A箱电流
	private String aBoxPowerFlow;
	
	//B箱电流
	private String bBoxPowerFlow;
	
	//电网编号
	private String powerNetworkIdnty;
	
	//电网名称
	private String powerNetworkName;
	
	//电源电压
	private String powerSourceVoltage;
	
	//电源电流
	private String powerSourcePowerFlow;
	
	//电网状态
	private String status;
	
	//更新时间
	private String updateTime;
	
	
	public String getCusNumber() {
		return cusNumber;
	}

	public void setCusNumber(String cusNumber) {
		this.cusNumber = cusNumber;
	}


	public String getPowerNetworkIdnty() {
		return powerNetworkIdnty;
	}

	public void setPowerNetworkIdnty(String powerNetworkIdnty) {
		this.powerNetworkIdnty = powerNetworkIdnty;
	}

	public String getPowerNetworkName() {
		return powerNetworkName;
	}

	public void setPowerNetworkName(String powerNetworkName) {
		this.powerNetworkName = powerNetworkName;
	}

	public String getPowerSourceVoltage() {
		return powerSourceVoltage;
	}

	public void setPowerSourceVoltage(String powerSourceVoltage) {
		this.powerSourceVoltage = powerSourceVoltage;
	}

	public String getPowerSourcePowerFlow() {
		return powerSourcePowerFlow;
	}

	public void setPowerSourcePowerFlow(String powerSourcePowerFlow) {
		this.powerSourcePowerFlow = powerSourcePowerFlow;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getABoxVoltage() {
		return aBoxVoltage;
	}

	public void setABoxVoltage(String aBoxVoltage) {
		this.aBoxVoltage = aBoxVoltage;
	}

	public String getBBoxVoltage() {
		return bBoxVoltage;
	}

	public void setBBoxVoltage(String bBoxVoltage) {
		this.bBoxVoltage = bBoxVoltage;
	}

	public String getABoxPowerFlow() {
		return aBoxPowerFlow;
	}

	public void setABoxPowerFlow(String aBoxPowerFlow) {
		this.aBoxPowerFlow = aBoxPowerFlow;
	}

	public String getBBoxPowerFlow() {
		return bBoxPowerFlow;
	}

	public void setBBoxPowerFlow(String bBoxPowerFlow) {
		this.bBoxPowerFlow = bBoxPowerFlow;
	}

	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	
	
	
}
