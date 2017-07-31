/**
 * VoiceServiceSOAPStub.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class VoiceServiceSOAPStub extends org.apache.axis.client.Stub implements cn.showclear.www.VoiceService.VoiceService2PortType {
    private java.util.Vector cachedSerClasses = new java.util.Vector();
    private java.util.Vector cachedSerQNames = new java.util.Vector();
    private java.util.Vector cachedSerFactories = new java.util.Vector();
    private java.util.Vector cachedDeserFactories = new java.util.Vector();

    static org.apache.axis.description.OperationDesc [] _operations;

    static {
        _operations = new org.apache.axis.description.OperationDesc[43];
        _initOperationDesc1();
        _initOperationDesc2();
        _initOperationDesc3();
        _initOperationDesc4();
        _initOperationDesc5();
    }

    private static void _initOperationDesc1(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("ConfigVideo");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "ConfigVideoReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">ConfigVideoReq"), cn.showclear.www.VoiceService.ConfigVideoReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[0] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MeetLock");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetOperateReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetOperateReq"), cn.showclear.www.VoiceService.MeetOperateReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[1] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PushServQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[2] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallInTurns");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallInTurnsReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallInTurnsReq"), cn.showclear.www.VoiceService.CallInTurnsReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[3] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("GroupCancel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "GroupCancelReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupCancelReq"), cn.showclear.www.VoiceService.GroupCancelReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[4] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("GroupNotify");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "GroupNotifyReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupNotifyReq"), cn.showclear.www.VoiceService.GroupNotifyReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[5] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallHangup");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallHangupReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallHangupReq"), cn.showclear.www.VoiceService.CallHangupReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[6] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MeetEnd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetIdReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetIdReq"), cn.showclear.www.VoiceService.MeetIdReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[7] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallRecord");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallRecordReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallRecordReq"), cn.showclear.www.VoiceService.CallRecordReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[8] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("Heartbeat");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[9] = oper;

    }

    private static void _initOperationDesc2(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallAnswer");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallAnswerReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallAnswerReq"), cn.showclear.www.VoiceService.CallAnswerReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[10] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("Logout");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[11] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("Login");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "LoginReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">LoginReq"), cn.showclear.www.VoiceService.LoginReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">LoginResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.LoginResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "LoginResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[12] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("TelStQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "TelStQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">TelStQueryReq"), cn.showclear.www.VoiceService.TelStQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[13] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("SysConfigSet");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "SysConfigSetReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">SysConfigSetReq"), cn.showclear.www.VoiceService.ConfigEntry[].class, false, false);
        param.setItemQName(new javax.xml.namespace.QName("", "entries"));
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[14] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MemberLevel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MemberLevelReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MemberLevelReq"), cn.showclear.www.VoiceService.MemberLevelReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[15] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("WorkStatusSet");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "WorkStatusSetReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">WorkStatusSetReq"), cn.showclear.www.VoiceService.WorkStatusSetReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[16] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallinQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CallinQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallinQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[17] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CalloutRecordQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CalloutRecordQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CalloutRecordQueryReq"), cn.showclear.www.VoiceService.CalloutRecordQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CalloutRecordQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CalloutRecordQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CalloutRecordQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[18] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("TelMonitor");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "TelMonitorReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">TelMonitorReq"), cn.showclear.www.VoiceService.TelMonitorReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[19] = oper;

    }

    private static void _initOperationDesc3(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MeetRecord");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetOperateReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetOperateReq"), cn.showclear.www.VoiceService.MeetOperateReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[20] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MeetVoice");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetOperateReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetOperateReq"), cn.showclear.www.VoiceService.MeetOperateReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[21] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("GroupCallInturns");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "GroupCallInturnsReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupCallInturnsReq"), cn.showclear.www.VoiceService.GroupCallInturnsReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[22] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PushServReg");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "PushServRegReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">PushServRegReq"), cn.showclear.www.VoiceService.PushServRegReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[23] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallOperate");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallOperateReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallOperateReq"), cn.showclear.www.VoiceService.CallOperateReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[24] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallinMissedQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallinMissedQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinMissedQueryReq"), cn.showclear.www.VoiceService.CallinMissedQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinMissedQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CallinMissedQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallinMissedQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[25] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("NotifyRecordOP");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "NotifyRecordOPReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyRecordOPReq"), cn.showclear.www.VoiceService.NotifyRecordOPReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyRecordOPResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.NotifyRecordOPResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "NotifyRecordOPResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[26] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("GroupCall");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "GroupCallReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupCallReq"), cn.showclear.www.VoiceService.GroupCallReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[27] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MemberLeave");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MemberLeaveReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MemberLeaveReq"), cn.showclear.www.VoiceService.MemberLeaveReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[28] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("GroupNotifyEnd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "GroupNotifyEndReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupNotifyEndReq"), cn.showclear.www.VoiceService.GroupNotifyEndReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[29] = oper;

    }

    private static void _initOperationDesc4(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallinTalkQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallinTalkQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinTalkQueryReq"), cn.showclear.www.VoiceService.CallinTalkQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinTalkQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CallinTalkQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallinTalkQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[30] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallTransfer");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallTransferReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallTransferReq"), cn.showclear.www.VoiceService.CallTransferReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[31] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("SysConfigLoad");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">SysConfigLoadResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.SysConfigLoadResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "SysConfigLoadResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[32] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("Call");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallReq"), cn.showclear.www.VoiceService.CallReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[33] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MeetDelete");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetIdReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetIdReq"), cn.showclear.www.VoiceService.MeetIdReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[34] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallinXDQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CallinQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallinQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[35] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MemberJoin");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MemberJoinReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MemberJoinReq"), cn.showclear.www.VoiceService.MemberJoinReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[36] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MeetQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.MeetQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[37] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("MeetCreate");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetCreateReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetCreateReq"), cn.showclear.www.VoiceService.MeetCreateReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetCreateResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.MeetCreateResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetCreateResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[38] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallHold");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallHoldReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallHoldReq"), cn.showclear.www.VoiceService.CallHoldReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[39] = oper;

    }

    private static void _initOperationDesc5(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CallplatRecordQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallplatRecordQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallplatRecordQueryReq"), cn.showclear.www.VoiceService.CallplatRecordQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallplatRecordQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.CallplatRecordQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallplatRecordQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[40] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("NotifyResultQuery");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "NotifyResultQueryReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyResultQueryReq"), cn.showclear.www.VoiceService.NotifyResultQueryReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyResultQueryResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.NotifyResultQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "NotifyResultQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[41] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("Version");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CommonReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq"), cn.showclear.www.VoiceService.CommonReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">VersionResp"));
        oper.setReturnClass(cn.showclear.www.VoiceService.VersionResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "VersionResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[42] = oper;

    }

    public VoiceServiceSOAPStub() throws org.apache.axis.AxisFault {
         this(null);
    }

    public VoiceServiceSOAPStub(java.net.URL endpointURL, javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
         this(service);
         super.cachedEndpoint = endpointURL;
    }

    public VoiceServiceSOAPStub(javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
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
            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallAnswerReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallAnswerReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallHangupReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallHangupReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallHoldReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallHoldReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinMissedQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallinMissedQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinMissedQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallinMissedQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallinQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinTalkQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallinTalkQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinTalkQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallinTalkQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallInTurnsReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallInTurnsReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallOperateReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallOperateReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CalloutRecordQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CalloutRecordQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CalloutRecordQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CalloutRecordQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallplatRecordQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallplatRecordQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallplatRecordQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallplatRecordQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallRecordReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallRecordReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallTransferReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallTransferReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CommonReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CommonResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CommonResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">ConfigVideoReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.ConfigVideoReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupCallInturnsReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.GroupCallInturnsReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupCallReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.GroupCallReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupCancelReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.GroupCancelReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupNotifyEndReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.GroupNotifyEndReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupNotifyReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.GroupNotifyReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">JsonResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.JsonResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">LoginReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.LoginReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">LoginResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.LoginResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetCreateReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MeetCreateReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetCreateResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MeetCreateResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetIdReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MeetIdReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetOperateReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MeetOperateReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MeetQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MemberJoinReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MemberJoinReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MemberLeaveReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MemberLeaveReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MemberLevelReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MemberLevelReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyRecordOPReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.NotifyRecordOPReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyRecordOPResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.NotifyRecordOPResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyResultQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.NotifyResultQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">NotifyResultQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.NotifyResultQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">PushServRegReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.PushServRegReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">SysConfigLoadResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.SysConfigLoadResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">SysConfigSetReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.ConfigEntry[].class;
            cachedSerClasses.add(cls);
            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "ConfigEntry");
            qName2 = new javax.xml.namespace.QName("", "entries");
            cachedSerFactories.add(new org.apache.axis.encoding.ser.ArraySerializerFactory(qName, qName2));
            cachedDeserFactories.add(new org.apache.axis.encoding.ser.ArrayDeserializerFactory());

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">TelMonitorReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.TelMonitorReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">TelStQueryReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.TelStQueryReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">VersionResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.VersionResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">WorkStatusSetReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.WorkStatusSetReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallinMissed");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallinMissed.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CalloutRecord");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CalloutRecord.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CallplatRecord");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.CallplatRecord.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "ConfigEntry");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.ConfigEntry.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetInfo");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MeetInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetMember");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.MeetMember.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "NotifyResult");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.VoiceService.NotifyResult.class;
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

    public cn.showclear.www.VoiceService.CommonResp configVideo(cn.showclear.www.VoiceService.ConfigVideoReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[0]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/ConfigVideo");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "ConfigVideo"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp meetLock(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[1]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MeetLock");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MeetLock"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.JsonResp pushServQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[2]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/PushServQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PushServQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp callInTurns(cn.showclear.www.VoiceService.CallInTurnsReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[3]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallInTurns");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallInTurns"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp groupCancel(cn.showclear.www.VoiceService.GroupCancelReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[4]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/GroupCancel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "GroupCancel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp groupNotify(cn.showclear.www.VoiceService.GroupNotifyReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[5]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/GroupNotify");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "GroupNotify"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp callHangup(cn.showclear.www.VoiceService.CallHangupReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[6]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallHangup");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallHangup"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp meetEnd(cn.showclear.www.VoiceService.MeetIdReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[7]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MeetEnd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MeetEnd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp callRecord(cn.showclear.www.VoiceService.CallRecordReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[8]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallRecord");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallRecord"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp heartbeat(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[9]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/Heartbeat");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "Heartbeat"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp callAnswer(cn.showclear.www.VoiceService.CallAnswerReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[10]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallAnswer");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallAnswer"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp logout(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[11]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/Logout");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "Logout"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.LoginResp login(cn.showclear.www.VoiceService.LoginReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[12]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/Login");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "Login"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.LoginResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.LoginResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.LoginResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.JsonResp telStQuery(cn.showclear.www.VoiceService.TelStQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[13]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/TelStQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "TelStQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp sysConfigSet(cn.showclear.www.VoiceService.ConfigEntry[] parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[14]);
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
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp memberLevel(cn.showclear.www.VoiceService.MemberLevelReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[15]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MemberLevel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MemberLevel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp workStatusSet(cn.showclear.www.VoiceService.WorkStatusSetReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[16]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/WorkStatusSet");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "WorkStatusSet"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CallinQueryResp callinQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[17]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallinQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallinQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CallinQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CallinQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CallinQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CalloutRecordQueryResp calloutRecordQuery(cn.showclear.www.VoiceService.CalloutRecordQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[18]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/CalloutRecordQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CalloutRecordQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CalloutRecordQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CalloutRecordQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CalloutRecordQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp telMonitor(cn.showclear.www.VoiceService.TelMonitorReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[19]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/TelMonitor");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "TelMonitor"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp meetRecord(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[20]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MeetRecord");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MeetRecord"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp meetVoice(cn.showclear.www.VoiceService.MeetOperateReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[21]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MeetVoice");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MeetVoice"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp groupCallInturns(cn.showclear.www.VoiceService.GroupCallInturnsReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[22]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/GroupCallInturns");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "GroupCallInturns"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp pushServReg(cn.showclear.www.VoiceService.PushServRegReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[23]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/PushServReg");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PushServReg"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp callOperate(cn.showclear.www.VoiceService.CallOperateReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[24]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallOperate");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallOperate"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CallinMissedQueryResp callinMissedQuery(cn.showclear.www.VoiceService.CallinMissedQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[25]);
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
                return (cn.showclear.www.VoiceService.CallinMissedQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CallinMissedQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CallinMissedQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.NotifyRecordOPResp notifyRecordOP(cn.showclear.www.VoiceService.NotifyRecordOPReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[26]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/NotifyRecordOP");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "NotifyRecordOP"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.NotifyRecordOPResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.NotifyRecordOPResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.NotifyRecordOPResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp groupCall(cn.showclear.www.VoiceService.GroupCallReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[27]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/GroupCall");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "GroupCall"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp memberLeave(cn.showclear.www.VoiceService.MemberLeaveReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[28]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MemberLeave");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MemberLeave"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp groupNotifyEnd(cn.showclear.www.VoiceService.GroupNotifyEndReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[29]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/GroupNotifyEnd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "GroupNotifyEnd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CallinTalkQueryResp callinTalkQuery(cn.showclear.www.VoiceService.CallinTalkQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[30]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallinTalkQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallinTalkQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CallinTalkQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CallinTalkQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CallinTalkQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp callTransfer(cn.showclear.www.VoiceService.CallTransferReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[31]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallTransfer");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallTransfer"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.SysConfigLoadResp sysConfigLoad(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[32]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/SysConfigLoad");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "SysConfigLoad"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.SysConfigLoadResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.SysConfigLoadResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.SysConfigLoadResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp call(cn.showclear.www.VoiceService.CallReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[33]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/Call");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "Call"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp meetDelete(cn.showclear.www.VoiceService.MeetIdReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[34]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MeetDelete");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MeetDelete"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CallinQueryResp callinXDQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[35]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallinXDQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallinXDQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CallinQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CallinQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CallinQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp memberJoin(cn.showclear.www.VoiceService.MemberJoinReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[36]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MemberJoin");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MemberJoin"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.MeetQueryResp meetQuery(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[37]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MeetQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MeetQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.MeetQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.MeetQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.MeetQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.MeetCreateResp meetCreate(cn.showclear.www.VoiceService.MeetCreateReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[38]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/MeetCreate");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "MeetCreate"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.MeetCreateResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.MeetCreateResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.MeetCreateResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CommonResp callHold(cn.showclear.www.VoiceService.CallHoldReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[39]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/CallHold");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallHold"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.CallplatRecordQueryResp callplatRecordQuery(cn.showclear.www.VoiceService.CallplatRecordQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[40]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/AppService/CallplatRecordQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "CallplatRecordQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.CallplatRecordQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.CallplatRecordQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.CallplatRecordQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.NotifyResultQueryResp notifyResultQuery(cn.showclear.www.VoiceService.NotifyResultQueryReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[41]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/VoiceService/NotifyResultQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "NotifyResultQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.NotifyResultQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.NotifyResultQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.NotifyResultQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.VoiceService.VersionResp version(cn.showclear.www.VoiceService.CommonReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[42]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/Version");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "Version"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.VoiceService.VersionResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.VoiceService.VersionResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.VoiceService.VersionResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

}
