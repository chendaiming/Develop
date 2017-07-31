/**
 * MsgRecvInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class MsgRecvInfo  implements java.io.Serializable {
    private int id;

    private java.lang.String caller;

    private java.lang.String callee;

    private java.lang.String content;

    private int len;

    private java.lang.String timeRecv;

    private int status;

    public MsgRecvInfo() {
    }

    public MsgRecvInfo(
           int id,
           java.lang.String caller,
           java.lang.String callee,
           java.lang.String content,
           int len,
           java.lang.String timeRecv,
           int status) {
           this.id = id;
           this.caller = caller;
           this.callee = callee;
           this.content = content;
           this.len = len;
           this.timeRecv = timeRecv;
           this.status = status;
    }


    /**
     * Gets the id value for this MsgRecvInfo.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this MsgRecvInfo.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the caller value for this MsgRecvInfo.
     * 
     * @return caller
     */
    public java.lang.String getCaller() {
        return caller;
    }


    /**
     * Sets the caller value for this MsgRecvInfo.
     * 
     * @param caller
     */
    public void setCaller(java.lang.String caller) {
        this.caller = caller;
    }


    /**
     * Gets the callee value for this MsgRecvInfo.
     * 
     * @return callee
     */
    public java.lang.String getCallee() {
        return callee;
    }


    /**
     * Sets the callee value for this MsgRecvInfo.
     * 
     * @param callee
     */
    public void setCallee(java.lang.String callee) {
        this.callee = callee;
    }


    /**
     * Gets the content value for this MsgRecvInfo.
     * 
     * @return content
     */
    public java.lang.String getContent() {
        return content;
    }


    /**
     * Sets the content value for this MsgRecvInfo.
     * 
     * @param content
     */
    public void setContent(java.lang.String content) {
        this.content = content;
    }


    /**
     * Gets the len value for this MsgRecvInfo.
     * 
     * @return len
     */
    public int getLen() {
        return len;
    }


    /**
     * Sets the len value for this MsgRecvInfo.
     * 
     * @param len
     */
    public void setLen(int len) {
        this.len = len;
    }


    /**
     * Gets the timeRecv value for this MsgRecvInfo.
     * 
     * @return timeRecv
     */
    public java.lang.String getTimeRecv() {
        return timeRecv;
    }


    /**
     * Sets the timeRecv value for this MsgRecvInfo.
     * 
     * @param timeRecv
     */
    public void setTimeRecv(java.lang.String timeRecv) {
        this.timeRecv = timeRecv;
    }


    /**
     * Gets the status value for this MsgRecvInfo.
     * 
     * @return status
     */
    public int getStatus() {
        return status;
    }


    /**
     * Sets the status value for this MsgRecvInfo.
     * 
     * @param status
     */
    public void setStatus(int status) {
        this.status = status;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MsgRecvInfo)) return false;
        MsgRecvInfo other = (MsgRecvInfo) obj;
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
            ((this.timeRecv==null && other.getTimeRecv()==null) || 
             (this.timeRecv!=null &&
              this.timeRecv.equals(other.getTimeRecv()))) &&
            this.status == other.getStatus();
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
        if (getTimeRecv() != null) {
            _hashCode += getTimeRecv().hashCode();
        }
        _hashCode += getStatus();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MsgRecvInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "MsgRecvInfo"));
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
        elemField.setFieldName("timeRecv");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeRecv"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("status");
        elemField.setXmlName(new javax.xml.namespace.QName("", "status"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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
