/**
 * ScServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class ScServiceLocator extends org.apache.axis.client.Service implements cn.showclear.www.ScService.ScService {

    public ScServiceLocator() {
    }


    public ScServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public ScServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for ScServiceSOAP
    private java.lang.String ScServiceSOAP_address = "http://10.43.162.232:8080/axis2/services/ScService.ScServiceSOAP/";

    public java.lang.String getScServiceSOAPAddress() {
        return ScServiceSOAP_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String ScServiceSOAPWSDDServiceName = "ScServiceSOAP";

    public java.lang.String getScServiceSOAPWSDDServiceName() {
        return ScServiceSOAPWSDDServiceName;
    }

    public void setScServiceSOAPWSDDServiceName(java.lang.String name) {
        ScServiceSOAPWSDDServiceName = name;
    }

    public cn.showclear.www.ScService.ScServicePortType getScServiceSOAP() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(ScServiceSOAP_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getScServiceSOAP(endpoint);
    }

    public cn.showclear.www.ScService.ScServicePortType getScServiceSOAP(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            cn.showclear.www.ScService.ScServiceSOAPStub _stub = new cn.showclear.www.ScService.ScServiceSOAPStub(portAddress, this);
            _stub.setPortName(getScServiceSOAPWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setScServiceSOAPEndpointAddress(java.lang.String address) {
        ScServiceSOAP_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (cn.showclear.www.ScService.ScServicePortType.class.isAssignableFrom(serviceEndpointInterface)) {
                cn.showclear.www.ScService.ScServiceSOAPStub _stub = new cn.showclear.www.ScService.ScServiceSOAPStub(new java.net.URL(ScServiceSOAP_address), this);
                _stub.setPortName(getScServiceSOAPWSDDServiceName());
                return _stub;
            }
        }
        catch (java.lang.Throwable t) {
            throw new javax.xml.rpc.ServiceException(t);
        }
        throw new javax.xml.rpc.ServiceException("There is no stub implementation for the interface:  " + (serviceEndpointInterface == null ? "null" : serviceEndpointInterface.getName()));
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(javax.xml.namespace.QName portName, Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        if (portName == null) {
            return getPort(serviceEndpointInterface);
        }
        java.lang.String inputPortName = portName.getLocalPart();
        if ("ScServiceSOAP".equals(inputPortName)) {
            return getScServiceSOAP();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ScService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ScServiceSOAP"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("ScServiceSOAP".equals(portName)) {
            setScServiceSOAPEndpointAddress(address);
        }
        else 
{ // Unknown Port Name
            throw new javax.xml.rpc.ServiceException(" Cannot set Endpoint Address for Unknown Port" + portName);
        }
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(javax.xml.namespace.QName portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        setEndpointAddress(portName.getLocalPart(), address);
    }

}
