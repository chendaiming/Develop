/**
 * PowerSwitch.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class PowerSwitch  implements java.io.Serializable {
    private java.lang.Integer id;

    private java.lang.Integer relationId;

    private java.lang.String devId;

    private java.lang.String devIP;

    private int chnId;

    private java.lang.String simNum;

    private java.lang.Integer status;

    private java.lang.String period;

    public PowerSwitch() {
    }

    public PowerSwitch(
           java.lang.Integer id,
           java.lang.Integer relationId,
           java.lang.String devId,
           java.lang.String devIP,
           int chnId,
           java.lang.String simNum,
           java.lang.Integer status,
           java.lang.String period) {
           this.id = id;
           this.relationId = relationId;
           this.devId = devId;
           this.devIP = devIP;
           this.chnId = chnId;
           this.simNum = simNum;
           this.status = status;
           this.period = period;
    }


    /**
     * Gets the id value for this PowerSwitch.
     * 
     * @return id
     */
    public java.lang.Integer getId() {
        return id;
    }


    /**
     * Sets the id value for this PowerSwitch.
     * 
     * @param id
     */
    public void setId(java.lang.Integer id) {
        this.id = id;
    }


    /**
     * Gets the relationId value for this PowerSwitch.
     * 
     * @return relationId
     */
    public java.lang.Integer getRelationId() {
        return relationId;
    }


    /**
     * Sets the relationId value for this PowerSwitch.
     * 
     * @param relationId
     */
    public void setRelationId(java.lang.Integer relationId) {
        this.relationId = relationId;
    }


    /**
     * Gets the devId value for this PowerSwitch.
     * 
     * @return devId
     */
    public java.lang.String getDevId() {
        return devId;
    }


    /**
     * Sets the devId value for this PowerSwitch.
     * 
     * @param devId
     */
    public void setDevId(java.lang.String devId) {
        this.devId = devId;
    }


    /**
     * Gets the devIP value for this PowerSwitch.
     * 
     * @return devIP
     */
    public java.lang.String getDevIP() {
        return devIP;
    }


    /**
     * Sets the devIP value for this PowerSwitch.
     * 
     * @param devIP
     */
    public void setDevIP(java.lang.String devIP) {
        this.devIP = devIP;
    }


    /**
     * Gets the chnId value for this PowerSwitch.
     * 
     * @return chnId
     */
    public int getChnId() {
        return chnId;
    }


    /**
     * Sets the chnId value for this PowerSwitch.
     * 
     * @param chnId
     */
    public void setChnId(int chnId) {
        this.chnId = chnId;
    }


    /**
     * Gets the simNum value for this PowerSwitch.
     * 
     * @return simNum
     */
    public java.lang.String getSimNum() {
        return simNum;
    }


    /**
     * Sets the simNum value for this PowerSwitch.
     * 
     * @param simNum
     */
    public void setSimNum(java.lang.String simNum) {
        this.simNum = simNum;
    }


    /**
     * Gets the status value for this PowerSwitch.
     * 
     * @return status
     */
    public java.lang.Integer getStatus() {
        return status;
    }


    /**
     * Sets the status value for this PowerSwitch.
     * 
     * @param status
     */
    public void setStatus(java.lang.Integer status) {
        this.status = status;
    }


    /**
     * Gets the period value for this PowerSwitch.
     * 
     * @return period
     */
    public java.lang.String getPeriod() {
        return period;
    }


    /**
     * Sets the period value for this PowerSwitch.
     * 
     * @param period
     */
    public void setPeriod(java.lang.String period) {
        this.period = period;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof PowerSwitch)) return false;
        PowerSwitch other = (PowerSwitch) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.id==null && other.getId()==null) || 
             (this.id!=null &&
              this.id.equals(other.getId()))) &&
            ((this.relationId==null && other.getRelationId()==null) || 
             (this.relationId!=null &&
              this.relationId.equals(other.getRelationId()))) &&
            ((this.devId==null && other.getDevId()==null) || 
             (this.devId!=null &&
              this.devId.equals(other.getDevId()))) &&
            ((this.devIP==null && other.getDevIP()==null) || 
             (this.devIP!=null &&
              this.devIP.equals(other.getDevIP()))) &&
            this.chnId == other.getChnId() &&
            ((this.simNum==null && other.getSimNum()==null) || 
             (this.simNum!=null &&
              this.simNum.equals(other.getSimNum()))) &&
            ((this.status==null && other.getStatus()==null) || 
             (this.status!=null &&
              this.status.equals(other.getStatus()))) &&
            ((this.period==null && other.getPeriod()==null) || 
             (this.period!=null &&
              this.period.equals(other.getPeriod())));
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
        if (getId() != null) {
            _hashCode += getId().hashCode();
        }
        if (getRelationId() != null) {
            _hashCode += getRelationId().hashCode();
        }
        if (getDevId() != null) {
            _hashCode += getDevId().hashCode();
        }
        if (getDevIP() != null) {
            _hashCode += getDevIP().hashCode();
        }
        _hashCode += getChnId();
        if (getSimNum() != null) {
            _hashCode += getSimNum().hashCode();
        }
        if (getStatus() != null) {
            _hashCode += getStatus().hashCode();
        }
        if (getPeriod() != null) {
            _hashCode += getPeriod().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(PowerSwitch.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "PowerSwitch"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("relationId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "relationId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("devId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "devId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("devIP");
        elemField.setXmlName(new javax.xml.namespace.QName("", "devIP"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("chnId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "chnId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("simNum");
        elemField.setXmlName(new javax.xml.namespace.QName("", "simNum"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("status");
        elemField.setXmlName(new javax.xml.namespace.QName("", "status"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("period");
        elemField.setXmlName(new javax.xml.namespace.QName("", "period"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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
