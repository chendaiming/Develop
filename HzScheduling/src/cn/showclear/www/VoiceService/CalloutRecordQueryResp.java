/**
 * CalloutRecordQueryResp.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class CalloutRecordQueryResp  implements java.io.Serializable {
    private java.lang.String resultCode;

    private int total;

    private cn.showclear.www.VoiceService.CalloutRecord[] infoArr;

    public CalloutRecordQueryResp() {
    }

    public CalloutRecordQueryResp(
           java.lang.String resultCode,
           int total,
           cn.showclear.www.VoiceService.CalloutRecord[] infoArr) {
           this.resultCode = resultCode;
           this.total = total;
           this.infoArr = infoArr;
    }


    /**
     * Gets the resultCode value for this CalloutRecordQueryResp.
     * 
     * @return resultCode
     */
    public java.lang.String getResultCode() {
        return resultCode;
    }


    /**
     * Sets the resultCode value for this CalloutRecordQueryResp.
     * 
     * @param resultCode
     */
    public void setResultCode(java.lang.String resultCode) {
        this.resultCode = resultCode;
    }


    /**
     * Gets the total value for this CalloutRecordQueryResp.
     * 
     * @return total
     */
    public int getTotal() {
        return total;
    }


    /**
     * Sets the total value for this CalloutRecordQueryResp.
     * 
     * @param total
     */
    public void setTotal(int total) {
        this.total = total;
    }


    /**
     * Gets the infoArr value for this CalloutRecordQueryResp.
     * 
     * @return infoArr
     */
    public cn.showclear.www.VoiceService.CalloutRecord[] getInfoArr() {
        return infoArr;
    }


    /**
     * Sets the infoArr value for this CalloutRecordQueryResp.
     * 
     * @param infoArr
     */
    public void setInfoArr(cn.showclear.www.VoiceService.CalloutRecord[] infoArr) {
        this.infoArr = infoArr;
    }

    public cn.showclear.www.VoiceService.CalloutRecord getInfoArr(int i) {
        return this.infoArr[i];
    }

    public void setInfoArr(int i, cn.showclear.www.VoiceService.CalloutRecord _value) {
        this.infoArr[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CalloutRecordQueryResp)) return false;
        CalloutRecordQueryResp other = (CalloutRecordQueryResp) obj;
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
            this.total == other.getTotal() &&
            ((this.infoArr==null && other.getInfoArr()==null) || 
             (this.infoArr!=null &&
              java.util.Arrays.equals(this.infoArr, other.getInfoArr())));
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
        _hashCode += getTotal();
        if (getInfoArr() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getInfoArr());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getInfoArr(), i);
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
        new org.apache.axis.description.TypeDesc(CalloutRecordQueryResp.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CalloutRecordQueryResp"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("resultCode");
        elemField.setXmlName(new javax.xml.namespace.QName("", "resultCode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("total");
        elemField.setXmlName(new javax.xml.namespace.QName("", "total"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("infoArr");
        elemField.setXmlName(new javax.xml.namespace.QName("", "infoArr"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CalloutRecord"));
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
