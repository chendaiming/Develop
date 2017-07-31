/**
 * ConfigVideoReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class ConfigVideoReq  implements java.io.Serializable {
    private java.lang.String sessionId;

    private java.lang.String ipaddr;

    private int portMin;

    private int portMax;

    public ConfigVideoReq() {
    }

    public ConfigVideoReq(
           java.lang.String sessionId,
           java.lang.String ipaddr,
           int portMin,
           int portMax) {
           this.sessionId = sessionId;
           this.ipaddr = ipaddr;
           this.portMin = portMin;
           this.portMax = portMax;
    }


    /**
     * Gets the sessionId value for this ConfigVideoReq.
     * 
     * @return sessionId
     */
    public java.lang.String getSessionId() {
        return sessionId;
    }


    /**
     * Sets the sessionId value for this ConfigVideoReq.
     * 
     * @param sessionId
     */
    public void setSessionId(java.lang.String sessionId) {
        this.sessionId = sessionId;
    }


    /**
     * Gets the ipaddr value for this ConfigVideoReq.
     * 
     * @return ipaddr
     */
    public java.lang.String getIpaddr() {
        return ipaddr;
    }


    /**
     * Sets the ipaddr value for this ConfigVideoReq.
     * 
     * @param ipaddr
     */
    public void setIpaddr(java.lang.String ipaddr) {
        this.ipaddr = ipaddr;
    }


    /**
     * Gets the portMin value for this ConfigVideoReq.
     * 
     * @return portMin
     */
    public int getPortMin() {
        return portMin;
    }


    /**
     * Sets the portMin value for this ConfigVideoReq.
     * 
     * @param portMin
     */
    public void setPortMin(int portMin) {
        this.portMin = portMin;
    }


    /**
     * Gets the portMax value for this ConfigVideoReq.
     * 
     * @return portMax
     */
    public int getPortMax() {
        return portMax;
    }


    /**
     * Sets the portMax value for this ConfigVideoReq.
     * 
     * @param portMax
     */
    public void setPortMax(int portMax) {
        this.portMax = portMax;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ConfigVideoReq)) return false;
        ConfigVideoReq other = (ConfigVideoReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.sessionId==null && other.getSessionId()==null) || 
             (this.sessionId!=null &&
              this.sessionId.equals(other.getSessionId()))) &&
            ((this.ipaddr==null && other.getIpaddr()==null) || 
             (this.ipaddr!=null &&
              this.ipaddr.equals(other.getIpaddr()))) &&
            this.portMin == other.getPortMin() &&
            this.portMax == other.getPortMax();
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
        if (getSessionId() != null) {
            _hashCode += getSessionId().hashCode();
        }
        if (getIpaddr() != null) {
            _hashCode += getIpaddr().hashCode();
        }
        _hashCode += getPortMin();
        _hashCode += getPortMax();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ConfigVideoReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">ConfigVideoReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sessionId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "sessionId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("ipaddr");
        elemField.setXmlName(new javax.xml.namespace.QName("", "ipaddr"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("portMin");
        elemField.setXmlName(new javax.xml.namespace.QName("", "portMin"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("portMax");
        elemField.setXmlName(new javax.xml.namespace.QName("", "portMax"));
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
