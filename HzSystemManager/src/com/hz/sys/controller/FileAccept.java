package com.hz.sys.controller;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.sql.bean.SqlConfigBean;
import com.hz.sql.util.SqlConfigUtil;

@Controller
@RequestMapping("upload")
public class FileAccept {

	@Resource
	private NamedParameterJdbcTemplate jdbc;

	@RequestMapping("parse")
	@ResponseBody
	public JSONObject parse(@RequestParam("file") CommonsMultipartFile file) throws IOException {

		Workbook work;
		Row row;
		Cell cell;

		if (file.getOriginalFilename().endsWith("xlsx")) {
			work = new XSSFWorkbook(file.getInputStream());
		} else {
			work = new HSSFWorkbook(file.getInputStream());
		}

		Sheet sheet = work.getSheetAt(0);
		row = sheet.getRow(0);

		int column = row.getPhysicalNumberOfCells();
		// 表头
		String[] theader = new String[column];

		for (int i = 0, len = column; i < len; i++) {
			cell = row.getCell(i);
			if (cell != null) {
				cell.setCellType(CellType.STRING);
				theader[i] = cell.getStringCellValue();
			}
		}
		// tbody
		List<JSONArray> tbody = new LinkedList<JSONArray>();

		System.out.println("???????????" + sheet.getLastRowNum());
		System.out.println("???????????" + sheet.getPhysicalNumberOfRows());

		List<CellRangeAddress> list = sheet.getMergedRegions();

		int len = sheet.getPhysicalNumberOfRows();
		int[] pos = { -1, -1, -1, -1 };
		for (int i = 1; i < len; i++) {
			row = sheet.getRow(i);

			JSONArray tr = new JSONArray();

			for (int j = 0; j < column; j++) {

				cell = row.getCell(j);

				if (cell != null) {

					isMergedRegion(sheet, i, j, list, pos);
					JSONObject td = new JSONObject();
					if (pos[0] + 1 <= i && i <= pos[1] && pos[2] <= j && j <= pos[3]) {
						continue;
					}
					td.put("rowspan", pos[1] - pos[0] + 1);
					cell.setCellType(CellType.STRING);

					td.put(theader[j], Q2BChange(cell.getStringCellValue(),false));
					tr.add(td);
				}
			}

			tbody.add(tr);
		}

		work.close();

		JSONObject json = new JSONObject();
		json.put("header", theader);
		json.put("body", tbody);
		return json;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping("insert")
	@ResponseBody
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public int insetData(@RequestParam() String data, String sqlId) {

		Map<String, String>[] param = JSONArray.parseObject(data, Map[].class);
		SqlConfigBean configBean = SqlConfigUtil.getConfig(sqlId);
		String sql = configBean.getSqlBody();
		jdbc.batchUpdate(sql, param);
		return 0;
	}

	private int[] isMergedRegion(Sheet sheet, int row, int column, List<CellRangeAddress> list, int[] pos) {
		CellRangeAddress range;
		for (int i = 0, sheetMergeCount = list.size(); i < sheetMergeCount; i++) {
			range = list.get(i);
			pos[0] = range.getFirstRow();
			pos[1] = range.getLastRow();
			pos[2] = range.getFirstColumn();
			pos[3] = range.getLastColumn();
			if (row >= pos[0] && row <= pos[1] && pos[2] <= column && column <= pos[3]) {
				return pos;
			} else {
				pos[0] = pos[1] = pos[2] = pos[3] = -1;
			}
		}
		return pos;
	}
	//全角半角转换
	private  String Q2BChange(String input, boolean flag) {
		String result = "";
		char[] str = input.toCharArray();
		for (int i = 0; i < str.length; i++) {
			int code = str[i];// 获取当前字符的unicode编码
			if (code >= 65281 && code <= 65373) // 在这个unicode编码范围中的是所有的英文字母以及各种字符
			{
				result += (char) (str[i] - 65248);// 把全角字符的unicode编码转换为对应半角字符的unicode码
			} else if (code == 12288) // 空格
			{
				result += (char) (str[i] - 12288 + 32);
			} else if (code == 65377) {
				result += (char) (12290);
			} else if (code == 12539) {
				result += (char) (183);
			} else if (code == 8482 && flag == true) {// 如果是特殊字符TM 且是并需要转换的所作操作

			} else if (code == 8226) { // 特殊字符 ‘·’的转化
				result += (char) (183);
			} else {
				result += str[i];
			}
		}
		System.out.println(result);
		return result;
	}
}
