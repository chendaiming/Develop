package com.hz.frm.util;

import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

public class CryptUtil {

	public static final String ALGORITHM = "AES";

	/**
	 * decrypt the ciphertext bytes to the plaintext bytes
	 * 
	 * @param data
	 *            the ciphertext bytes
	 * @param key
	 *            the key for decrypting, got from initKey(...)
	 * @return the plaintext bytes
	 * 
	 * @throws NoSuchAlgorithmException
	 * @throws GeneralSecurityException
	 */
	public static byte[] decrypt(byte[] data, String key)
			throws NoSuchAlgorithmException, GeneralSecurityException {
		Key k = toKey(key);

		Cipher cipher = Cipher.getInstance(ALGORITHM);
		cipher.init(Cipher.DECRYPT_MODE, k);

		return cipher.doFinal(data);
	}

	/**
	 * decrypt the ciphertext String to the plaintext String
	 * 
	 * @param base64String
	 *            the ciphertext String which is encoded by Base64
	 * @param key
	 * @return the plaintext String
	 * 
	 * @throws NoSuchAlgorithmException
	 * @throws GeneralSecurityException
	 */
	public static String decrypt(String base64String, String key)
			throws NoSuchAlgorithmException, GeneralSecurityException {

		return new String(decrypt(Base64.decodeBase64(base64String), key));
	}

	/**
	 * encrypt the plaintext bytes to the ciphertext bytes
	 * 
	 * @param data
	 *            the plaintext bytes
	 * @param key
	 * @return the ciphertext bytes
	 * 
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchPaddingException
	 * @throws InvalidKeyException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 */
	public static byte[] encrypt(byte[] data, String key)
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
		Key k = toKey(key);

		Cipher cipher = Cipher.getInstance(ALGORITHM);
		cipher.init(Cipher.ENCRYPT_MODE, k);

		return cipher.doFinal(data);
	}

	/**
	 * encrypt the plaintext String to the ciphertext String which is encoded by
	 * Base64
	 * 
	 * @param string
	 *            the plaintext String
	 * @param key
	 * @return the ciphertext String which is encoded by Base64
	 * 
	 * @throws NoSuchAlgorithmException
	 * @throws NoSuchPaddingException
	 * @throws InvalidKeyException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 */
	public static String encrypt(String string, String key)
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidKeyException, IllegalBlockSizeException, BadPaddingException {

		return Base64.encodeBase64String(encrypt(string.getBytes(), key));
	}

	public static String initKey() throws NoSuchAlgorithmException {
		return initKey(null);
	}

	/**
	 * init a key for crypt
	 * 
	 * @param seed
	 * @return a String key encoded by Base64
	 * @throws NoSuchAlgorithmException
	 */
	public static String initKey(String seed) throws NoSuchAlgorithmException {
		SecureRandom secureRandom = null;

		if (seed != null) {
			secureRandom = new SecureRandom(Base64.decodeBase64((seed)));
		} else {
			secureRandom = new SecureRandom();
		}

		KeyGenerator kg = KeyGenerator.getInstance(ALGORITHM);
		kg.init(secureRandom);

		SecretKey secretKey = kg.generateKey();

		return Base64.encodeBase64String((secretKey.getEncoded()));
	}

	/**
	 * convert the String from initKey(...) to the Key
	 * 
	 * @param key
	 * @return
	 */
	private static Key toKey(String key) {

		return new SecretKeySpec(Base64.decodeBase64(key), ALGORITHM);
	}
}