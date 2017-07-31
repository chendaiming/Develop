/**
 * AppServicePortType.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public interface AppServicePortType extends java.rmi.Remote {
    public cn.showclear.www.AppService.IdResp notifyRecordUpload(cn.showclear.www.AppService.NotifyRecordUploadReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.FileDownloadResp fileDownload(cn.showclear.www.AppService.FileDownloadReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.IdResp faxDelete(cn.showclear.www.AppService.FaxDelReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp sysConfigSet(cn.showclear.www.AppService.ConfigEntry[] parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.IdResp msgDelete(cn.showclear.www.AppService.MsgDelReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.MsgRecvQueryResp msgRecvQuery(cn.showclear.www.AppService.MsgRecvQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.RecordQueryResp recordQuery(cn.showclear.www.AppService.RecordQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp recordDelete(cn.showclear.www.AppService.RecordDeleteReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.NotifyRecordQueryResp notifyRecordQuery(cn.showclear.www.AppService.NotifyRecordQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp msgRecvRead(cn.showclear.www.AppService.IdStrReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.RecordMeetQueryResp recordMeetQuery(cn.showclear.www.AppService.RecordMeetQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.JsonResp msgSendStatus(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.JsonResp faxTranSend(cn.showclear.www.AppService.FaxTranSendReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.MsgSendQueryResp msgSendQuery(cn.showclear.www.AppService.MsgSendQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.VersionResp version() throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CallinMissedQueryResp callinMissedQuery(cn.showclear.www.AppService.CallinMissedQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.JsonResp queryPushInfo(cn.showclear.www.AppService.QueryPushInfoReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp faxReSend(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.SysConfigLoadResp sysConfigLoad() throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.IdResp msgSend(cn.showclear.www.AppService.MsgSendReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.FaxSendStatusResp faxSendStatus(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp regPushService(cn.showclear.www.AppService.RegPushServiceReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp msgReSend(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.FaxRecvQueryResp faxRecvQuery(cn.showclear.www.AppService.FaxRecvQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.FaxSendQueryResp faxSendQuery(cn.showclear.www.AppService.FaxSendQueryReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.JsonResp faxSend(cn.showclear.www.AppService.FaxSendReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp faxRecvRead(cn.showclear.www.AppService.IdStrReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.AppService.CommonResp msgDeleteTel(cn.showclear.www.AppService.MsgDelTelReq parameters) throws java.rmi.RemoteException;
}
