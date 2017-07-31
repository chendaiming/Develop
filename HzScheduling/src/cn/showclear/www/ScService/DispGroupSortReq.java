/**
 * DispGroupSortReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class DispGroupSortReq  implements java.io.Serializable {
    private int id;

    private int centerId;

    private int oldIndex;

    private int newIndex;

    public DispGroupSortReq() {
    }

    public DispGroupSortReq(
           int id,
           int centerId,
           int oldIndex,
           int newIndex) {
           this.id = id;
           this.centerId = centerId;
           this.oldIndex = oldIndex;
           this.newIndex = newIndex;
    }


    /**
     * Gets the id value for this DispGroupSortReq.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this DispGroupSortReq.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the centerId value for this DispGroupSortReq.
     * 
     * @return centerId
     */
    public int getCenterId() {
        return centerId;
    }


    /**
     * Sets the centerId value for this DispGroupSortReq.
     * 
     * @param centerId
     */
    public void setCenterId(int centerId) {
        this.centerId = centerId;
    }


    /**
     * Gets the oldIndex value for this DispGroupSortReq.
     * 
     * @return oldIndex
     */
    public int getOldIndex() {
        return oldIndex;
    }


    /**
     * Sets the oldIndex value for this DispGroupSortReq.
     * 
     * @param oldIndex
     */
    public void setOldIndex(int oldIndex) {
        this.oldIndex = oldIndex;
    }


    /**
     * Gets the newIndex value for this DispGroupSortReq.
     * 
     * @return newIndex
     */
    public int getNewIndex() {
        return newIndex;
    }


    /**
     * Sets the newIndex value for this DispGroupSortReq.
     * 
     * @param newIndex
     */
    public void setNewIndex(int newIndex) {
        this.newIndex = newIndex;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DispGroupSortReq)) return false;
        DispGroupSortReq other = (DispGroupSortReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            this.centerId == other.getCenterId() &&
            this.oldIndex == other.getOldIndex() &&
            this.newIndex == other.getNewIndex();
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
        _hashCode += getId();
        _hashCode += getCenterId();
        _hashCode += getOldIndex();
        _hashCode += getNewIndex();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DispGroupSortReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupSortReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("centerId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "centerId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("oldIndex");
        elemField.setXmlName(new javax.xml.namespace.QName("", "oldIndex"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("newIndex");
        elemField.setXmlName(new javax.xml.namespace.QName("", "newIndex"));
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
