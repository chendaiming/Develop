/**
 * VideoDev.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class VideoDev  implements java.io.Serializable {
    private java.lang.Integer id;

    private java.lang.String devIp;

    private int devPort;

    private int devType;

    private int chnNum;

    private java.lang.String vendorId;

    private java.lang.String username;

    private java.lang.String password;

    public VideoDev() {
    }

    public VideoDev(
           java.lang.Integer id,
           java.lang.String devIp,
           int devPort,
           int devType,
           int chnNum,
           java.lang.String vendorId,
           java.lang.String username,
           java.lang.String password) {
           this.id = id;
           this.devIp = devIp;
           this.devPort = devPort;
           this.devType = devType;
           this.chnNum = chnNum;
           this.vendorId = vendorId;
           this.username = username;
           this.password = password;
    }


    /**
     * Gets the id value for this VideoDev.
     * 
     * @return id
     */
    public java.lang.Integer getId() {
        return id;
    }


    /**
     * Sets the id value for this VideoDev.
     * 
     * @param id
     */
    public void setId(java.lang.Integer id) {
        this.id = id;
    }


    /**
     * Gets the devIp value for this VideoDev.
     * 
     * @return devIp
     */
    public java.lang.String getDevIp() {
        return devIp;
    }


    /**
     * Sets the devIp value for this VideoDev.
     * 
     * @param devIp
     */
    public void setDevIp(java.lang.String devIp) {
        this.devIp = devIp;
    }


    /**
     * Gets the devPort value for this VideoDev.
     * 
     * @return devPort
     */
    public int getDevPort() {
        return devPort;
    }


    /**
     * Sets the devPort value for this VideoDev.
     * 
     * @param devPort
     */
    public void setDevPort(int devPort) {
        this.devPort = devPort;
    }


    /**
     * Gets the devType value for this VideoDev.
     * 
     * @return devType
     */
    public int getDevType() {
        return devType;
    }


    /**
     * Sets the devType value for this VideoDev.
     * 
     * @param devType
     */
    public void setDevType(int devType) {
        this.devType = devType;
    }


    /**
     * Gets the chnNum value for this VideoDev.
     * 
     * @return chnNum
     */
    public int getChnNum() {
        return chnNum;
    }


    /**
     * Sets the chnNum value for this VideoDev.
     * 
     * @param chnNum
     */
    public void setChnNum(int chnNum) {
        this.chnNum = chnNum;
    }


    /**
     * Gets the vendorId value for this VideoDev.
     * 
     * @return vendorId
     */
    public java.lang.String getVendorId() {
        return vendorId;
    }


    /**
     * Sets the vendorId value for this VideoDev.
     * 
     * @param vendorId
     */
    public void setVendorId(java.lang.String vendorId) {
        this.vendorId = vendorId;
    }


    /**
     * Gets the username value for this VideoDev.
     * 
     * @return username
     */
    public java.lang.String getUsername() {
        return username;
    }


    /**
     * Sets the username value for this VideoDev.
     * 
     * @param username
     */
    public void setUsername(java.lang.String username) {
        this.username = username;
    }


    /**
     * Gets the password value for this VideoDev.
     * 
     * @return password
     */
    public java.lang.String getPassword() {
        return password;
    }


    /**
     * Sets the password value for this VideoDev.
     * 
     * @param password
     */
    public void setPassword(java.lang.String password) {
        this.password = password;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof VideoDev)) return false;
        VideoDev other = (VideoDev) obj;
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
            ((this.devIp==null && other.getDevIp()==null) || 
             (this.devIp!=null &&
              this.devIp.equals(other.getDevIp()))) &&
            this.devPort == other.getDevPort() &&
            this.devType == other.getDevType() &&
            this.chnNum == other.getChnNum() &&
            ((this.vendorId==null && other.getVendorId()==null) || 
             (this.vendorId!=null &&
              this.vendorId.equals(other.getVendorId()))) &&
            ((this.username==null && other.getUsername()==null) || 
             (this.username!=null &&
              this.username.equals(other.getUsername()))) &&
            ((this.password==null && other.getPassword()==null) || 
             (this.password!=null &&
              this.password.equals(other.getPassword())));
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
        if (getDevIp() != null) {
            _hashCode += getDevIp().hashCode();
        }
        _hashCode += getDevPort();
        _hashCode += getDevType();
        _hashCode += getChnNum();
        if (getVendorId() != null) {
            _hashCode += getVendorId().hashCode();
        }
        if (getUsername() != null) {
            _hashCode += getUsername().hashCode();
        }
        if (getPassword() != null) {
            _hashCode += getPassword().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(VideoDev.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "VideoDev"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("devIp");
        elemField.setXmlName(new javax.xml.namespace.QName("", "devIp"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("devPort");
        elemField.setXmlName(new javax.xml.namespace.QName("", "devPort"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("devType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "devType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("chnNum");
        elemField.setXmlName(new javax.xml.namespace.QName("", "chnNum"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("vendorId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "vendorId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("username");
        elemField.setXmlName(new javax.xml.namespace.QName("", "username"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("password");
        elemField.setXmlName(new javax.xml.namespace.QName("", "password"));
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
