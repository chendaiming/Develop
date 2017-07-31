/**
 * DispGroupQueryResp.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class DispGroupQueryResp  implements java.io.Serializable {
    private java.lang.String returnCode;

    private int total;

    private cn.showclear.www.ScService.DispGroup[] dispGroups;

    public DispGroupQueryResp() {
    }

    public DispGroupQueryResp(
           java.lang.String returnCode,
           int total,
           cn.showclear.www.ScService.DispGroup[] dispGroups) {
           this.returnCode = returnCode;
           this.total = total;
           this.dispGroups = dispGroups;
    }


    /**
     * Gets the returnCode value for this DispGroupQueryResp.
     * 
     * @return returnCode
     */
    public java.lang.String getReturnCode() {
        return returnCode;
    }


    /**
     * Sets the returnCode value for this DispGroupQueryResp.
     * 
     * @param returnCode
     */
    public void setReturnCode(java.lang.String returnCode) {
        this.returnCode = returnCode;
    }


    /**
     * Gets the total value for this DispGroupQueryResp.
     * 
     * @return total
     */
    public int getTotal() {
        return total;
    }


    /**
     * Sets the total value for this DispGroupQueryResp.
     * 
     * @param total
     */
    public void setTotal(int total) {
        this.total = total;
    }


    /**
     * Gets the dispGroups value for this DispGroupQueryResp.
     * 
     * @return dispGroups
     */
    public cn.showclear.www.ScService.DispGroup[] getDispGroups() {
        return dispGroups;
    }


    /**
     * Sets the dispGroups value for this DispGroupQueryResp.
     * 
     * @param dispGroups
     */
    public void setDispGroups(cn.showclear.www.ScService.DispGroup[] dispGroups) {
        this.dispGroups = dispGroups;
    }

    public cn.showclear.www.ScService.DispGroup getDispGroups(int i) {
        return this.dispGroups[i];
    }

    public void setDispGroups(int i, cn.showclear.www.ScService.DispGroup _value) {
        this.dispGroups[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DispGroupQueryResp)) return false;
        DispGroupQueryResp other = (DispGroupQueryResp) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.returnCode==null && other.getReturnCode()==null) || 
             (this.returnCode!=null &&
              this.returnCode.equals(other.getReturnCode()))) &&
            this.total == other.getTotal() &&
            ((this.dispGroups==null && other.getDispGroups()==null) || 
             (this.dispGroups!=null &&
              java.util.Arrays.equals(this.dispGroups, other.getDispGroups())));
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
        if (getReturnCode() != null) {
            _hashCode += getReturnCode().hashCode();
        }
        _hashCode += getTotal();
        if (getDispGroups() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getDispGroups());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getDispGroups(), i);
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
        new org.apache.axis.description.TypeDesc(DispGroupQueryResp.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispGroupQueryResp"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("returnCode");
        elemField.setXmlName(new javax.xml.namespace.QName("", "returnCode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("total");
        elemField.setXmlName(new javax.xml.namespace.QName("", "total"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dispGroups");
        elemField.setXmlName(new javax.xml.namespace.QName("", "dispGroups"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispGroup"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        elemField.setMaxOccursUnbounded(true);
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
