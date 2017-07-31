package com.hz.baseData.asyncDeviceStatus;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hz.cache.util.RedisUtil;
import com.hz.db.service.IQueryService;

@Component
public class AsyncDevice implements  ApplicationListener<ContextRefreshedEvent>{
	
	Logger log= LoggerFactory.getLogger(AsyncDevice.class);
	
	@Resource
	JdbcTemplate  jdbc;

	@Resource
	IQueryService query;
	
	private static final String  sql="INSERT INTO dvc_device_status_record (dsr_cus_number,dsr_dvc_type,dsr_dvc_type_name,dsr_dvc_id,dsr_dvc_name,dsr_dvc_status,dsr_record_time,dsr_status_desc)"+
	
								"VALUES(?,?,?,?,@,?,SYSDATE,NVL((SELECT ccd_value FROM sys_constant_code_dtls  WHERE  ccd_type_id='DEVICE_STATUS_ALL' AND ccd_key=?),'未知状态'))";

	//每十秒钟同步一次redis
	@Scheduled(cron="0/10 * * * * ?")
	public void async(){

		//获取要同步的设备与表的映射code: tablename_col_id
		List<Map<String,Object>> deviceTypeList = RedisUtil.getMapList("DEVICE_MAPPED_TABLE", new HashMap<String,Object>());
		
		if(deviceTypeList != null && deviceTypeList.size()>0){
			Map<String,Object> deviceType;

			String[] table_col_id;//设备表_设备名称列名_设备id列
			String[]  type_name_status;//设备类型，类型名称,正常状态标识

			String tempSql;

			//循环获取要更新的数据
			for(int i=0;i<deviceTypeList.size();i++){
				
				StringBuilder sb = new StringBuilder();
				
				deviceType = deviceTypeList.get(i);
				table_col_id = deviceType.get("name").toString().split("@");
				type_name_status = deviceType.get("id").toString().split("@");

				//设备类型名称
				final String name = type_name_status[1];
				//设备正常状态标识
				final String status = type_name_status[2];

				sb.append("(SELECT ");
				sb.append(table_col_id[1]);
				sb.append(" FROM  ");
				sb.append(table_col_id[0]);
				sb.append(" WHERE ");
				sb.append(table_col_id[2]);
				sb.append("=");
				sb.append("?)");

				tempSql = sql.replace("@", sb.toString());
				//获取要同步的类型数据
				List<Map<String,Object>> list = RedisUtil.getMapList("ASYNC_DEVICE_STATUS_" + type_name_status[0], new HashMap<String,Object>());

				//获取后立即删除
				RedisUtil.deleteList("ASYNC_DEVICE_STATUS_" + type_name_status[0]);

				//批量插入数据
				jdbc.batchUpdate(tempSql, new BatchPreparedStatementSetter() {
					
					@Override
					public void setValues(PreparedStatement prepare, int index) throws SQLException {

						Map<String,Object> item = list.get(index);

						//机构号
						prepare.setBigDecimal(1, BigDecimal.valueOf(Long.parseLong(item.get("cus").toString())));
						//设备类型
						prepare.setInt(2, Integer.parseInt(item.get("dvcType").toString()));
						//设备类型名称
						prepare.setString(3, name);
						//设备id
						prepare.setBigDecimal(4, BigDecimal.valueOf(Long.parseLong(item.get("deviceID").toString())));
						//设备名称，此处设置设备id
						prepare.setBigDecimal(5, BigDecimal.valueOf(Long.parseLong(item.get("deviceID").toString())));
						//设备状态
						prepare.setInt(6, item.get("status").toString().equals(status)?0:1);
						//设备状态描述
						prepare.setString(7, item.get("dvcType").toString()+"-"+item.get("status").toString());

					}
					@Override
					public int getBatchSize() {
						return list.size();
					}
				});
				
			}
		}
		
	}
	
	@PostConstruct
	public void deviceType() throws Exception{
		
	}

	@Override
	public void onApplicationEvent(ContextRefreshedEvent arg0) {
		if (arg0.getApplicationContext().getParent() != null) {
			//将设备类型对应的表放入到redis
			List<Map<String, Object>> list;
			List<Object> params = null;
			try {
//				list = query.query(JSONObject.parseObject("{params:['DEVICE_MAPPED_TABLE'],whereId:'0',sqlId:'select_constant_bycode'}"));
				params = new ArrayList<Object>();
				params.add("DEVICE_MAPPED_TABLE");
				list = query.query("select_constant_bycode", "0", params);

				if (list.size()>0) {
					RedisUtil.deleteList("DEVICE_MAPPED_TABLE");
					//将设备类行与表对应起来
					RedisUtil.putList("DEVICE_MAPPED_TABLE", list);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
