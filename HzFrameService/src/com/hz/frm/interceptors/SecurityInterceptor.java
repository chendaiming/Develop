package com.hz.frm.interceptors;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hz.cache.util.RedisUtil;

/**
 * 权限拦截器
 * @author zhongxy
 */
public class SecurityInterceptor implements HandlerInterceptor {
	
	@Value("${session.timeOut}")
	private int tiemOut = 3;

	private static final String LOGIN_KEY = "SYSTEM_LOGIN_USER";
	
	private static DateTimeFormatter df=DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	/**
	 * 完成页面的render后调用
	 */
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object object, Exception exception) throws Exception {

	}

	/**
	 * 在调用controller具体方法后拦截
	 */
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object object, ModelAndView modelAndView) throws Exception {
	
	}
	/**
	 * 在调用controller具体方法前拦截
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object object) throws Exception {
		response.setContentType("application/json; charset=utf-8");

		Cookie[] cookies = request.getCookies();
		Cookie cookie = null;
		String loginVal = "";
		String msg = "";

		if (cookies != null) {
			for(int i = 0, len = cookies.length; i < len; i++) {
				cookie = cookies[i];
				if (LOGIN_KEY.equals(cookie.getName())){
					loginVal = cookie.getValue();
					break;
				}
			}

//			for(Cookie cookie : cookies){
//				if ("sid".equals(cookie.getName())){
//					old = cookie.getValue();
//					break;
//				}
//			}
		}

//		JSONObject tip = new JSONObject();
		if (loginVal != "") {
			Map<String, Object> user = RedisUtil.getHashMap(LOGIN_KEY, loginVal);

			if (user != null) {
				if (!request.getRemoteHost().equals(user.get("loginip"))) {
//					cookie = new Cookie("sid","");
					cookie.setMaxAge(0);
					cookie.setValue("");
					response.addCookie(cookie);
//					tip.put("fail", "账户已在"+user.get("loginip")+"登录，您已被迫下线");
//					response.getWriter().append(tip.toJSONString());//被迫下线
//					return false;
					msg = "账户已在" + user.get("loginip") + "登录，您已被迫下线";
				}
			} else {
				msg = "登录超时";
			}

//			if (user == null) {//缓存已被清除登录超时
//				tip.put("fail", "登录超时");
//				response.getWriter().write(tip.toJSONString());//登录超时
//				return false;
//				msg = "登录超时";
//			}

//			else if (!request.getRemoteHost().equals(user.get("loginip"))) {
//				Cookie cookie = new Cookie("sid","");
//				cookie.setMaxAge(0);
//				response.addCookie(cookie);
//				tip.put("fail", "账户已在"+user.get("loginip")+"登录，您已被迫下线");
//				response.getWriter().append(tip.toJSONString());//被迫下线
//				return false;
//				msg = "账户已在" + user.get("loginip") + "登录，您已被迫下线";
//			}

//			if (tiemOut > 0) {
//				RedisUtil.getTemplate().expireAt("login_"+old+"_HASH", new Date(System.currentTimeMillis() + 1000 * 60 * tiemOut));//er十分钟后过期
//			}

		} else {
//			tip.put("fail", "-1");//未登录
//			response.getWriter().append(tip.toJSONString());//未登录
//			return false;
			msg = "-1";
		}

		if (msg.length() > 0) {
			JSONObject tip = new JSONObject();
			tip.put("fail", msg);
			response.getWriter().write(tip.toJSONString());//未登录
			return false;
		}
		return true;
	}
	
	
	public boolean cacheLog(HttpServletRequest request){
		
		String  args=request.getParameter("args");
		if(args!=null){
			if(args.startsWith("[")){
				return true;
			}
			JSONObject log;
			try{
				JSONObject json=JSON.parseObject("args");
				
				log=json.getJSONObject("oprLog");
				
			}catch(Exception e){
				return true;
			}
			
			if(log!=null){
				log.put("loginIp", request.getRemoteHost());
				
				log.put("operatedTime", df.format(LocalDateTime.now()));	
				
				log.put("systemTime", df.format(LocalDateTime.now()));
				
				RedisUtil.opsForList().leftPush("SYS_USER_OPERATED_LOG_LIST", log.toJSONString());
				if(log.getBooleanValue("only_log")){
					return false;
				}
			}
		}
		return true;
	}
	
}
