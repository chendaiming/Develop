/**
 * CallTransferReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class CallTransferReq  implements java.io.Serializable {
    private java.lang.String sessionId;

    private java.lang.String fromTel;

    private java.lang.String toTel;

    public CallTransferReq() {
    }

    public CallTransferReq(
           java.lang.String sessionId,
           java.lang.String fromTel,
           java.lang.String toTel) {
           this.sessionId = sessionId;
           this.fromTel = fromTel;
           this.toTel = toTel;
    }


    /**
     * Gets the sessionId value for this CallTransferReq.
     * 
     * @return sessionId
     */
    public java.lang.String getSessionId() {
        return sessionId;
    }


    /**
     * Sets the sessionId value for this CallTransferReq.
     * 
     * @param sessionId
     */
    public void setSessionId(java.lang.String sessionId) {
        this.sessionId = sessionId;
    }


    /**
     * Gets the fromTel value for this CallTransferReq.
     * 
     * @return fromTel
     */
    public java.lang.String getFromTel() {
        return fromTel;
    }


    /**
     * Sets the fromTel value for this CallTransferReq.
     * 
     * @param fromTel
     */
    public void setFromTel(java.lang.String fromTel) {
        this.fromTel = fromTel;
    }


    /**
     * Gets the toTel value for this CallTransferReq.
     * 
     * @return toTel
     */
    public java.lang.String getToTel() {
        return toTel;
    }


    /**
     * Sets the toTel value for this CallTransferReq.
     * 
     * @param toTel
     */
    public void setToTel(java.lang.String toTel) {
        this.toTel = toTel;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CallTransferReq)) return false;
        CallTransferReq other = (CallTransferReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.sessionId==null && other.getSessionId()==null) || 
             (this.sessionId!=null &&
              this.sessionId.equals(other.getSessionId()))) &&
            ((this.fromTel==null && other.getFromTel()==null) || 
             (this.fromTel!=null &&
              this.fromTel.equals(other.getFromTel()))) &&
            ((this.toTel==null && other.getToTel()==null) || 
             (this.toTel!=null &&
              this.toTel.equals(other.getToTel())));
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
        if (getSessionId() != null) {
            _hashCode += getSessionId().hashCode();
        }
        if (getFromTel() != null) {
            _hashCode += getFromTel().hashCode();
        }
        if (getToTel() != null) {
            _hashCode += getToTel().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CallTransferReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallTransferReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sessionId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "sessionId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("fromTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "fromTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("toTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "toTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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
