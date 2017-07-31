package com.hz.frm.util;

import java.io.IOException;
import java.security.GeneralSecurityException;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * 类说明:处理加解密相关的工具类 
 */
public class SecurityTools {
	
	public static String base64Encode(String message){
		return base64Encode(message.getBytes());
	}
	public static String base64Encode(byte[] message){
		sun.misc.BASE64Encoder encoder = new BASE64Encoder(); 
		return encoder.encode(message);
	}
	
	public static String base64Decode(String message) throws IOException{
		sun.misc.BASE64Decoder decoder = new BASE64Decoder();
		return new String(decoder.decodeBuffer(message));
	}
	public static byte[] base64DecodeToBytes(String message) throws IOException{
		sun.misc.BASE64Decoder decoder = new BASE64Decoder();
		return decoder.decodeBuffer(message);
	}
	public static String byteToHex(byte[] message){
		String hs = "";
		String stmp = "";
		for(int i=0;i<message.length;i++){
			stmp = (Integer.toHexString(message[i]& 0XFF));
			if(stmp.length()==1)
				hs=hs+"0"+stmp ;
			else
				hs=hs+stmp;
		}
		return hs.toUpperCase();
	}
	
	public static String genMD5(String message) throws GeneralSecurityException{
		byte[] b=null;
		if(message!=null){
			b=message.getBytes();
		}
		java.security.MessageDigest md= java.security.MessageDigest.getInstance("MD5");
		md.update(b);
		byte[] out=md.digest();
		return byteToHex(out);
	}
	public static String encrypt(String message){
		return message ;
	}

	public static byte[] encrypt(byte[] message){
		return message ;
	}
	
	public static String decrypt(String message){
		return message ;
	}

	public static byte[] decrypt(byte[] message){
		return message ;
	}
}
