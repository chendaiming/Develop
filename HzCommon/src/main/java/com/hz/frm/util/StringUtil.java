package com.hz.frm.util;

import java.io.IOException;

import sun.misc.BASE64Decoder;

public final class StringUtil {
	
	private static BASE64Decoder decoder = new BASE64Decoder();
	
	/**
     * 判断是否为空字符串或者为空。
     * @param param：需要判断的字符串。
     * @return false：非空返回  true:空字符串或者null时返回。
     */
    public static boolean isNull(String param) {
    	if (null == param) {
            return true;
        } else if (0 == param.trim().length()) {
            return true;
        }
        return false;
    }  	
    /**
     * String解压缩后转换为Byte[](用于图片传输)
     * @param imgStr 需要转换的字符串
     * @return 转换后的byte[]
     */
	public static byte[] getByteForStr(String imgStr){
		if(!isNull(imgStr)){
			try {
				return decoder.decodeBuffer(imgStr);
			} catch (IOException e) {
				e.printStackTrace();
				return null;
			}
		}else{
			return null;
		}
	}
}
