package com.hz.sys.controller;

import java.math.BigInteger;
import java.net.URLDecoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;
import com.hz.db.service.IUpdateService;
import com.hz.db.service.impl.QueryServiceImpl;
import com.hz.frm.util.Tools;
import com.hz.frm.utils.TokenUtils;
import com.hz.sys.log.LoginOperatedLogService;

@Controller
@RequestMapping("sys/")
public class Login {
	
	private static final Logger log = LoggerFactory.getLogger(Login.class);

	private static final String LOGIN_KEY = "SYSTEM_LOGIN_USER";

	@Value("${session.timeOut}")
	private int timeOut=3;//超时时间3分钟

	@Value("${superAdmin.name}")
	private String superAdmin;//超级管理员账户

	@Value("${superAdmin.password}")
	private String superAdminpassword;//超级管理员账户

	@Resource
	private QueryServiceImpl service;

	@Resource
	private IUpdateService updateService;

	@Resource
	private LoginOperatedLogService operatedLogService;


	@RequestMapping("login")
	@ResponseBody
	public String login(HttpServletRequest request, HttpServletResponse response, String userName, String password, boolean force) throws Exception{
		return validate(request, response, userName, password, force);
	}


	@RequestMapping("logout")
	@ResponseBody
    public String logout(HttpServletRequest request){
//		Cookie[] cookies=request.getCookies();
//		for(Cookie cookie:cookies){
//			if(cookie.getName()=="sid"){
//				Map<String, Object> userInfo = getUserInfo(cookie.getValue());
//
//				if (userInfo != null) {
//					operatedLogService.put(userInfo, "退出系统");
//				}
//
//				RedisUtil.deleteHash(cookie.getValue());
//				break;
//			}
//		}

		String userName = request.getParameter("userName");
		Map<String, Object> userInfo = getUserInfo(userName);

		if (userInfo != null) {
			operatedLogService.put(userInfo, "退出系统");
			RedisUtil.deleteHash(LOGIN_KEY, userName);
		}

		return "-1";
	}

	//新增用户
	@RequestMapping("update")
	private String addUser(@RequestParam("userInfo") String userInfo, @RequestParam(required=false) String name, @RequestParam(required=false) String password) throws NoSuchAlgorithmException{
		if(password!=null){
			MessageDigest md = MessageDigest.getInstance("MD5");
			String[] arr=userInfo.split(",");
			//userInfo=userInfo.replace(arr[5].split(":")[1], "\""+new BigInteger(1,md.digest((name+"-"+password).getBytes())).toString(32)+"\"");
			arr[6]=arr[6].replace(password, new BigInteger(1,md.digest((password+"|"+name).getBytes())).toString(32));
			
			userInfo=org.apache.commons.lang.StringUtils.join(arr,",");
		}
		return "forward:../dbCtrl/updateByParamKey?args="+userInfo;
	}


	//单点登录接口
	@RequestMapping("singleLogin")
	public String redirect(@RequestParam(required=false)String userName,@RequestParam(required=false) String password,HttpServletRequest request,HttpServletResponse response,Model model) throws Exception{
		model.addAttribute("ck", this.validate(request, response, userName, password, false));
		return "page/singleLogin";
	}


	@ResponseBody
	@RequestMapping("tokenLogin")
	public String checkLogined(HttpServletRequest request, HttpServletResponse response) {
		JSONObject resp = new JSONObject();
		try {
			String token = request.getParameter("token");
			String userName = null;
			String pwd = null;
			String[] tokenInfo = null;

			if (token != null) {
				tokenInfo = TokenUtils.decodeTokenFromUrl(token);// 解析token令牌
				log.debug("检查用户登录.解析用户令牌：" + JSON.toJSONString(tokenInfo));

				userName = tokenInfo[0].split("\\|")[0];
				pwd = tokenInfo[0].split("\\|")[1];

				return validate(request, response, userName, pwd, false);
			}

		} catch (Exception e) {
			log.error("令牌登录异常:"+e.getMessage());
			resp.put("msg", e.getMessage());
			return resp.toJSONString();
		}

		resp.put("msg", "令牌登录失败");
		return resp.toJSONString();
	}


