package com.hz.db.controller;

import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.service.ICacheService;
import com.hz.db.bean.DbCodeBean;
import com.hz.db.bean.UpdateResp;
import com.hz.db.service.IQueryByParamKeyService;
import com.hz.db.service.IQueryService;
import com.hz.db.service.IUpdateService;
import com.hz.db.util.DbCodeUtil;
import com.hz.db.util.DbException;
import com.hz.db.util.ReqParams;
import com.hz.db.util.RespParams;
import com.hz.frm.util.ApplicationContextUtil;
import com.hz.frm.util.ConfigUtil;
import com.hz.frm.util.StringUtil;
import com.hz.frm.util.Tools;


// ===============================【参数说明】=============================
// sql: 执行的SQL语句（sql和sqlId必选其一，优先选择sql）
// seq: 序列号参数，格式["参数在params集合中的位置索引", "表名", "表字段"]
// sqlId: 执行的SQL语句编号（sql和sqlId必选其一，优先选择sql）
// whereId: 执行的SQL语句的条件编号（和sqlId一起使用，可选）
// orderId: 执行的SQL语句的排序编号（和sqlId一起使用，可选）
// params: SQL参数集合（可选），格式：[] | [[]] | {} | [{}]
// paramsType: SQL参数类型，格式{"index":"type"}（和params一起使用，可选）
// 		index：params中参数在集合中的索引值
// 		type: params中参数的数据类型，当类型是CLOB、BLOB数据类型的需要指定，其它类型暂时不需要
// minRow: 分页查询的最小行
// maxRow: 分页查询的最大行

@Controller
@RequestMapping("dbCtrl")
public class DbCtrl {
	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(DbCtrl.class);

	@Resource
	private IQueryService queryService;

	@Resource
	private IQueryByParamKeyService queryByParamKeyService;

	@Resource
	private IUpdateService updateService;


	/**
	 * DB通用查询
	 * @param args 参数对象
	 * 		1.args = {"sqlId":"", "whereId":"", "orderId":"", "params":[], "minRow":"", "maxRow":""}
	 * 		2.args = [{"sqlId":"", "whereId":"", "orderId":"", "params":[], "minRow":"", "maxRow":""}]
	 * @return
	 */
	@RequestMapping("query")
	@ResponseBody
	public JSONObject query (@RequestParam() String args) {
		JSONObject reqJSON = null;
		Object result = null;
		log.debug(args);

		try {
			if (args.indexOf("{") == 0) {
				reqJSON = JSON.parseObject(args);
				result = isPaging(reqJSON) ? queryService.queryPage(reqJSON) : queryService.query(reqJSON);
			} else {
				result = queryService.query(JSONArray.parseArray(args));
			}
		} catch (DbException e) {
			return respError("DB通用查询失败：", args, e);
		} catch (Exception e) {
			return queryError("DB通用查询异常：", args, e);
		}

		return success(result);
	}


	/**
	 * DB通用分页查询
	 * @param args 参数对象：{"sqlId":"", "whereId":"", "orderId":"", "params":{}, "minRow":"", "maxRow":""}
	 * @return
	 */
	@RequestMapping("queryByParamKey")
	@ResponseBody
	public JSONObject queryByParamKey (@RequestParam() String args) {
		JSONObject reqJSON = null;
		Object result = null;
		log.debug(args);

		try {
			if (args.indexOf("{") == 0) {
				reqJSON = JSON.parseObject(args);
				result = isPaging(reqJSON) ? queryByParamKeyService.queryPaging(reqJSON) : queryByParamKeyService.query(reqJSON);
			} else {
				result = queryByParamKeyService.query(JSONArray.parseArray(args));
			}
		} catch (DbException e) {
			return respError("DB通用查询失败：", args, e);
		} catch (Exception e) {
			return queryError("DB通用查询异常：", args, e);
		}

		return success(result);
	}


