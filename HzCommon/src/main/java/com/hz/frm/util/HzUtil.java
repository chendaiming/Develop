package com.hz.frm.util;

import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.apache.commons.codec.binary.Base64;

public class HzUtil {
    private static final String CRYPT_SPLITTER = " ";

    private static final String KEY = "XqgAX6kXyKyZp76JJFr0bA==;";

//    private static final Logger logger = LoggerFactory.getLogger(HzUtil.class);

    /**
     * decrypt the string
     * 
     * @param encryptedStr
     * @return null if encryptedStr is invalid
     * @throws GeneralSecurityException
     * @throws NoSuchAlgorithmException
     */
    public static String decrypt(String encryptedStr)
            throws NoSuchAlgorithmException, GeneralSecurityException
    {

        encryptedStr = encryptedStr.trim();

        // the encrypted string is split to two part
        // the first part is the length of the second part
        int posSpliter = encryptedStr.indexOf(CRYPT_SPLITTER);

        int lengthStr = 0;
        String encriptedStr = null;

        if (posSpliter > 0)
        {
            lengthStr = Integer.parseInt(new String(Base64
                    .decodeBase64(encryptedStr.substring(0, posSpliter))));
            encriptedStr = encryptedStr.substring(posSpliter + 1,
                    encryptedStr.length());
        } else
            return null;

        // decrypt the valid string
        if (posSpliter > 0 && encriptedStr != null
                && lengthStr == encriptedStr.length())
            return CryptUtil.decrypt(encriptedStr, KEY);

        return null;
    }

    public static String encrypt(String str) throws InvalidKeyException,
            NoSuchAlgorithmException, NoSuchPaddingException,
            IllegalBlockSizeException, BadPaddingException
    {

        str = str.trim();
        String encryptedStr = CryptUtil.encrypt(str, KEY);

        // the encrypted string is split to two part
        return Base64.encodeBase64String(String.valueOf(encryptedStr.length())
                .getBytes()) + CRYPT_SPLITTER + encryptedStr;
    }
    

    public static void main(String[] args) throws Exception{
		System.out.println(HzUtil.encrypt("prison_s2j"));
	}
}
