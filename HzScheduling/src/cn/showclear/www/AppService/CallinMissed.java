/**
 * CallinMissed.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class CallinMissed  implements java.io.Serializable {
    private int id;

    private java.lang.String tel;

    private java.lang.String tmCall;

    private java.lang.String tmHang;

    public CallinMissed() {
    }

    public CallinMissed(
           int id,
           java.lang.String tel,
           java.lang.String tmCall,
           java.lang.String tmHang) {
           this.id = id;
           this.tel = tel;
           this.tmCall = tmCall;
           this.tmHang = tmHang;
    }


    /**
     * Gets the id value for this CallinMissed.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this CallinMissed.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the tel value for this CallinMissed.
     * 
     * @return tel
     */
    public java.lang.String getTel() {
        return tel;
    }


    /**
     * Sets the tel value for this CallinMissed.
     * 
     * @param tel
     */
    public void setTel(java.lang.String tel) {
        this.tel = tel;
    }


    /**
     * Gets the tmCall value for this CallinMissed.
     * 
     * @return tmCall
     */
    public java.lang.String getTmCall() {
        return tmCall;
    }


    /**
     * Sets the tmCall value for this CallinMissed.
     * 
     * @param tmCall
     */
    public void setTmCall(java.lang.String tmCall) {
        this.tmCall = tmCall;
    }


    /**
     * Gets the tmHang value for this CallinMissed.
     * 
     * @return tmHang
     */
    public java.lang.String getTmHang() {
        return tmHang;
    }


    /**
     * Sets the tmHang value for this CallinMissed.
     * 
     * @param tmHang
     */
    public void setTmHang(java.lang.String tmHang) {
        this.tmHang = tmHang;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CallinMissed)) return false;
        CallinMissed other = (CallinMissed) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.tel==null && other.getTel()==null) || 
             (this.tel!=null &&
              this.tel.equals(other.getTel()))) &&
            ((this.tmCall==null && other.getTmCall()==null) || 
             (this.tmCall!=null &&
              this.tmCall.equals(other.getTmCall()))) &&
            ((this.tmHang==null && other.getTmHang()==null) || 
             (this.tmHang!=null &&
              this.tmHang.equals(other.getTmHang())));
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
        if (getTel() != null) {
            _hashCode += getTel().hashCode();
        }
        if (getTmCall() != null) {
            _hashCode += getTmCall().hashCode();
        }
        if (getTmHang() != null) {
            _hashCode += getTmHang().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CallinMissed.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "CallinMissed"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tmCall");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tmCall"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tmHang");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tmHang"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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
