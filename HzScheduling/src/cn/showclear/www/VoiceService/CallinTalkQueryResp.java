/**
 * CallinTalkQueryResp.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class CallinTalkQueryResp  implements java.io.Serializable {
    private java.lang.String resultCode;

    private java.lang.String callinTel;

    public CallinTalkQueryResp() {
    }

    public CallinTalkQueryResp(
           java.lang.String resultCode,
           java.lang.String callinTel) {
           this.resultCode = resultCode;
           this.callinTel = callinTel;
    }


    /**
     * Gets the resultCode value for this CallinTalkQueryResp.
     * 
     * @return resultCode
     */
    public java.lang.String getResultCode() {
        return resultCode;
    }


    /**
     * Sets the resultCode value for this CallinTalkQueryResp.
     * 
     * @param resultCode
     */
    public void setResultCode(java.lang.String resultCode) {
        this.resultCode = resultCode;
    }


    /**
     * Gets the callinTel value for this CallinTalkQueryResp.
     * 
     * @return callinTel
     */
    public java.lang.String getCallinTel() {
        return callinTel;
    }


    /**
     * Sets the callinTel value for this CallinTalkQueryResp.
     * 
     * @param callinTel
     */
    public void setCallinTel(java.lang.String callinTel) {
        this.callinTel = callinTel;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CallinTalkQueryResp)) return false;
        CallinTalkQueryResp other = (CallinTalkQueryResp) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.resultCode==null && other.getResultCode()==null) || 
             (this.resultCode!=null &&
              this.resultCode.equals(other.getResultCode()))) &&
            ((this.callinTel==null && other.getCallinTel()==null) || 
             (this.callinTel!=null &&
              this.callinTel.equals(other.getCallinTel())));
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
        if (getResultCode() != null) {
            _hashCode += getResultCode().hashCode();
        }
        if (getCallinTel() != null) {
            _hashCode += getCallinTel().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CallinTalkQueryResp.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinTalkQueryResp"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("resultCode");
        elemField.setXmlName(new javax.xml.namespace.QName("", "resultCode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("callinTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "callinTel"));
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
