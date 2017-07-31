/**
 * FaxRecvInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class FaxRecvInfo  implements java.io.Serializable {
    private int id;

    private java.lang.String taskid;

    private java.lang.String telSend;

    private java.lang.String telRecv;

    private java.lang.String fileName;

    private int fileSize;

    private java.lang.String timeRecv;

    private int status;

    public FaxRecvInfo() {
    }

    public FaxRecvInfo(
           int id,
           java.lang.String taskid,
           java.lang.String telSend,
           java.lang.String telRecv,
           java.lang.String fileName,
           int fileSize,
           java.lang.String timeRecv,
           int status) {
           this.id = id;
           this.taskid = taskid;
           this.telSend = telSend;
           this.telRecv = telRecv;
           this.fileName = fileName;
           this.fileSize = fileSize;
           this.timeRecv = timeRecv;
           this.status = status;
    }


    /**
     * Gets the id value for this FaxRecvInfo.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this FaxRecvInfo.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the taskid value for this FaxRecvInfo.
     * 
     * @return taskid
     */
    public java.lang.String getTaskid() {
        return taskid;
    }


    /**
     * Sets the taskid value for this FaxRecvInfo.
     * 
     * @param taskid
     */
    public void setTaskid(java.lang.String taskid) {
        this.taskid = taskid;
    }


    /**
     * Gets the telSend value for this FaxRecvInfo.
     * 
     * @return telSend
     */
    public java.lang.String getTelSend() {
        return telSend;
    }


    /**
     * Sets the telSend value for this FaxRecvInfo.
     * 
     * @param telSend
     */
    public void setTelSend(java.lang.String telSend) {
        this.telSend = telSend;
    }


    /**
     * Gets the telRecv value for this FaxRecvInfo.
     * 
     * @return telRecv
     */
    public java.lang.String getTelRecv() {
        return telRecv;
    }


    /**
     * Sets the telRecv value for this FaxRecvInfo.
     * 
     * @param telRecv
     */
    public void setTelRecv(java.lang.String telRecv) {
        this.telRecv = telRecv;
    }


    /**
     * Gets the fileName value for this FaxRecvInfo.
     * 
     * @return fileName
     */
    public java.lang.String getFileName() {
        return fileName;
    }


    /**
     * Sets the fileName value for this FaxRecvInfo.
     * 
     * @param fileName
     */
    public void setFileName(java.lang.String fileName) {
        this.fileName = fileName;
    }


    /**
     * Gets the fileSize value for this FaxRecvInfo.
     * 
     * @return fileSize
     */
    public int getFileSize() {
        return fileSize;
    }


    /**
     * Sets the fileSize value for this FaxRecvInfo.
     * 
     * @param fileSize
     */
    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }


    /**
     * Gets the timeRecv value for this FaxRecvInfo.
     * 
     * @return timeRecv
     */
    public java.lang.String getTimeRecv() {
        return timeRecv;
    }


    /**
     * Sets the timeRecv value for this FaxRecvInfo.
     * 
     * @param timeRecv
     */
    public void setTimeRecv(java.lang.String timeRecv) {
        this.timeRecv = timeRecv;
    }


    /**
     * Gets the status value for this FaxRecvInfo.
     * 
     * @return status
     */
    public int getStatus() {
        return status;
    }


    /**
     * Sets the status value for this FaxRecvInfo.
     * 
     * @param status
     */
    public void setStatus(int status) {
        this.status = status;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FaxRecvInfo)) return false;
        FaxRecvInfo other = (FaxRecvInfo) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.taskid==null && other.getTaskid()==null) || 
             (this.taskid!=null &&
              this.taskid.equals(other.getTaskid()))) &&
            ((this.telSend==null && other.getTelSend()==null) || 
             (this.telSend!=null &&
              this.telSend.equals(other.getTelSend()))) &&
            ((this.telRecv==null && other.getTelRecv()==null) || 
             (this.telRecv!=null &&
              this.telRecv.equals(other.getTelRecv()))) &&
            ((this.fileName==null && other.getFileName()==null) || 
             (this.fileName!=null &&
              this.fileName.equals(other.getFileName()))) &&
            this.fileSize == other.getFileSize() &&
            ((this.timeRecv==null && other.getTimeRecv()==null) || 
             (this.timeRecv!=null &&
              this.timeRecv.equals(other.getTimeRecv()))) &&
            this.status == other.getStatus();
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
        if (getTaskid() != null) {
            _hashCode += getTaskid().hashCode();
        }
        if (getTelSend() != null) {
            _hashCode += getTelSend().hashCode();
        }
        if (getTelRecv() != null) {
            _hashCode += getTelRecv().hashCode();
        }
        if (getFileName() != null) {
            _hashCode += getFileName().hashCode();
        }
        _hashCode += getFileSize();
        if (getTimeRecv() != null) {
            _hashCode += getTimeRecv().hashCode();
        }
        _hashCode += getStatus();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FaxRecvInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "FaxRecvInfo"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("taskid");
        elemField.setXmlName(new javax.xml.namespace.QName("", "taskid"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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
        elemField.setFieldName("timeRecv");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeRecv"));
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