	/**
	 * DB通用增、删、改操作
	 * @param args 参数对象：[{"sql":"", "seq":[], "sqlId":"", "whereId":"", "orderId":"", "params":[], "paramsList":[[]], "paramsType":{}}]
	 * @return
	 */
	@RequestMapping("update")
	@ResponseBody
	public JSONObject update (@RequestParam() String args) {
		UpdateResp updateResp = null;
		log.debug(args);
		
		try {
			updateResp = updateService.update(JSON.parseArray(args));
		} catch (DbException e) { 
			return respError("DB通用增、删、改操作失败：", args, e);
		} catch (Exception e) {
			return updateError("DB通用增、删、改操作异常：", args, e);
		}

		return success(updateResp);
	}


	/**
	 * DB通用增、删、改操作
	 * @param args 参数对象：[{"sqlId":"", "whereId":"", "orderId":"", "params":[{}]}]
	 * @return
	 */
	@RequestMapping("updateByParamKey")
	@ResponseBody
	public JSONObject updateByParamKey (@RequestParam() String args) {
		UpdateResp updateResp = null;
		log.debug(args);
		
		try {
			updateResp = updateService.updateByParamKey(JSON.parseArray(args));
		} catch (DbException e) { 
			return respError("DB通用增、删、改操作失败：", args, e);
		} catch (Exception e) {
			return updateError("DB通用增、删、改操作异常：", args, e);
		}

		return success(updateResp);
	}

	/**
	 * 是否分页
	 * @param reqJSON
	 * @return
	 */
	private boolean isPaging (JSONObject reqJSON) {
		String minRow = reqJSON.getString(ReqParams.MINROW);	// 查询的最小行
		String maxRow = reqJSON.getString(ReqParams.MAXROW);	// 查询的最大行

		if (Tools.notEmpty(minRow) || Tools.notEmpty(maxRow)) {
			return true;
		} else {
			return false;
		}
	}


	/**
	 * 响应前端数据
	 * @param ex 自定义DB错误对象
	 * @return
	 */
	private JSONObject respError (String msg, String args, DbException e) {
		log.error(msg + "请求参数<" + args + ">");
		log.error(msg + e.getErrCode() + " - " + e.getErrMsg());
		return response(e.getErrCode(), e.getErrMsg(), null);
	}


	/**
	 * 响应前端数据
	 * @param respMsg
	 * @param e
	 * @return
	 */
	private JSONObject queryError (String msg, String args, Exception e) {
		log.error(msg + "请求参数<" + args + ">");
		log.error(msg, e);

		// 转换异常错误
		JSONObject reqJSON = JSON.parseObject(args);
		DbCodeBean codeBean = DbCodeUtil.formatEx(e, reqJSON.getString(ReqParams.MODULE));

		return error(codeBean);
	}


	/**
	 * 响应前端数据
	 * @param respMsg
	 * @param e
	 * @return
	 */
	private JSONObject updateError (String msg, String args, Exception e) {
		log.error(msg + "请求参数<" + args + ">");
		log.error(msg, e);
		// 转换异常错误
		DbCodeBean codeBean = DbCodeUtil.formatEx(e);
		return error(codeBean);
	}


	/**
	 * 响应前端数据
	 * @param data	响应数据
	 * @return
	 */
	private JSONObject success (Object data) {
		return response(DbCodeUtil.CODE_0000, "", data);
	}


	/**
	 * 响应前端数据
	 * @param data	响应数据
	 * @return
	 */
	private JSONObject error (DbCodeBean codeBean) {
		String code = codeBean.getCode();
		String desc = codeBean.getDesc();
		String plus = codeBean.getPlus();

		// 检测是否未转换描述
		if (Tools.isEmpty(desc)) {
			desc = DbCodeUtil.getDesc(code, codeBean.getCode());
		}

		// 检测并拼接附加描述
		if (Tools.notEmpty(desc)) {
			desc += ";" + plus;
		} else {
			desc = plus;
		}

		return response(code, desc, null);
	}


