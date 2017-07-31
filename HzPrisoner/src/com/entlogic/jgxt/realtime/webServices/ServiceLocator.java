/**
 * ServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package com.entlogic.jgxt.realtime.webServices;

public class ServiceLocator extends org.apache.axis.client.Service implements com.entlogic.jgxt.realtime.webServices.Service {

    public ServiceLocator() {
    }


    public ServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public ServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for RtInterfaceImpPort
    private java.lang.String RtInterfaceImpPort_address = "http://10.41.239.46:4092/rti/service";

    public java.lang.String getRtInterfaceImpPortAddress() {
        return RtInterfaceImpPort_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String RtInterfaceImpPortWSDDServiceName = "RtInterfaceImpPort";

    public java.lang.String getRtInterfaceImpPortWSDDServiceName() {
        return RtInterfaceImpPortWSDDServiceName;
    }

    public void setRtInterfaceImpPortWSDDServiceName(java.lang.String name) {
        RtInterfaceImpPortWSDDServiceName = name;
    }

    public com.entlogic.jgxt.realtime.webServices.RtInterface getRtInterfaceImpPort() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(RtInterfaceImpPort_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getRtInterfaceImpPort(endpoint);
    }

    public com.entlogic.jgxt.realtime.webServices.RtInterface getRtInterfaceImpPort(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            com.entlogic.jgxt.realtime.webServices.ServiceSoapBindingStub _stub = new com.entlogic.jgxt.realtime.webServices.ServiceSoapBindingStub(portAddress, this);
            _stub.setPortName(getRtInterfaceImpPortWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setRtInterfaceImpPortEndpointAddress(java.lang.String address) {
        RtInterfaceImpPort_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (com.entlogic.jgxt.realtime.webServices.RtInterface.class.isAssignableFrom(serviceEndpointInterface)) {
                com.entlogic.jgxt.realtime.webServices.ServiceSoapBindingStub _stub = new com.entlogic.jgxt.realtime.webServices.ServiceSoapBindingStub(new java.net.URL(RtInterfaceImpPort_address), this);
                _stub.setPortName(getRtInterfaceImpPortWSDDServiceName());
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
        if ("RtInterfaceImpPort".equals(inputPortName)) {
            return getRtInterfaceImpPort();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://webServices.realtime.jgxt.entlogic.com/", "service");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://webServices.realtime.jgxt.entlogic.com/", "RtInterfaceImpPort"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("RtInterfaceImpPort".equals(portName)) {
            setRtInterfaceImpPortEndpointAddress(address);
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
