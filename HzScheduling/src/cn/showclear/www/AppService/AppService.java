/**
 * AppService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public interface AppService extends javax.xml.rpc.Service {
    public java.lang.String getAppServiceSOAPAddress();

    public cn.showclear.www.AppService.AppServicePortType getAppServiceSOAP() throws javax.xml.rpc.ServiceException;

    public cn.showclear.www.AppService.AppServicePortType getAppServiceSOAP(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}
