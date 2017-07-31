package cn.showclear.www.VoiceService;

public class VoiceService2PortTypeProxy implements cn.showclear.www.VoiceService.VoiceService2PortType {
  private String _endpoint = null;
  private cn.showclear.www.VoiceService.VoiceService2PortType voiceService2PortType = null;
  
  public VoiceService2PortTypeProxy() {
    _initVoiceService2PortTypeProxy();
  }
  
  public VoiceService2PortTypeProxy(String endpoint) {
    _endpoint = endpoint;
    _initVoiceService2PortTypeProxy();
  }
  
  private void _initVoiceService2PortTypeProxy() {
    try {
      voiceService2PortType = (new cn.showclear.www.VoiceService.VoiceService2Locator()).getVoiceServiceSOAP();
      if (voiceService2PortType != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)voiceService2PortType)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)voiceService2PortType)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (voiceService2PortType != null)
      ((javax.xml.rpc.Stub)voiceService2PortType)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public cn.showclear.www.VoiceService.VoiceService2PortType getVoiceService2PortType() {
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType;
  }
  
  public cn.showclear.www.VoiceService.CommonResp configVideo(cn.showclear.www.VoiceService.ConfigVideoReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.configVideo(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp meetLock(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.meetLock(parameters);
  }
  
  public cn.showclear.www.VoiceService.JsonResp pushServQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.pushServQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp callInTurns(cn.showclear.www.VoiceService.CallInTurnsReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callInTurns(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp groupCancel(cn.showclear.www.VoiceService.GroupCancelReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.groupCancel(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp groupNotify(cn.showclear.www.VoiceService.GroupNotifyReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.groupNotify(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp callHangup(cn.showclear.www.VoiceService.CallHangupReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callHangup(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp meetEnd(cn.showclear.www.VoiceService.MeetIdReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.meetEnd(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp callRecord(cn.showclear.www.VoiceService.CallRecordReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callRecord(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp heartbeat(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.heartbeat(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp callAnswer(cn.showclear.www.VoiceService.CallAnswerReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callAnswer(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp logout(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.logout(parameters);
  }
  
  public cn.showclear.www.VoiceService.LoginResp login(cn.showclear.www.VoiceService.LoginReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.login(parameters);
  }
  
  public cn.showclear.www.VoiceService.JsonResp telStQuery(cn.showclear.www.VoiceService.TelStQueryReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.telStQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp sysConfigSet(cn.showclear.www.VoiceService.ConfigEntry[] parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.sysConfigSet(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp memberLevel(cn.showclear.www.VoiceService.MemberLevelReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.memberLevel(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp workStatusSet(cn.showclear.www.VoiceService.WorkStatusSetReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.workStatusSet(parameters);
  }
  
  public cn.showclear.www.VoiceService.CallinQueryResp callinQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callinQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.CalloutRecordQueryResp calloutRecordQuery(cn.showclear.www.VoiceService.CalloutRecordQueryReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.calloutRecordQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp telMonitor(cn.showclear.www.VoiceService.TelMonitorReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.telMonitor(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp meetRecord(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.meetRecord(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp meetVoice(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.meetVoice(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp groupCallInturns(cn.showclear.www.VoiceService.GroupCallInturnsReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.groupCallInturns(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp pushServReg(cn.showclear.www.VoiceService.PushServRegReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.pushServReg(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp callOperate(cn.showclear.www.VoiceService.CallOperateReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callOperate(parameters);
  }
  
  public cn.showclear.www.VoiceService.CallinMissedQueryResp callinMissedQuery(cn.showclear.www.VoiceService.CallinMissedQueryReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callinMissedQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.NotifyRecordOPResp notifyRecordOP(cn.showclear.www.VoiceService.NotifyRecordOPReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.notifyRecordOP(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp groupCall(cn.showclear.www.VoiceService.GroupCallReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.groupCall(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp memberLeave(cn.showclear.www.VoiceService.MemberLeaveReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.memberLeave(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp groupNotifyEnd(cn.showclear.www.VoiceService.GroupNotifyEndReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.groupNotifyEnd(parameters);
  }
  
  public cn.showclear.www.VoiceService.CallinTalkQueryResp callinTalkQuery(cn.showclear.www.VoiceService.CallinTalkQueryReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callinTalkQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp callTransfer(cn.showclear.www.VoiceService.CallTransferReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callTransfer(parameters);
  }
  
  public cn.showclear.www.VoiceService.SysConfigLoadResp sysConfigLoad(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.sysConfigLoad(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp call(cn.showclear.www.VoiceService.CallReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.call(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp meetDelete(cn.showclear.www.VoiceService.MeetIdReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.meetDelete(parameters);
  }
  
  public cn.showclear.www.VoiceService.CallinQueryResp callinXDQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callinXDQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp memberJoin(cn.showclear.www.VoiceService.MemberJoinReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.memberJoin(parameters);
  }
  
  public cn.showclear.www.VoiceService.MeetQueryResp meetQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.meetQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.MeetCreateResp meetCreate(cn.showclear.www.VoiceService.MeetCreateReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.meetCreate(parameters);
  }
  
  public cn.showclear.www.VoiceService.CommonResp callHold(cn.showclear.www.VoiceService.CallHoldReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callHold(parameters);
  }
  
  public cn.showclear.www.VoiceService.CallplatRecordQueryResp callplatRecordQuery(cn.showclear.www.VoiceService.CallplatRecordQueryReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.callplatRecordQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.NotifyResultQueryResp notifyResultQuery(cn.showclear.www.VoiceService.NotifyResultQueryReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.notifyResultQuery(parameters);
  }
  
  public cn.showclear.www.VoiceService.VersionResp version(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException{
    if (voiceService2PortType == null)
      _initVoiceService2PortTypeProxy();
    return voiceService2PortType.version(parameters);
  }
  
  
}