/**
 * CallinMissedQueryReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class CallinMissedQueryReq  implements java.io.Serializable {
    private java.lang.String timeMin;

    private java.lang.String timeMax;

    private int pageIndex;

    private int pageSize;

    public CallinMissedQueryReq() {
    }

    public CallinMissedQueryReq(
           java.lang.String timeMin,
           java.lang.String timeMax,
           int pageIndex,
           int pageSize) {
           this.timeMin = timeMin;
           this.timeMax = timeMax;
           this.pageIndex = pageIndex;
           this.pageSize = pageSize;
    }


    /**
     * Gets the timeMin value for this CallinMissedQueryReq.
     * 
     * @return timeMin
     */
    public java.lang.String getTimeMin() {
        return timeMin;
    }


    /**
     * Sets the timeMin value for this CallinMissedQueryReq.
     * 
     * @param timeMin
     */
    public void setTimeMin(java.lang.String timeMin) {
        this.timeMin = timeMin;
    }


    /**
     * Gets the timeMax value for this CallinMissedQueryReq.
     * 
     * @return timeMax
     */
    public java.lang.String getTimeMax() {
        return timeMax;
    }


    /**
     * Sets the timeMax value for this CallinMissedQueryReq.
     * 
     * @param timeMax
     */
    public void setTimeMax(java.lang.String timeMax) {
        this.timeMax = timeMax;
    }


    /**
     * Gets the pageIndex value for this CallinMissedQueryReq.
     * 
     * @return pageIndex
     */
    public int getPageIndex() {
        return pageIndex;
    }


    /**
     * Sets the pageIndex value for this CallinMissedQueryReq.
     * 
     * @param pageIndex
     */
    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }


    /**
     * Gets the pageSize value for this CallinMissedQueryReq.
     * 
     * @return pageSize
     */
    public int getPageSize() {
        return pageSize;
    }


    /**
     * Sets the pageSize value for this CallinMissedQueryReq.
     * 
     * @param pageSize
     */
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CallinMissedQueryReq)) return false;
        CallinMissedQueryReq other = (CallinMissedQueryReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.timeMin==null && other.getTimeMin()==null) || 
             (this.timeMin!=null &&
              this.timeMin.equals(other.getTimeMin()))) &&
            ((this.timeMax==null && other.getTimeMax()==null) || 
             (this.timeMax!=null &&
              this.timeMax.equals(other.getTimeMax()))) &&
            this.pageIndex == other.getPageIndex() &&
            this.pageSize == other.getPageSize();
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
        if (getTimeMin() != null) {
            _hashCode += getTimeMin().hashCode();
        }
        if (getTimeMax() != null) {
            _hashCode += getTimeMax().hashCode();
        }
        _hashCode += getPageIndex();
        _hashCode += getPageSize();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CallinMissedQueryReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">CallinMissedQueryReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeMin");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeMin"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeMax");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeMax"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("pageIndex");
        elemField.setXmlName(new javax.xml.namespace.QName("", "pageIndex"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("pageSize");
        elemField.setXmlName(new javax.xml.namespace.QName("", "pageSize"));
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
