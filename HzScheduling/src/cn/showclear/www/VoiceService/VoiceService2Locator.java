/**
 * VoiceService2Locator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class VoiceService2Locator extends org.apache.axis.client.Service implements cn.showclear.www.VoiceService.VoiceService2 {

    public VoiceService2Locator() {
    }


    public VoiceService2Locator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public VoiceService2Locator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for VoiceServiceSOAP
    private java.lang.String VoiceServiceSOAP_address = "http://10.43.162.232:8080/axis2/services/VoiceService2.VoiceServiceSOAP/";

    public java.lang.String getVoiceServiceSOAPAddress() {
        return VoiceServiceSOAP_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String VoiceServiceSOAPWSDDServiceName = "VoiceServiceSOAP";

    public java.lang.String getVoiceServiceSOAPWSDDServiceName() {
        return VoiceServiceSOAPWSDDServiceName;
    }

    public void setVoiceServiceSOAPWSDDServiceName(java.lang.String name) {
        VoiceServiceSOAPWSDDServiceName = name;
    }

    public cn.showclear.www.VoiceService.VoiceService2PortType getVoiceServiceSOAP() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(VoiceServiceSOAP_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getVoiceServiceSOAP(endpoint);
    }

    public cn.showclear.www.VoiceService.VoiceService2PortType getVoiceServiceSOAP(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            cn.showclear.www.VoiceService.VoiceServiceSOAPStub _stub = new cn.showclear.www.VoiceService.VoiceServiceSOAPStub(portAddress, this);
            _stub.setPortName(getVoiceServiceSOAPWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setVoiceServiceSOAPEndpointAddress(java.lang.String address) {
        VoiceServiceSOAP_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (cn.showclear.www.VoiceService.VoiceService2PortType.class.isAssignableFrom(serviceEndpointInterface)) {
                cn.showclear.www.VoiceService.VoiceServiceSOAPStub _stub = new cn.showclear.www.VoiceService.VoiceServiceSOAPStub(new java.net.URL(VoiceServiceSOAP_address), this);
                _stub.setPortName(getVoiceServiceSOAPWSDDServiceName());
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
        if ("VoiceServiceSOAP".equals(inputPortName)) {
            return getVoiceServiceSOAP();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "VoiceService2");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "VoiceServiceSOAP"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("VoiceServiceSOAP".equals(portName)) {
            setVoiceServiceSOAPEndpointAddress(address);
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
