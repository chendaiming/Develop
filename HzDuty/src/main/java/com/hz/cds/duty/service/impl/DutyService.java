package com.hz.cds.duty.service.impl;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.duty.service.IDutyService;
import com.hz.frm.util.ConfigUtil;

@Service
public class DutyService implements IDutyService {
	private static final Logger logger = LoggerFactory.getLogger(DutyService.class);
	
	/**
	 * 生成值班模板excel文件
	 */
    @SuppressWarnings("deprecation")
	public String exportExcel(JSONObject argsObj) throws Exception{
    	JSONArray orderList = argsObj.getJSONArray("orderList");
		JSONArray jobList = argsObj.getJSONArray("jobList");
		JSONArray dateList = argsObj.getJSONArray("dateList");
		String fileName = argsObj.getString("fileName");
		logger.debug(orderList.toJSONString());
		logger.debug(jobList.toJSONString());
		logger.debug(dateList.toJSONString());
    	String filePath = ConfigUtil.get("DTY_EXCEL_DIR") + fileName + ".xls";
    	File file = new File(filePath);
    	file.getParentFile().mkdirs();
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFCellStyle style = wb.createCellStyle();
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		
		HSSFCellStyle style1 = wb.createCellStyle();
		style1.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style1.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style1.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style1.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style1.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		
		style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
		
		HSSFFont f = wb.createFont();
		f.setFontHeightInPoints((short)12);
		f.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		style.setFont(f);
		
		HSSFSheet sheet = wb.createSheet("值班表");
		sheet.setColumnWidth(0, 30*256);
		sheet.setColumnWidth(1, 20*256);
		sheet.setDefaultColumnWidth(15);
		
		//sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 0));
		HSSFRow row = sheet.createRow(0);
		HSSFCell cell = row.createCell(0);
		cell.setCellType(HSSFCell.CELL_TYPE_STRING);
		cell.setCellValue("班次");
		cell.setCellStyle(style);
		
		int firstCol = 1;
		int lastCol = 0;
		for (int i = 0; i < orderList.size(); i++) {
			JSONObject orderObj = (JSONObject) orderList.get(i);
			int col = Integer.parseInt(orderObj.getString("col"));
			lastCol = lastCol + col;
			if(col > 1){
				sheet.addMergedRegion(new CellRangeAddress(0, 0, firstCol, lastCol));
			}
			cell = row.createCell(firstCol);
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			String name = orderObj.getString("name");
			String startTime = orderObj.getString("start_time");
			String endTime = orderObj.getString("end_time");
			cell.setCellValue(name + "(" + startTime + "~" + endTime +  ")");
			cell.setCellStyle(style);
			firstCol = lastCol + 1;
		}
		
		row = sheet.createRow(1);
		cell = row.createCell(0);
		cell.setCellType(HSSFCell.CELL_TYPE_STRING);
		cell.setCellValue("岗位");
		cell.setCellStyle(style);
		
		for (int i = 0; i < jobList.size(); i++) {
			JSONObject jobObj = (JSONObject) jobList.get(i);
			cell = row.createCell(i+1);
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			String name = jobObj.getString("name");
			cell.setCellValue(name);
			cell.setCellStyle(style);
		}
		
		for (int i = 0; i < dateList.size(); i++) {
			JSONObject dateObj = (JSONObject) dateList.get(i);
			row = sheet.createRow(i + 2);
			cell = row.createCell(0);
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			String name = dateObj.getString("name");
			String week = dateObj.getString("week");
			cell.setCellValue(name + "(" + week + ")");
			cell.setCellStyle(style);
			
			JSONArray peopleList = dateObj.getJSONArray("peopleList");
			for (int j = 0; j < peopleList.size(); j++) {
				JSONObject peopleObj = (JSONObject) peopleList.get(j);
				String flag = peopleObj.getString("flag");
				cell = row.createCell(j + 1);
				cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				cell.setCellStyle(style1);
				if("2".equals(flag)){
					JSONArray list = peopleObj.getJSONArray("list");
					StringBuffer names = new StringBuffer();
					for (int k = 0; k < list.size(); k++) {
						JSONObject listObj = (JSONObject) list.get(k);
						name = listObj.getString("name");
						names.append(k != list.size()-1 ? name + "#" : name);
					}
					cell.setCellValue(names.toString());
				}
			}
		}
		
		FileOutputStream fileOut = new FileOutputStream(file);
		wb.write(fileOut);
		fileOut.flush();
		fileOut.close();
		wb.close();
		
		return filePath;
    }
    
    /**
     * 下载值班模板excel文件
     */
	public void uploadExcel(String pathName, HttpServletResponse response) throws Exception{
		logger.debug(pathName);
		File file = new File(pathName);
		if (file == null || !file.exists()){ 
			logger.debug(pathName + "文件不存在");
			return; 
		} 
		OutputStream out = null;
		try { 
			response.reset(); 
			response.setContentType("application/octet-stream; charset=utf-8"); 
			response.setHeader("Content-Disposition", "attachment; filename=" + new String(file.getName().getBytes("gb2312"), "ISO8859-1")); 
			logger.debug(file.getName());
			out = response.getOutputStream(); 
			out.write(FileUtils.readFileToByteArray(file)); 
			out.flush(); 
		} catch (IOException e) { 
			e.printStackTrace(); 
		} finally { 
			if (out != null) { 
				try { 
					out.close();
				} catch (IOException e) { 
					e.printStackTrace();
				} 
			} 
		}
	}
	
	/**
	 * 导入值班表excel文件
	 */
	public List<List<Map<String, Object>>> importExcel(CommonsMultipartFile file){
		List<List<Map<String, Object>>> dataList = new ArrayList<List<Map<String, Object>>>();
		try {
			if(!file.isEmpty()){
				String pathName = ConfigUtil.get("DTY_EXCEL_DIR");
				File dirFile = new File(pathName);
				if(!dirFile.exists()){
					dirFile.mkdirs();
				}
				FileUtils.copyInputStreamToFile(file.getInputStream(), new File(pathName,file.getOriginalFilename()));
				String copyPathName = pathName + file.getOriginalFilename();
				InputStream in = new FileInputStream(copyPathName);
				POIFSFileSystem ps = new POIFSFileSystem(in);
				@SuppressWarnings("resource")
				HSSFWorkbook wb = new HSSFWorkbook(ps);
				HSSFSheet sheet = wb.getSheetAt(0);
				int rowSum = sheet.getPhysicalNumberOfRows();
				for (int i = 2; i < rowSum; i++) {
					List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
					HSSFRow row = sheet.getRow(i);
					int colSum = row.getPhysicalNumberOfCells();
					for (int j = 1; j < colSum; j++) {
						HSSFCell cell = row.getCell(j);
						String name = cell.getStringCellValue();
						Map<String, Object> map = new HashMap<String, Object>();
						map.put("name", name);
						list.add(map);
					}
					dataList.add(list);
				}
				in.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return dataList;
	}
}
