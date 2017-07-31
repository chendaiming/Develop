package com.hz.cds.person.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import dm.sql.ARRAY;
import net.sf.ehcache.pool.sizeof.SizeOf;

public class Read_Excel {
	private static final Logger log = LoggerFactory.getLogger(Read_Excel.class);
	
	public static List<Map<String,String>> hssfWorkBook(File file, boolean hasTitle,Field[] field){
		try {
			int sheetNo = 9;
			int cellcount = 0;
			List<Map<String,String>> arry = new ArrayList<Map<String,String>>();
			Map<String,String>  args = null;
			HSSFWorkbook workbook = new HSSFWorkbook(new FileInputStream(file));
			HSSFSheet sheet = workbook.getSheetAt(0);
			int start = sheet.getFirstRowNum()+(hasTitle ? 1:0);//如果有标题则从第二行开始读取
			System.out.println("--->"+sheet.getLastRowNum());
			
			for(int i=start;i<=sheet.getLastRowNum();i++){
				args = new HashMap<String,String>();
				HSSFRow row = sheet.getRow(i);
				if(row == null){
					continue;
				}
				cellcount = row.getLastCellNum();//获取列数
				
				for(int j=0;j<field.length;j++){
					//获取单元格的内容
					HSSFCell cell = row.getCell(j);
					if(cell==null){
						continue;
					}
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);//
					//获取cell中的值 并去掉空格
					String fieldName = cell.getStringCellValue().trim();
					args.put(field[j].getName(), fieldName);
				}
				
				args.put("rowNum",i+"");
				arry.add(args);
			}
			return arry;
			
		} catch (IOException e) {
			log.error("读取Excel文件失败",e);
		}
		return null;
	}
	
	public static void main(String[] args) {
//		File file = new File("D:\\Excel\\area.xls");
//		System.out.println(file);
//		Field[] field = Alertor.class.getDeclaredFields();
//		Read_Excel.hssfWorkBook(file, true,field);
//		List<Map<String,String>> array = Read_Excel.hssfWorkBook(file, true,field);
//		String sqlId = "insert area_department";
//		
//		for(Map<String,String> arg : array){
//			System.out.println(arg);
//			List<Object> parasList = new ArrayList<Object>();
//			parasList.add(arg.get("ID"));
//			parasList.add(arg.get("DVR_IDNTY"));
//			parasList.add(arg.get("AREA_ID"));
//			System.out.println(parasList.toString());
//		}
		
		
	}
}
