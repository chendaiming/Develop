/**
 * RecordMeetInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.AppService;

public class RecordMeetInfo  implements java.io.Serializable {
    private int id;

    private java.lang.String meetId;

    private java.lang.String timeStart;

    private java.lang.String timeEnd;

    private int len;

    private java.lang.String filename;

    public RecordMeetInfo() {
    }

    public RecordMeetInfo(
           int id,
           java.lang.String meetId,
           java.lang.String timeStart,
           java.lang.String timeEnd,
           int len,
           java.lang.String filename) {
           this.id = id;
           this.meetId = meetId;
           this.timeStart = timeStart;
           this.timeEnd = timeEnd;
           this.len = len;
           this.filename = filename;
    }


    /**
     * Gets the id value for this RecordMeetInfo.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this RecordMeetInfo.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the meetId value for this RecordMeetInfo.
     * 
     * @return meetId
     */
    public java.lang.String getMeetId() {
        return meetId;
    }


    /**
     * Sets the meetId value for this RecordMeetInfo.
     * 
     * @param meetId
     */
    public void setMeetId(java.lang.String meetId) {
        this.meetId = meetId;
    }


    /**
     * Gets the timeStart value for this RecordMeetInfo.
     * 
     * @return timeStart
     */
    public java.lang.String getTimeStart() {
        return timeStart;
    }


    /**
     * Sets the timeStart value for this RecordMeetInfo.
     * 
     * @param timeStart
     */
    public void setTimeStart(java.lang.String timeStart) {
        this.timeStart = timeStart;
    }


    /**
     * Gets the timeEnd value for this RecordMeetInfo.
     * 
     * @return timeEnd
     */
    public java.lang.String getTimeEnd() {
        return timeEnd;
    }


    /**
     * Sets the timeEnd value for this RecordMeetInfo.
     * 
     * @param timeEnd
     */
    public void setTimeEnd(java.lang.String timeEnd) {
        this.timeEnd = timeEnd;
    }


    /**
     * Gets the len value for this RecordMeetInfo.
     * 
     * @return len
     */
    public int getLen() {
        return len;
    }


    /**
     * Sets the len value for this RecordMeetInfo.
     * 
     * @param len
     */
    public void setLen(int len) {
        this.len = len;
    }


    /**
     * Gets the filename value for this RecordMeetInfo.
     * 
     * @return filename
     */
    public java.lang.String getFilename() {
        return filename;
    }


    /**
     * Sets the filename value for this RecordMeetInfo.
     * 
     * @param filename
     */
    public void setFilename(java.lang.String filename) {
        this.filename = filename;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof RecordMeetInfo)) return false;
        RecordMeetInfo other = (RecordMeetInfo) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.meetId==null && other.getMeetId()==null) || 
             (this.meetId!=null &&
              this.meetId.equals(other.getMeetId()))) &&
            ((this.timeStart==null && other.getTimeStart()==null) || 
             (this.timeStart!=null &&
              this.timeStart.equals(other.getTimeStart()))) &&
            ((this.timeEnd==null && other.getTimeEnd()==null) || 
             (this.timeEnd!=null &&
              this.timeEnd.equals(other.getTimeEnd()))) &&
            this.len == other.getLen() &&
            ((this.filename==null && other.getFilename()==null) || 
             (this.filename!=null &&
              this.filename.equals(other.getFilename())));
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
        if (getMeetId() != null) {
            _hashCode += getMeetId().hashCode();
        }
        if (getTimeStart() != null) {
            _hashCode += getTimeStart().hashCode();
        }
        if (getTimeEnd() != null) {
            _hashCode += getTimeEnd().hashCode();
        }
        _hashCode += getLen();
        if (getFilename() != null) {
            _hashCode += getFilename().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(RecordMeetInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/AppService/", "RecordMeetInfo"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("meetId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "meetId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeStart");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeStart"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("timeEnd");
        elemField.setXmlName(new javax.xml.namespace.QName("", "timeEnd"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("len");
        elemField.setXmlName(new javax.xml.namespace.QName("", "len"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("filename");
        elemField.setXmlName(new javax.xml.namespace.QName("", "filename"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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
