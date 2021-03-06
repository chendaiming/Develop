/**
 * MeetQueryResp.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class MeetQueryResp  implements java.io.Serializable {
    private java.lang.String resultCode;

    private cn.showclear.www.VoiceService.MeetInfo[] meetInfos;

    public MeetQueryResp() {
    }

    public MeetQueryResp(
           java.lang.String resultCode,
           cn.showclear.www.VoiceService.MeetInfo[] meetInfos) {
           this.resultCode = resultCode;
           this.meetInfos = meetInfos;
    }


    /**
     * Gets the resultCode value for this MeetQueryResp.
     * 
     * @return resultCode
     */
    public java.lang.String getResultCode() {
        return resultCode;
    }


    /**
     * Sets the resultCode value for this MeetQueryResp.
     * 
     * @param resultCode
     */
    public void setResultCode(java.lang.String resultCode) {
        this.resultCode = resultCode;
    }


    /**
     * Gets the meetInfos value for this MeetQueryResp.
     * 
     * @return meetInfos
     */
    public cn.showclear.www.VoiceService.MeetInfo[] getMeetInfos() {
        return meetInfos;
    }


    /**
     * Sets the meetInfos value for this MeetQueryResp.
     * 
     * @param meetInfos
     */
    public void setMeetInfos(cn.showclear.www.VoiceService.MeetInfo[] meetInfos) {
        this.meetInfos = meetInfos;
    }

    public cn.showclear.www.VoiceService.MeetInfo getMeetInfos(int i) {
        return this.meetInfos[i];
    }

    public void setMeetInfos(int i, cn.showclear.www.VoiceService.MeetInfo _value) {
        this.meetInfos[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MeetQueryResp)) return false;
        MeetQueryResp other = (MeetQueryResp) obj;
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
            ((this.meetInfos==null && other.getMeetInfos()==null) || 
             (this.meetInfos!=null &&
              java.util.Arrays.equals(this.meetInfos, other.getMeetInfos())));
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
        if (getMeetInfos() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getMeetInfos());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getMeetInfos(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MeetQueryResp.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetQueryResp"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("resultCode");
        elemField.setXmlName(new javax.xml.namespace.QName("", "resultCode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("meetInfos");
        elemField.setXmlName(new javax.xml.namespace.QName("", "meetInfos"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetInfo"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        elemField.setMaxOccursUnbounded(true);
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
