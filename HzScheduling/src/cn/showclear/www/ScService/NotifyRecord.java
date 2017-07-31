/**
 * NotifyRecord.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class NotifyRecord  implements java.io.Serializable {
    private int id;

    private java.lang.String tel;

    private java.lang.String tag;

    private java.lang.String tm;

    private java.lang.Integer length;

    private java.lang.String file;

    private java.lang.String type;

    private java.lang.String ext;

    public NotifyRecord() {
    }

    public NotifyRecord(
           int id,
           java.lang.String tel,
           java.lang.String tag,
           java.lang.String tm,
           java.lang.Integer length,
           java.lang.String file,
           java.lang.String type,
           java.lang.String ext) {
           this.id = id;
           this.tel = tel;
           this.tag = tag;
           this.tm = tm;
           this.length = length;
           this.file = file;
           this.type = type;
           this.ext = ext;
    }


    /**
     * Gets the id value for this NotifyRecord.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this NotifyRecord.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the tel value for this NotifyRecord.
     * 
     * @return tel
     */
    public java.lang.String getTel() {
        return tel;
    }


    /**
     * Sets the tel value for this NotifyRecord.
     * 
     * @param tel
     */
    public void setTel(java.lang.String tel) {
        this.tel = tel;
    }


    /**
     * Gets the tag value for this NotifyRecord.
     * 
     * @return tag
     */
    public java.lang.String getTag() {
        return tag;
    }


    /**
     * Sets the tag value for this NotifyRecord.
     * 
     * @param tag
     */
    public void setTag(java.lang.String tag) {
        this.tag = tag;
    }


    /**
     * Gets the tm value for this NotifyRecord.
     * 
     * @return tm
     */
    public java.lang.String getTm() {
        return tm;
    }


    /**
     * Sets the tm value for this NotifyRecord.
     * 
     * @param tm
     */
    public void setTm(java.lang.String tm) {
        this.tm = tm;
    }


    /**
     * Gets the length value for this NotifyRecord.
     * 
     * @return length
     */
    public java.lang.Integer getLength() {
        return length;
    }


    /**
     * Sets the length value for this NotifyRecord.
     * 
     * @param length
     */
    public void setLength(java.lang.Integer length) {
        this.length = length;
    }


    /**
     * Gets the file value for this NotifyRecord.
     * 
     * @return file
     */
    public java.lang.String getFile() {
        return file;
    }


    /**
     * Sets the file value for this NotifyRecord.
     * 
     * @param file
     */
    public void setFile(java.lang.String file) {
        this.file = file;
    }


    /**
     * Gets the type value for this NotifyRecord.
     * 
     * @return type
     */
    public java.lang.String getType() {
        return type;
    }


    /**
     * Sets the type value for this NotifyRecord.
     * 
     * @param type
     */
    public void setType(java.lang.String type) {
        this.type = type;
    }


    /**
     * Gets the ext value for this NotifyRecord.
     * 
     * @return ext
     */
    public java.lang.String getExt() {
        return ext;
    }


    /**
     * Sets the ext value for this NotifyRecord.
     * 
     * @param ext
     */
    public void setExt(java.lang.String ext) {
        this.ext = ext;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof NotifyRecord)) return false;
        NotifyRecord other = (NotifyRecord) obj;
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
            ((this.tag==null && other.getTag()==null) || 
             (this.tag!=null &&
              this.tag.equals(other.getTag()))) &&
            ((this.tm==null && other.getTm()==null) || 
             (this.tm!=null &&
              this.tm.equals(other.getTm()))) &&
            ((this.length==null && other.getLength()==null) || 
             (this.length!=null &&
              this.length.equals(other.getLength()))) &&
            ((this.file==null && other.getFile()==null) || 
             (this.file!=null &&
              this.file.equals(other.getFile()))) &&
            ((this.type==null && other.getType()==null) || 
             (this.type!=null &&
              this.type.equals(other.getType()))) &&
            ((this.ext==null && other.getExt()==null) || 
             (this.ext!=null &&
              this.ext.equals(other.getExt())));
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
        if (getTag() != null) {
            _hashCode += getTag().hashCode();
        }
        if (getTm() != null) {
            _hashCode += getTm().hashCode();
        }
        if (getLength() != null) {
            _hashCode += getLength().hashCode();
        }
        if (getFile() != null) {
            _hashCode += getFile().hashCode();
        }
        if (getType() != null) {
            _hashCode += getType().hashCode();
        }
        if (getExt() != null) {
            _hashCode += getExt().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(NotifyRecord.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "NotifyRecord"));
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
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tag");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tag"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tm");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tm"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("length");
        elemField.setXmlName(new javax.xml.namespace.QName("", "length"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("file");
        elemField.setXmlName(new javax.xml.namespace.QName("", "file"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("type");
        elemField.setXmlName(new javax.xml.namespace.QName("", "type"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("ext");
        elemField.setXmlName(new javax.xml.namespace.QName("", "ext"));
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
