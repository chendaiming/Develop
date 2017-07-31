/**
 * FaxTranSendReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class FaxTranSendReq  implements java.io.Serializable {
    private int id;

    private java.lang.String telSend;

    private java.lang.String telRecv;

    private int faxType;

    private int priority;

    private java.lang.String subject;

    private java.lang.Integer notifyType;

    public FaxTranSendReq() {
    }

    public FaxTranSendReq(
           int id,
           java.lang.String telSend,
           java.lang.String telRecv,
           int faxType,
           int priority,
           java.lang.String subject,
           java.lang.Integer notifyType) {
           this.id = id;
           this.telSend = telSend;
           this.telRecv = telRecv;
           this.faxType = faxType;
           this.priority = priority;
           this.subject = subject;
           this.notifyType = notifyType;
    }


    /**
     * Gets the id value for this FaxTranSendReq.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this FaxTranSendReq.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the telSend value for this FaxTranSendReq.
     * 
     * @return telSend
     */
    public java.lang.String getTelSend() {
        return telSend;
    }


    /**
     * Sets the telSend value for this FaxTranSendReq.
     * 
     * @param telSend
     */
    public void setTelSend(java.lang.String telSend) {
        this.telSend = telSend;
    }


    /**
     * Gets the telRecv value for this FaxTranSendReq.
     * 
     * @return telRecv
     */
    public java.lang.String getTelRecv() {
        return telRecv;
    }


    /**
     * Sets the telRecv value for this FaxTranSendReq.
     * 
     * @param telRecv
     */
    public void setTelRecv(java.lang.String telRecv) {
        this.telRecv = telRecv;
    }


    /**
     * Gets the faxType value for this FaxTranSendReq.
     * 
     * @return faxType
     */
    public int getFaxType() {
        return faxType;
    }


    /**
     * Sets the faxType value for this FaxTranSendReq.
     * 
     * @param faxType
     */
    public void setFaxType(int faxType) {
        this.faxType = faxType;
    }


    /**
     * Gets the priority value for this FaxTranSendReq.
     * 
     * @return priority
     */
    public int getPriority() {
        return priority;
    }


    /**
     * Sets the priority value for this FaxTranSendReq.
     * 
     * @param priority
     */
    public void setPriority(int priority) {
        this.priority = priority;
    }


    /**
     * Gets the subject value for this FaxTranSendReq.
     * 
     * @return subject
     */
    public java.lang.String getSubject() {
        return subject;
    }


    /**
     * Sets the subject value for this FaxTranSendReq.
     * 
     * @param subject
     */
    public void setSubject(java.lang.String subject) {
        this.subject = subject;
    }


    /**
     * Gets the notifyType value for this FaxTranSendReq.
     * 
     * @return notifyType
     */
    public java.lang.Integer getNotifyType() {
        return notifyType;
    }


    /**
     * Sets the notifyType value for this FaxTranSendReq.
     * 
     * @param notifyType
     */
    public void setNotifyType(java.lang.Integer notifyType) {
        this.notifyType = notifyType;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FaxTranSendReq)) return false;
        FaxTranSendReq other = (FaxTranSendReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.telSend==null && other.getTelSend()==null) || 
             (this.telSend!=null &&
              this.telSend.equals(other.getTelSend()))) &&
            ((this.telRecv==null && other.getTelRecv()==null) || 
             (this.telRecv!=null &&
              this.telRecv.equals(other.getTelRecv()))) &&
            this.faxType == other.getFaxType() &&
            this.priority == other.getPriority() &&
            ((this.subject==null && other.getSubject()==null) || 
             (this.subject!=null &&
              this.subject.equals(other.getSubject()))) &&
            ((this.notifyType==null && other.getNotifyType()==null) || 
             (this.notifyType!=null &&
              this.notifyType.equals(other.getNotifyType())));
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
        _hashCode += getId();
        if (getTelSend() != null) {
            _hashCode += getTelSend().hashCode();
        }
        if (getTelRecv() != null) {
            _hashCode += getTelRecv().hashCode();
        }
        _hashCode += getFaxType();
        _hashCode += getPriority();
        if (getSubject() != null) {
            _hashCode += getSubject().hashCode();
        }
        if (getNotifyType() != null) {
            _hashCode += getNotifyType().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FaxTranSendReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxTranSendReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("telSend");
        elemField.setXmlName(new javax.xml.namespace.QName("", "telSend"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("telRecv");
        elemField.setXmlName(new javax.xml.namespace.QName("", "telRecv"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("faxType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "faxType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("priority");
        elemField.setXmlName(new javax.xml.namespace.QName("", "priority"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("subject");
        elemField.setXmlName(new javax.xml.namespace.QName("", "subject"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("notifyType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "notifyType"));
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