	/**
	 * 响应前端数据
	 * @param code	响应码
	 * @param msg	响应消息
	 * @param data	响应数据
	 * @return
	 */
	private JSONObject response (String code, String msg, Object data) {
		JSONObject result = null;	// 响应结果

		result = new JSONObject();
		result.put(RespParams.SUCCESS, DbCodeUtil.CODE_0000.equals(code));		
		result.put(RespParams.RESP_CODE, code);
		result.put(RespParams.RESP_MSG, msg);
		result.put(RespParams.DATA, data);

		return result;
	}

	/**
	 * 新增、删除、修改时刷新缓存数据
	 * @param args 参数对象：{"serviceName":"","action":"", "params":{}} serviceName为缓存数据类的名称  action的值为add、update、delete
	 * @return
	 */
	@RequestMapping("refreshCache")
	@ResponseBody
	public JSONObject refreshCache (@RequestParam() String args) {
	    log.debug("args="+args);
		JSONObject reqJSON = JSON.parseObject(args);
		String params=reqJSON.getString("params");
		JSONObject paramsObj=JSONObject.parseObject(params);
		//缓存类的名称
		String serviceName=reqJSON.getString("serviceName");
		//action的值为add、update、delete
		String action=reqJSON.getString("action");
		if(!StringUtil.isNull(serviceName)){
			ICacheService cacheService = (ICacheService) ApplicationContextUtil.getInstance().getBean(serviceName);
			if(!StringUtil.isNull(action)){
				if("add".equals(action)||"update".equals(action)){
					try {
						cacheService.refresh(paramsObj);
					} catch (Exception e) {
						queryError ("刷新缓存数据失败：",args,e);
					}
				}else if("delete".equals(action)){
					try {
						cacheService.refreshForDelete(paramsObj);
					} catch (Exception e) {
						queryError ("刷新缓存数据失败：",args,e);
					}
				}else{
					return response(DbCodeUtil.CODE_0003, "action参数不符合规定！args="+args, null);
				}
			}else{
				return response(DbCodeUtil.CODE_0003, "刷新缓存的action为空！args="+args, null);
			}
		}else{
			return response(DbCodeUtil.CODE_0003, "刷新缓存的serviceName为空！args="+args, null);
		}
		return success("更新缓存数据成功！");
	}


	/**
	 * 重新加载缓存数据
	 * @param serviceName 缓存服务名称
	 */
	@RequestMapping("reloadCache")
	@ResponseBody
	public JSONObject reloadCache(@RequestParam String serviceName) {
		JSONObject respJSON = new JSONObject();
		ICacheService cacheService = null;

		if (Tools.notEmpty(serviceName)) {
			cacheService = (ICacheService) ApplicationContextUtil.getInstance().getBean(serviceName);

			if (cacheService != null ) {
				try {
					if (cacheService.refresh()) {
						respJSON.put("result", "success");
					} else {
						respJSON.put("result", "缓存刷新失败");
					}
				} catch (Exception e) {
					respJSON.put("result", "缓存刷新异常：" + e.getMessage());
				}
			} else {
				respJSON.put("result", "缓存服务不存在");
			}
		} else {
			respJSON.put("result", "缓存服务名称为空");
		}
		return respJSON;
	}


