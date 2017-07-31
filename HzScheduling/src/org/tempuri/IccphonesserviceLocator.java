/**
 * IccphonesserviceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package org.tempuri;

public class IccphonesserviceLocator extends org.apache.axis.client.Service implements org.tempuri.Iccphonesservice {

    public IccphonesserviceLocator() {
    }


    public IccphonesserviceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public IccphonesserviceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for IccphonesPort
    private java.lang.String IccphonesPort_address = "http://10.43.239.31:8080/soap/Iccphones";

    public java.lang.String getIccphonesPortAddress() {
        return IccphonesPort_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String IccphonesPortWSDDServiceName = "IccphonesPort";

    public java.lang.String getIccphonesPortWSDDServiceName() {
        return IccphonesPortWSDDServiceName;
    }

    public void setIccphonesPortWSDDServiceName(java.lang.String name) {
        IccphonesPortWSDDServiceName = name;
    }

    public org.tempuri.Iccphones getIccphonesPort() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(IccphonesPort_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getIccphonesPort(endpoint);
    }

    public org.tempuri.Iccphones getIccphonesPort(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            org.tempuri.IccphonesbindingStub _stub = new org.tempuri.IccphonesbindingStub(portAddress, this);
            _stub.setPortName(getIccphonesPortWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setIccphonesPortEndpointAddress(java.lang.String address) {
        IccphonesPort_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (org.tempuri.Iccphones.class.isAssignableFrom(serviceEndpointInterface)) {
                org.tempuri.IccphonesbindingStub _stub = new org.tempuri.IccphonesbindingStub(new java.net.URL(IccphonesPort_address), this);
                _stub.setPortName(getIccphonesPortWSDDServiceName());
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
        if ("IccphonesPort".equals(inputPortName)) {
            return getIccphonesPort();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://tempuri.org/", "Iccphonesservice");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://tempuri.org/", "IccphonesPort"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("IccphonesPort".equals(portName)) {
            setIccphonesPortEndpointAddress(address);
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