	/**
	 * 验证用户登录
	 * @param loginIp 登录地址
	 * @param userName	登录账号
	 * @param password	登录密码
	 * @param force		强制登录：true是、false否
	 * @return
	 * @throws Exception
	 */
	private String validate(HttpServletRequest request, HttpServletResponse response, String userName, String password, boolean force) throws Exception{
		userName = URLDecoder.decode(userName, "utf-8");

//		String cookieKey = Base64.encode((userName + password).getBytes());
		Map<String, Object> userInfo = getUserInfo(userName);
		Cookie cookie = new Cookie(LOGIN_KEY, userName);
		String loginIp = request.getRemoteHost();		

		cookie.setPath("/");
		response.addCookie(cookie);


		if (userInfo != null && !force) {//判断当前账户是否已经被登录
			if (loginIp.equals(userInfo.get("loginip"))) {//如果用户已经登录再次登录则直接返回
				//return JSON.toJSONString(userInfo);
			} else {
				JSONObject tip = new JSONObject();
				tip.put("ip", userInfo.get("loginip"));
				return tip.toString();//账户已经被登录 
			}
		}


		if (superAdmin.equals(userName) && superAdminpassword.equals(password)) {//如果为超级管理员，只设置数据访问权限
			userInfo = new HashMap<String,Object>();
			userInfo.put("loginip", loginIp);
			userInfo.put("data_auth",3);//数据权限等级为3
			userInfo.put("user_name","超级管理员");

//			JSONObject param = JSONObject.parseObject("{sqlId:'query_user_menu',orderId:'0'}");
//			List<Map<String,Object>> list = service.query(param);
//			userInfo.put("menus", list);

			return saveToRedis(userName, JSON.toJSONString(userInfo));

		} else {
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			password = new BigInteger(1, md5.digest((password + "|" + userName).getBytes())).toString(32);
//			updateService.updateByParamKey(JSONObject.parseObject("{params:[{ip:'"+userInfo.get("loginip")+"',name:'"+userName+"',pwd:'"+password+"'}],sqlId:'update_login_user'}"));

			/*
			 * 查询登录用户信息
			 */
//			Map<String, Object> map= service.queryMap(JSONObject.parseObject("{params:['"+userName+"','"+password+"'],sqlId:'query_login_user'}"));
			List<Object> queryParams = new ArrayList<Object>();
			Map<String, Object> queryResult= null;

			queryParams.add(userName);
			queryParams.add(password);
			queryResult= service.queryMap("query_login_user", queryParams);

			if (queryResult != null) {
				queryResult.put("loginip", loginIp);
				return parseUser(queryResult, userName);
			}
		}

		return "-1";
	}


	/*
	 * 获取用户信息
	 */
	private Map<String, Object> getUserInfo (String userName) {
		return RedisUtil.getHashMap(LOGIN_KEY, userName);
	}


	/*
	 * 解析用户信息
	 */
	private String parseUser(Map<String, Object> userInfo, String key) throws Exception{
		List<Map<String,Object>> queryList = null;
		List<Object> params = null;

		String userId = null;
		String used = null;
		Date postdate = null;

		userId = Tools.toStr(userInfo.get("id"));
		if (userId == null || userId.length() <= 0) return "-1";//如果查询未空，用户名或密码不正确，请重试

		used = Tools.toStr(userInfo.get("used"));
		if (used == null || used.equals("0")) return "-2";// 账户未启用，请联系管理员

		postdate = (Date) userInfo.get("postdate");
		if (postdate != null && postdate.getTime() < System.currentTimeMillis()) return "-3";//账户已过期，请联系管理员


		/*
		 * 记录用户最后登录信息
		 */
		params = new ArrayList<Object>();
		params.add(userInfo.get("loginip"));
		params.add(userId);
		updateService.update("update_last_login_info", params);

		/*
		 * 查询用户绑定的角色
		 */
		params.remove(0);
		queryList = service.query("query_user_bind_roles", params);

		if (queryList != null) {
			userInfo.put("roles", queryList);
		}

		operatedLogService.put(userInfo, "登录系统");

		return saveToRedis(Tools.toStr(userInfo.get("user_name")), JSON.toJSONString(userInfo));
	}

	//保存用户会话
	private String saveToRedis(String userName, String userInfo){

		RedisUtil.putHash(LOGIN_KEY, userName, userInfo);//加入缓存
//		RedisUtil.getTemplate().expireAt("login_"+key+"_HASH", new Date(System.currentTimeMillis() + 1000 * 60 * timeOut));
		return userInfo;
	}
	
	
	private static DateTimeFormatter df=DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	@RequestMapping("log")
	@ResponseBody
	public String cacheLog(HttpServletRequest request,@RequestParam String oprLog){
		
		JSONObject log=JSON.parseObject(oprLog);
		
		if(log!=null){
			log.put("loginIp", request.getRemoteHost());
			
			log.put("operatedTime", df.format(LocalDateTime.now()));	
			
			log.put("systemTime", df.format(LocalDateTime.now()));
			
			RedisUtil.opsForList().leftPush("SYS_USER_OPERATED_LOG_LIST", log.toJSONString());
		}
		return "";
	}
}
