/**
 * ScServiceSOAPStub.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class ScServiceSOAPStub extends org.apache.axis.client.Stub implements cn.showclear.www.ScService.ScServicePortType {
    private java.util.Vector cachedSerClasses = new java.util.Vector();
    private java.util.Vector cachedSerQNames = new java.util.Vector();
    private java.util.Vector cachedSerFactories = new java.util.Vector();
    private java.util.Vector cachedDeserFactories = new java.util.Vector();

    static org.apache.axis.description.OperationDesc [] _operations;

    static {
        _operations = new org.apache.axis.description.OperationDesc[50];
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
        oper.setName("DispGroupDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[0] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PowerSwitchAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "PowerSwitchReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchReq"), cn.showclear.www.ScService.PowerSwitchReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[1] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("ConfigLoad");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.ScService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[2] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("BWListMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "BWListReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">BWListReq"), cn.showclear.www.ScService.BWListReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[3] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("ImportData");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ImportReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ImportReq"), cn.showclear.www.ScService.ImportReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.ScService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[4] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PowerSwitchStatusSet");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "StatusSetReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">StatusSetReq"), cn.showclear.www.ScService.StatusSetReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[5] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgMemberSort");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgMemberSortReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgMemberSortReq"), cn.showclear.www.ScService.OrgMemberSortReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[6] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("NVQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">NVQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.NVQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "NVQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[7] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispatcherDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[8] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispMemberMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispMemberModReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberModReq"), cn.showclear.www.ScService.DispMemberModReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[9] = oper;

    }

    private static void _initOperationDesc2(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgGroupMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgGroupReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgGroupReq"), cn.showclear.www.ScService.OrgGroupReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[10] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispGroupQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.DispGroupQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispGroupQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[11] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispGroupMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispGroupReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupReq"), cn.showclear.www.ScService.DispGroupReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[12] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgGroupAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgGroupReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgGroupReq"), cn.showclear.www.ScService.OrgGroupReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[13] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("VideoDevDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[14] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("Version");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VersionResp"));
        oper.setReturnClass(cn.showclear.www.ScService.VersionResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "VersionResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[15] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispCenterMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispCenterReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispCenterReq"), cn.showclear.www.ScService.DispCenterReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[16] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("ExportData");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ExportReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ExportReq"), cn.showclear.www.ScService.ExportReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ExportResp"));
        oper.setReturnClass(cn.showclear.www.ScService.ExportResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ExportResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[17] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgGroupQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgGroupQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.OrgGroupQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgGroupQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[18] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispCenterQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispCenterQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.DispCenterQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispCenterQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[19] = oper;

    }

    private static void _initOperationDesc3(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispMemberDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[20] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispCenterAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispCenterReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispCenterReq"), cn.showclear.www.ScService.DispCenterReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[21] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("SysConfigSet");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "SysConfigSetReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">SysConfigSetReq"), cn.showclear.www.ScService.ConfigEntry[].class, false, false);
        param.setItemQName(new javax.xml.namespace.QName("", "entries"));
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.ScService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[22] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("BWListAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "BWListReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">BWListReq"), cn.showclear.www.ScService.BWListReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[23] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispMemberQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.DispMemberQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispMemberQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[24] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("BWListQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">BWListQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.BWListQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "BWListQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[25] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("ConfigSet");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ConfigSetReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ConfigSetReq"), cn.showclear.www.ScService.ConfigEntry[].class, false, false);
        param.setItemQName(new javax.xml.namespace.QName("", "entry"));
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">CommonResp"));
        oper.setReturnClass(cn.showclear.www.ScService.CommonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "CommonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[26] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PowerSwitchDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[27] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgMemberQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgMemberQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.OrgMemberQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgMemberQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[28] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispatcherQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispatcherQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.DispatcherQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispatcherQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[29] = oper;

    }

    private static void _initOperationDesc4(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispMemberSort");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispMemberSortReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberSortReq"), cn.showclear.www.ScService.DispMemberSortReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[30] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PowerSwitchMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "PowerSwitchReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchReq"), cn.showclear.www.ScService.PowerSwitchReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[31] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispatcherAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispatcherReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispatcherReq"), cn.showclear.www.ScService.DispatcherReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[32] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("BWListDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[33] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispGroupSort");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispGroupSortReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupSortReq"), cn.showclear.www.ScService.DispGroupSortReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[34] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("VideoDevQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VideoDevQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.VideoDevQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "VideoDevQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[35] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispGroupAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispGroupReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupReq"), cn.showclear.www.ScService.DispGroupReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[36] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispCenterDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[37] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("VideoDevMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "VideoDevReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VideoDevReq"), cn.showclear.www.ScService.VideoDevReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[38] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgMemberDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[39] = oper;

    }

    private static void _initOperationDesc5(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("LoadData");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "LoadDataReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">LoadDataReq"), cn.showclear.www.ScService.LoadDataReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">JsonResp"));
        oper.setReturnClass(cn.showclear.www.ScService.JsonResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "JsonResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[40] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispMemberAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispMemberReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberReq"), cn.showclear.www.ScService.DispMemberReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[41] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PowerSwitchQuery");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchQueryResp"));
        oper.setReturnClass(cn.showclear.www.ScService.PowerSwitchQueryResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "PowerSwitchQueryResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[42] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("SysConfigLoad");
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">SysConfigLoadResp"));
        oper.setReturnClass(cn.showclear.www.ScService.SysConfigLoadResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "SysConfigLoadResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[43] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("DispatcherMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispatcherReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispatcherReq"), cn.showclear.www.ScService.DispatcherReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[44] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("VideoDevAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "VideoDevReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VideoDevReq"), cn.showclear.www.ScService.VideoDevReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[45] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgGroupDel");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[46] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgMemberMod");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgMemberReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgMemberReq"), cn.showclear.www.ScService.OrgMemberReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[47] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("OrgMemberAdd");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgMemberReq"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgMemberReq"), cn.showclear.www.ScService.OrgMemberReq.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp"));
        oper.setReturnClass(cn.showclear.www.ScService.IdResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "IdResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[48] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("PowerSwitchInfo");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Id"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id"), cn.showclear.www.ScService.Id.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchResp"));
        oper.setReturnClass(cn.showclear.www.ScService.PowerSwitchResp.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "PowerSwitchResp"));
        oper.setStyle(org.apache.axis.constants.Style.DOCUMENT);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[49] = oper;

    }

    public ScServiceSOAPStub() throws org.apache.axis.AxisFault {
         this(null);
    }

    public ScServiceSOAPStub(java.net.URL endpointURL, javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
         this(service);
         super.cachedEndpoint = endpointURL;
    }

    public ScServiceSOAPStub(javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
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
            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">BWListQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.BWListQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">BWListReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.BWListReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">CommonResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.CommonResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ConfigSetReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.ConfigEntry[].class;
            cachedSerClasses.add(cls);
            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ConfigEntry");
            qName2 = new javax.xml.namespace.QName("", "entry");
            cachedSerFactories.add(new org.apache.axis.encoding.ser.ArraySerializerFactory(qName, qName2));
            cachedDeserFactories.add(new org.apache.axis.encoding.ser.ArrayDeserializerFactory());

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispatcherQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispatcherQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispatcherReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispatcherReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispCenterQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispCenterQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispCenterReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispCenterReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispGroupQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispGroupReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupSortReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispGroupSortReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberModReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispMemberModReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispMemberQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispMemberReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberSortReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispMemberSortReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ExportReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.ExportReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ExportResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.ExportResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">Id");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.Id.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">IdResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.IdResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ImportReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.ImportReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">JsonResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.JsonResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">LoadDataReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.LoadDataReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">NVQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.NVQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgGroupQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.OrgGroupQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgGroupReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.OrgGroupReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgMemberQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.OrgMemberQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgMemberReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.OrgMemberReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgMemberSortReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.OrgMemberSortReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.PowerSwitchQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.PowerSwitchReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.PowerSwitchResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">StatusSetReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.StatusSetReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">SysConfigLoadResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.SysConfigLoadResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">SysConfigSetReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.ConfigEntry[].class;
            cachedSerClasses.add(cls);
            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ConfigEntry");
            qName2 = new javax.xml.namespace.QName("", "entries");
            cachedSerFactories.add(new org.apache.axis.encoding.ser.ArraySerializerFactory(qName, qName2));
            cachedDeserFactories.add(new org.apache.axis.encoding.ser.ArrayDeserializerFactory());

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VersionResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.VersionResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VideoDevQueryResp");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.VideoDevQueryResp.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VideoDevReq");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.VideoDevReq.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "BWList");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.BWList.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "ConfigEntry");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.ConfigEntry.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Dispatcher");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.Dispatcher.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispCenter");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispCenter.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispGroup");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispGroup.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispMember");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.DispMember.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "NotifyRecord");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.NotifyRecord.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgGroup");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.OrgGroup.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgMember");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.OrgMember.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "PowerSwitch");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.PowerSwitch.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "VideoDev");
            cachedSerQNames.add(qName);
            cls = cn.showclear.www.ScService.VideoDev.class;
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

    public cn.showclear.www.ScService.IdResp dispGroupDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[0]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispGroupDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispGroupDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp powerSwitchAdd(cn.showclear.www.ScService.PowerSwitchReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[1]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/PowerSwitchAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PowerSwitchAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.JsonResp configLoad() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[2]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/ConfigLoad");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "ConfigLoad"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp BWListMod(cn.showclear.www.ScService.BWListReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[3]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/BWListMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "BWListMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.CommonResp importData(cn.showclear.www.ScService.ImportReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[4]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/ImportData");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "ImportData"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp powerSwitchStatusSet(cn.showclear.www.ScService.StatusSetReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[5]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/PowerSwitchStatusSet");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PowerSwitchStatusSet"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp orgMemberSort(cn.showclear.www.ScService.OrgMemberSortReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[6]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgMemberSort");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgMemberSort"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.NVQueryResp NVQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[7]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/NVQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "NVQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.NVQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.NVQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.NVQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispatcherDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[8]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispatcherDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispatcherDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispMemberMod(cn.showclear.www.ScService.DispMemberModReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[9]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispMemberMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispMemberMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp orgGroupMod(cn.showclear.www.ScService.OrgGroupReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[10]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgGroupMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgGroupMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.DispGroupQueryResp dispGroupQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[11]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispGroupQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispGroupQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.DispGroupQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.DispGroupQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.DispGroupQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispGroupMod(cn.showclear.www.ScService.DispGroupReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[12]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispGroupMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispGroupMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp orgGroupAdd(cn.showclear.www.ScService.OrgGroupReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[13]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgGroupAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgGroupAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp videoDevDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[14]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/VideoDevDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "VideoDevDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.VersionResp version() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[15]);
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
                return (cn.showclear.www.ScService.VersionResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.VersionResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.VersionResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispCenterMod(cn.showclear.www.ScService.DispCenterReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[16]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispCenterMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispCenterMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.ExportResp exportData(cn.showclear.www.ScService.ExportReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[17]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/ExportData");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "ExportData"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.ExportResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.ExportResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.ExportResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.OrgGroupQueryResp orgGroupQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[18]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgGroupQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgGroupQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.OrgGroupQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.OrgGroupQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.OrgGroupQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.DispCenterQueryResp dispCenterQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[19]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispCenterQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispCenterQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.DispCenterQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.DispCenterQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.DispCenterQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispMemberDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[20]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispMemberDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispMemberDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispCenterAdd(cn.showclear.www.ScService.DispCenterReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[21]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispCenterAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispCenterAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.CommonResp sysConfigSet(cn.showclear.www.ScService.ConfigEntry[] parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[22]);
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
                return (cn.showclear.www.ScService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp BWListAdd(cn.showclear.www.ScService.BWListReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[23]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/BWListAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "BWListAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.DispMemberQueryResp dispMemberQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[24]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispMemberQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispMemberQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.DispMemberQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.DispMemberQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.DispMemberQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.BWListQueryResp BWListQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[25]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/BWListQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "BWListQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.BWListQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.BWListQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.BWListQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.CommonResp configSet(cn.showclear.www.ScService.ConfigEntry[] parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[26]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/ConfigSet");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "ConfigSet"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.CommonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.CommonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.CommonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp powerSwitchDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[27]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/PowerSwitchDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PowerSwitchDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.OrgMemberQueryResp orgMemberQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[28]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgMemberQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgMemberQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.OrgMemberQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.OrgMemberQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.OrgMemberQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.DispatcherQueryResp dispatcherQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[29]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispatcherQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispatcherQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.DispatcherQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.DispatcherQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.DispatcherQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispMemberSort(cn.showclear.www.ScService.DispMemberSortReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[30]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispMemberSort");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispMemberSort"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp powerSwitchMod(cn.showclear.www.ScService.PowerSwitchReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[31]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/PowerSwitchMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PowerSwitchMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispatcherAdd(cn.showclear.www.ScService.DispatcherReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[32]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispatcherAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispatcherAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp BWListDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[33]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/BWListDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "BWListDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispGroupSort(cn.showclear.www.ScService.DispGroupSortReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[34]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispGroupSort");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispGroupSort"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.VideoDevQueryResp videoDevQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[35]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/VideoDevQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "VideoDevQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.VideoDevQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.VideoDevQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.VideoDevQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispGroupAdd(cn.showclear.www.ScService.DispGroupReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[36]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispGroupAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispGroupAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispCenterDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[37]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispCenterDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispCenterDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp videoDevMod(cn.showclear.www.ScService.VideoDevReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[38]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/VideoDevMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "VideoDevMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp orgMemberDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[39]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgMemberDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgMemberDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.JsonResp loadData(cn.showclear.www.ScService.LoadDataReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[40]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/LoadData");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "LoadData"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.JsonResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.JsonResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.JsonResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispMemberAdd(cn.showclear.www.ScService.DispMemberReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[41]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispMemberAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispMemberAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.PowerSwitchQueryResp powerSwitchQuery() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[42]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/PowerSwitchQuery");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PowerSwitchQuery"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.PowerSwitchQueryResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.PowerSwitchQueryResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.PowerSwitchQueryResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.SysConfigLoadResp sysConfigLoad() throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[43]);
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
                return (cn.showclear.www.ScService.SysConfigLoadResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.SysConfigLoadResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.SysConfigLoadResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp dispatcherMod(cn.showclear.www.ScService.DispatcherReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[44]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/DispatcherMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "DispatcherMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp videoDevAdd(cn.showclear.www.ScService.VideoDevReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[45]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/VideoDevAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "VideoDevAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp orgGroupDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[46]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgGroupDel");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgGroupDel"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp orgMemberMod(cn.showclear.www.ScService.OrgMemberReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[47]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgMemberMod");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgMemberMod"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.IdResp orgMemberAdd(cn.showclear.www.ScService.OrgMemberReq parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[48]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/OrgMemberAdd");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "OrgMemberAdd"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.IdResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.IdResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.IdResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public cn.showclear.www.ScService.PowerSwitchResp powerSwitchInfo(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[49]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://www.showclear.cn/ScService/PowerSwitchInfo");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("", "PowerSwitchInfo"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {parameters});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (cn.showclear.www.ScService.PowerSwitchResp) _resp;
            } catch (java.lang.Exception _exception) {
                return (cn.showclear.www.ScService.PowerSwitchResp) org.apache.axis.utils.JavaUtils.convert(_resp, cn.showclear.www.ScService.PowerSwitchResp.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

}
