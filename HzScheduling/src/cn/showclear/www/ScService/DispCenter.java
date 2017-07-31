/**
 * DispCenter.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class DispCenter  implements java.io.Serializable {
    private int id;

    private java.lang.String tel;

    private java.lang.String name;

    private int parentId;

    private int grade;

    private int callinMode;

    private int meetRecord;

    private int callRecord;

    private java.lang.String dutyTels;

    private java.lang.String urgentTel;

    private java.lang.String remark;

    public DispCenter() {
    }

    public DispCenter(
           int id,
           java.lang.String tel,
           java.lang.String name,
           int parentId,
           int grade,
           int callinMode,
           int meetRecord,
           int callRecord,
           java.lang.String dutyTels,
           java.lang.String urgentTel,
           java.lang.String remark) {
           this.id = id;
           this.tel = tel;
           this.name = name;
           this.parentId = parentId;
           this.grade = grade;
           this.callinMode = callinMode;
           this.meetRecord = meetRecord;
           this.callRecord = callRecord;
           this.dutyTels = dutyTels;
           this.urgentTel = urgentTel;
           this.remark = remark;
    }


    /**
     * Gets the id value for this DispCenter.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this DispCenter.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the tel value for this DispCenter.
     * 
     * @return tel
     */
    public java.lang.String getTel() {
        return tel;
    }


    /**
     * Sets the tel value for this DispCenter.
     * 
     * @param tel
     */
    public void setTel(java.lang.String tel) {
        this.tel = tel;
    }


    /**
     * Gets the name value for this DispCenter.
     * 
     * @return name
     */
    public java.lang.String getName() {
        return name;
    }


    /**
     * Sets the name value for this DispCenter.
     * 
     * @param name
     */
    public void setName(java.lang.String name) {
        this.name = name;
    }


    /**
     * Gets the parentId value for this DispCenter.
     * 
     * @return parentId
     */
    public int getParentId() {
        return parentId;
    }


    /**
     * Sets the parentId value for this DispCenter.
     * 
     * @param parentId
     */
    public void setParentId(int parentId) {
        this.parentId = parentId;
    }


    /**
     * Gets the grade value for this DispCenter.
     * 
     * @return grade
     */
    public int getGrade() {
        return grade;
    }


    /**
     * Sets the grade value for this DispCenter.
     * 
     * @param grade
     */
    public void setGrade(int grade) {
        this.grade = grade;
    }


    /**
     * Gets the callinMode value for this DispCenter.
     * 
     * @return callinMode
     */
    public int getCallinMode() {
        return callinMode;
    }


    /**
     * Sets the callinMode value for this DispCenter.
     * 
     * @param callinMode
     */
    public void setCallinMode(int callinMode) {
        this.callinMode = callinMode;
    }


    /**
     * Gets the meetRecord value for this DispCenter.
     * 
     * @return meetRecord
     */
    public int getMeetRecord() {
        return meetRecord;
    }


    /**
     * Sets the meetRecord value for this DispCenter.
     * 
     * @param meetRecord
     */
    public void setMeetRecord(int meetRecord) {
        this.meetRecord = meetRecord;
    }


    /**
     * Gets the callRecord value for this DispCenter.
     * 
     * @return callRecord
     */
    public int getCallRecord() {
        return callRecord;
    }


    /**
     * Sets the callRecord value for this DispCenter.
     * 
     * @param callRecord
     */
    public void setCallRecord(int callRecord) {
        this.callRecord = callRecord;
    }


    /**
     * Gets the dutyTels value for this DispCenter.
     * 
     * @return dutyTels
     */
    public java.lang.String getDutyTels() {
        return dutyTels;
    }


    /**
     * Sets the dutyTels value for this DispCenter.
     * 
     * @param dutyTels
     */
    public void setDutyTels(java.lang.String dutyTels) {
        this.dutyTels = dutyTels;
    }


    /**
     * Gets the urgentTel value for this DispCenter.
     * 
     * @return urgentTel
     */
    public java.lang.String getUrgentTel() {
        return urgentTel;
    }


    /**
     * Sets the urgentTel value for this DispCenter.
     * 
     * @param urgentTel
     */
    public void setUrgentTel(java.lang.String urgentTel) {
        this.urgentTel = urgentTel;
    }


    /**
     * Gets the remark value for this DispCenter.
     * 
     * @return remark
     */
    public java.lang.String getRemark() {
        return remark;
    }


    /**
     * Sets the remark value for this DispCenter.
     * 
     * @param remark
     */
    public void setRemark(java.lang.String remark) {
        this.remark = remark;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DispCenter)) return false;
        DispCenter other = (DispCenter) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.tel==null && other.getTel()==null) || 
             (this.tel!=null &&
              this.tel.equals(other.getTel()))) &&
            ((this.name==null && other.getName()==null) || 
             (this.name!=null &&
              this.name.equals(other.getName()))) &&
            this.parentId == other.getParentId() &&
            this.grade == other.getGrade() &&
            this.callinMode == other.getCallinMode() &&
            this.meetRecord == other.getMeetRecord() &&
            this.callRecord == other.getCallRecord() &&
            ((this.dutyTels==null && other.getDutyTels()==null) || 
             (this.dutyTels!=null &&
              this.dutyTels.equals(other.getDutyTels()))) &&
            ((this.urgentTel==null && other.getUrgentTel()==null) || 
             (this.urgentTel!=null &&
              this.urgentTel.equals(other.getUrgentTel()))) &&
            ((this.remark==null && other.getRemark()==null) || 
             (this.remark!=null &&
              this.remark.equals(other.getRemark())));
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
        if (getTel() != null) {
            _hashCode += getTel().hashCode();
        }
        if (getName() != null) {
            _hashCode += getName().hashCode();
        }
        _hashCode += getParentId();
        _hashCode += getGrade();
        _hashCode += getCallinMode();
        _hashCode += getMeetRecord();
        _hashCode += getCallRecord();
        if (getDutyTels() != null) {
            _hashCode += getDutyTels().hashCode();
        }
        if (getUrgentTel() != null) {
            _hashCode += getUrgentTel().hashCode();
        }
        if (getRemark() != null) {
            _hashCode += getRemark().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DispCenter.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "DispCenter"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("name");
        elemField.setXmlName(new javax.xml.namespace.QName("", "name"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("parentId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "parentId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("grade");
        elemField.setXmlName(new javax.xml.namespace.QName("", "grade"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("callinMode");
        elemField.setXmlName(new javax.xml.namespace.QName("", "callinMode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("meetRecord");
        elemField.setXmlName(new javax.xml.namespace.QName("", "meetRecord"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("callRecord");
        elemField.setXmlName(new javax.xml.namespace.QName("", "callRecord"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dutyTels");
        elemField.setXmlName(new javax.xml.namespace.QName("", "dutyTels"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("urgentTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "urgentTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("remark");
        elemField.setXmlName(new javax.xml.namespace.QName("", "remark"));
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
