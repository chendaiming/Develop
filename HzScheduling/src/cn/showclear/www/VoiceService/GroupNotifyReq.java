/**
 * GroupNotifyReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class GroupNotifyReq  implements java.io.Serializable {
    private java.lang.String sessionId;

    private java.lang.String playfiles;

    private java.lang.String tels;

    private java.lang.String groupId;

    private java.lang.Integer playtimes;

    private java.lang.String notify_type;

    private java.lang.String confirm;

    public GroupNotifyReq() {
    }

    public GroupNotifyReq(
           java.lang.String sessionId,
           java.lang.String playfiles,
           java.lang.String tels,
           java.lang.String groupId,
           java.lang.Integer playtimes,
           java.lang.String notify_type,
           java.lang.String confirm) {
           this.sessionId = sessionId;
           this.playfiles = playfiles;
           this.tels = tels;
           this.groupId = groupId;
           this.playtimes = playtimes;
           this.notify_type = notify_type;
           this.confirm = confirm;
    }


    /**
     * Gets the sessionId value for this GroupNotifyReq.
     * 
     * @return sessionId
     */
    public java.lang.String getSessionId() {
        return sessionId;
    }


    /**
     * Sets the sessionId value for this GroupNotifyReq.
     * 
     * @param sessionId
     */
    public void setSessionId(java.lang.String sessionId) {
        this.sessionId = sessionId;
    }


    /**
     * Gets the playfiles value for this GroupNotifyReq.
     * 
     * @return playfiles
     */
    public java.lang.String getPlayfiles() {
        return playfiles;
    }


    /**
     * Sets the playfiles value for this GroupNotifyReq.
     * 
     * @param playfiles
     */
    public void setPlayfiles(java.lang.String playfiles) {
        this.playfiles = playfiles;
    }


    /**
     * Gets the tels value for this GroupNotifyReq.
     * 
     * @return tels
     */
    public java.lang.String getTels() {
        return tels;
    }


    /**
     * Sets the tels value for this GroupNotifyReq.
     * 
     * @param tels
     */
    public void setTels(java.lang.String tels) {
        this.tels = tels;
    }


    /**
     * Gets the groupId value for this GroupNotifyReq.
     * 
     * @return groupId
     */
    public java.lang.String getGroupId() {
        return groupId;
    }


    /**
     * Sets the groupId value for this GroupNotifyReq.
     * 
     * @param groupId
     */
    public void setGroupId(java.lang.String groupId) {
        this.groupId = groupId;
    }


    /**
     * Gets the playtimes value for this GroupNotifyReq.
     * 
     * @return playtimes
     */
    public java.lang.Integer getPlaytimes() {
        return playtimes;
    }


    /**
     * Sets the playtimes value for this GroupNotifyReq.
     * 
     * @param playtimes
     */
    public void setPlaytimes(java.lang.Integer playtimes) {
        this.playtimes = playtimes;
    }


    /**
     * Gets the notify_type value for this GroupNotifyReq.
     * 
     * @return notify_type
     */
    public java.lang.String getNotify_type() {
        return notify_type;
    }


    /**
     * Sets the notify_type value for this GroupNotifyReq.
     * 
     * @param notify_type
     */
    public void setNotify_type(java.lang.String notify_type) {
        this.notify_type = notify_type;
    }


    /**
     * Gets the confirm value for this GroupNotifyReq.
     * 
     * @return confirm
     */
    public java.lang.String getConfirm() {
        return confirm;
    }


    /**
     * Sets the confirm value for this GroupNotifyReq.
     * 
     * @param confirm
     */
    public void setConfirm(java.lang.String confirm) {
        this.confirm = confirm;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof GroupNotifyReq)) return false;
        GroupNotifyReq other = (GroupNotifyReq) obj;
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
            ((this.playfiles==null && other.getPlayfiles()==null) || 
             (this.playfiles!=null &&
              this.playfiles.equals(other.getPlayfiles()))) &&
            ((this.tels==null && other.getTels()==null) || 
             (this.tels!=null &&
              this.tels.equals(other.getTels()))) &&
            ((this.groupId==null && other.getGroupId()==null) || 
             (this.groupId!=null &&
              this.groupId.equals(other.getGroupId()))) &&
            ((this.playtimes==null && other.getPlaytimes()==null) || 
             (this.playtimes!=null &&
              this.playtimes.equals(other.getPlaytimes()))) &&
            ((this.notify_type==null && other.getNotify_type()==null) || 
             (this.notify_type!=null &&
              this.notify_type.equals(other.getNotify_type()))) &&
            ((this.confirm==null && other.getConfirm()==null) || 
             (this.confirm!=null &&
              this.confirm.equals(other.getConfirm())));
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
        if (getPlayfiles() != null) {
            _hashCode += getPlayfiles().hashCode();
        }
        if (getTels() != null) {
            _hashCode += getTels().hashCode();
        }
        if (getGroupId() != null) {
            _hashCode += getGroupId().hashCode();
        }
        if (getPlaytimes() != null) {
            _hashCode += getPlaytimes().hashCode();
        }
        if (getNotify_type() != null) {
            _hashCode += getNotify_type().hashCode();
        }
        if (getConfirm() != null) {
            _hashCode += getConfirm().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(GroupNotifyReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", ">GroupNotifyReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sessionId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "sessionId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("playfiles");
        elemField.setXmlName(new javax.xml.namespace.QName("", "playfiles"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tels");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tels"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("groupId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "groupId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("playtimes");
        elemField.setXmlName(new javax.xml.namespace.QName("", "playtimes"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("notify_type");
        elemField.setXmlName(new javax.xml.namespace.QName("", "notify_type"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("confirm");
        elemField.setXmlName(new javax.xml.namespace.QName("", "confirm"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
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
