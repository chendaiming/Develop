/**
 * ScService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public interface ScService extends javax.xml.rpc.Service {
    public java.lang.String getScServiceSOAPAddress();

    public cn.showclear.www.ScService.ScServicePortType getScServiceSOAP() throws javax.xml.rpc.ServiceException;

    public cn.showclear.www.ScService.ScServicePortType getScServiceSOAP(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}
