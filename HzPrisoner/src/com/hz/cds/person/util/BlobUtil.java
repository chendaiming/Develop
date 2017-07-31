package com.hz.cds.person.util;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
/**
 * Blob 转换工具类
 */
public class BlobUtil {
	/*
	 * 将Blob转换成图片文件
	 * blob : 数据库中的数据
	 * fileName : 图片文件名
	 */
	public static void fileName(Blob blob , File fileName){
		InputStream in = null;
		FileOutputStream fos = null;
		byte[] bytes;
		try {
			in = blob.getBinaryStream();
			fos = new FileOutputStream(fileName);
			bytes = new byte[1024*10];
			int i =0;
			while((i = in.read(bytes))!=-1){
				fos.write(bytes, 0, i);;
			}
			fos.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				fos.close();
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	/*
	 * 将Blob转换成byte[] 
	 */
	public static byte[] bytes(Blob blob){
		InputStream in = null;
		if(blob!=null){
			try {
				in = blob.getBinaryStream();
				byte[] bytes = new byte[(int) blob.length()];
				in.read(bytes);
				return bytes;
			} catch (SQLException | IOException e) {
				e.printStackTrace();
			}finally{
				try {
					if(in!=null){
						in.close();
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null; 
	}
}
