/**
 * FaxSendReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class FaxSendReq  implements java.io.Serializable {
    private java.lang.String telSend;

    private java.lang.String telRecv;

    private int priority;

    private java.lang.String fileName;

    private int fileSize;

    private java.lang.String timeSchedule;

    private byte[] filecontent;

    private java.lang.String subject;

    private java.lang.Integer notifyType;

    public FaxSendReq() {
    }

    public FaxSendReq(
           java.lang.String telSend,
           java.lang.String telRecv,
           int priority,
           java.lang.String fileName,
           int fileSize,
           java.lang.String timeSchedule,
           byte[] filecontent,
           java.lang.String subject,
           java.lang.Integer notifyType) {
           this.telSend = telSend;
           this.telRecv = telRecv;
           this.priority = priority;
           this.fileName = fileName;
           this.fileSize = fileSize;
           this.timeSchedule = timeSchedule;
           this.filecontent = filecontent;
           this.subject = subject;
           this.notifyType = notifyType;
    }


    /**
     * Gets the telSend value for this FaxSendReq.
     * 
     * @return telSend
     */
    public java.lang.String getTelSend() {
        return telSend;
    }


    /**
     * Sets the telSend value for this FaxSendReq.
     * 
     * @param telSend
     */
    public void setTelSend(java.lang.String telSend) {
        this.telSend = telSend;
    }


    /**
     * Gets the telRecv value for this FaxSendReq.
     * 
     * @return telRecv
     */
    public java.lang.String getTelRecv() {
        return telRecv;
    }


    /**
     * Sets the telRecv value for this FaxSendReq.
     * 
     * @param telRecv
     */
    public void setTelRecv(java.lang.String telRecv) {
        this.telRecv = telRecv;
    }


    /**
     * Gets the priority value for this FaxSendReq.
     * 
     * @return priority
     */
    public int getPriority() {
        return priority;
    }


    /**
     * Sets the priority value for this FaxSendReq.
     * 
     * @param priority
     */
    public void setPriority(int priority) {
        this.priority = priority;
    }


    /**
     * Gets the fileName value for this FaxSendReq.
     * 
     * @return fileName
     */
    public java.lang.String getFileName() {
        return fileName;
    }


    /**
     * Sets the fileName value for this FaxSendReq.
     * 
     * @param fileName
     */
    public void setFileName(java.lang.String fileName) {
        this.fileName = fileName;
    }


    /**
     * Gets the fileSize value for this FaxSendReq.
     * 
     * @return fileSize
     */
    public int getFileSize() {
        return fileSize;
    }


    /**
     * Sets the fileSize value for this FaxSendReq.
     * 
     * @param fileSize
     */
    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }


    /**
     * Gets the timeSchedule value for this FaxSendReq.
     * 
     * @return timeSchedule
     */
    public java.lang.String getTimeSchedule() {
        return timeSchedule;
    }


    /**
     * Sets the timeSchedule value for this FaxSendReq.
     * 
     * @param timeSchedule
     */
    public void setTimeSchedule(java.lang.String timeSchedule) {
        this.timeSchedule = timeSchedule;
    }


    /**
     * Gets the filecontent value for this FaxSendReq.
     * 
     * @return filecontent
     */
    public byte[] getFilecontent() {
        return filecontent;
    }


    /**
     * Sets the filecontent value for this FaxSendReq.
     * 
     * @param filecontent
     */
    public void setFilecontent(byte[] filecontent) {
        this.filecontent = filecontent;
    }


    /**
     * Gets the subject value for this FaxSendReq.
     * 
     * @return subject
     */
    public java.lang.String getSubject() {
        return subject;
    }


    /**
     * Sets the subject value for this FaxSendReq.
     * 
     * @param subject
     */
    public void setSubject(java.lang.String subject) {
        this.subject = subject;
    }


    /**
     * Gets the notifyType value for this FaxSendReq.
     * 
     * @return notifyType
     */
    public java.lang.Integer getNotifyType() {
        return notifyType;
    }


    /**
     * Sets the notifyType value for this FaxSendReq.
     * 
     * @param notifyType
     */
    public void setNotifyType(java.lang.Integer notifyType) {
        this.notifyType = notifyType;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FaxSendReq)) return false;
        FaxSendReq other = (FaxSendReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.telSend==null && other.getTelSend()==null) || 
             (this.telSend!=null &&
              this.telSend.equals(other.getTelSend()))) &&
            ((this.telRecv==null && other.getTelRecv()==null) || 
             (this.telRecv!=null &&
              this.telRecv.equals(other.getTelRecv()))) &&
            this.priority == other.getPriority() &&
            ((this.fileName==null && other.getFileName()==null) || 
             (this.fileName!=null &&
              this.fileName.equals(other.getFileName()))) &&
            this.fileSize == other.getFileSize() &&
            ((this.timeSchedule==null && other.getTimeSchedule()==null) || 
             (this.timeSchedule!=null &&
              this.timeSchedule.equals(other.getTimeSchedule()))) &&
            ((this.filecontent==null && other.getFilecontent()==null) || 
             (this.filecontent!=null &&
              java.util.Arrays.equals(this.filecontent, other.getFilecontent()))) &&
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
        if (getTelSend() != null) {
            _hashCode += getTelSend().hashCode();
        }
        if (getTelRecv() != null) {
            _hashCode += getTelRecv().hashCode();
        }
        _hashCode += getPriority();
        if (getFileName() != null) {
            _hashCode += getFileName().hashCode();
        }
        _hashCode += getFileSize();
        if (getTimeSchedule() != null) {
            _hashCode += getTimeSchedule().hashCode();
        }
        if (getFilecontent() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getFilecontent());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getFilecontent(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
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
        new org.apache.axis.description.TypeDesc(FaxSendReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", ">FaxSendReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
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
        elemField.setFieldName("priority");
        elemField.setXmlName(new javax.xml.namespace.QName("", "priority"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("fileName");
        elemField.setXmlName(new javax.xml.namespace.QName("", "fileName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("fileSize");
        elemField.setXmlName(new javax.xml.namespace.QName("", "fileSize"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeSchedule");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeSchedule"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("filecontent");
        elemField.setXmlName(new javax.xml.namespace.QName("", "filecontent"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "base64Binary"));
        elemField.setMinOccurs(0);
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
