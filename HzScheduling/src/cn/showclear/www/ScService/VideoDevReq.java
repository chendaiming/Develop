/**
 * VideoDevReq.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public class VideoDevReq  implements java.io.Serializable {
    private cn.showclear.www.ScService.VideoDev videoDev;

    public VideoDevReq() {
    }

    public VideoDevReq(
           cn.showclear.www.ScService.VideoDev videoDev) {
           this.videoDev = videoDev;
    }


    /**
     * Gets the videoDev value for this VideoDevReq.
     * 
     * @return videoDev
     */
    public cn.showclear.www.ScService.VideoDev getVideoDev() {
        return videoDev;
    }


    /**
     * Sets the videoDev value for this VideoDevReq.
     * 
     * @param videoDev
     */
    public void setVideoDev(cn.showclear.www.ScService.VideoDev videoDev) {
        this.videoDev = videoDev;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof VideoDevReq)) return false;
        VideoDevReq other = (VideoDevReq) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.videoDev==null && other.getVideoDev()==null) || 
             (this.videoDev!=null &&
              this.videoDev.equals(other.getVideoDev())));
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
        if (getVideoDev() != null) {
            _hashCode += getVideoDev().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(VideoDevReq.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", ">VideoDevReq"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("videoDev");
        elemField.setXmlName(new javax.xml.namespace.QName("", "videoDev"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.showclear.cn/ScService/", "VideoDev"));
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
