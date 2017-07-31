/**
 * RtInterface.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package com.entlogic.jgxt.realtime.webServices;

public interface RtInterface extends java.rmi.Remote {
    public java.lang.String invoke(java.lang.String arg0, java.lang.String arg1, java.lang.String arg2, java.lang.String arg3) throws java.rmi.RemoteException;
    public java.lang.String test(java.lang.String arg0, java.lang.String arg1, java.lang.String arg2) throws java.rmi.RemoteException;
    public java.lang.String regist(byte[] arg0) throws java.rmi.RemoteException;
}
