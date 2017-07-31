/**
 * MsgSendInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class MsgSendInfo  implements java.io.Serializable {
    private int id;

    private java.lang.String caller;

    private java.lang.String callee;

    private java.lang.String content;

    private int len;

    private java.lang.String timeSchedule;

    private java.lang.String timeSend;

    private int status;

    private java.lang.Integer batchFlag;

    private java.lang.String batchInfo;

    private java.lang.Integer notifyType;

    private java.lang.String receiptDesc;

    public MsgSendInfo() {
    }

    public MsgSendInfo(
           int id,
           java.lang.String caller,
           java.lang.String callee,
           java.lang.String content,
           int len,
           java.lang.String timeSchedule,
           java.lang.String timeSend,
           int status,
           java.lang.Integer batchFlag,
           java.lang.String batchInfo,
           java.lang.Integer notifyType,
           java.lang.String receiptDesc) {
           this.id = id;
           this.caller = caller;
           this.callee = callee;
           this.content = content;
           this.len = len;
           this.timeSchedule = timeSchedule;
           this.timeSend = timeSend;
           this.status = status;
           this.batchFlag = batchFlag;
           this.batchInfo = batchInfo;
           this.notifyType = notifyType;
           this.receiptDesc = receiptDesc;
    }


    /**
     * Gets the id value for this MsgSendInfo.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this MsgSendInfo.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the caller value for this MsgSendInfo.
     * 
     * @return caller
     */
    public java.lang.String getCaller() {
        return caller;
    }


    /**
     * Sets the caller value for this MsgSendInfo.
     * 
     * @param caller
     */
    public void setCaller(java.lang.String caller) {
        this.caller = caller;
    }


    /**
     * Gets the callee value for this MsgSendInfo.
     * 
     * @return callee
     */
    public java.lang.String getCallee() {
        return callee;
    }


    /**
     * Sets the callee value for this MsgSendInfo.
     * 
     * @param callee
     */
    public void setCallee(java.lang.String callee) {
        this.callee = callee;
    }


    /**
     * Gets the content value for this MsgSendInfo.
     * 
     * @return content
     */
    public java.lang.String getContent() {
        return content;
    }


    /**
     * Sets the content value for this MsgSendInfo.
     * 
     * @param content
     */
    public void setContent(java.lang.String content) {
        this.content = content;
    }


    /**
     * Gets the len value for this MsgSendInfo.
     * 
     * @return len
     */
    public int getLen() {
        return len;
    }


    /**
     * Sets the len value for this MsgSendInfo.
     * 
     * @param len
     */
    public void setLen(int len) {
        this.len = len;
    }


    /**
     * Gets the timeSchedule value for this MsgSendInfo.
     * 
     * @return timeSchedule
     */
    public java.lang.String getTimeSchedule() {
        return timeSchedule;
    }


    /**
     * Sets the timeSchedule value for this MsgSendInfo.
     * 
     * @param timeSchedule
     */
    public void setTimeSchedule(java.lang.String timeSchedule) {
        this.timeSchedule = timeSchedule;
    }


    /**
     * Gets the timeSend value for this MsgSendInfo.
     * 
     * @return timeSend
     */
    public java.lang.String getTimeSend() {
        return timeSend;
    }


    /**
     * Sets the timeSend value for this MsgSendInfo.
     * 
     * @param timeSend
     */
    public void setTimeSend(java.lang.String timeSend) {
        this.timeSend = timeSend;
    }


    /**
     * Gets the status value for this MsgSendInfo.
     * 
     * @return status
     */
    public int getStatus() {
        return status;
    }


    /**
     * Sets the status value for this MsgSendInfo.
     * 
     * @param status
     */
    public void setStatus(int status) {
        this.status = status;
    }


    /**
     * Gets the batchFlag value for this MsgSendInfo.
     * 
     * @return batchFlag
     */
    public java.lang.Integer getBatchFlag() {
        return batchFlag;
    }


    /**
     * Sets the batchFlag value for this MsgSendInfo.
     * 
     * @param batchFlag
     */
    public void setBatchFlag(java.lang.Integer batchFlag) {
        this.batchFlag = batchFlag;
    }


    /**
     * Gets the batchInfo value for this MsgSendInfo.
     * 
     * @return batchInfo
     */
    public java.lang.String getBatchInfo() {
        return batchInfo;
    }


    /**
     * Sets the batchInfo value for this MsgSendInfo.
     * 
     * @param batchInfo
     */
    public void setBatchInfo(java.lang.String batchInfo) {
        this.batchInfo = batchInfo;
    }


    /**
     * Gets the notifyType value for this MsgSendInfo.
     * 
     * @return notifyType
     */
    public java.lang.Integer getNotifyType() {
        return notifyType;
    }


    /**
     * Sets the notifyType value for this MsgSendInfo.
     * 
     * @param notifyType
     */
    public void setNotifyType(java.lang.Integer notifyType) {
        this.notifyType = notifyType;
    }


    /**
     * Gets the receiptDesc value for this MsgSendInfo.
     * 
     * @return receiptDesc
     */
    public java.lang.String getReceiptDesc() {
        return receiptDesc;
    }


    /**
     * Sets the receiptDesc value for this MsgSendInfo.
     * 
     * @param receiptDesc
     */
    public void setReceiptDesc(java.lang.String receiptDesc) {
        this.receiptDesc = receiptDesc;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MsgSendInfo)) return false;
        MsgSendInfo other = (MsgSendInfo) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.caller==null && other.getCaller()==null) || 
             (this.caller!=null &&
              this.caller.equals(other.getCaller()))) &&
            ((this.callee==null && other.getCallee()==null) || 
             (this.callee!=null &&
              this.callee.equals(other.getCallee()))) &&
            ((this.content==null && other.getContent()==null) || 
             (this.content!=null &&
              this.content.equals(other.getContent()))) &&
            this.len == other.getLen() &&
            ((this.timeSchedule==null && other.getTimeSchedule()==null) || 
             (this.timeSchedule!=null &&
              this.timeSchedule.equals(other.getTimeSchedule()))) &&
            ((this.timeSend==null && other.getTimeSend()==null) || 
             (this.timeSend!=null &&
              this.timeSend.equals(other.getTimeSend()))) &&
            this.status == other.getStatus() &&
            ((this.batchFlag==null && other.getBatchFlag()==null) || 
             (this.batchFlag!=null &&
              this.batchFlag.equals(other.getBatchFlag()))) &&
            ((this.batchInfo==null && other.getBatchInfo()==null) || 
             (this.batchInfo!=null &&
              this.batchInfo.equals(other.getBatchInfo()))) &&
            ((this.notifyType==null && other.getNotifyType()==null) || 
             (this.notifyType!=null &&
              this.notifyType.equals(other.getNotifyType()))) &&
            ((this.receiptDesc==null && other.getReceiptDesc()==null) || 
             (this.receiptDesc!=null &&
              this.receiptDesc.equals(other.getReceiptDesc())));
        __equalsCalc = null;
        return _equals;
    }

    private boolean __hashCodeCalc = false;
    public synchronized int hashCode() {
        if (__hashCodeCalc) {
            return 0;
        }
        __hashCodeCalc = true;
        int _hashCode = 1;
        _hashCode += getId();
        if (getCaller() != null) {
            _hashCode += getCaller().hashCode();
        }
        if (getCallee() != null) {
            _hashCode += getCallee().hashCode();
        }
        if (getContent() != null) {
            _hashCode += getContent().hashCode();
        }
        _hashCode += getLen();
        if (getTimeSchedule() != null) {
            _hashCode += getTimeSchedule().hashCode();
        }
        if (getTimeSend() != null) {
            _hashCode += getTimeSend().hashCode();
        }
        _hashCode += getStatus();
        if (getBatchFlag() != null) {
            _hashCode += getBatchFlag().hashCode();
        }
        if (getBatchInfo() != null) {
            _hashCode += getBatchInfo().hashCode();
        }
        if (getNotifyType() != null) {
            _hashCode += getNotifyType().hashCode();
        }
        if (getReceiptDesc() != null) {
            _hashCode += getReceiptDesc().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MsgSendInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgSendInfo"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("caller");
        elemField.setXmlName(new javax.xml.namespace.QName("", "caller"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("callee");
        elemField.setXmlName(new javax.xml.namespace.QName("", "callee"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("content");
        elemField.setXmlName(new javax.xml.namespace.QName("", "content"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("len");
        elemField.setXmlName(new javax.xml.namespace.QName("", "len"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeSchedule");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeSchedule"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeSend");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeSend"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("status");
        elemField.setXmlName(new javax.xml.namespace.QName("", "status"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("batchFlag");
        elemField.setXmlName(new javax.xml.namespace.QName("", "batchFlag"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("batchInfo");
        elemField.setXmlName(new javax.xml.namespace.QName("", "batchInfo"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("notifyType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "notifyType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("receiptDesc");
        elemField.setXmlName(new javax.xml.namespace.QName("", "receiptDesc"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
    }

    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

    /**
     * Get Custom Serializer
     */
    public static org.apache.axis.encoding.Serializer getSerializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanSerializer(
            _javaType, _xmlType, typeDesc);
    }

    /**
     * Get Custom Deserializer
     */
    public static org.apache.axis.encoding.Deserializer getDeserializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanDeserializer(
            _javaType, _xmlType, typeDesc);
    }

}
