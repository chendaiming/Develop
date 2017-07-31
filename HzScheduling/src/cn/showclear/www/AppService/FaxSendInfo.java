/**
 * FaxSendInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class FaxSendInfo  implements java.io.Serializable {
    private int id;

    private java.lang.String telSend;

    private java.lang.String telRecv;

    private int priority;

    private java.lang.String fileName;

    private java.lang.String fileNameOrig;

    private int fileSize;

    private java.lang.String timeSchedule;

    private java.lang.String timeSend;

    private int status;

    private java.lang.Integer batchFlag;

    private java.lang.String subject;

    private java.lang.Integer notifyType;

    private java.lang.String notifyTel;

    private java.lang.Integer msgId;

    public FaxSendInfo() {
    }

    public FaxSendInfo(
           int id,
           java.lang.String telSend,
           java.lang.String telRecv,
           int priority,
           java.lang.String fileName,
           java.lang.String fileNameOrig,
           int fileSize,
           java.lang.String timeSchedule,
           java.lang.String timeSend,
           int status,
           java.lang.Integer batchFlag,
           java.lang.String subject,
           java.lang.Integer notifyType,
           java.lang.String notifyTel,
           java.lang.Integer msgId) {
           this.id = id;
           this.telSend = telSend;
           this.telRecv = telRecv;
           this.priority = priority;
           this.fileName = fileName;
           this.fileNameOrig = fileNameOrig;
           this.fileSize = fileSize;
           this.timeSchedule = timeSchedule;
           this.timeSend = timeSend;
           this.status = status;
           this.batchFlag = batchFlag;
           this.subject = subject;
           this.notifyType = notifyType;
           this.notifyTel = notifyTel;
           this.msgId = msgId;
    }


    /**
     * Gets the id value for this FaxSendInfo.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this FaxSendInfo.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the telSend value for this FaxSendInfo.
     * 
     * @return telSend
     */
    public java.lang.String getTelSend() {
        return telSend;
    }


    /**
     * Sets the telSend value for this FaxSendInfo.
     * 
     * @param telSend
     */
    public void setTelSend(java.lang.String telSend) {
        this.telSend = telSend;
    }


    /**
     * Gets the telRecv value for this FaxSendInfo.
     * 
     * @return telRecv
     */
    public java.lang.String getTelRecv() {
        return telRecv;
    }


    /**
     * Sets the telRecv value for this FaxSendInfo.
     * 
     * @param telRecv
     */
    public void setTelRecv(java.lang.String telRecv) {
        this.telRecv = telRecv;
    }


    /**
     * Gets the priority value for this FaxSendInfo.
     * 
     * @return priority
     */
    public int getPriority() {
        return priority;
    }


    /**
     * Sets the priority value for this FaxSendInfo.
     * 
     * @param priority
     */
    public void setPriority(int priority) {
        this.priority = priority;
    }


    /**
     * Gets the fileName value for this FaxSendInfo.
     * 
     * @return fileName
     */
    public java.lang.String getFileName() {
        return fileName;
    }


    /**
     * Sets the fileName value for this FaxSendInfo.
     * 
     * @param fileName
     */
    public void setFileName(java.lang.String fileName) {
        this.fileName = fileName;
    }


    /**
     * Gets the fileNameOrig value for this FaxSendInfo.
     * 
     * @return fileNameOrig
     */
    public java.lang.String getFileNameOrig() {
        return fileNameOrig;
    }


    /**
     * Sets the fileNameOrig value for this FaxSendInfo.
     * 
     * @param fileNameOrig
     */
    public void setFileNameOrig(java.lang.String fileNameOrig) {
        this.fileNameOrig = fileNameOrig;
    }


    /**
     * Gets the fileSize value for this FaxSendInfo.
     * 
     * @return fileSize
     */
    public int getFileSize() {
        return fileSize;
    }


    /**
     * Sets the fileSize value for this FaxSendInfo.
     * 
     * @param fileSize
     */
    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }


    /**
     * Gets the timeSchedule value for this FaxSendInfo.
     * 
     * @return timeSchedule
     */
    public java.lang.String getTimeSchedule() {
        return timeSchedule;
    }


    /**
     * Sets the timeSchedule value for this FaxSendInfo.
     * 
     * @param timeSchedule
     */
    public void setTimeSchedule(java.lang.String timeSchedule) {
        this.timeSchedule = timeSchedule;
    }


    /**
     * Gets the timeSend value for this FaxSendInfo.
     * 
     * @return timeSend
     */
    public java.lang.String getTimeSend() {
        return timeSend;
    }


    /**
     * Sets the timeSend value for this FaxSendInfo.
     * 
     * @param timeSend
     */
    public void setTimeSend(java.lang.String timeSend) {
        this.timeSend = timeSend;
    }


    /**
     * Gets the status value for this FaxSendInfo.
     * 
     * @return status
     */
    public int getStatus() {
        return status;
    }


    /**
     * Sets the status value for this FaxSendInfo.
     * 
     * @param status
     */
    public void setStatus(int status) {
        this.status = status;
    }


    /**
     * Gets the batchFlag value for this FaxSendInfo.
     * 
     * @return batchFlag
     */
    public java.lang.Integer getBatchFlag() {
        return batchFlag;
    }


    /**
     * Sets the batchFlag value for this FaxSendInfo.
     * 
     * @param batchFlag
     */
    public void setBatchFlag(java.lang.Integer batchFlag) {
        this.batchFlag = batchFlag;
    }


    /**
     * Gets the subject value for this FaxSendInfo.
     * 
     * @return subject
     */
    public java.lang.String getSubject() {
        return subject;
    }


    /**
     * Sets the subject value for this FaxSendInfo.
     * 
     * @param subject
     */
    public void setSubject(java.lang.String subject) {
        this.subject = subject;
    }


    /**
     * Gets the notifyType value for this FaxSendInfo.
     * 
     * @return notifyType
     */
    public java.lang.Integer getNotifyType() {
        return notifyType;
    }


    /**
     * Sets the notifyType value for this FaxSendInfo.
     * 
     * @param notifyType
     */
    public void setNotifyType(java.lang.Integer notifyType) {
        this.notifyType = notifyType;
    }


    /**
     * Gets the notifyTel value for this FaxSendInfo.
     * 
     * @return notifyTel
     */
    public java.lang.String getNotifyTel() {
        return notifyTel;
    }


    /**
     * Sets the notifyTel value for this FaxSendInfo.
     * 
     * @param notifyTel
     */
    public void setNotifyTel(java.lang.String notifyTel) {
        this.notifyTel = notifyTel;
    }


    /**
     * Gets the msgId value for this FaxSendInfo.
     * 
     * @return msgId
     */
    public java.lang.Integer getMsgId() {
        return msgId;
    }


    /**
     * Sets the msgId value for this FaxSendInfo.
     * 
     * @param msgId
     */
    public void setMsgId(java.lang.Integer msgId) {
        this.msgId = msgId;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FaxSendInfo)) return false;
        FaxSendInfo other = (FaxSendInfo) obj;
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
            this.priority == other.getPriority() &&
            ((this.fileName==null && other.getFileName()==null) || 
             (this.fileName!=null &&
              this.fileName.equals(other.getFileName()))) &&
            ((this.fileNameOrig==null && other.getFileNameOrig()==null) || 
             (this.fileNameOrig!=null &&
              this.fileNameOrig.equals(other.getFileNameOrig()))) &&
            this.fileSize == other.getFileSize() &&
            ((this.timeSchedule==null && other.getTimeSchedule()==null) || 
             (this.timeSchedule!=null &&
              this.timeSchedule.equals(other.getTimeSchedule()))) &&
            ((this.timeSend==null && other.getTimeSend()==null) || 
             (this.timeSend!=null &&
              this.timeSend.equals(other.getTimeSend()))) &&
            this.status == other.getStatus() &&
            ((this.batchFlag==null && other.getBatchFlag()==null) || 
             (this.batchFlag!=null &&
              this.batchFlag.equals(other.getBatchFlag()))) &&
            ((this.subject==null && other.getSubject()==null) || 
             (this.subject!=null &&
              this.subject.equals(other.getSubject()))) &&
            ((this.notifyType==null && other.getNotifyType()==null) || 
             (this.notifyType!=null &&
              this.notifyType.equals(other.getNotifyType()))) &&
            ((this.notifyTel==null && other.getNotifyTel()==null) || 
             (this.notifyTel!=null &&
              this.notifyTel.equals(other.getNotifyTel()))) &&
            ((this.msgId==null && other.getMsgId()==null) || 
             (this.msgId!=null &&
              this.msgId.equals(other.getMsgId())));
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
        _hashCode += getPriority();
        if (getFileName() != null) {
            _hashCode += getFileName().hashCode();
        }
        if (getFileNameOrig() != null) {
            _hashCode += getFileNameOrig().hashCode();
        }
        _hashCode += getFileSize();
        if (getTimeSchedule() != null) {
            _hashCode += getTimeSchedule().hashCode();
        }
        if (getTimeSend() != null) {
            _hashCode += getTimeSend().hashCode();
        }
        _hashCode += getStatus();
        if (getBatchFlag() != null) {
            _hashCode += getBatchFlag().hashCode();
        }
        if (getSubject() != null) {
            _hashCode += getSubject().hashCode();
        }
        if (getNotifyType() != null) {
            _hashCode += getNotifyType().hashCode();
        }
        if (getNotifyTel() != null) {
            _hashCode += getNotifyTel().hashCode();
        }
        if (getMsgId() != null) {
            _hashCode += getMsgId().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FaxSendInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxSendInfo"));
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
        elemField.setFieldName("fileNameOrig");
        elemField.setXmlName(new javax.xml.namespace.QName("", "fileNameOrig"));
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
        elemField.setFieldName("timeSend");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeSend"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("status");
        elemField.setXmlName(new javax.xml.namespace.QName("", "status"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("batchFlag");
        elemField.setXmlName(new javax.xml.namespace.QName("", "batchFlag"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("notifyTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "notifyTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("msgId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "msgId"));
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
