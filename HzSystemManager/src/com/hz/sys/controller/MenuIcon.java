package com.hz.sys.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.apache.axis.encoding.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping("sys")
public class MenuIcon {
	@Value("${sys.images}")
	private String images;
	
	@RequestMapping("icons")	
	@ResponseBody
	public Object getIcon() throws IOException{
		String path=this.getClass().getResource("").getPath().replaceAll("%20"," ");
		path=path.substring(0, path.indexOf("WEB-INF"));
		
		File file=new File(path+images);
		
		return toBase64(file.listFiles());
	}
	
	
	public String[] toBase64(File[] files) throws IOException{
		FileInputStream in=null;
		
		String [] list=new String[files.length];
		
		byte[] data;
		
		for(int i=0,len=list.length;i<len;i++){
			
			in=new FileInputStream(files[i]);
			data=new byte[in.available()];
			in.read(data);
			in.close();
			list[i]=Base64.encode(data);
		}
		return list;
	}
}
