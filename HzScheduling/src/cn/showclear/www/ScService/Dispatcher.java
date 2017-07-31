/**
 * Dispatcher.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class Dispatcher  implements java.io.Serializable {
    private int id;

    private int centerId;

    private java.lang.String username;

    private java.lang.String password;

    private java.lang.String mainTel;

    private java.lang.String viceTel;

    private java.lang.String mobile;

    private java.lang.String fax;

    private java.lang.String email;

    private int grade;

    private java.lang.Integer userType;

    private java.lang.String showname;

    private java.lang.String remark;

    public Dispatcher() {
    }

    public Dispatcher(
           int id,
           int centerId,
           java.lang.String username,
           java.lang.String password,
           java.lang.String mainTel,
           java.lang.String viceTel,
           java.lang.String mobile,
           java.lang.String fax,
           java.lang.String email,
           int grade,
           java.lang.Integer userType,
           java.lang.String showname,
           java.lang.String remark) {
           this.id = id;
           this.centerId = centerId;
           this.username = username;
           this.password = password;
           this.mainTel = mainTel;
           this.viceTel = viceTel;
           this.mobile = mobile;
           this.fax = fax;
           this.email = email;
           this.grade = grade;
           this.userType = userType;
           this.showname = showname;
           this.remark = remark;
    }


    /**
     * Gets the id value for this Dispatcher.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this Dispatcher.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the centerId value for this Dispatcher.
     * 
     * @return centerId
     */
    public int getCenterId() {
        return centerId;
    }


    /**
     * Sets the centerId value for this Dispatcher.
     * 
     * @param centerId
     */
    public void setCenterId(int centerId) {
        this.centerId = centerId;
    }


    /**
     * Gets the username value for this Dispatcher.
     * 
     * @return username
     */
    public java.lang.String getUsername() {
        return username;
    }


    /**
     * Sets the username value for this Dispatcher.
     * 
     * @param username
     */
    public void setUsername(java.lang.String username) {
        this.username = username;
    }


    /**
     * Gets the password value for this Dispatcher.
     * 
     * @return password
     */
    public java.lang.String getPassword() {
        return password;
    }


    /**
     * Sets the password value for this Dispatcher.
     * 
     * @param password
     */
    public void setPassword(java.lang.String password) {
        this.password = password;
    }


    /**
     * Gets the mainTel value for this Dispatcher.
     * 
     * @return mainTel
     */
    public java.lang.String getMainTel() {
        return mainTel;
    }


    /**
     * Sets the mainTel value for this Dispatcher.
     * 
     * @param mainTel
     */
    public void setMainTel(java.lang.String mainTel) {
        this.mainTel = mainTel;
    }


    /**
     * Gets the viceTel value for this Dispatcher.
     * 
     * @return viceTel
     */
    public java.lang.String getViceTel() {
        return viceTel;
    }


    /**
     * Sets the viceTel value for this Dispatcher.
     * 
     * @param viceTel
     */
    public void setViceTel(java.lang.String viceTel) {
        this.viceTel = viceTel;
    }


    /**
     * Gets the mobile value for this Dispatcher.
     * 
     * @return mobile
     */
    public java.lang.String getMobile() {
        return mobile;
    }


    /**
     * Sets the mobile value for this Dispatcher.
     * 
     * @param mobile
     */
    public void setMobile(java.lang.String mobile) {
        this.mobile = mobile;
    }


    /**
     * Gets the fax value for this Dispatcher.
     * 
     * @return fax
     */
    public java.lang.String getFax() {
        return fax;
    }


    /**
     * Sets the fax value for this Dispatcher.
     * 
     * @param fax
     */
    public void setFax(java.lang.String fax) {
        this.fax = fax;
    }


    /**
     * Gets the email value for this Dispatcher.
     * 
     * @return email
     */
    public java.lang.String getEmail() {
        return email;
    }


    /**
     * Sets the email value for this Dispatcher.
     * 
     * @param email
     */
    public void setEmail(java.lang.String email) {
        this.email = email;
    }


    /**
     * Gets the grade value for this Dispatcher.
     * 
     * @return grade
     */
    public int getGrade() {
        return grade;
    }


    /**
     * Sets the grade value for this Dispatcher.
     * 
     * @param grade
     */
    public void setGrade(int grade) {
        this.grade = grade;
    }


    /**
     * Gets the userType value for this Dispatcher.
     * 
     * @return userType
     */
    public java.lang.Integer getUserType() {
        return userType;
    }


    /**
     * Sets the userType value for this Dispatcher.
     * 
     * @param userType
     */
    public void setUserType(java.lang.Integer userType) {
        this.userType = userType;
    }


    /**
     * Gets the showname value for this Dispatcher.
     * 
     * @return showname
     */
    public java.lang.String getShowname() {
        return showname;
    }


    /**
     * Sets the showname value for this Dispatcher.
     * 
     * @param showname
     */
    public void setShowname(java.lang.String showname) {
        this.showname = showname;
    }


    /**
     * Gets the remark value for this Dispatcher.
     * 
     * @return remark
     */
    public java.lang.String getRemark() {
        return remark;
    }


    /**
     * Sets the remark value for this Dispatcher.
     * 
     * @param remark
     */
    public void setRemark(java.lang.String remark) {
        this.remark = remark;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof Dispatcher)) return false;
        Dispatcher other = (Dispatcher) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            this.centerId == other.getCenterId() &&
            ((this.username==null && other.getUsername()==null) || 
             (this.username!=null &&
              this.username.equals(other.getUsername()))) &&
            ((this.password==null && other.getPassword()==null) || 
             (this.password!=null &&
              this.password.equals(other.getPassword()))) &&
            ((this.mainTel==null && other.getMainTel()==null) || 
             (this.mainTel!=null &&
              this.mainTel.equals(other.getMainTel()))) &&
            ((this.viceTel==null && other.getViceTel()==null) || 
             (this.viceTel!=null &&
              this.viceTel.equals(other.getViceTel()))) &&
            ((this.mobile==null && other.getMobile()==null) || 
             (this.mobile!=null &&
              this.mobile.equals(other.getMobile()))) &&
            ((this.fax==null && other.getFax()==null) || 
             (this.fax!=null &&
              this.fax.equals(other.getFax()))) &&
            ((this.email==null && other.getEmail()==null) || 
             (this.email!=null &&
              this.email.equals(other.getEmail()))) &&
            this.grade == other.getGrade() &&
            ((this.userType==null && other.getUserType()==null) || 
             (this.userType!=null &&
              this.userType.equals(other.getUserType()))) &&
            ((this.showname==null && other.getShowname()==null) || 
             (this.showname!=null &&
              this.showname.equals(other.getShowname()))) &&
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
        _hashCode += getCenterId();
        if (getUsername() != null) {
            _hashCode += getUsername().hashCode();
        }
        if (getPassword() != null) {
            _hashCode += getPassword().hashCode();
        }
        if (getMainTel() != null) {
            _hashCode += getMainTel().hashCode();
        }
        if (getViceTel() != null) {
            _hashCode += getViceTel().hashCode();
        }
        if (getMobile() != null) {
            _hashCode += getMobile().hashCode();
        }
        if (getFax() != null) {
            _hashCode += getFax().hashCode();
        }
        if (getEmail() != null) {
            _hashCode += getEmail().hashCode();
        }
        _hashCode += getGrade();
        if (getUserType() != null) {
            _hashCode += getUserType().hashCode();
        }
        if (getShowname() != null) {
            _hashCode += getShowname().hashCode();
        }
        if (getRemark() != null) {
            _hashCode += getRemark().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(Dispatcher.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "Dispatcher"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("centerId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "centerId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("mainTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "mainTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("viceTel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "viceTel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("mobile");
        elemField.setXmlName(new javax.xml.namespace.QName("", "mobile"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("fax");
        elemField.setXmlName(new javax.xml.namespace.QName("", "fax"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("email");
        elemField.setXmlName(new javax.xml.namespace.QName("", "email"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("grade");
        elemField.setXmlName(new javax.xml.namespace.QName("", "grade"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("userType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "userType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("showname");
        elemField.setXmlName(new javax.xml.namespace.QName("", "showname"));
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
