/**
 * CalloutRecord.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.VoiceService;

public class CalloutRecord  implements java.io.Serializable {
    private int id;

    private java.lang.String caller;

    private java.lang.String called;

    private java.lang.String tmCall;

    private java.lang.String result;

    public CalloutRecord() {
    }

    public CalloutRecord(
           int id,
           java.lang.String caller,
           java.lang.String called,
           java.lang.String tmCall,
           java.lang.String result) {
           this.id = id;
           this.caller = caller;
           this.called = called;
           this.tmCall = tmCall;
           this.result = result;
    }


    /**
     * Gets the id value for this CalloutRecord.
     * 
     * @return id
     */
    public int getId() {
        return id;
    }


    /**
     * Sets the id value for this CalloutRecord.
     * 
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * Gets the caller value for this CalloutRecord.
     * 
     * @return caller
     */
    public java.lang.String getCaller() {
        return caller;
    }


    /**
     * Sets the caller value for this CalloutRecord.
     * 
     * @param caller
     */
    public void setCaller(java.lang.String caller) {
        this.caller = caller;
    }


    /**
     * Gets the called value for this CalloutRecord.
     * 
     * @return called
     */
    public java.lang.String getCalled() {
        return called;
    }


    /**
     * Sets the called value for this CalloutRecord.
     * 
     * @param called
     */
    public void setCalled(java.lang.String called) {
        this.called = called;
    }


    /**
     * Gets the tmCall value for this CalloutRecord.
     * 
     * @return tmCall
     */
    public java.lang.String getTmCall() {
        return tmCall;
    }


    /**
     * Sets the tmCall value for this CalloutRecord.
     * 
     * @param tmCall
     */
    public void setTmCall(java.lang.String tmCall) {
        this.tmCall = tmCall;
    }


    /**
     * Gets the result value for this CalloutRecord.
     * 
     * @return result
     */
    public java.lang.String getResult() {
        return result;
    }


    /**
     * Sets the result value for this CalloutRecord.
     * 
     * @param result
     */
    public void setResult(java.lang.String result) {
        this.result = result;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CalloutRecord)) return false;
        CalloutRecord other = (CalloutRecord) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.id == other.getId() &&
            ((this.caller==null && other.getCaller()==null) || 
             (this.caller!=null &&
              this.caller.equals(other.getCaller()))) &&
            ((this.called==null && other.getCalled()==null) || 
             (this.called!=null &&
              this.called.equals(other.getCalled()))) &&
            ((this.tmCall==null && other.getTmCall()==null) || 
             (this.tmCall!=null &&
              this.tmCall.equals(other.getTmCall()))) &&
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
        if (getCaller() != null) {
            _hashCode += getCaller().hashCode();
        }
        if (getCalled() != null) {
            _hashCode += getCalled().hashCode();
        }
        if (getTmCall() != null) {
            _hashCode += getTmCall().hashCode();
        }
        if (getResult() != null) {
            _hashCode += getResult().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CalloutRecord.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/VoiceService/", "CalloutRecord"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("id");
        elemField.setXmlName(new javax.xml.namespace.QName("", "id"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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
        elemField.setFieldName("tmCall");
        elemField.setXmlName(new javax.xml.namespace.QName("", "tmCall"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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
