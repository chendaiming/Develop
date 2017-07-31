package com.hz.frm.poi;

import java.io.FileInputStream;
import java.io.InputStream;

import javax.annotation.Resource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IUpdateService;
import com.hz.frm.utils.SequenceUtil;
@Service
public class ImpPoliceInfoByPoi {
	private static final Logger logger = LoggerFactory.getLogger(ImpPoliceInfoByPoi.class);
	@Resource
	private IUpdateService updateService;
	@Resource
	private SequenceUtil sequenceUtil;
	
	public String Import(String filePath)throws Exception{
		
		
		
		JSONObject result = new JSONObject();
//		if(filePath == null || !new File(filePath).isFile()){
//			result.put("success", false);
//			result.put("msg", "没有找到该文件");
//		}
		
		if(isExcel2003(filePath)){
			
		}
		
		//获取文件输入流对象in
		InputStream in = new FileInputStream(filePath);
		//POI文件系统 Excel 2003
//		InputStream  ps = new POIFSFileSystem(in);
		//获得excel工作薄对象
		@SuppressWarnings("resource")
		HSSFWorkbook wb = new HSSFWorkbook(in);
		//得到第一个sheet
		HSSFSheet sheet = wb.getSheetAt(0);
		//得到该sheet的总共行数
		int sum = sheet.getPhysicalNumberOfRows();
		try {
			//遍历excel中的内容 从第3行开始
			for(int i=2;i<sum;i++){
				//一次读取一行	
				HSSFRow row = sheet.getRow(i);
				//获取第i行第二个Cell的数据
				//以此类推获取所有Cell的值
				
				String pbd_cus_number = getCellValue(row, 0); //机构编号
				String pbd_police_id  = sequenceUtil.getSequence("PLC_POLICE_BASE_DTLS", "PBD_POLICE_ID"); //数据库中的警员编号
				String pbd_other_id = getCellValue(row,1);//监狱提供的警员编号
				String pbd_police_name = getCellValue(row,2);//警员姓名
				String pbd_drptmnt_id  = getCellValue(row,3);//所属部门
				int pbd_pstn_name   = getCellValue(row,4).equals("监狱长")?1:2;//职务
				int pbd_age   = Integer.parseInt(getCellValue(row,5));//年龄
				
	//			String policeId = getCellValue(row,28); //取得警员编号
	//			String policeName = getCellValue(row,2); //警员编号
	//			String departmntName =getCellValue(row,1); //部门名称
	//			String departmntId = "";
	//			int sex = getCellValue(row,3).equals("男")?2:1; //性别,1女2男
	//			String birthday = getCellValue(row,33); //出生日期
	//			String jobDate = getCellValue(row,7);//参加工作年月
	//			String political = getCellValue(row,8);//政治面貌
	//			String pstn = getCellValue(row,10);//职务
	//			String age = getCellValue(row,35);//年龄
		//		int age =(int)row.getCell(35).getNumericCellValue();//年龄
	//			String remark = getCellValue(row,32);//备注
				//民族 5 籍贯 6 入党时间 9 职务类别11  任职时间12 职级13 任级时间 14 分管工作15 全日制学历 16 毕业院校 17 所学专业 18 
				//学位 19  在职教育学历 20 毕业 院校 21 所学专业 22 学位23  录警时间 24 进入本单位时间 25警衔级别 26 现衔时间 27
				//专业技术职务 29 外语级别 30 心理咨询师证书级别31 备注 32 出生日期33 身份证号34 年龄 35 是否两劳三十年 36
				//System.out.println("departmntName:"+departmntName+"policeName:"+policeName);
				//插入数据库
				JSONObject parasList=new JSONObject();
				           parasList.put("pbd_cus_number", pbd_cus_number);
				           parasList.put("pbd_police_id", pbd_police_id);
				           parasList.put("pbd_other_id", pbd_other_id);
				           parasList.put("pbd_police_name", pbd_police_name);
				           parasList.put("pbd_drptmnt_id", pbd_drptmnt_id);
				           parasList.put("pbd_pstn_name", pbd_pstn_name);
				           parasList.put("pbd_age", pbd_age);
				           parasList.put("user_id", 0);
				JSONObject  jsonobj = new JSONObject();
				jsonobj.put("sqlId", "cds_police_addbyExl");
				jsonobj.put("params", parasList);
				
				UpdateResp resp = 	updateService.updateByParamKey(jsonobj);
				if(resp.getSuccess())  {
					logger.debug("插入警员信息成功成功");
				}
			}
//			System.out.println("导入警员信息成功,警员姓名:"+policeName);
		}catch(Exception e) {
			e.printStackTrace();
		}finally{
		//关闭输入流和连接
		in.close();
		}
		return result.toJSONString();
	}
	/**
	 * 获取单元格的值
	 * @param row
	 * @param cellnum
	 * @return
	 */
	public String getCellValue(HSSFRow row,int cellnum){
		String value = "";
		HSSFCell cell = row.getCell(cellnum);
		int type =  row.getCell(cellnum).getCellType();
		if(type == Cell.CELL_TYPE_STRING){
			value =  cell.getStringCellValue().trim();
		}else if(type == Cell.CELL_TYPE_NUMERIC){
			value =  String.valueOf(cell.getNumericCellValue());
		}
		return value;
	}
	
	/** 
     *  
     * @描述：是否是2003的excel，返回true是2003 
     *  
     * @参数：@param filePath　文件完整路径 
     *  
     * @参数：@return 
     *  
     * @返回值：boolean 
     */  
  
    public static boolean isExcel2003(String filePath)  
    {  
  
        return filePath.matches("^.+\\.(?i)(xls)$");  
  
    }  
  
    /** 
     *  
     * @描述：是否是2007的excel，返回true是2007 
     *  
     * @参数：@param filePath　文件完整路径 
     *  
     * @参数：@return 
     *  
     * @返回值：boolean 
     */  
  
    public static boolean isExcel2007(String filePath)  
    {  
  
        return filePath.matches("^.+\\.(?i)(xlsx)$");  
  
    }  
	
	
}
