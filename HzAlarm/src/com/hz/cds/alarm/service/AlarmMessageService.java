package com.hz.cds.alarm.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.cds.alarm.cache.AlarmBaseDtlsCache;
import com.hz.cds.alarm.message.FeAlarmMessageBean;
import com.hz.db.service.IQueryService;
import com.hz.db.util.ReqParams;
import com.hz.frm.util.DeviceTypeConst;

@Service
public class AlarmMessageService {
	private static final Logger logger=LoggerFactory.getLogger(AlarmMessageService.class);

	@Resource
	private IQueryService queryService;

	@Resource
	private AlarmBaseDtlsCache alarmBaseDtlsCache;


    public JSONObject alarmProcess(String cusNumber,FeAlarmMessageBean msgBean){
    	JSONObject rtnObj=new JSONObject();
    	rtnObj.put("alarmRecord", msgBean);
    	String alarmDvcType = msgBean.getAlarmDeviceType();
    	String alarmId = msgBean.getAlarmID();

		List<Map<String, Object>> queryData = null;
		List<Object> params = null; 

		try {

			/*
			 * 查询关联设备信息
			 */
			params = new ArrayList<Object>();
			params.add(cusNumber);
			params.add(alarmDvcType);
			params.add(alarmId);
			queryData = queryService.query("select_alt_link_dvc_rltn", "1", "1", params);

			//ldr_dvc_type 1 摄像机 2 门禁 3  对讲 4 广播  5 电视墙
			JSONArray cameraArray = new JSONArray();
			JSONArray doorArray = new JSONArray();
			JSONArray talkArray = new JSONArray();
			JSONArray broadcastArray = new JSONArray();
			JSONArray screenArray = new JSONArray();

			if (queryData != null && queryData.size() > 0) {
				for (Map<String, Object> tempMap : queryData) {
					int dvcType=Integer.valueOf(tempMap.get("ldr_dvc_type").toString()).intValue();
					String deviceId=tempMap.get("ldr_dvc_id").toString();
					String deviceName="";

					if(dvcType==DeviceTypeConst.CAMERA_TYPE){
						JSONObject cameraObj=new JSONObject();
						deviceName=getCameraInfo(cusNumber, deviceId,"cbd_name");
						String cameraStatus=getCameraInfo(cusNumber, deviceId,"cbd_stts_indc");
						cameraObj.put("cbd_id", deviceId);
						cameraObj.put("cbd_name", deviceName);
						cameraObj.put("cbd_stts_indc", cameraStatus);
						cameraArray.add(cameraObj);

					}else if(dvcType==DeviceTypeConst.DOOR_TYPE){
						JSONObject doorObj=new JSONObject();
						doorObj.put("dbd_id", deviceId);
						doorObj.put("dbd_name", getDoorInfo(cusNumber, deviceId,"dbd_name"));
						doorObj.put("dbd_stts_indc", getDoorInfo(cusNumber, deviceId,"dbd_stts_indc"));
						doorObj.put("dbd_dvc_stts", getDoorInfo(cusNumber, deviceId,"dbd_dvc_stts"));
						doorArray.add(doorObj);

					} else if(dvcType==DeviceTypeConst.TALK_TYPE) {
						
					}else if(dvcType==DeviceTypeConst.BROADCAST_TYPE){
						JSONObject broadcastObj=new JSONObject();
						broadcastObj.put("bbd_id", deviceId);
						broadcastObj.put("bbd_other_id", getBroadcastInfo(cusNumber, deviceId,"bbd_other_id"));
						broadcastObj.put("bbd_name", getBroadcastInfo(cusNumber, deviceId,"bbd_name"));
						broadcastObj.put("bbd_ip", getBroadcastInfo(cusNumber, deviceId,"bbd_ip"));
						broadcastObj.put("bbd_port", getBroadcastInfo(cusNumber, deviceId,"bbd_port"));
						broadcastObj.put("bbd_dvc_stts", getBroadcastInfo(cusNumber, deviceId,"bbd_dvc_stts"));
						broadcastArray.add(broadcastObj);

					}else if(dvcType==DeviceTypeConst.SCREEN_TYPE){
						
					}
				}
			}
			rtnObj.put("camera", cameraArray);
			rtnObj.put("door", doorArray);
			rtnObj.put("talk", talkArray);
			rtnObj.put("broadcast", broadcastArray);
			rtnObj.put("screen", screenArray);


			/*
			 * 获取地图视角
			 */
			Map<String, Object> viewMenuMap = queryViewMenuInfo(cusNumber, alarmDvcType, alarmId);
			rtnObj.put("view", viewMenuMap);


			/*
			 * 获取部门编号并获取该部门的在监民警和罪犯信息
			 */
			String deptId = alarmBaseDtlsCache.getAlarmDepartmentId(cusNumber, alarmId, alarmDvcType);

			if ("".equals(deptId)) {

				//获取在监民警
				queryData = getPoliceInfo(cusNumber, deptId);
				rtnObj.put("police", queryData);

				//获取重点罪犯
				queryData = getPrisonerInfo(cusNumber, deptId);
				rtnObj.put("prisonerArray", queryData);
			}

		} catch (Exception e) {
			logger.error("报警联动处理失败..." + e);
		}

    	return rtnObj;
    }

