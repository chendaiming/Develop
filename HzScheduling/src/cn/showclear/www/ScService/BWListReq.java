/**
 * BWListReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class BWListReq  implements java.io.Serializable {
    private cn.showclear.www.ScService.BWList bwlist;

    public BWListReq() {
    }

    public BWListReq(
           cn.showclear.www.ScService.BWList bwlist) {
           this.bwlist = bwlist;
    }


    /**
     * Gets the bwlist value for this BWListReq.
     * 
     * @return bwlist
     */
    public cn.showclear.www.ScService.BWList getBwlist() {
        return bwlist;
    }


    /**
     * Sets the bwlist value for this BWListReq.
     * 
     * @param bwlist
     */
    public void setBwlist(cn.showclear.www.ScService.BWList bwlist) {
        this.bwlist = bwlist;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof BWListReq)) return false;
        BWListReq other = (BWListReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.bwlist==null && other.getBwlist()==null) || 
             (this.bwlist!=null &&
              this.bwlist.equals(other.getBwlist())));
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
        if (getBwlist() != null) {
            _hashCode += getBwlist().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(BWListReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">BWListReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("bwlist");
        elemField.setXmlName(new javax.xml.namespace.QName("", "bwlist"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "BWList"));
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
