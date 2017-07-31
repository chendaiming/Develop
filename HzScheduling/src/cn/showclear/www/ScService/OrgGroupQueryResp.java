/**
 * OrgGroupQueryResp.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class OrgGroupQueryResp  implements java.io.Serializable {
    private java.lang.String returnCode;

    private int total;

    private cn.showclear.www.ScService.OrgGroup[] groups;

    public OrgGroupQueryResp() {
    }

    public OrgGroupQueryResp(
           java.lang.String returnCode,
           int total,
           cn.showclear.www.ScService.OrgGroup[] groups) {
           this.returnCode = returnCode;
           this.total = total;
           this.groups = groups;
    }


    /**
     * Gets the returnCode value for this OrgGroupQueryResp.
     * 
     * @return returnCode
     */
    public java.lang.String getReturnCode() {
        return returnCode;
    }


    /**
     * Sets the returnCode value for this OrgGroupQueryResp.
     * 
     * @param returnCode
     */
    public void setReturnCode(java.lang.String returnCode) {
        this.returnCode = returnCode;
    }


    /**
     * Gets the total value for this OrgGroupQueryResp.
     * 
     * @return total
     */
    public int getTotal() {
        return total;
    }


    /**
     * Sets the total value for this OrgGroupQueryResp.
     * 
     * @param total
     */
    public void setTotal(int total) {
        this.total = total;
    }


    /**
     * Gets the groups value for this OrgGroupQueryResp.
     * 
     * @return groups
     */
    public cn.showclear.www.ScService.OrgGroup[] getGroups() {
        return groups;
    }


    /**
     * Sets the groups value for this OrgGroupQueryResp.
     * 
     * @param groups
     */
    public void setGroups(cn.showclear.www.ScService.OrgGroup[] groups) {
        this.groups = groups;
    }

    public cn.showclear.www.ScService.OrgGroup getGroups(int i) {
        return this.groups[i];
    }

    public void setGroups(int i, cn.showclear.www.ScService.OrgGroup _value) {
        this.groups[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof OrgGroupQueryResp)) return false;
        OrgGroupQueryResp other = (OrgGroupQueryResp) obj;
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
            ((this.groups==null && other.getGroups()==null) || 
             (this.groups!=null &&
              java.util.Arrays.equals(this.groups, other.getGroups())));
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
        if (getGroups() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getGroups());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getGroups(), i);
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
        new org.apache.axis.description.TypeDesc(OrgGroupQueryResp.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">OrgGroupQueryResp"));
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
        elemField.setFieldName("groups");
        elemField.setXmlName(new javax.xml.namespace.QName("", "groups"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgGroup"));
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
