/**
 * NotifyRecordUploadReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class NotifyRecordUploadReq  implements java.io.Serializable {
    private java.lang.String fileName;

    private java.lang.String title;

    private java.lang.Integer timeLen;

    private byte[] filecontent;

    public NotifyRecordUploadReq() {
    }

    public NotifyRecordUploadReq(
           java.lang.String fileName,
           java.lang.String title,
           java.lang.Integer timeLen,
           byte[] filecontent) {
           this.fileName = fileName;
           this.title = title;
           this.timeLen = timeLen;
           this.filecontent = filecontent;
    }


    /**
     * Gets the fileName value for this NotifyRecordUploadReq.
     * 
     * @return fileName
     */
    public java.lang.String getFileName() {
        return fileName;
    }


    /**
     * Sets the fileName value for this NotifyRecordUploadReq.
     * 
     * @param fileName
     */
    public void setFileName(java.lang.String fileName) {
        this.fileName = fileName;
    }


    /**
     * Gets the title value for this NotifyRecordUploadReq.
     * 
     * @return title
     */
    public java.lang.String getTitle() {
        return title;
    }


    /**
     * Sets the title value for this NotifyRecordUploadReq.
     * 
     * @param title
     */
    public void setTitle(java.lang.String title) {
        this.title = title;
    }


    /**
     * Gets the timeLen value for this NotifyRecordUploadReq.
     * 
     * @return timeLen
     */
    public java.lang.Integer getTimeLen() {
        return timeLen;
    }


    /**
     * Sets the timeLen value for this NotifyRecordUploadReq.
     * 
     * @param timeLen
     */
    public void setTimeLen(java.lang.Integer timeLen) {
        this.timeLen = timeLen;
    }


    /**
     * Gets the filecontent value for this NotifyRecordUploadReq.
     * 
     * @return filecontent
     */
    public byte[] getFilecontent() {
        return filecontent;
    }


    /**
     * Sets the filecontent value for this NotifyRecordUploadReq.
     * 
     * @param filecontent
     */
    public void setFilecontent(byte[] filecontent) {
        this.filecontent = filecontent;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof NotifyRecordUploadReq)) return false;
        NotifyRecordUploadReq other = (NotifyRecordUploadReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.fileName==null && other.getFileName()==null) || 
             (this.fileName!=null &&
              this.fileName.equals(other.getFileName()))) &&
            ((this.title==null && other.getTitle()==null) || 
             (this.title!=null &&
              this.title.equals(other.getTitle()))) &&
            ((this.timeLen==null && other.getTimeLen()==null) || 
             (this.timeLen!=null &&
              this.timeLen.equals(other.getTimeLen()))) &&
            ((this.filecontent==null && other.getFilecontent()==null) || 
             (this.filecontent!=null &&
              java.util.Arrays.equals(this.filecontent, other.getFilecontent())));
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
        if (getFileName() != null) {
            _hashCode += getFileName().hashCode();
        }
        if (getTitle() != null) {
            _hashCode += getTitle().hashCode();
        }
        if (getTimeLen() != null) {
            _hashCode += getTimeLen().hashCode();
        }
        if (getFilecontent() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getFilecontent());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getFilecontent(), i);
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
        new org.apache.axis.description.TypeDesc(NotifyRecordUploadReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">NotifyRecordUploadReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("fileName");
        elemField.setXmlName(new javax.xml.namespace.QName("", "fileName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("title");
        elemField.setXmlName(new javax.xml.namespace.QName("", "title"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeLen");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeLen"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("filecontent");
        elemField.setXmlName(new javax.xml.namespace.QName("", "filecontent"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "base64Binary"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
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