    /**
     * 获取报警器所在的视角
     * @param cusNumber 机构号
     * @param deviceType 设备类型  参考DeviceTypeConst常量
     * @param deviceId 报警器编号
     * @return
     */
    private Map<String, Object> queryViewMenuInfo(String cusNumber,String deviceType,String deviceId){
    	try {
			JSONObject queryJSON = new JSONObject();
			queryJSON.put(ReqParams.SQL_ID, "select_alarm_link_view_menu_info");
			queryJSON.put(ReqParams.WHERE_ID, "1");
			List<String> paraList=new ArrayList<String>();
			paraList.add(cusNumber);
			paraList.add(deviceId);
			paraList.add(deviceType);
			queryJSON.put(ReqParams.PARAMS, paraList.toArray());
			List<Map<String, Object>> queryData = queryService.query(queryJSON);
			if(queryData!=null&&queryData.size()>0){
				return  queryData.get(0);
			}
		} catch (Exception e) {
			logger.error("查询报警视角菜单出错",e);
		}
    	return null;
		
    }


    /**
     * 获取重点罪犯信息
     * @param cusNumber
     * @param departmentId
     * @return
     */
    private List<Map<String, Object>> getPrisonerInfo(String cusNumber,String departmentId){
    	try {
			List<Object> paraList=new ArrayList<Object>();
			paraList.add(cusNumber);
			paraList.add(departmentId);

			List<Map<String, Object>> queryData = queryService.query("select_prisoner_simple_info_for_alarm", "0", paraList);
			
			if (queryData != null && queryData.size() > 0){
				return queryData;
			}
		} catch (Exception e) {
			logger.error("查询报警罪犯信息出错",e);
		}
    	return null;
    }


