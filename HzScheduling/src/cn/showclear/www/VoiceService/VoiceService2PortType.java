/**
 * VoiceService2PortType.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public interface VoiceService2PortType extends java.rmi.Remote {
    public cn.showclear.www.VoiceService.CommonResp configVideo(cn.showclear.www.VoiceService.ConfigVideoReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp meetLock(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.JsonResp pushServQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp callInTurns(cn.showclear.www.VoiceService.CallInTurnsReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp groupCancel(cn.showclear.www.VoiceService.GroupCancelReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp groupNotify(cn.showclear.www.VoiceService.GroupNotifyReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp callHangup(cn.showclear.www.VoiceService.CallHangupReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp meetEnd(cn.showclear.www.VoiceService.MeetIdReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp callRecord(cn.showclear.www.VoiceService.CallRecordReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp heartbeat(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp callAnswer(cn.showclear.www.VoiceService.CallAnswerReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp logout(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.LoginResp login(cn.showclear.www.VoiceService.LoginReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.JsonResp telStQuery(cn.showclear.www.VoiceService.TelStQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp sysConfigSet(cn.showclear.www.VoiceService.ConfigEntry[] parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp memberLevel(cn.showclear.www.VoiceService.MemberLevelReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp workStatusSet(cn.showclear.www.VoiceService.WorkStatusSetReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CallinQueryResp callinQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CalloutRecordQueryResp calloutRecordQuery(cn.showclear.www.VoiceService.CalloutRecordQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp telMonitor(cn.showclear.www.VoiceService.TelMonitorReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp meetRecord(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp meetVoice(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp groupCallInturns(cn.showclear.www.VoiceService.GroupCallInturnsReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp pushServReg(cn.showclear.www.VoiceService.PushServRegReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp callOperate(cn.showclear.www.VoiceService.CallOperateReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CallinMissedQueryResp callinMissedQuery(cn.showclear.www.VoiceService.CallinMissedQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.NotifyRecordOPResp notifyRecordOP(cn.showclear.www.VoiceService.NotifyRecordOPReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp groupCall(cn.showclear.www.VoiceService.GroupCallReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp memberLeave(cn.showclear.www.VoiceService.MemberLeaveReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp groupNotifyEnd(cn.showclear.www.VoiceService.GroupNotifyEndReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CallinTalkQueryResp callinTalkQuery(cn.showclear.www.VoiceService.CallinTalkQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp callTransfer(cn.showclear.www.VoiceService.CallTransferReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.SysConfigLoadResp sysConfigLoad(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp call(cn.showclear.www.VoiceService.CallReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp meetDelete(cn.showclear.www.VoiceService.MeetIdReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CallinQueryResp callinXDQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp memberJoin(cn.showclear.www.VoiceService.MemberJoinReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.MeetQueryResp meetQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.MeetCreateResp meetCreate(cn.showclear.www.VoiceService.MeetCreateReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CommonResp callHold(cn.showclear.www.VoiceService.CallHoldReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.CallplatRecordQueryResp callplatRecordQuery(cn.showclear.www.VoiceService.CallplatRecordQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.NotifyResultQueryResp notifyResultQuery(cn.showclear.www.VoiceService.NotifyResultQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.VoiceService.VersionResp version(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException;
}
