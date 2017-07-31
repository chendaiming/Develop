package com.hz.cds.door.service;

import java.util.List;

public interface IDoorCtrlService {

	/**
	 * 开关门
	 * @param doorIdentify 门编号
	 * @param action 1 开 0 关
	 */
    public void openDoor(String cusNumber,String doorId,String action);
    /**
     * 一键锁死
     * @param cusNumber 监狱号
     * @param doorIdList 门的IDList
     */
    public void lockDoor(String cusNumber,List<Object> doorIdList);
}
