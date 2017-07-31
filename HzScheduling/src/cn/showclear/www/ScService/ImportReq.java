/**
 * ImportReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class ImportReq  implements java.io.Serializable {
    private int fileType;

    private byte[] filecontent;

    public ImportReq() {
    }

    public ImportReq(
           int fileType,
           byte[] filecontent) {
           this.fileType = fileType;
           this.filecontent = filecontent;
    }


    /**
     * Gets the fileType value for this ImportReq.
     * 
     * @return fileType
     */
    public int getFileType() {
        return fileType;
    }


    /**
     * Sets the fileType value for this ImportReq.
     * 
     * @param fileType
     */
    public void setFileType(int fileType) {
        this.fileType = fileType;
    }


    /**
     * Gets the filecontent value for this ImportReq.
     * 
     * @return filecontent
     */
    public byte[] getFilecontent() {
        return filecontent;
    }


    /**
     * Sets the filecontent value for this ImportReq.
     * 
     * @param filecontent
     */
    public void setFilecontent(byte[] filecontent) {
        this.filecontent = filecontent;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ImportReq)) return false;
        ImportReq other = (ImportReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.fileType == other.getFileType() &&
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
        _hashCode += getFileType();
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
        new org.apache.axis.description.TypeDesc(ImportReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">ImportReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("fileType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "fileType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("filecontent");
        elemField.setXmlName(new javax.xml.namespace.QName("", "filecontent"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "base64Binary"));
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
