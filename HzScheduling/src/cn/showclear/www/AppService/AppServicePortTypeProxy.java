package cn.showclear.www.AppService;

public class AppServicePortTypeProxy implements cn.showclear.www.AppService.AppServicePortType {
  private String _endpoint = null;
  private cn.showclear.www.AppService.AppServicePortType appServicePortType = null;
  
  public AppServicePortTypeProxy() {
    _initAppServicePortTypeProxy();
  }
  
  public AppServicePortTypeProxy(String endpoint) {
    _endpoint = endpoint;
    _initAppServicePortTypeProxy();
  }
  
  private void _initAppServicePortTypeProxy() {
    try {
      appServicePortType = (new cn.showclear.www.AppService.AppServiceLocator()).getAppServiceSOAP();
      if (appServicePortType != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)appServicePortType)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)appServicePortType)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (appServicePortType != null)
      ((javax.xml.rpc.Stub)appServicePortType)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public cn.showclear.www.AppService.AppServicePortType getAppServicePortType() {
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType;
  }
  
  public cn.showclear.www.AppService.IdResp notifyRecordUpload(cn.showclear.www.AppService.NotifyRecordUploadReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.notifyRecordUpload(parameters);
  }
  
  public cn.showclear.www.AppService.FileDownloadResp fileDownload(cn.showclear.www.AppService.FileDownloadReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.fileDownload(parameters);
  }
  
  public cn.showclear.www.AppService.IdResp faxDelete(cn.showclear.www.AppService.FaxDelReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxDelete(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp sysConfigSet(cn.showclear.www.AppService.ConfigEntry[] parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.sysConfigSet(parameters);
  }
  
  public cn.showclear.www.AppService.IdResp msgDelete(cn.showclear.www.AppService.MsgDelReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgDelete(parameters);
  }
  
  public cn.showclear.www.AppService.MsgRecvQueryResp msgRecvQuery(cn.showclear.www.AppService.MsgRecvQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgRecvQuery(parameters);
  }
  
  public cn.showclear.www.AppService.RecordQueryResp recordQuery(cn.showclear.www.AppService.RecordQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.recordQuery(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp recordDelete(cn.showclear.www.AppService.RecordDeleteReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.recordDelete(parameters);
  }
  
  public cn.showclear.www.AppService.NotifyRecordQueryResp notifyRecordQuery(cn.showclear.www.AppService.NotifyRecordQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.notifyRecordQuery(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp msgRecvRead(cn.showclear.www.AppService.IdStrReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgRecvRead(parameters);
  }
  
  public cn.showclear.www.AppService.RecordMeetQueryResp recordMeetQuery(cn.showclear.www.AppService.RecordMeetQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.recordMeetQuery(parameters);
  }
  
  public cn.showclear.www.AppService.JsonResp msgSendStatus(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgSendStatus(parameters);
  }
  
  public cn.showclear.www.AppService.JsonResp faxTranSend(cn.showclear.www.AppService.FaxTranSendReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxTranSend(parameters);
  }
  
  public cn.showclear.www.AppService.MsgSendQueryResp msgSendQuery(cn.showclear.www.AppService.MsgSendQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgSendQuery(parameters);
  }
  
  public cn.showclear.www.AppService.VersionResp version() throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.version();
  }
  
  public cn.showclear.www.AppService.CallinMissedQueryResp callinMissedQuery(cn.showclear.www.AppService.CallinMissedQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.callinMissedQuery(parameters);
  }
  
  public cn.showclear.www.AppService.JsonResp queryPushInfo(cn.showclear.www.AppService.QueryPushInfoReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.queryPushInfo(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp faxReSend(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxReSend(parameters);
  }
  
  public cn.showclear.www.AppService.SysConfigLoadResp sysConfigLoad() throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.sysConfigLoad();
  }
  
  public cn.showclear.www.AppService.IdResp msgSend(cn.showclear.www.AppService.MsgSendReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgSend(parameters);
  }
  
  public cn.showclear.www.AppService.FaxSendStatusResp faxSendStatus(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxSendStatus(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp regPushService(cn.showclear.www.AppService.RegPushServiceReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.regPushService(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp msgReSend(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgReSend(parameters);
  }
  
  public cn.showclear.www.AppService.FaxRecvQueryResp faxRecvQuery(cn.showclear.www.AppService.FaxRecvQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxRecvQuery(parameters);
  }
  
  public cn.showclear.www.AppService.FaxSendQueryResp faxSendQuery(cn.showclear.www.AppService.FaxSendQueryReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxSendQuery(parameters);
  }
  
  public cn.showclear.www.AppService.JsonResp faxSend(cn.showclear.www.AppService.FaxSendReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxSend(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp faxRecvRead(cn.showclear.www.AppService.IdStrReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.faxRecvRead(parameters);
  }
  
  public cn.showclear.www.AppService.CommonResp msgDeleteTel(cn.showclear.www.AppService.MsgDelTelReq parameters) throws java.rmi.RemoteException{
    if (appServicePortType == null)
      _initAppServicePortTypeProxy();
    return appServicePortType.msgDeleteTel(parameters);
  }
  
  
}