package com.entlogic.jgxt.realtime.webServices;

public class RtInterfaceProxy implements com.entlogic.jgxt.realtime.webServices.RtInterface {
  private String _endpoint = null;
  private com.entlogic.jgxt.realtime.webServices.RtInterface rtInterface = null;
  
  public RtInterfaceProxy() {
    _initRtInterfaceProxy();
  }
  
  public RtInterfaceProxy(String endpoint) {
    _endpoint = endpoint;
    _initRtInterfaceProxy();
  }
  
  private void _initRtInterfaceProxy() {
    try {
      rtInterface = (new com.entlogic.jgxt.realtime.webServices.ServiceLocator()).getRtInterfaceImpPort();
      if (rtInterface != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)rtInterface)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)rtInterface)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (rtInterface != null)
      ((javax.xml.rpc.Stub)rtInterface)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public com.entlogic.jgxt.realtime.webServices.RtInterface getRtInterface() {
    if (rtInterface == null)
      _initRtInterfaceProxy();
    return rtInterface;
  }
  
  public java.lang.String invoke(java.lang.String arg0, java.lang.String arg1, java.lang.String arg2, java.lang.String arg3) throws java.rmi.RemoteException{
    if (rtInterface == null)
      _initRtInterfaceProxy();
    return rtInterface.invoke(arg0, arg1, arg2, arg3);
  }
  
  public java.lang.String test(java.lang.String arg0, java.lang.String arg1, java.lang.String arg2) throws java.rmi.RemoteException{
    if (rtInterface == null)
      _initRtInterfaceProxy();
    return rtInterface.test(arg0, arg1, arg2);
  }
  
  public java.lang.String regist(byte[] arg0) throws java.rmi.RemoteException{
    if (rtInterface == null)
      _initRtInterfaceProxy();
    return rtInterface.regist(arg0);
  }
  
  
}