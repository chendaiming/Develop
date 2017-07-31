/**
 * PowerSwitchReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class PowerSwitchReq  implements java.io.Serializable {
    private cn.showclear.www.ScService.PowerSwitch powerSwitch;

    public PowerSwitchReq() {
    }

    public PowerSwitchReq(
           cn.showclear.www.ScService.PowerSwitch powerSwitch) {
           this.powerSwitch = powerSwitch;
    }


    /**
     * Gets the powerSwitch value for this PowerSwitchReq.
     * 
     * @return powerSwitch
     */
    public cn.showclear.www.ScService.PowerSwitch getPowerSwitch() {
        return powerSwitch;
    }


    /**
     * Sets the powerSwitch value for this PowerSwitchReq.
     * 
     * @param powerSwitch
     */
    public void setPowerSwitch(cn.showclear.www.ScService.PowerSwitch powerSwitch) {
        this.powerSwitch = powerSwitch;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof PowerSwitchReq)) return false;
        PowerSwitchReq other = (PowerSwitchReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.powerSwitch==null && other.getPowerSwitch()==null) || 
             (this.powerSwitch!=null &&
              this.powerSwitch.equals(other.getPowerSwitch())));
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
        if (getPowerSwitch() != null) {
            _hashCode += getPowerSwitch().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(PowerSwitchReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">PowerSwitchReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("powerSwitch");
        elemField.setXmlName(new javax.xml.namespace.QName("", "powerSwitch"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "PowerSwitch"));
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
