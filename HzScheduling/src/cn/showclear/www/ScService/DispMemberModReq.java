/**
 * DispMemberModReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class DispMemberModReq  implements java.io.Serializable {
    private cn.showclear.www.ScService.DispMember member;

    private java.lang.Integer grade;

    public DispMemberModReq() {
    }

    public DispMemberModReq(
           cn.showclear.www.ScService.DispMember member,
           java.lang.Integer grade) {
           this.member = member;
           this.grade = grade;
    }


    /**
     * Gets the member value for this DispMemberModReq.
     * 
     * @return member
     */
    public cn.showclear.www.ScService.DispMember getMember() {
        return member;
    }


    /**
     * Sets the member value for this DispMemberModReq.
     * 
     * @param member
     */
    public void setMember(cn.showclear.www.ScService.DispMember member) {
        this.member = member;
    }


    /**
     * Gets the grade value for this DispMemberModReq.
     * 
     * @return grade
     */
    public java.lang.Integer getGrade() {
        return grade;
    }


    /**
     * Sets the grade value for this DispMemberModReq.
     * 
     * @param grade
     */
    public void setGrade(java.lang.Integer grade) {
        this.grade = grade;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DispMemberModReq)) return false;
        DispMemberModReq other = (DispMemberModReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.member==null && other.getMember()==null) || 
             (this.member!=null &&
              this.member.equals(other.getMember()))) &&
            ((this.grade==null && other.getGrade()==null) || 
             (this.grade!=null &&
              this.grade.equals(other.getGrade())));
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
        if (getMember() != null) {
            _hashCode += getMember().hashCode();
        }
        if (getGrade() != null) {
            _hashCode += getGrade().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DispMemberModReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">DispMemberModReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("member");
        elemField.setXmlName(new javax.xml.namespace.QName("", "member"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispMember"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("grade");
        elemField.setXmlName(new javax.xml.namespace.QName("", "grade"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
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
