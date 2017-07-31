/**
 * AppServiceSOAPStub.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class AppServiceSOAPStub extends org.apache.axis.client.Stub implements cn.showclear.www.AppService.AppServicePortType {
    private java.util.Vector cachedSerClasses = new java.util.Vector();
    private java.util.Vector cachedSerQNames = new java.util.Vector();
    private java.util.Vector cachedSerFactories = new java.util.Vector();
    private java.util.Vector cachedDeserFactories = new java.util.Vector();

    static org.apache.axis.description.OperationDesc [] _operations;

    static {
        _operations = new org.apache.axis.description.OperationDesc[28];
        _initOperationDesc1();
        _initOperationDesc2();
        _initOperationDesc3();
    }

    private static void _initOperationDesc1(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("NotifyRecordUpload");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "NotifyRecordUploadReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">NotifyRecordUploadReq"), cn.showclear.www.AppService.NotifyRecordUploadReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.AppService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[0] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FileDownload");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FileDownloadReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FileDownloadReq"), cn.showclear.www.AppService.FileDownloadReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FileDownloadResp"));
        oper.setReturnClass(cn.showclear.www.AppService.FileDownloadResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FileDownloadResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[1] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxDelete");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxDelReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxDelReq"), cn.showclear.www.AppService.FaxDelReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.AppService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[2] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("SysConfigSet");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "SysConfigSetReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">SysConfigSetReq"), cn.showclear.www.AppService.ConfigEntry[].class, false, false);
        param.setItemQName(new javax.xml.namespace.QName("", "entries"));
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[3] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgDelete");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgDelReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgDelReq"), cn.showclear.www.AppService.MsgDelReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.AppService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[4] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgRecvQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgRecvQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgRecvQueryReq"), cn.showclear.www.AppService.MsgRecvQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgRecvQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.MsgRecvQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgRecvQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[5] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("RecordQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordQueryReq"), cn.showclear.www.AppService.RecordQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.RecordQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[6] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("RecordDelete");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordDeleteReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordDeleteReq"), cn.showclear.www.AppService.RecordDeleteReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[7] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("NotifyRecordQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "NotifyRecordQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">NotifyRecordQueryReq"), cn.showclear.www.AppService.NotifyRecordQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">NotifyRecordQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.NotifyRecordQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "NotifyRecordQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[8] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgRecvRead");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdStrReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdStrReq"), cn.showclear.www.AppService.IdStrReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[9] = oper;

    }

    private static void _initOperationDesc2(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("RecordMeetQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordMeetQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordMeetQueryReq"), cn.showclear.www.AppService.RecordMeetQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordMeetQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.RecordMeetQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordMeetQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[10] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgSendStatus");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdReq"), cn.showclear.www.AppService.IdReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[11] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxTranSend");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxTranSendReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxTranSendReq"), cn.showclear.www.AppService.FaxTranSendReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[12] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgSendQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgSendQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgSendQueryReq"), cn.showclear.www.AppService.MsgSendQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgSendQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.MsgSendQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgSendQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[13] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("Version");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">VersionResp"));
        oper.setReturnClass(cn.showclear.www.AppService.VersionResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "VersionResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[14] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallinMissedQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CallinMissedQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CallinMissedQueryReq"), cn.showclear.www.AppService.CallinMissedQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CallinMissedQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CallinMissedQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CallinMissedQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[15] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("QueryPushInfo");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "QueryPushInfoReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">QueryPushInfoReq"), cn.showclear.www.AppService.QueryPushInfoReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[16] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxReSend");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdReq"), cn.showclear.www.AppService.IdReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[17] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("SysConfigLoad");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">SysConfigLoadResp"));
        oper.setReturnClass(cn.showclear.www.AppService.SysConfigLoadResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "SysConfigLoadResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[18] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgSend");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgSendReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgSendReq"), cn.showclear.www.AppService.MsgSendReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.AppService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[19] = oper;

    }

    private static void _initOperationDesc3(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("RegPushService");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RegPushServiceReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RegPushServiceReq"), cn.showclear.www.AppService.RegPushServiceReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[20] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxSendStatus");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdReq"), cn.showclear.www.AppService.IdReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendStatusResp"));
        oper.setReturnClass(cn.showclear.www.AppService.FaxSendStatusResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxSendStatusResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[21] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgReSend");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdReq"), cn.showclear.www.AppService.IdReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[22] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxRecvQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxRecvQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxRecvQueryReq"), cn.showclear.www.AppService.FaxRecvQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxRecvQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.FaxRecvQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxRecvQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[23] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxSendQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxSendQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendQueryReq"), cn.showclear.www.AppService.FaxSendQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendQueryResp"));
        oper.setReturnClass(cn.showclear.www.AppService.FaxSendQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxSendQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[24] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxSend");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxSendReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendReq"), cn.showclear.www.AppService.FaxSendReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[25] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("FaxRecvRead");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "IdStrReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdStrReq"), cn.showclear.www.AppService.IdStrReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[26] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MsgDeleteTel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgDelTelReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgDelTelReq"), cn.showclear.www.AppService.MsgDelTelReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.AppService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[27] = oper;

    }

    public AppServiceSOAPStub() throws org.apache.axis.AxisFault {
         this(null);
    }

    public AppServiceSOAPStub(java.net.URL endpointURL, javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
         this(service);
         super.cachedEndpoint = endpointURL;
    }

    public AppServiceSOAPStub(javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
        if (service == null) {
            super.service = new org.apache.axis.client.Service();
        } else {
            super.service = service;
        }
        ((org.apache.axis.client.Service)super.service).setTypeMappingVersion("1.2");
            java.lang.Class cls;
            javax.xml.namespace.QName qName;
            javax.xml.namespace.QName qName2;
            java.lang.Class beansf = org.apache.axis.encoding.ser.BeanSerializerFactory.class;
            java.lang.Class beandf = org.apache.axis.encoding.ser.BeanDeserializerFactory.class;
            java.lang.Class enumsf = org.apache.axis.encoding.ser.EnumSerializerFactory.class;
            java.lang.Class enumdf = org.apache.axis.encoding.ser.EnumDeserializerFactory.class;
            java.lang.Class arraysf = org.apache.axis.encoding.ser.ArraySerializerFactory.class;
            java.lang.Class arraydf = org.apache.axis.encoding.ser.ArrayDeserializerFactory.class;
            java.lang.Class simplesf = org.apache.axis.encoding.ser.SimpleSerializerFactory.class;
            java.lang.Class simpledf = org.apache.axis.encoding.ser.SimpleDeserializerFactory.class;
            java.lang.Class simplelistsf = org.apache.axis.encoding.ser.SimpleListSerializerFactory.class;
            java.lang.Class simplelistdf = org.apache.axis.encoding.ser.SimpleListDeserializerFactory.class;
            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CallinMissedQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.CallinMissedQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CallinMissedQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.CallinMissedQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">CommonResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.CommonResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxDelReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxDelReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxRecvQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxRecvQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxRecvQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxRecvQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxSendQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxSendQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxSendReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendStatusResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxSendStatusResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxTranSendReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxTranSendReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FileDownloadReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FileDownloadReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FileDownloadResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FileDownloadResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.IdReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.IdResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">IdStrReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.IdStrReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">JsonResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.JsonResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgDelReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgDelReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgDelTelReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgDelTelReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgRecvQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgRecvQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgRecvQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgRecvQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgSendQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgSendQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgSendQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgSendQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgSendReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgSendReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">NotifyRecordQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.NotifyRecordQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">NotifyRecordQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.NotifyRecordQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">NotifyRecordUploadReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.NotifyRecordUploadReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">QueryPushInfoReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.QueryPushInfoReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordDeleteReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RecordDeleteReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordMeetQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RecordMeetQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordMeetQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RecordMeetQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RecordQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RecordQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RecordQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">RegPushServiceReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RegPushServiceReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">SysConfigLoadResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.SysConfigLoadResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">SysConfigSetReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.ConfigEntry[].class;
            cachedSerClasses.add(cls);
            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "ConfigEntry");
            qName2 = new javax.xml.namespace.QName("", "entries");
            cachedSerFactories.add(new org.apache.axis.encoding.ser.ArraySerializerFactory(qName, qName2));
            cachedDeserFactories.add(new org.apache.axis.encoding.ser.ArrayDeserializerFactory());

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">VersionResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.VersionResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CallinMissed");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.CallinMissed.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "ConfigEntry");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.ConfigEntry.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxRecvInfo");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxRecvInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxSendInfo");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.FaxSendInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgRecvInfo");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgRecvInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgSendInfo");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.MsgSendInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "NotifyRecord");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.NotifyRecord.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordInfo");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RecordInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordMeetInfo");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.AppService.RecordMeetInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

    }

    protected org.apache.axis.client.Call createCall() throws java.rmi.RemoteException {
        try {
            org.apache.axis.client.Call _call = super._createCall();
            if (super.maintainSessionSet) {
                _call.setMaintainSession(super.maintainSession);
            }
            if (super.cachedUsername != null) {
                _call.setUsername(super.cachedUsername);
            }
            if (super.cachedPassword != null) {
                _call.setPassword(super.cachedPassword);
            }
            if (super.cachedEndpoint != null) {
                _call.setTargetEndpointAddress(super.cachedEndpoint);
            }
            if (super.cachedTimeout != null) {
                _call.setTimeout(super.cachedTimeout);
            }
            if (super.cachedPortName != null) {
                _call.setPortName(super.cachedPortName);
            }
            java.util.Enumeration keys = super.cachedProperties.keys();
            while (keys.hasMoreElements()) {
                java.lang.String key = (java.lang.String) keys.nextElement();
                _call.setProperty(key, super.cachedProperties.get(key));
            }
            // All the type mapping information is registered
            // when the first call is made.
            // The type mapping information is actually registered in
            // the TypeMappingRegistry of the service, which
            // is the reason why registration is only needed for the first call.
            synchronized (this) {
                if (firstCall()) {
                    // must set encoding style before registering serializers
                    _call.setEncodingStyle(null);
                    for (int i = 0; i < cachedSerFactories.size(); ++i) {
                        java.lang.Class cls = (java.lang.Class) cachedSerClasses.get(i);
                        javax.xml.namespace.QName qName =
                                (javax.xml.namespace.QName) cachedSerQNames.get(i);
                        java.lang.Object x = cachedSerFactories.get(i);
                        if (x instanceof Class) {
                            java.lang.Class sf = (java.lang.Class)
                                 cachedSerFactories.get(i);
                            java.lang.Class df = (java.lang.Class)
                                 cachedDeserFactories.get(i);
                            _call.registerTypeMapping(cls, qName, sf, df, false);
                        }
                        else if (x instanceof javax.xml.rpc.encoding.SerializerFactory) {
                            org.apache.axis.encoding.SerializerFactory sf = (org.apache.axis.encoding.SerializerFactory)
                                 cachedSerFactories.get(i);
                            org.apache.axis.encoding.DeserializerFactory df = (org.apache.axis.encoding.DeserializerFactory)
                                 cachedDeserFactories.get(i);
                            _call.registerTypeMapping(cls, qName, sf, df, false);
                        }
                    }
                }
            }
            return _call;
        }
        catch (java.lang.Throwable _t) {
            throw new org.apache.axis.AxisFault("Failure trying to get the Call object", _t);
        }
    }

    public cn.showclear.www.AppService.IdResp notifyRecordUpload(cn.showclear.www.AppService.NotifyRecordUploadReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[0]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/NotifyRecordUpload");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "NotifyRecordUpload"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.FileDownloadResp fileDownload(cn.showclear.www.AppService.FileDownloadReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[1]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FileDownload");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FileDownload"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.FileDownloadResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.FileDownloadResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.FileDownloadResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.IdResp faxDelete(cn.showclear.www.AppService.FaxDelReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[2]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxDelete");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxDelete"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp sysConfigSet(cn.showclear.www.AppService.ConfigEntry[] parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[3]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/SysConfigSet");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "SysConfigSet"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.IdResp msgDelete(cn.showclear.www.AppService.MsgDelReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[4]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgDelete");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgDelete"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.MsgRecvQueryResp msgRecvQuery(cn.showclear.www.AppService.MsgRecvQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[5]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgRecvQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgRecvQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.MsgRecvQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.MsgRecvQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.MsgRecvQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.RecordQueryResp recordQuery(cn.showclear.www.AppService.RecordQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[6]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/RecordQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "RecordQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.RecordQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.RecordQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.RecordQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp recordDelete(cn.showclear.www.AppService.RecordDeleteReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[7]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/RecordDelete");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "RecordDelete"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.NotifyRecordQueryResp notifyRecordQuery(cn.showclear.www.AppService.NotifyRecordQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[8]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/NotifyRecordQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "NotifyRecordQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.NotifyRecordQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.NotifyRecordQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.NotifyRecordQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp msgRecvRead(cn.showclear.www.AppService.IdStrReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[9]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgRecvRead");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgRecvRead"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.RecordMeetQueryResp recordMeetQuery(cn.showclear.www.AppService.RecordMeetQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[10]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/RecordMeetQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "RecordMeetQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.RecordMeetQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.RecordMeetQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.RecordMeetQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.JsonResp msgSendStatus(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[11]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgSendStatus");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgSendStatus"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.JsonResp faxTranSend(cn.showclear.www.AppService.FaxTranSendReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[12]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxTranSend");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxTranSend"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.MsgSendQueryResp msgSendQuery(cn.showclear.www.AppService.MsgSendQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[13]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgSendQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgSendQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.MsgSendQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.MsgSendQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.MsgSendQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.VersionResp version() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[14]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/Version");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "Version"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.VersionResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.VersionResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.VersionResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CallinMissedQueryResp callinMissedQuery(cn.showclear.www.AppService.CallinMissedQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[15]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/CallinMissedQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallinMissedQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CallinMissedQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CallinMissedQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CallinMissedQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.JsonResp queryPushInfo(cn.showclear.www.AppService.QueryPushInfoReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[16]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/QueryPushInfo");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "QueryPushInfo"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp faxReSend(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[17]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxReSend");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxReSend"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.SysConfigLoadResp sysConfigLoad() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[18]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/SysConfigLoad");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "SysConfigLoad"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.SysConfigLoadResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.SysConfigLoadResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.SysConfigLoadResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.IdResp msgSend(cn.showclear.www.AppService.MsgSendReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[19]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgSend");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgSend"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp regPushService(cn.showclear.www.AppService.RegPushServiceReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[20]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/RegPushService");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "RegPushService"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.FaxSendStatusResp faxSendStatus(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[21]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxSendStatus");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxSendStatus"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.FaxSendStatusResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.FaxSendStatusResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.FaxSendStatusResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp msgReSend(cn.showclear.www.AppService.IdReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[22]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgReSend");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgReSend"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.FaxRecvQueryResp faxRecvQuery(cn.showclear.www.AppService.FaxRecvQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[23]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxRecvQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxRecvQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.FaxRecvQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.FaxRecvQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.FaxRecvQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.FaxSendQueryResp faxSendQuery(cn.showclear.www.AppService.FaxSendQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[24]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxSendQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxSendQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.FaxSendQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.FaxSendQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.FaxSendQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.JsonResp faxSend(cn.showclear.www.AppService.FaxSendReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[25]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxSend");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxSend"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp faxRecvRead(cn.showclear.www.AppService.IdStrReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[26]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/FaxRecvRead");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "FaxRecvRead"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.AppService.CommonResp msgDeleteTel(cn.showclear.www.AppService.MsgDelTelReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[27]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/MsgDelete");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MsgDeleteTel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.AppService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.AppService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.AppService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

}
