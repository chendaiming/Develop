/**
 * CallAnswerReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class CallAnswerReq  implements java.io.Serializable {
    private java.lang.String sessionId;

    private java.lang.String callinTel;

    private java.lang.String answerTel;

    private java.lang.Integer isRecord;

    public CallAnswerReq() {
    }

    public CallAnswerReq(
           java.lang.String sessionId,
           java.lang.String callinTel,
           java.lang.String answerTel,
           java.lang.Integer isRecord) {
           this.sessionId = sessionId;
           this.callinTel = callinTel;
           this.answerTel = answerTel;
           this.isRecord = isRecord;
    }


    /**
     * Gets the sessionId value for this CallAnswerReq.
     * 
     * @return sessionId
     */
    public java.lang.String getSessionId() {
        return sessionId;
    }


    /**
     * Sets the sessionId value for this CallAnswerReq.
     * 
     * @param sessionId
     */
    public void setSessionId(java.lang.String sessionId) {
        this.sessionId = sessionId;
    }


    /**
     * Gets the callinTel value for this CallAnswerReq.
     * 
     * @return callinTel
     */
    public java.lang.String getCallinTel() {
        return callinTel;
    }


    /**
     * Sets the callinTel value for this CallAnswerReq.
     * 
     * @param callinTel
     */
    public void setCallinTel(java.lang.String callinTel) {
        this.callinTel = callinTel;
    }


    /**
     * Gets the answerTel value for this CallAnswerReq.
     * 
     * @return answerTel
     */
    public java.lang.String getAnswerTel() {
        return answerTel;
    }


    /**
     * Sets the answerTel value for this CallAnswerReq.
     * 
     * @param answerTel
     */
    public void setAnswerTel(java.lang.String answerTel) {
        this.answerTel = answerTel;
    }


    /**
     * Gets the isRecord value for this CallAnswerReq.
     * 
     * @return isRecord
     */
    public java.lang.Integer getIsRecord() {
        return isRecord;
    }


    /**
     * Sets the isRecord value for this CallAnswerReq.
     * 
     * @param isRecord
     */
    public void setIsRecord(java.lang.Integer isRecord) {
        this.isRecord = isRecord;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CallAnswerReq)) return false;
        CallAnswerReq other = (CallAnswerReq) obj;
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
            ((this.callinTel==null && other.getCallinTel()==null) || 
             (this.callinTel!=null &&
              this.callinTel.equals(other.getCallinTel()))) &&
            ((this.answerTel==null && other.getAnswerTel()==null) || 
             (this.answerTel!=null &&
              this.answerTel.equals(other.getAnswerTel()))) &&
            ((this.isRecord==null && other.getIsRecord()==null) || 
             (this.isRecord!=null &&
              this.isRecord.equals(other.getIsRecord())));
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
        if (getCallinTel() != null) {
            _hashCode += getCallinTel().hashCode();
        }
        if (getAnswerTel() != null) {
            _hashCode += getAnswerTel().hashCode();
        }
        if (getIsRecord() != null) {
            _hashCode += getIsRecord().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CallAnswerReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallAnswerReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sessionId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "sessionId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("callinTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "callinTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("answerTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "answerTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("isRecord");
        elemField.setXmlName(new javax.xml.namespace.QName("", "isRecord"));
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
