/**
 * FaxSendQueryReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class FaxSendQueryReq  implements java.io.Serializable {
    private java.lang.String telSend;

    private java.lang.String telRecv;

    private java.lang.String timeMin;

    private java.lang.String timeMax;

    private int status;

    private int pageIndex;

    private int pageSize;

    public FaxSendQueryReq() {
    }

    public FaxSendQueryReq(
           java.lang.String telSend,
           java.lang.String telRecv,
           java.lang.String timeMin,
           java.lang.String timeMax,
           int status,
           int pageIndex,
           int pageSize) {
           this.telSend = telSend;
           this.telRecv = telRecv;
           this.timeMin = timeMin;
           this.timeMax = timeMax;
           this.status = status;
           this.pageIndex = pageIndex;
           this.pageSize = pageSize;
    }


    /**
     * Gets the telSend value for this FaxSendQueryReq.
     * 
     * @return telSend
     */
    public java.lang.String getTelSend() {
        return telSend;
    }


    /**
     * Sets the telSend value for this FaxSendQueryReq.
     * 
     * @param telSend
     */
    public void setTelSend(java.lang.String telSend) {
        this.telSend = telSend;
    }


    /**
     * Gets the telRecv value for this FaxSendQueryReq.
     * 
     * @return telRecv
     */
    public java.lang.String getTelRecv() {
        return telRecv;
    }


    /**
     * Sets the telRecv value for this FaxSendQueryReq.
     * 
     * @param telRecv
     */
    public void setTelRecv(java.lang.String telRecv) {
        this.telRecv = telRecv;
    }


    /**
     * Gets the timeMin value for this FaxSendQueryReq.
     * 
     * @return timeMin
     */
    public java.lang.String getTimeMin() {
        return timeMin;
    }


    /**
     * Sets the timeMin value for this FaxSendQueryReq.
     * 
     * @param timeMin
     */
    public void setTimeMin(java.lang.String timeMin) {
        this.timeMin = timeMin;
    }


    /**
     * Gets the timeMax value for this FaxSendQueryReq.
     * 
     * @return timeMax
     */
    public java.lang.String getTimeMax() {
        return timeMax;
    }


    /**
     * Sets the timeMax value for this FaxSendQueryReq.
     * 
     * @param timeMax
     */
    public void setTimeMax(java.lang.String timeMax) {
        this.timeMax = timeMax;
    }


    /**
     * Gets the status value for this FaxSendQueryReq.
     * 
     * @return status
     */
    public int getStatus() {
        return status;
    }


    /**
     * Sets the status value for this FaxSendQueryReq.
     * 
     * @param status
     */
    public void setStatus(int status) {
        this.status = status;
    }


    /**
     * Gets the pageIndex value for this FaxSendQueryReq.
     * 
     * @return pageIndex
     */
    public int getPageIndex() {
        return pageIndex;
    }


    /**
     * Sets the pageIndex value for this FaxSendQueryReq.
     * 
     * @param pageIndex
     */
    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }


    /**
     * Gets the pageSize value for this FaxSendQueryReq.
     * 
     * @return pageSize
     */
    public int getPageSize() {
        return pageSize;
    }


    /**
     * Sets the pageSize value for this FaxSendQueryReq.
     * 
     * @param pageSize
     */
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FaxSendQueryReq)) return false;
        FaxSendQueryReq other = (FaxSendQueryReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.telSend==null && other.getTelSend()==null) || 
             (this.telSend!=null &&
              this.telSend.equals(other.getTelSend()))) &&
            ((this.telRecv==null && other.getTelRecv()==null) || 
             (this.telRecv!=null &&
              this.telRecv.equals(other.getTelRecv()))) &&
            ((this.timeMin==null && other.getTimeMin()==null) || 
             (this.timeMin!=null &&
              this.timeMin.equals(other.getTimeMin()))) &&
            ((this.timeMax==null && other.getTimeMax()==null) || 
             (this.timeMax!=null &&
              this.timeMax.equals(other.getTimeMax()))) &&
            this.status == other.getStatus() &&
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
        if (getTelSend() != null) {
            _hashCode += getTelSend().hashCode();
        }
        if (getTelRecv() != null) {
            _hashCode += getTelRecv().hashCode();
        }
        if (getTimeMin() != null) {
            _hashCode += getTimeMin().hashCode();
        }
        if (getTimeMax() != null) {
            _hashCode += getTimeMax().hashCode();
        }
        _hashCode += getStatus();
        _hashCode += getPageIndex();
        _hashCode += getPageSize();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FaxSendQueryReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendQueryReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("telSend");
        elemField.setXmlName(new javax.xml.namespace.QName("", "telSend"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("telRecv");
        elemField.setXmlName(new javax.xml.namespace.QName("", "telRecv"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
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
        elemField.setFieldName("status");
        elemField.setXmlName(new javax.xml.namespace.QName("", "status"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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
