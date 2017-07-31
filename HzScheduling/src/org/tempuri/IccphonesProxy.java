package org.tempuri;

public class IccphonesProxy implements org.tempuri.Iccphones {
  private String _endpoint = null;
  private org.tempuri.Iccphones iccphones = null;
  
  public IccphonesProxy() {
    _initIccphonesProxy();
  }
  
  public IccphonesProxy(String endpoint) {
    _endpoint = endpoint;
    _initIccphonesProxy();
  }
  
  private void _initIccphonesProxy() {
    try {
      iccphones = (new org.tempuri.IccphonesserviceLocator()).getIccphonesPort();
      if (iccphones != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)iccphones)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)iccphones)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (iccphones != null)
      ((javax.xml.rpc.Stub)iccphones)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public org.tempuri.Iccphones getIccphones() {
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones;
  }
  
  public java.lang.String callOutQun(java.lang.String sheetNum, java.lang.String sendNum, java.lang.String sphone, java.lang.String GH) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.callOutQun(sheetNum, sendNum, sphone, GH);
  }
  
  public java.lang.String callOutQun_Option(java.lang.String sheetNum, java.lang.String sphone, java.lang.String sOption) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.callOutQun_Option(sheetNum, sphone, sOption);
  }
  
  public java.lang.String callOut(java.lang.String sheetNum, java.lang.String sendNum, java.lang.String sphone, java.lang.String GH) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.callOut(sheetNum, sendNum, sphone, GH);
  }
  
  public java.lang.String clearCall(java.lang.String sheetNum) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.clearCall(sheetNum);
  }
  
  public java.lang.String intoCall(java.lang.String curSheetNum, java.lang.String callingSheetNum) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.intoCall(curSheetNum, callingSheetNum);
  }
  
  public java.lang.String lisCall(java.lang.String curSheetNum, java.lang.String callingSheetNum) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.lisCall(curSheetNum, callingSheetNum);
  }
  
  public java.lang.String doGetUserPhone(java.lang.String sPhone) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.doGetUserPhone(sPhone);
  }
  
  public java.lang.String doGetALLSheetNo() throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.doGetALLSheetNo();
  }
  
  public java.lang.String doGetALLCalling() throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.doGetALLCalling();
  }
  
  public java.lang.String clearCalling(java.lang.String sPhone) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.clearCalling(sPhone);
  }
  
  public java.lang.String changeVoice(java.lang.String sheetNum, java.lang.String voice) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.changeVoice(sheetNum, voice);
  }
  
  public java.lang.String getRecordData(java.lang.String phoneNum, java.lang.String date0, java.lang.String date1) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.getRecordData(phoneNum, date0, date1);
  }
  
  public java.lang.String getAreaForPhone(java.lang.String sPhone) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.getAreaForPhone(sPhone);
  }
  
  public java.lang.String setSheetTimeOut(java.lang.String sPhone) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.setSheetTimeOut(sPhone);
  }
  
  public java.lang.String getRecordPathByFile(java.lang.String dirfile) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.getRecordPathByFile(dirfile);
  }
  
  public java.lang.String getSheetStatus(java.lang.String sheetNum) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.getSheetStatus(sheetNum);
  }
  
  public java.lang.String sendDX(java.lang.String phone, java.lang.String msg) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.sendDX(phone, msg);
  }
  
  public java.lang.String doErrorPhone(java.lang.String sPhone, int nAction) throws java.rmi.RemoteException{
    if (iccphones == null)
      _initIccphonesProxy();
    return iccphones.doErrorPhone(sPhone, nAction);
  }
  
  
}