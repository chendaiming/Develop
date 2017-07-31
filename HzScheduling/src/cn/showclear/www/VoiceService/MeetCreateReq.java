/**
 * MeetCreateReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class MeetCreateReq  implements java.io.Serializable {
    private java.lang.String sessionId;

    private java.lang.String meetNo;

    private java.lang.Integer isRecord;

    public MeetCreateReq() {
    }

    public MeetCreateReq(
           java.lang.String sessionId,
           java.lang.String meetNo,
           java.lang.Integer isRecord) {
           this.sessionId = sessionId;
           this.meetNo = meetNo;
           this.isRecord = isRecord;
    }


    /**
     * Gets the sessionId value for this MeetCreateReq.
     * 
     * @return sessionId
     */
    public java.lang.String getSessionId() {
        return sessionId;
    }


    /**
     * Sets the sessionId value for this MeetCreateReq.
     * 
     * @param sessionId
     */
    public void setSessionId(java.lang.String sessionId) {
        this.sessionId = sessionId;
    }


    /**
     * Gets the meetNo value for this MeetCreateReq.
     * 
     * @return meetNo
     */
    public java.lang.String getMeetNo() {
        return meetNo;
    }


    /**
     * Sets the meetNo value for this MeetCreateReq.
     * 
     * @param meetNo
     */
    public void setMeetNo(java.lang.String meetNo) {
        this.meetNo = meetNo;
    }


    /**
     * Gets the isRecord value for this MeetCreateReq.
     * 
     * @return isRecord
     */
    public java.lang.Integer getIsRecord() {
        return isRecord;
    }


    /**
     * Sets the isRecord value for this MeetCreateReq.
     * 
     * @param isRecord
     */
    public void setIsRecord(java.lang.Integer isRecord) {
        this.isRecord = isRecord;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MeetCreateReq)) return false;
        MeetCreateReq other = (MeetCreateReq) obj;
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
            ((this.meetNo==null && other.getMeetNo()==null) || 
             (this.meetNo!=null &&
              this.meetNo.equals(other.getMeetNo()))) &&
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
        if (getMeetNo() != null) {
            _hashCode += getMeetNo().hashCode();
        }
        if (getIsRecord() != null) {
            _hashCode += getIsRecord().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MeetCreateReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">MeetCreateReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sessionId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "sessionId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("meetNo");
        elemField.setXmlName(new javax.xml.namespace.QName("", "meetNo"));
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
