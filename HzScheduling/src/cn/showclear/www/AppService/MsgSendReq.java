/**
 * MsgSendReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class MsgSendReq  implements java.io.Serializable {
    private java.lang.String caller;

    private java.lang.String callee;

    private java.lang.String content;

    private java.lang.String timeSchedule;

    private java.lang.Integer notifyType;

    public MsgSendReq() {
    }

    public MsgSendReq(
           java.lang.String caller,
           java.lang.String callee,
           java.lang.String content,
           java.lang.String timeSchedule,
           java.lang.Integer notifyType) {
           this.caller = caller;
           this.callee = callee;
           this.content = content;
           this.timeSchedule = timeSchedule;
           this.notifyType = notifyType;
    }


    /**
     * Gets the caller value for this MsgSendReq.
     * 
     * @return caller
     */
    public java.lang.String getCaller() {
        return caller;
    }


    /**
     * Sets the caller value for this MsgSendReq.
     * 
     * @param caller
     */
    public void setCaller(java.lang.String caller) {
        this.caller = caller;
    }


    /**
     * Gets the callee value for this MsgSendReq.
     * 
     * @return callee
     */
    public java.lang.String getCallee() {
        return callee;
    }


    /**
     * Sets the callee value for this MsgSendReq.
     * 
     * @param callee
     */
    public void setCallee(java.lang.String callee) {
        this.callee = callee;
    }


    /**
     * Gets the content value for this MsgSendReq.
     * 
     * @return content
     */
    public java.lang.String getContent() {
        return content;
    }


    /**
     * Sets the content value for this MsgSendReq.
     * 
     * @param content
     */
    public void setContent(java.lang.String content) {
        this.content = content;
    }


    /**
     * Gets the timeSchedule value for this MsgSendReq.
     * 
     * @return timeSchedule
     */
    public java.lang.String getTimeSchedule() {
        return timeSchedule;
    }


    /**
     * Sets the timeSchedule value for this MsgSendReq.
     * 
     * @param timeSchedule
     */
    public void setTimeSchedule(java.lang.String timeSchedule) {
        this.timeSchedule = timeSchedule;
    }


    /**
     * Gets the notifyType value for this MsgSendReq.
     * 
     * @return notifyType
     */
    public java.lang.Integer getNotifyType() {
        return notifyType;
    }


    /**
     * Sets the notifyType value for this MsgSendReq.
     * 
     * @param notifyType
     */
    public void setNotifyType(java.lang.Integer notifyType) {
        this.notifyType = notifyType;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MsgSendReq)) return false;
        MsgSendReq other = (MsgSendReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.caller==null && other.getCaller()==null) || 
             (this.caller!=null &&
              this.caller.equals(other.getCaller()))) &&
            ((this.callee==null && other.getCallee()==null) || 
             (this.callee!=null &&
              this.callee.equals(other.getCallee()))) &&
            ((this.content==null && other.getContent()==null) || 
             (this.content!=null &&
              this.content.equals(other.getContent()))) &&
            ((this.timeSchedule==null && other.getTimeSchedule()==null) || 
             (this.timeSchedule!=null &&
              this.timeSchedule.equals(other.getTimeSchedule()))) &&
            ((this.notifyType==null && other.getNotifyType()==null) || 
             (this.notifyType!=null &&
              this.notifyType.equals(other.getNotifyType())));
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
        if (getCaller() != null) {
            _hashCode += getCaller().hashCode();
        }
        if (getCallee() != null) {
            _hashCode += getCallee().hashCode();
        }
        if (getContent() != null) {
            _hashCode += getContent().hashCode();
        }
        if (getTimeSchedule() != null) {
            _hashCode += getTimeSchedule().hashCode();
        }
        if (getNotifyType() != null) {
            _hashCode += getNotifyType().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MsgSendReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">MsgSendReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
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
        elemField.setFieldName("timeSchedule");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeSchedule"));
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
