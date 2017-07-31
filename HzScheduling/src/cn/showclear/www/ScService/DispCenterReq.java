/**
 * DispCenterReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class DispCenterReq  implements java.io.Serializable {
    private cn.showclear.www.ScService.DispCenter dispCenter;

    public DispCenterReq() {
    }

    public DispCenterReq(
           cn.showclear.www.ScService.DispCenter dispCenter) {
           this.dispCenter = dispCenter;
    }


    /**
     * Gets the dispCenter value for this DispCenterReq.
     * 
     * @return dispCenter
     */
    public cn.showclear.www.ScService.DispCenter getDispCenter() {
        return dispCenter;
    }


    /**
     * Sets the dispCenter value for this DispCenterReq.
     * 
     * @param dispCenter
     */
    public void setDispCenter(cn.showclear.www.ScService.DispCenter dispCenter) {
        this.dispCenter = dispCenter;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DispCenterReq)) return false;
        DispCenterReq other = (DispCenterReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.dispCenter==null && other.getDispCenter()==null) || 
             (this.dispCenter!=null &&
              this.dispCenter.equals(other.getDispCenter())));
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
        if (getDispCenter() != null) {
            _hashCode += getDispCenter().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DispCenterReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispCenterReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dispCenter");
        elemField.setXmlName(new javax.xml.namespace.QName("", "dispCenter"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispCenter"));
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
