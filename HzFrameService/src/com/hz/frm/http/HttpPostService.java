package com.hz.frm.http;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

@Service
public class HttpPostService {
	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(HttpPostService.class);
	

	public String httpPost (@RequestParam() String url,String param) {
        BufferedReader in = null;
        PrintWriter out = null;  
        String result = "";
        String line = "";

        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection connection = realUrl.openConnection();

            // 设置通用的请求属性
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            
            // 发送POST请求必须设置如下两行  
            connection.setDoOutput(true);  
            connection.setDoInput(true); 
            
            // 获取URLConnection对象对应的输出流  
            out = new PrintWriter(connection.getOutputStream());  
            // 发送请求参数  
            out.print(param);  
            // flush输出流的缓冲  
            out.flush();  
            // 建立实际的连接
            connection.connect();

            // 定义 BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(connection.getInputStream()));

            while ((line = in.readLine()) != null) {
            	result = result.concat(line);
            }
        } catch (Exception e) {
        	log.error("HTTP POST请求失败：" + e);
        	result = e.getMessage();
        } finally {
            try {
                if (out != null) out.close();  
            	if (in != null) in.close();
            } catch (Exception e) {
            	log.error("HTTP POST请求释放资源失败：" + e);
            }
        }
        return result;
	}
}
