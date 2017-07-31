package com.hz.cds.talkback.alarm;

public class ITCException extends Exception {

	private static final long serialVersionUID = -4021272226887174107L;

	private String code = "";
	private String message = "";

	public ITCException (String code, String message) {
		this.code = code;
		this.message = message;
	}

	public ITCException (String message) {
		this.message = message;
	}


	public String getCode() {
		return code;
	}
	public String getMessage() {
		return message;
	}
}
