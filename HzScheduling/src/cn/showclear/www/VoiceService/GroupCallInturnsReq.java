/**
 * GroupCallInturnsReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class GroupCallInturnsReq  implements java.io.Serializable {
    private java.lang.String sessionId;

    private java.lang.String caller;

    private java.lang.String[] members;

    private java.lang.String groupId;

    public GroupCallInturnsReq() {
    }

    public GroupCallInturnsReq(
           java.lang.String sessionId,
           java.lang.String caller,
           java.lang.String[] members,
           java.lang.String groupId) {
           this.sessionId = sessionId;
           this.caller = caller;
           this.members = members;
           this.groupId = groupId;
    }


    /**
     * Gets the sessionId value for this GroupCallInturnsReq.
     * 
     * @return sessionId
     */
    public java.lang.String getSessionId() {
        return sessionId;
    }


    /**
     * Sets the sessionId value for this GroupCallInturnsReq.
     * 
     * @param sessionId
     */
    public void setSessionId(java.lang.String sessionId) {
        this.sessionId = sessionId;
    }


    /**
     * Gets the caller value for this GroupCallInturnsReq.
     * 
     * @return caller
     */
    public java.lang.String getCaller() {
        return caller;
    }


    /**
     * Sets the caller value for this GroupCallInturnsReq.
     * 
     * @param caller
     */
    public void setCaller(java.lang.String caller) {
        this.caller = caller;
    }


    /**
     * Gets the members value for this GroupCallInturnsReq.
     * 
     * @return members
     */
    public java.lang.String[] getMembers() {
        return members;
    }


    /**
     * Sets the members value for this GroupCallInturnsReq.
     * 
     * @param members
     */
    public void setMembers(java.lang.String[] members) {
        this.members = members;
    }

    public java.lang.String getMembers(int i) {
        return this.members[i];
    }

    public void setMembers(int i, java.lang.String _value) {
        this.members[i] = _value;
    }


    /**
     * Gets the groupId value for this GroupCallInturnsReq.
     * 
     * @return groupId
     */
    public java.lang.String getGroupId() {
        return groupId;
    }


    /**
     * Sets the groupId value for this GroupCallInturnsReq.
     * 
     * @param groupId
     */
    public void setGroupId(java.lang.String groupId) {
        this.groupId = groupId;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof GroupCallInturnsReq)) return false;
        GroupCallInturnsReq other = (GroupCallInturnsReq) obj;
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
            ((this.caller==null && other.getCaller()==null) || 
             (this.caller!=null &&
              this.caller.equals(other.getCaller()))) &&
            ((this.members==null && other.getMembers()==null) || 
             (this.members!=null &&
              java.util.Arrays.equals(this.members, other.getMembers()))) &&
            ((this.groupId==null && other.getGroupId()==null) || 
             (this.groupId!=null &&
              this.groupId.equals(other.getGroupId())));
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
        if (getCaller() != null) {
            _hashCode += getCaller().hashCode();
        }
        if (getMembers() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getMembers());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getMembers(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        if (getGroupId() != null) {
            _hashCode += getGroupId().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(GroupCallInturnsReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupCallInturnsReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sessionId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "sessionId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("caller");
        elemField.setXmlName(new javax.xml.namespace.QName("", "caller"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("members");
        elemField.setXmlName(new javax.xml.namespace.QName("", "members"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        elemField.setMaxOccursUnbounded(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("groupId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "groupId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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
