/**
 * NotifyResult.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class NotifyResult  implements java.io.Serializable {
    private int id;

    private java.lang.String notifyId;

    private java.lang.String caller;

    private java.lang.String called;

    private java.lang.String tmNotify;

    private java.lang.String tmAnswer;

    private java.lang.String tmHangup;

    private java.lang.Integer tmLen;

    private java.lang.String notifyFile;

    private java.lang.String result;

    public NotifyResult() {
    }

    public NotifyResult(
           int id,
           java.lang.String notifyId,
           java.lang.String caller,
           java.lang.String called,
           java.lang.String tmNotify,
           java.lang.String tmAnswer,
           java.lang.String tmHangup,
           java.lang.Integer tmLen,
           java.lang.String notifyFile,
           java.lang.String result) {
           this.id = id;
           this.notifyId = notifyId;
           this.caller = caller;
           this.called = called;
           this.tmNotify = tmNotify;
           this.tmAnswer = tmAnswer;
           this.tmHangup = tmHangup;
           this.tmLen = tmLen;
           this.notifyFile = notifyFile;
           this.result = result;
    }


    /**
     * Gets the id value for this NotifyResult.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this NotifyResult.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the notifyId value for this NotifyResult.
     * 
     * @return notifyId
     */
    public java.lang.String getNotifyId() {
        return notifyId;
    }


    /**
     * Sets the notifyId value for this NotifyResult.
     * 
     * @param notifyId
     */
    public void setNotifyId(java.lang.String notifyId) {
        this.notifyId = notifyId;
    }


    /**
     * Gets the caller value for this NotifyResult.
     * 
     * @return caller
     */
    public java.lang.String getCaller() {
        return caller;
    }


    /**
     * Sets the caller value for this NotifyResult.
     * 
     * @param caller
     */
    public void setCaller(java.lang.String caller) {
        this.caller = caller;
    }


    /**
     * Gets the called value for this NotifyResult.
     * 
     * @return called
     */
    public java.lang.String getCalled() {
        return called;
    }


    /**
     * Sets the called value for this NotifyResult.
     * 
     * @param called
     */
    public void setCalled(java.lang.String called) {
        this.called = called;
    }


    /**
     * Gets the tmNotify value for this NotifyResult.
     * 
     * @return tmNotify
     */
    public java.lang.String getTmNotify() {
        return tmNotify;
    }


    /**
     * Sets the tmNotify value for this NotifyResult.
     * 
     * @param tmNotify
     */
    public void setTmNotify(java.lang.String tmNotify) {
        this.tmNotify = tmNotify;
    }


    /**
     * Gets the tmAnswer value for this NotifyResult.
     * 
     * @return tmAnswer
     */
    public java.lang.String getTmAnswer() {
        return tmAnswer;
    }


    /**
     * Sets the tmAnswer value for this NotifyResult.
     * 
     * @param tmAnswer
     */
    public void setTmAnswer(java.lang.String tmAnswer) {
        this.tmAnswer = tmAnswer;
    }


    /**
     * Gets the tmHangup value for this NotifyResult.
     * 
     * @return tmHangup
     */
    public java.lang.String getTmHangup() {
        return tmHangup;
    }


    /**
     * Sets the tmHangup value for this NotifyResult.
     * 
     * @param tmHangup
     */
    public void setTmHangup(java.lang.String tmHangup) {
        this.tmHangup = tmHangup;
    }


    /**
     * Gets the tmLen value for this NotifyResult.
     * 
     * @return tmLen
     */
    public java.lang.Integer getTmLen() {
        return tmLen;
    }


    /**
     * Sets the tmLen value for this NotifyResult.
     * 
     * @param tmLen
     */
    public void setTmLen(java.lang.Integer tmLen) {
        this.tmLen = tmLen;
    }


    /**
     * Gets the notifyFile value for this NotifyResult.
     * 
     * @return notifyFile
     */
    public java.lang.String getNotifyFile() {
        return notifyFile;
    }


    /**
     * Sets the notifyFile value for this NotifyResult.
     * 
     * @param notifyFile
     */
    public void setNotifyFile(java.lang.String notifyFile) {
        this.notifyFile = notifyFile;
    }


    /**
     * Gets the result value for this NotifyResult.
     * 
     * @return result
     */
    public java.lang.String getResult() {
        return result;
    }


    /**
     * Sets the result value for this NotifyResult.
     * 
     * @param result
     */
    public void setResult(java.lang.String result) {
        this.result = result;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof NotifyResult)) return false;
        NotifyResult other = (NotifyResult) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.notifyId==null && other.getNotifyId()==null) || 
             (this.notifyId!=null &&
              this.notifyId.equals(other.getNotifyId()))) &&
            ((this.caller==null && other.getCaller()==null) || 
             (this.caller!=null &&
              this.caller.equals(other.getCaller()))) &&
            ((this.called==null && other.getCalled()==null) || 
             (this.called!=null &&
              this.called.equals(other.getCalled()))) &&
            ((this.tmNotify==null && other.getTmNotify()==null) || 
             (this.tmNotify!=null &&
              this.tmNotify.equals(other.getTmNotify()))) &&
            ((this.tmAnswer==null && other.getTmAnswer()==null) || 
             (this.tmAnswer!=null &&
              this.tmAnswer.equals(other.getTmAnswer()))) &&
            ((this.tmHangup==null && other.getTmHangup()==null) || 
             (this.tmHangup!=null &&
              this.tmHangup.equals(other.getTmHangup()))) &&
            ((this.tmLen==null && other.getTmLen()==null) || 
             (this.tmLen!=null &&
              this.tmLen.equals(other.getTmLen()))) &&
            ((this.notifyFile==null && other.getNotifyFile()==null) || 
             (this.notifyFile!=null &&
              this.notifyFile.equals(other.getNotifyFile()))) &&
            ((this.result==null && other.getResult()==null) || 
             (this.result!=null &&
              this.result.equals(other.getResult())));
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
        if (getNotifyId() != null) {
            _hashCode += getNotifyId().hashCode();
        }
        if (getCaller() != null) {
            _hashCode += getCaller().hashCode();
        }
        if (getCalled() != null) {
            _hashCode += getCalled().hashCode();
        }
        if (getTmNotify() != null) {
            _hashCode += getTmNotify().hashCode();
        }
        if (getTmAnswer() != null) {
            _hashCode += getTmAnswer().hashCode();
        }
        if (getTmHangup() != null) {
            _hashCode += getTmHangup().hashCode();
        }
        if (getTmLen() != null) {
            _hashCode += getTmLen().hashCode();
        }
        if (getNotifyFile() != null) {
            _hashCode += getNotifyFile().hashCode();
        }
        if (getResult() != null) {
            _hashCode += getResult().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(NotifyResult.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "NotifyResult"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("notifyId");
        elemField.setXmlName(new javax.xml.namespace.QName("", "notifyId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("caller");
        elemField.setXmlName(new javax.xml.namespace.QName("", "caller"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("called");
        elemField.setXmlName(new javax.xml.namespace.QName("", "called"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tmNotify");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tmNotify"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tmAnswer");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tmAnswer"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tmHangup");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tmHangup"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tmLen");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tmLen"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("notifyFile");
        elemField.setXmlName(new javax.xml.namespace.QName("", "notifyFile"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("result");
        elemField.setXmlName(new javax.xml.namespace.QName("", "result"));
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
