/**
 * DispatcherReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class DispatcherReq  implements java.io.Serializable {
    private cn.showclear.www.ScService.Dispatcher dispatcher;

    public DispatcherReq() {
    }

    public DispatcherReq(
           cn.showclear.www.ScService.Dispatcher dispatcher) {
           this.dispatcher = dispatcher;
    }


    /**
     * Gets the dispatcher value for this DispatcherReq.
     * 
     * @return dispatcher
     */
    public cn.showclear.www.ScService.Dispatcher getDispatcher() {
        return dispatcher;
    }


    /**
     * Sets the dispatcher value for this DispatcherReq.
     * 
     * @param dispatcher
     */
    public void setDispatcher(cn.showclear.www.ScService.Dispatcher dispatcher) {
        this.dispatcher = dispatcher;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DispatcherReq)) return false;
        DispatcherReq other = (DispatcherReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.dispatcher==null && other.getDispatcher()==null) || 
             (this.dispatcher!=null &&
              this.dispatcher.equals(other.getDispatcher())));
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
        if (getDispatcher() != null) {
            _hashCode += getDispatcher().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DispatcherReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispatcherReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dispatcher");
        elemField.setXmlName(new javax.xml.namespace.QName("", "dispatcher"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Dispatcher"));
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
