/**
 * Service.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package com.entlogic.jgxt.realtime.webServices;

public interface Service extends javax.xml.rpc.Service {
    public java.lang.String getRtInterfaceImpPortAddress();

    public com.entlogic.jgxt.realtime.webServices.RtInterface getRtInterfaceImpPort() throws javax.xml.rpc.ServiceException;

    public com.entlogic.jgxt.realtime.webServices.RtInterface getRtInterfaceImpPort(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}