    /**
     * 获取在监民警信息
     * @param cusNumber
     * @param departmentId
     * @return
     */
    private List<Map<String, Object>> getPoliceInfo(String cusNumber,String departmentId){
    	try {
			List<Object> paraList = new ArrayList<Object>();
			paraList.add(cusNumber);
			paraList.add(departmentId);

			List<Map<String, Object>> queryData = queryService.query("select_police_info_for_alarm", "1", "1", paraList);

			if (queryData != null && queryData.size() > 0) {
				return queryData;
			}
		} catch (Exception e) {
			logger.error("获取在监民警信息出错", e);
		}
    	return null;
    }


//	/**
//     * 获取报警设备所属部门
//     * @param cusNumber
//     * @param alarmDvcType 报警设备类型
//     * @param deviceId 设备编号
//     * @return
//     */
//    private String getDepartmentId(String cusNumber,int alarmDvcType,String deviceId){
//    	String departmentId="";
//		if(alarmDvcType==DeviceTypeConst.CAMERA_TYPE){
//			departmentId=getCameraInfo(cusNumber,deviceId,"cbd_dept_id");
//		}else if(alarmDvcType==DeviceTypeConst.DOOR_TYPE){
//
//		}else if(alarmDvcType==DeviceTypeConst.TALK_TYPE){
//			
//		}else if(alarmDvcType==DeviceTypeConst.BROADCAST_TYPE){
//			
//		}else if(alarmDvcType==DeviceTypeConst.SCREEN_TYPE){
//			
//		}else if(alarmDvcType==DeviceTypeConst.NETWORK_ALARM_TYPE){
//			departmentId=getNetworkAlarmInfo(cusNumber,deviceId,"nbd_dept_id");
//		}
//    	return departmentId;
//    }



    /**
     * 获取摄像机信息
     * @param cusNumber 机构号
     * @param cameraId 摄像机编号
     * @param key cbd_name 摄像机名称   cbd_dvc_addrs 摄像机地址   cbd_dept_id 摄像机所在的部门编号
     * @return
     */
    public String getCameraInfo(String cusNumber,String cameraId,String key){
		String name="";
		Map<String, Object> cameraMap=RedisUtil.getHashMap("cmr_camera_base_dtls"+"_"+cusNumber, cameraId);
		if(cameraMap!=null){
			name=cameraMap.get(key).toString();
		}
		return name;
    }
    /**
     * 获取网络报警器的信息
     * @param cusNumber 监狱号
     * @param networkAlarmId 网络报警器的编号
     * @param key nbd_name 报警器的名称  nbd_dvc_addrs 报警器的地址  nbd_dept_id 所在的部门编号
     * @return
     */
    public String getNetworkAlarmInfo(String cusNumber,String networkAlarmId,String key){
    	String value="";
		Map<String, Object> networkAlarmMap=RedisUtil.getHashMap("alt_network_base_dtls"+"_"+cusNumber, networkAlarmId);
		if(networkAlarmMap!=null){
			value=networkAlarmMap.get(key).toString();
		}
    	return value;
    }
	
    /**
     * 获取门禁的名称
     * @param cusNumber
     * @param cameraId
     * @param key dbd_name 门名称   dbd_stts_indc 门禁状态   dbd_dvc_stts 设备状态
     * @return
     */
	public String getDoorInfo(String cusNumber,String doorId,String key){
		String name="";
		Map<String, Object> cameraMap=RedisUtil.getHashMap("dor_door_base_dtls"+"_"+cusNumber, doorId);
		if(cameraMap!=null){
			name=cameraMap.get(key).toString();
		}
		return name;
	}
	
    /**
     * 获取数字广播信息
     * @param cusNumber
     * @param broadcastId
     * @param key 
     * @return
     */
	public String getBroadcastInfo(String cusNumber,String broadcastId,String key){
		String value="";
		Map<String, Object> broadcastMap=RedisUtil.getHashMap("bct_broadcast_base_dtls_"+cusNumber, broadcastId);
		if(broadcastMap!=null){
			value=broadcastMap.get(key).toString();
		}
		return value;
	}

    /**
     * 获取对讲机设备信息
     * @param cusNumber
     * @param broadcastId
     * @param key tbd_name 对讲机名称  tbd_dept_id 所属部门  tbd_area_id 所属区域  tbd_dvc_addrs 安装位置
     * @return
     */
	public String getTalkbackInfo(String cusNumber,String talkbackId,String key){
		String value="";
		Map<String, Object> talkbackMap=RedisUtil.getHashMap("tbk_talkback_base_dtls_"+cusNumber, talkbackId);
		if(talkbackMap!=null){
			value=talkbackMap.get(key).toString();
		}
		return value;
	}
}