	/**
	 * 查询二进制图片并写入页面(查询的字段只能是一个)
	 * @param request
	 * @param response
	 */
	@ResponseBody
	@RequestMapping("queryImg")
	public void queryImg(HttpServletRequest request, HttpServletResponse response) {
		String args = request.getParameter("args");
		log.info("获取图片===>>>"+args);
		String[] params = null;
		JSONObject jsonParams = null;
		if( args == null ){
			args = request.getParameter("params");
			params = args.split("\\|");
			jsonParams = new JSONObject();
			
			jsonParams.put(ReqParams.SQL_ID, params[0]);

			if( params[1].length() > 0 ){
				jsonParams.put(ReqParams.WHERE_ID, params[1]);
			}

			if( params[2].length() > 0 ){
				jsonParams.put(ReqParams.ORDER_ID, params[2]);
			}

			if( params[3].length() > 0 ){
				jsonParams.put(ReqParams.PARAMS, params[3].split(","));
			}
		}
		log.debug("[queryImg]传进的参数==>" + args);

		try {
			List<Map<String,Object>> listMap = null;
			Map<String,Object> map = null;
			ServletOutputStream out = null;
			Object value = null;
			byte[] byteImg = null;
			
			if( jsonParams != null ){
				args = jsonParams.toJSONString();
			}
			
			if(!StringUtil.isNull(args)){
				
				if( jsonParams != null ){
					listMap = queryService.query( jsonParams );
				} else {
					listMap = queryByArgs(args);
				}
				
				if (listMap != null && listMap.size() > 0){
					map = listMap.get(0);
					if (map != null){
						value = map.get(map.keySet().iterator().next());
						if (value != null){
							byteImg = (byte[])value;
							response.setContentType("image/jpeg");
							out = response.getOutputStream();
							out.write(byteImg);
							out.flush();
							out.close();
						} else {
							log.warn("获取的图片流为空...");
						}
					}
				}
			}
		} catch (Exception e) {
			log.error("获取图片失败:", e);
		}
	}
	
	private List<Map<String,Object>> queryByArgs(String args){
		try {
			return queryService.query( JSONObject.parseObject(args) );
		} catch (Exception e) {
			log.error("获取图片失败:", e);
			return null;
		}
	}
	
	/**
	 * 查询二进制图片并写入页面(查询的字段只能是一个)
	 * @param request
	 * @param response
	 */
	@ResponseBody
	@RequestMapping("writeImg")
	public void writeImg(HttpServletRequest request, HttpServletResponse response) {
		String args = request.getParameter("args");
		log.info("获取图片===>>>"+args);
		String[] params = null;
		JSONObject jsonParams = null;
		if( args == null ){
			args = request.getParameter("params");
			params = args.split("\\|");
			jsonParams = new JSONObject();
			
			jsonParams.put(ReqParams.SQL_ID, params[0]);

			if( params[1].length() > 0 ){
				jsonParams.put(ReqParams.WHERE_ID, params[1]);
			}

			if( params[2].length() > 0 ){
				jsonParams.put(ReqParams.ORDER_ID, params[2]);
			}

			if( params[3].length() > 0 ){
				jsonParams.put(ReqParams.PARAMS, params[3].split(","));
			}
		}
		log.debug("[queryImg]传进的参数==>" + args);

		try {
			List<Map<String,Object>> listMap = null;
			byte[] byteImg = null;
			
			if( jsonParams != null ){
				args = jsonParams.toJSONString();
			}
			
			if(!StringUtil.isNull(args)){
				
				if( jsonParams != null ){
					listMap = queryService.query( jsonParams );
				} else {
					listMap = queryByArgs(args);
				}
//				String policeid = "";
				if (listMap != null && listMap.size() > 0){
//					for(Map<String,Object> map:listMap){
//							if(map != null){
//								policeid = map.get("mjbh").toString();
//								byteImg = (byte[])map.get("zp");
//								wirteImg_byte(byteImg,policeid);
//							}
//					}
					for(int i=0;i<listMap.size();i++){
//						map = listMap.get(i);
						if(listMap.get(i) != null){
//							policeid = (String) i;
							byteImg = (byte[])listMap.get(i).get("zp");
							wirteImg_byte(byteImg,String.valueOf(i+1));
						}
				}
				}
			}
		} catch (Exception e) {
			log.error("获取图片失败:", e);
		}
	}
	
	private void wirteImg_byte(byte[] img,String policeid){
		
		String fileDir = ConfigUtil.get("HTTP_DIR") + "PRISONERIMG/";
		String fileName = fileDir + policeid + ".jpg";
		InputStream in = null;
		FileOutputStream out = null;	
		byte[] buf = new byte[1024*1024]; //定义一个1M的缓冲区
		try {
			in  = new ByteArrayInputStream(img);
			out  = new FileOutputStream(fileName);
			int size = 0;
			while((size=in.read(buf)) != -1){
				out.write(buf,0,size);
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				if(out!=null) out.close();
				if(in!=null) in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
