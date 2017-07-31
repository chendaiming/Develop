/**
 * MeetInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class MeetInfo  implements java.io.Serializable {
    private java.lang.String meetId;

    private java.lang.String meetNo;

    private int isRecord;

    private int isVoice;

    private int isLock;

    private cn.showclear.www.VoiceService.MeetMember[] members;

    public MeetInfo() {
    }

    public MeetInfo(
           java.lang.String meetId,
           java.lang.String meetNo,
           int isRecord,
           int isVoice,
           int isLock,
           cn.showclear.www.VoiceService.MeetMember[] members) {
           this.meetId = meetId;
           this.meetNo = meetNo;
           this.isRecord = isRecord;
           this.isVoice = isVoice;
           this.isLock = isLock;
           this.members = members;
    }


    /**
     * Gets the meetId value for this MeetInfo.
     * 
     * @return meetId
     */
    public java.lang.String getMeetId() {
        return meetId;
    }


    /**
     * Sets the meetId value for this MeetInfo.
     * 
     * @param meetId
     */
    public void setMeetId(java.lang.String meetId) {
        this.meetId = meetId;
    }


    /**
     * Gets the meetNo value for this MeetInfo.
     * 
     * @return meetNo
     */
    public java.lang.String getMeetNo() {
        return meetNo;
    }


    /**
     * Sets the meetNo value for this MeetInfo.
     * 
     * @param meetNo
     */
    public void setMeetNo(java.lang.String meetNo) {
        this.meetNo = meetNo;
    }


    /**
     * Gets the isRecord value for this MeetInfo.
     * 
     * @return isRecord
     */
    public int getIsRecord() {
        return isRecord;
    }


    /**
     * Sets the isRecord value for this MeetInfo.
     * 
     * @param isRecord
     */
    public void setIsRecord(int isRecord) {
        this.isRecord = isRecord;
    }


    /**
     * Gets the isVoice value for this MeetInfo.
     * 
     * @return isVoice
     */
    public int getIsVoice() {
        return isVoice;
    }


    /**
     * Sets the isVoice value for this MeetInfo.
     * 
     * @param isVoice
     */
    public void setIsVoice(int isVoice) {
        this.isVoice = isVoice;
    }


    /**
     * Gets the isLock value for this MeetInfo.
     * 
     * @return isLock
     */
    public int getIsLock() {
        return isLock;
    }


    /**
     * Sets the isLock value for this MeetInfo.
     * 
     * @param isLock
     */
    public void setIsLock(int isLock) {
        this.isLock = isLock;
    }


    /**
     * Gets the members value for this MeetInfo.
     * 
     * @return members
     */
    public cn.showclear.www.VoiceService.MeetMember[] getMembers() {
        return members;
    }


    /**
     * Sets the members value for this MeetInfo.
     * 
     * @param members
     */
    public void setMembers(cn.showclear.www.VoiceService.MeetMember[] members) {
        this.members = members;
    }

    public cn.showclear.www.VoiceService.MeetMember getMembers(int i) {
        return this.members[i];
    }

    public void setMembers(int i, cn.showclear.www.VoiceService.MeetMember _value) {
        this.members[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MeetInfo)) return false;
        MeetInfo other = (MeetInfo) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.meetId==null && other.getMeetId()==null) || 
             (this.meetId!=null &&
              this.meetId.equals(other.getMeetId()))) &&
            ((this.meetNo==null && other.getMeetNo()==null) || 
             (this.meetNo!=null &&
              this.meetNo.equals(other.getMeetNo()))) &&
            this.isRecord == other.getIsRecord() &&
            this.isVoice == other.getIsVoice() &&
            this.isLock == other.getIsLock() &&
            ((this.members==null && other.getMembers()==null) || 
             (this.members!=null &&
              java.util.Arrays.equals(this.members, other.getMembers())));
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
        if (getMeetId() != null) {
            _hashCode += getMeetId().hashCode();
        }
        if (getMeetNo() != null) {
            _hashCode += getMeetNo().hashCode();
        }
        _hashCode += getIsRecord();
        _hashCode += getIsVoice();
        _hashCode += getIsLock();
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
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MeetInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetInfo"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("meetId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "meetId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("meetNo");
        elemField.setXmlName(new javax.xml.namespace.QName("", "meetNo"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("isRecord");
        elemField.setXmlName(new javax.xml.namespace.QName("", "isRecord"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("isVoice");
        elemField.setXmlName(new javax.xml.namespace.QName("", "isVoice"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("isLock");
        elemField.setXmlName(new javax.xml.namespace.QName("", "isLock"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("members");
        elemField.setXmlName(new javax.xml.namespace.QName("", "members"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "MeetMember"));
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
