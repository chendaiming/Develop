/**
 * OrgMember.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class OrgMember  implements java.io.Serializable {
    private int id;

    private int groupId;

    private java.lang.String name;

    private java.lang.String tel;

    private int telType;

    private java.lang.String mobile;

    private java.lang.String fax;

    private java.lang.String email;

    private int grade;

    private java.lang.String duty;

    private java.lang.String picture;

    private java.lang.String gis;

    private java.lang.String videoMonitor;

    private java.lang.String videoImgKey;

    private java.lang.String remark;

    private java.lang.String[] otherTels;

    private java.lang.Integer index;

    private java.lang.Integer photoType;

    private byte[] photoContent;

    public OrgMember() {
    }

    public OrgMember(
           int id,
           int groupId,
           java.lang.String name,
           java.lang.String tel,
           int telType,
           java.lang.String mobile,
           java.lang.String fax,
           java.lang.String email,
           int grade,
           java.lang.String duty,
           java.lang.String picture,
           java.lang.String gis,
           java.lang.String videoMonitor,
           java.lang.String videoImgKey,
           java.lang.String remark,
           java.lang.String[] otherTels,
           java.lang.Integer index,
           java.lang.Integer photoType,
           byte[] photoContent) {
           this.id = id;
           this.groupId = groupId;
           this.name = name;
           this.tel = tel;
           this.telType = telType;
           this.mobile = mobile;
           this.fax = fax;
           this.email = email;
           this.grade = grade;
           this.duty = duty;
           this.picture = picture;
           this.gis = gis;
           this.videoMonitor = videoMonitor;
           this.videoImgKey = videoImgKey;
           this.remark = remark;
           this.otherTels = otherTels;
           this.index = index;
           this.photoType = photoType;
           this.photoContent = photoContent;
    }


    /**
     * Gets the id value for this OrgMember.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this OrgMember.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the groupId value for this OrgMember.
     * 
     * @return groupId
     */
    public int getGroupId() {
        return groupId;
    }


    /**
     * Sets the groupId value for this OrgMember.
     * 
     * @param groupId
     */
    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }


    /**
     * Gets the name value for this OrgMember.
     * 
     * @return name
     */
    public java.lang.String getName() {
        return name;
    }


    /**
     * Sets the name value for this OrgMember.
     * 
     * @param name
     */
    public void setName(java.lang.String name) {
        this.name = name;
    }


    /**
     * Gets the tel value for this OrgMember.
     * 
     * @return tel
     */
    public java.lang.String getTel() {
        return tel;
    }


    /**
     * Sets the tel value for this OrgMember.
     * 
     * @param tel
     */
    public void setTel(java.lang.String tel) {
        this.tel = tel;
    }


    /**
     * Gets the telType value for this OrgMember.
     * 
     * @return telType
     */
    public int getTelType() {
        return telType;
    }


    /**
     * Sets the telType value for this OrgMember.
     * 
     * @param telType
     */
    public void setTelType(int telType) {
        this.telType = telType;
    }


    /**
     * Gets the mobile value for this OrgMember.
     * 
     * @return mobile
     */
    public java.lang.String getMobile() {
        return mobile;
    }


    /**
     * Sets the mobile value for this OrgMember.
     * 
     * @param mobile
     */
    public void setMobile(java.lang.String mobile) {
        this.mobile = mobile;
    }


    /**
     * Gets the fax value for this OrgMember.
     * 
     * @return fax
     */
    public java.lang.String getFax() {
        return fax;
    }


    /**
     * Sets the fax value for this OrgMember.
     * 
     * @param fax
     */
    public void setFax(java.lang.String fax) {
        this.fax = fax;
    }


    /**
     * Gets the email value for this OrgMember.
     * 
     * @return email
     */
    public java.lang.String getEmail() {
        return email;
    }


    /**
     * Sets the email value for this OrgMember.
     * 
     * @param email
     */
    public void setEmail(java.lang.String email) {
        this.email = email;
    }


    /**
     * Gets the grade value for this OrgMember.
     * 
     * @return grade
     */
    public int getGrade() {
        return grade;
    }


    /**
     * Sets the grade value for this OrgMember.
     * 
     * @param grade
     */
    public void setGrade(int grade) {
        this.grade = grade;
    }


    /**
     * Gets the duty value for this OrgMember.
     * 
     * @return duty
     */
    public java.lang.String getDuty() {
        return duty;
    }


    /**
     * Sets the duty value for this OrgMember.
     * 
     * @param duty
     */
    public void setDuty(java.lang.String duty) {
        this.duty = duty;
    }


    /**
     * Gets the picture value for this OrgMember.
     * 
     * @return picture
     */
    public java.lang.String getPicture() {
        return picture;
    }


    /**
     * Sets the picture value for this OrgMember.
     * 
     * @param picture
     */
    public void setPicture(java.lang.String picture) {
        this.picture = picture;
    }


    /**
     * Gets the gis value for this OrgMember.
     * 
     * @return gis
     */
    public java.lang.String getGis() {
        return gis;
    }


    /**
     * Sets the gis value for this OrgMember.
     * 
     * @param gis
     */
    public void setGis(java.lang.String gis) {
        this.gis = gis;
    }


    /**
     * Gets the videoMonitor value for this OrgMember.
     * 
     * @return videoMonitor
     */
    public java.lang.String getVideoMonitor() {
        return videoMonitor;
    }


    /**
     * Sets the videoMonitor value for this OrgMember.
     * 
     * @param videoMonitor
     */
    public void setVideoMonitor(java.lang.String videoMonitor) {
        this.videoMonitor = videoMonitor;
    }


    /**
     * Gets the videoImgKey value for this OrgMember.
     * 
     * @return videoImgKey
     */
    public java.lang.String getVideoImgKey() {
        return videoImgKey;
    }


    /**
     * Sets the videoImgKey value for this OrgMember.
     * 
     * @param videoImgKey
     */
    public void setVideoImgKey(java.lang.String videoImgKey) {
        this.videoImgKey = videoImgKey;
    }


    /**
     * Gets the remark value for this OrgMember.
     * 
     * @return remark
     */
    public java.lang.String getRemark() {
        return remark;
    }


    /**
     * Sets the remark value for this OrgMember.
     * 
     * @param remark
     */
    public void setRemark(java.lang.String remark) {
        this.remark = remark;
    }


    /**
     * Gets the otherTels value for this OrgMember.
     * 
     * @return otherTels
     */
    public java.lang.String[] getOtherTels() {
        return otherTels;
    }


    /**
     * Sets the otherTels value for this OrgMember.
     * 
     * @param otherTels
     */
    public void setOtherTels(java.lang.String[] otherTels) {
        this.otherTels = otherTels;
    }

    public java.lang.String getOtherTels(int i) {
        return this.otherTels[i];
    }

    public void setOtherTels(int i, java.lang.String _value) {
        this.otherTels[i] = _value;
    }


    /**
     * Gets the index value for this OrgMember.
     * 
     * @return index
     */
    public java.lang.Integer getIndex() {
        return index;
    }


    /**
     * Sets the index value for this OrgMember.
     * 
     * @param index
     */
    public void setIndex(java.lang.Integer index) {
        this.index = index;
    }


    /**
     * Gets the photoType value for this OrgMember.
     * 
     * @return photoType
     */
    public java.lang.Integer getPhotoType() {
        return photoType;
    }


    /**
     * Sets the photoType value for this OrgMember.
     * 
     * @param photoType
     */
    public void setPhotoType(java.lang.Integer photoType) {
        this.photoType = photoType;
    }


    /**
     * Gets the photoContent value for this OrgMember.
     * 
     * @return photoContent
     */
    public byte[] getPhotoContent() {
        return photoContent;
    }


    /**
     * Sets the photoContent value for this OrgMember.
     * 
     * @param photoContent
     */
    public void setPhotoContent(byte[] photoContent) {
        this.photoContent = photoContent;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof OrgMember)) return false;
        OrgMember other = (OrgMember) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            this.groupId == other.getGroupId() &&
            ((this.name==null && other.getName()==null) || 
             (this.name!=null &&
              this.name.equals(other.getName()))) &&
            ((this.tel==null && other.getTel()==null) || 
             (this.tel!=null &&
              this.tel.equals(other.getTel()))) &&
            this.telType == other.getTelType() &&
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
            ((this.duty==null && other.getDuty()==null) || 
             (this.duty!=null &&
              this.duty.equals(other.getDuty()))) &&
            ((this.picture==null && other.getPicture()==null) || 
             (this.picture!=null &&
              this.picture.equals(other.getPicture()))) &&
            ((this.gis==null && other.getGis()==null) || 
             (this.gis!=null &&
              this.gis.equals(other.getGis()))) &&
            ((this.videoMonitor==null && other.getVideoMonitor()==null) || 
             (this.videoMonitor!=null &&
              this.videoMonitor.equals(other.getVideoMonitor()))) &&
            ((this.videoImgKey==null && other.getVideoImgKey()==null) || 
             (this.videoImgKey!=null &&
              this.videoImgKey.equals(other.getVideoImgKey()))) &&
            ((this.remark==null && other.getRemark()==null) || 
             (this.remark!=null &&
              this.remark.equals(other.getRemark()))) &&
            ((this.otherTels==null && other.getOtherTels()==null) || 
             (this.otherTels!=null &&
              java.util.Arrays.equals(this.otherTels, other.getOtherTels()))) &&
            ((this.index==null && other.getIndex()==null) || 
             (this.index!=null &&
              this.index.equals(other.getIndex()))) &&
            ((this.photoType==null && other.getPhotoType()==null) || 
             (this.photoType!=null &&
              this.photoType.equals(other.getPhotoType()))) &&
            ((this.photoContent==null && other.getPhotoContent()==null) || 
             (this.photoContent!=null &&
              java.util.Arrays.equals(this.photoContent, other.getPhotoContent())));
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
        _hashCode += getGroupId();
        if (getName() != null) {
            _hashCode += getName().hashCode();
        }
        if (getTel() != null) {
            _hashCode += getTel().hashCode();
        }
        _hashCode += getTelType();
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
        if (getDuty() != null) {
            _hashCode += getDuty().hashCode();
        }
        if (getPicture() != null) {
            _hashCode += getPicture().hashCode();
        }
        if (getGis() != null) {
            _hashCode += getGis().hashCode();
        }
        if (getVideoMonitor() != null) {
            _hashCode += getVideoMonitor().hashCode();
        }
        if (getVideoImgKey() != null) {
            _hashCode += getVideoImgKey().hashCode();
        }
        if (getRemark() != null) {
            _hashCode += getRemark().hashCode();
        }
        if (getOtherTels() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getOtherTels());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getOtherTels(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        if (getIndex() != null) {
            _hashCode += getIndex().hashCode();
        }
        if (getPhotoType() != null) {
            _hashCode += getPhotoType().hashCode();
        }
        if (getPhotoContent() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getPhotoContent());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getPhotoContent(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(OrgMember.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "OrgMember"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("groupId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "groupId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("name");
        elemField.setXmlName(new javax.xml.namespace.QName("", "name"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tel");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("telType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "telType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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
        elemField.setFieldName("duty");
        elemField.setXmlName(new javax.xml.namespace.QName("", "duty"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("picture");
        elemField.setXmlName(new javax.xml.namespace.QName("", "picture"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("gis");
        elemField.setXmlName(new javax.xml.namespace.QName("", "gis"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("videoMonitor");
        elemField.setXmlName(new javax.xml.namespace.QName("", "videoMonitor"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("videoImgKey");
        elemField.setXmlName(new javax.xml.namespace.QName("", "videoImgKey"));
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
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("otherTels");
        elemField.setXmlName(new javax.xml.namespace.QName("", "otherTels"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("index");
        elemField.setXmlName(new javax.xml.namespace.QName("", "index"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("photoType");
        elemField.setXmlName(new javax.xml.namespace.QName("", "photoType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("photoContent");
        elemField.setXmlName(new javax.xml.namespace.QName("", "photoContent"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "base64Binary"));
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
